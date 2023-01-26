import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineGoogle } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dna } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { LoginWithEmailAndPasswordZProps, UserFullDataProps } from "../@types";
import { loginEmailAndPasswordValidationSchema } from "../@types/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";

import { app, initFirebase } from "../db/Firebase";
import { Header } from "../components/Header";
import { customerFullName } from "../custom";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

const Home = () => {
  // INITIALIZING FIREBASE AND FIREBASE ADMIN
  initFirebase();

  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // USER AUTH STATE
  const [user, loading] = useAuthState(auth);

  // ROUTING USER
  const router = useRouter();

  // USER DATA STATE
  const [userFullData, setUserFullData] = useState<UserFullDataProps>();

  // HANDLE USER DATA FUNCTION
  const handleUserFullData = async (user: User | null | undefined) => {
    if (user !== null && user !== undefined) {
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        setUserFullData(results[0]);
      });
    } else
      return (
        console.log("User is undefined..."),
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
  };

  // IF USER IS LOGGED, SEND TO DASHBOARD
  if (user) {
    handleUserFullData(user);
    router.push(
      {
        pathname: "/Dashboard",
        query: { username: userFullData?.name },
      },
      "/Dashboard" // "as" argument
    );
  }

  // LOGIN OR REGISTER STATE
  const [isLogin, setIsLogin] = useState(true);

  // ------------------- USER FIREBASE AUTENTICATION ------------------- //
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
  // ------------------- END OF USER FIREBASE AUTENTICATION ------------------- //

  // ------------------- SIGNIN / SIGNUP WITH EMAIL AND PASSWORD STATES AND FUNCTIONS ------------------- //
  // USER STATE
  const [userLogin, setUserLogin] = useState<LoginWithEmailAndPasswordZProps>({
    name: "",
    email: "",
    password: "",
  });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ERROR NAME STATE
  const [errorName, setErrorName] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LoginWithEmailAndPasswordZProps>({
    resolver: zodResolver(loginEmailAndPasswordValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", userLogin.name);
    setValue("email", userLogin.email);
    setValue("password", userLogin.password);
  }, [userLogin]);

  // RESET FORM FUNCTION
  const resetForm = () => {
    setUserLogin({
      name: "",
      email: "",
      password: "",
    });
    reset();
  };

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
    resetForm();
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

  // SIGN UP WITH EMAIL AND PASSWORD
  const handleSignUpWithEmailAndPassword: SubmitHandler<
    LoginWithEmailAndPasswordZProps
  > = async (data) => {
    // CHECK IF NAME IS FILLED
    if (data.name === "") {
      return setErrorName(true);
    } else {
      setErrorName(false);
    }

    // SIGN UP FUNCTION
    const result = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        // CHECKING IF USER EXISTS ON DATABASE
        const userRef = collection(db, "appUsers");
        const q = query(userRef, where("id", "==", user.uid));
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
                const commonId = user.uid;
                await setDoc(doc(db, "appUsers", commonId), {
                  id: commonId,
                  name: data.name,
                  email: user.email,
                  photo: user.photoURL,
                  phone: user.phoneNumber,
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode === "auth/weak-password") {
          toast.error(`Erro: A senha precisa ter, no mínimo, 6 caracteres...`, {
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
  // ------------------- END OF SIGNIN / SIGNUP WITH EMAIL AND PASSWORD STATES AND FUNCTIONS ------------------- //

  return (
    <div className="text-center flex flex-col gap-5 items-center">
      <Header />
      {loading ? (
        <div className="flex flex-col gap-5 mt-60">
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
          <h1 className="text-xl text-white mb-3">Loading...</h1>
        </div>
      ) : (
        <>
          <ToastContainer limit={2} />
          <h1 className="font-bold text-2xl">
            Sistema de Cadastro - {customerFullName}
          </h1>
          <div className="flex flex-col p-8 gap-6 border border-transparent dark:border-gray-100/30 rounded-3xl bg-gray-700/20 dark:bg-transparent">
            <form
              onSubmit={handleSubmit(
                isLogin
                  ? handleSignInWithEmailAndPassword
                  : handleSignUpWithEmailAndPassword
              )}
              className="flex flex-col w-full gap-8 justify-evenly"
            >
              <h1 className="font-bold text-xl">
                {isLogin ? "Login" : "Criar uma conta"}
              </h1>
              {isLogin ? null : (
                <input
                  type="text"
                  name="name"
                  disabled={isSubmitting}
                  placeholder={
                    errorName ? "É necessário inserir o Nome" : "Nome"
                  }
                  className={
                    errorName
                      ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                      : "w-full px-4 py-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm"
                  }
                  value={userLogin.name}
                  onChange={(e) => {
                    setUserLogin({ ...userLogin, name: e.target.value });
                  }}
                />
              )}
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
                {isLogin
                  ? !isSubmitting
                    ? "Entrar"
                    : "Entrando"
                  : !isSubmitting
                  ? "Criar Conta"
                  : "Criando"}
              </button>
            </form>

            <button
              type="button"
              disabled={isSubmitting}
              className="flex w-full px-4 py-2 gap-4 items-center border rounded-3xl border-red-900/10 bg-red-600 disabled:bg-red-600/70 disabled:dark:bg-red-600/70 disabled:border-red-900/10 font-bold text-sm text-white disabled:dark:text-white/50 uppercase"
              onClick={handleSignInWithGoogle}
            >
              {/* <div className="flex w-full p-2 px-4 gap-4 bg-red-600 items-center text-white rounded-3xl"> */}
              <AiOutlineGoogle size={24} />
              <p>Entrar com conta Google</p>
              {/* </div> */}
            </button>
          </div>
          <p className="flex gap-1 text-sm text-gray-400">
            {isLogin ? "Para criar uma conta" : "Já tem uma conta?"}
            <span
              className="dark:text-white text-gray-500 underline cursor-pointer"
              onClick={() => setIsLogin(isLogin ? false : true)}
            >
              {isLogin ? "clique aqui" : "Clique aqui"}
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
