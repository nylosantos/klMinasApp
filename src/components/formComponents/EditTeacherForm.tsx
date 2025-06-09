/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";
import { app } from "../../db/Firebase";
import { EditTeacherValidationZProps, TeacherSearchProps } from "../../@types";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTeacherValidationSchema } from "../../@types/zodValidation";
import { doc, getFirestore } from "firebase/firestore";
import { BrazilianStateSelectOptions } from "./BrazilianStateSelectOptions";
import { EditDashboardTeacherButton } from "../layoutComponents/EditDashboardTeacherButton";
import { secureUpdateDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface EditTeacherFormProps {
  teacherSelectedData: TeacherSearchProps;
  isSubmitting: boolean;
  isEdit: boolean;
  modal?: boolean;
  onClose?: () => void;
  setModal?: (option: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  handleDeleteTeacher?: () => void;
  onCloseLogModal?: (teacherId: string) => void; // Função para fechar o modal
}

export default function EditTeacherForm({
  teacherSelectedData,
  isSubmitting,
  isEdit,
  modal = false,
  setModal,
  onClose,
  setIsSubmitting,
  setIsEdit,
  handleDeleteTeacher,
  onCloseLogModal,
}: EditTeacherFormProps) {
  // GET GLOBAL DATA
  const { appUsersDatabaseData, handleConfirmationToSubmit, userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // CREATE USER CLOUD FUNCTION HOOK
  const [getAuthUser] = useHttpsCallable(getFunctions(app), "getAuthUser");
  const [updateAppUserWithoutPassword] = useHttpsCallable(
    getFunctions(app),
    "updateAppUserWithoutPassword"
  );

  // TEACHER EDIT DATA
  const [teacherEditData, setTeacherEditData] =
    useState<EditTeacherValidationZProps>({
      name: "",
      email: "",
      phone: "",
    });

  // PHONE FORMATTED STATE
  const [phoneFormatted, setPhoneFormatted] = useState({
    ddd: "DDD",
    number: "",
  });

  // SET PHONE NUMBER WHEN PHONE FORMATTED IS FULLY FILLED
  useEffect(() => {
    if (phoneFormatted.ddd !== "DDD" && phoneFormatted.number !== "") {
      setTeacherEditData({
        ...teacherEditData,
        phone: `+55${phoneFormatted.ddd}${phoneFormatted.number}`,
      });
    } else {
      setTeacherEditData({ ...teacherEditData, phone: null });
    }
  }, [phoneFormatted]);

  // SET TEACHER DATA TO TEACHER EDIT DATA
  useEffect(() => {
    if (teacherSelectedData) {
      setTeacherEditData({
        ...teacherEditData,
        name: teacherSelectedData.name,
        email: teacherSelectedData.email,
        phone: teacherSelectedData.phone,
      });
      setPhoneFormatted({
        ddd: teacherSelectedData.phone?.slice(3, 5),
        number: teacherSelectedData.phone?.slice(-9),
      });
    }
  }, [teacherSelectedData]);

  function resetTeacherDataFunction() {
    setTeacherEditData({
      ...teacherEditData,
      name: teacherSelectedData.name,
      email: teacherSelectedData.email,
      phone: teacherSelectedData.phone,
    });
    setIsEdit(!isEdit);
  }

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditTeacherValidationZProps>({
    resolver: zodResolver(editTeacherValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    setTeacherEditData({
      name: "",
      email: "",
      phone: "",
    });
    onClose && onClose();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", teacherEditData.name);
    setValue("email", teacherEditData.email);
    setValue(
      "phone",
      phoneFormatted.ddd === "DDD" && phoneFormatted.number === ""
        ? teacherSelectedData?.phone === ""
          ? teacherEditData.phone
          : teacherSelectedData === undefined
          ? ""
          : teacherSelectedData!.phone
        : teacherEditData.phone
    );
  }, [teacherSelectedData, teacherEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name];
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
  const handleEditTeacher: SubmitHandler<EditTeacherValidationZProps> = async (
    data
  ) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Editar Professor",
      text: "Tem certeza que deseja confirmar as mudanças?",
      icon: "question",
      confirmButtonText: "Sim, confirmar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed && userFullData) {
      setIsSubmitting(true);
      // EDIT TEACHER FUNCTION
      const editTeacher = async () => {
        try {
          await secureUpdateDoc(doc(db, "teachers", teacherSelectedData.id), {
            name: data.name,
            email: data.email,
            phone: data.phone,
          });
          toast.success(
            `Professor ${teacherEditData.name} alterado com sucesso! 👌`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        } catch (error) {
          console.log("ESSE É O ERROR", error);
          toast.error(`Ocorreu um erro... 🤯`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        } finally {
          setIsSubmitting(false);
          resetForm();
        }
      };
      // CHECK IF THIS THEACHER HAVE A AUTH USER
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await getAuthUser(teacherSelectedData.id);
      // IF YES, EDIT ALSO
      if (user !== undefined) {
        const teacherPhoneExist = appUsersDatabaseData.find(
          (teacher) => teacher.phone === data.phone
        );
        // IF EXISTS, RETURN ERROR
        if (teacherPhoneExist) {
          return (
            setIsSubmitting(false),
            toast.error(
              `Telefone já registrado em nosso banco de dados... ❕`,
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
          const teacherEmailExist = appUsersDatabaseData.find(
            (teacher) => teacher.email === data.email
          );
          // IF EXISTS, RETURN ERROR
          if (teacherEmailExist && data.email !== teacherSelectedData.email) {
            return (
              setIsSubmitting(false),
              toast.error(
                `E-mail já registrado em nosso banco de dados... ❕`,
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
            const dataForAuth = {
              ...data,
              role: "teacher",
              id: user!.data.uid,
              updatedBy: userFullData.id,
            };
            // EDIT CALL
            await editTeacher();
            // EDIT FIREBASE AUTH DATA ONLY WITHOUT CHANGE PASSWORD -> FOR EDIT PASSWORD GO TO EDITUSER
            await updateAppUserWithoutPassword(dataForAuth);
          }
        }
      } else {
        const teacherPhoneExist = appUsersDatabaseData.find(
          (teacher) => teacher.phone === data.phone
        );
        // IF EXISTS, RETURN ERROR
        if (teacherPhoneExist) {
          return (
            setIsSubmitting(false),
            toast.error(
              `Telefone já registrado em nosso banco de dados... ❕`,
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
          const teacherEmailExist = appUsersDatabaseData.find(
            (teacher) => teacher.email === data.email
          );
          // IF EXISTS, RETURN ERROR
          if (teacherEmailExist) {
            return (
              setIsSubmitting(false),
              toast.error(
                `E-mail já registrado em nosso banco de dados... ❕`,
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
            // EDIT CALL
            await editTeacher();
          }
        }
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full ${
        modal
          ? "flex flex-col flex-1 max-w-7xl bg-white/80 dark:bg-transparent rounded-xl"
          : ""
      } `}
    >
      {modal && (
        <div className="flex items-center justify-center text-md/snug text-gray-100 bg-klGreen-500/70 dark:bg-klGreen-500/70 rounded-t-xl uppercase p-4">
          <div className="flex-1 flex justify-center relative">
            <p className="absolute left-1/2 transform -translate-y-1/2 z-10">
              {!isEdit ? `Detalhes` : `Editando`} - {teacherSelectedData.name}
            </p>
          </div>
          <div className="flex justify-end px-2 z-50">
            <EditDashboardTeacherButton
              isEdit={isEdit}
              handleDeleteTeacher={handleDeleteTeacher && handleDeleteTeacher}
              resetTeacherData={resetTeacherDataFunction}
              setIsEdit={setIsEdit}
              setModal={setModal && setModal}
              onCloseLogModal={onCloseLogModal}
              id={teacherSelectedData.id}
            />
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(handleEditTeacher)}
        className={`flex flex-col w-full gap-2 p-4 ${
          modal
            ? "rounded-b-xl bg-klGreen-500/20 dark:bg-klGreen-500/30"
            : "mt-2"
        }`}
      >
        {/* TEACHER NAME */}
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
            disabled={!isEdit ? true : isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o Nome do Professor"
                : "Insira o nome do Professor"
            }
            className={
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={teacherEditData.name}
            onChange={(e) => {
              setTeacherEditData({
                ...teacherEditData,
                name: e.target.value,
              });
            }}
          />
        </div>

        {/* TEACHER E-MAIL */}
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
            disabled={!isEdit ? true : isSubmitting}
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
            value={teacherEditData.email}
            onChange={(e) => {
              setTeacherEditData({
                ...teacherEditData,
                email: e.target.value,
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
                disabled={!isEdit ? true : isSubmitting}
                defaultValue={
                  teacherSelectedData?.phone
                    ? teacherSelectedData?.phone?.slice(3, 5)
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
                disabled={!isEdit ? true : isSubmitting}
                name="phoneNumber"
                pattern="^[+ 0-9]{9}$"
                maxLength={9}
                defaultValue={teacherSelectedData?.phone?.slice(-9)}
                placeholder={errors.phone ? "É necessário um" : "99999"}
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

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4 justify-center">
          {/* SUBMIT BUTTON */}
          {isEdit && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
            >
              {!isSubmitting ? "Salvar" : "Salvando"}
            </button>
          )}

          {/* RESET BUTTON */}
          <button
            type="reset"
            className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
            disabled={isSubmitting}
            onClick={() => {
              resetForm();
            }}
          >
            {isSubmitting ? "Aguarde" : !isEdit ? "Fechar" : "Cancelar"}
          </button>
        </div>
      </form>
    </div>
  );
}
