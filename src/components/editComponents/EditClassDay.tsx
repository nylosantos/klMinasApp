/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { ClassDays } from "../formComponents/ClassDays";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editClassDayValidationSchema } from "../../@types/zodValidation";
import {
  EditClassDayValidationZProps,
  ClassDaySearchProps,
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

export function EditClassDay() {
  // GET GLOBAL DATA
  const { classDaysDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // CLASS DAY DATA
  const [classDayData, setClassDayData] = useState({
    classDayId: "",
  });

  // CLASS DAY EDIT DATA
  const [classDayEditData, setClassDayEditData] =
    useState<EditClassDayValidationZProps>({
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

  // CLASS DAY SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // CLASS DAY SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    setIsEdit(false);
    if (classDayData.classDayId !== "") {
      setClassDaySelectedData(
        classDaysDatabaseData.find(({ id }) => id === classDayData.classDayId)
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [classDayData.classDayId]);

  // SET CLASS DAY NAME AND PRICE TO CLASS DAY EDIT NAME AND PRICE
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      if (classDaySelectedData.indexDays.length > 0) {
        const days = {
          name: "",
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        };
        (days.name = classDaySelectedData.name),
          classDaySelectedData.indexDays.map((day) => {
            if (day === 0) {
              days.sunday = true;
            }
            if (day === 1) {
              days.monday = true;
            }
            if (day === 2) {
              days.tuesday = true;
            }
            if (day === 3) {
              days.wednesday = true;
            }
            if (day === 4) {
              days.thursday = true;
            }
            if (day === 5) {
              days.friday = true;
            }
            if (day === 6) {
              days.saturday = true;
            }
          });
        setClassDayEditData(days);
        setClassDayName(classDaySelectedData.indexNames);
      }
    }
  }, [classDaySelectedData]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditClassDayValidationZProps>({
    resolver: zodResolver(editClassDayValidationSchema),
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

  // TOGGLE CLASS DAYS VALUE FUNCTION
  function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
    setClassDayEditData({ ...classDayEditData, [day]: value });
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

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    (
      document.getElementById("classDaySelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setClassDayData({
      classDayId: "",
    });
    setClassDayEditData({
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
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", classDayName.length > 0 ? classDayName.join(" - ") : "");
    setValue("sunday", classDayEditData.sunday);
    setValue("monday", classDayEditData.monday);
    setValue("tuesday", classDayEditData.tuesday);
    setValue("wednesday", classDayEditData.wednesday);
    setValue("thursday", classDayEditData.thursday);
    setValue("friday", classDayEditData.friday);
    setValue("saturday", classDayEditData.saturday);
  }, [classDayEditData]);

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

  // SUBMIT DATA FUNCTION
  const handleEditClassDay: SubmitHandler<
    EditClassDayValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // CHECK IF ANY DAY WAS PICKED
    if (
      !classDayEditData.sunday &&
      !classDayEditData.monday &&
      !classDayEditData.tuesday &&
      !classDayEditData.wednesday &&
      !classDayEditData.thursday &&
      !classDayEditData.friday &&
      !classDayEditData.saturday
    ) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, selecione algum dia para editar o dia de aula ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // EDIT CLASS DAY FUNCTION
    const editClassDay = async () => {
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
        await secureSetDoc(
          doc(db, "classDays", classDayData.classDayId),
          {
            name:
              classDayName.length > 0 ? classDayName.join(" - ") : data.name,
            indexDays: daysIncluded,
            indexNames: classDayName,
          },
          { merge: true }
        );
        resetForm();
        toast.success(`${classDayEditData.name} alterado com sucesso! 👌`, {
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
    const classDays = classDaysDatabaseData.find(
      (classDays) => classDays.id === classDayData.classDayId
    );
    if (!classDays) {
      // IF NOT EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(
          `Dias de aula selecionado não existe no banco de dados...... ❕`,
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
      // IF EXISTS, EDIT
      editClassDay();
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${classDayEditData.name}` : "Editar Dias de Aula"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditClassDay)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* CLASS DAY SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classDaySelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Dia de Aula:{" "}
          </label>
          <select
            id="classDaySelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="classDaySelect"
            onChange={(e) => {
              setClassDayData({
                ...classDayData,
                classDayId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions returnId dataType="classDays" />
          </select>
        </div>

        {isSelected ? (
          <>
            {/* EDIT BUTTON */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                {!isEdit
                  ? "Editar"
                  : "Clique em CANCELAR para desfazer a Edição"}
              </button>
            </div>
          </>
        ) : null}

        {isEdit ? (
          <>
            {/* CLASS DAY NAME */}
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
            <ClassDays
              classDay={classDayEditData}
              toggleClassDays={toggleClassDays}
            />

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
              >
                {!isSubmitting ? "Salvar" : "Salvando"}
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
                {isSubmitting ? "Aguarde" : "Cancelar"}
              </button>
            </div>
          </>
        ) : null}
      </form>
    </div>
  );
}
