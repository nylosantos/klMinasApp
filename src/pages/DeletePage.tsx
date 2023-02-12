import { Fragment } from "react";
import { Tab } from "@headlessui/react";

import { DeleteClass } from "../components/deleteComponents/DeleteClass";
import { DeleteSchool } from "../components/deleteComponents/DeleteSchool";
import { DeleteCourse } from "../components/deleteComponents/DeleteCourse";
import { DeleteStudent } from "../components/deleteComponents/DeleteStudent";
import { DeleteTeacher } from "../components/deleteComponents/DeleteTeacher";
import { DeleteSchedule } from "../components/deleteComponents/DeleteSchedule";
import { DeleteClassDays } from "../components/deleteComponents/DeleteClassDays";
import { DeleteCurriculum } from "../components/deleteComponents/DeleteCurriculum";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function DeletePage() {
  return (
    <div className="w-10/12 px-2 py-8 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 p-1">
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
        </Tab.List>
        <Tab.Panels className="mt-2 flex justify-center">
          <Tab.Panel as={Fragment}>
            <DeleteSchool />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteClass />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteCourse />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteClassDays />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteSchedule />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteTeacher />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteCurriculum />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <DeleteStudent />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
