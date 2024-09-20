/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  doc, getFirestore, updateDoc
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolValidationSchema } from "../../@types/zodValidation";
import { EditSchoolValidationZProps, SchoolSearchProps } from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditSchool() {
  // GET GLOBAL DATA
  const { schoolDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHOOL DATA
  const [schoolData, setSchoolData] = useState({
    schoolId: "",
  });

  // SCHOOL EDIT DATA
  const [schoolEditData, setSchoolEditData] =
    useState<EditSchoolValidationZProps>({
      name: "",
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

  // SET SCHOOL NAME TO SCHOOL EDIT NAME
  useEffect(() => {
    if (schoolSelectedData) {
      setSchoolEditData({ ...schoolEditData, name: schoolSelectedData.name });
    }
  }, [schoolSelectedData]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
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
    setSchoolEditData({
      name: "",
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolEditData.name);
  }, [schoolEditData]);

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

  // SUBMIT DATA FUNCTION
  const handleEditSchool: SubmitHandler<EditSchoolValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // EDIT SCHOOL FUNCTION
    const editSchool = async () => {
      try {
        await updateDoc(doc(db, "schools", schoolData.schoolId), {
          name: data.name,
        });
        resetForm();
        toast.success(`${schoolEditData.name} alterado com sucesso! 👌`, {
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

    // CHECKING IF SCHOOL EXISTS ON DATABASE
    const schoolExists = schoolDatabaseData.find(
      (school) => school.id === schoolData.schoolId
    );
    if (!schoolExists) {
      // IF NOT EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(`Colégio não existe no banco de dados... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      // IF EXISTS, EDIT
      editSchool();
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
        {isEdit ? `Editando ${schoolEditData.name}` : "Editar Escola"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchool)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
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
            {/* SCHOOL NAME */}
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
                    ? "É necessário inserir o Nome da Escola"
                    : "Insira o nome da Escola"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={schoolEditData.name}
                onChange={(e) => {
                  setSchoolEditData({
                    ...schoolEditData,
                    name: e.target.value,
                  });
                }}
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
