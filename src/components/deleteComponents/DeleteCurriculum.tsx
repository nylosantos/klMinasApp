/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteCurriculumValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumWithNamesProps,
  DeleteCurriculumValidationZProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

export function DeleteCurriculum() {
  // GET GLOBAL DATA
  const {
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    isSubmitting,
    handleAllCurriculumDetails,
    handleCurriculumDetailsWithSchoolCourse,
    handleDeleteCurriculum,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CLASS DAY DATA
  // const [classDaysData, setClassDaysData] =
  //   useState<DeleteClassDaysValidationZProps>({
  //     classDayId: "",
  //   });

  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<DeleteCurriculumValidationZProps>({
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      schoolCourseId: "",
      // confirmDelete: false,
    });

  const [curriculumFormattedName, setCurriculumFormattedName] = useState({
    formattedName: "",
    schoolName: "",
    schoolClassName: "",
    schoolCourseName: "",
    scheduleName: "",
    classDayName: "",
    teacherName: "",
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
      setCurriculumFormattedName({
        ...curriculumFormattedName,
        schoolName: schoolSelectedData!.name,
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
      setCurriculumFormattedName({
        ...curriculumFormattedName,
        schoolClassName: schoolClassSelectedData!.name,
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
      setCurriculumFormattedName({
        ...curriculumFormattedName,
        schoolCourseName: schoolCourseSelectedData!.name,
      });
    }
  }, [schoolCourseSelectedData]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE DATA ARRAY WITH ALL OPTIONS OF SCHEDULES
  const [schedulesDetailsData, setSchedulesDetailsData] = useState<
    ScheduleSearchProps[]
  >([]);

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    setSchedulesDetailsData(schedulesDetailsData);
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
    CurriculumWithNamesProps[]
  >([]);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = () => {
    if (curriculumData.schoolCourseId === "all") {
      setCurriculumCoursesData(
        handleAllCurriculumDetails({
          schoolId: curriculumData.schoolId,
          schoolClassId: curriculumData.schoolClassId,
        })
      );
    } else {
      if (curriculumData.schoolCourseId) {
        setCurriculumCoursesData(
          handleCurriculumDetailsWithSchoolCourse({
            schoolId: curriculumData.schoolId,
            schoolClassId: curriculumData.schoolClassId,
            schoolCourseId: curriculumData.schoolCourseId,
          })
        );
      }
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleAvailableCoursesData();
  }, [
    curriculumData.schoolId,
    curriculumData.schoolCourseId,
    curriculumData.schoolClassId,
  ]);
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
      schoolCourseId: "",
    });
    setIsSelected(false);
  }, [curriculumData.schoolId]);

  // RESET ALL UNDER SCHOOL CLASS SELECT WHEN CHANGE SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolCourseId: "",
    });
    setIsSelected(false);
  }, [curriculumData.schoolClassId]);
  // -------------------------- END OF RESET SELECTS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  // const [isSubmitting, setIsSubmitting] = useState(false);
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
      schoolId: "",
      schoolClassId: "",
      schoolCourseId: "",
      // confirmDelete: false,
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
      schoolId: "",
      schoolClassId: "",
      schoolCourseId: "",
      // confirmDelete: false,
    });
    // setClassDaysData({
    //   classDayId: "",
    // });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("curriculumId", curriculumData.curriculumId);
    setValue("schoolId", curriculumData.schoolId);
    setValue("schoolClassId", curriculumData.schoolClassId);
    setValue("schoolCourseId", curriculumData.schoolCourseId);
    // setValue("confirmDelete", curriculumData.confirmDelete);
  }, [curriculumData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.curriculumId,
      errors.schoolId,
      errors.schoolClassId,
      errors.schoolCourseId,
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
  const handleSubmitDeleteCurriculum: SubmitHandler<
    DeleteCurriculumValidationZProps
  > = async (data) => {
    handleDeleteCurriculum(data.curriculumId, resetForm);
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Turma</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleSubmitDeleteCurriculum)}
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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
              setCurriculumData({
                ...curriculumData,
                schoolClassId: e.target.value,
              });
            }}
          >
            {curriculumData.schoolId ? (
              <SelectOptions
                returnId
                dataType="schoolClasses"
                schoolId={curriculumData.schoolId}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver os Anos Escolares disponíveis
                --{" "}
              </option>
            )}
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
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolCourseId
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolCourseId: e.target.value,
              });
            }}
          >
            {curriculumData.schoolId && curriculumData.schoolClassId ? (
              <SelectOptions
                returnId
                schoolId={curriculumData.schoolId}
                schoolClassId={curriculumData.schoolClassId}
                dataType="schoolCourses"
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver as modalidades disponíveis --{" "}
              </option>
            )}

            {/* <option value={"all"}>Todas as Modalidades</option> */}
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.schoolId &&
          curriculumData.schoolClassId &&
          curriculumData.schoolCourseId && (
            <>
              {/* CURRICULUM CARD SECTION TITLE */}
              <h1 className="font-bold text-2xl my-4">
                {curriculumFormattedName.schoolName} -{" "}
                {curriculumFormattedName.schoolClassName} -{" "}
                {curriculumFormattedName.schoolCourseName}
                {/* {curriculumData.schoolCourseId === "all"
                  ? "Todas as Modalidades"
                  : curriculumFormattedName.schoolCourseName} */}
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
                            // setClassDaysData({
                            //   classDayId: c.classDayId,
                            // });
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
                              {c.schoolName}
                            </span>
                          </p>
                          <p>
                            Ano Escolar:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.schoolClassNames.join(" - ")}
                            </span>
                          </p>
                          <p>
                            Modalidade:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.schoolCourseName}
                            </span>
                          </p>
                          {schedulesDetailsData.map(
                            (details: ScheduleSearchProps) =>
                              details.name === c.scheduleName && (
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
                              )
                          )}
                          <p>
                            Dias:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.classDayName}
                            </span>
                          </p>
                          <p>
                            Professor:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.teacherName}
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
                    Nenhuma Turma disponível com as opções selecionadas, tente
                    novamente.
                  </h1>
                </>
              )}
            </>
          )}

        {isSelected && (
          <>
            {curriculumCoursesData.length !== 0 && (
              <>
                {/** CHECKBOX CONFIRM DELETE */}
                {/* <div className="flex justify-center items-center gap-2 mt-6">
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
                    Confirmar exclusão da Turma
                  </label>
                </div> */}
              </>
            )}

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
                  ? "Nenhuma Turma encontrada"
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
        )}
      </form>
    </div>
  );
}
