/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import cep from "cep-promise";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import {
  classDayIndex,
  customerFullName,
  employeeDiscountValue,
  familyDiscountValue,
  formataCPF,
  months,
  paymentArray,
  secondCourseDiscountValue,
  standardPaymentDay,
  testaCPF,
  weekDays,
} from "../../custom";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createStudentValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  ClassDaySearchProps,
  CreateStudentValidationZProps,
  CurriculumSearchProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  SearchCurriculumValidationZProps,
  StudentSearchProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertStudent() {
  // STUDENT DATA
  const [studentData, setStudentData] = useState<CreateStudentValidationZProps>(
    {
      name: "",
      email: "",
      birthDate: "",
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
      responsible: "",
      responsibleDocument: "",
      financialResponsible: "",
      financialResponsibleDocument: "",
      familyAtSchoolId: "",
      curriculum: "",
      enrolmentExemption: false,
      customDiscount: false,
      customDiscountValue: "",
      employeeDiscount: false,
      familyDiscount: false,
      secondCourseDiscount: false,
      paymentDay: "",
      confirmInsert: false,
    }
  );

  // ---------------------------- FAMILY SCHOOL, CLASS, CURRICULUM AND STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //
  // STUDENT DATA
  const [familyStudentData, setFamilyStudentData] = useState({
    studentId: "",
    curriculumId: "",
    schoolId: "",
    schoolClassId: "",
    confirmDelete: false,
  });

  // -------------------------- FAMILY SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL
  const [familySchoolDataArray, setFamilySchoolDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilySchoolSelectedData = (data: SchoolSearchProps[]) => {
    setFamilySchoolDataArray(data);
  };

  // FAMILY SCHOOL SELECTED STATE DATA
  const [, setFamilySchoolSelectedData] = useState<SchoolSearchProps>();

  // SET FAMILY SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (familyStudentData.schoolId !== "") {
      setFamilySchoolSelectedData(
        familySchoolDataArray!.find(
          ({ id }) => id === familyStudentData.schoolId
        )
      );
    } else {
      setFamilySchoolSelectedData(undefined);
    }
  }, [familyStudentData.schoolId]);
  // -------------------------- END OF FAMILY SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT FAMILY SCHOOL CLASS
  const [familyschoolClassDataArray, setFamilySchoolClassDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilySchoolClassSelectedData = (
    data: SchoolClassSearchProps[]
  ) => {
    setFamilySchoolClassDataArray(data);
  };

  // FAMILY SCHOOL CLASS SELECTED STATE DATA
  const [, setFamilySchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET FAMILY SCHOOL CLASS SELECTED STATE WHEN SELECT FAMILY SCHOOL CLASS
  useEffect(() => {
    if (familyStudentData.schoolClassId !== "") {
      setFamilySchoolClassSelectedData(
        familyschoolClassDataArray!.find(
          ({ id }) => id === familyStudentData.schoolClassId
        )
      );
    } else {
      setFamilySchoolClassSelectedData(undefined);
    }
  }, [familyStudentData.schoolClassId]);
  // -------------------------- END OF FAMILY SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY CURRICULUM DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [familyCurriculumDataArray, setFamilyCurriculumDataArray] =
    useState<CurriculumSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY CURRICULUM SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilyCurriculumSelectedData = (
    data: CurriculumSearchProps[]
  ) => {
    setFamilyCurriculumDataArray(data);
  };

  // FAMILY CURRICULUM SELECTED STATE DATA
  const [, setFamilyCurriculumSelectedData] = useState<CurriculumSearchProps>();

  // SET FAMILY CURRICULUM SELECTED STATE WHEN SELECT FAMILY CURRICULUM
  useEffect(() => {
    if (familyStudentData.curriculumId !== "") {
      setFamilyCurriculumSelectedData(
        familyCurriculumDataArray!.find(
          ({ id }) => id === familyStudentData.curriculumId
        )
      );
    } else {
      setFamilyCurriculumSelectedData(undefined);
    }
  }, [familyStudentData.curriculumId]);
  // -------------------------- END OF FAMILY CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY STUDENT SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY STUDENT DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [familyStudentDataArray, setFamilyStudentDataArray] =
    useState<StudentSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY STUDENT SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilyStudentSelectedData = (data: StudentSearchProps[]) => {
    setFamilyStudentDataArray(data);
  };

  // FAMILY STUDENT SELECTED STATE DATA
  const [familyStudentSelectedData, setFamilyStudentSelectedData] =
    useState<StudentSearchProps>();

  // SET FAMILY STUDENT SELECTED STATE WHEN SELECT FAMILY STUDENT
  useEffect(() => {
    if (familyStudentData.studentId !== "") {
      setFamilyStudentSelectedData(
        familyStudentDataArray!.find(
          ({ id }) => id === familyStudentData.studentId
        )
      );
    } else {
      setFamilyStudentSelectedData(undefined);
    }
  }, [familyStudentData.studentId]);

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER FAMILY SCHOOL SELECT WHEN CHANGE FAMILY SCHOOL
  useEffect(() => {
    if (studentData.familyDiscount) {
      (
        document.getElementById("familySchoolClassSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("familySchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("familyStudentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      setFamilyStudentData({
        ...familyStudentData,
        schoolClassId: "",
        curriculumId: "",
        studentId: "",
      });
      setStudentData({
        ...studentData,
        confirmInsert: false,
      });
    }
  }, [familyStudentData.schoolId]);

  // RESET ALL UNDER FAMILY SCHOOL CLASS SELECT WHEN CHANGE FAMILY SCHOOL CLASS
  useEffect(() => {
    if (studentData.familyDiscount) {
      (
        document.getElementById("familySchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("familyStudentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      setFamilyStudentData({
        ...familyStudentData,
        curriculumId: "",
        studentId: "",
      });
      setStudentData({
        ...studentData,
        confirmInsert: false,
      });
    }
  }, [familyStudentData.schoolClassId]);

  // RESET ALL UNDER FAMILY CURRICULUM SELECT WHEN CHANGE FAMILY CURRICULUM
  useEffect(() => {
    if (studentData.familyDiscount) {
      (
        document.getElementById("familyStudentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      setFamilyStudentData({
        ...familyStudentData,
        studentId: "",
      });
      setStudentData({
        ...studentData,
        confirmInsert: false,
      });
    }
  }, [familyStudentData.curriculumId]);

  // SET FAMILY STUDENT ID TO STUDENT DATA AND RESET CONFIRM INSERT WHEN CHANGE FAMILY STUDENT
  useEffect(() => {
    setStudentData({
      ...studentData,
      familyAtSchoolId: familyStudentData.studentId,
      confirmInsert: false,
    });
  }, [familyStudentData.studentId]);
  // -------------------------- END OF RESET SELECTS -------------------------- //
  // -------------------------- END OF FAMILY STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

  // ---------------------------- END OF FAMILY SCHOOL, CLASS, CURRICULUM AND STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //

  // ---------------------------- STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //
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
  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL
  const [schoolDataArray, setSchoolDataArray] = useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (curriculumData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDataArray!.find(({ id }) => id === curriculumData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [curriculumData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolName: schoolSelectedData!.name,
      });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASS
  const [schoolClassDataArray, setSchoolClassDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolClassSelectedData = (data: SchoolClassSearchProps[]) => {
    setSchoolClassDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDataArray!.find(
          ({ id }) => id === curriculumData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [curriculumData.schoolClassId]);

  // SET SCHOOL CLASS NAME WITH SCHOOL CLASS SELECTED DATA WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (schoolClassSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolClassName: schoolClassSelectedData!.name,
      });
    }
  }, [schoolClassSelectedData]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSE
  const [schoolCourseDataArray, setSchoolCourseDataArray] =
    useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolCourseSelectedData = (data: SchoolCourseSearchProps[]) => {
    setSchoolCourseDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDataArray!.find(
          ({ id }) => id === curriculumData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [curriculumData.schoolCourseId]);

  // SCHOOL COURSE SELECTED PRICE STATE
  const [schoolCourseSelectedPrice, setSchoolCourseSelectedPrice] = useState({
    bundleDays: 0,
    priceBundle: 0,
    priceUnit: 0,
  });

  // SET SCHOOL COURSE NAME WITH SCHOOL COURSE SELECTED DATA WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolCourseName: schoolCourseSelectedData!.name,
      });
      setSchoolCourseSelectedPrice({
        bundleDays: schoolCourseSelectedData.bundleDays,
        priceBundle: schoolCourseSelectedData.priceBundle,
        priceUnit: schoolCourseSelectedData.priceUnit,
      });
    }
  }, [schoolCourseSelectedData]);

  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE DATA ARRAY WITH ALL OPTIONS OF SCHEDULES
  const [schedulesDetailsData, setSchedulesDetailsData] = useState<
    ScheduleSearchProps[]
  >([]);

  // GETTING SCHEDULES DATA
  const handleSchedulesDetails = async () => {
    const q = query(collection(db, "schedules"));
    const querySnapshot = await getDocs(q);
    const promises: ScheduleSearchProps[] = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data() as ScheduleSearchProps;
      promises.push(promise);
    });
    setSchedulesDetailsData(promises);
  };

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    handleSchedulesDetails();
  }, []);
  // -------------------------- END OF SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- EXPERIMENTAL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM / EXPERMIENTAL CLASS STATE
  const [newClass, setNewClass] = useState({
    isExperimental: true,
    date: "",
    name: "",
    enrolledDays: [] as number[],
    enrolmentFee:
      new Date().getMonth() < 6 ? 135 : new Date().getMonth() < 10 ? 67.5 : 0,
    fullPrice: 0,
    appliedPrice: 0,
  });

  // CHANGE ENROLMENT FEE VALUE WHEN ACTIVATE REGISTRATION EXEMPTION
  useEffect(() => {
    if (studentData.enrolmentExemption) {
      setNewClass({ ...newClass, enrolmentFee: 0 });
    } else {
      setNewClass({
        ...newClass,
        enrolmentFee:
          new Date().getMonth() < 6
            ? 135
            : new Date().getMonth() < 10
            ? 67.5
            : 0,
      });
    }
  }, [studentData.enrolmentExemption, newClass.name]);

  // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
  useEffect(() => {
    if (!studentData.customDiscount) {
      setStudentData({ ...studentData, customDiscountValue: "0" });
    }
  }, [studentData.customDiscount]);

  function handleValueWithoutDiscount() {
    const priceUnit = schoolCourseSelectedPrice.priceUnit;
    const priceBundle = schoolCourseSelectedPrice.priceBundle;
    if (newClass.enrolledDays.length === 0) {
      setNewClass({
        ...newClass,
        fullPrice: 0,
        appliedPrice: 0,
      });
    }
    if (newClass.enrolledDays.length === 1) {
      setNewClass({
        ...newClass,
        appliedPrice: priceUnit,
        fullPrice: priceUnit,
      });
    }
    if (newClass.enrolledDays.length > 1) {
      const result = Math.floor(3 / schoolCourseSelectedPrice.bundleDays);
      const rest =
        newClass.enrolledDays.length % schoolCourseSelectedPrice.bundleDays;
      setNewClass({
        ...newClass,
        appliedPrice:
          result * priceBundle + rest * (priceUnit * secondCourseDiscountValue),
        fullPrice: result * priceBundle + rest * priceUnit,
      });
    }
  }

  function handleValueWithCustomDiscount() {
    if (
      studentData.customDiscountValue &&
      +studentData.customDiscountValue > 0
    ) {
      const customDiscountValueSum = 100 - +studentData.customDiscountValue;
      const priceUnitDiscount = +(
        schoolCourseSelectedPrice.priceUnit *
        +`0.${
          customDiscountValueSum > 9
            ? customDiscountValueSum
            : `0${customDiscountValueSum}`
        }`
      ).toFixed(2);
      const priceBundleDiscount = +(
        schoolCourseSelectedPrice.priceBundle *
        +`0.${
          customDiscountValueSum > 9
            ? customDiscountValueSum
            : `0${customDiscountValueSum}`
        }`
      ).toFixed(2);
      if (newClass.enrolledDays.length === 0) {
        setNewClass({
          ...newClass,
          appliedPrice: 0,
          fullPrice: 0,
        });
      }
      if (newClass.enrolledDays.length === 1) {
        setNewClass({
          ...newClass,
          appliedPrice: priceUnitDiscount,
          fullPrice: schoolCourseSelectedPrice.priceUnit,
        });
      }
      if (newClass.enrolledDays.length > 1) {
        const result = Math.floor(
          newClass.enrolledDays.length / schoolCourseSelectedPrice.bundleDays
        );
        const rest =
          newClass.enrolledDays.length % schoolCourseSelectedPrice.bundleDays;
        setNewClass({
          ...newClass,
          appliedPrice: result * priceBundleDiscount + rest * priceUnitDiscount,
          fullPrice:
            result * schoolCourseSelectedPrice.priceBundle +
            rest * schoolCourseSelectedPrice.priceUnit,
        });
      }
    } else {
      // PRICE CALC WITHOUT DISCOUNT APPLIED
      handleValueWithoutDiscount();
    }
  }

  function handleValueWithEmployeeDiscount() {
    const priceUnitDiscount = +(
      schoolCourseSelectedPrice.priceUnit * employeeDiscountValue
    ).toFixed(2);
    const priceBundleDiscount = +(
      schoolCourseSelectedPrice.priceBundle * employeeDiscountValue
    ).toFixed(2);
    if (newClass.enrolledDays.length === 0) {
      setNewClass({
        ...newClass,
        appliedPrice: 0,
        fullPrice: 0,
      });
    }
    if (newClass.enrolledDays.length === 1) {
      setNewClass({
        ...newClass,
        appliedPrice: priceUnitDiscount,
        fullPrice: schoolCourseSelectedPrice.priceUnit,
      });
    }
    if (newClass.enrolledDays.length > 1) {
      const result = Math.floor(
        newClass.enrolledDays.length / schoolCourseSelectedPrice.bundleDays
      );
      const rest =
        newClass.enrolledDays.length % schoolCourseSelectedPrice.bundleDays;
      setNewClass({
        ...newClass,
        appliedPrice: result * priceBundleDiscount + rest * priceUnitDiscount,
        fullPrice:
          result * schoolCourseSelectedPrice.priceBundle +
          rest * schoolCourseSelectedPrice.priceUnit,
      });
    }
  }

  function handleValueWithFamilyDiscount() {
    const priceUnitDiscount = +(
      schoolCourseSelectedPrice.priceUnit * familyDiscountValue
    ).toFixed(2);
    const priceBundleDiscount = +(
      schoolCourseSelectedPrice.priceBundle * familyDiscountValue
    ).toFixed(2);
    if (newClass.enrolledDays.length === 0) {
      setNewClass({
        ...newClass,
        fullPrice: 0,
        appliedPrice: 0,
      });
    }
    if (newClass.enrolledDays.length === 1) {
      setNewClass({
        ...newClass,
        appliedPrice: priceUnitDiscount,
        fullPrice: schoolCourseSelectedPrice.priceUnit,
      });
    }
    if (newClass.enrolledDays.length > 1) {
      const result = Math.floor(
        newClass.enrolledDays.length / schoolCourseSelectedPrice.bundleDays
      );
      const rest =
        newClass.enrolledDays.length % schoolCourseSelectedPrice.bundleDays;
      setNewClass({
        ...newClass,
        appliedPrice: result * priceBundleDiscount + rest * priceUnitDiscount,
        fullPrice:
          result * schoolCourseSelectedPrice.priceBundle +
          rest * schoolCourseSelectedPrice.priceUnit,
      });
    }
  }

  // SET MONTHLY PAYMENT WHEN SCHOOL COURSE PRICE, OR ADD FAMILY, OR EMPLOYEE DISCOUNT CHANGE
  useEffect(() => {
    // PRICE CALC IF CUSTOM DISCOUNT IS APPLIED
    if (studentData.customDiscount) {
      handleValueWithCustomDiscount();
    }
    // PRICE CALC IF EMPLOYEE DISCOUNT IS APPLIED
    else if (studentData.employeeDiscount) {
      handleValueWithEmployeeDiscount();
    }
    // PRICE CALC IF FAMILY DISCOUNT IS APPLIED
    else if (studentData.familyDiscount) {
      handleValueWithFamilyDiscount();
    }
    // PRICE CALC WITHOUT DISCOUNT APPLIED
    else {
      handleValueWithoutDiscount();
    }
  }, [
    newClass.enrolledDays,
    studentData.familyDiscount,
    studentData.employeeDiscount,
    studentData.customDiscount,
    studentData.customDiscountValue,
  ]);

  const [experimentalClassError, setExperimentalClassError] = useState(false);

  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF SELECT CURRICULUM
  const [curriculumDataArray, setCurriculumDataArray] =
    useState<CurriculumSearchProps[]>();

  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // GET CURRICULUM FULL DATA WHEN STUDENT CURRICULUM IS SELECTED
  useEffect(() => {
    const handleCurriculumFullData = async () => {
      if (studentData.curriculum !== "") {
        const q = query(
          collection(db, "curriculum"),
          where("id", "==", studentData.curriculum)
        );
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          const promises: CurriculumSearchProps[] = [];
          querySnapShot.forEach((doc) => {
            const promise = doc.data() as CurriculumSearchProps;
            promises.push(promise);
          });
          setCurriculumDataArray(promises);
        });
        console.log(unsubscribe);
      } else {
        setCurriculumDataArray(undefined);
      }
    };
    handleCurriculumFullData();
  }, [studentData.curriculum]);

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumDataArray !== undefined) {
      setCurriculumSelectedData(
        curriculumDataArray!.find(({ id }) => id === studentData.curriculum)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumDataArray]);

  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF SELECT CURRICULUM
  const [classDayDataArray, setClassDayDataArray] =
    useState<ClassDaySearchProps[]>();

  // CURRICULUM SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // GET CLASS DAY FULL DATA WHEN HAVE CURRICULUM SELECTED DATA
  useEffect(() => {
    const handleClassDayFullData = async () => {
      if (curriculumSelectedData !== undefined) {
        const q = query(
          collection(db, "classDays"),
          where("id", "==", curriculumSelectedData.classDayId)
        );
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          const promises: ClassDaySearchProps[] = [];
          querySnapShot.forEach((doc) => {
            const promise = doc.data() as ClassDaySearchProps;
            promises.push(promise);
          });
          setClassDayDataArray(promises);
        });
        console.log(unsubscribe);
      } else {
        setClassDayDataArray(undefined);
      }
    };
    handleClassDayFullData();
  }, [curriculumSelectedData]);

  // SET CLASS DAY SELECTED STATE WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDayDataArray !== undefined) {
      setClassDaySelectedData(
        classDayDataArray!.find(
          ({ id }) => id === curriculumSelectedData?.classDayId
        )
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [classDayDataArray]);

  // SET ENROLLED DAYS WHEN SELECT CLASS DAY
  useEffect(() => {
    if (classDaySelectedData) {
      setNewClass({
        ...newClass,
        enrolledDays: classDaySelectedData.indexDays,
      });
    }
  }, [classDaySelectedData]);

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

  // -------------------------- END OF EXPERIMENTAL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [curriculumCoursesData, setCurriculumCoursesData] = useState<
    CurriculumSearchProps[]
  >([]);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = async () => {
    if (curriculumData.schoolCourseId === "all") {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", curriculumData.schoolId),
        where("schoolClassId", "==", curriculumData.schoolClassId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: CurriculumSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as CurriculumSearchProps;
        promises.push(promise);
      });
      setCurriculumCoursesData(promises);
    } else {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", curriculumData.schoolId),
        where("schoolClassId", "==", curriculumData.schoolClassId),
        where("schoolCourseId", "==", curriculumData.schoolCourseId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: CurriculumSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as CurriculumSearchProps;
        promises.push(promise);
      });
      setCurriculumCoursesData(promises);
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleAvailableCoursesData();
  }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER SCHOOL SELECT WHEN CHANGE SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setStudentData({
      ...studentData,
      customDiscount: false,
      employeeDiscount: false,
      familyDiscount: false,
      paymentDay: "",
      confirmInsert: false,
    });
    setNewClass({
      isExperimental: true,
      date: "",
      name: "",
      enrolmentFee:
        new Date().getMonth() < 6 ? 135 : new Date().getMonth() < 10 ? 67.5 : 0,
      fullPrice: 0,
      appliedPrice: 0,
      enrolledDays: [],
    });
  }, [curriculumData.schoolId]);

  // RESET ALL UNDER SCHOOL CLASS SELECT WHEN CHANGE SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setStudentData({
      ...studentData,
      customDiscount: false,
      employeeDiscount: false,
      familyDiscount: false,
      paymentDay: "",
      confirmInsert: false,
    });
    setNewClass({
      isExperimental: true,
      date: "",
      name: "",
      enrolmentFee:
        new Date().getMonth() < 6 ? 135 : new Date().getMonth() < 10 ? 67.5 : 0,
      fullPrice: 0,
      appliedPrice: 0,
      enrolledDays: [],
    });
  }, [curriculumData.schoolClassId]);

  // RESET ALL UNDER SCHOOL COURSE SELECT WHEN CHANGE SCHOOL COURSE
  useEffect(() => {
    setStudentData({
      ...studentData,
      customDiscount: false,
      employeeDiscount: false,
      familyDiscount: false,
      paymentDay: "",
      confirmInsert: false,
    });
    setNewClass({
      isExperimental: true,
      date: "",
      name: "",
      enrolmentFee:
        new Date().getMonth() < 6 ? 135 : new Date().getMonth() < 10 ? 67.5 : 0,
      fullPrice: 0,
      appliedPrice: 0,
      enrolledDays: [],
    });
  }, [curriculumData.schoolCourseId]);

  // RESET CONFIRM INSERT WHEN CURRICULUM AVAILABLE
  useEffect(() => {
    if (studentData.curriculum === "") {
      setNewClass({
        ...newClass,
        isExperimental: true,
        date: "",
        name: "",
        enrolledDays: [],
      });
    }
    if (studentData.curriculum !== "") {
      setNewClass({
        ...newClass,
        isExperimental: true,
        date: "",
      });
      (
        document.getElementById(
          "experimentalClassSelectQuestion"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
      setStudentData({
        ...studentData,
        customDiscount: false,
        employeeDiscount: false,
        familyDiscount: false,
        paymentDay: "",
        confirmInsert: false,
      });
    }
  }, [studentData.curriculum]);

  // RESET CONFIRM INSERT WHEN EXPERIMENTAL CLASS CHANGE
  useEffect(() => {
    setStudentData({
      ...studentData,
      confirmInsert: false,
    });
  }, [newClass]);
  // -------------------------- END OF RESET SELECTS -------------------------- //
  // ---------------------------- END OF STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CEP SUBMITTING STATE
  const [cepSubmitting, setCepSubmitting] = useState(false);

  // CEP ERROR STATE
  const [cepError, setCepError] = useState(false);

  // EDIT ADDRESS STATE
  const [editAddress, setEditAddress] = useState(false);

  // TEST RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testCPF, setTestCPF] = useState(true);

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // GET CEP (BRAZILIAN ZIP CODE) FUNCTION
  const getCep = async (data: string) => {
    setEditAddress(false);
    if (data) {
      setCepSubmitting(true);
      await cep(data)
        .then((response) => {
          setCepSubmitting(false);
          setStudentData({
            ...studentData,
            address: {
              ...studentData.address,
              cep: data,
              street: response.street,
              neighborhood: response.neighborhood,
              city: response.city,
              state: response.state,
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

  // ACTIVATING OPTIONAL PHONES STATES
  const [activePhoneSecondary, setActivePhoneSecondary] = useState(false);
  const [activePhoneTertiary, setActivePhoneTertiary] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentValidationZProps>({
    resolver: zodResolver(createStudentValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
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
      responsible: "",
      responsibleDocument: "",
      financialResponsible: "",
      financialResponsibleDocument: "",
      familyAtSchoolId: "",
      curriculum: "",
      enrolmentExemption: false,
      customDiscount: false,
      customDiscountValue: "",
      employeeDiscount: false,
      familyDiscount: false,
      secondCourseDiscount: false,
      paymentDay: "",
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setStudentData({
      name: "",
      email: "",
      birthDate: "",
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
      responsible: "",
      responsibleDocument: "",
      financialResponsible: "",
      financialResponsibleDocument: "",
      familyAtSchoolId: "",
      curriculum: "",
      enrolmentExemption: false,
      customDiscount: false,
      customDiscountValue: "",
      employeeDiscount: false,
      familyDiscount: false,
      secondCourseDiscount: false,
      paymentDay: "",
      confirmInsert: false,
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
      isExperimental: true,
      date: "",
      name: "",
      enrolmentFee:
        new Date().getMonth() < 6 ? 135 : new Date().getMonth() < 10 ? 67.5 : 0,
      fullPrice: 0,
      appliedPrice: 0,
      enrolledDays: [],
    });
    setActivePhoneSecondary(false);
    setActivePhoneTertiary(false);
    setExperimentalClassError(false);
    setEditAddress(false);
    (
      document.getElementById("phoneDDD") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("phoneSecondaryDDD") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("phoneTertiaryDDD") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    const birthDateInput = document.getElementById(
      "birthDate"
    ) as HTMLInputElement;
    birthDateInput.value = "";
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", studentData.name);
    setValue("email", studentData.email);
    setValue("birthDate", studentData.birthDate);
    setValue("address.street", studentData.address.street);
    setValue("address.number", studentData.address.number);
    setValue("address.complement", studentData.address.complement);
    setValue("address.neighborhood", studentData.address.neighborhood);
    setValue("address.city", studentData.address.city);
    setValue("address.state", studentData.address.state);
    setValue("address.cep", studentData.address.cep);
    setValue("phone.ddd", studentData.phone.ddd);
    setValue("phone.prefix", studentData.phone.prefix);
    setValue("phone.suffix", studentData.phone.suffix);
    setValue("activePhoneSecondary", studentData.activePhoneSecondary);
    setValue("phoneSecondary.ddd", studentData.phoneSecondary.ddd);
    setValue("phoneSecondary.prefix", studentData.phoneSecondary.prefix);
    setValue("phoneSecondary.suffix", studentData.phoneSecondary.suffix);
    setValue("activePhoneTertiary", studentData.activePhoneTertiary);
    setValue("phoneTertiary.ddd", studentData.phoneTertiary.ddd);
    setValue("phoneTertiary.prefix", studentData.phoneTertiary.prefix);
    setValue("phoneTertiary.suffix", studentData.phoneTertiary.suffix);
    setValue("responsible", studentData.responsible);
    setValue("responsibleDocument", studentData.responsibleDocument);
    setValue("financialResponsible", studentData.financialResponsible);
    setValue(
      "financialResponsibleDocument",
      studentData.financialResponsibleDocument
    );
    setValue("familyAtSchoolId", studentData.familyAtSchoolId);
    setValue("curriculum", studentData.curriculum);
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
    setValue("confirmInsert", studentData.confirmInsert);
  }, [studentData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.birthDate,
      errors.address?.street,
      errors.address?.number,
      errors.address?.complement,
      errors.address?.neighborhood,
      errors.address?.city,
      errors.address?.state,
      errors.address?.cep,
      errors.phone?.ddd,
      errors.phone?.prefix,
      errors.phone?.suffix,
      errors.activePhoneSecondary,
      errors.phoneSecondary?.ddd,
      errors.phoneSecondary?.prefix,
      errors.phoneSecondary?.suffix,
      errors.activePhoneTertiary,
      errors.phoneTertiary?.ddd,
      errors.phoneTertiary?.prefix,
      errors.phoneTertiary?.suffix,
      errors.responsible,
      errors.responsibleDocument,
      errors.financialResponsible,
      errors.financialResponsibleDocument,
      errors.familyAtSchoolId,
      errors.curriculum,
      errors.enrolmentExemption,
      errors.customDiscount,
      errors.customDiscountValue,
      errors.employeeDiscount,
      errors.familyDiscount,
      errors.secondCourseDiscount,
      errors.paymentDay,
      errors.confirmInsert,
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
    setIsSubmitting(true);

    // ADD STUDENT FUNCTION
    const addStudent = async () => {
      const newStudentId = uuidv4();
      const newStudentRef = doc(db, "students", newStudentId);
      try {
        // CREATE STUDENT
        await setDoc(newStudentRef, {
          id: newStudentId,
          name: data.name,
          email: data.email,
          birthDate: Timestamp.fromDate(new Date(data.birthDate)),
          address: {
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state,
            cep: data.address.cep,
          },
          phone: `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`,
          phoneSecondary: activePhoneSecondary
            ? `+55${data.phoneSecondary.ddd}${data.phoneSecondary.prefix}${data.phoneSecondary.suffix}`
            : "",
          phoneTertiary: activePhoneTertiary
            ? `+55${data.phoneTertiary.ddd}${data.phoneTertiary.prefix}${data.phoneTertiary.suffix}`
            : "",
          responsible: data.responsible,
          financialResponsible: data.financialResponsible,
          responsibleDocument: data.responsibleDocument,
          financialResponsibleDocument: data.financialResponsibleDocument,
          enrolmentExemption: data.enrolmentExemption,
          enrolmentFee: newClass.enrolmentFee,
          fullPrice: newClass.fullPrice,
          appliedPrice: newClass.appliedPrice,
          customDiscount: data.customDiscount,
          customDiscountValue: data.customDiscountValue,
          employeeDiscount: data.employeeDiscount,
          familyDiscount: data.familyDiscount,
          secondCourseDiscount: data.secondCourseDiscount,
          paymentDay:
            data.paymentDay === "" ? standardPaymentDay : data.paymentDay,
          timestamp: serverTimestamp(),
        });
        if (newClass.isExperimental) {
          // CREATING AN EXPERIMENTAL CURRICULUM
          // ADD STUDENT TO CURRICULUM TABLE ON EXPERIMENTAL STUDENTS COLLECTION
          await setDoc(
            doc(
              db,
              `curriculum/${data.curriculum}/curriculumExperimentalStudents/${data.curriculum}`
            ),
            {
              idsArray: arrayUnion(newStudentId),
              detailsArray: arrayUnion({
                id: newStudentId,
                name: data.name,
                date: Timestamp.fromDate(new Date(newClass.date)),
                isExperimental: true,
                indexDays: [],
              }),
              id: data.curriculum,
              name: newClass.name,
            },
            { merge: true }
          );
          // ADD EXPERIMENTAL CURRICULUM TO STUDENT TABLE ON EXPERIMENTAL CURRICULUM COLLECTION
          await setDoc(
            doc(
              db,
              `students/${newStudentId}/studentExperimentalCurriculum/${newStudentId}`
            ),
            {
              idsArray: arrayUnion(data.curriculum),
              detailsArray: arrayUnion({
                id: data.curriculum,
                name: newClass.name,
                date: Timestamp.fromDate(new Date(newClass.date)),
                isExperimental: true,
                indexDays: [],
              }),
              id: newStudentId,
              name: data.name,
            }
          );
          // CREATE EMPTY STUDENT CURRICULUM COLLECTION
          await setDoc(
            doc(
              db,
              `students/${newStudentId}/studentCurriculum/${newStudentId}`
            ),
            {
              idsArray: [],
              detailsArray: [],
              id: newStudentId,
              name: data.name,
              paymentRegister: paymentArray,
            }
          );
        } else {
          // CREATING AN ENROLLED CURRICULUM
          // ADD STUDENT TO CURRICULUM TABLE ON STUDENT COLLECTION
          await setDoc(
            doc(
              db,
              `curriculum/${data.curriculum}/curriculumStudents/${data.curriculum}`
            ),
            {
              idsArray: arrayUnion(newStudentId),
              detailsArray: arrayUnion({
                id: newStudentId,
                name: data.name,
                date: Timestamp.fromDate(new Date(newClass.date)),
                isExperimental: false,
                indexDays: newClass.enrolledDays,
                price: newClass.fullPrice,
              }),
              id: data.curriculum,
              name: newClass.name,
            },
            { merge: true }
          );
          // ADD CURRICULUM TO STUDENT TABLE ON CURRICULUM COLLECTION
          await setDoc(
            doc(
              db,
              `students/${newStudentId}/studentCurriculum/${newStudentId}`
            ),
            {
              idsArray: arrayUnion(data.curriculum),
              detailsArray: arrayUnion({
                id: data.curriculum,
                name: newClass.name,
                date: Timestamp.fromDate(new Date(newClass.date)),
                isExperimental: false,
                indexDays: newClass.enrolledDays,
                price: newClass.fullPrice,
              }),
              id: newStudentId,
              name: data.name,
              paymentRegister: paymentArray,
            }
          );
          // CREATE EMPTY STUDENT EXPERIMENTAL CURRICULUM COLLECTION
          await setDoc(
            doc(
              db,
              `students/${newStudentId}/studentExperimentalCurriculum/${newStudentId}`
            ),
            {
              idsArray: [],
              detailsArray: [],
              id: newStudentId,
              name: data.name,
            }
          );
        }
        if (data.familyDiscount) {
          // CREATE STUDENT FAMILY'S INSIDE STUDENT TABLE
          await setDoc(
            doc(
              db,
              `students/${newStudentId}/studentFamilyAtSchool/${newStudentId}`
            ),
            {
              idsArray: arrayUnion(data.familyAtSchoolId!),
              detailsArray: arrayUnion({
                id: data.familyAtSchoolId!,
                name: familyStudentSelectedData?.name,
                applyDiscount: true,
              }),
              id: newStudentId,
              name: data.name,
            },
            { merge: true }
          );
          // IF YOU WANT TO CREATE STUDENT INSIDE FAMILY TABLE COLLECTION, UNCOMMENT THIS SECTION
          await setDoc(
            doc(
              db,
              `students/${data.familyAtSchoolId!}/studentFamilyAtSchool/${data.familyAtSchoolId!}`
            ),
            {
              idsArray: arrayUnion(newStudentId),
              detailsArray: arrayUnion({
                id: newStudentId,
                name: data.name,
                applyDiscount: false,
              }),
              id: data.familyAtSchoolId!,
              name: familyStudentSelectedData?.name,
            },
            { merge: true }
          );
        } else {
          // CREATE EMPTY FAMILYATSCHOOL DOC
          await setDoc(
            doc(
              db,
              `students/${newStudentId}/studentFamilyAtSchool/${newStudentId}`
            ),
            {
              idsArray: [],
              detailsArray: [],
              id: newStudentId,
              name: data.name,
            },
            { merge: true }
          );
        }
        toast.success(`Aluno ${data.name} criado com sucesso! 👌`, {
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

    // CHEKING IF INITIAL CLASS DATE AND/OR EXPERIMENTAL CLASS DATE WAS PICKED
    if (newClass.date === "") {
      return (
        setIsSubmitting(false),
        setExperimentalClassError(true),
        toast.error(
          newClass.isExperimental
            ? "Escolha a data da Aula Experimental... ❕"
            : "Escolha a data da aula inicial... ❕",
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
      setExperimentalClassError(false);
    }

    // CHEKING IF CLASS DAY WAS PICKED
    if (!newClass.isExperimental && newClass.enrolledDays.length < 1) {
      return (
        setIsSubmitting(false),
        setExperimentalClassError(true),
        toast.error("Escolha pelo menos um dia de aula... ❕", {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    }

    // CHEKING VALID RESPONSIBLE DOCUMENT
    if (!testCPF) {
      return (
        setIsSubmitting(false),
        setExperimentalClassError(true),
        toast.error(
          "CPF do responsável é inválido, por favor verifique... ❕",
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

    // CHEKING VALID SECONDARY PHONE
    if (studentData.activePhoneSecondary) {
      if (studentData.phoneSecondary.ddd === "DDD") {
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
    if (studentData.activePhoneTertiary) {
      if (studentData.phoneTertiary.ddd === "DDD") {
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
        familyStudentData.schoolId === "" ||
        familyStudentData.schoolClassId === "" ||
        familyStudentData.curriculumId === "" ||
        familyStudentData.studentId === ""
      ) {
        setIsSubmitting(false);
        return toast.error(
          `Por favor, verifique os dados do parente que já estuda na escola... ☑️`,
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

    // CHECK SCHOOL CLASS PICK
    if (curriculumData.schoolClassId === "") {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, verifique as opções de Colégio e Turma... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF STUDENT EXISTS ON DATABASE
    const studentRef = collection(db, "students");
    const q = query(
      studentRef,
      where("name", "==", data.name),
      where("email", "==", data.email),
      where("responsible", "==", data.responsible),
      where("financialResponsible", "==", data.financialResponsible)
    );
    const querySnapshot = await getDocs(q);
    const promises: StudentSearchProps[] = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data() as StudentSearchProps;
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF EXISTS, RETURN ERROR
      if (results.length !== 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Aluno ${data.name} já existe no nosso banco de dados... ❕`,
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
        // IF NOT EXISTS, CREATE
        addStudent();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Aluno</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddStudent)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/** PERSONAL DATA SECTION TITLE */}
        <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
          Dados Pessoais:
        </h1>

        {/* NAME */}
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
                ? "É necessário inserir o nome completo do aluno"
                : "Insira o nome completo do aluno"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.name}
            onChange={(e) => {
              setStudentData({ ...studentData, name: e.target.value });
            }}
          />
        </div>

        {/* E-MAIL */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="email"
            className={
              errors.email
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            E-mail:{" "}
          </label>
          <input
            type="text"
            name="email"
            disabled={isSubmitting}
            placeholder={
              errors.email ? "É necessário inserir o e-mail" : "Insira o e-mail"
            }
            className={
              errors.email
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.email}
            onChange={(e) => {
              setStudentData({ ...studentData, email: e.target.value });
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
              name="birthDate"
              id="birthDate"
              months={months}
              weekDays={weekDays}
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
              onChange={(e: DateObject) => {
                e !== null
                  ? setStudentData({
                      ...studentData,
                      birthDate: `${e.month}/${e.day}/${e.year}`,
                    })
                  : null;
              }}
            />
          </div>
        </div>

        {/* ADDRESS */}
        {/* CEP */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="addressCep"
            className={
              errors.address?.cep
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
                maxLength={8}
                placeholder={
                  errors.address?.cep || cepError
                    ? "É necessário inserir um CEP"
                    : "Insira o CEP"
                }
                className={
                  errors.address?.cep || cepError
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentData.address.cep}
                onChange={(e) => {
                  setCepError(false);
                  setStudentData({
                    ...studentData,
                    address: {
                      ...studentData.address,
                      cep: formatCEP(e.target.value),
                    },
                  });
                }}
              />
            </div>
            <button
              type="button"
              disabled={cepSubmitting}
              className="border rounded-2xl border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/12"
              onClick={() => {
                getCep(studentData.address.cep);
              }}
            >
              {cepSubmitting ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* STREET AND NUMBER */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="addressStreet"
            className={
              errors.address?.street
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Rua:{" "}
          </label>
          <div className="flex w-3/4 gap-2">
            <div className={`flex w-10/12`}>
              <input
                type="text"
                name="addressStreet"
                disabled={!editAddress}
                placeholder={
                  errors.address?.street
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "Rua / Av. / Pça"
                }
                className={
                  editAddress
                    ? errors.address?.street
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address?.street}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, street: e.target.value },
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
                placeholder={errors.address?.number ? "Número" : "Número"}
                className={
                  errors.address?.number
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentData.address?.number}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, number: e.target.value },
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
              errors.address?.neighborhood
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Bairro:{" "}
          </label>
          <div className={`flex w-3/4 gap-2 items-center`}>
            <div className="w-10/12">
              <input
                type="text"
                name="addressNeighborhood"
                disabled={!editAddress}
                placeholder={
                  errors.address?.neighborhood
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "Bairro"
                }
                className={
                  editAddress
                    ? errors.address?.neighborhood
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address.neighborhood}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: {
                      ...studentData.address,
                      neighborhood: e.target.value,
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
                placeholder={"Apto | Bloco"}
                className={
                  errors.address
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentData.address.complement}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: {
                      ...studentData.address,
                      complement: e.target.value,
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
              errors.address?.city
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Cidade:{" "}
          </label>
          <div className={`flex w-3/4 gap-2 items-center`}>
            <div className={`flex w-10/12`}>
              <input
                type="text"
                name="addressCity"
                disabled={!editAddress}
                placeholder={
                  errors.address?.city
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "Cidade"
                }
                className={
                  editAddress
                    ? errors.address?.city
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address.city}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, city: e.target.value },
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
                  errors.address?.state
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "UF"
                }
                className={
                  editAddress
                    ? errors.address?.state
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address.state}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, state: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* EDIT ADDRESS BUTTON */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="editAddressButton"
            className="w-1/4 text-right"
          ></label>
          <button
            type="button"
            name="editAddressButton"
            disabled={editAddress}
            className="border rounded-2xl mt-2 mb-4 border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-3/4"
            onClick={() => setEditAddress(true)}
          >
            {editAddress
              ? "Insira o Endereço manualmente, ou busque o CEP novamente"
              : "Editar Endereço"}
          </button>
        </div>

        {/* PHONE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phone"
            className={
              errors.phone
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
                className={
                  errors.phone?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phone: { ...studentData.phone, ddd: e.target.value },
                  });
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              <input
                type="text"
                name="phoneInitial"
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={studentData.phone.prefix}
                placeholder={errors.phone?.prefix ? "É necessário um" : "99999"}
                className={
                  errors.phone?.prefix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phone: {
                      ...studentData.phone,
                      prefix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
              -
              <input
                type="text"
                name="phoneFinal"
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={studentData.phone.suffix}
                placeholder={errors.phone?.suffix ? "telefone válido" : "9990"}
                className={
                  errors.phone?.suffix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phone: {
                      ...studentData.phone,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            <div className="flex w-2/12 items-center gap-2"></div>
          </div>
        </div>

        {/* PHONE SECONDARY */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phoneSecondary"
            className={
              errors.phoneSecondary
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
                disabled={!studentData.activePhoneSecondary}
                defaultValue={"DDD"}
                className={
                  errors.phoneSecondary?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneSecondary: {
                      ...studentData.phoneSecondary,
                      ddd: e.target.value,
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
                disabled={!studentData.activePhoneSecondary}
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={studentData.phoneSecondary.prefix}
                placeholder={
                  errors.phoneSecondary?.prefix ? "É necessário um" : "99999"
                }
                className={
                  studentData.activePhoneSecondary
                    ? errors.phoneSecondary?.prefix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneSecondary: {
                      ...studentData.phoneSecondary,
                      prefix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
              -{/** NUMBER SECONDARY SUFFIX */}
              <input
                type="text"
                name="phoneSecondaryFinal"
                disabled={!studentData.activePhoneSecondary}
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={studentData.phoneSecondary.suffix}
                placeholder={
                  errors.phoneSecondary?.prefix ? "telefone válido" : "9999"
                }
                className={
                  studentData.activePhoneSecondary
                    ? errors.phoneSecondary?.suffix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneSecondary: {
                      ...studentData.phoneSecondary,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            {/** CHECKBOX INCLUDE NUMBER SECONDARY */}
            <div className="flex w-2/12 items-center gap-2">
              <input
                type="checkbox"
                name="activePhoneSecondary"
                className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                checked={activePhoneSecondary}
                onChange={() => {
                  setActivePhoneSecondary(!activePhoneSecondary);
                  setStudentData({
                    ...studentData,
                    activePhoneSecondary: !activePhoneSecondary,
                  });
                }}
              />
              <label htmlFor="activePhoneSecondary" className="text-sm">
                Incluir
              </label>
            </div>
          </div>
        </div>

        {/* PHONE TERTIARY */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phoneTertiary"
            className={
              errors.phoneTertiary
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
                disabled={!studentData.activePhoneTertiary}
                defaultValue={"DDD"}
                className={
                  errors.phoneTertiary?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneTertiary: {
                      ...studentData.phoneTertiary,
                      ddd: e.target.value,
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
                disabled={!studentData.activePhoneTertiary}
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={studentData.phoneTertiary.prefix}
                placeholder={
                  errors.phoneTertiary?.prefix ? "É necessário um" : "99999"
                }
                className={
                  studentData.activePhoneTertiary
                    ? errors.phoneTertiary?.prefix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneTertiary: {
                      ...studentData.phoneTertiary,
                      prefix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
              -{/** NUMBER TERTIARY SUFFIX */}
              <input
                type="text"
                name="phoneTertiaryFinal"
                disabled={!studentData.activePhoneTertiary}
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={studentData.phoneTertiary.suffix}
                placeholder={
                  errors.phoneTertiary?.prefix ? "telefone válido" : "9999"
                }
                className={
                  studentData.activePhoneTertiary
                    ? errors.phoneTertiary?.suffix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneTertiary: {
                      ...studentData.phoneTertiary,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            {/** CHECKBOX INCLUDE NUMBER TERTIARY */}
            <div className="flex w-2/12 items-center gap-2">
              <input
                type="checkbox"
                name="activePhoneTertiary"
                className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                checked={activePhoneTertiary}
                onChange={() => {
                  setActivePhoneTertiary(!activePhoneTertiary);
                  setStudentData({
                    ...studentData,
                    activePhoneTertiary: !activePhoneTertiary,
                  });
                }}
              />
              <label htmlFor="activePhoneTertiary" className="text-sm">
                Incluir
              </label>
            </div>
          </div>
        </div>

        {/* RESPONSIBLE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="responsible"
            className={
              errors.responsible
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Responsável{" "}
            <span className="text-sm">
              (diferente do responsável pela cobrança)
            </span>
            :{" "}
          </label>
          <input
            type="text"
            name="responsible"
            placeholder={
              errors.responsible
                ? "É necessário inserir o Nome completo do Responsável"
                : "Insira o nome completo do Responsável"
            }
            className={
              errors.responsible
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.responsible}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                responsible: e.target.value,
              })
            }
          />
        </div>

        {/* RESPONSIBLE DOCUMENT*/}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="responsibleDocument"
            className={
              testCPF
                ? errors.responsibleDocument
                  ? "w-1/4 text-right text-red-500 dark:text-red-400"
                  : "w-1/4 text-right"
                : "w-1/4 text-right text-red-500 dark:text-red-400"
            }
          >
            CPF do Responsável
            {testCPF ? (
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
            name="responsibleDocument"
            pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
            maxLength={11}
            placeholder={
              testCPF
                ? errors.responsibleDocument
                  ? "É necessário inserir o CPF do Responsável"
                  : "Insira o CPF do Responsável"
                : "CPF Inválido"
            }
            className={
              testCPF
                ? errors.responsible
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
            }
            value={studentData.responsibleDocument}
            onChange={(e) => {
              if (e.target.value.length === 11) {
                setTestCPF(testaCPF(e.target.value));
              }
              setStudentData({
                ...studentData,
                responsibleDocument: formataCPF(e.target.value),
              });
            }}
          />
        </div>

        {/* FINANCIAL RESPONSIBLE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="financialResponsible"
            className={
              errors.financialResponsible
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Responsável Financeiro{" "}
            <span className="text-sm">(responsável pela cobrança)</span>:{" "}
          </label>
          <input
            type="text"
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
            value={studentData.financialResponsible}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                financialResponsible: e.target.value,
              })
            }
          />
        </div>

        {/* FINANCIAL RESPONSIBLE DOCUMENT*/}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="financialResponsibleDocument"
            className={
              testFinancialCPF
                ? errors.financialResponsibleDocument
                  ? "w-1/4 text-right text-red-500 dark:text-red-400"
                  : "w-1/4 text-right"
                : "w-1/4 text-right text-red-500 dark:text-red-400"
            }
          >
            CPF do Responsável Financeiro
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
            pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
            maxLength={11}
            placeholder={
              testFinancialCPF
                ? errors.financialResponsibleDocument
                  ? "É necessário inserir o CPF do Responsável Financeiro"
                  : "Insira o CPF do Responsável Financeiro"
                : "CPF Inválido"
            }
            className={
              testFinancialCPF
                ? errors.responsible
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
            }
            value={studentData.financialResponsibleDocument}
            onChange={(e) => {
              if (e.target.value.length === 11) {
                setTestFinancialCPF(testaCPF(e.target.value));
              }
              setStudentData({
                ...studentData,
                financialResponsibleDocument: formataCPF(e.target.value),
              });
            }}
          />
        </div>

        {/** CURRICULUM SECTION TITLE */}
        <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
          Selecionar Modalidade:
        </h1>

        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.curriculum
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
              errors.curriculum
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolId: e.target.value,
              });
              setStudentData({ ...studentData, curriculum: "" });
            }}
          >
            <SelectOptions
              returnId
              dataType="schools"
              handleData={handleSchoolSelectedData}
            />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.curriculum
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            id="schoolClassSelect"
            disabled={curriculumData.schoolId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumData.schoolId
                ? errors.curriculum
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolClassId: e.target.value,
              });
              setStudentData({ ...studentData, curriculum: "" });
            }}
          >
            <SelectOptions
              returnId
              availableAndWaitingClasses
              dataType="schoolClasses"
              schoolId={curriculumData.schoolId}
              handleData={handleSchoolClassSelectedData}
            />
          </select>
        </div>

        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolCourseSelect"
            className={
              errors.curriculum
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="schoolCourseSelect"
            disabled={curriculumData.schoolClassId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumData.schoolClassId
                ? errors.curriculum
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolCourseId: e.target.value,
              });
              setStudentData({ ...studentData, curriculum: "" });
            }}
          >
            <SelectOptions
              returnId
              dataType="schoolCourses"
              handleData={handleSchoolCourseSelectedData}
            />
            <option value={"all"}>Todas as Modalidades</option>
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.schoolId &&
        curriculumData.schoolClassId &&
        curriculumData.schoolCourseId ? (
          curriculumCoursesData.length !== 0 ? (
            <>
              {/* CURRICULUM SELECT SECTION TITLE */}
              <h1 className="font-bold text-2xl my-4">
                {schoolSelectedData?.name} - {schoolClassSelectedData?.name} -{" "}
                {curriculumData.schoolCourseId === "all"
                  ? "Todas as Modalidades"
                  : schoolCourseSelectedData?.name}
                :
              </h1>

              {/** SEPARATOR */}
              <hr className="pb-4" />

              {/* CURRICULUM SELECT CARD */}
              <div className="flex flex-wrap gap-4 justify-center">
                {curriculumCoursesData.map((c: CurriculumSearchProps) => (
                  <>
                    <div
                      className={
                        errors.curriculum
                          ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                          : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                      }
                      key={c.id}
                    >
                      <input
                        type="radio"
                        id={c.id}
                        name="curriculumRadio"
                        className="text-klGreen-500 dark:text-klGreen-500 border-none"
                        value={c.id}
                        onChange={(e) => {
                          setStudentData({
                            ...studentData,
                            curriculum: e.target.value,
                          });
                          setNewClass({
                            ...newClass,
                            name: c.name,
                          });
                        }}
                      />
                      <label
                        htmlFor="curriculumRadio"
                        className="flex flex-col gap-4"
                      >
                        {schoolSelectedData?.name === "Colégio Bernoulli" ? (
                          <p>Turma: {c.schoolClass}</p>
                        ) : null}
                        <p>Modalidade: {c.schoolCourse}</p>
                        {schedulesDetailsData.map(
                          (details: ScheduleSearchProps) =>
                            details.name === c.schedule
                              ? `Horário: De ${details.classStart.slice(
                                  0,
                                  2
                                )}h${
                                  details.classStart.slice(3, 5) === "00"
                                    ? ""
                                    : details.classStart.slice(3, 5) + "min"
                                } a ${details.classEnd.slice(0, 2)}h${
                                  details.classEnd.slice(3, 5) === "00"
                                    ? ""
                                    : details.classEnd.slice(3, 5) + "min"
                                }`
                              : null
                        )}
                        <p>Dias: {c.classDay}</p>
                        <p>Professor: {c.teacher}</p>
                      </label>
                    </div>
                  </>
                ))}
              </div>

              {/* IS EXPERIMENTAL CLASS ? */}
              {studentData.curriculum ? (
                <>
                  {/* EXPERIMENTAL CLASS QUESTION */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="experimentalClassSelectQuestion"
                      className={
                        experimentalClassError
                          ? "w-1/4 text-right text-red-500 dark:text-red-400"
                          : "w-1/4 text-right"
                      }
                    >
                      Aula Experimental?:{" "}
                    </label>
                    <select
                      id="experimentalClassSelectQuestion"
                      defaultValue={"true"}
                      disabled={curriculumData.schoolCourseId ? false : true}
                      className={
                        curriculumData.schoolCourseId
                          ? experimentalClassError
                            ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      }
                      name="experimentalClassSelectQuestion"
                      onChange={(e) => {
                        setNewClass({
                          ...newClass,
                          isExperimental:
                            e.target.value === "true" ? true : false,
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
                    >
                      <option value={"true"}>Sim</option>
                      <option value={"false"}>Não</option>
                    </select>
                  </div>

                  {classDaySelectedData ? (
                    newClass && classDaySelectedData?.indexDays.length > 0 ? (
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
                            {newClass.isExperimental
                              ? "Escolha o dia da aula experimental: "
                              : "Escolha a data de início: "}
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
                              containerClassName="w-full"
                              style={{ width: "100%" }}
                              inputClass={
                                experimentalClassError
                                  ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                  : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              }
                              minDate={new DateObject().add(1, "day")}
                              mapDays={({ date }) => {
                                if (!newClass.isExperimental) {
                                  const isWeekend =
                                    newClass.enrolledDays.includes(
                                      date.weekDay.index
                                    );
                                  if (!isWeekend)
                                    return {
                                      disabled: true,
                                      style: { color: "#ccc" },
                                      title: "Aula não disponível neste dia",
                                    };
                                } else {
                                  const isWeekend =
                                    classDaySelectedData.indexDays.includes(
                                      date.weekDay.index
                                    );
                                  if (!isWeekend)
                                    return {
                                      disabled: true,
                                      style: { color: "#ccc" },
                                      title: "Aula não disponível neste dia",
                                    };
                                }
                              }}
                              editable={false}
                              format="DD/MM/YYYY"
                              onChange={(e: DateObject) => {
                                e !== null
                                  ? setNewClass({
                                      ...newClass,
                                      date: `${e.month}/${e.day}/${e.year}`,
                                    })
                                  : null;
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : null
                  ) : null}

                  {classDaySelectedData ? (
                    !newClass.isExperimental &&
                    classDaySelectedData.indexNames.length > 0 ? (
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
                            <>
                              {classDaySelectedData.indexNames.map(
                                (classDayName) => (
                                  <div
                                    key={uuidv4()}
                                    className="flex w-24 items-center gap-2"
                                  >
                                    <input
                                      key={uuidv4()}
                                      type="checkbox"
                                      className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                                      id={classDayName}
                                      name={classDayName}
                                      //@ts-ignore
                                      checked={classDaysData[classDayName]}
                                      onChange={() =>
                                        toggleClassDays({
                                          day: classDayName,
                                          //@ts-ignore
                                          value: !classDaysData[classDayName],
                                        })
                                      }
                                    />
                                    <label
                                      key={uuidv4()}
                                      htmlFor={classDayName}
                                    >
                                      {" "}
                                      {classDayName}
                                    </label>
                                  </div>
                                )
                              )}
                            </>
                          </div>
                        </div>

                        {/** DISCOUNTS SECTION TITLE */}
                        <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                          Aplicar Descontos:
                        </h1>

                        {/** CHECKBOX ADD ENROLLMENT EXEMPTION */}
                        <div className="flex gap-2 items-center py-2">
                          <label
                            htmlFor="enrolmentExemption"
                            className="w-1/4 text-right"
                          >
                            Ativar Isenção de Matrícula ?{" "}
                          </label>
                          <div className="w-3/4 flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="enrolmentExemption"
                              className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                              checked={studentData.enrolmentExemption}
                              onChange={() => {
                                setStudentData({
                                  ...studentData,
                                  enrolmentExemption:
                                    !studentData.enrolmentExemption,
                                });
                              }}
                            />
                          </div>
                        </div>

                        {/** CHECKBOX ADD EMPLOYEE DISCOUNT */}
                        <div className="flex gap-2 items-center py-2">
                          <label
                            htmlFor="employeeDiscount"
                            className="w-1/4 text-right"
                          >
                            Ativar Desconto de Funcionário ? (20%){" "}
                          </label>
                          <div className="w-3/4 flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="employeeDiscount"
                              className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                              disabled={studentData.customDiscount}
                              checked={studentData.employeeDiscount}
                              onChange={() => {
                                setStudentData({
                                  ...studentData,
                                  employeeDiscount:
                                    !studentData.employeeDiscount,
                                });
                              }}
                            />
                          </div>
                        </div>

                        {/** CHECKBOX ADD CUSTOM DISCOUNT */}
                        <div className="flex gap-2 items-center py-2">
                          <label
                            htmlFor="customDiscount"
                            className="w-1/4 text-right"
                          >
                            Ativar Desconto Personalizado ?{" "}
                          </label>
                          <div className="w-3/4 flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="customDiscount"
                              className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                              checked={studentData.customDiscount}
                              onChange={() => {
                                setStudentData({
                                  ...studentData,
                                  employeeDiscount: false,
                                  customDiscount: !studentData.customDiscount,
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
                              disabled={!studentData.customDiscount}
                              className={
                                studentData.customDiscount
                                  ? errors.customDiscountValue
                                    ? "w-1/12 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                    : "w-1/12 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                                  : "w-1/12 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                              }
                              pattern="^[+ 0-9]{5}$"
                              maxLength={2}
                              value={
                                studentData.customDiscount
                                  ? studentData.customDiscountValue
                                  : "0"
                              }
                              onChange={(e) =>
                                setStudentData({
                                  ...studentData,
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

                        {/* HAVE FAMILY AT SCHOOL QUESTION */}
                        <div className="flex gap-2 items-center">
                          <label
                            htmlFor="familySchoolSelectQuestion"
                            className={
                              errors.familyDiscount
                                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                                : "w-1/4 text-right"
                            }
                          >
                            Algum parente estuda na escola?:{" "}
                          </label>
                          <select
                            id="familySchoolSelectQuestion"
                            defaultValue={"Não"}
                            className={
                              errors.familyDiscount
                                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                            }
                            name="familySchoolSelectQuestion"
                            onChange={() => {
                              setStudentData({
                                ...studentData,
                                familyDiscount: !studentData.familyDiscount,
                                confirmInsert: false,
                              });
                              setFamilyStudentData({
                                ...familyStudentData,
                                schoolId: "",
                                schoolClassId: "",
                                curriculumId: "",
                                studentId: "",
                              });
                            }}
                          >
                            <option value={"Não"}>Não</option>
                            <option value={"Sim"}>Sim</option>
                          </select>
                        </div>

                        {/* SELECT FAMILY AT SCHOOL SECTION */}
                        {studentData.familyDiscount ? (
                          <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                            {/* FAMILY AT SCHOOL TITLE */}
                            <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                              Atenção: a seguir insira os dados do aluno que já
                              é matriculado na {customerFullName}, e é parente
                              de {studentData.name}:
                            </h1>

                            {/* FAMILY SCHOOL SELECT */}
                            <div className="flex gap-2 items-center">
                              <label
                                htmlFor="familySchoolSelect"
                                className={
                                  errors.familyAtSchoolId
                                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                                    : "w-1/4 text-right"
                                }
                              >
                                Selecione a Escola do Parente:{" "}
                              </label>
                              <select
                                id="familySchoolSelect"
                                defaultValue={" -- select an option -- "}
                                disabled={isSubmitting}
                                className={
                                  errors.familyAtSchoolId
                                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                                }
                                name="familySchoolSelect"
                                onChange={(e) => {
                                  setFamilyStudentData({
                                    ...familyStudentData,
                                    schoolId: e.target.value,
                                  });
                                  setStudentData({
                                    ...studentData,
                                    confirmInsert: false,
                                  });
                                }}
                              >
                                <SelectOptions
                                  returnId
                                  dataType="schools"
                                  handleData={handleFamilySchoolSelectedData}
                                />
                              </select>
                            </div>

                            {/* FAMILY SCHOOL CLASS SELECT */}
                            <div className="flex gap-2 items-center">
                              <label
                                htmlFor="familySchoolClassSelect"
                                className={
                                  errors.familyAtSchoolId
                                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                                    : "w-1/4 text-right"
                                }
                              >
                                Selecione a Turma do Parente:{" "}
                              </label>
                              <select
                                id="familySchoolClassSelect"
                                defaultValue={" -- select an option -- "}
                                disabled={
                                  !familyStudentData.schoolId
                                    ? true
                                    : isSubmitting
                                }
                                className={
                                  familyStudentData.schoolId
                                    ? errors.familyAtSchoolId
                                      ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                      : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                                }
                                name="familySchoolClassSelect"
                                onChange={(e) => {
                                  setFamilyStudentData({
                                    ...familyStudentData,
                                    schoolClassId: e.target.value,
                                  });
                                  setStudentData({
                                    ...studentData,
                                    confirmInsert: false,
                                  });
                                }}
                              >
                                {familyStudentData.schoolId ? (
                                  <SelectOptions
                                    returnId
                                    dataType="schoolClasses"
                                    schoolId={familyStudentData.schoolId}
                                    handleData={
                                      handleFamilySchoolClassSelectedData
                                    }
                                  />
                                ) : (
                                  <option
                                    disabled
                                    value={" -- select an option -- "}
                                  >
                                    {" "}
                                    -- Selecione uma escola para ver as turmas
                                    disponíveis --{" "}
                                  </option>
                                )}
                              </select>
                            </div>

                            {/* FAMILY SCHOOL COURSE SELECT */}
                            <div className="flex gap-2 items-center">
                              <label
                                htmlFor="familySchoolCourseSelect"
                                className={
                                  errors.familyAtSchoolId
                                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                                    : "w-1/4 text-right"
                                }
                              >
                                Selecione a Modalidade do Parente:{" "}
                              </label>
                              <select
                                id="familySchoolCourseSelect"
                                defaultValue={" -- select an option -- "}
                                disabled={
                                  !familyStudentData.schoolClassId
                                    ? true
                                    : isSubmitting
                                }
                                className={
                                  familyStudentData.schoolClassId
                                    ? errors.familyAtSchoolId
                                      ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                      : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                                }
                                name="familySchoolCourseSelect"
                                onChange={(e) => {
                                  setFamilyStudentData({
                                    ...familyStudentData,
                                    curriculumId: e.target.value,
                                  });
                                  setStudentData({
                                    ...studentData,
                                    confirmInsert: false,
                                  });
                                }}
                              >
                                {familyStudentData.schoolClassId ? (
                                  <SelectOptions
                                    returnId
                                    dataType="curriculum"
                                    displaySchoolCourseAndSchedule
                                    schoolId={familyStudentData.schoolId}
                                    schoolClassId={
                                      familyStudentData.schoolClassId
                                    }
                                    handleData={
                                      handleFamilyCurriculumSelectedData
                                    }
                                  />
                                ) : (
                                  <option value={" -- select an option -- "}>
                                    {" "}
                                    -- Selecione uma Turma para ver as
                                    modalidades disponíveis --{" "}
                                  </option>
                                )}
                              </select>
                            </div>

                            {/* STUDENT SELECT */}
                            <div className="flex gap-2 items-center pb-2">
                              <label
                                htmlFor="familyStudentSelect"
                                className={
                                  errors.familyAtSchoolId
                                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                                    : "w-1/4 text-right"
                                }
                              >
                                Selecione o Parente:{" "}
                              </label>
                              <select
                                id="familyStudentSelect"
                                defaultValue={" -- select an option -- "}
                                disabled={
                                  !familyStudentData.curriculumId
                                    ? true
                                    : isSubmitting
                                }
                                className={
                                  familyStudentData.curriculumId
                                    ? errors.familyAtSchoolId
                                      ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                      : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                                }
                                name="familyStudentSelect"
                                onChange={(e) => {
                                  setFamilyStudentData({
                                    ...familyStudentData,
                                    studentId: e.target.value,
                                    confirmDelete: false,
                                  });
                                }}
                              >
                                {familyStudentData.curriculumId ? (
                                  <SelectOptions
                                    returnId
                                    dataType="enrolledStudents"
                                    schoolId={familyStudentData.schoolId}
                                    schoolClassId={
                                      familyStudentData.schoolClassId
                                    }
                                    curriculumId={
                                      familyStudentData.curriculumId
                                    }
                                    handleData={handleFamilyStudentSelectedData}
                                  />
                                ) : (
                                  <option
                                    disabled
                                    value={" -- select an option -- "}
                                  >
                                    {" "}
                                    -- Selecione Colégio, Turma e Modalidade
                                    para ver os alunos disponíveis --{" "}
                                  </option>
                                )}
                              </select>
                            </div>
                          </div>
                        ) : null}

                        {/** PAYMENT DETAILS SECTION TITLE */}
                        <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                          Detalhes de Pagamento:
                        </h1>

                        {/* STUDENT REGISTRATION PRICE */}
                        <div className="flex gap-2 items-center">
                          <label
                            htmlFor="enrolmentFee"
                            className="w-1/4 text-right"
                          >
                            Matrícula:
                          </label>
                          <input
                            type="text"
                            name="enrolmentFee"
                            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                            readOnly
                            value={newClass.enrolmentFee.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          />
                        </div>

                        {/* STUDENT MONTHLY PRICE */}
                        <div className="flex gap-2 items-center">
                          <label
                            htmlFor="monthlyPayment"
                            className="w-1/4 text-right"
                          >
                            Mensalidade:
                          </label>
                          <input
                            type="text"
                            name="monthlyPayment"
                            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                            readOnly
                            value={newClass.appliedPrice.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          />
                        </div>

                        {/* STUDENT MONTHLY PRICE */}
                        <div className="flex gap-2 items-center">
                          <label
                            htmlFor="dayPayment"
                            className="w-1/4 text-right"
                          >
                            Melhor dia para pagamento:
                          </label>
                          <div className="flex w-3/4 px-2 py-1 gap-10 justify-start items-center">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                value="5"
                                name="gender"
                                onChange={(e) =>
                                  setStudentData({
                                    ...studentData,
                                    paymentDay: e.target.value,
                                  })
                                }
                              />{" "}
                              5
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                value="10"
                                name="gender"
                                onChange={(e) =>
                                  setStudentData({
                                    ...studentData,
                                    paymentDay: e.target.value,
                                  })
                                }
                              />{" "}
                              10
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                value="15"
                                name="gender"
                                onChange={(e) =>
                                  setStudentData({
                                    ...studentData,
                                    paymentDay: e.target.value,
                                  })
                                }
                              />{" "}
                              15
                            </label>
                          </div>
                        </div>
                      </>
                    ) : null
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <>
              {/* EMPTY CURRICULUM SECTION TITLE */}
              <h1 className="font-bold text-2xl my-4">
                {schoolSelectedData?.name} - {schoolClassSelectedData?.name} -{" "}
                {curriculumData.schoolCourseId === "all"
                  ? "Todas as Modalidades"
                  : schoolCourseSelectedData?.name}
                :
              </h1>

              {/* SEPARATOR */}
              <hr className="pb-4" />

              {/* EMPTY CURRICULUM SECTION DESCRIPTION */}
              <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
                Nenhuma vaga disponível com as opções selecionadas, tente
                novamente.
              </h1>
            </>
          )
        ) : (
          <p className="text-red-600 dark:text-yellow-500">
            Selecione um colégio e uma turma para ver as modalidades
            disponíveis.
          </p>
        )}

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={studentData.confirmInsert}
            onChange={() => {
              setStudentData({
                ...studentData,
                confirmInsert: !studentData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            {studentData.name
              ? `Confirmar criação de ${studentData.name}`
              : `Confirmar criação`}
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
            {!isSubmitting ? "Criar" : "Criando"}
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
      </form>
    </div>
  );
}
