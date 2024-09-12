/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment } from "react";

import EditPage from "../components/usersPageComponents/EditPage";
import DeletePage from "../components/usersPageComponents/DeletePage";
import InsertPage from "../components/usersPageComponents/InsertPage";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ManageSchools() {
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
              Adicionar
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
              Editar
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
              Excluir
            </Tab>
          </TabList>
          <TabPanels className="mt-2 flex justify-center">
            <TabPanel as={Fragment}>
              <InsertPage />
            </TabPanel>
            <TabPanel as={Fragment}>
              <EditPage />
            </TabPanel>
            <TabPanel as={Fragment}>
              <DeletePage />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
