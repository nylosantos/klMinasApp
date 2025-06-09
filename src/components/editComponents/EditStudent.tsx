/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { SelectOptions } from "../formComponents/SelectOptions";
import { EditStudentForm } from "../formComponents/EditStudentForm";
import {
  CurriculumSearchProps,
  SchoolClassSearchProps,
  SchoolSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

export function EditStudent() {
  // GET GLOBAL DATA
  const {
    curriculumDatabaseData,
    schoolDatabaseData,
    schoolClassDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STUDENT SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [studentsWithoutSchool, setIsStudentsWithoutSchool] = useState<
    "true" | "false" | undefined
  >();

  // STUDENT DATA
  const [studentData, setStudentData] = useState({
    schoolId: "",
    schoolClassId: "",
    curriculumId: "",
    schoolCoursePriceUnit: 0,
    schoolCoursePriceBundle: 0,
    schoolCourseBundleDays: 0,
    studentId: "",
  });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setSchoolClassSelectedData(undefined);
    setCurriculumSelectedData(undefined);
    // setStudentSelectedData(undefined);
    if (studentData.schoolId !== "") {
      if (studentData.schoolId === "all") {
        setIsStudentsWithoutSchool("true");
      } else {
        setIsStudentsWithoutSchool("false");
        setSchoolSelectedData(
          schoolDatabaseData.find(({ id }) => id === studentData.schoolId)
        );
      }
    } else {
      setIsStudentsWithoutSchool(undefined);
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    if (studentsWithoutSchool === "false") {
      (
        document.getElementById("schoolClassSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("curriculumSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("studentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
    }
    setIsEdit(false);
    setIsSelected(false);
    setStudentData({
      ...studentData,
      schoolClassId: "",
      curriculumId: "",
      schoolCoursePriceUnit: 0,
      schoolCoursePriceBundle: 0,
      schoolCourseBundleDays: 0,
      studentId: "",
    });
  }, [studentData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setCurriculumSelectedData(undefined);
    // setStudentSelectedData(undefined);
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

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    if (studentsWithoutSchool === "false") {
      (
        document.getElementById("curriculumSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("studentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
    }
    setIsEdit(false);
    setIsSelected(false);
    setStudentData({
      ...studentData,
      curriculumId: "",
      schoolCoursePriceUnit: 0,
      schoolCoursePriceBundle: 0,
      schoolCourseBundleDays: 0,
      studentId: "",
    });
  }, [studentData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumSelectedData) {
      setIsEdit(false);
      setIsSelected(false);
      // setStudentSelectedData(undefined);
      if (studentData.curriculumId !== "") {
        setCurriculumSelectedData(
          curriculumDatabaseData.find(
            ({ id }) => id === studentData.curriculumId
          )
        );
      } else {
        setCurriculumSelectedData(undefined);
      }
    }
  }, [curriculumSelectedData]);

  // RESET STUDENT SELECT TO INDEX 0 WHEN CURRICULUM CHANGE
  useEffect(() => {
    if (studentsWithoutSchool === "false") {
      (
        document.getElementById("studentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
    }
    setIsEdit(false);
    setIsSelected(false);
    setStudentData({
      ...studentData,
      schoolCoursePriceUnit: 0,
      schoolCoursePriceBundle: 0,
      schoolCourseBundleDays: 0,
      studentId: "",
    });
  }, [studentData.curriculumId]);
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    // (
    //   document.getElementById("schoolClassSelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    // (
    //   document.getElementById("curriculumSelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    // (
    //   document.getElementById("studentSelect") as HTMLSelectElement
    // ).selectedIndex = 0;
    setStudentData({
      schoolId: "",
      schoolClassId: "",
      curriculumId: "",
      studentId: "",
      schoolCoursePriceUnit: 0,
      schoolCoursePriceBundle: 0,
      schoolCourseBundleDays: 0,
    });
    setIsStudentsWithoutSchool(undefined);
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Editar Aluno</h1>

      <div
        className={`flex flex-col w-full gap-2 ${
          isEdit ? "pt-4 px-4" : "p-4"
        } rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2`}
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label htmlFor="schoolSelect" className="w-1/4 text-right">
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            disabled={isEdit}
            className={
              "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                schoolId: e.target.value,
              });
              if (
                e.target.value === "" ||
                e.target.value === " -- select an option -- "
              ) {
                setIsStudentsWithoutSchool(undefined);
              } else if (e.target.value === "all") {
                setIsStudentsWithoutSchool("true");
              } else {
                setIsStudentsWithoutSchool("false");
              }
            }}
          >
            <SelectOptions returnId dataType="schools" />
            <option value={"all"}>
              Alunos atualmente sem matrícula ou aula experimental agendada
            </option>
          </select>
        </div>

        {studentsWithoutSchool === "false" && (
          <>
            {/* SCHOOL CLASS SELECT */}
            <div className="flex gap-2 items-center">
              <label htmlFor="schoolClassSelect" className="w-1/4 text-right">
                Selecione o Ano Escolar:{" "}
              </label>
              <select
                id="schoolClassSelect"
                defaultValue={" -- select an option -- "}
                disabled={isEdit ? true : studentData.schoolId ? false : true}
                className={
                  studentData.schoolId
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                name="schoolClassSelect"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    schoolClassId: e.target.value,
                  });
                }}
              >
                <SelectOptions
                  returnId
                  dataType="schoolClasses"
                  schoolId={studentData.schoolId}
                />
              </select>
            </div>

            {/* CURRICULUM SELECT */}
            <div className="flex gap-2 items-center">
              <label htmlFor="curriculumSelect" className="w-1/4 text-right">
                Selecione a Modalidade:{" "}
              </label>
              <select
                id="curriculumSelect"
                defaultValue={" -- select an option -- "}
                disabled={
                  isEdit ? true : studentData.schoolClassId ? false : true
                }
                className={
                  studentData.schoolId
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                name="curriculumSelect"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    curriculumId: e.target.value,
                  });
                }}
              >
                <SelectOptions
                  returnId
                  dataType="curriculum"
                  displaySchoolCourseAndSchedule
                  schoolId={studentData.schoolId}
                  schoolClassId={studentData.schoolClassId}
                />
              </select>
            </div>

            {/* STUDENT SELECT */}
            <div className="flex gap-2 items-center">
              <label htmlFor="studentSelect" className={"w-1/4 text-right"}>
                Selecione o Aluno:{" "}
              </label>
              <select
                id="studentSelect"
                defaultValue={" -- select an option -- "}
                disabled={
                  isEdit ? true : studentData.curriculumId ? false : true
                }
                className={
                  studentData.schoolId
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                name="studentSelect"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    studentId: e.target.value,
                  });
                  setIsSelected(true);
                }}
              >
                <SelectOptions
                  returnId
                  dataType="searchStudent"
                  curriculumId={studentData.curriculumId}
                />
              </select>
            </div>
          </>
        )}

        {studentsWithoutSchool === "true" && (
          <>
            {/* SCHOOL CLASS SELECT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="studentWithoutSchoolSelect"
                className="w-1/4 text-right"
              >
                Selecione o Aluno:{" "}
              </label>
              <select
                id="studentWithoutSchoolSelect"
                defaultValue={" -- select an option -- "}
                disabled={isEdit ? true : studentData.schoolId ? false : true}
                className={
                  studentData.schoolId
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                name="studentWithoutSchoolSelect"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    studentId: e.target.value,
                  });
                  setIsSelected(true);
                }}
              >
                <SelectOptions
                  returnId
                  dataType="schoolClasses"
                  schoolId={studentData.schoolId}
                />
              </select>
            </div>
          </>
        )}

        {/* EDIT BUTTON */}
        {isSelected && (
          <div className="flex gap-2 mt-4 justify-center">
            <button
              type="button"
              className={
                isEdit
                  ? "w-3/4 border rounded-xl border-green-900/10 bg-amber-500/70 dark:bg-amber-500/40 disabled:border-green-900/10 text-white"
                  : "w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500  text-white"
              }
              onClick={() => {
                if (!isEdit) {
                  setIsEdit(true);
                } else {
                  resetForm();
                }
              }}
            >
              {!isEdit ? "Editar" : "Nova Pesquisa"}
            </button>
          </div>
        )}

        {/* EDIT FORM */}
        {isEdit && (
          <EditStudentForm
            studentId={studentData.studentId}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setStudentData={setStudentData}
            onClose={resetForm}
          />
        )}
      </div>
    </div>
  );
}
