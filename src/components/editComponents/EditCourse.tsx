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
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolCourseValidationSchema } from "../../@types/zodValidation";
import {
  EditSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
} from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditCourse() {
  // SCHOOL COURSE DATA
  const [schoolCourseData, setSchoolCourseData] = useState({
    schoolCourseId: "",
  });

  // SCHOOL COURSE EDIT DATA
  const [schoolCourseEditData, setSchoolCourseEditData] =
    useState<EditSchoolCourseValidationZProps>({
      name: "",
      price: 0,
    });

  // SCHOOL COURSE SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSES
  const [schoolCoursesDataArray, setSchoolCoursesDataArray] =
    useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolCourseSelectedData = (data: SchoolCourseSearchProps[]) => {
    setSchoolCoursesDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    setIsEdit(false);
    if (schoolCourseData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCoursesDataArray!.find(
          ({ id }) => id === schoolCourseData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [schoolCourseData.schoolCourseId]);

  // SET SCHOOL COURSE NAME AND PRICE TO SCHOOL COURSE EDIT DATA
  useEffect(() => {
    setSchoolCourseEditData({
      ...schoolCourseEditData,
      name: schoolCourseSelectedData?.name!,
      price: schoolCourseSelectedData?.price!,
    });
  }, [schoolCourseSelectedData]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditSchoolCourseValidationZProps>({
    resolver: zodResolver(editSchoolCourseValidationSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setSchoolCourseData({
      schoolCourseId: "",
    });
    setSchoolCourseEditData({
      name: "",
      price: 0,
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolCourseEditData.name);
    setValue("price", schoolCourseEditData.price / 100);
  }, [schoolCourseEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name, errors.price];
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
    EditSchoolCourseValidationZProps
  > = async (data) => {
    setIsSubmitting(true);

    // EDIT SCHOOL COURSE FUNCTION
    const editSchoolCourse = async () => {
      try {
        await updateDoc(
          doc(db, "schoolCourses", schoolCourseData.schoolCourseId),
          {
            name: data.name,
            price: data.price,
          }
        );
        resetForm();
        toast.success(`${schoolCourseEditData.name} alterado com sucesso! 👌`, {
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
    const schoolCourseRef = collection(db, "schoolCourses");
    const q = query(
      schoolCourseRef,
      where("id", "==", schoolCourseData.schoolCourseId)
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF NOT EXISTS, RETURN ERROR
      if (results.length === 0) {
        return (
          setIsSubmitting(false),
          toast.error(`Modalidade não existe no banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF EXISTS, EDIT
        editSchoolCourse();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${schoolCourseEditData.name}` : "Editar Modalidade"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchool)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="schoolCourseSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setSchoolCourseData({
                ...schoolCourseData,
                schoolCourseId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              handleData={handleSchoolCourseSelectedData}
              dataType="schoolCourses"
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
                className="w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
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
                Nome:{" "}
              </label>
              <input
                type="text"
                name="name"
                disabled={isSubmitting}
                placeholder={
                  errors.name
                    ? "É necessário inserir o nome da Modalidade"
                    : "Insira o nome da Modalidade"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={schoolCourseEditData.name}
                onChange={(e) => {
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
                    name: e.target.value,
                  });
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
                    : "w-1/4 text-right"
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
                defaultValue={schoolCourseEditData.price}
                decimalsLimit={2}
                decimalScale={2}
                prefix="R$"
                disableAbbreviations
                onValueChange={(value, name) =>
                  value
                    ? setSchoolCourseEditData({
                        ...schoolCourseEditData,
                        price: +value.replace(/\D/g, ""),
                      })
                    : null
                }
                className={
                  errors.price
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
          </>
        ) : null}
      </form>
    </div>
  );
}
