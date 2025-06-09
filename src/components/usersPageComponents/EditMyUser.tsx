/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { editUserValidationSchema } from "../../@types/zodValidation";
import { EditUserValidationZProps, UserFullDataProps } from "../../@types";
import { app } from "../../db/Firebase";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { formataCPF, testaCPF } from "../../custom";
import SettingsMenuModal from "../layoutComponents/SettingsMenuModal";
import SettingsSectionSubHeader from "../layoutComponents/SettingsSectionSubHeader";
import BackdropModal from "../layoutComponents/BackdropModal";
import { SettingsMenuArrayProps } from "../../pages/Settings";

interface EditMyUserProps {
  renderSettingsMenu(itemMenu: string): JSX.Element | undefined;
  itemsMenu: SettingsMenuArrayProps[];
  settingsMenu: boolean;
  setSettingsMenu: Dispatch<SetStateAction<boolean>>;
  showSettingsPage: {
    page: string;
  };
}

export function EditMyUser({
  itemsMenu,
  renderSettingsMenu,
  settingsMenu,
  setSettingsMenu,
  showSettingsPage,
}: EditMyUserProps) {
  // GET GLOBAL DATA
  const {
    appUsersDb,
    appUsersDbError,
    appUsersDbLoading,
    isSubmitting,
    page,
    userFullData,
    setIsSubmitting,
    setPage,
    handleConfirmationToSubmit,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

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

  // USER EDIT DATA
  const [userEditData, setUserEditData] = useState<EditUserValidationZProps>({
    id: "",
    name: "",
    email: "",
    changePassword: false,
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  });

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // PHONE FORMATTED STATE
  const [phoneFormatted, setPhoneFormatted] = useState({
    ddd: "DDD",
    number: "",
  });

  // SET PHONE NUMBER WHEN PHONE FORMATTED IS FULLY FILLED
  useEffect(() => {
    if (phoneFormatted.ddd !== "DDD" && phoneFormatted.number !== "") {
      setUserEditData({
        ...userEditData,
        phone: `+55${phoneFormatted.ddd}${phoneFormatted.number}`,
      });
    } else {
      setUserEditData({ ...userEditData, phone: null });
    }
  }, [phoneFormatted]);

  // SET USER NAME TO USER EDIT NAME
  useEffect(() => {
    if (
      appUsersDb &&
      !appUsersDbLoading &&
      appUsersDbError === undefined &&
      userFullData
    ) {
      const foundedUser: UserFullDataProps = appUsersDb.find(
        (user) => user.id === userFullData.id
      ) as UserFullDataProps;
      if (foundedUser) {
        setUserEditData({
          ...userEditData,
          id: foundedUser.id,
          name: foundedUser.name,
          email: foundedUser.email,
          role: foundedUser.role,
          document: foundedUser.document ?? "",
        });
        setPhoneFormatted({
          ...phoneFormatted,
          ddd: foundedUser.phone ? foundedUser.phone.slice(3, 5) : "DDD",
          number: foundedUser.phone ? foundedUser.phone.slice(-9) : "",
        });
      }
    }
  }, [appUsersDb]);

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
    setValue("document", userEditData.document);
  }, [userEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.phone,
      errors.photo,
      errors.role,
      errors.document,
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
    const confirmation = await handleConfirmationToSubmit({
      title: "Editar seu Usuário",
      text: "Tem certeza que deseja confirmar as mudanças?",
      icon: "question",
      confirmButtonText: "Sim, confirmar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed && userFullData) {
      setIsSubmitting(true);
      const dataForAuth = {
        ...data,
        updatedBy: userFullData.id,
      };
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
            // UPDATE APP USER CHANGING PASSWORD FUNCTION (NOTE: FUNCTION ALSO UPDATE FIREBASE DATA, SEE /functions/src/)
            await updateAppUserWithPassword(dataForAuth);
            resetForm();
            toast.success(`${data.name} editado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            setIsSubmitting(false);
            setPage({ prev: page.show, show: "Settings" });
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
          // UPDATE APP USER NOT CHANGING PASSWORD FUNCTION (NOTE: FUNCTION ALSO UPDATE FIREBASE DATA, SEE /functions/src/)
          await updateAppUserWithoutPassword(dataForAuth);
          resetForm();
          toast.success(`${data.name} editado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
          setPage({ prev: page.show, show: "Settings" });
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="editando" />

      {/* PAGE TITLE */}
      <div className="flex justify-center items-center mt-2 py-2 gap-4">
        <h1 className="text-lg font-semibold">Configurações</h1>
      </div>
      <SettingsSectionSubHeader
        setSettingsMenu={setSettingsMenu}
        settingsMenu={settingsMenu}
        data={itemsMenu}
        showSettingsPage={showSettingsPage}
      />

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
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
                    : "w-1/4 text-right"
                }
              >
                E-mail:{" "}
              </label>
              <input
                type="email"
                name="email"
                disabled={isSubmitting}
                placeholder={
                  errors.email
                    ? "É necessário inserir o E-mail do Usuário"
                    : "Insira o E-mail do Usuário"
                }
                className={
                  errors.email
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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

            {/* FINANCIAL RESPONSIBLE DOCUMENT*/}
            {userFullData.role === "user" && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="userDocument"
                  className={
                    testFinancialCPF
                      ? errors.document
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                      : "w-1/4 text-right text-red-500 dark:text-red-400"
                  }
                >
                  CPF
                  {testFinancialCPF ? (
                    ": "
                  ) : (
                    <span className="text-red-500 dark:text-red-400">
                      {" "}
                      Inválido, verifique:
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="userDocument"
                  maxLength={14}
                  minLength={14}
                  placeholder={
                    errors.document
                      ? "É necessário inserir o CPF do Responsável Financeiro"
                      : "Insira o CPF do Responsável Financeiro"
                  }
                  className={
                    testFinancialCPF
                      ? errors.document
                        ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  }
                  value={userEditData.document}
                  onChange={(e) => {
                    if (e.target.value.length === 14) {
                      setTestFinancialCPF(testaCPF(e.target.value));
                    }
                    setUserEditData({
                      ...userEditData,
                      document: formataCPF(e.target.value),
                    });
                  }}
                />
              </div>
            )}

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
                    disabled={isSubmitting}
                    value={
                      userEditData.phone
                        ? userEditData.phone?.slice(3, 5)
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
                    name="phoneNumber"
                    pattern="^[+ 0-9]{9}$"
                    maxLength={9}
                    defaultValue={userEditData.phone?.slice(-9)}
                    placeholder={errors.phone ? "É necessário um" : "999999999"}
                    className={
                      errors.phone
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        number: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="w-2/12"></div>
              </div>
            </div>

            {/** CHECKBOX CONFIRM CHANGE PASSWORD */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="changePassword"
                className={
                  errors.password
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Alterar Senha ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="changePassword"
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
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
            {userEditData.changePassword && (
              <>
                {/* PASSWORD */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="password"
                    className={
                      !errorPassword
                        ? errors.password
                          ? "w-1/4 text-right text-red-500 dark:text-red-400"
                          : "w-1/4 text-right"
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
                          ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
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
                          : "w-1/4 text-right"
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
                          ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
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
            )}

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
      {/* BACKDROP */}
      {settingsMenu && (
        <BackdropModal
          setDashboardMenu={setSettingsMenu}
          setMobileMenuOpen={setSettingsMenu}
        />
      )}
      {/* SETTINGS MENU DRAWER */}
      <SettingsMenuModal
        setSettingsMenu={setSettingsMenu}
        settingsMenu={settingsMenu}
        itemsMenu={itemsMenu}
        renderSettingsMenu={renderSettingsMenu}
        userFullData={userFullData}
      />
    </div>
  );
}
