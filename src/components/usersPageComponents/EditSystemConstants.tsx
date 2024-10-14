/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { toast, ToastContainer } from "react-toastify";
import {
  EditSystemConstantsValidationZProps,
  SystemConstantsSearchProps,
} from "../../@types";
import CurrencyInput from "react-currency-input-field";
import { SubmitHandler, useForm } from "react-hook-form";
import { editSystemConstantsValidationSchema } from "../../@types/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function EditSystemConstants() {
  // GET GLOBAL DATA
  const { isSubmitting, systemConstantsDatabaseData, setIsSubmitting } =
    useContext(GlobalDataContext) as GlobalDataContextType;

  const [systemConstantsEditData, setSystemConstantsEditData] =
    useState<SystemConstantsSearchProps>({
      id: "",
      enrolmentFee: 0,
      enrolmentFeeDiscount: 0,
      systemSignInClosed: false,
      systemSignUpClosed: false,
    });

  useEffect(() => {
    setSystemConstantsEditData(systemConstantsDatabaseData[0]);
  }, [systemConstantsDatabaseData]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditSystemConstantsValidationZProps>({
    resolver: zodResolver(editSystemConstantsValidationSchema),
    defaultValues: {
      id: systemConstantsDatabaseData[0]
        ? systemConstantsDatabaseData[0].id
        : "",
      enrolmentFee: systemConstantsDatabaseData[0]
        ? systemConstantsDatabaseData[0].enrolmentFee
        : 0,
      enrolmentFeeDiscount: systemConstantsDatabaseData[0]
        ? systemConstantsDatabaseData[0].enrolmentFeeDiscount
        : 0,
      systemSignInClosed: false,
      systemSignUpClosed: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    setSystemConstantsEditData({
      id: systemConstantsDatabaseData[0].id,
      enrolmentFee: systemConstantsDatabaseData[0].enrolmentFee,
      enrolmentFeeDiscount: systemConstantsDatabaseData[0].enrolmentFeeDiscount,
      systemSignInClosed: false,
      systemSignUpClosed: false,
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("enrolmentFee", systemConstantsEditData.enrolmentFee);
    setValue(
      "enrolmentFeeDiscount",
      systemConstantsEditData!.enrolmentFeeDiscount
    );
    setValue("systemSignInClosed", systemConstantsEditData.systemSignInClosed);
    setValue("systemSignUpClosed", systemConstantsEditData.systemSignUpClosed);
  }, [systemConstantsEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.enrolmentFee,
      errors.enrolmentFeeDiscount,
      errors.systemSignInClosed,
      errors.systemSignUpClosed,
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
  const handleEditSchool: SubmitHandler<
    EditSystemConstantsValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // EDIT SYSTEM CONSTANTS FUNCTION
    const editSystemConstants = async () => {
      try {
        await updateDoc(
          doc(db, "systemConstants", systemConstantsEditData!.id),
          {
            enrolmentFee: data.enrolmentFee,
            enrolmentFeeDiscount: data.enrolmentFeeDiscount,
            systemSignInClosed: data.systemSignInClosed,
            systemSignUpClosed: data.systemSignUpClosed,
          }
        );
        resetForm();
        toast.success(`Dados alterados com sucesso! 👌`, {
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

    editSystemConstants();
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchool)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* ENROLMENT FEE VALUE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="enrolmentFee"
            className={
              errors.enrolmentFee
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Valor da matrícula:{" "}
          </label>
          <CurrencyInput
            name="enrolmentFee"
            placeholder={
              errors.enrolmentFee
                ? "É necessário inserir o valor da matrícula"
                : "Insira o valor da matrícula"
            }
            defaultValue={
              systemConstantsDatabaseData[0]
                ? systemConstantsDatabaseData[0].enrolmentFee
                : 0
            }
            decimalsLimit={2}
            decimalScale={2}
            prefix="R$"
            disableAbbreviations
            onValueChange={(value) =>
              value &&
              systemConstantsEditData &&
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                enrolmentFee: +value.replace(/\D/g, ""),
              })
            }
            className={
              errors.enrolmentFee
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
          />
        </div>

        {/* ENROLMENT FEE DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="enrolmentFeeDiscount"
            className={
              errors.enrolmentFeeDiscount
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Valor da aula matrícula com desconto:{" "}
          </label>
          <CurrencyInput
            name="enrolmentFeeDiscount"
            placeholder={
              errors.enrolmentFeeDiscount
                ? "É necessário inserir o valor da matrícula com desconto"
                : "Insira o valor da matrícula com desconto"
            }
            defaultValue={
              systemConstantsDatabaseData[0]
                ? systemConstantsDatabaseData[0].enrolmentFeeDiscount
                : 0
            }
            decimalsLimit={2}
            decimalScale={2}
            prefix="R$"
            disableAbbreviations
            onValueChange={(value) =>
              value &&
              systemConstantsEditData &&
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                enrolmentFeeDiscount: +value.replace(/\D/g, ""),
              })
            }
            className={
              errors.enrolmentFeeDiscount
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
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
      </form>
    </div>
  );
}
