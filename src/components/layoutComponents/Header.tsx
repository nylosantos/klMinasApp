/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";

import Logo from "../../assets/logoAlt1.png";
import LogoDark from "../../assets/logoAlt2.png";
import { customerFullName } from "../../custom";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

export function Header() {
  // GET GLOBAL DATA
  const {
    auth,
    page,
    theme,
    logged,
    userFullData,
    setLogin,
    setPage,
    setTheme,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // MOUNTED PAGE
  const [mounted, setMounted] = useState(false);

  // MOUNTED AFTER PAGE IS LOADED
  useEffect(() => {
    setMounted(true);
  }, []);

  // THEME CHANGER FUNCTION
  const renderThemeChanger = () => {
    if (!mounted) return null;
    return (
      /* BUTTON THEME CHANGER */
      <button
        className="bg-green-500/10 text-klGreen-500 dark:bg-klGreen-500/30 dark:text-klOrange-500 p-2 rounded-md hover:bg-green-500/20 dark:hover:bg-green-500/50"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          {theme === "light" ? (
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
    <div className="w-screen flex justify-center top-0 left-0 mb-4 bg-klGreen-500/20 dark:bg-klGreen-500/30">
      <div className="flex container justify-between items-center py-6">
        {/* LOGO LEFT */}
        <div className="w-1/6">
          <img
            src={theme === "light" ? Logo : LogoDark}
            alt={`Logo ${customerFullName}`}
            width={200}
            className="dark:bg-transparent dark:rounded-xl p-4"
          />
        </div>

        {/* NAVIGATION DISPLAY CENTER */}
        <div className="flex w-4/6 justify-center gap-10">
          {logged && userFullData && (
            <>
              {/* DASHBOARD NAV ITEM */}
              <div
                key={"Dashboard"}
                className="flex border-b-2 border-klGreen-500/0 hover:border-klGreen-500 dark:border-klGreen-500/10 dark:hover:border-klOrange-500"
              >
                <button
                  onClick={() =>
                    setPage({ prev: page.show, show: "Dashboard" })
                  }
                  className={
                    page.show === "Dashboard"
                      ? `text-klOrange-500 dark:text-gray-100`
                      : "text-klGreen-500 dark:text-klOrange-500"
                  }
                >
                  Início
                </button>
              </div>
              {(userFullData.role === "root" ||
                userFullData.role === "admin") && (
                <>
                  {/* MANAGE SCHOOLS NAV ITEM */}
                  <div
                    key={"ManageSchools"}
                    className="flex border-b-2 border-klGreen-500/0 hover:border-klGreen-500 dark:border-klGreen-500/10 dark:hover:border-klOrange-500"
                  >
                    <button
                      onClick={() =>
                        setPage({ prev: page.show, show: "ManageSchools" })
                      }
                      className={
                        page.show === "ManageSchools"
                          ? `text-klOrange-500 dark:text-gray-100`
                          : "text-klGreen-500 dark:text-klOrange-500"
                      }
                    >
                      Gerenciar Escolas
                    </button>
                  </div>
                </>
              )}
              {/* NAVIGATION SETTINGS NAV ITEM */}
              <div
                key={"Settings"}
                className="flex border-b-2 border-klGreen-500/0 hover:border-klGreen-500 dark:border-klGreen-500/10 dark:hover:border-klOrange-500"
              >
                <button
                  onClick={() => setPage({ prev: page.show, show: "Settings" })}
                  className={
                    page.show === "Settings"
                      ? `text-klOrange-500 dark:text-gray-100`
                      : "text-klGreen-500 dark:text-klOrange-500"
                  }
                >
                  Configurações
                </button>
              </div>
              {/* NAVIGATION LOGOUT ITEM */}
              <div
                key={"logout"}
                className="flex border-b-2 border-klGreen-500/0 hover:border-red-500 dark:border-klGreen-500/10 dark:hover:border-red-500"
              >
                <p
                  className="text-klGreen-500 dark:text-klOrange-500 hover:text-red-500 dark:hover:text-red-500 cursor-pointer"
                  onClick={() => {
                    setLogin(true);
                    auth.signOut();
                  }}
                >
                  Sair
                </p>
              </div>
            </>
          )}
        </div>

        {/* BUTTON THEME CHANGE RIGHT */}
        <div className="flex w-1/6 justify-end items-center gap-4">
          {logged && userFullData && (
            <p
              className="text-klGreen-500 dark:text-klOrange-500 hover:text-klGreen-500/70 hover:dark:text-klOrange-500/80 font-bold cursor-pointer"
              onClick={() => setPage({ prev: page.show, show: "Settings" })}
            >
              Olá, {userFullData.name.split(' ')[0]}
            </p>
          )}
          {renderThemeChanger()}
        </div>
      </div>
    </div>
  );
}
