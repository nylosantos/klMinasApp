import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { UserFullDataProps } from "../../@types";
import { app, initFirebase } from "../../db/Firebase";
import {
  buttonThemeChanger,
  divHeaderCenter,
  divHeaderContainer,
  divHeaderItemNavigation,
  divHeaderLeft,
  divHeaderMaster,
  divHeaderRight,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function Header() {
  // INITIALIZING FIREBASE
  initFirebase();

  // FIREBASE AUTH
  const auth = getAuth();

  // ROUTING USER
  const router = useRouter();

  // USER AUTH STATE
  const [user, loading] = useAuthState(auth);

  // THEME CHANGER HOOK
  const { systemTheme, theme, setTheme } = useTheme();

  // MOUNTED PAGE
  const [mounted, setMounted] = useState(false);

  // MOUNTED AFTER PAGE IS LOADED
  useEffect(() => {
    setMounted(true);
  }, []);

  // USER DATA STATE
  const [userFullData, setUserFullData] = useState<UserFullDataProps>();

  // HANDLE USER DATA FUNCTION
  const handleUserFullData = async (user: User | null | undefined) => {
    if (user !== null && user !== undefined) {
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        setUserFullData(results[0]);
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

  // IF NO USER REDIRECT, IF USER GET DATA
  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      handleUserFullData(user);
    }
  }, [user]);

  // HEADER NAVIGATION
  const navigations = [
    { label: "Dashboard", path: "/Dashboard" },
    { label: "Gerenciar Escolas", path: "/ManageSchools" },
    {
      label:
        userFullData?.role === "root" || userFullData?.role === "admin"
          ? "Gerenciar Contas"
          : "Gerenciar Conta",
      path: "/ManageUsers",
    },
  ];

  // THEME CHANGER FUNCTION
  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;
    return (
      /* BUTTON THEME CHANGER */
      <button
        className={buttonThemeChanger}
        onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          {currentTheme === "light" ? (
            /* BUTTON THEME CHANGER TO DARK */
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          ) : (
            /* BUTTON THEME CHANGER TO LIGHT */
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          )}
        </svg>
      </button>
    );
  };

  return (
    <div className={divHeaderMaster}>
      <div className={divHeaderContainer}>
        {/* 'HI USER' LEFT */}
        <div className={divHeaderLeft}>
          {user ? <p>Olá, {user.displayName}</p> : null}
        </div>

        {/* NAVIGATION DISPLAY CENTER */}
        <div className={divHeaderCenter}>
          {user ? (
            <>
              {navigations.map((nav) => (
                <div key={nav.path} className={divHeaderItemNavigation}>
                  <Link href={nav.path}>{nav.label}</Link>
                </div>
              ))}
              {/* NAVIGATION LOGOUT ITEM */}
              <div key={"logout"} className={divHeaderItemNavigation}>
                <p className="cursor-pointer" onClick={() => auth.signOut()}>
                  Sair
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* BUTTON THEME CHANGE RIGHT */}
        <div className={divHeaderRight}>{renderThemeChanger()}</div>
      </div>
    </div>
  );
}
