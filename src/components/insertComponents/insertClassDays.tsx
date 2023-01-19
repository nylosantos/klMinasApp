/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { createClassDaysValidationSchema } from "../zodValidation";
import {
  CreateClassDaysValidationZProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
import { ClassDays } from "../ClassDays";
import { app } from "../../db/Firebase";

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
        const addClassDays = async () => {
          try {
            await setDoc(doc(db, "classDays", uuidv4()), {
              id: uuidv4(),
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
        addClassDays();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Adicionar Dias de Aula</h1>
      <form
        onSubmit={handleSubmit(handleAddClassDays)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* CLASSDAY IDENTIFIER */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
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
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={classDaysData.name}
            onChange={(e) => {
              setClassDaysData({ ...classDaysData, name: e.target.value });
            }}
          />
        </div>

        {/* DAYS PICKER */}
        <ClassDays classDay={classDaysData} toggleClassDays={toggleClassDays} />

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none "
            checked={classDaysData.confirmInsert}
            onChange={() => {
              setClassDaysData({
                ...classDaysData,
                confirmInsert: !classDaysData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {classDaysData.name
              ? `Confirmar criação de ${classDaysData.name}`
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
