import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { EditSchool } from "../components/editComponents/EditSchool";
import { EditClass } from "../components/editComponents/EditClass";
import { EditCourse } from "../components/editComponents/EditCourse";
import { EditClassDay } from "../components/editComponents/EditClassDay";
import { EditSchedule } from "../components/editComponents/EditSchedule";
import { EditTeacher } from "../components/editComponents/EditTeacher";
import { EditCurriculum } from "../components/editComponents/EditCurriculum";
import { EditStudent } from "../components/editComponents/EditStudent";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function EditPage() {
  return (
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
        </Tab.List>
        <Tab.Panels className="mt-2 flex justify-center">
          <Tab.Panel as={Fragment}>
            <EditSchool />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditClass />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditCourse />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditClassDay />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditSchedule />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditTeacher />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditCurriculum />
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <EditStudent />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
