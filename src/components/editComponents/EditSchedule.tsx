/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editScheduleValidationSchema } from "../../@types/zodValidation";
import {
  EditScheduleValidationZProps,
  ScheduleSearchProps,
  SchoolSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import EditScheduleForm from "../formComponents/EditScheduleForm";

export function EditSchedule() {
  // GET GLOBAL DATA
  const { schoolDatabaseData, scheduleDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHEDULE DATA
  const [scheduleData, setScheduleData] = useState({
    scheduleId: "",
    schoolId: "",
  });

  // SCHEDULE EDIT DATA
  // const [scheduleEditData, setScheduleEditData] =
  //   useState<EditScheduleValidationZProps>({
  //     name: "",
  //     transitionStart: "",
  //     transitionEnd: "",
  //     classStart: "",
  //     classEnd: "",
  //     exit: "",
  //   });

  // SCHEDULE SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setScheduleSelectedData(undefined);
    if (scheduleData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === scheduleData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE SELECTED STATE DATA
  const [scheduleSelectedData, setScheduleSelectedData] =
    useState<ScheduleSearchProps>();

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    if (scheduleSelectedData !== undefined) {
      setIsSelected(true);
      setIsEdit(false);
    }
  }, [scheduleSelectedData]);

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (scheduleData.scheduleId !== "") {
      setScheduleSelectedData(
        scheduleDatabaseData.find(({ id }) => id === scheduleData.scheduleId)
      );
    } else {
      setScheduleSelectedData(undefined);
    }
  }, [scheduleData.scheduleId]);

  // RESET SCHEDULE SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [scheduleData.schoolId]);
  // -------------------------- END OF SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    reset,
    formState: { errors },
  } = useForm<EditScheduleValidationZProps>({
    resolver: zodResolver(editScheduleValidationSchema),
    defaultValues: {
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setScheduleData({
      scheduleId: "",
      schoolId: "",
    });
    reset();
  };

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.transitionStart,
      errors.transitionEnd,
      errors.classStart,
      errors.classEnd,
      errors.exit,
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
        {isEdit && scheduleSelectedData
          ? `Editando ${scheduleSelectedData.name}`
          : "Editar Horário"}
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
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setScheduleData({
                ...scheduleData,
                schoolId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* SCHEDULE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="scheduleSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Horário:{" "}
          </label>
          <select
            id="scheduleSelect"
            defaultValue={" -- select an option -- "}
            disabled={scheduleData.schoolId ? false : true}
            className={
              scheduleData.schoolId
                ? errors.name
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="scheduleSelect"
            onChange={(e) => {
              setScheduleData({
                ...scheduleData,
                scheduleId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              dataType="schedules"
              schoolId={scheduleData.schoolId}
            />
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

        {isEdit && scheduleSelectedData && (
          <EditScheduleForm
            isEdit
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setIsEdit={setIsEdit}
            scheduleSelectedData={scheduleSelectedData}
            onClose={resetForm}
          />
        )}
      </div>
    </div>
  );
}
