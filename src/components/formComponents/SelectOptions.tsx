/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";

import {
  CurriculumSearchProps,
  FilteredStudentsProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SelectProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { schoolStage } from "../../custom";

// INITIALIZING FIRESTORE DB

export function SelectOptions({
  dataType,
  schoolId,
  schoolClassId,
  classDayId,
  scheduleId,
  teacherId,
  curriculumId,
  studentId,
  returnId = false,
  setSchedule = false,
  setClassDay = false,
  setTeacher = false,
  displaySchoolCourseAndSchedule = false,
  displayAdmins = false,
  dontShowMyself = false,
  showAllCourses = false,
  parentOneEmail,
  parentTwoEmail,
  financialResponsibleDocument,
}: SelectProps) {
  // GET GLOBAL DATA
  const {
    appUsersDatabaseData,
    classDaysDatabaseData,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
    handleAllCurriculumDetails,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // DATA STATE
  const [data, setData] = useState<any[]>([]);

  const schoolYears = [
    { id: "1p", name: "1° PERÍODO" },
    { id: "2p", name: "2° PERÍODO" },
    { id: "1a", name: "1° ANO" },
    { id: "2a", name: "2° ANO" },
    { id: "3a", name: "3° ANO" },
    { id: "4a", name: "4° ANO" },
    { id: "5a", name: "5° ANO" },
    { id: "6a", name: "6° ANO" },
    { id: "7a", name: "7° ANO" },
    { id: "8a", name: "8° ANO" },
    { id: "9a", name: "9° ANO" },
    { id: "1s", name: "1ª SÉRIE - Ensino Médio" },
    { id: "2s", name: "2ª SÉRIE - Ensino Médio" },
    { id: "3s", name: "3ª SÉRIE - Ensino Médio" },
  ];

  const schoolYearsComplement = [
    { id: "unknown", name: "Não definida" },
    { id: "classA", name: "A" },
    { id: "classB", name: "B" },
    { id: "classC", name: "C" },
    { id: "classD", name: "D" },
    { id: "classE", name: "E" },
  ];

  async function handleDataOptions() {
    // QUERY TO SEARCH ALL STUDENTS EXCLUDING THE SELECTED STUDENT ITSELF
    if (schoolId && schoolClassId) {
      if (dataType === "curriculum") {
        setData(
          handleAllCurriculumDetails({
            schoolId: schoolId,
            schoolClassId: schoolClassId,
          })
        );
      }
      if (dataType === "schoolCourses") {
        const filterCurriculum = curriculumDatabaseData.filter(
          (curriculum) =>
            curriculum.schoolId === schoolId &&
            curriculum.schoolClassIds.includes(schoolClassId)
        );
        const coursesToData: SchoolCourseSearchProps[] = [];
        filterCurriculum.map((curriculum) => {
          schoolCourseDatabaseData.map((course) => {
            if (curriculum.schoolCourseId === course.id) {
              coursesToData.push(course);
            }
          });
        });
        setData(coursesToData);
      }
    } else {
      if (schoolId) {
        if (dataType === "schedules") {
          const filterSchedules = scheduleDatabaseData.filter(
            (schedule) => schedule.schoolId === schoolId
          );
          setData(filterSchedules);
        }
        if (dataType === "schoolClasses") {
          const filterClasses = curriculumDatabaseData.filter(
            (curriculum) => curriculum.schoolId === schoolId
          );
          const filteredSchoolClass: SchoolClassSearchProps[] = [];

          filterClasses.map((schoolClass) => {
            schoolClass.schoolClassIds.map((id) => {
              schoolClassDatabaseData.map((foundedSchoolClass) => {
                if (foundedSchoolClass.id === id) {
                  filteredSchoolClass.push(foundedSchoolClass);
                }
              });
            });
          });

          setData(
            filteredSchoolClass.sort((a, b) => {
              if (a.schoolStageId !== b.schoolStageId) {
                return a.schoolStageId.localeCompare(b.schoolStageId);
              }
              return a.name.localeCompare(b.name);
            })
          );
        }
      }
    }

    if (dataType === "schoolStage") {
      setData(schoolStage);
    }
    if (dataType === "schoolYears") {
      setData(schoolYears);
    }
    if (dataType === "schoolYearsComplement") {
      setData(schoolYearsComplement);
    }

    if (dataType === "searchStudent" && curriculumId) {
      const foundedStudentsArray: StudentSearchProps[] = [];
      studentsDatabaseData.map((student) => {
        if (student.curriculumIds) {
          const foundedStudent = student.curriculumIds.find(
            (curriculum) => curriculum.id === curriculumId
          );
          if (foundedStudent) {
            if (dontShowMyself && studentId !== student.id) {
              foundedStudentsArray.push(student);
            } else {
              foundedStudentsArray.push(student);
            }
          }
        }
        if (student.experimentalCurriculumIds) {
          const foundedStudent = student.experimentalCurriculumIds.find(
            (curriculum) => curriculum.id === curriculumId
          );
          if (foundedStudent) {
            if (dontShowMyself && studentId !== student.id) {
              foundedStudentsArray.push(student);
            } else {
              foundedStudentsArray.push(student);
            }
          }
        }
      });
      setData(foundedStudentsArray);
    }

    if (
      dataType === "searchEnrolledStudent" &&
      (parentOneEmail || parentTwoEmail || financialResponsibleDocument)
    ) {
      const studentsToShow: FilteredStudentsProps[] = [];
      studentsDatabaseData.map((student) => {
        if (studentId) {
          if (
            student.financialResponsible.document ===
              financialResponsibleDocument &&
            student.id !== studentId
          ) {
            studentsToShow.push({ ...student, isFinancialResponsible: true });
          } else if (
            (student.parentOne?.email === parentOneEmail ||
              student.parentTwo?.email === parentTwoEmail) &&
            student.id !== studentId
          ) {
            studentsToShow.push({ ...student, isFinancialResponsible: false });
          }
        } else {
          if (
            student.financialResponsible.document ===
            financialResponsibleDocument
          ) {
            studentsToShow.push({ ...student, isFinancialResponsible: true });
          } else if (
            student.parentOne?.email === parentOneEmail ||
            student.parentTwo?.email === parentTwoEmail
          ) {
            studentsToShow.push({ ...student, isFinancialResponsible: false });
          }
        }
      });
      setData(studentsToShow);
    }

    if (dataType === "appUsers") {
      const appUsersToDisplay = appUsersDatabaseData.filter(
        (user) => user.role !== "root"
      );
      if (displayAdmins) {
        setData(appUsersToDisplay);
      } else {
        const appUsersWithoutAdmins = appUsersToDisplay.filter(
          (user) => user.role !== "admin"
        );
        setData(appUsersWithoutAdmins);
      }
    }

    if (dataType === "schools") {
      setData(schoolDatabaseData);
    }

    if (dataType === "schoolClasses" && !schoolId) {
      setData(
        schoolClassDatabaseData.sort((a, b) => {
          if (a.schoolStageId !== b.schoolStageId) {
            return a.schoolStageId.localeCompare(b.schoolStageId);
          }
          return a.name.localeCompare(b.name);
        })
      );
    }

    if (dataType === "schoolCourses" && !schoolId) {
      if (schoolId && schoolClassId) {
        const foundedCurriculums: CurriculumSearchProps[] = [];
        curriculumDatabaseData.map((curriculum) => {
          if (curriculum.schoolId === schoolId) {
            foundedCurriculums.push(curriculum);
          }
        });
        if (foundedCurriculums.length > 0) {
          const foundedSchoolCourses: string[] = [];
          foundedCurriculums.map((curriculum) => {
            foundedSchoolCourses.push(curriculum.schoolCourseId);
          });
          if (foundedSchoolCourses.length > 0) {
            const schoolCoursesToShow: SchoolCourseSearchProps[] = [];
            schoolCourseDatabaseData.map((schoolCourse) => {
              foundedSchoolCourses.map((foundedSchoolCourse) => {
                if (schoolCourse.id === foundedSchoolCourse) {
                  schoolCoursesToShow.push(schoolCourse);
                }
              });
            });
            setData(schoolCoursesToShow);
          } else {
            setData([]);
          }
        } else {
          setData([]);
        }
      } else if (showAllCourses) {
        setData(schoolCourseDatabaseData);
      } else {
        setData([]);
      }
    }

    if (dataType === "classDays") {
      setData(classDaysDatabaseData);
    }

    if (dataType === "teachers") {
      setData(teacherDatabaseData);
    }
  }

  useEffect(() => {
    handleDataOptions();
  }, [
    curriculumId,
    dataType,
    schoolId,
    schoolClassId,
    parentOneEmail,
    parentTwoEmail,
    financialResponsibleDocument,
    appUsersDatabaseData,
    classDaysDatabaseData,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
  ]);

  return (
    // DYNAMIC OPTIONS
    <>
      <option disabled value={" -- select an option -- "}>
        {" "}
        -- Selecione --{" "}
      </option>
      {dontShowMyself && studentId
        ? data.map((option: any) => (
            <>
              {option.id !== studentId && (
                <option
                  key={option.id}
                  value={returnId ? option.id : option.name}
                >
                  {option.name}
                </option>
              )}
            </>
          ))
        : (setSchedule && scheduleId) || // FORCE SELECTED OPTIONS FOR EDIT CURRICULUM
          (setClassDay && classDayId) ||
          (setTeacher && teacherId)
        ? data.map((option: any) => (
            <>
              <option
                selected={
                  scheduleId === option.id ||
                  classDayId === option.id ||
                  teacherId === option.id
                }
                key={option.id}
                value={returnId ? option.id : option.name}
              >
                {displaySchoolCourseAndSchedule
                  ? `${option.schoolCourseName} | ${option.scheduleName}`
                  : option.name}
              </option>
            </>
          ))
        : data.map((option: any) => (
            <>
              <option
                key={option.id}
                value={returnId ? option.id : option.name}
              >
                {displaySchoolCourseAndSchedule
                  ? `${option.schoolCourseName} | ${option.scheduleName}`
                  : option.name}
              </option>
            </>
          ))}
    </>
  );
}
