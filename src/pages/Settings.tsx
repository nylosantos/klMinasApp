/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EditMyUser } from "../components/usersPageComponents/EditMyUser";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import { SubmitLoading } from "../components/layoutComponents/SubmitLoading";
import {
  FaCog,
  FaServer,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import { InsertUser } from "../components/usersPageComponents/InsertUser";
import { EditUser } from "../components/usersPageComponents/EditUser";
import { DeleteUser } from "../components/usersPageComponents/DeleteUser";
import EditSystemConstants from "../components/usersPageComponents/EditSystemConstants";

export interface SettingsMenuArrayProps {
  title: string;
  page: string;
  icon: JSX.Element;
}

export default function Settings() {
  // GET GLOBAL DATA
  const { userFullData, isSubmitting } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  const [showSettingsPage, setShowSettingsPage] = useState({
    page: "MyUser",
  });

  // SETTINGS MENU STATE
  const [settingsMenu, setSettingsMenu] = useState(false);

  const settingsMenuArray: SettingsMenuArrayProps[] = [
    {
      title: "Minhas Configurações",
      page: "MyUser",
      icon: (
        <FaCog
          className={`text-lg text-klOrange-500 ${
            settingsMenu ? "rotate-180" : ""
          } transition-all duration-700`}
        />
      ),
    },
    {
      title: "Adicionar Usuário",
      page: "AddUser",
      icon: (
        <FaUserPlus
          className={`text-lg text-klOrange-500 ${
            settingsMenu
              ? "animate__animated animate__pulse animate-fast-pulse"
              : ""
          } transition-all duration-700`}
        />
      ),
    },
    {
      title: "Editar Usuário",
      page: "EditUser",
      icon: (
        <FaUserEdit
          className={`text-lg text-klOrange-500 ${
            settingsMenu
              ? "animate__animated animate__pulse animate-fast-pulse"
              : ""
          } transition-all duration-700`}
        />
      ),
    },
    {
      title: "Deletar Usuário",
      page: "DeleteUser",
      icon: (
        <FaUserMinus
          className={`text-lg text-klOrange-500 ${
            settingsMenu
              ? "animate__animated animate__pulse animate-fast-pulse"
              : ""
          } transition-all duration-700`}
        />
      ),
    },
    {
      title: "Configurações do Sistema",
      page: "systemSettings",
      icon: (
        <FaServer
          className={`text-lg text-klOrange-500 ${
            settingsMenu
              ? "animate__animated animate__pulse animate-fast-pulse"
              : ""
          } transition-all duration-700`}
        />
      ),
    },
  ];

  function renderSettingsMenu(itemMenu: string) {
    const menuItems = settingsMenuArray.find((item) => item.page === itemMenu);
    if (menuItems) {
      return (
        <div
          className="flex flex-col w-2/3 md:w-[9vw] md:h-[6vw] py-2 px-3 md:px-14 md:py-10 mt-4 justify-center items-center text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 hover:bg-klGreen-500/30 hover:dark:bg-klGreen-500/70 rounded-xl cursor-pointer"
          onClick={() => {
            setShowSettingsPage({ page: menuItems.page });
            setSettingsMenu(false);
          }}
          key={uuidv4()}
        >
          <div className="pb-2 pt-1">{menuItems.icon}</div>
          <p className="text-klGreen-500 dark:text-gray-100">
            {menuItems.title}
          </p>
        </div>
      );
    }
  }

  // LOADING
  if (!userFullData) {
    return (
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="carregando" />
    );
  } else {
    return (
      <div className="w-screen h-full flex flex-col justify-start items-center overflow-scroll no-scrollbar">
        {/* PAGES TO SHOW */}
        <div className="flex overflow-scroll no-scrollbar justify-center w-full container bg-klGreen-500/20 my-4 rounded-xl">
          {showSettingsPage.page === "MyUser" && (
            <EditMyUser
              itemsMenu={settingsMenuArray}
              renderSettingsMenu={renderSettingsMenu}
              setSettingsMenu={setSettingsMenu}
              settingsMenu={settingsMenu}
              showSettingsPage={showSettingsPage}
            />
          )}
          {userFullData.role !== "user" && (
            <>
              {showSettingsPage.page === "AddUser" && (
                <InsertUser
                  itemsMenu={settingsMenuArray}
                  renderSettingsMenu={renderSettingsMenu}
                  setSettingsMenu={setSettingsMenu}
                  settingsMenu={settingsMenu}
                  showSettingsPage={showSettingsPage}
                />
              )}
              {showSettingsPage.page === "EditUser" && (
                <EditUser
                  itemsMenu={settingsMenuArray}
                  renderSettingsMenu={renderSettingsMenu}
                  setSettingsMenu={setSettingsMenu}
                  settingsMenu={settingsMenu}
                  showSettingsPage={showSettingsPage}
                />
              )}
              {showSettingsPage.page === "DeleteUser" && (
                <DeleteUser
                  itemsMenu={settingsMenuArray}
                  renderSettingsMenu={renderSettingsMenu}
                  setSettingsMenu={setSettingsMenu}
                  settingsMenu={settingsMenu}
                  showSettingsPage={showSettingsPage}
                />
              )}
            </>
          )}
          {(userFullData.role === "root" || userFullData.role === "admin") && (
            <>
              {showSettingsPage.page === "systemSettings" && (
                <EditSystemConstants
                  itemsMenu={settingsMenuArray}
                  renderSettingsMenu={renderSettingsMenu}
                  setSettingsMenu={setSettingsMenu}
                  settingsMenu={settingsMenu}
                  showSettingsPage={showSettingsPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}
