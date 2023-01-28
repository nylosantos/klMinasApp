import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { useEffect, useState } from "react";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { SelectProps } from "../@types";
import { app } from "../db/Firebase";

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
  handleData,
}: SelectProps) {
  // DATA STATE
  const [data, setData] = useState([]);

  // GET ALL USERS CLOUD FUNCTION HOOK
  const [getAppUsers, executing, error] = useHttpsCallable(
    getFunctions(app),
    "getAppUsers"
  );

  // FIREBASE FILTER QUERIES
  const schoolWhereQuery = where("schoolId", "==", schoolId);
  const schoolClassWhereQuery = where("schoolClassId", "==", schoolClassId);
  const schoolCourseWhereQuery = where("schoolCourseId", "==", schoolCourseId);
  const classDayWhereQuery = where("classDayId", "==", classDayId);
  const scheduleWhereQuery = where("schFeduleId", "==", scheduleId);
  const teacherWhereQuery = where("teacherId", "==", teacherId);
  const curriculumWhereQuery = where("curriculumId", "==", curriculumId);
  const studentWhereQuery = where("studentId", "==", studentId);

  // GET DATA
  const handleOptionData = async () => {
    const q =
      schoolId && schoolClassId && curriculumId
        ? // QUERY FOR SEARCH ALL STUDENTS WITH SELECTED CURRICULUM FILTER
          query(
            collection(db, dataType),
            where("curriculum", "array-contains", curriculumId),
            orderBy("name")
          )
        : schoolId && schoolClassId
        ? // QUERY SEARCH SOMETHING WITH SELECTED SCHOOL AND SCHOOL CLASS FILTERS (CURRICULUM - SCHEDULE)
          query(
            collection(db, dataType),
            schoolWhereQuery,
            schoolClassWhereQuery,
            orderBy("name")
          )
        : schoolId
        ? // QUERY SEARCH SOMETHING WITH SELECTED SCHOOL FILTER
          query(collection(db, dataType), schoolWhereQuery)
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

  useEffect(() => {
    handleOptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (handleData) {
      handleData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <option disabled value={" -- select an option -- "}>
        {" "}
        -- Selecione --{" "}
      </option>
      {data.map((option: any) => (
        <>
          <option key={option.id} value={returnId ? option.id : option.name}>
            {option.name}
          </option>
        </>
      ))}
    </>
  );
}
