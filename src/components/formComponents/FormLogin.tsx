import { zodResolver } from "@hookform/resolvers/zod";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
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
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineGoogle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import { LoginWithEmailAndPasswordZProps } from "../../@types";
import { loginEmailAndPasswordValidationSchema } from "../../@types/zodValidation";
import { app } from "../../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function FormLogin() {
  // USER LOGIN STATE
  const [userLogin, setUserLogin] = useState<LoginWithEmailAndPasswordZProps>({
    email: "",
    password: "",
  });

  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LoginWithEmailAndPasswordZProps>({
    resolver: zodResolver(loginEmailAndPasswordValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("email", userLogin.email);
    setValue("password", userLogin.password);
  }, [userLogin]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.email, errors.password];
    fullErrors.map((fieldError) => {
      toast.error(fieldError?.message, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    });
  }, [errors]);

  // SIGN IN WITH EMAIL AND PASSWORD
  const handleSignInWithEmailAndPassword: SubmitHandler<
    LoginWithEmailAndPasswordZProps
  > = async (data) => {
    const result = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/user-not-found") {
          toast.error(`Usuário e/ou Senha incorretos ou não encontrados...`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        } else {
          toast.error(`Erro: ${errorMessage}...`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        }
      });
  };

  // FIREBASE AUTH
  const googleProvider = new GoogleAuthProvider();

  // SIGN IN WITH GOOGLE FUNCTION
  const handleSignInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider).catch(
      (error) => {
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
      }
    );
    if (result) {
      // CREATE USER ON FIRESTORE TO CREATE APP ACCESS LEVELS
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", result.user.uid));
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        // IF USER NOT EXISTS, CREATE
        if (results.length === 0) {
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
      console.log(result.user);
    } else return;
  };

  return (
    <>
      <ToastContainer limit={2} />
      <div className="flex flex-col p-8 gap-6 border border-transparent dark:border-gray-100/30 rounded-3xl bg-gray-700/20 dark:bg-transparent">
        <form
          onSubmit={handleSubmit(handleSignInWithEmailAndPassword)}
          className="flex flex-col w-full gap-8 justify-evenly"
        >
          <h1 className="font-bold text-xl">Login</h1>
          <input
            type="text"
            name="email"
            disabled={isSubmitting}
            placeholder={
              errors.email ? "É necessário inserir o E-mail" : "E-mail"
            }
            className={
              errors.email
                ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                : "w-full px-4 py-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm"
            }
            value={userLogin.email}
            onChange={(e) => {
              setUserLogin({ ...userLogin, email: e.target.value });
            }}
          />
          <input
            type="password"
            name="password"
            disabled={isSubmitting}
            placeholder={
              errors.password ? "É necessário inserir a Senha" : "Senha"
            }
            className={
              errors.password
                ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                : "w-full px-4 py-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm"
            }
            value={userLogin.password}
            onChange={(e) => {
              setUserLogin({ ...userLogin, password: e.target.value });
            }}
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 mt-4 border rounded-3xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 font-bold text-sm text-white disabled:dark:text-white/50 uppercase"
          >
            {!isSubmitting ? "Entrar" : "Entrando"}
          </button>
        </form>

        <button
          type="button"
          disabled={isSubmitting}
          className="flex w-full px-4 py-2 gap-4 items-center border rounded-3xl border-red-900/10 bg-red-600 disabled:bg-red-600/70 disabled:dark:bg-red-600/70 disabled:border-red-900/10 font-bold text-sm text-white disabled:dark:text-white/50 uppercase"
          onClick={handleSignInWithGoogle}
        >
          <AiOutlineGoogle size={24} />
          <p>Entrar com conta Google</p>
        </button>
      </div>
    </>
  );
}
