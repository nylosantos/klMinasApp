/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  getFirestore,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { editStudentValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  CurriculumStateProps,
  CurriculumToAddProps,
  EditStudentValidationZProps,
  HandleClickOpenFunctionProps,
  StudentFreeDayProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import EditDashboardHeader from "../layoutComponents/EditDashboardHeader";
import FinancialResponsibleForm from "./FinancialResponsibleForm";
import ParentForm from "./ParentForm";
import PersonalDataForm from "./PersonalDataForm";
import ShowCurriculums from "./ShowCurriculums";
import { MdAdd } from "react-icons/md";
import SelectSchoolAndCourse from "./SelectSchoolAndCourse";
import { DiscountForm } from "./DiscountForm";
import { PaymentDetails } from "../layoutComponents/PaymentDetails";
import CurriculumBalloon from "../layoutComponents/CurriculumBaloon";
import FamilyFormSelect from "./FamilyFormSelect";
import ShowFamily from "./ShowFamily";
import ActiveStudent from "./ActiveStudent";
import { secureSetDoc, secureUpdateDoc } from "../../hooks/firestoreMiddleware";

export type NewPricesProps = {
  appliedPrice: number;
  fullPrice: number;
};

type StudentDataProps = {
  schoolId: string;
  schoolClassId: string;
  curriculumId: string;
  schoolCoursePriceUnit: number;
  schoolCoursePriceBundle: number;
  schoolCourseBundleDays: number;
  studentId: string;
};

interface EditStudentFormProps {
  studentId: string;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setStudentData?: (studentData: StudentDataProps) => void;
  onClose?: () => void;
  onlyView?: boolean;

  isEdit?: boolean;
  isFinance?: boolean;
  isFinancialResponsible?: boolean;
  open?: boolean;

  handleClickOpen?: ({ id, option }: HandleClickOpenFunctionProps) => void;
  handleDeleteUser?: () => void;
  toggleActiveUser?: () => void;
  setIsEdit?: (option: boolean) => void;
  setIsFinance?: (option: boolean) => void;
  setIsDetailsViewing?: (option: boolean) => void;
}

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditStudentForm({
  studentId,
  isSubmitting,
  setIsSubmitting,
  setStudentData,
  onClose,
  onlyView = false,
  isEdit = false,
  isFinance = false,
  isFinancialResponsible = false,
  open = false,
  handleClickOpen,
  handleDeleteUser,
  toggleActiveUser,
  setIsEdit,
  setIsFinance,
  setIsDetailsViewing,
}: EditStudentFormProps) {
  // GET GLOBAL DATA
  const {
    curriculumDb,
    studentsDb,
    page,
    userFullData,
    systemConstantsValues,
    calculateEnrollmentFee,
    calculateStudentMonthlyFee,
    handleConfirmationToSubmit,
    getRegularCurriculums,
    getExperimentalCurriculums,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // STUDENT EDIT DATA
  const [studentEditData, setStudentEditData] =
    useState<EditStudentValidationZProps>({
      // Section 1: Student Data
      id: "",
      active: true,
      name: "",
      document: "",
      birthDate: "",
      schoolYears: "",
      schoolYearsComplement: "",
      parentOne: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          number: "",
        },
      },
      parentTwo: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          number: "",
        },
      },

      // Section 2: Student Course and Family Data | Prices
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
      studentFamilyAtSchool: [],
      enrolmentExemption: false,
      enrolmentFee: 0,
      enrolmentFeePaid: false,
      customDiscount: false,
      customDiscountValue: "0",
      employeeDiscount: false,
      familyDiscount: false,
      secondCourseDiscount: false,
      fullPrice: 0,
      appliedPrice: 0,
      paymentDay: "",

      // Section 3: Student Financial Responsible Data
      financialResponsible: {
        name: "",
        document: "",
        email: "",
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          cep: "",
        },
        phone: {
          ddd: "",
          number: "",
        },
        activePhoneSecondary: false,
        phoneSecondary: {
          ddd: "",
          number: "",
        },
        activePhoneTertiary: false,
        phoneTertiary: {
          ddd: "",
          number: "",
        },
      },
    });

  const [curriculumState, setCurriculumState] = useState<CurriculumStateProps>({
    curriculums: [],
    fullPrice: 0,
    appliedPrice: 0,
    enrollmentFee: 0,
  });

  const [removedCurriculums, setRemovedCurriculums] = useState<
    CurriculumToAddProps[]
  >([]);

  const [newAddCurriculums, setNewAddCurriculums] = useState<
    CurriculumToAddProps[]
  >([]);

  const [removedFamily, setRemovedFamily] = useState<string[]>([]);

  const [newAddFamily, setNewAddFamily] = useState<string[]>([]);

  const [studentFreeDays, setStudentFreeDays] = useState<StudentFreeDayProps[]>(
    [
      { day: 0, curriculumId: null },
      { day: 1, curriculumId: null },
      { day: 2, curriculumId: null },
      { day: 3, curriculumId: null },
      { day: 4, curriculumId: null },
      { day: 5, curriculumId: null },
      { day: 6, curriculumId: null },
    ]
  );

  // RESET STATES WHEN ONLYVIEW CHANGE
  useEffect(() => {
    setCurriculumCount(0);
    setRemovedCurriculums([]);
    setStudentEditData((prevData) => ({
      ...prevData,
      studentFamilyAtSchool: prevData.studentFamilyAtSchool.filter(
        (studentId) => studentId !== ""
      ),
    }));
  }, [onlyView]);

  // UPDATE CURRICULUM FROM CURRICULUM STATE
  const removeCurriculum = (id: string) => {
    setCurriculumState((prevState) => {
      // Encontramos o currículo que será removido antes de atualizar o estado
      const curriculumToRemove = prevState.curriculums.find(
        (curriculum) => curriculum.id === id
      );

      if (!curriculumToRemove) return prevState; // Se não encontrou, retorna o estado inalterado

      return {
        ...prevState,
        // Remove o currículo do array
        curriculums: prevState.curriculums.filter(
          (curriculum) => curriculum.id !== id
        ),
      };
    });
  };

  // STUDENT FREE DAYS UPDATE
  useEffect(() => {
    // Atualiza o estado de studentFreeDays com base na comparação entre curriculums e removedCurriculums
    setStudentFreeDays((prevStudentFreeDays) => {
      // Copia os valores atuais de studentFreeDays
      const updatedStudentFreeDays = [...prevStudentFreeDays];

      // Para cada currículo que ainda está em curriculumState.curriculums
      curriculumState.curriculums.forEach((curriculum) => {
        // Verifica se o currículo não foi removido (não está em removedCurriculums)
        const isRemoved = removedCurriculums.some(
          (removed) => removed.id === curriculum.id
        );

        // Se não está em removedCurriculums, atualiza o curriculumId nos dias correspondentes
        curriculum.indexDays.forEach((day) => {
          const index = updatedStudentFreeDays.findIndex(
            (studentDay) => studentDay.day === day
          );

          if (index !== -1) {
            updatedStudentFreeDays[index] = {
              ...updatedStudentFreeDays[index],
              curriculumId: isRemoved ? null : curriculum.id, // Se for removido, define como null, senão coloca o id do currículo
            };
          }
        });
      });

      return updatedStudentFreeDays;
    });
  }, [removedCurriculums, curriculumState.curriculums]); // Dependências: removedCurriculums e curriculumState.curriculums

  // UPDATE CURRICULUM IN CURRICULUM STATE
  const upsertCurriculum = (newCurriculum: CurriculumToAddProps) => {
    // console.log("newCurriculum:", newCurriculum);

    setCurriculumState((prevState) => {
      // console.log("PrevState:", prevState);

      // Cópia do estado atual
      const curriculumsCopy = structuredClone(prevState.curriculums); // Evita mutação
      // console.log("Curriculums Copy:", curriculumsCopy);

      // Criar um mapa de currículos
      const curriculumsMap = new Map(curriculumsCopy.map((c) => [c.id, c]));
      // console.log(
      //   "Curriculums Map (antes da modificação):",
      //   Array.from(curriculumsMap.entries())
      // );

      // Criar um clone real do currículo recebido
      const updatedCurriculum = {
        ...newCurriculum,
        indexDays: [...newCurriculum.indexDays], // Copia profunda do array
      };
      // console.log(
      //   "Novo Currículo (cópia real) (antes de modificar os dias):",
      //   updatedCurriculum
      // );

      if (!updatedCurriculum.isExperimental) {
        // Filtrar currículos regulares EXCLUINDO o que está sendo editado
        const occupiedDays = curriculumsCopy
          .filter(
            (curriculum) =>
              !removedCurriculums.some(
                (removed) => removed.id === curriculum.id
              )
          )
          .filter((c) => !c.isExperimental && c.id !== updatedCurriculum.id)
          .flatMap((c) => c.indexDays);

        // console.log(
        //   "Dias ocupados (outros currículos regulares, excluindo o atual):",
        //   occupiedDays
        // );

        // Atualiza os dias, removendo apenas os já ocupados pelos outros currículos
        updatedCurriculum.indexDays = updatedCurriculum.indexDays.filter(
          (day) => !occupiedDays.includes(day)
        );

        // console.log(
        //   "Dias do novo currículo após filtragem (sem excluir os próprios dias):",
        //   updatedCurriculum.indexDays
        // );
      } else {
        updatedCurriculum.indexDays = [];
        // console.log(
        //   "Currículo é experimental, indexDays resetado para:",
        //   updatedCurriculum.indexDays
        // );
      }

      // Atualizar o mapa
      curriculumsMap.set(updatedCurriculum.id, { ...updatedCurriculum });

      // console.log(
      //   "Curriculums Map (após adição/atualização):",
      //   Array.from(curriculumsMap.entries())
      // );

      // Criar um novo estado imutável
      const newState = {
        ...prevState,
        curriculums: Array.from(curriculumsMap.values()),
      };
      // console.log("Novo estado antes de ser retornado:", newState);

      return newState;
    });
  };

  // CALL PRICE FUNCTION
  useEffect(() => {
    const fetchStudentMonthlyFee = async () => {
      try {
        const curriculums = curriculumState.curriculums
          .filter(
            (curriculum) =>
              !removedCurriculums.some(
                (removed) => removed.id === curriculum.id
              )
          )
          .map((curriculum) => ({
            date: curriculum.date,
            id: curriculum.id,
            indexDays: curriculum.indexDays,
            isExperimental: curriculum.isExperimental,
            isWaiting: curriculum.isWaiting,
            price: 0,
          }));

        const fee = await calculateStudentMonthlyFee(studentEditData.id, {
          curriculums,
          customDiscount: studentEditData.customDiscount,
          customDiscountValue: studentEditData.customDiscountValue || "0",
          employeeDiscount: studentEditData.employeeDiscount,
          familyDiscount: studentEditData.familyDiscount,
          secondCourseDiscount: studentEditData.secondCourseDiscount,
          studentFamilyAtSchool: studentEditData.studentFamilyAtSchool.filter(
            (family) => !removedFamily.includes(family)
          ),
        });

        setCurriculumState((prevState) => ({
          ...prevState,
          appliedPrice: fee.appliedPrice,
          fullPrice: fee.fullPrice,
        }));
        setStudentEditData((prevData) => ({
          ...prevData,
          secondCourseDiscount: fee.secondCourseDiscount,
        }));
        setCurriculumState((prevState) => ({
          ...prevState,
          enrollmentFee:
            getRegularCurriculums(curriculumState.curriculums).length > 0
              ? calculateEnrollmentFee(studentEditData.enrolmentExemption)
              : 0,
        }));
      } catch (error) {
        console.error("Erro ao calcular a mensalidade do aluno:", error);
      }
    };

    if (curriculumState.curriculums.length > 0) {
      fetchStudentMonthlyFee();
    } else {
      setCurriculumState((prevState) => ({
        ...prevState,
        appliedPrice: 0,
        fullPrice: 0,
        enrollmentFee: 0,
      }));
    }
  }, [
    curriculumState.curriculums,
    studentEditData.familyDiscount,
    studentEditData.customDiscount,
    studentEditData.customDiscountValue,
    studentEditData.employeeDiscount,
    studentEditData.enrolmentExemption,
    studentEditData.studentFamilyAtSchool,
    removedCurriculums,
    removedFamily,
  ]);

  // Estado local para controlar quantos SelectSchoolAndCourse devem ser renderizados
  const [curriculumCount, setCurriculumCount] = useState<number>(0); // Começa com 0

  // Função para adicionar um novo currículo (apenas aumenta o contador)
  const handleAddCurriculum = () => {
    setCurriculumCount((prevCount) => prevCount + 1); // Aumenta o contador para renderizar mais um SelectSchoolAndCourse
  };

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // TEST FINANCIAL STUDENT CPF (BRAZILIAN DOCUMENT) STATE
  const [testCPF, setTestCPF] = useState(true);

  // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
  useEffect(() => {
    if (studentEditData.customDiscount) {
      setStudentEditData({ ...studentEditData, customDiscountValue: "0" });
    }
  }, [studentEditData.customDiscount]);

  // STUDENT SELECTED STATE DATA
  const [studentSelectedData, setStudentSelectedData] =
    useState<StudentSearchProps>();

  // SET PHONE FORMATTED
  useEffect(() => {
    if (studentSelectedData) {
      setStudentEditData({
        ...studentEditData,
        financialResponsible: {
          ...studentEditData.financialResponsible,
          phoneSecondary: {
            ...studentEditData.financialResponsible.phoneSecondary,
            ddd: studentEditData.financialResponsible.activePhoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary !== ""
                ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                    3,
                    5
                  )
                : "DDD"
              : "DDD",
            number: studentEditData.financialResponsible.activePhoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  -9
                )
              : "",
          },
          phoneTertiary: {
            ...studentEditData.financialResponsible.phoneTertiary,
            ddd: studentEditData.financialResponsible.activePhoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary !== ""
                ? studentSelectedData.financialResponsible.phoneTertiary.slice(
                    3,
                    5
                  )
                : "DDD"
              : "DDD",
            number: studentEditData.financialResponsible.activePhoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(-9)
              : "",
          },
        },
      });
    }
  }, [
    studentEditData.financialResponsible.activePhoneSecondary,
    studentEditData.financialResponsible.activePhoneTertiary,
  ]);

  // SET STUDENT SELECTED STATE WITH RECEIVED ID
  useEffect(() => {
    if (studentId !== "") {
      const students = studentsDb as StudentSearchProps[];
      students.map((student) => {
        if (student.id === studentId) {
          setStudentSelectedData(student);
        }
      });
    }
  }, [studentId]);

  // SET STUDENT EDIT WHEN SELECT STUDENT
  useEffect(() => {
    if (studentSelectedData) {
      setDateToString(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        // studentSelectedData.birthDate.toDate()
        studentSelectedData.birthDate.toDate().toLocaleDateString()
      );
      // SET STUDENT EDIT ALL DATA
      setStudentEditData({
        ...studentEditData,
        // Section 1: Student Data
        id: studentId,
        active: studentSelectedData.active,
        name: studentSelectedData.name,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        birthDate: studentSelectedData.birthDate.toDate().toLocaleDateString(),
        document: studentSelectedData.document,
        schoolYears: studentSelectedData.schoolYears,
        schoolYearsComplement: studentSelectedData.schoolYearsComplement,
        parentOne: {
          name: studentSelectedData.parentOne.name,
          email: studentSelectedData.parentOne.email,
          phone: {
            ddd: studentSelectedData.parentOne.phone.slice(3, 5),
            number: studentSelectedData.parentOne.phone.slice(-9),
          },
        },
        parentTwo: {
          name: studentSelectedData.parentTwo.name,
          email: studentSelectedData.parentTwo.email,
          phone: {
            ddd: studentSelectedData.parentTwo.phone.slice(3, 5),
            number: studentSelectedData.parentTwo.phone.slice(-9),
          },
        },

        // Section 2: Student Course and Family Data | Prices
        enrolmentExemption: studentSelectedData.enrolmentExemption,
        enrolmentFee: studentSelectedData.enrolmentFee,
        enrolmentFeePaid: studentSelectedData.enrolmentFeePaid,
        fullPrice: studentSelectedData.fullPrice,
        appliedPrice: studentSelectedData.appliedPrice,
        customDiscount: studentSelectedData.customDiscount,
        customDiscountValue: studentSelectedData.customDiscountValue,
        employeeDiscount: studentSelectedData.employeeDiscount,
        familyDiscount: studentSelectedData.familyDiscount,
        studentFamilyAtSchool: studentSelectedData.studentFamilyAtSchool,
        secondCourseDiscount: studentSelectedData.secondCourseDiscount,
        paymentDay: studentSelectedData.paymentDay!,

        // Section 3: Student Financial Responsible Data
        financialResponsible: {
          name: studentSelectedData.financialResponsible.name,
          document: studentSelectedData.financialResponsible.document,
          email: studentSelectedData.financialResponsible.email,
          address: {
            street: studentSelectedData.financialResponsible.address.street,
            number: studentSelectedData.financialResponsible.address.number,
            complement:
              studentSelectedData.financialResponsible.address.complement,
            neighborhood:
              studentSelectedData.financialResponsible.address.neighborhood,
            city: studentSelectedData.financialResponsible.address.city,
            state: studentSelectedData.financialResponsible.address.state,
            cep: studentSelectedData.financialResponsible.address.cep,
          },
          phone: {
            ddd: studentSelectedData.financialResponsible.phone.slice(3, 5),
            number: studentSelectedData.financialResponsible.phone.slice(-9),
          },
          activePhoneSecondary:
            studentSelectedData.financialResponsible.phoneSecondary !== ""
              ? true
              : false,
          phoneSecondary: {
            ddd: studentSelectedData.financialResponsible.phoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  3,
                  5
                )
              : "DDD",
            number: studentSelectedData.financialResponsible.phoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  -9
                )
              : "",
          },
          activePhoneTertiary:
            studentSelectedData.financialResponsible.phoneTertiary !== ""
              ? true
              : false,
          phoneTertiary: {
            ddd: studentSelectedData.financialResponsible.phoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(
                  3,
                  5
                )
              : "DDD",
            number: studentSelectedData.financialResponsible.phoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(-9)
              : "",
          },
        },
      });
      setCurriculumState({
        appliedPrice: studentSelectedData.appliedPrice,
        fullPrice: studentSelectedData.fullPrice,
        enrollmentFee: studentSelectedData.enrolmentFee,
        curriculums: studentSelectedData.curriculums,
      });
    }
  }, [studentSelectedData]);

  // DATE TO STRING STATE
  const [dateToString, setDateToString] = useState("");

  // EDIT ADDRESS STATE
  const [editAddress, setEditAddress] = useState(false);

  // REACT HOOK FORM SETTINGS
  const methods = useForm<EditStudentValidationZProps>({
    resolver: zodResolver(editStudentValidationSchema),
    defaultValues: {
      // Section 1: Student Data
      id: "",
      name: "",
      birthDate: "",
      schoolYears: "",
      schoolYearsComplement: "",
      parentOne: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          number: "",
        },
      },
      parentTwo: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          number: "",
        },
      },

      // Section 2: Student Course and Family Data | Prices
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
      enrolmentFee: 0,
      enrolmentFeePaid: false,
      fullPrice: 0,
      appliedPrice: 0,
      enrolmentExemption: false,
      customDiscount: false,
      customDiscountValue: "",
      employeeDiscount: false,
      familyDiscount: false,
      secondCourseDiscount: false,
      paymentDay: "",

      // Section 3: Student Financial Responsible Data
      financialResponsible: {
        name: "",
        document: "",
        email: "",
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          cep: "",
        },
        phone: {
          ddd: "",
          number: "",
        },
        activePhoneSecondary: false,
        phoneSecondary: {
          ddd: "",
          number: "",
        },
        activePhoneTertiary: false,
        phoneTertiary: {
          ddd: "",
          number: "",
        },
      },
    },
  });

  // REACT HOOK FORM VARIABLES
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const [renewBirthDayValue, setRenewBirthDayValue] = useState(false);

  // RESET FORM FUNCTION
  const resetForm = () => {
    setRenewBirthDayValue(!renewBirthDayValue);
    setStudentEditData({
      // Section 1: Student Data
      id: "",
      active: true,
      name: "",
      document: "",
      birthDate: "",
      schoolYears: "",
      schoolYearsComplement: "",
      parentOne: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          number: "",
        },
      },
      parentTwo: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          number: "",
        },
      },

      // Section 2: Student Course and Family Data | Prices
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
      studentFamilyAtSchool: [],
      enrolmentExemption: false,
      enrolmentFee: 0,
      enrolmentFeePaid: false,
      customDiscount: false,
      customDiscountValue: "",
      employeeDiscount: false,
      familyDiscount: false,
      secondCourseDiscount: false,
      fullPrice: 0,
      appliedPrice: 0,
      paymentDay: "",

      // Section 3: Student Financial Responsible Data
      financialResponsible: {
        name: "",
        document: "",
        email: "",
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          cep: "",
        },
        phone: {
          ddd: "",
          number: "",
        },
        activePhoneSecondary: false,
        phoneSecondary: {
          ddd: "",
          number: "",
        },
        activePhoneTertiary: false,
        phoneTertiary: {
          ddd: "",
          number: "",
        },
      },
    });
    setStudentData &&
      setStudentData({
        schoolId: "",
        schoolClassId: "",
        curriculumId: "",
        studentId: "",
        schoolCoursePriceUnit: 0,
        schoolCoursePriceBundle: 0,
        schoolCourseBundleDays: 0,
      });
    reset();
    onClose && onClose();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    // Section 1: Student Data
    setValue("id", studentEditData.id);
    setValue("active", studentEditData.active);
    setValue("name", studentEditData.name);
    setValue("birthDate", studentEditData.birthDate);
    setValue("document", studentEditData.document);
    setValue("schoolYears", studentEditData.schoolYears);
    setValue("schoolYearsComplement", studentEditData.schoolYearsComplement);
    setValue("parentOne.name", studentEditData.parentOne.name);
    setValue("parentOne.phone.ddd", studentEditData.parentOne.phone.ddd);
    setValue("parentOne.phone.number", studentEditData.parentOne.phone.number);
    setValue("parentOne.email", studentEditData.parentOne.email);
    setValue("parentTwo.name", studentEditData.parentTwo.name);
    setValue("parentTwo.phone.ddd", studentEditData.parentTwo.phone.ddd);
    setValue("parentTwo.phone.number", studentEditData.parentTwo.phone.number);
    setValue("parentTwo.email", studentEditData.parentTwo.email);

    // Section 2: Student Course and Family Data | Prices
    setValue("enrolmentExemption", studentEditData.enrolmentExemption);
    setValue("customDiscount", studentEditData.customDiscount);
    setValue(
      "customDiscountValue",
      studentEditData.customDiscountValue
        ? studentEditData.customDiscountValue
        : "0"
    );
    setValue("employeeDiscount", studentEditData.employeeDiscount);
    setValue("familyDiscount", studentEditData.familyDiscount);
    setValue("secondCourseDiscount", studentEditData.secondCourseDiscount);
    setValue("paymentDay", studentEditData.paymentDay);
    setValue("addCurriculum", studentEditData.addCurriculum);
    setValue(
      "addExperimentalCurriculum",
      studentEditData.addExperimentalCurriculum
    );
    setValue("addFamily", studentEditData.addFamily);
    setValue("studentFamilyAtSchool", studentEditData.studentFamilyAtSchool);
    setValue("enrolmentFee", curriculumState.enrollmentFee);
    setValue("fullPrice", curriculumState.fullPrice);
    setValue("appliedPrice", curriculumState.appliedPrice);
    setValue("customDiscount", studentEditData.customDiscount);
    setValue("customDiscountValue", studentEditData.customDiscountValue);
    setValue("employeeDiscount", studentEditData.employeeDiscount);
    setValue("enrolmentExemption", studentEditData.enrolmentExemption);
    setValue("familyDiscount", studentEditData.familyDiscount);
    setValue("secondCourseDiscount", studentEditData.secondCourseDiscount);

    // Section 3: Student Financial Responsible Data
    setValue(
      "financialResponsible.name",
      studentEditData.financialResponsible.name
    );
    setValue(
      "financialResponsible.document",
      studentEditData.financialResponsible.document
    );
    setValue(
      "financialResponsible.email",
      studentEditData.financialResponsible.email
    );
    setValue(
      "financialResponsible.address.street",
      studentEditData.financialResponsible.address.street
    );
    setValue(
      "financialResponsible.address.number",
      studentEditData.financialResponsible.address.number
    );
    setValue(
      "financialResponsible.address.complement",
      studentEditData.financialResponsible.address.complement
    );
    setValue(
      "financialResponsible.address.neighborhood",
      studentEditData.financialResponsible.address.neighborhood
    );
    setValue(
      "financialResponsible.address.city",
      studentEditData.financialResponsible.address.city
    );
    setValue(
      "financialResponsible.address.state",
      studentEditData.financialResponsible.address.state
    );
    setValue(
      "financialResponsible.address.cep",
      studentEditData.financialResponsible.address.cep
    );
    setValue(
      "financialResponsible.phone.ddd",
      studentEditData.financialResponsible.phone.ddd
    );
    setValue(
      "financialResponsible.phone.number",
      studentEditData.financialResponsible.phone.number
    );
    setValue(
      "financialResponsible.activePhoneSecondary",
      studentEditData.financialResponsible.activePhoneSecondary
    );
    setValue(
      "financialResponsible.phoneSecondary.ddd",
      studentEditData.financialResponsible.phoneSecondary.ddd
    );
    setValue(
      "financialResponsible.phoneSecondary.number",
      studentEditData.financialResponsible.phoneSecondary.number
    );
    setValue(
      "financialResponsible.activePhoneTertiary",
      studentEditData.financialResponsible.activePhoneTertiary
    );
    setValue(
      "financialResponsible.phoneTertiary.ddd",
      studentEditData.financialResponsible.phoneTertiary.ddd
    );
    setValue(
      "financialResponsible.phoneTertiary.number",
      studentEditData.financialResponsible.phoneTertiary.number
    );
  }, [studentEditData, curriculumState, dateToString]);

  // SET REACT HOOK FORM ERRORS
  // useEffect(() => {
  //   const fullErrors = [
  //     // Section 1: Student Data
  //     errors.id,
  //     errors.active,
  //     errors.name,
  //     errors.birthDate,
  //     errors.document,
  //     errors.schoolYears,
  //     errors.schoolYearsComplement,
  //     errors.parentOne?.name,
  //     errors.parentOne?.email,
  //     errors.parentOne?.phone?.ddd,
  //     errors.parentOne?.phone?.number,
  //     errors.parentTwo?.name,
  //     errors.parentTwo?.email,
  //     errors.parentTwo?.phone?.ddd,
  //     errors.parentTwo?.phone?.number,

  //     // Section 2: Student Course and Family Data | Prices
  //     errors.addCurriculum,
  //     errors.addExperimentalCurriculum,
  //     errors.addFamily,
  //     errors.enrolmentFee,
  //     errors.enrolmentFeePaid,
  //     errors.fullPrice,
  //     errors.appliedPrice,
  //     errors.enrolmentExemption,
  //     errors.customDiscount,
  //     errors.customDiscountValue,
  //     errors.employeeDiscount,
  //     errors.familyDiscount,
  //     errors.secondCourseDiscount,
  //     errors.paymentDay,

  //     // Section 3: Student Financial Responsible Data
  //     errors.financialResponsible?.name,
  //     errors.financialResponsible?.document,
  //     errors.financialResponsible?.email,
  //     errors.financialResponsible?.address?.street,
  //     errors.financialResponsible?.address?.number,
  //     errors.financialResponsible?.address?.complement,
  //     errors.financialResponsible?.address?.neighborhood,
  //     errors.financialResponsible?.address?.city,
  //     errors.financialResponsible?.address?.state,
  //     errors.financialResponsible?.address?.cep,
  //     errors.financialResponsible?.phone?.ddd,
  //     errors.financialResponsible?.phone?.number,
  //     errors.financialResponsible?.activePhoneSecondary,
  //     errors.financialResponsible?.phoneSecondary?.ddd,
  //     errors.financialResponsible?.phoneSecondary?.number,
  //     errors.financialResponsible?.activePhoneTertiary,
  //     errors.financialResponsible?.phoneTertiary?.ddd,
  //     errors.financialResponsible?.phoneTertiary?.number,
  //   ];

  //   fullErrors.map((fieldError) => {
  //     toast.error(fieldError?.message, {
  //       theme: "colored",
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       autoClose: 3000,
  //     });
  //   });
  // }, [errors]);

  // Definir os tipos esperados para os erros
  interface ErrorField {
    message?: string;
    [key: string]: unknown; // Permite campos adicionais no erro
  }

  interface Errors {
    [key: string]: ErrorField | Errors | undefined; // Pode ser um campo de erro ou um objeto aninhado
  }

  useEffect(() => {
    // Função recursiva para exibir erros
    const showErrorMessages = (errorObj: Errors) => {
      Object.values(errorObj).forEach((value) => {
        // Se for um objeto, faz chamada recursiva
        if (value && typeof value === "object" && !Array.isArray(value)) {
          showErrorMessages(value as Errors); // Cast para garantir que seja tratado como objeto de erro
        } else if ((value as ErrorField)?.message) {
          // Exibe o erro se tiver a propriedade 'message'
          toast.error((value as ErrorField).message, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        }
      });
    };

    // Passa os erros para a função recursiva
    showErrorMessages(errors);
  }, [errors]);

  // SUBMIT DATA FUNCTION
  const handleEditStudent: SubmitHandler<EditStudentValidationZProps> = async (
    data
  ) => {
    const confirmation = await handleConfirmationToSubmit({
      title: "Editar Aluno",
      text: "Tem certeza que deseja confirmar as mudanças?",
      icon: "question",
      confirmButtonText: "Sim, confirmar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      // STUDENTS DB DATA
      const students = studentsDb as StudentSearchProps[];

      // CURRICULUM DB DATA
      const curriculumDbTransformed: CurriculumSearchProps[] = curriculumDb
        ? curriculumDb.map((doc: DocumentData) => ({
            ...(doc as CurriculumSearchProps),
          }))
        : [];

      // ALL CURRICULUMS
      const curriculums = curriculumState.curriculums.filter(
        (curriculum) =>
          !removedCurriculums.some((removed) => removed.id === curriculum.id)
      );

      // STUDENT FAMILY
      const family = studentEditData.studentFamilyAtSchool;

      // ALL FAMILY (INCLUDED STUDENT)
      const allFamily = [...family, data.id];

      // CHECKING VALID DOCUMENT
      if (!testFinancialCPF || !testCPF) {
        return (
          setIsSubmitting(false),
          toast.error(
            `CPF do ${
              testCPF ? "aluno" : "responsável financeiro"
            } é inválido, por favor verifique... ❕`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          )
        );
      }

      // CHECK NO DATE CURRICULUM
      curriculums.map(async (curriculum) => {
        if (curriculum.date === null) {
          return (
            setIsSubmitting(false),
            toast.error(
              "Alguma(s) modalidade(s) não tiveram a data escolhida, verifique... ❕",
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            )
          );
        }
      });

      // CHECK NO STRING FAMILY
      family.map(async (familyId) => {
        if (familyId === "") {
          return (
            setIsSubmitting(false),
            toast.error(
              "Algum(ns) parente(s) não selecionado(s), verifique... ❕",
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            )
          );
        }
      });

      // CHECKING VALID SECONDARY PHONE
      if (studentEditData.financialResponsible.activePhoneSecondary) {
        if (studentEditData.financialResponsible.phoneSecondary.ddd === "DDD") {
          return (
            setIsSubmitting(false),
            toast.error(
              `Preencha o número de telefone 2 ou desmarque a opção "incluir"...... ❕`,
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            )
          );
        }
      }

      // CHECKING VALID TERTIARY PHONE
      if (studentEditData.financialResponsible.activePhoneTertiary) {
        if (studentEditData.financialResponsible.phoneTertiary.ddd === "DDD") {
          return (
            setIsSubmitting(false),
            toast.error(
              `Preencha o número de telefone 3 ou desmarque a opção "incluir"...... ❕`,
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            )
          );
        }
      }

      // CHECKING IF STUDENT EXISTS ON CURRRICULUM DATABASE
      const foundedStudent = students.find((student) => student.id === data.id);
      if (!foundedStudent) {
        // IF NO EXISTS, RETURN ERROR
        return (
          setIsSubmitting(false),
          toast.error(`Aluno não existe no banco de dados...... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      }

      // UPDATING STUDENT IN CURRICULUM DATABASE
      curriculums.map(async (curriculum) => {
        // SEARCH CURRICULUM TO CHANGE STUDENT ON CURRICULUM DATABASE
        const curriculumToUpdate = curriculumDbTransformed.find(
          (curriculumDatabase) => curriculumDatabase.id === curriculum.id
        );
        if (curriculumToUpdate) {
          const studentOnCurriculum = curriculumToUpdate.students.find(
            (student) => student.id === data.id
          );
          if (studentOnCurriculum) {
            // UPDATE CURRICULUM (UPDATE STUDENT IN CURRICULUM DATABASE)
            await secureUpdateDoc(
              doc(db, "curriculum", curriculumToUpdate.id),
              {
                students: arrayRemove(studentOnCurriculum), // REMOVE OLD DATA
              }
            );
            await secureUpdateDoc(
              doc(db, "curriculum", curriculumToUpdate.id),
              {
                // ADD UPDATED DATA
                students: arrayUnion({
                  id: data.id,
                  date: curriculum.date,
                  indexDays: curriculum.indexDays,
                  isExperimental: curriculum.isExperimental,
                  isWaiting: curriculum.isWaiting,
                }),
              }
            );
          }
        }
      });

      // CHECK IF SOME CURRICULUM WAS EXCLUDED
      if (removedCurriculums.length > 0) {
        removedCurriculums.map(async (curriculum) => {
          // UPDATE CURRICULUM (DELETE STUDENT FROM CURRICULUM)
          await secureUpdateDoc(doc(db, "curriculum", curriculum.id), {
            students: arrayRemove(curriculum),
          });
        });
      }

      // CHECK IF SOME FAMILY WAS EXCLUDED
      if (removedFamily.length > 0) {
        const remainingFamily = allFamily.filter(
          (id) => !removedFamily.some((member) => member === id)
        );
        removedFamily.map(async (familyId) => {
          remainingFamily.map(async (family) => {
            // UPDATE STUDENT (DELETE FAMILY)
            await secureUpdateDoc(doc(db, "students", family), {
              studentFamilyAtSchool: arrayRemove(familyId),
            });
            // UPDATE STUDENT AT FAMILY (DELETE FAMILY)
            await secureUpdateDoc(doc(db, "students", familyId), {
              studentFamilyAtSchool: arrayRemove(family),
            });
          });
        });
      }

      // UPDATE FAMILY
      if (data.familyDiscount && data.studentFamilyAtSchool.length > 0) {
        const curriculums = curriculumState.curriculums.map((curriculum) => ({
          date: curriculum.date,
          id: curriculum.id,
          indexDays: curriculum.indexDays,
          isExperimental: curriculum.isExperimental,
          isWaiting: curriculum.isWaiting,
          price: 0,
        }));

        const fee = await calculateStudentMonthlyFee(studentEditData.id, {
          curriculums,
          customDiscount: studentEditData.customDiscount,
          customDiscountValue: studentEditData.customDiscountValue,
          employeeDiscount: studentEditData.employeeDiscount,
          familyDiscount: studentEditData.familyDiscount,
          secondCourseDiscount: studentEditData.secondCourseDiscount,
          studentFamilyAtSchool: studentEditData.studentFamilyAtSchool,
        });
        if (fee.studentFamilyToUpdate) {
          const studentValues = {
            secondCourseDiscount: data.secondCourseDiscount,
            appliedPrice: curriculumState.appliedPrice,
            familyDiscount: data.familyDiscount,
            customDiscount: data.customDiscount,
            customDiscountValue: data.customDiscountValue,
            employeeDiscount: data.employeeDiscount,
            familyId: studentEditData.id,
            fullPrice: curriculumState.fullPrice,
          };
          const allFamilyPrices = [...fee.studentFamilyToUpdate, studentValues];

          allFamilyPrices.map(async (family) => {
            if (family.familyId !== studentEditData.id) {
              await secureSetDoc(
                doc(db, "students", family.familyId),
                {
                  studentFamilyAtSchool: allFamily.filter(
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
      }

      // STUDENT DATA OBJECT
      const updateData = {
        // Section 1: Student Data
        name: data.name,
        birthDate: Timestamp.fromDate(new Date(data.birthDate)),
        document: data.document,
        schoolYears: data.schoolYears,
        schoolYearsComplement: data.schoolYearsComplement,
        "parentOne.name": data.parentOne.name,
        "parentOne.email": data.parentOne.email,
        "parentOne.phone": `+55${data.parentOne.phone.ddd}${data.parentOne.phone.number}`,
        "parentTwo.name": data.parentTwo.name,
        "parentTwo.email": data.parentTwo.email,
        "parentTwo.phone": `+55${data.parentTwo.phone.ddd}${data.parentTwo.phone.number}`,

        // Section 2: Student Course and Family Data | Prices
        enrolmentExemption: data.enrolmentExemption,
        enrolmentFee: curriculumState.enrollmentFee,
        enrolmentFeePaid: data.enrolmentFeePaid,
        fullPrice: +curriculumState.fullPrice.toFixed(2),
        appliedPrice: +curriculumState.appliedPrice.toFixed(2),
        customDiscount: data.customDiscount,
        customDiscountValue: data.customDiscountValue,
        employeeDiscount: data.employeeDiscount,
        secondCourseDiscount: data.secondCourseDiscount,
        paymentDay: data.paymentDay,
        curriculums: curriculumState.curriculums,

        // Section 3: Student Financial Responsible Data
        "financialResponsible.name": data.financialResponsible.name,
        "financialResponsible.document": data.financialResponsible.document,
        "financialResponsible.email": data.financialResponsible.email,
        "financialResponsible.address.street":
          data.financialResponsible.address.street,
        "financialResponsible.address.number":
          data.financialResponsible.address.number,
        "financialResponsible.address.complement":
          data.financialResponsible.address.complement,
        "financialResponsible.address.neighborhood":
          data.financialResponsible.address.neighborhood,
        "financialResponsible.address.city":
          data.financialResponsible.address.city,
        "financialResponsible.address.state":
          data.financialResponsible.address.state,
        "financialResponsible.address.cep":
          data.financialResponsible.address.cep,
        "financialResponsible.phone": `+55${data.financialResponsible.phone.ddd}${data.financialResponsible.phone.number}`,
        "financialResponsible.phoneSecondary":
          data.financialResponsible.phoneSecondary.ddd === "DDD"
            ? ""
            : `+55${data.financialResponsible.phoneSecondary.ddd}${data.financialResponsible.phoneSecondary.number}`,
        "financialResponsible.phoneTertiary":
          data.financialResponsible.phoneTertiary.ddd === "DDD"
            ? ""
            : `+55${data.financialResponsible.phoneTertiary.ddd}${data.financialResponsible.phoneTertiary.number}`,

        // Section 4: Student Contract Data
        // Accept Contract: boolean
        // Contract attached (pdf)

        // Section 5: Last Updated Time
        updatedAt: serverTimestamp(),
      };

      // EDIT STUDENT FUNCTION
      const editStudent = async () => {
        try {
          await secureUpdateDoc(doc(db, "students", data.id), updateData);
          toast.success(`${data.name} alterado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
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
      editStudent();
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full ${
        open
          ? "flex flex-col h-full max-w-9xl bg-white/80 dark:bg-klGreen-500/60 rounded-xl overflow-y-auto no-scrollbar"
          : ""
      } `}
    >
      <div className="flex flex-col w-full h-full overflow-scroll no-scrollbar gap-2 pt-4 px-4 rounded-xl text-center">
        {/** DAHSBOARD SECTION TITLE */}
        {page.show === "Dashboard" &&
          studentSelectedData &&
          handleClickOpen &&
          handleDeleteUser &&
          toggleActiveUser &&
          onClose &&
          setIsEdit &&
          setIsFinance &&
          setIsDetailsViewing && (
            <EditDashboardHeader
              handleClickOpen={handleClickOpen}
              handleDeleteUser={handleDeleteUser}
              toggleActiveUser={toggleActiveUser}
              onClose={onClose}
              setIsDetailsViewing={setIsDetailsViewing}
              setIsEdit={setIsEdit}
              setIsFinance={setIsFinance}
              student={studentSelectedData}
              isEdit={isEdit}
              isFinance={isFinance}
              isFinancialResponsible={isFinancialResponsible}
              onlyView={onlyView}
              open={open}
              key={studentId}
            />
          )}

        {/** ACTIVE STUDENT */}
        {userFullData && (
          <ActiveStudent
            studentData={studentEditData}
            userRole={userFullData.role}
          />
        )}

        {/* FORM */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleEditStudent)}
            className="flex flex-col w-full gap-2 px-4 pb-16 rounded-xl bg-klGreen-500/0 dark:bg-klGreen-500/0 text-center h-full overflow-scroll no-scrollbar "
          >
            {/** PERSONAL DATA FORM */}
            <PersonalDataForm
              studentData={studentEditData}
              setStudentData={setStudentEditData}
              testCPF={testCPF} // Defina a lógica do CPF aqui
              setTestCPF={setTestCPF} // Passar a função de validação do CPF
              isSubmitting={isSubmitting} // Defina o estado de submissão aqui
              renewBirthDayValue={renewBirthDayValue} // Passando valor para renewBirthDayValue
              onlyView={onlyView}
            />
            {/* PARENT ONE FORM */}
            <ParentForm
              onlyView={onlyView}
              parent="parentOne"
              setStudentData={setStudentEditData}
              student={studentEditData}
            />
            {/* PARENT TWO FORM */}
            <ParentForm
              onlyView={onlyView}
              parent="parentTwo"
              setStudentData={setStudentEditData}
              student={studentEditData}
            />
            {/* // --------------------------------------------- SECTION 2: STUDENT FINANCIAL RESPONSIBLE DATA --------------------------------------------- // */}
            <FinancialResponsibleForm
              activePhoneSecondary={
                studentEditData.financialResponsible.activePhoneSecondary
              }
              activePhoneTertiary={
                studentEditData.financialResponsible.activePhoneTertiary
              }
              isExperimental={
                getExperimentalCurriculums(curriculumState.curriculums).length >
                0
              }
              setStudentData={setStudentEditData}
              setTestFinancialCPF={setTestFinancialCPF}
              student={studentEditData}
              testFinancialCPF={testFinancialCPF}
              onlyView={onlyView}
              editAddress={editAddress}
              setEditAddress={setEditAddress}
            />
            {studentEditData.active && (
              <ShowCurriculums
                curriculumState={curriculumState}
                userRole={userFullData ? userFullData.role : "user"}
                studentId={studentEditData.id}
                studentFreeDays={studentFreeDays}
                removedCurriculums={removedCurriculums}
                setRemovedCurriculums={setRemovedCurriculums}
                setCurriculumState={setCurriculumState}
                newAddCurriculums={newAddCurriculums}
                onlyView={onlyView}
              />
            )}
            {/** CURRICULUM SECTION TITLE */}
            {!onlyView && curriculumCount > 0 && studentEditData.active && (
              <h1 className="font-bold text-lg py-4  text-red-600 dark:text-yellow-500">
                Selecionar Modalidade:
              </h1>
            )}

            {!onlyView &&
              studentEditData.active &&
              Array.from({ length: curriculumCount }).map((_, index) => (
                <SelectSchoolAndCourse
                  key={index}
                  curriculumState={curriculumState}
                  selectedSchoolClassId={studentEditData.schoolYears}
                  onAdd={upsertCurriculum}
                  onDel={removeCurriculum}
                  studentFreeDays={studentFreeDays}
                  setNewAddCurriculums={setNewAddCurriculums}
                  studentId={studentEditData.id}
                />
              ))}

            {/* Botão para adicionar um novo currículo (apenas aparece quando o contador é maior que 0) */}
            {!onlyView && studentEditData.active && (
              <div className="flex justify-center py-2">
                <div
                  className="flex md:w-2/4 items-center justify-center gap-4 px-4 py-1 cursor-pointer border rounded-md border-green-900/10 bg-klGreen-500 hover:bg-klGreen-500/80 transition-all disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                  onClick={handleAddCurriculum}
                >
                  <MdAdd />
                  <span>Adicionar modalidade ou aula experimental</span>
                </div>
              </div>
            )}

            {studentEditData.studentFamilyAtSchool.length > 0 && (
              <ShowFamily
                onlyView={onlyView}
                removedFamily={removedFamily}
                setRemovedFamily={setRemovedFamily}
                newAddFamily={newAddFamily}
                studentFamilyAtSchool={studentEditData.studentFamilyAtSchool}
              />
            )}
            {!onlyView && systemConstantsValues && studentEditData.active && (
              <FamilyFormSelect
                studentData={studentEditData}
                setStudentData={setStudentEditData}
                systemConstantsValues={systemConstantsValues}
                isSubmitting={isSubmitting}
                newAddFamily={newAddFamily}
                setNewAddFamily={setNewAddFamily}
              />
            )}

            {curriculumState.curriculums.length > 0 &&
              systemConstantsValues &&
              userFullData &&
              studentEditData.active && (
                <>
                  {getRegularCurriculums(curriculumState.curriculums).length >
                    0 && (
                    <>
                      {!onlyView && userFullData.role !== "user" && (
                        <DiscountForm
                          data={studentEditData}
                          setData={setStudentEditData}
                          systemConstantsValues={systemConstantsValues}
                          userRole={userFullData.role}
                        />
                      )}
                      <PaymentDetails
                        data={studentEditData}
                        setData={setStudentEditData}
                        systemConstantsValues={systemConstantsValues}
                        userRole={userFullData.role}
                        appliedPrice={curriculumState.appliedPrice}
                        enrolmentFee={curriculumState.enrollmentFee}
                        onlyView={onlyView}
                      />
                    </>
                  )}
                </>
              )}

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 my-4 justify-center">
              {/* SUBMIT BUTTON */}
              {!onlyView && (
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
                {isSubmitting ? "Aguarde" : onlyView ? "Fechar" : "Cancelar"}
              </button>
            </div>
          </form>
        </FormProvider>
        {userFullData && studentEditData.active && (
          <CurriculumBalloon
            curriculumState={curriculumState}
            userRole={userFullData.role}
            customDiscount={studentEditData.customDiscount}
            customDiscountValue={studentEditData.customDiscountValue}
            employeeDiscount={studentEditData.employeeDiscount}
            familyDiscount={studentEditData.familyDiscount}
            secondCourseDiscount={studentEditData.secondCourseDiscount}
            studentFamilyAtSchool={studentEditData.studentFamilyAtSchool}
            paymentDay={studentEditData.paymentDay}
          />
        )}
      </div>
    </div>
  );
}
