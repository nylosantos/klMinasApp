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
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createClassValidationSchema } from "../../@types/zodValidation";
import { CreateClassValidationZProps, SchoolSearchProps } from "../../@types";
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
  selectError,
  selectOk,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertClass() {
  // SCHOOL CLASS DATA
  const [classData, setClassData] = useState<CreateClassValidationZProps>({
    name: "",
    schoolName: "",
    schoolId: "",
    available: false,
    confirmInsert: false,
  });

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL
  const [schoolDataArray, setSchoolDataArray] = useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (classData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDataArray!.find(({ id }) => id === classData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [classData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setClassData({ ...classData, schoolName: schoolSelectedData!.name });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateClassValidationZProps>({
    resolver: zodResolver(createClassValidationSchema),
    defaultValues: {
      name: "",
      schoolName: "",
      schoolId: "",
      available: false,
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setClassData({
      name: "",
      schoolName: "",
      schoolId: "",
      available: false,
      confirmInsert: false,
    });
    ((
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0),
      reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", classData.name);
    setValue("schoolId", classData.schoolId);
    setValue("schoolName", classData.schoolName);
    setValue("available", classData.available);
    setValue("confirmInsert", classData.confirmInsert);
  }, [classData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.schoolId,
      errors.available,
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
  const handleAddClass: SubmitHandler<CreateClassValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar Turma ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // ADD SCHOOL CLASS FUNCTION
    const addClass = async () => {
      try {
        const commonId = uuidv4();
        await setDoc(doc(db, "schoolClasses", commonId), {
          id: commonId,
          name: `Turma ${data.name}`,
          schoolName: data.schoolName,
          schoolId: data.schoolId,
          available: data.available,
          timestamp: serverTimestamp(),
        });
        resetForm();
        toast.success(`Turma ${data.name} criado com sucesso! 👌`, {
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

    // CHECKING IF SCHOOL CLASS EXISTS ON DATABASE
    const classRef = collection(db, "schoolClasses");
    const q = query(classRef, where("name", "==", `Turma ${data.name}`));
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
            `Turma ${data.name} já existe no nosso banco de dados... ❕`,
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
        // IF NOT EXISTS, CREATE
        addClass();
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
      <h1 className={pageTitleH1}>
        {classData.name
          ? `Adicionando Turma ${classData.name}`
          : "Adicionar Turma"}
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddClass)} className={formMaster}>
        {/* CLASS NAME */}
        <div className={divItemsForm}>
          <label
            htmlFor="name"
            className={errors.name ? labelTextError : labelTextOk}
          >
            Nome:{" "}
          </label>
          <input
            type="text"
            name="name"
            disabled={isSubmitting}
            placeholder={
              errors.name
                ? "É necessário inserir o Nome da Turma"
                : "Insira o nome da Turma"
            }
            className={errors.name ? inputError : inputOk}
            value={classData.name}
            onChange={(e) => {
              setClassData({ ...classData, name: e.target.value });
            }}
          />
        </div>

        {/* SCHOOL SELECT */}
        <div className={divItemsForm}>
          <label
            htmlFor="schoolSelect"
            className={errors.schoolId ? labelTextError : labelTextOk}
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={errors.schoolId ? selectError : selectOk}
            name="schoolSelect"
            onChange={(e) => {
              setClassData({
                ...classData,
                schoolId: e.target.value,
                confirmInsert: false,
              });
            }}
          >
            <SelectOptions
              returnId
              dataType="schools"
              handleData={handleSchoolSelectedData}
            />
          </select>
        </div>

        {/* SCHOOL CLASS AVAILABILITY */}
        <div className={divItemsForm}>
          <label
            htmlFor="available"
            className={errors.available ? labelTextError : labelTextOk}
          >
            Disponibilidade:{" "}
          </label>
          <select
            name="available"
            defaultValue={"closed"}
            onChange={(e) => {
              e.target.value === "opened"
                ? setClassData({ ...classData, available: true })
                : e.target.value === "closed"
                ? setClassData({ ...classData, available: false })
                : null;
              setClassData({ ...classData, confirmInsert: false });
            }}
            className={errors.available ? selectError : selectOk}
          >
            <option disabled value={" -- select an option -- "}>
              {" "}
              -- Selecione --{" "}
            </option>
            <option value={"opened"}>Turma Aberta</option>
            <option value={"closed"}>Turma Fechada</option>
          </select>
        </div>

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={classData.confirmInsert}
            onChange={() => {
              setClassData({
                ...classData,
                confirmInsert: !classData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {classData.name
              ? `Confirmar criação de Turma ${classData.name}`
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
