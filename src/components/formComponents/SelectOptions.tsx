/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";

import { SelectProps, StudentSearchProps } from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

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
  availableAndWaitingClasses = false,
  dontShowMyself = false,
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
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // DATA STATE
  const [data, setData] = useState<any[]>([]);

  async function handleDataOptions() {
    // QUERY TO SEARCH ALL STUDENTS EXCLUDING THE SELECTED STUDENT ITSELF
    if (schoolId && schoolClassId) {
      if (dataType === "curriculum") {
        const filterCurriculum = curriculumDatabaseData.filter(
          (curriculum) =>
            curriculum.schoolId === schoolId &&
            curriculum.schoolClassId === schoolClassId
        );
        setData(filterCurriculum);
      }
    } else {
      if (schoolId) {
        if (dataType === "schoolClasses") {
          if (availableAndWaitingClasses) {
            const filterClasses = schoolClassDatabaseData.filter(
              (schoolClass) =>
                schoolClass.schoolId === schoolId &&
                schoolClass.available !== "closed"
            );
            setData(filterClasses);
          } else {
            const filterClasses = schoolClassDatabaseData.filter(
              (schoolClass) => schoolClass.schoolId === schoolId
            );
            setData(filterClasses);
          }
        }

        if (dataType === "schedules") {
          const filterSchedules = scheduleDatabaseData.filter(
            (schedule) => schedule.schoolId === schoolId
          );
          setData(filterSchedules);
        }
      }
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

    if (dataType === "searchEnrolledStudent" && curriculumId) {
      const foundedStudentsArray: StudentSearchProps[] = [];
      studentsDatabaseData.map((student) => {
        // EXCLUDE STUDENTS THAT ALREADY HAVE FAMILY DISCOUNT
        if (student.curriculumIds && !student.familyDiscount) {
          const foundedFamilyStudent = student.curriculumIds.find(
            (curriculum) => curriculum.id === curriculumId
          );
          if (foundedFamilyStudent) {
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

    if (dataType === "schoolCourses") {
      setData(schoolCourseDatabaseData);
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
  }, [curriculumId, dataType, schoolId, schoolClassId]);

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
              {option.id !== studentId ? (
                <option
                  key={option.id}
                  value={returnId ? option.id : option.name}
                  className={
                    dataType === "schoolClasses"
                      ? option.available === "open"
                        ? "bg-green-600"
                        : option.available === "closed"
                        ? "bg-red-600"
                        : "bg-teal-600"
                      : ""
                  }
                >
                  {displaySchoolCourseAndSchedule
                    ? `${option.schoolCourse} | ${option.schedule}`
                    : dataType === "schoolClasses"
                    ? option.available === "open"
                      ? option.name + " (Turma Aberta)"
                      : option.available === "closed"
                      ? option.name + " (Turma Fechada)"
                      : option.name + " (Lista de Espera)"
                    : option.name}
                </option>
              ) : null}
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
                className={
                  dataType === "schoolClasses"
                    ? option.available === "open"
                      ? "bg-green-600"
                      : option.available === "closed"
                      ? "bg-red-600"
                      : "bg-teal-600"
                    : ""
                }
              >
                {displaySchoolCourseAndSchedule
                  ? `${option.schoolCourse} | ${option.schedule}`
                  : dataType === "schoolClasses"
                  ? option.available === "open"
                    ? option.name + " (Turma Aberta)"
                    : option.available === "closed"
                    ? option.name + " (Turma Fechada)"
                    : option.name + " (Lista de Espera)"
                  : option.name}
              </option>
            </>
          ))
        : data.map((option: any) => (
            <>
              <option
                key={option.id}
                value={returnId ? option.id : option.name}
                className={
                  dataType === "schoolClasses"
                    ? option.available === "open"
                      ? "bg-green-600"
                      : option.available === "closed"
                      ? "bg-red-600"
                      : "bg-teal-600"
                    : ""
                }
              >
                {displaySchoolCourseAndSchedule
                  ? `${option.schoolCourse} | ${option.schedule}`
                  : dataType === "schoolClasses"
                  ? option.available === "open"
                    ? option.name + " (Turma Aberta)"
                    : option.available === "closed"
                    ? option.name + " (Turma Fechada)"
                    : option.name + " (Lista de Espera)"
                  : option.name}
              </option>
            </>
          ))}
    </>
  );
}
