import { Header } from "../components/Header";

import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { InsertSchool } from "../components/insertComponents/InsertSchool";
import { InsertClass } from "../components/insertComponents/InsertClass";
import { InsertCourse } from "../components/insertComponents/InsertCourse";
import { InsertClassDays } from "../components/insertComponents/InsertClassDays";
import { InsertSchedule } from "../components/insertComponents/InsertSchedule";
import { InsertTeacher } from "../components/insertComponents/InsertTeacher";
import { InsertCurriculum } from "../components/insertComponents/InsertCurriculum";
import { InsertStudent } from "../components/insertComponents/InsertStudent";
import { InsertSeed } from "../components/insertComponents/InsertSeed";
import { useRouter } from "next/router";
import { app, initFirebase } from "../db/Firebase";
import { getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { UserFullDataProps } from "../@types";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function InsertPage() {
  // INITIALIZING FIREBASE
  initFirebase();

  // FIREBASE AUTH
  const auth = getAuth();

  // USER AUTH STATE
  const [user, loading] = useAuthState(auth);

  // ROUTING USER
  const router = useRouter();

  // USER DATA STATE
  const [userFullData, setUserFullData] = useState<UserFullDataProps>();

  // HANDLE USER DATA FUNCTION
  const handleUserFullData = async (user: User | null | undefined) => {
    if (user !== null && user !== undefined) {
      // CHECKING IF USER EXISTS ON DATABASE
      const userRef = collection(db, "appUsers");
      const q = query(userRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      Promise.all(promises).then((results) => {
        setUserFullData(results[0]);
      });
    } else
      return (
        console.log("User is undefined..."),
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      handleUserFullData(user);
    }
  }, [user]);

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
            {userFullData?.role === "admin" ? (
              <Tab
                disabled
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-gray-100",
                    selected
                      ? // IF DISABLED
                        "bg-white shadow dark:text-gray-800"
                      : "text-gray-600/60 dark:text-gray-100/50 hover:bg-white/20 dark:hover:bg-white/[0.03]"
                    // IF ENABLED
                    // ? "bg-white shadow dark:text-gray-800"
                    // : "text-gray-600 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-white/[0.12]"
                  )
                }
              >
                Seed (disabled)
              </Tab>
            ) : null}
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
              <InsertStudent />
            </Tab.Panel>
            {userFullData?.role === "admin" ? (
              <Tab.Panel as={Fragment}>
                <InsertSeed />
              </Tab.Panel>
            ) : null}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
