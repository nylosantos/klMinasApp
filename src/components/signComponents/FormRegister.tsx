/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
import {
  SignUpWithEmailAndPasswordZProps,
  SystemConstantsSearchProps,
  UserFullDataProps,
} from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { ButtonSignSubmit } from "../layoutComponents/ButtonSignSubmit";
import { signUpEmailAndPasswordValidationSchema } from "../../@types/zodValidation";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { formataCPF, testaCPF } from "../../custom";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function FormRegister() {
  // GET GLOBAL DATA
  const {
    auth,
    checkUser,
    isSubmitting,
    systemConstantsDb,
    systemConstantsDbLoading,
    systemConstantsDbError,
    setCheckUser,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

// SYSTEM SIGN UP CLOSED STATE
  const [systemSignUpClosed, setSystemSignUpClosed] = useState(false);

  // GET SYSTEM CONSTANTS DATABASE DATA
  useEffect(() => {
    if (
      systemConstantsDb &&
      !systemConstantsDbLoading &&
      systemConstantsDbError === undefined
    ) {
      const foundedSystemConstants: SystemConstantsSearchProps =
        systemConstantsDb.find(
          (constants) => constants.year === new Date().getFullYear().toString()
        ) as SystemConstantsSearchProps;

        if (foundedSystemConstants) {
        setSystemSignUpClosed(foundedSystemConstants.systemSignUpClosed);
      }
    }
  }, [systemConstantsDb]);

  // USER SIGNUP STATE
  const [userSignUp, setUserSignUp] =
    useState<SignUpWithEmailAndPasswordZProps>({
      name: "",
      email: "",
      document: "",
      password: "",
      confirmPassword: "",
    });

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpWithEmailAndPasswordZProps>({
    resolver: zodResolver(signUpEmailAndPasswordValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      document: "",
      password: "",
      confirmPassword: "",
    },
  });

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", userSignUp.name);
    setValue("email", userSignUp.email);
    setValue("document", userSignUp.document);
    setValue("confirmPassword", userSignUp.confirmPassword);
    setValue("password", userSignUp.password);
  }, [userSignUp]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.document,
      errors.password,
      errors.confirmPassword,
    ];
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

  // SIGN UP WITH EMAIL AND PASSWORD
  const handleSignUpWithEmailAndPassword: SubmitHandler<
    SignUpWithEmailAndPasswordZProps
  > = async (data) => {
    setIsSubmitting(true);
    // SIGN UP FUNCTION
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, { displayName: data.name });
        // CHECKING IF USER EXISTS ON DATABASE
        const userRef = collection(db, "appUsers");
        const q = query(userRef, where("id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const promises: UserFullDataProps[] = [];
        querySnapshot.forEach((doc) => {
          const promise = doc.data() as UserFullDataProps;
          promises.push(promise);
        });
        Promise.all(promises).then((results) => {
          // IF USER NOT EXISTS, CREATE
          if (!results.length) {
            // ADD USER FUNCTION
            const addUser = async () => {
              try {
                await setDoc(doc(db, "appUsers", user.uid), {
                  id: user.uid,
                  name: user.displayName,
                  email: user.email,
                  phone: null,
                  photo: null,
                  document: data.document,
                  role: "user",
                  updatedAt: serverTimestamp(),
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
        // Account Created
        setIsSubmitting(false);
        setCheckUser(!checkUser);
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
          setIsSubmitting(false);
        } else {
          toast.error(`Erro: ${errorMessage}...`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
        }
      });
  };

  return (
    <>
      <div className="flex flex-col w-96 p-8 gap-6 border border-transparent dark:border-gray-100/30 rounded-3xl bg-gray-700/20 dark:bg-transparent">
        {/* SUBMIT LOADING */}
        <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />

        {/* SIGN REGISTER TITLE */}
        <h1 className="font-bold text-xl">Criar uma conta</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(handleSignUpWithEmailAndPassword)}
          className="flex flex-col w-full gap-8 justify-evenly"
        >
          <div className="flex flex-col items-start">
            {/* NAME */}
            <input
              type="text"
              name="name"
              autoComplete="username"
              disabled={systemSignUpClosed ? true : isSubmitting}
              placeholder={errors.name ? "É necessário inserir o Nome" : "Nome"}
              className={
                errors.name
                  ? "w-full px-4 pb-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                  : "w-full px-4 pb-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
              }
              value={userSignUp.name}
              onChange={(e) => {
                setUserSignUp({ ...userSignUp, name: e.target.value });
              }}
            />
          </div>

          {/* E-MAIL */}
          <input
            type="text"
            name="email"
            autoComplete="email"
            disabled={systemSignUpClosed ? true : isSubmitting}
            placeholder={
              errors.email ? "É necessário inserir o E-mail" : "E-mail"
            }
            className={
              errors.email
                ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                : "w-full px-4 pb-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
            }
            value={userSignUp.email}
            onChange={(e) => {
              setUserSignUp({ ...userSignUp, email: e.target.value });
            }}
          />

          {/* FINANCIAL RESPONSIBLE DOCUMENT*/}
          <div className="flex flex-col gap-2 items-center">
            {(!testFinancialCPF || errors.document) && (
              <label
                htmlFor="financialResponsibleDocument"
                className="text-red-500 dark:text-red-400 flex w-full justify-center text-xs text-center -mt-6"
              >
                <span className="text-red-500 dark:text-red-400">
                  CPF Inválido, verifique:
                </span>
              </label>
            )}
            <input
              type="text"
              name="financialResponsibleDocument"
              pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
              maxLength={11}
              placeholder={
                testFinancialCPF
                  ? errors.document
                    ? "É necessário inserir o CPF do Responsável Financeiro"
                    : "Insira o CPF do Responsável Financeiro"
                  : "CPF Inválido"
              }
              className={
                testFinancialCPF
                  ? errors.document
                    ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                    : "w-full px-4 pb-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
                  : "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
              }
              value={userSignUp.document}
              onChange={(e) => {
                if (e.target.value.length === 11) {
                  setTestFinancialCPF(testaCPF(e.target.value));
                }
                setUserSignUp({
                  ...userSignUp,
                  document: formataCPF(e.target.value),
                });
              }}
            />
          </div>

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            disabled={systemSignUpClosed ? true : isSubmitting}
            placeholder={
              errors.password ? "É necessário inserir a Senha" : "Senha"
            }
            className={
              errors.password
                ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                : "w-full px-4 pb-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
            }
            value={userSignUp.password}
            onChange={(e) => {
              setUserSignUp({ ...userSignUp, password: e.target.value });
            }}
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            disabled={systemSignUpClosed ? true : isSubmitting}
            placeholder={
              errors.confirmPassword
                ? "É necessário confirmar a Senha"
                : "Confirme a Senha"
            }
            className={
              errors.confirmPassword
                ? "w-full px-4 py-2 dark:bg-gray-900 border dark:text-gray-100 border-red-600 rounded-3xl placeholder:text-sm"
                : "w-full px-4 pb-2 dark:bg-gray-900 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
            }
            value={userSignUp.confirmPassword}
            onChange={(e) => {
              setUserSignUp({ ...userSignUp, confirmPassword: e.target.value });
            }}
          />

          {/* SUBMIT BUTTON */}
          <ButtonSignSubmit
            isSubmitting={isSubmitting}
            isClosed={systemSignUpClosed}
            signType="signUp"
          />
        </form>

        {/* SIGN UP WITH GOOGLE BUTTON */}

        {/* <ButtonSignInGoogle 
          isSubmitting={isSubmitting}
          isClosed={systemSignUpClosed}
          signType="signUp"
        />*/}
      </div>
    </>
  );
}
