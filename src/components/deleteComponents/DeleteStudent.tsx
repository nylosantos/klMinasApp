import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  arrayRemove,
  collection,
  collectionGroup,
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
  StudentSearchProps,
  SubCollectionDetailsProps,
  SubCollectionProps,
} from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteStudent() {
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
    (
      document.getElementById("studentType") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setStudentsArrayData([]);
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
      setCurriculumSelectedData(
        curriculumDataArray!.find(({ id }) => id === studentData.curriculumId)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumSelectedData]);

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
  const handleAvailableStudentsData = async () => {
    setLoadingData(true);
    // QUERY FOR EXPERIMENTAL STUDENTS
    const queryExperimental = query(
      collectionGroup(db, "studentExperimentalCurriculum"),
      where("idsArray", "array-contains", studentData.curriculumId)
    );
    // QUERY FOR ENROLLED STUDENTS
    const queryCurriculum = query(
      collectionGroup(db, "studentCurriculum"),
      where("idsArray", "array-contains", studentData.curriculumId)
    );
    const handleAllStudentsData = async () => {
      if (studentData.studentType === "experimental") {
        // GETTING EXPERIMENTAL STUDENTS
        const getExperimental = await getDocs(queryExperimental);
        getExperimental.forEach(async (doc) => {
          const studentId = doc.ref.parent.parent?.id;
          if (studentId) {
            const queryStudent = query(
              collection(db, "students"),
              where("id", "==", studentId)
            );
            const getStudentFullData = await getDocs(queryStudent);
            getStudentFullData.forEach((doc: any) => {
              const dataStudent: StudentSearchProps = doc.data();
              setStudentsArrayData((studentsArrayData) => [
                ...studentsArrayData,
                dataStudent,
              ]);
            });
          }
        });
      }
      if (studentData.studentType === "enrolled") {
        // GETTING ENROLLED STUDENTS
        const getCurriculum = await getDocs(queryCurriculum);
        getCurriculum.forEach(async (doc) => {
          const studentId = doc.ref.parent.parent?.id;
          if (studentId) {
            const queryStudent = query(
              collection(db, "students"),
              where("id", "==", studentId)
            );
            const getStudentFullData = await getDocs(queryStudent);
            getStudentFullData.forEach((doc: any) => {
              const dataStudent: StudentSearchProps = doc.data();
              setStudentsArrayData((studentsArrayData) => [
                ...studentsArrayData,
                dataStudent,
              ]);
            });
          }
        });
      }
    };
    await handleAllStudentsData();
    setLoadingData(false);
  };

  // LOADING STATE FOR USING WHEN IS LOADING DATA
  const [loadingData, setLoadingData] = useState(false);

  // STUDENT SELECTED DATA EXPERIMENTAL CURRICULUM ARRAY DETAILS
  const [
    experimentalCurriculumArrayDetails,
    setExperimentalCurriculumArrayDetails,
  ] = useState<SubCollectionDetailsProps[]>([]);

  // STUDENT SELECTED DATA CURRICULUM ARRAY DETAILS
  const [curriculumArrayDetails, setCurriculumArrayDetails] = useState<
    SubCollectionDetailsProps[]
  >([]);

  // GET STUDENT CURRICULUM DATA WHEN SELECT STUDENT
  useEffect(() => {
    if (studentData.studentId) {
      const handleAllCurriculumDetails = async () => {
        // GET EXPERIMENTAL CURRICULUM
        const queryExperimentalStudent = query(
          collection(
            db,
            `students/${studentData.studentId}/studentExperimentalCurriculum`
          )
        );
        const queryExperimentalStudentSnapshot = await getDocs(
          queryExperimentalStudent
        );
        const experimentalStudentPromises: any = [];
        queryExperimentalStudentSnapshot.forEach((doc) => {
          const promise = doc.data();
          experimentalStudentPromises.push(promise);
        });
        Promise.all(experimentalStudentPromises).then(
          (results: SubCollectionProps[]) => {
            if (results.length > 0) {
              const detailsExperimentalStudentData: SubCollectionDetailsProps[] =
                results[0].detailsArray;
              detailsExperimentalStudentData.map(
                (detail: SubCollectionDetailsProps) => {
                  setExperimentalCurriculumArrayDetails(
                    (experimentalCurriculumArrayDetails) => [
                      ...experimentalCurriculumArrayDetails,
                      detail,
                    ]
                  );
                }
              );
            }
          }
        );
        // GET ENROLLED CURRICULUM
        const queryStudent = query(
          collection(db, `students/${studentData.studentId}/studentCurriculum`)
        );
        const queryStudentSnapshot = await getDocs(queryStudent);
        const studentPromises: any = [];
        queryStudentSnapshot.forEach((doc) => {
          const promise = doc.data();
          studentPromises.push(promise);
        });
        Promise.all(studentPromises).then((results: SubCollectionProps[]) => {
          if (results.length > 0) {
            const detailsStudentData: SubCollectionDetailsProps[] =
              results[0].detailsArray;
            detailsStudentData.map((detail: SubCollectionDetailsProps) => {
              setCurriculumArrayDetails((curriculumArrayDetails) => [
                ...curriculumArrayDetails,
                detail,
              ]);
            });
          }
        });
      };
      handleAllCurriculumDetails();
    }
  }, [studentData.studentId]);

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
        `Por favor, clique em "CONFIRMAR EXCLUS??O" para excluir o aluno... ??????`,
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
    const familyQuery = query(
      collectionGroup(db, "studentFamilyAtSchool"),
      where("id", "==", data.studentId)
    );
    const familySnapshot = await getDocs(familyQuery);
    const familyPromises: any = [];
    familySnapshot.forEach((doc) => {
      const promise = doc.data();
      familyPromises.push(promise);
    });
    Promise.all(familyPromises).then(async (results: SubCollectionProps[]) => {
      if (results.length !== 0) {
        // IF EXISTS, REMOVE STUDENT FAMILY AT SCHOOL REGISTERS
        await deleteDoc(
          doc(
            db,
            `students/${data.studentId}/studentFamilyAtSchool`,
            data.studentId
          )
        );
        // IF EXISTS, REMOVE THIS STUDENT FROM YOUR BROTHER'S REGISTRATION
        const myFamilyData = results[0];
        myFamilyData.detailsArray.map(
          async (student: SubCollectionDetailsProps) => {
            const q = query(
              collectionGroup(db, "studentFamilyAtSchool"),
              where("id", "==", student.id)
            );
            const querySnapshot = await getDocs(q);
            const promises: any = [];
            querySnapshot.forEach((doc) => {
              const promise = doc.data();
              promises.push(promise);
            });
            Promise.all(promises).then((results: SubCollectionProps[]) => {
              if (results.length !== 0) {
                const familyBrotherData = results[0];
                updateDoc(
                  doc(
                    db,
                    `students/${familyBrotherData.id}/studentFamilyAtSchool/${familyBrotherData.id}`
                  ),
                  {
                    familyAtSchoolIds: arrayRemove(myFamilyData.id),
                    familyDetails: arrayRemove({
                      id: myFamilyData.id,
                      name: myFamilyData.name,
                    }),
                  }
                );
              }
            });
          }
        );
      }
    });

    // DELETE STUDENT FROM EXPERIMENTAL CLASSES
    if (experimentalCurriculumArrayDetails) {
      // REMOVE STUDENT EXPERIMENTAL CURRICULUM REGISTERS
      await deleteDoc(
        doc(
          db,
          `students/${data.studentId}/studentExperimentalCurriculum`,
          data.studentId
        )
      );
      experimentalCurriculumArrayDetails.map(
        async (curriculum: SubCollectionDetailsProps) => {
          const q = query(
            collectionGroup(db, "curriculumExperimentalStudents"),
            where("id", "==", curriculum.id)
          );
          const querySnapshot = await getDocs(q);
          const promises: any = [];
          querySnapshot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
          Promise.all(promises).then((results: SubCollectionProps[]) => {
            if (results.length > 0) {
              const curriculumData = results[0];
              updateDoc(
                doc(
                  db,
                  `curriculum/${curriculumData.id}/curriculumExperimentalStudents/${curriculumData.id}`
                ),
                {
                  idsArray: arrayRemove(data.studentId),
                  detailsArray: arrayRemove({
                    id: data.studentId,
                    name: data.studentName,
                    date: curriculum.date,
                    isExperimental: curriculum.isExperimental,
                  }),
                }
              );
            }
          });
        }
      );
    }

    // DELETE STUDENT FROM CURRICULUM
    if (curriculumArrayDetails) {
      // REMOVE STUDENT EXPERIMENTAL CURRICULUM REGISTERS
      await deleteDoc(
        doc(db, `students/${data.studentId}/studentCurriculum`, data.studentId)
      );
      curriculumArrayDetails.map(
        async (curriculum: SubCollectionDetailsProps) => {
          const q = query(
            collectionGroup(db, "curriculumStudents"),
            where("id", "==", curriculum.id)
          );
          const querySnapshot = await getDocs(q);
          const promises: any = [];
          querySnapshot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
          Promise.all(promises).then((results: SubCollectionProps[]) => {
            if (results.length > 0) {
              const curriculumData = results[0];
              updateDoc(
                doc(
                  db,
                  `curriculum/${curriculumData.id}/curriculumStudents/${curriculumData.id}`
                ),
                {
                  idsArray: arrayRemove(data.studentId),
                  detailsArray: arrayRemove({
                    id: data.studentId,
                    name: data.studentName,
                    date: curriculum.date,
                    isExperimental: curriculum.isExperimental,
                  }),
                }
              );
            }
          });
        }
      );
    }

    // DELETE STUDENT
    const deleteStudent = async () => {
      try {
        await deleteDoc(doc(db, "students", data.studentId));
        resetForm();
        toast.success(`Aluno exclu??do com sucesso! ????`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      } catch (error) {
        console.log("ESSE ?? O ERROR", error);
        toast.error(`Ocorreu um erro... ????`, {
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
                -- Selecione uma escola para ver as turmas dispon??veis --{" "}
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
                handleData={handleCurriculumSelectedData}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma Turma para ver as modalidades dispon??veis --{" "}
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
            Tipo de matr??cula:{" "}
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
                e.target.value === "experimental"
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
              </>
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma Modalidade para ver os tipos de matr??cula
                dispon??veis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* STUDENT SELECT CARD SECTION */}
        {isSelected ? (
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
                    Escolha o aluno a ser exclu??do:
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
                            className="text-klGreen-500 dark:text-klGreen-500 border-none"
                            onChange={(e) =>
                              setStudentData({
                                ...studentData,
                                studentId: e.target.value,
                                studentName: c.name,
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
                              Respons??vel:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {c.responsible}
                              </span>
                            </p>
                            <p>
                              Respons??vel Financeiro:{" "}
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
                      Confirmar exclus??o do Aluno
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
        ) : null}
      </form>
    </div>
  );
}
