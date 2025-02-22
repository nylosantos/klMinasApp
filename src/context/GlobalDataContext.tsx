/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { app, initFirebase } from "../db/Firebase";
import { Auth, getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  ClassDaySearchProps,
  CurriculumArrayProps,
  CurriculumSearchProps,
  CurriculumWithNamesProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  StudentSearchProps,
  SystemConstantsSearchProps,
  TeacherSearchProps,
  UserFullDataProps,
} from "../@types";
import { toast } from "react-toastify";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreError,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";

export type SetPageProps = {
  prev: "Dashboard" | "Settings" | "ManageSchools" | "ManageUsers";
  show: "Dashboard" | "Settings" | "ManageSchools" | "ManageUsers";
};

type HandleCurriculumDetailsProps = {
  schoolId: string;
  schoolClassId: string;
};

interface HandleCurriculumDetailsWithScoolCourseProps
  extends HandleCurriculumDetailsProps {
  schoolCourseId: string;
}

export type GlobalDataContextType = {
  auth: Auth;
  checkUser: boolean;
  isExperimentalClass: boolean;
  isSubmitting: boolean;
  login: boolean;
  logged: boolean;
  page: SetPageProps;
  // NEW DATABASE DATA
  schoolsDb: DocumentData[] | undefined;
  schoolsDbError: FirestoreError | undefined;
  schoolsDbLoading: boolean;
  schoolClassesDb: DocumentData[] | undefined;
  schoolClassesDbError: FirestoreError | undefined;
  schoolClassesDbLoading: boolean;
  schoolCoursesDb: DocumentData[] | undefined;
  schoolCoursesDbError: FirestoreError | undefined;
  schoolCoursesDbLoading: boolean;
  schedulesDb: DocumentData[] | undefined;
  schedulesDbError: FirestoreError | undefined;
  schedulesDbLoading: boolean;
  teachersDb: DocumentData[] | undefined;
  teachersDbError: FirestoreError | undefined;
  teachersDbLoading: boolean;
  curriculumDb: DocumentData[] | undefined;
  curriculumDbError: FirestoreError | undefined;
  curriculumDbLoading: boolean;
  studentsDb: DocumentData[] | undefined;
  studentsDbError: FirestoreError | undefined;
  studentsDbLoading: boolean;
  classDaysDb: DocumentData[] | undefined;
  classDaysDbError: FirestoreError | undefined;
  classDaysDbLoading: boolean;
  appUsersDb: DocumentData[] | undefined;
  appUsersDbError: FirestoreError | undefined;
  appUsersDbLoading: boolean;
  systemConstantsDb: DocumentData[] | undefined;
  systemConstantsDbError: FirestoreError | undefined;
  systemConstantsDbLoading: boolean;
  // DATABASE DATA
  appUsersDatabaseData: UserFullDataProps[];
  schoolDatabaseData: SchoolSearchProps[];
  schoolClassDatabaseData: SchoolClassSearchProps[];
  schoolCourseDatabaseData: SchoolCourseSearchProps[];
  scheduleDatabaseData: ScheduleSearchProps[];
  teacherDatabaseData: TeacherSearchProps[];
  curriculumDatabaseData: CurriculumSearchProps[];
  studentsDatabaseData: StudentSearchProps[];
  classDaysDatabaseData: ClassDaySearchProps[];
  systemConstantsDatabaseData: SystemConstantsSearchProps[];
  systemConstantsValues: SystemConstantsSearchProps | undefined;
  // END OF DATABASE DATA
  theme: "dark" | "light" | null;
  user: User | null | undefined;
  userFullData: UserFullDataProps | undefined;
  userLoading: boolean;
  handleAllCurriculumDetails: ({
    schoolId,
    schoolClassId,
  }: HandleCurriculumDetailsProps) => CurriculumWithNamesProps[];
  handleCurriculumDetailsWithSchoolCourse: ({
    schoolId,
    schoolClassId,
    schoolCourseId,
  }: HandleCurriculumDetailsWithScoolCourseProps) => CurriculumWithNamesProps[];
  calcStudentPrice: (studentId: string) => Promise<void>;
  calcStudentPrice2: (studentId: string) => Promise<void>;
  formatCurriculumName: (id: string) => string;
  handleDeleteCurriculum: (
    curriculumId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) => void;
  handleDeleteCourse: (
    courseId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) => void;
  handleDeleteSchedule: (
    scheduleId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) => void;
  handleDeleteSchool: (
    schoolId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) => void;
  handleDeleteStudent: (
    studentId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) => void;
  handleDeleteTeacher: (
    teacherId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) => void;
  handleOneCurriculumDetails: (id: string) => CurriculumWithNamesProps;
  handleOneStudentDetails: (id: string) => StudentSearchProps | undefined;
  setCheckUser: (option: boolean) => void;
  setIsExperimentalClass: (option: boolean) => void;
  setIsSubmitting: (option: boolean) => void;
  setLogged: (option: boolean) => void;
  setLogin: (option: boolean) => void;
  setPage: (newPage: SetPageProps) => void;
  setTheme: (option: "dark" | "light") => void;
};

export const GlobalDataContext = createContext<GlobalDataContextType | null>(
  null
);

interface PostsContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export const GlobalDataProvider = ({ children }: PostsContextProviderProps) => {
  // THEME STATE
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  // LISTENING TO THEME CHANGES
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  // CHANGING THEME CLASS TO BODY
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // GLOBAL SUBMITING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // INITIALIZING FIREBASE
  initFirebase();

  // FIREBASE AUTH
  const auth = getAuth();

  // USER AUTH STATE
  const [user, userLoading] = useAuthState(auth);

  // USER LOGGED STATE
  const [logged, setLogged] = useState(false);

  // LOGIN/REGISTER STATE
  const [login, setLogin] = useState(true);

  // USER DATA STATE
  const [userFullData, setUserFullData] = useState<UserFullDataProps>();

  // CHECK USER TRIGGER STATE
  const [checkUser, setCheckUser] = useState(false);

  // DELETE USER CLOUD FUNCTION HOOK
  const [deleteAppUser] = useHttpsCallable(getFunctions(app), "deleteAppUser");

  // HANDLE USER DATA FUNCTION
  const handleUserFullData = async (user: User | null | undefined) => {
    if (user !== null && user !== undefined) {
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const promises: UserFullDataProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as UserFullDataProps;
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        if (results) {
          handleData();
          setUserFullData(results[0]);
          setLogin(false);
        }
      });
    } else
      return (
        console.log("User is undefined..."),
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
  };

  // HANDLE CURRICULUM DETAILS (NAMES)
  function handleAllCurriculumDetails({
    schoolId,
    schoolClassId,
  }: HandleCurriculumDetailsProps) {
    const curriculumsToShow: CurriculumWithNamesProps[] = [];
    let curriculumToPush: CurriculumWithNamesProps = {
      publicId: 0,
      id: "",
      schoolId: "",
      schoolName: "",
      schoolClassIds: [],
      schoolClassNames: [],
      schoolCourseId: "",
      schoolCourseName: "",
      classDayId: "",
      classDayName: "",
      classDayIndexDays: [],
      scheduleId: "",
      scheduleName: "",
      teacherId: "",
      teacherName: "",
      students: [],
      experimentalStudents: [],
      waitingList: [],
      placesAvailable: 0,
      updatedAt: new Date(),
    };

    curriculumDatabaseData.map((curriculum) => {
      if (
        curriculum.schoolId === schoolId &&
        curriculum.schoolClassIds.includes(schoolClassId)
      ) {
        curriculumToPush = {
          ...curriculumToPush,
          publicId: curriculum.publicId,
          id: curriculum.id,
          schoolId: curriculum.schoolId,
          schoolClassIds: curriculum.schoolClassIds,
          schoolCourseId: curriculum.schoolCourseId,
          classDayId: curriculum.classDayId,
          scheduleId: curriculum.scheduleId,
          teacherId: curriculum.teacherId,
          students: curriculum.students,
          experimentalStudents: curriculum.experimentalStudents,
          placesAvailable: curriculum.placesAvailable,
          waitingList: curriculum.waitingList,
          updatedAt: curriculum.updatedAt,
        };
        schoolDatabaseData.map((school) => {
          if (school.id === curriculum.schoolId) {
            curriculumToPush = {
              ...curriculumToPush,
              schoolName: school.name,
            };
          }
        });
        const schoolClassNames: string[] = [];
        schoolClassDatabaseData.map((schoolClass) => {
          if (curriculum.schoolClassIds.includes(schoolClass.id)) {
            schoolClassNames.push(schoolClass.name);
          }
        });
        curriculumToPush = {
          ...curriculumToPush,
          schoolClassNames: schoolClassNames,
        };
        schoolCourseDatabaseData.map((schoolCourse) => {
          if (schoolCourse.id === curriculum.schoolCourseId) {
            curriculumToPush = {
              ...curriculumToPush,
              schoolCourseName: schoolCourse.name,
            };
          }
        });
        classDaysDatabaseData.map((classDay) => {
          if (classDay.id === curriculum.classDayId) {
            curriculumToPush = {
              ...curriculumToPush,
              classDayName: classDay.name,
              classDayIndexDays: classDay.indexDays,
            };
          }
        });
        scheduleDatabaseData.map((schedule) => {
          if (schedule.id === curriculum.scheduleId) {
            curriculumToPush = {
              ...curriculumToPush,
              scheduleName: schedule.name,
            };
          }
        });
        teacherDatabaseData.map((teacher) => {
          if (teacher.id === curriculum.teacherId) {
            curriculumToPush = {
              ...curriculumToPush,
              teacherName: teacher.name,
            };
          }
        });
        curriculumsToShow.push(curriculumToPush);
      }
    });
    return curriculumsToShow;
  }

  // HANDLE CURRICULUM DETAILS (NAMES) OF ONE SCHOOL COURSE
  function handleCurriculumDetailsWithSchoolCourse({
    schoolId,
    schoolClassId,
    schoolCourseId,
  }: HandleCurriculumDetailsWithScoolCourseProps) {
    const curriculumsToShow: CurriculumWithNamesProps[] = [];
    let curriculumToPush: CurriculumWithNamesProps = {
      publicId: 0,
      id: "",
      schoolId: "",
      schoolName: "",
      schoolClassIds: [],
      schoolClassNames: [],
      schoolCourseId: "",
      schoolCourseName: "",
      classDayId: "",
      classDayName: "",
      classDayIndexDays: [],
      scheduleId: "",
      scheduleName: "",
      teacherId: "",
      teacherName: "",
      students: [],
      experimentalStudents: [],
      waitingList: [],
      placesAvailable: 0,
      updatedAt: new Date(),
    };

    curriculumDatabaseData.map((curriculum) => {
      if (
        curriculum.schoolId === schoolId &&
        curriculum.schoolClassIds.includes(schoolClassId) &&
        curriculum.schoolCourseId === schoolCourseId
      ) {
        curriculumToPush = {
          ...curriculumToPush,
          publicId: curriculum.publicId,
          id: curriculum.id,
          schoolId: curriculum.schoolId,
          schoolClassIds: curriculum.schoolClassIds,
          schoolCourseId: curriculum.schoolCourseId,
          classDayId: curriculum.classDayId,
          scheduleId: curriculum.scheduleId,
          teacherId: curriculum.teacherId,
          students: curriculum.students,
          experimentalStudents: curriculum.experimentalStudents,
          placesAvailable: curriculum.placesAvailable,
          waitingList: curriculum.waitingList,
          updatedAt: curriculum.updatedAt,
        };
        schoolDatabaseData.map((school) => {
          if (school.id === curriculum.schoolId) {
            curriculumToPush = {
              ...curriculumToPush,
              schoolName: school.name,
            };
          }
        });
        const schoolClassNames: string[] = [];
        schoolClassDatabaseData.map((schoolClass) => {
          if (curriculum.schoolClassIds.includes(schoolClass.id)) {
            schoolClassNames.push(schoolClass.name);
          }
        });
        curriculumToPush = {
          ...curriculumToPush,
          schoolClassNames: schoolClassNames,
        };
        schoolCourseDatabaseData.map((schoolCourse) => {
          if (schoolCourse.id === curriculum.schoolCourseId) {
            curriculumToPush = {
              ...curriculumToPush,
              schoolCourseName: schoolCourse.name,
            };
          }
        });
        classDaysDatabaseData.map((classDay) => {
          if (classDay.id === curriculum.classDayId) {
            curriculumToPush = {
              ...curriculumToPush,
              classDayName: classDay.name,
              classDayIndexDays: classDay.indexDays,
            };
          }
        });
        scheduleDatabaseData.map((schedule) => {
          if (schedule.id === curriculum.scheduleId) {
            curriculumToPush = {
              ...curriculumToPush,
              scheduleName: schedule.name,
            };
          }
        });
        teacherDatabaseData.map((teacher) => {
          if (teacher.id === curriculum.teacherId) {
            curriculumToPush = {
              ...curriculumToPush,
              teacherName: teacher.name,
            };
          }
        });
        curriculumsToShow.push(curriculumToPush);
      }
    });
    return curriculumsToShow;
  }

  // HANDLE CURRICULUM DETAILS (NAMES) OF ONE SCHOOL COURSE
  function handleOneCurriculumDetails(id: string) {
    let curriculumToShow: CurriculumWithNamesProps = {
      publicId: 0,
      id: "",
      schoolId: "",
      schoolName: "",
      schoolClassIds: [],
      schoolClassNames: [],
      schoolCourseId: "",
      schoolCourseName: "",
      classDayId: "",
      classDayName: "",
      classDayIndexDays: [],
      scheduleId: "",
      scheduleName: "",
      teacherId: "",
      teacherName: "",
      placesAvailable: 0,
      students: [],
      experimentalStudents: [],
      waitingList: [],
      updatedAt: new Date(),
    };

    const foundedCurriculum: CurriculumSearchProps | undefined =
      curriculumDatabaseData.find((curriculum) => curriculum.id === id);

    if (foundedCurriculum) {
      curriculumToShow = {
        ...curriculumToShow,
        publicId: foundedCurriculum.publicId,
        placesAvailable: foundedCurriculum.placesAvailable,
        students: foundedCurriculum.students,
        experimentalStudents: foundedCurriculum.experimentalStudents,
        waitingList: foundedCurriculum.waitingList,
        id: foundedCurriculum.id,
        schoolId: foundedCurriculum.schoolId,
        schoolClassIds: foundedCurriculum.schoolClassIds,
        schoolCourseId: foundedCurriculum.schoolCourseId,
        classDayId: foundedCurriculum.classDayId,
        scheduleId: foundedCurriculum.scheduleId,
        teacherId: foundedCurriculum.teacherId,
      };
      schoolDatabaseData.map((school) => {
        if (school.id === foundedCurriculum.schoolId) {
          curriculumToShow = {
            ...curriculumToShow,
            schoolName: school.name,
          };
        }
      });
      const schoolClassNames: string[] = [];
      schoolClassDatabaseData.map((schoolClass) => {
        if (foundedCurriculum.schoolClassIds.includes(schoolClass.id)) {
          schoolClassNames.push(schoolClass.name);
        }
      });
      curriculumToShow = {
        ...curriculumToShow,
        schoolClassNames: schoolClassNames,
      };
      schoolCourseDatabaseData.map((schoolCourse) => {
        if (schoolCourse.id === foundedCurriculum.schoolCourseId) {
          curriculumToShow = {
            ...curriculumToShow,
            schoolCourseName: schoolCourse.name,
          };
        }
      });
      classDaysDatabaseData.map((classDay) => {
        if (classDay.id === foundedCurriculum.classDayId) {
          curriculumToShow = {
            ...curriculumToShow,
            classDayName: classDay.name,
            classDayIndexDays: classDay.indexDays,
          };
        }
      });
      scheduleDatabaseData.map((schedule) => {
        if (schedule.id === foundedCurriculum.scheduleId) {
          curriculumToShow = {
            ...curriculumToShow,
            scheduleName: schedule.name,
          };
        }
      });
      teacherDatabaseData.map((teacher) => {
        if (teacher.id === foundedCurriculum.teacherId) {
          curriculumToShow = {
            ...curriculumToShow,
            teacherName: teacher.name,
          };
        }
      });
    }
    return curriculumToShow;
  }

  // FORMAT CURRICULUM NAME TO SHOW FUNCTION
  function formatCurriculumName(id: string) {
    const curriculumDetails = handleOneCurriculumDetails(id);
    const curriculumFormattedName = `${curriculumDetails.schoolName} | ${curriculumDetails.schoolCourseName} | ${curriculumDetails.scheduleName} | ${curriculumDetails.classDayName} | Professor: ${curriculumDetails.teacherName}`;
    return curriculumFormattedName;
  }

  // GET ONE STUDENT DETAILS FUNCTION
  function handleOneStudentDetails(id: string) {
    const studentDetails: StudentSearchProps | undefined =
      studentsDatabaseData.find((student) => student.id === id);
    return studentDetails;
  }

  // CALC STUDENT PRICE (PRICE WITH DISCOUNT: APPLIED PRICE | PRICE WITHOUT DISCOUNTS: FULL PRICE)
  async function calcStudentPrice(studentId: string) {
    if (systemConstantsValues) {
      const userRef = collection(db, "students");
      const q = query(userRef, where("id", "==", studentId));
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
            ? systemConstantsValues.employeeDiscountValue
            : student.familyDiscount
            ? systemConstantsValues.familyDiscountValue
            : student.secondCourseDiscount
            ? systemConstantsValues.secondCourseDiscountValue
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
            appliedPrice: +(
              smallestPrice * discountVariable +
              otherSumPrices
            ).toFixed(2),
            fullPrice: smallestPrice + otherSumPrices,
          });
        });
      });
    }
  }

  interface NewStudentCalcProps {
    enrolledDays: number[];
    familyDiscount: boolean;
    employeeDiscount: boolean;
    customDiscount: boolean;
    customDiscountValue: string;
  }

  interface OneStudentCalcProps {
    studentId: string;
  }

  // interface EditStudentCalcProps {
  //   // studentId,
  //   // studentEditData.familyDiscount,
  //   // studentEditData.employeeDiscount,
  //   // studentEditData.customDiscount,
  //   // studentEditData.secondCourseDiscount,
  //   // studentEditData.customDiscountValue,
  //   // studentEditData.addFamily,
  //   // studentEditData.addCurriculum,
  //   // excludeCurriculum,
  //   // excludeFamily,
  //   // newStudentData.curriculum,
  //   // newClass.enrolledDays,
  //   // showEnrollWaitingCurriculumDetails,
  // }

  function customDiscountValueCalc(student: StudentSearchProps) {
    // DISCOUNT VARIABLE
    const customDiscountValueSum = 100 - +student.customDiscountValue;
    const customDiscountFinalValue = +`0.${
      customDiscountValueSum > 9
        ? customDiscountValueSum
        : `0${customDiscountValueSum}`
    }`;
    let appliedPrice = 0;
    let fullPrice = 0;
    student.curriculumIds.map((curriculum) => {
      appliedPrice = appliedPrice + curriculum.price;
      fullPrice = fullPrice + curriculum.price;
    });
    return console.log(
      "Preço sem desconto: ",
      fullPrice,
      " Preço com desconto: ",
      appliedPrice * customDiscountFinalValue
    );
  }

  function employeeDiscountValueCalc(student: StudentSearchProps) {
    if (systemConstantsValues) {
      // WITH EMPLOYEE DISCOUNT
      let appliedPrice = 0;
      let fullPrice = 0;
      student.curriculumIds.map((curriculum) => {
        appliedPrice = appliedPrice + curriculum.price;
        fullPrice = fullPrice + curriculum.price;
      });
      return console.log(
        "Preço sem desconto: ",
        fullPrice,
        " Preço com desconto: ",
        appliedPrice * systemConstantsValues.employeeDiscountValue
      );
    }
  }

  function courseDiscountValueCalc(student: StudentSearchProps) {
    console.log("student", student);
    if (systemConstantsValues) {
      // WITHOUT FAMILY DISCOUNT
      const studentCurriculums: CurriculumArrayProps[] = [];
      curriculumDatabaseData.map((curriculum) => {
        curriculum.students.map((student) => {
          if (student.id === student.id) {
            if (!studentCurriculums.includes(student)) {
              studentCurriculums.push(student);
            }
          }
        });
      });
      let biggerPriceIndex = 0;
      let biggerPrice = 0;
      let otherSumPrices = 0;
      let olderBiggerPrice = 0;
      let appliedPrice = 0;
      let fullPrice = 0;
      studentCurriculums.map(async (studentCurriculum, index) => {
        if (studentCurriculum.price > biggerPrice) {
          biggerPriceIndex = index;
          olderBiggerPrice = biggerPrice;
          biggerPrice = studentCurriculum.price;
          otherSumPrices = olderBiggerPrice + otherSumPrices;
        } else {
          otherSumPrices = otherSumPrices + studentCurriculum.price;
        }
      });
      if (otherSumPrices === 0) {
        appliedPrice = biggerPrice;
        fullPrice = biggerPrice;
      } else {
        appliedPrice =
          biggerPrice * systemConstantsValues.secondCourseDiscountValue +
          otherSumPrices;
        fullPrice = biggerPrice + otherSumPrices;
      }
      return console.log(
        "todos os curriculum juntos, student",
        studentCurriculums,
        "Maior mensalidade: ",
        biggerPrice,
        " Soma das outras mensalidades: ",
        otherSumPrices,
        " Index da maior mensalidade: ",
        biggerPriceIndex,
        "Preço total sem desconto: ",
        fullPrice,
        " Preço total com desconto: ",
        appliedPrice
      );
    }
  }

  async function calcStudentPrice2(
    studentId: string,
    newStudent?: NewStudentCalcProps,
    oneStudent?: OneStudentCalcProps
  ) {
    console.log("newStudent", newStudent);
    console.log("oneStudent", oneStudent);
    if (systemConstantsValues) {
      const userRef = collection(db, "students");
      const q = query(userRef, where("id", "==", studentId));
      const querySnapshot = await getDocs(q);
      const promises: StudentSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as StudentSearchProps;
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        const studentToCalcPrices = results.find(
          (student) => student.id === studentId
        );
        if (studentToCalcPrices) {
          if (studentToCalcPrices.customDiscount) {
            // // DISCOUNT VARIABLE
            // const customDiscountValueSum =
            //   100 - +studentToCalcPrices.customDiscountValue;
            // const customDiscountFinalValue = +`0.${
            //   customDiscountValueSum > 9
            //     ? customDiscountValueSum
            //     : `0${customDiscountValueSum}`
            // }`;
            customDiscountValueCalc(studentToCalcPrices);
            // IF WE NEED GET THE CURRICULUM ORDERED UNCOMENT BELOW
            // const curriculumOrderedByPrice =
            //   studentToCalcPrices.curriculumIds.sort((a, b) => b.price - a.price);
            // WITH CUSTOM DISCOUNT
            // let appliedPrice = 0;
            // studentToCalcPrices.curriculumIds.map((curriculum) => {
            //   appliedPrice = appliedPrice + curriculum.price;
            // });
            // console.log(
            //   "appliedPrice sem desconto: ",
            //   appliedPrice,
            //   " appliedPrice com desconto: ",
            //   appliedPrice * customDiscountFinalValue
            // );
          }
          // PRICE CALC IF HAVE FAMILY
          else if (studentToCalcPrices.employeeDiscount) {
            employeeDiscountValueCalc(studentToCalcPrices);
            // // WITH EMPLOYEE DISCOUNT
            // let appliedPrice = 0;
            // studentToCalcPrices.curriculumIds.map((curriculum) => {
            //   appliedPrice = appliedPrice + curriculum.price;
            // });
            // console.log(
            //   "appliedPrice sem desconto: ",
            //   appliedPrice,
            //   " appliedPrice com desconto: ",
            //   appliedPrice * systemConstantsValues.employeeDiscountValue
            // );
          } else if (studentToCalcPrices.studentFamilyAtSchool.length < 1) {
            courseDiscountValueCalc(studentToCalcPrices);
            // // WITHOUT FAMILY DISCOUNT
            // const studentCurriculums: CurriculumArrayProps[] = [];
            // curriculumDatabaseData.map((curriculum) => {
            //   curriculum.students.map((student) => {
            //     if (student.id === studentToCalcPrices.id) {
            //       if (!studentCurriculums.includes(student)) {
            //         studentCurriculums.push(student);
            //       }
            //     }
            //   });
            // });
            // let biggerPriceIndex = 0;
            // let biggerPrice = 0;
            // let otherSumPrices = 0;
            // let olderBiggerPrice = 0;
            // studentCurriculums.map(async (studentCurriculum, index) => {
            //   if (studentCurriculum.price > biggerPrice) {
            //     biggerPriceIndex = index;
            //     olderBiggerPrice = biggerPrice;
            //     biggerPrice = studentCurriculum.price;
            //     otherSumPrices = olderBiggerPrice + otherSumPrices;
            //   } else {
            //     otherSumPrices = otherSumPrices + studentCurriculum.price;
            //   }
            // });
            // console.log(
            //   "todos os curriculum juntos, student",
            //   studentCurriculums
            // );
            // console.log(
            //   "Maior mensalidade: ",
            //   biggerPrice,
            //   " Soma das outras mensalidades: ",
            //   otherSumPrices,
            //   " Index da maior mensalidade: ",
            //   biggerPriceIndex
            // );
          } else {
            // WITH FAMILY DISCOUNT
            const studentFamilyCurriculums: CurriculumArrayProps[] = [];
            studentToCalcPrices.studentFamilyAtSchool.map((familyId) => {
              curriculumDatabaseData.map((curriculum) => {
                curriculum.students.map((student) => {
                  if (
                    student.id === familyId ||
                    student.id === studentToCalcPrices.id
                  ) {
                    if (!studentFamilyCurriculums.includes(student)) {
                      studentFamilyCurriculums.push(student);
                    }
                  }
                });
              });
            });
            let biggerPriceIndex = 0;
            let biggerPrice = 0;
            let otherSumPrices = 0;
            let olderBiggerPrice = 0;
            studentFamilyCurriculums.map(async (studentCurriculum, index) => {
              if (studentCurriculum.price > biggerPrice) {
                biggerPriceIndex = index;
                olderBiggerPrice = biggerPrice;
                biggerPrice = studentCurriculum.price;
                otherSumPrices = olderBiggerPrice + otherSumPrices;
              } else {
                otherSumPrices = otherSumPrices + studentCurriculum.price;
              }
            });
            console.log(
              "todos os curriculum juntos, student and family",
              studentFamilyCurriculums
            );
            console.log(
              "Maior mensalidade: ",
              biggerPrice,
              " Soma das outras mensalidades: ",
              otherSumPrices,
              " Index da maior mensalidade: ",
              biggerPriceIndex,
              "ID do aluno com maior mensalidade: ",
              studentFamilyCurriculums[biggerPriceIndex].id
            );
          }
          // if (curriculumOrderedByPrice.length < 1) {
          //   console.log(
          //     "O preço total é: R$ ",
          //     0,
          //     " o desconto é de ",
          //     0,
          //     ", e o valor final é: R$ ",
          //     0
          //   );
          // } else if (curriculumOrderedByPrice.length === 1) {
          //   if (studentToCalcPrices.customDiscount) {
          //     console.log(
          //       "O preço total é: R$ ",
          //       curriculumOrderedByPrice[0].price,
          //       " o desconto é de ",
          //       studentToCalcPrices.customDiscountValue,
          //       "%, e o valor final é: R$ ",
          //       curriculumOrderedByPrice[0].price * customDiscountFinalValue
          //     );
          //   } else if (studentToCalcPrices.employeeDiscount) {
          //     console.log(
          //       "O preço total é: R$ ",
          //       curriculumOrderedByPrice[0].price,
          //       " o desconto é de ",
          //       employeeDiscountValue,
          //       ", e o valor final é: R$ ",
          //       curriculumOrderedByPrice[0].price * employeeDiscountValue
          //     );
          //   } else if (studentToCalcPrices.familyDiscount) {
          //     console.log(
          //       "O preço total é: R$ ",
          //       curriculumOrderedByPrice[0].price,
          //       " o desconto é de ",
          //       familyDiscountValue,
          //       ", e o valor final é: R$ ",
          //       curriculumOrderedByPrice[0].price * familyDiscountValue
          //     );
          //   } else {
          //     console.log(
          //       "O preço total é: R$ ",
          //       curriculumOrderedByPrice[0].price,
          //       " o desconto é de ",
          //       0,
          //       ", e o valor final é: R$ ",
          //       curriculumOrderedByPrice[0].price
          //     );
          //   }
          // } else {
          //   if (studentToCalcPrices.customDiscount) {
          //     console.log(
          //       "O preço total é: R$ ",
          //       curriculumOrderedByPrice[0].price,
          //       " o desconto é de ",
          //       studentToCalcPrices.customDiscountValue,
          //       "%, e o valor final é: R$ ",
          //       curriculumOrderedByPrice[0].price * customDiscountFinalValue
          //     );
          //   }
          // }
        }
        // studentToCalcPrices.map(async (student) => {
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
        //   : student.familyDiscount
        //   ? familyDiscountValue
        //   : student.secondCourseDiscount
        //   ? secondCourseDiscountValue
        //   : 1; // WITHOUT DISCOUNT

        // CALC OF FULL AND APPLY PRICE OF STUDENT
        // let smallestPrice = 0;
        // let otherSumPrices = 0;
        // let olderSmallestPrice = 0;
        // student.curriculumIds.map(async (studentCurriculum, index) => {
        //   if (index === 0) {
        //     smallestPrice = studentCurriculum.price;
        //   } else {
        //     if (studentCurriculum.price <= smallestPrice) {
        //       olderSmallestPrice = smallestPrice;
        //       smallestPrice = studentCurriculum.price;
        //       otherSumPrices = olderSmallestPrice + otherSumPrices;
        //     } else {
        //       otherSumPrices = otherSumPrices + studentCurriculum.price;
        //     }
        //   }
        // });
        // await updateDoc(doc(db, "students", student.id), {
        //   appliedPrice: +(
        //     smallestPrice * discountVariable +
        //     otherSumPrices
        //   ).toFixed(2),
        //   fullPrice: smallestPrice + otherSumPrices,
        // });
        // });
      });
    }
  }
  // MONITORING USER LOGIN
  useEffect(() => {
    setIsSubmitting(true);
    if (!user) {
      setLogged(false);
      setIsSubmitting(false);
      setUserFullData(undefined);
    }

    if (user && !userFullData) {
      handleUserFullData(user);
    }

    if (user && userFullData) {
      setLogged(true);
      setIsSubmitting(false);
    }
  }, [user, checkUser, userFullData]);

  // PAGE STATE
  const [page, setPage] = useState<SetPageProps>({
    prev: "Dashboard",
    show: "Dashboard",
  });

  // EXPERIMENTAL CLASS STATE FOR NOT LOGGED USERS
  const [isExperimentalClass, setIsExperimentalClass] = useState(false);

  // -------------------------------------------------- DATABASE CONTEXT LISTENERS -----------------------------------------------//
  // SYSTEM CONSTANTS STATE
  const [systemConstantsDatabaseData, setSystemConstantsDatabaseData] =
    useState<SystemConstantsSearchProps[]>([]);

  // SCHOOL DATA STATE
  const [schoolDatabaseData, setSchoolDatabaseData] = useState<
    SchoolSearchProps[]
  >([]);

  // SCHOOL CLASS DATA STATE
  const [schoolClassDatabaseData, setSchoolClassDatabaseData] = useState<
    SchoolClassSearchProps[]
  >([]);

  // SCHOOL COURSE DATA STATE
  const [schoolCourseDatabaseData, setSchoolCourseDatabaseData] = useState<
    SchoolCourseSearchProps[]
  >([]);

  // SCHEDULE DATA STATE
  const [scheduleDatabaseData, setScheduleDatabaseData] = useState<
    ScheduleSearchProps[]
  >([]);

  // TEACHER DATA STATE
  const [teacherDatabaseData, setTeacherDatabaseData] = useState<
    TeacherSearchProps[]
  >([]);

  // CURRICULUM DATA STATE
  const [curriculumDatabaseData, setCurriculumDatabaseData] = useState<
    CurriculumSearchProps[]
  >([]);

  // STUDENTS DATA STATE
  const [studentsDatabaseData, setStudentsDatabaseData] = useState<
    StudentSearchProps[]
  >([]);

  // CLASS DAYS DATA STATE
  const [classDaysDatabaseData, setClassDaysDatabaseData] = useState<
    ClassDaySearchProps[]
  >([]);

  // APP USERS DATA STATE
  const [appUsersDatabaseData, setAppUsersDatabaseData] = useState<
    UserFullDataProps[]
  >([]);

  function handleSystemConstants() {
    const systemConstantsQuery = query(collection(db, "systemConstants"));
    const systemConstantsListener = onSnapshot(
      systemConstantsQuery,
      (querySnapshot) => {
        const systemConstants: SystemConstantsSearchProps[] = [];
        querySnapshot.forEach((doc) => {
          const systemConstant = doc.data() as SystemConstantsSearchProps;
          systemConstantsDatabaseData.push(systemConstant);
        });
        setSystemConstantsDatabaseData(systemConstants);
      }
    );
    systemConstantsListener;
  }

  // GET SYSTEM CONSTANTS
  useEffect(() => {
    handleSystemConstants();
  }, []);

  // GET DATA
  // LISTENER SCHOOLS DATA
  const [schoolsDb, schoolsDbLoading, schoolsDbError] = useCollectionData(
    collection(db, "schools")
  );
  // LISTENER SCHOOLCLASSES DATA
  const [schoolClassesDb, schoolClassesDbLoading, schoolClassesDbError] =
    useCollectionData(collection(db, "schoolClasses"));
  // LISTENER SCHOOLCOURSES DATA
  const [schoolCoursesDb, schoolCoursesDbLoading, schoolCoursesDbError] =
    useCollectionData(collection(db, "schoolCourses"));
  // LISTENER SCHEDULES DATA
  const [schedulesDb, schedulesDbLoading, schedulesDbError] = useCollectionData(
    collection(db, "schedules")
  );
  // LISTENER TEACHERS DATA
  const [teachersDb, teachersDbLoading, teachersDbError] = useCollectionData(
    collection(db, "teachers")
  );
  // LISTENER CURRICULUM DATA
  const [curriculumDb, curriculumDbLoading, curriculumDbError] =
    useCollectionData(collection(db, "curriculum"));
  // LISTENER STUDENTS DATA
  const [studentsDb, studentsDbLoading, studentsDbError] = useCollectionData(
    collection(db, "students")
  );
  // LISTENER CLASSDAYS DATA
  const [classDaysDb, classDaysDbLoading, classDaysDbError] = useCollectionData(
    collection(db, "classDays")
  );
  // LISTENER APP USERS DATA
  const [appUsersDb, appUsersDbLoading, appUsersDbError] = useCollectionData(
    collection(db, "appUsers")
  );
  // LISTENER SYSTEMCONSTANTS DATA
  const [systemConstantsDb, systemConstantsDbLoading, systemConstantsDbError] =
    useCollectionData(collection(db, "systemConstants"));

  const [systemConstantsValues, setSystemConstantsValues] =
    useState<SystemConstantsSearchProps>();

  useEffect(() => {
    if (
      systemConstantsDb &&
      !systemConstantsDbLoading &&
      systemConstantsDbError === undefined
    ) {
      const currentYear = new Date().getFullYear().toString();
      const constants = systemConstantsDb.find(
        (constants) => constants.year === currentYear
      ) as SystemConstantsSearchProps;
      setSystemConstantsValues(constants);
    }
  }, [systemConstantsDb, systemConstantsDbLoading, systemConstantsDbError]);

  async function handleData() {
    // GET SCHOOL DATA
    const schoolQuery = query(collection(db, "schools"));
    const schoolListener = onSnapshot(schoolQuery, (querySnapshot) => {
      const schoolDatabaseData: SchoolSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const school = doc.data() as SchoolSearchProps;
        schoolDatabaseData.push(school);
      });
      setSchoolDatabaseData(
        schoolDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    schoolListener;
    // GET SCHOOL CLASS DATA
    const schoolClassQuery = query(collection(db, "schoolClasses"));
    const schoolClassListener = onSnapshot(
      schoolClassQuery,
      (querySnapshot) => {
        const schoolClassDatabaseData: SchoolClassSearchProps[] = [];
        querySnapshot.forEach((doc) => {
          const schoolClass = doc.data() as SchoolClassSearchProps;
          schoolClassDatabaseData.push(schoolClass);
        });
        setSchoolClassDatabaseData(
          schoolClassDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
        );
      }
    );
    schoolClassListener;
    // GET SCHOOL COURSE DATA
    const schoolCoursesQuery = query(collection(db, "schoolCourses"));
    const schoolCoursesListener = onSnapshot(
      schoolCoursesQuery,
      (querySnapshot) => {
        const schoolCoursesDatabaseData: SchoolCourseSearchProps[] = [];
        querySnapshot.forEach((doc) => {
          const schoolCourse = doc.data() as SchoolCourseSearchProps;
          schoolCoursesDatabaseData.push(schoolCourse);
        });
        setSchoolCourseDatabaseData(
          schoolCoursesDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
        );
      }
    );
    schoolCoursesListener;
    // GET SCHEDULE DATA
    const schedulesQuery = query(collection(db, "schedules"));
    const schedulesListener = onSnapshot(schedulesQuery, (querySnapshot) => {
      const schedulesDatabaseData: ScheduleSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const schedule = doc.data() as ScheduleSearchProps;
        schedulesDatabaseData.push(schedule);
      });
      setScheduleDatabaseData(
        schedulesDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    schedulesListener;
    // GET TEACHER DATA
    const teachersQuery = query(collection(db, "teachers"));
    const teachersListener = onSnapshot(teachersQuery, (querySnapshot) => {
      const teachersDatabaseData: TeacherSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const teacher = doc.data() as TeacherSearchProps;
        teachersDatabaseData.push(teacher);
      });
      setTeacherDatabaseData(
        teachersDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    teachersListener;
    // GET CURRICULUM DATA
    const curriculumsQuery = query(collection(db, "curriculum"));
    const curriculumsListener = onSnapshot(
      curriculumsQuery,
      (querySnapshot) => {
        const curriculumsDatabaseData: CurriculumSearchProps[] = [];
        querySnapshot.forEach((doc) => {
          const curriculum = doc.data() as CurriculumSearchProps;
          curriculumsDatabaseData.push(curriculum);
        });
        setCurriculumDatabaseData(curriculumsDatabaseData);
      }
    );
    curriculumsListener;
    // GET STUDENTS DATA
    const studentsQuery = query(collection(db, "students"));
    const studentsListener = onSnapshot(studentsQuery, (querySnapshot) => {
      const studentsDatabaseData: StudentSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const curriculum = doc.data() as StudentSearchProps;
        studentsDatabaseData.push(curriculum);
      });
      setStudentsDatabaseData(
        studentsDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    studentsListener;
    // GET CLASS DAY DATA
    const classDaysQuery = query(collection(db, "classDays"));
    const classDaysListener = onSnapshot(classDaysQuery, (querySnapshot) => {
      const classDaysDatabaseData: ClassDaySearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const curriculum = doc.data() as ClassDaySearchProps;
        classDaysDatabaseData.push(curriculum);
      });
      setClassDaysDatabaseData(
        classDaysDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    classDaysListener;
    // GET APP USERS DATA
    const appUsersQuery = query(collection(db, "appUsers"));
    const appUsersListener = onSnapshot(appUsersQuery, (querySnapshot) => {
      const appUsersDatabaseData: UserFullDataProps[] = [];
      querySnapshot.forEach((doc) => {
        const appUser = doc.data() as UserFullDataProps;
        appUsersDatabaseData.push(appUser);
      });
      setAppUsersDatabaseData(
        appUsersDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    appUsersListener;
  }

  // CONFIRM ALERT MODAL
  const ConfirmationAlert = withReactContent(Swal);

  // DELETE STUDENT FUNCTION
  function handleDeleteStudent(
    studentId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    ConfirmationAlert.fire({
      title: "Você tem certeza?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, deletar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const studentToDelete = studentsDatabaseData.find(
          (student) => student.id === studentId
        );
        if (studentToDelete) {
          // TEST FOR BROTHERS REGISTERED
          if (studentToDelete.studentFamilyAtSchool.length > 0) {
            // IF EXISTS, REMOVE THIS STUDENT FROM YOUR BROTHER'S REGISTRATION
            studentToDelete.studentFamilyAtSchool.map(
              async (studentFamilyId) => {
                const editingStudentFamily = studentsDatabaseData.find(
                  (student) => student.id === studentFamilyId
                );
                if (editingStudentFamily) {
                  const foundedStudentOnFamilyRecord =
                    editingStudentFamily.studentFamilyAtSchool.find(
                      (studentToEditId) => studentToEditId === studentId
                    );
                  if (foundedStudentOnFamilyRecord) {
                    // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND DOESN'T HAVE A SECOND COURSE DISCOUNT (CHANGE TO FULL PRICE)
                    if (
                      editingStudentFamily.familyDiscount && // PREVENT A BUG THAT ACCEPTS ADD BROTHER TO STUDENT WHO ALREADY HAS A BROTHER
                      editingStudentFamily.studentFamilyAtSchool.length === 1 &&
                      !editingStudentFamily.secondCourseDiscount
                    ) {
                      await updateDoc(
                        doc(db, "students", editingStudentFamily.id),
                        {
                          studentFamilyAtSchool: arrayRemove(studentId),
                          familyDiscount: false,
                          appliedPrice: editingStudentFamily.fullPrice,
                        }
                      );
                      // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND HAVE A SECOND COURSE DISCOUNT (DON'T CHANGE PRICE)
                    } else if (
                      editingStudentFamily.familyDiscount && // PREVENT A BUG THAT ACCEPTS ADD BROTHER TO STUDENT WHO ALREADY HAS A BROTHER
                      editingStudentFamily.studentFamilyAtSchool.length === 1
                    ) {
                      await updateDoc(
                        doc(db, "students", editingStudentFamily.id),
                        {
                          studentFamilyAtSchool: arrayRemove(studentId),
                          familyDiscount: false,
                        }
                      );
                      // AFTER DELETE IF BROTHER WILL HAVE ANOTHER FAMILY (DON'T CHANGE PRICE)
                    } else if (
                      editingStudentFamily.familyDiscount && // PREVENT A BUG THAT ACCEPTS ADD BROTHER TO STUDENT WHO ALREADY HAS A BROTHER
                      editingStudentFamily.studentFamilyAtSchool.length > 1
                    ) {
                      await updateDoc(
                        doc(db, "students", editingStudentFamily.id),
                        {
                          studentFamilyAtSchool: arrayRemove(studentId),
                        }
                      );
                      // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND DOESN'T HAVE A SECOND COURSE DISCOUNT (CHANGE TO FULL PRICE)
                    } else if (
                      !editingStudentFamily.familyDiscount && // NORMAL SCENARIO, WHERE A BROTHER DON'T HAVE A FAMILY DISCOUNT, BECAUSE HAS RECEIVED A BROTHER THAT HAVE A DISCOUNT
                      editingStudentFamily.studentFamilyAtSchool.length === 1 &&
                      !editingStudentFamily.secondCourseDiscount
                    ) {
                      await updateDoc(
                        doc(db, "students", editingStudentFamily.id),
                        {
                          studentFamilyAtSchool: arrayRemove(studentId),
                          familyDiscount: false,
                          appliedPrice: editingStudentFamily.fullPrice,
                        }
                      );
                      // AFTER DELETE IF BROTHER IS LEFT WITHOUT ANY FAMILY AND HAVE A SECOND COURSE DISCOUNT (DON'T CHANGE PRICE)
                    } else if (
                      !editingStudentFamily.familyDiscount && // NORMAL SCENARIO, WHERE A BROTHER DON'T HAVE A FAMILY DISCOUNT, BECAUSE HAS RECEIVED A BROTHER THAT HAVE A DISCOUNT
                      editingStudentFamily.studentFamilyAtSchool.length === 1
                    ) {
                      await updateDoc(
                        doc(db, "students", editingStudentFamily.id),
                        {
                          studentFamilyAtSchool: arrayRemove(studentId),
                          familyDiscount: false,
                        }
                      );
                      // AFTER DELETE IF BROTHER WILL HAVE ANOTHER FAMILY (DON'T CHANGE PRICE)
                    } else if (
                      !editingStudentFamily.familyDiscount && // NORMAL SCENARIO, WHERE A BROTHER DON'T HAVE A FAMILY DISCOUNT, BECAUSE HAS RECEIVED A BROTHER THAT HAVE A DISCOUNT
                      editingStudentFamily.studentFamilyAtSchool.length > 1
                    ) {
                      await updateDoc(
                        doc(db, "students", editingStudentFamily.id),
                        {
                          studentFamilyAtSchool: arrayRemove(studentId),
                        }
                      );
                    }
                  }
                }
              }
            );
          }

          // DELETE STUDENT FROM EXPERIMENTAL CLASSES
          if (studentToDelete.experimentalCurriculumIds.length > 0) {
            studentToDelete.experimentalCurriculumIds.map(
              async (experimentalStudentCurriculum) => {
                const editingExperimentalCurriculum =
                  curriculumDatabaseData.find(
                    (experimentalCurriculum) =>
                      experimentalCurriculum.id ===
                      experimentalStudentCurriculum.id
                  );
                if (editingExperimentalCurriculum) {
                  const foundedStudentOnExperimentalCurriculum =
                    editingExperimentalCurriculum.experimentalStudents.find(
                      (student) => student.id === studentId
                    );

                  if (foundedStudentOnExperimentalCurriculum) {
                    await updateDoc(
                      doc(db, "curriculum", editingExperimentalCurriculum.id),
                      {
                        experimentalStudents: arrayRemove({
                          date: foundedStudentOnExperimentalCurriculum.date,
                          id: foundedStudentOnExperimentalCurriculum.id,
                          indexDays:
                            foundedStudentOnExperimentalCurriculum.indexDays,
                          isExperimental:
                            foundedStudentOnExperimentalCurriculum.isExperimental,
                          price: foundedStudentOnExperimentalCurriculum.price,
                        }),
                      }
                    );
                  }
                }
              }
            );
          }

          // DELETE STUDENT FROM CURRICULUM
          if (studentToDelete.curriculumIds.length > 0) {
            studentToDelete.curriculumIds.map(async (studentCurriculum) => {
              const editingCurriculum = curriculumDatabaseData.find(
                (curriculum) => curriculum.id === studentCurriculum.id
              );
              if (editingCurriculum) {
                const foundedStudentOnCurriculum =
                  editingCurriculum.students.find(
                    (student) => student.id === studentId
                  );

                if (foundedStudentOnCurriculum) {
                  await updateDoc(doc(db, "curriculum", editingCurriculum.id), {
                    students: arrayRemove({
                      date: foundedStudentOnCurriculum.date,
                      id: foundedStudentOnCurriculum.id,
                      indexDays: foundedStudentOnCurriculum.indexDays,
                      isExperimental: foundedStudentOnCurriculum.isExperimental,
                      price: foundedStudentOnCurriculum.price,
                    }),
                  });
                }
              }
            });
          }

          // DELETE STUDENT
          const deleteStudent = async () => {
            try {
              await deleteDoc(doc(db, "students", studentId));
              resetForm();
              toast.success(`Aluno excluído com sucesso! 👌`, {
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
          closeModal && closeModal();
          deleteStudent();
        } else {
          toast.error(
            `Ocorreu um erro, aluno não encontrado no banco de dados... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    });
  }

  // DELETE CURRICULUM FUNCTION
  function handleDeleteCurriculum(
    curriculumId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    ConfirmationAlert.fire({
      title: "Você tem certeza?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, deletar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const curriculumToDelete = curriculumDatabaseData.find(
          (curriculum) => curriculum.id === curriculumId
        );
        if (curriculumToDelete) {
          // CHECKING IF CURRICULUM CONTAINS STUDENTS
          // STUDENTS IN THIS CURRICULUM ARRAY
          const curriculumExistsOnStudent: StudentSearchProps[] = [];

          // SEARCH STUDENTS WITH THIS SCHOOL AND PUTTING ON ARRAY
          studentsDatabaseData.map((student) => {
            if (student.curriculumIds) {
              // ENROLLED STUDENTS
              student.curriculumIds.map((studentCurriculum) => {
                if (studentCurriculum.id === curriculumId) {
                  curriculumExistsOnStudent.push(student);
                }
              });
              // EXPERIMENTAL STUDENTS
              student.experimentalCurriculumIds.map(
                (studentExperimentalCurriculum) => {
                  if (studentExperimentalCurriculum.id === curriculumId) {
                    curriculumExistsOnStudent.push(student);
                  }
                }
              );
            }
            curriculumDatabaseData.map((curriculum) => {
              if (curriculum.id === curriculumId) {
                curriculum.waitingList.map((waitingStudent) => {
                  if (waitingStudent.id === student.id) {
                    curriculumExistsOnStudent.push(student);
                  }
                });
              }
            });
          });

          // IF EXISTS, RETURN ERROR
          if (curriculumExistsOnStudent.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Turma incluída em ${curriculumExistsOnStudent.length} ${
                  curriculumExistsOnStudent.length === 1
                    ? "cadastro de aluno"
                    : "cadastros de alunos"
                }, exclua ou altere primeiramente ${
                  curriculumExistsOnStudent.length === 1
                    ? "o aluno"
                    : "os alunos"
                } e depois exclua a turma... ❕`,
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
            const deleteCurriculum = async () => {
              try {
                await deleteDoc(doc(db, "curriculum", curriculumId));
                await deleteDoc(
                  doc(db, "classDays", curriculumToDelete.classDayId)
                );
                resetForm();
                toast.success(`Turma excluída com sucesso! 👌`, {
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
            closeModal && closeModal();
            // IF NO EXISTS, DELETE
            deleteCurriculum();
          }
        } else {
          toast.error(
            `Ocorreu um erro, turma não encontrada no banco de dados... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    });
  }

  // DELETE TEACHER FUNCTION
  function handleDeleteTeacher(
    teacherId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    ConfirmationAlert.fire({
      title: "Você tem certeza?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, deletar!",
    }).then(async (result) => {
      setIsSubmitting(true);
      if (result.isConfirmed) {
        const teacherToDelete = teacherDatabaseData.find(
          (teacher) => teacher.id === teacherId
        );
        if (teacherToDelete) {
          const deleteTeacher = async () => {
            try {
              if (teacherToDelete.haveAccount) {
                await deleteAppUser(teacherToDelete.id);
                await deleteDoc(doc(db, "appUsers", teacherToDelete.id));
              }
              await deleteDoc(doc(db, "teachers", teacherToDelete.id));
              resetForm();
              toast.success(`Professor excluído com sucesso! 👌`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
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
            } finally {
              setIsSubmitting(false);
              resetForm();
            }
          };
          // SEARCH CURRICULUM WITH THIS TEACHER
          const teacherExistsOnCurriculum = curriculumDatabaseData.filter(
            (curriculum) => curriculum.teacherId === teacherToDelete.id
          );

          // IF EXISTS, RETURN ERROR
          if (teacherExistsOnCurriculum.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Professor incluído em ${
                  teacherExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
                }, exclua ou altere primeiramente ${
                  teacherExistsOnCurriculum.length === 1
                    ? "a Turma"
                    : "as Turmas"
                } e depois exclua o Professor ${teacherToDelete.name}... ❕`,
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
            closeModal && closeModal();
            // IF NO EXISTS, DELETE
            deleteTeacher();
          }
        } else {
          toast.error(
            `Ocorreu um erro, professor não encontrado no banco de dados... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    });
  }

  // DELETE SCHOOL FUNCTION
  function handleDeleteSchool(
    schoolId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    ConfirmationAlert.fire({
      title: "Você tem certeza?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, deletar!",
    }).then(async (result) => {
      setIsSubmitting(true);
      if (result.isConfirmed) {
        const schoolToDelete = schoolDatabaseData.find(
          (school) => school.id === schoolId
        );
        if (schoolToDelete) {
          const deleteSchool = async () => {
            try {
              await deleteDoc(doc(db, "schools", schoolToDelete.id));
              toast.success(`Colégio excluído com sucesso ! 👌`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
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
            } finally {
              resetForm();
              setIsSubmitting(false);
            }
          };

          // CHECKING IF SCHOOL EXISTS ON SOME STUDENT, CLASS, SCHEDULE OR CURRICULUM ON DATABASE
          // STUDENTS IN THIS SCHOOL ARRAY
          const schoolExistsOnStudent: StudentSearchProps[] = [];

          // SEARCH CURRICULUM WITH THIS SCHOOL
          const schoolExistsOnCurriculum = curriculumDatabaseData.filter(
            (curriculum) => curriculum.schoolId === schoolId
          );

          // SEARCH STUDENTS WITH THIS SCHOOL AND PUTTING ON ARRAY
          studentsDatabaseData.map((student) => {
            if (student.curriculumIds) {
              // ENROLLED STUDENTS
              student.curriculumIds.map((studentCurriculum) => {
                const foundedSchoolStudentWithCurriculum =
                  schoolExistsOnCurriculum.find(
                    (schoolCurriculum) =>
                      schoolCurriculum.id === studentCurriculum.id
                  );
                if (foundedSchoolStudentWithCurriculum) {
                  schoolExistsOnStudent.push(student);
                }
              });
              // EXPERIMENTAL STUDENTS
              student.experimentalCurriculumIds.map(
                (studentExperimentalCurriculum) => {
                  const foundedSchoolStudentWithExperimentalCurriculum =
                    schoolExistsOnCurriculum.find(
                      (schoolCurriculum) =>
                        schoolCurriculum.id === studentExperimentalCurriculum.id
                    );
                  if (foundedSchoolStudentWithExperimentalCurriculum) {
                    schoolExistsOnStudent.push(student);
                  }
                }
              );
            }
          });

          // SEARCH SCHEDULE WITH THIS SCHOOL
          const schoolExistsOnSchedule = scheduleDatabaseData.filter(
            (schedule) => schedule.schoolId === schoolId
          );

          // IF EXISTS, RETURN ERROR
          if (schoolExistsOnStudent.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Colégio tem ${schoolExistsOnStudent.length} ${
                  schoolExistsOnStudent.length === 1
                    ? "aluno matriculado"
                    : "alunos matriculados"
                }, exclua ou altere primeiramente ${
                  schoolExistsOnStudent.length === 1 ? "o aluno" : "os alunos"
                } e depois exclua o ${schoolToDelete.name}... ❕`,
                {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                }
              )
            );
          } else if (schoolExistsOnCurriculum.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Colégio incluído em ${schoolExistsOnCurriculum.length} ${
                  schoolExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
                }, exclua ou altere primeiramente ${
                  schoolExistsOnCurriculum.length === 1
                    ? "a Turma"
                    : "as Turmas"
                } e depois exclua o ${schoolToDelete.name}... ❕`,
                {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                }
              )
            );
          } else if (schoolExistsOnSchedule.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Colégio incluído em ${schoolExistsOnSchedule.length} ${
                  schoolExistsOnSchedule.length === 1 ? "Horário" : "Horários"
                }, exclua ou altere primeiramente ${
                  schoolExistsOnSchedule.length === 1
                    ? "o Horário"
                    : "os Horários"
                } e depois exclua o ${schoolToDelete.name}... ❕`,
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
            closeModal && closeModal();
            // IF NO EXISTS, DELETE
            deleteSchool();
          }
        } else {
          toast.error(
            `Ocorreu um erro, escola não encontrada no banco de dados... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    });
  }

  // DELETE COURSE FUNCTION
  function handleDeleteCourse(
    courseId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    ConfirmationAlert.fire({
      title: "Você tem certeza?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, deletar!",
    }).then(async (result) => {
      setIsSubmitting(true);
      if (result.isConfirmed) {
        const courseToDelete = schoolCourseDatabaseData.find(
          (course) => course.id === courseId
        );
        if (courseToDelete) {
          // DELETE SCHOOL COURSE FUNCTION
          const deleteSchoolCourse = async () => {
            try {
              await deleteDoc(doc(db, "schoolCourses", courseToDelete.id));
              resetForm();
              toast.success(`Modalidade excluída com sucesso! 👌`, {
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

          // CHECKING IF SCHOOLCOURSE EXISTS ON SOME STUDENT OR CURRICULUM ON DATABASE
          // STUDENTS IN THIS SCHOOLCOURSE ARRAY
          const schoolCourseExistsOnStudent: StudentSearchProps[] = [];

          // SEARCH CURRICULUM WITH THIS SCHOOLCOURSE
          const schoolCourseExistsOnCurriculum = curriculumDatabaseData.filter(
            (curriculum) => curriculum.schoolCourseId === courseToDelete.id
          );

          // SEARCH STUDENTS WITH THIS SCHOOLCOURSE AND PUTTING ON ARRAY
          studentsDatabaseData.map((student) => {
            if (student.curriculumIds) {
              // ENROLLED STUDENTS
              student.curriculumIds.map((studentCurriculum) => {
                const foundedSchoolCourseStudentWithCurriculum =
                  schoolCourseExistsOnCurriculum.find(
                    (schoolCurriculum) =>
                      schoolCurriculum.id === studentCurriculum.id
                  );
                if (foundedSchoolCourseStudentWithCurriculum) {
                  schoolCourseExistsOnStudent.push(student);
                }
              });
              // EXPERIMENTAL STUDENTS
              student.experimentalCurriculumIds.map(
                (studentExperimentalCurriculum) => {
                  const foundedSchoolCourseStudentWithExperimentalCurriculum =
                    schoolCourseExistsOnCurriculum.find(
                      (schoolCurriculum) =>
                        schoolCurriculum.id === studentExperimentalCurriculum.id
                    );
                  if (foundedSchoolCourseStudentWithExperimentalCurriculum) {
                    schoolCourseExistsOnStudent.push(student);
                  }
                }
              );
            }
          });

          // IF EXISTS, RETURN ERROR
          if (schoolCourseExistsOnStudent.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Modalidade tem ${schoolCourseExistsOnStudent.length} ${
                  schoolCourseExistsOnStudent.length === 1
                    ? "aluno matriculado"
                    : "alunos matriculados"
                }, exclua ou altere primeiramente ${
                  schoolCourseExistsOnStudent.length === 1
                    ? "o aluno"
                    : "os alunos"
                } e depois exclua a modalidade ${courseToDelete.name}... ❕`,
                {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                }
              )
            );
          } else if (schoolCourseExistsOnCurriculum.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Modalidade incluída em ${
                  schoolCourseExistsOnCurriculum.length
                } ${
                  schoolCourseExistsOnCurriculum.length === 1
                    ? "Turma"
                    : "Turmas"
                }, exclua ou altere primeiramente ${
                  schoolCourseExistsOnCurriculum.length === 1
                    ? "a Turma"
                    : "as Turmas"
                } e depois exclua a modalidade ${courseToDelete.name}... ❕`,
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
            closeModal && closeModal();
            // IF NO EXISTS, DELETE
            deleteSchoolCourse();
          }
        } else {
          toast.error(
            `Ocorreu um erro, modalidade não encontrada no banco de dados... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    });
  }
  // DELETE SCHEDULE FUNCTION
  function handleDeleteSchedule(
    scheduleId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    ConfirmationAlert.fire({
      title: "Você tem certeza?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, deletar!",
    }).then(async (result) => {
      setIsSubmitting(true);
      if (result.isConfirmed) {
        const scheduleToDelete = scheduleDatabaseData.find(
          (schedule) => schedule.id === scheduleId
        );
        if (scheduleToDelete) {
          // DELETE SCHEDULE FUNCTION
          const deleteSchedule = async () => {
            try {
              await deleteDoc(doc(db, "schedules", scheduleToDelete.id));
              resetForm();
              toast.success(`Horário excluído com sucesso! 👌`, {
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

          // CHECKING IF SCHEDULE EXISTS ON DATABASE
          // SEARCH CURRICULUM WITH THIS SCHEDULE
          const scheduleExistsOnCurriculum = curriculumDatabaseData.filter(
            (curriculum) => curriculum.scheduleId === scheduleToDelete.id
          );

          // IF EXISTS, RETURN ERROR
          if (scheduleExistsOnCurriculum.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `Horário incluído em ${scheduleExistsOnCurriculum.length} ${
                  scheduleExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
                }, exclua ou altere primeiramente ${
                  scheduleExistsOnCurriculum.length === 1
                    ? "a Turma"
                    : "as Turmas"
                } e depois exclua o ${scheduleToDelete.name}... ❕`,
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
            closeModal && closeModal();
            // IF NO EXISTS, DELETE
            deleteSchedule();
          }
        } else {
          toast.error(
            `Ocorreu um erro, modalidade não encontrada no banco de dados... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <GlobalDataContext.Provider
      value={{
        auth,
        checkUser,
        isExperimentalClass,
        isSubmitting,
        logged,
        login,
        page,
        // NEW DATABASE DATA
        schoolsDb,
        schoolsDbError,
        schoolsDbLoading,
        schoolClassesDb,
        schoolClassesDbError,
        schoolClassesDbLoading,
        schoolCoursesDb,
        schoolCoursesDbError,
        schoolCoursesDbLoading,
        schedulesDb,
        schedulesDbError,
        schedulesDbLoading,
        teachersDb,
        teachersDbError,
        teachersDbLoading,
        curriculumDb,
        curriculumDbError,
        curriculumDbLoading,
        studentsDb,
        studentsDbError,
        studentsDbLoading,
        classDaysDb,
        classDaysDbError,
        classDaysDbLoading,
        appUsersDb,
        appUsersDbError,
        appUsersDbLoading,
        systemConstantsDb,
        systemConstantsDbError,
        systemConstantsDbLoading,
        // DATABASE DATA
        appUsersDatabaseData,
        schoolDatabaseData,
        schoolClassDatabaseData,
        schoolCourseDatabaseData,
        scheduleDatabaseData,
        systemConstantsValues,
        teacherDatabaseData,
        curriculumDatabaseData,
        studentsDatabaseData,
        classDaysDatabaseData,
        systemConstantsDatabaseData,
        // END OF DATABASE DATA
        theme,
        user,
        userFullData,
        userLoading,
        calcStudentPrice,
        calcStudentPrice2,
        formatCurriculumName,
        handleAllCurriculumDetails,
        handleCurriculumDetailsWithSchoolCourse,
        handleDeleteCurriculum,
        handleDeleteCourse,
        handleDeleteSchedule,
        handleDeleteSchool,
        handleDeleteStudent,
        handleDeleteTeacher,
        handleOneCurriculumDetails,
        handleOneStudentDetails,
        setCheckUser,
        setIsExperimentalClass,
        setIsSubmitting,
        setLogged,
        setLogin,
        setPage,
        setTheme,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};
