/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input-field";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolCourseValidationSchema } from "../../@types/zodValidation";
import {
  EditSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditCourse() {
  // GET GLOBAL DATA
  const { isSubmitting, schoolCourseDatabaseData, setIsSubmitting } =
    useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL COURSE DATA
  const [schoolCourseData, setSchoolCourseData] = useState({
    schoolCourseId: "",
  });

  // SCHOOL COURSE EDIT DATA
  const [schoolCourseEditData, setSchoolCourseEditData] =
    useState<EditSchoolCourseValidationZProps>({
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });

  // SCHOOL COURSE SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    setIsEdit(false);
    if (schoolCourseData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
          ({ id }) => id === schoolCourseData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [schoolCourseData.schoolCourseId]);

  // SET SCHOOL COURSE NAME AND PRICE TO SCHOOL COURSE EDIT DATA
  useEffect(() => {
    if (schoolCourseSelectedData) {
      setSchoolCourseEditData({
        ...schoolCourseEditData,
        name: schoolCourseSelectedData?.name,
        priceUnit: schoolCourseSelectedData?.priceUnit,
        priceBundle: schoolCourseSelectedData?.priceBundle,
        bundleDays: schoolCourseSelectedData?.bundleDays,
      });
    }
  }, [schoolCourseSelectedData]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditSchoolCourseValidationZProps>({
    resolver: zodResolver(editSchoolCourseValidationSchema),
    defaultValues: {
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setSchoolCourseData({
      schoolCourseId: "",
    });
    setSchoolCourseEditData({
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolCourseEditData.name);
    setValue("priceUnit", schoolCourseEditData.priceUnit / 100);
    setValue("priceBundle", schoolCourseEditData.priceBundle / 100);
    setValue("bundleDays", schoolCourseEditData.bundleDays);
  }, [schoolCourseEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.priceUnit,
      errors.priceBundle,
      errors.bundleDays,
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
  const handleEditSchool: SubmitHandler<
    EditSchoolCourseValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // EDIT SCHOOL COURSE FUNCTION
    const editSchoolCourse = async () => {
      try {
        await updateDoc(
          doc(db, "schoolCourses", schoolCourseData.schoolCourseId),
          {
            name: data.name,
            priceUnit: data.priceUnit,
            priceBundle: data.priceBundle,
            bundleDays: data.bundleDays,
          }
        );
        resetForm();
        toast.success(`${schoolCourseEditData.name} alterado com sucesso! 👌`, {
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

    // CHECKING IF SCHOOL COURSE EXISTS ON DATABASE
    const schoolCourse = schoolCourseDatabaseData.find(
      (schoolCourse) => schoolCourse.id === schoolCourseData.schoolCourseId
    );
    if (!schoolCourse) {
      // IF NOT EXISTS, RETURN ERROR
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
      editSchoolCourse();
    }
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${schoolCourseEditData.name}` : "Editar Modalidade"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchool)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.name
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
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setSchoolCourseData({
                ...schoolCourseData,
                schoolCourseId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions returnId dataType="schoolCourses" />
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
            {/* SCHOOL COURSE NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="name"
                className={
                  errors.name
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
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
                    ? "É necessário inserir o nome da Modalidade"
                    : "Insira o nome da Modalidade"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={schoolCourseEditData.name}
                onChange={(e) => {
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            {/* SCHOOL COURSE PRICE UNIT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="price"
                className={
                  errors.priceUnit
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Valor da aula avulsa:{" "}
              </label>
              <CurrencyInput
                name="price"
                placeholder={
                  errors.priceUnit
                    ? "É necessário inserir o valor mensal da aula avulsa"
                    : "Insira o valor mensal da aula avulsa"
                }
                defaultValue={schoolCourseEditData.priceUnit}
                decimalsLimit={2}
                decimalScale={2}
                prefix="R$"
                disableAbbreviations
                onValueChange={(value) =>
                  value
                    ? setSchoolCourseEditData({
                        ...schoolCourseEditData,
                        priceUnit: +value.replace(/\D/g, ""),
                      })
                    : null
                }
                className={
                  errors.priceUnit
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
                }
              />
            </div>

            {/* SCHOOL COURSE PRICE BUNDLE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="price"
                className={
                  errors.priceBundle
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Valor do pacote de aulas:{" "}
              </label>
              <CurrencyInput
                name="price"
                placeholder={
                  errors.priceBundle
                    ? "É necessário inserir o valor mensal do pacote de aulas"
                    : "Insira o valor mensal do pacote de aulas"
                }
                defaultValue={schoolCourseEditData.priceBundle}
                decimalsLimit={2}
                decimalScale={2}
                prefix="R$"
                disableAbbreviations
                onValueChange={(value) =>
                  value
                    ? setSchoolCourseEditData({
                        ...schoolCourseEditData,
                        priceBundle: +value.replace(/\D/g, ""),
                      })
                    : null
                }
                className={
                  errors.priceBundle
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
                }
              />
            </div>

            {/* SCHOOL COURSE BUNDLE DAYS */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="bundleDays"
                className={
                  errors.bundleDays
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Quantidade de aulas p/ semana no pacote:{" "}
              </label>
              <CurrencyInput
                name="bundleDays"
                placeholder={
                  errors.bundleDays
                    ? "É necessário inserir a quantidade de aulas p/ semana no pacote"
                    : "Insira a quantidade de aulas p/ semana no pacote"
                }
                defaultValue={schoolCourseEditData.bundleDays}
                decimalsLimit={0}
                disableAbbreviations
                onValueChange={(value) =>
                  value
                    ? setSchoolCourseEditData({
                        ...schoolCourseEditData,
                        bundleDays: +value.replace(/\D/g, ""),
                      })
                    : null
                }
                className={
                  errors.bundleDays
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
              />
            </div>

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
