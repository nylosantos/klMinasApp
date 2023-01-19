/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-toastify/dist/ReactToastify.css";
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

import { createScheduleValidationSchema } from "../zodValidation";
import { CreateScheduleValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";

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
  } = useForm<CreateScheduleValidationZProps>({
    resolver: zodResolver(createScheduleValidationSchema),
    defaultValues: {
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
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
      errors.confirmInsert
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
  const handleAddSchedule: SubmitHandler<
    CreateScheduleValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

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
        const addSchedule = async () => {
          try {
            await setDoc(doc(db, "schedules", uuidv4()), {
              id: uuidv4(),
              name: `Horário ${data.name}`,
              transitionStart: data.transitionStart,
              transitionEnd: data.transitionEnd,
              classStart: data.classStart,
              classEnd: data.classEnd,
              exit: data.exit,
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
        addSchedule();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Adicionar Horário</h1>
      <form
        onSubmit={handleSubmit(handleAddSchedule)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHEDULE IDENTIFIER */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Identificador:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir um Identificador para o Horário"
                : "Insira um Identificador para o Horário"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={scheduleData.name}
            onChange={(e) => {
              setScheduleData({ ...scheduleData, name: e.target.value });
            }}
          />
        </div>

        {/* TRANSITION START */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="transitionStart"
            className={
              errors.transitionStart
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Início da Transição:{" "}
          </label>
          <div className="flex w-3/4">
            <DatePicker
              disableDayPicker
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.transitionStart
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  transitionStart: e!.toString(),
                })
              }
            />
          </div>
        </div>

        {/* TRANSITION END */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="transitionEnd"
            className={
              errors.transitionEnd
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Fim da Transição:{" "}
          </label>
          <div className="flex w-3/4">
            <DatePicker
              disableDayPicker
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.transitionEnd
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  transitionEnd: e!.toString(),
                })
              }
            />
          </div>
        </div>

        {/* CLASS START */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classStart"
            className={
              errors.classStart
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Início da Aula:{" "}
          </label>
          <div className="flex w-3/4">
            <DatePicker
              disableDayPicker
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.classStart
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  classStart: e!.toString(),
                })
              }
            />
          </div>
        </div>

        {/* CLASS END */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="classEnd"
            className={
              errors.classEnd
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Fim da Aula:{" "}
          </label>
          <div className="flex w-3/4">
            <DatePicker
              disableDayPicker
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.classEnd
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  classEnd: e!.toString(),
                })
              }
            />
          </div>
        </div>

        {/* EXIT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="exit"
            className={
              errors.exit
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Saída:{" "}
          </label>
          <div className="flex w-3/4">
            <DatePicker
              disableDayPicker
              format="HH:mm"
              plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
              inputClass={
                errors.exit
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  exit: e!.toString(),
                })
              }
            />
          </div>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none "
            checked={scheduleData.confirmInsert}
            onChange={() => {
              setScheduleData({
                ...scheduleData,
                confirmInsert: !scheduleData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmInsert"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {scheduleData.name
              ? `Confirmar criação do ${scheduleData.name}`
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
