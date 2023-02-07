import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import {
  deleteDoc,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editUserValidationSchema } from "../../@types/zodValidation";
import { EditUserValidationZProps, UserFullDataProps } from "../../@types";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  buttonEdit,
  buttonReset,
  buttonSubmit,
  divEditButton,
  divItemsForm,
  divMasterPage,
  divPhoneMaster,
  divPhoneNumber,
  divSubmitResetItems,
  divWithDoubleItems,
  divWithDoubleItemsRight,
  formMaster,
  inputCheckbox,
  inputError,
  inputOk,
  inputWithButtonError,
  inputWithButtonOk,
  labelTextError,
  labelTextOk,
  pageTitleH1,
  selectDDDError,
  selectDDDOk,
  selectError,
  selectOk,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditUser() {
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

  // ---------------------------- USER VARIABLES, STATES AND FUNCTIONS ---------------------------- //
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

  // USER SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- USER SELECT STATES AND FUNCTIONS -------------------------- //
  // USER DATA ARRAY WITH ALL OPTIONS OF SELECT USERS
  const [usersDataArray, setUsersDataArray] = useState<UserFullDataProps[]>();

  // FUNCTION THAT WORKS WITH USER SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleUserSelectedData = (data: UserFullDataProps[]) => {
    setUsersDataArray(data);
  };

  // USER SELECTED STATE DATA
  const [userSelectedData, setUserSelectedData] = useState<UserFullDataProps>();

  // SET USER SELECTED STATE WHEN SELECT USER
  useEffect(() => {
    setIsEdit(false);
    if (userEditData.id !== "") {
      setUserSelectedData(
        usersDataArray!.find(({ id }) => id === userEditData.id)
      );
    } else {
      setUserSelectedData(undefined);
    }
  }, [userEditData.id]);

  // SET USER NAME TO USER EDIT NAME
  useEffect(() => {
    if (userSelectedData) {
      setUserEditData({
        ...userEditData,
        name: userSelectedData.name!,
        email: userSelectedData.email!,
        photo: userSelectedData.photo ? userSelectedData.photo : "",
        role: userSelectedData.role,
      });
      setPhoneFormatted({
        ...phoneFormatted,
        ddd: userSelectedData.phone
          ? userSelectedData.phone.slice(3, 5)
          : "DDD",
        prefix: userSelectedData.phone
          ? userSelectedData.phone.slice(5, 10)
          : "",
        suffix: userSelectedData.phone ? userSelectedData.phone.slice(-4) : "",
      });
    }
  }, [userSelectedData]);
  // -------------------------- END OF USER SELECT STATES AND FUNCTIONS -------------------------- //
  // ---------------------------- END OF USER VARIABLES, STATES AND FUNCTIONS ---------------------------- //

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
    (
      document.getElementById("userSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
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

    // CHECKING IF THERE'S A PASSWORD CHANGE
    if (data.changePassword) {
      // CHECKING IF PASSWORD IS FILLED AND HAVE MIN 6 CHARS
      if (!data.password || data.password?.length < 6) {
        setErrorPassword(true);
        toast.error(`A senha precisa ter, no mínimo, 6 caracteres.`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      } else {
        // UPDATING USER CHANGING PASSWORD
        setErrorPassword(false);
        try {
          // UPDATE USER WITH PASSWORD FUNCTION
          await updateAppUserWithPassword(data);
          // CHECKING IF USER IS WAS AND NOW ISN'T A TEACHER
          if (
            userSelectedData?.role === "teacher" &&
            userEditData.role !== "teacher"
          ) {
            // DELETE TEACHER FROM TEACHERS DATABASE FUNCTION
            await deleteDoc(doc(db, "teachers", data.id));
            toast.success(`${data.name} editado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            resetForm();
            setIsSubmitting(false);
          } else if (
            // CHECKING IF USER IS WASN'T AND NOW IS A TEACHER
            userSelectedData?.role !== "teacher" &&
            userEditData.role === "teacher"
          ) {
            // ADD TEACHER FROM TEACHERS DATABASE FUNCTION
            await setDoc(doc(db, "teachers", data.id), {
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              timestamp: serverTimestamp(),
            });
            toast.success(`${data.name} editado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            resetForm();
            setIsSubmitting(false);
          } else {
            toast.success(`${data.name} editado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            resetForm();
            setIsSubmitting(false);
          }
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
      // UPDATING USER WITHOUT CHANGE PASSWORD
      setErrorPassword(false);
      try {
        // UPDATE USER WITHOUT PASSWORD FUNCTION
        await updateAppUserWithoutPassword(data);
        // CHECKING IF USER IS WAS AND NOW ISN'T A TEACHER
        if (
          userSelectedData?.role === "teacher" &&
          userEditData.role !== "teacher"
        ) {
          // DELETE TEACHER FROM TEACHERS DATABASE FUNCTION
          await deleteDoc(doc(db, "teachers", data.id));
          toast.success(`${data.name} editado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
          setIsSubmitting(false);
        } else if (
          // CHECKING IF USER IS WASN'T AND NOW IS A TEACHER
          userSelectedData?.role !== "teacher" &&
          userEditData.role === "teacher"
        ) {
          // ADD TEACHER FROM TEACHERS DATABASE FUNCTION
          await setDoc(doc(db, "teachers", data.id), {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            timestamp: serverTimestamp(),
          });
          toast.success(`${data.name} editado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
          setIsSubmitting(false);
        } else {
          toast.success(`${data.name} editado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
          setIsSubmitting(false);
        }
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
    <div className={divMasterPage}>
      {/* SUBMITING LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="editando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className={pageTitleH1}>
        {isEdit ? `Editando ${userEditData.name}` : "Editar Usuário"}
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleEditUser)} className={formMaster}>
        {/* USER SELECT */}
        <div className={divItemsForm}>
          <label
            htmlFor="userSelect"
            className={errors.name ? labelTextError : labelTextOk}
          >
            Selecione o Usuário:{" "}
          </label>
          <select
            id="userSelect"
            defaultValue={" -- select an option -- "}
            className={errors.name ? selectError : selectOk}
            name="userSelect"
            onChange={(e) => {
              setUserEditData({
                ...userEditData,
                id: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              handleData={handleUserSelectedData}
              dataType="appUsers"
            />
          </select>
        </div>

        {isSelected ? (
          <>
            {/* EDIT BUTTON */}
            <div className={divEditButton}>
              <button
                type="button"
                disabled={isEdit}
                className={buttonEdit}
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                {!isEdit
                  ? "Editar"
                  : "Clique em CANCELAR para desfazer a Edição"}
              </button>
            </div>
          </>
        ) : null}

        {isEdit ? (
          <>
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
                value={userEditData.email}
                onChange={(e) => {
                  setUserEditData({
                    ...userEditData,
                    email: e.target.value,
                  });
                }}
              />
            </div>

            {/** CHECKBOX CHANGE PASSWORD */}
            <div className={divItemsForm}>
              <label
                htmlFor="changePassword"
                className={errors.password ? labelTextError : labelTextOk}
              >
                Alterar Senha ?{" "}
              </label>
              <div className={`${divWithDoubleItems} items-center`}>
                <input
                  type="checkbox"
                  name="changePassword"
                  className={inputCheckbox}
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
                <div className={divItemsForm}>
                  <label
                    htmlFor="password"
                    className={
                      !errorPassword
                        ? errors.password
                          ? labelTextError
                          : labelTextOk
                        : labelTextError
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
                          ? inputError
                          : inputOk
                        : inputError
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
                <div className={divItemsForm}>
                  <label
                    htmlFor="confirmPassword"
                    className={
                      !errorPassword
                        ? errors.confirmPassword
                          ? labelTextError
                          : labelTextOk
                        : labelTextError
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
                          ? inputError
                          : inputOk
                        : inputError
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
                    disabled={isSubmitting}
                    defaultValue={
                      userSelectedData?.phone
                        ? userSelectedData?.phone?.slice(3, 5)
                        : "DDD"
                    }
                    className={errors.phone ? selectDDDError : selectDDDOk}
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
                    defaultValue={userSelectedData?.phone?.slice(5, 10)}
                    placeholder={errors.phone ? "É necessário um" : "99999"}
                    className={
                      errors.phone ? inputWithButtonError : inputWithButtonOk
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
                    defaultValue={userSelectedData?.phone?.slice(-4)}
                    placeholder={errors.phone ? "telefone válido" : "9990"}
                    className={
                      errors.phone ? inputWithButtonError : inputWithButtonOk
                    }
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        suffix: e.target.value,
                      });
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
                disabled={isSubmitting}
                value={userEditData.role}
                className={errors.name ? selectError : selectOk}
                name="role"
                onChange={(e) => {
                  if (
                    e.target.value === "admin" ||
                    e.target.value === "editor" ||
                    e.target.value === "teacher" ||
                    e.target.value === "user"
                  ) {
                    setUserEditData({
                      ...userEditData,
                      role: e.target.value,
                    });
                  }
                  setIsSelected(true);
                }}
              >
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
                <option value="teacher">Professor</option>
                <option value="user">Usuário</option>
              </select>
            </div>

            {/* SUBMIT AND RESET BUTTONS */}
            <div className={divSubmitResetItems}>
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={buttonSubmit}
              >
                {!isSubmitting ? "Salvar" : "Salvando"}
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
                {isSubmitting ? "Aguarde" : "Cancelar"}
              </button>
            </div>
          </>
        ) : null}
      </form>
    </div>
  );
}
