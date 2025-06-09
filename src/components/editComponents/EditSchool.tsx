/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolValidationSchema } from "../../@types/zodValidation";
import { EditSchoolValidationZProps, SchoolSearchProps } from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import EditSchoolForm from "../formComponents/EditSchoolForm";

export function EditSchool() {
  // GET GLOBAL DATA
  const { schoolDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHOOL DATA
  const [schoolData, setSchoolData] = useState({
    schoolId: "",
  });

  // SCHOOL SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setIsEdit(false);
    if (schoolData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === schoolData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolData.schoolId]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    reset,
    formState: { errors },
  } = useForm<EditSchoolValidationZProps>({
    resolver: zodResolver(editSchoolValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setSchoolData({
      schoolId: "",
    });
  };

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name];
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
        {isEdit && schoolSelectedData
          ? `Editando ${schoolSelectedData.name}`
          : "Editar Escola"}
      </h1>

      <div
        className={`flex flex-col w-full gap-2 ${
          isEdit ? "pt-4 px-4" : "p-4"
        } rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2`}
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.name
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
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setSchoolData({
                ...schoolData,
                schoolId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions returnId dataType="schools" />
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

        {isEdit && schoolSelectedData && (
          <>
            <EditSchoolForm
              isEdit
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              setIsEdit={setIsEdit}
              schoolSelectedData={schoolSelectedData}
              onClose={resetForm}
            />
          </>
        )}
      </div>
    </div>
  );
}
