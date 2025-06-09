import { getAuth } from "firebase/auth";
import {
    setDoc,
    updateDoc,
    addDoc,
    deleteDoc,
    DocumentReference,
    CollectionReference,
    SetOptions,
    getDoc
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const auth = getAuth();

/**
 * Middleware para garantir que `updatedBy` seja sempre incluído nas operações de escrita no Firestore
 */
export async function secureSetDoc(
  ref: DocumentReference,
  data: unknown,
  options?: SetOptions
) {
  if (typeof data !== "object" || data === null) {
    throw new Error("O argumento 'data' deve ser um objeto válido.");
  }

  const dataWithUpdatedBy = {
    ...(data as object),
    updatedBy: auth.currentUser?.uid,
  };

  return options
    ? setDoc(ref, dataWithUpdatedBy, options)
    : setDoc(ref, dataWithUpdatedBy);
}

export async function secureUpdateDoc(ref: DocumentReference, data: unknown) {
  if (typeof data !== "object" || data === null) {
    throw new Error("O argumento 'data' deve ser um objeto válido.");
  }
  return updateDoc(ref, {
    ...(data as object),
    updatedBy: auth.currentUser?.uid,
  });
}

export async function secureAddDoc(ref: CollectionReference, data: unknown) {
  if (typeof data !== "object" || data === null) {
    throw new Error("O argumento 'data' deve ser um objeto válido.");
  }
  return addDoc(ref, { ...(data as object), updatedBy: auth.currentUser?.uid });
}

export async function secureDeleteDoc(ref: DocumentReference) {
  const docSnap = await getDoc(ref);

  if (!docSnap.exists()) {
    throw new Error("Documento não encontrado.");
  }

  const deletedData = docSnap.data();
  const deletedBy = auth.currentUser?.uid || "desconhecido"; // Captura o usuário autenticado

  // Chama a função do Firebase para criar o log
  const functions = getFunctions();
  const createLog = httpsCallable(functions, "createLogDelete");
  await createLog({
    entity: ref.parent.id,
    entityId: ref.id,
    changedBy: deletedBy,
    changes: deletedData,
    action: "delete",
  });

  // Agora, deleta o documento
  return deleteDoc(ref);
}
