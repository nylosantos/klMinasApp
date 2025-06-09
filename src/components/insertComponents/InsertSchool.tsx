/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, serverTimestamp } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { CreateSchoolValidationZProps } from "../../@types";
import { createSchoolValidationSchema } from "../../@types/zodValidation";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { secureSetDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertSchool() {
  // GET GLOBAL DATA
  const { schoolDatabaseData, page, userFullData, handleConfirmationToSubmit } =
    useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL DATA
  const [schoolData, setSchoolData] = useState<CreateSchoolValidationZProps>({
    name: "",
    // confirmInsert: false,
  });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSchoolValidationZProps>({
    resolver: zodResolver(createSchoolValidationSchema),
    defaultValues: {
      name: "",
      // confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setSchoolData({
      name: "",
      // confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolData.name);
    // setValue("confirmInsert", schoolData.confirmInsert);
  }, [schoolData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name/*, errors.confirmInsert*/];
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
  const handleAddSchool: SubmitHandler<CreateSchoolValidationZProps> = async (
    data
  ) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Adicionar Escola",
      text: "Tem certeza que deseja adicionar esta escola?",
      icon: "question",
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      // ADD SCHOOL FUNCTION
      const addSchool = async () => {
        try {
          const commonId = uuidv4();
          await secureSetDoc(doc(db, "schools", commonId), {
            id: commonId,
            name: data.name,
            timestamp: serverTimestamp(),
          });
          resetForm();
          toast.success(`Colégio ${data.name} criado com sucesso! 👌`, {
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

      // CHECK INSERT CONFIRMATION
      // if (!data.confirmInsert) {
      //   setIsSubmitting(false);
      //   return toast.error(
      //     `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o Colégio ${data.name}... ☑️`,
      //     {
      //       theme: "colored",
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       autoClose: 3000,
      //     }
      //   );
      // }

      // CHECKING IF SCHOOL EXISTS ON DATABASE
      const schoolExists = schoolDatabaseData.find(
        (school) => school.name === `Colégio ${data.name}`
      );
      if (schoolExists) {
        // IF EXISTS, RETURN ERROR
        return (
          setIsSubmitting(false),
          toast.error(
            `Colégio ${data.name} já existe no nosso banco de dados... ❕`,
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
        addSchool();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      {page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" && (
          <h1 className="font-bold text-2xl my-4">Adicionar Escola</h1>
        )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddSchool)}
        className={`flex flex-col w-full gap-2 rounded-xl ${
          page.show !== "Dashboard" &&
          userFullData &&
          userFullData.role !== "user"
            ? "bg-klGreen-500/20 dark:bg-klGreen-500/30 p-4 mt-2"
            : "pb-4 px-4 pt-2"
        }`}
      >
        {/* SCHOOL NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolName"
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
            name="schoolName"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o Nome da Escola"
                : "Insira o nome da Escola"
            }
            className={
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={schoolData.name}
            onChange={(e) => {
              setSchoolData({ ...schoolData, name: e.target.value });
            }}
          />
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        {/* <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={schoolData.confirmInsert}
            onChange={() => {
              setSchoolData({
                ...schoolData,
                confirmInsert: !schoolData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            {schoolData.name
              ? `Confirmar criação do Colégio ${schoolData.name}`
              : `Confirmar criação`}
          </label>
        </div> */}

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
