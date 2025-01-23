/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { toast } from "react-toastify";
import {
  EditSystemConstantsValidationZProps,
  SystemConstantsSearchProps,
} from "../../@types";
import { SubmitHandler, useForm } from "react-hook-form";
import { editSystemConstantsValidationSchema } from "../../@types/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../db/Firebase";
import { NumericFormat } from "react-number-format";
import Switch from "react-switch";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function EditSystemConstants() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    systemConstantsDb,
    systemConstantsDbLoading,
    systemConstantsDbError,
    userFullData,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const [systemConstantsData, setSystemConstantsData] =
    useState<SystemConstantsSearchProps>({
      id: "",
      enrolmentFee: 0,
      enrolmentFeeDiscount: 0,
      systemSignInClosed: false,
      systemSignUpClosed: false,
      customerFullName: "",
      customerShortName: "",
      year: "",
      employeeDiscountValue: 0,
      familyDiscountValue: 0,
      secondCourseDiscountValue: 0,
      standardPaymentDay: "",
    });

  const [systemConstantsEditData, setSystemConstantsEditData] =
    useState<SystemConstantsSearchProps>({
      id: "",
      enrolmentFee: 0,
      enrolmentFeeDiscount: 0,
      systemSignInClosed: false,
      systemSignUpClosed: false,
      customerFullName: "",
      customerShortName: "",
      year: "",
      employeeDiscountValue: 0,
      familyDiscountValue: 0,
      secondCourseDiscountValue: 0,
      standardPaymentDay: "",
    });

  // GET SYSTEM CONSTANTS DATABASE DATA
  useEffect(() => {
    setIsSubmitting(true);
    if (
      systemConstantsDb &&
      !systemConstantsDbLoading &&
      systemConstantsDbError === undefined &&
      userFullData
    ) {
      let foundedSystemConstants: SystemConstantsSearchProps =
        systemConstantsDb.find(
          (constants) => constants.year === new Date().getFullYear().toString()
        ) as SystemConstantsSearchProps;
      foundedSystemConstants = {
        ...foundedSystemConstants,
        employeeDiscountValue:
          100 - +foundedSystemConstants.employeeDiscountValue * 100,
        familyDiscountValue:
          100 - +foundedSystemConstants.familyDiscountValue * 100,
        secondCourseDiscountValue:
          100 - +foundedSystemConstants.secondCourseDiscountValue * 100,
      };
      if (foundedSystemConstants) {
        setSystemConstantsEditData(foundedSystemConstants);
        setSystemConstantsData(foundedSystemConstants);
      }
    }
    setIsSubmitting(false);
  }, [systemConstantsDb]);

  useEffect(() => {
    if (systemConstantsEditData.id === "") {
      setIsSubmitting(true);
    } else {
      setIsSubmitting(false);
    }
  }, [systemConstantsEditData]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditSystemConstantsValidationZProps>({
    resolver: zodResolver(editSystemConstantsValidationSchema),
    defaultValues: {
      id: systemConstantsData.id,
      enrolmentFee: systemConstantsData.enrolmentFee,
      enrolmentFeeDiscount: systemConstantsData.enrolmentFeeDiscount,
      systemSignInClosed: systemConstantsData.systemSignInClosed,
      systemSignUpClosed: systemConstantsData.systemSignUpClosed,
      customerFullName: systemConstantsData.customerFullName,
      customerShortName: systemConstantsData.customerShortName,
      year: systemConstantsData.year,
      employeeDiscountValue: systemConstantsData.employeeDiscountValue,
      familyDiscountValue: systemConstantsData.familyDiscountValue,
      secondCourseDiscountValue: systemConstantsData.secondCourseDiscountValue,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    setSystemConstantsEditData({
      id: systemConstantsData.id,
      enrolmentFee: systemConstantsData.enrolmentFee,
      enrolmentFeeDiscount: systemConstantsData.enrolmentFeeDiscount,
      systemSignInClosed: systemConstantsData.systemSignInClosed,
      systemSignUpClosed: systemConstantsData.systemSignUpClosed,
      customerFullName: systemConstantsData.customerFullName,
      customerShortName: systemConstantsData.customerShortName,
      year: systemConstantsData.year,
      employeeDiscountValue: systemConstantsData.employeeDiscountValue,
      familyDiscountValue: systemConstantsData.familyDiscountValue,
      secondCourseDiscountValue: systemConstantsData.secondCourseDiscountValue,
      standardPaymentDay: systemConstantsData.standardPaymentDay,
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("customerFullName", systemConstantsEditData.customerFullName);
    setValue("customerShortName", systemConstantsEditData.customerShortName);
    setValue("enrolmentFee", systemConstantsEditData.enrolmentFee);
    setValue(
      "enrolmentFeeDiscount",
      systemConstantsEditData!.enrolmentFeeDiscount
    );
    setValue("systemSignInClosed", systemConstantsEditData.systemSignInClosed);
    setValue("systemSignUpClosed", systemConstantsEditData.systemSignUpClosed);
    setValue("year", systemConstantsEditData.year);
    setValue(
      "employeeDiscountValue",
      systemConstantsEditData.employeeDiscountValue
    );
    setValue(
      "familyDiscountValue",
      systemConstantsEditData.familyDiscountValue
    );
    setValue(
      "secondCourseDiscountValue",
      systemConstantsEditData.secondCourseDiscountValue
    );
    setValue("standardPaymentDay", systemConstantsEditData.standardPaymentDay);
  }, [systemConstantsEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.enrolmentFee,
      errors.enrolmentFeeDiscount,
      errors.systemSignInClosed,
      errors.systemSignUpClosed,
      errors.customerFullName,
      errors.customerShortName,
      errors.year,
      errors.employeeDiscountValue,
      errors.familyDiscountValue,
      errors.secondCourseDiscountValue,
      errors.standardPaymentDay,
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

    if (+data.standardPaymentDay > 28) {
      toast.error("O dia padrão de pagamento não pode ser maior que 28", {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    // EDIT SYSTEM CONSTANTS FUNCTION
    const editSystemConstants = async () => {
      try {
        await updateDoc(doc(db, "systemConstants", systemConstantsData.id), {
          enrolmentFee: data.enrolmentFee,
          enrolmentFeeDiscount: data.enrolmentFeeDiscount,
          systemSignInClosed: data.systemSignInClosed,
          systemSignUpClosed: data.systemSignUpClosed,
          customerFullName: data.customerFullName,
          customerShortName: data.customerShortName,
          year: data.year,
          employeeDiscountValue: 1 - +data.employeeDiscountValue / 100,
          familyDiscountValue: 1 - +data.familyDiscountValue / 100,
          secondCourseDiscountValue: 1 - +data.secondCourseDiscountValue / 100,
          standardPaymentDay: data.standardPaymentDay,
        });
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

  useEffect(() => {
    console.log(systemConstantsEditData);
  }, [systemConstantsEditData]);

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchool)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* CUSTOMER FULL NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="customerFullName"
            className={
              errors.customerFullName
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Nome completo da Empresa:{" "}
          </label>
          <input
            type="text"
            name="customerFullName"
            disabled={isSubmitting}
            placeholder={
              errors.customerFullName
                ? "É necessário inserir o nome completo da Empresa"
                : "Insira o nome completo da Empresa"
            }
            className={
              errors.customerFullName
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={systemConstantsEditData.customerFullName}
            onChange={(e) => {
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                customerFullName: e.target.value,
              });
            }}
          />
        </div>

        {/* CUSTOMER SHORT NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="customerShortName"
            className={
              errors.customerShortName
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Nome abreviado da Empresa:{" "}
          </label>
          <input
            type="text"
            name="customerShortName"
            disabled={isSubmitting}
            placeholder={
              errors.customerShortName
                ? "É necessário inserir o nome abreviado da Empresa"
                : "Insira o nome abreviado da Empresa"
            }
            className={
              errors.customerShortName
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={systemConstantsEditData.customerShortName}
            onChange={(e) => {
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                customerShortName: e.target.value,
              });
            }}
          />
        </div>

        {/* SIGN IN SYSTEM CLOSED */}
        <label className="flex items-center cursor-pointer gap-2">
          <span className="w-1/4 text-right">Bloquear login no sistema?</span>
          <div className="w-3/4 py-1 flex">
            <Switch
              onChange={() =>
                setSystemConstantsEditData({
                  ...systemConstantsEditData,
                  systemSignInClosed:
                    !systemConstantsEditData.systemSignInClosed,
                })
              }
              checked={systemConstantsEditData.systemSignInClosed}
            />
          </div>
        </label>

        {/* SIGN UP SYSTEM CLOSED */}
        <label className="flex items-center cursor-pointer gap-2">
          <span className="w-1/4 text-right">
            Bloquear cadastro no sistema?
          </span>
          <div className="w-3/4 py-1 flex">
            <input
              type="checkbox"
              className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
              checked={systemConstantsEditData.systemSignUpClosed}
              onChange={() =>
                setSystemConstantsEditData({
                  ...systemConstantsEditData,
                  systemSignUpClosed:
                    !systemConstantsEditData.systemSignUpClosed,
                })
              }
            />
          </div>
        </label>

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
          <NumericFormat
            name="enrolmentFee"
            placeholder={
              errors.enrolmentFee
                ? "É necessário inserir o valor da matrícula"
                : "Insira o valor da matrícula"
            }
            value={systemConstantsEditData.enrolmentFee}
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            prefix={"R$ "}
            onValueChange={(values) =>
              systemConstantsEditData &&
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                enrolmentFee: values.floatValue ?? 0,
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
          <NumericFormat
            name="enrolmentFeeDiscount"
            placeholder={
              errors.enrolmentFeeDiscount
                ? "É necessário inserir o valor da matrícula com desconto"
                : "Insira o valor da matrícula com desconto"
            }
            value={systemConstantsEditData.enrolmentFeeDiscount}
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            prefix={"R$ "}
            onValueChange={(values) =>
              systemConstantsEditData &&
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                enrolmentFeeDiscount: values.floatValue ?? 0,
              })
            }
            className={
              errors.enrolmentFeeDiscount
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
          />
        </div>

        {/* EMPLOYEE DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label htmlFor="employeeDiscountValue" className="w-1/4 text-right">
            Desconto para funcionários:{" "}
          </label>
          <input
            type="text"
            name="employeeDiscountValue"
            className={
              errors.employeeDiscountValue
                ? "w-10 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            maxLength={2}
            value={systemConstantsEditData.employeeDiscountValue}
            onChange={(e) =>
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                employeeDiscountValue: +e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"),
              })
            }
          />
          <label htmlFor="employeeDiscountValue" className="w-1/4 text-left">
            %
          </label>
        </div>

        {/* FAMILY DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label htmlFor="familyDiscountValue" className="w-1/4 text-right">
            Desconto para familiares:{" "}
          </label>
          <input
            type="text"
            name="familyDiscountValue"
            className={
              errors.familyDiscountValue
                ? "w-10 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            maxLength={2}
            value={systemConstantsEditData.familyDiscountValue}
            onChange={(e) =>
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                familyDiscountValue: +e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"),
              })
            }
          />
          <label htmlFor="familyDiscountValue" className="w-1/4 text-left">
            %
          </label>
        </div>

        {/* SECOND COURSE DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="secondCourseDiscountValue"
            className="w-1/4 text-right"
          >
            Desconto para 2º curso:{" "}
          </label>
          <input
            type="text"
            name="secondCourseDiscountValue"
            className={
              errors.secondCourseDiscountValue
                ? "w-10 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            maxLength={2}
            value={systemConstantsEditData.secondCourseDiscountValue}
            onChange={(e) =>
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                secondCourseDiscountValue: +e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"),
              })
            }
          />
          <label
            htmlFor="secondCourseDiscountValue"
            className="w-1/4 text-left"
          >
            %
          </label>
        </div>

        {/* STANDARD PAYMENT DAY VALUE */}
        <div className="flex gap-2 items-center">
          <label htmlFor="standardPaymentDay" className="w-1/4 text-right">
            Dia padrão para pagamentos:{" "}
          </label>
          <input
            type="text"
            name="standardPaymentDay"
            className={
              errors.standardPaymentDay
                ? "w-10 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            // pattern="^[+ 0-9]{2}$"
            maxLength={2}
            value={systemConstantsEditData.standardPaymentDay}
            onChange={(e) =>
              setSystemConstantsEditData({
                ...systemConstantsEditData,
                standardPaymentDay: e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1"),
              })
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
