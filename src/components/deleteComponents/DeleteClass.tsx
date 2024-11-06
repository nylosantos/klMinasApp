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

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteClass() {
  // GET GLOBAL DATA
  const {
    curriculumDatabaseData,
    schoolClassDatabaseData,
    studentsDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL CLASS DATA
  const [schoolClassData, setSchoolClassData] =
    useState<DeleteClassValidationZProps>({
      schoolClassId: "",
      schoolClassName: "",
      // schoolId: "",
      confirmDelete: false,
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  // const [, setSchoolSelectedData] = useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE AND RESET SCHOOL CLASS SELECT TO INDEX 0 WHEN SELECT SCHOOL
  // useEffect(() => {
  //   (
  //     document.getElementById("schoolClassSelect") as HTMLSelectElement
  //   ).selectedIndex = 0;
  //   setIsSelected(false);
  //   setSchoolClassData({
  //     ...schoolClassData,
  //     confirmDelete: false,
  //   });
  //   if (schoolClassData.schoolId !== "") {
  //     setSchoolSelectedData(
  //       schoolDatabaseData.find(({ id }) => id === schoolClassData.schoolId)
  //     );
  //   } else {
  //     setSchoolSelectedData(undefined);
  //   }
  // }, [schoolClassData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setSchoolClassData({
      ...schoolClassData,
      confirmDelete: false,
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
      // schoolId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    // (
    //   document.getElementById("schoolSelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setSchoolClassData({
      schoolClassId: "",
      schoolClassName: "",
      // schoolId: "",
      confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    // setValue("schoolId", schoolClassData.schoolId);
    setValue("schoolClassId", schoolClassData.schoolClassId);
    setValue("schoolClassName", schoolClassData.schoolClassName);
    setValue("confirmDelete", schoolClassData.confirmDelete);
  }, [schoolClassData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      // errors.schoolId,
      errors.schoolClassId,
      errors.schoolClassName,
      errors.confirmDelete,
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
    setIsSubmitting(true);

    // DELETE SCHOOL CLASS FUNCTION
    const deleteSchoolClass = async () => {
      try {
        await deleteDoc(doc(db, "schoolClasses", data.schoolClassId));
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

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o Colégio... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF SCHOOLCLASS EXISTS ON SOME STUDENT OR CURRICULUM ON DATABASE
    // STUDENTS IN THIS SCHOOLCLASS ARRAY
    const schoolClassExistsOnStudent: StudentSearchProps[] = [];

    // SEARCH CURRICULUM WITH THIS SCHOOLCLASS
    const schoolClassExistsOnCurriculum = curriculumDatabaseData.filter(
      (curriculum) => curriculum.schoolClassId === schoolClassData.schoolClassId
    );

    // SEARCH STUDENTS WITH THIS SCHOOLCLASS AND PUTTING ON ARRAY
    studentsDatabaseData.map((student) => {
      if (student.curriculumIds) {
        // ENROLLED STUDENTS
        student.curriculumIds.map((studentCurriculum) => {
          const foundedSchoolClassStudentWithCurriculum =
            schoolClassExistsOnCurriculum.find(
              (schoolCurriculum) => schoolCurriculum.id === studentCurriculum.id
            );
          if (foundedSchoolClassStudentWithCurriculum) {
            schoolClassExistsOnStudent.push(student);
          }
        });
        // EXPERIMENTAL STUDENTS
        student.experimentalCurriculumIds.map(
          (studentExperimentalCurriculum) => {
            const foundedSchoolClassStudentWithExperimentalCurriculum =
              schoolClassExistsOnCurriculum.find(
                (schoolCurriculum) =>
                  schoolCurriculum.id === studentExperimentalCurriculum.id
              );
            if (foundedSchoolClassStudentWithExperimentalCurriculum) {
              schoolClassExistsOnStudent.push(student);
            }
          }
        );
      }
    });

    // IF EXISTS, RETURN ERROR
    if (schoolClassExistsOnStudent.length !== 0) {
      return (
        setSchoolClassData({
          ...schoolClassData,
          confirmDelete: false,
        }),
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
        setSchoolClassData({
          ...schoolClassData,
          confirmDelete: false,
        }),
        setIsSubmitting(false),
        toast.error(
          `Ano Escolar incluído em ${schoolClassExistsOnCurriculum.length} ${
            schoolClassExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
          }, exclua ou altere primeiramente ${
            schoolClassExistsOnCurriculum.length === 1 ? "a Turma" : "as Turmas"
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
        {/* SCHOOL SELECT */}
        {/* <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.schoolId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setSchoolClassData({
                ...schoolClassData,
                schoolId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div> */}

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
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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

            {/* {schoolClassData.schoolId ? (
              <SelectOptions
                returnId
                dataType="schoolClasses"
                schoolId={schoolClassData.schoolId}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver os anos escolares disponíveis
                --{" "}
              </option>
            )} */}
          </select>
        </div>

        {isSelected ? (
          <>
            {/** CHECKBOX CONFIRM DELETE */}
            <div className="flex justify-center items-center gap-2 mt-6">
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
