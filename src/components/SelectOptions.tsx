import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { SelectProps } from "../@types";
import { app } from "../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function SelectOptions({
  dataType,
  schoolId,
  returnId = false,
  handleData,
}: SelectProps) {
  // DATA STATE
  const [data, setData] = useState([]);

  // GET DATA
  const handleOptionData = async () => {
    if (schoolId) {
      const q = query(
        collection(db, dataType),
        where("schoolId", "==", schoolId),
        orderBy("name")
      );
      const unsubscribe = onSnapshot(q, (querySnapShot) => {
        const promises: any = [];
        querySnapShot.forEach((doc) => {
          const promise = doc.data();
          promises.push(promise);
        });
        setData(promises);
      });
    } else {
      const q = query(collection(db, dataType), orderBy("name"));
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

  useEffect(() => {
    handleOptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, schoolId]);

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
