/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { deleteStudentValidationSchema } from "../zodValidation";
import { DeleteStudentValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditStudent() {
  // STUDENT DATA
  const [studentData, setStudentData] = useState<DeleteStudentValidationZProps>(
    {
      studentId: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      confirmDelete: false,
    }
  );

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DATA ARRAY STATES
  const [schoolClassesData, setSchoolClassesData] = useState([]);
  const [curriculumsData, setCurriculumsData] = useState([]);
  const [studentsArrayData, setStudentsArrayData] = useState([]);

  // DISABLE SELECT STATE
  const [toggleSelect, setToggleSelect] = useState<
    "school" | "class" | "course"
  >("school");

  // GET SCHOOL CLASS DATA FUNCTION
  async function getSchoolClassData(id: string) {
    setToggleSelect("class");
    const schoolClassRef = collection(db, "schoolClasses");
    const q = query(schoolClassRef, where("schoolId", "==", id));
    const querySnapshot = await getDocs(q);
    const schoolClassDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      schoolClassDataPromises.push(promise);
    });
    setStudentData({ ...studentData, schoolId: id, confirmDelete: false });
    setSchoolClassesData(schoolClassDataPromises);
  }

  // GET SCHOOL COURSE DATA FUNCTION
  async function getSchoolCourseData(id: string) {
    setToggleSelect("course");
    const schoolCourseRef = collection(db, "curriculum");
    const q = query(
      schoolCourseRef,
      where("schoolClassId", "==", id),
      where("schoolId", "==", studentData.schoolId)
    );
    const querySnapshot = await getDocs(q);
    const curriculumDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      curriculumDataPromises.push(promise);
    });
    setStudentData({ ...studentData, schoolClassId: id, confirmDelete: false });
    setCurriculumsData(curriculumDataPromises);
  }

  // GETTING STUDENTS AVAILABLE DATA
  const handleAvailableStudentsData = async () => {
    const q = query(
      collection(db, "students"),
      where("curriculum", "array-contains", studentData.curriculumId),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setStudentsArrayData(promises);
  };

  // SET AVAILABLE STUDENTS DATA WHEN CHOOSE COURSE
  useEffect(() => {
    handleAvailableStudentsData();
  }, [studentData.curriculumId]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteStudentValidationZProps>({
    resolver: zodResolver(deleteStudentValidationSchema),
    defaultValues: {
      studentId: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setStudentData({
      studentId: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      confirmDelete: false,
    });
    setToggleSelect("school");
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("studentId", studentData.studentId);
    setValue("curriculumId", studentData.curriculumId);
    setValue("schoolId", studentData.schoolId);
    setValue("schoolClassId", studentData.schoolClassId);
    setValue("confirmDelete", studentData.confirmDelete);
  }, [studentData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.studentId,
      errors.curriculumId,
      errors.schoolId,
      errors.schoolClassId,
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
  const handleDeleteStudent: SubmitHandler<
    DeleteStudentValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o aluno... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // TEST FOR BROTHERS REGISTERED
    const studentRef = collection(db, "students");
    const q = query(
      studentRef,
      where("familyAtSchool", "array-contains", data.studentId)
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF EXISTS, REMOVE THIS STUDENT FROM YOUR BROTHER'S REGISTRATION
      if (results.length !== 0) {
        try {
          // DELETING REGISTER FROM THE REGISTRATION OF OTHER BROTHER
          const deleteStudentBrother = async () => {
            for (let i = 0; i < results.length; i++) {
              const studentBrotherRef = doc(db, "students", results[i].id);
              await updateDoc(studentBrotherRef, {
                familyAtSchool: arrayRemove(data.studentId),
              });
            }
          };
          deleteStudentBrother();
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
        // DELETE STUDENT
        const deleteStudent = async () => {
          try {
            await deleteDoc(doc(db, "students", data.studentId));
            resetForm();
            toast.success(`Aluno excluído com sucesso! 👌`, {
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
        deleteStudent();
      } else {
        // DELETE STUDENT
        const deleteStudent = async () => {
          try {
            await deleteDoc(doc(db, "students", data.studentId));
            resetForm();
            toast.success(`Aluno excluído com sucesso! 👌`, {
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
        deleteStudent();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Editar Aluno</h1>
      <form
        onSubmit={handleSubmit(handleDeleteStudent)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.schoolId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            disabled={toggleSelect !== "school" ? true : false}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              getSchoolClassData(e.target.value);
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
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            disabled={toggleSelect !== "class" ? true : false}
            className={
              studentData.schoolId
                ? errors.schoolClassId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              getSchoolCourseData(e.target.value);
            }}
          >
            {studentData.schoolId ? (
              <>
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                {schoolClassesData.map((option: any) => (
                  <option key={option.id} value={option.id}>
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

        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.curriculumId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            disabled={toggleSelect !== "course" ? true : false}
            className={
              studentData.schoolClassId
                ? errors.curriculumId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                curriculumId: e.target.value,
                confirmDelete: false,
              });
            }}
          >
            {studentData.schoolClassId ? (
              <>
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                {curriculumsData.map((option: any) => (
                  <option key={option.id} value={option.id}>
                    {option.schoolCourse} | {option.schedule}
                  </option>
                ))}
              </>
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma Turma para ver as modalidades disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* STUDENT SELECT */}
        {studentData.schoolId &&
        studentData.schoolClassId &&
        studentData.curriculumId ? (
          studentsArrayData.length !== 0 ? (
            <>
              <h1 className="font-bold text-lg py-4">
                Escolha o aluno a ser excluído:
              </h1>
              <hr className="pb-4" />
              <div className="flex flex-wrap gap-4 justify-center">
                {studentsArrayData.map((c: any) => (
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
                          setStudentData({
                            ...studentData,
                            studentId: e.target.value,
                            confirmDelete: false,
                          })
                        }
                      />
                      <label htmlFor={c.id} className="flex flex-col gap-4">
                        <p>Nome: {c.name}</p>
                        <p>E-mail: {c.email}</p>
                        <p>Responsável: {c.responsible}</p>
                        <p>Responsável Financeiro: {c.financialResponsible}</p>
                        <p>Telefone: {c.phone}</p>
                        {c.phoneSecondary !== " -" ? (
                          <p>Telefone 2: {c.phoneSecondary}</p>
                        ) : null}
                        {c.phoneTertiary !== " -" ? (
                          <p>Telefone 3: {c.phoneTertiary}</p>
                        ) : null}
                      </label>
                    </div>
                  </>
                ))}
              </div>
            </>
          ) : (
            <div className="pt-4">Nenhum aluno encontrado.</div>
          )
        ) : (
          <div className="pt-4">
            Selecione Colégio, Turma e Modalidade para ver os alunos
            cadastrados.
          </div>
        )}

        {/** CHECKBOX CONFIRM DELETE */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none"
            checked={studentData.confirmDelete}
            onChange={() => {
              setStudentData({
                ...studentData,
                confirmDelete: !studentData.confirmDelete,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            Confirmar exclusão do Aluno
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
