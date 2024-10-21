/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input-field";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  arrayRemove,
  arrayUnion,
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
  CurriculumSearchProps,
  EditSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  employeeDiscountValue,
  familyDiscountValue,
  secondCourseDiscountValue,
} from "../../custom";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditCourse() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolCourseDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
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
    setValue(
      "priceUnit",
      schoolCourseData.priceUnit !== schoolCourseEditData.priceUnit / 100
        ? schoolCourseEditData.priceUnit / 100
        : schoolCourseEditData.priceUnit
    );
    setValue(
      "priceBundle",
      schoolCourseData.priceBundle !== schoolCourseEditData.priceBundle / 100
        ? schoolCourseEditData.priceBundle / 100
        : schoolCourseEditData.priceBundle
    );
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
    // SEARCH SCHOOLCOURSE ON CURRICULUMS
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
          // DISCOUNT VARIABLE
          // const customDiscountValueSum = 100 - +student.customDiscountValue;
          // const customDiscountFinalValue = +`0.${
          //   customDiscountValueSum > 9
          //     ? customDiscountValueSum
          //     : `0${customDiscountValueSum}`
          // }`;

          // const discountVariable = student.customDiscount
          //   ? customDiscountFinalValue
          //   : student.employeeDiscount
          //   ? employeeDiscountValue
          //   : familyDiscountValue;

          if (student.curriculumIds.length <= 1) {
            // IF STUDENT HAS ONLY ONE CURRICULUM
            // CHANGING CURRICULUM STUDENT PRICES
            // REMOVING PREVIOUS DATA
            await updateDoc(doc(db, "students", student.id), {
              curriculumIds: arrayRemove({
                date: student.curriculumIds[0].date,
                id: student.curriculumIds[0].id,
                isExperimental: student.curriculumIds[0].isExperimental,
                name: student.curriculumIds[0].name,
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
                  name: student.curriculumIds[0].name,
                  indexDays: student.curriculumIds[0].indexDays,
                  price: schoolCourseEditData.priceUnit / 100,
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
                  name: student.curriculumIds[0].name,
                  indexDays: student.curriculumIds[0].indexDays,
                  price:
                    result * (schoolCourseEditData.priceBundle / 100) +
                    rest * (schoolCourseEditData.priceUnit / 100),
                }),
              });
            }

            // // CALCULATE AND CHANGING TOTAL STUDENT PRICES
            // if (
            //   student.customDiscount ||
            //   student.employeeDiscount ||
            //   student.familyDiscount
            // ) {
            //   // WITH DISCOUNT
            //   const priceUnitDiscount = +(
            //     (schoolCourseEditData.priceUnit / 100) *
            //     discountVariable
            //   ).toFixed(2);

            //   const priceBundleDiscount = +(
            //     (schoolCourseEditData.priceBundle / 100) *
            //     discountVariable
            //   ).toFixed(2);

            //   if (student.curriculumIds[0].indexDays.length === 1) {
            //     await updateDoc(doc(db, "students", student.id), {
            //       fullPrice: schoolCourseEditData.priceUnit / 100,
            //       appliedPrice: priceUnitDiscount,
            //     });
            //   }

            //   if (student.curriculumIds[0].indexDays.length > 1) {
            //     const result = Math.floor(
            //       student.curriculumIds[0].indexDays.length /
            //         schoolCourseEditData.bundleDays
            //     );
            //     const rest =
            //       student.curriculumIds[0].indexDays.length %
            //       schoolCourseEditData.bundleDays;
            //     await updateDoc(doc(db, "students", student.id), {
            //       appliedPrice:
            //         result * priceBundleDiscount + rest * priceUnitDiscount,
            //       fullPrice:
            //         (result * schoolCourseEditData.priceBundle) / 100 +
            //         (rest * schoolCourseEditData.priceUnit) / 100,
            //     });
            //   }
            // } else {
            //   // WITHOUT DISCOUNT
            //   if (student.curriculumIds[0].indexDays.length === 1) {
            //     await updateDoc(doc(db, "students", student.id), {
            //       appliedPrice: schoolCourseEditData.priceUnit / 100,
            //       fullPrice: schoolCourseEditData.priceUnit / 100,
            //     });
            //   }
            //   if (student.curriculumIds[0].indexDays.length > 1) {
            //     const result = Math.floor(
            //       student.curriculumIds[0].indexDays.length /
            //         schoolCourseEditData.bundleDays
            //     );
            //     const rest =
            //       student.curriculumIds[0].indexDays.length %
            //       schoolCourseEditData.bundleDays;
            //     await updateDoc(doc(db, "students", student.id), {
            //       appliedPrice:
            //         result * (schoolCourseEditData.priceBundle / 100) +
            //         rest * (schoolCourseEditData.priceUnit / 100),
            //       fullPrice:
            //         result * (schoolCourseEditData.priceBundle / 100) +
            //         rest * (schoolCourseEditData.priceUnit / 100),
            //     });
            //   }
            // }
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
                      name: studentCurriculum.name,
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
                        name: studentCurriculum.name,
                        indexDays: studentCurriculum.indexDays,
                        price: schoolCourseEditData.priceUnit / 100,
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
                        name: studentCurriculum.name,
                        indexDays: studentCurriculum.indexDays,
                        price:
                          result * (schoolCourseEditData.priceBundle / 100) +
                          rest * (schoolCourseEditData.priceUnit / 100),
                      }),
                    });
                  }
                }
              });
            });
          }
          const userRef = collection(db, "students");
          const q = query(userRef, where("id", "==", student.id));
          const querySnapshot = await getDocs(q);
          const promises: StudentSearchProps[] = [];
          querySnapshot.forEach((doc) => {
            const promise = doc.data() as StudentSearchProps;
            promises.push(promise);
          });
          Promise.all(promises).then((results) => {
            const studentToCalcPrices = results;
            studentToCalcPrices.map(async (student) => {
              // DISCOUNT VARIABLE
              const customDiscountValueSum = 100 - +student.customDiscountValue;
              const customDiscountFinalValue = +`0.${
                customDiscountValueSum > 9
                  ? customDiscountValueSum
                  : `0${customDiscountValueSum}`
              }`;

              const discountVariable = student.customDiscount
                ? customDiscountFinalValue
                : student.employeeDiscount
                ? employeeDiscountValue
                : student.familyDiscount
                ? familyDiscountValue
                : student.secondCourseDiscount
                ? secondCourseDiscountValue
                : 1; // WITHOUT DISCOUNT

              // CALC OF FULL AND APPLY PRICE OF STUDENT
              let smallestPrice = 0;
              let otherSumPrices = 0;
              let olderSmallestPrice = 0;
              student.curriculumIds.map(async (studentCurriculum, index) => {
                if (index === 0) {
                  smallestPrice = studentCurriculum.price;
                } else {
                  if (studentCurriculum.price <= smallestPrice) {
                    olderSmallestPrice = smallestPrice;
                    smallestPrice = studentCurriculum.price;
                    otherSumPrices = olderSmallestPrice + otherSumPrices;
                  } else {
                    otherSumPrices = otherSumPrices + studentCurriculum.price;
                  }
                }
              });
              await updateDoc(doc(db, "students", student.id), {
                appliedPrice: smallestPrice * discountVariable + otherSumPrices,
                fullPrice: smallestPrice + otherSumPrices,
              });
            });
          });
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
              <CurrencyInput
                name="price"
                placeholder={
                  errors.priceUnit
                    ? "É necessário inserir o valor mensal da aula avulsa"
                    : "Insira o valor mensal da aula avulsa"
                }
                defaultValue={schoolCourseEditData.priceUnit}
                decimalsLimit={2}
                decimalScale={2}
                prefix="R$"
                decimalSeparator=","
                groupSeparator="."
                disableAbbreviations
                onValueChange={(value) =>
                  value &&
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
                    priceUnit: +value.replace(/\D/g, ""),
                  })
                }
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
              <CurrencyInput
                name="price"
                placeholder={
                  errors.priceBundle
                    ? "É necessário inserir o valor mensal do pacote de aulas"
                    : "Insira o valor mensal do pacote de aulas"
                }
                defaultValue={schoolCourseEditData.priceBundle}
                decimalsLimit={2}
                decimalScale={2}
                prefix="R$"
                decimalSeparator=","
                groupSeparator="."
                disableAbbreviations
                onValueChange={(value) =>
                  value &&
                  setSchoolCourseEditData({
                    ...schoolCourseEditData,
                    priceBundle: +value.replace(/\D/g, ""),
                  })
                }
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
              <CurrencyInput
                name="bundleDays"
                placeholder={
                  errors.bundleDays
                    ? "É necessário inserir a quantidade de aulas p/ semana no pacote"
                    : "Insira a quantidade de aulas p/ semana no pacote"
                }
                defaultValue={schoolCourseEditData.bundleDays}
                decimalsLimit={0}
                disableAbbreviations
                onValueChange={(value) =>
                  value
                    ? setSchoolCourseEditData({
                        ...schoolCourseEditData,
                        bundleDays: +value.replace(/\D/g, ""),
                      })
                    : null
                }
                className={
                  errors.bundleDays
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
