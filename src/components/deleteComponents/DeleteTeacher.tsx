/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteTeacherValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  DeleteTeacherValidationZProps,
  EditTeacherValidationZProps,
  TeacherSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteTeacher() {
  // GET GLOBAL DATA
  const { curriculumDatabaseData, teacherDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // TEACHER DATA
  const [teacherData, setTeacherData] = useState<DeleteTeacherValidationZProps>(
    {
      teacherId: "",
      confirmDelete: false,
    }
  );

  // TEACHER EDIT DATA
  const [teacherFullData, setTeacherFullData] =
    useState<EditTeacherValidationZProps>({
      name: "",
      email: "",
      phone: "",
    });

  // PHONE FORMATTED STATE
  const [phoneFormatted] = useState({
    ddd: "DDD",
    number: "",
  });

  // SET PHONE NUMBER WHEN PHONE FORMATTED IS FULLY FILLED
  useEffect(() => {
    if (phoneFormatted.ddd !== "DDD" && phoneFormatted.number !== "") {
      setTeacherFullData({
        ...teacherFullData,
        phone: `+55${phoneFormatted.ddd}${phoneFormatted.number}`,
      });
    } else {
      setTeacherFullData({ ...teacherFullData, phone: null });
    }
  }, [phoneFormatted]);

  // TEACHER SELECTED STATE
  const [isSelected, setIsSelected] = useState(false);
  // TEACHER SELECTED STATE DATA
  const [teacherSelectedData, setTeacherSelectedData] =
    useState<TeacherSearchProps>();

  // SET TEACHER SELECTED STATE WHEN SELECT TEACHER
  useEffect(() => {
    setTeacherData({ ...teacherData, confirmDelete: false });
    if (teacherData.teacherId !== "") {
      setTeacherSelectedData(
        teacherDatabaseData.find(({ id }) => id === teacherData.teacherId)
      );
    } else {
      setTeacherSelectedData(undefined);
    }
  }, [teacherData.teacherId]);

  // SET TEACHER NAME TO TEACHER EDIT NAME
  useEffect(() => {
    if (teacherSelectedData) {
      setTeacherFullData({
        ...teacherFullData,
        name: teacherSelectedData.name,
        email: teacherSelectedData.email,
      });
    } else {
      setTeacherFullData({
        ...teacherFullData,
        name: "",
        email: "",
      });
    }
  }, [teacherSelectedData]);

  // DELETE USER CLOUD FUNCTION HOOK
  const [deleteAppUser] = useHttpsCallable(getFunctions(app), "deleteAppUser");

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteTeacherValidationZProps>({
    resolver: zodResolver(deleteTeacherValidationSchema),
    defaultValues: {
      teacherId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setTeacherData({
      teacherId: "",
      confirmDelete: false,
    });
    setIsSelected(false);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("teacherId", teacherData.teacherId);
    setValue("confirmDelete", teacherData.confirmDelete);
  }, [teacherData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.teacherId, errors.confirmDelete];
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
  const handleDeleteTeacher: SubmitHandler<
    DeleteTeacherValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    const deleteTeacher = async () => {
      try {
        if (teacherSelectedData?.haveAccount) {
          await deleteAppUser(data.teacherId);
          await deleteDoc(doc(db, "appUsers", data.teacherId));
        }
        await deleteDoc(doc(db, "teachers", data.teacherId));
        resetForm();
        toast.success(`Professor excluído com sucesso! 👌`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      } catch (error) {
        console.log("ESSE É O ERROR", error);
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      } finally {
        resetForm();
      }
    };

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o Professor ${teacherFullData.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF TEACHER EXISTS ON DATABASE

    // SEARCH CURRICULUM WITH THIS TEACHER
    const teacherExistsOnCurriculum = curriculumDatabaseData.filter(
      (curriculum) => curriculum.teacherId === teacherData.teacherId
    );

    // IF EXISTS, RETURN ERROR
    if (teacherExistsOnCurriculum.length !== 0) {
      return (
        setTeacherData({ ...teacherData, confirmDelete: false }),
        setIsSubmitting(false),
        toast.error(
          `Professor incluído em ${
            teacherExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
          }, exclua ou altere primeiramente ${
            teacherExistsOnCurriculum.length === 1 ? "a Turma" : "as Turmas"
          } e depois exclua o Professor ${teacherFullData.name}... ❕`,
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
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Professor</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleDeleteTeacher)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* TEACHER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherSelect"
            className={
              errors.teacherId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Professor:{" "}
          </label>
          <select
            id="teacherSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.teacherId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="teacherSelect"
            onChange={(e) => {
              setTeacherData({
                teacherId: e.target.value,
                confirmDelete: false,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions returnId dataType="teachers" />
          </select>
        </div>

        {/* TEACHER DETAILS SECTION */}
        {isSelected ? (
          <>
            <div className="flex flex-col pt-2 pb-6 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
              {/* DETAILS TITLE */}
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Dados do Professor a ser excluído:
              </h1>

              {/* TEACHER NAME */}
              <div className="flex gap-2 items-center">
                <label htmlFor="name" className="w-1/4 text-right">
                  Nome:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={teacherSelectedData?.name}
                />
              </div>

              {/* TEACHER E-MAIL */}
              <div className="flex gap-2 items-center">
                <label htmlFor="email" className="w-1/4 text-right">
                  E-mail:{" "}
                </label>
                <input
                  type="text"
                  name="email"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={teacherSelectedData?.email}
                />
              </div>

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
                        teacherSelectedData?.phone
                          ? teacherSelectedData?.phone?.slice(3, 5)
                          : "DDD"
                      }
                    >
                      <BrazilianStateSelectOptions />
                    </select>
                    <input
                      disabled
                      type="text"
                      name="phoneNumber"
                      value={teacherSelectedData?.phone?.slice(-9)}
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    />
                  </div>
                  <div className="w-2/12"></div>
                </div>
              </div>
            </div>

            {/** CHECKBOX CONFIRM DELETE */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="confirmDelete"
                className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none "
                checked={teacherData.confirmDelete}
                onChange={() => {
                  setTeacherData({
                    ...teacherData,
                    confirmDelete: !teacherData.confirmDelete,
                  });
                }}
              />
              <label htmlFor="confirmDelete" className="text-sm">
                {teacherFullData.name
                  ? `Confirmar exclusão de ${teacherFullData.name}`
                  : `Confirmar exclusão`}
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
                {isSubmitting ? "Aguarde" : "Limpar"}
              </button>
            </div>
          </>
        ) : null}
      </form>
    </div>
  );
}
