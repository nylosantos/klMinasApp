/* eslint-disable react-hooks/exhaustive-deps */
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
  updateDoc,
  where,
} from "firebase/firestore";

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

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditClassDay() {
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

  // CLASS DAY SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // CLASS DAY DATA ARRAY WITH ALL OPTIONS OF SELECT CLASS DAYS
  const [classDaysDataArray, setClassDaysDataArray] =
    useState<ClassDaySearchProps[]>();

  // FUNCTION THAT WORKS WITH CLASS DAY SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleClassDaySelectedData = (data: ClassDaySearchProps[]) => {
    setClassDaysDataArray(data);
  };

  // CLASS DAY SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    setIsEdit(false);
    if (classDayData.classDayId !== "") {
      setClassDaySelectedData(
        classDaysDataArray!.find(({ id }) => id === classDayData.classDayId)
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [classDayData.classDayId]);

  // SET CLASS DAY NAME AND PRICE TO CLASS DAY EDIT NAME AND PRICE
  useEffect(() => {
    setClassDayEditData({
      ...classDayEditData,
      name: classDaySelectedData?.name!,
      sunday: classDaySelectedData?.sunday!,
      monday: classDaySelectedData?.monday!,
      tuesday: classDaySelectedData?.tuesday!,
      wednesday: classDaySelectedData?.wednesday!,
      thursday: classDaySelectedData?.thursday!,
      friday: classDaySelectedData?.friday!,
      saturday: classDaySelectedData?.saturday!,
    });
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
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", classDayEditData.name);
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

    // EDIT CLASS DAY FUNCTION
    const editClassDay = async () => {
      try {
        await updateDoc(doc(db, "classDays", classDayData.classDayId), {
          name: data.name,
          sunday: data.sunday,
          monday: data.monday,
          tuesday: data.tuesday,
          wednesday: data.wednesday,
          thursday: data.thursday,
          friday: data.friday,
          saturday: data.saturday,
        });
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
    const classDayRef = collection(db, "classDays");
    const q = query(classDayRef, where("id", "==", classDayData.classDayId));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF NOT EXISTS, RETURN ERROR
      if (results.length === 0) {
        return (
          setIsSubmitting(false),
          toast.error(`Modalidade não existe no banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF EXISTS, EDIT
        editClassDay();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${classDayEditData.name}` : "Editar Dias de Aula"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditClassDay)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* CLASS DAY SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classDaySelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Dia de Aula:{" "}
          </label>
          <select
            id="classDaySelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
            <SelectOptions
              returnId
              handleData={handleClassDaySelectedData}
              dataType="classDays"
            />
          </select>
        </div>

        {isSelected ? (
          <>
            {/* EDIT BUTTON */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-green-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
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
                    ? "É necessário inserir o Identificador dos dias de Aula"
                    : "Insira o Identificador dos dias de Aula"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={classDayEditData.name}
                onChange={(e) => {
                  setClassDayEditData({
                    ...classDayEditData,
                    name: e.target.value,
                  });
                }}
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
                className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
