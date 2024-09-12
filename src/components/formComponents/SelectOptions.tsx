/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  collectionGroup,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  SelectProps,
  StudentSearchProps,
  SubCollectionProps,
  SubCollectionStudentCurriculumProps,
} from "../../@types";
import { app } from "../../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function SelectOptions({
  dataType,
  schoolId,
  schoolClassId,
  schoolCourseId,
  classDayId,
  scheduleId,
  teacherId,
  curriculumId,
  studentId,
  returnId = false,
  displaySchoolCourseAndSchedule = false,
  displayAdmins = false,
  onlyAvailableClasses = false,
  availableAndWaitingClasses = false,
  onlyEnrolledStudents = false,
  dontShowMyself = false,
  handleData,
}: SelectProps) {
  // DATA STATE
  const [data, setData] = useState<any[]>([]);

  // GET DATA
  const handleOptionData = async () => {
    if (dataType === "allStudents") {
      const queryExperimental = query(
        collectionGroup(db, "studentExperimentalCurriculum"),
        where("idsArray", "array-contains", curriculumId)
      );
      const promises: SubCollectionStudentCurriculumProps[] = [];
      const getExperimental = await getDocs(queryExperimental);
      getExperimental.forEach((doc) => {
        const promise = doc.data() as SubCollectionProps;
        promises.push(promise);
      });
      const queryCurriculum = query(
        collectionGroup(db, "studentCurriculum"),
        where("idsArray", "array-contains", curriculumId)
      );
      const getCurriculum = await getDocs(queryCurriculum);
      getCurriculum.forEach((doc) => {
        const promise = doc.data() as SubCollectionStudentCurriculumProps;
        promises.push(promise);
      });
      Promise.all(promises).then((result) => {
        return setData(result.sort((a, b) => a.name.localeCompare(b.name)));
      });
      // QUERY TO SEARCH ALL STUDENTS EXCLUDING THE SELECTED STUDENT ITSELF
    } else if (dataType === "enrolledStudents") {
      const promises: SubCollectionStudentCurriculumProps[] = [];
      const queryCurriculum = query(
        collectionGroup(db, "studentCurriculum"),
        where("idsArray", "array-contains", curriculumId)
      );
      const getCurriculum = await getDocs(queryCurriculum);
      getCurriculum.forEach((doc) => {
        const promise = doc.data() as SubCollectionStudentCurriculumProps;
        promises.push(promise);
      });
      Promise.all(promises).then((result) => {
        return setData(result.sort((a, b) => a.name.localeCompare(b.name)));
      });
      // QUERY TO SEARCH ALL STUDENTS EXCLUDING THE SELECTED STUDENT ITSELF
    } else if (schoolId && schoolClassId && curriculumId && studentId) {
      const queryCurriculum = query(
        collection(db, dataType),
        where("id", "!=", studentId),
        where("curriculumIds", "array-contains", curriculumId),
        orderBy("id")
      );
      const queryExperimentalCurriculum = query(
        collection(db, dataType),
        where("id", "!=", studentId),
        where("experimentalCurriculumIds", "array-contains", curriculumId),
        orderBy("id")
      );
      const promises: StudentSearchProps[] = [];
      const getCurriculum = await getDocs(queryCurriculum);
      getCurriculum.forEach((doc) => {
        const promise = doc.data() as StudentSearchProps;
        promises.push(promise);
      });
      const getExperimentalCurriculum = await getDocs(
        queryExperimentalCurriculum
      );
      getExperimentalCurriculum.forEach((doc) => {
        const promise = doc.data() as StudentSearchProps;
        promises.push(promise);
      });
      Promise.all(promises).then((result) => {
        return setData(result.sort((a, b) => a.name.localeCompare(b.name)));
      });
      // QUERY TO SEARCH ALL STUDENTS OF SELECTED CURRICULUM (INCLUDING EXPERIMENTAL STUDENTS)
    } else if (dataType === "students") {
      if (
        // QUERY TO SEARCH ENROLLED STUDENTS EXCLUDING THE SELECTED STUDENT ITSELF
        schoolId &&
        schoolClassId &&
        curriculumId &&
        studentId &&
        onlyEnrolledStudents
      ) {
        const queryCurriculum = query(
          collection(db, dataType),
          where("id", "!=", studentId),
          where("curriculumIds", "array-contains", curriculumId),
          orderBy("id")
        );
        const promises: StudentSearchProps[] = [];
        const getCurriculum = await getDocs(queryCurriculum);
        getCurriculum.forEach((doc) => {
          const promise = doc.data() as StudentSearchProps;
          promises.push(promise);
        });
        Promise.all(promises).then((result) => {
          return setData(result.sort((a, b) => a.name.localeCompare(b.name)));
        });
        // QUERY TO SEARCH ALL STUDENTS EXCLUDING THE SELECTED STUDENT ITSELF
      } else if (schoolId && schoolClassId && curriculumId && studentId) {
        const queryCurriculum = query(
          collection(db, dataType),
          where("id", "!=", studentId),
          where("curriculumIds", "array-contains", curriculumId),
          orderBy("id")
        );
        const queryExperimentalCurriculum = query(
          collection(db, dataType),
          where("id", "!=", studentId),
          where("experimentalCurriculumIds", "array-contains", curriculumId),
          orderBy("id")
        );
        const promises: StudentSearchProps[] = [];
        const getCurriculum = await getDocs(queryCurriculum);
        getCurriculum.forEach((doc) => {
          const promise = doc.data() as StudentSearchProps;
          promises.push(promise);
        });
        const getExperimentalCurriculum = await getDocs(
          queryExperimentalCurriculum
        );
        getExperimentalCurriculum.forEach((doc) => {
          const promise = doc.data() as StudentSearchProps;
          promises.push(promise);
        });
        Promise.all(promises).then((result) => {
          return setData(result.sort((a, b) => a.name.localeCompare(b.name)));
        });
        // QUERY TO SEARCH ALL STUDENTS OF SELECTED CURRICULUM (INCLUDING EXPERIMENTAL STUDENTS)
      } else if (schoolId && schoolClassId && curriculumId) {
        const queryCurriculum = query(
          collection(db, dataType),
          where("experimentalCurriculumIds", "array-contains", curriculumId)
        );
        const queryExperimentalCurriculum = query(
          collection(db, dataType),
          where("curriculumIds", "array-contains", curriculumId)
        );
        const promises: StudentSearchProps[] = [];
        const getCurriculum = await getDocs(queryCurriculum);
        getCurriculum.forEach((doc) => {
          const promise = doc.data() as StudentSearchProps;
          promises.push(promise);
        });
        const getExperimentalCurriculum = await getDocs(
          queryExperimentalCurriculum
        );
        getExperimentalCurriculum.forEach((doc) => {
          const promise = doc.data() as StudentSearchProps;
          promises.push(promise);
        });
        Promise.all(promises).then((result) => {
          return setData(result.sort((a, b) => a.name.localeCompare(b.name)));
        });
        // QUERY TO SEARCH STUDENTS OF SELECTED SCHOOL AND SCHOOL CLASS
      } else if (schoolId && schoolClassId) {
        const q = query(
          collection(db, dataType),
          where("schoolId", "==", schoolId),
          where("schoolClassId", "==", schoolClassId),
          orderBy("name")
        );
        const promises: StudentSearchProps[] = [];
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const promise = doc.data() as StudentSearchProps;
            promises.push(promise);
          });
        });
        console.log(unsubscribe);
        setData(promises.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } else {
      const q =
        dataType === "appUsers" && displayAdmins
          ? // QUERY FOR SEARCH APP USERS, "ROOT" USERS
            query(collection(db, dataType), where("role", "!=", "root"))
          : dataType === "appUsers"
          ? // QUERY FOR SEARCH APP USERS, EXCEPT "ADMIN" AND "ROOT" USERS
            query(
              collection(db, dataType),
              where("role", "not-in", ["admin", "root"])
            )
          : onlyAvailableClasses && schoolId
          ? // QUERY FOR SEARCH ONLY AVAILABLE SCHOOL CLASSES OF SCHOOL ID
            query(
              collection(db, dataType),
              where("schoolId", "==", schoolId),
              where("available", "==", "open"),
              orderBy("name")
            )
          : availableAndWaitingClasses && schoolId
          ? // QUERY FOR SEARCH AVAILABLE AND WAITING LIST SCHOOL CLASSES OF SCHOOL ID
            query(
              collection(db, dataType),
              where("schoolId", "==", schoolId),
              where("available", "!=", "closed"),
              orderBy("available")
            )
          : schoolId && schoolClassId
          ? // QUERY SEARCH SOMETHING WITH SELECTED SCHOOL AND SCHOOL CLASS FILTERS (CURRICULUM - SCHEDULE)
            query(
              collection(db, dataType),
              where("schoolId", "==", schoolId),
              where("schoolClassId", "==", schoolClassId),
              orderBy("name")
            )
          : schoolId
          ? // QUERY SEARCH SOMETHING WITH SELECTED SCHOOL FILTER
            query(
              collection(db, dataType),
              where("schoolId", "==", schoolId),
              orderBy("name")
            )
          : // QUERY ONLY FOR DATATYPE
            query(collection(db, dataType), orderBy("name"));
      const unsubscribe = onSnapshot(q, (querySnapShot) => {
        const promises: any = [];
        querySnapShot.forEach((doc) => {
          const promise = doc.data();
          promises.push(promise);
        });
        setData(promises);
      });
      console.log(unsubscribe);
    }
  };

  // CALLING FUNCTION EVERYTIME THAT ANY PROPS CHANGE
  useEffect(() => {
    handleOptionData();
  }, [
    dataType,
    schoolId,
    schoolClassId,
    schoolCourseId,
    classDayId,
    scheduleId,
    teacherId,
    curriculumId,
    studentId,
  ]);

  // IF HAS A FUNCTION, SEND DATA FOR IT
  useEffect(() => {
    if (handleData) {
      handleData(data);
    }
  }, [data]);

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
