import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { SelectProps } from "../../@types";
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
  handleData,
}: SelectProps) {
  // DATA STATE
  const [data, setData] = useState([]);

  // GET DATA
  const handleOptionData = async () => {
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
        : dataType === "schoolClasses" && schoolId
        ? // QUERY FOR SEARCH ONLY SCHOOL CLASSES AVAILABLE OF SCHOOL ID
          query(
            collection(db, dataType),
            where("schoolId", "==", schoolId),
            where("available", "==", true),
            orderBy("name")
          )
        : schoolId && schoolClassId && curriculumId && studentId
        ? // QUERY FOR SEARCH ALL STUDENTS WITH SELECTED CURRICULUM ID FILTER EXCLUDING ITSELF
          query(
            collection(db, dataType),
            where("curriculum", "array-contains", curriculumId),
            where("id", "!=", studentId),
            orderBy("id")
          )
        : schoolId && schoolClassId && curriculumId
        ? // QUERY FOR SEARCH ALL STUDENTS WITH SELECTED CURRICULUM ID FILTER
          query(
            collection(db, dataType),
            where("curriculum", "array-contains", curriculumId),
            orderBy("name")
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
          <option key={option.id} value={returnId ? option.id : option.name}>
            {displaySchoolCourseAndSchedule
              ? `${option.schoolCourse} | ${option.schedule}`
              : option.name}
          </option>
        </>
      ))}
    </>
  );
}
