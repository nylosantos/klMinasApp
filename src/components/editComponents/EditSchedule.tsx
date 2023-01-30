/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { editScheduleValidationSchema } from "../../@types/zodValidation";
import {
  EditScheduleValidationZProps,
  ScheduleSearchProps,
  SchoolSearchProps,
} from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditSchedule() {
  // SCHEDULE DATA
  const [scheduleData, setScheduleData] = useState({
    scheduleId: "",
    schoolId: "",
  });

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

  // SCHEDULE SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
    setIsEdit(false);
    setIsSelected(false);
    setScheduleSelectedData(undefined);
    if (scheduleData.schoolId !== "") {
      setSchoolSelectedData(
        schoolsDataArray!.find(({ id }) => id === scheduleData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);

  // SCHEDULE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHEDULES
  const [schedulesDataArray, setSchedulesDataArray] =
    useState<ScheduleSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHEDULE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleScheduleSelectedData = (data: ScheduleSearchProps[]) => {
    setSchedulesDataArray(data);
  };

  // SCHEDULE SELECTED STATE DATA
  const [scheduleSelectedData, setScheduleSelectedData] =
    useState<ScheduleSearchProps>();

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHEDULE
  useEffect(() => {
    if (scheduleSelectedData !== undefined) {
      setIsSelected(true);
      setIsEdit(false);
      setScheduleEditData({
        ...scheduleEditData,
        name: scheduleSelectedData.name,
      });
    }
  }, [scheduleSelectedData]);

  // SET SCHEDULE SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (scheduleData.scheduleId !== "") {
      setScheduleSelectedData(
        schedulesDataArray!.find(({ id }) => id === scheduleData.scheduleId)
      );
    } else {
      setScheduleSelectedData(undefined);
    }
  }, [scheduleData.scheduleId]);

  // RESET SCHEDULE SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [scheduleData.schoolId]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("scheduleSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setScheduleEditData({
      name: "",
      transitionStart: "",
      transitionEnd: "",
      classStart: "",
      classEnd: "",
      exit: "",
    });
    setScheduleData({
      scheduleId: "",
      schoolId: "",
    });
    reset();
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

    // CHECKING IF SCHEDULE EXISTS ON DATABASE
    const scheduleRef = collection(db, "schedules");
    const q = query(scheduleRef, where("id", "==", scheduleData.scheduleId));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF NO EXISTS, RETURN ERROR
      if (results.length === 0) {
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
        const editSchedule = async () => {
          try {
            await updateDoc(doc(db, "schedules", scheduleData.scheduleId), {
              name: data.name,
              transitionStart: data.transitionStart,
              transitionEnd: data.transitionEnd,
              classStart: data.classStart,
              classEnd: data.classEnd,
              exit: data.exit,
            });
            resetForm();
            toast.success(`${scheduleEditData.name} alterado com sucesso! 👌`, {
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
        editSchedule();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${scheduleEditData.name}` : "Editar Horário"}
      </h1>
      <form
        onSubmit={handleSubmit(handleEditSchedule)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setScheduleData({
                ...scheduleData,
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

        {/* SCHEDULE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="scheduleSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Horário:{" "}
          </label>
          <select
            id="scheduleSelect"
            defaultValue={" -- select an option -- "}
            disabled={scheduleData.schoolId ? false : true}
            className={
              scheduleData.schoolId
                ? errors.name
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="scheduleSelect"
            onChange={(e) => {
              setScheduleData({
                ...scheduleData,
                scheduleId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              handleData={handleScheduleSelectedData}
              dataType="schedules"
              schoolId={scheduleData.schoolId}
            />
          </select>
        </div>

        {isSelected ? (
          <>
            {/* EDIT BUTTON */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-green-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                {!isEdit
                  ? "Editar"
                  : "Clique em CANCELAR para desfazer a Edição"}
              </button>
            </div>
          </>
        ) : null}

        {isEdit ? (
          <>
            {/* SCHEDULE NAME */}
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
                    setScheduleEditData({
                      ...scheduleEditData,
                      exit: e!.toString(),
                    })
                  }
                />
              </div>
            </div>

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
          </>
        ) : null}
      </form>
    </div>
  );
}
