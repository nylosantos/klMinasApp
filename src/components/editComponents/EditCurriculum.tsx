/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
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

import { deleteCurriculumValidationSchema } from "../../@types/zodValidation";
import { DeleteCurriculumValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditCurriculum() {
  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<DeleteCurriculumValidationZProps>({
      curriculum: "",
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      confirmDelete: false,
    });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SCHOOL CLASSES ARRAY STATE
  const [schoolClassesData, setSchoolClassesData] = useState([]);
  const [schedulesDetailsData, setSchedulesDetailsData] = useState([]);
  const [curriculumCoursesId, setCurriculumCoursesId] = useState([]);
  const [toggleSchoolAndClass, setToggleSchoolAndClass] = useState<
    "school" | "class"
  >("school");

  // GET SCHOOL CLASS DATA FUNCTION
  async function getSchoolClassData(name: string) {
    setToggleSchoolAndClass("class");
    const schoolClassRef = collection(db, "schoolClasses");
    const q = query(schoolClassRef, where("schoolName", "==", name));
    const querySnapshot = await getDocs(q);
    const schoolClassDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      schoolClassDataPromises.push(promise);
    });
    setCurriculumData({
      ...curriculumData,
      school: name,
      confirmDelete: false,
    });
    setSchoolClassesData(schoolClassDataPromises);
  }

  // GETTING SCHEDULES DATA
  const handleSchedulesDetails = async () => {
    const q = query(collection(db, "schedules"));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setSchedulesDetailsData(promises);
  };

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    handleSchedulesDetails();
  }, []);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = async () => {
    const q = query(
      collection(db, "curriculum"),
      where("school", "==", curriculumData.school),
      where("schoolClass", "==", curriculumData.schoolClass),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setCurriculumCoursesId(promises);
  };

  // SET CURRICULUM DATA WHEN CHOOSE CLASS
  useEffect(() => {
    handleAvailableCoursesData();
  }, [curriculumData.schoolClass]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteCurriculumValidationZProps>({
    resolver: zodResolver(deleteCurriculumValidationSchema),
    defaultValues: {
      curriculum: "",
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
    setCurriculumData({
      curriculum: "",
      curriculumId: "",
      school: "",
      schoolId: "",
      schoolClass: "",
      schoolClassId: "",
      schoolCourse: "",
      schoolCourseId: "",
      confirmDelete: false,
    });
    setToggleSchoolAndClass("school");
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("curriculum", curriculumData.curriculum);
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
      errors.curriculum,
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
    const curriculumRef = collection(db, "students");
    const q = query(
      curriculumRef,
      where("curriculum", "array-contains-any", [data.curriculumId])
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
        console.log(results)
        return (
          setIsSubmitting(false),
          toast.error(
            `Currículo incluído em ${results.length} ${
              results.length === 1 ? "cadastro de aluno" : "cadastros de alunos"
            }, exclua ou altere primeiramente ${
              results.length === 1 ? "o aluno" : "os alunos"
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
        deleteCurriculum();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Editar Currículo</h1>
      <form
        onSubmit={handleSubmit(handleDeleteCurriculum)}
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
            disabled={toggleSchoolAndClass === "class" ? true : false}
            className={
              errors.school
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              getSchoolClassData(e.target.value);
            }}
          >
            <SelectOptions dataType="schools" />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
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
            disabled={curriculumData.school ? false : true}
            className={
              curriculumData.school
                ? errors.schoolClass
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolClass: e.target.value,
                confirmDelete: false,
              });
            }}
          >
            {curriculumData.school ? (
              <>
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                {schoolClassesData.map((option: any) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </>
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver as turmas disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.school && curriculumData.schoolClass ? (
          curriculumCoursesId.length !== 0 ? (
            <>
              <h1 className="font-bold text-lg py-4">
                Modalidades {curriculumData.school} -{" "}
                {curriculumData.schoolClass}:
              </h1>
              <hr className="pb-4" />
              <div className="flex flex-wrap gap-4 justify-center">
                {curriculumCoursesId.map((c: any) => (
                  <>
                    <div
                      className="flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                      key={c.id}
                    >
                      <input
                        type="radio"
                        id={c.id}
                        name="age"
                        value={c.id}
                        onChange={(e) =>
                          setCurriculumData({
                            ...curriculumData,
                            curriculumId: e.target.value,
                            schoolCourse: c.schoolCourse,
                            curriculum: c.name,
                            confirmDelete: false,
                          })
                        }
                      />
                      <label htmlFor={c.id} className="flex flex-col gap-4">
                        {curriculumData.school === "Colégio Bernoulli" ? (
                          <p>Turma: {c.schoolClass}</p>
                        ) : null}
                        <p>Modalidade: {c.schoolCourse}</p>
                        {schedulesDetailsData.map((details: any) =>
                          details.name === c.schedule
                            ? `Horário: De ${details.classStart} a ${details.classEnd} hrs`
                            : null
                        )}
                        <p>Dias: {c.classDay}</p>
                        <p>Professor: {c.teacher}</p>
                      </label>
                    </div>
                  </>
                ))}
              </div>
            </>
          ) : (
            <div className="pt-4">Nenhum currículo encontrado.</div>
          )
        ) : (
          <div className="pt-4">
            Selecione um colégio e uma turma para ver as modalidades
            disponíveis.
          </div>
        )}

        {/** CHECKBOX CONFIRM DELETE */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none"
            checked={curriculumData.confirmDelete}
            onChange={() => {
              setCurriculumData({
                ...curriculumData,
                confirmDelete: !curriculumData.confirmDelete,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            Confirmar exclusão do Currículo
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
      </form>
    </div>
  );
}
