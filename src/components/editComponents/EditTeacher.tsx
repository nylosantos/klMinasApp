/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editTeacherValidationSchema } from "../../@types/zodValidation";
import { EditTeacherValidationZProps, TeacherSearchProps } from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import EditTeacherForm from "../formComponents/EditTeacherForm";

export function EditTeacher() {
  // GET GLOBAL DATA
  const { teacherDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // TEACHER DATA
  const [teacherData, setTeacherData] = useState({
    teacherId: "",
  });

  // TEACHER EDIT DATA
  // const [teacherEditData, setTeacherEditData] =
  //   useState<EditTeacherValidationZProps>({
  //     name: "",
  //     email: "",
  //     phone: "",
  //   });

  // TEACHER SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // TEACHER SELECTED STATE DATA
  const [teacherSelectedData, setTeacherSelectedData] =
    useState<TeacherSearchProps>();

  // SET TEACHER SELECTED STATE WHEN SELECT TEACHER
  useEffect(() => {
    setIsEdit(false);
    if (teacherData.teacherId !== "") {
      setTeacherSelectedData(
        teacherDatabaseData.find(({ id }) => id === teacherData.teacherId)
      );
    } else {
      setTeacherSelectedData(undefined);
    }
  }, [teacherData.teacherId]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    reset,
    formState: { errors },
  } = useForm<EditTeacherValidationZProps>({
    resolver: zodResolver(editTeacherValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setTeacherData({
      teacherId: "",
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
        {isEdit && teacherSelectedData
          ? `Editando Professor ${teacherSelectedData.name}`
          : "Editar Professor"}
      </h1>

      <div
        className={`flex flex-col w-full gap-2 ${
          isEdit ? "pt-4 px-4" : "p-4"
        } rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2`}
      >
        {/* TEACHER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Professor:{" "}
          </label>
          <select
            id="teacherSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="teacherSelect"
            onChange={(e) => {
              setTeacherData({
                ...teacherData,
                teacherId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions returnId dataType="teachers" />
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

        {isEdit && teacherSelectedData && (
          <EditTeacherForm
            isEdit
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setIsEdit={setIsEdit}
            teacherSelectedData={teacherSelectedData}
            onClose={resetForm}
          />
        )}
      </div>
    </div>
  );
}
