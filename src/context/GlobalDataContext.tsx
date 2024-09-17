/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { app, initFirebase } from "../db/Firebase";
import { Auth, getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppUsersSearchProps } from "../@types";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

export type SetPageProps = {
  prev: "Dashboard" | "Settings" | "ManageSchools" | "ManageUsers";
  show: "Dashboard" | "Settings" | "ManageSchools" | "ManageUsers";
};

export type GlobalDataContextType = {
  auth: Auth;
  isSubmitting: boolean;
  login: boolean;
  logged: boolean;
  page: SetPageProps;
  theme: "dark" | "light" | null;
  user: User | null | undefined;
  userFullData: AppUsersSearchProps | undefined;
  userLoading: boolean;
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
  const [userFullData, setUserFullData] = useState<AppUsersSearchProps>();

  // HANDLE USER DATA FUNCTION
  const handleUserFullData = async (user: User | null | undefined) => {
    if (user !== null && user !== undefined) {
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const promises: AppUsersSearchProps[] = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data() as AppUsersSearchProps;
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        setUserFullData(results[0]);
        setLogged(true);
        setIsSubmitting(false);
        setLogin(false);
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
    }

    if (user && !userFullData) {
      handleUserFullData(user);
    }

    if (user && userFullData) {
      setLogged(true);
      setIsSubmitting(false);
    }
  }, [user]);

  // PAGE STATE
  const [page, setPage] = useState<SetPageProps>({
    prev: "Dashboard",
    show: "Dashboard",
  });

  return (
    <GlobalDataContext.Provider
      value={{
        auth,
        isSubmitting,
        logged,
        login,
        page,
        theme,
        user,
        userFullData,
        userLoading,
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
