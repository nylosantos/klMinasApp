/* eslint-disable react-hooks/exhaustive-deps */
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
import { ClassDays } from "../formComponents/ClassDays";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createClassDaysValidationSchema } from "../../@types/zodValidation";
import {
  CreateClassDaysValidationZProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
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

export function InsertClassDays() {
  // CLASS DAY DATA
  const [classDaysData, setClassDaysData] =
    useState<CreateClassDaysValidationZProps>({
      name: "",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
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
  } = useForm<CreateClassDaysValidationZProps>({
    resolver: zodResolver(createClassDaysValidationSchema),
    defaultValues: {
      name: "",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setClassDaysData({
      name: "",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", classDaysData.name);
    setValue("sunday", classDaysData.sunday);
    setValue("monday", classDaysData.monday);
    setValue("tuesday", classDaysData.tuesday);
    setValue("wednesday", classDaysData.wednesday);
    setValue("thursday", classDaysData.thursday);
    setValue("friday", classDaysData.friday);
    setValue("saturday", classDaysData.saturday);
    setValue("confirmInsert", classDaysData.confirmInsert);
  }, [classDaysData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.sunday,
      errors.monday,
      errors.tuesday,
      errors.wednesday,
      errors.thursday,
      errors.friday,
      errors.saturday,
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

  // TOGGLE CLASS DAYS VALUE FUNCTION
  function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
    setClassDaysData({ ...classDaysData, [day]: value });
  }

  // FORM SUBMIT FUNCTION
  const handleAddClassDays: SubmitHandler<
    CreateClassDaysValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // CHECK IF ANY DAY WAS PICKED
    if (
      !classDaysData.sunday &&
      !classDaysData.monday &&
      !classDaysData.tuesday &&
      !classDaysData.wednesday &&
      !classDaysData.thursday &&
      !classDaysData.friday &&
      !classDaysData.saturday
    ) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, selecione algum dia para adicionar o dia de aula ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ADD CLASS DAY FUNCTION
    const addClassDays = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "classDays", commonId), {
          id: commonId,
          name: data.name,
          sunday: data.sunday,
          monday: data.monday,
          tuesday: data.tuesday,
          wednesday: data.wednesday,
          thursday: data.thursday,
          friday: data.friday,
          saturday: data.saturday,
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`${data.name} criado com sucesso! 👌`, {
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

    // CHECKING IF CLASS DAY EXISTS ON DATABASE
    const classDaysRef = collection(db, "classDays");
    const q = query(
      classDaysRef,
      where("sunday", "==", data.sunday),
      where("monday", "==", data.monday),
      where("tuesday", "==", data.tuesday),
      where("wednesday", "==", data.wednesday),
      where("thursday", "==", data.thursday),
      where("friday", "==", data.friday),
      where("saturday", "==", data.saturday)
    );
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
            `Um identificador com os dias selecionados já existe no nosso banco de dados: ${results[0].name} ❕`,
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
        addClassDays();
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
      <h1 className={pageTitleH1}>Adicionar Dias de Aula</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddClassDays)} className={formMaster}>
        {/* CLASSDAY IDENTIFIER */}
        <div className={divItemsForm}>
          <label
            htmlFor="name"
            className={errors.name ? labelTextError : labelTextOk}
          >
            Identificador:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o Identificador dos dias de Aula"
                : "Insira o Identificador dos dias de Aula"
            }
            className={errors.name ? inputError : inputOk}
            value={classDaysData.name}
            onChange={(e) => {
              setClassDaysData({ ...classDaysData, name: e.target.value });
            }}
          />
        </div>

        {/* DAYS PICKER */}
        <ClassDays classDay={classDaysData} toggleClassDays={toggleClassDays} />

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={classDaysData.confirmInsert}
            onChange={() => {
              setClassDaysData({
                ...classDaysData,
                confirmInsert: !classDaysData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {classDaysData.name
              ? `Confirmar criação de ${classDaysData.name}`
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
