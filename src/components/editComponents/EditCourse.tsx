/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  arrayRemove,
  arrayUnion, doc, getFirestore, updateDoc
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editSchoolCourseValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  EditSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditCourse() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolCourseDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
    calcStudentPrice,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL COURSE DATA
  const [schoolCourseData, setSchoolCourseData] = useState({
    schoolCourseId: "",
    bundleDays: 0,
    priceBundle: 0,
    priceUnit: 0,
  });

  // SCHOOL COURSE EDIT DATA
  const [schoolCourseEditData, setSchoolCourseEditData] =
    useState<EditSchoolCourseValidationZProps>({
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });

  // SCHOOL COURSE SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    setIsEdit(false);
    if (schoolCourseData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
          ({ id }) => id === schoolCourseData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [schoolCourseData.schoolCourseId]);

  // SET SCHOOL COURSE NAME AND PRICE TO SCHOOL COURSE EDIT DATA
  useEffect(() => {
    if (schoolCourseSelectedData) {
      setSchoolCourseEditData({
        ...schoolCourseEditData,
        name: schoolCourseSelectedData?.name,
        priceUnit: schoolCourseSelectedData?.priceUnit,
        priceBundle: schoolCourseSelectedData?.priceBundle,
        bundleDays: schoolCourseSelectedData?.bundleDays,
      });
      setSchoolCourseData({
        ...schoolCourseData,
        priceUnit: schoolCourseSelectedData.priceUnit,
        priceBundle: schoolCourseSelectedData.priceBundle,
        bundleDays: schoolCourseSelectedData.bundleDays,
      });
    }
  }, [schoolCourseSelectedData]);

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
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
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
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });
    setSchoolCourseEditData({
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", schoolCourseEditData.name);
    setValue("priceUnit", schoolCourseEditData.priceUnit);
    setValue("priceBundle", schoolCourseEditData.priceBundle);
    setValue("bundleDays", schoolCourseEditData.bundleDays);
  }, [schoolCourseEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.priceUnit,
      errors.priceBundle,
      errors.bundleDays,
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

  // EDIT PRICE ON STUDENTS REGISTERS
  async function updatePriceOnStudentsData() {
    // SEARCH SCHOOL COURSE ON CURRICULUMS
    const foundedCurriculums: CurriculumSearchProps[] = [];
    curriculumDatabaseData.map((curriculum) => {
      if (curriculum.schoolCourseId === schoolCourseData.schoolCourseId) {
        foundedCurriculums.push(curriculum);
      }
    });
    // GETTING STUDENTS FROM CURRICULUMS
    if (foundedCurriculums.length > 0) {
      const foundedStudentsToEdit: StudentSearchProps[] = [];
      foundedCurriculums.map((foundedCurriculum) => {
        studentsDatabaseData.map((student) => {
          student.curriculumIds.map((curriculum) => {
            if (curriculum.id === foundedCurriculum.id) {
              foundedStudentsToEdit.push(student);
            }
          });
        });
      });
      // MAKING CHANGINGS ON ALL STUDENT
      if (foundedStudentsToEdit.length > 0) {
        foundedStudentsToEdit.map(async (student) => {
          if (student.curriculumIds.length <= 1) {
            // IF STUDENT HAS ONLY ONE CURRICULUM
            // CHANGING CURRICULUM STUDENT PRICES
            // REMOVING PREVIOUS DATA
            await updateDoc(doc(db, "students", student.id), {
              curriculumIds: arrayRemove({
                date: student.curriculumIds[0].date,
                id: student.curriculumIds[0].id,
                isExperimental: student.curriculumIds[0].isExperimental,
                indexDays: student.curriculumIds[0].indexDays,
                price: student.curriculumIds[0].price,
              }),
            });

            // WRITING UPDATED DATA
            if (student.curriculumIds[0].indexDays.length === 1) {
              await updateDoc(doc(db, "students", student.id), {
                curriculumIds: arrayUnion({
                  date: student.curriculumIds[0].date,
                  id: student.curriculumIds[0].id,
                  isExperimental: student.curriculumIds[0].isExperimental,
                  indexDays: student.curriculumIds[0].indexDays,
                  price: schoolCourseEditData.priceUnit,
                }),
              });
            }

            if (student.curriculumIds[0].indexDays.length > 1) {
              const result = Math.floor(
                student.curriculumIds[0].indexDays.length /
                  schoolCourseEditData.bundleDays
              );
              const rest =
                student.curriculumIds[0].indexDays.length %
                schoolCourseEditData.bundleDays;
              await updateDoc(doc(db, "students", student.id), {
                curriculumIds: arrayUnion({
                  date: student.curriculumIds[0].date,
                  id: student.curriculumIds[0].id,
                  isExperimental: student.curriculumIds[0].isExperimental,
                  indexDays: student.curriculumIds[0].indexDays,
                  price:
                    result * schoolCourseEditData.priceBundle +
                    rest * schoolCourseEditData.priceUnit,
                }),
              });
            }
          } else {
            // IF STUDENT HAS MORE THAN ONE CURRICULUM
            // CHANGING CURRICULUM PRICE ON STUDENT.CURRICULUMIDS
            student.curriculumIds.map((studentCurriculum) => {
              foundedCurriculums.map(async (foundedCurriculum) => {
                if (foundedCurriculum.id === studentCurriculum.id) {
                  // CHANGING CURRICULUM STUDENT PRICES
                  // REMOVING PREVIOUS DATA
                  await updateDoc(doc(db, "students", student.id), {
                    curriculumIds: arrayRemove({
                      date: studentCurriculum.date,
                      id: studentCurriculum.id,
                      isExperimental: studentCurriculum.isExperimental,
                      indexDays: studentCurriculum.indexDays,
                      price: studentCurriculum.price,
                    }),
                  });
                  // WRITING UPDATED DATA
                  if (studentCurriculum.indexDays.length === 1) {
                    await updateDoc(doc(db, "students", student.id), {
                      curriculumIds: arrayUnion({
                        date: studentCurriculum.date,
                        id: studentCurriculum.id,
                        isExperimental: studentCurriculum.isExperimental,
                        indexDays: studentCurriculum.indexDays,
                        price: schoolCourseEditData.priceUnit,
                      }),
                    });
                  }

                  if (studentCurriculum.indexDays.length > 1) {
                    const result = Math.floor(
                      studentCurriculum.indexDays.length /
                        schoolCourseEditData.bundleDays
                    );
                    const rest =
                      studentCurriculum.indexDays.length %
                      schoolCourseEditData.bundleDays;
                    await updateDoc(doc(db, "students", student.id), {
                      curriculumIds: arrayUnion({
                        date: studentCurriculum.date,
                        id: studentCurriculum.id,
                        isExperimental: studentCurriculum.isExperimental,
                        indexDays: studentCurriculum.indexDays,
                        price:
                          result * schoolCourseEditData.priceBundle +
                          rest * schoolCourseEditData.priceUnit,
                      }),
                    });
                  }
                }
              });
            });
          }
          await calcStudentPrice(student.id);
        });
      }
    }
  }

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
            priceUnit: data.priceUnit,
            priceBundle: data.priceBundle,
            bundleDays: data.bundleDays,
          }
        );
        // CHANGE PRICE ON STUDENTS REGISTERS
        if (
          schoolCourseData.priceUnit !== data.priceUnit ||
          schoolCourseData.priceBundle !== data.priceBundle ||
          schoolCourseData.bundleDays !== data.bundleDays
        ) {
          await updatePriceOnStudentsData();
        }
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
    const schoolCourse = schoolCourseDatabaseData.find(
      (schoolCourse) => schoolCourse.id === schoolCourseData.schoolCourseId
    );
    if (!schoolCourse) {
      // IF NOT EXISTS, RETURN ERROR
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
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

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
            <SelectOptions returnId dataType="schoolCourses" />
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

            {/* SCHOOL COURSE PRICE UNIT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="price"
                className={
                  errors.priceUnit
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Valor da aula avulsa:{" "}
              </label>
              <NumericFormat
                value={schoolCourseEditData.priceUnit}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
                prefix={"R$ "}
                onValueChange={(values) => {
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
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
                htmlFor="price"
                className={
                  errors.priceBundle
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Valor do pacote de aulas:{" "}
              </label>
              <NumericFormat
                value={schoolCourseEditData.priceBundle}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
                prefix={"R$ "}
                onValueChange={(values) => {
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
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
                Quantidade de aulas p/ semana no pacote:{" "}
              </label>
              <NumericFormat
                value={schoolCourseEditData.bundleDays}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                decimalScale={0}
                fixedDecimalScale
                onValueChange={(values) => {
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
                    bundleDays: values.floatValue ?? 0,
                  });
                }}
                className={
                  errors.bundleDays
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
