import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getFunctions } from "firebase/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editTeacherValidationSchema } from "../../@types/zodValidation";
import { EditTeacherValidationZProps, TeacherSearchProps } from "../../@types";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditTeacher() {
  // CREATE USER CLOUD FUNCTION HOOK
  const [getAuthUser] = useHttpsCallable(getFunctions(app), "getAuthUser");
  const [updateAppUserWithoutPassword] = useHttpsCallable(
    getFunctions(app),
    "updateAppUserWithoutPassword"
  );

  // TEACHER DATA
  const [teacherData, setTeacherData] = useState({
    teacherId: "",
  });

  // TEACHER EDIT DATA
  const [teacherEditData, setTeacherEditData] =
    useState<EditTeacherValidationZProps>({
      name: "",
      email: "",
      phone: "",
    });

  // PHONE FORMATTED STATE
  const [phoneFormatted, setPhoneFormatted] = useState({
    ddd: "DDD",
    prefix: "",
    suffix: "",
  });

  // SET PHONE NUMBER WHEN PHONE FORMATTED IS FULLY FILLED
  useEffect(() => {
    if (
      phoneFormatted.ddd !== "DDD" &&
      phoneFormatted.prefix !== "" &&
      phoneFormatted.suffix !== ""
    ) {
      setTeacherEditData({
        ...teacherEditData,
        phone: `+55${phoneFormatted.ddd}${phoneFormatted.prefix}${phoneFormatted.suffix}`,
      });
    } else {
      setTeacherEditData({ ...teacherEditData, phone: null });
    }
  }, [phoneFormatted]);

  // TEACHER SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // TEACHER DATA ARRAY WITH ALL OPTIONS OF SELECT TEACHERS
  const [teachersDataArray, setTeachersDataArray] =
    useState<TeacherSearchProps[]>();

  // FUNCTION THAT WORKS WITH TEACHER SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleTeacherSelectedData = (data: TeacherSearchProps[]) => {
    setTeachersDataArray(data);
  };

  // TEACHER SELECTED STATE DATA
  const [teacherSelectedData, setTeacherSelectedData] =
    useState<TeacherSearchProps>();

  // SET TEACHER SELECTED STATE WHEN SELECT TEACHER
  useEffect(() => {
    setIsEdit(false);
    if (teacherData.teacherId !== "") {
      setTeacherSelectedData(
        teachersDataArray!.find(({ id }) => id === teacherData.teacherId)
      );
    } else {
      setTeacherSelectedData(undefined);
    }
  }, [teacherData.teacherId]);

  // SET TEACHER DATA TO TEACHER EDIT DATA
  useEffect(() => {
    setTeacherEditData({
      ...teacherEditData,
      name: teacherSelectedData?.name!,
      email: teacherSelectedData?.email!,
      phone: teacherSelectedData?.phone!,
    });
  }, [teacherSelectedData]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditTeacherValidationZProps>({
    resolver: zodResolver(editTeacherValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    reset();
    (
      document.getElementById("teacherSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setTeacherData({
      teacherId: "",
    });
    setTeacherEditData({
      name: "",
      email: "",
      phone: "",
    });
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", teacherEditData.name);
    setValue("email", teacherEditData.email);
    setValue(
      "phone",
      phoneFormatted.ddd === "DDD" &&
        phoneFormatted.prefix === "" &&
        phoneFormatted.suffix === ""
        ? teacherSelectedData?.phone === ""
          ? teacherEditData.phone
          : teacherSelectedData === undefined
          ? ""
          : teacherSelectedData!.phone
        : teacherEditData.phone
    );
  }, [teacherSelectedData, teacherData, teacherEditData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name];
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
  const handleEditTeacher: SubmitHandler<EditTeacherValidationZProps> = async (
    data
  ) => {
    // EDIT TEACHER FUNCTION
    const editTeacher = async () => {
      try {
        await updateDoc(doc(db, "teachers", teacherData.teacherId), {
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
        resetForm();
        toast.success(
          `Professor ${teacherEditData.name} alterado com sucesso! ????`,
          {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        );
        setIsSubmitting(false);
      } catch (error) {
        console.log("ESSE ?? O ERROR", error);
        toast.error(`Ocorreu um erro... ????`, {
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

    // CHECK IF THIS THEACHER HAVE A AUTH USER
    const user: any = await getAuthUser(teacherData.teacherId);
    // IF YES, EDIT ALSO
    if (user !== undefined) {
      // FIREBASE DATABASE REFERENCE
      const dataRef = collection(db, "appUsers");

      // ---------- CHECKING IF PHONE EXISTS ON DATABASE ---------- //
      const phoneQuery = query(dataRef, where("phone", "==", data.phone));
      const phoneSnapshot = await getDocs(phoneQuery);
      const promisesPhone: any = [];
      phoneSnapshot.forEach((doc) => {
        const promise = doc.data();
        promisesPhone.push(promise);
      });
      Promise.all(promisesPhone).then(async (results) => {
        // IF EXISTS, RETURN ERROR
        if (results.length !== 0 && teacherSelectedData?.phone !== data.phone) {
          return (
            setIsSubmitting(false),
            toast.error(
              `Telefone j?? registrado em nosso banco de dados... ???`,
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
          // ---------- CHECKING IF EMAIL EXISTS ON DATABASE ---------- //
          const emailQuery = query(dataRef, where("email", "==", data.email));
          const emailSnapshot = await getDocs(emailQuery);
          const promisesEmail: any = [];
          emailSnapshot.forEach((doc) => {
            const promise = doc.data();
            promisesEmail.push(promise);
          });
          Promise.all(promisesEmail).then(async (results) => {
            // IF EXISTS, RETURN ERROR
            if (
              results.length !== 0 &&
              teacherSelectedData?.email !== data.email
            ) {
              return (
                setIsSubmitting(false),
                toast.error(
                  `E-mail j?? registrado em nosso banco de dados... ???`,
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
              const dataForAuth = {
                ...data,
                role: "teacher",
                id: user.data.uid,
              };
              // EDIT FIREBASE AUTH DATA ONLY WITHOUT CHANGE PASSWORD -> FOR EDIT PASSWORD GO TO EDITUSER
              await updateAppUserWithoutPassword(dataForAuth);
              // EDIT CALL
              await editTeacher();
            }
          });
          // ---------- END OF CHECKING IF EMAIL EXISTS ON DATABASE ---------- //
        }
      });
      // ---------- END OF CHECKING IF PHONE EXISTS ON DATABASE ---------- //
    } else {
      // FIREBASE DATABASE REFERENCE
      const dataRef = collection(db, "appUsers");

      // ---------- CHECKING IF PHONE EXISTS ON DATABASE ---------- //
      const phoneQuery = query(dataRef, where("phone", "==", data.phone));
      const phoneSnapshot = await getDocs(phoneQuery);
      const promisesPhone: any = [];
      phoneSnapshot.forEach((doc) => {
        const promise = doc.data();
        promisesPhone.push(promise);
      });
      Promise.all(promisesPhone).then(async (results) => {
        // IF EXISTS, RETURN ERROR
        if (results.length !== 0 && teacherSelectedData?.phone !== data.phone) {
          return (
            setIsSubmitting(false),
            toast.error(
              `Telefone j?? registrado em nosso banco de dados... ???`,
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
          // ---------- CHECKING IF EMAIL EXISTS ON DATABASE ---------- //
          const emailQuery = query(dataRef, where("email", "==", data.email));
          const emailSnapshot = await getDocs(emailQuery);
          const promisesEmail: any = [];
          emailSnapshot.forEach((doc) => {
            const promise = doc.data();
            promisesEmail.push(promise);
          });
          Promise.all(promisesEmail).then(async (results) => {
            // IF EXISTS, RETURN ERROR
            if (
              results.length !== 0 &&
              teacherSelectedData?.email !== data.email
            ) {
              return (
                setIsSubmitting(false),
                toast.error(
                  `E-mail j?? registrado em nosso banco de dados... ???`,
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
              // EDIT CALL
              await editTeacher();
            }
          });
          // ---------- END OF CHECKING IF EMAIL EXISTS ON DATABASE ---------- //
        }
      });
      // ---------- END OF CHECKING IF PHONE EXISTS ON DATABASE ---------- //
    }
  };

  return (
    <div className="flex flex-col container text-center">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit
          ? `Editando Professor ${teacherEditData.name}`
          : "Editar Professor"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditTeacher)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* TEACHER SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="teacherSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Selecione o Professor:{" "}
          </label>
          <select
            id="teacherSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="teacherSelect"
            onChange={(e) => {
              setTeacherData({
                ...teacherData,
                teacherId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              handleData={handleTeacherSelectedData}
              dataType="teachers"
            />
          </select>
        </div>

        {isSelected ? (
          <>
            {/* EDIT BUTTON */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                {!isEdit
                  ? "Editar"
                  : "Clique em CANCELAR para desfazer a Edi????o"}
              </button>
            </div>
          </>
        ) : null}

        {isEdit ? (
          <>
            {/* TEACHER NAME */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="name"
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
                name="name"
                disabled={isSubmitting}
                placeholder={
                  errors.name
                    ? "?? necess??rio inserir o Nome do Professor"
                    : "Insira o nome do Professor"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={teacherEditData.name}
                onChange={(e) => {
                  setTeacherEditData({
                    ...teacherEditData,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            {/* TEACHER E-MAIL */}
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
                  errors.email
                    ? "?? necess??rio inserir o E-mail do Usu??rio"
                    : "Insira o E-mail do Usu??rio"
                }
                className={
                  errors.email
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={teacherEditData.email}
                onChange={(e) => {
                  setTeacherEditData({
                    ...teacherEditData,
                    email: e.target.value,
                  });
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
                    disabled={isSubmitting}
                    defaultValue={
                      teacherSelectedData?.phone
                        ? teacherSelectedData?.phone?.slice(3, 5)
                        : "DDD"
                    }
                    className={
                      errors.phone
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        ddd: e.target.value,
                      });
                    }}
                  >
                    <BrazilianStateSelectOptions />
                  </select>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    name="phoneInitial"
                    pattern="^[+ 0-9]{5}$"
                    maxLength={5}
                    defaultValue={teacherSelectedData?.phone?.slice(5, 10)}
                    placeholder={errors.phone ? "?? necess??rio um" : "99999"}
                    className={
                      errors.phone
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        prefix: e.target.value,
                      });
                    }}
                  />
                  -
                  <input
                    type="text"
                    disabled={isSubmitting}
                    name="phoneFinal"
                    pattern="^[+ 0-9]{4}$"
                    maxLength={4}
                    defaultValue={teacherSelectedData?.phone?.slice(-4)}
                    placeholder={errors.phone ? "telefone v??lido" : "9990"}
                    className={
                      errors.phone
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setPhoneFormatted({
                        ...phoneFormatted,
                        suffix: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="w-2/12"></div>
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
                {!isSubmitting ? "Salvar" : "Salvando"}
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
