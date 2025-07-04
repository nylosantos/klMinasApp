/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteClassValidationSchema } from "../../@types/zodValidation";
import {
  DeleteClassValidationZProps,
  SchoolClassSearchProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { secureDeleteDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteClass() {
  // GET GLOBAL DATA
  const {
    curriculumDatabaseData,
    schoolClassDatabaseData,
    studentsDatabaseData,
    handleConfirmationToSubmit,
    // logDelete
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL CLASS DATA
  const [schoolClassData, setSchoolClassData] =
    useState<DeleteClassValidationZProps>({
      schoolClassId: "",
      schoolClassName: "",
      schoolStageId: "",
    });

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setSchoolClassData({
      ...schoolClassData,
    });
    if (schoolClassData.schoolClassId !== "") {
      setIsSelected(true);
      setSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === schoolClassData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [schoolClassData.schoolClassId]);

  // SET SCHOOL CLASS NAME WITH SCHOOL CLASS SELECTED DATA WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (schoolClassSelectedData !== undefined) {
      setSchoolClassData({
        ...schoolClassData,
        schoolClassName: schoolClassSelectedData!.name,
        schoolStageId: schoolClassSelectedData!.schoolStageId,
      });
    }
  }, [schoolClassSelectedData]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteClassValidationZProps>({
    resolver: zodResolver(deleteClassValidationSchema),
    defaultValues: {
      schoolClassId: "",
      schoolClassName: "",
      schoolStageId: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setSchoolClassData({
      schoolClassId: "",
      schoolClassName: "",
      schoolStageId: "",
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolStageId", schoolClassData.schoolStageId);
    setValue("schoolClassId", schoolClassData.schoolClassId);
    setValue("schoolClassName", schoolClassData.schoolClassName);
    // setValue("confirmDelete", schoolClassData.confirmDelete);
  }, [schoolClassData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolStageId,
      errors.schoolClassId,
      errors.schoolClassName,
      // errors.confirmDelete,
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
  const handleAddClass: SubmitHandler<DeleteClassValidationZProps> = async (
    data
  ) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Ano Escolar",
      text: "Tem certeza que deseja deletar este Ano Escolar?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      // DELETE SCHOOL CLASS FUNCTION
      const deleteSchoolClass = async () => {
        try {
          await secureDeleteDoc(doc(db, "schoolClasses", data.schoolClassId));
          // await logDelete(data, "schoolClasses", data.schoolClassId);
          resetForm();
          toast.success(`Ano Escolar excluída com sucesso! 👌`, {
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
        }
      };

      // CHECKING IF SCHOOLCLASS EXISTS ON SOME STUDENT OR CURRICULUM ON DATABASE
      // STUDENTS IN THIS SCHOOLCLASS ARRAY
      const schoolClassExistsOnStudent: StudentSearchProps[] = [];

      // SEARCH CURRICULUM WITH THIS SCHOOLCLASS
      const schoolClassExistsOnCurriculum = curriculumDatabaseData.filter(
        (curriculum) =>
          curriculum.schoolClassIds.includes(schoolClassData.schoolClassId)
      );

      // SEARCH STUDENTS WITH THIS SCHOOLCLASS AND PUTTING ON ARRAY
      studentsDatabaseData.map((student) => {
        if (student.curriculums) {
          student.curriculums.map((studentCurriculum) => {
            const foundedSchoolClassStudentWithCurriculum =
              schoolClassExistsOnCurriculum.find(
                (schoolCurriculum) =>
                  schoolCurriculum.id === studentCurriculum.id
              );
            if (foundedSchoolClassStudentWithCurriculum) {
              schoolClassExistsOnStudent.push(student);
            }
          });
        }
      });

      // IF EXISTS, RETURN ERROR
      if (schoolClassExistsOnStudent.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Ano Escolar tem ${schoolClassExistsOnStudent.length} ${
              schoolClassExistsOnStudent.length === 1
                ? "aluno matriculado"
                : "alunos matriculados"
            }, exclua ou altere primeiramente ${
              schoolClassExistsOnStudent.length === 1 ? "o aluno" : "os alunos"
            } e depois exclua o ${data.schoolClassName}... ❕`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          )
        );
      } else if (schoolClassExistsOnCurriculum.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Ano Escolar incluído em ${schoolClassExistsOnCurriculum.length} ${
              schoolClassExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
            }, exclua ou altere primeiramente ${
              schoolClassExistsOnCurriculum.length === 1
                ? "a Turma"
                : "as Turmas"
            } e depois exclua o ${data.schoolClassName}... ❕`,
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
        deleteSchoolClass();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Ano Escolar</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddClass)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.schoolClassId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Ano Escolar:{" "}
          </label>
          <select
            id="schoolClassSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolClassId
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setSchoolClassData({
                ...schoolClassData,
                schoolClassId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schoolClasses" />
          </select>
        </div>

        {isSelected ? (
          <>
            {/** CHECKBOX CONFIRM DELETE */}
            {/* <div className="flex justify-center items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="confirmDelete"
                className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none "
                checked={schoolClassData.confirmDelete}
                onChange={() => {
                  setSchoolClassData({
                    ...schoolClassData,
                    confirmDelete: !schoolClassData.confirmDelete,
                  });
                }}
              />
              <label htmlFor="confirmDelete" className="text-sm">
                {schoolClassData.schoolClassName
                  ? schoolClassData.schoolClassName ===
                    " -- select an option -- "
                    ? `Confirmar exclusão`
                    : `Confirmar exclusão da ${schoolClassData.schoolClassName}`
                  : `Confirmar exclusão`}
              </label>
            </div> */}

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
