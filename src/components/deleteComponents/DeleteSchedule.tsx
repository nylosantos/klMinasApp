/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteScheduleValidationSchema } from "../../@types/zodValidation";
import {
  DeleteScheduleValidationZProps,
  ScheduleSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteSchedule() {
  // GET GLOBAL DATA
  const { curriculumDatabaseData, scheduleDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // SCHEDULE DATA
  const [scheduleData, setScheduleData] =
    useState<DeleteScheduleValidationZProps>({
      scheduleId: "",
      scheduleName: "",
      schoolId: "",
      confirmDelete: false,
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL DATA STATE
  const [school, setSchool] = useState({
    id: "",
  });

  // RESET SCHOOL CLASS, SCHOOL COURSE AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    setScheduleData({ ...scheduleData, confirmDelete: false }),
      ((
        document.getElementById("scheduleSelect") as HTMLSelectElement
      ).selectedIndex = 0);
    setScheduleData({
      schoolId: school.id,
      scheduleName: "",
      scheduleId: "",
      confirmDelete: false,
    });
  }, [school.id]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE SELECTED STATE DATA
  const [scheduleSelectedData, setScheduleSelectedData] =
    useState<ScheduleSearchProps>();

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    setScheduleData({ ...scheduleData, confirmDelete: false });
    if (scheduleData.scheduleId !== "") {
      setScheduleSelectedData(
        scheduleDatabaseData.find(({ id }) => id === scheduleData.scheduleId)
      );
    } else {
      setScheduleSelectedData(undefined);
    }
  }, [scheduleData.scheduleId]);

  useEffect(() => {
    if (scheduleSelectedData) {
      setScheduleData({
        ...scheduleData,
        scheduleName: scheduleSelectedData.name,
      });
    }
  }, [scheduleSelectedData]);

  // -------------------------- END OF SCHEDULE SELECT STATES AND FUNCTIONS -------------------------- //

  // SCHEDULE SELECTED STATE
  const [isSelected, setIsSelected] = useState(false);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteScheduleValidationZProps>({
    resolver: zodResolver(deleteScheduleValidationSchema),
    defaultValues: {
      scheduleId: "",
      scheduleName: "",
      schoolId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setScheduleData({
      scheduleId: "",
      scheduleName: "",
      schoolId: "",
      confirmDelete: false,
    });
    setIsSelected(false);
    setSchool({ id: "" });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("schoolId", scheduleData.schoolId);
    setValue("scheduleId", scheduleData.scheduleId);
    setValue("scheduleName", scheduleData.scheduleName);
    setValue("confirmDelete", scheduleData.confirmDelete);
  }, [scheduleData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.schoolId,
      errors.scheduleId,
      errors.scheduleName,
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
  const handleDeleteSchedule: SubmitHandler<
    DeleteScheduleValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // DELETE SCHEDULE FUNCTION
    const deleteSchedule = async () => {
      try {
        await deleteDoc(doc(db, "schedules", data.scheduleId));
        resetForm();
        toast.success(`Horário excluído com sucesso! 👌`, {
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

    // CHECK DELETE CONFIRMATION
    if (!data.confirmDelete) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR EXCLUSÃO" para excluir o ${data.scheduleName}... ☑️`,
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

    // SEARCH CURRICULUM WITH THIS SCHEDULE
    const scheduleExistsOnCurriculum = curriculumDatabaseData.filter(
      (curriculum) => curriculum.scheduleId === scheduleData.scheduleId
    );

    // IF EXISTS, RETURN ERROR
    if (scheduleExistsOnCurriculum.length !== 0) {
      return (
        setScheduleData({ ...scheduleData, confirmDelete: false }),
        setIsSubmitting(false),
        toast.error(
          `Horário incluído em ${scheduleExistsOnCurriculum.length} ${
            scheduleExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
          }, exclua ou altere primeiramente ${
            scheduleExistsOnCurriculum.length === 1 ? "a Turma" : "as Turmas"
          } e depois exclua o ${data.scheduleName}... ❕`,
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
      deleteSchedule();
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="excluindo" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Excluir Horário</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleDeleteSchedule)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.schoolId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setSchool({ ...school, id: e.target.value });
              setIsSelected(false);
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* SCHEDULE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="scheduleSelect"
            className={
              errors.scheduleId
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Identificador:{" "}
          </label>
          <select
            id="scheduleSelect"
            disabled={school.id ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              errors.scheduleId
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="scheduleSelect"
            onChange={(e) => {
              setScheduleData({ ...scheduleData, scheduleId: e.target.value });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              dataType="schedules"
              schoolId={scheduleData.schoolId}
            />
          </select>
        </div>

        {/* SCHEDULE SELECTED DETAILS */}
        {scheduleSelectedData !== undefined && isSelected ? (
          <>
            <div className="flex flex-col pt-2 pb-6 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
              {/* DETAILS TITLE */}
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Dados do Horário a ser excluído:
              </h1>

              {/* SCHOOL NAME */}
              <div className="flex gap-2 items-center">
                <label htmlFor="scheduleSchool" className="w-1/4 text-right">
                  Escola:{" "}
                </label>
                <input
                  type="text"
                  name="scheduleSchool"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.schoolName}
                />
              </div>

              {/* SCHEDULE IDENTIFIER */}
              <div className="flex gap-2 items-center">
                <label htmlFor="scheduleName" className="w-1/4 text-right">
                  Identificador:{" "}
                </label>
                <input
                  type="text"
                  name="scheduleName"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.name}
                />
              </div>

              {/* TRANSITION START */}
              <div className="flex gap-2 items-center">
                <label htmlFor="transitionStart" className="w-1/4 text-right">
                  Início da Transição:{" "}
                </label>
                <input
                  type="text"
                  name="transitionStart"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.transitionStart}
                />
              </div>

              {/* TRANSITION END */}
              <div className="flex gap-2 items-center">
                <label htmlFor="transitionEnd" className="w-1/4 text-right">
                  Fim da Transição:{" "}
                </label>
                <input
                  type="text"
                  name="transitionEnd"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.transitionEnd}
                />
              </div>

              {/* CLASS START */}
              <div className="flex gap-2 items-center">
                <label htmlFor="classStart" className="w-1/4 text-right">
                  Início da Aula:{" "}
                </label>
                <input
                  type="text"
                  name="classStart"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.classStart}
                />
              </div>

              {/* CLASS END */}
              <div className="flex gap-2 items-center">
                <label htmlFor="classEnd" className="w-1/4 text-right">
                  Fim da Aula:{" "}
                </label>
                <input
                  type="text"
                  name="classEnd"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.classEnd}
                />
              </div>

              {/* EXIT */}
              <div className="flex gap-2 items-center">
                <label htmlFor="exit" className="w-1/4 text-right">
                  Saída:{" "}
                </label>
                <input
                  type="text"
                  name="exit"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={scheduleSelectedData!.exit}
                />
              </div>
            </div>

            {/** CHECKBOX CONFIRM DELETE */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="confirmDelete"
                className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none "
                checked={scheduleData.confirmDelete}
                onChange={() => {
                  setScheduleData({
                    ...scheduleData,
                    confirmDelete: !scheduleData.confirmDelete,
                  });
                }}
              />
              <label htmlFor="confirmDelete" className="text-sm">
                {scheduleData.scheduleName
                  ? `Confirmar exclusão do ${scheduleData.scheduleName}`
                  : `Confirmar exclusão`}
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
          </>
        ) : null}
      </form>
    </div>
  );
}
