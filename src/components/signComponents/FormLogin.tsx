/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";

import { systemSignInClosed } from "../../custom";
import { LoginWithEmailAndPasswordZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ButtonSignSubmit } from "../layoutComponents/ButtonSignSubmit";
import { ButtonSignInGoogle } from "../layoutComponents/ButtonSignInGoogle";
import { loginEmailAndPasswordValidationSchema } from "../../@types/zodValidation";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

export function FormLogin() {
  // GET GLOBAL DATA
  const { auth, isSubmitting, setIsSubmitting, setLogged } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // USER LOGIN STATE
  const [userLogin, setUserLogin] = useState<LoginWithEmailAndPasswordZProps>({
    email: "",
    password: "",
  });

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
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
    setIsSubmitting(true);
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        setIsSubmitting(false);
        // Signed in
        const user = userCredential.user;
        setLogged(true);
        toast.success(`Bem-vindo, ${user.displayName}! 👌`);
      })
      .catch((error) => {
        setIsSubmitting(false);
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
        }
        if (errorCode === "auth/wrong-password") {
          toast.error(`Usuário e/ou Senha incorretos ou não encontrados...`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        } else {
          toast.error(errorMessage, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <>
      {/* TOAST CONTAINER */}
      <ToastContainer limit={2} />

      <div className="flex flex-col w-96 p-8 gap-6 border border-transparent dark:border-gray-100/30 rounded-3xl bg-klOrange-500/80 dark:bg-transparent">
        {/* SUBMIT LOADING */}
        <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />

        {/* SIGN LOGIN TITLE */}
        <h1 className="font-bold text-xl">Login</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(handleSignInWithEmailAndPassword)}
          className="flex flex-col w-full gap-8 justify-evenly"
        >
          {/* E-MAIL */}
          <input
            type="text"
            name="email"
            disabled={systemSignInClosed ? true : isSubmitting}
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

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            disabled={systemSignInClosed ? true : isSubmitting}
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
          <ButtonSignSubmit
            isSubmitting={isSubmitting}
            signType="signIn"
            isClosed={systemSignInClosed}
          />
        </form>

        {/* SIGN IN WITH GOOGLE BUTTON */}
        <ButtonSignInGoogle
          isSubmitting={isSubmitting}
          signType="signIn"
          isClosed={systemSignInClosed}
        />
      </div>
    </>
  );
}
