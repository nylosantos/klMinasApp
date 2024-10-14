/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { createCurriculumValidationSchema } from "../../@types/zodValidation";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  CreateClassDaysValidationZProps,
  CreateCurriculumValidationZProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  TeacherSearchProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { classDayIndexNames } from "../../custom";
import { ClassDays } from "../formComponents/ClassDays";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCurriculum() {
  // GET GLOBAL DATA
  const {
    curriculumDatabaseData,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<CreateCurriculumValidationZProps>({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
      scheduleId: "",
      scheduleName: "",
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
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
        schoolName: schoolSelectedData!.name,
      });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
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
      setCurriculumData({
        ...curriculumData,
        schoolCourseName: schoolCourseSelectedData!.name,
      });
    }
  }, [schoolCourseSelectedData]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE SELECTED STATE DATA
  const [scheduleSelectedData, setScheduleSelectedData] =
    useState<ScheduleSearchProps>();

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    if (curriculumData.scheduleId !== "") {
      setScheduleSelectedData(
        scheduleDatabaseData.find(({ id }) => id === curriculumData.scheduleId)
      );
    } else {
      setScheduleSelectedData(undefined);
    }
  }, [curriculumData.scheduleId]);

  // SET SCHEDULE NAME WITH SCHEDULE SELECTED DATA WHEN SELECT SCHEDULE
  useEffect(() => {
    if (scheduleSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        scheduleName: scheduleSelectedData!.name,
      });
    }
  }, [scheduleSelectedData]);
  // -------------------------- END OF SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //
  // CLASS DAY SELECTED STATE DATA
  const classDaysCommonId = uuidv4();

  // CLASS DAY DATA
  const [classDaysData, setClassDaysData] =
    useState<CreateClassDaysValidationZProps>({
      name: "",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
    });

  // CLASS DAY NAME FORMAT
  const [classDayName, setClassDayName] = useState<string[]>([]);

  // TOGGLE CLASS DAYS VALUE FUNCTION
  function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
    setClassDaysData({ ...classDaysData, [day]: value });
    if (value) {
      classDayIndexNames.map((dayIndex) => {
        if (dayIndex.id === day) {
          if (dayIndex.name === "Domingo") {
            setClassDayName((classDayName) => ["Domingo", ...classDayName]);
          }
          if (dayIndex.name === "Segunda") {
            const foundSunday = classDayName.findIndex(
              (name) => name === "Domingo"
            );
            if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Segunda",
                ...classDayName.slice(insertAt),
              ]);
            } else {
              setClassDayName((classDayName) => ["Segunda", ...classDayName]);
            }
          }
          if (dayIndex.name === "Terça") {
            const foundSunday = classDayName.findIndex(
              (name) => name === "Domingo"
            );
            const foundMonday = classDayName.findIndex(
              (name) => name === "Segunda"
            );
            if (foundMonday !== -1) {
              const insertAt = foundMonday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Terça",
                ...classDayName.slice(insertAt),
              ]);
            } else if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Terça",
                ...classDayName.slice(insertAt),
              ]);
            } else {
              setClassDayName((classDayName) => ["Terça", ...classDayName]);
            }
          }
          if (dayIndex.name === "Quarta") {
            const foundSunday = classDayName.findIndex(
              (name) => name === "Domingo"
            );
            const foundMonday = classDayName.findIndex(
              (name) => name === "Segunda"
            );
            const foundTuesday = classDayName.findIndex(
              (name) => name === "Terça"
            );
            if (foundTuesday !== -1) {
              const insertAt = foundTuesday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Quarta",
                ...classDayName.slice(insertAt),
              ]);
            } else if (foundMonday !== -1) {
              const insertAt = foundMonday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Quarta",
                ...classDayName.slice(insertAt),
              ]);
            } else if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Quarta",
                ...classDayName.slice(insertAt),
              ]);
            } else {
              setClassDayName((classDayName) => ["Quarta", ...classDayName]);
            }
          }
          if (dayIndex.name === "Quinta") {
            const foundSaturday = classDayName.findIndex(
              (name) => name === "Sábado"
            );
            const foundFriday = classDayName.findIndex(
              (name) => name === "Sexta"
            );
            if (foundFriday !== -1) {
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, foundFriday),
                "Quinta",
                ...classDayName.slice(foundFriday),
              ]);
            } else if (foundSaturday !== -1) {
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, foundSaturday),
                "Quinta",
                ...classDayName.slice(foundSaturday),
              ]);
            } else {
              setClassDayName((classDayName) => [...classDayName, "Quinta"]);
            }
          }
          if (dayIndex.name === "Sexta") {
            const foundSaturday = classDayName.findIndex(
              (name) => name === "Sábado"
            );
            if (foundSaturday !== -1) {
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, foundSaturday),
                "Sexta",
                ...classDayName.slice(foundSaturday),
              ]);
            } else {
              setClassDayName((classDayName) => [...classDayName, "Sexta"]);
            }
          }
          if (dayIndex.name === "Sábado") {
            setClassDayName((classDayName) => [...classDayName, "Sábado"]);
          }
        }
      });
    } else {
      classDayIndexNames.map((dayIndex) => {
        if (dayIndex.id === day) {
          if (dayIndex.name === "Domingo") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Domingo")
            );
          }
          if (dayIndex.name === "Segunda") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Segunda")
            );
          }
          if (dayIndex.name === "Terça") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Terça")
            );
          }
          if (dayIndex.name === "Quarta") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Quarta")
            );
          }
          if (dayIndex.name === "Quinta") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Quinta")
            );
          }
          if (dayIndex.name === "Sexta") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Sexta")
            );
          }
          if (dayIndex.name === "Sábado") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Sábado")
            );
          }
        }
      });
    }
  }

  // const [classDaySelectedData, setClassDaySelectedData] =
  //   useState<ClassDaySearchProps>();

  // // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  // useEffect(() => {
  //   if (curriculumData.classDayId !== "") {
  //     setClassDaySelectedData(
  //       classDaysDatabaseData.find(({ id }) => id === curriculumData.classDayId)
  //     );
  //   } else {
  //     setClassDaySelectedData(undefined);
  //   }
  // }, [curriculumData.classDayId]);

  // // SET CLASS DAY NAME WITH CLASS DAY SELECTED DATA WHEN SELECT CLASS DAY
  // useEffect(() => {
  //   if (classDaySelectedData !== undefined) {
  //     setCurriculumData({
  //       ...curriculumData,
  //       classDayName: classDaySelectedData!.name,
  //     });
  //   }
  // }, [classDaySelectedData]);
  // -------------------------- END OF CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- TEACHER SELECT STATES AND FUNCTIONS -------------------------- //
  // TEACHER SELECTED STATE DATA
  const [teacherSelectedData, setTeacherSelectedData] =
    useState<TeacherSearchProps>();

  // SET TEACHER SELECTED STATE WHEN SELECT TEACHER
  useEffect(() => {
    if (curriculumData.teacherId !== "") {
      setTeacherSelectedData(
        teacherDatabaseData.find(({ id }) => id === curriculumData.teacherId)
      );
    } else {
      setTeacherSelectedData(undefined);
    }
  }, [curriculumData.teacherId]);

  // SET TEACHER NAME WITH TEACHER SELECTED DATA WHEN SELECT TEACHER
  useEffect(() => {
    if (teacherSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        teacherName: teacherSelectedData!.name,
      });
    }
  }, [teacherSelectedData]);
  // -------------------------- END OF TEACHER SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER SCHOOL SELECT WHEN CHANGE SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    // (
    //   document.getElementById("classDaySelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
      scheduleId: "",
      scheduleName: "",
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    });
  }, [curriculumData.schoolId]);

  // RESET ALL UNDER SCHOOL CLASS SELECT WHEN CHANGE SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    // (
    //   document.getElementById("classDaySelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolCourseId: "",
      schoolCourseName: "",
      scheduleId: "",
      scheduleName: "",
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    });
  }, [curriculumData.schoolClassId]);

  // RESET ALL UNDER SCHOOL COURSE SELECT WHEN CHANGE SCHOOL COURSE
  useEffect(() => {
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    // (
    //   document.getElementById("classDaySelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      scheduleId: "",
      scheduleName: "",
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    });
  }, [curriculumData.schoolCourseId]);

  // RESET ALL UNDER SCHEDULE SELECT WHEN CHANGE SCHEDULE
  useEffect(() => {
    // (
    //   document.getElementById("classDaySelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    });
  }, [curriculumData.scheduleId]);

  // RESET ALL UNDER CLASS DAY SELECT WHEN CHANGE CLASS DAY
  useEffect(() => {
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    });
  }, [curriculumData.classDayId]);

  // RESET CONFIRM INSERT WHEN CHANGE TEACHER
  useEffect(() => {
    setCurriculumData({
      ...curriculumData,
      confirmInsert: false,
    });
  }, [curriculumData.teacherId]);
  // -------------------------- END OF RESET SELECTS -------------------------- //

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCurriculumValidationZProps>({
    resolver: zodResolver(createCurriculumValidationSchema),
    defaultValues: {
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
      scheduleId: "",
      scheduleName: "",
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setClassDaysData({
      name: "",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
    });
    setClassDayName([]);
    setCurriculumData({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
      scheduleId: "",
      scheduleName: "",
      classDayId: "",
      classDayName: "",
      teacherId: "",
      teacherName: "",
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolId", curriculumData.schoolId);
    setValue("schoolName", curriculumData.schoolName);
    setValue("schoolClassId", curriculumData.schoolClassId);
    setValue("schoolClassName", curriculumData.schoolClassName);
    setValue("schoolCourseId", curriculumData.schoolCourseId);
    setValue("schoolCourseName", curriculumData.schoolCourseName);
    setValue("scheduleId", curriculumData.scheduleId);
    setValue("scheduleName", curriculumData.scheduleName);
    setValue("classDayId", classDaysCommonId);
    setValue("classDayName", classDayName.join(" - "));
    setValue("teacherId", curriculumData.teacherId);
    setValue("teacherName", curriculumData.teacherName);
    setValue("confirmInsert", curriculumData.confirmInsert);
  }, [curriculumData, classDaysData, classDayName]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolId,
      errors.schoolName,
      errors.schoolClassId,
      errors.schoolClassName,
      errors.schoolCourseId,
      errors.schoolCourseName,
      errors.scheduleId,
      errors.scheduleName,
      errors.classDayId,
      errors.classDayName,
      errors.teacherId,
      errors.teacherName,
      errors.confirmInsert,
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
  const handleAddCurriculum: SubmitHandler<
    CreateCurriculumValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar a Turma... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }
    
    const curriculumFormattedName = `${data.schoolName} | ${data.schoolCourseName} | ${data.scheduleName} | ${data.classDayName} | Professor: ${data.teacherName}`;
    
    // CHECK IF ANY DAY WAS PICKED
    if (
      !classDaysData.sunday &&
      !classDaysData.monday &&
      !classDaysData.tuesday &&
      !classDaysData.wednesday &&
      !classDaysData.thursday &&
      !classDaysData.friday &&
      !classDaysData.saturday
    ) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, selecione algum dia para adicionar a Turma ${curriculumFormattedName}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ADD CLASS DAY FUNCTION
    const addClassDays = async () => {
      const daysIncluded: number[] = [];
      if (classDaysData.sunday) {
        daysIncluded.push(0);
      }
      if (classDaysData.monday) {
        daysIncluded.push(1);
      }
      if (classDaysData.tuesday) {
        daysIncluded.push(2);
      }
      if (classDaysData.wednesday) {
        daysIncluded.push(3);
      }
      if (classDaysData.thursday) {
        daysIncluded.push(4);
      }
      if (classDaysData.friday) {
        daysIncluded.push(5);
      }
      if (classDaysData.saturday) {
        daysIncluded.push(6);
      }
      try {
        await setDoc(doc(db, "classDays", classDaysCommonId), {
          id: classDaysCommonId,
          name: classDayName.join(" - "),
          indexDays: daysIncluded,
          indexNames: classDayName,
          timestamp: serverTimestamp(),
        });
        resetForm();
        // toast.success(`${classDayName.join(" - ")} criado com sucesso! 👌`, {
        //   theme: "colored",
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   autoClose: 3000,
        // });
        // setIsSubmitting(false);
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

    // ADD CURRICULUM FUNCTION
    const addCurriculum = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "curriculum", commonId), {
          id: commonId,
          name: curriculumFormattedName,
          schoolId: data.schoolId,
          school: data.schoolName,
          schoolClassId: data.schoolClassId,
          schoolClass: data.schoolClassName,
          schoolCourseId: data.schoolCourseId,
          schoolCourse: data.schoolCourseName,
          scheduleId: data.scheduleId,
          schedule: data.scheduleName,
          classDayId: data.classDayId,
          classDay: data.classDayName,
          teacherId: data.teacherId,
          teacher: data.teacherName,
          students: [],
          experimentalStudents: [],
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`Turma criada com sucesso! 👌`, {
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

    // CHECKING IF CURRICULUM EXISTS ON DATABASE
    const curriculumExists = curriculumDatabaseData.find(
      (curriculum) =>
        curriculum.school === data.schoolName &&
        curriculum.schoolClass === data.schoolClassName &&
        curriculum.schoolCourse === data.schoolCourseName &&
        curriculum.schedule === data.scheduleName &&
        curriculum.classDay === data.classDayName &&
        curriculum.teacher === data.teacherName
    );
    // IF EXISTS, RETURN ERROR
    if (curriculumExists) {
      return (
        setIsSubmitting(false),
        toast.error(`Turma já existe no nosso banco de dados... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      // IF NOT EXISTS, CREATE CLASSDAYS AND CURRICULUM
      addClassDays();
      addCurriculum();
    }
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Turma TESTANDO</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddCurriculum)}
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
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolCourseId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
          </select>
        </div>

        {/* SCHEDULE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="scheduleSelect"
            className={
              errors.scheduleId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Horário:{" "}
          </label>
          <select
            id="scheduleSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.scheduleId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="scheduleSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                scheduleId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              dataType="schedules"
              schoolId={curriculumData.schoolId}
            />
          </select>
        </div>

        {/* CLASS DAYS SELECT */}
        {/* <div className="flex gap-2 items-center">
          <label
            htmlFor="classDaySelect"
            className={
              errors.classDayId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione os Dias de Aula:{" "}
          </label>
          <select
            id="classDaySelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.classDayId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="classDaySelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                classDayId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="classDays" />
          </select>
        </div> */}

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
              setCurriculumData({
                ...curriculumData,
                teacherId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="teachers" />
          </select>
        </div>

        {/* CLASSDAY IDENTIFIER */}
        <div className="hidden gap-2 items-center">
          <label htmlFor="classDaysName" className="w-1/4 text-right">
            Identificador:{" "}
          </label>
          <input
            type="text"
            name="classDaysName"
            disabled={isSubmitting}
            readOnly
            placeholder="Selecione os dias para formar o Identificador dos Dias de Aula"
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            value={classDayName.length > 0 ? classDayName.join(" - ") : ""}
          />
        </div>

        {/* DAYS PICKER */}
        <ClassDays classDay={classDaysData} toggleClassDays={toggleClassDays} />

        {/* CURRICULUM NAME */}
        <div className="flex gap-2 items-center">
          <label htmlFor="curriculumName" className="w-1/4 text-right">
            Nome:{" "}
          </label>
          <input
            readOnly
            type="text"
            name="curriculumName"
            disabled
            placeholder="Escolha as opções acima para visualizar o nome da Turma"
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            value={
              curriculumData.schoolName &&
              curriculumData.schoolCourseName &&
              curriculumData.scheduleName &&
              classDayName.length > 0 &&
              curriculumData.schoolClassName &&
              curriculumData.teacherName
                ? `${curriculumData.schoolName} | ${
                    curriculumData.schoolCourseName
                  } | ${curriculumData.scheduleName} | ${classDayName.join(
                    " - "
                  )} | ${curriculumData.schoolClassName} | Professor: ${
                    curriculumData.teacherName
                  }`
                : ""
            }
          />
        </div>

        {/* CURRICULUM DESCRIPTON CARD */}
        {curriculumData.schoolName &&
          curriculumData.schoolCourseName &&
          curriculumData.scheduleName &&
          classDayName.length > 0 &&
          curriculumData.teacherName && (
            <>
              <div className="flex gap-2 items-center justify-center mt-2">
                <div className="flex flex-col w-2/6 items-left p-4 my-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left">
                  <p>
                    Colégio:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumData.schoolName}
                    </span>
                  </p>

                  <p>
                    Ano Escolar:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumData.schoolClassName}
                    </span>
                  </p>

                  <p>
                    Modalidade:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumData.schoolCourseName}
                    </span>
                  </p>
                  <p>
                    Dias:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {classDayName.join(" - ")}
                    </span>
                  </p>
                  {scheduleSelectedData && (
                    <p>
                      Horário:{" "}
                      <span className="text-red-600 dark:text-yellow-500">
                        De{" "}
                        {`${scheduleSelectedData!.classStart.slice(0, 2)}h${
                          scheduleSelectedData!.classStart.slice(3, 5) === "00"
                            ? ""
                            : scheduleSelectedData!.classStart.slice(3, 5) +
                              "min"
                        } a ${scheduleSelectedData!.classEnd.slice(0, 2)}h${
                          scheduleSelectedData!.classEnd.slice(3, 5) === "00"
                            ? ""
                            : scheduleSelectedData!.classEnd.slice(3, 5) + "min"
                        } (${scheduleSelectedData!.name})`}
                      </span>
                    </p>
                  )}
                  <p>
                    Professor:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumData.teacherName}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={curriculumData.confirmInsert}
            onChange={() => {
              setCurriculumData({
                ...curriculumData,
                confirmInsert: !curriculumData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            Confirmar criação da Turma
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
            {!isSubmitting ? "Criar" : "Criando"}
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
      </form>
    </div>
  );
}
