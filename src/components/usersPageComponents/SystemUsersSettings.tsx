/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { InsertUser } from "./InsertUser";
import { EditUser } from "./EditUser";
import { DeleteUser } from "./DeleteUser";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function SystemUsersSettings() {

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="w-10/12 px-2 py-8 sm:px-0">
        <TabGroup>
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
              Adicionar Usuário
            </Tab>
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
              Editar Usuário
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                  selected
                    ? "bg-white shadow dark:text-gray-800 cursor-default"
                    : "text-klGreen-500 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                )
              }
            >
              Deletar Usuário
            </Tab>
          </TabList>
          <TabPanels className="mt-2 flex justify-center">
            <TabPanel as={Fragment}>
              <InsertUser />
            </TabPanel>
            <TabPanel as={Fragment}>
              <EditUser />
            </TabPanel>
            <TabPanel as={Fragment}>
              <DeleteUser />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}