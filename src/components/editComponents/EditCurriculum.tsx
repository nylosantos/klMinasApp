/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  doc, getFirestore, updateDoc
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editCurriculumValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  EditCurriculumValidationZProps,
  SchoolClassSearchProps,
  SchoolSearchProps,
  ScheduleSearchProps,
  ClassDaySearchProps,
  TeacherSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditCurriculum() {
  // GET GLOBAL DATA
  const {
    schoolDatabaseData,
    schoolClassDatabaseData,
    curriculumDatabaseData,
    scheduleDatabaseData,
    classDaysDatabaseData,
    teacherDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;
  // STUDENT DATA
  const [curriculumEditData, setCurriculumEditData] =
    useState<EditCurriculumValidationZProps>({
      name: "",
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      schedule: "",
      scheduleId: "",
      classDay: "",
      classDayId: "",
      teacher: "",
      teacherId: "",
    });

  // CURRICULUM NAME FORMATTED STATE
  const [curriculumName, setCurriculumName] = useState({
    name: "",
  });

  // SET CURRICULUM FORMATTED NAME WHEN CHANGE CURRICULUM EDIT SELECT
  useEffect(() => {
    setCurriculumName({
      name: `${curriculumEditData.school} | ${
        curriculumEditData.schoolCourse
      } | ${
        scheduleSelectedData
          ? scheduleSelectedData.name
          : curriculumEditData.schedule
      } | ${curriculumEditData.classDay} | ${
        curriculumEditData.schoolClass
      } | Professor: ${curriculumEditData.teacher}`,
    });
  }, [curriculumEditData]);

  // SET CURRICULUM EDIT DATA NAME WHEN CHANGE CURRICULUM FORMATTED NAME
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      name: curriculumName.name,
    });
  }, [curriculumName.name]);

  // CURRICULUM SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE AND RESET SELECTS ABOVE SELECT SCHOOL WHEN SELECT SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setIsEdit(false);
    setSchoolClassSelectedData(undefined);
    setCurriculumSelectedData(undefined);
    if (curriculumEditData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === curriculumEditData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [curriculumEditData.schoolId]);

  // SET CURRICULUM EDIT DATA WHEN SCHOOL CHANGE
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      school: schoolSelectedData ? schoolSelectedData.name : "",
    });
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE AND RESET SELECTS ABOVE SELECT SCHOOL CLASS WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setIsEdit(false);
    setCurriculumSelectedData(undefined);
    if (curriculumEditData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === curriculumEditData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [curriculumEditData.schoolClassId]);

  // SET CURRICULUM EDIT DATA WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      schoolClass: schoolClassSelectedData ? schoolClassSelectedData.name : "",
    });
  }, [schoolClassSelectedData]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumEditData.curriculumId !== "") {
      setIsSelected(true);
      setIsEdit(false);
      setCurriculumSelectedData(
        curriculumDatabaseData.find(
          ({ id }) => id === curriculumEditData.curriculumId
        )
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumEditData.curriculumId]);

  // SET CURRICULUM EDIT DATA WHEN CURRICULUM CHANGE
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      schoolCourseId: curriculumSelectedData
        ? curriculumSelectedData.schoolCourseId
        : "",
      schoolCourse: curriculumSelectedData
        ? curriculumSelectedData.schoolCourse
        : "",
      scheduleId: curriculumSelectedData
        ? curriculumSelectedData.scheduleId
        : "",
      schedule: curriculumSelectedData ? curriculumSelectedData.schedule : "",
      classDayId: curriculumSelectedData
        ? curriculumSelectedData.classDayId
        : "",
      classDay: curriculumSelectedData ? curriculumSelectedData.classDay : "",
      teacherId: curriculumSelectedData
        ? curriculumSelectedData.teacherId
        : "Jesus amado",
      teacher: curriculumSelectedData
        ? curriculumSelectedData.teacher
        : "Jesus amado Nome",
    });
  }, [curriculumSelectedData, curriculumEditData.curriculumId]);
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE SELECTED STATE DATA
  const [scheduleSelectedData, setScheduleSelectedData] =
    useState<ScheduleSearchProps>();

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    if (curriculumEditData.scheduleId !== "") {
      setScheduleSelectedData(
        scheduleDatabaseData.find(
          ({ id }) => id === curriculumEditData.scheduleId
        )
      );
    } else {
      setScheduleSelectedData(undefined);
    }
  }, [curriculumEditData.scheduleId]);

  // SET CURRICULUM EDIT DATA WHEN SCHEDULE CHANGE
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      schedule: scheduleSelectedData ? scheduleSelectedData.name : "",
      scheduleId: scheduleSelectedData ? scheduleSelectedData.id : "",
    });
  }, [scheduleSelectedData]);
  // -------------------------- END OF SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //
  // CLASS DAY SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    if (curriculumEditData.classDayId !== "") {
      setClassDaySelectedData(
        classDaysDatabaseData.find(
          ({ id }) => id === curriculumEditData.classDayId
        )
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [curriculumEditData.classDayId]);

  // SET CURRICULUM EDIT DATA WHEN CLASS DAY CHANGE
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      classDay: classDaySelectedData ? classDaySelectedData.name : "",
      classDayId: classDaySelectedData ? classDaySelectedData.id : "",
    });
  }, [classDaySelectedData]);
  // -------------------------- END OF SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- TEACHER SELECT STATES AND FUNCTIONS -------------------------- //
  // TEACHER SELECTED STATE DATA
  const [teacherSelectedData, setTeacherSelectedData] =
    useState<TeacherSearchProps>();

  // SET TEACHER SELECTED STATE WHEN SELECT TEACHER
  useEffect(() => {
    if (curriculumEditData.teacherId !== "") {
      setTeacherSelectedData(
        teacherDatabaseData.find(
          ({ id }) => id === curriculumEditData.teacherId
        )
      );
    } else {
      setTeacherSelectedData(undefined);
    }
  }, [curriculumEditData.teacherId]);

  // SET CURRICULUM EDIT DATA WHEN TEACHER CHANGE
  useEffect(() => {
    setCurriculumEditData({
      ...curriculumEditData,
      teacher: teacherSelectedData ? teacherSelectedData.name : "",
      teacherId: teacherSelectedData ? teacherSelectedData.id : "",
    });
  }, [teacherSelectedData]);
  // -------------------------- END OF TEACHER SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditCurriculumValidationZProps>({
    resolver: zodResolver(editCurriculumValidationSchema),
    defaultValues: {
      name: "",
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      schedule: "",
      scheduleId: "",
      classDay: "",
      classDayId: "",
      teacher: "",
      teacherId: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumEditData({
      name: "",
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      schedule: "",
      scheduleId: "",
      classDay: "",
      classDayId: "",
      teacher: "",
      teacherId: "",
    });
    setIsSelected(false);
    setIsEdit(false);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", curriculumEditData.name);
    setValue("curriculumId", curriculumEditData.curriculumId);
    setValue("school", curriculumEditData.school);
    setValue("schoolId", curriculumEditData.schoolId);
    setValue("schoolClass", curriculumEditData.schoolClass);
    setValue("schoolClassId", curriculumEditData.schoolClassId);
    setValue("schoolCourse", curriculumEditData.schoolCourse);
    setValue("schoolCourseId", curriculumEditData.schoolCourseId);
    setValue("schedule", curriculumEditData.schedule);
    setValue("scheduleId", curriculumEditData.scheduleId);
    setValue("classDay", curriculumEditData.classDay);
    setValue("classDayId", curriculumEditData.classDayId);
    setValue("teacher", curriculumEditData.teacher);
    setValue("teacherId", curriculumEditData.teacherId);
  }, [curriculumEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.curriculumId,
      errors.school,
      errors.schoolId,
      errors.schoolClass,
      errors.schoolClassId,
      errors.schoolCourse,
      errors.schoolCourseId,
      errors.schedule,
      errors.scheduleId,
      errors.classDay,
      errors.classDayId,
      errors.teacher,
      errors.teacherId,
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
  const handleEditCurriculum: SubmitHandler<
    EditCurriculumValidationZProps
  > = async (data) => {
    // EDIT CURRICULUM FUNCTION
    const editCurriculum = async () => {
      try {
        await updateDoc(
          doc(db, "curriculum", curriculumEditData.curriculumId),
          {
            name: data.name,
            schoolClass: data.schoolClass,
            schoolClassId: data.schoolClassId,
            schedule: data.schedule,
            scheduleId: data.scheduleId,
            classDay: data.classDay,
            classDayId: data.classDayId,
            teacher: data.teacher,
            teacherId: data.teacherId,
          }
        );
        resetForm();
        toast.success(`Currículo alterado com sucesso! 👌`, {
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

    setIsSubmitting(true);

    // CHECKING IF CURRICULUM EXISTS ON DATABASE

    const curriculumExists = curriculumDatabaseData.find(
      (curriculum) => curriculum.id === curriculumEditData.curriculumId
    );
    if (!curriculumExists) {
      // IF NOT EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(`Currículo não existe no banco de dados... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      // IF EXISTS, EDIT
      editCurriculum();
    }
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Editar Currículo</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditCurriculum)}
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
              setCurriculumEditData({
                ...curriculumEditData,
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
            disabled={curriculumEditData.schoolId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumEditData.schoolId
                ? errors.schoolClassId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumEditData({
                ...curriculumEditData,
                schoolClassId: e.target.value,
              });
            }}
          >
            {curriculumEditData.schoolId ? (
              <SelectOptions
                returnId
                dataType="schoolClasses"
                schoolId={curriculumEditData.schoolId}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver as turmas disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="curriculumSelect"
            className={
              errors.curriculumId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Currículo:{" "}
          </label>
          <select
            id="curriculumSelect"
            defaultValue={" -- select an option -- "}
            className={
              curriculumEditData.schoolClassId
                ? errors.curriculumId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="curriculumSelect"
            onChange={(e) => {
              setCurriculumEditData({
                ...curriculumEditData,
                curriculumId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            {curriculumEditData.schoolClassId ? (
              <SelectOptions
                returnId
                dataType="curriculum"
                displaySchoolCourseAndSchedule
                schoolId={curriculumEditData.schoolId}
                schoolClassId={curriculumEditData.schoolClassId}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma Turma para ver os currículos disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {isSelected ? (
          <>
            {/* EDIT BUTTON */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
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
            {/* CURRICULUM NAME */}
            <div className="flex gap-2 items-center">
              <label htmlFor="name" className="w-1/4 text-right">
                Nome:{" "}
              </label>
              <input
                type="text"
                name="name"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={curriculumName.name}
              />
            </div>

            {/* SCHOOL NAME */}
            <div className="flex gap-2 items-center">
              <label htmlFor="schoolName" className="w-1/4 text-right">
                Colégio:{" "}
              </label>
              <input
                type="text"
                name="schoolName"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={curriculumEditData.school}
              />
            </div>

            {/* SCHOOL CLASS NAME */}
            <div className="flex gap-2 items-center">
              <label htmlFor="schoolClass" className="w-1/4 text-right">
                Turma:{" "}
              </label>
              <input
                type="text"
                name="schoolClass"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={curriculumEditData.schoolClass}
              />
            </div>

            {/* SCHOOL COURSE NAME */}
            <div className="flex gap-2 items-center">
              <label htmlFor="schoolCourse" className="w-1/4 text-right">
                Modalidade:{" "}
              </label>
              <input
                type="text"
                name="schoolCourse"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={curriculumEditData.schoolCourse}
              />
            </div>

            {/* EDIT SCHEDULE TITLE */}
            <div className="flex gap-2 items-center">
              <div className="w-1/4"></div>
              <div className="w-3/4">
                <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                  Altere o Horário:
                </h1>
              </div>
            </div>

            {/* SCHEDULE SELECT */}
            {/* {scheduleSelectedData !== undefined &&
            scheduleSelectedData.id !== undefined ? ( */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="scheduleSelect"
                className={
                  errors.scheduleId
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Horário:{" "}
              </label>
              <select
                id="scheduleSelect"
                disabled={isSubmitting}
                value={
                  scheduleSelectedData?.id === curriculumEditData.scheduleId
                    ? scheduleSelectedData.id
                    : curriculumEditData.scheduleId
                }
                className={
                  errors.scheduleId
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="scheduleSelect"
                onChange={(e) => {
                  setCurriculumEditData({
                    ...curriculumEditData,
                    scheduleId: e.target.value,
                    schedule: scheduleSelectedData!.name,
                  });
                }}
              >
                <SelectOptions
                  returnId
                  dataType="schedules"
                  schoolId={curriculumEditData.schoolId}
                  setSchedule
                  scheduleId={scheduleSelectedData?.id}
                />
              </select>
            </div>
            {/* ) : null} */}

            {/* TRANSITION START */}
            <div className="flex gap-2 items-center">
              <label htmlFor="transitionStart" className="w-1/4 text-right">
                Início da Transição:{" "}
              </label>
              <input
                type="text"
                name="transitionStart"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={scheduleSelectedData?.transitionStart}
              />
            </div>

            {/* TRANSITION END */}
            <div className="flex gap-2 items-center">
              <label htmlFor="transitionEnd" className="w-1/4 text-right">
                Fim da Transição:{" "}
              </label>
              <input
                type="text"
                name="transitionEnd"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={scheduleSelectedData?.transitionEnd}
              />
            </div>

            {/* CLASS START */}
            <div className="flex gap-2 items-center">
              <label htmlFor="classStart" className="w-1/4 text-right">
                Início da Aula:{" "}
              </label>
              <input
                type="text"
                name="classStart"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={scheduleSelectedData?.classStart}
              />
            </div>

            {/* CLASS END */}
            <div className="flex gap-2 items-center">
              <label htmlFor="classEnd" className="w-1/4 text-right">
                Fim da Aula:{" "}
              </label>
              <input
                type="text"
                name="classEnd"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={scheduleSelectedData?.classEnd}
              />
            </div>

            {/* EXIT */}
            <div className="flex gap-2 items-center">
              <label htmlFor="exit" className="w-1/4 text-right">
                Saída:{" "}
              </label>
              <input
                type="text"
                name="exit"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={scheduleSelectedData?.exit}
              />
            </div>

            {/* EDIT CLASS DAY TITLE */}
            <div className="flex gap-2 items-center">
              <div className="w-1/4"></div>
              <div className="w-3/4">
                <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                  Altere os Dias de Aula:
                </h1>
              </div>
            </div>

            {/* CLASS DAY SELECT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="classDaySelect"
                className={
                  errors.classDayId
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Dias de Aula:{" "}
              </label>
              <select
                id="classDaySelect"
                disabled={isSubmitting}
                value={
                  classDaySelectedData?.id === curriculumEditData.classDayId
                    ? classDaySelectedData.id
                    : curriculumEditData.classDayId
                }
                className={
                  errors.classDayId
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="classDaySelect"
                onChange={(e) => {
                  setCurriculumEditData({
                    ...curriculumEditData,
                    classDayId: e.target.value,
                  });
                }}
              >
                <SelectOptions
                  returnId
                  dataType="classDays"
                  setClassDay
                  classDayId={classDaySelectedData?.id}
                />
              </select>
            </div>

            {/* EDIT TEACHER TITLE */}
            <div className="flex gap-2 items-center">
              <div className="w-1/4"></div>
              <div className="w-3/4">
                <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                  Altere o Professor:
                </h1>
              </div>
            </div>

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
                Professor:{" "}
              </label>
              <select
                id="teacherSelect"
                disabled={isSubmitting}
                value={
                  teacherSelectedData?.id === curriculumEditData.teacherId
                    ? teacherSelectedData.id
                    : curriculumEditData.teacherId
                }
                className={
                  errors.teacherId
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="teacherSelect"
                onChange={(e) => {
                  setCurriculumEditData({
                    ...curriculumEditData,
                    teacherId: e.target.value,
                  });
                }}
              >
                <SelectOptions
                  returnId
                  dataType="teachers"
                  setTeacher
                  teacherId={teacherSelectedData?.id}
                />
              </select>
            </div>

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
          </>
        ) : null}
      </form>
    </div>
  );
}
