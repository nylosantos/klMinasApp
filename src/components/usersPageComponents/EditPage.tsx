import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import { EditClass } from "../editComponents/EditClass";
import { EditSchool } from "../editComponents/EditSchool";
import { EditCourse } from "../editComponents/EditCourse";
import { EditStudent } from "../editComponents/EditStudent";
import { EditTeacher } from "../editComponents/EditTeacher";
import { EditClassDay } from "../editComponents/EditClassDay";
import { EditSchedule } from "../editComponents/EditSchedule";
import { EditCurriculum } from "../editComponents/EditCurriculum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function EditPage() {
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
        </TabList>
        <TabPanels className="mt-2 flex justify-center">
          <TabPanel as={Fragment}>
            <EditSchool />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditClass />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditCourse />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditClassDay />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditSchedule />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditTeacher />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditCurriculum />
          </TabPanel>
          <TabPanel as={Fragment}>
            <EditStudent />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
