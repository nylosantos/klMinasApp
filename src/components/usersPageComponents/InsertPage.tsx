/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment } from "react";

import { InsertClass } from "../insertComponents/InsertClass";
import { InsertCourse } from "../insertComponents/InsertCourse";
import { InsertSchool } from "../insertComponents/InsertSchool";
import { InsertStudent } from "../insertComponents/InsertStudent";
import { InsertTeacher } from "../insertComponents/InsertTeacher";
import { InsertSchedule } from "../insertComponents/InsertSchedule";
import { InsertCurriculum } from "../insertComponents/InsertCurriculum";
import { PageLayoutComponent } from "../layoutComponents/PageLayoutComponent";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function InsertPage() {
  return (
    <PageLayoutComponent>
      <TabGroup className="flex flex-col h-full overflow-scroll no-scrollbar">
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
            Ano Escolar
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
            Aluno
          </Tab>
        </TabList>
        <TabPanels className="mt-2 flex justify-center overflow-scroll h-full no-scrollbar">
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
        </TabPanels>
      </TabGroup>
    </PageLayoutComponent>
  );
}
