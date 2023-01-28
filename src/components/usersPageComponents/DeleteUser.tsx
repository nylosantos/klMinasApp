/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";
import { Dna } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

import { deleteUserValidationSchema } from "../../@types/zodValidation";
import { DeleteUserValidationZProps, UserFullDataProps } from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";
import { BrazilianStateSelectOptions } from "../BrazilianStateSelectOptions";

export function DeleteUser() {
  // DELETE USER CLOUD FUNCTION HOOK
  const [deleteAppUser] = useHttpsCallable(getFunctions(app), "deleteAppUser");

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
    await deleteAppUser(data)
      .then((result) => {
        toast.success(`${userSelectedData?.name} excluído com sucesso! 👌`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
        resetForm();
        setIsSubmitting(false);
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
      {/* LOADING */}
      {isSubmitting ? (
        <div className="flex flex-col w-screen h-screen top-0 left-0 absolute items-center justify-center bg-gray-900/60 dark:bg-gray-800/50 transition-all duration-300">
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
          <h1 className="text-xl text-white mb-3">Loading...</h1>
        </div>
      ) : null}

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isSelected ? `Excluindo ${userSelectedData?.name}` : "Excluir Usuário"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleDeleteUser)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* USER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="userSelect"
            className={
              errors.id
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
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
            <SelectOptions
              returnId
              handleData={handleUserSelectedData}
              dataType="appUsers"
            />
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
                  className="w-1/4 text-right text-gray-900 dark:text-gray-100"
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
                  className="w-1/4 text-right text-gray-900 dark:text-gray-100"
                >
                  E-mail:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  disabled
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                  value={userSelectedData?.email}
                />
              </div>

              {/* PHONE */}
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="phone"
                  className="w-1/4 text-right text-gray-900 dark:text-gray-100"
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
                      value={userSelectedData?.phone?.slice(3, 5)}
                    >
                      <BrazilianStateSelectOptions />
                    </select>
                    <input
                      disabled
                      type="text"
                      name="phoneInitial"
                      value={userSelectedData?.phone?.slice(5, 10)}
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    />
                    -
                    <input
                      disabled
                      type="text"
                      name="phoneFinal"
                      value={userSelectedData?.phone?.slice(-4)}
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    />
                  </div>
                  <div className="w-2/12"></div>
                </div>
              </div>

              {/* USER ROLE */}
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="role"
                  className="w-1/4 text-right text-gray-900 dark:text-gray-100"
                >
                  Permissão:{" "}
                </label>
                <select
                  disabled
                  id="role"
                  value={userSelectedData?.role}
                  className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
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
                className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
    </div>
  );
}
