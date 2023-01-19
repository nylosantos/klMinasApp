import {
  collection,
  getDocs,
  getFirestore,
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
  schoolName,
  schoolCourseName,
  returnId = false,
}: SelectProps) {
  // DATA STATE
  const [data, setData] = useState([]);

  // GET DATA
  const handleOptionData = async () => {
    if (schoolName && dataType === "schoolClasses") {
      const q = query(
        collection(db, dataType),
        where("school", "==", schoolName),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      setData(promises);
    } else {
      const q = query(collection(db, dataType), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      setData(promises);
    }
  };

  useEffect(() => {
    handleOptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType]);

  return (
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
          >
            {option.name}
          </option>
        </>
      ))}
    </>
  );
}
