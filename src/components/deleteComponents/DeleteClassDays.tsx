/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { deleteClassDaysValidationSchema } from "../../@types/zodValidation";
import { DeleteClassDaysValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteClassDays() {
  // CLASS DAY DATA
  const [classDaysData, setClassDaysData] =
    useState<DeleteClassDaysValidationZProps>({
      classDayId: "",
      classDayName: "",
      confirmDelete: false,
    });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GET CLASS DAYS DATA FUNCTION
  async function getClassDaysData(id: string) {
    const classDayRef = collection(db, "classDays");
    const q = query(classDayRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const schoolClassDayPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      schoolClassDayPromises.push(promise);
    });
    setClassDaysData({
      ...classDaysData,
      classDayName: schoolClassDayPromises[0].name,
      classDayId: id,
      confirmDelete: false,
    });
  }

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteClassDaysValidationZProps>({
    resolver: zodResolver(deleteClassDaysValidationSchema),
    defaultValues: {
      classDayId: "",
      classDayName: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setClassDaysData({
      classDayId: "",
      classDayName: "",
      confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("classDayId", classDaysData.classDayId);
    setValue("classDayName", classDaysData.classDayName);
    setValue("confirmDelete", classDaysData.confirmDelete);
  }, [classDaysData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.classDayId,
      errors.classDayName,
      errors.confirmDelete,
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

  // FORM SUBMIT FUNCTION
  const handleDeleteClassDays: SubmitHandler<
    DeleteClassDaysValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o dia de Aula: ${data.classDayName}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF CLASS DAY EXISTS ON CURRICULUM DATABASE
    const classDayRef = collection(db, "curriculum");
    const q = query(classDayRef, where("classDay", "==", data.classDayName));
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
            `Dia de Aula incluído em ${results.length} ${
              results.length === 1 ? "Currículo" : "Currículos"
            }, exclua ou altere primeiramente ${
              results.length === 1 ? "o Currículo" : "os Currículos"
            } e depois exclua o Dia de Aula: ${data.classDayName}... ❕`,
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
        // IF NO EXISTS, DELETE
        const deleteClassDay = async () => {
          try {
            await deleteDoc(doc(db, "classDays", data.classDayId));
            resetForm();
            toast.success(`Dia de Aula excluído com sucesso! 👌`, {
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
        deleteClassDay();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Excluir Dias de Aula</h1>
      <form
        onSubmit={handleSubmit(handleDeleteClassDays)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* CLASS DAYS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classDaySelect"
            className={
              errors.classDayId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Dia de Aula:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.classDayId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="classDaySelect"
            onChange={(e) => {
              getClassDaysData(e.target.value);
            }}
          >
            <SelectOptions returnId dataType="classDays" />
          </select>
        </div>

        {/** CHECKBOX CONFIRM DELETE */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none "
            checked={classDaysData.confirmDelete}
            onChange={() => {
              setClassDaysData({
                ...classDaysData,
                confirmDelete: !classDaysData.confirmDelete,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {classDaysData.classDayName
              ? `Confirmar exclusão de ${classDaysData.classDayName}`
              : `Confirmar exclusão`}
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
            {!isSubmitting ? "Excluir" : "Excluindo"}
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
