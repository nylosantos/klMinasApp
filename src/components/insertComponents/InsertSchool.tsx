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
import { CreateSchoolValidationZProps } from "../../@types";
import { createSchoolValidationSchema } from "../../@types/zodValidation";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  buttonReset,
  buttonSubmit,
  divCheckboxItem,
  divItemsForm,
  divMasterPage,
  divSubmitResetItems,
  formMaster,
  inputCheckbox,
  inputError,
  inputOk,
  labelCheckbox,
  labelTextError,
  labelTextOk,
  pageTitleH1,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertSchool() {
  // SCHOOL DATA
  const [schoolData, setSchoolData] = useState<CreateSchoolValidationZProps>({
    name: "",
    confirmInsert: false,
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
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setSchoolData({
      name: "",
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolData.name);
    setValue("confirmInsert", schoolData.confirmInsert);
  }, [schoolData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name, errors.confirmInsert];
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
    setIsSubmitting(true);

    // ADD SCHOOL FUNCTION
    const addSchool = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "schools", commonId), {
          id: commonId,
          name: `Colégio ${data.name}`,
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
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o Colégio ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF SCHOOL EXISTS ON DATABASE
    const schoolRef = collection(db, "schools");
    const q = query(schoolRef, where("name", "==", `Colégio ${data.name}`));
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
    });
  };

  return (
    <div className={divMasterPage}>
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className={pageTitleH1}>Adicionar Escola</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddSchool)} className={formMaster}>
        {/* SCHOOL NAME */}
        <div className={divItemsForm}>
          <label
            htmlFor="schoolName"
            className={errors.name ? labelTextError : labelTextOk}
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
            className={errors.name ? inputError : inputOk}
            value={schoolData.name}
            onChange={(e) => {
              setSchoolData({ ...schoolData, name: e.target.value });
            }}
          />
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={schoolData.confirmInsert}
            onChange={() => {
              setSchoolData({
                ...schoolData,
                confirmInsert: !schoolData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {schoolData.name
              ? `Confirmar criação do Colégio ${schoolData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className={divSubmitResetItems}>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonSubmit}
          >
            {!isSubmitting ? "Criar" : "Criando"}
          </button>

          {/* RESET BUTTON */}
          <button
            type="reset"
            className={buttonReset}
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
