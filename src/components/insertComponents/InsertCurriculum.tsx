/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";

import { createCurriculumValidationSchema } from "../../@types/zodValidation";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  ClassDaySearchProps,
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
import SchoolStageSelect from "../formComponents/SchoolStageSelect";
import CreateCurriculumFromJson from "../dashboardComponents/CreateCurriculumFromJson";
import { secureSetDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCurriculum() {
  // GET GLOBAL DATA
  const {
    classDaysDatabaseData,
    curriculumDatabaseData,
    schoolDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    page,
    userFullData,
    handleConfirmationToSubmit,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<CreateCurriculumValidationZProps>({
      schoolId: "",
      // schoolClassId: "",
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      placesAvailable: 0,
      // confirmInsert: false,
    });

  // CURRICULUM NAME FORMATTED STATE
  const [curriculumFormattedName, setCurriculumFormattedName] = useState({
    formattedName: "",
    schoolName: "",
    schoolClassNames: [] as SchoolClassSearchProps[],
    schoolCourseName: "",
    scheduleName: "",
    classDayName: "",
    teacherName: "",
  });

  // UPDATE SCHOOLCLASSNAMES WHEN SCHOOLCLASSIDS ARE UPDATED

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
        schoolName: schoolSelectedData.name,
      });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

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
      setCurriculumFormattedName({
        ...curriculumFormattedName,
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

  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    if (curriculumData.classDayId !== "") {
      setClassDaySelectedData(
        classDaysDatabaseData.find(({ id }) => id === curriculumData.classDayId)
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [curriculumData.classDayId]);

  // SET CLASS DAY NAME WITH CLASS DAY SELECTED DATA WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      setCurriculumFormattedName({
        ...curriculumFormattedName,
        classDayName: classDaySelectedData!.name,
      });
    }
  }, [classDaySelectedData]);
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
      setCurriculumFormattedName({
        ...curriculumFormattedName,
        teacherName: teacherSelectedData!.name,
      });
    }
  }, [teacherSelectedData]);
  // -------------------------- END OF TEACHER SELECT STATES AND FUNCTIONS -------------------------- //

  // CHANGE CURRICULUM NAME
  useEffect(() => {
    setCurriculumFormattedName({
      ...curriculumFormattedName,
      formattedName: `${curriculumFormattedName.schoolName} | ${
        curriculumFormattedName.schoolCourseName
      } | ${curriculumFormattedName.scheduleName} | ${classDayName.join(
        " - "
      )} | Professor: ${curriculumFormattedName.teacherName}`,
    });
  }, [
    curriculumFormattedName.schoolName,
    // curriculumFormattedName.schoolClassName,
    curriculumFormattedName.schoolCourseName,
    curriculumFormattedName.scheduleName,
    classDayName,
    curriculumFormattedName.teacherName,
  ]);

  // CURRICULUM NAME FILLED TRIGGER STATE
  const [curriculumNameFilled, setCurriculumNameFilled] = useState(false);

  useEffect(() => {
    if (
      curriculumFormattedName.schoolName &&
      curriculumFormattedName.schoolCourseName &&
      curriculumFormattedName.scheduleName &&
      classDayName.length > 0 &&
      // curriculumFormattedName.schoolClassName &&
      curriculumFormattedName.teacherName
    ) {
      setCurriculumNameFilled(true);
    } else {
      setCurriculumNameFilled(false);
    }
  }, [
    curriculumFormattedName.schoolName,
    // curriculumFormattedName.schoolClassName,
    curriculumFormattedName.schoolCourseName,
    curriculumFormattedName.scheduleName,
    classDayName,
    curriculumFormattedName.teacherName,
  ]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER SCHOOL SELECT WHEN CHANGE SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      // confirmInsert: false,
    });
  }, [curriculumData.schoolId]);

  // RESET ALL UNDER SCHOOL COURSE SELECT WHEN CHANGE SCHOOL COURSE
  useEffect(() => {
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      // confirmInsert: false,
    });
  }, [curriculumData.schoolCourseId]);

  // RESET ALL UNDER SCHEDULE SELECT WHEN CHANGE SCHEDULE
  useEffect(() => {
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      classDayId: "",
      teacherId: "",
      // confirmInsert: false,
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
      // confirmInsert: false,
    });
  }, [curriculumData.classDayId]);

  // RESET CONFIRM INSERT WHEN CHANGE TEACHER
  // useEffect(() => {
  //   setCurriculumData({
  //     ...curriculumData,
  //     // confirmInsert: false,
  //   });
  // }, [curriculumData.teacherId]);
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
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      // confirmInsert: false,
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
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      placesAvailable: 0,
      // confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolId", curriculumData.schoolId);
    setValue("schoolClassIds", curriculumData.schoolClassIds);
    setValue("schoolCourseId", curriculumData.schoolCourseId);
    setValue("scheduleId", curriculumData.scheduleId);
    setValue("classDayId", classDaysCommonId);
    // setValue("classDayName", classDayName.join(" - "));
    setValue("teacherId", curriculumData.teacherId);
    setValue("placesAvailable", curriculumData.placesAvailable);
    // setValue("confirmInsert", curriculumData.confirmInsert);
  }, [curriculumData, classDaysData, classDayName]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolId,
      errors.schoolClassIds,
      errors.schoolCourseId,
      errors.scheduleId,
      errors.classDayId,
      errors.teacherId,
      errors.placesAvailable,
      // errors.confirmInsert,
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
    const confirmation = await handleConfirmationToSubmit({
      title: "Adicionar Turma",
      text: "Tem certeza que deseja adicionar esta Turma?",
      icon: "question",
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      // CLASS DAY ID DATA
      const classDaysId = uuidv4();

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
          await secureSetDoc(doc(db, "classDays", classDaysId), {
            id: classDaysId,
            name: classDayName.join(" - "),
            indexDays: daysIncluded,
            indexNames: classDayName,
            timestamp: serverTimestamp(),
          });
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
        const commonId = uuidv4();
        const countersRef = doc(db, "counters", "curriculumPublicId");
        try {
          await runTransaction(db, async (transaction) => {
            // Obtém o documento atual do contador
            const countersDoc = await getDoc(countersRef);

            // Define o valor inicial do publicId
            let publicId = 1;

            // Se o documento de contador existir, pega o valor atual
            if (countersDoc.exists()) {
              publicId = countersDoc.data().value;
            }
            await secureSetDoc(doc(db, "curriculum", commonId), {
              publicId,
              id: commonId,
              schoolId: data.schoolId,
              schoolClassIds: data.schoolClassIds,
              schoolCourseId: data.schoolCourseId,
              scheduleId: data.scheduleId,
              classDayId: classDaysId,
              teacherId: data.teacherId,
              students: [],
              experimentalStudents: [],
              waitingList: [],
              placesAvailable: data.placesAvailable,
              updatedAt: serverTimestamp(),
            });
            setIsSubmitting(false);
            // Atualiza ou cria o contador, garantindo que o publicId seja único e crescente
            transaction.set(
              countersRef,
              { value: publicId + 1 },
              { merge: true }
            );
            resetForm();
            toast.success(`Turma criada com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            setIsSubmitting(false);
          });
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
          curriculum.schoolId === data.schoolId &&
          curriculum.schoolClassIds === data.schoolClassIds &&
          curriculum.schoolCourseId === data.schoolCourseId &&
          curriculum.scheduleId === data.scheduleId &&
          curriculum.teacherId === data.teacherId
      );
      const classDaysExists = classDaysDatabaseData.find(
        (classDay) => classDay.name === classDayName.join(" - ")
      );

      // IF EXISTS, RETURN ERROR
      if (curriculumExists && classDaysExists) {
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
        await addClassDays();
        await addCurriculum();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex h-full flex-col container text-center overflow-scroll no-scrollbar ${
        page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" &&
        "rounded-xl"
      } `}
    >
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      {page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" && (
          <h1 className="font-bold text-2xl my-4">Adicionar Turma</h1>
        )}
      {userFullData?.role === "root" && <CreateCurriculumFromJson />}
      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddCurriculum)}
        className={`flex flex-col w-full gap-2 rounded-xl ${
          page.show !== "Dashboard" &&
          userFullData &&
          userFullData.role !== "user"
            ? "bg-klGreen-500/20 dark:bg-klGreen-500/30 p-4 mt-2"
            : "pb-4 px-4 pt-2"
        }`}
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
            <SelectOptions returnId showAllCourses dataType="schoolCourses" />
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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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

        {/* PLACES AVAILABLE INPUT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="placesAvailable"
            className={
              errors.placesAvailable
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Número máximo de alunos:{" "}
          </label>
          <input
            type="text"
            name="placesAvailable"
            pattern="^(0?[0-9]|[1-9][0-9])$"
            maxLength={2}
            value={curriculumData.placesAvailable}
            placeholder={errors.placesAvailable ? "É necessário um" : "99999"}
            className={
              errors.placesAvailable
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                placesAvailable: +e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"),
              });
            }}
          />
        </div>

        {/* SCHOOL CLASS SELECT */}
        <p className="mt-4 mb-2 text-center">
          Selecione os anos escolares inclusos nessa turma
        </p>

        <SchoolStageSelect
          curriculumData={curriculumData}
          dashboardView={false}
          onlyView={false}
          setCurriculumData={setCurriculumData}
          curriculumFormattedName={curriculumFormattedName}
          setCurriculumFormattedName={setCurriculumFormattedName}
        />

        {/* CLASS DAYS SELECT */}
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
            className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
            className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            value={
              curriculumNameFilled ? curriculumFormattedName.formattedName : ""
            }
          />
        </div>

        {/* CURRICULUM DESCRIPTON CARD */}
        {curriculumNameFilled &&
          curriculumFormattedName.schoolClassNames.length > 0 && (
            <>
              <div className="flex gap-2 items-center justify-center mt-2">
                <div className="flex flex-col w-2/6 items-left p-4 my-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left">
                  <p>
                    Colégio:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumFormattedName.schoolName}
                    </span>
                  </p>

                  <p>
                    Ano Escolar:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumFormattedName.schoolClassNames
                        .sort((a, b) => {
                          if (a.schoolStageId !== b.schoolStageId) {
                            return a.schoolStageId.localeCompare(
                              b.schoolStageId
                            );
                          }
                          return a.name.localeCompare(b.name);
                        })
                        .map((schoolClass) => {
                          return schoolClass.name;
                        })
                        .join(" - ")}
                    </span>
                  </p>

                  <p>
                    Modalidade:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumFormattedName.schoolCourseName}
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
                      {curriculumFormattedName.teacherName}
                    </span>
                  </p>
                  <p>
                    Total de vagas:{" "}
                    <span className="text-red-600 dark:text-yellow-500">
                      {curriculumData.placesAvailable}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}

        {/** CHECKBOX CONFIRM INSERT */}
        {/* {curriculumNameFilled &&
          curriculumFormattedName.schoolClassNames.length > 0 && (
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
          )} */}

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4 justify-center">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={
              curriculumNameFilled &&
              curriculumFormattedName.schoolClassNames.length > 0
                ? isSubmitting
                : true
            }
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
          >
            {curriculumNameFilled &&
            curriculumFormattedName.schoolClassNames.length > 0
              ? !isSubmitting
                ? "Criar"
                : "Criando"
              : "Selecione as informações necessárias"}
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
