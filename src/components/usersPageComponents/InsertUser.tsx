/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { app, initFirebase } from "../../db/Firebase";
import { CreateUserValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createUserValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertUser() {
  // GET GLOBAL DATA
  const { appUsersDatabaseData, isSubmitting, setIsSubmitting } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // INITIALIZING FIREBASE AND FIREBASE ADMIN
  initFirebase();

  // CREATE USER CLOUD FUNCTION HOOK
  const [createAppUser] = useHttpsCallable(getFunctions(app), "createAppUser");

  // SCHOOL DATA
  const [userData, setUserData] = useState<CreateUserValidationZProps>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
    confirmInsert: false,
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
      setUserData({
        ...userData,
        phone: `+55${phoneFormatted.ddd}${phoneFormatted.prefix}${phoneFormatted.suffix}`,
      });
    } else {
      setUserData({ ...userData, phone: null });
    }
  }, [phoneFormatted]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserValidationZProps>({
    resolver: zodResolver(createUserValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "user",
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setUserData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "user",
      confirmInsert: false,
    });
    setPhoneFormatted({
      ddd: "DDD",
      prefix: "",
      suffix: "",
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", userData.name);
    setValue("email", userData.email);
    setValue("password", userData.password);
    setValue("confirmPassword", userData.confirmPassword);
    setValue("phone", userData.phone);
    setValue("role", userData.role);
    setValue("confirmInsert", userData.confirmInsert);
  }, [userData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.password,
      errors.confirmPassword,
      errors.phone,
      errors.role,
      errors.confirmInsert,
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

  // SUBMIT DATA FUNCTION
  const handleAddUser: SubmitHandler<CreateUserValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK PHONE IS NOT EMPTY
    if (!userData.phone) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, insira um número de telefone para o usuário ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o usuário ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF EMAIL EXISTS ON DATABASE
    const userEmailExist = appUsersDatabaseData.find(
      (user) => user.email === data.email
    );

    const userPhoneExist = appUsersDatabaseData.find(
      (user) => user.phone === data.phone
    );

    // IF EMAIL EXISTS, RETURN ERROR
    if (userEmailExist) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Já existe um usuário com este e-mail em nosso banco de dados... ❕`,
          {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        )
      );
      // IF PHONE EXISTS, RETURN ERROR
    } else if (userPhoneExist) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Já existe um usuário com este número de telefone em nosso banco de dados... ❕`,
          {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        )
      );
    } else {
      // IF NOT EXISTS, CREATE
      try {
        await createAppUser(data).then(async (result) => {
          if (result) {
            // CHECKING IF NEW USER IS A TEACHER
            if (data.role === "teacher") {
              // GET USER ID FROM FIREBASE CLOUD FUNCTIONS
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const userUid: any = result.data;
              try {
                // CREATE TEACHER ON SCHOOL DATABASE
                await setDoc(doc(db, "teachers", userUid), {
                  id: userUid,
                  name: data.name,
                  email: data.email,
                  phone: data.phone,
                  haveAccount: true,
                  updatedAt: serverTimestamp(),
                });
                toast.success(`Usuário ${data.name} criado com sucesso! 👌`, {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                });
                resetForm();
                setIsSubmitting(false);
              } catch (error) {
                console.log(error);
                toast.error(
                  `Usuário criado, porém correu um erro ao criar o professor no banco de dados da escola, contate o suporte... 🤯`,
                  {
                    theme: "colored",
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    autoClose: 3000,
                  }
                );
                resetForm();
                setIsSubmitting(false);
              }
            } else {
              toast.success(`Usuário ${data.name} criado com sucesso! 👌`, {
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
        });
      } catch (e) {
        console.error("CONSOLE.ERROR: ", e);
        console.log("ESSE É O ERROR", e);
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      }
    }
    // const userRef = collection(db, "appUsers");
    // const q = query(userRef, where("email", "==", data.email));
    // const querySnapshot = await getDocs(q);
    // const promisesMail: UserFullDataProps[] = [];
    // querySnapshot.forEach((doc) => {
    //   const promise = doc.data() as UserFullDataProps;
    //   promisesMail.push(promise);
    // });
    // Promise.all(promisesMail).then(async (results) => {
    //   if (results.length !== 0) {
    //     return (
    //       setIsSubmitting(false),
    //       toast.error(
    //         `Já existe um usuário com este e-mail em nosso banco de dados... ❕`,
    //         {
    //           theme: "colored",
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: true,
    //           autoClose: 3000,
    //         }
    //       )
    //     );
    //   } else {
    //     // CHECKING IF PHONE EXISTS ON DATABASE
    //     const userRef = collection(db, "appUsers");
    //     const q = query(userRef, where("phone", "==", data.phone));
    //     const querySnapshot = await getDocs(q);
    //     const promisesPhone: UserFullDataProps[] = [];
    //     querySnapshot.forEach((doc) => {
    //       const promise = doc.data() as UserFullDataProps;
    //       promisesPhone.push(promise);
    //     });
    //     Promise.all(promisesPhone).then(async (results) => {
    //       // IF EXISTS, RETURN ERROR
    //       if (results.length !== 0) {
    //         return (
    //           setIsSubmitting(false),
    //           toast.error(
    //             `Já existe um usuário com este número de telefone em nosso banco de dados... ❕`,
    //             {
    //               theme: "colored",
    //               closeOnClick: true,
    //               pauseOnHover: true,
    //               draggable: true,
    //               autoClose: 3000,
    //             }
    //           )
    //         );
    //       } else {
    //         // IF NOT EXISTS, CREATE
    //         try {
    //           await createAppUser(data).then(async (result) => {
    //             if (result?.data) {
    //               // CHECKING IF NEW USER IS A TEACHER
    //               if (data.role === "teacher") {
    //                 // GET USER ID FROM FIREBASE CLOUD FUNCTIONS
    //                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //                 const userUid: any = result.data;
    //                 try {
    //                   // CREATE TEACHER ON SCHOOL DATABASE
    //                   await setDoc(doc(db, "teachers", userUid), {
    //                     id: userUid,
    //                     name: data.name,
    //                     email: data.email,
    //                     phone: data.phone,
    //                     timestamp: serverTimestamp(),
    //                   });
    //                   toast.success(
    //                     `Usuário ${data.name} criado com sucesso! 👌`,
    //                     {
    //                       theme: "colored",
    //                       closeOnClick: true,
    //                       pauseOnHover: true,
    //                       draggable: true,
    //                       autoClose: 3000,
    //                     }
    //                   );
    //                   resetForm();
    //                   setIsSubmitting(false);
    //                 } catch (error) {
    //                   console.log(error);
    //                   toast.error(
    //                     `Usuário criado, porém correu um erro ao criar o professor no banco de dados da escola, contate o suporte... 🤯`,
    //                     {
    //                       theme: "colored",
    //                       closeOnClick: true,
    //                       pauseOnHover: true,
    //                       draggable: true,
    //                       autoClose: 3000,
    //                     }
    //                   );
    //                   resetForm();
    //                   setIsSubmitting(false);
    //                 }
    //               } else {
    //                 toast.success(
    //                   `Usuário ${data.name} criado com sucesso! 👌`,
    //                   {
    //                     theme: "colored",
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     autoClose: 3000,
    //                   }
    //                 );
    //                 resetForm();
    //                 setIsSubmitting(false);
    //               }
    //             }
    //           });
    //         } catch (e) {
    //           console.error("CONSOLE.ERROR: ", e);
    //           console.log("ESSE É O ERROR", e);
    //           toast.error(`Ocorreu um erro... 🤯`, {
    //             theme: "colored",
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             autoClose: 3000,
    //           });
    //           setIsSubmitting(false);
    //         }
    //       }
    //     });
    //   }
    // });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Usuário</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddUser)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* USER NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
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
            value={userData.name}
            onChange={(e) => {
              setUserData({
                ...userData,
                name: e.target.value,
                confirmInsert: false,
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
                : "w-1/4 text-right"
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
            value={userData.email}
            onChange={(e) => {
              setUserData({
                ...userData,
                email: e.target.value,
                confirmInsert: false,
              });
            }}
          />
        </div>

        {/* PASSWORD */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="password"
            className={
              errors.password
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Senha:{" "}
          </label>
          <input
            type="password"
            name="password"
            disabled={isSubmitting}
            placeholder={
              errors.password ? "É necessário inserir a Senha" : "Senha"
            }
            className={
              errors.password
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={userData.password}
            onChange={(e) => {
              setUserData({
                ...userData,
                password: e.target.value,
                confirmInsert: false,
              });
            }}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="confirmPassword"
            className={
              errors.confirmPassword
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Confirme a Senha:{" "}
          </label>
          <input
            type="password"
            name="confirmPassword"
            disabled={isSubmitting}
            placeholder={
              errors.confirmPassword
                ? "É necessário confirmar a Senha"
                : "Confirme a Senha"
            }
            className={
              errors.confirmPassword
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={userData.confirmPassword}
            onChange={(e) => {
              setUserData({
                ...userData,
                confirmPassword: e.target.value,
                confirmInsert: false,
              });
            }}
          />
        </div>

        {/* PHONE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phone"
            className={
              errors.phone
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Telefone:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-10/12 items-center gap-1">
              <select
                id="phoneDDD"
                defaultValue={"DDD"}
                className={
                  errors.phone
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                value={phoneFormatted.ddd}
                onChange={(e) => {
                  setPhoneFormatted({
                    ...phoneFormatted,
                    ddd: e.target.value,
                  });
                  setUserData({ ...userData, confirmInsert: false });
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              <input
                type="text"
                name="phoneInitial"
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={phoneFormatted.prefix}
                placeholder={errors.phone ? "É necessário um" : "99999"}
                className={
                  errors.phone
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setPhoneFormatted({
                    ...phoneFormatted,
                    prefix: e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*?)\..*/g, "$1"),
                  });
                  setUserData({ ...userData, confirmInsert: false });
                }}
              />
              -
              <input
                type="text"
                name="phoneFinal"
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={phoneFormatted.suffix}
                placeholder={errors.phone ? "telefone válido" : "9990"}
                className={
                  errors.phone
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setPhoneFormatted({
                    ...phoneFormatted,
                    suffix: e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*?)\..*/g, "$1"),
                  });
                  setUserData({ ...userData, confirmInsert: false });
                }}
              />
            </div>
            <div className="flex w-2/12 items-center gap-2"></div>
          </div>
        </div>

        {/* USER ROLE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="role"
            className={
              errors.role
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Permissão:{" "}
          </label>
          <select
            id="role"
            value={userData.role}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="role"
            onChange={(e) => {
              if (
                e.target.value === "admin" ||
                e.target.value === "editor" ||
                e.target.value === "teacher" ||
                e.target.value === "user"
              ) {
                setUserData({
                  ...userData,
                  role: e.target.value,
                  confirmInsert: false,
                });
              }
            }}
          >
            <option value="user">Usuário</option>
            <option value="teacher">Professor</option>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={userData.confirmInsert}
            onChange={() => {
              setUserData({
                ...userData,
                confirmInsert: !userData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            {userData.name
              ? `Confirmar criação do Usuário: ${userData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
          >
            {!isSubmitting ? "Criar" : "Criando"}
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
            {isSubmitting ? "Aguarde" : "Limpar"}
          </button>
        </div>
      </form>
    </div>
  );
}
