/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteCurriculumValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  DeleteCurriculumValidationZProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteCurriculum() {
  // GET GLOBAL DATA
  const {
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    studentsDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<DeleteCurriculumValidationZProps>({
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      confirmDelete: false,
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (curriculumData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === curriculumData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [curriculumData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        school: schoolSelectedData!.name,
      });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASS
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === curriculumData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [curriculumData.schoolClassId]);

  // SET SCHOOL CLASS NAME WITH SCHOOL CLASS SELECTED DATA WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (schoolClassSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolClass: schoolClassSelectedData!.name,
      });
    }
  }, [schoolClassSelectedData]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
          ({ id }) => id === curriculumData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [curriculumData.schoolCourseId]);

  // SET SCHOOL COURSE NAME WITH SCHOOL COURSE SELECTED DATA WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolCourse: schoolCourseSelectedData!.name,
      });
    }
  }, [schoolCourseSelectedData]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE DATA ARRAY WITH ALL OPTIONS OF SCHEDULES
  const [schedulesDetailsData, setSchedulesDetailsData] = useState<
    ScheduleSearchProps[]
  >([]);

  // GETTING SCHEDULES DATA
  const handleSchedulesDetails = async () => {
    const q = query(collection(db, "schedules"));
    const querySnapshot = await getDocs(q);
    const promises: ScheduleSearchProps[] = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data() as ScheduleSearchProps;
      promises.push(promise);
    });
    setSchedulesDetailsData(promises);
  };

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    handleSchedulesDetails();
  }, []);

  // SET IS SELECTED WHEN SCHOOL, SCHOOL CLASS AND SCHOOL COURSE ARE CHOSEN
  useEffect(() => {
    if (
      curriculumData.schoolId !== "" &&
      curriculumData.schoolClassId !== "" &&
      curriculumData.schoolCourseId !== ""
    ) {
      setIsSelected(true);
    }
  }, [curriculumData]);

  // -------------------------- END OF SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [curriculumCoursesData, setCurriculumCoursesData] = useState<
    CurriculumSearchProps[]
  >([]);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = async () => {
    if (curriculumData.schoolCourseId === "all") {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", curriculumData.schoolId),
        where("schoolClassId", "==", curriculumData.schoolClassId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: CurriculumSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as CurriculumSearchProps;
        promises.push(promise);
      });
      setCurriculumCoursesData(promises);
    } else {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", curriculumData.schoolId),
        where("schoolClassId", "==", curriculumData.schoolClassId),
        where("schoolCourseId", "==", curriculumData.schoolCourseId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: CurriculumSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as CurriculumSearchProps;
        promises.push(promise);
      });
      setCurriculumCoursesData(promises);
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleAvailableCoursesData();
  }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER SCHOOL SELECT WHEN CHANGE SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolClassId: "",
      schoolClass: "",
      schoolCourseId: "",
      schoolCourse: "",
    });
  }, [curriculumData.schoolId]);

  // RESET ALL UNDER SCHOOL CLASS SELECT WHEN CHANGE SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolCourseId: "",
      schoolCourse: "",
    });
  }, [curriculumData.schoolClassId]);
  // -------------------------- END OF RESET SELECTS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteCurriculumValidationZProps>({
    resolver: zodResolver(deleteCurriculumValidationSchema),
    defaultValues: {
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setCurriculumData({
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("curriculumId", curriculumData.curriculumId);
    setValue("school", curriculumData.school);
    setValue("schoolId", curriculumData.schoolId);
    setValue("schoolClass", curriculumData.schoolClass);
    setValue("schoolClassId", curriculumData.schoolClassId);
    setValue("schoolCourse", curriculumData.schoolCourse);
    setValue("schoolCourseId", curriculumData.schoolCourseId);
    setValue("confirmDelete", curriculumData.confirmDelete);
  }, [curriculumData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.curriculumId,
      errors.school,
      errors.schoolId,
      errors.schoolClass,
      errors.schoolClassId,
      errors.schoolCourse,
      errors.schoolCourseId,
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
  const handleDeleteCurriculum: SubmitHandler<
    DeleteCurriculumValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // DELETE CURRICULUM FUNCTION
    const deleteCurriculum = async () => {
      try {
        await deleteDoc(doc(db, "curriculum", data.curriculumId));
        resetForm();
        toast.success(`Currículo excluído com sucesso! 👌`, {
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
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o Currículo... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF CURRICULUM CONTAINS STUDENTS
    // STUDENTS IN THIS CURRICULUM ARRAY
    const curriculumExistsOnStudent: StudentSearchProps[] = [];

    // SEARCH STUDENTS WITH THIS SCHOOL AND PUTTING ON ARRAY
    studentsDatabaseData.map((student) => {
      if (student.curriculumIds) {
        // ENROLLED STUDENTS
        student.curriculumIds.map((studentCurriculum) => {
          if (studentCurriculum.id === data.curriculumId) {
            curriculumExistsOnStudent.push(student);
          }
        });
        // EXPERIMENTAL STUDENTS
        student.experimentalCurriculumIds.map(
          (studentExperimentalCurriculum) => {
            if (studentExperimentalCurriculum.id === data.curriculumId) {
              curriculumExistsOnStudent.push(student);
            }
          }
        );
      }
    });

    // IF EXISTS, RETURN ERROR
    if (curriculumExistsOnStudent.length !== 0) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Currículo incluído em ${curriculumExistsOnStudent.length} ${
            curriculumExistsOnStudent.length === 1
              ? "cadastro de aluno"
              : "cadastros de alunos"
          }, exclua ou altere primeiramente ${
            curriculumExistsOnStudent.length === 1 ? "o aluno" : "os alunos"
          } e depois exclua o currículo... ❕`,
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
      deleteCurriculum();
    }

    // const curriculumRef = collection(db, "students");
    // const q = query(
    //   curriculumRef,
    //   where("curriculum", "array-contains-any", [data.curriculumId])
    // );
    // const querySnapshot = await getDocs(q);
    // const promises: StudentSearchProps[] = [];
    // querySnapshot.forEach((doc) => {
    //   const promise = doc.data() as StudentSearchProps;
    //   promises.push(promise);
    // });
    // Promise.all(promises).then((results) => {
    //   // IF EXISTS, RETURN ERROR
    //   if (results.length !== 0) {
    //     return (
    //       setIsSubmitting(false),
    //       toast.error(
    //         `Currículo incluído em ${results.length} ${
    //           results.length === 1 ? "cadastro de aluno" : "cadastros de alunos"
    //         }, exclua ou altere primeiramente ${
    //           results.length === 1 ? "o aluno" : "os alunos"
    //         } e depois exclua o currículo... ❕`,
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
    //     // IF NO EXISTS, DELETE
    //     deleteCurriculum();
    //   }
    // });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Currículo</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleDeleteCurriculum)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
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
              setCurriculumData({
                ...curriculumData,
                schoolId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

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
            Selecione a Turma:{" "}
          </label>
          <select
            id="schoolClassSelect"
            disabled={curriculumData.schoolId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumData.schoolId
                ? errors.schoolClassId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolClassId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              dataType="schoolClasses"
              schoolId={curriculumData.schoolId}
            />
          </select>
        </div>

        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.schoolCourseId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="schoolCourseSelect"
            disabled={curriculumData.schoolClassId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumData.schoolClassId
                ? errors.schoolCourseId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolCourseId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schoolCourses" />
            <option value={"all"}>Todas as Modalidades</option>
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.schoolId &&
        curriculumData.schoolClassId &&
        curriculumData.schoolCourseId ? (
          <>
            {/* CURRICULUM CARD SECTION TITLE */}
            <h1 className="font-bold text-2xl my-4">
              {schoolSelectedData?.name} - {schoolClassSelectedData?.name} -{" "}
              {curriculumData.schoolCourseId === "all"
                ? "Todas as Modalidades"
                : schoolCourseSelectedData?.name}
              :
            </h1>

            {/* SEPARATOR */}
            <hr className="pb-4" />

            {curriculumCoursesData.length !== 0 ? (
              <>
                {/* CURRICULUM CARD */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {curriculumCoursesData.map((c) => (
                    <div
                      className={
                        errors.curriculumId
                          ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                          : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                      }
                      key={c.id}
                    >
                      <input
                        type="radio"
                        id={c.id}
                        name="curriculumSelect"
                        className="text-klGreen-500 dark:text-klGreen-500 border-none"
                        value={c.id}
                        onChange={(e) => {
                          setCurriculumData({
                            ...curriculumData,
                            curriculumId: e.target.value,
                          });
                        }}
                      />
                      <label
                        htmlFor="curriculumSelect"
                        className="flex flex-col gap-4"
                      >
                        <p>
                          Colégio:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.school}
                          </span>
                        </p>
                        <p>
                          Turma:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.schoolClass}
                          </span>
                        </p>
                        <p>
                          Modalidade:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.schoolCourse}
                          </span>
                        </p>
                        {schedulesDetailsData.map(
                          (details: ScheduleSearchProps) =>
                            details.name === c.schedule ? (
                              <p>
                                Horário:{" "}
                                <span className="text-red-600 dark:text-yellow-500">
                                  De{" "}
                                  {`${details.classStart.slice(0, 2)}h${
                                    details.classStart.slice(3, 5) === "00"
                                      ? ""
                                      : details.classStart.slice(3, 5) + "min"
                                  } a ${details.classEnd.slice(0, 2)}h${
                                    details.classEnd.slice(3, 5) === "00"
                                      ? ""
                                      : details.classEnd.slice(3, 5) + "min"
                                  }`}
                                </span>
                              </p>
                            ) : null
                        )}
                        <p>
                          Dias:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.classDay}
                          </span>
                        </p>
                        <p>
                          Professor:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.teacher}
                          </span>
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* CURRICULUM CARD EMPTY SUBTITLE */}
                <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
                  Nenhum currículo disponível com as opções selecionadas, tente
                  novamente.
                </h1>
              </>
            )}
          </>
        ) : null}

        {isSelected ? (
          <>
            {curriculumCoursesData.length !== 0 ? (
              <>
                {/** CHECKBOX CONFIRM DELETE */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmDelete"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={curriculumData.confirmDelete}
                    onChange={() => {
                      setCurriculumData({
                        ...curriculumData,
                        confirmDelete: !curriculumData.confirmDelete,
                      });
                    }}
                  />
                  <label htmlFor="confirmDelete" className="text-sm">
                    Confirmar exclusão do Currículo
                  </label>
                </div>
              </>
            ) : null}

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={
                  curriculumCoursesData.length === 0 ? true : isSubmitting
                }
                className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
              >
                {curriculumCoursesData.length === 0
                  ? "Nenhum currículo encontrado"
                  : !isSubmitting
                  ? "Excluir"
                  : "Excluindo"}
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
