/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { app, initFirebase } from "../db/Firebase";
import { Auth, getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  ClassDaySearchProps,
  CurriculumSearchProps,
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
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export type SetPageProps = {
  prev: "Dashboard" | "Settings" | "ManageSchools" | "ManageUsers";
  show: "Dashboard" | "Settings" | "ManageSchools" | "ManageUsers";
};

export type GlobalDataContextType = {
  auth: Auth;
  checkUser: boolean;
  isExperimentalClass: boolean;
  isSubmitting: boolean;
  login: boolean;
  logged: boolean;
  page: SetPageProps;
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
  // END OF DATABASE DATA
  theme: "dark" | "light" | null;
  user: User | null | undefined;
  userFullData: UserFullDataProps | undefined;
  userLoading: boolean;
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
        setCurriculumDatabaseData(
          curriculumsDatabaseData.sort((a, b) => a.name.localeCompare(b.name))
        );
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
        // DATABASE DATA
        appUsersDatabaseData,
        schoolDatabaseData,
        schoolClassDatabaseData,
        schoolCourseDatabaseData,
        scheduleDatabaseData,
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
