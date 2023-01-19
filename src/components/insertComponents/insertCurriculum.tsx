/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
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

import { createCurriculumValidationSchema } from "../zodValidation";
import {
  CreateCurriculumValidationZProps,
  GetCurriculumNameProps,
  HandleCurriculumNameNameProps,
} from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCurriculum() {
  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<CreateCurriculumValidationZProps>({
      school: "",
      schoolClass: "",
      schoolCourse: "",
      schedule: "",
      classDay: "",
      teacher: "",
      confirmInsert: false,
    });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DATA TYPE ARRAY STATE
  const [dataTypeArray, setDataTypeArray] = useState({
    schools: [{ name: "" }],
    schoolClasses: [{ name: "" }],
    schoolCourses: [{ name: "" }],
    schedules: [{ name: "" }],
    classDays: [{ name: "" }],
    teachers: [{ name: "" }],
    curriculum: [{ name: "" }],
    students: [{ name: "" }],
  });

  // SCHEDULE DETAILS ARRAY STATE
  const [schedulesDetailsData, setSchedulesDetailsData] = useState([]);

  // GET SCHEDULE DETAILS FUNCTION
  const handleScheduleDetails = async () => {
    const scheduleDetailsRef = collection(db, "schedules");
    const q = query(
      scheduleDetailsRef,
      where("name", "==", curriculumData.schedule)
    );
    const querySnapshot = await getDocs(q);
    const dataTypePromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      dataTypePromises.push(promise);
    });
    setSchedulesDetailsData(dataTypePromises);
  };

  // GET SCHEDULE DETAILS WHEN CHOOSE SCHEDULE
  useEffect(() => {
    handleScheduleDetails();
  }, [curriculumData.schedule]);

  // GET CURRICULUM NAME
  const handleCurriculumName = async ({
    id,
    fieldName,
    dataType,
  }: HandleCurriculumNameNameProps) => {
    setCurriculumData({ ...curriculumData, [fieldName]: id });
    const dataTypeRef = collection(db, dataType);
    const q = query(dataTypeRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const dataTypePromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      dataTypePromises.push(promise);
    });
    setDataTypeArray({ ...dataTypeArray, [dataType]: dataTypePromises });
  };

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCurriculumValidationZProps>({
    resolver: zodResolver(createCurriculumValidationSchema),
    defaultValues: {
      school: "",
      schoolClass: "",
      schoolCourse: "",
      schedule: "",
      classDay: "",
      teacher: "",
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setCurriculumData({
      school: "",
      schoolClass: "",
      schoolCourse: "",
      schedule: "",
      classDay: "",
      teacher: "",
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("school", curriculumData.school);
    setValue("schoolClass", curriculumData.schoolClass);
    setValue("schoolCourse", curriculumData.schoolCourse);
    setValue("schedule", curriculumData.schedule);
    setValue("classDay", curriculumData.classDay);
    setValue("teacher", curriculumData.teacher);
    setValue("confirmInsert", curriculumData.confirmInsert);
  }, [curriculumData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.school,
      errors.schoolClass,
      errors.schoolCourse,
      errors.schedule,
      errors.classDay,
      errors.teacher,
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

    // CHECKING IF CURRICULUM EXISTS ON DATABASE
    const curriculumRef = collection(db, "curriculum");
    const q = query(
      curriculumRef,
      where("school", "==", data.school),
      where("schoolClass", "==", data.schoolClass),
      where("schoolCourse", "==", data.schoolCourse),
      where("schedule", "==", data.schedule),
      where("classDay", "==", data.classDay),
      where("teacher", "==", data.teacher)
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
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
        const addCurriculum = async () => {
          const curriculumFormattedName = `${dataTypeArray.schools[0].name} | ${dataTypeArray.schoolCourses[0].name} | ${dataTypeArray.schedules[0].name} | ${dataTypeArray.classDays[0].name} | Professor: ${dataTypeArray.teachers[0].name}`;
          try {
            const commonId = uuidv4();
            await setDoc(doc(db, "curriculum", commonId), {
              id: commonId,
              name: curriculumFormattedName,
              school: data.school,
              schoolClass: data.schoolClass,
              schoolCourse: data.schoolCourse,
              schedule: data.schedule,
              classDay: data.classDay,
              teacher: data.teacher,
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
        addCurriculum();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Adicionar Currículo</h1>
      <form
        onSubmit={handleSubmit(handleAddCurriculum)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.school
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.school
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              handleCurriculumName({
                id: e.target.value,
                fieldName: "schoolId",
                dataType: "schools",
              });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.schoolClass
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolClass
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolClass: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schoolClasses" />
          </select>
        </div>

        {/* COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.schoolCourse
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolCourse
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              handleCurriculumName({
                id: e.target.value,
                fieldName: "schoolCourseId",
                dataType: "schoolCourses",
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
              errors.schedule
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Horário:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.schedule
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="scheduleSelect"
            onChange={(e) => {
              handleCurriculumName({
                id: e.target.value,
                fieldName: "scheduleId",
                dataType: "schedules",
              });
            }}
          >
            <SelectOptions returnId dataType="schedules" />
          </select>
        </div>

        {/* CLASS DAYS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classDaySelect"
            className={
              errors.classDay
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione os Dias de Aula:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.classDay
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="classDaySelect"
            onChange={(e) => {
              handleCurriculumName({
                id: e.target.value,
                fieldName: "classDayId",
                dataType: "classDays",
              });
            }}
          >
            <SelectOptions returnId dataType="classDays" />
          </select>
        </div>

        {/* TEACHER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherSelect"
            className={
              errors.teacher
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Professor:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.teacher
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="teacherSelect"
            onChange={(e) => {
              handleCurriculumName({
                id: e.target.value,
                fieldName: "teacherId",
                dataType: "teachers",
              });
            }}
          >
            <SelectOptions returnId dataType="teachers" />
          </select>
        </div>

        {/* CURRICULUM NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className="w-1/4 text-right text-gray-900 dark:text-gray-100"
          >
            Nome:{" "}
          </label>
          <input
            readOnly
            type="text"
            name="name"
            disabled
            placeholder="Escolha as opções acima para visualizar o nome do Currículo"
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            value={
              dataTypeArray.schools[0].name &&
              dataTypeArray.schoolCourses[0].name &&
              dataTypeArray.schedules[0].name &&
              dataTypeArray.classDays[0].name &&
              dataTypeArray.teachers[0].name
                ? `${dataTypeArray.schools[0].name} | ${dataTypeArray.schoolCourses[0].name} | ${dataTypeArray.schedules[0].name} | ${dataTypeArray.classDays[0].name} | Professor: ${dataTypeArray.teachers[0].name}`
                : ""
            }
          />
        </div>
        {/* {curriculumData.school && curriculumData.schoolClass && curriculumData.schoolCourse && curriculumData.schedule && curriculumData.classDay && curriculumData.teacher ? ( */}
          <div className="flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left">
            <p>Colégio: {curriculumData.school}</p>
            {curriculumData.school === "Colégio Bernoulli" ? (
              <p>Turma: {curriculumData.schoolClass}</p>
            ) : null}
            <p>Modalidade: {curriculumData.schoolCourse}</p>
            <p>Dias: {curriculumData.classDay}</p>
            {schedulesDetailsData.map((details: any) =>
              details.name === curriculumData.schedule
                ? `Horário: De ${details.classStart} a ${details.classEnd} hrs`
                : null
            )}
            <p>Professor: {curriculumData.teacher}</p>
          </div>
        {/* ) : null} */}

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none"
            checked={curriculumData.confirmInsert}
            onChange={() => {
              setCurriculumData({
                ...curriculumData,
                confirmInsert: !curriculumData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmInsert"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            Confirmar criação do Currículo
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
