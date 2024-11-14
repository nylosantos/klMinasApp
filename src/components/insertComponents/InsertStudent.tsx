/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import cep from "cep-promise";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import {
  classDayIndex,
  customerFullName,
  employeeDiscountValue,
  enrolmentFee,
  enrolmentFeeDiscount,
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
  CurriculumWithNamesProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  SearchCurriculumValidationZProps,
  ToggleClassDaysFunctionProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import BirthDaySelect from "../formComponents/BirthDaySelect";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertStudent() {
  // GET GLOBAL DATA
  const {
    classDaysDatabaseData,
    curriculumDatabaseData,
    isExperimentalClass,
    login,
    page,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    studentsDatabaseData,
    userFullData,
    handleAllCurriculumDetails,
    handleCurriculumDetailsWithSchoolCourse,
    handleOneCurriculumDetails,
    setIsExperimentalClass,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // STUDENT DATA
  const [studentData, setStudentData] = useState<CreateStudentValidationZProps>(
    {
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
      familyAtSchoolId: "",
      curriculum: "",
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      confirmInsert: false,
    }
  );

  // CURRICULUM PLACES AVAILABLE STATE
  const [placesAvailable, setPlacesAvailable] = useState(true);

  // CHANGE PLACES AVAILABLE
  useEffect(() => {
    if (studentData.curriculum) {
      setPlacesAvailable(
        handleOneCurriculumDetails(studentData.curriculum).placesAvailable -
          handleOneCurriculumDetails(studentData.curriculum).students.length >
          0
      );
    }
  }, [studentData.curriculum]);

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
  // FAMILY SCHOOL SELECTED STATE DATA
  const [, setFamilySchoolSelectedData] = useState<SchoolSearchProps>();

  // SET FAMILY SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (familyStudentData.schoolId !== "") {
      setFamilySchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === familyStudentData.schoolId)
      );
    } else {
      setFamilySchoolSelectedData(undefined);
    }
  }, [familyStudentData.schoolId]);
  // -------------------------- END OF FAMILY SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY SCHOOL CLASS SELECTED STATE DATA
  const [, setFamilySchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET FAMILY SCHOOL CLASS SELECTED STATE WHEN SELECT FAMILY SCHOOL CLASS
  useEffect(() => {
    if (familyStudentData.schoolClassId !== "") {
      setFamilySchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === familyStudentData.schoolClassId
        )
      );
    } else {
      setFamilySchoolClassSelectedData(undefined);
    }
  }, [familyStudentData.schoolClassId]);
  // -------------------------- END OF FAMILY SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

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
      schoolClassId: "",
      schoolCourseId: "",
    });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (curriculumData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === curriculumData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [curriculumData.schoolId]);

  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === curriculumData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [curriculumData.schoolClassId]);

  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDatabaseData.find(
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
    enrolledDays: [] as number[],
    enrolmentFee:
      new Date().getMonth() < 6
        ? enrolmentFee
        : new Date().getMonth() < 10
        ? enrolmentFeeDiscount
        : 0,
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
            ? enrolmentFee
            : new Date().getMonth() < 10
            ? enrolmentFeeDiscount
            : 0,
      });
    }
  }, [studentData.enrolmentExemption]);

  // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
  useEffect(() => {
    if (!studentData.customDiscount) {
      setStudentData({ ...studentData, customDiscountValue: "0" });
    }
  }, [studentData.customDiscount]);

  // SET MONTHLY PAYMENT WHEN SCHOOL COURSE PRICE, OR ADD FAMILY, OR EMPLOYEE DISCOUNT CHANGE
  useEffect(() => {
    // DISCOUNT VARIABLE
    const customDiscountValueSum =
      100 -
      (studentData.customDiscount ? +studentData.customDiscountValue! : 0);
    const customDiscountFinalValue =
      !studentData.customDiscount ||
      studentData.customDiscountValue === "0" ||
      studentData.customDiscountValue === ""
        ? 1
        : +`0.${
            customDiscountValueSum > 9
              ? customDiscountValueSum
              : `0${customDiscountValueSum}`
          }`;

    const discountVariable = studentData.customDiscount
      ? customDiscountFinalValue
      : studentData.employeeDiscount
      ? employeeDiscountValue
      : studentData.familyDiscount
      ? familyDiscountValue
      : 1; // WITHOUT DISCOUNT

    const priceUnit = schoolCourseSelectedPrice.priceUnit;
    const priceBundle = schoolCourseSelectedPrice.priceBundle;
    const bundleDays = schoolCourseSelectedPrice.bundleDays;

    // ----------- CALC ALSO PRESENT IN EDIT STUDENT ----------- //
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
        appliedPrice: priceUnit * discountVariable,
        fullPrice: priceUnit,
      });
    }
    if (newClass.enrolledDays.length > 1) {
      const result = Math.floor(newClass.enrolledDays.length / bundleDays);
      const rest = newClass.enrolledDays.length % bundleDays;
      setNewClass({
        ...newClass,
        appliedPrice:
          (result * priceBundle +
            rest * (priceUnit * secondCourseDiscountValue)) *
          discountVariable,
        fullPrice: result * priceBundle + rest * priceUnit,
      });
    }
    // ----------- CALC ALSO PRESENT IN EDIT STUDENT ----------- //
  }, [
    newClass.enrolledDays,
    studentData.familyDiscount,
    studentData.employeeDiscount,
    studentData.customDiscount,
    studentData.customDiscountValue,
  ]);

  const [experimentalClassError, setExperimentalClassError] = useState(false);

  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumDatabaseData !== undefined) {
      setCurriculumSelectedData(
        curriculumDatabaseData.find(({ id }) => id === studentData.curriculum)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [studentData.curriculum]);

  // CLASSDAYS SELECTED STATE DATA
  const [classDaySelectedData, setClassDaySelectedData] =
    useState<ClassDaySearchProps>();

  // SET CLASS DAY SELECTED STATE WHEN HAVE CURRICULUM SELECTED DATA
  useEffect(() => {
    if (classDaysDatabaseData !== undefined && curriculumSelectedData) {
      setClassDaySelectedData(
        classDaysDatabaseData.find(
          ({ id }) => id === curriculumSelectedData.classDayId
        )
      );
    } else {
      setClassDaySelectedData(undefined);
    }
  }, [curriculumSelectedData]);

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
    CurriculumWithNamesProps[]
  >([]);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = async () => {
    if (userFullData) {
      if (curriculumData.schoolCourseId === "all") {
        setCurriculumCoursesData(
          handleAllCurriculumDetails({
            schoolId: curriculumData.schoolId,
            schoolClassId: curriculumData.schoolClassId,
          })
        );
      } else {
        setCurriculumCoursesData(
          handleCurriculumDetailsWithSchoolCourse({
            schoolId: curriculumData.schoolId,
            schoolClassId: curriculumData.schoolClassId,
            schoolCourseId: curriculumData.schoolCourseId,
          })
        );
        // const filterCurriculum = curriculumDatabaseData.filter(
        //   (curriculum) =>
        //     curriculum.schoolId === curriculumData.schoolId &&
        //     curriculum.schoolClassId === curriculumData.schoolClassId &&
        //     curriculum.schoolCourseId === curriculumData.schoolCourseId
        // );
        // setCurriculumCoursesData(filterCurriculum);
      }
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleAvailableCoursesData();

    const itemsSelect = (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).options;

    const itemsSelectArray = [];

    for (let index = 0; index < itemsSelect.length; index++) {
      itemsSelectArray.push(itemsSelect[index]);
    }

    itemsSelectArray.map((item, index) => {
      if (item.value === curriculumData.schoolCourseId) {
        (
          document.getElementById("schoolCourseSelect") as HTMLSelectElement
        ).selectedIndex = index;
      }
    });
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
      schoolCourseId: "",
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
      enrolmentFee:
        new Date().getMonth() < 6
          ? enrolmentFee
          : new Date().getMonth() < 10
          ? enrolmentFeeDiscount
          : 0,
      fullPrice: 0,
      appliedPrice: 0,
      enrolledDays: [],
    });
  }, [curriculumData.schoolId]);

  // GET FINANCIAL RESPONSIBLE INFO WHEN FILL DOCUMENT
  useEffect(() => {
    if (studentData.financialResponsible.document.length === 14) {
      const foundedResponsibleData = studentsDatabaseData.find(
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
              prefix: foundedResponsibleData.financialResponsible.phone.slice(
                5,
                10
              ),
              suffix:
                foundedResponsibleData.financialResponsible.phone.slice(-4),
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
              prefix:
                foundedResponsibleData.financialResponsible.phoneSecondary !==
                ""
                  ? foundedResponsibleData.financialResponsible.phoneSecondary.slice(
                      5,
                      10
                    )
                  : "",
              suffix:
                foundedResponsibleData.financialResponsible.phoneSecondary !==
                ""
                  ? foundedResponsibleData.financialResponsible.phoneSecondary.slice(
                      -4
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
              prefix:
                foundedResponsibleData.financialResponsible.phoneTertiary !== ""
                  ? foundedResponsibleData.financialResponsible.phoneTertiary.slice(
                      5,
                      10
                    )
                  : "",
              suffix:
                foundedResponsibleData.financialResponsible.phoneTertiary !== ""
                  ? foundedResponsibleData.financialResponsible.phoneTertiary.slice(
                      -4
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
    }
  }, [studentData.financialResponsible.document]);

  // VALIDATE EMAIL FUNCTION TO FILL INFO
  function validateEmail(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // GET PARENT ONE INFO WHEN FILL EMAIL
  useEffect(() => {
    if (
      studentData.parentTwo.email !== "" &&
      validateEmail(studentData.parentTwo.email)
    ) {
      const foundedParentData = studentsDatabaseData.find(
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
                prefix: foundedParentData.parentOne.phone.slice(5, 10),
                suffix: foundedParentData.parentOne.phone.slice(-4),
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
                prefix: foundedParentData.parentTwo.phone.slice(5, 10),
                suffix: foundedParentData.parentTwo.phone.slice(-4),
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
              prefix: "",
              suffix: "",
            },
          },
        });
      }
    }
  }, [studentData.parentTwo.email]);

  // GET PARENT TWO INFO WHEN FILL EMAIL
  useEffect(() => {
    if (
      studentData.parentOne.email !== "" &&
      validateEmail(studentData.parentOne.email)
    ) {
      const foundedParentData = studentsDatabaseData.find(
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
                prefix: foundedParentData.parentOne.phone.slice(5, 10),
                suffix: foundedParentData.parentOne.phone.slice(-4),
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
                prefix: foundedParentData.parentTwo.phone.slice(5, 10),
                suffix: foundedParentData.parentTwo.phone.slice(-4),
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
              prefix: "",
              suffix: "",
            },
          },
        });
      }
    }
  }, [studentData.parentOne.email]);

  // RESET ALL UNDER SCHOOL CLASS SELECT WHEN CHANGE SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolCourseId: "",
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
      enrolmentFee:
        new Date().getMonth() < 6
          ? enrolmentFee
          : new Date().getMonth() < 10
          ? enrolmentFeeDiscount
          : 0,
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
      enrolmentFee:
        new Date().getMonth() < 6
          ? enrolmentFee
          : new Date().getMonth() < 10
          ? enrolmentFeeDiscount
          : 0,
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
        enrolledDays: [],
      });
    }
    if (
      studentData.curriculum !== "" &&
      placesAvailable &&
      handleOneCurriculumDetails(studentData.curriculum).waitingList.length ===
        0
    ) {
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
  // const [testCPF, setTestCPF] = useState(true);

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
            financialResponsible: {
              ...studentData.financialResponsible,
              address: {
                ...studentData.financialResponsible.address,
                cep: data,
                street: response.street,
                neighborhood: response.neighborhood,
                city: response.city,
                state: response.state,
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
      familyAtSchoolId: "",
      curriculum: "",
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      confirmInsert: false,
    },
  });

  const [renewBirthDayValue, setRenewBirthDayValue] = useState(false);

  // RESET FORM FUNCTION
  const resetForm = () => {
    setRenewBirthDayValue(!renewBirthDayValue);
    setStudentData({
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
      familyAtSchoolId: "",
      curriculum: "",
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
      confirmInsert: false,
    });
    setCurriculumData({
      schoolId: "",
      schoolClassId: "",
      schoolCourseId: "",
    });
    setNewClass({
      isExperimental: true,
      date: "",
      enrolmentFee:
        new Date().getMonth() < 6
          ? enrolmentFee
          : new Date().getMonth() < 10
          ? enrolmentFeeDiscount
          : 0,
      fullPrice: 0,
      appliedPrice: 0,
      enrolledDays: [],
    });
    setActivePhoneSecondary(false);
    setActivePhoneTertiary(false);
    setExperimentalClassError(false);
    setEditAddress(false);
    (
      document.getElementById("schoolYearsSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById(
        "schoolYearsSelectComplement"
      ) as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("parentOnePhoneDDD") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("parentTwoPhoneDDD") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById(
        "financialResponsiblePhoneDDD"
      ) as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById(
        "financialResponsiblePhoneSecondaryDDD"
      ) as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById(
        "financialResponsiblePhoneTertiaryDDD"
      ) as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    userFullData &&
      userFullData.role !== "user" &&
      ((
        document.getElementById("schoolClassSelect") as HTMLSelectElement
      ).selectedIndex = 0);
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    // Section 1: Student Data
    setValue("name", studentData.name);
    setValue("birthDate", studentData.birthDate);
    setValue("schoolYears", studentData.schoolYears);
    setValue("schoolYearsComplement", studentData.schoolYearsComplement);
    setValue("parentOne.name", studentData.parentOne.name);
    setValue("parentOne.phone.ddd", studentData.parentOne.phone.ddd);
    setValue("parentOne.phone.prefix", studentData.parentOne.phone.prefix);
    setValue("parentOne.phone.suffix", studentData.parentOne.phone.suffix);
    setValue("parentOne.email", studentData.parentOne.email);
    setValue("parentTwo.name", studentData.parentTwo.name);
    setValue("parentTwo.phone.ddd", studentData.parentTwo.phone.ddd);
    setValue("parentTwo.phone.prefix", studentData.parentTwo.phone.prefix);
    setValue("parentTwo.phone.suffix", studentData.parentTwo.phone.suffix);
    setValue("parentTwo.email", studentData.parentTwo.email);

    // Section 2: Student Course and Family Data | Prices
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
      "financialResponsible.phone.prefix",
      studentData.financialResponsible.phone.prefix
    );
    setValue(
      "financialResponsible.phone.suffix",
      studentData.financialResponsible.phone.suffix
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
      "financialResponsible.phoneSecondary.prefix",
      studentData.financialResponsible.phoneSecondary.prefix
    );
    setValue(
      "financialResponsible.phoneSecondary.suffix",
      studentData.financialResponsible.phoneSecondary.suffix
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
      "financialResponsible.phoneTertiary.prefix",
      studentData.financialResponsible.phoneTertiary.prefix
    );
    setValue(
      "financialResponsible.phoneTertiary.suffix",
      studentData.financialResponsible.phoneTertiary.suffix
    );

    // Section 4: Student Contract Data
    // Accept Contract: boolean
    // Contract attached (pdf)

    // Section 5: Confirm Insert
    setValue("confirmInsert", studentData.confirmInsert);
  }, [studentData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      // Section 1: Student Data
      errors.name,
      errors.birthDate,
      errors.schoolYears,
      errors.schoolYearsComplement,

      // Section 2: Student Course and Family Data | Prices
      errors.familyAtSchoolId,
      errors.curriculum,
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

      // Section 4: Student Contract Data
      // Accept Contract: boolean
      // Contract attached (pdf)

      // Section 5: Confirm Insert
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

    //CHECK AND GETTING EXISTENT FAMILY
    const newStudentId = uuidv4();
    const familyArray: string[] = [];
    if (data.familyDiscount && data.familyAtSchoolId) {
      familyArray.push(newStudentId);
      familyArray.push(data.familyAtSchoolId);
      const foundedStudentFamilyDetails = studentsDatabaseData.find(
        (student) => student.id === data.familyAtSchoolId
      );
      if (foundedStudentFamilyDetails) {
        foundedStudentFamilyDetails.studentFamilyAtSchool.map(
          (otherStudentFamily) => familyArray.push(otherStudentFamily)
        );
      }
    }

    // ADD STUDENT FUNCTION
    const addStudent = async () => {
      const newStudentRef = doc(db, "students", newStudentId);
      try {
        // CREATE STUDENT
        await setDoc(newStudentRef, {
          // Section 1: Student Data
          id: newStudentId,
          name: data.name,
          birthDate: Timestamp.fromDate(new Date(data.birthDate)),
          schoolYears: data.schoolYears,
          schoolYearsComplement: data.schoolYearsComplement,
          parentOne: {
            name: data.parentOne.name,
            email: data.parentOne.email,
            phone: `+55${data.parentOne.phone.ddd}${data.parentOne.phone.prefix}${data.parentOne.phone.suffix}`,
          },
          parentTwo: {
            name: data.parentTwo.name,
            email: data.parentTwo.email,
            phone: `+55${data.parentTwo.phone.ddd}${data.parentTwo.phone.prefix}${data.parentTwo.phone.suffix}`,
          },

          // Section 2: Student Course and Family Data | Prices
          enrolmentExemption: data.enrolmentExemption,
          enrolmentFee: newClass.enrolmentFee,
          enrolmentFeePaid: false,
          fullPrice: newClass.fullPrice,
          appliedPrice: newClass.appliedPrice,
          customDiscount: data.customDiscount,
          customDiscountValue: data.customDiscountValue,
          employeeDiscount: data.employeeDiscount,
          familyDiscount: data.familyDiscount,
          secondCourseDiscount: data.secondCourseDiscount,
          paymentDay:
            data.paymentDay === "" ? standardPaymentDay : data.paymentDay,
          experimentalCurriculumIds:
            placesAvailable && newClass.isExperimental
              ? arrayUnion({
                  id: data.curriculum,
                  date: Timestamp.fromDate(new Date(newClass.date)),
                  isExperimental: true,
                  indexDays: [],
                  price: newClass.fullPrice,
                })
              : arrayUnion(),
          curriculumIds:
            placesAvailable && !newClass.isExperimental
              ? arrayUnion({
                  id: data.curriculum,
                  date: Timestamp.fromDate(new Date(newClass.date)),
                  isExperimental: false,
                  indexDays: newClass.enrolledDays,
                  price: newClass.fullPrice,
                })
              : arrayUnion(),
          studentFamilyAtSchool: data.familyDiscount
            ? familyArray.filter((student) => student !== newStudentId)
            : arrayUnion(),
          paymentRegister: paymentArray,

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
            phone: `+55${data.financialResponsible.phone.ddd}${data.financialResponsible.phone.prefix}${data.financialResponsible.phone.suffix}`,
            phoneSecondary: activePhoneSecondary
              ? `+55${data.financialResponsible.phoneSecondary.ddd}${data.financialResponsible.phoneSecondary.prefix}${data.financialResponsible.phoneSecondary.suffix}`
              : "",
            phoneTertiary: activePhoneTertiary
              ? `+55${data.financialResponsible.phoneTertiary.ddd}${data.financialResponsible.phoneTertiary.prefix}${data.financialResponsible.phoneTertiary.suffix}`
              : "",
          },

          // Section 4: Student Contract Data
          // Accept Contract: boolean
          // Contract attached (pdf)

          // Section 5: Last Updated Time
          updatedAt: serverTimestamp(),
        });
        if (placesAvailable) {
          if (newClass.isExperimental) {
            // CREATING AN EXPERIMENTAL CURRICULUM
            // ADD STUDENT TO CURRICULUM TABLE ON EXPERIMENTAL STUDENTS COLLECTION
            await setDoc(
              doc(db, "curriculum", data.curriculum),
              {
                experimentalStudents: arrayUnion({
                  id: newStudentId,
                  date: Timestamp.fromDate(new Date(newClass.date)),
                  isExperimental: true,
                  indexDays: [],
                  price: newClass.fullPrice,
                }),
              },
              { merge: true }
            );
          } else {
            // CREATING AN ENROLLED CURRICULUM
            // ADD STUDENT TO CURRICULUM TABLE ON STUDENT COLLECTION
            await setDoc(
              doc(db, "curriculum", data.curriculum),
              {
                students: arrayUnion({
                  id: newStudentId,
                  date: Timestamp.fromDate(new Date(newClass.date)),
                  isExperimental: false,
                  indexDays: newClass.enrolledDays,
                  price: newClass.fullPrice,
                }),
              },
              { merge: true }
            );
          }
          if (data.familyDiscount) {
            // IF YOU WANT TO CREATE STUDENT INSIDE FAMILY TABLE COLLECTION, UNCOMMENT THIS SECTION
            familyArray.map(async (familyStudent) => {
              await setDoc(
                doc(db, "students", familyStudent),
                {
                  studentFamilyAtSchool: familyArray.filter(
                    (student) => student !== familyStudent
                  ),
                },
                { merge: true }
              );
            });
          }
        } else {
          // ADD STUDENT TO WAITING LIST ARRAY OF CURRICULUM TABLE
          await setDoc(
            doc(db, "curriculum", data.curriculum),
            {
              waitingList: arrayUnion({
                id: newStudentId,
                date: Timestamp.now(),
              }),
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

    if (placesAvailable) {
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
      if (familyStudentData.studentId === "") {
        setIsSubmitting(false);
        return toast.error(
          `Por favor, verifique os dados do irmão que já estuda na escola... ☑️`,
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
        `Por favor, verifique as opções de Colégio e Ano Escolar... ☑️`,
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
    const studentExists = studentsDatabaseData.find(
      (student) =>
        student.name === data.name &&
        student.parentOne.name === data.parentOne.name
    );

    if (studentExists) {
      // IF EXISTS, RETURN ERROR
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
  };

  return (
    <div
      className={`flex h-full flex-col container text-center overflow-scroll no-scrollbar ${
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
      <form
        onSubmit={handleSubmit(handleAddStudent)}
        className={`flex flex-col w-full gap-2 rounded-xl ${
          page.show !== "Dashboard" &&
          userFullData &&
          userFullData.role !== "user"
            ? "bg-klGreen-500/20 dark:bg-klGreen-500/30 p-4"
            : "pb-4 px-4 pt-2"
        }`}
      >
        {/* // -------------------------------------------------------- SECTION 1: STUDENT DATA -------------------------------------------------------- // */}

        {/** PERSONAL DATA SECTION TITLE */}
        <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
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
            Nome do aluno:{" "}
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
            <BirthDaySelect
              setStudentData={setStudentData}
              errors={errors}
              renewBirthDayValue={renewBirthDayValue}
              isDisabled={false}
              birthDateValue=""
            />
          </div>
        </div>

        {/* SCHOOL YEARS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolYearsSelect"
            className={
              errors.schoolYears
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Ano escolar:{" "}
          </label>
          <select
            id="schoolYearsSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolYears
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolYearsSelect"
            onChange={(e) => {
              setStudentData({ ...studentData, schoolYears: e.target.value });
            }}
          >
            <SelectOptions returnId dataType="schoolYears" />
          </select>
        </div>

        {/* SCHOOL YEARS COMPLEMENT SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolYearsSelectComplement"
            className={
              errors.schoolYearsComplement
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Turma:{" "}
          </label>
          <select
            id="schoolYearsSelectComplement"
            defaultValue={" -- select an option -- "}
            className={
              errors.schoolYearsComplement
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolYearsSelectComplement"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                schoolYearsComplement: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schoolYearsComplement" />
          </select>
        </div>

        {/** PARENT ONE SECTION TITLE */}
        <h3 className="text-lg py-2 text-klGreen-600 dark:text-gray-100">
          Filiação 1:
        </h3>

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
            disabled={isSubmitting}
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
            value={studentData.parentOne?.email}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                parentOne: { ...studentData.parentOne, email: e.target.value },
              });
            }}
          />
        </div>

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
            disabled={isSubmitting}
            placeholder={
              errors.parentOne?.name
                ? "É necessário inserir o nome completo"
                : "Insira o nome completo"
            }
            className={
              errors.parentOne?.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.parentOne?.name}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                parentOne: { ...studentData.parentOne, name: e.target.value },
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
                value={
                  studentData.parentOne.phone.ddd !== ""
                    ? studentData.parentOne.phone.ddd
                    : "DDD"
                }
                className={
                  errors.parentOne?.phone?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    parentOne: {
                      ...studentData.parentOne,
                      phone: {
                        ...studentData.parentOne.phone,
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
                value={studentData.parentOne?.phone.prefix}
                placeholder={
                  errors.parentOne?.phone?.prefix ? "É necessário um" : "99999"
                }
                className={
                  errors.parentOne?.phone?.prefix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    parentOne: {
                      ...studentData.parentOne,
                      phone: {
                        ...studentData.parentOne.phone,
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
                value={studentData.parentOne?.phone.suffix}
                placeholder={
                  errors.parentOne?.phone?.suffix ? "telefone válido" : "9990"
                }
                className={
                  errors.parentOne?.phone?.suffix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    parentOne: {
                      ...studentData.parentOne,
                      phone: {
                        ...studentData.parentOne.phone,
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
            disabled={isSubmitting}
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
            value={studentData.parentTwo?.email}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                parentTwo: { ...studentData.parentTwo, email: e.target.value },
              });
            }}
          />
        </div>

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
            disabled={isSubmitting}
            placeholder={
              errors.parentTwo?.name
                ? "É necessário inserir o nome completo"
                : "Insira o nome completo"
            }
            className={
              errors.parentTwo?.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.parentTwo?.name}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                parentTwo: { ...studentData.parentTwo, name: e.target.value },
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
                value={
                  studentData.parentTwo.phone.ddd !== ""
                    ? studentData.parentTwo.phone.ddd
                    : "DDD"
                }
                className={
                  errors.parentTwo?.phone?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    parentTwo: {
                      ...studentData.parentTwo,
                      phone: {
                        ...studentData.parentTwo.phone,
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
                maxLength={5}
                value={studentData.parentTwo?.phone.prefix}
                placeholder={
                  errors.parentTwo?.phone?.prefix ? "É necessário um" : "99999"
                }
                className={
                  errors.parentTwo?.phone?.prefix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    parentTwo: {
                      ...studentData.parentTwo,
                      phone: {
                        ...studentData.parentTwo.phone,
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
                maxLength={4}
                value={studentData.parentTwo?.phone.suffix}
                placeholder={
                  errors.parentTwo?.phone?.suffix ? "telefone válido" : "9990"
                }
                className={
                  errors.parentTwo?.phone?.suffix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    parentTwo: {
                      ...studentData.parentTwo,
                      phone: {
                        ...studentData.parentTwo.phone,
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

        {/* // ------------------------------------------- SECTION 2: STUDENT COURSE AND FAMILY DATA | PRICES ------------------------------------------- // */}

        {/** CURRICULUM SECTION TITLE */}
        <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
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
            <SelectOptions returnId dataType="schools" />
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
            Selecione o Ano Escolar:{" "}
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
            disabled={
              userFullData && userFullData.role !== "user"
                ? curriculumData.schoolClassId
                  ? false
                  : true
                : curriculumData.schoolId
                ? false
                : true
            }
            defaultValue={" -- select an option -- "}
            className={
              userFullData && userFullData.role !== "user"
                ? curriculumData.schoolClassId
                  ? errors.curriculum
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                : curriculumData.schoolId
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
              schoolId={curriculumData.schoolId}
              schoolClassId={curriculumData.schoolClassId}
              dataType="schoolCourses"
            />
            {/* <option value={"all"}>Todas as Modalidades</option> */}
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.schoolId &&
        // curriculumData.schoolClassId &&
        curriculumData.schoolCourseId ? (
          curriculumCoursesData.length !== 0 ? (
            <>
              {/* CURRICULUM SELECT SECTION TITLE */}
              <h1 className="font-bold text-2xl my-4">
                {schoolSelectedData?.name} - {schoolClassSelectedData?.name} -{" "}
                {schoolCourseSelectedData?.name}
                {/* {curriculumData.schoolCourseId === "all"
                  ? "Todas as Modalidades"
                  : schoolCourseSelectedData?.name} */}
              </h1>

              {/** SEPARATOR */}
              {/* <hr className="pb-4" /> */}

              {/* CURRICULUM SELECT CARD */}
              <div className="flex flex-wrap gap-4 justify-center">
                {curriculumCoursesData
                  .sort((a, b) =>
                    a.schoolClassName.localeCompare(b.schoolClassName)
                  )
                  .map((c) => (
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
                        checked={studentData.curriculum === c.id ? true : false}
                        id={c.id}
                        name="curriculumRadio"
                        className="text-klGreen-500 dark:text-klGreen-500 border-none"
                        value={c.id}
                        onChange={(e) => {
                          setCurriculumData({
                            ...curriculumData,
                            schoolCourseId: c.schoolCourseId,
                          });

                          setStudentData({
                            ...studentData,
                            curriculum: e.target.value,
                          });
                        }}
                      />
                      <label
                        htmlFor="curriculumRadio"
                        className="flex flex-col gap-4"
                      >
                        <p>
                          Escola:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.schoolName}
                          </span>
                        </p>

                        <p>
                          Ano Escolar:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.schoolClassName}
                          </span>
                        </p>

                        <p>
                          Modalidade:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.schoolCourseName}
                          </span>
                        </p>
                        <p>
                          Dias:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.classDayName}
                          </span>
                        </p>
                        {schedulesDetailsData.map(
                          (details: ScheduleSearchProps) =>
                            details.id === c.scheduleId ? (
                              <p>
                                Horário:{" "}
                                <span className="text-red-600 dark:text-yellow-500">
                                  De {details.classStart.slice(0, 2)}h
                                  {details.classStart.slice(3, 5) === "00"
                                    ? ""
                                    : details.classStart.slice(3, 5) +
                                      "min"}{" "}
                                  a {details.classEnd.slice(0, 2)}h
                                  {details.classEnd.slice(3, 5) === "00"
                                    ? ""
                                    : details.classEnd.slice(3, 5) + "min"}{" "}
                                  ({details.name})
                                </span>
                              </p>
                            ) : null
                        )}
                        <p>
                          Professor:{" "}
                          <span className="text-red-600 dark:text-yellow-500">
                            {c.teacherName}
                          </span>
                        </p>
                        {userFullData && userFullData.role !== "user" && (
                          <p>
                            Vagas Disponíveis:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {handleOneCurriculumDetails(c.id)
                                .placesAvailable -
                                handleOneCurriculumDetails(c.id).students
                                  .length}
                            </span>
                          </p>
                        )}
                        {handleOneCurriculumDetails(c.id).waitingList.length >
                          0 && (
                          <p>
                            Alunos na lista de espera:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(c.id).waitingList
                                  .length
                              }
                            </span>
                          </p>
                        )}
                      </label>
                    </div>
                  ))}
              </div>

              {studentData.curriculum && (
                <>
                  {placesAvailable &&
                  handleOneCurriculumDetails(studentData.curriculum).waitingList
                    .length === 0 ? (
                    <>
                      {/* IS EXPERIMENTAL CLASS ? */}
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
                          disabled={
                            curriculumData.schoolCourseId ? false : true
                          }
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

                      {/* EXPERIMENTAL/INITIAL DAY */}
                      {classDaySelectedData &&
                        newClass &&
                        classDaySelectedData?.indexDays.length > 0 && (
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
                                minDate={new DateObject()}
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
                                  e !== null &&
                                    setNewClass({
                                      ...newClass,
                                      date: `${e.month}/${e.day}/${e.year}`,
                                    });
                                }}
                              />
                            </div>
                          </div>
                        )}

                      {classDaySelectedData &&
                        !newClass.isExperimental &&
                        classDaySelectedData.indexNames.length > 0 && (
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
                                              value:
                                                //@ts-ignore
                                                !classDaysData[classDayName],
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
                            <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
                              Aplicar Descontos:
                            </h1>

                            {/** DISCOUNTS SECTION SUBTITLE */}
                            <div className="flex gap-2 items-center py-2">
                              <div className="w-1/4" />
                              <div className="flex gap-2 w-3/4 items-start text-left py-2">
                                <p className="text-sm text-red-600 dark:text-yellow-500">
                                  Desconto Familiar: Informando um irmão que já
                                  é matriculado na {customerFullName}, você
                                  obterá 10% de desconto no curso com
                                  mensalidade de menor valor. <br /> Desconto de
                                  Segundo Curso: Ao se matricular em um segundo
                                  curso na {customerFullName}, você obterá 10%
                                  de desconto no curso com mensalidade de menor
                                  valor. <br /> ATENÇÃO: Os descontos não são
                                  cumulativos.
                                </p>
                              </div>
                            </div>

                            {userFullData && userFullData.role !== "user" && (
                              <>
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
                                          customDiscount:
                                            !studentData.customDiscount,
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
                              </>
                            )}

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
                                Algum irmão estuda na escola?:{" "}
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
                            {studentData.familyDiscount && (
                              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                                {/* FAMILY AT SCHOOL TITLE */}
                                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                                  Atenção: a seguir selecione o aluno que já é
                                  matriculado na {customerFullName}, e é irmão
                                  de {studentData.name}:
                                </h1>

                                {/** FAMILY AT SCHOOL SUBTITLE */}
                                <div className="flex gap-2 items-center py-2">
                                  <div className="w-1/4" />
                                  <div className="flex gap-2 w-3/4 items-start text-left py-2">
                                    <p className="text-sm text-red-600 dark:text-yellow-500">
                                      Não encontrou o irmão? Verifique os dados
                                      de Filiação e/ou Responsável financeiro.
                                      <br />
                                      Apenas alunos com a mesma filiação e/ou
                                      Responsáveis Financeiros podem ser
                                      selecionados como "parentes".
                                    </p>
                                  </div>
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
                                    Selecione o irmão:{" "}
                                  </label>
                                  <select
                                    id="familyStudentSelect"
                                    defaultValue={" -- select an option -- "}
                                    className={
                                      errors.familyAtSchoolId
                                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
                                    <SelectOptions
                                      returnId
                                      dataType="searchEnrolledStudent"
                                      parentOneEmail={
                                        studentData.parentOne.email
                                      }
                                      parentTwoEmail={
                                        studentData.parentTwo.email
                                      }
                                      financialResponsibleDocument={
                                        studentData.financialResponsible
                                          .document
                                      }
                                    />
                                  </select>
                                </div>
                              </div>
                            )}

                            {/** PAYMENT DETAILS SECTION TITLE */}
                            <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
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
                                disabled
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
                                disabled
                                value={newClass.appliedPrice.toLocaleString(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                )}
                              />
                            </div>

                            {/* STUDENT PAYMENT DAY */}
                            <div className="flex gap-2 items-center">
                              {userFullData && userFullData.role !== "user" ? (
                                <>
                                  <label
                                    htmlFor="dayPayment"
                                    className="w-1/4 text-right"
                                  >
                                    Melhor dia para pagamento:
                                  </label>
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
                                </>
                              ) : (
                                <>
                                  <div className="flex w-1/4" />
                                  <div className="flex w-3/4 px-2 py-1 gap-10 justify-start items-center">
                                    <p className="text-sm text-red-600 dark:text-yellow-500">
                                      Data de vencimento dia 05 do mês a cursar,
                                      pagamento antecipado
                                    </p>
                                  </div>
                                </>
                              )}
                              {/* <label className="flex items-center gap-2">
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
                            </label> */}
                            </div>
                          </>
                        )}
                    </>
                  ) : (
                    <div className="flex flex-col w-full items-center justify-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent rounded-2xl text-center text-lg text-red-600 dark:text-yellow-500">
                      {/* CLASS WAITING LIST DISCLAIMER */}
                      <h1 className="font-bold">FILA DE ESPERA</h1>
                      <p className="flex items-center">
                        A turma selecionada está sem vaga disponível para
                        matrícula, preencha os dados abaixo para entrar na fila
                        de espera.
                        <br /> Seguimos uma ordem nesta fila por data de
                        cadastro, sendo assim, à medida que as vagas forem
                        disponibilizadas, entraremos em contato.
                      </p>
                    </div>
                  )}
                  {/* // --------------------------------------------- SECTION 3: STUDENT FINANCIAL RESPONSIBLE DATA --------------------------------------------- // */}

                  {/** STUDENT FINANCIAL RESPONSIBLE SECTION TITLE */}
                  <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
                    Dados do Responsável Financeiro:
                  </h1>

                  {/** STUDENT FINANCIAL RESPONSIBLE SECTION SUBTITLE */}
                  <div className="flex gap-2 items-center py-2">
                    <div className="w-1/4" />
                    <div className="flex flex-col gap-2 w-3/4 items-start text-left pb-2">
                      {/* EXPERIMENTAL CLASS DISCLAIMER */}
                      {newClass.isExperimental &&
                        placesAvailable &&
                        handleOneCurriculumDetails(studentData.curriculum)
                          .waitingList.length === 0 && (
                          <p className="text-sm text-red-600 dark:text-yellow-500">
                            Em caso de desistência dos serviços, o responsável
                            tem o prazo de até 5 dias para entrar no cadastro e
                            realizar o cancelamento. Os dados serão descartados
                            sem ônus de matrícula.
                          </p>
                        )}
                      <p className="text-sm font-bold text-red-600 dark:text-yellow-500">
                        ATENÇÃO: A VERACIDADE DOS DADOS É DE SUA
                        RESPONSABILIDADE AO PREENCHER O CADASTRO
                      </p>
                    </div>
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
                      pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
                      maxLength={11}
                      placeholder={
                        testFinancialCPF
                          ? errors.financialResponsible?.document
                            ? "É necessário inserir o CPF do Responsável Financeiro"
                            : "Insira o CPF do Responsável Financeiro"
                          : "CPF Inválido"
                      }
                      className={
                        testFinancialCPF
                          ? errors.financialResponsible?.document
                            ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                            : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      }
                      value={studentData.financialResponsible?.document}
                      onChange={(e) => {
                        if (e.target.value.length === 11) {
                          setTestFinancialCPF(testaCPF(e.target.value));
                        }
                        setStudentData({
                          ...studentData,
                          financialResponsible: {
                            ...studentData.financialResponsible,
                            document: formataCPF(e.target.value),
                          },
                        });
                      }}
                    />
                  </div>

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
                      value={studentData.financialResponsible.name}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          financialResponsible: {
                            ...studentData.financialResponsible,
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
                      disabled={isSubmitting}
                      placeholder={
                        errors.financialResponsible?.email
                          ? "É necessário inserir o e-mail do Responsável Financeiro"
                          : "Insira o e-mail do Responsável Financeiro"
                      }
                      className={
                        errors.financialResponsible?.email
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      }
                      value={studentData.financialResponsible?.email}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          financialResponsible: {
                            ...studentData.financialResponsible,
                            email: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>

                  {/* FINANCIAL RESPONSIBLE PHONE */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="financialResponsiblePhone"
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
                          id="financialResponsiblePhoneDDD"
                          value={
                            studentData.financialResponsible?.phone.ddd !== ""
                              ? studentData.financialResponsible?.phone.ddd
                              : "DDD"
                          }
                          className={
                            errors.financialResponsible?.phone?.ddd
                              ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          name="DDD"
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phone: {
                                  ...studentData.financialResponsible.phone,
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
                          name="financialResponsiblePhoneInitial"
                          pattern="^[+ 0-9]{5}$"
                          maxLength={5}
                          value={studentData.financialResponsible?.phone.prefix}
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
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phone: {
                                  ...studentData.financialResponsible.phone,
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
                          name="financialResponsiblePhoneFinal"
                          pattern="^[+ 0-9]{4}$"
                          maxLength={4}
                          value={studentData.financialResponsible?.phone.suffix}
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
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phone: {
                                  ...studentData.financialResponsible.phone,
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

                  {/* FINANCIAL RESPONSIBLE PHONE SECONDARY */}
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
                          id="financialResponsiblePhoneSecondaryDDD"
                          disabled={
                            !studentData.financialResponsible
                              .activePhoneSecondary
                          }
                          value={
                            studentData.financialResponsible?.phoneSecondary
                              .ddd !== ""
                              ? studentData.financialResponsible?.phoneSecondary
                                  .ddd
                              : "DDD"
                          }
                          className={
                            errors.financialResponsible?.phoneSecondary?.ddd
                              ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          name="DDD"
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phoneSecondary: {
                                  ...studentData.financialResponsible
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
                            !studentData.financialResponsible
                              .activePhoneSecondary
                          }
                          pattern="^[+ 0-9]{5}$"
                          maxLength={5}
                          value={
                            studentData.financialResponsible?.phoneSecondary
                              .prefix
                          }
                          placeholder={
                            errors.financialResponsible?.phoneSecondary?.prefix
                              ? "É necessário um"
                              : "99999"
                          }
                          className={
                            studentData.financialResponsible
                              ?.activePhoneSecondary
                              ? errors.financialResponsible?.phoneSecondary
                                  ?.prefix
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phoneSecondary: {
                                  ...studentData.financialResponsible
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
                            !studentData.financialResponsible
                              ?.activePhoneSecondary
                          }
                          pattern="^[+ 0-9]{4}$"
                          maxLength={4}
                          value={
                            studentData.financialResponsible?.phoneSecondary
                              .suffix
                          }
                          placeholder={
                            errors.financialResponsible?.phoneSecondary?.prefix
                              ? "telefone válido"
                              : "9999"
                          }
                          className={
                            studentData.financialResponsible
                              ?.activePhoneSecondary
                              ? errors.financialResponsible?.phoneSecondary
                                  ?.suffix
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phoneSecondary: {
                                  ...studentData.financialResponsible
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
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                activePhoneSecondary: !activePhoneSecondary,
                                phoneSecondary: {
                                  ...studentData.financialResponsible
                                    .phoneSecondary,
                                  ddd: "DDD",
                                },
                              },
                            });
                          }}
                        />
                        <label
                          htmlFor="activePhoneSecondary"
                          className="text-sm"
                        >
                          Incluir
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* FINANCIAL RESPONSIBLE PHONE TERTIARY */}
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
                          id="financialResponsiblePhoneTertiaryDDD"
                          disabled={
                            !studentData.financialResponsible
                              ?.activePhoneTertiary
                          }
                          value={
                            studentData.financialResponsible?.phoneTertiary
                              .ddd !== ""
                              ? studentData.financialResponsible?.phoneTertiary
                                  .ddd
                              : "DDD"
                          }
                          className={
                            errors.financialResponsible?.phoneTertiary?.ddd
                              ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          name="DDD"
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phoneTertiary: {
                                  ...studentData.financialResponsible
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
                            !studentData.financialResponsible
                              ?.activePhoneTertiary
                          }
                          pattern="^[+ 0-9]{5}$"
                          maxLength={5}
                          value={
                            studentData.financialResponsible?.phoneTertiary
                              .prefix
                          }
                          placeholder={
                            errors.financialResponsible?.phoneTertiary?.prefix
                              ? "É necessário um"
                              : "99999"
                          }
                          className={
                            studentData.financialResponsible
                              ?.activePhoneTertiary
                              ? errors.financialResponsible?.phoneTertiary
                                  ?.prefix
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phoneTertiary: {
                                  ...studentData.financialResponsible
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
                            !studentData.financialResponsible
                              ?.activePhoneTertiary
                          }
                          pattern="^[+ 0-9]{4}$"
                          maxLength={4}
                          value={
                            studentData.financialResponsible?.phoneTertiary
                              .suffix
                          }
                          placeholder={
                            errors.financialResponsible?.phoneTertiary?.prefix
                              ? "telefone válido"
                              : "9999"
                          }
                          className={
                            studentData.financialResponsible
                              ?.activePhoneTertiary
                              ? errors.financialResponsible?.phoneTertiary
                                  ?.suffix
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          onChange={(e) => {
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                phoneTertiary: {
                                  ...studentData.financialResponsible
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
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                activePhoneTertiary: !activePhoneTertiary,
                                phoneTertiary: {
                                  ...studentData.financialResponsible
                                    .phoneTertiary,
                                  ddd: "DDD",
                                },
                              },
                            });
                          }}
                        />
                        <label
                          htmlFor="activePhoneTertiary"
                          className="text-sm"
                        >
                          Incluir
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* FINANCIAL RESPONSIBLE ADDRESS */}
                  {/* CEP */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="financialResponsibleAddressCep"
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
                          name="financialResponsibleAddressCep"
                          maxLength={8}
                          placeholder={
                            errors.financialResponsible?.address?.cep ||
                            cepError
                              ? "É necessário inserir um CEP"
                              : "Insira o CEP"
                          }
                          className={
                            errors.financialResponsible?.address?.cep ||
                            cepError
                              ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          value={studentData.financialResponsible.address.cep}
                          onChange={(e) => {
                            setCepError(false);
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
                                  cep: formatCEP(e.target.value),
                                },
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
                          getCep(studentData.financialResponsible.address.cep);
                        }}
                      >
                        {cepSubmitting ? "Buscando..." : "Buscar"}
                      </button>
                    </div>
                  </div>

                  {/* STREET AND NUMBER */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="financialResponsibleAddressStreet"
                      className={
                        errors.financialResponsible?.address?.street
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
                          name="financialResponsibleAddressStreet"
                          disabled={!editAddress}
                          placeholder={
                            errors.financialResponsible?.address?.street
                              ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                              : "Rua / Av. / Pça"
                          }
                          className={
                            editAddress
                              ? errors.financialResponsible?.address?.street
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          value={
                            studentData.financialResponsible?.address?.street
                          }
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
                                  street: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex w-2/12 items-center gap-2">
                        <label
                          htmlFor="financialResponsibleAddressNumber"
                          className="text-right"
                        >
                          Nº:
                        </label>
                        <input
                          type="text"
                          name="financialResponsibleAddressNumber"
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
                          value={
                            studentData.financialResponsible?.address?.number
                          }
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
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
                      htmlFor="financialResponsibleAddressNeighborhood"
                      className={
                        errors.financialResponsible?.address?.neighborhood
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
                          name="financialResponsibleAddressNeighborhood"
                          disabled={!editAddress}
                          placeholder={
                            errors.financialResponsible?.address?.neighborhood
                              ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                              : "Bairro"
                          }
                          className={
                            editAddress
                              ? errors.financialResponsible?.address
                                  ?.neighborhood
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          value={
                            studentData.financialResponsible.address
                              .neighborhood
                          }
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
                                  neighborhood: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex w-4/12 items-center gap-2">
                        <label
                          htmlFor="financialResponsibleAddressComplement"
                          className="text-right"
                        >
                          Complemento:
                        </label>
                        <input
                          type="text"
                          name="financialResponsibleAddressComplement"
                          placeholder={"Apto | Bloco"}
                          className={
                            errors.financialResponsible?.address
                              ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          value={
                            studentData.financialResponsible.address.complement
                          }
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
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
                      htmlFor="financialResponsibleAddressCity"
                      className={
                        errors.financialResponsible?.address?.city
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
                          name="financialResponsibleAddressCity"
                          disabled={!editAddress}
                          placeholder={
                            errors.financialResponsible?.address?.city
                              ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                              : "Cidade"
                          }
                          className={
                            editAddress
                              ? errors.financialResponsible?.address?.city
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          value={studentData.financialResponsible.address.city}
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
                                  city: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex w-2/12 items-center gap-2">
                        <label
                          htmlFor="financialResponsibleAddressState"
                          className="text-right"
                        >
                          Estado:
                        </label>
                        <input
                          type="text"
                          name="financialResponsibleAddressState"
                          disabled={!editAddress}
                          placeholder={
                            errors.financialResponsible?.address?.state
                              ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                              : "UF"
                          }
                          className={
                            editAddress
                              ? errors.financialResponsible?.address?.state
                                ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                                : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                          }
                          value={studentData.financialResponsible.address.state}
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              financialResponsible: {
                                ...studentData.financialResponsible,
                                address: {
                                  ...studentData.financialResponsible.address,
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
                </>
              )}
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
          <div className="flex gap-2 items-center py-2">
            <div className="w-1/4" />
            <div className="flex gap-2 w-3/4 items-start text-left py-2">
              <p className="text-red-600 dark:text-yellow-500">
                Selecione um colégio e um Ano Escolar para ver as modalidades
                disponíveis.
              </p>
            </div>
          </div>
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
    </div>
  );
}
