/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { toast } from "react-toastify";
import { EditSystemConstantsValidationZProps } from "../../@types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { editSystemConstantsValidationSchema } from "../../@types/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getFirestore } from "firebase/firestore";
import { app } from "../../db/Firebase";
import { NumericFormat } from "react-number-format";
import Switch from "react-switch";
import BackdropModal from "../layoutComponents/BackdropModal";
import SettingsMenuModal from "../layoutComponents/SettingsMenuModal";
import { SettingsMenuArrayProps } from "../../pages/Settings";
import SettingsSectionSubHeader from "../layoutComponents/SettingsSectionSubHeader";
import { secureUpdateDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface SystemSettingsProps {
  renderSettingsMenu(itemMenu: string): JSX.Element | undefined;
  itemsMenu: SettingsMenuArrayProps[];
  settingsMenu: boolean;
  setSettingsMenu: Dispatch<SetStateAction<boolean>>;
  showSettingsPage: { page: string };
}

export default function EditSystemConstants({
  itemsMenu,
  renderSettingsMenu,
  settingsMenu,
  setSettingsMenu,
  showSettingsPage,
}: SystemSettingsProps) {
  const {
    isSubmitting,
    systemConstantsDb,
    systemConstantsDbLoading,
    systemConstantsDbError,
    systemConstantsValues,
    setIsSubmitting,
    userFullData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // REACT HOOK FORM
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    control,
    formState: { errors },
  } = useForm<EditSystemConstantsValidationZProps>({
    resolver: zodResolver(editSystemConstantsValidationSchema),
    defaultValues: {},
  });

  // SYNC FORM DATA WITH DB
  useEffect(() => {
    if (
      systemConstantsDb &&
      !systemConstantsDbLoading &&
      systemConstantsDbError === undefined
    ) {
      const currentYear = new Date().getFullYear().toString();
      const constants = systemConstantsDb.find(
        (constants) => constants.year === currentYear
      );

      if (constants) {
        const transformedData = {
          ...constants,
          employeeDiscountValue: 100 - +constants.employeeDiscountValue * 100,
          familyDiscountValue: 100 - +constants.familyDiscountValue * 100,
          secondCourseDiscountValue:
            100 - +constants.secondCourseDiscountValue * 100,
        };

        reset(transformedData);
      }
    }
  }, [systemConstantsDb, reset]);

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

  // HANDLE FORM SUBMIT
  const handleEditConstants: SubmitHandler<
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

    if (
      1 - data.employeeDiscountValue / 100 ===
        systemConstantsValues?.employeeDiscountValue &&
      1 - data.familyDiscountValue / 100 ===
        systemConstantsValues?.familyDiscountValue &&
      1 - data.secondCourseDiscountValue / 100 ===
        systemConstantsValues?.secondCourseDiscountValue &&
      data.customerFullName === systemConstantsValues?.customerFullName &&
      data.customerShortName === systemConstantsValues?.customerShortName &&
      data.enrolmentFee === systemConstantsValues?.enrolmentFee &&
      data.enrolmentFeeDiscount ===
        systemConstantsValues?.enrolmentFeeDiscount &&
      data.systemSignInClosed === systemConstantsValues?.systemSignInClosed &&
      data.systemSignUpClosed === systemConstantsValues?.systemSignUpClosed &&
      data.standardPaymentDay === systemConstantsValues?.standardPaymentDay
    ) {
      toast.warning("Nenhum dado foi alterado...", {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    // UPDATE SYSTEM CONSTANTS
    try {
      await secureUpdateDoc(doc(db, "systemConstants", data.id), {
        enrolmentFee: data.enrolmentFee,
        enrolmentFeeDiscount: data.enrolmentFeeDiscount,
        systemSignInClosed: data.systemSignInClosed,
        systemSignUpClosed: data.systemSignUpClosed,
        customerFullName: data.customerFullName,
        customerShortName: data.customerShortName,
        year: data.year,
        employeeDiscountValue: 1 - data.employeeDiscountValue / 100,
        familyDiscountValue: 1 - data.familyDiscountValue / 100,
        secondCourseDiscountValue: 1 - data.secondCourseDiscountValue / 100,
        standardPaymentDay: data.standardPaymentDay,
      });
      toast.success(`Dados alterados com sucesso! 👌`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao salvar os dados... 🤯", {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <div className="flex justify-center items-center mt-2 py-2 gap-4">
        <h1 className="text-lg font-semibold">Configurações</h1>
      </div>
      <SettingsSectionSubHeader
        setSettingsMenu={setSettingsMenu}
        settingsMenu={settingsMenu}
        data={itemsMenu}
        showSettingsPage={showSettingsPage}
      />

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditConstants)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* CUSTOMER FULL NAME */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Nome completo da Empresa:
          </label>
          <input
            type="text"
            {...register("customerFullName")}
            defaultValue={getValues("customerFullName")}
            placeholder="Insira o nome completo da Empresa"
            className="w-2/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
          />
        </div>

        {/* CUSTOMER SHORT NAME */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Nome abreviado da Empresa:
          </label>
          <input
            type="text"
            {...register("customerShortName")}
            defaultValue={getValues("customerShortName")}
            placeholder="Insira o nome abreviado da Empresa"
            className="w-2/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
          />
        </div>

        {/* SIGN IN SYSTEM CLOSED */}
        {userFullData && userFullData.role === "root" && (
          <label className="flex items-center gap-2">
            <span className="w-2/4 text-sm md:text-base text-right">
              Bloquear login no sistema?
            </span>
            <Controller
              name="systemSignInClosed"
              control={control}
              render={({ field }) => (
                <Switch onChange={field.onChange} checked={field.value} />
              )}
            />
          </label>
        )}

        {/* SIGN UP SYSTEM CLOSED */}
        <label className="flex items-center gap-2">
          <span className="w-2/4 text-sm md:text-base text-right">
            Bloquear cadastro no sistema?
          </span>
          <Controller
            name="systemSignUpClosed"
            control={control}
            render={({ field }) => (
              <Switch onChange={field.onChange} checked={field.value} />
            )}
          />
        </label>

        {/* ENROLMENT FEE VALUE */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Valor da matrícula:
          </label>
          <Controller
            name="enrolmentFee"
            control={control}
            render={({ field }) => (
              <NumericFormat
                value={field.value}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  field.onChange(floatValue);
                }}
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                fixedDecimalScale
                decimalScale={2}
                className="w-2/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
              />
            )}
          />
        </div>

        {/* ENROLMENT FEE DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Valor da aula matrícula com desconto:
          </label>
          <Controller
            name="enrolmentFeeDiscount"
            control={control}
            render={({ field }) => (
              <NumericFormat
                value={field.value}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  field.onChange(floatValue);
                }}
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                fixedDecimalScale
                decimalScale={2}
                className="w-2/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
              />
            )}
          />
        </div>

        {/* EMPLOYEE DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Desconto para funcionários:
          </label>
          <div className="flex items-center gap-2 w-2/4">
            <Controller
              name="employeeDiscountValue"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  onChange={(values) => {
                    const { currentTarget } = values;
                    field.onChange(+currentTarget.value);
                  }}
                  defaultValue={field.value}
                  className="w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
                />
              )}
            />
            <p>%</p>
          </div>
        </div>

        {/* FAMILY DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Desconto para familiares:
          </label>
          <div className="flex items-center gap-2 w-2/4">
            <Controller
              name="familyDiscountValue"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  onChange={(values) => {
                    const { currentTarget } = values;
                    field.onChange(+currentTarget.value);
                  }}
                  defaultValue={field.value}
                  className="w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
                />
              )}
            />
            <p>%</p>
          </div>
        </div>

        {/* SECOND COURSE DISCOUNT VALUE */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Desconto para 2º curso:
          </label>
          <div className="flex items-center gap-2 w-2/4">
            <Controller
              name="secondCourseDiscountValue"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  onChange={(values) => {
                    const { currentTarget } = values;
                    field.onChange(+currentTarget.value);
                  }}
                  defaultValue={field.value}
                  className="w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
                />
              )}
            />
            <p>%</p>
          </div>
        </div>

        {/* STANDARD PAYMENT DAY */}
        <div className="flex gap-2 items-center">
          <label className="w-2/4 text-sm md:text-base text-right">
            Dia padrão para pagamentos:
          </label>
          <div className="flex items-center gap-2 w-2/4">
            <input
              type="number"
              inputMode="numeric"
              maxLength={2}
              {...register("standardPaymentDay")}
              defaultValue={getValues("standardPaymentDay")}
              className="w-10 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl"
            />
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
              reset();
            }}
          >
            {isSubmitting ? "Aguarde" : "Cancelar"}
          </button>
        </div>
      </form>
      {/* BACKDROP */}
      {settingsMenu && (
        <BackdropModal
          setDashboardMenu={setSettingsMenu}
          setMobileMenuOpen={setSettingsMenu}
        />
      )}
      {/* SETTINGS MENU DRAWER */}
      <SettingsMenuModal
        setSettingsMenu={setSettingsMenu}
        settingsMenu={settingsMenu}
        itemsMenu={itemsMenu}
        renderSettingsMenu={renderSettingsMenu}
        userFullData={userFullData}
      />
    </div>
  );
}
