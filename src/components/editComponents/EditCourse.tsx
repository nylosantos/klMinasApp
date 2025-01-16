/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolCourseValidationSchema } from "../../@types/zodValidation";
import {
  EditSchoolCourseValidationZProps,
  SchoolCourseSearchProps
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import EditCourseForm from "../formComponents/EditCourseForm";

export function EditCourse() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolCourseDatabaseData,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL COURSE DATA
  const [schoolCourseData, setSchoolCourseData] = useState({
    schoolCourseId: "",
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

  // REACT HOOK FORM SETTINGS
  const {
    reset,
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
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });
  };

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

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit && schoolCourseSelectedData
          ? `Editando ${schoolCourseSelectedData.name}`
          : "Editar Modalidade"}
      </h1>

      <div
        className={`flex flex-col w-full gap-2 ${
          isEdit ? "pt-4 px-4" : "p-4"
        } rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2`}
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
            <SelectOptions returnId dataType="schoolCourses" showAllCourses />
          </select>
        </div>

        {isSelected && (
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
        )}

        {isEdit && schoolCourseSelectedData && (
          <EditCourseForm
            isEdit
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setIsEdit={setIsEdit}
            schoolCourseSelectedData={schoolCourseSelectedData}
            onClose={resetForm}
          />
        )}
      </div>
    </div>
  );
}
