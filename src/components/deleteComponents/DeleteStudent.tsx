import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
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

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteStudentValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  DeleteStudentValidationZProps,
  SchoolClassSearchProps,
  SchoolSearchProps,
} from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteStudent() {
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

  // STUDENT SELECTED ACTIVE STATE
  const [isSelected, setIsSelected] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOLS
  const [schoolsDataArray, setSchoolsDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolsDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setIsSelected(false);
    setSchoolClassSelectedData(undefined);
    setCurriculumSelectedData(undefined);
    if (studentData.schoolId !== "") {
      setSchoolSelectedData(
        schoolsDataArray!.find(({ id }) => id === studentData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);

  // RESET SCHOOL CLASS, SCHOOL COURSE AND CURRICULUM SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
  }, [studentData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASSES
  const [schoolClassesDataArray, setSchoolClassesDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolClassSelectedData = (data: SchoolClassSearchProps[]) => {
    setSchoolClassesDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setIsSelected(false);
    setCurriculumSelectedData(undefined);
    if (studentData.schoolClassId !== "") {
      setSchoolSelectedData(
        schoolClassesDataArray!.find(
          ({ id }) => id === studentData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [schoolClassSelectedData]);

  // RESET CURRICULUM SELECT TO INDEX 0 WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
  }, [studentData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF SELECT STUDENTS
  const [curriculumDataArray, setCurriculumDataArray] =
    useState<CurriculumSearchProps[]>();

  // FUNCTION THAT WORKS WITH CURRICULUM SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleCurriculumSelectedData = (data: CurriculumSearchProps[]) => {
    setCurriculumDataArray(data);
  };

  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (studentData.curriculumId !== "") {
      setIsSelected(true);
      setCurriculumSelectedData(
        curriculumDataArray!.find(({ id }) => id === studentData.curriculumId)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumSelectedData]);

  // GET AVAILABLE STUDENTS WHEN CURRICULUM CHANGE
  useEffect(() => {
    if (studentData.curriculumId) {
      setIsSelected(true);
      handleAvailableStudentsData();
    }
  }, [studentData.curriculumId]);
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENTS SELECT STATES AND FUNCTIONS -------------------------- //
  const [studentsArrayData, setStudentsArrayData] = useState([]);

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
  // -------------------------- END OF STUDENTS SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setStudentData({
      studentId: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      confirmDelete: false,
    });
    setIsSelected(false);
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
          // DELETING REGISTER FROM THE BROTHER'S REGISTRATION
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
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Aluno</h1>

      {/* FORM */}
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
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setStudentData({ ...studentData, schoolId: e.target.value });
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
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            id="schoolClassSelect"
            disabled={studentData.schoolId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              studentData.schoolId
                ? errors.schoolClassId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setStudentData({ ...studentData, schoolClassId: e.target.value });
            }}
          >
            {studentData.schoolId ? (
              <SelectOptions
                returnId
                dataType="schoolClasses"
                schoolId={studentData.schoolId}
                handleData={handleSchoolClassSelectedData}
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
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="curriculumSelect"
            defaultValue={" -- select an option -- "}
            className={
              studentData.schoolClassId
                ? errors.curriculumId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="curriculumSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                curriculumId: e.target.value,
                confirmDelete: false,
              });
            }}
          >
            {studentData.schoolClassId ? (
              <SelectOptions
                returnId
                displaySchoolCourseAndSchedule
                dataType="curriculum"
                schoolId={studentData.schoolId}
                schoolClassId={studentData.schoolClassId}
                handleData={handleCurriculumSelectedData}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma Turma para ver as modalidades disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* STUDENT SELECT CARD SECTION */}
        {isSelected ? (
          <>
            {studentsArrayData.length !== 0 ? (
              <>
                {/* STUDENT SELECT CARD SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Escolha o aluno a ser excluído:
                </h1>

                {/* SEPARATOR */}
                <hr className="pb-4" />

                {/* STUDENT SELECT CARD */}
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
                          <p>
                            Nome:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.name}
                            </span>
                          </p>
                          <p>
                            E-mail:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.email}
                            </span>
                          </p>
                          <p>
                            Responsável:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.responsible}
                            </span>
                          </p>
                          <p>
                            Responsável Financeiro:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.financialResponsible}
                            </span>
                          </p>
                          <p>
                            Telefone:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {c.phone}
                            </span>
                          </p>
                          {c.phoneSecondary !== " -" ? (
                            <p>
                              Telefone 2:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {c.phoneSecondary}
                              </span>
                            </p>
                          ) : null}
                          {c.phoneTertiary !== " -" ? (
                            <p>
                              Telefone 3:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {c.phoneTertiary}
                              </span>
                            </p>
                          ) : null}
                        </label>
                      </div>
                    </>
                  ))}
                </div>

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
              </>
            ) : (
              <>
                {/* STUDENT SELECT CARD EMPTY SUBTITLE */}
                <div className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Nenhum aluno encontrado.
                </div>
              </>
            )}
            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={studentsArrayData.length === 0 ? true : isSubmitting}
                className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
              >
                {studentsArrayData.length === 0
                  ? "Nenhum aluno encontrado"
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
