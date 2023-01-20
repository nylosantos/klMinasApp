import { Header } from "../components/Header";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { InsertSchool } from "../components/insertComponents/insertSchool";
import { InsertClass } from "../components/insertComponents/insertClass";
import { InsertCourse } from "../components/insertComponents/insertCourse";
import { InsertClassDays } from "../components/insertComponents/insertClassDays";
import { InsertSchedule } from "../components/insertComponents/insertSchedule";
import { InsertTeacher } from "../components/insertComponents/insertTeacher";
import { InsertSeed } from "../components/insertComponents/insertSeed";
import { InsertCurriculum } from "../components/insertComponents/insertCurriculum";
import { InsertStudent } from "../components/insertComponents/insertStudent";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function InsertPage() {
  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <Header />
      <div className="w-10/12 px-2 py-8 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                  selected
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
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
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
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
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                )
              }
            >
              Curso / Aula
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                  selected
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
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
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
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
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
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
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
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
                    ? "bg-white shadow dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                )
              }
            >
              Aluno
            </Tab>
            <Tab
              
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                  selected
                    ? "bg-white/50 shadow dark:text-gray-800/50"
                    : "text-gray-600/50 dark:text-gray-100/50 hover:bg-white/[0.17] dark:hover:bg-white/[0.03]"
                )
              }
            >
              Seed (disabled)
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2 flex justify-center">
            <Tab.Panel as={Fragment}>
              <InsertSchool />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertClass />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertCourse />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertClassDays />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertSchedule />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertTeacher />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertCurriculum />
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertStudent/>
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
              <InsertSeed />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
