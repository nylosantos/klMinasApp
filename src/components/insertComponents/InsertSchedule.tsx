import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-multi-date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
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

import { createScheduleValidationSchema } from "../../@types/zodValidation";
import {
  CreateScheduleValidationZProps,
  SchoolSearchProps,
} from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  buttonReset,
  buttonSubmit,
  divCheckboxItem,
  divDatePicker,
  divItemsForm,
  divMasterPage,
  divSubmitResetItems,
  formMaster,
  inputCheckbox,
  inputError,
  inputOk,
  inputWithButtonError,
  inputWithButtonOk,
  labelCheckbox,
  labelTextError,
  labelTextOk,
  pageTitleH1,
  selectError,
  selectOk,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertSchedule() {
  // SCHEDULE DATA
  const [scheduleData, setScheduleData] =
    useState<CreateScheduleValidationZProps>({
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
      schoolId: "",
      schoolName: "",
      confirmInsert: false,
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL DATA
  const [schoolData, setSchoolData] = useState({
    schoolId: "",
  });

  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOLS
  const [schoolsDataArray, setSchoolsDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolsDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolData.schoolId !== "") {
      setScheduleData({ ...scheduleData, confirmInsert: false });
      setSchoolSelectedData(
        schoolsDataArray!.find(({ id }) => id === schoolData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolData.schoolId]);

  // SET SCHOOL DATA TO SCHEDULE DATA
  useEffect(() => {
    setScheduleData({
      ...scheduleData,
      schoolName: schoolSelectedData?.name!,
      schoolId: schoolSelectedData?.id!,
    });
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateScheduleValidationZProps>({
    resolver: zodResolver(createScheduleValidationSchema),
    defaultValues: {
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
      schoolId: "",
      schoolName: "",
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setScheduleData({
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
      schoolId: "",
      schoolName: "",
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", scheduleData.name);
    setValue("transitionStart", scheduleData.transitionStart);
    setValue("transitionEnd", scheduleData.transitionEnd);
    setValue("classStart", scheduleData.classStart);
    setValue("classEnd", scheduleData.classEnd);
    setValue("exit", scheduleData.exit);
    setValue("schoolId", scheduleData.schoolId);
    setValue("schoolName", scheduleData.schoolName);
    setValue("confirmInsert", scheduleData.confirmInsert);
  }, [scheduleData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.transitionStart,
      errors.transitionEnd,
      errors.classStart,
      errors.classEnd,
      errors.exit,
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
  console.log(scheduleData);
  // SUBMIT DATA FUNCTION
  const handleAddSchedule: SubmitHandler<
    CreateScheduleValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // ADD SCHEDULE FUNCTION
    const addSchedule = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "schedules", commonId), {
          id: commonId,
          name: `Horário ${data.name}`,
          transitionStart: data.transitionStart,
          transitionEnd: data.transitionEnd,
          classStart: data.classStart,
          classEnd: data.classEnd,
          exit: data.exit,
          schoolId: data.schoolId,
          schoolName: data.schoolName,
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`Horário ${data.name} criado com sucesso! 👌`, {
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

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o Horário ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF SCHEDULE EXISTS ON DATABASE
    const schedulesRef = collection(db, "schedules");
    const q = query(schedulesRef, where("name", "==", `Horário ${data.name}`));
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
            `Horário ${data.name} já existe no nosso banco de dados... ❕`,
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

        addSchedule();
      }
    });
  };

  return (
    <div className={divMasterPage}>
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className={pageTitleH1}>Adicionar Horário</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddSchedule)} className={formMaster}>
        {/* SCHOOL SELECT */}
        <div className={divItemsForm}>
          <label
            htmlFor="schoolSelect"
            className={errors.name ? labelTextError : labelTextOk}
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={errors.name ? selectError : selectOk}
            name="schoolSelect"
            onChange={(e) => {
              setSchoolData({
                ...schoolData,
                schoolId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              handleData={handleSchoolSelectedData}
              dataType="schools"
            />
          </select>
        </div>

        {/* SCHEDULE IDENTIFIER */}
        <div className={divItemsForm}>
          <label
            htmlFor="scheduleName"
            className={errors.name ? labelTextError : labelTextOk}
          >
            Identificador:{" "}
          </label>
          <input
            type="text"
            name="scheduleName"
            disabled={isSubmitting}
            placeholder={
              selectOk
                ? "É necessário inserir um Identificador para o Horário"
                : "Insira um Identificador para o Horário"
            }
            className={errors.name ? inputError : inputOk}
            value={scheduleData.name}
            onChange={(e) => {
              setScheduleData({
                ...scheduleData,
                name: e.target.value,
                confirmInsert: false,
              });
            }}
          />
        </div>

        {/* TRANSITION START */}
        <div className={divItemsForm}>
          <label
            htmlFor="transitionStart"
            className={errors.transitionStart ? labelTextError : labelTextOk}
          >
            Início da Transição:{" "}
          </label>
          <div className={divDatePicker}>
            <DatePicker
              disableDayPicker
              editable={false}
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.transitionStart
                  ? inputWithButtonError
                  : inputWithButtonOk
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  transitionStart: e!.toString(),
                  confirmInsert: false,
                })
              }
            />
          </div>
        </div>

        {/* TRANSITION END */}
        <div className={divItemsForm}>
          <label
            htmlFor="transitionEnd"
            className={errors.transitionEnd ? labelTextError : labelTextOk}
          >
            Fim da Transição:{" "}
          </label>
          <div className={divDatePicker}>
            <DatePicker
              disableDayPicker
              editable={false}
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.transitionEnd ? inputWithButtonError : inputWithButtonOk
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  transitionEnd: e!.toString(),
                  confirmInsert: false,
                })
              }
            />
          </div>
        </div>

        {/* CLASS START */}
        <div className={divItemsForm}>
          <label
            htmlFor="classStart"
            className={errors.classStart ? labelTextError : labelTextOk}
          >
            Início da Aula:{" "}
          </label>
          <div className={divDatePicker}>
            <DatePicker
              disableDayPicker
              editable={false}
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.classStart ? inputWithButtonError : inputWithButtonOk
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  classStart: e!.toString(),
                  confirmInsert: false,
                })
              }
            />
          </div>
        </div>

        {/* CLASS END */}
        <div className={divItemsForm}>
          <label
            htmlFor="classEnd"
            className={errors.classEnd ? labelTextError : labelTextOk}
          >
            Fim da Aula:{" "}
          </label>
          <div className={divDatePicker}>
            <DatePicker
              disableDayPicker
              editable={false}
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.classEnd ? inputWithButtonError : inputWithButtonOk
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  classEnd: e!.toString(),
                  confirmInsert: false,
                })
              }
            />
          </div>
        </div>

        {/* EXIT */}
        <div className={divItemsForm}>
          <label
            htmlFor="exit"
            className={errors.exit ? labelTextError : labelTextOk}
          >
            Saída:{" "}
          </label>
          <div className={divDatePicker}>
            <DatePicker
              disableDayPicker
              editable={false}
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.exit ? inputWithButtonError : inputWithButtonOk
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  exit: e!.toString(),
                  confirmInsert: false,
                })
              }
            />
          </div>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={scheduleData.confirmInsert}
            onChange={() => {
              setScheduleData({
                ...scheduleData,
                confirmInsert: !scheduleData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {scheduleData.name
              ? `Confirmar criação do ${scheduleData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className={divSubmitResetItems}>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonSubmit}
          >
            {!isSubmitting ? "Criar" : "Criando"}
          </button>

          {/* RESET BUTTON */}
          <button
            type="reset"
            className={buttonReset}
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
