import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
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

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createClassValidationSchema } from "../../@types/zodValidation";
import { CreateClassValidationZProps, SchoolSearchProps } from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertClass() {
  // SCHOOL CLASS DATA
  const [classData, setClassData] = useState<CreateClassValidationZProps>({
    name: "",
    schoolName: "",
    schoolId: "",
    available: false,
    confirmInsert: false,
  });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL
  const [schoolDataArray, setSchoolDataArray] = useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (classData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDataArray!.find(({ id }) => id === classData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [classData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setClassData({ ...classData, schoolName: schoolSelectedData!.name });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    ((
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0),
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

    // ADD SCHOOL CLASS FUNCTION
    const addClass = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "schoolClasses", commonId), {
          id: commonId,
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

    // CHECKING IF SCHOOL CLASS EXISTS ON DATABASE
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
        addClass();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {classData.name
          ? `Adicionando Turma ${classData.name}`
          : "Adicionar Turma"}
      </h1>

      {/* FORM */}
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
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setClassData({
                ...classData,
                schoolId: e.target.value,
                confirmInsert: false,
              });
            }}
          >
            <SelectOptions
              returnId
              dataType="schools"
              handleData={handleSchoolSelectedData}
            />
          </select>
        </div>

        {/* SCHOOL CLASS AVAILABILITY */}
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
            name="available"
            defaultValue={"closed"}
            onChange={(e) => {
              e.target.value === "opened"
                ? setClassData({ ...classData, available: true })
                : e.target.value === "closed"
                ? setClassData({ ...classData, available: false })
                : null;
              setClassData({ ...classData, confirmInsert: false });
            }}
            className={
              errors.available
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
            className="ml-1 text-green-500 dark:text-green-500 border-none"
            checked={classData.confirmInsert}
            onChange={() => {
              setClassData({
                ...classData,
                confirmInsert: !classData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmInsert"
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
