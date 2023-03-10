import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import CurrencyInput from "react-currency-input-field";
import { SubmitHandler, useForm } from "react-hook-form";
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

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteSchoolCourseValidationSchema } from "../../@types/zodValidation";
import {
  DeleteSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
} from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteCourse() {
  // SCHOOL COURSE DATA
  const [schoolCourseData, setSchoolCourseData] =
    useState<DeleteSchoolCourseValidationZProps>({
      schoolCourseId: "",
      schoolCourseName: "",
      price: 0,
      confirmDelete: false,
    });

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSE
  const [schoolCourseDataArray, setSchoolCourseDataArray] =
    useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolCourseSelectedData = (data: SchoolCourseSearchProps[]) => {
    setSchoolCourseDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseData.schoolCourseId !== "") {
      setIsSelected(true);
      setSchoolCourseSelectedData(
        schoolCourseDataArray!.find(
          ({ id }) => id === schoolCourseData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [schoolCourseData.schoolCourseId]);

  // SET SCHOOL COURSE NAME WITH SCHOOL COURSE SELECTED DATA WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseSelectedData !== undefined) {
      setSchoolCourseData({
        ...schoolCourseData,
        schoolCourseName: schoolCourseSelectedData!.name,
        price: schoolCourseSelectedData!.price,
      });
    }
  }, [schoolCourseSelectedData]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteSchoolCourseValidationZProps>({
    resolver: zodResolver(deleteSchoolCourseValidationSchema),
    defaultValues: {
      schoolCourseId: "",
      schoolCourseName: "",
      price: 0,
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setSchoolCourseData({
      schoolCourseId: "",
      schoolCourseName: "",
      price: 0,
      confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolCourseId", schoolCourseData.schoolCourseId);
    setValue("schoolCourseName", schoolCourseData.schoolCourseName);
    setValue("confirmDelete", schoolCourseData.confirmDelete);
  }, [schoolCourseData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.schoolCourseId, errors.confirmDelete];
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
  const handleDeleteSchoolCourse: SubmitHandler<
    DeleteSchoolCourseValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // DELETE SCHOOL COURSE FUNCTION
    const deleteSchoolCourse = async () => {
      try {
        await deleteDoc(doc(db, "schoolCourses", data.schoolCourseId));
        resetForm();
        toast.success(`Curso/Aula exclu??do com sucesso! ????`, {
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
        `Por favor, clique em "CONFIRMAR EXCLUS??O" para excluir a Modalidade: ${data.schoolCourseName}... ??????`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF SCHOOL COURSE EXISTS ON DATABASE
    const schoolCourseRef = collection(db, "curriculum");
    const q = query(
      schoolCourseRef,
      where("schoolCourse", "==", data.schoolCourseName)
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
            `Modalidade inclu??da em ${results.length} ${
              results.length === 1 ? "Curr??culo" : "Curr??culos"
            }, exclua ou altere primeiramente ${
              results.length === 1 ? "o Curr??culo" : "os Curr??culos"
            } e depois exclua a Modalidade ${data.schoolCourseName}... ???`,
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
        deleteSchoolCourse();
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
      <h1 className="font-bold text-2xl my-4">Excluir Modalidade</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleDeleteSchoolCourse)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.schoolCourseId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="schoolCourseSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolCourseId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setSchoolCourseData({
                ...schoolCourseData,
                schoolCourseId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              dataType="schoolCourses"
              handleData={handleSchoolCourseSelectedData}
            />
          </select>
        </div>

        {isSelected ? (
          <>
            <div className="flex flex-col pt-2 pb-6 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
              {/* DETAILS TITLE */}
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Dados da modalidade a ser exclu??da:
              </h1>

              {/* SCHOOL COURSE NAME */}
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="name"
                  className="w-1/4 text-right"
                >
                  Nome:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={schoolCourseData.schoolCourseName}
                />
              </div>

              {/* SCHOOL COURSE PRICE */}
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="price"
                  className={
                    errors.price
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Valor da Mensalidade:{" "}
                </label>
                <CurrencyInput
                  name="price"
                  placeholder={
                    errors.price
                      ? "?? necess??rio inserir o valor mensal do Curso / Aula"
                      : "Insira o valor mensal do Curso / Aula"
                  }
                  value={schoolCourseData.price}
                  decimalsLimit={2}
                  decimalScale={2}
                  prefix="R$"
                  disabled
                  disableAbbreviations
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                />
              </div>
            </div>

            {/** CHECKBOX CONFIRM DELETE */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="confirmDelete"
                className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none "
                checked={schoolCourseData.confirmDelete}
                onChange={() => {
                  setSchoolCourseData({
                    ...schoolCourseData,
                    confirmDelete: !schoolCourseData.confirmDelete,
                  });
                }}
              />
              <label
                htmlFor="confirmDelete"
                className="text-sm"
              >
                {schoolCourseData.schoolCourseName
                  ? `Confirmar exclus??o de ${schoolCourseData.schoolCourseName}`
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
