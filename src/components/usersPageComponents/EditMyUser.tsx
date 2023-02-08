import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { editUserValidationSchema } from "../../@types/zodValidation";
import { EditUserValidationZProps, UserFullDataProps } from "../../@types";
import { app } from "../../db/Firebase";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditMyUser() {
  // EDIT USER WITHOUT CHANGING PASSWORD CLOUD FUNCTION HOOK
  const [updateAppUserWithoutPassword] = useHttpsCallable(
    getFunctions(app),
    "updateAppUserWithoutPassword"
  );

  // EDIT USER CHANGING PASSWORD CLOUD FUNCTION HOOK
  const [updateAppUserWithPassword] = useHttpsCallable(
    getFunctions(app),
    "updateAppUserWithPassword"
  );

  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // ROUTING USER
  const router = useRouter();

  // USER AUTH STATE
  const [user, loading] = useAuthState(auth);

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

  // IF USER IS LOGGED, GET DATA
  useEffect(() => {
    if (user) {
      handleUserFullData(user);
    }
  }, [user]);

  // USER EDIT DATA
  const [userEditData, setUserEditData] = useState<EditUserValidationZProps>({
    id: "",
    name: "",
    email: "",
    changePassword: false,
    password: "",
    confirmPassword: "",
    phone: "",
    photo: "",
    role: "user",
  });

  // PHONE FORMATTED STATE
  const [phoneFormatted, setPhoneFormatted] = useState({
    ddd: "DDD",
    prefix: "",
    suffix: "",
  });

  // SET PHONE NUMBER WHEN PHONE FORMATTED IS FULLY FILLED
  useEffect(() => {
    if (
      phoneFormatted.ddd !== "DDD" &&
      phoneFormatted.prefix !== "" &&
      phoneFormatted.suffix !== ""
    ) {
      setUserEditData({
        ...userEditData,
        phone: `+55${phoneFormatted.ddd}${phoneFormatted.prefix}${phoneFormatted.suffix}`,
      });
    } else {
      setUserEditData({ ...userEditData, phone: null });
    }
  }, [phoneFormatted]);

  // SET USER NAME TO USER EDIT NAME
  useEffect(() => {
    if (userFullData) {
      setUserEditData({
        ...userEditData,
        id: userFullData.id,
        name: userFullData.name,
        email: userFullData.email,
        photo: userFullData.photo ? userFullData.photo : "",
        role: userFullData.role,
      });
      setPhoneFormatted({
        ...phoneFormatted,
        ddd: userFullData.phone ? userFullData.phone.slice(3, 5) : "DDD",
        prefix: userFullData.phone ? userFullData.phone.slice(5, 10) : "",
        suffix: userFullData.phone ? userFullData.phone.slice(-4) : "",
      });
    }
  }, [userFullData]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditUserValidationZProps>({
    resolver: zodResolver(editUserValidationSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      changePassword: false,
      password: "",
      confirmPassword: "",
      phone: "",
      photo: "",
      role: "user",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    setUserEditData({
      id: "",
      name: "",
      email: "",
      changePassword: false,
      password: "",
      confirmPassword: "",
      phone: "",
      photo: "",
      role: "user",
    });
    setPhoneFormatted({
      ...phoneFormatted,
      ddd: "DDD",
      prefix: "",
      suffix: "",
    });
    setErrorPassword(false);
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("id", userEditData.id);
    setValue("name", userEditData.name);
    setValue("email", userEditData.email);
    setValue("changePassword", userEditData.changePassword);
    setValue("password", userEditData.password);
    setValue("confirmPassword", userEditData.confirmPassword);
    setValue("phone", userEditData.phone);
    setValue("role", userEditData.role);
  }, [userEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.phone,
      errors.photo,
      errors.role,
      errors.changePassword,
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

  // BLANK PASSWORD TEST STATE
  const [errorPassword, setErrorPassword] = useState(false);

  // SUBMIT DATA FUNCTION
  const handleEditUser: SubmitHandler<EditUserValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHANGE PASSWORD TEST
    if (data.changePassword) {
      if (!data.password || data.password?.length < 6) {
        setIsSubmitting(false);
        setErrorPassword(true);
        toast.error(`A senha precisa ter, no mínimo, 6 caracteres.`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      } else {
        setErrorPassword(false);
        try {
          // UPDATE APP USER CHANGING PASSWORD FUNCTION
          await updateAppUserWithPassword(data);
          resetForm();
          toast.success(`${data.name} editado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
          router.push(
            {
              pathname: "/Dashboard",
              query: { username: userFullData?.name },
            },
            "/Dashboard" // "as" argument
          );
        } catch (error) {
          console.log("Erro: ", error);
          toast.error(`Ocorreu um erro... 🤯`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
          setIsSubmitting(false);
        }
      }
    } else {
      setErrorPassword(false);
      try {
        // UPDATE APP USER NOT CHANGING PASSWORD FUNCTION
        await updateAppUserWithoutPassword(data);
        resetForm();
        toast.success(`${data.name} editado com sucesso! 👌`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
        router.push(
          {
            pathname: "/Dashboard",
            query: { username: userFullData?.name },
          },
          "/Dashboard" // "as" argument
        );
      } catch (error) {
        console.log("Erro: ", error);
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        resetForm();
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="editando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Editando {userEditData?.name}</h1>

      {/* LOADING DATA */}
      {!userFullData ? (
        <SubmitLoading
          isSubmitting={userFullData ? false : true}
          whatsGoingOn="carregando"
        />
      ) : (
        <>
          {/* FORM */}
          <form
            onSubmit={handleSubmit(handleEditUser)}
            className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
          >
            {/* USER NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="name"
                className={
                  errors.name
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                }
              >
                Nome:{" "}
              </label>
              <input
                type="text"
                name="name"
                disabled={isSubmitting}
                placeholder={
                  errors.name
                    ? "É necessário inserir o Nome do Usuário"
                    : "Insira o nome do Usuário"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={userEditData.name}
                onChange={(e) => {
                  setUserEditData({
                    ...userEditData,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            {/* USER E-MAIL */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="email"
                className={
                  errors.email
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                }
              >
                E-mail:{" "}
              </label>
              <input
                type="text"
                name="email"
                disabled={isSubmitting}
                placeholder={
                  errors.email
                    ? "É necessário inserir o E-mail do Usuário"
                    : "Insira o E-mail do Usuário"
                }
                className={
                  errors.email
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={userEditData.email}
                onChange={(e) => {
                  setUserEditData({
                    ...userEditData,
                    email: e.target.value,
                  });
                }}
              />
            </div>

            {/** CHECKBOX CONFIRM CHANGE PASSWORD */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="changePassword"
                className={
                  errors.password
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                }
              >
                Alterar Senha ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="changePassword"
                  className="ml-1 dark: text-green-500 dark:text-green-500 border-none"
                  checked={userEditData.changePassword}
                  onChange={() => {
                    setUserEditData({
                      ...userEditData,
                      changePassword: !userEditData.changePassword,
                    });
                  }}
                />
              </div>
            </div>
            {userEditData.changePassword ? (
              <>
                {/* PASSWORD */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="password"
                    className={
                      !errorPassword
                        ? errors.password
                          ? "w-1/4 text-right text-red-500 dark:text-red-400"
                          : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                        : "w-1/4 text-right text-red-500 dark:text-red-400"
                    }
                  >
                    Senha:{" "}
                  </label>
                  <input
                    type="password"
                    name="password"
                    disabled={isSubmitting}
                    placeholder={
                      !errorPassword
                        ? errors.password
                          ? "É necessário inserir a Senha"
                          : "Senha"
                        : "É necessário inserir a Senha"
                    }
                    className={
                      !errorPassword
                        ? errors.password
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    }
                    onChange={(e) => {
                      setUserEditData({
                        ...userEditData,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="confirmPassword"
                    className={
                      !errorPassword
                        ? errors.confirmPassword
                          ? "w-1/4 text-right text-red-500 dark:text-red-400"
                          : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                        : "w-1/4 text-right text-red-500 dark:text-red-400"
                    }
                  >
                    Confirme a Senha:{" "}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    disabled={isSubmitting}
                    placeholder={
                      !errorPassword
                        ? errors.confirmPassword
                          ? "É necessário confirmar a Senha"
                          : "Confirme a Senha"
                        : "É necessário confirmar a Senha"
                    }
                    className={
                      !errorPassword
                        ? errors.confirmPassword
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    }
                    onChange={(e) => {
                      setUserEditData({
                        ...userEditData,
                        confirmPassword: e.target.value,
                      });
                    }}
                  />
                </div>
              </>
            ) : null}

            {/* PHONE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="phone"
                className={
                  errors.phone
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                }
              >
                Telefone:{" "}
              </label>
              <div className="flex w-2/4 gap-2">
                <div className="flex w-10/12 items-center gap-1">
                  <select
                    id="phoneDDD"
                    disabled={isSubmitting}
                    defaultValue={
                      userFullData.phone
                        ? userFullData.phone?.slice(3, 5)
                        : "DDD"
                    }
                    className={
                      errors.phone
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        ddd: e.target.value,
                      });
                    }}
                  >
                    <BrazilianStateSelectOptions />
                  </select>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    name="phoneInitial"
                    pattern="^[+ 0-9]{5}$"
                    maxLength={5}
                    defaultValue={userFullData?.phone?.slice(5, 10)}
                    placeholder={errors.phone ? "É necessário um" : "99999"}
                    className={
                      errors.phone
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        prefix: e.target.value,
                      });
                    }}
                  />
                  -
                  <input
                    type="text"
                    disabled={isSubmitting}
                    name="phoneFinal"
                    pattern="^[+ 0-9]{4}$"
                    maxLength={4}
                    defaultValue={userFullData?.phone?.slice(-4)}
                    placeholder={errors.phone ? "telefone válido" : "9990"}
                    className={
                      errors.phone
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        suffix: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="w-2/12"></div>
              </div>
            </div>

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
              >
                {!isSubmitting ? "Salvar" : "Salvando"}
              </button>

              {/* RESET BUTTON */}
              <button
                type="reset"
                className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
                disabled={isSubmitting}
                onClick={() => {
                  resetForm();
                }}
              >
                {isSubmitting ? "Aguarde" : "Cancelar"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
