/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input-field";
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
import { CreateCourseValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createCourseValidationSchema } from "../../@types/zodValidation";
import {
  buttonReset,
  buttonSubmit,
  divCheckboxItem,
  divItemsForm,
  divMasterPage,
  divSubmitResetItems,
  formMaster,
  inputCheckbox,
  inputError,
  inputOk,
  labelCheckbox,
  labelTextError,
  labelTextOk,
  pageTitleH1,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertCourse() {
  // SCHOOL COURSE DATA
  const [courseData, setCourseData] = useState<CreateCourseValidationZProps>({
    name: "",
    price: 0,
    confirmInsert: false,
  });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseValidationZProps>({
    resolver: zodResolver(createCourseValidationSchema),
    defaultValues: {
      name: "",
      price: 0,
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setCourseData({
      name: "",
      price: 0,
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", courseData.name);
    setValue("price", courseData.price / 100);
    setValue("confirmInsert", courseData.confirmInsert);
  }, [courseData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.name, errors.price, errors.confirmInsert];
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
  const handleAddCourse: SubmitHandler<CreateCourseValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar a modalidade ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ADD SCHOOL COURSE FUNCTION
    const addCourse = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "schoolCourses", commonId), {
          id: commonId,
          name: data.name,
          price: data.price,
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`${data.name} criado com sucesso! 👌`, {
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

    // CHECKING IF SCHOOL COURSE EXISTS ON DATABASE
    const courseRef = collection(db, "schoolCourses");
    const q = query(courseRef, where("name", "==", data.name));
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
          toast.error(`${data.name} já existe no nosso banco de dados... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF NOT EXISTS, CREATE
        addCourse();
      }
    });
  };

  return (
    <div className={divMasterPage}>
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className={pageTitleH1}>Adicionar Curso / Aula</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddCourse)} className={formMaster}>
        {/* SCHOOL COURSE NAME */}
        <div className={divItemsForm}>
          <label
            htmlFor="name"
            className={errors.name ? labelTextError : labelTextOk}
          >
            Modalidade:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o nome do Curso"
                : "Insira o nome do Curso"
            }
            className={errors.name ? inputError : inputOk}
            value={courseData.name}
            onChange={(e) => {
              setCourseData({ ...courseData, name: e.target.value });
            }}
          />
        </div>

        {/* SCHOOL COURSE PRICE */}
        <div className={divItemsForm}>
          <label
            htmlFor="price"
            className={errors.price ? labelTextError : labelTextOk}
          >
            Preço:{" "}
          </label>
          <CurrencyInput
            name="price"
            placeholder={
              errors.price
                ? "É necessário inserir o valor mensal do Curso / Aula"
                : "Insira o valor mensal do Curso / Aula"
            }
            defaultValue={0}
            decimalsLimit={2}
            decimalScale={2}
            prefix="R$"
            disableAbbreviations
            onValueChange={(value, name) =>
              value
                ? setCourseData({
                    ...courseData,
                    price: +value.replace(/\D/g, ""),
                  })
                : null
            }
            className={errors.price ? inputError : inputOk}
          />
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={courseData.confirmInsert}
            onChange={() => {
              setCourseData({
                ...courseData,
                confirmInsert: !courseData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {courseData.name
              ? `Confirmar criação da modalidade ${courseData.name}`
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
