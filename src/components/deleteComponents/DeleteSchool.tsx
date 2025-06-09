/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteSchoolValidationSchema } from "../../@types/zodValidation";
import {
  DeleteSchoolValidationZProps,
  SchoolSearchProps
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

export function DeleteSchool() {
  // GET GLOBAL DATA
  const {
    schoolDatabaseData,
    isSubmitting,
    handleDeleteSchool,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL DATA
  const [schoolData, setSchoolData] = useState<DeleteSchoolValidationZProps>({
    schoolId: "",
    schoolName: "",
    // confirmDelete: false,
  });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolData.schoolId !== "") {
      setIsSelected(true);
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === schoolData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setSchoolData({
        ...schoolData,
        schoolName: schoolSelectedData!.name,
      });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING AND SELECTED STATE
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteSchoolValidationZProps>({
    resolver: zodResolver(deleteSchoolValidationSchema),
    defaultValues: {
      schoolId: "",
      schoolName: "",
      // confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setSchoolData({
      schoolId: "",
      schoolName: "",
      // confirmDelete: false,
    });
    setIsSelected(false);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolId", schoolData.schoolId);
    setValue("schoolName", schoolData.schoolName);
    // setValue("confirmDelete", schoolData.confirmDelete);
  }, [schoolData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolId,
      errors.schoolName,
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
  const handleSubmitDeleteSchool: SubmitHandler<
    DeleteSchoolValidationZProps
  > = async (data) => {
    handleDeleteSchool(data.schoolId, resetForm);
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Escola</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleSubmitDeleteSchool)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.schoolId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setSchoolData({ ...schoolData, schoolId: e.target.value });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {isSelected ? (
          <>
            {/** CHECKBOX CONFIRM DELETE */}
            {/* <div className="flex justify-center items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="confirmDelete"
                className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                checked={schoolData.confirmDelete}
                onChange={() => {
                  setSchoolData({
                    ...schoolData,
                    confirmDelete: !schoolData.confirmDelete,
                  });
                }}
              />
              <label htmlFor="confirmDelete" className="text-sm">
                {schoolData.schoolName
                  ? `Confirmar exclusão do ${schoolData.schoolName}`
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
        ) : null}
      </form>
    </div>
  );
}
