/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolClassValidationSchema } from "../../@types/zodValidation";
import {
  EditSchoolClassValidationZProps,
  SchoolClassSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { secureUpdateDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditClass() {
  // GET GLOBAL DATA
  const { schoolClassDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHOOL CLASS DATA
  const [schoolClassData, setSchoolClassData] = useState({
    schoolClassId: "",
  });

  // SCHOOL CLASS EDIT DATA
  const [schoolClassEditData, setSchoolClassEditData] =
    useState<EditSchoolClassValidationZProps>({
      name: "",
      schoolStageId: "",
    });

  // SCHOOL CLASS SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS EDIT STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (schoolClassSelectedData !== undefined) {
      setIsSelected(true);
      setIsEdit(false);
      setSchoolClassEditData({
        ...schoolClassEditData,
        name: schoolClassSelectedData.name,
        schoolStageId: schoolClassSelectedData.schoolStageId,
      });
    }
  }, [schoolClassSelectedData]);

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolClassData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === schoolClassData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [schoolClassData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditSchoolClassValidationZProps>({
    resolver: zodResolver(editSchoolClassValidationSchema),
    defaultValues: {
      name: "",
      schoolStageId: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setSchoolClassEditData({
      name: "",
      schoolStageId: "",
    });
    setSchoolClassData({
      schoolClassId: "",
    });
    setIsSelected(false);
    setIsEdit(false);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolClassEditData.name);
    setValue("schoolStageId", schoolClassEditData.schoolStageId);
  }, [schoolClassEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name, errors.schoolStageId];
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
  const handleEditClass: SubmitHandler<
    EditSchoolClassValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // EDIT SCHOOL CLASS FUNCTION
    const editSchoolClass = async () => {
      try {
        await secureUpdateDoc(
          doc(db, "schoolClasses", schoolClassData.schoolClassId),
          {
            name: data.name,
            schoolStageId: data.schoolStageId,
          }
        );
        resetForm();
        toast.success(`${schoolClassEditData.name} alterado com sucesso! 👌`, {
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
    const schoolClass = schoolClassDatabaseData.find(
      (schoolClass) => schoolClass.id === schoolClassData.schoolClassId
    );
    if (!schoolClass) {
      // IF NOT EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(`Ano escolar não existe no banco de dados...... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      // IF EXISTS, EDIT
      editSchoolClass();
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${schoolClassEditData.name}` : "Editar Ano Escolar"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditClass)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Ano Escolar:{" "}
          </label>
          <select
            id="schoolClassSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setSchoolClassData({
                ...schoolClassData,
                schoolClassId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions returnId dataType="schoolClasses" />
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

        {isEdit && (
          <>
            {/* SCHOOL CLASS NAME */}
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
                    ? "É necessário inserir o nome do Ano Escolar"
                    : "Insira o nome do Ano Escolar"
                }
                className={
                  errors.name
                    ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={schoolClassEditData.name}
                onChange={(e) => {
                  setSchoolClassEditData({
                    ...schoolClassEditData,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            {/* SCHOOL CLASS STAGE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="schoolStage"
                className={
                  errors.schoolStageId
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Etapa Escolar:{" "}
              </label>
              <div className="flex w-3/4 px-2 py-1 gap-10 justify-start items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={
                      schoolClassEditData.schoolStageId === "1SSEI"
                        ? true
                        : false
                    }
                    className="text-klGreen-500 dark:text-klGreen-500 border-none"
                    value="1SSEI"
                    name="Ensino Infantil"
                    onChange={() =>
                      setSchoolClassEditData({
                        ...schoolClassEditData,
                        schoolStageId: "1SSEI",
                      })
                    }
                  />{" "}
                  Ensino Infantil
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={
                      schoolClassEditData.schoolStageId === "2SSEF"
                        ? true
                        : false
                    }
                    className="text-klGreen-500 dark:text-klGreen-500 border-none"
                    value="2SSEF"
                    name="Ensino Fundamental"
                    onChange={() =>
                      setSchoolClassEditData({
                        ...schoolClassEditData,
                        schoolStageId: "2SSEF",
                      })
                    }
                  />{" "}
                  Ensino Fundamental
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={
                      schoolClassEditData.schoolStageId === "3SSEM"
                        ? true
                        : false
                    }
                    className="text-klGreen-500 dark:text-klGreen-500 border-none"
                    value="3SSEM"
                    name="Ensino Médio"
                    onChange={() =>
                      setSchoolClassEditData({
                        ...schoolClassEditData,
                        schoolStageId: "3SSEM",
                      })
                    }
                  />{" "}
                  Ensino Médio
                </label>
              </div>
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
        )}
      </form>
    </div>
  );
}
