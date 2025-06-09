/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { app, initFirebase } from "../db/Firebase";
import { Auth, getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  CalculateStudentMonthlyFeeResult,
  ClassDaySearchProps,
  ConfirmationToSubmitProps,
  CurriculumArrayProps,
  CurriculumSearchProps,
  CurriculumToAddProps,
  CurriculumWithNamesProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  StudentFamilyToUpdateProps,
  StudentSearchProps,
  SystemConstantsSearchProps,
  TeacherSearchProps,
  UpdateStudentFeeProps,
  UserFullDataProps,
  VacancyCalculationResult,
} from "../@types";
import { toast } from "react-toastify";
import {
  arrayRemove,
  collection,
  doc,
  DocumentData,
  FirestoreError,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";
import {
  secureDeleteDoc,
  secureSetDoc,
  secureUpdateDoc,
} from "../hooks/firestoreMiddleware";

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
  calculateStudentMonthlyFee(
    studentId: string,
    newStudent?: {
      curriculums: CurriculumArrayProps[];
      familyDiscount: boolean;
      studentFamilyAtSchool: string[];
      employeeDiscount: boolean;
      customDiscount: boolean;
      customDiscountValue: string;
      secondCourseDiscount: boolean;
    }
  ): Promise<CalculateStudentMonthlyFeeResult>;
  updateStudentFeeData({
    studentId,
    appliedPrice,
    fullPrice,
    customDiscount,
    customDiscountValue,
    familyDiscount,
    secondCourseDiscount,
    employeeDiscount,
    studentFamilyToUpdate,
  }: CalculateStudentMonthlyFeeResult): Promise<void>;
  calculateEnrollmentFee: (discount?: boolean) => number;
  calculatePlacesAvailable(
    classId: string,
    classDays: number[],
    studentId?: string
  ): Promise<VacancyCalculationResult>;
  handleConfirmationToSubmit({
    title,
    text,
    icon,
    showCancelButton,
    cancelButtonText,
    confirmButtonText,
  }: ConfirmationToSubmitProps): Promise<SweetAlertResult>;
  getExperimentalCurriculums: (
    curriculums: CurriculumToAddProps[]
  ) => CurriculumToAddProps[];
  getRegularCurriculums: (
    curriculums: CurriculumToAddProps[]
  ) => CurriculumToAddProps[];
  getWaitingCurriculums: (
    curriculums: CurriculumToAddProps[]
  ) => CurriculumToAddProps[];
  toggleActiveStudent(
    isActive: boolean,
    studentId: string,
    resetForm: () => void,
    closeModal?: () => void
  ): Promise<void>;
  // logDelete: (
  //   deletedData: unknown,
  //   entity: string,
  //   entityId: string
  // ) => Promise<void>;
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
          placesAvailable: curriculum.placesAvailable,
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
          placesAvailable: curriculum.placesAvailable,
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

  function calculateFullPriceForCurriculum(
    curriculumId: string,
    curriculumIndexDays: number[],
    // curriculumDatabaseData: CurriculumSearchProps[],
    // schoolCourseDatabaseData: SchoolCourseSearchProps[],
    systemConstantsValues: SystemConstantsSearchProps
  ): number {
    // Passo 1: Encontrar o curriculum correspondente
    const curriculum = curriculumDatabaseData.find(
      (c) => c.id === curriculumId
    );
    if (!curriculum) throw new Error("Curriculum not found");

    // Passo 2: Encontrar a modalidade correspondente
    const schoolCourse = schoolCourseDatabaseData.find(
      (s) => s.id === curriculum.schoolCourseId
    );
    if (!schoolCourse) throw new Error("School course not found");

    // Passo 3: Obter os valores necessários
    const { priceUnit, priceBundle, bundleDays } = schoolCourse;

    // Passo 4: Determinar o número de aulas semanais
    const classDays = curriculumIndexDays.length;

    // Passo 5: Calcular o preço total
    // Se nenhum dia foi escolhido, retorna 0
    if (classDays < 1) {
      return 0;
    }

    // Se há apenas um dia, aplica o preço unitário
    if (classDays === 1) {
      return priceUnit;
    }

    // Se há mais de um dia, aplica o preço do bundle
    const quotient = Math.floor(classDays / bundleDays);
    const remainder = classDays % bundleDays;

    // Se não houver dias adicionais (resto zero)
    if (remainder === 0) {
      if (quotient === 1) {
        // Se houver apenas um bundle completo, aplica o preço completo para o primeiro bundle
        return priceBundle;
      } else {
        // Se houver mais de um bundle completo, aplica o preço total para o primeiro e o desconto para os extras
        return (
          priceBundle +
          (quotient - 1) *
            priceBundle *
            systemConstantsValues.secondCourseDiscountValue
        );
      }
    }

    // Se houver dias adicionais (resto não zero)
    if (quotient === 1) {
      // Se houver apenas um bundle completo, aplica o preço completo para o primeiro bundle e o preço com desconto para os dias restantes
      return (
        priceBundle +
        remainder *
          (priceUnit * systemConstantsValues.secondCourseDiscountValue)
      );
    }

    // Para mais de um bundle, o primeiro é a preço total e os seguintes recebem desconto
    return (
      priceBundle + // Preço do primeiro bundle
      (quotient - 1) *
        priceBundle *
        systemConstantsValues.secondCourseDiscountValue + // Preço com desconto para os bundles extras
      remainder * (priceUnit * systemConstantsValues.secondCourseDiscountValue) // Preço das aulas restantes com desconto
    );
  }

  async function calculateStudentMonthlyFee(
    studentId: string,
    newStudent?: {
      curriculums: CurriculumArrayProps[];
      familyDiscount: boolean;
      studentFamilyAtSchool: string[];
      employeeDiscount: boolean;
      customDiscount: boolean;
      customDiscountValue: string;
      secondCourseDiscount: boolean;
    }
  ): Promise<CalculateStudentMonthlyFeeResult> {
    if (!systemConstantsValues) {
      throw new Error("System constants not found");
    }

    let studentData: StudentSearchProps | null = null;

    // Se newStudent não for fornecido, buscamos os dados do aluno no Firestore
    if (!newStudent) {
      const userRef = collection(db, "students");
      const q = query(userRef, where("id", "==", studentId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        studentData = querySnapshot.docs[0].data() as StudentSearchProps;
      }
    }

    // Determina qual conjunto de dados será utilizado
    const student = newStudent || studentData;
    if (!student) throw new Error("Student data not found");

    let fullPrice = 0;
    let appliedPrice = 0;
    let studentFamilyToUpdate: StudentFamilyToUpdateProps[] = [];

    // Verifica se o aluno está ativo
    const students = studentsDb as StudentSearchProps[];

    const foundedStudent = students.find(
      (student) => student.id === student.id
    );

    const isActive = newStudent
      ? true
      : foundedStudent
      ? foundedStudent.active
      : false;

    // Calcula o preço total dos currículos do aluno
    const curriculumPrices = await Promise.all(
      student.curriculums.map((curriculum) => {
        if (curriculum.isExperimental || curriculum.isWaiting) {
          return 0;
        } else
          return calculateFullPriceForCurriculum(
            curriculum.id,
            curriculum.indexDays,
            systemConstantsValues
          );
      })
    );

    // Soma os preços dos currículos para obter o preço total
    fullPrice = +curriculumPrices
      .reduce((sum, price) => sum + price, 0)
      .toFixed(2);

    // Verifica se há um desconto personalizado aplicado ao aluno
    if (student.customDiscount && isActive) {
      appliedPrice = parseFloat(
        (
          fullPrice *
          (1 - parseFloat(student.customDiscountValue) / 100)
        ).toFixed(2)
      );
      return {
        studentId,
        appliedPrice,
        fullPrice,
        customDiscount: true,
        customDiscountValue: student.customDiscountValue,
        familyDiscount: false,
        secondCourseDiscount: false,
        employeeDiscount: false,
      };
    }

    // Verifica se o aluno tem desconto de funcionário
    if (student.employeeDiscount && isActive) {
      appliedPrice = +(
        fullPrice * systemConstantsValues.employeeDiscountValue
      ).toFixed(2);
      return {
        studentId,
        appliedPrice,
        fullPrice,
        employeeDiscount: true,
        familyDiscount: false,
        secondCourseDiscount: false,
        customDiscount: false,
        customDiscountValue: "0",
      };
    }

    // Verifica se o aluno tem desconto familiar
    if (student.familyDiscount && student.studentFamilyAtSchool.length > 0) {
      const familyCurriculums: Array<{
        curriculumId: string;
        studentId: string;
        indexDays: number[];
        price: number;
      }> = [];

      const familyMembers = [studentId, ...student.studentFamilyAtSchool];

      // Adiciona o estudante atual com seus dados atualizados diretamente na lista de familyCurriculums
      for (const curriculum of student.curriculums) {
        const price = calculateFullPriceForCurriculum(
          curriculum.id,
          curriculum.indexDays,
          systemConstantsValues
        );
        familyCurriculums.push({
          curriculumId: curriculum.id,
          studentId: studentId,
          indexDays: curriculum.indexDays,
          price,
        });
      }
      const curriculumDbTransformed: CurriculumSearchProps[] = curriculumDb
        ? curriculumDb.map((doc: DocumentData) => ({
            ...(doc as CurriculumSearchProps),
          }))
        : [];
      // Agora itere pelos currículos do banco de dados
      for (const curriculum of curriculumDbTransformed) {
        for (const studentFromDb of curriculum.students) {
          if (familyMembers.includes(studentFromDb.id)) {
            const foundedStudent = students.find(
              (student) =>
                student.id === studentFromDb.id && student.id !== studentId
            );
            if (
              foundedStudent &&
              !foundedStudent.customDiscount &&
              !foundedStudent.employeeDiscount &&
              foundedStudent.active
            ) {
              const price = calculateFullPriceForCurriculum(
                curriculum.id,
                studentFromDb.indexDays,
                systemConstantsValues
              );
              familyCurriculums.push({
                curriculumId: curriculum.id,
                studentId: studentFromDb.id,
                indexDays: studentFromDb.indexDays,
                price,
              });
            }
          }
        }
      }

      // Tipando o acumulador
      interface Curriculum {
        curriculumId: string;
        studentId: string;
        indexDays: number[];
        price: number;
      }

      interface MemberData {
        fullPrice: number;
        appliedPrice: number;
        curriculums: Curriculum[];
      }

      // Tipando o objeto de acumulador
      const groupedByMember = familyCurriculums.reduce<{
        [key: string]: MemberData;
      }>((acc, curriculum) => {
        // Encontrar o maior preço
        const maxPrice = Math.max(...familyCurriculums.map((c) => c.price));

        // Aplicar o desconto nos currículos que não são o de maior preço
        const appliedPrice =
          curriculum.price === maxPrice
            ? curriculum.price // Mantém o preço sem alteração
            : curriculum.price * systemConstantsValues.familyDiscountValue; // Aplica o desconto

        // Adicionar os currículos ao grupo do membro correto
        if (!acc[curriculum.studentId]) {
          acc[curriculum.studentId] = {
            fullPrice: 0,
            appliedPrice: 0,
            curriculums: [],
          };
        }

        // Adicionar ao array de currículos do membro
        acc[curriculum.studentId].curriculums.push(curriculum);

        // Somar os preços sem desconto (fullPrice)
        acc[curriculum.studentId].fullPrice += curriculum.price;

        // Somar os preços com o desconto aplicado (appliedPrice)
        acc[curriculum.studentId].appliedPrice += appliedPrice;

        return acc;
      }, {});

      const result = Object.keys(groupedByMember).map((memberId) => {
        const memberData = groupedByMember[memberId];
        return {
          familyId: memberId,
          appliedPrice: +memberData.appliedPrice.toFixed(2), // Preço final com desconto
          fullPrice: +memberData.fullPrice.toFixed(2), // Preço total sem desconto
          familyDiscount: true,
          secondCourseDiscount: false,
          employeeDiscount: false,
          customDiscount: false,
          customDiscountValue: "0",
        };
      });
      // Excluindo o studentId de studentFamilyToUpdate
      studentFamilyToUpdate = result.filter(
        (member) => member.familyId !== studentId
      );

      appliedPrice =
        result.find((member) => member.familyId === studentId)?.appliedPrice ||
        fullPrice;

      return {
        studentId,
        appliedPrice,
        fullPrice,
        familyDiscount: true,
        secondCourseDiscount: false,
        employeeDiscount: false,
        customDiscount: false,
        customDiscountValue: "0",
        studentFamilyToUpdate,
      };
    }

    // Verifica se o aluno tem desconto para um segundo curso
    if (curriculumPrices.length > 1) {
      // Encontre o valor máximo
      const maxPrice = Math.max(...curriculumPrices);

      // Encontre o índice da primeira ocorrência do valor máximo
      const maxPriceIndex = curriculumPrices.indexOf(maxPrice);

      // Filtra os preços, mantendo todos os preços que não são a primeira ocorrência do maior preço
      const discountedCourses = curriculumPrices.filter(
        (_, index) => index !== maxPriceIndex // Filtrando pelo índice correto
      );

      const discountAmount = discountedCourses.reduce(
        (sum, price) =>
          // sum + price * (1 - systemConstantsValues.secondCourseDiscountValue),
          sum + price * systemConstantsValues.secondCourseDiscountValue,
        0
      );

      appliedPrice = maxPrice + discountAmount;

      return {
        studentId,
        appliedPrice: +appliedPrice.toFixed(2),
        fullPrice: +fullPrice.toFixed(2),
        secondCourseDiscount: discountAmount > 0 ? true : false,
        familyDiscount: false,
        employeeDiscount: false,
        customDiscount: false,
        customDiscountValue: "0",
      };
    }

    if (isActive) {
      // Se nenhum desconto for aplicado, o preço final será o preço total
      appliedPrice = +fullPrice.toFixed(2);
      return {
        studentId,
        appliedPrice,
        fullPrice,
        secondCourseDiscount: false,
        familyDiscount: false,
        employeeDiscount: false,
        customDiscount: false,
        customDiscountValue: "0",
      };
    } else {
      // Se o aluno estiver inativo, retorna 0
      return {
        studentId,
        appliedPrice,
        fullPrice,
        secondCourseDiscount: false,
        familyDiscount: false,
        employeeDiscount: false,
        customDiscount: false,
        customDiscountValue: "0",
      };
    }
  }

  // UPDATE FEE ON FIREBASE
  async function updateStudentFeeData({
    newStudent,
    studentId,
    appliedPrice,
    fullPrice,
    customDiscount,
    customDiscountValue,
    familyDiscount,
    secondCourseDiscount,
    employeeDiscount,
    studentFamilyToUpdate,
  }: UpdateStudentFeeProps): Promise<void> {
    if (!newStudent) {
      await secureUpdateDoc(doc(db, "students", studentId), {
        appliedPrice,
        fullPrice,
        secondCourseDiscount,
        familyDiscount,
        employeeDiscount,
        customDiscount,
        customDiscountValue,
      });
    }

    if (studentFamilyToUpdate && studentFamilyToUpdate.length > 0) {
      for (const familyMember of studentFamilyToUpdate) {
        await secureUpdateDoc(doc(db, "students", familyMember.familyId), {
          appliedPrice: familyMember.appliedPrice,
          fullPrice: familyMember.fullPrice,
          secondCourseDiscount: familyMember.secondCourseDiscount,
          familyDiscount: familyMember.familyDiscount,
          employeeDiscount: familyMember.employeeDiscount,
          customDiscount: familyMember.customDiscount,
          customDiscountValue: familyMember.customDiscountValue,
        });
      }
    }
  }

  // ENROLMENT FEE CALC FUNCTION
  const calculateEnrollmentFee = (discount?: boolean): number => {
    if (!systemConstantsValues) {
      throw new Error("System constants not found");
    }
    const currentMonth = new Date().getMonth() + 1; // Obtém o mês atual (1 a 12)

    let discountToCalc = discount ? 0 : 1; // 100% (sem desconto)

    if (currentMonth >= 8 && currentMonth <= 10) {
      discountToCalc = 0.5; // 50% de desconto
    } else if (currentMonth >= 11) {
      discountToCalc = 0; // Isenção de matrícula
    }

    return systemConstantsValues.enrolmentFee * discountToCalc;
  };

  async function calculatePlacesAvailable(
    classId: string,
    classDays: number[],
    studentId?: string
  ): Promise<VacancyCalculationResult> {
    if (!curriculumDb) {
      throw new Error(`Turma com id ${classId} não encontrada`);
    }

    const classData = curriculumDb.find(
      (document) => document.id === classId
    ) as CurriculumSearchProps;

    if (!classData) {
      throw new Error(`Turma com id ${classId} não encontrada`);
    }

    const placesAvailable = classData.placesAvailable;
    let students = classData.students;

    // Se um studentId for fornecido, exclui o aluno de edição da lista de estudantes
    if (studentId) {
      students = students.filter((student) => student.id !== studentId);
    }

    // Criar array de vagas compartilhadas
    const sharedVacanciesArray = Array.from({ length: placesAvailable }, () =>
      classDays.reduce((acc, day) => {
        acc[day] = false; // Inicializa todas as frações da vaga como disponíveis
        return acc;
      }, {} as Record<number, boolean>)
    );

    // Percorrer os alunos e marcar as frações ocupadas
    students.forEach((student) => {
      if (!studentsDb) {
        throw new Error(`Falha na consulta ao banco de dados`);
      }
      const studentData = studentsDb.find(
        (document) => document.id === student.id
      ) as StudentSearchProps;

      if (studentData.active) {
        for (const sharedVacancy of sharedVacanciesArray) {
          if (student.indexDays.every((day) => sharedVacancy[day] === false)) {
            student.indexDays.forEach((day) => {
              sharedVacancy[day] = true;
            });
            break;
          }
        }
      }
    });

    // Calcular o número total de vagas disponíveis
    let totalAvailableVacancies = sharedVacanciesArray.reduce(
      (count, sharedVacancy) => {
        // Se todas as frações estão ocupadas, essa vaga não conta como disponível
        if (Object.values(sharedVacancy).every((occupied) => occupied)) {
          return count - 1;
        }
        return count;
      },
      placesAvailable
    );

    totalAvailableVacancies = Math.max(0, totalAvailableVacancies);

    // Calcular vagas disponíveis por dia
    const vacanciesPerDay = new Array(7).fill(0);
    classDays.forEach((day) => {
      vacanciesPerDay[day] = sharedVacanciesArray.filter(
        (sharedVacancy) => !sharedVacancy[day]
      ).length;
    });

    // Determinar vagas parciais
    const partialVacancies: { day: number; remainingVacancies: number }[] = [];
    classDays.forEach((day) => {
      if (vacanciesPerDay[day] > 0) {
        partialVacancies.push({
          day,
          remainingVacancies: vacanciesPerDay[day],
        });
      }
    });

    // Determinar o tipo de vaga com base na ocupação parcial
    let vacancyType: "total" | "partial" = "total";
    for (const sharedVacancy of sharedVacanciesArray) {
      if (Object.values(sharedVacancy).some((occupied) => !occupied)) {
        vacancyType = "partial";
        break;
      }
    }

    // Verificar se todas as vagas estão totalmente disponíveis
    const totalVacanciesAvailable = sharedVacanciesArray.some((sharedVacancy) =>
      Object.values(sharedVacancy).every((occupied) => !occupied)
    );

    return {
      vacanciesAvailable: totalAvailableVacancies > 0,
      totalVacanciesAvailable,
      partialVacancies,
      vacancyType,
      vacanciesPerDay,
      totalAvailableVacancies,
    };
  }

  const getExperimentalCurriculums = (curriculums: CurriculumToAddProps[]) => {
    return curriculums.filter((curriculum) => curriculum.isExperimental);
  };

  const getRegularCurriculums = (curriculums: CurriculumToAddProps[]) => {
    return curriculums.filter(
      (curriculum) => !curriculum.isExperimental && !curriculum.isWaiting
    );
  };

  const getWaitingCurriculums = (curriculums: CurriculumToAddProps[]) => {
    return curriculums.filter((curriculum) => curriculum.isWaiting);
  };

  // // Função para criar um log de exclusão
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const logDelete = async (
  //   deletedData: unknown,
  //   entity: string,
  //   entityId: string
  // ): Promise<void> => {
  //   const db = getFirestore();
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (!user) {
  //     console.log("Usuário não autenticado.");
  //     return;
  //   }

  //   // Criar um ID aleatório para o log
  //   const logId: string = Math.random().toString(36).substr(2, 9); // Cria um ID aleatório para o log

  //   const logData: LogData = {
  //     id: logId,
  //     action: "delete",
  //     changedBy: user.uid, // ID do usuário que fez a exclusão
  //     deletedData: deletedData, // Dados deletados
  //     entity: entity, // Nome da coleção
  //     entityId: entityId, // ID do documento afetado
  //     timestamp: Timestamp.now(), // Data e hora da operação
  //   };

  //   try {
  //     // Adiciona o log na coleção 'logs' no Firestore
  //     await secureAddDoc(collection(db, "logs"), logData);
  //     console.log("Log de exclusão registrado com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao registrar log de exclusão:", error);
  //   }
  // };

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

  function handleConfirmationToSubmit({
    title,
    text,
    icon,
    showCancelButton,
    cancelButtonText,
    confirmButtonText,
  }: ConfirmationToSubmitProps): Promise<SweetAlertResult> {
    return new Promise((resolve, reject) => {
      ConfirmationAlert.fire({
        title,
        text,
        icon,
        showCancelButton,
        cancelButtonColor: "#d33",
        cancelButtonText,
        confirmButtonColor: "#2a5369",
        confirmButtonText,
      })
        .then((result) => {
          resolve(result); // Retorna o objeto completo do SweetAlert
        })
        .catch((error) => {
          reject(error); // Em caso de erro, rejeitar a promessa
        });
    });
  }

  // DELETE STUDENT FUNCTION
  async function toggleActiveStudent(
    isActive: boolean,
    studentId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: `${isActive ? "Desativar" : "Ativar"} Aluno`,
      text: `Tem certeza que deseja ${
        isActive ? "desativar" : "ativar"
      } este Aluno?`,
      icon: "warning",
      confirmButtonText: `Sim, ${isActive ? "desativar" : "ativar"}`,
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      await secureSetDoc(
        doc(db, "students", studentId),
        {
          active: !isActive,
          curriculums: [],
        },
        { merge: true }
      );

      const studentToToggleActive = studentsDatabaseData.find(
        (student) => student.id === studentId
      );
      if (studentToToggleActive) {
        if (
          studentToToggleActive.familyDiscount &&
          studentToToggleActive.studentFamilyAtSchool.length > 0
        ) {
          const curriculums = studentToToggleActive.curriculums.map(
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
            studentToToggleActive.id,
            {
              curriculums,
              customDiscount: studentToToggleActive.customDiscount,
              customDiscountValue: studentToToggleActive.customDiscountValue,
              employeeDiscount: studentToToggleActive.employeeDiscount,
              familyDiscount: studentToToggleActive.familyDiscount,
              secondCourseDiscount: studentToToggleActive.secondCourseDiscount,
              studentFamilyAtSchool:
                studentToToggleActive.studentFamilyAtSchool,
            }
          );
          if (fee.studentFamilyToUpdate) {
            const studentValues = {
              secondCourseDiscount: fee.secondCourseDiscount,
              appliedPrice: fee.appliedPrice,
              familyDiscount: fee.familyDiscount,
              customDiscount: fee.customDiscount,
              customDiscountValue: fee.customDiscountValue,
              employeeDiscount: fee.employeeDiscount,
              familyId: studentToToggleActive.id,
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
              // if (family.familyId !== studentEditData.id) {
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
              // }
            });
          }
        }

        // DELETE STUDENT FROM CURRICULUM
        if (studentToToggleActive.curriculums.length > 0) {
          studentToToggleActive.curriculums.map(async (studentCurriculum) => {
            const editingCurriculum = curriculumDatabaseData.find(
              (curriculum) => curriculum.id === studentCurriculum.id
            );
            if (editingCurriculum) {
              const foundedStudentOnCurriculum =
                editingCurriculum.students.find(
                  (student) => student.id === studentId
                );

              if (foundedStudentOnCurriculum) {
                await secureUpdateDoc(
                  doc(db, "curriculum", editingCurriculum.id),
                  {
                    students: arrayRemove({
                      date: foundedStudentOnCurriculum.date,
                      id: foundedStudentOnCurriculum.id,
                      indexDays: foundedStudentOnCurriculum.indexDays,
                      isExperimental: foundedStudentOnCurriculum.isExperimental,
                      isWaiting: foundedStudentOnCurriculum.isWaiting,
                    }),
                  }
                );
              }
            }
          });
        }

        closeModal && closeModal();
        resetForm();
        toast.success(
          `Aluno ${isActive ? "desativado" : "ativado"} com sucesso! 👌`,
          {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        );
        setIsSubmitting(false);
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
  }
  // DELETE STUDENT FUNCTION
  async function handleDeleteStudent(
    studentId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Aluno",
      text: "Tem certeza que deseja deletar este Aluno?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);

      const studentToDelete = studentsDatabaseData.find(
        (student) => student.id === studentId
      );
      if (studentToDelete) {
        // TEST FOR BROTHERS REGISTERED
        if (studentToDelete.studentFamilyAtSchool.length > 0) {
          // IF EXISTS, REMOVE THIS STUDENT FROM YOUR BROTHER'S REGISTRATION
          studentToDelete.studentFamilyAtSchool.map(async (studentFamilyId) => {
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
                  await secureUpdateDoc(
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
                  await secureUpdateDoc(
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
                  await secureUpdateDoc(
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
                  await secureUpdateDoc(
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
                  await secureUpdateDoc(
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
                  await secureUpdateDoc(
                    doc(db, "students", editingStudentFamily.id),
                    {
                      studentFamilyAtSchool: arrayRemove(studentId),
                    }
                  );
                }
              }
            }
          });
        }

        // DELETE STUDENT FROM CURRICULUM
        if (studentToDelete.curriculums.length > 0) {
          studentToDelete.curriculums.map(async (studentCurriculum) => {
            const editingCurriculum = curriculumDatabaseData.find(
              (curriculum) => curriculum.id === studentCurriculum.id
            );
            if (editingCurriculum) {
              const foundedStudentOnCurriculum =
                editingCurriculum.students.find(
                  (student) => student.id === studentId
                );

              if (foundedStudentOnCurriculum) {
                await secureUpdateDoc(
                  doc(db, "curriculum", editingCurriculum.id),
                  {
                    students: arrayRemove({
                      date: foundedStudentOnCurriculum.date,
                      id: foundedStudentOnCurriculum.id,
                      indexDays: foundedStudentOnCurriculum.indexDays,
                      isExperimental: foundedStudentOnCurriculum.isExperimental,
                      isWaiting: foundedStudentOnCurriculum.isWaiting,
                    }),
                  }
                );
              }
            }
          });
        }

        // DELETE STUDENT
        const deleteStudent = async () => {
          try {
            await secureDeleteDoc(doc(db, "students", studentId));
            // await logDelete(studentToDelete, "students", studentToDelete.id);
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
  }

  // DELETE CURRICULUM FUNCTION
  async function handleDeleteCurriculum(
    curriculumId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Turma",
      text: "Tem certeza que deseja deletar esta Turma?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      const curriculumToDelete = curriculumDatabaseData.find(
        (curriculum) => curriculum.id === curriculumId
      );
      if (curriculumToDelete) {
        // CHECKING IF CURRICULUM CONTAINS STUDENTS
        // STUDENTS IN THIS CURRICULUM ARRAY
        const curriculumExistsOnStudent: StudentSearchProps[] = [];

        // SEARCH STUDENTS WITH THIS SCHOOL AND PUTTING ON ARRAY
        studentsDatabaseData.map((student) => {
          if (student.curriculums) {
            student.curriculums.map((studentCurriculum) => {
              if (studentCurriculum.id === curriculumId) {
                curriculumExistsOnStudent.push(student);
              }
            });
          }
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
                curriculumExistsOnStudent.length === 1 ? "o aluno" : "os alunos"
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
              await secureDeleteDoc(doc(db, "curriculum", curriculumId));
              await secureDeleteDoc(
                doc(db, "classDays", curriculumToDelete.classDayId)
              );
              // await logDelete(curriculumToDelete, "curriculum", curriculumId);
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
  }

  // DELETE TEACHER FUNCTION
  async function handleDeleteTeacher(
    teacherId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Professor",
      text: "Tem certeza que deseja deletar este Professor?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      const teachersDbTransformed: TeacherSearchProps[] = teachersDb
        ? teachersDb.map((doc: DocumentData) => ({
            ...(doc as TeacherSearchProps),
          }))
        : [];
      const curriculumDbTransformed: CurriculumSearchProps[] = curriculumDb
        ? curriculumDb.map((doc: DocumentData) => ({
            ...(doc as CurriculumSearchProps),
          }))
        : [];
      const teacherToDelete = teachersDbTransformed.find(
        (teacher) => teacher.id === teacherId
      );
      if (teacherToDelete && userFullData) {
        const deleteTeacher = async () => {
          try {
            if (teacherToDelete.haveAccount) {
              await deleteAppUser({
                teacherToDelete,
                userFullDataId: userFullData.id,
              });
            }
            await secureDeleteDoc(doc(db, "teachers", teacherToDelete.id));
            // await logDelete(teacherToDelete, "teachers", teacherToDelete.id);
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
        const teacherExistsOnCurriculum = curriculumDbTransformed.filter(
          (curriculum) => curriculum.teacherId === teacherToDelete.id
        );

        // IF EXISTS, RETURN ERROR
        if (teacherExistsOnCurriculum.length !== 0) {
          return (
            setIsSubmitting(false),
            toast.error(
              `Professor incluído em ${teacherExistsOnCurriculum.length} ${
                teacherExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
              }, exclua ou altere primeiramente ${
                teacherExistsOnCurriculum.length === 1 ? "a Turma" : "as Turmas"
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
  }

  // DELETE SCHOOL FUNCTION
  async function handleDeleteSchool(
    schoolId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Escola",
      text: "Tem certeza que deseja deletar esta Escola?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      const schoolToDelete = schoolDatabaseData.find(
        (school) => school.id === schoolId
      );
      if (schoolToDelete) {
        const deleteSchool = async () => {
          try {
            await secureDeleteDoc(doc(db, "schools", schoolToDelete.id));
            // await logDelete(schoolToDelete, "schools", schoolToDelete.id);
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
          if (student.curriculums) {
            student.curriculums.map((studentCurriculum) => {
              const foundedSchoolStudentWithCurriculum =
                schoolExistsOnCurriculum.find(
                  (schoolCurriculum) =>
                    schoolCurriculum.id === studentCurriculum.id
                );
              if (foundedSchoolStudentWithCurriculum) {
                schoolExistsOnStudent.push(student);
              }
            });
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
                schoolExistsOnCurriculum.length === 1 ? "a Turma" : "as Turmas"
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
  }

  // DELETE COURSE FUNCTION
  async function handleDeleteCourse(
    courseId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Modalidade",
      text: "Tem certeza que deseja deletar esta Modalidade?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      const courseToDelete = schoolCourseDatabaseData.find(
        (course) => course.id === courseId
      );
      if (courseToDelete) {
        // DELETE SCHOOL COURSE FUNCTION
        const deleteSchoolCourse = async () => {
          try {
            await secureDeleteDoc(doc(db, "schoolCourses", courseToDelete.id));
            // await logDelete(courseToDelete, "schoolCourses", courseToDelete.id);
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
          if (student.curriculums) {
            student.curriculums.map((studentCurriculum) => {
              const foundedSchoolCourseStudentWithCurriculum =
                schoolCourseExistsOnCurriculum.find(
                  (schoolCurriculum) =>
                    schoolCurriculum.id === studentCurriculum.id
                );
              if (foundedSchoolCourseStudentWithCurriculum) {
                schoolCourseExistsOnStudent.push(student);
              }
            });
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
                schoolCourseExistsOnCurriculum.length === 1 ? "Turma" : "Turmas"
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
  }

  // DELETE SCHEDULE FUNCTION
  async function handleDeleteSchedule(
    scheduleId: string,
    resetForm: () => void,
    closeModal?: () => void
  ) {
    const confirmation = await handleConfirmationToSubmit({
      title: "Deletar Horário",
      text: "Tem certeza que deseja deletar este Horário?",
      icon: "warning",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      const scheduleToDelete = scheduleDatabaseData.find(
        (schedule) => schedule.id === scheduleId
      );
      if (scheduleToDelete) {
        // DELETE SCHEDULE FUNCTION
        const deleteSchedule = async () => {
          try {
            await secureDeleteDoc(doc(db, "schedules", scheduleToDelete.id));
            // await logDelete(scheduleToDelete, "schedules", scheduleToDelete.id);
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
        // calcStudentPrice,
        // calcStudentPrice2,
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
        calculateStudentMonthlyFee,
        updateStudentFeeData,
        calculateEnrollmentFee,
        calculatePlacesAvailable,
        handleConfirmationToSubmit,
        getExperimentalCurriculums,
        getRegularCurriculums,
        getWaitingCurriculums,
        toggleActiveStudent,
        // logDelete,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};
