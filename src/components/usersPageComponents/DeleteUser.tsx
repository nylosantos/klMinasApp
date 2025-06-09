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
import { doc, DocumentData, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteUserValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  DeleteUserValidationZProps,
  TeacherSearchProps,
  UserFullDataProps,
} from "../../@types";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import BackdropModal from "../layoutComponents/BackdropModal";
import SettingsMenuModal from "../layoutComponents/SettingsMenuModal";
import { SettingsMenuArrayProps } from "../../pages/Settings";
import SettingsSectionSubHeader from "../layoutComponents/SettingsSectionSubHeader";
import { secureDeleteDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface DeleteUserProps {
  renderSettingsMenu(itemMenu: string): JSX.Element | undefined;
  itemsMenu: SettingsMenuArrayProps[];
  settingsMenu: boolean;
  setSettingsMenu: Dispatch<SetStateAction<boolean>>;
  showSettingsPage: { page: string };
}

export function DeleteUser({
  itemsMenu,
  renderSettingsMenu,
  settingsMenu,
  setSettingsMenu,
  showSettingsPage,
}: DeleteUserProps) {
  // GET GLOBAL DATA
  const {
    appUsersDatabaseData,
    teachersDb,
    curriculumDb,
    isSubmitting,
    userFullData,
    setIsSubmitting,
    handleConfirmationToSubmit,
    // logDelete,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // DELETE USER CLOUD FUNCTION HOOK
  const [deleteAppUser] = useHttpsCallable(getFunctions(app), "deleteAppUser");

  // -------------------------- DELETE USER STATES AND FUNCTIONS -------------------------- //
  // USER DATA
  const [userData, setUserData] = useState<DeleteUserValidationZProps>({
    id: "",
  });

  // USER SELECTED ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);

  // USER SELECTED STATE DATA
  const [userSelectedData, setUserSelectedData] = useState<UserFullDataProps>();

  // SET USER SELECTED STATE WHEN SELECT USER
  useEffect(() => {
    if (userData.id !== "") {
      setUserSelectedData(
        appUsersDatabaseData.find(({ id }) => id === userData.id)
      );
    } else {
      setUserSelectedData(undefined);
    }
  }, [userData.id]);
  // -------------------------- END OF DELETE USER STATES AND FUNCTIONS -------------------------- //

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteUserValidationZProps>({
    resolver: zodResolver(deleteUserValidationSchema),
    defaultValues: {
      id: "",
    },
  });

  useEffect(() => {
    (
      document.getElementById("userSelect") as HTMLSelectElement
    ).selectedIndex = 0;
  }, []);

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("userSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    reset();
    setIsSelected(false);
    setUserData({
      id: "",
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("id", userData.id);
  }, [userData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.id];
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
  const handleDeleteUser: SubmitHandler<DeleteUserValidationZProps> = async (
    data
  ) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Usuário",
      text: "Tem certeza que deseja deletar este usuário?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed && userSelectedData && userFullData) {
      setIsSubmitting(true);
      // DELETE USER FUNCTION
      const deleteUser = async () => {
        await deleteAppUser({
          userSelectedData,
          userFullDataId: userFullData.id,
        })
          .then(async () => {
            if (userSelectedData.role === "teacher") {
              try {
                const teachersDbTransformed: TeacherSearchProps[] = teachersDb
                  ? teachersDb.map((doc: DocumentData) => ({
                      ...(doc as TeacherSearchProps),
                    }))
                  : [];
                const curriculumDbTransformed: CurriculumSearchProps[] =
                  curriculumDb
                    ? curriculumDb.map((doc: DocumentData) => ({
                        ...(doc as CurriculumSearchProps),
                      }))
                    : [];
                const teacherToDelete = teachersDbTransformed.find(
                  (teacher) => teacher.id === data.id
                );
                if (teacherToDelete) {
                  const deleteTeacher = async () => {
                    await secureDeleteDoc(doc(db, "teachers", teacherToDelete.id));
                    // await logDelete(
                    //   teacherToDelete,
                    //   "teachers",
                    //   teacherToDelete.id
                    // );
                    resetForm();
                    toast.success(`Professor excluído com sucesso! 👌`, {
                      theme: "colored",
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      autoClose: 3000,
                    });
                  };
                  // SEARCH CURRICULUM WITH THIS TEACHER
                  const teacherExistsOnCurriculum =
                    curriculumDbTransformed.filter(
                      (curriculum) =>
                        curriculum.teacherId === teacherToDelete.id
                    );

                  // IF EXISTS, RETURN ERROR
                  if (teacherExistsOnCurriculum.length !== 0) {
                    return (
                      setIsSubmitting(false),
                      toast.error(
                        `Professor incluído em ${
                          teacherExistsOnCurriculum.length === 1
                            ? "Turma"
                            : "Turmas"
                        }, exclua ou altere primeiramente ${
                          teacherExistsOnCurriculum.length === 1
                            ? "a Turma"
                            : "as Turmas"
                        } e depois exclua o Professor ${
                          teacherToDelete.name
                        }... ❕`,
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
                    // IF NO EXISTS, DELETE
                    deleteTeacher();
                  }
                } else {
                  toast.error(
                    `Ocorreu um erro, professor não encontrado no banco de dados... 🤯`,
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
              } catch (error) {
                toast.error(
                  `Usuário excluído, porém correu um erro ao excluir o professor no banco de dados da escola, contate o suporte... 🤯`,
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
                `${userSelectedData.name} excluído com sucesso! 👌`,
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
      };

      // CHECK IF USER IS A TEACHER WITH CLASSES
      if (userSelectedData.role === "teacher") {
        const teachersDbTransformed: TeacherSearchProps[] = teachersDb
          ? teachersDb.map((doc: DocumentData) => ({
              ...(doc as TeacherSearchProps),
            }))
          : [];
        const curriculumDbTransformed: CurriculumSearchProps[] = curriculumDb
          ? curriculumDb.map((doc: DocumentData) => ({
              ...(doc as CurriculumSearchProps),
            }))
          : [];
        const teacherToDelete = teachersDbTransformed.find(
          (teacher) => teacher.id === userSelectedData.id
        );
        if (teacherToDelete) {
          // SEARCH CURRICULUM WITH THIS TEACHER
          const teacherExistsOnCurriculum = curriculumDbTransformed.filter(
            (curriculum) => curriculum.teacherId === teacherToDelete.id
          );

          // IF EXISTS, RETURN ERROR
          if (teacherExistsOnCurriculum.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Professor incluído em ${
                  teacherExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
                }, exclua ou altere primeiramente ${
                  teacherExistsOnCurriculum.length === 1
                    ? "a Turma"
                    : "as Turmas"
                } e depois exclua o Professor ${teacherToDelete.name}... ❕`,
                {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                }
              )
            );
          }
        } else {
          // IF TEACHER'S NOT FOUND, RETURN ERROR
          return (
            setIsSubmitting(false),
            toast.error(
              `Professor não encontrado no banco de dados, para evitar erros críticos no sistema não foi efetuada a exclusão, contate a administração... ❕`,
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            )
          );
        }
      }

      deleteUser();
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="deletando" />

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

      {/* LOADING USER AUTH DATA */}
      {!userFullData ? (
        <SubmitLoading
          isSubmitting={userFullData ? false : true}
          whatsGoingOn="carregando"
        />
      ) : (
        <>
          {/* FORM */}
          <form
            onSubmit={handleSubmit(handleDeleteUser)}
            className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
          >
            {/* USER SELECT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="userSelect"
                className={
                  errors.id
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Selecione o Usuário:{" "}
              </label>
              <select
                id="userSelect"
                value={
                  userData.id !== "" ? userData.id : " -- select an option -- "
                }
                className={
                  errors.id
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
                  dataType="appUsers"
                  displayAdmins={userFullData?.role === "root" ? true : false}
                />
              </select>
            </div>

            {isSelected && (
              <>
                <div className="flex flex-col pt-2 pb-6 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                  {/* DETAILS TITLE */}
                  <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                    Dados do usuário a ser excluído:
                  </h1>

                  {/* USER NAME */}
                  <div className="flex gap-2 items-center">
                    <label htmlFor="name" className="w-1/4 text-right">
                      Nome:{" "}
                    </label>
                    <input
                      type="text"
                      name="name"
                      disabled
                      className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      value={userSelectedData?.name}
                    />
                  </div>

                  {/* USER E-MAIL */}
                  <div className="flex gap-2 items-center">
                    <label htmlFor="email" className="w-1/4 text-right">
                      E-mail:{" "}
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled
                      className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      value={userSelectedData?.email}
                    />
                  </div>

                  {userSelectedData?.role === "user" && (
                    <>
                      {/* USER DOCUMENT */}
                      <div className="flex gap-2 items-center">
                        <label htmlFor="document" className="w-1/4 text-right">
                          CPF:{" "}
                        </label>
                        <input
                          type="text"
                          name="document"
                          disabled
                          className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          value={userSelectedData?.document}
                        />
                      </div>
                    </>
                  )}

                  {/* PHONE */}
                  <div className="flex gap-2 items-center">
                    <label htmlFor="phone" className="w-1/4 text-right">
                      Telefone:{" "}
                    </label>
                    <div className="flex w-2/4 gap-2">
                      <div className="flex w-10/12 items-center gap-1">
                        <select
                          disabled
                          id="phoneDDD"
                          defaultValue={"DDD"}
                          className="pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          name="DDD"
                          value={
                            userSelectedData?.phone
                              ? userSelectedData?.phone?.slice(3, 5)
                              : "DDD"
                          }
                        >
                          <BrazilianStateSelectOptions />
                        </select>
                        <input
                          disabled
                          type="text"
                          name="phoneNumber"
                          value={
                            userSelectedData?.phone
                              ? userSelectedData?.phone?.slice(-9)
                              : ""
                          }
                          className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                        />
                      </div>
                      <div className="flex w-2/12 items-center gap-2"></div>
                    </div>
                  </div>

                  {/* USER ROLE */}
                  <div className="flex gap-2 items-center">
                    <label htmlFor="role" className="w-1/4 text-right">
                      Permissão:{" "}
                    </label>
                    <select
                      disabled
                      id="role"
                      value={userSelectedData?.role}
                      className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      name="role"
                    >
                      <option value="admin">Administrador</option>
                      <option value="editor">Editor</option>
                      <option value="teacher">Professor</option>
                      <option value="user">Usuário</option>
                    </select>
                  </div>
                </div>

                {/* SUBMIT AND RESET BUTTONS */}
                <div className="flex gap-2 mt-4">
                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
                  >
                    {!isSubmitting ? "Excluir" : "Excluindo"}
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
            )}
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
