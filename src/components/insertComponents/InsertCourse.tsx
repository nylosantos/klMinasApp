/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input-field";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { CreateCourseValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createCourseValidationSchema } from "../../@types/zodValidation";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCourse() {
  // SCHOOL COURSE DATA
  const [courseData, setCourseData] = useState<CreateCourseValidationZProps>({
    name: "",
    price: 0,
    confirmInsert: false,
  });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseValidationZProps>({
    resolver: zodResolver(createCourseValidationSchema),
    defaultValues: {
      name: "",
      price: 0,
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setCourseData({
      name: "",
      price: 0,
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", courseData.name);
    setValue("price", courseData.price / 100);
    setValue("confirmInsert", courseData.confirmInsert);
  }, [courseData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name, errors.price, errors.confirmInsert];
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
  const handleAddCourse: SubmitHandler<CreateCourseValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar a modalidade ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ADD SCHOOL COURSE FUNCTION
    const addCourse = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "schoolCourses", commonId), {
          id: commonId,
          name: data.name,
          price: data.price,
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`${data.name} criado com sucesso! 👌`, {
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

    // CHECKING IF SCHOOL COURSE EXISTS ON DATABASE
    const courseRef = collection(db, "schoolCourses");
    const q = query(courseRef, where("name", "==", data.name));
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
          toast.error(`${data.name} já existe no nosso banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF NOT EXISTS, CREATE
        addCourse();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Curso / Aula</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddCourse)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHOOL COURSE NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Modalidade:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o nome do Curso"
                : "Insira o nome do Curso"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={courseData.name}
            onChange={(e) => {
              setCourseData({ ...courseData, name: e.target.value });
            }}
          />
        </div>

        {/* SCHOOL COURSE PRICE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="price"
            className={
              errors.price
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Valor da Mensalidade:{" "}
          </label>
          <CurrencyInput
            name="price"
            placeholder={
              errors.price
                ? "É necessário inserir o valor mensal do Curso / Aula"
                : "Insira o valor mensal do Curso / Aula"
            }
            defaultValue={0}
            decimalsLimit={2}
            decimalScale={2}
            prefix="R$"
            disableAbbreviations
            onValueChange={(value, name) =>
              value
                ? setCourseData({
                    ...courseData,
                    price: +value.replace(/\D/g, ""),
                  })
                : null
            }
            className={
              errors.price
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
          />
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-green-500 dark:text-green-500 border-none"
            checked={courseData.confirmInsert}
            onChange={() => {
              setCourseData({
                ...courseData,
                confirmInsert: !courseData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmInsert"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {courseData.name
              ? `Confirmar criação da modalidade ${courseData.name}`
              : `Confirmar criação`}
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
            {!isSubmitting ? "Criar" : "Criando"}
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
