import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import { DeleteClass } from "../deleteComponents/DeleteClass";
import { DeleteSchool } from "../deleteComponents/DeleteSchool";
import { DeleteCourse } from "../deleteComponents/DeleteCourse";
import { DeleteStudent } from "../deleteComponents/DeleteStudent";
import { DeleteTeacher } from "../deleteComponents/DeleteTeacher";
import { DeleteSchedule } from "../deleteComponents/DeleteSchedule";
import { DeleteCurriculum } from "../deleteComponents/DeleteCurriculum";
import { PageLayoutComponent } from "../layoutComponents/PageLayoutComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function DeletePage() {
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
            <DeleteSchool />
          </TabPanel>
          <TabPanel as={Fragment}>
            <DeleteClass />
          </TabPanel>
          <TabPanel as={Fragment}>
            <DeleteCourse />
          </TabPanel>
          <TabPanel as={Fragment}>
            <DeleteSchedule />
          </TabPanel>
          <TabPanel as={Fragment}>
            <DeleteTeacher />
          </TabPanel>
          <TabPanel as={Fragment}>
            <DeleteCurriculum />
          </TabPanel>
          <TabPanel as={Fragment}>
            <DeleteStudent />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </PageLayoutComponent>
  );
}
