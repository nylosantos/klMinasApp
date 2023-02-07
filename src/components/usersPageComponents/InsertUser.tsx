/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
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

import { app, initFirebase } from "../../db/Firebase";
import { CreateUserValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createUserValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  buttonReset,
  buttonSubmit,
  divCheckboxItem,
  divItemsForm,
  divMasterPage,
  divPhoneMaster,
  divPhoneNumber,
  divSubmitResetItems,
  divWithDoubleItemsRight,
  formMaster,
  inputCheckbox,
  inputError,
  inputOk,
  inputWithButtonError,
  inputWithButtonOk,
  labelCheckbox,
  labelTextError,
  labelTextOk,
  pageTitleH1,
  selectDDDError,
  selectDDDOk,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertUser() {
  // INITIALIZING FIREBASE AND FIREBASE ADMIN
  initFirebase();

  // CREATE USER CLOUD FUNCTION HOOK
  const [createAppUser, executing, errorCreateAppUser] = useHttpsCallable(
    getFunctions(app),
    "createAppUser"
  );

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

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const userRef = collection(db, "appUsers");
    const q = query(userRef, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);
    const promisesMail: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promisesMail.push(promise);
    });
    Promise.all(promisesMail).then(async (results) => {
      // IF EXISTS, RETURN ERROR
      if (results.length !== 0) {
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
      } else {
        // CHECKING IF PHONE EXISTS ON DATABASE
        const userRef = collection(db, "appUsers");
        const q = query(userRef, where("phone", "==", data.phone));
        const querySnapshot = await getDocs(q);
        const promisesPhone: any = [];
        querySnapshot.forEach((doc) => {
          const promise = doc.data();
          promisesPhone.push(promise);
        });
        Promise.all(promisesPhone).then(async (results) => {
          // IF EXISTS, RETURN ERROR
          if (results.length !== 0) {
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
                if (result?.data) {
                  // CHECKING IF NEW USER IS A TEACHER
                  if (data.role === "teacher") {
                    // GET USER ID FROM FIREBASE CLOUD FUNCTIONS
                    const userUid: any = result.data;
                    try {
                      // CREATE TEACHER ON SCHOOL DATABASE
                      await setDoc(doc(db, "teachers", userUid), {
                        id: userUid,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        timestamp: serverTimestamp(),
                      });
                      toast.success(
                        `Usuário ${data.name} criado com sucesso! 👌`,
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
                    toast.success(
                      `Usuário ${data.name} criado com sucesso! 👌`,
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
        });
      }
    });
  };

  return (
    <div className={divMasterPage}>
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className={pageTitleH1}>Adicionar Usuário</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddUser)} className={formMaster}>
        {/* USER NAME */}
        <div className={divItemsForm}>
          <label
            htmlFor="name"
            className={errors.name ? labelTextError : labelTextOk}
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
            className={errors.name ? inputError : inputOk}
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
        <div className={divItemsForm}>
          <label
            htmlFor="email"
            className={errors.email ? labelTextError : labelTextOk}
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
            className={errors.email ? inputError : inputOk}
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
        <div className={divItemsForm}>
          <label
            htmlFor="password"
            className={errors.password ? labelTextError : labelTextOk}
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
            className={errors.password ? inputError : inputOk}
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
        <div className={divItemsForm}>
          <label
            htmlFor="confirmPassword"
            className={errors.confirmPassword ? labelTextError : labelTextOk}
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
            className={errors.confirmPassword ? inputError : inputOk}
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
        <div className={divItemsForm}>
          <label
            htmlFor="phone"
            className={errors.phone ? labelTextError : labelTextOk}
          >
            Telefone:{" "}
          </label>
          <div className={divPhoneMaster}>
            <div className={divPhoneNumber}>
              <select
                id="phoneDDD"
                defaultValue={"DDD"}
                className={errors.phone ? selectDDDError : selectDDDOk}
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
                  errors.phone ? inputWithButtonError : inputWithButtonOk
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
                  errors.phone ? inputWithButtonError : inputWithButtonOk
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
            <div className={divWithDoubleItemsRight}></div>
          </div>
        </div>

        {/* USER ROLE */}
        <div className={divItemsForm}>
          <label
            htmlFor="role"
            className={errors.role ? labelTextError : labelTextOk}
          >
            Permissão:{" "}
          </label>
          <select
            id="role"
            value={userData.role}
            className={errors.name ? inputError : inputOk}
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
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={userData.confirmInsert}
            onChange={() => {
              setUserData({
                ...userData,
                confirmInsert: !userData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {userData.name
              ? `Confirmar criação do Usuário: ${userData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className={divSubmitResetItems}>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonSubmit}
          >
            {!isSubmitting ? "Criar" : "Criando"}
          </button>

          {/* RESET BUTTON */}
          <button
            type="reset"
            className={buttonReset}
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
