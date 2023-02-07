import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";

import { systemSignInClosed } from "../../custom";
import { LoginWithEmailAndPasswordZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ButtonSignSubmit } from "../layoutComponents/ButtonSignSubmit";
import { ButtonSignInGoogle } from "../layoutComponents/ButtonSignInGoogle";
import { loginEmailAndPasswordValidationSchema } from "../../@types/zodValidation";
import {
  divSignMaster,
  formSignMaster,
  inputSignError,
  inputSignOk,
  signTitleH1,
} from "../../styles/tailwindConstants";

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

      <div className={divSignMaster}>
        {/* SUBMIT LOADING */}
        <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />

        {/* SIGN LOGIN TITLE */}
        <h1 className={signTitleH1}>Login</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(handleSignInWithEmailAndPassword)}
          className={formSignMaster}
        >
          {/* E-MAIL */}
          <input
            type="text"
            name="email"
            disabled={systemSignInClosed ? true : isSubmitting}
            placeholder={
              errors.email ? "É necessário inserir o E-mail" : "E-mail"
            }
            className={errors.email ? inputSignError : inputSignOk}
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
            className={errors.password ? inputSignError : inputSignOk}
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
