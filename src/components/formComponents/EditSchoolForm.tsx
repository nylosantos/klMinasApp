/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../db/Firebase";
import { EditSchoolValidationZProps, SchoolSearchProps } from "../../@types";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editSchoolValidationSchema } from "../../@types/zodValidation";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { EditDashboardSchoolButton } from "../layoutComponents/EditDashboardSchoolButton";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface EditSchoolFormProps {
  schoolSelectedData: SchoolSearchProps;
  isSubmitting: boolean;
  isEdit: boolean;
  modal?: boolean;
  onClose?: () => void;
  setModal?: (option: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  handleDeleteSchool?: () => void;
}

export default function EditSchoolForm({
  schoolSelectedData,
  isSubmitting,
  isEdit,
  modal = false,
  setModal,
  onClose,
  setIsSubmitting,
  setIsEdit,
  handleDeleteSchool,
}: EditSchoolFormProps) {
  // GET GLOBAL DATA
  const { schoolDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHOOL EDIT DATA
  const [schoolEditData, setSchoolEditData] =
    useState<EditSchoolValidationZProps>({
      name: "",
    });

  // SET SCHOOL NAME TO SCHOOL EDIT NAME
  useEffect(() => {
    if (schoolSelectedData) {
      setSchoolEditData({ ...schoolEditData, name: schoolSelectedData.name });
    }
  }, [schoolSelectedData]);

  function resetSchoolDataFunction() {
    setSchoolEditData({
      name: schoolSelectedData.name,
    });
    setIsEdit(!isEdit);
  }

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
    setSchoolEditData({
      name: "",
    });
    onClose && onClose();
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
        await updateDoc(doc(db, "schools", schoolSelectedData.id), {
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
      (school) => school.id === schoolSelectedData.id
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
    <div
      className={`w-full ${
        modal ? "max-w-7xl bg-white/80 dark:bg-klGreen-500/60 rounded-xl" : ""
      } `}
    >
      {modal && (
        <div className="flex items-center justify-center text-md/snug text-gray-100 bg-klGreen-500/70 dark:bg-klGreen-500/70 rounded-t-xl uppercase p-4">
          <p className="flex absolute z-10">
            {!isEdit ? `Detalhes` : `Editando`} - {schoolSelectedData.name}
          </p>
          <div className="flex relative justify-end px-2 w-full z-50">
            <EditDashboardSchoolButton
              isEdit={isEdit}
              handleDeleteSchool={handleDeleteSchool && handleDeleteSchool}
              resetSchoolData={resetSchoolDataFunction}
              setIsEdit={setIsEdit}
              setModal={setModal && setModal}
            />
          </div>
        </div>
      )}
      <>
        {/* FORM */}
        <form
          onSubmit={handleSubmit(handleEditSchool)}
          className="flex flex-col w-full gap-2 p-4 rounded-xl mt-2"
        >
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
              disabled={!isEdit ? true : isSubmitting}
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
          <div className="flex gap-2 mt-4 justify-center">
            {/* SUBMIT BUTTON */}
            {isEdit && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
              >
                {!isSubmitting ? "Salvar" : "Salvando"}
              </button>
            )}

            {/* RESET BUTTON */}
            <button
              type="reset"
              className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
              disabled={isSubmitting}
              onClick={() => {
                resetForm();
              }}
            >
              {isSubmitting ? "Aguarde" : !isEdit ? "Fechar" : "Cancelar"}
            </button>
          </div>
        </form>
      </>
    </div>
  );
}
