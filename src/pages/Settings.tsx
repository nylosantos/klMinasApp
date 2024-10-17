/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useContext } from "react";

import { EditMyUser } from "../components/usersPageComponents/EditMyUser";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import SystemUsersSettings from "../components/usersPageComponents/SystemUsersSettings";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  // GET GLOBAL DATA
  const { userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
    <div className="w-screen h-full flex flex-col justify-start items-center overflow-scroll no-scrollbar">
      <div className="h-full container mx-2 mb-1 sm:px-0 overflow-scroll no-scrollbar">
        <TabGroup className="flex flex-col h-full overflow-scroll no-scrollbar">
          {(userFullData?.role === "root" ||
            userFullData?.role === "admin") && (
            <TabList className="flex space-x-1 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                    selected
                      ? "bg-white text-klGreen-500 shadow dark:text-gray-800 cursor-default"
                      : "text-klGreen-500 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                  )
                }
              >
                Minha Conta
              </Tab>
              <>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                      selected
                        ? "bg-white text-klGreen-500 shadow dark:text-gray-800 cursor-default"
                        : "text-klGreen-500 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                    )
                  }
                >
                  Gerenciar Contas
                </Tab>
                {/* <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                      selected
                        ? "bg-white text-klGreen-500 shadow dark:text-gray-800 cursor-default"
                        : "text-klGreen-500 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                    )
                  }
                >
                  Configurações do Sistema
                </Tab> */}
              </>
            </TabList>
          )}
          <TabPanels className="flex flex-col h-full mt-2 items-center justify-center overflow-scroll no-scrollbar">
            <TabPanel as={Fragment}>
              <EditMyUser />
            </TabPanel>
            {(userFullData?.role === "root" ||
              userFullData?.role === "admin") && (
              <>
                <TabPanel as={Fragment}>
                  <SystemUsersSettings />
                </TabPanel>
                {/* <TabPanel as={Fragment}>
                  <EditSystemConstants />
                </TabPanel> */}
              </>
            )}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
