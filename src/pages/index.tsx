import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  updateProfile,
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
import {
  LoginWithEmailAndPasswordZProps,
  SignUpWithEmailAndPasswordZProps,
  UserFullDataProps,
} from "../@types";
import {
  loginEmailAndPasswordValidationSchema,
  signUpEmailAndPasswordValidationSchema,
} from "../@types/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";

import { app, initFirebase } from "../db/Firebase";
import { Header } from "../components/Header";
import { customerFullName } from "../custom";
import { FormLogin } from "../components/formComponents/FormLogin";
import { FormRegister } from "../components/formComponents/FormRegister";

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
          <h1 className="font-bold text-2xl">
            Sistema de Cadastro - {customerFullName}
          </h1>
          {isLogin ? <FormLogin /> : <FormRegister />}
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
