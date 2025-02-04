/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  ClassDaySearchProps,
  CurriculumSearchProps,
  EditClassDayValidationZProps,
  EditCurriculumValidationZProps,
  ScheduleSearchProps,
  TeacherSearchProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
import { SelectOptions } from "./SelectOptions";
import { ClassDays } from "./ClassDays";
import { classDayIndexNames } from "../../custom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCurriculumValidationSchema } from "../../@types/zodValidation";
import { toast } from "react-toastify";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../db/Firebase";
import { EditDashboardCurriculumButton } from "../layoutComponents/EditDashboardCurriculumButton";
import SchoolStageSelect from "./SchoolStageSelect";
import ClassCallsHeader from "./ClassCallsHeader";
import { DateObject } from "react-multi-date-picker";
import StudentsListForTeachers from "./StudentsListForTeachers";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface EditCurriculumFormProps {
  curriculumId: string;
  isSubmitting: boolean;
  onlyView?: boolean;
  modal?: boolean;
  onClose?: () => void;
  setModal?: Dispatch<SetStateAction<boolean>>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  // handleDeleteClass?: () => void;
  handleDeleteClass?: () => void;
}

export default function EditCurriculumForm({
  curriculumId,
  isSubmitting,
  onlyView = false,
  modal = false,
  setModal,
  onClose,
  setIsSubmitting,
  handleDeleteClass,
}: EditCurriculumFormProps) {
  // GET GLOBAL DATA
  const {
    classDaysDatabaseData,
    curriculumDatabaseData,
    scheduleDatabaseData,
    schoolCourseDatabaseData,
    studentsDatabaseData,
    teacherDatabaseData,
    userFullData,
    calcStudentPrice,
    handleOneCurriculumDetails,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const [dashboardView, setDasboardView] = useState(true);

  useEffect(() => {
    !onlyView && setDasboardView(false);
  }, []);

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // CURRICULUM FORMATTED NAME STATE
  const [curriculumFormattedName, setCurriculumFormattedName] = useState("");

  // CHANGE CURRICULUM NAME
  useEffect(() => {
    setCurriculumFormattedName(
      `${handleOneCurriculumDetails(curriculumId).publicId} - ${
        handleOneCurriculumDetails(curriculumId).schoolName
      } | ${handleOneCurriculumDetails(curriculumId).schoolCourseName} | ${
        handleOneCurriculumDetails(curriculumId).scheduleName
      } | ${
        handleOneCurriculumDetails(curriculumId).classDayName
      } | Professor: ${handleOneCurriculumDetails(curriculumId).teacherName}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curriculumId]);

  // CURRICULUM DATA
  const [curriculumEditData, setCurriculumEditData] =
    useState<EditCurriculumValidationZProps>({
      curriculumId: curriculumId,
      schoolId: "",
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      placesAvailable: 0,
    });

  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumId !== "") {
      setCurriculumSelectedData(
        curriculumDatabaseData.find(({ id }) => id === curriculumId)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumId]);

  // SET CURRICULUM EDIT DATA WHEN CURRICULUM CHANGE
  useEffect(() => {
    if (curriculumSelectedData) {
      setCurriculumEditData({
        ...curriculumEditData,
        schoolId: curriculumSelectedData.schoolId,
        schoolClassIds: curriculumSelectedData.schoolClassIds,
        schoolCourseId: curriculumSelectedData.schoolCourseId,
        scheduleId: curriculumSelectedData.scheduleId,
        classDayId: curriculumSelectedData.classDayId,
        teacherId: curriculumSelectedData.teacherId,
        placesAvailable: curriculumSelectedData.placesAvailable,
      });
    }
  }, [curriculumSelectedData]);

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
      scheduleId: scheduleSelectedData ? scheduleSelectedData.id : "",
    });
  }, [scheduleSelectedData]);

  function handleScheduleDetails(id: string) {
    const scheduleDetail = scheduleDatabaseData.find(
      (schedule) => schedule.id === id
    );
    if (scheduleDetail) {
      return scheduleDetail;
    } else {
      return;
    }
  }
  // -------------------------- END OF SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //
  // CLASS DAY EDIT DATA
  const [classDayEditData, setClassDayEditData] =
    useState<EditClassDayValidationZProps>({
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

  // SET CLASS DAY NAME AND PRICE TO CLASS DAY EDIT NAME AND PRICE
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      if (classDaySelectedData.indexDays.length > 0) {
        const days = {
          name: "",
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        };
        (days.name = classDaySelectedData.name),
          classDaySelectedData.indexDays.map((day) => {
            if (day === 0) {
              days.sunday = true;
            }
            if (day === 1) {
              days.monday = true;
            }
            if (day === 2) {
              days.tuesday = true;
            }
            if (day === 3) {
              days.wednesday = true;
            }
            if (day === 4) {
              days.thursday = true;
            }
            if (day === 5) {
              days.friday = true;
            }
            if (day === 6) {
              days.saturday = true;
            }
          });
        setClassDayEditData(days);
        setClassDayName(classDaySelectedData.indexNames);
      }
    }
  }, [classDaySelectedData]);

  // SET CURRICULUM EDIT DATA WHEN CLASS DAY CHANGE
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      if (classDaySelectedData.indexDays.length > 0) {
        const days = {
          name: "",
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        };
        (days.name = classDaySelectedData.name),
          classDaySelectedData.indexDays.map((day) => {
            if (day === 0) {
              days.sunday = true;
            }
            if (day === 1) {
              days.monday = true;
            }
            if (day === 2) {
              days.tuesday = true;
            }
            if (day === 3) {
              days.wednesday = true;
            }
            if (day === 4) {
              days.thursday = true;
            }
            if (day === 5) {
              days.friday = true;
            }
            if (day === 6) {
              days.saturday = true;
            }
          });
        setClassDayEditData(days);
        setClassDayName(classDaySelectedData.indexNames);
      }
      setCurriculumEditData({
        ...curriculumEditData,
        classDayId: classDaySelectedData.id,
      });
    }
  }, [classDaySelectedData]);

  // TOGGLE CLASS DAYS VALUE FUNCTION
  function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
    setClassDayEditData({ ...classDayEditData, [day]: value });
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

  // -------------------------- END OF CLASSDAYS SELECT STATES AND FUNCTIONS -------------------------- //

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
      teacherId: teacherSelectedData ? teacherSelectedData.id : "",
    });
  }, [teacherSelectedData]);
  // -------------------------- END OF TEACHER SELECT STATES AND FUNCTIONS -------------------------- //

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditCurriculumValidationZProps>({
    resolver: zodResolver(editCurriculumValidationSchema),
    defaultValues: {
      curriculumId: curriculumId,
      schoolId: "",
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setCurriculumEditData({
      curriculumId: curriculumId,
      schoolId: "",
      schoolClassIds: [],
      schoolCourseId: "",
      scheduleId: "",
      classDayId: "",
      teacherId: "",
      placesAvailable: 0,
    });
    setClassDayEditData({
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
    reset();
    onClose && onClose();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("curriculumId", curriculumEditData.curriculumId);
    setValue("schoolId", curriculumEditData.schoolId);
    setValue("schoolClassIds", curriculumEditData.schoolClassIds);
    setValue("schoolCourseId", curriculumEditData.schoolCourseId);
    setValue("scheduleId", curriculumEditData.scheduleId);
    setValue("classDayId", curriculumEditData.classDayId);
    setValue("teacherId", curriculumEditData.teacherId);
    setValue("placesAvailable", curriculumEditData.placesAvailable);
  }, [curriculumEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.curriculumId,
      errors.schoolId,
      errors.schoolClassIds,
      errors.schoolCourseId,
      errors.scheduleId,
      errors.classDayId,
      errors.teacherId,
      errors.placesAvailable,
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
    // CHECKING IF CURRICULUM AND CLASSDAYS EXISTS ON DATABASE
    const curriculumExists = curriculumDatabaseData.find(
      (curriculum) => curriculum.id === data.curriculumId
    );
    const classDaysExists = classDaysDatabaseData.find(
      (classDays) => classDays.id === data.classDayId
    );

    // EDIT CURRICULUM FUNCTION
    const editCurriculum = async () => {
      try {
        await updateDoc(doc(db, "curriculum", data.curriculumId), {
          scheduleId: data.scheduleId,
          teacherId: data.teacherId,
          placesAvailable: data.placesAvailable,
          schoolClassIds: data.schoolClassIds,
        });
        resetForm();
        toast.success(`Turma alterada com sucesso! 👌`, {
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

    const editStudentsClassDays = async (daysIncluded: number[]) => {
      if (curriculumSelectedData) {
        // CHANGING STUDENT INDEX DAYS IN CURRICULUM DATABASE
        curriculumSelectedData.students.map(async (student) => {
          const daysToDelete = student.indexDays.filter(
            (days) => !daysIncluded.includes(days)
          );
          const daysToRemain = student.indexDays.filter((days) =>
            daysIncluded.includes(days)
          );
          if (daysToDelete.length > 0) {
            await updateDoc(doc(db, "curriculum", data.curriculumId), {
              students: arrayRemove(student),
            });
            await updateDoc(doc(db, "curriculum", data.curriculumId), {
              students: arrayUnion({
                date: student.date,
                id: student.id,
                indexDays: daysToRemain,
              }),
            });
            // CHANGING STUDENT INDEX DAYS AND PRICE IN STUDENT DATABASE
            const studentToChange = studentsDatabaseData.find(
              (studentOnDatabase) => student.id === studentOnDatabase.id
            );
            if (studentToChange) {
              const curriculumInsideStudentToChange =
                studentToChange.curriculumIds.find(
                  (curriculumInsideStudent) =>
                    curriculumInsideStudent.id === data.curriculumId
                );
              const schoolCourseDetails = schoolCourseDatabaseData.find(
                (schoolCourse) => schoolCourse.id === data.schoolCourseId
              );
              // CHANGING PRICE OF CURRICULUM THAT HAS CLASS DAYS CHANGED
              if (schoolCourseDetails) {
                if (curriculumInsideStudentToChange) {
                  let studentFinalPrice;
                  if (daysToRemain.length === schoolCourseDetails.bundleDays) {
                    studentFinalPrice = schoolCourseDetails.priceBundle;
                  } else if (
                    daysToRemain.length > schoolCourseDetails.bundleDays
                  ) {
                    studentFinalPrice =
                      schoolCourseDetails.priceUnit * daysToRemain.length;
                  } else {
                    const rest =
                      daysToRemain.length % schoolCourseDetails.bundleDays;
                    const result = Math.floor(
                      daysToRemain.length / schoolCourseDetails.bundleDays
                    );
                    if (isNaN(result) || isNaN(rest)) {
                      studentFinalPrice = 0;
                    } else {
                      studentFinalPrice =
                        result * schoolCourseDetails.priceBundle +
                        rest * schoolCourseDetails.priceUnit;
                    }
                  }
                  await updateDoc(doc(db, "students", student.id), {
                    curriculumIds: arrayRemove(curriculumInsideStudentToChange),
                  });
                  await updateDoc(doc(db, "students", student.id), {
                    curriculumIds: arrayUnion({
                      date: curriculumInsideStudentToChange.date,
                      id: curriculumInsideStudentToChange.id,
                      indexDays: daysToRemain,
                      isExperimental:
                        curriculumInsideStudentToChange.isExperimental,
                      price: studentFinalPrice,
                    }),
                  });
                }
              }
              // UPDATING STUDENT PRICE WITH NEW CURRICULUM PRICE
              await calcStudentPrice(studentToChange.id);
            }
          }
        });
      }
    };

    // COMPARE INDEX CLASS DAYS FUNCTION
    function arraysEqual(
      oldIndexClassDays: number[],
      newIndexClassDays: number[]
    ) {
      return (
        oldIndexClassDays.length === newIndexClassDays.length &&
        oldIndexClassDays.every(
          (value, index) => value === newIndexClassDays[index]
        )
      );
    }

    // EDIT CLASS DAY FUNCTION
    const editClassDay = async () => {
      const daysIncluded: number[] = [];
      if (classDayEditData.sunday) {
        daysIncluded.push(0);
      }
      if (classDayEditData.monday) {
        daysIncluded.push(1);
      }
      if (classDayEditData.tuesday) {
        daysIncluded.push(2);
      }
      if (classDayEditData.wednesday) {
        daysIncluded.push(3);
      }
      if (classDayEditData.thursday) {
        daysIncluded.push(4);
      }
      if (classDayEditData.friday) {
        daysIncluded.push(5);
      }
      if (classDayEditData.saturday) {
        daysIncluded.push(6);
      }
      // CHECKING IF CLASSDAYS WAS CHANGED
      if (classDaysExists) {
        if (!arraysEqual(classDaysExists.indexDays, daysIncluded)) {
          try {
            await setDoc(
              doc(db, "classDays", data.classDayId),
              {
                name:
                  classDayName.length > 0
                    ? classDayName.join(" - ")
                    : curriculumFormattedName,
                indexDays: daysIncluded,
                indexNames: classDayName,
              },
              { merge: true }
            );
            editStudentsClassDays(daysIncluded);
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
        }
      }
    };

    setIsSubmitting(true);

    // CHECK IF ANY DAY WAS PICKED
    if (
      !classDayEditData.sunday &&
      !classDayEditData.monday &&
      !classDayEditData.tuesday &&
      !classDayEditData.wednesday &&
      !classDayEditData.thursday &&
      !classDayEditData.friday &&
      !classDayEditData.saturday
    ) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, selecione algum dia para editar a Turma ${curriculumFormattedName}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    if (!curriculumExists && !classDaysExists) {
      // IF NOT EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(`Turma não existe no banco de dados... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      // IF EXISTS, EDIT
      editClassDay();
      editCurriculum();
    }
  };

  // CLASS CALL STATE
  const [classCall, setClassCall] = useState(false);

  // CLASS DATE STATE
  const [selectedClassDate, setSelectedClassDate] = useState<DateObject>(
    new DateObject()
  );

  const [classDaysData, setClassDaysData] = useState<ClassDaySearchProps>();

  useEffect(() => {
    if (curriculumId) {
      handleClassDaysData(handleOneCurriculumDetails(curriculumId).classDayId);
    }
  }, [curriculumId]);

  function handleClassDaysData(id: string) {
    if (id) {
      const classDayAllData = classDaysDatabaseData.find(
        (data) => data.id === id
      );
      if (classDayAllData) {
        setClassDaysData(classDayAllData);
      }
    }
  }

  return (
    <div
      className={`w-full ${
        modal
          ? "flex flex-col h-full max-w-7xl bg-white/80 dark:bg-transparent rounded-xl overflow-y-auto no-scrollbar"
          : ""
      } `}
    >
      {modal && (
        <div className="flex items-center justify-between text-md/snug text-gray-100 bg-klGreen-500/70 dark:bg-klGreen-500/70 dark:rounded-t-xl uppercase p-4">
          <div className="flex w-full text-center">
            <p className="w-full mx-auto">
              {onlyView && dashboardView ? "Detalhes Turma" : "Editar Turma"}
            </p>
          </div>
          <div className="flex absolute right-0 px-2 z-50">
            <EditDashboardCurriculumButton
              dashboardView={dashboardView}
              handleDeleteClass={handleDeleteClass && handleDeleteClass}
              setDashboardView={setDasboardView}
              setModal={setModal && setModal}
              classCall={classCall}
              setClassCall={setClassCall}
            />
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(handleEditCurriculum)}
        className={`flex flex-col w-full gap-2 p-4 ${
          modal
            ? userFullData && userFullData.role === "teacher"
              ? "rounded-b-none bg-klGreen-500/20 dark:bg-klGreen-500/30"
              : "rounded-b-xl bg-klGreen-500/20 dark:bg-klGreen-500/30"
            : "mt-2"
        }`}
      >
        {!classCall && (
          <>
            {/* CURRICULUM NAME */}
            <div className="flex gap-2 items-center">
              <label htmlFor="publicId" className="w-1/4 text-right">
                Identificador:
              </label>
              <input
                type="text"
                name="publicId"
                disabled
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                value={handleOneCurriculumDetails(curriculumId).publicId!}
              />
            </div>

            {/* UNCOMMENT FOR SHOW CURRICULUM FORMATTED NAME */}
            {/* <div className="flex gap-2 items-center">
          <label htmlFor="name" className="w-1/4 text-right">
            Nome:
          </label>
          <input
            type="text"
            name="name"
            disabled
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            value={curriculumFormattedName}
          />
        </div> */}

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
                value={handleOneCurriculumDetails(curriculumId).schoolName}
              />
            </div>

            {/* SCHOOL YEARS JOIN INPUT */}
            {onlyView && dashboardView && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="schooYearsJoinInput"
                  className={
                    errors.scheduleId
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Anos Escolares:{" "}
                </label>
                <input
                  type="text"
                  name="schooYearsJoinInput"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={
                    curriculumEditData.schoolClassIds.length > 0
                      ? handleOneCurriculumDetails(
                          curriculumId
                        ).schoolClassNames.join(" - ")
                      : ""
                  }
                />
              </div>
            )}

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
                value={
                  handleOneCurriculumDetails(curriculumId).schoolCourseName
                }
              />
            </div>

            {/* EDIT PLACES AVAILABLE TITLE */}
            {(!onlyView || !dashboardView) && (
              <div className="flex gap-2 items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                    Altere o número máximo de vagas:
                  </h1>
                </div>
              </div>
            )}

            {/* PLACES AVAILABLE INPUT */}
            {userFullData && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="placesAvailable"
                  className={
                    errors.placesAvailable
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  {onlyView && dashboardView
                    ? "Total de vagas: "
                    : "Número máximo de alunos: "}
                </label>
                <input
                  disabled={onlyView && dashboardView ? true : false}
                  type="text"
                  name="placesAvailable"
                  pattern="^(0?[0-9]|[1-9][0-9])$"
                  maxLength={2}
                  value={curriculumEditData.placesAvailable}
                  placeholder={
                    errors.placesAvailable ? "É necessário um" : "0 a 99"
                  }
                  className={
                    !onlyView || !dashboardView
                      ? errors.placesAvailable
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  }
                  onChange={(e) => {
                    setCurriculumEditData({
                      ...curriculumEditData,
                      placesAvailable: +e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
              </div>
            )}

            {/* ENROLLED STUDENTS */}
            {onlyView && dashboardView && (
              <div className="flex gap-2 items-center">
                <label htmlFor="enrolledStudents" className="w-1/4 text-right">
                  Alunos Matriculados:{" "}
                </label>
                <input
                  disabled
                  type="text"
                  name="enrolledStudents"
                  value={
                    handleOneCurriculumDetails(curriculumId).students.length
                  }
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                />
              </div>
            )}

            {/* PLACES AVAILABLE */}
            {onlyView && dashboardView && (
              <div className="flex gap-2 items-center">
                <label htmlFor="placesAvailable" className="w-1/4 text-right">
                  Vagas Disponíveis:{" "}
                </label>
                <input
                  disabled
                  type="text"
                  name="placesAvailable"
                  value={
                    handleOneCurriculumDetails(curriculumId).placesAvailable -
                    handleOneCurriculumDetails(curriculumId).students.length
                  }
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                />
              </div>
            )}

            {/* WAITING LIST */}
            {onlyView && dashboardView && (
              <div className="flex gap-2 items-center">
                <label htmlFor="waitingList" className="w-1/4 text-right">
                  Lista de Espera:{" "}
                </label>
                <input
                  disabled
                  type="text"
                  name="waitingList"
                  value={
                    handleOneCurriculumDetails(curriculumId).waitingList.length
                  }
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                />
              </div>
            )}

            {/* EDIT SCHEDULE TITLE */}
            {!onlyView ||
              (!dashboardView && (
                <div className="flex gap-2 items-center">
                  <div className="w-1/4"></div>
                  <div className="w-3/4">
                    <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                      Altere o Horário:
                    </h1>
                  </div>
                </div>
              ))}

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
                Horário:{" "}
              </label>
              {onlyView && dashboardView && (
                <input
                  type="text"
                  name="scheduleName"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={`${handleScheduleDetails(
                    handleOneCurriculumDetails(curriculumId).scheduleId
                  )!.classStart.slice(0, 2)}h${
                    handleScheduleDetails(
                      handleOneCurriculumDetails(curriculumId).scheduleId
                    )!.classStart.slice(3, 5) === "00"
                      ? ""
                      : handleScheduleDetails(
                          handleOneCurriculumDetails(curriculumId).scheduleId
                        )!.classStart.slice(3, 5) + "min"
                  } a ${handleScheduleDetails(
                    handleOneCurriculumDetails(curriculumId).scheduleId
                  )!.classEnd.slice(0, 2)}h${
                    handleScheduleDetails(
                      handleOneCurriculumDetails(curriculumId).scheduleId
                    )!.classEnd.slice(3, 5) === "00"
                      ? ""
                      : handleScheduleDetails(
                          handleOneCurriculumDetails(curriculumId).scheduleId
                        )!.classEnd.slice(3, 5) + "min"
                  } (${handleOneCurriculumDetails(curriculumId).scheduleName})`}
                />
              )}
              {(!onlyView || !dashboardView) && (
                <select
                  id="scheduleSelect"
                  disabled={onlyView && dashboardView ? true : isSubmitting}
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
              )}
            </div>

            {/* TRANSITION START */}
            {(!onlyView || !dashboardView) && (
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
            )}

            {/* TRANSITION END */}
            {(!onlyView || !dashboardView) && (
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
            )}

            {/* CLASS START */}
            {(!onlyView || !dashboardView) && (
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
            )}

            {/* CLASS END */}
            {(!onlyView || !dashboardView) && (
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
            )}

            {/* EXIT */}
            {(!onlyView || !dashboardView) && (
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
            )}

            {/* CLASS DAYS JOIN INPUT */}
            {onlyView && dashboardView && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="classDaysJoinInput"
                  className={
                    errors.scheduleId
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Dias de Aula:{" "}
                </label>
                <input
                  type="text"
                  name="classDaysJoinInput"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={
                    classDayName.length > 0 ? classDayName.join(" - ") : ""
                  }
                />
              </div>
            )}

            {/* EDIT TEACHER TITLE */}
            {(!onlyView || !dashboardView) && (
              <div className="flex gap-2 items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                    Altere o Professor:
                  </h1>
                </div>
              </div>
            )}

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
                disabled={onlyView && dashboardView ? true : isSubmitting}
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

            {/* EDIT SCHOOL STAGE TITLE */}
            {(!onlyView || !dashboardView) && (
              <div className="flex gap-2 items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                    Altere os Anos Escolares:
                  </h1>
                </div>
              </div>
            )}

            {/* SCHOOL CLASS SELECT */}
            {(!onlyView || !dashboardView) && (
              <>
                <p className="mt-4 mb-2 text-center">
                  {!onlyView || !dashboardView
                    ? "Selecione os anos escolares inclusos nessa turma"
                    : "Anos Escolares Inclusos:"}
                </p>

                <SchoolStageSelect
                  curriculumData={curriculumEditData}
                  dashboardView={dashboardView}
                  onlyView={onlyView}
                  setCurriculumData={setCurriculumEditData}
                />
              </>
            )}

            {/* EDIT CLASS DAY TITLE */}
            {!onlyView ||
              (!dashboardView && (
                <div className="flex gap-2 items-center">
                  <div className="w-1/4"></div>
                  <div className="w-3/4">
                    <h1 className="text-start font-bold text-lg py-2 text-red-600 dark:text-yellow-500">
                      Altere os Dias de Aula:
                    </h1>
                  </div>
                </div>
              ))}

            {/* CLASS DAY NAME */}
            <div className="hidden gap-2 items-center">
              <label htmlFor="name" className="w-1/4 text-right">
                Identificador:{" "}
              </label>
              <input
                type="text"
                name="name"
                disabled={isSubmitting}
                readOnly
                placeholder="Selecione os dias para formar o Identificador dos Dias de Aula"
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                value={classDayName.length > 0 ? classDayName.join(" - ") : ""}
              />
            </div>

            {/* DAYS PICKER */}
            {!onlyView ||
              (!dashboardView && (
                <ClassDays
                  classDay={classDayEditData}
                  toggleClassDays={toggleClassDays}
                  onlyView={onlyView && dashboardView}
                />
              ))}

            {/* SUBMIT AND RESET BUTTONS */}
            {!onlyView ||
              (!dashboardView && (
                <div className="flex gap-2 mt-4 justify-center">
                  {/* SUBMIT BUTTON */}
                  {!onlyView ||
                    (!dashboardView && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
                      >
                        {!isSubmitting ? "Salvar" : "Salvando"}
                      </button>
                    ))}

                  {/* RESET BUTTON */}
                  <button
                    type="reset"
                    className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetForm();
                      setModal && setModal(false);
                    }}
                  >
                    {isSubmitting
                      ? "Aguarde"
                      : onlyView && dashboardView
                      ? "Fechar"
                      : "Cancelar"}
                  </button>
                </div>
              ))}
          </>
        )}

        {/* CLASS CALL IDENTIFIER */}
        {classCall && (
          // <>
          //   <div className="flex gap-2 items-center">

          //     <input
          //       type="text"
          //       name="publicId"
          //       disabled
          //       className="w-full text-center px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          //       value={`${
          //         handleOneCurriculumDetails(curriculumId).schoolName
          //       } - ${
          //         handleOneCurriculumDetails(curriculumId).schoolCourseName
          //       } - ${handleOneCurriculumDetails(curriculumId).teacherName}`}
          //     />
          //   </div>

          // </>
          <ClassCallsHeader
            curriculumId={curriculumId}
            setSelectedClassDate={setSelectedClassDate}
            classDaysData={classDaysData}
          />
        )}
      </form>
      {curriculumSelectedData &&
        userFullData &&
        userFullData.role === "teacher" && (
          <StudentsListForTeachers
            curriculumSelectedData={curriculumSelectedData}
            classCall={classCall}
            selectedClassDate={selectedClassDate}
          />
        )}
    </div>
  );
}
// <>
{
  /* CURRICULUM LISTS */
}
{
  /* <div className="flex flex-col w-full">
    <div className="bg-klGreen-500/20 dark:bg-klGreen-500/30 text-center p-[1vw]">
      Alunos
    </div>
    <table className="table-auto w-full border-collapse border border-transparent">
      {curriculumSelectedData.students.length !== 0 && (
        <thead className="bg-klGreen-500 sticky top-0 text-gray-100 text-sm md:text-base z-40">
          <tr>
            <th className="border-r dark:border-klGreen-500 p-2 font-normal">
              Nome
            </th>
            <th className="border-r dark:border-klGreen-500 p-2 font-normal">
              Turma
            </th>
            <th className="border-r dark:border-klGreen-500 p-2 font-normal">
              Dias de Aula
            </th>
            <th className="border-r dark:border-klGreen-500 p-2 font-normal">
              Contato
            </th>
          </tr>
        </thead>
      )}
      <tbody className="[&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 text-sm md:text-base">
        {curriculumSelectedData.students.length ? (
          curriculumSelectedData.students
            .sort(
              (a, b) =>
                handleOneStudentDetails(a.id)!.publicId! -
                handleOneStudentDetails(b.id)!.publicId!
            )

            .map((student, index) => (
              <>
                <tr
                  key={index}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td
                    key={index}
                    className="border-r dark:border-klGreen-500 p-2 text-center"
                  >
                    {handleOneStudentDetails(student.id)?.name}
                  </td>
                  <td
                    key={index + 1}
                    className="border-r dark:border-klGreen-500 p-2 text-center"
                  >
                    {handleSchoolYearName(
                      handleOneStudentDetails(student.id)!.schoolYears
                    )}{" "}
                    -{" "}
                    {handleSchoolYearComplementName(
                      handleOneStudentDetails(student.id)!
                        .schoolYearsComplement
                    )}
                  </td>
                  <td
                    key={index + 2}
                    className="border-r dark:border-klGreen-500 p-2 text-center"
                  >
                    {handleOneStudentDetails(student.id)
                      ?.curriculumIds.filter(
                        (curriculum) => curriculum.id === curriculumId
                      )[0]
                      .indexDays.map(handleClassDaysName)
                      .join(" - ")}
                  </td>
                  <td
                    key={index + 3}
                    className="border-r dark:border-klGreen-500 p-2 text-center"
                  >
                    {handleOneStudentDetails(student.id)
                      ?.financialResponsible.phone &&
                      formatPhoneNumber(
                        handleOneStudentDetails(student.id)!
                          .financialResponsible.phone
                      )}
                  </td>
                </tr>
              </>
            ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center p-4">
              <p className="text-klGreen-500 dark:text-white">
                Nenhum aluno encontrado
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div> */
}
// </>
