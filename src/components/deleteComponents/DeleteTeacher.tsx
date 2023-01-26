/* eslint-disable react-hooks/exhaustive-deps */
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
  where,
} from "firebase/firestore";

import { deleteTeacherValidationSchema } from "../../@types/zodValidation";
import { DeleteTeacherValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteTeacher() {
  // TEACHER DATA
  const [teacherData, setTeacherData] = useState<DeleteTeacherValidationZProps>(
    {
      teacherId: "",
      teacherName: "",
      confirmDelete: false,
    }
  );

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GET TEACHER DATA FUNCTION
  async function getTeacherData(id: string) {
    const teacherRef = collection(db, "teachers");
    const q = query(teacherRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const teacherDataPromises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      teacherDataPromises.push(promise);
    });
    setTeacherData({
      ...teacherData,
      teacherName: teacherDataPromises[0].name,
      teacherId: id,
      confirmDelete: false,
    });
  }

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteTeacherValidationZProps>({
    resolver: zodResolver(deleteTeacherValidationSchema),
    defaultValues: {
      teacherId: "",
      teacherName: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setTeacherData({
      teacherId: "",
      teacherName: "",
      confirmDelete: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("teacherId", teacherData.teacherId);
    setValue("teacherName", teacherData.teacherName);
    setValue("confirmDelete", teacherData.confirmDelete);
  }, [teacherData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.teacherId,
      errors.teacherName,
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
  const handleDeleteTeacher: SubmitHandler<
    DeleteTeacherValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o Professor ${data.teacherName}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF TEACHER EXISTS ON DATABASE
    const teacherRef = collection(db, "curriculum");
    const q = query(teacherRef, where("teacher", "==", data.teacherName));
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
            `Professor incluído em ${results.length} ${
              results.length === 1 ? "Currículo" : "Currículos"
            }, exclua ou altere primeiramente ${
              results.length === 1 ? "o Currículo" : "os Currículos"
            } e depois exclua o Professor ${data.teacherName}... ❕`,
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
        const deleteTeacher = async () => {
          try {
            await deleteDoc(doc(db, "teachers", data.teacherId));
            resetForm();
            toast.success(`Professor excluído com sucesso! 👌`, {
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
          } finally {
            resetForm();
          }
        };
        deleteTeacher();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Excluir Professor</h1>
      <form
        onSubmit={handleSubmit(handleDeleteTeacher)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* TEACHER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherSelect"
            className={
              errors.teacherId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Professor:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.teacherId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="teacherSelect"
            onChange={(e) => {
              getTeacherData(e.target.value);
            }}
          >
            <SelectOptions returnId dataType="teachers" />
          </select>
        </div>

        {/** CHECKBOX CONFIRM DELETE */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none "
            checked={teacherData.confirmDelete}
            onChange={() => {
              setTeacherData({
                ...teacherData,
                confirmDelete: !teacherData.confirmDelete,
              });
            }}
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {teacherData.teacherName
              ? `Confirmar exclusão de ${teacherData.teacherName}`
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
