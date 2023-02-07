/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { CreateTeacherValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createTeacherValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  buttonReset,
  buttonSubmit,
  divCheckboxItem,
  divItemsForm,
  divMasterPage,
  divPhoneMaster,
  divPhoneNumber,
  divSubmitResetItems,
  divWithDoubleItemsRight,
  formMaster,
  inputCheckbox,
  inputError,
  inputOk,
  inputWithButtonError,
  inputWithButtonOk,
  labelCheckbox,
  labelTextError,
  labelTextOk,
  pageTitleH1,
  selectDDDError,
  selectDDDOk,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertTeacher() {
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
    }
  );

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
          timestamp: serverTimestamp(),
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

    // FIREBASE DATABASE REFERENCE
    const dataRef = collection(db, "appUsers");

    // ---------- CHECKING IF PHONE EXISTS ON DATABASE ---------- //
    const phoneQuery = query(
      dataRef,
      where(
        "phone",
        "==",
        `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`
      )
    );
    const phoneSnapshot = await getDocs(phoneQuery);
    const promisesPhone: any = [];
    phoneSnapshot.forEach((doc) => {
      const promise = doc.data();
      promisesPhone.push(promise);
    });
    Promise.all(promisesPhone).then(async (results) => {
      // IF EXISTS, RETURN ERROR
      if (results.length !== 0) {
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
          if (results.length !== 0) {
            return (
              setIsSubmitting(false),
              toast.error(
                `E-mail já registrado em nosso banco de dados... ❕`,
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
            // ---------- CHECKING IF NAME EXISTS ON DATABASE ---------- //
            const q = query(dataRef, where("name", "==", data.name));
            const querySnapshot = await getDocs(q);
            const promises: any = [];
            querySnapshot.forEach((doc) => {
              const promise = doc.data();
              promises.push(promise);
            });
            Promise.all(promises).then((results) => {
              // IF EXISTS, RETURN ERROR
              if (results.length !== 0) {
                return (
                  setIsSubmitting(false),
                  toast.error(
                    `Professor ${data.name} já existe no nosso banco de dados... ❕`,
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
            });
            // ---------- END OF CHECKING IF NAME EXISTS ON DATABASE ---------- //
          }
        });
        // ---------- END OF CHECKING IF EMAIL EXISTS ON DATABASE ---------- //
      }
    });
    // ---------- END OF CHECKING IF PHONE EXISTS ON DATABASE ---------- //
  };

  return (
    <div className={divMasterPage}>
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className={pageTitleH1}>Adicionar Professor</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddTeacher)} className={formMaster}>
        {/* TEACHER NAME */}
        <div className={divItemsForm}>
          <label
            htmlFor="teacherName"
            className={errors.name ? labelTextError : labelTextOk}
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
            className={errors.name ? inputError : inputOk}
            value={teacherData.name}
            onChange={(e) => {
              setTeacherData({ ...teacherData, name: e.target.value });
            }}
          />
        </div>

        {/* E-MAIL */}
        <div className={divItemsForm}>
          <label
            htmlFor="email"
            className={errors.email ? labelTextError : labelTextOk}
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
            className={errors.email ? inputError : inputOk}
            value={teacherData.email}
            onChange={(e) => {
              setTeacherData({ ...teacherData, email: e.target.value });
            }}
          />
        </div>

        {/* PHONE */}
        <div className={divItemsForm}>
          <label
            htmlFor="phone"
            className={errors.phone ? labelTextError : labelTextOk}
          >
            Telefone:{" "}
          </label>
          <div className={divPhoneMaster}>
            <div className={divPhoneNumber}>
              <select
                id="phoneDDD"
                defaultValue={"DDD"}
                className={errors.phone?.ddd ? selectDDDError : selectDDDOk}
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
                    ? inputWithButtonError
                    : inputWithButtonOk
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
                    ? inputWithButtonError
                    : inputWithButtonOk
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
            <div className={divWithDoubleItemsRight}></div>
          </div>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={teacherData.confirmInsert}
            onChange={() => {
              setTeacherData({
                ...teacherData,
                confirmInsert: !teacherData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {teacherData.name
              ? `Confirmar criação de ${teacherData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className={divSubmitResetItems}>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonSubmit}
          >
            {!isSubmitting ? "Criar" : "Criando"}
          </button>

          {/* RESET BUTTON */}
          <button
            type="reset"
            className={buttonReset}
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
