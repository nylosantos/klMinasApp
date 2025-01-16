/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { app } from "../../db/Firebase";
import { CreateCourseValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createCourseValidationSchema } from "../../@types/zodValidation";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { NumericFormat } from "react-number-format";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCourse() {
  // GET GLOBAL DATA
  const { schoolCourseDatabaseData, page, userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHOOL COURSE DATA
  const [courseData, setCourseData] = useState<CreateCourseValidationZProps>({
    name: "",
    priceUnit: 0,
    priceBundle: 0,
    bundleDays: 0,
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
      priceUnit: 0,
      priceBundle: 0,
      bundleDays: 0,
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setCourseData({
      name: "",
      priceUnit: 0,
      priceBundle: 0,
      bundleDays: 0,
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", courseData.name);
    setValue("priceUnit", courseData.priceUnit / 100);
    setValue("priceBundle", courseData.priceBundle / 100);
    setValue("bundleDays", courseData.bundleDays);
    setValue("confirmInsert", courseData.confirmInsert);
  }, [courseData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.priceUnit,
      errors.priceBundle,
      errors.bundleDays,
      errors.confirmInsert,
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
  const handleAddCourse: SubmitHandler<CreateCourseValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (data.bundleDays < 2) {
      setIsSubmitting(false);
      return toast.error(
        `O número de aulas no pacote deve ser, no mínimo, 2... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

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
          priceUnit: data.priceUnit,
          priceBundle: data.priceBundle,
          bundleDays: data.bundleDays,
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
    const schoolCourseExist = schoolCourseDatabaseData.find(
      (schoolCourse) => schoolCourse.name === data.name
    );
    if (schoolCourseExist) {
      // IF EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(
          `${data.name} já existe no nosso banco de dados mané ... ❕`,
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
      // IF NOT EXISTS, CREATE
      addCourse();
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      {page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" && (
          <h1 className="font-bold text-2xl my-4">Adicionar Modalidade</h1>
        )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddCourse)}
        className={`flex flex-col w-full gap-2 rounded-xl ${
          page.show !== "Dashboard" &&
          userFullData &&
          userFullData.role !== "user"
            ? "bg-klGreen-500/20 dark:bg-klGreen-500/30 p-4 mt-2"
            : "pb-4 px-4 pt-2"
        }`}
      >
        {/* SCHOOL COURSE NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
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
                ? "É necessário inserir o nome da modalidade"
                : "Insira o nome da modalidade"
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

        {/* SCHOOL COURSE PRICE UNIT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="priceUnit"
            className={
              errors.priceUnit
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Mensalidade 1x por semana:{" "}
          </label>
          <NumericFormat
            placeholder={
              errors.priceUnit
                ? "É necessário inserir o valor mensal do pacote de Aulas"
                : "Insira o valor mensal do pacote de Aulas"
            }
            defaultValue={0}
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            prefix={"R$ "}
            onValueChange={(values) => {
              setCourseData({
                ...courseData,
                priceUnit: values.floatValue ?? 0,
              });
            }}
            className={
              errors.priceUnit
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
          />
        </div>

        {/* SCHOOL COURSE PRICE BUNDLE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="priceBundle"
            className={
              errors.priceBundle
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Mensalidade do pacote de aulas:{" "}
          </label>

          <NumericFormat
            placeholder={
              errors.priceBundle
                ? "É necessário inserir o valor mensal do pacote de Aulas"
                : "Insira o valor mensal do pacote de Aulas"
            }
            defaultValue={0}
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            prefix={"R$ "}
            onValueChange={(values) => {
              setCourseData({
                ...courseData,
                priceBundle: values.floatValue ?? 0,
              });
            }}
            className={
              errors.priceBundle
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
          />
        </div>

        {/* SCHOOL COURSE BUNDLE DAYS */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="bundleDays"
            className={
              errors.bundleDays
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Número de aulas por semana no pacote:{" "}
          </label>
          <input
            type="text"
            name="bundleDays"
            disabled={isSubmitting}
            className={
              errors.bundleDays
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            placeholder={
              errors.bundleDays
                ? "É necessário inserir o número de aulas contidas no pacote"
                : "Insira o número de aulas contidas no pacote"
            }
            value={courseData.bundleDays}
            onChange={(e) =>
              setCourseData({
                ...courseData,
                bundleDays: +e.target.value.replace(/[^\d]/g, ""),
              })
            }
          />
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={courseData.confirmInsert}
            onChange={() => {
              setCourseData({
                ...courseData,
                confirmInsert: !courseData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
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
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
