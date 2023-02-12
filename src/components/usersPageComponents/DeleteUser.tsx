import { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { deleteUserValidationSchema } from "../../@types/zodValidation";
import { DeleteUserValidationZProps, UserFullDataProps } from "../../@types";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteUser() {
  // DELETE USER CLOUD FUNCTION HOOK
  const [deleteAppUser] = useHttpsCallable(getFunctions(app), "deleteAppUser");

  // -------------------------- USER AUTH STATES AND FUNCTIONS -------------------------- //
  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // USER AUTH STATE
  const [user] = useAuthState(auth);

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

  // IF USER IS LOGGED GET HIS DETAILS
  useEffect(() => {
    if (user) {
      handleUserFullData(user);
    }
  }, [user]);
  // -------------------------- END OF USER AUTH STATES AND FUNCTIONS -------------------------- //

  // -------------------------- DELETE USER STATES AND FUNCTIONS -------------------------- //
  // USER DATA
  const [userData, setUserData] = useState<DeleteUserValidationZProps>({
    id: "",
  });

  // USER SELECTED ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);

  // USER DATA ARRAY WITH ALL OPTIONS OF SELECT USERS
  const [usersDataArray, setUsersDataArray] = useState<UserFullDataProps[]>();

  // FUNCTION THAT WORKS WITH USER SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleUserSelectedData = (data: UserFullDataProps[]) => {
    setUsersDataArray(data);
  };

  // USER SELECTED STATE DATA
  const [userSelectedData, setUserSelectedData] = useState<UserFullDataProps>();

  // SET USER SELECTED STATE WHEN SELECT USER
  useEffect(() => {
    if (userData.id !== "") {
      setUserSelectedData(usersDataArray!.find(({ id }) => id === userData.id));
    } else {
      setUserSelectedData(undefined);
    }
  }, [userData.id]);
  // -------------------------- END OF DELETE USER STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteUserValidationZProps>({
    resolver: zodResolver(deleteUserValidationSchema),
    defaultValues: {
      id: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("userSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    reset();
    setIsSelected(false);
    setUserData({
      id: "",
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("id", userData.id);
  }, [userData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.id];
    fullErrors.map((fieldError) => {
      toast.error(fieldError?.message, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    });
  }, [errors]);

  // SUBMIT DATA FUNCTION
  const handleDeleteUser: SubmitHandler<DeleteUserValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);
    // DELETE USER FUNCTION
    await deleteAppUser(data)
      .then(async (result) => {
        if (userSelectedData?.role === "teacher") {
          try {
            // DELETE TEACHER ON SCHOOL DATABASE
            await deleteDoc(doc(db, "teachers", data.id));
            toast.success(`${userSelectedData.name} excluído com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            resetForm();
            setIsSubmitting(false);
          } catch (error) {
            toast.error(
              `Usuário excluído, porém correu um erro ao excluir o professor no banco de dados da escola, contate o suporte... 🤯`,
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            );
            resetForm();
            setIsSubmitting(false);
          }
        } else {
          toast.success(`${userSelectedData?.name} excluído com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          resetForm();
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        console.log("ESSE É O ERROR", error);
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="deletando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isSelected ? `Excluindo ${userSelectedData?.name}` : "Excluir Usuário"}
      </h1>

      {/* LOADING USER AUTH DATA */}
      {!userFullData ? (
        <SubmitLoading
          isSubmitting={userFullData ? false : true}
          whatsGoingOn="carregando"
        />
      ) : (
        <>
          {/* FORM */}
          <form
            onSubmit={handleSubmit(handleDeleteUser)}
            className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
          >
            {/* USER SELECT */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="userSelect"
                className={
                  errors.id
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Selecione o Usuário:{" "}
              </label>
              <select
                id="userSelect"
                defaultValue={" -- select an option -- "}
                className={
                  errors.id
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="userSelect"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    id: e.target.value,
                  });
                  setIsSelected(true);
                }}
              >
                {userFullData?.role === "root" ? (
                  <SelectOptions
                    returnId
                    handleData={handleUserSelectedData}
                    dataType="appUsers"
                    displayAdmins
                  />
                ) : (
                  <SelectOptions
                    returnId
                    handleData={handleUserSelectedData}
                    dataType="appUsers"
                  />
                )}
              </select>
            </div>

            {isSelected ? (
              <>
                <div className="flex flex-col pt-2 pb-6 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                  {/* DETAILS TITLE */}
                  <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                    Dados do usuário a ser excluído:
                  </h1>

                  {/* USER NAME */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="name"
                      className="w-1/4 text-right"
                    >
                      Nome:{" "}
                    </label>
                    <input
                      type="text"
                      name="name"
                      disabled
                      className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      value={userSelectedData?.name}
                    />
                  </div>

                  {/* USER E-MAIL */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="email"
                      className="w-1/4 text-right"
                    >
                      E-mail:{" "}
                    </label>
                    <input
                      type="text"
                      name="e-mail"
                      disabled
                      className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      value={userSelectedData?.email}
                    />
                  </div>

                  {/* PHONE */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="phone"
                      className="w-1/4 text-right"
                    >
                      Telefone:{" "}
                    </label>
                    <div className="flex w-2/4 gap-2">
                      <div className="flex w-10/12 items-center gap-1">
                        <select
                          disabled
                          id="phoneDDD"
                          defaultValue={"DDD"}
                          className="pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          name="DDD"
                          value={
                            userSelectedData?.phone
                              ? userSelectedData?.phone?.slice(3, 5)
                              : "DDD"
                          }
                        >
                          <BrazilianStateSelectOptions />
                        </select>
                        <input
                          disabled
                          type="text"
                          name="phoneInitial"
                          value={
                            userSelectedData?.phone
                              ? userSelectedData?.phone?.slice(5, 10)
                              : ""
                          }
                          className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                        />
                        -
                        <input
                          disabled
                          type="text"
                          name="phoneFinal"
                          value={
                            userSelectedData?.phone
                              ? userSelectedData?.phone?.slice(-4)
                              : ""
                          }
                          className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                        />
                      </div>
                      <div className="flex w-2/12 items-center gap-2"></div>
                    </div>
                  </div>

                  {/* USER ROLE */}
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="role"
                      className="w-1/4 text-right"
                    >
                      Permissão:{" "}
                    </label>
                    <select
                      disabled
                      id="role"
                      value={userSelectedData?.role}
                      className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                      name="role"
                    >
                      <option value="admin">Administrador</option>
                      <option value="editor">Editor</option>
                      <option value="teacher">Professor</option>
                      <option value="user">Usuário</option>
                    </select>
                  </div>
                </div>

                {/* SUBMIT AND RESET BUTTONS */}
                <div className="flex gap-2 mt-4">
                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
                  >
                    {!isSubmitting ? "Excluir" : "Excluindo"}
                  </button>

                  {/* RESET BUTTON */}
                  <button
                    type="reset"
                    className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    {isSubmitting ? "Aguarde" : "Cancelar"}
                  </button>
                </div>
              </>
            ) : null}
          </form>
        </>
      )}
    </div>
  );
}
