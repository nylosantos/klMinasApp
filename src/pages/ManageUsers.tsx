import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import { getAuth, User } from "firebase/auth";
import { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { UserFullDataProps } from "../@types";
import { app, initFirebase } from "../db/Firebase";
import { Header } from "../components/layoutComponents/Header";
import { EditUser } from "../components/usersPageComponents/EditUser";
import { InsertUser } from "../components/usersPageComponents/InsertUser";
import { DeleteUser } from "../components/usersPageComponents/DeleteUser";
import { EditMyUser } from "../components/usersPageComponents/EditMyUser";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function ManageUsers() {
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

  // IF LOGGED GET DATA, IF NOT LOGGED SEND TO LOGIN
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
              Minhas Configurações
            </Tab>
            {userFullData?.role === "root" || userFullData?.role === "admin" ? (
              <>
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
              </>
            ) : null}
          </Tab.List>
          <Tab.Panels className="mt-2 flex justify-center">
            <Tab.Panel as={Fragment}>
              <EditMyUser />
            </Tab.Panel>
            {userFullData?.role === "root" || userFullData?.role === "admin" ? (
              <>
                <Tab.Panel as={Fragment}>
                  <InsertUser />
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                  <EditUser />
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                  <DeleteUser />
                </Tab.Panel>
              </>
            ) : null}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
