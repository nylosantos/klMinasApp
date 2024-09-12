/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useContext } from "react";

import { InsertSeed } from "../insertComponents/InsertSeed";
import { InsertClass } from "../insertComponents/InsertClass";
import { InsertCourse } from "../insertComponents/InsertCourse";
import { InsertSchool } from "../insertComponents/InsertSchool";
import { InsertStudent } from "../insertComponents/InsertStudent";
import { InsertTeacher } from "../insertComponents/InsertTeacher";
import { InsertSchedule } from "../insertComponents/InsertSchedule";
import { InsertClassDays } from "../insertComponents/InsertClassDays";
import { InsertCurriculum } from "../insertComponents/InsertCurriculum";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function InsertPage() {
  // GET GLOBAL DATA
  const { userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
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
            Escola
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
            Turma
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
            Modalidade
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
            Dias de Aula
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
            Horário
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
            Professor
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
            Currículo
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
            Aluno
          </Tab>
          {userFullData?.role === "root" ? (
            <Tab
              disabled
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                  selected
                    ? // IF DISABLED
                      "bg-white shadow dark:text-gray-800 cursor-default"
                    : "text-gray-600/60 dark:text-gray-100/50 hover:bg-white/20 dark:hover:bg-white/[0.03]"
                  // IF ENABLED
                  // "bg-white text-klGreen-500 shadow dark:text-gray-800 cursor-default"
                  // : "text-klGreen-500 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                )
              }
            >
              Seed
            </Tab>
          ) : null}
        </TabList>
        <TabPanels className="mt-2 flex justify-center">
          <TabPanel as={Fragment}>
            <InsertSchool />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertClass />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertCourse />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertClassDays />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertSchedule />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertTeacher />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertCurriculum />
          </TabPanel>
          <TabPanel as={Fragment}>
            <InsertStudent />
          </TabPanel>
          {userFullData?.role === "root" ? (
            <TabPanel as={Fragment}>
              <InsertSeed />
            </TabPanel>
          ) : null}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
