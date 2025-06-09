/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteSchoolCourseValidationSchema } from "../../@types/zodValidation";
import {
  DeleteSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { NumericFormat } from "react-number-format";

export function DeleteCourse() {
  // GET GLOBAL DATA
  const { schoolCourseDatabaseData, isSubmitting, handleDeleteCourse } =
    useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL COURSE DATA
  const [schoolCourseData, setSchoolCourseData] =
    useState<DeleteSchoolCourseValidationZProps>({
      schoolCourseId: "",
      schoolCourseName: "",
      priceUnit: 0,
      priceBundle: 0,
      bundleDays: 0,
      // confirmDelete: false,
    });

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseData.schoolCourseId !== "") {
      setIsSelected(true);
      setSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
          ({ id }) => id === schoolCourseData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [schoolCourseData.schoolCourseId]);

  // SET SCHOOL COURSE NAME WITH SCHOOL COURSE SELECTED DATA WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseSelectedData) {
      setSchoolCourseData({
        ...schoolCourseData,
        schoolCourseName: schoolCourseSelectedData.name,
        priceUnit: schoolCourseSelectedData.priceUnit,
        priceBundle: schoolCourseSelectedData.priceBundle,
        bundleDays: schoolCourseSelectedData.bundleDays,
      });
    }
  }, [schoolCourseSelectedData]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  // const [isSubmitting, setIsSubmitting] = useState(false);
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
      priceUnit: 0,
      priceBundle: 0,
      bundleDays: 0,
      // confirmDelete: false,
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
      priceUnit: 0,
      priceBundle: 0,
      bundleDays: 0,
      // confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolCourseId", schoolCourseData.schoolCourseId);
    setValue("schoolCourseName", schoolCourseData.schoolCourseName);
    setValue("priceUnit", schoolCourseData.priceUnit);
    setValue("priceBundle", schoolCourseData.priceBundle);
    setValue("bundleDays", schoolCourseData.bundleDays);
    // setValue("confirmDelete", schoolCourseData.confirmDelete);
  }, [schoolCourseData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolCourseId,
      errors.priceUnit,
      errors.priceBundle,
      errors.bundleDays,
      // errors.confirmDelete,
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
  const handleDeleteSchoolCourse: SubmitHandler<
    DeleteSchoolCourseValidationZProps
  > = async (data) => {
    handleDeleteCourse(data.schoolCourseId, resetForm);
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setSchoolCourseData({
                ...schoolCourseData,
                schoolCourseId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schoolCourses" />
          </select>
        </div>

        {isSelected && (
          <>
            <div className="flex flex-col pt-2 pb-6 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
              {/* DETAILS TITLE */}
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Dados da modalidade a ser excluída:
              </h1>

              {/* SCHOOL COURSE NAME */}
              <div className="flex gap-2 items-center">
                <label htmlFor="name" className="w-1/4 text-right">
                  Nome:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  disabled
                  className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={schoolCourseData.schoolCourseName}
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
                  Mensalidade 1x por semana:{" "}
                </label>
                <NumericFormat
                  disabled
                  value={schoolCourseData.priceUnit}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix={"R$ "}
                  className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
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
                  Mensalidade do pacote de aulas:{" "}
                </label>
                <NumericFormat
                  disabled
                  value={schoolCourseData.priceBundle}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix={"R$ "}
                  className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
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
                  Número de aulas por semana no pacote:{" "}
                </label>
                <NumericFormat
                  disabled
                  value={schoolCourseData.bundleDays}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale
                  className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                />
              </div>
            </div>

            {/** CHECKBOX CONFIRM DELETE */}
            {/* <div className="flex justify-center items-center gap-2 mt-6">
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
              <label htmlFor="confirmDelete" className="text-sm">
                {schoolCourseData.schoolCourseName
                  ? `Confirmar exclusão de ${schoolCourseData.schoolCourseName}`
                  : `Confirmar exclusão`}
              </label>
            </div> */}

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
        )}
      </form>
    </div>
  );
}
