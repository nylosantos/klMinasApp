/* eslint-disable @typescript-eslint/no-explicit-any */
import { https } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";
import { auth, firestore } from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

const app = express();
app.use(cors({ origin: true }));

if (admin.apps.length === 0) {
  admin.initializeApp();
}

// ------------------------- SUAS FUNÇÕES EXISTENTES -------------------------

export const createAppUser = https.onCall(async (data) => {
  return await auth()
    .createUser({
      email: data.email,
      displayName: data.name,
      password: data.password,
      phoneNumber: data.phone,
    })
    .then(async (user) => {
      await firestore()
        .collection("appUsers")
        .doc(user.uid)
        .set({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
          role: data.role,
          document: data.role === "user" ? data.document : "",
          updatedAt: firestore.FieldValue.serverTimestamp(),
          updatedBy: user.uid,
        });
      return user.uid;
    });
});

export const deleteAppUser = https.onCall((data) => {
  const { userSelectedData, userFullDataId } = data;
  const deleteAllPlaces = async () => {
    await auth().deleteUser(userSelectedData.id);
    await firestore().collection("appUsers").doc(userSelectedData.id).delete();
    // Cria o log
    await admin.firestore().collection("logs").add({
      entity: "appUsers",
      entityId: userSelectedData.id,
      changedBy: userFullDataId,
      changes: userSelectedData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      action: "delete",
    });
  };
  return deleteAllPlaces();
});

export const updateAppUserWithoutPassword = https.onCall((data) => {
  const userData = auth()
    .getUser(data.id)
    .then(async (userRecord) => {
      await auth().updateUser(userRecord.uid, {
        email: data.email,
        displayName: data.name,
        phoneNumber: data.phone,
      });
      await firestore()
        .collection("appUsers")
        .doc(data.id)
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          document: data.role === "user" ? data.document : "",
          updatedAt: firestore.FieldValue.serverTimestamp(),
          updatedBy: data.updatedBy,
        });
    });
  return userData;
});

export const updateAppUserWithPassword = https.onCall((data) => {
  const userData = auth()
    .getUser(data.id)
    .then(async (userRecord) => {
      await auth().updateUser(userRecord.uid, {
        email: data.email,
        displayName: data.name,
        phoneNumber: data.phone,
        password: data.password,
      });
      await firestore()
        .collection("appUsers")
        .doc(data.id)
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          document: data.role === "user" ? data.document : "",
          updatedAt: firestore.FieldValue.serverTimestamp(),
          updatedBy: data.updatedBy,
        });
    });
  return userData;
});

export const getAuthUser = https.onCall(async (data) => {
  return await auth()
    .getUser(data)
    .then((userRecord) => {
      return userRecord;
    });
});

// ------------------------- FUNÇÕES DE LOG -------------------------

const db = admin.firestore();
const EXCLUDED_COLLECTIONS = ["counters", "logs"];

// Função para capturar logs de criação
export const logCreate = functions.firestore
  .document("{collection}/{docId}")
  .onCreate(async (snapshot, context) => {
    const { collection, docId } = context.params;
    if (EXCLUDED_COLLECTIONS.includes(collection)) return null;

    const newData = snapshot.data();
    // Captura o ID do usuário que está autenticado
    const createdBy = newData.updatedBy || "desconhecido"; // Se não passar updatedBy, define como "desconhecido"

    await db.collection("logs").add({
      entity: collection,
      entityId: docId,
      changedBy: createdBy,
      changes: newData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      action: "create",
    });

    return null;
  });

export const logUpdate = functions.firestore
  .document("{collection}/{docId}")
  .onUpdate(async (change, context) => {
    const { collection, docId } = context.params;
    if (EXCLUDED_COLLECTIONS.includes(collection)) return null;

    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Se não estiver autenticado, use "desconhecido"
    const updatedBy = afterData.updatedBy || "desconhecido";

    const changes: Record<string, any> = {};
    Object.keys(afterData).forEach((key) => {
      if (JSON.stringify(beforeData[key]) !== JSON.stringify(afterData[key])) {
        changes[key] = { before: beforeData[key], after: afterData[key] };
      }
    });

    if (Object.keys(changes).length === 0) return null;

    await db.collection("logs").add({
      entity: collection,
      entityId: docId,
      changedBy: updatedBy,
      changes,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      action: "update",
    });

    return null;
  });

export const createLogDelete = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Usuário não autenticado"
    );
  }

  const { entity, entityId, changedBy, changes, action } = data;

  // Cria o log
  await admin.firestore().collection("logs").add({
    entity,
    entityId,
    changedBy,
    changes,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    action,
  });

  return { message: "Log criado com sucesso" };
});
