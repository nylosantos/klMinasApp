/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { app } from "../../db/Firebase";
import { CreateTeacherValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createTeacherValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertTeacher() {
  // GET GLOBAL DATA
  const { appUsersDatabaseData, page, userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // TEACHER DATA
  const [teacherData, setTeacherData] = useState<CreateTeacherValidationZProps>(
    {
      name: "",
      email: "",
      phone: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      confirmInsert: false,
      createAccount: false,
    }
  );

  // CREATE USER CLOUD FUNCTION HOOK
  const [createAppUser] = useHttpsCallable(getFunctions(app), "createAppUser");

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTeacherValidationZProps>({
    resolver: zodResolver(createTeacherValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setTeacherData({
      name: "",
      email: "",
      phone: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      confirmInsert: false,
      createAccount: false,
    });
    (
      document.getElementById("phoneDDD") as HTMLSelectElement
    ).selectedIndex = 0;
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", teacherData.name);
    setValue("email", teacherData.email);
    setValue("phone.ddd", teacherData.phone.ddd);
    setValue("phone.prefix", teacherData.phone.prefix);
    setValue("phone.suffix", teacherData.phone.suffix);
    setValue("confirmInsert", teacherData.confirmInsert);
    setValue("createAccount", teacherData.createAccount);
  }, [teacherData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.phone,
      errors.confirmInsert,
    ];
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
  const handleAddTeacher: SubmitHandler<CreateTeacherValidationZProps> = async (
    data
  ) => {
    // ADD TEACHER FUNCTION
    const addTeacher = async () => {
      if (data.createAccount) {
        const teacherData = {
          name: data.name,
          email: data.email,
          phone:
            data.phone.ddd && data.phone.prefix && data.phone.suffix
              ? `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`
              : "",
          confirmInsert: data.confirmInsert,
          role: "teacher",
          password: "123456",
          confirmPassword: "123456",
        };
        try {
          await createAppUser(teacherData).then(async (result) => {
            if (result?.data) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const userUid: any = result.data;
              try {
                // CREATE TEACHER ON DATABASE
                await setDoc(doc(db, "teachers", userUid), {
                  id: userUid,
                  name: data.name,
                  email: data.email,
                  phone:
                    data.phone.ddd && data.phone.prefix && data.phone.suffix
                      ? `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`
                      : "",
                  haveAccount: data.createAccount,
                  updatedAt: serverTimestamp(),
                });
                toast.success(`Professor ${data.name} criado com sucesso! 👌`, {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                });
                resetForm();
                setIsSubmitting(false);
              } catch (error) {
                console.log(error);
                toast.error(
                  `Usuário no sistema criado, porém correu um erro ao criar o professor no banco de dados da escola, contate o suporte... 🤯`,
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
            }
          });
        } catch (error) {
          console.error("CONSOLE.ERROR: ", error);
          console.log("ESSE É O ERROR", error);
          toast.error(
            `Ocorreu um erro na criação do Usuário no sistema deste professor, contate o suporte... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
          setIsSubmitting(false);
        }
      } else
        try {
          const commonId = uuidv4();
          await setDoc(doc(db, "teachers", commonId), {
            id: commonId,
            name: data.name,
            email: data.email,
            phone:
              data.phone.ddd && data.phone.prefix && data.phone.suffix
                ? `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`
                : "",
            haveAccount: data.createAccount,
            updatedAt: serverTimestamp(),
          });
          resetForm();
          toast.success(`Professor ${data.name} criado com sucesso! 👌`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
        } catch (error) {
          console.log("ESSE É O ERROR", error);
          toast.error(`Ocorreu um erro... 🤯`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
        }
    };

    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o professor ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ---------- CHECKING IF PHONE EXISTS ON DATABASE ---------- //
    const teacherPhoneExist = appUsersDatabaseData.find(
      (teacher) =>
        teacher.phone ===
        `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`
    );
    // IF EXISTS, RETURN ERROR
    if (teacherPhoneExist) {
      return (
        setIsSubmitting(false),
        toast.error(`Telefone já registrado em nosso banco de dados... ❕`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      const teacherEmailExist = appUsersDatabaseData.find(
        (teacher) => teacher.email === data.email
      );
      // IF EXISTS, RETURN ERROR
      if (teacherEmailExist) {
        return (
          setIsSubmitting(false),
          toast.error(`E-mail já registrado em nosso banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        const teacherNameExist = appUsersDatabaseData.find(
          (teacher) => teacher.name === data.name
        );
        // IF EXISTS, RETURN ERROR
        if (teacherNameExist) {
          return (
            setIsSubmitting(false),
            toast.error(
              `Professor ${data.name} já existe no nosso banco de dados.. ❕`,
              {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            )
          );
        } else {
          addTeacher();
        }
      }
    }
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* PAGE TITLE */}
      {page.show !== "Dashboard" &&
        userFullData &&
        userFullData.role !== "user" && (
          <h1 className="font-bold text-2xl my-4">Adicionar Professor</h1>
        )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleAddTeacher)}
        className={`flex flex-col w-full gap-2 rounded-xl ${
          page.show !== "Dashboard" &&
          userFullData &&
          userFullData.role !== "user"
            ? "bg-klGreen-500/20 dark:bg-klGreen-500/30 p-4 mt-2"
            : "pb-4 px-4 pt-2"
        }`}
        // className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* TEACHER NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherName"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Nome:{" "}
          </label>
          <input
            type="text"
            name="teacherName"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o Nome do Professor"
                : "Insira o nome do Professor"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={teacherData.name}
            onChange={(e) => {
              setTeacherData({ ...teacherData, name: e.target.value });
            }}
          />
        </div>

        {/* E-MAIL */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="email"
            className={
              errors.email
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            E-mail:{" "}
          </label>
          <input
            type="text"
            name="email"
            disabled={isSubmitting}
            placeholder={
              errors.email ? "É necessário inserir o e-mail" : "Insira o e-mail"
            }
            className={
              errors.email
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={teacherData.email}
            onChange={(e) => {
              setTeacherData({ ...teacherData, email: e.target.value });
            }}
          />
        </div>

        {/* PHONE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phone"
            className={
              errors.phone
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Telefone:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-10/12 items-center gap-1">
              <select
                id="phoneDDD"
                defaultValue={"DDD"}
                className={
                  errors.phone?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    phone: { ...teacherData.phone, ddd: e.target.value },
                  });
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              <input
                type="text"
                name="phoneInitial"
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={teacherData.phone.prefix}
                placeholder={errors.phone?.prefix ? "É necessário um" : "99999"}
                className={
                  errors.phone?.prefix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    phone: {
                      ...teacherData.phone,
                      prefix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
              -
              <input
                type="text"
                name="phoneFinal"
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={teacherData.phone.suffix}
                placeholder={errors.phone?.suffix ? "telefone válido" : "9990"}
                className={
                  errors.phone?.suffix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    phone: {
                      ...teacherData.phone,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            <div className="flex w-2/12 items-center gap-2"></div>
          </div>
        </div>

        {/* CREATE TEACHER ACCOUNT CHECKBOX */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherAccount"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Criar conta no sistema?{" "}
          </label>
          <input
            type="checkbox"
            name="teacherAccount"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={teacherData.createAccount}
            onChange={() => {
              setTeacherData({
                ...teacherData,
                createAccount: !teacherData.createAccount,
              });
            }}
          />
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={teacherData.confirmInsert}
            onChange={() => {
              setTeacherData({
                ...teacherData,
                confirmInsert: !teacherData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            {teacherData.name
              ? `Confirmar criação de ${teacherData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
          >
            {!isSubmitting ? "Criar" : "Criando"}
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
            {isSubmitting ? "Aguarde" : "Limpar"}
          </button>
        </div>
      </form>
    </div>
  );
}
