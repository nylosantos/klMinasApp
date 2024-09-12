import { toast } from "react-toastify";
import { AiOutlineGoogle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { AppUsersSearchProps, ButtonSignProps } from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function ButtonSignInGoogle({
  isSubmitting,
  isClosed = false,
  signType,
}: ButtonSignProps) {
  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // FIREBASE AUTH PROVIDER
  const googleProvider = new GoogleAuthProvider();

  // SIGN IN WITH GOOGLE FUNCTION
  const handleSignInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider).catch(() => {
      toast.error(
        `Não foi possível com Google? Tente com seu usuário e senha...`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    });
    if (result) {
      // CREATE USER ON FIRESTORE TO CREATE APP ACCESS LEVELS
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", result.user.uid));
      const querySnapshot = await getDocs(q);
      const promises: AppUsersSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as AppUsersSearchProps;
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        // IF USER NOT EXISTS, CREATE
        if (results.length === 0) {
          // ADD USER WITH GOOGLE SIGN IN FUNCTION
          const addUser = async () => {
            try {
              const commonId = result.user.uid;
              await setDoc(doc(db, "appUsers", commonId), {
                id: commonId,
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
                phone: result.user.phoneNumber,
                role: "user",
                timestamp: serverTimestamp(),
              });
            } catch (error) {
              console.log("ESSE É O ERROR", error);
              toast.error(`Ocorreu um erro... 🤯`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              });
            }
          };
          addUser();
        }
      });
    } else return;
  };
  return (
    // LOGIN WITH GOOGLE BUTTON
    <button
      type="button"
      disabled={isClosed ? true : isSubmitting}
      className="flex w-full px-4 py-2 gap-4 items-center justify-center border rounded-3xl border-red-900/10 bg-red-600 disabled:bg-red-600/70 disabled:dark:bg-red-600/70 disabled:border-red-900/10 font-bold text-sm text-white disabled:dark:text-white/50 uppercase"
      onClick={handleSignInWithGoogle}
    >
      {/* BUTTON ICON */}
      <AiOutlineGoogle size={24} />
      {/* BUTTON TITLE */}
      {!isSubmitting
        ? signType === "signIn"
          ? // IF SIGN IN
            "Entrar com conta Google"
          : // IF SIGN UP
            "Se registrar com conta Google"
        : signType === "signIn"
        ? // SUBMITTING SIGN IN
          "Entrando com conta Google"
        : // SUBMITTING SIGN UP
          "Registrando com conta Google"}
    </button>
  );
}
