/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { deleteClassValidationSchema } from "../zodValidation";
import { DeleteClassValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteClass() {
  // CLASS DATA
  const [schoolClassData, setSchoolClassData] =
    useState<DeleteClassValidationZProps>({
      schoolClassId: "",
      schoolClassName: "",
      schoolId: "",
      confirmDelete: false,
    });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GET SCHOOL CLASS DATA FUNCTION
  async function getSchoolClassData(id: string) {
    const classRef = collection(db, "schoolClasses");
    const q = query(classRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const schoolClassDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      schoolClassDataPromises.push(promise);
    });
    setSchoolClassData({
      ...schoolClassData,
      schoolClassName: schoolClassDataPromises[0].name,
      schoolClassId: id,
    });
  }

  // SCHOOL CLASSES ARRAY STATE
  const [schoolClassesData, setSchoolClassesData] = useState([]);

  // GET SCHOOL CLASS DATA FUNCTION
  async function getSchoolData(id: string) {
    setSchoolClassData({ ...schoolClassData, schoolId: id });
    const schoolRef = collection(db, "schoolClasses");
    const q = query(schoolRef, where("schoolId", "==", id));
    const querySnapshot = await getDocs(q);
    const schoolClassDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      schoolClassDataPromises.push(promise);
    });
    setSchoolClassesData(schoolClassDataPromises);
  }

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteClassValidationZProps>({
    resolver: zodResolver(deleteClassValidationSchema),
    defaultValues: {
      schoolClassId: "",
      schoolClassName: "",
      schoolId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setSchoolClassData({
      schoolClassId: "",
      schoolClassName: "",
      schoolId: "",
      confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolId", schoolClassData.schoolId);
    setValue("schoolClassId", schoolClassData.schoolClassId);
    setValue("schoolClassName", schoolClassData.schoolClassName);
    setValue("confirmDelete", schoolClassData.confirmDelete);
  }, [schoolClassData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolId,
      errors.schoolClassId,
      errors.schoolClassName,
      errors.confirmDelete,
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
  const handleAddClass: SubmitHandler<DeleteClassValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o Colégio... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF SCHOOL EXISTS ON DATABASE
    const schoolClassRef = collection(db, "curriculum");
    const q = query(
      schoolClassRef,
      where("schoolClass", "==", data.schoolClassName)
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF EXISTS, RETURN ERROR
      if (results.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Turma incluída em ${results.length} ${
              results.length === 1 ? "Currículo" : "Currículos"
            }, exclua ou altere primeiramente ${
              results.length === 1 ? "o Currículo" : "os Currículos"
            } e depois exclua a ${data.schoolClassName}... ❕`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          )
        );
      } else {
        // IF NO EXISTS, DELETE
        const deleteSchoolClass = async () => {
          try {
            await deleteDoc(doc(db, "schoolClasses", data.schoolClassId));
            resetForm();
            toast.success(`Turma excluída com sucesso! 👌`, {
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
        deleteSchoolClass();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Excluir Turma</h1>
      <form
        onSubmit={handleSubmit(handleAddClass)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.schoolId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              getSchoolData(e.target.value);
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.schoolClassId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            disabled={schoolClassData.schoolId ? false : true}
            className={
              schoolClassData.schoolId
                ? errors.schoolClassId
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              getSchoolClassData(e.target.value);
            }}
          >
            {schoolClassData.schoolId ? (
              <>
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                {schoolClassesData.map((option: any) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </>
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver as turmas disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none "
            checked={schoolClassData.confirmDelete}
            onChange={() => {
              setSchoolClassData({
                ...schoolClassData,
                confirmDelete: !schoolClassData.confirmDelete,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {schoolClassData.schoolClassName
              ? `Confirmar exclusão da ${schoolClassData.schoolClassName}`
              : `Confirmar exclusão`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
      </form>
    </div>
  );
}
