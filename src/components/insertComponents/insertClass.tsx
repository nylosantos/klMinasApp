/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { createClassValidationSchema } from "../zodValidation";
import { CreateClassValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertClass() {
  // CLASS DATA
  const [classData, setClassData] = useState<CreateClassValidationZProps>({
    name: "",
    schoolName: "",
    schoolId: "",
    available: false,
    confirmInsert: false,
  });

  console.log("Nome: ", classData.schoolName, "- Id: ", classData.schoolId)
  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GET SCHOOL DATA FUNCTION
  async function getSchoolData(id: string) {
    const schoolRef = collection(db, "schools");
    const q = query(schoolRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const schoolDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      schoolDataPromises.push(promise);
    });
    setClassData({ ...classData, schoolId: id, schoolName: schoolDataPromises[0].name });
  }

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateClassValidationZProps>({
    resolver: zodResolver(createClassValidationSchema),
    defaultValues: {
      name: "",
      schoolName: "",
      schoolId: "",
      available: false,
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setClassData({
      name: "",
      schoolName: "",
      schoolId: "",
      available: false,
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", classData.name);
    setValue("schoolId", classData.schoolId);
    setValue("schoolName", classData.schoolName);
    setValue("available", classData.available);
    setValue("confirmInsert", classData.confirmInsert);
  }, [classData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.schoolId,
      errors.available,
      errors.confirmInsert,
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
  const handleAddClass: SubmitHandler<CreateClassValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar Turma ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF CLASS EXISTS ON DATABASE
    const classRef = collection(db, "schoolClasses");
    const q = query(classRef, where("name", "==", `Turma ${data.name}`));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF EXISTS, RETURN ERROR
      if (results.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Turma ${data.name} já existe no nosso banco de dados... ❕`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          )
        );
      } else {
        // IF NOT EXISTS, CREATE
        const addClass = async () => {
          try {
            await setDoc(doc(db, "schoolClasses", uuidv4()), {
              id: uuidv4(),
              name: `Turma ${data.name}`,
              schoolName: data.schoolName,
              schoolId: data.schoolId,
              available: data.available,
              timestamp: serverTimestamp(),
            });
            resetForm();
            toast.success(`Turma ${data.name} criado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            setIsSubmitting(false);
          } catch (error) {
            console.log("ESSE É O ERROR", error);
            toast.error(`Ocorreu um erro... 🤯`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            setIsSubmitting(false);
          }
        };
        addClass();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Adicionar Turma</h1>
      <form
        onSubmit={handleSubmit(handleAddClass)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* CLASS NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Nome:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o Nome da Turma"
                : "Insira o nome da Turma"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={classData.name}
            onChange={(e) => {
              setClassData({ ...classData, name: e.target.value });
            }}
          />
        </div>

        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.schoolId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              getSchoolData(e.target.value);
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* CLASS AVAILABILITY */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="available"
            className={
              errors.available
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Disponibilidade:{" "}
          </label>
          <select
            defaultValue={"closed"}
            onChange={(e) => {
              e.target.value === "opened"
                ? setClassData({ ...classData, available: true })
                : e.target.value === "closed"
                ? setClassData({ ...classData, available: false })
                : null;
            }}
            className={
              errors.available
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
          >
            <option disabled value={" -- select an option -- "}>
              {" "}
              -- Selecione --{" "}
            </option>
            <option value={"opened"}>Turma Aberta</option>
            <option value={"closed"}>Turma Fechada</option>
          </select>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none "
            checked={classData.confirmInsert}
            onChange={() => {
              setClassData({
                ...classData,
                confirmInsert: !classData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {classData.name
              ? `Confirmar criação de Turma ${classData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
          >
            {!isSubmitting ? "Criar" : "Criando"}
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
      </form>
    </div>
  );
}
