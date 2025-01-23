/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { EditDashboardScheduleButton } from "../layoutComponents/EditDashboardScheduleButton";
import { app } from "../../db/Firebase";
import {
  EditScheduleValidationZProps,
  ScheduleSearchProps,
} from "../../@types";
import { useContext, useEffect, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editScheduleValidationSchema } from "../../@types/zodValidation";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface EditScheduleFormProps {
  scheduleSelectedData: ScheduleSearchProps;
  isSubmitting: boolean;
  isEdit: boolean;
  modal?: boolean;
  onClose?: () => void;
  setModal?: (option: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  handleDeleteSchedule?: () => void;
}

export default function EditScheduleForm({
  scheduleSelectedData,
  isSubmitting,
  isEdit,
  modal = false,
  setModal,
  onClose,
  setIsSubmitting,
  setIsEdit,
  handleDeleteSchedule,
}: EditScheduleFormProps) {
  // GET GLOBAL DATA
  const { scheduleDatabaseData, page } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHEDULE EDIT DATA
  const [scheduleEditData, setScheduleEditData] =
    useState<EditScheduleValidationZProps>({
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
    });

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    if (scheduleSelectedData !== undefined) {
      setScheduleEditData({
        ...scheduleEditData,
        name: scheduleSelectedData.name,
        transitionStart: scheduleSelectedData.transitionStart,
        transitionEnd: scheduleSelectedData.transitionEnd,
        classStart: scheduleSelectedData.classStart,
        classEnd: scheduleSelectedData.classEnd,
        exit: scheduleSelectedData.exit,
      });
    }
  }, [isEdit, scheduleSelectedData]);

  function resetScheduleDataFunction() {
    setScheduleEditData({
      ...scheduleEditData,
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
    });
    setIsEdit(!isEdit);
  }

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditScheduleValidationZProps>({
    resolver: zodResolver(editScheduleValidationSchema),
    defaultValues: {
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setScheduleEditData({
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
    });
    reset();
    onClose && onClose();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", scheduleEditData.name);
    setValue("transitionStart", scheduleEditData.transitionStart);
    setValue("transitionEnd", scheduleEditData.transitionEnd);
    setValue("classStart", scheduleEditData.classStart);
    setValue("classEnd", scheduleEditData.classEnd);
    setValue("exit", scheduleEditData.exit);
  }, [scheduleEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.transitionStart,
      errors.transitionEnd,
      errors.classStart,
      errors.classEnd,
      errors.exit,
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
  const handleEditSchedule: SubmitHandler<
    EditScheduleValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // EDIT SCHEDULE FUNCTION
    const editSchedule = async () => {
      try {
        await updateDoc(doc(db, "schedules", scheduleSelectedData.id), {
          name: data.name,
          transitionStart: data.transitionStart,
          transitionEnd: data.transitionEnd,
          classStart: data.classStart,
          classEnd: data.classEnd,
          exit: data.exit,
        });
        resetForm();
        toast.success(`${scheduleSelectedData.name} alterado com sucesso! 👌`, {
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

    // CHECKING IF SCHEDULE EXISTS ON DATABASE
    const schedule = scheduleDatabaseData.find(
      (schedule) => schedule.id === scheduleSelectedData.id
    );
    if (!schedule) {
      // IF NOT EXISTS, RETURN ERROR
      return (
        setIsSubmitting(false),
        toast.error(`Horário não existe no banco de dados...... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      // IF EXISTS, EDIT
      editSchedule();
    }
  };

  return (
    <div
      className={`w-full ${
        modal ? "max-w-7xl bg-white/80 dark:bg-transparent rounded-xl" : ""
      } `}
    >
      {modal && (
        <div className="flex items-center justify-center text-md/snug text-gray-100 bg-klGreen-500/70 dark:bg-klGreen-500/70 rounded-t-xl uppercase p-4">
          <p className="flex absolute z-10">
            {!isEdit ? `Detalhes` : `Editando`} - {scheduleSelectedData.name}
          </p>
          <div className="flex relative justify-end px-2 w-full z-50">
            <EditDashboardScheduleButton
              isEdit={isEdit}
              handleDeleteSchedule={
                handleDeleteSchedule && handleDeleteSchedule
              }
              resetScheduleData={resetScheduleDataFunction}
              setIsEdit={setIsEdit}
              setModal={setModal && setModal}
            />
          </div>
        </div>
      )}
      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchedule)}
        className={`flex flex-col w-full gap-2 p-4 ${
          modal
            ? "rounded-b-xl bg-klGreen-500/20 dark:bg-klGreen-500/30"
            : "mt-2"
        }`}
      >
        {/* SCHEDULE OLD DETAILS */}
        <div
          className={`flex flex-col pt-2 pb-6 gap-2 ${
            page.show === "Dashboard"
              ? "text-center"
              : "bg-white/50 dark:bg-gray-800/40 rounded-xl"
          }`}
        >
          {/* OLD DATA TITLE */}
          {isEdit && (
            <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
              Dados anteriores do horário:
            </h1>
          )}

          {/* OLD SCHEDULE NAME */}
          <div className="flex gap-2 items-center">
            <label htmlFor="oldName" className="w-1/4 text-right">
              Nome:{" "}
            </label>
            <input
              type="text"
              name="oldName"
              disabled
              defaultValue={scheduleSelectedData?.name}
              className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            />
          </div>

          {/* OLD TRANSITION START */}
          <div className="flex gap-2 items-center">
            <label htmlFor="oldTransitionStart" className="w-1/4 text-right">
              Início da Transição:{" "}
            </label>
            <input
              type="text"
              name="oldTransitionStart"
              disabled
              defaultValue={scheduleSelectedData?.transitionStart}
              className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            />
          </div>

          {/* OLD TRANSITION END */}
          <div className="flex gap-2 items-center">
            <label htmlFor="oldTransitionEnd" className="w-1/4 text-right">
              Fim da Transição:{" "}
            </label>
            <input
              type="text"
              name="oldTransitionEnd"
              disabled
              defaultValue={scheduleSelectedData?.transitionEnd}
              className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            />
          </div>

          {/* OLD CLASS START */}
          <div className="flex gap-2 items-center">
            <label htmlFor="oldClassStart" className="w-1/4 text-right">
              Início da Aula:{" "}
            </label>
            <input
              type="text"
              name="oldClassStart"
              disabled
              defaultValue={scheduleSelectedData?.classStart}
              className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            />
          </div>

          {/* OLD CLASS END */}
          <div className="flex gap-2 items-center">
            <label htmlFor="oldClassEnd" className="w-1/4 text-right">
              Fim da Aula:{" "}
            </label>
            <input
              type="text"
              name="oldClassEnd"
              disabled
              defaultValue={scheduleSelectedData?.classEnd}
              className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            />
          </div>

          {/* OLD EXIT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="oldExit" className="w-1/4 text-right">
              Saída:{" "}
            </label>
            <input
              type="text"
              name="oldExit"
              disabled
              defaultValue={scheduleSelectedData?.exit}
              className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            />
          </div>
        </div>
        {isEdit && (
          <>
            {/* EDITED DATA TITLE */}
            <h1
              className={`font-bold text-lg py-4 text-red-600 dark:text-yellow-500 ${
                page.show === "Dashboard" && "text-center"
              }`}
            >
              Insira os novos dados para o horário:
            </h1>

            {/* SCHEDULE NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="name"
                className={
                  errors.name
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
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
                    ? "É necessário inserir um um Identificador para o Horário"
                    : "Insira um um Identificador para o Horário"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={scheduleEditData.name}
                onChange={(e) => {
                  setScheduleEditData({
                    ...scheduleEditData,
                    name: e.target.value,
                  });
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
                    : "w-1/4 text-right"
                }
              >
                Início da Transição:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  disableDayPicker
                  editable={false}
                  format="HH:mm"
                  plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
                  inputClass={
                    errors.transitionStart
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  onChange={(e) =>
                    setScheduleEditData({
                      ...scheduleEditData,
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
                    : "w-1/4 text-right"
                }
              >
                Fim da Transição:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  disableDayPicker
                  editable={false}
                  format="HH:mm"
                  plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
                  inputClass={
                    errors.transitionEnd
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  onChange={(e) =>
                    setScheduleEditData({
                      ...scheduleEditData,
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
                    : "w-1/4 text-right"
                }
              >
                Início da Aula:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  disableDayPicker
                  editable={false}
                  format="HH:mm"
                  plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
                  inputClass={
                    errors.classStart
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  onChange={(e) =>
                    setScheduleEditData({
                      ...scheduleEditData,
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
                    : "w-1/4 text-right"
                }
              >
                Fim da Aula:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  disableDayPicker
                  editable={false}
                  format="HH:mm"
                  plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
                  inputClass={
                    errors.classEnd
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  onChange={(e) =>
                    setScheduleEditData({
                      ...scheduleEditData,
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
                    : "w-1/4 text-right"
                }
              >
                Saída:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  disableDayPicker
                  editable={false}
                  format="HH:mm"
                  plugins={[<TimePicker hideSeconds key={uuidv4()} />]}
                  inputClass={
                    errors.exit
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  onChange={(e) =>
                    setScheduleEditData({
                      ...scheduleEditData,
                      exit: e!.toString(),
                    })
                  }
                />
              </div>
            </div>
          </>
        )}

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
    </div>
  );
}
