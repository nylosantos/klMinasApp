/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  arrayUnion,
  doc, getDoc,
  getFirestore,
  runTransaction,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createStudentValidationSchema } from "../../@types/zodValidation";
import {
  CreateStudentValidationZProps,
  CurriculumStateProps,
  CurriculumToAddProps,
  StudentFreeDayProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import FinancialResponsibleForm from "../formComponents/FinancialResponsibleForm";
import ParentForm from "../formComponents/ParentForm";
import SelectSchoolAndCourse from "../formComponents/SelectSchoolAndCourse";
import CurriculumBalloon from "../layoutComponents/CurriculumBaloon";
import { DiscountForm } from "../formComponents/DiscountForm";
import { PaymentDetails } from "../layoutComponents/PaymentDetails";
import { MdAdd, MdDelete } from "react-icons/md";
import FamilyForm from "../formComponents/FamilyForm";
import PersonalDataForm from "../formComponents/PersonalDataForm";
import { secureSetDoc } from "../../hooks/firestoreMiddleware";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertStudent() {
  // GET GLOBAL DATA
  const {
    isExperimentalClass,
    login,
    page,
    studentsDb,
    systemConstantsValues,
    userFullData,
    handleOneCurriculumDetails,
    setIsExperimentalClass,
    calculateStudentMonthlyFee,
    calculateEnrollmentFee,
    handleConfirmationToSubmit,
    getExperimentalCurriculums,
    getRegularCurriculums,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const newStudentId = useRef(uuidv4());

  // STUDENT DATA
  const [studentData, setStudentData] = useState<CreateStudentValidationZProps>(
    {
      // Section 1: Student Data
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
      // familyAtSchoolId: "",
      studentFamilyAtSchool: [],
      // curriculum: "",
      enrolmentExemption: false,
      customDiscount: false,
      customDiscountValue: "0",
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      // confirmInsert: false,
    }
  );

  // Estado local para controlar quantos SelectSchoolAndCourse devem ser renderizados
  const [curriculumCount, setCurriculumCount] = useState<number>(0); // Começa com 0

  // Função para adicionar um novo currículo (apenas aumenta o contador)
  const handleManageShowCurriculumSelects = () => {
    if (
      curriculumCount > 1 &&
      curriculumCount > curriculumState.curriculums.length
    ) {
      setCurriculumCount((prevCount) => prevCount - 1); // Aumenta o contador para retirar o SelectSchoolAndCourse sem uso (sem curiculo selecionado)
    } else {
      setCurriculumCount((prevCount) => prevCount + 1); // Aumenta o contador para renderizar mais um SelectSchoolAndCourse
    }
  };

  // Efeito que será executado sempre que studentData.schoolYears mudar
  useEffect(() => {
    // Se studentData.schoolYears for diferente de "", então podemos começar com 1
    if (studentData.schoolYears !== "") {
      setCurriculumCount(1);
    } else {
      setCurriculumCount(0);
    }
  }, [studentData.schoolYears]); // Dependência de studentData.schoolYears

  const [curriculumState, setCurriculumState] = useState<CurriculumStateProps>({
    curriculums: [],
    fullPrice: 0,
    appliedPrice: 0,
    enrollmentFee: 0,
  });

  const removeCurriculum = (id: string) => {
    setCurriculumState((prevState) => {
      // Encontramos o currículo que será removido antes de atualizar o estado
      const curriculumToRemove = prevState.curriculums.find(
        (curriculum) => curriculum.id === id
      );

      if (!curriculumToRemove) return prevState; // Se não encontrou, retorna o estado inalterado

      // Atualiza studentFreeDays para liberar os dias ocupados pelo currículo removido
      setStudentFreeDays((prevFreeDays) =>
        prevFreeDays.map((freeDay) =>
          curriculumToRemove.indexDays.includes(freeDay.day) &&
          freeDay.curriculumId === id // Somente se o ID for o mesmo do removido
            ? { ...freeDay, curriculumId: null } // Libera o dia ocupado
            : freeDay
        )
      );

      return {
        ...prevState,
        // Remove o currículo do array
        curriculums: prevState.curriculums.filter(
          (curriculum) => curriculum.id !== id
        ),
      };
    });
  };

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

  const upsertCurriculum = (newCurriculum: CurriculumToAddProps) => {
    setStudentFreeDays((prevState) => {
      const updatedState = prevState.map((day) => {
        if (
          newCurriculum.indexDays.includes(day.day) &&
          day.curriculumId === null
        ) {
          // Se o dia está na lista e o curriculumId é null, atribui o novo curriculumId
          return { ...day, curriculumId: newCurriculum.id };
        } else if (
          !newCurriculum.indexDays.includes(day.day) &&
          day.curriculumId === newCurriculum.id
        ) {
          // Se o dia não está na lista e o curriculumId é o mesmo, remove o curriculumId
          return { ...day, curriculumId: null };
        }
        return day; // Caso contrário, mantém o dia inalterado
      });

      return updatedState;
    });
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

  useEffect(() => {
    const fetchStudentMonthlyFee = async () => {
      try {
        const curriculums = curriculumState.curriculums.map((curriculum) => ({
          date: curriculum.date,
          id: curriculum.id,
          indexDays: curriculum.indexDays,
          isExperimental: curriculum.isExperimental,
          isWaiting: curriculum.isWaiting,
          price: 0,
        }));

        const fee = await calculateStudentMonthlyFee(newStudentId.current, {
          curriculums,
          customDiscount: studentData.customDiscount,
          customDiscountValue: studentData.customDiscountValue,
          employeeDiscount: studentData.employeeDiscount,
          familyDiscount: studentData.familyDiscount,
          secondCourseDiscount: studentData.secondCourseDiscount,
          studentFamilyAtSchool: studentData.studentFamilyAtSchool || [],
        });

        setCurriculumState((prevState) => ({
          ...prevState,
          appliedPrice: fee.appliedPrice,
          fullPrice: fee.fullPrice,
        }));
        setStudentData((prevData) => ({
          ...prevData,
          secondCourseDiscount: fee.secondCourseDiscount,
        }));
        setCurriculumState((prevState) => ({
          ...prevState,
          enrollmentFee:
            getRegularCurriculums(curriculumState.curriculums).length > 0
              ? calculateEnrollmentFee(studentData.enrolmentExemption)
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
    studentData.familyDiscount,
    studentData.customDiscount,
    studentData.customDiscountValue,
    studentData.employeeDiscount,
    studentData.enrolmentExemption,
    studentData.studentFamilyAtSchool,
  ]);

  // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
  useEffect(() => {
    if (!studentData.customDiscount) {
      setStudentData({ ...studentData, customDiscountValue: "0" });
    }
  }, [studentData.customDiscount]);

  // GET FINANCIAL RESPONSIBLE INFO WHEN FILL DOCUMENT
  useEffect(() => {
    if (studentData.financialResponsible.document.length === 14) {
      const students = studentsDb as StudentSearchProps[];
      const foundedResponsibleData = students.find(
        (student) =>
          student.financialResponsible.document ===
          studentData.financialResponsible.document
      );
      if (foundedResponsibleData) {
        setStudentData({
          ...studentData,
          financialResponsible: {
            ...studentData.financialResponsible,
            name: foundedResponsibleData.financialResponsible.name,
            email: foundedResponsibleData.financialResponsible.email,
            phone: {
              ddd: foundedResponsibleData.financialResponsible.phone.slice(
                3,
                5
              ),
              number:
                foundedResponsibleData.financialResponsible.phone.slice(-9),
            },
            activePhoneSecondary:
              foundedResponsibleData.financialResponsible.phoneSecondary !== ""
                ? true
                : false,
            phoneSecondary: {
              ddd:
                foundedResponsibleData.financialResponsible.phoneSecondary !==
                ""
                  ? foundedResponsibleData.financialResponsible.phoneSecondary.slice(
                      3,
                      5
                    )
                  : "DDD",
              number:
                foundedResponsibleData.financialResponsible.phoneSecondary !==
                ""
                  ? foundedResponsibleData.financialResponsible.phoneSecondary.slice(
                      -9
                    )
                  : "",
            },
            activePhoneTertiary:
              foundedResponsibleData.financialResponsible.phoneTertiary !== ""
                ? true
                : false,
            phoneTertiary: {
              ddd:
                foundedResponsibleData.financialResponsible.phoneTertiary !== ""
                  ? foundedResponsibleData.financialResponsible.phoneTertiary.slice(
                      3,
                      5
                    )
                  : "DDD",
              number:
                foundedResponsibleData.financialResponsible.phoneTertiary !== ""
                  ? foundedResponsibleData.financialResponsible.phoneTertiary.slice(
                      -9
                    )
                  : "",
            },
            address: {
              cep: foundedResponsibleData.financialResponsible.address.cep,
              street:
                foundedResponsibleData.financialResponsible.address.street,
              number:
                foundedResponsibleData.financialResponsible.address.number,
              neighborhood:
                foundedResponsibleData.financialResponsible.address
                  .neighborhood,
              complement:
                foundedResponsibleData.financialResponsible.address.complement,
              city: foundedResponsibleData.financialResponsible.address.city,
              state: foundedResponsibleData.financialResponsible.address.state,
            },
          },
        });
      } else {
        setStudentData({
          ...studentData,
          financialResponsible: {
            ...studentData.financialResponsible,
            name: "",
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
      }
    } else {
      setStudentData({
        ...studentData,
        financialResponsible: {
          ...studentData.financialResponsible,
          name: "",
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
    }
  }, [studentData.financialResponsible.document]);

  // VALIDATE EMAIL FUNCTION TO FILL INFO
  function validateEmail(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // GET PARENT TWO INFO WHEN FILL EMAIL
  useEffect(() => {
    if (
      studentData.parentTwo.email !== "" &&
      validateEmail(studentData.parentTwo.email)
    ) {
      const students = studentsDb as StudentSearchProps[];

      const foundedParentData = students.find(
        (student) =>
          student.parentOne.email === studentData.parentTwo.email ||
          student.parentTwo.email === studentData.parentTwo.email
      );

      if (foundedParentData) {
        if (foundedParentData.parentOne.email === studentData.parentTwo.email) {
          setStudentData({
            ...studentData,
            parentTwo: {
              ...studentData.parentTwo,
              name: foundedParentData.parentOne.name,
              phone: {
                ddd: foundedParentData.parentOne.phone.slice(3, 5),
                number: foundedParentData.parentOne.phone.slice(-9),
              },
            },
          });
        } else {
          setStudentData({
            ...studentData,
            parentTwo: {
              ...studentData.parentTwo,
              name: foundedParentData.parentTwo.name,
              phone: {
                ddd: foundedParentData.parentTwo.phone.slice(3, 5),
                number: foundedParentData.parentTwo.phone.slice(-9),
              },
            },
          });
        }
      } else {
        setStudentData({
          ...studentData,
          parentTwo: {
            ...studentData.parentTwo,
            name: "",
            phone: {
              ddd: "",
              number: "",
            },
          },
        });
      }
    }
  }, [studentData.parentTwo.email]);

  // GET PARENT ONE INFO WHEN FILL EMAIL
  useEffect(() => {
    if (
      studentData.parentOne.email !== "" &&
      validateEmail(studentData.parentOne.email)
    ) {
      const students = studentsDb as StudentSearchProps[];

      const foundedParentData = students.find(
        (student) =>
          student.parentOne.email === studentData.parentOne.email ||
          student.parentTwo.email === studentData.parentOne.email
      );
      if (foundedParentData) {
        if (foundedParentData.parentOne.email === studentData.parentOne.email) {
          setStudentData({
            ...studentData,
            parentOne: {
              ...studentData.parentOne,
              name: foundedParentData.parentOne.name,
              phone: {
                ddd: foundedParentData.parentOne.phone.slice(3, 5),
                number: foundedParentData.parentOne.phone.slice(-9),
              },
            },
          });
        } else {
          setStudentData({
            ...studentData,
            parentOne: {
              ...studentData.parentOne,
              name: foundedParentData.parentTwo.name,
              phone: {
                ddd: foundedParentData.parentTwo.phone.slice(3, 5),
                number: foundedParentData.parentTwo.phone.slice(-9),
              },
            },
          });
        }
      } else {
        setStudentData({
          ...studentData,
          parentOne: {
            ...studentData.parentOne,
            name: "",
            phone: {
              ddd: "",
              number: "",
            },
          },
        });
      }
    }
  }, [studentData.parentOne.email]);
  // ---------------------------- END OF STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EDIT ADDRESS STATE
  const [editAddress, setEditAddress] = useState(false);

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // TEST FINANCIAL STUDENT CPF (BRAZILIAN DOCUMENT) STATE
  const [testCPF, setTestCPF] = useState(true);

  // ACTIVATING OPTIONAL PHONES STATES
  const [activePhoneSecondary, setActivePhoneSecondary] = useState(false);
  const [activePhoneTertiary, setActivePhoneTertiary] = useState(false);

  // REACT HOOK FORM SETTINGS
  const methods = useForm<CreateStudentValidationZProps>({
    resolver: zodResolver(createStudentValidationSchema),
    defaultValues: {
      // Section 1: Student Data
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
      // familyAtSchoolId: "",
      studentFamilyAtSchool: [],
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      // confirmInsert: false,
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
    setStudentData({
      // Section 1: Student Data
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
      studentFamilyAtSchool: [],
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      // confirmInsert: false,
    });
    setCurriculumState({
      curriculums: [],
      fullPrice: 0,
      appliedPrice: 0,
      enrollmentFee: 0,
    });
    setActivePhoneSecondary(false);
    setActivePhoneTertiary(false);
    setEditAddress(false);
    newStudentId.current = uuidv4();
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    // Section 1: Student Data
    setValue("name", studentData.name);
    setValue("active", studentData.active);
    setValue("document", studentData.document);
    setValue("birthDate", studentData.birthDate);
    setValue("schoolYears", studentData.schoolYears);
    setValue("schoolYearsComplement", studentData.schoolYearsComplement);
    setValue("parentOne.name", studentData.parentOne.name);
    setValue("parentOne.phone.ddd", studentData.parentOne.phone.ddd);
    setValue("parentOne.phone.number", studentData.parentOne.phone.number);
    setValue("parentOne.email", studentData.parentOne.email);
    setValue("parentTwo.name", studentData.parentTwo.name);
    setValue("parentTwo.phone.ddd", studentData.parentTwo.phone.ddd);
    setValue("parentTwo.phone.number", studentData.parentTwo.phone.number);
    setValue("parentTwo.email", studentData.parentTwo.email);

    // Section 2: Student Course and Family Data | Prices
    setValue("studentFamilyAtSchool", studentData.studentFamilyAtSchool);
    setValue("enrolmentExemption", studentData.enrolmentExemption);
    setValue("customDiscount", studentData.customDiscount);
    setValue(
      "customDiscountValue",
      studentData.customDiscountValue ? studentData.customDiscountValue : "0"
    );
    setValue("employeeDiscount", studentData.employeeDiscount);
    setValue("familyDiscount", studentData.familyDiscount);
    setValue("secondCourseDiscount", studentData.secondCourseDiscount);
    setValue("paymentDay", studentData.paymentDay);

    // Section 3: Student Financial Responsible Data
    setValue(
      "financialResponsible.name",
      studentData.financialResponsible.name
    );
    setValue(
      "financialResponsible.document",
      studentData.financialResponsible.document
    );
    setValue(
      "financialResponsible.email",
      studentData.financialResponsible.email
    );
    setValue(
      "financialResponsible.address.street",
      studentData.financialResponsible.address.street
    );
    setValue(
      "financialResponsible.address.number",
      studentData.financialResponsible.address.number
    );
    setValue(
      "financialResponsible.address.complement",
      studentData.financialResponsible.address.complement
    );
    setValue(
      "financialResponsible.address.neighborhood",
      studentData.financialResponsible.address.neighborhood
    );
    setValue(
      "financialResponsible.address.city",
      studentData.financialResponsible.address.city
    );
    setValue(
      "financialResponsible.address.state",
      studentData.financialResponsible.address.state
    );
    setValue(
      "financialResponsible.address.cep",
      studentData.financialResponsible.address.cep
    );
    setValue(
      "financialResponsible.phone.ddd",
      studentData.financialResponsible.phone.ddd
    );
    setValue(
      "financialResponsible.phone.number",
      studentData.financialResponsible.phone.number
    );
    setValue(
      "financialResponsible.activePhoneSecondary",
      studentData.financialResponsible.activePhoneSecondary
    );
    setValue(
      "financialResponsible.phoneSecondary.ddd",
      studentData.financialResponsible.phoneSecondary.ddd
    );
    setValue(
      "financialResponsible.phoneSecondary.number",
      studentData.financialResponsible.phoneSecondary.number
    );
    setValue(
      "financialResponsible.activePhoneTertiary",
      studentData.financialResponsible.activePhoneTertiary
    );
    setValue(
      "financialResponsible.phoneTertiary.ddd",
      studentData.financialResponsible.phoneTertiary.ddd
    );
    setValue(
      "financialResponsible.phoneTertiary.number",
      studentData.financialResponsible.phoneTertiary.number
    );

    // Section 4: Student Contract Data
    // Accept Contract: boolean
    // Contract attached (pdf)

    // Section 5: Confirm Insert
    // setValue("confirmInsert", studentData.confirmInsert);
  }, [studentData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      // Section 1: Student Data
      errors.name,
      errors.active,
      errors.document,
      errors.birthDate,
      errors.schoolYears,
      errors.schoolYearsComplement,

      // Section 2: Student Course and Family Data | Prices
      errors.studentFamilyAtSchool,
      errors.enrolmentExemption,
      errors.customDiscount,
      errors.customDiscountValue,
      errors.employeeDiscount,
      errors.familyDiscount,
      errors.secondCourseDiscount,
      errors.paymentDay,

      // Section 3: Student Financial Responsible Data
      errors.financialResponsible?.name,
      errors.financialResponsible?.document,
      errors.financialResponsible?.email,
      errors.financialResponsible?.address?.street,
      errors.financialResponsible?.address?.number,
      errors.financialResponsible?.address?.complement,
      errors.financialResponsible?.address?.neighborhood,
      errors.financialResponsible?.address?.city,
      errors.financialResponsible?.address?.state,
      errors.financialResponsible?.address?.cep,
      errors.financialResponsible?.phone?.ddd,
      errors.financialResponsible?.phone?.number,
      errors.financialResponsible?.activePhoneSecondary,
      errors.financialResponsible?.phoneSecondary?.ddd,
      errors.financialResponsible?.phoneSecondary?.number,
      errors.financialResponsible?.activePhoneTertiary,
      errors.financialResponsible?.phoneTertiary?.ddd,
      errors.financialResponsible?.phoneTertiary?.number,

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      // errors.confirmInsert,
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
  const handleAddStudent: SubmitHandler<CreateStudentValidationZProps> = async (
    data
  ) => {
    if (!systemConstantsValues) {
      throw new Error("System constants not found");
    }
    const confirmation = await handleConfirmationToSubmit({
      title: "Adicionar Aluno",
      text: "Tem certeza que deseja adicionar este aluno?",
      icon: "question",
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      for (const curriculum of curriculumState.curriculums) {
        // Obtém os detalhes do curriculum com a função handleOneCurriculumDetails
        const { schoolName, schoolCourseName, placesAvailable } =
          handleOneCurriculumDetails(curriculum.id);

        // Verifica se a data não foi preenchida e há vagas disponíveis
        if (!curriculum.date && placesAvailable > 0) {
          setIsSubmitting(false);
          return toast.error(
            `Por favor, escolha a data para o curso "${schoolCourseName}" da escola "${schoolName}", pois há vagas disponíveis!`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        }

        // Verifica se é um curso regular e não foram escolhidos dias de aula
        if (
          !curriculum.isExperimental &&
          !curriculum.isWaiting &&
          curriculum.indexDays.length === 0
        ) {
          setIsSubmitting(false);
          return toast.error(
            `Por favor, escolha pelo menos um dia para o curso "${schoolCourseName}" da escola "${schoolName}".`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        }
      }

      //CHECK AND GETTING EXISTENT FAMILY
      // const familyArray: string[] = [];
      let familyArray: string[] = [];
      if (data.familyDiscount && data.studentFamilyAtSchool.length > 0) {
        familyArray = [...data.studentFamilyAtSchool, newStudentId.current];
        const students = studentsDb as StudentSearchProps[];

        const foundedStudentFamilyDetails = students.filter((student) =>
          data.studentFamilyAtSchool.includes(student.id)
        );
        if (foundedStudentFamilyDetails.length > 0) {
          foundedStudentFamilyDetails.forEach((student) => {
            student.studentFamilyAtSchool.forEach((otherStudentFamily) => {
              // Verifica se o valor já existe no familyArray
              if (!familyArray.includes(otherStudentFamily)) {
                familyArray.push(otherStudentFamily);
              }
            });
          });
        }
      }

      // ADD STUDENT FUNCTION
      const addStudent = async () => {
        const newStudentRef = doc(db, "students", newStudentId.current);
        const countersRef = doc(db, "counters", "studentPublicId");
        try {
          await runTransaction(db, async (transaction) => {
            // Obtém o documento atual do contador
            const countersDoc = await getDoc(countersRef);

            // Define o valor inicial do publicId
            let publicId = 1;

            // Se o documento de contador existir, pega o valor atual
            if (countersDoc.exists()) {
              publicId = countersDoc.data().value;
            }
            // CREATE STUDENT
            await secureSetDoc(newStudentRef, {
              // Section 1: Student Data
              publicId: publicId,
              id: newStudentId.current,
              active: true,
              name: data.name,
              birthDate: Timestamp.fromDate(new Date(data.birthDate)),
              document: data.document,
              schoolYears: data.schoolYears,
              schoolYearsComplement: data.schoolYearsComplement,
              parentOne: {
                name: data.parentOne.name,
                email: data.parentOne.email,
                phone: `+55${data.parentOne.phone.ddd}${data.parentOne.phone.number}`,
              },
              parentTwo: {
                name: data.parentTwo.name,
                email: data.parentTwo.email,
                phone: `+55${data.parentTwo.phone.ddd}${data.parentTwo.phone.number}`,
              },

              // Section 2: Student Course and Family Data | Prices
              enrolmentExemption: data.enrolmentExemption,
              enrolmentFee: curriculumState.enrollmentFee,
              enrolmentFeePaid: false,
              fullPrice: +curriculumState.fullPrice.toFixed(2),
              appliedPrice: +curriculumState.appliedPrice.toFixed(2),
              customDiscount: data.customDiscount,
              customDiscountValue: data.customDiscountValue,
              employeeDiscount: data.employeeDiscount,
              familyDiscount: data.familyDiscount,
              secondCourseDiscount: data.secondCourseDiscount,
              paymentDay:
                data.paymentDay === ""
                  ? systemConstantsValues.standardPaymentDay
                  : data.paymentDay,
              curriculums: arrayUnion(...curriculumState.curriculums),
              studentFamilyAtSchool: data.familyDiscount
                ? familyArray.filter(
                    (student) => student !== newStudentId.current
                  )
                : arrayUnion(),

              // Section 3: Student Financial Responsible Data
              financialResponsible: {
                name: data.financialResponsible.name,
                document: data.financialResponsible.document,
                email: data.financialResponsible.email,
                address: {
                  street: data.financialResponsible.address.street,
                  number: data.financialResponsible.address.number,
                  complement: data.financialResponsible.address.complement,
                  neighborhood: data.financialResponsible.address.neighborhood,
                  city: data.financialResponsible.address.city,
                  state: data.financialResponsible.address.state,
                  cep: data.financialResponsible.address.cep,
                },
                phone: `+55${data.financialResponsible.phone.ddd}${data.financialResponsible.phone.number}`,
                phoneSecondary: activePhoneSecondary
                  ? `+55${data.financialResponsible.phoneSecondary.ddd}${data.financialResponsible.phoneSecondary.number}`
                  : "",
                phoneTertiary: activePhoneTertiary
                  ? `+55${data.financialResponsible.phoneTertiary.ddd}${data.financialResponsible.phoneTertiary.number}`
                  : "",
              },

              // Section 4: Student Contract Data
              // Accept Contract: boolean
              // Contract attached (pdf)

              // Section 5: Last Updated Time
              updatedAt: serverTimestamp(),
            });

            // ADD STUDENT TO CURRICULUMS TABLE
            if (curriculumState.curriculums.length > 0) {
              curriculumState.curriculums.map(async (curriculum) => {
                await secureSetDoc(
                  doc(db, "curriculum", curriculum.id),
                  {
                    students: arrayUnion({
                      id: newStudentId.current,
                      date: curriculum.date,
                      isExperimental: curriculum.isExperimental,
                      isWaiting: curriculum.isWaiting,
                      indexDays: curriculum.indexDays,
                    }),
                  },
                  { merge: true }
                );
              });
            }

            if (data.familyDiscount && data.studentFamilyAtSchool.length > 0) {
              const curriculums = curriculumState.curriculums.map(
                (curriculum) => ({
                  date: curriculum.date,
                  id: curriculum.id,
                  indexDays: curriculum.indexDays,
                  isExperimental: curriculum.isExperimental,
                  isWaiting: curriculum.isWaiting,
                  price: 0,
                })
              );

              const fee = await calculateStudentMonthlyFee(
                newStudentId.current,
                {
                  curriculums,
                  customDiscount: studentData.customDiscount,
                  customDiscountValue: studentData.customDiscountValue,
                  employeeDiscount: studentData.employeeDiscount,
                  familyDiscount: studentData.familyDiscount,
                  secondCourseDiscount: studentData.secondCourseDiscount,
                  studentFamilyAtSchool: studentData.studentFamilyAtSchool,
                }
              );
              if (fee.studentFamilyToUpdate) {
                const studentValues = {
                  secondCourseDiscount: data.secondCourseDiscount,
                  appliedPrice: curriculumState.appliedPrice,
                  familyDiscount: data.familyDiscount,
                  customDiscount: data.customDiscount,
                  customDiscountValue: data.customDiscountValue,
                  employeeDiscount: data.employeeDiscount,
                  familyId: newStudentId.current,
                  fullPrice: curriculumState.fullPrice,
                };
                const allFamily = [...fee.studentFamilyToUpdate, studentValues];
                allFamily.map(async (family) => {
                  if (family.familyId !== newStudentId.current) {
                    await secureSetDoc(
                      doc(db, "students", family.familyId),
                      {
                        studentFamilyAtSchool: familyArray.filter(
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

            // Atualiza ou cria o contador, garantindo que o publicId seja único e crescente
            transaction.set(
              countersRef,
              { value: publicId + 1 },
              { merge: true }
            );
            toast.success(`Aluno ${data.name} criado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            resetForm();
            setIsSubmitting(false);
          });
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

      // CHEKING VALID FINANCIAL RESPONSIBLE DOCUMENT
      if (!testFinancialCPF) {
        return (
          setIsSubmitting(false),
          toast.error(
            "CPF do responsável financeiro é inválido, por favor verifique... ❕",
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

      // CHEKING VALID STUDENT DOCUMENT
      if (!testCPF) {
        return (
          setIsSubmitting(false),
          toast.error("CPF do aluno é inválido, por favor verifique... ❕", {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      }

      // CHEKING VALID SECONDARY PHONE
      if (studentData.financialResponsible.activePhoneSecondary) {
        if (studentData.financialResponsible.phoneSecondary.ddd === "DDD") {
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

      // CHEKING VALID TERTIARY PHONE
      if (studentData.financialResponsible.activePhoneTertiary) {
        if (studentData.financialResponsible.phoneTertiary.ddd === "DDD") {
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

      // CHECK FAMILY AT SCHOOL DETAILS
      if (studentData.familyDiscount) {
        if (
          (studentData.studentFamilyAtSchool.length === 0 &&
            studentData.familyDiscount) ||
          (studentData.studentFamilyAtSchool.length > 0 &&
            studentData.studentFamilyAtSchool.includes(""))
        ) {
          setIsSubmitting(false);
          return toast.error(
            `Por favor, verifique os dados dos parentes que já estudam na escola... ☑️`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        }
      }

      // CHECKING IF STUDENT EXISTS ON DATABASE
      const students = studentsDb as StudentSearchProps[];
      const studentExists = students.find(
        (student) => student.document === data.document
      );

      if (studentExists) {
        // IF EXISTS, RETURN ERROR
        return (
          setIsSubmitting(false),
          toast.error(`CPF do Aluno já existe no nosso banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF NOT EXISTS, CREATE
        addStudent();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex h-full flex-col container text-center overflow-scroll no-scrollbar pb-16 ${
        page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" &&
        "rounded-xl"
      } `}
    >
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      {page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" && (
          <h1 className="font-bold text-2xl my-4">Adicionar Aluno</h1>
        )}

      {/* FORM */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleAddStudent)}
          className={`flex flex-col w-full gap-2 rounded-xl ${
            page.show !== "Dashboard" &&
            userFullData &&
            userFullData.role !== "user"
              ? "bg-klGreen-500/20 dark:bg-klGreen-500/30 p-4 mt-2"
              : "pb-4 px-4 pt-2"
          }`}
        >
          {/* // -------------------------------------------------------- SECTION 1: STUDENT DATA -------------------------------------------------------- // */}

          {/** PERSONAL DATA FORM */}
          <PersonalDataForm
            studentData={studentData}
            setStudentData={setStudentData}
            testCPF={testCPF} // Defina a lógica do CPF aqui
            isSubmitting={isSubmitting} // Defina o estado de submissão aqui
            renewBirthDayValue={renewBirthDayValue} // Passando valor para renewBirthDayValue
            setTestCPF={setTestCPF} // Passar a função de validação do CPF
          />

          {/* PARENT ONE FORM */}
          <ParentForm
            onlyView={false}
            parent="parentOne"
            setStudentData={setStudentData}
            student={studentData}
          />

          {/* PARENT TWO FORM */}
          <ParentForm
            onlyView={false}
            parent="parentTwo"
            setStudentData={setStudentData}
            student={studentData}
          />

          {/* // ------------------------------------------- SECTION 2: STUDENT COURSE AND FAMILY DATA | PRICES ------------------------------------------- // */}
          {/** CURRICULUM SECTION TITLE */}
          {curriculumCount > 0 && (
            <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
              Selecionar Modalidade:
            </h1>
          )}
          {Array.from({ length: curriculumCount }).map((_, index) => (
            <SelectSchoolAndCourse
              key={index}
              curriculumState={curriculumState}
              selectedSchoolClassId={studentData.schoolYears}
              onAdd={upsertCurriculum}
              onDel={removeCurriculum}
              studentFreeDays={studentFreeDays}
              studentId={newStudentId.current}
            />
          ))}
          {/* Botão para adicionar um novo currículo (apenas aparece quando o contador é maior que 0) */}
          {curriculumCount > 0 && (
            <div className="flex justify-center py-2">
              <div
                className="flex w-2/4 items-center justify-center gap-4 px-4 py-1 cursor-pointer border rounded-md border-green-900/10 bg-klGreen-500 hover:bg-klGreen-500/80 transition-all disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                onClick={handleManageShowCurriculumSelects}
              >
                {curriculumCount > 1 &&
                curriculumCount > curriculumState.curriculums.length ? (
                  <MdDelete />
                ) : (
                  <MdAdd />
                )}
                <span>
                  {curriculumCount > 1 &&
                  curriculumCount > curriculumState.curriculums.length
                    ? "Cancelar"
                    : "Adicionar outra modalidade"}
                </span>
              </div>
            </div>
          )}

          {curriculumState.curriculums.length > 0 &&
            systemConstantsValues &&
            userFullData && (
              <>
                <FamilyForm
                  studentData={studentData}
                  setStudentData={setStudentData}
                  systemConstantsValues={systemConstantsValues}
                />
                {getRegularCurriculums(curriculumState.curriculums).length >
                  0 && (
                  <>
                    <DiscountForm
                      data={studentData}
                      setData={setStudentData}
                      systemConstantsValues={systemConstantsValues}
                      userRole={userFullData.role}
                    />
                    <PaymentDetails
                      data={studentData}
                      setData={setStudentData}
                      systemConstantsValues={systemConstantsValues}
                      userRole={userFullData.role}
                      appliedPrice={curriculumState.appliedPrice}
                      enrolmentFee={curriculumState.enrollmentFee}
                    />
                  </>
                )}
                <FinancialResponsibleForm
                  activePhoneSecondary={activePhoneSecondary}
                  activePhoneTertiary={activePhoneTertiary}
                  isExperimental={
                    getExperimentalCurriculums(curriculumState.curriculums)
                      .length > 0
                  }
                  setActivePhoneSecondary={setActivePhoneSecondary}
                  setActivePhoneTertiary={setActivePhoneTertiary}
                  setStudentData={setStudentData}
                  setTestFinancialCPF={setTestFinancialCPF}
                  student={studentData}
                  testFinancialCPF={testFinancialCPF}
                  onlyView={false}
                  editAddress={editAddress}
                  setEditAddress={setEditAddress}
                />
              </>
            )}

          {/* SUBMIT AND RESET BUTTONS */}
          <div className="flex gap-2 mt-4">
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
            >
              {!isSubmitting ? "Criar" : "Criando"}
            </button>

            {/* RESET BUTTON */}
            <button
              type="reset"
              className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
              disabled={isSubmitting}
              onClick={async () => {
                resetForm();
                login && setIsExperimentalClass(false);
              }}
            >
              {isSubmitting
                ? "Aguarde"
                : isExperimentalClass
                ? "Voltar"
                : "Limpar"}
            </button>
          </div>
        </form>
      </FormProvider>
      {userFullData && (
        <CurriculumBalloon
          curriculumState={curriculumState}
          userRole={userFullData.role}
          customDiscount={studentData.customDiscount}
          customDiscountValue={studentData.customDiscountValue}
          employeeDiscount={studentData.employeeDiscount}
          familyDiscount={studentData.familyDiscount}
          secondCourseDiscount={studentData.secondCourseDiscount}
          studentFamilyAtSchool={studentData.studentFamilyAtSchool}
          paymentDay={studentData.paymentDay}
        />
      )}
    </div>
  );
}
