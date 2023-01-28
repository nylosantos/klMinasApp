/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { getFirestore } from "firebase/firestore";

import { editUserValidationSchema } from "../../@types/zodValidation";
import { EditUserValidationZProps, UserFullDataProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";
import { BrazilianStateSelectOptions } from "../BrazilianStateSelectOptions";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditUser() {
  // EDIT USER WITHOUT CHANGE PASSWORD CLOUD FUNCTION HOOK
  const [editAppUserWithoutChangePassword, executing, error] = useHttpsCallable(
    getFunctions(app),
    "editAppUserWithoutChangePassword"
  );

  // EDIT USER WITHOUT CHANGING PASSWORD CLOUD FUNCTION HOOK
  const [editAppUserChangingPassword] = useHttpsCallable(
    getFunctions(app),
    "editAppUserChangingPassword"
  );

  // USER DATA
  const [userData, setUserData] = useState({
    id: "",
  });

  // USER EDIT DATA
  const [userEditData, setUserEditData] = useState<EditUserValidationZProps>({
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

  // USER DATA ARRAY WITH ALL OPTIONS OF SELECT USERS
  const [usersDataArray, setUsersDataArray] = useState<UserFullDataProps[]>();
  console.log(userEditData);
  // FUNCTION THAT WORKS WITH USER SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleUserSelectedData = (data: UserFullDataProps[]) => {
    setUsersDataArray(data);
  };

  // USER SELECTED STATE DATA
  const [userSelectedData, setUserSelectedData] = useState<UserFullDataProps>();

  // SET USER SELECTED STATE WHEN SELECT USER
  useEffect(() => {
    setIsEdit(false);
    if (userData.id !== "") {
      setUserSelectedData(usersDataArray!.find(({ id }) => id === userData.id));
    } else {
      setUserSelectedData(undefined);
    }
  }, [userData.id]);

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
    setUserData({
      id: "",
    });
    setUserEditData({
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
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", userEditData.name);
    setValue("email", userEditData.email);
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

  // SUBMIT DATA FUNCTION
  const handleEditUser: SubmitHandler<EditUserValidationZProps> = async (
    data
  ) => {
    console.log(data.changePassword)
    setIsSubmitting(true);
    if (data.changePassword) {
      if (data.password && data.confirmPassword) {
        await editAppUserChangingPassword(data)
          .then((result) => {
            toast.success(`${data.name} editado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            resetForm();
            setIsSubmitting(false);
          })
          .catch((error) => {
            console.log("ESSE É O ERROR", error);
            toast.error(`Ocorreu um erro... 🤯`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            setIsSubmitting(false);
          });
      } else {
        toast.error(
          `Informe a senha ou desmarque a opção "Alterar Senha"... ☑️`,
          {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        );
        setIsSubmitting(false);
      }
    } else {
      await editAppUserWithoutChangePassword(data)
        .then((result) => {
          toast.success(`${data.name} editado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
          setIsSubmitting(false);
        })
        .catch((error) => {
          console.log("ESSE É O ERROR", error);
          toast.error(`Ocorreu um erro... 🤯`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${userEditData.name}` : "Editar Usuário"}
      </h1>
      <form
        onSubmit={handleSubmit(handleEditUser)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* USER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="userSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Usuário:{" "}
          </label>
          <select
            id="userSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="userSelect"
            onChange={(e) => {
              setUserData({
                ...userData,
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
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-green-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
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

            {/** CHECKBOX CONFIRM INSERT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="password"
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
                      errors.password
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right text-gray-900 dark:text-gray-100"
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
                      errors.confirmPassword
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right text-gray-900 dark:text-gray-100"
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
                    defaultValue={"DDD"}
                    className={
                      errors.phone
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    value={userSelectedData?.phone?.slice(3, 5)}
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
                    value={userSelectedData?.phone?.slice(5, 10)}
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
                    value={userSelectedData?.phone?.slice(-4)}
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

            {/* USER ROLE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="role"
                className={
                  errors.role
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right text-gray-900 dark:text-gray-100"
                }
              >
                Permissão:{" "}
              </label>
              <select
                id="role"
                disabled={isSubmitting}
                value={userEditData.role}
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
          </>
        ) : null}
      </form>
    </div>
  );
}
