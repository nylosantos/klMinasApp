import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteClassDaysValidationSchema } from "../../@types/zodValidation";
import {
  ClassDaySearchProps,
  DeleteClassDaysValidationZProps,
} from "../../@types";

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

  // -------------------------- CLASS DAY SELECT STATES AND FUNCTIONS -------------------------- //
  // CLASS DAY DATA ARRAY WITH ALL OPTIONS OF SELECT CLASS DAY
  const [classDayDataArray, setClassDayDataArray] =
    useState<ClassDaySearchProps[]>();

  // FUNCTION THAT WORKS WITH CLASS DAY SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleClassDaySelectedData = (data: ClassDaySearchProps[]) => {
    setClassDayDataArray(data);
  };

  // CLASS DAY SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaysData.classDayId !== "") {
      setIsSelected(true);
      setClassDaySelectedData(
        classDayDataArray!.find(({ id }) => id === classDaysData.classDayId)
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [classDaysData.classDayId]);

  // SET CLASS DAY NAME WITH CLASS DAY SELECTED DATA WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaySelectedData !== undefined) {
      setClassDaysData({
        ...classDaysData,
        classDayName: classDaySelectedData!.name,
      });
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
      classDayName: "",
      confirmDelete: false,
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

    // DELETE CLASS DAY FUNCTION
    const deleteClassDay = async () => {
      try {
        await deleteDoc(doc(db, "classDays", data.classDayId));
        resetForm();
        toast.success(`Dia de Aula exclu??do com sucesso! ????`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      } catch (error) {
        console.log("ESSE ?? O ERROR", error);
        toast.error(`Ocorreu um erro... ????`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      }
    };

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUS??O" para excluir o dia de Aula: ${data.classDayName}... ??????`,
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
            `Dia de Aula inclu??do em ${results.length} ${
              results.length === 1 ? "Curr??culo" : "Curr??culos"
            }, exclua ou altere primeiramente ${
              results.length === 1 ? "o Curr??culo" : "os Curr??culos"
            } e depois exclua o Dia de Aula: ${data.classDayName}... ???`,
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
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

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
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="classDaySelect"
            onChange={(e) => {
              setClassDaysData({
                ...classDaysData,
                classDayId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              dataType="classDays"
              handleData={handleClassDaySelectedData}
            />
          </select>
        </div>

        {isSelected ? (
          <>
            {/** CHECKBOX CONFIRM DELETE */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="confirmDelete"
                className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none "
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
                className="text-sm"
              >
                {classDaysData.classDayName
                  ? `Confirmar exclus??o de ${classDaysData.classDayName}`
                  : `Confirmar exclus??o`}
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
