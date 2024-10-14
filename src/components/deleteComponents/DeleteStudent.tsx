/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
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
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteStudent() {
  // GET GLOBAL DATA
  const {
    curriculumDatabaseData,
    schoolClassDatabaseData,
    schoolDatabaseData,
    studentsDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // STUDENT DATA
  const [studentData, setStudentData] = useState<DeleteStudentValidationZProps>(
    {
      studentId: "",
      studentName: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      studentType: "",
      confirmDelete: false,
    }
  );

  // STUDENT SELECTED ACTIVE STATE
  const [isSelected, setIsSelected] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
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
        schoolDatabaseData.find(({ id }) => id === studentData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);

  // RESET SCHOOL CLASS AND CURRICULUM SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentType") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setStudentsArrayData([]);
  }, [studentData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setIsSelected(false);
    setCurriculumSelectedData(undefined);
    if (studentData.schoolClassId !== "") {
      setSchoolSelectedData(
        schoolClassDatabaseData.find(
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
    (
      document.getElementById("studentType") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setStudentsArrayData([]);
  }, [studentData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (studentData.curriculumId !== "") {
      setCurriculumSelectedData(
        curriculumDatabaseData.find(({ id }) => id === studentData.curriculumId)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumSelectedData]);

  // RESET CURRICULUM SELECT TO INDEX 0 WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    (
      document.getElementById("studentType") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setStudentsArrayData([]);
    setStudentData({ ...studentData, studentType: "" });
  }, [studentData.curriculumId]);

  // GET AVAILABLE STUDENTS WHEN CURRICULUM CHANGE
  useEffect(() => {
    if (studentData.studentType !== "") {
      setStudentsArrayData([]);
      handleAvailableStudentsData();
      setIsSelected(true);
    }
  }, [studentData.studentType]);
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENTS SELECT STATES AND FUNCTIONS -------------------------- //
  const [studentsArrayData, setStudentsArrayData] = useState<
    StudentSearchProps[]
  >([]);

  // GETTING STUDENTS AVAILABLE DATA
  const handleAvailableStudentsData = () => {
    const studentsToArray: StudentSearchProps[] = [];
    setLoadingData(true);
    if (studentData.studentType === "enrolled") {
      studentsDatabaseData.map((student) => {
        if (student.curriculumIds) {
          // ENROLLED STUDENTS
          student.curriculumIds.map((studentCurriculum) => {
            if (studentData.curriculumId === studentCurriculum.id) {
              studentsToArray.push(student);
            }
          });
        }
      });
      setStudentsArrayData(studentsToArray);
    }
    if (studentData.studentType === "experimental") {
      studentsDatabaseData.map((student) => {
        if (student.experimentalCurriculumIds) {
          // EXPERIMENTAL STUDENTS
          student.experimentalCurriculumIds.map(
            (studentExperimentalCurriculum) => {
              if (
                studentData.curriculumId === studentExperimentalCurriculum.id
              ) {
                studentsToArray.push(student);
              }
            }
          );
        }
      });
      setStudentsArrayData(studentsToArray);
    }
    if (studentData.studentType === "all") {
      studentsDatabaseData.map((student) => {
        if (student.curriculumIds || student.experimentalCurriculumIds) {
          // ENROLLED STUDENTS
          student.curriculumIds.map((studentCurriculum) => {
            if (studentData.curriculumId === studentCurriculum.id) {
              studentsToArray.push(student);
            }
          });
          // EXPERIMENTAL STUDENTS
          student.experimentalCurriculumIds.map(
            (studentExperimentalCurriculum) => {
              if (
                studentData.curriculumId === studentExperimentalCurriculum.id
              ) {
                studentsToArray.push(student);
              }
            }
          );
        }
        setStudentsArrayData(studentsToArray);
      });
    }
    setLoadingData(false);
  };

  // LOADING STATE FOR USING WHEN IS LOADING DATA
  const [loadingData, setLoadingData] = useState(false);

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
      studentName: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      studentType: "",
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
      studentName: "",
      curriculumId: "",
      schoolId: "",
      schoolClassId: "",
      studentType: "",
      confirmDelete: false,
    });
    setStudentsArrayData([]);
    setIsSelected(false);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("studentId", studentData.studentId);
    setValue("studentName", studentData.studentName);
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

    const studentToDelete = studentsDatabaseData.find(
      (student) => student.id === data.studentId
    );
    if (studentToDelete) {
      // TEST FOR BROTHERS REGISTERED
      if (studentToDelete.studentFamilyAtSchool.length > 0) {
        // IF EXISTS, REMOVE THIS STUDENT FROM YOUR BROTHER'S REGISTRATION
        studentToDelete.studentFamilyAtSchool.map(async (studentFamily) => {
          const editingStudentFamily = studentsDatabaseData.find(
            (student) => student.id === studentFamily.id
          );
          if (editingStudentFamily) {
            const foundedStudentOnFamilyRecord =
              editingStudentFamily.studentFamilyAtSchool.find(
                (student) => student.id === data.studentId
              );
            if (foundedStudentOnFamilyRecord) {
              // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND DOESN'T HAVE A SECOND COURSE DISCOUNT (CHANGE TO FULL PRICE)
              if (
                editingStudentFamily.familyDiscount && // PREVENT A BUG THAT ACCEPTS ADD BROTHER TO STUDENT WHO ALREADY HAS A BROTHER
                editingStudentFamily.studentFamilyAtSchool.length === 1 &&
                !editingStudentFamily.secondCourseDiscount
              ) {
                await updateDoc(doc(db, "students", editingStudentFamily.id), {
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: foundedStudentOnFamilyRecord.applyDiscount,
                    id: foundedStudentOnFamilyRecord.id,
                    name: foundedStudentOnFamilyRecord.name,
                  }),
                  familyDiscount: false,
                  appliedPrice: editingStudentFamily.fullPrice,
                });
                // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND HAVE A SECOND COURSE DISCOUNT (DON'T CHANGE PRICE)
              } else if (
                editingStudentFamily.familyDiscount && // PREVENT A BUG THAT ACCEPTS ADD BROTHER TO STUDENT WHO ALREADY HAS A BROTHER
                editingStudentFamily.studentFamilyAtSchool.length === 1
              ) {
                await updateDoc(doc(db, "students", editingStudentFamily.id), {
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: foundedStudentOnFamilyRecord.applyDiscount,
                    id: foundedStudentOnFamilyRecord.id,
                    name: foundedStudentOnFamilyRecord.name,
                  }),
                  familyDiscount: false,
                });
                // AFTER DELETE IF BROTHER WILL HAVE ANOTHER FAMILY (DON'T CHANGE PRICE)
              } else if (
                editingStudentFamily.familyDiscount && // PREVENT A BUG THAT ACCEPTS ADD BROTHER TO STUDENT WHO ALREADY HAS A BROTHER
                editingStudentFamily.studentFamilyAtSchool.length > 1
              ) {
                await updateDoc(doc(db, "students", editingStudentFamily.id), {
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: foundedStudentOnFamilyRecord.applyDiscount,
                    id: foundedStudentOnFamilyRecord.id,
                    name: foundedStudentOnFamilyRecord.name,
                  }),
                });
                // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND DOESN'T HAVE A SECOND COURSE DISCOUNT (CHANGE TO FULL PRICE)
              } else if (
                !editingStudentFamily.familyDiscount && // NORMAL SCENARIO, WHERE A BROTHER DON'T HAVE A FAMILY DISCOUNT, BECAUSE HAS RECEIVED A BROTHER THAT HAVE A DISCOUNT
                editingStudentFamily.studentFamilyAtSchool.length === 1 &&
                !editingStudentFamily.secondCourseDiscount
              ) {
                await updateDoc(doc(db, "students", editingStudentFamily.id), {
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: foundedStudentOnFamilyRecord.applyDiscount,
                    id: foundedStudentOnFamilyRecord.id,
                    name: foundedStudentOnFamilyRecord.name,
                  }),
                  familyDiscount: false,
                  appliedPrice: editingStudentFamily.fullPrice,
                });
                // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND HAVE A SECOND COURSE DISCOUNT (DON'T CHANGE PRICE)
              } else if (
                !editingStudentFamily.familyDiscount && // NORMAL SCENARIO, WHERE A BROTHER DON'T HAVE A FAMILY DISCOUNT, BECAUSE HAS RECEIVED A BROTHER THAT HAVE A DISCOUNT
                editingStudentFamily.studentFamilyAtSchool.length === 1
              ) {
                await updateDoc(doc(db, "students", editingStudentFamily.id), {
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: foundedStudentOnFamilyRecord.applyDiscount,
                    id: foundedStudentOnFamilyRecord.id,
                    name: foundedStudentOnFamilyRecord.name,
                  }),
                  familyDiscount: false,
                });
                // AFTER DELETE IF BROTHER WILL HAVE ANOTHER FAMILY (DON'T CHANGE PRICE)
              } else if (
                !editingStudentFamily.familyDiscount && // NORMAL SCENARIO, WHERE A BROTHER DON'T HAVE A FAMILY DISCOUNT, BECAUSE HAS RECEIVED A BROTHER THAT HAVE A DISCOUNT
                editingStudentFamily.studentFamilyAtSchool.length > 1
              ) {
                await updateDoc(doc(db, "students", editingStudentFamily.id), {
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: foundedStudentOnFamilyRecord.applyDiscount,
                    id: foundedStudentOnFamilyRecord.id,
                    name: foundedStudentOnFamilyRecord.name,
                  }),
                });
              }
            }
          }
        });
      }

      // DELETE STUDENT FROM EXPERIMENTAL CLASSES
      if (studentToDelete.experimentalCurriculumIds.length > 0) {
        studentToDelete.experimentalCurriculumIds.map(
          async (experimentalStudentCurriculum) => {
            const editingExperimentalCurriculum = curriculumDatabaseData.find(
              (experimentalCurriculum) =>
                experimentalCurriculum.id === experimentalStudentCurriculum.id
            );
            if (editingExperimentalCurriculum) {
              const foundedStudentOnExperimentalCurriculum =
                editingExperimentalCurriculum.experimentalStudents.find(
                  (student) => student.id === data.studentId
                );

              if (foundedStudentOnExperimentalCurriculum) {
                await updateDoc(
                  doc(db, "curriculum", editingExperimentalCurriculum.id),
                  {
                    experimentalStudents: arrayRemove({
                      date: foundedStudentOnExperimentalCurriculum.date,
                      id: foundedStudentOnExperimentalCurriculum.id,
                      indexDays:
                        foundedStudentOnExperimentalCurriculum.indexDays,
                      isExperimental:
                        foundedStudentOnExperimentalCurriculum.isExperimental,
                      name: foundedStudentOnExperimentalCurriculum.name,
                      price: foundedStudentOnExperimentalCurriculum.price,
                    }),
                  }
                );
              }
            }
          }
        );
      }

      // DELETE STUDENT FROM CURRICULUM
      if (studentToDelete.curriculumIds.length > 0) {
        studentToDelete.curriculumIds.map(async (studentCurriculum) => {
          const editingCurriculum = curriculumDatabaseData.find(
            (curriculum) => curriculum.id === studentCurriculum.id
          );
          if (editingCurriculum) {
            const foundedStudentOnCurriculum = editingCurriculum.students.find(
              (student) => student.id === data.studentId
            );

            if (foundedStudentOnCurriculum) {
              await updateDoc(doc(db, "curriculum", editingCurriculum.id), {
                students: arrayRemove({
                  date: foundedStudentOnCurriculum.date,
                  id: foundedStudentOnCurriculum.id,
                  indexDays: foundedStudentOnCurriculum.indexDays,
                  isExperimental: foundedStudentOnCurriculum.isExperimental,
                  name: foundedStudentOnCurriculum.name,
                  price: foundedStudentOnCurriculum.price,
                }),
              });
            }
          }
        });
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
      toast.error(
        `Ocorreu um erro, aluno não encontrado no banco de dados... 🤯`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
      setIsSubmitting(false);
    }
  };

  function handleFormatStudentBirthdate(data: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const printData: any = data;
    return printData.toDate().toLocaleDateString();
  }

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
              setStudentData({ ...studentData, schoolId: e.target.value });
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
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="curriculumSelect"
            defaultValue={" -- select an option -- "}
            disabled={studentData.schoolClassId ? false : true}
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
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione um Ano Escolar para ver as modalidades disponíveis
                --{" "}
              </option>
            )}
          </select>
        </div>

        {/* STUDENT TYPE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="studentType"
            className={
              errors.curriculumId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Tipo de matrícula:{" "}
          </label>
          <select
            id="studentType"
            defaultValue={" -- select an option -- "}
            disabled={studentData.curriculumId ? false : true}
            className={
              studentData.curriculumId
                ? errors.studentType
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="studentType"
            onChange={(e) => {
              if (
                e.target.value === "enrolled" ||
                e.target.value === "experimental" ||
                e.target.value === "all"
              ) {
                setStudentData({
                  ...studentData,
                  studentType: e.target.value,
                  confirmDelete: false,
                });
              }
            }}
          >
            {studentData.schoolClassId ? (
              <>
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                <option value={"enrolled"}>
                  Incluir apenas alunos matriculados
                </option>
                <option value={"experimental"}>
                  Incluir apenas alunos com aulas experimentais agendadas
                </option>
                <option value={"all"}>Mostrar todos os alunos</option>
              </>
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma Modalidade para ver os tipos de matrícula
                disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* STUDENT SELECT CARD SECTION */}
        {isSelected && (
          loadingData ? (
            <>
              {/* DATA LOADING */}
              <SubmitLoading
                isSubmitting={loadingData}
                whatsGoingOn="carregando"
                isNotFullScreen
              />
            </>
          ) : (
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
                    {studentsArrayData.map((student) => (
                      <>
                        <div
                          className="flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                          key={student.id}
                        >
                          <input
                            type="radio"
                            id={student.id}
                            name="age"
                            value={student.id}
                            className="text-klGreen-500 dark:text-klGreen-500 border-none"
                            onChange={(e) =>
                              setStudentData({
                                ...studentData,
                                studentId: e.target.value,
                                studentName: student.name,
                                confirmDelete: false,
                              })
                            }
                          />
                          <label
                            htmlFor={student.id}
                            className="flex flex-col gap-4"
                          >
                            <p className="text-center">Dados do Aluno</p>
                            <p>
                              Nome:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.name}
                              </span>
                            </p>
                            <p>
                              Data de Nascimento:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {handleFormatStudentBirthdate(
                                  student.birthDate
                                )}
                              </span>
                            </p>

                            <p className="text-center">Filiação 1</p>
                            <p>
                              Nome:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.parentOne.name}
                              </span>
                            </p>
                            <p>
                              E-mail:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.parentOne.email}
                              </span>
                            </p>
                            <p>
                              Telefone:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.parentOne.phone}
                              </span>
                            </p>
                            <p className="text-center">Filiação 2</p>
                            <p>
                              Nome:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.parentTwo.name}
                              </span>
                            </p>
                            <p>
                              E-mail:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.parentTwo.email}
                              </span>
                            </p>
                            <p>
                              Telefone:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.parentTwo.phone}
                              </span>
                            </p>
                            <p className="text-center">
                              Responsável Financeiro
                            </p>
                            <p>
                              Nome:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.financialResponsible.name}
                              </span>
                            </p>
                            <p>
                              E-mail:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.financialResponsible.email}
                              </span>
                            </p>
                            <p>
                              Telefone:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {student.financialResponsible.phone}
                              </span>
                            </p>
                            {student.financialResponsible.phoneSecondary !==
                              "" && (
                              <p>
                                Telefone 2:{" "}
                                <span className="text-red-600 dark:text-yellow-500">
                                  {student.financialResponsible.phoneSecondary}
                                </span>
                              </p>
                            )}
                            {student.financialResponsible.phoneTertiary !==
                              "" && (
                              <p>
                                Telefone 3:{" "}
                                <span className="text-red-600 dark:text-yellow-500">
                                  {student.financialResponsible.phoneTertiary}
                                </span>
                              </p>
                            )}
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
                      className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                      checked={studentData.confirmDelete}
                      onChange={() => {
                        setStudentData({
                          ...studentData,
                          confirmDelete: !studentData.confirmDelete,
                        });
                      }}
                    />
                    <label htmlFor="confirmDelete" className="text-sm">
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
                  disabled={
                    studentsArrayData.length === 0 ? true : isSubmitting
                  }
                  className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
          )
        )}
      </form>
    </div>
  );
}
