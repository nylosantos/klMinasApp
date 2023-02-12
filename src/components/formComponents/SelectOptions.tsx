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

import { SchoolClassSearchProps, SelectProps, StudentSearchProps } from "../../@types";
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
  handleData,
}: SelectProps) {
  // DATA STATE
  const [data, setData] = useState<any[]>([]);

  // GET DATA
  const handleOptionData = async () => {
    if (dataType === "students") {
      if (
        schoolId &&
        schoolClassId &&
        curriculumId &&
        studentId &&
        onlyEnrolledStudents
      ) {
        const q = query(
          collection(db, dataType, "curriculum", curriculumId),
          where("id", "!=", studentId),
          orderBy("id")
        );
        const promises: StudentSearchProps[] = [];
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const promise: any = doc.data();
            promises.push(promise);
          });
        });
        setData(promises);
      }
      if (schoolId && schoolClassId && curriculumId && studentId) {
        const q1 = query(
          collection(db, dataType, "curriculum", curriculumId),
          orderBy("id")
        );
        const q2 = query(
          collection(db, dataType, "experimentalCurriculum", curriculumId),
          orderBy("id")
        );
        const promises: any = [];
        const unsubscribeQuery1 = onSnapshot(q1, (querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
        });
        const unsubscribeQuery2 = onSnapshot(q2, (querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
        });
        setData(promises);
      }
      if (schoolId && schoolClassId && curriculumId) {
          const q1 = query(
          collection(db, "students"),
          where("experimentalCurriculumIds", "array-contains", curriculumId)
        );
        const q2 = query(
          collection(db, "students"),
          where("curriculumIds", "array-contains", curriculumId)
        );
        const promises: any = [];
        const queryExperimentalCurriculum = await getDocs(q1);
        queryExperimentalCurriculum.forEach((doc) => {
          const promise = doc.data();
          promises.push(promise);
          // console.log("Promise: ", promise)
        });
        const queryCurriculum = await getDocs(q2);
        queryCurriculum.forEach((doc) => {
          const promise = doc.data();
          promises.push(promise);
          // console.log("Promise: ", promise)
        });
        Promise.all(promises).then((result) => {
          return setData(result);
        });
        // const q2 = query(
        //   collectionGroup(db, "experimentalCurriculum"),
        //   where("id", "==", curriculumId),
        // );
        // const unsubscribeQuery1 = onSnapshot(q1, (querySnapShot) => {
        //   const promises: any = [];
        //   querySnapShot.forEach((doc) => {
        //     const promise = doc.data();
        //     console.log("Olha aí: ", promise)
        //     promises.push(promise);
        //   });
        //   setData(promises);
        // });
        // const unsubscribeQuery2 = onSnapshot(q2, (querySnapShot) => {
        //   querySnapShot.forEach((doc) => {
        //     const promise = doc.data();
        //     promises.push(promise);
        //   });
        // });
      }
      if (schoolId && schoolClassId) {
        const q = query(
          collection(db, dataType),
          where("schoolId", "==", schoolId),
          where("schoolClassId", "==", schoolClassId),
          orderBy("name")
        );
        const promises: any = [];
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
        });
        setData(promises);
      }
      // const unsubscribe = onSnapshot(q, (querySnapShot) => {
      //   const promises: any = [];
      //   querySnapShot.forEach((doc) => {
      //     const promise = doc.data();
      //     promises.push(promise);
      //   });
      //   setData(promises);
      // });
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
            query(collection(db, dataType), where("schoolId", "==", schoolId))
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
      {data.map((option: any) => (
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
