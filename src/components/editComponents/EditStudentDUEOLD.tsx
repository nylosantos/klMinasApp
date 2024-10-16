/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import {
  CurriculumSearchProps,
  SchoolClassSearchProps,
  SchoolSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { EditStudentForm } from "../formComponents/EditStudentForm";

// INITIALIZING FIRESTORE DB
// const db = getFirestore(app);

export function EditStudent() {
  // GET GLOBAL DATA
  const {
    curriculumDatabaseData,
    schoolDatabaseData,
    schoolClassDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // STUDENT DATA
  const [studentData, setStudentData] = useState({
    schoolId: "",
    schoolClassId: "",
    curriculumId: "",
    schoolCoursePriceUnit: 0,
    schoolCoursePriceBundle: 0,
    schoolCourseBundleDays: 0,
    studentId: "",
  });

  // STUDENT EDIT DATA
  // const [studentEditData, setStudentEditData] =
  //   useState<EditStudentValidationZProps>({
  //     // Section 1: Student Data
  //     id: "",
  //     name: "",
  //     birthDate: "",
  //     classComplement: "",
  //     parentOne: {
  //       name: "",
  //       email: "",
  //       phone: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //     },
  //     parentTwo: {
  //       name: "",
  //       email: "",
  //       phone: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //     },

  //     // Section 2: Student Course and Family Data | Prices
  //     addCurriculum: false,
  //     addExperimentalCurriculum: false,
  //     addFamily: false,
  //     enrolmentExemption: false,
  //     enrolmentFee: 0,
  //     enrolmentFeePaid: false,
  //     customDiscount: false,
  //     customDiscountValue: "",
  //     employeeDiscount: false,
  //     familyDiscount: false,
  //     secondCourseDiscount: false,
  //     fullPrice: 0,
  //     appliedPrice: 0,
  //     paymentDay: "",

  //     // Section 3: Student Financial Responsible Data
  //     financialResponsible: {
  //       name: "",
  //       document: "",
  //       email: "",
  //       address: {
  //         street: "",
  //         number: "",
  //         complement: "",
  //         neighborhood: "",
  //         city: "",
  //         state: "",
  //         cep: "",
  //       },
  //       phone: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //       activePhoneSecondary: false,
  //       phoneSecondary: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //       activePhoneTertiary: false,
  //       phoneTertiary: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //     },
  //   });

  // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
  // const [testFinancialCPF, setTestFinancialCPF] = useState(true);

  // NEW STUDENT DATA STATE
  // const [newStudentData, setNewStudentData] = useState({
  //   confirmAddFamily: false,
  //   confirmAddCurriculum: false,
  //   confirmAddExperimentalCurriculum: false,
  //   curriculum: "",
  //   curriculumName: "",
  //   curriculumClassDayId: "",
  //   curriculumInitialDate: "",
  //   curriculumCoursePriceUnit: 0,
  //   curriculumCoursePriceBundle: 0,
  //   curriculumCourseBundleDays: 0,
  //   experimentalCurriculum: "",
  //   experimentalCurriculumName: "",
  //   experimentalCurriculumClassDayId: "",
  //   experimentalCurriculumInitialDate: "",
  //   familyId: "",
  //   familyName: "",
  //   newFamilySchoolId: "",
  //   newFamilySchoolClassId: "",
  //   newFamilyCurriculumId: "",
  //   indexDays: [] as number[],
  // });

  // type NewPricesProps = {
  //   appliedPrice: number;
  //   fullPrice: number;
  // };

  // NEW PRICES STATE
  // const [newPrices, setNewPrices] = useState<NewPricesProps>({
  //   appliedPrice: 0,
  //   fullPrice: 0,
  // });

  // REGISTRATION EXEMPTION STATE
  // const [enrolmentExemption, setEnrolmentExemption] = useState(false);

  // CHANGE ENROLMENT FEE VALUE WHEN ACTIVATE REGISTRATION EXEMPTION
  // useEffect(() => {
  //   if (enrolmentExemption) {
  //     setStudentEditData({ ...studentEditData, enrolmentFee: 0 });
  //   } else {
  //     setStudentEditData({
  //       ...studentEditData,
  //       enrolmentFee:
  //         new Date().getMonth() < 6
  //           ? 135
  //           : new Date().getMonth() < 10
  //           ? 67.5
  //           : 0,
  //     });
  //   }
  // }, [enrolmentExemption]);

  // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
  // useEffect(() => {
  //   if (studentEditData.customDiscount) {
  //     setStudentEditData({ ...studentEditData, customDiscountValue: "0" });
  //   }
  // }, [studentEditData.customDiscount]);

  // STUDENT SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setSchoolClassSelectedData(undefined);
    setCurriculumSelectedData(undefined);
    // setStudentSelectedData(undefined);
    if (studentData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDatabaseData.find(({ id }) => id === studentData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [studentData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setCurriculumSelectedData(undefined);
    // setStudentSelectedData(undefined);
    if (studentData.schoolClassId !== "") {
      setSchoolSelectedData(
        schoolClassDatabaseData.find(
          ({ id }) => id === studentData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [schoolClassSelectedData]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [studentData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumSelectedData) {
      setIsEdit(false);
      setIsSelected(false);
      // setStudentSelectedData(undefined);
      if (studentData.curriculumId !== "") {
        setCurriculumSelectedData(
          curriculumDatabaseData.find(
            ({ id }) => id === studentData.curriculumId
          )
        );
      } else {
        setCurriculumSelectedData(undefined);
      }
    }
  }, [curriculumSelectedData]);

  // RESET STUDENT SELECT TO INDEX 0 WHEN CURRICULUM CHANGE
  useEffect(() => {
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [studentData.curriculumId]);

  // CURRICULUM / EXPERMIENTAL CLASS STATE
  // const [newClass, setNewClass] = useState({
  //   date: "",
  //   name: "",
  //   enrolledDays: [] as number[],
  // });

  // PICK STUDENT CLASS DAYS
  // CLASS DAY BOOLEAN DATA
  // const [classDaysData, setClassDaysData] = useState({
  //   Domingo: true,
  //   Segunda: true,
  //   Terça: true,
  //   Quarta: true,
  //   Quinta: true,
  //   Sexta: true,
  //   Sábado: true,
  // });

  // TOGGLE CLASS DAYS VALUE FUNCTION
  // function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
  //   setClassDaysData({ ...classDaysData, [day]: value });
  //   if (value) {
  //     classDayIndex.map((dayIndex) => {
  //       if (dayIndex.name === day) {
  //         if (dayIndex.name === "Domingo") {
  //           setNewClass({
  //             ...newClass,
  //             enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
  //           });
  //         }
  //         if (dayIndex.name === "Segunda") {
  //           const foundSunday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 0
  //           );
  //           if (foundSunday !== -1) {
  //             const insertAt = foundSunday + 1;
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, insertAt),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(insertAt),
  //               ],
  //             });
  //           } else {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
  //             });
  //           }
  //         }
  //         if (dayIndex.name === "Terça") {
  //           const foundSunday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 0
  //           );
  //           const foundMonday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 1
  //           );
  //           if (foundMonday !== -1) {
  //             const insertAt = foundMonday + 1;
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, insertAt),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(insertAt),
  //               ],
  //             });
  //           } else if (foundSunday !== -1) {
  //             const insertAt = foundSunday + 1;
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, insertAt),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(insertAt),
  //               ],
  //             });
  //           } else {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
  //             });
  //           }
  //         }
  //         if (dayIndex.name === "Quarta") {
  //           const foundSunday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 0
  //           );
  //           const foundMonday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 1
  //           );
  //           const foundTuesday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 2
  //           );
  //           if (foundTuesday !== -1) {
  //             const insertAt = foundTuesday + 1;
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, insertAt),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(insertAt),
  //               ],
  //             });
  //           } else if (foundMonday !== -1) {
  //             const insertAt = foundMonday + 1;
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, insertAt),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(insertAt),
  //               ],
  //             });
  //           } else if (foundSunday !== -1) {
  //             const insertAt = foundSunday + 1;
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, insertAt),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(insertAt),
  //               ],
  //             });
  //           } else {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
  //             });
  //           }
  //         }
  //         if (dayIndex.name === "Quinta") {
  //           const foundSaturday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 6
  //           );
  //           const foundFriday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 5
  //           );
  //           if (foundFriday !== -1) {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, foundFriday),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(foundFriday),
  //               ],
  //             });
  //           } else if (foundSaturday !== -1) {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, foundSaturday),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(foundSaturday),
  //               ],
  //             });
  //           } else {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [...newClass.enrolledDays, dayIndex.id],
  //             });
  //           }
  //         }
  //         if (dayIndex.name === "Sexta") {
  //           const foundSaturday = newClass.enrolledDays.findIndex(
  //             (classDayId) => classDayId === 6
  //           );
  //           if (foundSaturday !== -1) {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [
  //                 ...newClass.enrolledDays.slice(0, foundSaturday),
  //                 dayIndex.id,
  //                 ...newClass.enrolledDays.slice(foundSaturday),
  //               ],
  //             });
  //           } else {
  //             setNewClass({
  //               ...newClass,
  //               enrolledDays: [...newClass.enrolledDays, dayIndex.id],
  //             });
  //           }
  //         }
  //         if (dayIndex.name === "Sábado") {
  //           setNewClass({
  //             ...newClass,
  //             enrolledDays: [...newClass.enrolledDays, dayIndex.id],
  //           });
  //         }
  //       }
  //     });
  //   } else {
  //     classDayIndex.map((dayIndex) => {
  //       if (dayIndex.name === day) {
  //         setNewClass({
  //           ...newClass,
  //           enrolledDays: newClass.enrolledDays.filter(
  //             (classDayId) => classDayId !== dayIndex.id
  //           ),
  //         });
  //       }
  //     });
  //   }
  // }
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT SELECT STATES AND FUNCTIONS -------------------------- //
  // STUDENT SELECTED STATE DATA
  // const [studentSelectedData, setStudentSelectedData] =
  //   useState<StudentSearchProps>();

  // HAVE CURRICULUM STATE
  // const [haveCurriculum, setHaveCurriculum] = useState(false);

  // INCLUDE / EXLUDE CURRICULUM STATES
  // const [excludeCurriculum, setExcludeCurriculum] = useState<
  //   ExcludeCurriculumProps[]
  // >([]);

  // NEW STUDENT CURRICULUM STATE ARRAY
  // const [newStudentCurriculumArray, setNewStudentCurriculumArray] = useState<
  //   (string | undefined)[]
  // >([]);

  // INCLUDE / EXLUDE CURRICULUM STATES
  // const [excludeExperimentalCurriculum, setExcludeExperimentalCurriculum] =
  //   useState<ExcludeCurriculumProps[]>([]);

  // NEW STUDENT CURRICULUM STATE ARRAY
  // const [
  //   newStudentExperimentalCurriculumArray,
  //   setNewStudentExperimentalCurriculumArray,
  // ] = useState<(string | undefined)[]>([]);

  // CHANGE STUDENT CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
  // function handleIncludeExcludeCurriculum(
  //   index: number,
  //   data: ExcludeCurriculumProps
  // ) {
  //   if (data.exclude) {
  //     setNewStudentCurriculumArray(
  //       newStudentCurriculumArray.filter((id) => id !== data.id)
  //     );
  //   } else {
  //     setNewStudentCurriculumArray((newStudentCurriculumArray) => [
  //       ...newStudentCurriculumArray,
  //       data.id,
  //     ]);
  //   }

  //   const newExcludeCurriculum = excludeCurriculum.map((curriculum, i) => {
  //     if (i === index) {
  //       return {
  //         exclude: data.exclude,
  //         id: data.id,
  //         name: data.name,
  //         date: data.date,
  //         isExperimental: data.isExperimental,
  //         indexDays: data.indexDays,
  //         price: data.price,
  //       };
  //     } else {
  //       // THE REST HAVEN'T CHANGED
  //       return curriculum;
  //     }
  //   });
  //   setExcludeCurriculum(newExcludeCurriculum);
  // }

  // CHANGE STUDENT EXPERIMENTAL CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
  // function handleIncludeExcludeExperimentalCurriculum(
  //   index: number,
  //   data: ExcludeCurriculumProps
  // ) {
  //   if (data.exclude) {
  //     setNewStudentExperimentalCurriculumArray(
  //       newStudentExperimentalCurriculumArray.filter((id) => id !== data.id)
  //     );
  //   } else {
  //     setNewStudentExperimentalCurriculumArray(
  //       (newStudentExperimentalCurriculumArray) => [
  //         ...newStudentExperimentalCurriculumArray,
  //         data.id,
  //       ]
  //     );
  //   }
  //   const newExcludeExperimentalCurriculum = excludeExperimentalCurriculum.map(
  //     (curriculum, i) => {
  //       if (i === index) {
  //         return {
  //           exclude: data.exclude,
  //           id: data.id,
  //           name: data.name,
  //           date: data.date,
  //           isExperimental: data.isExperimental,
  //           indexDays: data.indexDays,
  //           price: data.price,
  //         };
  //       } else {
  //         // THE REST HAVEN'T CHANGED
  //         return curriculum;
  //       }
  //     }
  //   );
  //   setExcludeExperimentalCurriculum(newExcludeExperimentalCurriculum);
  // }

  // SET PHONE FORMATTED
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     setStudentEditData({
  //       ...studentEditData,
  //       financialResponsible: {
  //         ...studentEditData.financialResponsible,
  //         phoneSecondary: {
  //           ...studentEditData.financialResponsible.phoneSecondary,
  //           ddd: studentEditData.financialResponsible.activePhoneSecondary
  //             ? studentSelectedData.financialResponsible.phoneSecondary !== ""
  //               ? studentSelectedData.financialResponsible.phoneSecondary.slice(
  //                   3,
  //                   5
  //                 )
  //               : "DDD"
  //             : "DDD",
  //           prefix: studentEditData.financialResponsible.activePhoneSecondary
  //             ? studentSelectedData.financialResponsible.phoneSecondary.slice(
  //                 5,
  //                 10
  //               )
  //             : "",
  //           suffix: studentEditData.financialResponsible.activePhoneSecondary
  //             ? studentSelectedData.financialResponsible.phoneSecondary.slice(
  //                 -4
  //               )
  //             : "",
  //         },
  //         phoneTertiary: {
  //           ...studentEditData.financialResponsible.phoneTertiary,
  //           ddd: studentEditData.financialResponsible.activePhoneTertiary
  //             ? studentSelectedData.financialResponsible.phoneTertiary !== ""
  //               ? studentSelectedData.financialResponsible.phoneTertiary.slice(
  //                   3,
  //                   5
  //                 )
  //               : "DDD"
  //             : "DDD",
  //           prefix: studentEditData.financialResponsible.activePhoneTertiary
  //             ? studentSelectedData.financialResponsible.phoneTertiary.slice(
  //                 5,
  //                 10
  //               )
  //             : "",
  //           suffix: studentEditData.financialResponsible.activePhoneTertiary
  //             ? studentSelectedData.financialResponsible.phoneTertiary.slice(-4)
  //             : "",
  //         },
  //       },
  //     });
  //   }
  // }, [
  //   studentEditData.financialResponsible.activePhoneSecondary,
  //   studentEditData.financialResponsible.activePhoneTertiary,
  // ]);

  // SET STUDENT SELECTED STATE WHEN SELECT STUDENT ON FORM
  useEffect(() => {
    if (studentData.studentId !== "") {
      setIsEdit(false);
      setIsSelected(true);
    }
  }, [studentData.studentId]);

  // STUDENT FAMILY DETAILS STATE
  // const [studentFamilyDetails, setStudentFamilyDetails] = useState<
  //   StudentFamilyAtSchoolProps[]
  // >([]);

  // STUDENT CURRICULUM DETAILS STATE
  // const [studentCurriculumDetails, setStudentCurriculumDetails] = useState<
  //   CurriculumArrayProps[]
  // >([]);

  // SET STUDENT EDIT ARRAYS
  // SET STUDENT FAMILY DETAILS
  // const handleStudentFamilyDetails = async () => {
  //   const foundedStudent = studentsDatabaseData.find(
  //     (student) => student.id === studentData.studentId
  //   );

  //   if (foundedStudent) {
  //     setStudentFamilyDetails(foundedStudent.studentFamilyAtSchool);
  //   }
  // };

  // ARRAY TO STORE ORIGINAL STUDENT CLASS DAYS
  // const [originalStudentClassDays, setOriginalStudentClassDays] = useState<
  //   number[]
  // >([]);

  // SET STUDENT CURRICULUM DETAILS
  // const handleStudentCurriculumDetails = async () => {
  //   const foundedStudent = studentsDatabaseData.find(
  //     (student) => student.id === studentData.studentId
  //   );

  //   if (foundedStudent) {
  //     foundedStudent.curriculumIds.map((curriculumDetail) => {
  //       setStudentCurriculumDetails((studentCurriculumDetails) => [
  //         ...studentCurriculumDetails,
  //         curriculumDetail,
  //       ]);
  //       setNewStudentData({
  //         ...newStudentData,
  //         indexDays: curriculumDetail.indexDays,
  //       });
  //       setOriginalStudentClassDays(curriculumDetail.indexDays);
  //     });
  //   }
  // };

  // SET STUDENT EXPERIMENTAL CURRICULUM DETAILS
  // const handleStudentExperimentalCurriculumDetails = async () => {
  //   const foundedStudent = studentsDatabaseData.find(
  //     (student) => student.id === studentData.studentId
  //   );

  //   if (foundedStudent) {
  //     foundedStudent.experimentalCurriculumIds.map((curriculumDetail) => {
  //       setStudentCurriculumDetails((studentCurriculumDetails) => [
  //         ...studentCurriculumDetails,
  //         curriculumDetail,
  //       ]);
  //     });
  //   }
  // };

  // SET STUDENT FAMILY ARRAY DETAILS WHEN STUDENT IS SELECTED
  // useEffect(() => {
  //   setExcludeExperimentalCurriculum([]);
  //   setExcludeFamily([]);
  //   setStudentCurriculumDetails([]);
  //   setStudentFamilyDetails([]);
  //   if (studentData.studentId !== "") {
  //     handleStudentFamilyDetails();
  //     handleStudentCurriculumDetails();
  //     handleStudentExperimentalCurriculumDetails();
  //   }
  // }, [studentData.studentId]);

  // SET STUDENT EDIT WHEN SELECT STUDENT
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     setDateToString(
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       //@ts-expect-error
  //       studentSelectedData.birthDate.toDate().toLocaleDateString()
  //     );
  //     // SET STUDENT EDIT ALL DATA
  //     setStudentEditData({
  //       ...studentEditData,
  //       // Section 1: Student Data
  //       id: studentData.studentId,
  //       name: studentSelectedData.name,
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       //@ts-expect-error
  //       birthDate: studentSelectedData.birthDate.toDate().toLocaleDateString(),
  //       classComplement: studentSelectedData.classComplement,
  //       parentOne: {
  //         name: studentSelectedData.parentOne.name,
  //         email: studentSelectedData.parentOne.email,
  //         phone: {
  //           ddd: studentSelectedData.parentOne.phone.slice(3, 5),
  //           prefix: studentSelectedData.parentOne.phone.slice(5, 10),
  //           suffix: studentSelectedData.parentOne.phone.slice(-4),
  //         },
  //       },
  //       parentTwo: {
  //         name: studentSelectedData.parentTwo.name,
  //         email: studentSelectedData.parentTwo.email,
  //         phone: {
  //           ddd: studentSelectedData.parentTwo.phone.slice(3, 5),
  //           prefix: studentSelectedData.parentTwo.phone.slice(5, 10),
  //           suffix: studentSelectedData.parentTwo.phone.slice(-4),
  //         },
  //       },

  //       // Section 2: Student Course and Family Data | Prices
  //       enrolmentExemption: studentSelectedData.enrolmentExemption,
  //       enrolmentFee: studentSelectedData.enrolmentFee,
  //       enrolmentFeePaid: studentSelectedData.enrolmentFeePaid,
  //       fullPrice: studentSelectedData.fullPrice,
  //       appliedPrice: studentSelectedData.appliedPrice,
  //       customDiscount: studentSelectedData.customDiscount,
  //       customDiscountValue: studentSelectedData.customDiscountValue,
  //       employeeDiscount: studentSelectedData.employeeDiscount,
  //       familyDiscount: studentSelectedData.familyDiscount,
  //       secondCourseDiscount: studentSelectedData.secondCourseDiscount,
  //       paymentDay: studentSelectedData.paymentDay!,

  //       // Section 3: Student Financial Responsible Data
  //       financialResponsible: {
  //         name: studentSelectedData.financialResponsible.name,
  //         document: studentSelectedData.financialResponsible.document,
  //         email: studentSelectedData.financialResponsible.email,
  //         address: {
  //           street: studentSelectedData.financialResponsible.address.street,
  //           number: studentSelectedData.financialResponsible.address.number,
  //           complement:
  //             studentSelectedData.financialResponsible.address.complement,
  //           neighborhood:
  //             studentSelectedData.financialResponsible.address.neighborhood,
  //           city: studentSelectedData.financialResponsible.address.city,
  //           state: studentSelectedData.financialResponsible.address.state,
  //           cep: studentSelectedData.financialResponsible.address.cep,
  //         },
  //         phone: {
  //           ddd: studentSelectedData.financialResponsible.phone.slice(3, 5),
  //           prefix: studentSelectedData.financialResponsible.phone.slice(5, 10),
  //           suffix: studentSelectedData.financialResponsible.phone.slice(-4),
  //         },
  //         activePhoneSecondary:
  //           studentSelectedData.financialResponsible.phoneSecondary !== ""
  //             ? true
  //             : false,
  //         phoneSecondary: {
  //           ddd: studentSelectedData.financialResponsible.phoneSecondary
  //             ? studentSelectedData.financialResponsible.phoneSecondary.slice(
  //                 3,
  //                 5
  //               )
  //             : "DDD",
  //           prefix: studentSelectedData.financialResponsible.phoneSecondary
  //             ? studentSelectedData.financialResponsible.phoneSecondary.slice(
  //                 5,
  //                 10
  //               )
  //             : "",
  //           suffix: studentSelectedData.financialResponsible.phoneSecondary
  //             ? studentSelectedData.financialResponsible.phoneSecondary.slice(
  //                 -4
  //               )
  //             : "",
  //         },
  //         activePhoneTertiary:
  //           studentSelectedData.financialResponsible.phoneTertiary !== ""
  //             ? true
  //             : false,
  //         phoneTertiary: {
  //           ddd: studentSelectedData.financialResponsible.phoneTertiary
  //             ? studentSelectedData.financialResponsible.phoneTertiary.slice(
  //                 3,
  //                 5
  //               )
  //             : "DDD",
  //           prefix: studentSelectedData.financialResponsible.phoneTertiary
  //             ? studentSelectedData.financialResponsible.phoneTertiary.slice(
  //                 5,
  //                 10
  //               )
  //             : "",
  //           suffix: studentSelectedData.financialResponsible.phoneTertiary
  //             ? studentSelectedData.financialResponsible.phoneTertiary.slice(-4)
  //             : "",
  //         },
  //       },
  //     });
  //   }
  // }, [studentSelectedData]);

  // SET STUDENT CURRENCY VALUES TO NEW PRICES STATE
  // useEffect(() => {
  //   setNewPrices({
  //     appliedPrice: studentEditData.appliedPrice,
  //     fullPrice: studentEditData.fullPrice,
  //   });
  // }, [studentEditData.appliedPrice, studentEditData.fullPrice]);

  // IF STUDENT HAVE CURRICULUM SET STATE AND SHOW INPUTS
  // useEffect(() => {
  //   setExcludeCurriculum([]);
  //   setExcludeExperimentalCurriculum([]);
  //   if (studentCurriculumDetails !== undefined) {
  //     if (studentCurriculumDetails.length > 0) {
  //       setHaveCurriculum(true);
  //       for (let index = 0; index < studentCurriculumDetails.length; index++) {
  //         if (studentCurriculumDetails[index]! !== undefined) {
  //           if (studentCurriculumDetails[index]!.isExperimental) {
  //             setExcludeExperimentalCurriculum(
  //               (excludeExperimentalCurriculum) => [
  //                 ...excludeExperimentalCurriculum,
  //                 {
  //                   exclude: false,
  //                   id: studentCurriculumDetails![index]!.id,
  //                   name: studentCurriculumDetails![index]!.name,
  //                   isExperimental:
  //                     studentCurriculumDetails![index]!.isExperimental,
  //                   date: studentCurriculumDetails![index]!.date,
  //                   indexDays: studentCurriculumDetails![index]!.indexDays,
  //                   price: studentCurriculumDetails![index]!.price,
  //                 },
  //               ]
  //             );
  //           } else {
  //             setExcludeCurriculum((excludeCurriculum) => [
  //               ...excludeCurriculum,
  //               {
  //                 exclude: false,
  //                 id: studentCurriculumDetails![index]!.id,
  //                 name: studentCurriculumDetails![index]!.name,
  //                 isExperimental:
  //                   studentCurriculumDetails![index]!.isExperimental,
  //                 date: studentCurriculumDetails![index]!.date,
  //                 indexDays: studentCurriculumDetails![index]!.indexDays,
  //                 price: studentCurriculumDetails![index]!.price,
  //               },
  //             ]);
  //           }
  //         }
  //       }
  //     } else {
  //       setHaveCurriculum(false);
  //     }
  //   }
  // }, [studentCurriculumDetails]);
  // -------------------------- END OF STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT EDIT STATES AND FUNCTIONS -------------------------- //
  // DATE TO STRING STATE
  // const [dateToString, setDateToString] = useState("");

  // DATE SUBMIT STRING STATE
  // const [dateSubmitToString, setDateSubmitToString] = useState("");

  // TRANSFORM DATE TO FORMAT OF FIREBASE MM/DD/YYYY
  // useEffect(() => {
  //   if (dateToString) {
  //     setDateSubmitToString(
  //       `${dateToString.slice(3, 5)}/${dateToString.slice(
  //         0,
  //         2
  //       )}/${dateToString.slice(-4)}`
  //     );
  //   }
  // }, [dateToString]);

  // CEP SUBMITTING STATE
  // const [cepSubmitting, setCepSubmitting] = useState(false);

  // CEP ERROR STATE
  // const [cepError, setCepError] = useState(false);

  // EDIT ADDRESS STATE
  // const [editAddress, setEditAddress] = useState(false);

  // GET CEP (BRAZILIAN ZIP CODE) FUNCTION
  // const getCep = async (data: string) => {
  //   setEditAddress(false);
  //   if (data) {
  //     setCepSubmitting(true);
  //     await cep(data)
  //       .then((response) => {
  //         setCepSubmitting(false);
  //         setStudentEditData({
  //           ...studentEditData,
  //           financialResponsible: {
  //             ...studentEditData.financialResponsible,
  //             address: {
  //               ...studentEditData.financialResponsible.address,
  //               cep: data,
  //               street: response.street,
  //               neighborhood: response.neighborhood,
  //               city: response.city,
  //               state: response.state,
  //               // RESETING NUMBER AND COMPLEMENT WHEN GET CEP
  //               number: "",
  //               complement: "",
  //             },
  //           },
  //         });
  //       })
  //       .catch((error) => {
  //         console.log("ESSE É O ERROR", error);
  //         setCepSubmitting(false);
  //         toast.error(
  //           `Erro ao pesquisar o CEP, verifique o número ou insira o endereço manualmente... 🤯`,
  //           {
  //             theme: "colored",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             autoClose: 3000,
  //           }
  //         );
  //       });
  //   } else {
  //     setCepError(true);
  //     setCepSubmitting(false);
  //     toast.error(`Por favor, preencha o CEP para pesquisa.`, {
  //       theme: "colored",
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       autoClose: 3000,
  //     });
  //   }
  // };

  // FORMAT CEP (BRAZILIAN ZIP CODE) FUNCTION
  // const formatCEP = (cepNumber: string) => {
  //   cepNumber = cepNumber.replace(/[^\d]/g, "");
  //   return cepNumber.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
  // };

  // HAVE FAMILY STATE
  // const [haveFamily, setHaveFamily] = useState(false);

  // GET BROTHER NAME TO PUT ON FORM
  // useEffect(() => {
  //   if (studentFamilyDetails !== undefined) {
  //     if (studentFamilyDetails.length > 0) {
  //       setExcludeFamily([]);
  //       setHaveFamily(true);
  //       for (let index = 0; index < studentFamilyDetails.length; index++) {
  //         setExcludeFamily((excludeFamily) => [
  //           ...excludeFamily,
  //           {
  //             exclude: false,
  //             applyDiscount: studentFamilyDetails![index]!.applyDiscount,
  //             id: studentFamilyDetails![index]!.id,
  //             name: studentFamilyDetails![index]!.name,
  //           },
  //         ]);
  //       }
  //     } else {
  //       setHaveFamily(false);
  //     }
  //   }
  // }, [studentFamilyDetails]);

  // INCLUDE / EXLUDE FAMILY STATES
  // const [excludeFamily, setExcludeFamily] = useState<ExcludeFamilyProps[]>([]);

  // NEW STUDENT FAMILY STATE ARRAY
  // const [newStudentFamilyArray, setNewStudentFamilyArray] = useState<
  //   (string | undefined)[]
  // >([]);

  // CHANGE STUDENT FAMILY (INCLUDE / EXCLUDE) FUNCTION
  // function handleIncludeExcludeFamily(index: number, data: ExcludeFamilyProps) {
  //   if (data.exclude) {
  //     setNewStudentFamilyArray(
  //       newStudentFamilyArray.filter((id) => id !== data.id)
  //     );
  //   } else {
  //     setNewStudentFamilyArray((newStudentFamilyArray) => [
  //       ...newStudentFamilyArray,
  //       data.id,
  //     ]);
  //   }

  //   const newExcludeFamily = excludeFamily.map((family, i) => {
  //     if (i === index) {
  //       return {
  //         exclude: data.exclude,
  //         applyDiscount: data.applyDiscount,
  //         id: data.id,
  //         name: data.name,
  //       };
  //     } else {
  //       // THE REST HAVEN'T CHANGED
  //       return family;
  //     }
  //   });
  //   setExcludeFamily(newExcludeFamily);
  // }
  // -------------------------- END OF STUDENT EDIT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW FAMILY STATES AND FUNCTIONS -------------------------- //
  // NEW FAMILY SELECTED STATE DATA
  // const [newFamilySelectedData, setNewFamilySelectedData] =
  //   useState<StudentSearchProps>();

  // SET NEW FAMILY SELECTED STATE WHEN SELECT NEW FAMILY
  // useEffect(() => {
  //   if (newStudentData.familyId !== "") {
  //     setNewFamilySelectedData(
  //       studentsDatabaseData.find(({ id }) => id === newStudentData.familyId)
  //     );
  //   } else {
  //     setNewSchoolSelectedData(undefined);
  //   }
  // }, [newStudentData.familyId]);

  // SET FAMILY NAME WHEN SELECTED NEW FAMILY
  // useEffect(() => {
  //   if (newFamilySelectedData !== undefined) {
  //     setNewStudentData({
  //       ...newStudentData,
  //       familyName: newFamilySelectedData.name,
  //     });
  //   }
  // }, [newFamilySelectedData]);

  // RESET ADD NEW FAMILY CONFIRMATION WHEN NEW FAMILY CHANGE
  // useEffect(() => {
  //   setNewStudentData({ ...newStudentData, confirmAddFamily: false });
  // }, [newStudentData.familyId]);
  // -------------------------- END OF NEW FAMILY STATES AND FUNCTIONS -------------------------- //

  // ---------------------------------------- ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //
  // EXPERIMENTAL CURRICULUM DATA
  // const [experimentalCurriculumData, setExperimentalCurriculumData] =
  //   useState<SearchCurriculumValidationZProps>({
  //     schoolId: "",
  //     schoolName: "",
  //     schoolClassId: "",
  //     schoolClassName: "",
  //     schoolCourseId: "",
  //     schoolCourseName: "",
  //   });

  // CURRICULUM DATA
  // const [curriculumData, setCurriculumData] =
  //   useState<SearchCurriculumValidationZProps>({
  //     schoolId: "",
  //     schoolName: "",
  //     schoolClassId: "",
  //     schoolClassName: "",
  //     schoolCourseId: "",
  //     schoolCourseName: "",
  //   });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // const [newClassError, setNewClassError] = useState(false);

  // SCHOOL SELECTED STATE DATA
  // const [newSchoolSelectedData, setNewSchoolSelectedData] =
  //   useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  // useEffect(() => {
  //   setNewSchoolClassSelectedData(undefined);
  //   if (curriculumData.schoolId !== "") {
  //     setNewSchoolSelectedData(
  //       schoolDatabaseData.find(({ id }) => id === curriculumData.schoolId)
  //     );
  //   } else {
  //     setNewSchoolSelectedData(undefined);
  //   }
  // }, [curriculumData.schoolId]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  // useEffect(() => {
  //   if (studentEditData.addCurriculum) {
  //     (
  //       document.getElementById("newSchoolClassSelect") as HTMLSelectElement
  //     ).selectedIndex = 0;
  //     (
  //       document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
  //     ).selectedIndex = 0;
  //   }
  // }, [curriculumData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  // const [newSchoolClassSelectedData, setNewSchoolClassSelectedData] =
  //   useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  // useEffect(() => {
  //   if (curriculumData.schoolClassId !== "") {
  //     setNewSchoolClassSelectedData(
  //       schoolClassDatabaseData.find(
  //         ({ id }) => id === curriculumData.schoolClassId
  //       )
  //     );
  //   } else {
  //     setNewSchoolClassSelectedData(undefined);
  //   }
  // }, [curriculumData.schoolClassId]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  // useEffect(() => {
  //   if (studentEditData.addCurriculum) {
  //     (
  //       document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
  //     ).selectedIndex = 0;
  //     handleNewAvailableCoursesData();
  //   }
  // }, [curriculumData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  // const [newSchoolCourseSelectedData, setNewSchoolCourseSelectedData] =
  //   useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  // useEffect(() => {
  //   if (curriculumData.schoolCourseId !== "") {
  //     setNewSchoolCourseSelectedData(
  //       schoolCourseDatabaseData.find(
  //         ({ id }) => id === curriculumData.schoolCourseId
  //       )
  //     );
  //   } else {
  //     setNewSchoolCourseSelectedData(undefined);
  //   }
  // }, [curriculumData.schoolCourseId]);

  // SET SCHOOL COURSE PRICES WHEN SELECTED COURSE
  // useEffect(() => {
  //   if (newStudentData.curriculum) {
  //     const foundedCurriculum = curriculumDatabaseData.find(
  //       (curriculum) => curriculum.id === newStudentData.curriculum
  //     );

  //     if (foundedCurriculum) {
  //       const foundedSchoolCourse = schoolCourseDatabaseData.find(
  //         (schoolCourse) => schoolCourse.id === foundedCurriculum.schoolCourseId
  //       );
  //       if (foundedSchoolCourse) {
  //         setNewStudentData({
  //           ...newStudentData,
  //           curriculumCourseBundleDays: foundedSchoolCourse.bundleDays,
  //           curriculumCoursePriceBundle: foundedSchoolCourse.priceBundle,
  //           curriculumCoursePriceUnit: foundedSchoolCourse.priceUnit,
  //         });
  //       }
  //     }
  //   }
  // }, [newStudentData.curriculum, newClass]);

  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DETAILS ARRAY STATE
  // const [newCurriculumCoursesData, setNewCurriculumCoursesData] = useState<
  //   CurriculumSearchProps[]
  // >([]);

  // GETTING CURRICULUM DATA
  // const handleNewAvailableCoursesData = async () => {
  //   if (curriculumData.schoolCourseId === "all") {
  //     const filterCurriculum = curriculumDatabaseData.filter(
  //       (curriculum) =>
  //         curriculum.schoolId === curriculumData.schoolId &&
  //         curriculum.schoolClassId === curriculumData.schoolClassId
  //     );
  //     setNewCurriculumCoursesData(filterCurriculum);
  //   } else {
  //     const filterCurriculum = curriculumDatabaseData.filter(
  //       (curriculum) =>
  //         curriculum.schoolId === curriculumData.schoolId &&
  //         curriculum.schoolClassId === curriculumData.schoolClassId &&
  //         curriculum.schoolCourseId === curriculumData.schoolCourseId
  //     );
  //     setNewCurriculumCoursesData(filterCurriculum);
  //   }
  // };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  // useEffect(() => {
  //   handleNewAvailableCoursesData();
  // }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
  // NEW CURRICULUM CLASS DAY SELECTED STATE DATA
  // const [classDayCurriculumSelectedData, setClassDayCurriculumSelectedData] =
  //   useState<ClassDaySearchProps>();

  // DAY ALREADY WITH CLASS ALERT
  // const [dayIsAlreadyWithClass, setDayIsAlreadyWithClass] = useState(false);

  // GET CLASS DAY FULL DATA WHEN HAVE CURRICULUM SELECTED DATA
  // useEffect(() => {
  //   const handleNewCurriculumClassDayFullData = async () => {
  //     const filterClassDays = classDaysDatabaseData.find(
  //       (classDays) => classDays.id === newStudentData.curriculumClassDayId
  //     );

  //     if (filterClassDays) {
  //       setClassDayCurriculumSelectedData(filterClassDays);
  //     } else {
  //       setClassDayCurriculumSelectedData(undefined);
  //     }
  //   };
  //   handleNewCurriculumClassDayFullData();
  // }, [newStudentData.curriculumClassDayId]);

  // ARRAY TO GET ENROLLED DAYS STATE
  // const [newClassDayArray, setNewClassDayArray] = useState<number[]>([]);

  // COUNTING ENROLLED DAYS STATE
  // const [daysFoundCount, setDaysFoundCount] = useState(0);

  // GET THE DAY TO KNOW IF IT ALREADY EXISTS ON STUDENT DATABASE
  // useEffect(() => {
  //   if (daysFoundCount > 0) {
  //     setDayIsAlreadyWithClass(true);
  //   } else {
  //     setDayIsAlreadyWithClass(false);
  //   }
  // }, [daysFoundCount]);

  // SET AN ARRAY WITH ENROLLED DAYS WHEN CLASS DAY CURRICULUM IS SELECTED
  // useEffect(() => {
  //   setNewStudentData({
  //     ...newStudentData,
  //     indexDays: originalStudentClassDays,
  //   });
  //   setNewClassDayArray([]);
  //   setDaysFoundCount(0);
  //   if (classDayCurriculumSelectedData) {
  //     const daysToNewClassDayArray = [] as number[];
  //     classDayCurriculumSelectedData.indexDays.map((curriculumClassDay) => {
  //       const alreadyExists =
  //         newStudentData.indexDays.includes(curriculumClassDay);
  //       if (!alreadyExists) {
  //         const existInArray =
  //           daysToNewClassDayArray.includes(curriculumClassDay);
  //         // const existInArray = newClassDayArray.includes(curriculumClassDay);
  //         if (!existInArray) {
  //           daysToNewClassDayArray.push(curriculumClassDay);
  //         }
  //       }
  //       const showMessage =
  //         newStudentData.indexDays.includes(curriculumClassDay);
  //       if (showMessage) {
  //         setDaysFoundCount(daysFoundCount + 1);
  //       }
  //     });
  //     setNewClassDayArray(daysToNewClassDayArray);
  //   }
  // }, [
  //   classDayCurriculumSelectedData,
  //   newStudentData.curriculum,
  //   // excludeCurriculum,
  // ]);

  // SET NEW CLASS ENROLLED DAYS
  // useEffect(() => {
  //   setNewClass({
  //     ...newClass,
  //     enrolledDays: newClassDayArray,
  //   });
  // }, [newClassDayArray]);

  // -------------------------- END OF NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
  // NEW EXPERIMENTAL CURRICULUM CLASS DAY SELECTED STATE DATA
  // const [
  //   classDayExperimentalCurriculumSelectedData,
  //   setClassDayExperimentalCurriculumSelectedData,
  // ] = useState<ClassDaySearchProps>();

  // GET CLASS DAY FULL DATA WHEN HAVE EXPERIMENTAL CURRICULUM SELECTED DATA
  // useEffect(() => {
  //   const handleNewExperimentalCurriculumClassDayFullData = async () => {
  //     const filterClassDays = classDaysDatabaseData.find(
  //       (classDays) =>
  //         classDays.id === newStudentData.experimentalCurriculumClassDayId
  //     );

  //     if (filterClassDays) {
  //       setClassDayExperimentalCurriculumSelectedData(filterClassDays);
  //     } else {
  //       setClassDayExperimentalCurriculumSelectedData(undefined);
  //     }
  //   };
  //   handleNewExperimentalCurriculumClassDayFullData();
  // }, [newStudentData.experimentalCurriculumClassDayId]);

  // -------------------------- END OF NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // EXPERIMENTAL CLASS ERROR STATE
  // const [experimentalClassError, setExperimentalClassError] = useState(false);

  // SCHOOL SELECTED STATE DATA
  // const [
  //   newExperimentalSchoolSelectedData,
  //   setNewExperimentalSchoolSelectedData,
  // ] = useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  // useEffect(() => {
  //   setNewExperimentalSchoolClassSelectedData(undefined);
  //   if (experimentalCurriculumData.schoolId !== "") {
  //     setNewExperimentalSchoolSelectedData(
  //       schoolDatabaseData.find(
  //         ({ id }) => id === experimentalCurriculumData.schoolId
  //       )
  //     );
  //   } else {
  //     setNewExperimentalSchoolSelectedData(undefined);
  //   }
  // }, [experimentalCurriculumData.schoolId]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  // useEffect(() => {
  //   if (studentEditData.addExperimentalCurriculum) {
  //     (
  //       document.getElementById(
  //         "newExperimentalSchoolClassSelect"
  //       ) as HTMLSelectElement
  //     ).selectedIndex = 0;
  //     (
  //       document.getElementById(
  //         "newExperimentalSchoolCourseSelect"
  //       ) as HTMLSelectElement
  //     ).selectedIndex = 0;
  //   }
  // }, [experimentalCurriculumData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS SELECTED STATE DATA
  // const [
  //   newExperimentalSchoolClassSelectedData,
  //   setNewExperimentalSchoolClassSelectedData,
  // ] = useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  // useEffect(() => {
  //   if (experimentalCurriculumData.schoolClassId !== "") {
  //     setNewExperimentalSchoolClassSelectedData(
  //       schoolClassDatabaseData.find(
  //         ({ id }) => id === experimentalCurriculumData.schoolClassId
  //       )
  //     );
  //   } else {
  //     setNewExperimentalSchoolClassSelectedData(undefined);
  //   }
  // }, [experimentalCurriculumData.schoolClassId]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  // useEffect(() => {
  //   if (studentEditData.addExperimentalCurriculum) {
  //     (
  //       document.getElementById(
  //         "newExperimentalSchoolCourseSelect"
  //       ) as HTMLSelectElement
  //     ).selectedIndex = 0;
  //     handleNewAvailableExperimentalCoursesData();
  //   }
  // }, [experimentalCurriculumData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE SELECTED STATE DATA
  // const [
  //   newExperimentalSchoolCourseSelectedData,
  //   setNewExperimentalSchoolCourseSelectedData,
  // ] = useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  // useEffect(() => {
  //   if (experimentalCurriculumData.schoolCourseId !== "") {
  //     setNewExperimentalSchoolCourseSelectedData(
  //       schoolCourseDatabaseData.find(
  //         ({ id }) => id === experimentalCurriculumData.schoolCourseId
  //       )
  //     );
  //   } else {
  //     setNewExperimentalSchoolCourseSelectedData(undefined);
  //   }
  // }, [experimentalCurriculumData.schoolCourseId]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DETAILS ARRAY STATE
  // const [
  //   newExperimentalCurriculumCoursesData,
  //   setNewExperimentalCurriculumCoursesData,
  // ] = useState<CurriculumSearchProps[]>([]);

  // GETTING CURRICULUM DATA
  // const handleNewAvailableExperimentalCoursesData = async () => {
  //   if (experimentalCurriculumData.schoolCourseId === "all") {
  //     const filterCurriculum = curriculumDatabaseData.filter(
  //       (curriculum) =>
  //         curriculum.schoolId === experimentalCurriculumData.schoolId &&
  //         curriculum.schoolClassId === experimentalCurriculumData.schoolClassId
  //     );
  //     setNewExperimentalCurriculumCoursesData(filterCurriculum);
  //   } else {
  //     const filterCurriculum = curriculumDatabaseData.filter(
  //       (curriculum) =>
  //         curriculum.schoolId === experimentalCurriculumData.schoolId &&
  //         curriculum.schoolClassId ===
  //           experimentalCurriculumData.schoolClassId &&
  //         curriculum.schoolCourseId ===
  //           experimentalCurriculumData.schoolCourseId
  //     );
  //     setNewExperimentalCurriculumCoursesData(filterCurriculum);
  //   }
  // };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  // useEffect(() => {
  //   handleNewAvailableExperimentalCoursesData();
  // }, [experimentalCurriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // SET SELECTS INDEX WHEN ARE CHANGES
  // WHEN ADD FAMILY CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     setNewStudentData({
  //       ...newStudentData,
  //       familyId: "",
  //       newFamilySchoolId: "",
  //       newFamilySchoolClassId: "",
  //       newFamilyCurriculumId: "",
  //     });
  //     if (studentEditData.addFamily) {
  //       (
  //         document.getElementById("newFamilySchoolSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById(
  //           "newFamilySchoolClassSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById(
  //           "newFamilyCurriculumSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [studentEditData.addFamily]);

  // WHEN ADD CURRICULUM CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     setNewStudentData({
  //       ...newStudentData,
  //       curriculum: "",
  //       curriculumClassDayId: "",
  //       curriculumInitialDate: "",
  //       curriculumName: "",
  //       confirmAddCurriculum: false,
  //     });
  //     if (studentEditData.addCurriculum) {
  //       (
  //         document.getElementById("newSchoolSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById("newSchoolClassSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [studentEditData.addCurriculum]);

  // WHEN ADD EXPERIMENTAL CURRICULUM CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     setNewStudentData({
  //       ...newStudentData,
  //       experimentalCurriculum: "",
  //       experimentalCurriculumClassDayId: "",
  //       experimentalCurriculumInitialDate: "",
  //       experimentalCurriculumName: "",
  //       confirmAddExperimentalCurriculum: false,
  //     });
  //     if (studentEditData.addExperimentalCurriculum) {
  //       (
  //         document.getElementById(
  //           "newExperimentalSchoolSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById(
  //           "newExperimentalSchoolClassSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById(
  //           "newExperimentalSchoolCourseSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [studentEditData.addExperimentalCurriculum]);

  // WHEN NEW FAMILY CURRICULUM SCHOOL ID CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     if (studentEditData.addFamily) {
  //       (
  //         document.getElementById(
  //           "newFamilySchoolClassSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById(
  //           "newFamilyCurriculumSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [newStudentData.newFamilySchoolId]);

  // WHEN NEW FAMILY SCHOOL ID CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     if (studentEditData.addFamily) {
  //       (
  //         document.getElementById(
  //           "newFamilySchoolClassSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById(
  //           "newFamilyCurriculumSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [newStudentData.newFamilySchoolId]);

  // WHEN NEW FAMILY SCHOOL CLASS ID CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     if (studentEditData.addFamily) {
  //       (
  //         document.getElementById(
  //           "newFamilyCurriculumSelect"
  //         ) as HTMLSelectElement
  //       ).selectedIndex = 0;
  //       (
  //         document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [newStudentData.newFamilySchoolClassId]);

  // WHEN NEW FAMILY CURRICULUM ID CHANGE
  // useEffect(() => {
  //   if (studentSelectedData) {
  //     if (studentEditData.addFamily) {
  //       (
  //         document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
  //       ).selectedIndex = 0;
  //     }
  //   }
  // }, [newStudentData.newFamilyCurriculumId]);
  // ---------------------------------------- END OF ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //

  // CHANGE MONTHLY PAYMENT WHEN ADD SCHOOL CLASS
  // SECOND CURRICULUM DATE AND PRICE CALC STATE
  // const [curriculumDatePriceCalc, setCurriculumDatePriceCalc] = useState({
  //   mostExpensiveCourse: 0,
  //   othersPriceSum: 0,
  // });

  // CHECKING IF STUDENT WILL HAVE CURRICULUM AFTER CHANGINGS
  // useEffect(() => {
  //   setCurriculumDatePriceCalc({
  //     mostExpensiveCourse: 0,
  //     othersPriceSum: 0,
  //   });
  // }, [excludeCurriculum]);

  // CALC OF MOST EXPENSIVE COURSE PRICE AND SUM THE SMALLEST VALUES
  // useEffect(() => {
  //   if (
  //     curriculumDatePriceCalc.mostExpensiveCourse === 0 ||
  //     curriculumDatePriceCalc.othersPriceSum === 0
  //   ) {
  //     excludeCurriculum.map((curriculumDetail: ExcludeCurriculumProps) => {
  //       if (!curriculumDetail.exclude) {
  //         if (
  //           curriculumDetail.price > curriculumDatePriceCalc.mostExpensiveCourse
  //         ) {
  //           setCurriculumDatePriceCalc({
  //             ...curriculumDatePriceCalc,
  //             mostExpensiveCourse: curriculumDetail.price,
  //           });
  //         } else {
  //           setCurriculumDatePriceCalc({
  //             ...curriculumDatePriceCalc,
  //             othersPriceSum:
  //               curriculumDatePriceCalc.othersPriceSum + curriculumDetail.price,
  //           });
  //         }
  //       }
  //     });
  //   }
  // }, [curriculumDatePriceCalc]);

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
  //   // if (willHaveCurriculum) {
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
  //     // if (willHaveCurriculum) {
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
  //     // if (willHaveCurriculum) {
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
  //   // if (willHaveCurriculum) {
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
  //   // if (willHaveCurriculum) {
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
  //   const priceUnitDiscount = +(
  //     newStudentData.curriculumCoursePriceUnit * secondCourseDiscountValue
  //   ).toFixed(2);
  //   const priceBundleDiscount = +(
  //     newStudentData.curriculumCoursePriceBundle * secondCourseDiscountValue
  //   ).toFixed(2);
  //   // if (willHaveCurriculum) {

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

  // STATE TO TOGGLE SHOW ADD FAMILY ON FORM
  // const [willHaveFamily, setWillHaveFamily] = useState(false);

  // MONITORING EXCLUDE FAMILY TO SET WILL HAVE FAMILY
  // useEffect(() => {
  //   let haveFamilyWill = false;
  //   excludeFamily.map((familyExclude) => {
  //     if (!familyExclude.exclude) {
  //       haveFamilyWill = true;
  //     } else {
  //       haveFamilyWill = false;
  //     }
  //   });
  //   setWillHaveFamily(haveFamilyWill);
  // }, [excludeFamily]);

  // useEffect(() => {
  //   if (willHaveFamily) {
  //     setStudentEditData({ ...studentEditData, addFamily: false });
  //   }
  // }, [willHaveFamily]);

  // SET MONTHLY PAYMENT WHEN SCHOOL COURSE PRICE, OR ADD FAMILY, OR EMPLOYEE DISCOUNT CHANGE
  // useEffect(() => {
  //   let haveFamilyWill = false;
  //   excludeFamily.map((familyExclude) => {
  //     if (!familyExclude.exclude) {
  //       haveFamilyWill = true;
  //     } else {
  //       haveFamilyWill = false;
  //     }
  //   });
  //   if (
  //     newClass.enrolledDays.length >= 0 &&
  //     studentData.studentId !== "" &&
  //     studentEditData.name !== "" &&
  //     excludeCurriculum
  //   ) {
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
  //     // if (willHaveCurriculum) {
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

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  // const {
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm<EditStudentValidationZProps>({
  //   resolver: zodResolver(editStudentValidationSchema),
  //   defaultValues: {
  //     // Section 1: Student Data
  //     id: "",
  //     name: "",
  //     birthDate: "",
  //     classComplement: "",
  //     parentOne: {
  //       name: "",
  //       email: "",
  //       phone: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //     },
  //     parentTwo: {
  //       name: "",
  //       email: "",
  //       phone: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //     },

  //     // Section 2: Student Course and Family Data | Prices
  //     addCurriculum: false,
  //     addExperimentalCurriculum: false,
  //     addFamily: false,
  //     enrolmentFee: 0,
  //     enrolmentFeePaid: false,
  //     fullPrice: 0,
  //     appliedPrice: 0,
  //     enrolmentExemption: false,
  //     customDiscount: false,
  //     customDiscountValue: "",
  //     employeeDiscount: false,
  //     familyDiscount: false,
  //     secondCourseDiscount: false,
  //     paymentDay: "",

  //     // Section 3: Student Financial Responsible Data
  //     financialResponsible: {
  //       name: "",
  //       document: "",
  //       email: "",
  //       address: {
  //         street: "",
  //         number: "",
  //         complement: "",
  //         neighborhood: "",
  //         city: "",
  //         state: "",
  //         cep: "",
  //       },
  //       phone: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //       activePhoneSecondary: false,
  //       phoneSecondary: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //       activePhoneTertiary: false,
  //       phoneTertiary: {
  //         ddd: "",
  //         prefix: "",
  //         suffix: "",
  //       },
  //     },
  //   },
  // });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    // setNewPrices({
    //   appliedPrice: 0,
    //   fullPrice: 0,
    // });
    // setStudentEditData({
    //   // Section 1: Student Data
    //   id: "",
    //   name: "",
    //   birthDate: "",
    //   classComplement: "",
    //   parentOne: {
    //     name: "",
    //     email: "",
    //     phone: {
    //       ddd: "",
    //       prefix: "",
    //       suffix: "",
    //     },
    //   },
    //   parentTwo: {
    //     name: "",
    //     email: "",
    //     phone: {
    //       ddd: "",
    //       prefix: "",
    //       suffix: "",
    //     },
    //   },

    //   // Section 2: Student Course and Family Data | Prices
    //   addCurriculum: false,
    //   addExperimentalCurriculum: false,
    //   addFamily: false,
    //   enrolmentExemption: false,
    //   enrolmentFee: 0,
    //   enrolmentFeePaid: false,
    //   customDiscount: false,
    //   customDiscountValue: "",
    //   employeeDiscount: false,
    //   familyDiscount: false,
    //   secondCourseDiscount: false,
    //   fullPrice: 0,
    //   appliedPrice: 0,
    //   paymentDay: "",

    //   // Section 3: Student Financial Responsible Data
    //   financialResponsible: {
    //     name: "",
    //     document: "",
    //     email: "",
    //     address: {
    //       street: "",
    //       number: "",
    //       complement: "",
    //       neighborhood: "",
    //       city: "",
    //       state: "",
    //       cep: "",
    //     },
    //     phone: {
    //       ddd: "",
    //       prefix: "",
    //       suffix: "",
    //     },
    //     activePhoneSecondary: false,
    //     phoneSecondary: {
    //       ddd: "",
    //       prefix: "",
    //       suffix: "",
    //     },
    //     activePhoneTertiary: false,
    //     phoneTertiary: {
    //       ddd: "",
    //       prefix: "",
    //       suffix: "",
    //     },
    //   },
    // });
    // setStudentData({
    //   schoolId: "",
    //   schoolClassId: "",
    //   curriculumId: "",
    //   studentId: "",
    //   schoolCoursePriceUnit: 0,
    //   schoolCoursePriceBundle: 0,
    //   schoolCourseBundleDays: 0,
    // });
    // setNewStudentData({
    //   confirmAddFamily: false,
    //   confirmAddCurriculum: false,
    //   confirmAddExperimentalCurriculum: false,
    //   curriculum: "",
    //   curriculumName: "",
    //   curriculumClassDayId: "",
    //   curriculumInitialDate: "",
    //   curriculumCoursePriceUnit: 0,
    //   curriculumCoursePriceBundle: 0,
    //   curriculumCourseBundleDays: 0,
    //   experimentalCurriculum: "",
    //   experimentalCurriculumName: "",
    //   experimentalCurriculumClassDayId: "",
    //   experimentalCurriculumInitialDate: "",
    //   familyId: "",
    //   familyName: "",
    //   newFamilySchoolId: "",
    //   newFamilySchoolClassId: "",
    //   newFamilyCurriculumId: "",
    //   indexDays: [],
    // });
    // setDayIsAlreadyWithClass(false);
    // setNewClass({
    //   date: "",
    //   enrolledDays: [],
    //   name: "",
    // });
    // setCurriculumData({
    //   schoolId: "",
    //   schoolName: "",
    //   schoolClassId: "",
    //   schoolClassName: "",
    //   schoolCourseId: "",
    //   schoolCourseName: "",
    // });
    // setExperimentalCurriculumData({
    //   schoolId: "",
    //   schoolName: "",
    //   schoolClassId: "",
    //   schoolClassName: "",
    //   schoolCourseId: "",
    //   schoolCourseName: "",
    // });
    // setExcludeCurriculum([]);
    // setExcludeExperimentalCurriculum([]);
    // setExcludeFamily([]);
    // setStudentFamilyDetails([]);
    // setStudentCurriculumDetails([]);
    // reset();
  };

  // SET REACT HOOK FORM VALUES
  // useEffect(() => {
  //   // Section 1: Student Data
  //   setValue("id", studentEditData.id);
  //   setValue("name", studentEditData.name);
  //   setValue("birthDate", studentEditData.birthDate);
  //   setValue("classComplement", studentEditData.classComplement);
  //   setValue("parentOne.name", studentEditData.parentOne.name);
  //   setValue("parentOne.phone.ddd", studentEditData.parentOne.phone.ddd);
  //   setValue("parentOne.phone.prefix", studentEditData.parentOne.phone.prefix);
  //   setValue("parentOne.phone.suffix", studentEditData.parentOne.phone.suffix);
  //   setValue("parentOne.email", studentEditData.parentOne.email);
  //   setValue("parentTwo.name", studentEditData.parentTwo.name);
  //   setValue("parentTwo.phone.ddd", studentEditData.parentTwo.phone.ddd);
  //   setValue("parentTwo.phone.prefix", studentEditData.parentTwo.phone.prefix);
  //   setValue("parentTwo.phone.suffix", studentEditData.parentTwo.phone.suffix);
  //   setValue("parentTwo.email", studentEditData.parentTwo.email);

  //   // Section 2: Student Course and Family Data | Prices
  //   setValue("enrolmentExemption", studentEditData.enrolmentExemption);
  //   setValue("customDiscount", studentEditData.customDiscount);
  //   setValue(
  //     "customDiscountValue",
  //     studentEditData.customDiscountValue
  //       ? studentEditData.customDiscountValue
  //       : "0"
  //   );
  //   setValue("employeeDiscount", studentEditData.employeeDiscount);
  //   setValue("familyDiscount", studentEditData.familyDiscount);
  //   setValue("secondCourseDiscount", studentEditData.secondCourseDiscount);
  //   setValue("paymentDay", studentEditData.paymentDay);
  //   setValue("addCurriculum", studentEditData.addCurriculum);
  //   setValue(
  //     "addExperimentalCurriculum",
  //     studentEditData.addExperimentalCurriculum
  //   );
  //   setValue("addFamily", studentEditData.addFamily);
  //   setValue("enrolmentFee", studentEditData.enrolmentFee);
  //   setValue("fullPrice", newPrices.fullPrice);
  //   setValue("appliedPrice", newPrices.appliedPrice);
  //   setValue("customDiscount", studentEditData.customDiscount);
  //   setValue("customDiscountValue", studentEditData.customDiscountValue);
  //   setValue("employeeDiscount", studentEditData.employeeDiscount);
  //   setValue("enrolmentExemption", studentEditData.enrolmentExemption);
  //   setValue("familyDiscount", studentEditData.familyDiscount);
  //   setValue("secondCourseDiscount", studentEditData.secondCourseDiscount);

  //   // Section 3: Student Financial Responsible Data
  //   setValue(
  //     "financialResponsible.name",
  //     studentEditData.financialResponsible.name
  //   );
  //   setValue(
  //     "financialResponsible.document",
  //     studentEditData.financialResponsible.document
  //   );
  //   setValue(
  //     "financialResponsible.email",
  //     studentEditData.financialResponsible.email
  //   );
  //   setValue(
  //     "financialResponsible.address.street",
  //     studentEditData.financialResponsible.address.street
  //   );
  //   setValue(
  //     "financialResponsible.address.number",
  //     studentEditData.financialResponsible.address.number
  //   );
  //   setValue(
  //     "financialResponsible.address.complement",
  //     studentEditData.financialResponsible.address.complement
  //   );
  //   setValue(
  //     "financialResponsible.address.neighborhood",
  //     studentEditData.financialResponsible.address.neighborhood
  //   );
  //   setValue(
  //     "financialResponsible.address.city",
  //     studentEditData.financialResponsible.address.city
  //   );
  //   setValue(
  //     "financialResponsible.address.state",
  //     studentEditData.financialResponsible.address.state
  //   );
  //   setValue(
  //     "financialResponsible.address.cep",
  //     studentEditData.financialResponsible.address.cep
  //   );
  //   setValue(
  //     "financialResponsible.phone.ddd",
  //     studentEditData.financialResponsible.phone.ddd
  //   );
  //   setValue(
  //     "financialResponsible.phone.prefix",
  //     studentEditData.financialResponsible.phone.prefix
  //   );
  //   setValue(
  //     "financialResponsible.phone.suffix",
  //     studentEditData.financialResponsible.phone.suffix
  //   );
  //   setValue(
  //     "financialResponsible.activePhoneSecondary",
  //     studentEditData.financialResponsible.activePhoneSecondary
  //   );
  //   setValue(
  //     "financialResponsible.phoneSecondary.ddd",
  //     studentEditData.financialResponsible.phoneSecondary.ddd
  //   );
  //   setValue(
  //     "financialResponsible.phoneSecondary.prefix",
  //     studentEditData.financialResponsible.phoneSecondary.prefix
  //   );
  //   setValue(
  //     "financialResponsible.phoneSecondary.suffix",
  //     studentEditData.financialResponsible.phoneSecondary.suffix
  //   );
  //   setValue(
  //     "financialResponsible.activePhoneTertiary",
  //     studentEditData.financialResponsible.activePhoneTertiary
  //   );
  //   setValue(
  //     "financialResponsible.phoneTertiary.ddd",
  //     studentEditData.financialResponsible.phoneTertiary.ddd
  //   );
  //   setValue(
  //     "financialResponsible.phoneTertiary.prefix",
  //     studentEditData.financialResponsible.phoneTertiary.prefix
  //   );
  //   setValue(
  //     "financialResponsible.phoneTertiary.suffix",
  //     studentEditData.financialResponsible.phoneTertiary.suffix
  //   );
  // }, [studentEditData, newPrices, dateToString]);

  // SET REACT HOOK FORM ERRORS
  // useEffect(() => {
  //   const fullErrors = [
  //     // Section 1: Student Data
  //     errors.id,
  //     errors.name,
  //     errors.birthDate,
  //     errors.classComplement,
  //     errors.parentOne?.name,
  //     errors.parentOne?.email,
  //     errors.parentOne?.phone?.ddd,
  //     errors.parentOne?.phone?.prefix,
  //     errors.parentOne?.phone?.suffix,
  //     errors.parentTwo?.name,
  //     errors.parentTwo?.email,
  //     errors.parentTwo?.phone?.ddd,
  //     errors.parentTwo?.phone?.prefix,
  //     errors.parentTwo?.phone?.suffix,

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
  //     errors.financialResponsible?.phone?.prefix,
  //     errors.financialResponsible?.phone?.suffix,
  //     errors.financialResponsible?.activePhoneSecondary,
  //     errors.financialResponsible?.phoneSecondary?.ddd,
  //     errors.financialResponsible?.phoneSecondary?.prefix,
  //     errors.financialResponsible?.phoneSecondary?.suffix,
  //     errors.financialResponsible?.activePhoneTertiary,
  //     errors.financialResponsible?.phoneTertiary?.ddd,
  //     errors.financialResponsible?.phoneTertiary?.prefix,
  //     errors.financialResponsible?.phoneTertiary?.suffix,
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

  // SUBMIT DATA FUNCTION
  // const handleEditStudent: SubmitHandler<EditStudentValidationZProps> = async (
  //   data
  // ) => {
  //   setIsSubmitting(true);

  //   // CHEKING VALID FINANCIAL RESPONSIBLE DOCUMENT
  //   if (!testFinancialCPF) {
  //     return (
  //       setIsSubmitting(false),
  //       setExperimentalClassError(true),
  //       toast.error(
  //         "CPF do responsável financeiro é inválido, por favor verifique... ❕",
  //         {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         }
  //       )
  //     );
  //   }

  //   // CHEKING IF EXPERIMENTAL CLASS DATE WAS PICKED
  //   if (
  //     newStudentData.confirmAddExperimentalCurriculum &&
  //     newStudentData.experimentalCurriculumInitialDate === ""
  //   ) {
  //     return (
  //       setIsSubmitting(false),
  //       setExperimentalClassError(true),
  //       toast.error("Escolha a data da Aula Experimental... ❕", {
  //         theme: "colored",
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         autoClose: 3000,
  //       })
  //     );
  //   } else {
  //     setExperimentalClassError(false);
  //   }

  //   // CHEKING IF CURRICULUM INITIAL CLASS DATE WAS PICKED
  //   if (
  //     newStudentData.confirmAddCurriculum &&
  //     newStudentData.curriculumInitialDate === ""
  //   ) {
  //     return (
  //       setIsSubmitting(false),
  //       setNewClassError(true),
  //       toast.error("Escolha a data de início na nova modalidade... ❕", {
  //         theme: "colored",
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         autoClose: 3000,
  //       })
  //     );
  //   } else {
  //     setNewClassError(false);
  //   }

  //   // CHECK IF ADD EXPERIMENTAL CURRICULUM
  //   if (
  //     studentEditData.addExperimentalCurriculum &&
  //     !newStudentData.confirmAddExperimentalCurriculum
  //   ) {
  //     return (
  //       setIsSubmitting(false),
  //       toast.error(
  //         `Selecione uma nova Aula Experimental para incluir ou desmarque a opção "Adicionar Aula Experimental"...... ❕`,
  //         {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         }
  //       )
  //     );
  //   } else {
  //     // CHECK IF EXPERIMENTAL CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
  //     const checkExistentExperimentalCurriculum = [];
  //     studentCurriculumDetails!.map((curriculumDetail) => {
  //       if (
  //         curriculumDetail!.id === newStudentData.experimentalCurriculum &&
  //         curriculumDetail!.isExperimental
  //       ) {
  //         checkExistentExperimentalCurriculum.push(curriculumDetail!.id);
  //       }
  //     });
  //     if (checkExistentExperimentalCurriculum.length > 0) {
  //       return (
  //         setIsSubmitting(false),
  //         toast.error(
  //           `Aluno já fez uma Aula Experimental na modalidade selecionada. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
  //           {
  //             theme: "colored",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             autoClose: 3000,
  //           }
  //         )
  //       );
  //     }
  //     // CHECK IF STUDENT IS TRYING TO ADD EXPERIMENTAL CLASS INTO A COURSE THAT IS ALREADY ENROLLED
  //     const checkExistentCurriculum = [];
  //     studentCurriculumDetails!.map((curriculumDetail) => {
  //       if (
  //         curriculumDetail!.id === newStudentData.experimentalCurriculum &&
  //         !curriculumDetail!.isExperimental
  //       ) {
  //         checkExistentCurriculum.push(curriculumDetail!.id);
  //       }
  //     });
  //     if (checkExistentCurriculum.length > 0) {
  //       return (
  //         setIsSubmitting(false),
  //         toast.error(
  //           `Não é possível agendar uma aula experimental para uma modalidade a qual o Aluno já está matriculado. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
  //           {
  //             theme: "colored",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             autoClose: 3000,
  //           }
  //         )
  //       );
  //     }
  //   }

  //   // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS EXCLUDED
  //   const experimentalCurriculumLength = [];
  //   studentCurriculumDetails!.map((curriculumDetail) => {
  //     if (curriculumDetail!.isExperimental) {
  //       experimentalCurriculumLength.push(curriculumDetail!.id);
  //     }
  //   });
  //   if (
  //     newStudentExperimentalCurriculumArray.length !==
  //     experimentalCurriculumLength.length
  //   ) {
  //     excludeExperimentalCurriculum.map(async (curriculumToExclude) => {
  //       if (curriculumToExclude.exclude && curriculumToExclude.isExperimental) {
  //         // UPDATE STUDENT (DELETE EXPERIMENTAL CURRICULUM)
  //         await updateDoc(doc(db, "students", data.id), {
  //           experimentalCurriculumIds: arrayRemove({
  //             date: curriculumToExclude.date,
  //             id: curriculumToExclude.id,
  //             indexDays: [],
  //             isExperimental: curriculumToExclude.isExperimental,
  //             name: curriculumToExclude.name,
  //             price: curriculumToExclude.price,
  //           }),
  //         });

  //         // UPDATE CURRICULUM (DELETE EXPERIMENTAL STUDENT)
  //         await updateDoc(doc(db, "curriculum", curriculumToExclude.id), {
  //           experimentalStudents: arrayRemove({
  //             date: Timestamp.fromDate(
  //               new Date(newStudentData.curriculumInitialDate)
  //             ),
  //             id: data.id,
  //             isExperimental: curriculumToExclude.isExperimental,
  //             name: data.name,
  //             indexDays: curriculumToExclude.indexDays,
  //             price: curriculumToExclude.price,
  //           }),
  //         });
  //       }
  //     });
  //   }

  //   // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS INCLUDED
  //   if (studentEditData.addExperimentalCurriculum) {
  //     // UPDATE STUDENT (INSERT EXPERIMENTAL CURRICULUM)
  //     await updateDoc(doc(db, "students", data.id), {
  //       experimentalCurriculumIds: arrayUnion({
  //         date: Timestamp.fromDate(
  //           new Date(newStudentData.experimentalCurriculumInitialDate)
  //         ),
  //         id: newStudentData.experimentalCurriculum,
  //         indexDays: [],
  //         isExperimental: true,
  //         name: newStudentData.experimentalCurriculumName,
  //         price: newStudentData.curriculumCoursePriceBundle,
  //       }),
  //     });

  //     // UPDATE CURRICULUM (INSERT EXPERIMENTAL STUDENT)
  //     await updateDoc(
  //       doc(db, "curriculum", newStudentData.experimentalCurriculum),
  //       {
  //         experimentalStudents: arrayUnion({
  //           date: Timestamp.fromDate(
  //             new Date(newStudentData.experimentalCurriculumInitialDate)
  //           ),
  //           id: data.id,
  //           indexDays: [],
  //           isExperimental: true,
  //           name: data.name,
  //           price: newStudentData.curriculumCoursePriceBundle,
  //         }),
  //       }
  //     );
  //   }

  //   // CHECK IF ADD CURRICULUM AND CONFIRM ADD
  //   if (studentEditData.addCurriculum && !newStudentData.confirmAddCurriculum) {
  //     return (
  //       setIsSubmitting(false),
  //       toast.error(
  //         `Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
  //         {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         }
  //       )
  //     );
  //   } else {
  //     // CHECK IF CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
  //     const checkExistentCurriculum = [];
  //     studentCurriculumDetails!.map((curriculumDetail) => {
  //       if (
  //         curriculumDetail!.id === newStudentData.curriculum &&
  //         !curriculumDetail!.isExperimental
  //       ) {
  //         checkExistentCurriculum.push(curriculumDetail!.id);
  //       }
  //     });
  //     if (checkExistentCurriculum.length > 0) {
  //       return (
  //         setIsSubmitting(false),
  //         toast.error(
  //           `Aluno já matriculado na modalidade selecionada. Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
  //           {
  //             theme: "colored",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             autoClose: 3000,
  //           }
  //         )
  //       );
  //     }
  //   }

  //   // CHECK IF SOME CURRICULUM WAS EXCLUDED
  //   const curriculumLength = [];
  //   studentCurriculumDetails!.map((curriculumDetail) => {
  //     if (!curriculumDetail!.isExperimental) {
  //       curriculumLength.push(curriculumDetail!.id);
  //     }
  //   });
  //   if (newStudentCurriculumArray.length !== curriculumLength.length) {
  //     excludeCurriculum.map(async (curriculumToExclude) => {
  //       if (
  //         curriculumToExclude.exclude &&
  //         !curriculumToExclude.isExperimental
  //       ) {
  //         // UPDATE STUDENT (DELETE CURRICULUM)
  //         await updateDoc(doc(db, "students", data.id), {
  //           curriculumIds: arrayRemove({
  //             date: curriculumToExclude.date,
  //             id: curriculumToExclude.id,
  //             isExperimental: curriculumToExclude.isExperimental,
  //             name: curriculumToExclude.name,
  //             indexDays: curriculumToExclude.indexDays,
  //             price: curriculumToExclude.price,
  //           }),
  //         });

  //         // UPDATE CURRICULUM (DELETE STUDENT)
  //         await updateDoc(doc(db, "curriculum", curriculumToExclude.id), {
  //           students: arrayRemove({
  //             date: curriculumToExclude.date,
  //             id: data.id,
  //             isExperimental: curriculumToExclude.isExperimental,
  //             name: data.name,
  //             indexDays: curriculumToExclude.indexDays,
  //             price: curriculumToExclude.price,
  //           }),
  //         });
  //       }
  //     });
  //   }

  //   // CHECK IF SOME CURRICULUM WAS INCLUDED
  //   if (studentEditData.addCurriculum) {
  //     // UPDATE STUDENT (INSERT CURRICULUM)
  //     await updateDoc(doc(db, "students", data.id), {
  //       curriculumIds: arrayUnion({
  //         date: Timestamp.fromDate(
  //           new Date(newStudentData.curriculumInitialDate)
  //         ),
  //         id: newStudentData.curriculum,
  //         isExperimental: false,
  //         name: newStudentData.curriculumName,
  //         indexDays: newClass.enrolledDays,
  //         price: newStudentData.curriculumCoursePriceBundle,
  //       }),
  //     });

  //     // UPDATE CURRICULUM (INSERT STUDENT)
  //     await updateDoc(doc(db, "curriculum", newStudentData.curriculum), {
  //       students: arrayUnion({
  //         date: Timestamp.fromDate(
  //           new Date(newStudentData.curriculumInitialDate)
  //         ),
  //         id: data.id,
  //         indexDays: newClass.enrolledDays,
  //         isExperimental: false,
  //         name: data.name,
  //         price: newStudentData.curriculumCoursePriceBundle,
  //       }),
  //     });
  //   }

  //   // CHECK IF ADD FAMILY
  //   if (studentEditData.addFamily && !newStudentData.familyId) {
  //     return (
  //       setIsSubmitting(false),
  //       toast.error(
  //         `Selecione um familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
  //         {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         }
  //       )
  //     );
  //   }
  //   // CHECK CONFIRM ADD NEW FAMILY MEMBER
  //   if (newStudentData.familyId && !newStudentData.confirmAddFamily) {
  //     return (
  //       setIsSubmitting(false),
  //       toast.error(
  //         `Confirme a adição do familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
  //         {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         }
  //       )
  //     );
  //   }

  //   // CHECK IF NEW FAMILY MEMBER ALREADY EXISTS ON STUDENT DATABASE
  //   const checkExistentFamily = [];
  //   studentFamilyDetails!.map((familyDetail) => {
  //     if (familyDetail!.id === newStudentData.familyId) {
  //       checkExistentFamily.push(familyDetail.id);
  //     }
  //   });
  //   if (checkExistentFamily.length > 0) {
  //     return (
  //       setIsSubmitting(false),
  //       toast.error(
  //         `Familiar já consta na ficha do aluno. Selecione um novo familiar para incluir ou desmarque a opção "Adicionar Familiar"...... ❕`,
  //         {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         }
  //       )
  //     );
  //   }

  //   // CHECK IF SOME FAMILY WAS EXCLUDED
  //   if (
  //     newStudentFamilyArray.length !==
  //     studentSelectedData?.studentFamilyAtSchool.length
  //   ) {
  //     // VERIFY IF USER HAVE SOME FAMILY AFTER EXCLUSION
  //     let haveFamily = false;
  //     excludeFamily.map((family) => {
  //       if (!family.exclude) {
  //         haveFamily = true;
  //       }
  //     });

  //     excludeFamily.map(async (familyToExclude) => {
  //       if (familyToExclude.exclude) {
  //         // UPDATE STUDENT (DELETE FAMILY FROM STUDENT DATABASE)
  //         await updateDoc(doc(db, "students", data.id), {
  //           familyDiscount: haveFamily,
  //           studentFamilyAtSchool: arrayRemove({
  //             applyDiscount: familyToExclude.applyDiscount,
  //             id: familyToExclude.id,
  //             name: familyToExclude.name,
  //           }),
  //         });

  //         // IF YOU ADDED FAMILY IN BOTH DIRECTIONS UNCOMMENT THIS SECTION FOR DELETE STUDENT FROM FAMILY DATABASE
  //         // UPDATE FAMILY (DELETE STUDENT FROM FAMILY DATABASE)

  //         // IF APPLY DISCOUNT OF ACCOUNT TO EDIT IS FALSE THEN GO TO FAMILY (WHICH IS REQUIRED TO BE TRUE ON APPLY DISCOUNT), EXCLUDE FAMILY AND RECALCULATE DISCOUNT
  //         if (!familyToExclude.applyDiscount) {
  //           const familyData = studentsDatabaseData.find(
  //             (student) => student.id === familyToExclude.id
  //           );
  //           if (familyData) {
  //             let otherFamilyApplyDiscount = false;
  //             familyData.studentFamilyAtSchool.map((family) => {
  //               if (family.applyDiscount) {
  //                 otherFamilyApplyDiscount = true;
  //               }
  //             });
  //             if (!otherFamilyApplyDiscount) {
  //               await updateDoc(doc(db, "students", familyToExclude.id), {
  //                 familyDiscount: otherFamilyApplyDiscount,
  //                 studentFamilyAtSchool: arrayRemove({
  //                   applyDiscount: !familyToExclude.applyDiscount,
  //                   id: data.id,
  //                   name: data.name,
  //                 }),
  //               });
  //             } else {
  //               if (familyData.curriculumIds.length <= 1) {
  //                 await updateDoc(doc(db, "students", familyToExclude.id), {
  //                   familyDiscount: otherFamilyApplyDiscount,
  //                   studentFamilyAtSchool: arrayRemove({
  //                     applyDiscount: !familyToExclude.applyDiscount,
  //                     id: data.id,
  //                     name: data.name,
  //                   }),
  //                   appliedPrice: familyData.fullPrice,
  //                 });
  //               } else {
  //                 let biggerPrice = 0;
  //                 let othersPricesSum = 0;
  //                 familyData.curriculumIds.map((curriculum) => {
  //                   if (curriculum.price > biggerPrice) {
  //                     biggerPrice = curriculum.price;
  //                   } else {
  //                     othersPricesSum = othersPricesSum + curriculum.price;
  //                   }
  //                 });
  //                 await updateDoc(doc(db, "students", familyToExclude.id), {
  //                   familyDiscount: otherFamilyApplyDiscount,
  //                   studentFamilyAtSchool: arrayRemove({
  //                     applyDiscount: !familyToExclude.applyDiscount,
  //                     id: data.id,
  //                     name: data.name,
  //                   }),
  //                   appliedPrice:
  //                     biggerPrice * secondCourseDiscountValue + othersPricesSum,
  //                   fullPrice: biggerPrice + othersPricesSum,
  //                 });
  //               }
  //             }
  //           }
  //         } else {
  //           await updateDoc(doc(db, "students", familyToExclude.id), {
  //             familyDiscount: haveFamily,
  //             studentFamilyAtSchool: arrayRemove({
  //               applyDiscount: !familyToExclude.applyDiscount,
  //               id: data.id,
  //               name: data.name,
  //             }),
  //           });
  //         }
  //       }
  //     });
  //   }

  //   // CHECK IF SOME FAMILY WAS INCLUDED
  //   if (studentEditData.addFamily) {
  //     const addNewFamily = async () => {
  //       // UPDATE STUDENT (INSERT FAMILY TO STUDENT DATABASE)
  //       await updateDoc(doc(db, "students", data.id), {
  //         familyDiscount: true,
  //         studentFamilyAtSchool: arrayUnion({
  //           applyDiscount: true,
  //           id: newStudentData.familyId,
  //           name: newStudentData.familyName,
  //         }),
  //       });

  //       // IF YOU WANT CREATE FAMILY IN BOTH DIRECTIONS UNCOMMENT THIS SECTION FOR INSERT STUDENT TO FAMILY DATABASE
  //       // UPDATE FAMILY (INSERT STUDENT TO FAMILY DATABASE)
  //       await updateDoc(doc(db, "students", newStudentData.familyId), {
  //         studentFamilyAtSchool: arrayUnion({
  //           applyDiscount: false,
  //           id: data.id,
  //           name: data.name,
  //         }),
  //       });
  //     };
  //     addNewFamily();
  //   }

  //   // CHEKING VALID SECONDARY PHONE
  //   if (studentEditData.financialResponsible.activePhoneSecondary) {
  //     if (studentEditData.financialResponsible.phoneSecondary.ddd === "DDD") {
  //       return (
  //         setIsSubmitting(false),
  //         toast.error(
  //           `Preencha o número de telefone 2 ou desmarque a opção "incluir"...... ❕`,
  //           {
  //             theme: "colored",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             autoClose: 3000,
  //           }
  //         )
  //       );
  //     }
  //   }

  //   // CHEKING VALID TERTIARY PHONE
  //   if (studentEditData.financialResponsible.activePhoneTertiary) {
  //     if (studentEditData.financialResponsible.phoneTertiary.ddd === "DDD") {
  //       return (
  //         setIsSubmitting(false),
  //         toast.error(
  //           `Preencha o número de telefone 3 ou desmarque a opção "incluir"...... ❕`,
  //           {
  //             theme: "colored",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             autoClose: 3000,
  //           }
  //         )
  //       );
  //     }
  //   }

  //   // CHECKING IF STUDENT EXISTS ON CURRRICULUM DATABASE
  //   const foundedStudent = studentsDatabaseData.find(
  //     (student) => student.id === data.id
  //   );

  //   if (!foundedStudent) {
  //     // IF NO EXISTS, RETURN ERROR
  //     return (
  //       setIsSubmitting(false),
  //       toast.error(`Aluno não existe no banco de dados...... ❕`, {
  //         theme: "colored",
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         autoClose: 3000,
  //       })
  //     );
  //   } else {
  //     // IF EXISTS, EDIT
  //     // STUDENT DATA OBJECT
  //     const updateData = {
  //       // Section 1: Student Data
  //       name: data.name,
  //       birthDate: Timestamp.fromDate(new Date(dateSubmitToString)),
  //       classComplement: data.classComplement,
  //       "parentOne.name": data.parentOne.name,
  //       "parentOne.email": data.parentOne.email,
  //       "parentOne.phone": `+55${data.parentOne.phone.ddd}${data.parentOne.phone.prefix}${data.parentOne.phone.suffix}`,
  //       "parentTwo.name": data.parentTwo.name,
  //       "parentTwo.email": data.parentTwo.email,
  //       "parentTwo.phone": `+55${data.parentTwo.phone.ddd}${data.parentTwo.phone.prefix}${data.parentTwo.phone.suffix}`,

  //       // Section 2: Student Course and Family Data | Prices
  //       enrolmentExemption: data.enrolmentExemption,
  //       enrolmentFee: data.enrolmentFee,
  //       enrolmentFeePaid: data.enrolmentFeePaid,
  //       fullPrice: data.fullPrice,
  //       appliedPrice: data.appliedPrice,
  //       customDiscount: data.customDiscount,
  //       customDiscountValue: data.customDiscountValue,
  //       employeeDiscount: data.employeeDiscount,
  //       secondCourseDiscount: data.secondCourseDiscount,
  //       paymentDay: data.paymentDay,

  //       // Section 3: Student Financial Responsible Data
  //       "financialResponsible.name": data.financialResponsible.name,
  //       "financialResponsible.document": data.financialResponsible.document,
  //       "financialResponsible.email": data.financialResponsible.email,
  //       "financialResponsible.address.street":
  //         data.financialResponsible.address.street,
  //       "financialResponsible.address.number":
  //         data.financialResponsible.address.number,
  //       "financialResponsible.address.complement":
  //         data.financialResponsible.address.complement,
  //       "financialResponsible.address.neighborhood":
  //         data.financialResponsible.address.neighborhood,
  //       "financialResponsible.address.city":
  //         data.financialResponsible.address.city,
  //       "financialResponsible.address.state":
  //         data.financialResponsible.address.state,
  //       "financialResponsible.address.cep":
  //         data.financialResponsible.address.cep,
  //       "financialResponsible.phone": `+55${data.financialResponsible.phone.ddd}${data.financialResponsible.phone.prefix}${data.financialResponsible.phone.suffix}`,
  //       "financialResponsible.phoneSecondary":
  //         data.financialResponsible.phoneSecondary.ddd === "DDD"
  //           ? ""
  //           : `+55${data.financialResponsible.phoneSecondary.ddd}${data.financialResponsible.phoneSecondary.prefix}${data.financialResponsible.phoneSecondary.suffix}`,
  //       "financialResponsible.phoneTertiary":
  //         data.financialResponsible.phoneTertiary.ddd === "DDD"
  //           ? ""
  //           : `+55${data.financialResponsible.phoneTertiary.ddd}${data.financialResponsible.phoneTertiary.prefix}${data.financialResponsible.phoneTertiary.suffix}`,

  //       // Section 4: Student Contract Data
  //       // Accept Contract: boolean
  //       // Contract attached (pdf)

  //       // Section 5: Last Updated Time
  //       updatedAt: serverTimestamp(),
  //     };
  //     // CHECK IF STUDENT NAME IS CHANGED FOR UPDATE CURRICULUM AND FAMILY REGISTER
  //     // CURRICULUM
  //     studentCurriculumDetails!.map((studentCurriculum) => {
  //       curriculumDatabaseData.map((databaseCurriculum) => {
  //         if (databaseCurriculum.id === studentCurriculum.id) {
  //           databaseCurriculum.students.map(
  //             async (databaseCurriculumStudent) => {
  //               if (
  //                 databaseCurriculumStudent.id === data.id &&
  //                 databaseCurriculumStudent.name !== data.name
  //               ) {
  //                 if (!databaseCurriculumStudent.isExperimental) {
  //                   await updateDoc(
  //                     doc(db, "curriculum", databaseCurriculum.id),
  //                     {
  //                       students: arrayRemove({
  //                         date: databaseCurriculumStudent.date,
  //                         id: databaseCurriculumStudent.id,
  //                         indexDays: databaseCurriculumStudent.indexDays,
  //                         isExperimental:
  //                           databaseCurriculumStudent.isExperimental,
  //                         name: databaseCurriculumStudent.name,
  //                         price: databaseCurriculumStudent.price,
  //                       }),
  //                     }
  //                   );
  //                   await updateDoc(
  //                     doc(db, "curriculum", databaseCurriculum.id),
  //                     {
  //                       students: arrayUnion({
  //                         date: databaseCurriculumStudent.date,
  //                         id: databaseCurriculumStudent.id,
  //                         indexDays: databaseCurriculumStudent.indexDays,
  //                         isExperimental:
  //                           databaseCurriculumStudent.isExperimental,
  //                         name: data.name,
  //                         price: databaseCurriculumStudent.price,
  //                       }),
  //                     }
  //                   );
  //                 } else {
  //                   await updateDoc(
  //                     doc(db, "curriculum", databaseCurriculum.id),
  //                     {
  //                       experimentalStudents: arrayRemove({
  //                         date: databaseCurriculumStudent.date,
  //                         id: databaseCurriculumStudent.id,
  //                         indexDays: [],
  //                         isExperimental:
  //                           databaseCurriculumStudent.isExperimental,
  //                         name: databaseCurriculumStudent.name,
  //                         price: databaseCurriculumStudent.price,
  //                       }),
  //                     }
  //                   );
  //                   await updateDoc(
  //                     doc(db, "curriculum", databaseCurriculum.id),
  //                     {
  //                       experimentalStudents: arrayUnion({
  //                         date: databaseCurriculumStudent.date,
  //                         id: databaseCurriculumStudent.id,
  //                         indexDays: [],
  //                         isExperimental:
  //                           databaseCurriculumStudent.isExperimental,
  //                         name: data.name,
  //                         price: databaseCurriculumStudent.price,
  //                       }),
  //                     }
  //                   );
  //                 }
  //               }
  //             }
  //           );
  //         }
  //       });
  //     });
  //     // FAMILY
  //     studentFamilyDetails!.map((studentFamily) => {
  //       studentsDatabaseData.map((databaseStudent) => {
  //         if (databaseStudent.id === studentFamily.id) {
  //           databaseStudent.studentFamilyAtSchool.map(
  //             async (databaseFamilyStudent) => {
  //               if (
  //                 databaseFamilyStudent.id === data.id &&
  //                 databaseFamilyStudent.name !== data.name
  //               ) {
  //                 await updateDoc(doc(db, "students", databaseStudent.id), {
  //                   studentFamilyAtSchool: arrayRemove({
  //                     applyDiscount: databaseFamilyStudent.applyDiscount,
  //                     id: databaseFamilyStudent.id,
  //                     name: databaseFamilyStudent.name,
  //                   }),
  //                 });
  //                 await updateDoc(doc(db, "students", databaseStudent.id), {
  //                   studentFamilyAtSchool: arrayUnion({
  //                     applyDiscount: databaseFamilyStudent.applyDiscount,
  //                     id: databaseFamilyStudent.id,
  //                     name: data.name,
  //                   }),
  //                 });
  //               }
  //             }
  //           );
  //         }
  //       });
  //     });
  //     // EDIT STUDENT FUNCTION
  //     const editStudent = async () => {
  //       try {
  //         await updateDoc(doc(db, "students", data.id), updateData);
  //         resetForm();
  //         toast.success(`${data.name} alterado com sucesso! 👌`, {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         });
  //         setIsSubmitting(false);
  //       } catch (error) {
  //         console.log("ESSE É O ERROR", error);
  //         toast.error(`Ocorreu um erro... 🤯`, {
  //           theme: "colored",
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           autoClose: 3000,
  //         });
  //         setIsSubmitting(false);
  //       }
  //     };
  //     editStudent();
  //   }
  // };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Editar Aluno</h1>

      {/* SCHOOL SELECT */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="schoolSelect"
          className={
            // errors.name
            //   ? "w-1/4 text-right text-red-500 dark:text-red-400"
            //   :
            "w-1/4 text-right"
          }
        >
          Selecione a Escola:{" "}
        </label>
        <select
          id="schoolSelect"
          defaultValue={" -- select an option -- "}
          disabled={isEdit}
          className={
            // errors.name
            //   ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
            //   :
            "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          name="schoolSelect"
          onChange={(e) => {
            setStudentData({
              ...studentData,
              schoolId: e.target.value,
            });
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
            // errors.name
            //   ? "w-1/4 text-right text-red-500 dark:text-red-400"
            //   :
            "w-1/4 text-right"
          }
        >
          Selecione o Ano Escolar:{" "}
        </label>
        <select
          id="schoolClassSelect"
          defaultValue={" -- select an option -- "}
          disabled={isEdit ? true : studentData.schoolId ? false : true}
          className={
            studentData.schoolId
              ? // errors.name
                //   ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                //   :
                "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
          }
          name="schoolClassSelect"
          onChange={(e) => {
            setStudentData({
              ...studentData,
              schoolClassId: e.target.value,
            });
          }}
        >
          <SelectOptions
            returnId
            dataType="schoolClasses"
            schoolId={studentData.schoolId}
          />
        </select>
      </div>

      {/* CURRICULUM SELECT */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="curriculumSelect"
          className={
            // errors.name
            //   ? "w-1/4 text-right text-red-500 dark:text-red-400"
            //   :
            "w-1/4 text-right"
          }
        >
          Selecione a Modalidade:{" "}
        </label>
        <select
          id="curriculumSelect"
          defaultValue={" -- select an option -- "}
          disabled={isEdit ? true : studentData.schoolClassId ? false : true}
          className={
            studentData.schoolId
              ? // errors.name
                //   ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                //   :
                "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
          }
          name="curriculumSelect"
          onChange={(e) => {
            setStudentData({
              ...studentData,
              curriculumId: e.target.value,
            });
          }}
        >
          <SelectOptions
            returnId
            dataType="curriculum"
            displaySchoolCourseAndSchedule
            schoolId={studentData.schoolId}
            schoolClassId={studentData.schoolClassId}
          />
        </select>
      </div>

      {/* STUDENT SELECT */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="studentSelect"
          className={
            // errors.name
            //   ? "w-1/4 text-right text-red-500 dark:text-red-400"
            // :
            "w-1/4 text-right"
          }
        >
          Selecione o Aluno:{" "}
        </label>
        <select
          id="studentSelect"
          defaultValue={" -- select an option -- "}
          disabled={isEdit ? true : studentData.curriculumId ? false : true}
          className={
            studentData.schoolId
              ? // errors.name
                //   ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                //   :
                "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
          }
          name="studentSelect"
          onChange={(e) => {
            setStudentData({
              ...studentData,
              studentId: e.target.value,
            });
            setIsSelected(true);
          }}
        >
          <SelectOptions
            returnId
            dataType="searchStudent"
            curriculumId={studentData.curriculumId}
          />
        </select>
      </div>

      {isSelected && (
        <>
          {/* EDIT BUTTON */}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              type="button"
              className={
                isEdit
                  ? // || studentEditData.id === ""
                    "w-3/4 border rounded-xl border-green-900/10 bg-amber-500/70 dark:bg-amber-500/40 disabled:border-green-900/10 text-white"
                  : "w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500  text-white"
              }
              onClick={() => {
                if (!isEdit) {
                  setIsEdit(true);
                } else {
                  resetForm();
                }
              }}
            >
              {!isEdit
                ? // studentEditData.id !== ""
                  // ?
                  "Editar"
                : // : "Carregando..."
                  "Nova Pesquisa"}
            </button>
          </div>
        </>
      )}

      {isEdit && (
        <EditStudentForm
          studentId={studentData.studentId}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setStudentData={setStudentData}
        />
      )}
    </div>
  );
}
