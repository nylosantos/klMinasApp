/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createClassValidationSchema } from "../../@types/zodValidation";
import { CreateClassValidationZProps, SchoolSearchProps } from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertClass() {
  // GET GLOBAL DATA
  const { schoolDatabaseData, schoolClassDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHOOL CLASS DATA
  const [schoolClassData, setSchoolClassData] =
    useState<CreateClassValidationZProps>({
      name: "",
      schoolName: "",
      schoolId: "",
      confirmInsert: false,
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolClassData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === schoolClassData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolClassData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setSchoolClassData({
        ...schoolClassData,
        schoolName: schoolSelectedData!.name,
      });
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
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setSchoolClassData({
      name: "",
      schoolName: "",
      schoolId: "",
      confirmInsert: false,
    });
    ((
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0),
      reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolClassData.name);
    setValue("schoolId", schoolClassData.schoolId);
    setValue("schoolName", schoolClassData.schoolName);
    setValue("confirmInsert", schoolClassData.confirmInsert);
  }, [schoolClassData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name, errors.schoolId, errors.confirmInsert];
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
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o Ano Escolar ${data.name}... ☑️`,
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
          name: data.name,
          schoolName: data.schoolName,
          schoolId: data.schoolId,
          updatedAt: serverTimestamp(),
        });
        resetForm();
        toast.success(`Ano Escolar ${data.name} criado com sucesso! 👌`, {
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
    const schoolClassExists = schoolClassDatabaseData.find(
      (schoolClass) => schoolClass.name === data.name
    );
    if (schoolClassExists) {
      // IF EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(
          `Ano Escolar ${data.name} já existe no nosso banco de dados... ❕`,
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
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {schoolClassData.name
          ? `Adicionando o Ano Escolar ${schoolClassData.name}`
          : "Adicionando Ano Escolar"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddClass)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL CLASS NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
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
                ? "É necessário inserir o Nome do Ano Escolar"
                : "Insira o nome do Ano Escolar"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={schoolClassData.name}
            onChange={(e) => {
              setSchoolClassData({ ...schoolClassData, name: e.target.value });
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
                : "w-1/4 text-right"
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
              setSchoolClassData({
                ...schoolClassData,
                schoolId: e.target.value,
                confirmInsert: false,
              });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* SCHOOL CLASS AVAILABILITY */}
        {/* <div className="flex gap-2 items-center">
          <label
            htmlFor="available"
            className={
              errors.available
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Disponibilidade:{" "}
          </label>
          <div className="flex flex-col px-2 py-1 gap-2 justify-start items-start">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                value="open"
                name="classAvailable"
                onChange={() =>
                  setSchoolClassData({
                    ...schoolClassData,
                    available: "open",
                    confirmInsert: false,
                  })
                }
              />{" "}
              Aberta
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                value="closed"
                name="classAvailable"
                onChange={() =>
                  setSchoolClassData({
                    ...schoolClassData,
                    available: "closed",
                    confirmInsert: false,
                  })
                }
              />{" "}
              Fechada
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                value="waitingList"
                name="classAvailable"
                onChange={() =>
                  setSchoolClassData({
                    ...schoolClassData,
                    available: "waitingList",
                    confirmInsert: false,
                  })
                }
              />{" "}
              Lista de Espera
            </label>
          </div>
        </div> */}

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={schoolClassData.confirmInsert}
            onChange={() => {
              setSchoolClassData({
                ...schoolClassData,
                confirmInsert: !schoolClassData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            {schoolClassData.name
              ? `Confirmar criação do Ano Escolar ${schoolClassData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
