/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteClassDaysValidationSchema } from "../../@types/zodValidation";
import {
  ClassDaySearchProps,
  DeleteClassDaysValidationZProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { secureDeleteDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteClassDays() {
  // GET GLOBAL DATA
  const {
    classDaysDatabaseData,
    curriculumDatabaseData,
    handleConfirmationToSubmit,
    // logDelete,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CLASS DAY DATA
  const [classDaysData, setClassDaysData] =
    useState<DeleteClassDaysValidationZProps>({
      classDayId: "",
    });

  const [classDayName, setClassDayName] = useState("");

  // -------------------------- CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //
  // CLASS DAY SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaysData.classDayId !== "") {
      setIsSelected(true);
      setClassDaySelectedData(
        classDaysDatabaseData.find(({ id }) => id === classDaysData.classDayId)
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [classDaysData.classDayId]);

  // SET CLASS DAY NAME WITH CLASS DAY SELECTED DATA WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      setClassDayName(classDaySelectedData!.name);
    }
  }, [classDaySelectedData]);
  // -------------------------- END OF CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

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
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("classDaySelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setClassDaysData({
      classDayId: "",
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("classDayId", classDaysData.classDayId);
  }, [classDaysData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.classDayId];
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
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Dias de Aula",
      text: "Tem certeza que deseja deletar estes Dias de Aula?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      // DELETE CLASS DAY FUNCTION
      const deleteClassDay = async () => {
        try {
          await secureDeleteDoc(doc(db, "classDays", data.classDayId));
          // await logDelete(data, "classDays", data.classDayId);
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

      // CHECKING IF CLASS DAYS EXISTS ON CURRICULUM DATABASE

      // SEARCH CURRICULUM WITH THIS CLASS DAYS
      const classDaysExistsOnCurriculum = curriculumDatabaseData.filter(
        (curriculum) => curriculum.classDayId === classDaysData.classDayId
      );

      // IF EXISTS, RETURN ERROR
      if (classDaysExistsOnCurriculum.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Dia de Aula incluído em ${classDaysExistsOnCurriculum.length} ${
              classDaysExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
            }, exclua ou altere primeiramente ${
              classDaysExistsOnCurriculum.length === 1 ? "a Turma" : "as Turmas"
            } e depois exclua o dia de aula: ${classDayName}... ❕`,
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
        deleteClassDay();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Dias de Aula</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleDeleteClassDays)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* CLASS DAYS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classDaySelect"
            className={
              errors.classDayId
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
              errors.classDayId
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="classDaySelect"
            onChange={(e) => {
              setClassDaysData({
                ...classDaysData,
                classDayId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="classDays" />
          </select>
        </div>

        {isSelected ? (
          <>
            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
          </>
        ) : null}
      </form>
    </div>
  );
}
