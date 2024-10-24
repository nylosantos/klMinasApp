/* eslint-disable react-hooks/exhaustive-deps */
import cep from "cep-promise";
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "./SelectOptions";
import { editStudentValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "./BrazilianStateSelectOptions";
import {
  ClassDaySearchProps,
  CurriculumArrayProps,
  CurriculumSearchProps,
  EditStudentValidationZProps,
  ExcludeCurriculumProps,
  ExcludeFamilyProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  SearchCurriculumValidationZProps,
  StudentFamilyAtSchoolProps,
  StudentSearchProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
import {
  classDayIndex,
  employeeDiscountValue,
  familyDiscountValue,
  formataCPF,
  months,
  secondCourseDiscountValue,
  testaCPF,
  weekDays,
} from "../../custom";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { HandleClickOpenFunctionProps } from "../../pages/Dashboard";
import EditDashboardHeader from "../layoutComponents/EditDashboardHeader";

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
  setIsEdit,
  setIsFinance,
  setIsDetailsViewing,
}: EditStudentFormProps) {
  // GET GLOBAL DATA
  const {
    classDaysDatabaseData,
    curriculumDatabaseData,
    scheduleDatabaseData,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    studentsDatabaseData,
    page,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // STUDENT EDIT DATA
  const [studentEditData, setStudentEditData] =
    useState<EditStudentValidationZProps>({
      // Section 1: Student Data
      id: "",
      name: "",
      birthDate: "",
      classComplement: "",
      parentOne: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },
      parentTwo: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },

      // Section 2: Student Course and Family Data | Prices
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
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
          prefix: "",
          suffix: "",
        },
        activePhoneSecondary: false,
        phoneSecondary: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
        activePhoneTertiary: false,
        phoneTertiary: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },
    });

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // NEW STUDENT DATA STATE
  const [newStudentData, setNewStudentData] = useState({
    confirmAddFamily: false,
    confirmAddCurriculum: false,
    confirmAddExperimentalCurriculum: false,
    curriculum: "",
    curriculumName: "",
    curriculumClassDayId: "",
    curriculumInitialDate: "",
    curriculumCoursePriceUnit: 0,
    curriculumCoursePriceBundle: 0,
    curriculumCourseBundleDays: 0,
    experimentalCurriculum: "",
    experimentalCurriculumName: "",
    experimentalCurriculumClassDayId: "",
    experimentalCurriculumInitialDate: "",
    familyId: "",
    familyName: "",
    newFamilySchoolId: "",
    newFamilySchoolClassId: "",
    newFamilyCurriculumId: "",
    indexDays: [] as number[],
  });

  type NewPricesProps = {
    appliedPrice: number;
    fullPrice: number;
  };

  // NEW PRICES STATE
  const [newPrices, setNewPrices] = useState<NewPricesProps>({
    appliedPrice: 0,
    fullPrice: 0,
  });

  // REGISTRATION EXEMPTION STATE
  const [enrolmentExemption, setEnrolmentExemption] = useState(false);

  // CHANGE ENROLMENT FEE VALUE WHEN ACTIVATE REGISTRATION EXEMPTION
  useEffect(() => {
    if (enrolmentExemption) {
      setStudentEditData({ ...studentEditData, enrolmentFee: 0 });
    } else {
      setStudentEditData({
        ...studentEditData,
        enrolmentFee:
          new Date().getMonth() < 6
            ? 135
            : new Date().getMonth() < 10
            ? 67.5
            : 0,
      });
    }
  }, [enrolmentExemption]);

  // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
  useEffect(() => {
    if (studentEditData.customDiscount) {
      setStudentEditData({ ...studentEditData, customDiscountValue: "0" });
    }
  }, [studentEditData.customDiscount]);

  // CURRICULUM / EXPERMIENTAL CLASS STATE
  const [newClass, setNewClass] = useState({
    date: "",
    name: "",
    enrolledDays: [] as number[],
  });

  // PICK STUDENT CLASS DAYS
  // CLASS DAY BOOLEAN DATA
  const [classDaysData, setClassDaysData] = useState({
    Domingo: true,
    Segunda: true,
    Terça: true,
    Quarta: true,
    Quinta: true,
    Sexta: true,
    Sábado: true,
  });

  // TOGGLE CLASS DAYS VALUE FUNCTION
  function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
    setClassDaysData({ ...classDaysData, [day]: value });
    if (value) {
      classDayIndex.map((dayIndex) => {
        if (dayIndex.name === day) {
          if (dayIndex.name === "Domingo") {
            setNewClass({
              ...newClass,
              enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
            });
          }
          if (dayIndex.name === "Segunda") {
            const foundSunday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 0
            );
            if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, insertAt),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(insertAt),
                ],
              });
            } else {
              setNewClass({
                ...newClass,
                enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
              });
            }
          }
          if (dayIndex.name === "Terça") {
            const foundSunday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 0
            );
            const foundMonday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 1
            );
            if (foundMonday !== -1) {
              const insertAt = foundMonday + 1;
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, insertAt),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(insertAt),
                ],
              });
            } else if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, insertAt),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(insertAt),
                ],
              });
            } else {
              setNewClass({
                ...newClass,
                enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
              });
            }
          }
          if (dayIndex.name === "Quarta") {
            const foundSunday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 0
            );
            const foundMonday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 1
            );
            const foundTuesday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 2
            );
            if (foundTuesday !== -1) {
              const insertAt = foundTuesday + 1;
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, insertAt),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(insertAt),
                ],
              });
            } else if (foundMonday !== -1) {
              const insertAt = foundMonday + 1;
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, insertAt),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(insertAt),
                ],
              });
            } else if (foundSunday !== -1) {
              const insertAt = foundSunday + 1;
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, insertAt),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(insertAt),
                ],
              });
            } else {
              setNewClass({
                ...newClass,
                enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
              });
            }
          }
          if (dayIndex.name === "Quinta") {
            const foundSaturday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 6
            );
            const foundFriday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 5
            );
            if (foundFriday !== -1) {
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, foundFriday),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(foundFriday),
                ],
              });
            } else if (foundSaturday !== -1) {
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, foundSaturday),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(foundSaturday),
                ],
              });
            } else {
              setNewClass({
                ...newClass,
                enrolledDays: [...newClass.enrolledDays, dayIndex.id],
              });
            }
          }
          if (dayIndex.name === "Sexta") {
            const foundSaturday = newClass.enrolledDays.findIndex(
              (classDayId) => classDayId === 6
            );
            if (foundSaturday !== -1) {
              setNewClass({
                ...newClass,
                enrolledDays: [
                  ...newClass.enrolledDays.slice(0, foundSaturday),
                  dayIndex.id,
                  ...newClass.enrolledDays.slice(foundSaturday),
                ],
              });
            } else {
              setNewClass({
                ...newClass,
                enrolledDays: [...newClass.enrolledDays, dayIndex.id],
              });
            }
          }
          if (dayIndex.name === "Sábado") {
            setNewClass({
              ...newClass,
              enrolledDays: [...newClass.enrolledDays, dayIndex.id],
            });
          }
        }
      });
    } else {
      classDayIndex.map((dayIndex) => {
        if (dayIndex.name === day) {
          setNewClass({
            ...newClass,
            enrolledDays: newClass.enrolledDays.filter(
              (classDayId) => classDayId !== dayIndex.id
            ),
          });
        }
      });
    }
  }
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT SELECT STATES AND FUNCTIONS -------------------------- //
  // STUDENT SELECTED STATE DATA
  const [studentSelectedData, setStudentSelectedData] =
    useState<StudentSearchProps>();

  // HAVE CURRICULUM STATE
  const [haveCurriculum, setHaveCurriculum] = useState(false);

  // INCLUDE / EXLUDE CURRICULUM STATES
  const [excludeCurriculum, setExcludeCurriculum] = useState<
    ExcludeCurriculumProps[]
  >([]);

  // NEW STUDENT CURRICULUM STATE ARRAY
  const [newStudentCurriculumArray, setNewStudentCurriculumArray] = useState<
    (string | undefined)[]
  >([]);

  // INCLUDE / EXLUDE CURRICULUM STATES
  const [excludeExperimentalCurriculum, setExcludeExperimentalCurriculum] =
    useState<ExcludeCurriculumProps[]>([]);

  // NEW STUDENT CURRICULUM STATE ARRAY
  const [
    newStudentExperimentalCurriculumArray,
    setNewStudentExperimentalCurriculumArray,
  ] = useState<(string | undefined)[]>([]);

  // CHANGE STUDENT CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
  function handleIncludeExcludeCurriculum(
    index: number,
    data: ExcludeCurriculumProps
  ) {
    if (data.exclude) {
      setNewStudentCurriculumArray(
        newStudentCurriculumArray.filter((id) => id !== data.id)
      );
    } else {
      setNewStudentCurriculumArray((newStudentCurriculumArray) => [
        ...newStudentCurriculumArray,
        data.id,
      ]);
    }

    const newExcludeCurriculum = excludeCurriculum.map((curriculum, i) => {
      if (i === index) {
        return {
          exclude: data.exclude,
          id: data.id,
          name: data.name,
          date: data.date,
          isExperimental: data.isExperimental,
          indexDays: data.indexDays,
          price: data.price,
        };
      } else {
        // THE REST HAVEN'T CHANGED
        return curriculum;
      }
    });
    setExcludeCurriculum(newExcludeCurriculum);
  }

  // CHANGE STUDENT EXPERIMENTAL CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
  function handleIncludeExcludeExperimentalCurriculum(
    index: number,
    data: ExcludeCurriculumProps
  ) {
    if (data.exclude) {
      setNewStudentExperimentalCurriculumArray(
        newStudentExperimentalCurriculumArray.filter((id) => id !== data.id)
      );
    } else {
      setNewStudentExperimentalCurriculumArray(
        (newStudentExperimentalCurriculumArray) => [
          ...newStudentExperimentalCurriculumArray,
          data.id,
        ]
      );
    }
    const newExcludeExperimentalCurriculum = excludeExperimentalCurriculum.map(
      (curriculum, i) => {
        if (i === index) {
          return {
            exclude: data.exclude,
            id: data.id,
            name: data.name,
            date: data.date,
            isExperimental: data.isExperimental,
            indexDays: data.indexDays,
            price: data.price,
          };
        } else {
          // THE REST HAVEN'T CHANGED
          return curriculum;
        }
      }
    );
    setExcludeExperimentalCurriculum(newExcludeExperimentalCurriculum);
  }

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
            prefix: studentEditData.financialResponsible.activePhoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  5,
                  10
                )
              : "",
            suffix: studentEditData.financialResponsible.activePhoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  -4
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
            prefix: studentEditData.financialResponsible.activePhoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(
                  5,
                  10
                )
              : "",
            suffix: studentEditData.financialResponsible.activePhoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(-4)
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
      studentsDatabaseData.map((student) => {
        if (student.id === studentId) {
          setStudentSelectedData(student);
        }
      });
    }
  }, [studentId]);

  // STUDENT FAMILY DETAILS STATE
  const [studentFamilyDetails, setStudentFamilyDetails] = useState<
    StudentFamilyAtSchoolProps[]
  >([]);

  // STUDENT CURRICULUM DETAILS STATE
  const [studentCurriculumDetails, setStudentCurriculumDetails] = useState<
    CurriculumArrayProps[]
  >([]);

  // SET STUDENT EDIT ARRAYS
  // SET STUDENT FAMILY DETAILS
  const handleStudentFamilyDetails = async () => {
    const foundedStudent = studentsDatabaseData.find(
      (student) => student.id === studentId
    );

    if (foundedStudent) {
      setStudentFamilyDetails(foundedStudent.studentFamilyAtSchool);
    }
  };

  // ARRAY TO STORE ORIGINAL STUDENT CLASS DAYS
  const [originalStudentClassDays, setOriginalStudentClassDays] = useState<
    number[]
  >([]);

  // SET STUDENT CURRICULUM DETAILS
  const handleStudentCurriculumDetails = async () => {
    const foundedStudent = studentsDatabaseData.find(
      (student) => student.id === studentId
    );
    if (foundedStudent) {
      const allStudentClassDays: number[] = [];
      foundedStudent.curriculumIds.map((curriculumDetail) => {
        setStudentCurriculumDetails((studentCurriculumDetails) => [
          ...studentCurriculumDetails,
          curriculumDetail,
        ]);
        setNewStudentData({
          ...newStudentData,
          indexDays: curriculumDetail.indexDays,
        });
        curriculumDetail.indexDays.map((day) => {
          allStudentClassDays.push(day);
        });
      });
      setOriginalStudentClassDays(allStudentClassDays);
    }
  };

  // SET STUDENT EXPERIMENTAL CURRICULUM DETAILS
  const handleStudentExperimentalCurriculumDetails = async () => {
    const foundedStudent = studentsDatabaseData.find(
      (student) => student.id === studentId
    );

    if (foundedStudent) {
      foundedStudent.experimentalCurriculumIds.map((curriculumDetail) => {
        setStudentCurriculumDetails((studentCurriculumDetails) => [
          ...studentCurriculumDetails,
          curriculumDetail,
        ]);
      });
    }
  };

  // SET STUDENT FAMILY ARRAY DETAILS WHEN STUDENT IS SELECTED
  useEffect(() => {
    setExcludeExperimentalCurriculum([]);
    setExcludeFamily([]);
    setStudentCurriculumDetails([]);
    setStudentFamilyDetails([]);
    if (studentId !== "") {
      handleStudentFamilyDetails();
      handleStudentCurriculumDetails();
      handleStudentExperimentalCurriculumDetails();
    }
  }, [studentId]);

  // SET STUDENT EDIT WHEN SELECT STUDENT
  useEffect(() => {
    if (studentSelectedData) {
      setDateToString(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        studentSelectedData.birthDate.toDate().toLocaleDateString()
      );
      // SET STUDENT EDIT ALL DATA
      setStudentEditData({
        ...studentEditData,
        // Section 1: Student Data
        id: studentId,
        name: studentSelectedData.name,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        birthDate: studentSelectedData.birthDate.toDate().toLocaleDateString(),
        classComplement: studentSelectedData.classComplement,
        parentOne: {
          name: studentSelectedData.parentOne.name,
          email: studentSelectedData.parentOne.email,
          phone: {
            ddd: studentSelectedData.parentOne.phone.slice(3, 5),
            prefix: studentSelectedData.parentOne.phone.slice(5, 10),
            suffix: studentSelectedData.parentOne.phone.slice(-4),
          },
        },
        parentTwo: {
          name: studentSelectedData.parentTwo.name,
          email: studentSelectedData.parentTwo.email,
          phone: {
            ddd: studentSelectedData.parentTwo.phone.slice(3, 5),
            prefix: studentSelectedData.parentTwo.phone.slice(5, 10),
            suffix: studentSelectedData.parentTwo.phone.slice(-4),
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
            prefix: studentSelectedData.financialResponsible.phone.slice(5, 10),
            suffix: studentSelectedData.financialResponsible.phone.slice(-4),
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
            prefix: studentSelectedData.financialResponsible.phoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  5,
                  10
                )
              : "",
            suffix: studentSelectedData.financialResponsible.phoneSecondary
              ? studentSelectedData.financialResponsible.phoneSecondary.slice(
                  -4
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
            prefix: studentSelectedData.financialResponsible.phoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(
                  5,
                  10
                )
              : "",
            suffix: studentSelectedData.financialResponsible.phoneTertiary
              ? studentSelectedData.financialResponsible.phoneTertiary.slice(-4)
              : "",
          },
        },
      });
    }
  }, [studentSelectedData]);

  // SET STUDENT CURRENCY VALUES TO NEW PRICES STATE
  useEffect(() => {
    setNewPrices({
      appliedPrice: studentEditData.appliedPrice,
      fullPrice: studentEditData.fullPrice,
    });
  }, [studentEditData.appliedPrice, studentEditData.fullPrice]);

  // IF STUDENT HAVE CURRICULUM SET STATE AND SHOW INPUTS
  useEffect(() => {
    setExcludeCurriculum([]);
    setExcludeExperimentalCurriculum([]);
    if (studentCurriculumDetails !== undefined) {
      if (studentCurriculumDetails.length > 0) {
        setHaveCurriculum(true);
        for (let index = 0; index < studentCurriculumDetails.length; index++) {
          if (studentCurriculumDetails[index]! !== undefined) {
            if (studentCurriculumDetails[index]!.isExperimental) {
              setExcludeExperimentalCurriculum(
                (excludeExperimentalCurriculum) => [
                  ...excludeExperimentalCurriculum,
                  {
                    exclude: false,
                    id: studentCurriculumDetails![index]!.id,
                    name: studentCurriculumDetails![index]!.name,
                    isExperimental:
                      studentCurriculumDetails![index]!.isExperimental,
                    date: studentCurriculumDetails![index]!.date,
                    indexDays: studentCurriculumDetails![index]!.indexDays,
                    price: studentCurriculumDetails![index]!.price,
                  },
                ]
              );
            } else {
              setExcludeCurriculum((excludeCurriculum) => [
                ...excludeCurriculum,
                {
                  exclude: false,
                  id: studentCurriculumDetails![index]!.id,
                  name: studentCurriculumDetails![index]!.name,
                  isExperimental:
                    studentCurriculumDetails![index]!.isExperimental,
                  date: studentCurriculumDetails![index]!.date,
                  indexDays: studentCurriculumDetails![index]!.indexDays,
                  price: studentCurriculumDetails![index]!.price,
                },
              ]);
            }
          }
        }
      } else {
        setHaveCurriculum(false);
      }
    }
  }, [studentCurriculumDetails]);
  // -------------------------- END OF STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT EDIT STATES AND FUNCTIONS -------------------------- //
  // DATE TO STRING STATE
  const [dateToString, setDateToString] = useState("");

  // DATE SUBMIT STRING STATE
  const [dateSubmitToString, setDateSubmitToString] = useState("");

  // TRANSFORM DATE TO FORMAT OF FIREBASE MM/DD/YYYY
  useEffect(() => {
    if (dateToString) {
      setDateSubmitToString(
        `${dateToString.slice(3, 5)}/${dateToString.slice(
          0,
          2
        )}/${dateToString.slice(-4)}`
      );
    }
  }, [dateToString]);

  // CEP SUBMITTING STATE
  const [cepSubmitting, setCepSubmitting] = useState(false);

  // CEP ERROR STATE
  const [cepError, setCepError] = useState(false);

  // EDIT ADDRESS STATE
  const [editAddress, setEditAddress] = useState(false);

  // GET CEP (BRAZILIAN ZIP CODE) FUNCTION
  const getCep = async (data: string) => {
    setEditAddress(false);
    if (data) {
      setCepSubmitting(true);
      await cep(data)
        .then((response) => {
          setCepSubmitting(false);
          setStudentEditData({
            ...studentEditData,
            financialResponsible: {
              ...studentEditData.financialResponsible,
              address: {
                ...studentEditData.financialResponsible.address,
                cep: data,
                street: response.street,
                neighborhood: response.neighborhood,
                city: response.city,
                state: response.state,
                // RESETING NUMBER AND COMPLEMENT WHEN GET CEP
                number: "",
                complement: "",
              },
            },
          });
        })
        .catch((error) => {
          console.log("ESSE É O ERROR", error);
          setCepSubmitting(false);
          toast.error(
            `Erro ao pesquisar o CEP, verifique o número ou insira o endereço manualmente... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        });
    } else {
      setCepError(true);
      setCepSubmitting(false);
      toast.error(`Por favor, preencha o CEP para pesquisa.`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
  };

  // FORMAT CEP (BRAZILIAN ZIP CODE) FUNCTION
  const formatCEP = (cepNumber: string) => {
    cepNumber = cepNumber.replace(/[^\d]/g, "");
    return cepNumber.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
  };

  // HAVE FAMILY STATE
  const [haveFamily, setHaveFamily] = useState(false);

  // GET BROTHER NAME TO PUT ON FORM
  useEffect(() => {
    if (studentFamilyDetails !== undefined) {
      if (studentFamilyDetails.length > 0) {
        setExcludeFamily([]);
        setHaveFamily(true);
        for (let index = 0; index < studentFamilyDetails.length; index++) {
          setExcludeFamily((excludeFamily) => [
            ...excludeFamily,
            {
              exclude: false,
              applyDiscount: studentFamilyDetails![index]!.applyDiscount,
              id: studentFamilyDetails![index]!.id,
              name: studentFamilyDetails![index]!.name,
            },
          ]);
        }
      } else {
        setHaveFamily(false);
      }
    }
  }, [studentFamilyDetails]);

  // INCLUDE / EXLUDE FAMILY STATES
  const [excludeFamily, setExcludeFamily] = useState<ExcludeFamilyProps[]>([]);

  // NEW STUDENT FAMILY STATE ARRAY
  const [newStudentFamilyArray, setNewStudentFamilyArray] = useState<
    (string | undefined)[]
  >([]);

  // CHANGE STUDENT FAMILY (INCLUDE / EXCLUDE) FUNCTION
  function handleIncludeExcludeFamily(index: number, data: ExcludeFamilyProps) {
    if (data.exclude) {
      setNewStudentFamilyArray(
        newStudentFamilyArray.filter((id) => id !== data.id)
      );
    } else {
      setNewStudentFamilyArray((newStudentFamilyArray) => [
        ...newStudentFamilyArray,
        data.id,
      ]);
    }

    const newExcludeFamily = excludeFamily.map((family, i) => {
      if (i === index) {
        return {
          exclude: data.exclude,
          applyDiscount: data.applyDiscount,
          id: data.id,
          name: data.name,
        };
      } else {
        // THE REST HAVEN'T CHANGED
        return family;
      }
    });
    setExcludeFamily(newExcludeFamily);
  }
  // -------------------------- END OF STUDENT EDIT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW FAMILY STATES AND FUNCTIONS -------------------------- //
  // NEW FAMILY SELECTED STATE DATA
  const [newFamilySelectedData, setNewFamilySelectedData] =
    useState<StudentSearchProps>();

  // SET NEW FAMILY SELECTED STATE WHEN SELECT NEW FAMILY
  useEffect(() => {
    if (newStudentData.familyId !== "") {
      setNewFamilySelectedData(
        studentsDatabaseData.find(({ id }) => id === newStudentData.familyId)
      );
    } else {
      setNewSchoolSelectedData(undefined);
    }
  }, [newStudentData.familyId]);

  // SET FAMILY NAME WHEN SELECTED NEW FAMILY
  useEffect(() => {
    if (newFamilySelectedData !== undefined) {
      setNewStudentData({
        ...newStudentData,
        familyName: newFamilySelectedData.name,
      });
    }
  }, [newFamilySelectedData]);

  // RESET ADD NEW FAMILY CONFIRMATION WHEN NEW FAMILY CHANGE
  useEffect(() => {
    setNewStudentData({ ...newStudentData, confirmAddFamily: false });
  }, [newStudentData.familyId]);
  // -------------------------- END OF NEW FAMILY STATES AND FUNCTIONS -------------------------- //

  // ---------------------------------------- ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //
  // EXPERIMENTAL CURRICULUM DATA
  const [experimentalCurriculumData, setExperimentalCurriculumData] =
    useState<SearchCurriculumValidationZProps>({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });

  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<SearchCurriculumValidationZProps>({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  const [newClassError, setNewClassError] = useState(false);

  // SCHOOL SELECTED STATE DATA
  const [newSchoolSelectedData, setNewSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setNewSchoolClassSelectedData(undefined);
    if (curriculumData.schoolId !== "") {
      setNewSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === curriculumData.schoolId)
      );
    } else {
      setNewSchoolSelectedData(undefined);
    }
  }, [curriculumData.schoolId]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    if (studentEditData.addCurriculum) {
      (
        document.getElementById("newSchoolClassSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
    }
  }, [curriculumData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [newSchoolClassSelectedData, setNewSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setNewSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === curriculumData.schoolClassId
        )
      );
    } else {
      setNewSchoolClassSelectedData(undefined);
    }
  }, [curriculumData.schoolClassId]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    if (studentEditData.addCurriculum) {
      (
        document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      handleNewAvailableCoursesData();
    }
  }, [curriculumData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  const [newSchoolCourseSelectedData, setNewSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setNewSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
          ({ id }) => id === curriculumData.schoolCourseId
        )
      );
    } else {
      setNewSchoolCourseSelectedData(undefined);
    }
  }, [curriculumData.schoolCourseId]);

  // SET SCHOOL COURSE PRICES WHEN SELECTED COURSE
  useEffect(() => {
    if (newStudentData.curriculum) {
      const foundedCurriculum = curriculumDatabaseData.find(
        (curriculum) => curriculum.id === newStudentData.curriculum
      );

      if (foundedCurriculum) {
        const foundedSchoolCourse = schoolCourseDatabaseData.find(
          (schoolCourse) => schoolCourse.id === foundedCurriculum.schoolCourseId
        );
        if (foundedSchoolCourse) {
          setNewStudentData({
            ...newStudentData,
            curriculumCourseBundleDays: foundedSchoolCourse.bundleDays,
            curriculumCoursePriceBundle: foundedSchoolCourse.priceBundle,
            curriculumCoursePriceUnit: foundedSchoolCourse.priceUnit,
          });
        }
      }
    }
  }, [newStudentData.curriculum, newClass]);

  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DETAILS ARRAY STATE
  const [newCurriculumCoursesData, setNewCurriculumCoursesData] = useState<
    CurriculumSearchProps[]
  >([]);

  // GETTING CURRICULUM DATA
  const handleNewAvailableCoursesData = async () => {
    if (curriculumData.schoolCourseId === "all") {
      const filterCurriculum = curriculumDatabaseData.filter(
        (curriculum) =>
          curriculum.schoolId === curriculumData.schoolId &&
          curriculum.schoolClassId === curriculumData.schoolClassId
      );
      setNewCurriculumCoursesData(filterCurriculum);
    } else {
      const filterCurriculum = curriculumDatabaseData.filter(
        (curriculum) =>
          curriculum.schoolId === curriculumData.schoolId &&
          curriculum.schoolClassId === curriculumData.schoolClassId &&
          curriculum.schoolCourseId === curriculumData.schoolCourseId
      );
      setNewCurriculumCoursesData(filterCurriculum);
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleNewAvailableCoursesData();
  }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
  // NEW CURRICULUM CLASS DAY SELECTED STATE DATA
  const [classDayCurriculumSelectedData, setClassDayCurriculumSelectedData] =
    useState<ClassDaySearchProps>();

  // DAY ALREADY WITH CLASS ALERT
  const [dayIsAlreadyWithClass, setDayIsAlreadyWithClass] = useState(false);

  // GET CLASS DAY FULL DATA WHEN HAVE CURRICULUM SELECTED DATA
  useEffect(() => {
    const handleNewCurriculumClassDayFullData = async () => {
      const filterClassDays = classDaysDatabaseData.find(
        (classDays) => classDays.id === newStudentData.curriculumClassDayId
      );

      if (filterClassDays) {
        setClassDayCurriculumSelectedData(filterClassDays);
      } else {
        setClassDayCurriculumSelectedData(undefined);
      }
    };
    handleNewCurriculumClassDayFullData();
  }, [newStudentData.curriculumClassDayId]);

  // ARRAY TO GET ENROLLED DAYS STATE
  const [newClassDayArray, setNewClassDayArray] = useState<number[]>([]);

  // COUNTING ENROLLED DAYS STATE
  const [daysFoundCount, setDaysFoundCount] = useState(0);

  // GET THE DAY TO KNOW IF IT ALREADY EXISTS ON STUDENT DATABASE
  useEffect(() => {
    if (daysFoundCount > 0) {
      setDayIsAlreadyWithClass(true);
    } else {
      setDayIsAlreadyWithClass(false);
    }
  }, [daysFoundCount]);

  // SET AN ARRAY WITH ENROLLED DAYS WHEN CLASS DAY CURRICULUM IS SELECTED
  useEffect(() => {
    setNewStudentData({
      ...newStudentData,
      indexDays: originalStudentClassDays,
    });
    setNewClassDayArray([]);
    setDaysFoundCount(0);
    if (classDayCurriculumSelectedData) {
      const daysToNewClassDayArray = [] as number[];
      classDayCurriculumSelectedData.indexDays.map((curriculumClassDay) => {
        const alreadyExists =
          newStudentData.indexDays.includes(curriculumClassDay);
        if (!alreadyExists) {
          const existInArray =
            daysToNewClassDayArray.includes(curriculumClassDay);
          // const existInArray = newClassDayArray.includes(curriculumClassDay);
          if (!existInArray) {
            daysToNewClassDayArray.push(curriculumClassDay);
          }
        }
        const showMessage =
          newStudentData.indexDays.includes(curriculumClassDay);
        if (showMessage) {
          setDaysFoundCount(daysFoundCount + 1);
        }
      });
      setNewClassDayArray(daysToNewClassDayArray);
    }
  }, [
    classDayCurriculumSelectedData,
    newStudentData.curriculum,
    // excludeCurriculum,
  ]);

  // SET NEW CLASS ENROLLED DAYS
  useEffect(() => {
    setNewClass({
      ...newClass,
      enrolledDays: newClassDayArray,
    });
  }, [newClassDayArray]);

  // -------------------------- END OF NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
  // NEW EXPERIMENTAL CURRICULUM CLASS DAY SELECTED STATE DATA
  const [
    classDayExperimentalCurriculumSelectedData,
    setClassDayExperimentalCurriculumSelectedData,
  ] = useState<ClassDaySearchProps>();

  // GET CLASS DAY FULL DATA WHEN HAVE EXPERIMENTAL CURRICULUM SELECTED DATA
  useEffect(() => {
    const handleNewExperimentalCurriculumClassDayFullData = async () => {
      const filterClassDays = classDaysDatabaseData.find(
        (classDays) =>
          classDays.id === newStudentData.experimentalCurriculumClassDayId
      );

      if (filterClassDays) {
        setClassDayExperimentalCurriculumSelectedData(filterClassDays);
      } else {
        setClassDayExperimentalCurriculumSelectedData(undefined);
      }
    };
    handleNewExperimentalCurriculumClassDayFullData();
  }, [newStudentData.experimentalCurriculumClassDayId]);

  // -------------------------- END OF NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // EXPERIMENTAL CLASS ERROR STATE
  const [experimentalClassError, setExperimentalClassError] = useState(false);

  // SCHOOL SELECTED STATE DATA
  const [
    newExperimentalSchoolSelectedData,
    setNewExperimentalSchoolSelectedData,
  ] = useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setNewExperimentalSchoolClassSelectedData(undefined);
    if (experimentalCurriculumData.schoolId !== "") {
      setNewExperimentalSchoolSelectedData(
        schoolDatabaseData.find(
          ({ id }) => id === experimentalCurriculumData.schoolId
        )
      );
    } else {
      setNewExperimentalSchoolSelectedData(undefined);
    }
  }, [experimentalCurriculumData.schoolId]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    if (studentEditData.addExperimentalCurriculum) {
      (
        document.getElementById(
          "newExperimentalSchoolClassSelect"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById(
          "newExperimentalSchoolCourseSelect"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
    }
  }, [experimentalCurriculumData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [
    newExperimentalSchoolClassSelectedData,
    setNewExperimentalSchoolClassSelectedData,
  ] = useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (experimentalCurriculumData.schoolClassId !== "") {
      setNewExperimentalSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === experimentalCurriculumData.schoolClassId
        )
      );
    } else {
      setNewExperimentalSchoolClassSelectedData(undefined);
    }
  }, [experimentalCurriculumData.schoolClassId]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    if (studentEditData.addExperimentalCurriculum) {
      (
        document.getElementById(
          "newExperimentalSchoolCourseSelect"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
      handleNewAvailableExperimentalCoursesData();
    }
  }, [experimentalCurriculumData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  const [
    newExperimentalSchoolCourseSelectedData,
    setNewExperimentalSchoolCourseSelectedData,
  ] = useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (experimentalCurriculumData.schoolCourseId !== "") {
      setNewExperimentalSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
          ({ id }) => id === experimentalCurriculumData.schoolCourseId
        )
      );
    } else {
      setNewExperimentalSchoolCourseSelectedData(undefined);
    }
  }, [experimentalCurriculumData.schoolCourseId]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DETAILS ARRAY STATE
  const [
    newExperimentalCurriculumCoursesData,
    setNewExperimentalCurriculumCoursesData,
  ] = useState<CurriculumSearchProps[]>([]);

  // GETTING CURRICULUM DATA
  const handleNewAvailableExperimentalCoursesData = async () => {
    if (experimentalCurriculumData.schoolCourseId === "all") {
      const filterCurriculum = curriculumDatabaseData.filter(
        (curriculum) =>
          curriculum.schoolId === experimentalCurriculumData.schoolId &&
          curriculum.schoolClassId === experimentalCurriculumData.schoolClassId
      );
      setNewExperimentalCurriculumCoursesData(filterCurriculum);
    } else {
      const filterCurriculum = curriculumDatabaseData.filter(
        (curriculum) =>
          curriculum.schoolId === experimentalCurriculumData.schoolId &&
          curriculum.schoolClassId ===
            experimentalCurriculumData.schoolClassId &&
          curriculum.schoolCourseId ===
            experimentalCurriculumData.schoolCourseId
      );
      setNewExperimentalCurriculumCoursesData(filterCurriculum);
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleNewAvailableExperimentalCoursesData();
  }, [experimentalCurriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // SET SELECTS INDEX WHEN ARE CHANGES
  // WHEN ADD FAMILY CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      setNewStudentData({
        ...newStudentData,
        familyId: "",
        newFamilySchoolId: "",
        newFamilySchoolClassId: "",
        newFamilyCurriculumId: "",
      });
      if (studentEditData.addFamily) {
        (
          document.getElementById("newFamilySchoolSelect") as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilySchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [studentEditData.addFamily]);

  // WHEN ADD CURRICULUM CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      setNewStudentData({
        ...newStudentData,
        curriculum: "",
        curriculumClassDayId: "",
        curriculumInitialDate: "",
        curriculumName: "",
        confirmAddCurriculum: false,
      });
      if (studentEditData.addCurriculum) {
        (
          document.getElementById("newSchoolSelect") as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newSchoolClassSelect") as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [studentEditData.addCurriculum]);

  // WHEN ADD EXPERIMENTAL CURRICULUM CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      setNewStudentData({
        ...newStudentData,
        experimentalCurriculum: "",
        experimentalCurriculumClassDayId: "",
        experimentalCurriculumInitialDate: "",
        experimentalCurriculumName: "",
        confirmAddExperimentalCurriculum: false,
      });
      if (studentEditData.addExperimentalCurriculum) {
        (
          document.getElementById(
            "newExperimentalSchoolSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newExperimentalSchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newExperimentalSchoolCourseSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [studentEditData.addExperimentalCurriculum]);

  // WHEN NEW FAMILY CURRICULUM SCHOOL ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById(
            "newFamilySchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilySchoolId]);

  // WHEN NEW FAMILY SCHOOL ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById(
            "newFamilySchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilySchoolId]);

  // WHEN NEW FAMILY SCHOOL CLASS ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilySchoolClassId]);

  // WHEN NEW FAMILY CURRICULUM ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilyCurriculumId]);
  // ---------------------------------------- END OF ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //

  // CHANGE MONTHLY PAYMENT WHEN ADD SCHOOL CLASS
  // SECOND CURRICULUM DATE AND PRICE CALC STATE
  const [curriculumDatePriceCalc, setCurriculumDatePriceCalc] = useState({
    mostExpensiveCourse: 0,
    othersPriceSum: 0,
  });

  // CHECKING IF STUDENT WILL HAVE CURRICULUM AFTER CHANGINGS
  useEffect(() => {
    setCurriculumDatePriceCalc({
      mostExpensiveCourse: 0,
      othersPriceSum: 0,
    });
  }, [excludeCurriculum]);

  // CALC OF MOST EXPENSIVE COURSE PRICE AND SUM THE SMALLEST VALUES
  useEffect(() => {
    if (
      curriculumDatePriceCalc.mostExpensiveCourse === 0 ||
      curriculumDatePriceCalc.othersPriceSum === 0
    ) {
      excludeCurriculum.map((curriculumDetail: ExcludeCurriculumProps) => {
        if (!curriculumDetail.exclude) {
          if (
            curriculumDetail.price > curriculumDatePriceCalc.mostExpensiveCourse
          ) {
            setCurriculumDatePriceCalc({
              ...curriculumDatePriceCalc,
              mostExpensiveCourse: curriculumDetail.price,
            });
          } else {
            setCurriculumDatePriceCalc({
              ...curriculumDatePriceCalc,
              othersPriceSum:
                curriculumDatePriceCalc.othersPriceSum + curriculumDetail.price,
            });
          }
        }
      });
    }
  }, [curriculumDatePriceCalc]);

  // function handleValueWithoutDiscount() {
  //   const remainingCurriculum = excludeCurriculum.filter(
  //     (curriculum) => !curriculum.exclude
  //   );
  //   if (remainingCurriculum.length > 0) {
  //     setNewPrices({
  //       appliedPrice: remainingCurriculum[0].price,
  //       fullPrice: remainingCurriculum[0].price,
  //     });
  //   } else {
  //     setNewPrices({
  //       appliedPrice: 0,
  //       fullPrice: 0,
  //     });
  //   }
  // }

  // function handleValueWithEmployeeDiscount() {
  //   let haveCurriculumWill = false;
  //   excludeCurriculum.find((curriculumExclude) => {
  //     if (!curriculumExclude.exclude) {
  //       haveCurriculumWill = true;
  //     }
  //   });
  //   const priceUnitDiscount = +(
  //     newStudentData.curriculumCoursePriceUnit * employeeDiscountValue
  //   ).toFixed(2);
  //   const priceBundleDiscount = +(
  //     newStudentData.curriculumCoursePriceBundle * employeeDiscountValue
  //   ).toFixed(2);

  //   if (haveCurriculumWill) {
  //     const curriculumsAfterChanging = excludeCurriculum.filter(
  //       (curriculum) => !curriculum.exclude
  //     );
  //     let biggerPrice = 0;
  //     let olderBiggerPrice = 0;
  //     let otherSumPrices = 0;
  //     curriculumsAfterChanging.map((curriculum) => {
  //       if (curriculum.price > biggerPrice) {
  //         olderBiggerPrice = biggerPrice;
  //         biggerPrice = curriculum.price;
  //         otherSumPrices = olderBiggerPrice + otherSumPrices;
  //       } else {
  //         otherSumPrices = otherSumPrices + curriculum.price;
  //       }
  //     });
  //     let newBiggerPrice = 0;
  //     let newOtherSumPrices = 0;
  //     const result = Math.floor(
  //       newClass.enrolledDays.length / newStudentData.curriculumCourseBundleDays
  //     );
  //     const rest =
  //       newClass.enrolledDays.length %
  //       newStudentData.curriculumCourseBundleDays;
  //     let newCoursePrice;
  //     if (isNaN(result) || isNaN(rest)) {
  //       newCoursePrice = 0;
  //     } else {
  //       newCoursePrice =
  //         result * newStudentData.curriculumCoursePriceBundle +
  //         rest * newStudentData.curriculumCoursePriceUnit;
  //     }
  //     if (biggerPrice < newCoursePrice) {
  //       newBiggerPrice = newCoursePrice;
  //       newOtherSumPrices = biggerPrice + otherSumPrices;
  //     } else {
  //       newBiggerPrice = biggerPrice;
  //       newOtherSumPrices = otherSumPrices + newCoursePrice;
  //     }
  //     setNewPrices({
  //       appliedPrice:
  //         newBiggerPrice * employeeDiscountValue + newOtherSumPrices,
  //       fullPrice: newBiggerPrice + newOtherSumPrices,
  //     });
  //   } else if (studentEditData.addCurriculum) {
  //     if (newClass.enrolledDays.length === 0) {
  //       setNewPrices({
  //         appliedPrice: 0,
  //         fullPrice: 0,
  //       });
  //     }
  //     if (newClass.enrolledDays.length === 1) {
  //       setNewPrices({
  //         appliedPrice: priceUnitDiscount,
  //         fullPrice: newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //     if (newClass.enrolledDays.length > 1) {
  //       const result = Math.floor(
  //         newClass.enrolledDays.length /
  //           newStudentData.curriculumCourseBundleDays
  //       );
  //       const rest =
  //         newClass.enrolledDays.length %
  //         newStudentData.curriculumCourseBundleDays;
  //       setNewPrices({
  //         appliedPrice: result * priceBundleDiscount + rest * priceUnitDiscount,
  //         fullPrice:
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //   } else {
  //     setNewPrices({
  //       appliedPrice: 0,
  //       fullPrice: 0,
  //     });
  //   }
  // }

  // function handleValueWithCustomDiscount() {
  //   let haveCurriculumWill = false;
  //   excludeCurriculum.map((curriculumExclude) => {
  //     if (!curriculumExclude.exclude) {
  //       haveCurriculumWill = true;
  //     } else {
  //       haveCurriculumWill = false;
  //     }
  //   });
  //   if (
  //     studentEditData.customDiscountValue &&
  //     +studentEditData.customDiscountValue > 0
  //   ) {
  //     // PRICE CALC IF CUSTOM DISCOUNT IS APPLIED
  //     const customDiscountValueSum = 100 - +studentEditData.customDiscountValue;
  //     const customDiscountFinalValue = +`0.${
  //       customDiscountValueSum > 9
  //         ? customDiscountValueSum
  //         : `0${customDiscountValueSum}`
  //     }`;
  //     const priceUnitDiscount = +(
  //       newStudentData.curriculumCoursePriceUnit * customDiscountFinalValue
  //     ).toFixed(2);
  //     const priceBundleDiscount = +(
  //       newStudentData.curriculumCoursePriceBundle * customDiscountFinalValue
  //     ).toFixed(2);

  //     if (haveCurriculumWill) {
  //       const curriculumsAfterChanging = excludeCurriculum.filter(
  //         (curriculum) => !curriculum.exclude
  //       );
  //       let biggerPrice = 0;
  //       let olderBiggerPrice = 0;
  //       let otherSumPrices = 0;
  //       curriculumsAfterChanging.map((curriculum) => {
  //         if (curriculum.price > biggerPrice) {
  //           olderBiggerPrice = biggerPrice;
  //           biggerPrice = curriculum.price;
  //           otherSumPrices = olderBiggerPrice + otherSumPrices;
  //         } else {
  //           otherSumPrices = otherSumPrices + curriculum.price;
  //         }
  //       });
  //       let newBiggerPrice = 0;
  //       let newOtherSumPrices = 0;
  //       const result = Math.floor(
  //         newClass.enrolledDays.length /
  //           newStudentData.curriculumCourseBundleDays
  //       );
  //       const rest =
  //         newClass.enrolledDays.length %
  //         newStudentData.curriculumCourseBundleDays;
  //       let newCoursePrice;
  //       if (isNaN(result) || isNaN(rest)) {
  //         newCoursePrice = 0;
  //       } else {
  //         newCoursePrice =
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit;
  //       }
  //       if (biggerPrice < newCoursePrice) {
  //         newBiggerPrice = newCoursePrice;
  //         newOtherSumPrices = biggerPrice + otherSumPrices;
  //       } else {
  //         newBiggerPrice = biggerPrice;
  //         newOtherSumPrices = otherSumPrices + newCoursePrice;
  //       }
  //       setNewPrices({
  //         appliedPrice:
  //           newBiggerPrice * customDiscountFinalValue + newOtherSumPrices,
  //         fullPrice: newBiggerPrice + newOtherSumPrices,
  //       });
  //     } else {
  //       if (newClass.enrolledDays.length === 0) {
  //         setNewPrices({
  //           appliedPrice: 0,
  //           fullPrice: 0,
  //         });
  //       }
  //       if (newClass.enrolledDays.length === 1) {
  //         setNewPrices({
  //           appliedPrice: priceUnitDiscount,
  //           fullPrice: newStudentData.curriculumCoursePriceUnit,
  //         });
  //       }
  //       if (newClass.enrolledDays.length > 1) {
  //         const result = Math.floor(
  //           newClass.enrolledDays.length /
  //             newStudentData.curriculumCourseBundleDays
  //         );
  //         const rest =
  //           newClass.enrolledDays.length %
  //           newStudentData.curriculumCourseBundleDays;
  //         setNewPrices({
  //           appliedPrice:
  //             result * priceBundleDiscount + rest * priceUnitDiscount,
  //           fullPrice:
  //             result * newStudentData.curriculumCoursePriceBundle +
  //             rest * newStudentData.curriculumCoursePriceUnit,
  //         });
  //       }
  //     }
  //   } else {
  //     handleValueWithoutDiscount();
  //   }
  // }

  // function handleValueSecondCourseDiscount() {
  //   if (studentEditData.addCurriculum) {
  //     handleValueAddCurriculum();
  //   } else {
  //     let haveCurriculumWill = false;
  //     excludeCurriculum.find((curriculumExclude) => {
  //       if (!curriculumExclude.exclude) {
  //         haveCurriculumWill = true;
  //       }
  //     });
  //     const priceUnitDiscount = +(
  //       newStudentData.curriculumCoursePriceUnit * secondCourseDiscountValue
  //     ).toFixed(2);
  //     const priceBundleDiscount = +(
  //       newStudentData.curriculumCoursePriceBundle * secondCourseDiscountValue
  //     ).toFixed(2);

  //     if (haveCurriculumWill) {
  //       const curriculumsAfterChanging = excludeCurriculum.filter(
  //         (curriculum) => !curriculum.exclude
  //       );
  //       let biggerPrice = 0;
  //       let olderBiggerPrice = 0;
  //       let otherSumPrices = 0;
  //       curriculumsAfterChanging.map((curriculum) => {
  //         if (curriculum.price > biggerPrice) {
  //           olderBiggerPrice = biggerPrice;
  //           biggerPrice = curriculum.price;
  //           otherSumPrices = olderBiggerPrice + otherSumPrices;
  //         } else {
  //           otherSumPrices = otherSumPrices + curriculum.price;
  //         }
  //       });
  //       let newBiggerPrice = 0;
  //       let newOtherSumPrices = 0;
  //       const result = Math.floor(
  //         newClass.enrolledDays.length /
  //           newStudentData.curriculumCourseBundleDays
  //       );
  //       const rest =
  //         newClass.enrolledDays.length %
  //         newStudentData.curriculumCourseBundleDays;
  //       let newCoursePrice;
  //       if (isNaN(result) || isNaN(rest)) {
  //         newCoursePrice = 0;
  //       } else {
  //         newCoursePrice =
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit;
  //       }
  //       if (biggerPrice < newCoursePrice) {
  //         newBiggerPrice = newCoursePrice;
  //         newOtherSumPrices = biggerPrice + otherSumPrices;
  //       } else {
  //         newBiggerPrice = biggerPrice;
  //         newOtherSumPrices = otherSumPrices + newCoursePrice;
  //       }
  //       setNewPrices({
  //         appliedPrice:
  //           newBiggerPrice * secondCourseDiscountValue + newOtherSumPrices,
  //         fullPrice: newBiggerPrice + newOtherSumPrices,
  //       });
  //     } else if (studentEditData.addCurriculum) {
  //       if (newClass.enrolledDays.length === 0) {
  //         setNewPrices({
  //           appliedPrice: 0,
  //           fullPrice: 0,
  //         });
  //       }
  //       if (newClass.enrolledDays.length === 1) {
  //         setNewPrices({
  //           appliedPrice: priceUnitDiscount,
  //           fullPrice: newStudentData.curriculumCoursePriceUnit,
  //         });
  //       }
  //       if (newClass.enrolledDays.length > 1) {
  //         const result = Math.floor(
  //           newClass.enrolledDays.length /
  //             newStudentData.curriculumCourseBundleDays
  //         );
  //         const rest =
  //           newClass.enrolledDays.length %
  //           newStudentData.curriculumCourseBundleDays;
  //         setNewPrices({
  //           appliedPrice:
  //             result * priceBundleDiscount + rest * priceUnitDiscount,
  //           fullPrice:
  //             result * newStudentData.curriculumCoursePriceBundle +
  //             rest * newStudentData.curriculumCoursePriceUnit,
  //         });
  //       }
  //     } else {
  //       setNewPrices({
  //         appliedPrice: 0,
  //         fullPrice: 0,
  //       });
  //     }
  //   }
  // }

  // function handleValueAddFamilyDiscount() {
  //   let haveCurriculumWill = false;
  //   excludeCurriculum.find((curriculumExclude) => {
  //     if (!curriculumExclude.exclude) {
  //       haveCurriculumWill = true;
  //     }
  //   });
  //   const priceUnitDiscount = +(
  //     newStudentData.curriculumCoursePriceUnit * familyDiscountValue
  //   ).toFixed(2);
  //   const priceBundleDiscount = +(
  //     newStudentData.curriculumCoursePriceBundle * familyDiscountValue
  //   ).toFixed(2);

  //   if (haveCurriculumWill) {
  //     const curriculumsAfterChanging = excludeCurriculum.filter(
  //       (curriculum) => !curriculum.exclude
  //     );
  //     let biggerPrice = 0;
  //     let olderBiggerPrice = 0;
  //     let otherSumPrices = 0;
  //     curriculumsAfterChanging.map((curriculum) => {
  //       if (curriculum.price > biggerPrice) {
  //         olderBiggerPrice = biggerPrice;
  //         biggerPrice = curriculum.price;
  //         otherSumPrices = olderBiggerPrice + otherSumPrices;
  //       } else {
  //         otherSumPrices = otherSumPrices + curriculum.price;
  //       }
  //     });
  //     let newBiggerPrice = 0;
  //     let newOtherSumPrices = 0;
  //     const result = Math.floor(
  //       newClass.enrolledDays.length / newStudentData.curriculumCourseBundleDays
  //     );
  //     const rest =
  //       newClass.enrolledDays.length %
  //       newStudentData.curriculumCourseBundleDays;
  //     let newCoursePrice;
  //     if (isNaN(result) || isNaN(rest)) {
  //       newCoursePrice = 0;
  //     } else {
  //       newCoursePrice =
  //         result * newStudentData.curriculumCoursePriceBundle +
  //         rest * newStudentData.curriculumCoursePriceUnit;
  //     }
  //     if (biggerPrice < newCoursePrice) {
  //       newBiggerPrice = newCoursePrice;
  //       newOtherSumPrices = biggerPrice + otherSumPrices;
  //     } else {
  //       newBiggerPrice = biggerPrice;
  //       newOtherSumPrices = otherSumPrices + newCoursePrice;
  //     }
  //     setNewPrices({
  //       appliedPrice: newBiggerPrice * familyDiscountValue + newOtherSumPrices,
  //       fullPrice: newBiggerPrice + newOtherSumPrices,
  //     });
  //   } else if (studentEditData.addCurriculum) {
  //     if (newClass.enrolledDays.length === 0) {
  //       setNewPrices({
  //         appliedPrice: 0,
  //         fullPrice: 0,
  //       });
  //     }
  //     if (newClass.enrolledDays.length === 1) {
  //       setNewPrices({
  //         appliedPrice: priceUnitDiscount,
  //         fullPrice: newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //     if (newClass.enrolledDays.length > 1) {
  //       const result = Math.floor(
  //         newClass.enrolledDays.length /
  //           newStudentData.curriculumCourseBundleDays
  //       );
  //       const rest =
  //         newClass.enrolledDays.length %
  //         newStudentData.curriculumCourseBundleDays;
  //       setNewPrices({
  //         appliedPrice: result * priceBundleDiscount + rest * priceUnitDiscount,
  //         fullPrice:
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //   } else {
  //     setNewPrices({
  //       appliedPrice: 0,
  //       fullPrice: 0,
  //     });
  //   }
  // }

  // function handleValueWithFamilyDiscount() {
  //   let haveCurriculumWill = false;
  //   excludeCurriculum.find((curriculumExclude) => {
  //     if (!curriculumExclude.exclude) {
  //       haveCurriculumWill = true;
  //     }
  //   });
  //   const priceUnitDiscount = +(
  //     newStudentData.curriculumCoursePriceUnit * familyDiscountValue
  //   ).toFixed(2);
  //   const priceBundleDiscount = +(
  //     newStudentData.curriculumCoursePriceBundle * familyDiscountValue
  //   ).toFixed(2);

  //   if (haveCurriculumWill) {
  //     const curriculumsAfterChanging = excludeCurriculum.filter(
  //       (curriculum) => !curriculum.exclude
  //     );
  //     let biggerPrice = 0;
  //     let olderBiggerPrice = 0;
  //     let otherSumPrices = 0;
  //     curriculumsAfterChanging.map((curriculum) => {
  //       if (curriculum.price > biggerPrice) {
  //         olderBiggerPrice = biggerPrice;
  //         biggerPrice = curriculum.price;
  //         otherSumPrices = olderBiggerPrice + otherSumPrices;
  //       } else {
  //         otherSumPrices = otherSumPrices + curriculum.price;
  //       }
  //     });
  //     let newBiggerPrice = 0;
  //     let newOtherSumPrices = 0;
  //     const result = Math.floor(
  //       newClass.enrolledDays.length / newStudentData.curriculumCourseBundleDays
  //     );
  //     const rest =
  //       newClass.enrolledDays.length %
  //       newStudentData.curriculumCourseBundleDays;
  //     let newCoursePrice;
  //     if (isNaN(result) || isNaN(rest)) {
  //       newCoursePrice = 0;
  //     } else {
  //       newCoursePrice =
  //         result * newStudentData.curriculumCoursePriceBundle +
  //         rest * newStudentData.curriculumCoursePriceUnit;
  //     }
  //     if (biggerPrice < newCoursePrice) {
  //       newBiggerPrice = newCoursePrice;
  //       newOtherSumPrices = biggerPrice + otherSumPrices;
  //     } else {
  //       newBiggerPrice = biggerPrice;
  //       newOtherSumPrices = otherSumPrices + newCoursePrice;
  //     }
  //     setNewPrices({
  //       appliedPrice: newBiggerPrice * familyDiscountValue + newOtherSumPrices,
  //       fullPrice: newBiggerPrice + newOtherSumPrices,
  //     });
  //   } else if (studentEditData.addCurriculum) {
  //     if (newClass.enrolledDays.length === 0) {
  //       setNewPrices({
  //         appliedPrice: 0,
  //         fullPrice: 0,
  //       });
  //     }
  //     if (newClass.enrolledDays.length === 1) {
  //       setNewPrices({
  //         appliedPrice: priceUnitDiscount,
  //         fullPrice: newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //     if (newClass.enrolledDays.length > 1) {
  //       const result = Math.floor(
  //         newClass.enrolledDays.length /
  //           newStudentData.curriculumCourseBundleDays
  //       );
  //       const rest =
  //         newClass.enrolledDays.length %
  //         newStudentData.curriculumCourseBundleDays;
  //       setNewPrices({
  //         appliedPrice: result * priceBundleDiscount + rest * priceUnitDiscount,
  //         fullPrice:
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //   } else {
  //     setNewPrices({
  //       appliedPrice: 0,
  //       fullPrice: 0,
  //     });
  //   }
  // }

  // function handleValueAddCurriculum() {
  //   let haveCurriculumWill = false;
  //   excludeCurriculum.find((curriculumExclude) => {
  //     if (!curriculumExclude.exclude) {
  //       haveCurriculumWill = true;
  //     }
  //   });
  //   // PRICE CALC IF CUSTOM DISCOUNT IS APPLIED
  //   const customDiscountValueSum =
  //     100 -
  //     (studentEditData.customDiscount
  //       ? +studentEditData.customDiscountValue!
  //       : 1);
  //   const customDiscountFinalValue = !studentEditData.customDiscount
  //     ? 1
  //     : +`0.${
  //         customDiscountValueSum > 9
  //           ? customDiscountValueSum
  //           : `0${customDiscountValueSum}`
  //       }`;
  //   const priceUnitDiscount = +(
  //     newStudentData.curriculumCoursePriceUnit *
  //     (studentEditData.customDiscount
  //       ? customDiscountFinalValue
  //       : studentEditData.employeeDiscount
  //       ? employeeDiscountValue
  //       : studentEditData.familyDiscount
  //       ? familyDiscountValue
  //       : secondCourseDiscountValue)
  //   ).toFixed(2);
  //   const priceBundleDiscount = +(
  //     newStudentData.curriculumCoursePriceBundle *
  //     (studentEditData.customDiscount
  //       ? customDiscountFinalValue
  //       : studentEditData.employeeDiscount
  //       ? employeeDiscountValue
  //       : studentEditData.familyDiscount
  //       ? familyDiscountValue
  //       : secondCourseDiscountValue)
  //   ).toFixed(2);

  //   if (haveCurriculumWill) {
  //     const curriculumsAfterChanging = excludeCurriculum.filter(
  //       (curriculum) => !curriculum.exclude
  //     );
  //     let biggerPrice = 0;
  //     let olderBiggerPrice = 0;
  //     let otherSumPrices = 0;
  //     curriculumsAfterChanging.map((curriculum) => {
  //       if (curriculum.price > biggerPrice) {
  //         olderBiggerPrice = biggerPrice;
  //         biggerPrice = curriculum.price;
  //         otherSumPrices = olderBiggerPrice + otherSumPrices;
  //       } else {
  //         otherSumPrices = otherSumPrices + curriculum.price;
  //       }
  //     });
  //     let newBiggerPrice = 0;
  //     let newOtherSumPrices = 0;
  //     const result = Math.floor(
  //       newClass.enrolledDays.length / newStudentData.curriculumCourseBundleDays
  //     );
  //     const rest =
  //       newClass.enrolledDays.length %
  //       newStudentData.curriculumCourseBundleDays;
  //     let newCoursePrice;
  //     if (isNaN(result) || isNaN(rest)) {
  //       newCoursePrice = 0;
  //     } else {
  //       newCoursePrice =
  //         result * newStudentData.curriculumCoursePriceBundle +
  //         rest * newStudentData.curriculumCoursePriceUnit;
  //     }
  //     if (biggerPrice < newCoursePrice) {
  //       newBiggerPrice = newCoursePrice;
  //       newOtherSumPrices = biggerPrice + otherSumPrices;
  //     } else {
  //       newBiggerPrice = biggerPrice;
  //       newOtherSumPrices = otherSumPrices + newCoursePrice;
  //     }
  //     setNewPrices({
  //       appliedPrice:
  //         newBiggerPrice * secondCourseDiscountValue + newOtherSumPrices,
  //       fullPrice: newBiggerPrice + newOtherSumPrices,
  //     });
  //   } else if (studentEditData.addCurriculum) {
  //     if (newClass.enrolledDays.length === 0) {
  //       setNewPrices({
  //         appliedPrice: 0,
  //         fullPrice: 0,
  //       });
  //     }
  //     if (newClass.enrolledDays.length === 1) {
  //       setNewPrices({
  //         appliedPrice: newStudentData.curriculumCoursePriceUnit,
  //         fullPrice: newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //     if (newClass.enrolledDays.length > 1) {
  //       const result = Math.floor(
  //         newClass.enrolledDays.length /
  //           newStudentData.curriculumCourseBundleDays
  //       );
  //       const rest =
  //         newClass.enrolledDays.length %
  //         newStudentData.curriculumCourseBundleDays;
  //       setNewPrices({
  //         appliedPrice:
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit,
  //         fullPrice:
  //           result * newStudentData.curriculumCoursePriceBundle +
  //           rest * newStudentData.curriculumCoursePriceUnit,
  //       });
  //     }
  //   } else {
  //     setNewPrices({
  //       appliedPrice: 0,
  //       fullPrice: 0,
  //     });
  //   }
  // }

  // STATE TO TOGGLE SHOW ADD FAMILY ON FORM
  const [willHaveFamily, setWillHaveFamily] = useState(false);

  // MONITORING EXCLUDE FAMILY TO SET WILL HAVE FAMILY
  useEffect(() => {
    let haveFamilyWill = false;
    excludeFamily.map((familyExclude) => {
      if (!familyExclude.exclude) {
        haveFamilyWill = true;
      } else {
        haveFamilyWill = false;
      }
    });
    setWillHaveFamily(haveFamilyWill);
  }, [excludeFamily]);

  useEffect(() => {
    if (willHaveFamily) {
      setStudentEditData({ ...studentEditData, addFamily: false });
    }
  }, [willHaveFamily]);

  // SET MONTHLY PAYMENT WHEN SCHOOL COURSE PRICE, OR ADD FAMILY, OR EMPLOYEE DISCOUNT CHANGE => OLD FUNCTION
  // useEffect(() => {
  //   let haveFamilyWill = false;
  //   excludeFamily.map((familyExclude) => {
  //     if (!familyExclude.exclude) {
  //       haveFamilyWill = true;
  //     } else {
  //       haveFamilyWill = false;
  //     }
  //   });
  //   let haveCurriculumWill = false;
  //   excludeCurriculum.map((curriculumExclude) => {
  //     if (!curriculumExclude.exclude) {
  //       haveCurriculumWill = true;
  //     } else {
  //       haveCurriculumWill = false;
  //     }
  //   });
  //   if (
  //     newClass.enrolledDays.length >= 0 &&
  //     studentId !== "" &&
  //     studentEditData.name !== "" &&
  //     excludeCurriculum
  //   ) {
  //     // PRICE CALC DISCOUNT IS APPLIED
  //     if (
  //       studentEditData.customDiscount ||
  //       studentEditData.employeeDiscount ||
  //       haveFamilyWill && studentEditData.familyDiscount ||
  //       studentEditData.addFamily ||
  //       studentEditData.secondCourseDiscount ||
  //       studentEditData.addCurriculum ||
  //     ) {
  //       const customDiscountValueSum =
  //         100 -
  //         (studentEditData.customDiscount
  //           ? +studentEditData.customDiscountValue!
  //           : 1);
  //       const customDiscountFinalValue = !studentEditData.customDiscount
  //         ? 1
  //         : +`0.${
  //             customDiscountValueSum > 9
  //               ? customDiscountValueSum
  //               : `0${customDiscountValueSum}`
  //           }`;
  //       const discountVariable = studentEditData.customDiscount
  //         ? customDiscountFinalValue
  //         : studentEditData.employeeDiscount
  //         ? employeeDiscountValue
  //         : haveFamilyWill || studentEditData.addFamily
  //         ? familyDiscountValue
  //         : secondCourseDiscountValue;
  //     }

  //     // PRICE CALC IF CUSTOM DISCOUNT IS APPLIED
  //     if (studentEditData.customDiscount) {
  //       handleValueWithCustomDiscount();
  //     }
  //     // PRICE CALC IF EMPLOYEE DISCOUNT IS APPLIED
  //     else if (studentEditData.employeeDiscount) {
  //       handleValueWithEmployeeDiscount();
  //     }

  //     // PRICE CALC IF FAMILY DISCOUNT IS APPLIED
  //     // if (studentEditData.familyDiscount) {
  //     // PRICE CALC IF HAVE FAMILY
  //     // if (willHaveFamily) {
  //     else if (haveFamilyWill && studentEditData.familyDiscount) {
  //       handleValueWithFamilyDiscount();
  //     }

  //     // PRICE CALC IF HAVEN'T FAMILY AND ADD NEW FAMILY
  //     else if (studentEditData.addFamily) {
  //       handleValueAddFamilyDiscount();
  //     }

  //     // PRICE CALC WITH SECOND COURSE DISCOUNT
  //     else if (newStudentData.curriculum) {
  //       handleValueSecondCourseDiscount();
  //     }

  //     // PRICE CALC WITH SECOND COURSE DISCOUNT
  //     else {
  //       const checkExistentCurriculum = [] as string[];
  //       excludeCurriculum.map((curriculumDetail) => {
  //         if (!curriculumDetail.exclude) {
  //           checkExistentCurriculum.push(curriculumDetail.id);
  //         }
  //       });
  //       if (checkExistentCurriculum.length <= 1) {
  //         setStudentEditData({
  //           ...studentEditData,
  //           secondCourseDiscount: false,
  //         });
  //         handleValueWithoutDiscount();
  //       } else {
  //         setStudentEditData({
  //           ...studentEditData,
  //           secondCourseDiscount: true,
  //         });
  //         handleValueSecondCourseDiscount();
  //       }
  //     }
  //   }
  // }, [
  //   studentEditData.familyDiscount,
  //   studentEditData.employeeDiscount,
  //   studentEditData.customDiscount,
  //   studentEditData.secondCourseDiscount,
  //   studentEditData.customDiscountValue,
  //   studentEditData.addFamily,
  //   studentEditData.addCurriculum,
  //   excludeCurriculum,
  //   excludeFamily,
  //   newStudentData.curriculum,
  //   newClass.enrolledDays,
  // ]);
  // useEffect(() => {
  //   console.log(studentEditData.customDiscount, studentEditData.customDiscountValue)
  // }, [studentEditData.customDiscount, studentEditData.customDiscountValue])

  // useEffect(() => {
  //   const checkCurriculumForDiscount = excludeCurriculum.filter(
  //     (curriculum) => !curriculum.exclude
  //   );

  //   if (checkCurriculumForDiscount.length > 1) {
  //     setStudentEditData({ ...studentEditData, secondCourseDiscount: true });
  //   } else if (studentEditData.addCurriculum) {
  //     setStudentEditData({ ...studentEditData, secondCourseDiscount: true });
  //   } else {
  //     setStudentEditData({ ...studentEditData, secondCourseDiscount: false });
  //   }
  // }, [excludeCurriculum, studentEditData.addCurriculum]);

  // useEffect(() => {
  //   const checkFamilyForDiscount = excludeFamily.filter(
  //     (family) => !family.exclude
  //   );

  //   if (checkFamilyForDiscount.length > 1) {
  //     setStudentEditData({ ...studentEditData, familyDiscount: true });
  //   } else if (studentEditData.addFamily) {
  //     setStudentEditData({ ...studentEditData, familyDiscount: true });
  //   } else {
  //     setStudentEditData({ ...studentEditData, familyDiscount: false });
  //   }
  // }, [excludeFamily, studentEditData.addFamily]);

  // SET MONTHLY PAYMENT WHEN SCHOOL COURSE PRICE, OR ADD FAMILY, OR EMPLOYEE DISCOUNT CHANGE
  useEffect(() => {
    let haveFamilyWill = false;
    excludeFamily.map((familyExclude) => {
      if (!familyExclude.exclude) {
        haveFamilyWill = true;
      } else {
        haveFamilyWill = false;
      }
    });

    let haveCurriculumWill = false;

    const checkCurriculumForDiscount = excludeCurriculum.filter(
      (curriculum) => !curriculum.exclude
    );

    excludeCurriculum.find((curriculumExclude) => {
      if (!curriculumExclude.exclude) {
        haveCurriculumWill = true;
      }
    });

    if (
      //   newClass.enrolledDays.length >= 0 &&
      studentId !== "" &&
      studentEditData.name !== "" &&
      excludeCurriculum
    ) {
      // DISCOUNT VARIABLE
      const customDiscountValueSum =
        100 -
        (studentEditData.customDiscount
          ? +studentEditData.customDiscountValue!
          : 0);
      const customDiscountFinalValue =
        !studentEditData.customDiscount ||
        studentEditData.customDiscountValue === "0" ||
        studentEditData.customDiscountValue === ""
          ? 1
          : +`0.${
              customDiscountValueSum > 9
                ? customDiscountValueSum
                : `0${customDiscountValueSum}`
            }`;

      const discountVariable = studentEditData.customDiscount
        ? customDiscountFinalValue
        : studentEditData.employeeDiscount
        ? employeeDiscountValue
        : (haveFamilyWill && studentEditData.familyDiscount) ||
          studentEditData.addFamily
        ? // studentEditData.addFamily
          familyDiscountValue
        : // : studentEditData.secondCourseDiscount
        checkCurriculumForDiscount.length > 1 ||
          (checkCurriculumForDiscount.length === 1 &&
            studentEditData.addCurriculum)
        ? // (haveCurriculumWill && studentEditData.addCurriculum) ||
          //   studentEditData.secondCourseDiscount
          secondCourseDiscountValue
        : 1; // WITHOUT DISCOUNT

      if (haveCurriculumWill) {
        const curriculumsAfterChanging = excludeCurriculum.filter(
          (curriculum) => !curriculum.exclude
        );
        let smallestPrice = 0;
        let olderSmallestPrice = 0;
        let otherSumPrices = 0;
        curriculumsAfterChanging.map((curriculum, index) => {
          if (index === 0) {
            smallestPrice = curriculum.price;
          } else {
            if (curriculum.price <= smallestPrice) {
              olderSmallestPrice = smallestPrice;
              smallestPrice = curriculum.price;
              otherSumPrices = olderSmallestPrice + otherSumPrices;
            } else {
              otherSumPrices = otherSumPrices + curriculum.price;
            }
          }
        });
        let newSmallestPrice = smallestPrice;
        let newOtherSumPrices = 0;
        const result = Math.floor(
          newClass.enrolledDays.length /
            newStudentData.curriculumCourseBundleDays
        );
        const rest =
          newClass.enrolledDays.length %
          newStudentData.curriculumCourseBundleDays;
        let newCoursePrice;
        if (isNaN(result) || isNaN(rest)) {
          newCoursePrice = 0;
        } else {
          newCoursePrice =
            result * newStudentData.curriculumCoursePriceBundle +
            rest * newStudentData.curriculumCoursePriceUnit;
        }
        if (newCoursePrice !== 0) {
          if (newSmallestPrice >= newCoursePrice) {
            smallestPrice = newSmallestPrice;
            newSmallestPrice = newCoursePrice;
            newOtherSumPrices = smallestPrice + otherSumPrices;
          } else {
            newOtherSumPrices = otherSumPrices + newCoursePrice;
          }

          setNewPrices({
            appliedPrice:
              newSmallestPrice * discountVariable + newOtherSumPrices,
            fullPrice: newSmallestPrice + newOtherSumPrices,
          });
        } else {
          setNewPrices({
            appliedPrice: smallestPrice * discountVariable + otherSumPrices,
            fullPrice: smallestPrice + otherSumPrices,
          });
        }
      } else if (studentEditData.addCurriculum) {
        if (newClass.enrolledDays.length === 0) {
          setNewPrices({
            appliedPrice: 0,
            fullPrice: 0,
          });
        }
        if (newClass.enrolledDays.length === 1) {
          setNewPrices({
            appliedPrice: newStudentData.curriculumCoursePriceUnit,
            fullPrice: newStudentData.curriculumCoursePriceUnit,
          });
        }
        if (newClass.enrolledDays.length > 1) {
          const result = Math.floor(
            newClass.enrolledDays.length /
              newStudentData.curriculumCourseBundleDays
          );
          const rest =
            newClass.enrolledDays.length %
            newStudentData.curriculumCourseBundleDays;
          setNewPrices({
            appliedPrice:
              result * newStudentData.curriculumCoursePriceBundle +
              rest * newStudentData.curriculumCoursePriceUnit,
            fullPrice:
              result * newStudentData.curriculumCoursePriceBundle +
              rest * newStudentData.curriculumCoursePriceUnit,
          });
        }
      } else {
        setNewPrices({
          appliedPrice: 0,
          fullPrice: 0,
        });
      }
    }
  }, [
    studentId,
    studentEditData.familyDiscount,
    studentEditData.employeeDiscount,
    studentEditData.customDiscount,
    studentEditData.secondCourseDiscount,
    studentEditData.customDiscountValue,
    studentEditData.addFamily,
    studentEditData.addCurriculum,
    excludeCurriculum,
    excludeFamily,
    newStudentData.curriculum,
    newClass.enrolledDays,
  ]);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditStudentValidationZProps>({
    resolver: zodResolver(editStudentValidationSchema),
    defaultValues: {
      // Section 1: Student Data
      id: "",
      name: "",
      birthDate: "",
      classComplement: "",
      parentOne: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },
      parentTwo: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          prefix: "",
          suffix: "",
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
          prefix: "",
          suffix: "",
        },
        activePhoneSecondary: false,
        phoneSecondary: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
        activePhoneTertiary: false,
        phoneTertiary: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setNewPrices({
      appliedPrice: 0,
      fullPrice: 0,
    });
    setStudentEditData({
      // Section 1: Student Data
      id: "",
      name: "",
      birthDate: "",
      classComplement: "",
      parentOne: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },
      parentTwo: {
        name: "",
        email: "",
        phone: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
      },

      // Section 2: Student Course and Family Data | Prices
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
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
          prefix: "",
          suffix: "",
        },
        activePhoneSecondary: false,
        phoneSecondary: {
          ddd: "",
          prefix: "",
          suffix: "",
        },
        activePhoneTertiary: false,
        phoneTertiary: {
          ddd: "",
          prefix: "",
          suffix: "",
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
    setNewStudentData({
      confirmAddFamily: false,
      confirmAddCurriculum: false,
      confirmAddExperimentalCurriculum: false,
      curriculum: "",
      curriculumName: "",
      curriculumClassDayId: "",
      curriculumInitialDate: "",
      curriculumCoursePriceUnit: 0,
      curriculumCoursePriceBundle: 0,
      curriculumCourseBundleDays: 0,
      experimentalCurriculum: "",
      experimentalCurriculumName: "",
      experimentalCurriculumClassDayId: "",
      experimentalCurriculumInitialDate: "",
      familyId: "",
      familyName: "",
      newFamilySchoolId: "",
      newFamilySchoolClassId: "",
      newFamilyCurriculumId: "",
      indexDays: [],
    });
    setDayIsAlreadyWithClass(false);
    setNewClass({
      date: "",
      enrolledDays: [],
      name: "",
    });
    setCurriculumData({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setExperimentalCurriculumData({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setExcludeCurriculum([]);
    setExcludeExperimentalCurriculum([]);
    setExcludeFamily([]);
    setStudentFamilyDetails([]);
    setStudentCurriculumDetails([]);
    reset();
    onClose && onClose();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    // Section 1: Student Data
    setValue("id", studentEditData.id);
    setValue("name", studentEditData.name);
    setValue("birthDate", studentEditData.birthDate);
    setValue("classComplement", studentEditData.classComplement);
    setValue("parentOne.name", studentEditData.parentOne.name);
    setValue("parentOne.phone.ddd", studentEditData.parentOne.phone.ddd);
    setValue("parentOne.phone.prefix", studentEditData.parentOne.phone.prefix);
    setValue("parentOne.phone.suffix", studentEditData.parentOne.phone.suffix);
    setValue("parentOne.email", studentEditData.parentOne.email);
    setValue("parentTwo.name", studentEditData.parentTwo.name);
    setValue("parentTwo.phone.ddd", studentEditData.parentTwo.phone.ddd);
    setValue("parentTwo.phone.prefix", studentEditData.parentTwo.phone.prefix);
    setValue("parentTwo.phone.suffix", studentEditData.parentTwo.phone.suffix);
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
    setValue("enrolmentFee", studentEditData.enrolmentFee);
    setValue("fullPrice", newPrices.fullPrice);
    setValue("appliedPrice", newPrices.appliedPrice);
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
      "financialResponsible.phone.prefix",
      studentEditData.financialResponsible.phone.prefix
    );
    setValue(
      "financialResponsible.phone.suffix",
      studentEditData.financialResponsible.phone.suffix
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
      "financialResponsible.phoneSecondary.prefix",
      studentEditData.financialResponsible.phoneSecondary.prefix
    );
    setValue(
      "financialResponsible.phoneSecondary.suffix",
      studentEditData.financialResponsible.phoneSecondary.suffix
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
      "financialResponsible.phoneTertiary.prefix",
      studentEditData.financialResponsible.phoneTertiary.prefix
    );
    setValue(
      "financialResponsible.phoneTertiary.suffix",
      studentEditData.financialResponsible.phoneTertiary.suffix
    );
  }, [studentEditData, newPrices, dateToString]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      // Section 1: Student Data
      errors.id,
      errors.name,
      errors.birthDate,
      errors.classComplement,
      errors.parentOne?.name,
      errors.parentOne?.email,
      errors.parentOne?.phone?.ddd,
      errors.parentOne?.phone?.prefix,
      errors.parentOne?.phone?.suffix,
      errors.parentTwo?.name,
      errors.parentTwo?.email,
      errors.parentTwo?.phone?.ddd,
      errors.parentTwo?.phone?.prefix,
      errors.parentTwo?.phone?.suffix,

      // Section 2: Student Course and Family Data | Prices
      errors.addCurriculum,
      errors.addExperimentalCurriculum,
      errors.addFamily,
      errors.enrolmentFee,
      errors.enrolmentFeePaid,
      errors.fullPrice,
      errors.appliedPrice,
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
      errors.financialResponsible?.phone?.prefix,
      errors.financialResponsible?.phone?.suffix,
      errors.financialResponsible?.activePhoneSecondary,
      errors.financialResponsible?.phoneSecondary?.ddd,
      errors.financialResponsible?.phoneSecondary?.prefix,
      errors.financialResponsible?.phoneSecondary?.suffix,
      errors.financialResponsible?.activePhoneTertiary,
      errors.financialResponsible?.phoneTertiary?.ddd,
      errors.financialResponsible?.phoneTertiary?.prefix,
      errors.financialResponsible?.phoneTertiary?.suffix,
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
  const handleEditStudent: SubmitHandler<EditStudentValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHEKING VALID FINANCIAL RESPONSIBLE DOCUMENT
    if (!testFinancialCPF) {
      return (
        setIsSubmitting(false),
        setExperimentalClassError(true),
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

    // CHEKING IF EXPERIMENTAL CLASS DATE WAS PICKED
    if (
      newStudentData.confirmAddExperimentalCurriculum &&
      newStudentData.experimentalCurriculumInitialDate === ""
    ) {
      return (
        setIsSubmitting(false),
        setExperimentalClassError(true),
        toast.error("Escolha a data da Aula Experimental... ❕", {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      setExperimentalClassError(false);
    }

    // CHEKING IF CURRICULUM INITIAL CLASS DATE WAS PICKED
    if (
      newStudentData.confirmAddCurriculum &&
      newStudentData.curriculumInitialDate === ""
    ) {
      return (
        setIsSubmitting(false),
        setNewClassError(true),
        toast.error("Escolha a data de início na nova modalidade... ❕", {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      setNewClassError(false);
    }

    // CHECK IF ADD EXPERIMENTAL CURRICULUM
    if (
      studentEditData.addExperimentalCurriculum &&
      !newStudentData.confirmAddExperimentalCurriculum
    ) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Selecione uma nova Aula Experimental para incluir ou desmarque a opção "Adicionar Aula Experimental"...... ❕`,
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
      // CHECK IF EXPERIMENTAL CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
      const checkExistentExperimentalCurriculum = [];
      studentCurriculumDetails!.map((curriculumDetail) => {
        if (
          curriculumDetail!.id === newStudentData.experimentalCurriculum &&
          curriculumDetail!.isExperimental
        ) {
          checkExistentExperimentalCurriculum.push(curriculumDetail!.id);
        }
      });
      if (checkExistentExperimentalCurriculum.length > 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Aluno já fez uma Aula Experimental na modalidade selecionada. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
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
      // CHECK IF STUDENT IS TRYING TO ADD EXPERIMENTAL CLASS INTO A COURSE THAT IS ALREADY ENROLLED
      const checkExistentCurriculum = [];
      studentCurriculumDetails!.map((curriculumDetail) => {
        if (
          curriculumDetail!.id === newStudentData.experimentalCurriculum &&
          !curriculumDetail!.isExperimental
        ) {
          checkExistentCurriculum.push(curriculumDetail!.id);
        }
      });
      if (checkExistentCurriculum.length > 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Não é possível agendar uma aula experimental para uma modalidade a qual o Aluno já está matriculado. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
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

    // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS EXCLUDED
    const experimentalCurriculumLength = [];
    studentCurriculumDetails!.map((curriculumDetail) => {
      if (curriculumDetail!.isExperimental) {
        experimentalCurriculumLength.push(curriculumDetail!.id);
      }
    });
    if (
      newStudentExperimentalCurriculumArray.length !==
      experimentalCurriculumLength.length
    ) {
      excludeExperimentalCurriculum.map(async (curriculumToExclude) => {
        if (curriculumToExclude.exclude && curriculumToExclude.isExperimental) {
          // UPDATE STUDENT (DELETE EXPERIMENTAL CURRICULUM)
          await updateDoc(doc(db, "students", data.id), {
            experimentalCurriculumIds: arrayRemove({
              date: curriculumToExclude.date,
              id: curriculumToExclude.id,
              indexDays: [],
              isExperimental: curriculumToExclude.isExperimental,
              name: curriculumToExclude.name,
              price: curriculumToExclude.price,
            }),
          });

          // UPDATE CURRICULUM (DELETE EXPERIMENTAL STUDENT)
          await updateDoc(doc(db, "curriculum", curriculumToExclude.id), {
            experimentalStudents: arrayRemove({
              date: Timestamp.fromDate(
                new Date(newStudentData.curriculumInitialDate)
              ),
              id: data.id,
              isExperimental: curriculumToExclude.isExperimental,
              name: data.name,
              indexDays: curriculumToExclude.indexDays,
              price: curriculumToExclude.price,
            }),
          });
        }
      });
    }

    // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS INCLUDED
    if (studentEditData.addExperimentalCurriculum) {
      // UPDATE STUDENT (INSERT EXPERIMENTAL CURRICULUM)
      await updateDoc(doc(db, "students", data.id), {
        experimentalCurriculumIds: arrayUnion({
          date: Timestamp.fromDate(
            new Date(newStudentData.experimentalCurriculumInitialDate)
          ),
          id: newStudentData.experimentalCurriculum,
          indexDays: [],
          isExperimental: true,
          name: newStudentData.experimentalCurriculumName,
          price: newStudentData.curriculumCoursePriceBundle,
        }),
      });

      // UPDATE CURRICULUM (INSERT EXPERIMENTAL STUDENT)
      await updateDoc(
        doc(db, "curriculum", newStudentData.experimentalCurriculum),
        {
          experimentalStudents: arrayUnion({
            date: Timestamp.fromDate(
              new Date(newStudentData.experimentalCurriculumInitialDate)
            ),
            id: data.id,
            indexDays: [],
            isExperimental: true,
            name: data.name,
            price: newStudentData.curriculumCoursePriceBundle,
          }),
        }
      );
    }

    // CHECK IF ADD CURRICULUM AND CONFIRM ADD
    if (studentEditData.addCurriculum && !newStudentData.confirmAddCurriculum) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
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
      // CHECK IF CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
      const checkExistentCurriculum = [];
      studentCurriculumDetails!.map((curriculumDetail) => {
        if (
          curriculumDetail!.id === newStudentData.curriculum &&
          !curriculumDetail!.isExperimental
        ) {
          checkExistentCurriculum.push(curriculumDetail!.id);
        }
      });
      if (checkExistentCurriculum.length > 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Aluno já matriculado na modalidade selecionada. Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
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

    // CHECK IF SOME CURRICULUM WAS EXCLUDED
    const curriculumLength = [];
    studentCurriculumDetails!.map((curriculumDetail) => {
      if (!curriculumDetail!.isExperimental) {
        curriculumLength.push(curriculumDetail!.id);
      }
    });
    if (newStudentCurriculumArray.length !== curriculumLength.length) {
      excludeCurriculum.map(async (curriculumToExclude) => {
        if (
          curriculumToExclude.exclude &&
          !curriculumToExclude.isExperimental
        ) {
          // UPDATE STUDENT (DELETE CURRICULUM)
          await updateDoc(doc(db, "students", data.id), {
            curriculumIds: arrayRemove({
              date: curriculumToExclude.date,
              id: curriculumToExclude.id,
              isExperimental: curriculumToExclude.isExperimental,
              name: curriculumToExclude.name,
              indexDays: curriculumToExclude.indexDays,
              price: curriculumToExclude.price,
            }),
          });

          // UPDATE CURRICULUM (DELETE STUDENT)
          await updateDoc(doc(db, "curriculum", curriculumToExclude.id), {
            students: arrayRemove({
              date: curriculumToExclude.date,
              id: data.id,
              isExperimental: curriculumToExclude.isExperimental,
              name: data.name,
              indexDays: curriculumToExclude.indexDays,
              price: curriculumToExclude.price,
            }),
          });
        }
      });
    }

    // CHECK IF SOME CURRICULUM WAS INCLUDED
    if (studentEditData.addCurriculum) {
      // UPDATE STUDENT (INSERT CURRICULUM)
      await updateDoc(doc(db, "students", data.id), {
        curriculumIds: arrayUnion({
          date: Timestamp.fromDate(
            new Date(newStudentData.curriculumInitialDate)
          ),
          id: newStudentData.curriculum,
          isExperimental: false,
          name: newStudentData.curriculumName,
          indexDays: newClass.enrolledDays,
          price: newStudentData.curriculumCoursePriceBundle,
        }),
      });

      // UPDATE CURRICULUM (INSERT STUDENT)
      await updateDoc(doc(db, "curriculum", newStudentData.curriculum), {
        students: arrayUnion({
          date: Timestamp.fromDate(
            new Date(newStudentData.curriculumInitialDate)
          ),
          id: data.id,
          indexDays: newClass.enrolledDays,
          isExperimental: false,
          name: data.name,
          price: newStudentData.curriculumCoursePriceBundle,
        }),
      });
    }

    // CHECK IF ADD FAMILY
    if (studentEditData.addFamily && !newStudentData.familyId) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Selecione um familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
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
    // CHECK CONFIRM ADD NEW FAMILY MEMBER
    if (newStudentData.familyId && !newStudentData.confirmAddFamily) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Confirme a adição do familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
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

    // CHECK IF NEW FAMILY MEMBER ALREADY EXISTS ON STUDENT DATABASE
    const checkExistentFamily = [];
    studentFamilyDetails!.map((familyDetail) => {
      if (familyDetail!.id === newStudentData.familyId) {
        checkExistentFamily.push(familyDetail.id);
      }
    });
    if (checkExistentFamily.length > 0) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Familiar já consta na ficha do aluno. Selecione um novo familiar para incluir ou desmarque a opção "Adicionar Familiar"...... ❕`,
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

    // CHECK IF SOME FAMILY WAS EXCLUDED
    if (
      newStudentFamilyArray.length !==
      studentSelectedData?.studentFamilyAtSchool.length
    ) {
      // VERIFY IF USER HAVE SOME FAMILY AFTER EXCLUSION
      let haveFamily = false;
      excludeFamily.map((family) => {
        if (!family.exclude) {
          haveFamily = true;
        }
      });

      excludeFamily.map(async (familyToExclude) => {
        if (familyToExclude.exclude) {
          // UPDATE STUDENT (DELETE FAMILY FROM STUDENT DATABASE)
          await updateDoc(doc(db, "students", data.id), {
            familyDiscount: haveFamily,
            studentFamilyAtSchool: arrayRemove({
              applyDiscount: familyToExclude.applyDiscount,
              id: familyToExclude.id,
              name: familyToExclude.name,
            }),
          });

          // IF YOU ADDED FAMILY IN BOTH DIRECTIONS UNCOMMENT THIS SECTION FOR DELETE STUDENT FROM FAMILY DATABASE
          // UPDATE FAMILY (DELETE STUDENT FROM FAMILY DATABASE)

          // IF APPLY DISCOUNT OF ACCOUNT TO EDIT IS FALSE THEN GO TO FAMILY (WHICH IS REQUIRED TO BE TRUE ON APPLY DISCOUNT), EXCLUDE FAMILY AND RECALCULATE DISCOUNT
          if (!familyToExclude.applyDiscount) {
            const familyData = studentsDatabaseData.find(
              (student) => student.id === familyToExclude.id
            );
            if (familyData) {
              let otherFamilyApplyDiscount = false;
              familyData.studentFamilyAtSchool.map((family) => {
                if (family.applyDiscount) {
                  otherFamilyApplyDiscount = true;
                }
              });
              if (!otherFamilyApplyDiscount) {
                await updateDoc(doc(db, "students", familyToExclude.id), {
                  familyDiscount: otherFamilyApplyDiscount,
                  studentFamilyAtSchool: arrayRemove({
                    applyDiscount: !familyToExclude.applyDiscount,
                    id: data.id,
                    name: data.name,
                  }),
                });
              } else {
                if (familyData.curriculumIds.length <= 1) {
                  await updateDoc(doc(db, "students", familyToExclude.id), {
                    familyDiscount: otherFamilyApplyDiscount,
                    studentFamilyAtSchool: arrayRemove({
                      applyDiscount: !familyToExclude.applyDiscount,
                      id: data.id,
                      name: data.name,
                    }),
                    appliedPrice: familyData.fullPrice,
                  });
                } else {
                  let biggerPrice = 0;
                  let othersPricesSum = 0;
                  familyData.curriculumIds.map((curriculum) => {
                    if (curriculum.price > biggerPrice) {
                      biggerPrice = curriculum.price;
                    } else {
                      othersPricesSum = othersPricesSum + curriculum.price;
                    }
                  });
                  await updateDoc(doc(db, "students", familyToExclude.id), {
                    familyDiscount: otherFamilyApplyDiscount,
                    studentFamilyAtSchool: arrayRemove({
                      applyDiscount: !familyToExclude.applyDiscount,
                      id: data.id,
                      name: data.name,
                    }),
                    appliedPrice:
                      biggerPrice * secondCourseDiscountValue + othersPricesSum,
                    fullPrice: biggerPrice + othersPricesSum,
                  });
                }
              }
            }
          } else {
            await updateDoc(doc(db, "students", familyToExclude.id), {
              familyDiscount: haveFamily,
              studentFamilyAtSchool: arrayRemove({
                applyDiscount: !familyToExclude.applyDiscount,
                id: data.id,
                name: data.name,
              }),
            });
          }
        }
      });
    }

    // CHECK IF SOME FAMILY WAS INCLUDED
    if (studentEditData.addFamily) {
      const addNewFamily = async () => {
        // UPDATE STUDENT (INSERT FAMILY TO STUDENT DATABASE)
        await updateDoc(doc(db, "students", data.id), {
          familyDiscount: true,
          studentFamilyAtSchool: arrayUnion({
            applyDiscount: true,
            id: newStudentData.familyId,
            name: newStudentData.familyName,
          }),
        });

        // IF YOU WANT CREATE FAMILY IN BOTH DIRECTIONS UNCOMMENT THIS SECTION FOR INSERT STUDENT TO FAMILY DATABASE
        // UPDATE FAMILY (INSERT STUDENT TO FAMILY DATABASE)
        await updateDoc(doc(db, "students", newStudentData.familyId), {
          studentFamilyAtSchool: arrayUnion({
            applyDiscount: false,
            id: data.id,
            name: data.name,
          }),
        });
      };
      addNewFamily();
    }

    // CHEKING VALID SECONDARY PHONE
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

    // CHEKING VALID TERTIARY PHONE
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
    const foundedStudent = studentsDatabaseData.find(
      (student) => student.id === data.id
    );

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
    } else {
      // IF EXISTS, EDIT
      // STUDENT DATA OBJECT
      const updateData = {
        // Section 1: Student Data
        name: data.name,
        birthDate: Timestamp.fromDate(new Date(dateSubmitToString)),
        classComplement: data.classComplement,
        "parentOne.name": data.parentOne.name,
        "parentOne.email": data.parentOne.email,
        "parentOne.phone": `+55${data.parentOne.phone.ddd}${data.parentOne.phone.prefix}${data.parentOne.phone.suffix}`,
        "parentTwo.name": data.parentTwo.name,
        "parentTwo.email": data.parentTwo.email,
        "parentTwo.phone": `+55${data.parentTwo.phone.ddd}${data.parentTwo.phone.prefix}${data.parentTwo.phone.suffix}`,

        // Section 2: Student Course and Family Data | Prices
        enrolmentExemption: data.enrolmentExemption,
        enrolmentFee: data.enrolmentFee,
        enrolmentFeePaid: data.enrolmentFeePaid,
        fullPrice: data.fullPrice,
        appliedPrice: data.appliedPrice,
        customDiscount: data.customDiscount,
        customDiscountValue: data.customDiscountValue,
        employeeDiscount: data.employeeDiscount,
        secondCourseDiscount: data.secondCourseDiscount,
        paymentDay: data.paymentDay,

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
        "financialResponsible.phone": `+55${data.financialResponsible.phone.ddd}${data.financialResponsible.phone.prefix}${data.financialResponsible.phone.suffix}`,
        "financialResponsible.phoneSecondary":
          data.financialResponsible.phoneSecondary.ddd === "DDD"
            ? ""
            : `+55${data.financialResponsible.phoneSecondary.ddd}${data.financialResponsible.phoneSecondary.prefix}${data.financialResponsible.phoneSecondary.suffix}`,
        "financialResponsible.phoneTertiary":
          data.financialResponsible.phoneTertiary.ddd === "DDD"
            ? ""
            : `+55${data.financialResponsible.phoneTertiary.ddd}${data.financialResponsible.phoneTertiary.prefix}${data.financialResponsible.phoneTertiary.suffix}`,

        // Section 4: Student Contract Data
        // Accept Contract: boolean
        // Contract attached (pdf)

        // Section 5: Last Updated Time
        updatedAt: serverTimestamp(),
      };
      // CHECK IF STUDENT NAME IS CHANGED FOR UPDATE CURRICULUM AND FAMILY REGISTER
      // CURRICULUM
      studentCurriculumDetails!.map((studentCurriculum) => {
        curriculumDatabaseData.map((databaseCurriculum) => {
          if (databaseCurriculum.id === studentCurriculum.id) {
            databaseCurriculum.students.map(
              async (databaseCurriculumStudent) => {
                if (
                  databaseCurriculumStudent.id === data.id &&
                  databaseCurriculumStudent.name !== data.name
                ) {
                  if (!databaseCurriculumStudent.isExperimental) {
                    await updateDoc(
                      doc(db, "curriculum", databaseCurriculum.id),
                      {
                        students: arrayRemove({
                          date: databaseCurriculumStudent.date,
                          id: databaseCurriculumStudent.id,
                          indexDays: databaseCurriculumStudent.indexDays,
                          isExperimental:
                            databaseCurriculumStudent.isExperimental,
                          name: databaseCurriculumStudent.name,
                          price: databaseCurriculumStudent.price,
                        }),
                      }
                    );
                    await updateDoc(
                      doc(db, "curriculum", databaseCurriculum.id),
                      {
                        students: arrayUnion({
                          date: databaseCurriculumStudent.date,
                          id: databaseCurriculumStudent.id,
                          indexDays: databaseCurriculumStudent.indexDays,
                          isExperimental:
                            databaseCurriculumStudent.isExperimental,
                          name: data.name,
                          price: databaseCurriculumStudent.price,
                        }),
                      }
                    );
                  } else {
                    await updateDoc(
                      doc(db, "curriculum", databaseCurriculum.id),
                      {
                        experimentalStudents: arrayRemove({
                          date: databaseCurriculumStudent.date,
                          id: databaseCurriculumStudent.id,
                          indexDays: [],
                          isExperimental:
                            databaseCurriculumStudent.isExperimental,
                          name: databaseCurriculumStudent.name,
                          price: databaseCurriculumStudent.price,
                        }),
                      }
                    );
                    await updateDoc(
                      doc(db, "curriculum", databaseCurriculum.id),
                      {
                        experimentalStudents: arrayUnion({
                          date: databaseCurriculumStudent.date,
                          id: databaseCurriculumStudent.id,
                          indexDays: [],
                          isExperimental:
                            databaseCurriculumStudent.isExperimental,
                          name: data.name,
                          price: databaseCurriculumStudent.price,
                        }),
                      }
                    );
                  }
                }
              }
            );
          }
        });
      });
      // FAMILY
      studentFamilyDetails!.map((studentFamily) => {
        studentsDatabaseData.map((databaseStudent) => {
          if (databaseStudent.id === studentFamily.id) {
            databaseStudent.studentFamilyAtSchool.map(
              async (databaseFamilyStudent) => {
                if (
                  databaseFamilyStudent.id === data.id &&
                  databaseFamilyStudent.name !== data.name
                ) {
                  await updateDoc(doc(db, "students", databaseStudent.id), {
                    studentFamilyAtSchool: arrayRemove({
                      applyDiscount: databaseFamilyStudent.applyDiscount,
                      id: databaseFamilyStudent.id,
                      name: databaseFamilyStudent.name,
                    }),
                  });
                  await updateDoc(doc(db, "students", databaseStudent.id), {
                    studentFamilyAtSchool: arrayUnion({
                      applyDiscount: databaseFamilyStudent.applyDiscount,
                      id: databaseFamilyStudent.id,
                      name: data.name,
                    }),
                  });
                }
              }
            );
          }
        });
      });
      // EDIT STUDENT FUNCTION
      const editStudent = async () => {
        try {
          await updateDoc(doc(db, "students", data.id), updateData);
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
    }
  };

  if (studentEditData.name) {
    return (
      <>
        <div className="flex flex-col w-full h-full overflow-scroll no-scrollbar gap-2 pt-4 px-4 rounded-xl text-center">
          {/** DAHSBOARD SECTION TITLE */}
          {page.show === "Dashboard" &&
            studentSelectedData &&
            handleClickOpen &&
            handleDeleteUser &&
            onClose &&
            setIsEdit &&
            setIsFinance &&
            setIsDetailsViewing && (
              <EditDashboardHeader
                handleClickOpen={handleClickOpen}
                handleDeleteUser={handleDeleteUser}
                onClose={onClose}
                setIsDetailsViewing={setIsDetailsViewing}
                setIsEdit={setIsEdit}
                setIsFinance={setIsFinance}
                studentId={studentId}
                studentName={studentSelectedData.name}
                isEdit={isEdit}
                isFinance={isFinance}
                isFinancialResponsible={isFinancialResponsible}
                onlyView={onlyView}
                open={open}
                key={studentId}
              />
            )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit(handleEditStudent)}
            className="flex flex-col w-full gap-2 px-4 rounded-xl bg-klGreen-500/0 dark:bg-klGreen-500/0 text-center h-full overflow-scroll no-scrollbar "
          >
            {/** PERSONAL DATA SECTION TITLE */}
            <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
              Dados Pessoais:
            </h1>

            {/* STUDENT NAME */}
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
                disabled={onlyView ?? isSubmitting}
                placeholder={
                  errors.name
                    ? "É necessário inserir o nome do Aluno"
                    : "Insira o nome do Aluno"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.name}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            {/* BIRTHDATE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="birthDate"
                className={
                  errors.birthDate
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Data de Nascimento:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  months={months}
                  weekDays={weekDays}
                  disabled={onlyView}
                  placeholder={
                    errors.birthDate
                      ? "É necessário selecionar uma Data"
                      : "Selecione uma Data"
                  }
                  currentDate={new DateObject().subtract(3, "years")}
                  containerClassName="w-full"
                  style={{ width: "100%" }}
                  inputClass={
                    errors.birthDate
                      ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  maxDate={new DateObject().subtract(3, "years")}
                  editable={false}
                  format="DD/MM/YYYY"
                  value={dateToString}
                  onChange={(e: DateObject) => {
                    if (e !== null) {
                      setStudentEditData({
                        ...studentEditData,
                        birthDate: `${e.month}/${e.day}/${e.year}`,
                      }),
                        setDateToString(
                          `${e.day < 10 ? `0${e.day}` : e.day}/${
                            e.month.number < 10 ? `0${e.month.number}` : e.month
                          }/${e.year}`
                        );
                    }
                  }}
                />
              </div>
            </div>

            {/** PARENT ONE SECTION TITLE */}
            <h3 className="text-lg py-2 text-klGreen-600 dark:text-gray-100">
              Filiação 1:
            </h3>

            {/* PARENT ONE NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="parentOneName"
                className={
                  errors.parentOne?.name
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Nome:{" "}
              </label>
              <input
                type="text"
                name="parentOneName"
                disabled={onlyView}
                placeholder={
                  errors.parentOne?.name
                    ? "É necessário inserir o Nome completo do Responsável"
                    : "Insira o nome completo do Responsável"
                }
                className={
                  errors.parentOne?.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.parentOne.name}
                onChange={(e) =>
                  setStudentEditData({
                    ...studentEditData,
                    parentOne: {
                      ...studentEditData.parentOne,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>

            {/* PARENT ONE E-MAIL */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="parentOneEmail"
                className={
                  errors.parentOne?.email
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                E-mail:{" "}
              </label>
              <input
                type="text"
                name="parentOneEmail"
                disabled={onlyView ?? isSubmitting}
                placeholder={
                  errors.parentOne?.email
                    ? "É necessário inserir o e-mail"
                    : "Insira o e-mail"
                }
                className={
                  errors.parentOne?.email
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.parentOne.email}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    parentOne: {
                      ...studentEditData.parentOne,
                      email: e.target.value,
                    },
                  });
                }}
              />
            </div>

            {/* PARENT ONE PHONE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="parentOnePhone"
                className={
                  errors.parentOne?.phone
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Telefone:{" "}
              </label>
              <div className="flex w-2/4 gap-2">
                <div className="flex w-10/12 items-center gap-1">
                  <select
                    id="parentOnePhoneDDD"
                    disabled={onlyView}
                    value={studentEditData.parentOne?.phone.prefix}
                    className={
                      errors.parentOne?.phone?.ddd
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        parentOne: {
                          ...studentEditData.parentOne,
                          phone: {
                            ...studentEditData.parentOne.phone,
                            ddd: e.target.value,
                          },
                        },
                      });
                    }}
                  >
                    <BrazilianStateSelectOptions />
                  </select>
                  <input
                    type="text"
                    name="parentOnePhoneInitial"
                    pattern="^[+ 0-9]{5}$"
                    maxLength={5}
                    disabled={onlyView}
                    value={studentEditData.parentOne?.phone.prefix}
                    placeholder={
                      errors.parentOne?.phone?.prefix
                        ? "É necessário um"
                        : "99999"
                    }
                    className={
                      errors.parentOne?.phone?.prefix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        parentOne: {
                          ...studentEditData.parentOne,
                          phone: {
                            ...studentEditData.parentOne.phone,
                            prefix: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          },
                        },
                      });
                    }}
                  />
                  -
                  <input
                    type="text"
                    name="parentOnePhoneFinal"
                    pattern="^[+ 0-9]{4}$"
                    maxLength={4}
                    disabled={onlyView}
                    value={studentEditData.parentOne?.phone.suffix}
                    placeholder={
                      errors.parentOne?.phone?.suffix
                        ? "telefone válido"
                        : "9990"
                    }
                    className={
                      errors.parentOne?.phone?.suffix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        parentOne: {
                          ...studentEditData.parentOne,
                          phone: {
                            ...studentEditData.parentOne.phone,
                            suffix: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex w-2/12 items-center gap-2"></div>
              </div>
            </div>

            {/** PARENT TWO SECTION TITLE */}
            <h3 className="text-lg py-2 text-klGreen-600 dark:text-gray-100">
              Filiação 2:
            </h3>

            {/* PARENT TWO NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="parentTwoName"
                className={
                  errors.parentTwo?.name
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Nome:{" "}
              </label>
              <input
                type="text"
                name="parentTwoName"
                disabled={onlyView ?? isSubmitting}
                placeholder={
                  errors.parentTwo?.name
                    ? "É necessário inserir o nome completo do aluno"
                    : "Insira o nome completo do aluno"
                }
                className={
                  errors.parentTwo?.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.parentTwo?.name}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    parentTwo: {
                      ...studentEditData.parentTwo,
                      name: e.target.value,
                    },
                  });
                }}
              />
            </div>

            {/* PARENT TWO E-MAIL */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="parentTwoEmail"
                className={
                  errors.parentTwo?.email
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                E-mail:{" "}
              </label>
              <input
                type="text"
                name="parentTwoEmail"
                disabled={onlyView ?? isSubmitting}
                placeholder={
                  errors.parentTwo?.email
                    ? "É necessário inserir o e-mail"
                    : "Insira o e-mail"
                }
                className={
                  errors.parentTwo?.email
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.parentTwo?.email}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    parentTwo: {
                      ...studentEditData.parentTwo,
                      email: e.target.value,
                    },
                  });
                }}
              />
            </div>

            {/* PARENT TWO PHONE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="parentTwoPhone"
                className={
                  errors.parentTwo?.phone
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Telefone:{" "}
              </label>
              <div className="flex w-2/4 gap-2">
                <div className="flex w-10/12 items-center gap-1">
                  <select
                    id="parentTwoPhoneDDD"
                    disabled={onlyView}
                    value={studentEditData.parentTwo?.phone.prefix}
                    className={
                      errors.parentTwo?.phone?.ddd
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        parentTwo: {
                          ...studentEditData.parentTwo,
                          phone: {
                            ...studentEditData.parentTwo.phone,
                            ddd: e.target.value,
                          },
                        },
                      });
                    }}
                  >
                    <BrazilianStateSelectOptions />
                  </select>
                  <input
                    type="text"
                    name="parentTwoPhoneInitial"
                    pattern="^[+ 0-9]{5}$"
                    disabled={onlyView}
                    maxLength={5}
                    value={studentEditData.parentTwo?.phone.prefix}
                    placeholder={
                      errors.parentTwo?.phone?.prefix
                        ? "É necessário um"
                        : "99999"
                    }
                    className={
                      errors.parentTwo?.phone?.prefix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        parentTwo: {
                          ...studentEditData.parentTwo,
                          phone: {
                            ...studentEditData.parentTwo.phone,
                            prefix: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          },
                        },
                      });
                    }}
                  />
                  -
                  <input
                    type="text"
                    name="parentTwoPhoneFinal"
                    pattern="^[+ 0-9]{4}$"
                    disabled={onlyView}
                    maxLength={4}
                    value={studentEditData.parentTwo?.phone.suffix}
                    placeholder={
                      errors.parentTwo?.phone?.suffix
                        ? "telefone válido"
                        : "9990"
                    }
                    className={
                      errors.parentTwo?.phone?.suffix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        parentTwo: {
                          ...studentEditData.parentTwo,
                          phone: {
                            ...studentEditData.parentTwo.phone,
                            suffix: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex w-2/12 items-center gap-2"></div>
              </div>
            </div>

            {/* // --------------------------------------------- SECTION 2: STUDENT FINANCIAL RESPONSIBLE DATA --------------------------------------------- // */}

            {/** STUDENT FINANCIAL RESPONSIBLE SECTION TITLE */}
            <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
              Dados do Responsável Financeiro:
            </h1>

            {/** STUDENT FINANCIAL RESPONSIBLE SECTION SUBTITLE */}
            {!onlyView && (
              <div className="flex gap-2 items-center py-2">
                <div className="w-1/4" />
                <div className="flex flex-col gap-2 w-3/4 items-start text-left pb-2">
                  {studentEditData.addExperimentalCurriculum && (
                    <p className="text-sm text-red-600 dark:text-yellow-500">
                      Após 5 dias da data escolhida para a aula experimental, os
                      dados abaixo serão utilizados para efetuar a matrícula do
                      aluno. <br /> Em caso de cancelamento dentro do prazo de 5
                      dias, os dados serão descartados.
                    </p>
                  )}
                  <p className="text-sm font-bold text-red-600 dark:text-yellow-500">
                    ATENÇÃO: A VERACIDADE DOS DADOS É DE SUA RESPONSABILIDADE AO
                    PREENCHER O CADASTRO
                  </p>
                </div>
              </div>
            )}

            {/* FINANCIAL RESPONSIBLE NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="financialResponsible"
                className={
                  errors.financialResponsible
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Nome:{" "}
              </label>
              <input
                type="text"
                disabled={onlyView}
                name="financialResponsible"
                placeholder={
                  errors.financialResponsible
                    ? "É necessário inserir o Nome completo do Responsável Financeiro"
                    : "Insira o nome completo do Responsável Financeiro"
                }
                className={
                  errors.financialResponsible
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.financialResponsible.name}
                onChange={(e) =>
                  setStudentEditData({
                    ...studentEditData,
                    financialResponsible: {
                      ...studentEditData.financialResponsible,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>

            {/* FINANCIAL RESPONSIBLE E-MAIL */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="financialResponsibleEmail"
                className={
                  errors.financialResponsible?.email
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                E-mail:{" "}
              </label>
              <input
                type="text"
                name="financialResponsibleEmail"
                disabled={onlyView ?? isSubmitting}
                placeholder={
                  errors.financialResponsible?.email
                    ? "É necessário inserir o e-mail"
                    : "Insira o e-mail"
                }
                className={
                  errors.financialResponsible?.email
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.financialResponsible?.email}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    financialResponsible: {
                      ...studentEditData.financialResponsible,
                      email: e.target.value,
                    },
                  });
                }}
              />
            </div>

            {/* FINANCIAL RESPONSIBLE DOCUMENT*/}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="financialResponsibleDocument"
                className={
                  testFinancialCPF
                    ? errors.financialResponsible?.document
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                    : "w-1/4 text-right text-red-500 dark:text-red-400"
                }
              >
                CPF
                {testFinancialCPF ? (
                  ": "
                ) : (
                  <span className="text-red-500 dark:text-red-400">
                    {" "}
                    Inválido, verifique:
                  </span>
                )}
              </label>
              <input
                type="text"
                name="financialResponsibleDocument"
                disabled={onlyView}
                pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
                placeholder={
                  errors.financialResponsible?.document
                    ? "É necessário inserir o CPF do Responsável Financeiro"
                    : "Insira o CPF do Responsável Financeiro"
                }
                className={
                  testFinancialCPF
                    ? errors.financialResponsible?.document
                      ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                }
                value={studentEditData.financialResponsible?.document}
                onChange={(e) => {
                  if (e.target.value.length === 11) {
                    setTestFinancialCPF(testaCPF(e.target.value));
                  }
                  setStudentEditData({
                    ...studentEditData,
                    financialResponsible: {
                      ...studentEditData.financialResponsible,
                      document: formataCPF(e.target.value),
                    },
                  });
                }}
              />
            </div>

            {/* FINANCIAL RESPONSIBLE PHONE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="phone"
                className={
                  errors.financialResponsible?.phone
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Telefone:{" "}
              </label>
              <div className="flex w-2/4 gap-2">
                <div className="flex w-10/12 items-center gap-1">
                  <select
                    id="phoneDDD"
                    defaultValue={"DDD"}
                    disabled={onlyView}
                    className={
                      errors.financialResponsible?.phone?.ddd
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    value={studentEditData.financialResponsible?.phone.ddd}
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          phone: {
                            ...studentEditData.financialResponsible.phone,
                            ddd: e.target.value,
                          },
                        },
                      });
                    }}
                  >
                    <BrazilianStateSelectOptions />
                  </select>
                  <input
                    type="text"
                    name="phoneInitial"
                    pattern="^[+ 0-9]{5}$"
                    disabled={onlyView}
                    maxLength={5}
                    value={studentEditData.financialResponsible?.phone.prefix}
                    placeholder={
                      errors.financialResponsible?.phone?.prefix
                        ? "É necessário um"
                        : "99999"
                    }
                    className={
                      errors.financialResponsible?.phone?.prefix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          phone: {
                            ...studentEditData.financialResponsible.phone,
                            prefix: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          },
                        },
                      });
                    }}
                  />
                  -
                  <input
                    type="text"
                    name="phoneFinal"
                    pattern="^[+ 0-9]{4}$"
                    disabled={onlyView}
                    maxLength={4}
                    value={studentEditData.financialResponsible?.phone.suffix}
                    placeholder={
                      errors.financialResponsible?.phone?.suffix
                        ? "telefone válido"
                        : "9990"
                    }
                    className={
                      errors.financialResponsible?.phone?.suffix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          phone: {
                            ...studentEditData.financialResponsible.phone,
                            suffix: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div className="w-2/12"></div>
              </div>
            </div>

            {/* FINANCIAL RESPONSIBLE PHONE SECONDARY */}
            {!(
              onlyView &&
              !studentEditData.financialResponsible.activePhoneSecondary
            ) && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="phoneSecondary"
                  className={
                    errors.financialResponsible?.phoneSecondary
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Telefone 2:{" "}
                </label>
                <div className="flex w-2/4 gap-2">
                  <div className="flex w-10/12 items-center gap-1">
                    {/** NUMBER SECONDARY DDD */}
                    <select
                      id="phoneSecondaryDDD"
                      disabled={
                        onlyView ??
                        !studentEditData.financialResponsible
                          ?.activePhoneSecondary
                      }
                      defaultValue={"DDD"}
                      value={
                        studentEditData.financialResponsible?.phoneSecondary.ddd
                      }
                      className={
                        studentEditData.financialResponsible
                          .activePhoneSecondary
                          ? errors.financialResponsible?.phoneSecondary?.ddd
                            ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      }
                      name="DDD"
                      onChange={(e) => {
                        setStudentEditData({
                          ...studentEditData,
                          financialResponsible: {
                            ...studentEditData.financialResponsible,
                            phoneSecondary: {
                              ...studentEditData.financialResponsible
                                .phoneSecondary,
                              ddd: e.target.value,
                            },
                          },
                        });
                      }}
                    >
                      <BrazilianStateSelectOptions />
                    </select>
                    {/** NUMBER SECONDARY PREFIX */}
                    <input
                      type="text"
                      name="phoneSecondaryInitial"
                      disabled={
                        onlyView ??
                        !studentEditData.financialResponsible
                          ?.activePhoneSecondary
                      }
                      pattern="^[+ 0-9]{5}$"
                      maxLength={5}
                      value={
                        studentEditData.financialResponsible?.phoneSecondary
                          .prefix
                      }
                      placeholder={
                        errors.financialResponsible?.phoneSecondary?.prefix
                          ? "É necessário um"
                          : "99999"
                      }
                      className={
                        studentEditData.financialResponsible
                          ?.activePhoneSecondary
                          ? errors.financialResponsible?.phoneSecondary?.prefix
                            ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      }
                      onChange={(e) => {
                        setStudentEditData({
                          ...studentEditData,
                          financialResponsible: {
                            ...studentEditData.financialResponsible,
                            phoneSecondary: {
                              ...studentEditData.financialResponsible
                                .phoneSecondary,
                              prefix: e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*?)\..*/g, "$1"),
                            },
                          },
                        });
                      }}
                    />
                    -{/** NUMBER SECONDARY SUFFIX */}
                    <input
                      type="text"
                      name="phoneSecondaryFinal"
                      disabled={
                        onlyView ??
                        !studentEditData.financialResponsible
                          ?.activePhoneSecondary
                      }
                      pattern="^[+ 0-9]{4}$"
                      maxLength={4}
                      value={
                        studentEditData.financialResponsible?.phoneSecondary
                          .suffix
                      }
                      placeholder={
                        errors.financialResponsible?.phoneSecondary?.prefix
                          ? "telefone válido"
                          : "9999"
                      }
                      className={
                        studentEditData.financialResponsible
                          ?.activePhoneSecondary
                          ? errors.financialResponsible?.phoneSecondary?.suffix
                            ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      }
                      onChange={(e) => {
                        setStudentEditData({
                          ...studentEditData,
                          financialResponsible: {
                            ...studentEditData.financialResponsible,
                            phoneSecondary: {
                              ...studentEditData.financialResponsible
                                .phoneSecondary,
                              suffix: e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*?)\..*/g, "$1"),
                            },
                          },
                        });
                      }}
                    />
                  </div>
                  {/** CHECKBOX INCLUDE NUMBER SECONDARY */}
                  {!onlyView && (
                    <div className="flex w-2/12 items-center gap-2">
                      <input
                        type="checkbox"
                        name="activePhoneSecondary"
                        className="ml-1"
                        checked={
                          studentEditData.financialResponsible
                            ?.activePhoneSecondary
                        }
                        onChange={() => {
                          setStudentEditData({
                            ...studentEditData,
                            financialResponsible: {
                              ...studentEditData.financialResponsible,
                              activePhoneSecondary:
                                !studentEditData.financialResponsible
                                  .activePhoneSecondary,
                            },
                          });
                        }}
                      />
                      <label htmlFor="activePhoneSecondary" className="text-sm">
                        Incluir
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FINANCIAL RESPONSIBLE PHONE TERTIARY */}
            {!(
              onlyView &&
              !studentEditData.financialResponsible.activePhoneTertiary
            ) && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="phoneTertiary"
                  className={
                    errors.financialResponsible?.phoneTertiary
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Telefone 3:{" "}
                </label>
                <div className="flex w-2/4 gap-2">
                  <div className="flex w-10/12 items-center gap-1">
                    {/** NUMBER TERTIARY DDD */}
                    <select
                      id="phoneTertiaryDDD"
                      disabled={
                        onlyView ??
                        !studentEditData.financialResponsible
                          ?.activePhoneTertiary
                      }
                      defaultValue={"DDD"}
                      value={
                        studentEditData.financialResponsible?.phoneTertiary.ddd
                      }
                      className={
                        studentEditData.financialResponsible
                          ?.activePhoneTertiary
                          ? errors.financialResponsible?.phoneTertiary?.ddd
                            ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      }
                      name="DDD"
                      onChange={(e) => {
                        setStudentEditData({
                          ...studentEditData,
                          financialResponsible: {
                            ...studentEditData.financialResponsible,
                            phoneTertiary: {
                              ...studentEditData.financialResponsible
                                .phoneTertiary,
                              ddd: e.target.value,
                            },
                          },
                        });
                      }}
                    >
                      <BrazilianStateSelectOptions />
                    </select>
                    {/** NUMBER TERTIARY PREFIX */}
                    <input
                      type="text"
                      name="phoneTertiaryInitial"
                      disabled={
                        onlyView ??
                        !studentEditData.financialResponsible
                          ?.activePhoneTertiary
                      }
                      pattern="^[+ 0-9]{5}$"
                      maxLength={5}
                      value={
                        studentEditData.financialResponsible?.phoneTertiary
                          .prefix
                      }
                      placeholder={
                        errors.financialResponsible?.phoneTertiary?.prefix
                          ? "É necessário um"
                          : "99999"
                      }
                      className={
                        studentEditData.financialResponsible
                          ?.activePhoneTertiary
                          ? errors.financialResponsible?.phoneTertiary?.prefix
                            ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      }
                      onChange={(e) => {
                        setStudentEditData({
                          ...studentEditData,
                          financialResponsible: {
                            ...studentEditData.financialResponsible,
                            phoneTertiary: {
                              ...studentEditData.financialResponsible
                                .phoneTertiary,
                              prefix: e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*?)\..*/g, "$1"),
                            },
                          },
                        });
                      }}
                    />
                    -{/** NUMBER TERTIARY SUFFIX */}
                    <input
                      type="text"
                      name="phoneTertiaryFinal"
                      disabled={
                        onlyView ??
                        !studentEditData.financialResponsible
                          ?.activePhoneTertiary
                      }
                      pattern="^[+ 0-9]{4}$"
                      maxLength={4}
                      value={
                        studentEditData.financialResponsible?.phoneTertiary
                          .suffix
                      }
                      placeholder={
                        errors.financialResponsible?.phoneTertiary?.prefix
                          ? "telefone válido"
                          : "9999"
                      }
                      className={
                        studentEditData.financialResponsible
                          ?.activePhoneTertiary
                          ? errors.financialResponsible?.phoneTertiary?.suffix
                            ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      }
                      onChange={(e) => {
                        setStudentEditData({
                          ...studentEditData,
                          financialResponsible: {
                            ...studentEditData.financialResponsible,
                            phoneTertiary: {
                              ...studentEditData.financialResponsible
                                .phoneTertiary,
                              suffix: e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*?)\..*/g, "$1"),
                            },
                          },
                        });
                      }}
                    />
                  </div>
                  {/** CHECKBOX INCLUDE NUMBER TERTIARY */}
                  {!onlyView && (
                    <div className="flex w-2/12 items-center gap-2">
                      <input
                        type="checkbox"
                        name="activePhoneTertiary"
                        className="ml-1"
                        checked={
                          studentEditData.financialResponsible
                            ?.activePhoneTertiary
                        }
                        onChange={() => {
                          setStudentEditData({
                            ...studentEditData,
                            financialResponsible: {
                              ...studentEditData.financialResponsible,
                              activePhoneTertiary:
                                !studentEditData.financialResponsible
                                  .activePhoneTertiary,
                            },
                          });
                        }}
                      />
                      <label htmlFor="activePhoneTertiary" className="text-sm">
                        Incluir
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FINANCIAL RESPONSIBLE ADDRESS */}
            {/* CEP */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addressCep"
                className={
                  errors.financialResponsible?.address?.cep
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                CEP:{" "}
              </label>
              <div className="flex w-3/4 gap-2">
                <div className="w-10/12">
                  <input
                    type="text"
                    name="addressCep"
                    disabled={onlyView}
                    maxLength={8}
                    placeholder={
                      errors.financialResponsible?.address?.cep || cepError
                        ? "É necessário inserir um CEP"
                        : "Insira o CEP"
                    }
                    className={
                      errors.financialResponsible?.address?.cep || cepError
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    value={studentEditData.financialResponsible.address.cep}
                    onChange={(e) => {
                      setCepError(false);
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            cep: formatCEP(e.target.value),
                          },
                        },
                      });
                    }}
                  />
                </div>
                {!onlyView && (
                  <button
                    type="button"
                    disabled={cepSubmitting}
                    className="border rounded-2xl border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/12"
                    onClick={() => {
                      getCep(studentEditData.financialResponsible.address.cep);
                    }}
                  >
                    {cepSubmitting ? "Buscando..." : "Buscar"}
                  </button>
                )}
              </div>
            </div>

            {/* STREET AND NUMBER */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addressStreet"
                className={
                  errors.financialResponsible?.address?.street
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Rua:{" "}
              </label>
              <div className="flex w-3/4 gap-2 items-center">
                <div className="flex w-10/12">
                  <input
                    type="text"
                    name="addressStreet"
                    disabled={!editAddress}
                    placeholder={
                      errors.financialResponsible?.address?.street
                        ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                        : "Rua / Av. / Pça"
                    }
                    className={
                      onlyView ?? editAddress
                        ? errors.financialResponsible?.address?.street
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    value={
                      studentEditData.financialResponsible?.address?.street
                    }
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            street: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex w-2/12 items-center gap-2">
                  <label htmlFor="addressNumber" className="text-right">
                    Nº:
                  </label>
                  <input
                    type="text"
                    name="addressNumber"
                    disabled={onlyView}
                    placeholder={
                      errors.financialResponsible?.address?.number
                        ? "Número"
                        : "Número"
                    }
                    className={
                      errors.financialResponsible?.address?.number
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    value={studentEditData.financialResponsible.address.number}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            number: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* NEIGHBORHOOD AND COMPLEMENT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addressNeighborhood"
                className={
                  errors.financialResponsible?.address?.neighborhood
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Bairro:{" "}
              </label>
              <div className="flex w-3/4 gap-2 items-center">
                <div className="flex w-8/12">
                  <input
                    type="text"
                    name="addressNeighborhood"
                    disabled={!editAddress}
                    placeholder={
                      errors.financialResponsible?.address?.neighborhood
                        ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                        : "Bairro"
                    }
                    className={
                      onlyView ?? editAddress
                        ? errors.financialResponsible?.address?.neighborhood
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    value={
                      studentEditData.financialResponsible.address.neighborhood
                    }
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            neighborhood: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex w-4/12 items-center gap-2">
                  <label htmlFor="addressComplement" className="text-right">
                    Complemento:
                  </label>
                  <input
                    type="text"
                    name="addressComplement"
                    disabled={onlyView}
                    placeholder={"Apto | Bloco"}
                    className={
                      errors.financialResponsible?.address
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    value={
                      studentEditData.financialResponsible.address.complement
                    }
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            complement: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* CITY AND STATE */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addressCity"
                className={
                  errors.financialResponsible?.address?.city
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Cidade:{" "}
              </label>
              <div className="flex w-3/4 gap-2 items-center">
                <div className="flex w-10/12">
                  <input
                    type="text"
                    name="addressCity"
                    disabled={!editAddress}
                    placeholder={
                      errors.financialResponsible?.address?.city
                        ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                        : "Cidade"
                    }
                    className={
                      onlyView ?? editAddress
                        ? errors.financialResponsible?.address?.city
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    value={studentEditData.financialResponsible.address.city}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            city: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex w-2/12 items-center gap-2">
                  <label htmlFor="addressState" className="text-right">
                    Estado:
                  </label>
                  <input
                    type="text"
                    name="addressState"
                    disabled={!editAddress}
                    placeholder={
                      errors.financialResponsible?.address?.state
                        ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                        : "UF"
                    }
                    className={
                      onlyView ?? editAddress
                        ? errors.financialResponsible?.address?.state
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    value={studentEditData.financialResponsible.address.state}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        financialResponsible: {
                          ...studentEditData.financialResponsible,
                          address: {
                            ...studentEditData.financialResponsible.address,
                            state: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* EDIT ADDRESS BUTTON */}
            {!onlyView && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="editAddressButton"
                  className="w-1/4 text-right"
                ></label>
                <button
                  type="button"
                  disabled={editAddress}
                  className="border rounded-2xl mt-2 mb-4 border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-3/4"
                  onClick={() => setEditAddress(true)}
                >
                  {editAddress
                    ? "Insira o Endereço manualmente, ou busque o CEP novamente"
                    : "Editar Endereço"}
                </button>
              </div>
            )}

            {/** EXPERIMENTAL CURRICULUM SECTION TITLE */}
            {!(onlyView && excludeExperimentalCurriculum.length < 1) && (
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Aulas Experimentais:
              </h1>
            )}

            {/* EXISTENT EXPERIMENTAL CURRICULUM */}
            {!(onlyView && excludeExperimentalCurriculum.length < 1) &&
              haveCurriculum &&
              excludeExperimentalCurriculum.map((curriculum, index) => (
                <div className="flex gap-2 items-center" key={curriculum.id}>
                  <label
                    htmlFor="existentExperimentalCurriculumName"
                    className="w-1/4 text-right"
                  >
                    Aula Experimental {index + 1}:{" "}
                  </label>
                  <div className="flex w-3/4 gap-2">
                    <div className="w-10/12">
                      <input
                        type="text"
                        name="existentExperimentalCurriculumName"
                        disabled={
                          isSubmitting
                            ? true
                            : onlyView
                            ? true
                            : curriculum.exclude
                        }
                        className={
                          curriculum.exclude
                            ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        }
                        value={curriculum.name}
                        readOnly
                      />
                    </div>
                    {!onlyView && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          curriculum.exclude
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          const data: ExcludeCurriculumProps = {
                            exclude: !curriculum.exclude,
                            id: curriculum.id,
                            date: curriculum.date,
                            isExperimental: curriculum.isExperimental,
                            name: curriculum.name,
                            indexDays: curriculum.indexDays,
                            price: curriculum.price,
                          };
                          handleIncludeExcludeExperimentalCurriculum(
                            index,
                            data
                          );
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : curriculum.exclude
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {/** CHECKBOX ADD EXPERIMENTAL CURRICULUM */}
            {!onlyView && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="addExperimentalCurriculum"
                  className={
                    errors.addExperimentalCurriculum
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Adicionar Aula Experimental ?{" "}
                </label>
                <div className="w-3/4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="addExperimentalCurriculum"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={studentEditData.addExperimentalCurriculum}
                    onChange={() => {
                      setStudentEditData({
                        ...studentEditData,
                        addExperimentalCurriculum:
                          !studentEditData.addExperimentalCurriculum,
                      });
                      setExperimentalCurriculumData({
                        schoolId: "",
                        schoolName: "",
                        schoolClassId: "",
                        schoolClassName: "",
                        schoolCourseId: "",
                        schoolCourseName: "",
                      });
                    }}
                  />
                </div>
              </div>
            )}

            {/** ADD EXPERIMENTAL CURRICULUM */}
            {studentEditData.addExperimentalCurriculum && (
              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                {/** ADD EXPERIMENTAL CURRICULUM SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Atenção: você está adicionando uma nova aula experimental para{" "}
                  {studentEditData.name}:
                </h1>

                {/* SCHOOL SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newExperimentalSchoolSelect"
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Escola:{" "}
                  </label>
                  <select
                    id="newExperimentalSchoolSelect"
                    defaultValue={" -- select an option -- "}
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="newExperimentalSchoolSelect"
                    onChange={(e) => {
                      setExperimentalCurriculumData({
                        ...experimentalCurriculumData,
                        schoolId: e.target.value,
                        schoolClassId: "",
                        schoolCourseId: "",
                      });
                    }}
                  >
                    <SelectOptions returnId dataType="schools" />
                  </select>
                </div>

                {/* SCHOOL CLASS SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newExperimentalSchoolClassSelect"
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione o Ano Escolar:{" "}
                  </label>
                  <select
                    id="newExperimentalSchoolClassSelect"
                    disabled={
                      experimentalCurriculumData.schoolId ? false : true
                    }
                    defaultValue={" -- select an option -- "}
                    className={
                      experimentalCurriculumData.schoolId
                        ? errors.addExperimentalCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newExperimentalSchoolClassSelect"
                    onChange={(e) => {
                      setExperimentalCurriculumData({
                        ...experimentalCurriculumData,
                        schoolClassId: e.target.value,
                        schoolCourseId: "",
                      });
                      setNewStudentData({
                        ...newStudentData,
                        experimentalCurriculum: "",
                      });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schoolClasses"
                      schoolId={experimentalCurriculumData.schoolId}
                    />
                  </select>
                </div>

                {/* SCHOOL COURSE SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newExperimentalSchoolCourseSelect"
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Modalidade:{" "}
                  </label>
                  <select
                    id="newExperimentalSchoolCourseSelect"
                    disabled={
                      experimentalCurriculumData.schoolClassId ? false : true
                    }
                    defaultValue={" -- select an option -- "}
                    className={
                      experimentalCurriculumData.schoolClassId
                        ? errors.addExperimentalCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newExperimentalSchoolCourseSelect"
                    onChange={(e) => {
                      setExperimentalCurriculumData({
                        ...experimentalCurriculumData,
                        schoolCourseId: e.target.value,
                      });
                      setNewStudentData({
                        ...newStudentData,
                        experimentalCurriculum: "",
                      });
                    }}
                  >
                    <SelectOptions returnId dataType="schoolCourses" />
                    <option value={"all"}>Todas as Modalidades</option>
                  </select>
                </div>

                {/* EXPERIMENTAL CURRICULUM SELECT */}
                {experimentalCurriculumData.schoolId &&
                experimentalCurriculumData.schoolClassId &&
                experimentalCurriculumData.schoolCourseId ? (
                  <>
                    {/* EXPERIMENTAL CURRICULUM CARD DETAILS SECTION TITLE */}
                    <h1 className="font-bold text-2xl py-4">
                      {newExperimentalSchoolSelectedData?.name} -{" "}
                      {newExperimentalSchoolClassSelectedData?.name} -{" "}
                      {experimentalCurriculumData.schoolCourseId === "all"
                        ? "Todas as Modalidades"
                        : newExperimentalSchoolCourseSelectedData?.name}
                      :
                    </h1>

                    {/* SEPARATOR */}
                    <hr className="pb-4" />

                    {newExperimentalCurriculumCoursesData.length !== 0 ? (
                      <>
                        {/* EXPERIMENTAL CURRICULUM CARD DETAILS */}
                        <div className="flex flex-wrap gap-4 justify-center">
                          {newExperimentalCurriculumCoursesData.map(
                            (curriculum) => (
                              <div
                                className={
                                  errors.addExperimentalCurriculum
                                    ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                                    : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                                }
                                key={curriculum.id}
                              >
                                <input
                                  type="radio"
                                  id={curriculum.id}
                                  name="experimentalCurriculumCardDetails"
                                  className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                  value={curriculum.id}
                                  onChange={(e) => {
                                    setNewStudentData({
                                      ...newStudentData,
                                      experimentalCurriculum: e.target.value,
                                      experimentalCurriculumName:
                                        curriculum.name,
                                      experimentalCurriculumClassDayId:
                                        curriculum.classDayId,
                                      confirmAddExperimentalCurriculum: false,
                                    });
                                  }}
                                />
                                <label
                                  htmlFor="experimentalCurriculumCardDetails"
                                  className="flex flex-col gap-4"
                                >
                                  {experimentalCurriculumData.schoolName ===
                                  "Colégio Bernoulli" ? (
                                    <p>Ano Escolar: {curriculum.schoolClass}</p>
                                  ) : null}
                                  <p>Modalidade: {curriculum.schoolCourse}</p>
                                  {scheduleDatabaseData.map((details) =>
                                    details.name === curriculum.schedule
                                      ? `Horário: De ${details.classStart.slice(
                                          0,
                                          2
                                        )}h${
                                          details.classStart.slice(3, 5) ===
                                          "00"
                                            ? ""
                                            : details.classStart.slice(3, 5) +
                                              "min"
                                        } a ${details.classEnd.slice(0, 2)}h${
                                          details.classEnd.slice(3, 5) === "00"
                                            ? ""
                                            : details.classEnd.slice(3, 5) +
                                              "min"
                                        }`
                                      : null
                                  )}
                                  <p>Dias: {curriculum.classDay}</p>
                                  <p>Professor: {curriculum.teacher}</p>
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* EXPERIMENTAL CURRICULUM EMPTY DESCRIPTION */}
                        <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
                          Nenhuma vaga disponível com as opções selecionadas,
                          tente novamente.
                        </h1>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* EXPERIMENTAL CURRICULUM PRE-SELECT DESCRIPTION */}
                    <p className="text-red-600 dark:text-yellow-500">
                      Selecione um colégio e um Ano Escolar para ver as
                      modalidades disponíveis.
                    </p>
                  </>
                )}

                {newStudentData.experimentalCurriculum &&
                classDayExperimentalCurriculumSelectedData !== undefined ? (
                  <>
                    {/* EXPERIMENTAL/INITIAL DAY */}
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="experimentalClassPick"
                        className={
                          experimentalClassError
                            ? "w-1/4 text-right text-red-500 dark:text-red-400"
                            : "w-1/4 text-right"
                        }
                      >
                        Escolha o dia da aula experimental:
                      </label>
                      <div className="flex w-3/4">
                        <DatePicker
                          months={months}
                          weekDays={weekDays}
                          placeholder={
                            experimentalClassError
                              ? "É necessário selecionar uma Data"
                              : "Selecione uma Data"
                          }
                          currentDate={new DateObject()}
                          inputClass={
                            experimentalClassError
                              ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          minDate={new DateObject().add(1, "day")}
                          mapDays={({ date }) => {
                            const isWeekend =
                              classDayExperimentalCurriculumSelectedData.indexDays.includes(
                                date.weekDay.index
                              );

                            if (!isWeekend)
                              return {
                                disabled: true,
                                style: { color: "#ccc" },
                                title: "Aula não disponível neste dia",
                              };
                          }}
                          editable={false}
                          format="DD/MM/YYYY"
                          onChange={(e: DateObject) => {
                            e !== null
                              ? setNewStudentData({
                                  ...newStudentData,
                                  experimentalCurriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
                                })
                              : null;
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {/** CHECKBOX CONFIRM INSERT NEW EXPERIMENTAL CURRICULUM */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmAddExperimentalCurriculum"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={newStudentData.confirmAddExperimentalCurriculum}
                    onChange={() => {
                      setNewStudentData({
                        ...newStudentData,
                        confirmAddExperimentalCurriculum:
                          !newStudentData.confirmAddExperimentalCurriculum,
                      });
                    }}
                  />
                  <label
                    htmlFor="confirmAddExperimentalCurriculum"
                    className="text-sm"
                  >
                    Confirmar inclusão da Aula Experimental
                  </label>
                </div>
              </div>
            )}

            {/** CURRICULUM SECTION TITLE */}
            {!(onlyView && excludeCurriculum.length < 1) && (
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Matriculado em:
              </h1>
            )}

            {/* EXISTENT CURRICULUM */}
            {!(onlyView && excludeCurriculum.length < 1) &&
              haveCurriculum &&
              excludeCurriculum.map((curriculum, index) => (
                <div className="flex gap-2 items-center" key={curriculum.id}>
                  <label
                    htmlFor="existentCurriculumName"
                    className="w-1/4 text-right"
                  >
                    Aula {index + 1}:{" "}
                  </label>
                  <div className="flex w-3/4 gap-2">
                    <div className="w-10/12">
                      <input
                        type="text"
                        name="existentCurriculumName"
                        disabled={
                          isSubmitting
                            ? true
                            : onlyView
                            ? true
                            : curriculum.exclude
                        }
                        className={
                          curriculum.exclude
                            ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        }
                        value={curriculum.name}
                        readOnly
                      />
                    </div>
                    {!onlyView && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          curriculum.exclude
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          const data: ExcludeCurriculumProps = {
                            exclude: !curriculum.exclude,
                            id: curriculum.id,
                            date: curriculum.date,
                            isExperimental: curriculum.isExperimental,
                            name: curriculum.name,
                            indexDays: curriculum.indexDays,
                            price: curriculum.price,
                          };
                          handleIncludeExcludeCurriculum(index, data);
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : curriculum.exclude
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {/** CHECKBOX ADD CURRICULUM */}
            {!onlyView && (
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="addCurriculum"
                  className={
                    errors.addCurriculum
                      ? "w-1/4 text-right text-red-500 dark:text-red-400"
                      : "w-1/4 text-right"
                  }
                >
                  Adicionar Modalidade ?{" "}
                </label>
                <div className="w-3/4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="addCurriculum"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={studentEditData.addCurriculum}
                    onChange={() => {
                      setStudentEditData({
                        ...studentEditData,
                        addCurriculum: !studentEditData.addCurriculum,
                      });
                      setCurriculumData({
                        schoolId: "",
                        schoolName: "",
                        schoolClassId: "",
                        schoolClassName: "",
                        schoolCourseId: "",
                        schoolCourseName: "",
                      });
                      setNewClass({
                        ...newClass,
                        enrolledDays: [],
                      });
                    }}
                  />
                </div>
              </div>
            )}

            {/** ADD CURRICULUM */}
            {studentEditData.addCurriculum && (
              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                {/** ADD CURRICULUM SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Atenção: você está adicionando uma nova aula para{" "}
                  {studentEditData.name}:
                </h1>

                {/* SCHOOL SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newSchoolSelect"
                    className={
                      errors.addCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Escola:{" "}
                  </label>
                  <select
                    id="newSchoolSelect"
                    defaultValue={" -- select an option -- "}
                    className={
                      errors.addCurriculum
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="newSchoolSelect"
                    onChange={(e) => {
                      setCurriculumData({
                        ...curriculumData,
                        schoolId: e.target.value,
                        schoolClassId: "",
                        schoolCourseId: "",
                      });
                      setNewClass({
                        name: "",
                        date: "",
                        enrolledDays: [],
                      });
                      setClassDaysData({
                        Domingo: true,
                        Segunda: true,
                        Terça: true,
                        Quarta: true,
                        Quinta: true,
                        Sexta: true,
                        Sábado: true,
                      });
                    }}
                  >
                    <SelectOptions returnId dataType="schools" />
                  </select>
                </div>

                {/* SCHOOL CLASS SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newSchoolClassSelect"
                    className={
                      errors.addCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione o Ano Escolar:{" "}
                  </label>
                  <select
                    id="newSchoolClassSelect"
                    disabled={curriculumData.schoolId ? false : true}
                    defaultValue={" -- select an option -- "}
                    className={
                      curriculumData.schoolId
                        ? errors.addCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newSchoolClassSelect"
                    onChange={(e) => {
                      setCurriculumData({
                        ...curriculumData,
                        schoolClassId: e.target.value,
                        schoolCourseId: "",
                      });
                      setNewStudentData({ ...newStudentData, curriculum: "" });
                      setNewClass({
                        name: "",
                        date: "",
                        enrolledDays: [],
                      });
                      setClassDaysData({
                        Domingo: true,
                        Segunda: true,
                        Terça: true,
                        Quarta: true,
                        Quinta: true,
                        Sexta: true,
                        Sábado: true,
                      });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schoolClasses"
                      schoolId={curriculumData.schoolId}
                    />
                  </select>
                </div>

                {/* SCHOOL COURSE SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newSchoolCourseSelect"
                    className={
                      errors.addCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Modalidade:{" "}
                  </label>
                  <select
                    id="newSchoolCourseSelect"
                    disabled={curriculumData.schoolClassId ? false : true}
                    defaultValue={" -- select an option -- "}
                    className={
                      curriculumData.schoolClassId
                        ? errors.addCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newSchoolCourseSelect"
                    onChange={(e) => {
                      setCurriculumData({
                        ...curriculumData,
                        schoolCourseId: e.target.value,
                      });
                      setNewStudentData({ ...newStudentData, curriculum: "" });
                      setNewClass({
                        name: "",
                        date: "",
                        enrolledDays: [],
                      });
                      setClassDaysData({
                        Domingo: true,
                        Segunda: true,
                        Terça: true,
                        Quarta: true,
                        Quinta: true,
                        Sexta: true,
                        Sábado: true,
                      });
                    }}
                  >
                    <SelectOptions returnId dataType="schoolCourses" />
                    <option value={"all"}>Todas as Modalidades</option>
                  </select>
                </div>

                {/* CURRICULUM SELECT */}
                {curriculumData.schoolId &&
                curriculumData.schoolClassId &&
                curriculumData.schoolCourseId ? (
                  <>
                    {/* CURRICULUM CARD DETAILS SECTION TITLE */}
                    <h1 className="font-bold text-2xl py-4">
                      {newSchoolSelectedData?.name} -{" "}
                      {newSchoolClassSelectedData?.name} -{" "}
                      {curriculumData.schoolCourseId === "all"
                        ? "Todas as Modalidades"
                        : newSchoolCourseSelectedData?.name}
                      :
                    </h1>

                    {/* SEPARATOR */}
                    <hr className="pb-4" />

                    {newCurriculumCoursesData.length !== 0 ? (
                      <>
                        {/* CURRICULUM CARD DETAILS */}
                        <div className="flex flex-wrap gap-4 justify-center">
                          {newCurriculumCoursesData.map((curriculum) => (
                            <div
                              className={
                                errors.addCurriculum
                                  ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                                  : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                              }
                              key={curriculum.id}
                            >
                              <input
                                type="radio"
                                id={curriculum.id}
                                name="curriculumCardDetails"
                                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                value={curriculum.id}
                                onChange={(e) => {
                                  setNewStudentData({
                                    ...newStudentData,
                                    curriculum: e.target.value,
                                    curriculumName: curriculum.name,
                                    curriculumClassDayId: curriculum.classDayId,
                                    confirmAddCurriculum: false,
                                  });
                                  setNewClass({
                                    ...newClass,
                                    name: curriculum.name,
                                    date: "",
                                  });
                                  setClassDaysData({
                                    Domingo: true,
                                    Segunda: true,
                                    Terça: true,
                                    Quarta: true,
                                    Quinta: true,
                                    Sexta: true,
                                    Sábado: true,
                                  });
                                }}
                              />
                              <label
                                htmlFor="curriculumCardDetails"
                                className="flex flex-col gap-4"
                              >
                                <p>Ano Escolar: {curriculum.schoolClass}</p>
                                <p>Modalidade: {curriculum.schoolCourse}</p>
                                {scheduleDatabaseData.map((details) =>
                                  details.name === curriculum.schedule
                                    ? `Horário: De ${details.classStart.slice(
                                        0,
                                        2
                                      )}h${
                                        details.classStart.slice(3, 5) === "00"
                                          ? ""
                                          : details.classStart.slice(3, 5) +
                                            "min"
                                      } a ${details.classEnd.slice(0, 2)}h${
                                        details.classEnd.slice(3, 5) === "00"
                                          ? ""
                                          : details.classEnd.slice(3, 5) + "min"
                                      }`
                                    : null
                                )}
                                <p>Dias: {curriculum.classDay}</p>
                                <p>Professor: {curriculum.teacher}</p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* CURRICULUM EMPTY DESCRIPTION */}
                        <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
                          Nenhuma vaga disponível com as opções selecionadas,
                          tente novamente.
                        </h1>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* CURRICULUM PRE-SELECT DESCRIPTION */}
                    <p className="text-red-600 dark:text-yellow-500">
                      Selecione um colégio e um Ano Escolar para ver as
                      modalidades disponíveis.
                    </p>
                  </>
                )}

                {newStudentData.curriculum &&
                classDayCurriculumSelectedData &&
                classDayCurriculumSelectedData.indexDays.length !==
                  undefined ? (
                  <>
                    {/* STUDENT CLASS DAYS */}
                    <div className="flex gap-2 items-center py-2">
                      <label
                        htmlFor="experimentalClassPick"
                        className={
                          experimentalClassError
                            ? "w-1/4 text-right text-red-500 dark:text-red-400"
                            : "w-1/4 text-right"
                        }
                      >
                        Escolha os dias de Aula:
                      </label>
                      <div className="flex w-3/4">
                        <div className="flex w-full items-center">
                          {classDayCurriculumSelectedData.indexDays.map(
                            (classDayIndexNumber) =>
                              classDayIndex.map((day) =>
                                day.id === classDayIndexNumber ? (
                                  newStudentData.indexDays.includes(day.id) ? (
                                    <>
                                      <div
                                        key={uuidv4()}
                                        className="flex w-full items-center gap-2"
                                      >
                                        <input
                                          key={uuidv4()}
                                          type="checkbox"
                                          className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none opacity-70"
                                          id={day.name}
                                          name={day.name}
                                          checked={false}
                                          disabled
                                        />
                                        <label
                                          key={uuidv4()}
                                          htmlFor={day.name}
                                          className="opacity-70"
                                        >
                                          {" "}
                                          {day.name}{" "}
                                          <span className="text-xs">
                                            (aluno já faz aula neste dia)
                                          </span>
                                        </label>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        key={uuidv4()}
                                        className="flex w-full items-center gap-2"
                                      >
                                        <input
                                          key={uuidv4()}
                                          type="checkbox"
                                          className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                                          id={day.name}
                                          name={day.name}
                                          checked={
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            //@ts-ignore
                                            classDaysData[day.name]
                                          }
                                          onChange={() =>
                                            toggleClassDays({
                                              day: day.name,
                                              value:
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                //@ts-ignore
                                                !classDaysData[day.name],
                                            })
                                          }
                                        />
                                        <label
                                          key={uuidv4()}
                                          htmlFor={day.name}
                                        >
                                          {" "}
                                          {day.name}
                                        </label>
                                      </div>
                                    </>
                                  )
                                ) : null
                              )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* NEW CURRICULUM/INITIAL DAY */}
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="newCurriculumClassPick"
                        className={
                          newClassError
                            ? "w-1/4 text-right text-red-500 dark:text-red-400"
                            : "w-1/4 text-right"
                        }
                      >
                        Escolha o dia de início da nova modalidade:
                      </label>
                      <div className="flex w-3/4">
                        <DatePicker
                          months={months}
                          weekDays={weekDays}
                          placeholder={
                            newClassError
                              ? "É necessário selecionar uma Data"
                              : "Selecione uma Data"
                          }
                          currentDate={new DateObject()}
                          inputClass={
                            newClassError
                              ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          minDate={new DateObject().add(1, "day")}
                          mapDays={({ date }) => {
                            const isWeekend = newClass.enrolledDays.includes(
                              date.weekDay.index
                            );

                            if (!isWeekend)
                              return {
                                disabled: true,
                                style: { color: "#ccc" },
                                title: "Aula não disponível neste dia",
                              };
                          }}
                          editable={false}
                          format="DD/MM/YYYY"
                          onChange={(e: DateObject) => {
                            e !== null
                              ? setNewStudentData({
                                  ...newStudentData,
                                  curriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
                                })
                              : null;
                          }}
                        />
                      </div>
                    </div>

                    {dayIsAlreadyWithClass ? (
                      <>
                        {/* DAY WITH OTHER CLASS ALREADY PICKED ALERT */}
                        <h1 className="font-bold py-4 text-red-600 dark:text-yellow-500">
                          Atenção: alguns dias não estão disponíveis pois o
                          Aluno já está matriculado em outra modalidade neste
                          mesmo dia, após excluir e salvar os dias estarão
                          disponíveis.
                        </h1>
                      </>
                    ) : null}
                  </>
                ) : null}

                {/** CHECKBOX CONFIRM INSERT NEW CURRICULUM */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmAddCurriculum"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={newStudentData.confirmAddCurriculum}
                    onChange={() => {
                      setNewStudentData({
                        ...newStudentData,
                        confirmAddCurriculum:
                          !newStudentData.confirmAddCurriculum,
                      });
                    }}
                  />
                  <label htmlFor="confirmAddCurriculum" className="text-sm">
                    Confirmar inclusão da Aula
                  </label>
                </div>
              </div>
            )}

            {/** FAMILY SECTION TITLE */}
            {!(onlyView && !haveFamily) && (
              <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                Familiares:
              </h1>
            )}

            {/* EXISTENT FAMILY */}
            {haveFamily &&
              excludeFamily.map((family, index) => (
                <div className="flex gap-2 items-center" key={family.id}>
                  <label
                    htmlFor="existentFamilyName"
                    className="w-1/4 text-right"
                  >
                    {index === 0 ? "Familiares: " : ""}
                  </label>
                  <div className="flex w-3/4 gap-2">
                    <div className="w-10/12">
                      <input
                        type="text"
                        name="existentFamilyName"
                        disabled={
                          isSubmitting ? true : onlyView ? true : family.exclude
                        }
                        className={
                          family.exclude
                            ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                            : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        }
                        value={family.name}
                        readOnly
                      />
                    </div>
                    {!onlyView && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          family.exclude
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          const data: ExcludeFamilyProps = {
                            exclude: !family.exclude,
                            applyDiscount: family.applyDiscount,
                            id: family.id,
                            name: excludeFamily[index].name,
                          };
                          handleIncludeExcludeFamily(index, data);
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : family.exclude
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {/** CHECKBOX ADD FAMILY */}
            {!onlyView &&
              studentSelectedData &&
              studentSelectedData.studentFamilyAtSchool.length < 1 &&
              !willHaveFamily && (
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="addFamily"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Adicionar Familiar ?{" "}
                  </label>
                  <div className="w-3/4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="addFamily"
                      className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                      checked={!willHaveFamily && studentEditData.addFamily}
                      onChange={() => {
                        setStudentEditData({
                          ...studentEditData,
                          addFamily: !studentEditData.addFamily,
                        });
                      }}
                    />
                  </div>
                </div>
              )}

            {/** ADD FAMILY */}
            {studentEditData.addFamily && (
              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                {/** ADD FAMILY SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Atenção: a seguir insira os dados do aluno que estuda na KL
                  Minas, e é parente de {studentEditData.name}:
                </h1>

                {/* FAMILY SCHOOL SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newFamilySchoolSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Escola do Parente:{" "}
                  </label>
                  <select
                    id="newFamilySchoolSelect"
                    defaultValue={" -- select an option -- "}
                    className={
                      errors.addFamily
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="newFamilySchoolSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        newFamilySchoolId: e.target.value,
                      });
                    }}
                  >
                    <SelectOptions returnId dataType="schools" />
                  </select>
                </div>

                {/* FAMILY SCHOOL CLASS SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newFamilySchoolClassSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione o Ano Escolar do Parente:{" "}
                  </label>
                  <select
                    id="newFamilySchoolClassSelect"
                    defaultValue={" -- select an option -- "}
                    disabled={newStudentData.newFamilySchoolId ? false : true}
                    className={
                      newStudentData.newFamilySchoolId
                        ? errors.addFamily
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newFamilySchoolClassSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        newFamilySchoolClassId: e.target.value,
                      });
                    }}
                  >
                    {newStudentData.newFamilySchoolId ? (
                      <SelectOptions
                        returnId
                        dataType="schoolClasses"
                        schoolId={newStudentData.newFamilySchoolId}
                      />
                    ) : (
                      <option disabled value={" -- select an option -- "}>
                        {" "}
                        -- Selecione uma escola para ver os Anos Escolares
                        disponíveis --{" "}
                      </option>
                    )}
                  </select>
                </div>

                {/* FAMILY SCHOOL COURSE SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newFamilyCurriculumSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Modalidade do Parente:{" "}
                  </label>
                  <select
                    id="newFamilyCurriculumSelect"
                    defaultValue={" -- select an option -- "}
                    disabled={
                      newStudentData.newFamilySchoolClassId ? false : true
                    }
                    className={
                      newStudentData.newFamilySchoolClassId
                        ? errors.addFamily
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newFamilyCurriculumSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        newFamilyCurriculumId: e.target.value,
                      });
                    }}
                  >
                    {newStudentData.newFamilySchoolClassId ? (
                      <SelectOptions
                        returnId
                        dataType="curriculum"
                        displaySchoolCourseAndSchedule
                        schoolId={newStudentData.newFamilySchoolId}
                        schoolClassId={newStudentData.newFamilySchoolClassId}
                      />
                    ) : (
                      <option value={" -- select an option -- "}>
                        {" "}
                        -- Selecione um Ano Escolar para ver as modalidades
                        disponíveis --{" "}
                      </option>
                    )}
                  </select>
                </div>

                {/* FAMILY STUDENT SELECT */}
                <div className="flex gap-2 items-center pb-2">
                  <label
                    htmlFor="newFamilyStudentSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione o Parente:{" "}
                  </label>
                  <select
                    id="newFamilyStudentSelect"
                    defaultValue={" -- select an option -- "}
                    disabled={
                      newStudentData.newFamilyCurriculumId ? false : true
                    }
                    className={
                      newStudentData.newFamilyCurriculumId
                        ? errors.addFamily
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newFamilyStudentSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        familyId: e.target.value,
                      });
                    }}
                  >
                    {newStudentData.newFamilyCurriculumId ? (
                      <SelectOptions
                        returnId
                        dataType="searchEnrolledStudent"
                        dontShowMyself
                        studentId={studentId}
                        curriculumId={newStudentData.newFamilyCurriculumId}
                      />
                    ) : (
                      <option disabled value={" -- select an option -- "}>
                        {" "}
                        -- Selecione Colégio, Ano Escolar e Modalidade para ver
                        os alunos disponíveis --{" "}
                      </option>
                    )}
                  </select>
                </div>

                {/** CHECKBOX CONFIRM INSERT NEW FAMILY */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmAddFamily"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={newStudentData.confirmAddFamily}
                    onChange={() => {
                      setNewStudentData({
                        ...newStudentData,
                        confirmAddFamily: !newStudentData.confirmAddFamily,
                      });
                    }}
                  />
                  <label htmlFor="confirmAddFamily" className="text-sm">
                    Confirmar inclusão do Familiar
                  </label>
                </div>
              </div>
            )}

            {/** PRICES SECTION TITLE */}
            <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
              Financeiro:
            </h1>

            {/** CHECKBOX ADD ENROLMENT EXEMPTION */}
            <div className="flex gap-2 items-center py-2">
              <label htmlFor="enrolmentExemption" className="w-1/4 text-right">
                Ativar Isenção de Matrícula ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="enrolmentExemption"
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={enrolmentExemption}
                  disabled={onlyView}
                  onChange={() => {
                    setEnrolmentExemption(!enrolmentExemption);
                  }}
                />
              </div>
            </div>

            {/* STUDENT ENROLMENT PRICE */}
            <div className="flex gap-2 items-center">
              <label htmlFor="enrolmentFee" className="w-1/4 text-right">
                Matrícula:
              </label>
              <input
                type="text"
                name="enrolmentFee"
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                readOnly
                disabled={onlyView}
                value={studentEditData.enrolmentFee.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              />
            </div>

            {/** CHECKBOX ADD EMPLOYEE DISCOUNT */}
            <div className="flex gap-2 items-center">
              <label htmlFor="employeeDiscount" className="w-1/4 text-right">
                Ativar Desconto de Funcionário ? (20%){" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="employeeDiscount"
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                  disabled={onlyView ? true : studentEditData.customDiscount}
                  checked={studentEditData.employeeDiscount}
                  onChange={() => {
                    setStudentEditData({
                      ...studentEditData,
                      employeeDiscount: !studentEditData.employeeDiscount,
                    });
                  }}
                />
              </div>
            </div>

            {/** CHECKBOX ADD CUSTOM DISCOUNT */}
            <div className="flex gap-2 items-center py-2">
              <label htmlFor="customDiscount" className="w-1/4 text-right">
                Ativar Desconto Personalizado ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="customDiscount"
                  disabled={onlyView}
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={studentEditData.customDiscount}
                  onChange={() => {
                    setStudentEditData({
                      ...studentEditData,
                      employeeDiscount: false,
                      customDiscount: !studentEditData.customDiscount,
                    });
                  }}
                />
                <label
                  htmlFor="customDiscountValue"
                  className="w-1/4 text-right"
                >
                  Porcentagem de desconto:{" "}
                </label>
                <input
                  type="text"
                  name="customDiscountValue"
                  disabled={onlyView ? true : !studentEditData.customDiscount}
                  className={
                    onlyView ?? studentEditData.customDiscount
                      ? errors.customDiscountValue
                        ? "w-1/12 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-1/12 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      : "w-1/12 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  }
                  pattern="^[+ 0-9]{5}$"
                  maxLength={2}
                  value={
                    studentEditData.customDiscount
                      ? studentEditData.customDiscountValue
                      : "0"
                  }
                  onChange={(e) =>
                    setStudentEditData({
                      ...studentEditData,
                      customDiscountValue: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    })
                  }
                />
                <label
                  htmlFor="customDiscountValue"
                  className="w-1/4 text-left"
                >
                  %
                </label>
              </div>
            </div>

            {/* STUDENT CLASS DAYS MONTHLY PAYMENT PRICE */}
            <div className="flex gap-2 items-center">
              <label htmlFor="monthlyPayment" className="w-1/4 text-right">
                Mensalidade:
              </label>
              <input
                type="text"
                name="monthlyPayment"
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                disabled={onlyView}
                readOnly
                value={newPrices.appliedPrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              />
            </div>

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
        </div>
      </>
    );
  } else {
    return `${studentSelectedData?.name}, "não carregou"`;
  }
}
