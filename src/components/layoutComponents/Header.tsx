/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import Logo from "../../assets/logoAlt1.png";
import LogoDark from "../../assets/logoAlt2.png";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import BackdropModal from "./BackdropModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CopyrightBottom from "./CopyrightBottom";
import { formatUserName } from "../../custom";

export function Header() {
  // GET GLOBAL DATA
  const {
    auth,
    page,
    theme,
    logged,
    systemConstantsValues,
    userFullData,
    setLogin,
    setPage,
    setTheme,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // MOUNTED PAGE
  const [mounted, setMounted] = useState(false);

  // MOBILE MENU STATE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        className="text-klGreen-500 dark:text-klOrange-500 rounded-md active:bg-green-500/20 active:hover:bg-green-500/50 transition-all duration-100"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[2.5vh] h-[2.5vh] md:w-[1.6vw] md:h-[1.6vw] 2xl:w-[1.3vw] 2xl:h-[1.3vw]"
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

  // CONFIRM ALERT MODAL
  const ConfirmationAlert = withReactContent(Swal);

  // NAVIGATION ITEMS FUNCTION
  const renderNavItems = () => (
    <div className="flex flex-col gap-[2.5vw] absolute justify-between h-[20vh] md:h-0 md:text-base text-lg space-y-[2vh] md:space-y-[0vh]">
      <div key="Dashboard">
        <button
          onClick={() => {
            setPage({ prev: page.show, show: "Dashboard" });
            setMobileMenuOpen(false);
          }}
          className={
            page.show === "Dashboard"
              ? "text-klOrange-500 dark:text-gray-100"
              : "text-klGreen-500 dark:text-klOrange-500"
          }
        >
          <p className="flex border-b-2 border-klGreen-500/0 md:hover:border-klGreen-500 dark:border-klGreen-500/10 dark:md:hover:border-klOrange-500">
            Início
          </p>
        </button>
      </div>
      {/* {userFullData &&
        (userFullData.role === "root" || userFullData.role === "admin") && (
          <div key="ManageSchools">
            <button
              onClick={() => {
                setPage({ prev: page.show, show: "ManageSchools" });
                setMobileMenuOpen(false);
              }}
              className={
                page.show === "ManageSchools"
                  ? `text-klOrange-500 dark:text-gray-100`
                  : "text-klGreen-500 dark:text-klOrange-500"
              }
            >
              <p className="flex border-b-2 border-klGreen-500/0 md:hover:border-klGreen-500 dark:border-klGreen-500/10 dark:md:hover:border-klOrange-500">
                Gerenciar Escolas
              </p>
            </button>
          </div>
        )} */}
      <div key="Settings">
        <button
          onClick={() => {
            setPage({ prev: page.show, show: "Settings" });
            setMobileMenuOpen(false);
          }}
          className={
            page.show === "Settings"
              ? `text-klOrange-500 dark:text-gray-100`
              : "text-klGreen-500 dark:text-klOrange-500"
          }
        >
          <p className="flex border-b-2 border-klGreen-500/0 md:hover:border-klGreen-500 dark:border-klGreen-500/10 dark:md:hover:border-klOrange-500">
            Configurações
          </p>
        </button>
      </div>
      <div key="logout">
        <p
          className="flex border-b-2 border-klGreen-500/0 dark:border-klGreen-500/10 text-red-500 dark:text-red-500 hover:text-red-500 dark:hover:text-red-500 cursor-pointer"
          onClick={() => {
            ConfirmationAlert.fire({
              title: "Sair?",
              text: "Fazer logout no sistema",
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
              confirmButtonColor: "#2a5369",
              confirmButtonText: "Sair",
            }).then(async (result) => {
              if (result.isConfirmed) {
                setLogin(true);
                auth.signOut();
                setMobileMenuOpen(false);
              } else {
                setMobileMenuOpen(false);
              }
            });
          }}
        >
          Sair
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-screen flex justify-center top-0 left-0 p-[2vh] md:p-[2vh] bg-klGreen-500/20 dark:bg-klGreen-500/30 z-50">
      <div className="flex w-full container justify-between items-center">
        {/* MOBILE MENU BUTTON */}
        {logged && userFullData && (
          <div className="flex items-center">
            <button
              className="text-klGreen-500 dark:text-klOrange-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[2.5vh] h-[2.5vh]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
                />
              </svg>
            </button>
          </div>
        )}

        {/* LOGO */}
        <div className="absolute left-1/2 flex justify-center transform -translate-x-1/2 w-auto">
          <img
            src={theme === "light" ? Logo : LogoDark}
            alt={`Logo ${systemConstantsValues?.customerFullName}`}
            className="dark:bg-transparent cursor-pointer"
            style={{ height: "min(4vh, 12.5vw)", width: "auto" }}
            onClick={() => setPage({ prev: page.show, show: "Dashboard" })}
          />
        </div>

        {/* BUTTON THEME CHANGE RIGHT */}
        <div className="hidden md:flex w-full justify-end items-center gap-[1vw]">
          {logged && userFullData && (
            <p
              className="relative z-10 text-klGreen-500 dark:text-klOrange-500 cursor-pointer"
              onClick={() => setPage({ prev: page.show, show: "Settings" })}
            >
              Olá, {formatUserName(userFullData.name.split(" ")[0])}
            </p>
          )}
          {renderThemeChanger()}
        </div>

        {/* MOBILE THEME CHANGE BUTTON */}
        <div className="md:hidden justify-end w-full flex items-center">
          {renderThemeChanger()}
        </div>
      </div>

      {/* BACKDROP */}
      {mobileMenuOpen && (
        <BackdropModal setMobileMenuOpen={setMobileMenuOpen} />
      )}

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-[75vw] max-w-[75vw] md:w-[20vw] md:max-w-[20vw] p-[4vh] bg-white dark:bg-gray-800/95 transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 bg-white dark:bg-klGreen-500/40" />
        <div className="relative z-10 flex justify-between items-center mb-[4vh]">
          <button
            className="flex w-full justify-end text-klGreen-500 dark:text-klOrange-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[3vh] h-[3vh]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {logged && userFullData && (
          <ul className="relative z-10">{renderNavItems()}</ul>
        )}
        <CopyrightBottom systemConstantsValues={systemConstantsValues} />
      </div>
    </div>
  );
}
