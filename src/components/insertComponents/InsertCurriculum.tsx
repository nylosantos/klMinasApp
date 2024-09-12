/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { createCurriculumValidationSchema } from "../../@types/zodValidation";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  ClassDaySearchProps,
  CreateCurriculumValidationZProps,
  CurriculumSearchProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  TeacherSearchProps,
} from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCurriculum() {
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
  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL
  const [schoolDataArray, setSchoolDataArray] = useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (curriculumData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDataArray!.find(({ id }) => id === curriculumData.schoolId)
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
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASS
  const [schoolClassDataArray, setSchoolClassDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolClassSelectedData = (data: SchoolClassSearchProps[]) => {
    setSchoolClassDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDataArray!.find(
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
  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSE
  const [schoolCourseDataArray, setSchoolCourseDataArray] =
    useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolCourseSelectedData = (data: SchoolCourseSearchProps[]) => {
    setSchoolCourseDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDataArray!.find(
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
  // SCHEDULE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHEDULE
  const [scheduleDataArray, setScheduleDataArray] =
    useState<ScheduleSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHEDULE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleScheduleSelectedData = (data: ScheduleSearchProps[]) => {
    setScheduleDataArray(data);
  };

  // SCHEDULE SELECTED STATE DATA
  const [scheduleSelectedData, setScheduleSelectedData] =
    useState<ScheduleSearchProps>();

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    if (curriculumData.scheduleId !== "") {
      setScheduleSelectedData(
        scheduleDataArray!.find(({ id }) => id === curriculumData.scheduleId)
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
  // CLASS DAY DATA ARRAY WITH ALL OPTIONS OF SELECT CLASS DAY
  const [classDayDataArray, setClassDayDataArray] =
    useState<ClassDaySearchProps[]>();

  // FUNCTION THAT WORKS WITH CLASS DAY SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleClassDaySelectedData = (data: ClassDaySearchProps[]) => {
    setClassDayDataArray(data);
  };

  // CLASS DAY SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    if (curriculumData.classDayId !== "") {
      setClassDaySelectedData(
        classDayDataArray!.find(({ id }) => id === curriculumData.classDayId)
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [curriculumData.classDayId]);

  // SET CLASS DAY NAME WITH CLASS DAY SELECTED DATA WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        classDayName: classDaySelectedData!.name,
      });
    }
  }, [classDaySelectedData]);
  // -------------------------- END OF CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- TEACHER SELECT STATES AND FUNCTIONS -------------------------- //
  // TEACHER DATA ARRAY WITH ALL OPTIONS OF SELECT TEACHER
  const [teacherDataArray, setTeacherDataArray] =
    useState<TeacherSearchProps[]>();

  // FUNCTION THAT WORKS WITH TEACHER SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleTeacherSelectedData = (data: TeacherSearchProps[]) => {
    setTeacherDataArray(data);
  };

  // TEACHER SELECTED STATE DATA
  const [teacherSelectedData, setTeacherSelectedData] =
    useState<TeacherSearchProps>();

  // SET TEACHER SELECTED STATE WHEN SELECT TEACHER
  useEffect(() => {
    if (curriculumData.teacherId !== "") {
      setTeacherSelectedData(
        teacherDataArray!.find(({ id }) => id === curriculumData.teacherId)
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
    (
      document.getElementById("classDaySelect") as HTMLSelectElement
    ).selectedIndex = 0;
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
    (
      document.getElementById("classDaySelect") as HTMLSelectElement
    ).selectedIndex = 0;
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
    (
      document.getElementById("classDaySelect") as HTMLSelectElement
    ).selectedIndex = 0;
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
    (
      document.getElementById("classDaySelect") as HTMLSelectElement
    ).selectedIndex = 0;
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
    setValue("classDayId", curriculumData.classDayId);
    setValue("classDayName", curriculumData.classDayName);
    setValue("teacherId", curriculumData.teacherId);
    setValue("teacherName", curriculumData.teacherName);
    setValue("confirmInsert", curriculumData.confirmInsert);
  }, [curriculumData]);

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
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o Currículo... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ADD CURRICULUM FUNCTION
    const addCurriculum = async () => {
      const curriculumFormattedName = `${data.schoolName} | ${data.schoolCourseName} | ${data.scheduleName} | ${data.classDayName} | Professor: ${data.teacherName}`;
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
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`Currículo criado com sucesso! 👌`, {
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
    const curriculumRef = collection(db, "curriculum");
    const q = query(
      curriculumRef,
      where("school", "==", data.schoolName),
      where("schoolClass", "==", data.schoolClassName),
      where("schoolCourse", "==", data.schoolCourseName),
      where("schedule", "==", data.scheduleName),
      where("classDay", "==", data.classDayName),
      where("teacher", "==", data.teacherName)
    );
    const querySnapshot = await getDocs(q);
    const promises: CurriculumSearchProps[] = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data() as CurriculumSearchProps;
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF EXISTS, RETURN ERROR
      if (results.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(`Currículo já existe no nosso banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF NOT EXISTS, CREATE
        addCurriculum();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Currículo</h1>

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
            <SelectOptions
              returnId
              dataType="schools"
              handleData={handleSchoolSelectedData}
            />
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
              handleData={handleSchoolClassSelectedData}
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
            <SelectOptions
              returnId
              dataType="schoolCourses"
              handleData={handleSchoolCourseSelectedData}
            />
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
              handleData={handleScheduleSelectedData}
            />
          </select>
        </div>

        {/* CLASS DAYS SELECT */}
        <div className="flex gap-2 items-center">
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
            <SelectOptions
              returnId
              dataType="classDays"
              handleData={handleClassDaySelectedData}
            />
          </select>
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
            <SelectOptions
              returnId
              dataType="teachers"
              handleData={handleTeacherSelectedData}
            />
          </select>
        </div>

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
            placeholder="Escolha as opções acima para visualizar o nome do Currículo"
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            value={
              curriculumData.schoolName &&
              curriculumData.schoolCourseName &&
              curriculumData.scheduleName &&
              curriculumData.classDayName &&
              curriculumData.teacherName
                ? `${curriculumData.schoolName} | ${curriculumData.schoolCourseName} | ${curriculumData.scheduleName} | ${curriculumData.classDayName} | Professor: ${curriculumData.teacherName}`
                : ""
            }
          />
        </div>

        {/* CURRICULUM DESCRIPTON CARD */}
        {curriculumData.schoolName &&
        curriculumData.schoolCourseName &&
        curriculumData.scheduleName &&
        curriculumData.classDayName &&
        curriculumData.teacherName ? (
          <>
            <div className="flex gap-2 items-center justify-center mt-2">
              <div className="flex flex-col w-2/6 items-left p-4 my-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left">
                <p>
                  Colégio:{" "}
                  <span className="text-red-600 dark:text-yellow-500">
                    {curriculumData.schoolName}
                  </span>
                </p>
                {curriculumData.schoolName === "Colégio Bernoulli" ? (
                  <p>
                    Turma:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumData.schoolClassName}
                    </span>
                  </p>
                ) : null}
                <p>
                  Modalidade:{" "}
                  <span className="text-red-600 dark:text-yellow-500">
                    {curriculumData.schoolCourseName}
                  </span>
                </p>
                <p>
                  Dias:{" "}
                  <span className="text-red-600 dark:text-yellow-500">
                    {curriculumData.classDayName}
                  </span>
                </p>
                {scheduleSelectedData ? (
                  <p>
                    Horário:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      De{" "}
                      {`${scheduleSelectedData!.classStart.slice(0, 2)}h${
                        scheduleSelectedData!.classStart.slice(3, 5) === "00"
                          ? ""
                          : scheduleSelectedData!.classStart.slice(3, 5) + "min"
                      } a ${scheduleSelectedData!.classEnd.slice(0, 2)}h${
                        scheduleSelectedData!.classEnd.slice(3, 5) === "00"
                          ? ""
                          : scheduleSelectedData!.classEnd.slice(3, 5) + "min"
                      }`}
                    </span>
                  </p>
                ) : null}
                <p>
                  Professor:{" "}
                  <span className="text-red-600 dark:text-yellow-500">
                    {curriculumData.teacherName}
                  </span>
                </p>
              </div>
            </div>
          </>
        ) : null}

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
            Confirmar criação do Currículo
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
