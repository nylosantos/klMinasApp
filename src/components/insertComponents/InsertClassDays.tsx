/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, serverTimestamp } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { ClassDays } from "../formComponents/ClassDays";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createClassDaysValidationSchema } from "../../@types/zodValidation";
import {
  CreateClassDaysValidationZProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
import { classDayIndexNames } from "../../custom";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { secureSetDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertClassDays() {
  // GET GLOBAL DATA
  const { classDaysDatabaseData, handleConfirmationToSubmit } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

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
    });

  // CLASS DAY NAME FORMAT
  const [classDayName, setClassDayName] = useState<string[]>([]);

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
    });
    setClassDayName([]);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", classDayName.length > 0 ? classDayName.join(" - ") : "");
    setValue("sunday", classDaysData.sunday);
    setValue("monday", classDaysData.monday);
    setValue("tuesday", classDaysData.tuesday);
    setValue("wednesday", classDaysData.wednesday);
    setValue("thursday", classDaysData.thursday);
    setValue("friday", classDaysData.friday);
    setValue("saturday", classDaysData.saturday);
  }, [classDaysData, classDayName]);

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
    if (value) {
      classDayIndexNames.map((dayIndex) => {
        if (dayIndex.id === day) {
          if (dayIndex.name === "Domingo") {
            setClassDayName((classDayName) => ["Domingo", ...classDayName]);
          }
          if (dayIndex.name === "Segunda") {
            const foundSunday = classDayName.findIndex(
              (name) => name === "Domingo"
            );
            if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Segunda",
                ...classDayName.slice(insertAt),
              ]);
            } else {
              setClassDayName((classDayName) => ["Segunda", ...classDayName]);
            }
          }
          if (dayIndex.name === "Terça") {
            const foundSunday = classDayName.findIndex(
              (name) => name === "Domingo"
            );
            const foundMonday = classDayName.findIndex(
              (name) => name === "Segunda"
            );
            if (foundMonday !== -1) {
              const insertAt = foundMonday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Terça",
                ...classDayName.slice(insertAt),
              ]);
            } else if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Terça",
                ...classDayName.slice(insertAt),
              ]);
            } else {
              setClassDayName((classDayName) => ["Terça", ...classDayName]);
            }
          }
          if (dayIndex.name === "Quarta") {
            const foundSunday = classDayName.findIndex(
              (name) => name === "Domingo"
            );
            const foundMonday = classDayName.findIndex(
              (name) => name === "Segunda"
            );
            const foundTuesday = classDayName.findIndex(
              (name) => name === "Terça"
            );
            if (foundTuesday !== -1) {
              const insertAt = foundTuesday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Quarta",
                ...classDayName.slice(insertAt),
              ]);
            } else if (foundMonday !== -1) {
              const insertAt = foundMonday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Quarta",
                ...classDayName.slice(insertAt),
              ]);
            } else if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, insertAt),
                "Quarta",
                ...classDayName.slice(insertAt),
              ]);
            } else {
              setClassDayName((classDayName) => ["Quarta", ...classDayName]);
            }
          }
          if (dayIndex.name === "Quinta") {
            const foundSaturday = classDayName.findIndex(
              (name) => name === "Sábado"
            );
            const foundFriday = classDayName.findIndex(
              (name) => name === "Sexta"
            );
            if (foundFriday !== -1) {
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, foundFriday),
                "Quinta",
                ...classDayName.slice(foundFriday),
              ]);
            } else if (foundSaturday !== -1) {
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, foundSaturday),
                "Quinta",
                ...classDayName.slice(foundSaturday),
              ]);
            } else {
              setClassDayName((classDayName) => [...classDayName, "Quinta"]);
            }
          }
          if (dayIndex.name === "Sexta") {
            const foundSaturday = classDayName.findIndex(
              (name) => name === "Sábado"
            );
            if (foundSaturday !== -1) {
              setClassDayName((classDayName) => [
                ...classDayName.slice(0, foundSaturday),
                "Sexta",
                ...classDayName.slice(foundSaturday),
              ]);
            } else {
              setClassDayName((classDayName) => [...classDayName, "Sexta"]);
            }
          }
          if (dayIndex.name === "Sábado") {
            setClassDayName((classDayName) => [...classDayName, "Sábado"]);
          }
        }
      });
    } else {
      classDayIndexNames.map((dayIndex) => {
        if (dayIndex.id === day) {
          if (dayIndex.name === "Domingo") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Domingo")
            );
          }
          if (dayIndex.name === "Segunda") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Segunda")
            );
          }
          if (dayIndex.name === "Terça") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Terça")
            );
          }
          if (dayIndex.name === "Quarta") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Quarta")
            );
          }
          if (dayIndex.name === "Quinta") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Quinta")
            );
          }
          if (dayIndex.name === "Sexta") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Sexta")
            );
          }
          if (dayIndex.name === "Sábado") {
            setClassDayName(
              classDayName.filter((classDay) => classDay !== "Sábado")
            );
          }
        }
      });
    }
  }

  // FORM SUBMIT FUNCTION
  const handleAddClassDays: SubmitHandler<
    CreateClassDaysValidationZProps
  > = async (data) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Adicionar Dias de Aula",
      text: "Tem certeza que deseja adicionar estes Dias de Aula?",
      icon: "question",
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
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

      // ADD CLASS DAY FUNCTION
      const addClassDays = async () => {
        const daysIncluded: number[] = [];
        if (data.sunday) {
          daysIncluded.push(0);
        }
        if (data.monday) {
          daysIncluded.push(1);
        }
        if (data.tuesday) {
          daysIncluded.push(2);
        }
        if (data.wednesday) {
          daysIncluded.push(3);
        }
        if (data.thursday) {
          daysIncluded.push(4);
        }
        if (data.friday) {
          daysIncluded.push(5);
        }
        if (data.saturday) {
          daysIncluded.push(6);
        }
        try {
          const commonId = uuidv4();
          await secureSetDoc(doc(db, "classDays", commonId), {
            id: commonId,
            name: data.name,
            indexDays: daysIncluded,
            indexNames: classDayName,
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

      const classDaysExist = classDaysDatabaseData.find(
        (classDay) => classDay.name === data.name
      );
      // IF EXISTS, RETURN ERROR
      if (classDaysExist) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Um identificador com os dias selecionados já existe no nosso banco de dados: ${data.name} ❕`,
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
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Dias de Aula</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddClassDays)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* CLASSDAY IDENTIFIER */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Identificador:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            readOnly
            placeholder={
              errors.name
                ? "É necessário inserir o Identificador dos dias de Aula"
                : "Selecione os dias para formar o Identificador dos Dias de Aula"
            }
            className={
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={classDayName.length > 0 ? classDayName.join(" - ") : ""}
          />
        </div>

        {/* DAYS PICKER */}
        <ClassDays classDay={classDaysData} toggleClassDays={toggleClassDays} />

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
