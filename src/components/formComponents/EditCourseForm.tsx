/* eslint-disable react-hooks/exhaustive-deps */
import { doc, DocumentData, getFirestore } from "firebase/firestore";
import { EditDashboardCourseButton } from "../layoutComponents/EditDashboardCourseButton";
import { app } from "../../db/Firebase";
import {
  CurriculumSearchProps,
  EditSchoolCourseValidationZProps,
  SchoolCourseSearchProps,
  StudentSearchProps,
} from "../../@types";
import { useContext, useEffect, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editSchoolCourseValidationSchema } from "../../@types/zodValidation";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { secureSetDoc, secureUpdateDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface EditCourseFormProps {
  schoolCourseSelectedData: SchoolCourseSearchProps;
  isSubmitting: boolean;
  isEdit: boolean;
  modal?: boolean;
  onClose?: () => void;
  setModal?: (option: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  handleDeleteCourse?: () => void;
  onCloseLogModal?: (schoolCourseId: string) => void; // Função para fechar o modal
}

export default function EditCourseForm({
  schoolCourseSelectedData,
  isSubmitting,
  isEdit,
  modal = false,
  setModal,
  onClose,
  setIsSubmitting,
  setIsEdit,
  handleDeleteCourse,
  onCloseLogModal,
}: EditCourseFormProps) {
  // GET GLOBAL DATA
  const {
    curriculumDb,
    schoolCoursesDb,
    studentsDb,
    handleConfirmationToSubmit,
    calculateStudentMonthlyFee,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHOOL COURSE EDIT DATA
  const [schoolCourseEditData, setSchoolCourseEditData] =
    useState<EditSchoolCourseValidationZProps>({
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });

  // SET SCHOOL COURSE NAME AND PRICE TO SCHOOL COURSE EDIT DATA
  useEffect(() => {
    if (schoolCourseSelectedData) {
      setSchoolCourseEditData({
        ...schoolCourseEditData,
        name: schoolCourseSelectedData.name,
        priceUnit: schoolCourseSelectedData.priceUnit,
        priceBundle: schoolCourseSelectedData.priceBundle,
        bundleDays: schoolCourseSelectedData.bundleDays,
      });
    }
  }, [schoolCourseSelectedData]);

  function resetCourseDataFunction() {
    setSchoolCourseEditData({
      ...schoolCourseEditData,
      name: schoolCourseSelectedData.name,
      priceUnit: schoolCourseSelectedData.priceUnit,
      priceBundle: schoolCourseSelectedData.priceBundle,
      bundleDays: schoolCourseSelectedData.bundleDays,
    });
    setIsEdit(!isEdit);
  }

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
    setSchoolCourseEditData({
      name: "",
      bundleDays: 0,
      priceBundle: 0,
      priceUnit: 0,
    });
    onClose && onClose();
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
    const curriculumsDbTransformed: CurriculumSearchProps[] = curriculumDb
      ? curriculumDb.map((doc: DocumentData) => ({
          ...(doc as CurriculumSearchProps),
        }))
      : [];
    curriculumsDbTransformed.map((curriculum) => {
      if (curriculum.schoolCourseId === schoolCourseSelectedData.id) {
        foundedCurriculums.push(curriculum);
      }
    });
    // GETTING STUDENTS FROM CURRICULUMS
    if (foundedCurriculums.length > 0) {
      const foundedStudentsToEdit: StudentSearchProps[] = [];
      foundedCurriculums.map((foundedCurriculum) => {
        const students = studentsDb as StudentSearchProps[];
        students.map((student) => {
          student.curriculums.map((curriculum) => {
            if (curriculum.id === foundedCurriculum.id) {
              foundedStudentsToEdit.push(student);
            }
          });
        });
      });
      // MAKING CHANGINGS ON ALL STUDENT
      if (foundedStudentsToEdit.length > 0) {
        foundedStudentsToEdit.map(async (student) => {
          const curriculums = student.curriculums.map((curriculum) => ({
            date: curriculum.date,
            id: curriculum.id,
            indexDays: curriculum.indexDays,
            isExperimental: curriculum.isExperimental,
            isWaiting: curriculum.isWaiting,
            price: 0,
          }));

          const fee = await calculateStudentMonthlyFee(student.id, {
            curriculums,
            customDiscount: student.customDiscount,
            customDiscountValue: student.customDiscountValue,
            employeeDiscount: student.employeeDiscount,
            familyDiscount: student.familyDiscount,
            secondCourseDiscount: student.secondCourseDiscount,
            studentFamilyAtSchool: student.studentFamilyAtSchool,
          });
          if (fee.studentFamilyToUpdate) {
            const studentValues = {
              secondCourseDiscount: fee.secondCourseDiscount,
              appliedPrice: fee.appliedPrice,
              familyDiscount: fee.familyDiscount,
              customDiscount: fee.customDiscount,
              customDiscountValue: fee.customDiscountValue,
              employeeDiscount: fee.employeeDiscount,
              familyId: student.id,
              fullPrice: fee.fullPrice,
            };
            const allFamilyPrices = [
              ...fee.studentFamilyToUpdate,
              studentValues,
            ];

            const allFamilyIds = allFamilyPrices.map(
              (family) => family.familyId
            );

            allFamilyPrices.map(async (family) => {
              if (family.familyId !== student.id) {
                await secureSetDoc(
                  doc(db, "students", family.familyId),
                  {
                    studentFamilyAtSchool: allFamilyIds.filter(
                      (student) => student !== family.familyId
                    ),
                    fullPrice: family.fullPrice,
                    appliedPrice: family.appliedPrice,
                    familyDiscount: family.familyDiscount,
                    customDiscount: family.customDiscount,
                    employeeDiscount: family.employeeDiscount,
                    customDiscountValue: family.customDiscountValue,
                    secondCourseDiscount: family.secondCourseDiscount,
                  },
                  { merge: true }
                );
              }
            });
          }
        });
      }
    }
  }

  // SUBMIT DATA FUNCTION
  const handleEditSchool: SubmitHandler<
    EditSchoolCourseValidationZProps
  > = async (data) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Editar Modalidade",
      text: "Tem certeza que deseja confirmar as mudanças?",
      icon: "question",
      confirmButtonText: "Sim, confirmar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      // EDIT SCHOOL COURSE FUNCTION
      const editSchoolCourse = async () => {
        try {
          await secureUpdateDoc(
            doc(db, "schoolCourses", schoolCourseSelectedData.id),
            {
              name: data.name,
              priceUnit: data.priceUnit,
              priceBundle: data.priceBundle,
              bundleDays: data.bundleDays,
            }
          );
          // CHANGE PRICE ON STUDENTS REGISTERS
          if (
            schoolCourseSelectedData.priceUnit !== data.priceUnit ||
            schoolCourseSelectedData.priceBundle !== data.priceBundle ||
            schoolCourseSelectedData.bundleDays !== data.bundleDays
          ) {
            await updatePriceOnStudentsData();
          }
          resetForm();
          toast.success(
            `${schoolCourseEditData.name} alterado com sucesso! 👌`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
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
      const schoolCoursesDbTransformed: SchoolCourseSearchProps[] =
        schoolCoursesDb
          ? schoolCoursesDb.map((doc: DocumentData) => ({
              ...(doc as SchoolCourseSearchProps),
            }))
          : [];
      const schoolCourse = schoolCoursesDbTransformed.find(
        (schoolCourse) => schoolCourse.id === schoolCourseSelectedData.id
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
    } else {
      setIsSubmitting(false);
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
            {!isEdit ? `Detalhes` : `Editando`} -{" "}
            {schoolCourseSelectedData.name}
          </p>
          <div className="flex relative justify-end px-2 w-full z-50">
            <EditDashboardCourseButton
              isEdit={isEdit}
              handleDeleteCourse={handleDeleteCourse && handleDeleteCourse}
              resetCourseData={resetCourseDataFunction}
              setIsEdit={setIsEdit}
              setModal={setModal && setModal}
              id={schoolCourseSelectedData.id}
              onCloseLogModal={onCloseLogModal}
            />
          </div>
        </div>
      )}
      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditSchool)}
        className={`flex flex-col w-full gap-2 p-4 ${
          modal
            ? "rounded-b-xl bg-klGreen-500/20 dark:bg-klGreen-500/30"
            : "mt-2"
        }`}
      >
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
            disabled={!isEdit ? true : isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o nome da Modalidade"
                : "Insira o nome da Modalidade"
            }
            className={
              errors.name
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
            Mensalidade 1x por semana:{" "}
          </label>
          <NumericFormat
            disabled={!isEdit ? true : isSubmitting}
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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
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
            Mensalidade do pacote de aulas:{" "}
          </label>
          <NumericFormat
            disabled={!isEdit ? true : isSubmitting}
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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
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
            Número de aulas por semana no pacote:{" "}
          </label>
          <NumericFormat
            disabled={!isEdit ? true : isSubmitting}
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
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-red-100 rounded-2xl cursor-default"
            }
          />
        </div>

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
