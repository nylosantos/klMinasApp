/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { createStudentValidationSchema } from "../zodValidation";
import {
  CreateStudentValidationZProps,
  SearchCurriculumValidationZProps,
} from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../SelectOptions";
import cep from "cep-promise";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { BrazilianStateSelectOptions } from "../BrazilianStateSelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertStudent() {
  // STUDENT DATA
  const [studentData, setStudentData] = useState<CreateStudentValidationZProps>(
    {
      name: "",
      email: "",
      birthDate: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
      },
      phone: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      activePhoneSecondary: false,
      phoneSecondary: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      activePhoneTertiary: false,
      phoneTertiary: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      responsible: "",
      financialResponsible: "",
      curriculum: "",
      confirmInsert: false,
    }
  );

  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<SearchCurriculumValidationZProps>({
      school: "",
      schoolClass: "",
      schoolCourse: "",
    });

  // CURRICULUM COURSES ARRAY STATE
  const [curriculumCoursesData, setCurriculumCoursesData] = useState([]);
  const [schoolClassesData, setSchoolClassesData] = useState([]);
  const [schedulesDetailsData, setSchedulesDetailsData] = useState([]);

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CEP SUBMITTING STATE
  const [cepSubmitting, setCepSubmitting] = useState(false);

  // CEP ERROR STATE
  const [cepError, setCepError] = useState(false);

  // EDIT ADDRESS STATE
  const [editAddress, setEditAddress] = useState(false);
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    city: "",
    state: "",
  });

  // GET CEP (BRAZILIAN ZIP CODE) FUNCTION
  const getCep = async (data: string) => {
    setEditAddress(false);
    if (data) {
      setCepSubmitting(true);
      await cep(data)
        .then((response) => {
          setCepSubmitting(false);
          setStudentData({
            ...studentData,
            address: {
              ...studentData.address,
              cep: data,
              street: response.street,
              neighborhood: response.neighborhood,
              city: response.city,
              state: response.state,
            },
          });
        })
        .catch((error) => {
          console.log("ESSE É O ERROR", error);
          setCepSubmitting(false);
          toast.error(
            `Erro ao pesquisar o CEP, verifique o número ou insira o endereço manualmente... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        });
    } else {
      setCepError(true);
      setCepSubmitting(false);
      toast.error(`Por favor, preencha o CEP para pesquisa.`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
  };

  // ACTIVATING OPTIONAL PHONES STATES
  const [activePhoneSecondary, setActivePhoneSecondary] = useState(false);
  const [activePhoneTertiary, setActivePhoneTertiary] = useState(false);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = async () => {
    const q = query(
      collection(db, "curriculum"),
      where("school", "==", curriculumData.school),
      where("schoolClass", "==", curriculumData.schoolClass),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setCurriculumCoursesData(promises);
  };

  // GETTING CLASS DATA
  const handleAvailableClassesData = async () => {
    const q = query(
      collection(db, "schoolClasses"),
      where("schoolName", "==", curriculumData.school),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setSchoolClassesData(promises);
  };

  // GETTING SCHEDULES DATA
  const handleSchedulesDetails = async () => {
    const q = query(collection(db, "schedules"));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setSchedulesDetailsData(promises);
  };

  // SET CLASS DATA WHEN CHOOSE THE SCHOOL
  useEffect(() => {
    handleAvailableClassesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curriculumData.school]);

  // SET CURRICULUM DATA WHEN CHOOSE CLASS
  useEffect(() => {
    handleAvailableCoursesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curriculumData.schoolClass]);

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    handleSchedulesDetails();
  }, []);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentValidationZProps>({
    resolver: zodResolver(createStudentValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
      },
      phone: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      activePhoneSecondary: false,
      phoneSecondary: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      activePhoneTertiary: false,
      phoneTertiary: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      responsible: "",
      financialResponsible: "",
      curriculum: "",
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setStudentData({
      name: "",
      email: "",
      birthDate: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
      },
      phone: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      activePhoneSecondary: false,
      phoneSecondary: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      activePhoneTertiary: false,
      phoneTertiary: {
        ddd: "",
        prefix: "",
        suffix: "",
      },
      responsible: "",
      financialResponsible: "",
      curriculum: "",
      confirmInsert: false,
    });
    setCurriculumData({ ...curriculumData, school: "", schoolClass: "" });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", studentData.name);
    setValue("email", studentData.email);
    setValue("birthDate", studentData.birthDate);
    setValue("address.street", studentData.address.street);
    setValue("address.number", studentData.address.number);
    setValue("address.complement", studentData.address.complement);
    setValue("address.neighborhood", studentData.address.neighborhood);
    setValue("address.city", studentData.address.city);
    setValue("address.state", studentData.address.state);
    setValue("address.cep", studentData.address.cep);
    setValue("phone.ddd", studentData.phone.ddd);
    setValue("phone.prefix", studentData.phone.prefix);
    setValue("phone.suffix", studentData.phone.suffix);
    setValue("activePhoneSecondary", studentData.activePhoneSecondary);
    setValue("phoneSecondary.ddd", studentData.phoneSecondary.ddd);
    setValue("phoneSecondary.prefix", studentData.phoneSecondary.prefix);
    setValue("phoneSecondary.suffix", studentData.phoneSecondary.suffix);
    setValue("activePhoneTertiary", studentData.activePhoneTertiary);
    setValue("phoneTertiary.ddd", studentData.phoneTertiary.ddd);
    setValue("phoneTertiary.prefix", studentData.phoneTertiary.prefix);
    setValue("phoneTertiary.suffix", studentData.phoneTertiary.suffix);
    setValue("responsible", studentData.responsible);
    setValue("financialResponsible", studentData.financialResponsible);
    setValue("curriculum", studentData.curriculum);
    setValue("confirmInsert", studentData.confirmInsert);
  }, [studentData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.name,
      errors.email,
      errors.birthDate,
      errors.address?.street,
      errors.address?.number,
      errors.address?.complement,
      errors.address?.neighborhood,
      errors.address?.city,
      errors.address?.state,
      errors.address?.cep,
      errors.phone?.ddd,
      errors.phone?.prefix,
      errors.phone?.suffix,
      errors.activePhoneSecondary,
      errors.phoneSecondary?.ddd,
      errors.phoneSecondary?.prefix,
      errors.phoneSecondary?.suffix,
      errors.activePhoneTertiary,
      errors.phoneTertiary?.ddd,
      errors.phoneTertiary?.prefix,
      errors.phoneTertiary?.suffix,
      errors.responsible,
      errors.financialResponsible,
      errors.curriculum,
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
  const handleAddStudent: SubmitHandler<CreateStudentValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);
    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar ${data.name}... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CHECKING IF STUDENT EXISTS ON DATABASE
    const studentRef = collection(db, "students");
    const q = query(
      studentRef,
      where("name", "==", data.name),
      where("email", "==", data.email),
      where("responsible", "==", data.responsible),
      where("financialResponsible", "==", data.financialResponsible)
    );
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
            `Aluno ${data.name} já existe no nosso banco de dados... ❕`,
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
        const addStudent = async () => {
          const newStudentId = uuidv4();
          const newStudentRef = doc(db, "students", uuidv4());
          const curriculumRef = collection(db, "curriculum");
          const q = query(curriculumRef, where("id", "==", data.curriculum));
          const querySnapshot = await getDocs(q);
          const promises: any = [];
          querySnapshot.forEach((doc) => {
            const promise = doc.id;
            promises.push(promise);
          });
          try {
            // ADD STUDENT TO CURRICULUM TABLE <-- --> COLOCAR AQUI UMA TESTE PARA O MÁXIMO DE ALUNOS PARTICIPANTES EM UMA CLASSE
            const curriculumId = doc(db, "curriculum", promises[0]);
            await updateDoc(curriculumId, {
              students: arrayUnion(newStudentId),
            });
            try {
              // ADD STUDENT TO DATABASE
              await setDoc(newStudentRef, {
                id: newStudentId,
                name: data.name,
                email: data.email,
                birthDate: Timestamp.fromDate(new Date(data.birthDate)),
                address: {
                  street: data.address.street,
                  number: data.address.number,
                  complement: data.address.complement,
                  neighborhood: data.address.neighborhood,
                  city: data.address.city,
                  state: data.address.state,
                  cep: data.address.cep,
                },
                phone: `${data.phone.ddd} ${data.phone.prefix}-${data.phone.suffix}`,
                phoneSecondary: `${data.phoneSecondary.ddd} ${data.phoneSecondary.prefix}-${data.phoneSecondary.suffix}`,
                phoneTertiary: `${data.phoneTertiary.ddd} ${data.phoneTertiary.prefix}-${data.phoneTertiary.suffix}`,
                responsible: data.responsible,
                financialResponsible: data.financialResponsible,
                curriculum: [data.curriculum],
                timestamp: serverTimestamp(),
              });
              toast.success(`Aluno ${data.name} criado com sucesso! 👌`, {
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
          } finally {
            resetForm();
          }
        };
        addStudent();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Adicionar Aluno</h1>
      <form
        onSubmit={handleSubmit(handleAddStudent)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* NAME */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="name"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
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
                ? "É necessário inserir o nome completo do aluno"
                : "Insira o nome completo do aluno"
            }
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.name}
            onChange={(e) => {
              setStudentData({ ...studentData, name: e.target.value });
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
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
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
            value={studentData.email}
            onChange={(e) => {
              setStudentData({ ...studentData, email: e.target.value });
            }}
          />
        </div>

        {/* BIRTHDATE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="birthDate"
            className={
              errors.birthDate
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Data de Nascimento:{" "}
          </label>
          <div className="flex w-3/4">
            <DatePicker
              placeholder={
                errors.birthDate
                  ? "É necessário selecionar uma Data"
                  : "Selecione uma Data"
              }
              currentDate={new DateObject().subtract(3, "years")}
              inputClass={
                errors.birthDate
                  ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              maxDate={new DateObject().subtract(3, "years")}
              format="DD/MM/YYYY"
              value={studentData.birthDate}
              onChange={(e) =>
                setStudentData({ ...studentData, birthDate: e!.toString() })
              }
            />
          </div>
        </div>

        {/* ADDRESS */}
        {/* CEP */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="addressCep"
            className={
              errors.address?.cep
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            CEP:{" "}
          </label>
          <div className="flex w-3/4 gap-2">
            <div className="w-10/12">
              <input
                type="text"
                pattern="^[+ 0-9]{8}$"
                maxLength={8}
                placeholder={
                  errors.address?.cep || cepError
                    ? "É necessário inserir um CEP"
                    : "Insira o CEP"
                }
                className={
                  errors.address?.cep || cepError
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentData.address.cep}
                onChange={(e) => {
                  setCepError(false);
                  setStudentData({
                    ...studentData,
                    address: {
                      ...studentData.address,
                      cep: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            <button
              type="button"
              disabled={cepSubmitting}
              className="border rounded-2xl border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/12"
              onClick={() => {
                getCep(studentData.address.cep);
              }}
            >
              {cepSubmitting ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* STREET AND NUMBER */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="addressStreet"
            className={
              errors.address?.street
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Rua:{" "}
          </label>
          <div className="flex w-3/4 gap-2 items-center">
            <div className="flex w-10/12">
              <input
                type="text"
                name="addressStreet"
                disabled={!editAddress}
                placeholder={
                  errors.address?.street
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "Rua / Av. / Pça"
                }
                className={
                  editAddress
                    ? errors.address?.street
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address?.street}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, street: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex w-2/12 items-center gap-2">
              <label htmlFor="addressNumber" className="text-right">
                Nº:
              </label>
              <input
                type="text"
                name="addressNumber"
                placeholder={errors.address?.number ? "Número" : "Número"}
                className={
                  errors.address?.number
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentData.address?.number}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, number: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* NEIGHBORHOOD AND COMPLEMENT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="addressNeighborhood"
            className={
              errors.address?.neighborhood
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Bairro:{" "}
          </label>
          <div className="flex w-3/4 gap-2 items-center">
            <div className="flex w-8/12">
              <input
                type="text"
                name="addressNeighborhood"
                disabled={!editAddress}
                placeholder={
                  errors.address?.neighborhood
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "Bairro"
                }
                className={
                  editAddress
                    ? errors.address?.neighborhood
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address.neighborhood}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: {
                      ...studentData.address,
                      neighborhood: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex w-4/12 items-center gap-2">
              <label htmlFor="addressComplement" className="text-right">
                Complemento:
              </label>
              <input
                type="text"
                name="addressComplement"
                placeholder={"Apto | Bloco"}
                className={
                  errors.address
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentData.address.complement}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: {
                      ...studentData.address,
                      complement: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* CITY AND STATE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="addressCity"
            className={
              errors.address?.city
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Cidade:{" "}
          </label>
          <div className="flex w-3/4 gap-2 items-center">
            <div className="flex w-10/12">
              <input
                type="text"
                name="addressCity"
                disabled={!editAddress}
                placeholder={
                  errors.address?.city
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "Cidade"
                }
                className={
                  editAddress
                    ? errors.address?.city
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address.city}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex w-2/12 items-center gap-2">
              <label htmlFor="addressState" className="text-right">
                Estado:
              </label>
              <input
                type="text"
                name="addressState"
                disabled={!editAddress}
                placeholder={
                  errors.address?.state
                    ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                    : "UF"
                }
                className={
                  editAddress
                    ? errors.address?.state
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                value={studentData.address.state}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    address: { ...studentData.address, state: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* EDIT ADDRESS BUTTON */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="editAddressButton"
            className="w-1/4 text-right"
          ></label>
          <button
            type="button"
            disabled={editAddress}
            className="border rounded-2xl mt-2 mb-4 border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-3/4"
            onClick={() => setEditAddress(true)}
          >
            {editAddress
              ? "Insira o Endereço manualmente, ou busque o CEP novamente"
              : "Editar Endereço"}
          </button>
        </div>

        {/* PHONE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="address"
            className={
              errors.phone
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Telefone:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-10/12 items-center gap-1">
              <select
                defaultValue={"DDD"}
                className={
                  errors.phone?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phone: { ...studentData.phone, ddd: e.target.value },
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
                value={studentData.phone.prefix}
                placeholder={errors.phone?.prefix ? "É necessário um" : "99999"}
                className={
                  errors.phone?.prefix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phone: {
                      ...studentData.phone,
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
                value={studentData.phone.suffix}
                placeholder={errors.phone?.suffix ? "telefone válido" : "9990"}
                className={
                  errors.phone?.suffix
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phone: {
                      ...studentData.phone,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            <div className="w-2/12"></div>
          </div>
        </div>

        {/* PHONE SECONDARY */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phoneSecondary"
            className={
              errors.phoneSecondary
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Telefone 2:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-10/12 items-center gap-1">
              {/** NUMBER SECONDARY DDD */}
              <select
                disabled={!studentData.activePhoneSecondary}
                defaultValue={"DDD"}
                className={
                  studentData.activePhoneSecondary
                    ? errors.phoneSecondary?.ddd
                      ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneSecondary: {
                      ...studentData.phoneSecondary,
                      ddd: e.target.value,
                    },
                  });
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              {/** NUMBER SECONDARY PREFIX */}
              <input
                type="text"
                name="phoneSecondaryInitial"
                disabled={!studentData.activePhoneSecondary}
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={studentData.phoneSecondary.prefix}
                placeholder={
                  errors.phoneSecondary?.prefix ? "É necessário um" : "99999"
                }
                className={
                  studentData.activePhoneSecondary
                    ? errors.phoneSecondary?.prefix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneSecondary: {
                      ...studentData.phoneSecondary,
                      prefix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
              -{/** NUMBER SECONDARY SUFFIX */}
              <input
                type="text"
                name="phoneSecondaryFinal"
                disabled={!studentData.activePhoneSecondary}
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={studentData.phoneSecondary.suffix}
                placeholder={
                  errors.phoneSecondary?.prefix ? "telefone válido" : "9999"
                }
                className={
                  studentData.activePhoneSecondary
                    ? errors.phoneSecondary?.suffix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneSecondary: {
                      ...studentData.phoneSecondary,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            {/** CHECKBOX INCLUDE NUMBER SECONDARY */}
            <div className="flex w-2/12 items-center gap-2">
              <input
                type="checkbox"
                name="activePhoneSecondary"
                className="ml-1"
                checked={activePhoneSecondary}
                onChange={() => {
                  setActivePhoneSecondary(!activePhoneSecondary);
                  setStudentData({
                    ...studentData,
                    activePhoneSecondary: !activePhoneSecondary,
                  });
                }}
              />
              <label
                htmlFor="activePhoneSecondary"
                className="text-sm text-gray-600 dark:text-gray-100"
              >
                Incluir
              </label>
            </div>
          </div>
        </div>

        {/* PHONE TERTIARY */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phoneTertiary"
            className={
              errors.phoneTertiary
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Telefone 3:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-10/12 items-center gap-1">
              {/** NUMBER TERTIARY DDD */}
              <select
                disabled={!studentData.activePhoneTertiary}
                defaultValue={"DDD"}
                className={
                  studentData.activePhoneTertiary
                    ? errors.phoneTertiary?.ddd
                      ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneTertiary: {
                      ...studentData.phoneTertiary,
                      ddd: e.target.value,
                    },
                  });
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              {/** NUMBER TERTIARY PREFIX */}
              <input
                type="text"
                name="phoneTertiaryInitial"
                disabled={!studentData.activePhoneTertiary}
                pattern="^[+ 0-9]{5}$"
                maxLength={5}
                value={studentData.phoneTertiary.prefix}
                placeholder={
                  errors.phoneTertiary?.prefix ? "É necessário um" : "99999"
                }
                className={
                  studentData.activePhoneTertiary
                    ? errors.phoneTertiary?.prefix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneTertiary: {
                      ...studentData.phoneTertiary,
                      prefix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
              -{/** NUMBER TERTIARY SUFFIX */}
              <input
                type="text"
                name="phoneTertiaryFinal"
                disabled={!studentData.activePhoneTertiary}
                pattern="^[+ 0-9]{4}$"
                maxLength={4}
                value={studentData.phoneTertiary.suffix}
                placeholder={
                  errors.phoneTertiary?.prefix ? "telefone válido" : "9999"
                }
                className={
                  studentData.activePhoneTertiary
                    ? errors.phoneTertiary?.suffix
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData({
                    ...studentData,
                    phoneTertiary: {
                      ...studentData.phoneTertiary,
                      suffix: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  });
                }}
              />
            </div>
            {/** CHECKBOX INCLUDE NUMBER TERTIARY */}
            <div className="flex w-2/12 items-center gap-2">
              <input
                type="checkbox"
                name="activePhoneTertiary"
                className="ml-1"
                checked={activePhoneTertiary}
                onChange={() => {
                  setActivePhoneTertiary(!activePhoneTertiary);
                  setStudentData({
                    ...studentData,
                    activePhoneTertiary: !activePhoneTertiary,
                  });
                }}
              />
              <label
                htmlFor="activePhoneTertiary"
                className="text-sm text-gray-600 dark:text-gray-100"
              >
                Incluir
              </label>
            </div>
          </div>
        </div>

        {/* RESPONSIBLE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="responsible"
            className={
              errors.responsible
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Responsável{" "}
            <span className="text-sm">
              (diferente do responsável pela cobrança)
            </span>
            :{" "}
          </label>
          <input
            type="text"
            name="responsible"
            placeholder={
              errors.responsible
                ? "É necessário inserir o Nome completo do Responsável"
                : "Insira o nome completo do Responsável"
            }
            className={
              errors.responsible
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.responsible}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                responsible: e.target.value,
              })
            }
          />
        </div>

        {/* FINANCIAL RESPONSIBLE */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="financialResponsible"
            className={
              errors.financialResponsible
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Responsável Financeiro{" "}
            <span className="text-sm">(responsável pela cobrança)</span>:{" "}
          </label>
          <input
            type="text"
            name="financialResponsible"
            placeholder={
              errors.financialResponsible
                ? "É necessário inserir o Nome completo do Responsável Financeiro"
                : "Insira o nome completo do Responsável Financeiro"
            }
            className={
              errors.financialResponsible
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            value={studentData.financialResponsible}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                financialResponsible: e.target.value,
              })
            }
          />
        </div>

        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.curriculum
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            className={
              errors.curriculum
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                school: e.target.value,
                schoolClass: "",
              });
            }}
          >
            <SelectOptions dataType="schools" />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.curriculum
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            defaultValue={" -- select an option -- "}
            disabled={curriculumData.school ? false : true}
            className={
              curriculumData.school
                ? errors.curriculum
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolClass: e.target.value,
              });
            }}
          >
            {curriculumData.school ? (
              <>
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                {schoolClassesData.map((option: any) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </>
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver as turmas disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.school && curriculumData.schoolClass ? (
          curriculumCoursesData.length !== 0 ? (
            <>
              <h1 className="font-bold text-2xl py-4">
                Modalidades {curriculumData.school} -{" "}
                {curriculumData.schoolClass}:
              </h1>
              <hr className="pb-4" />
              <div className="flex flex-wrap gap-4 justify-center">
                {curriculumCoursesData.map((c: any) => (
                  <div
                    className="flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                    key={c.id}
                  >
                    <input
                      type="radio"
                      id={c.id}
                      name="age"
                      value={c.id}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          curriculum: e.target.value,
                        })
                      }
                    />
                    <label htmlFor={c.id} className="flex flex-col gap-4">
                      {curriculumData.school === "Colégio Bernoulli" ? (
                        <p>Turma: {c.schoolClass}</p>
                      ) : null}
                      <p>Modalidade: {c.schoolCourse}</p>
                      {schedulesDetailsData.map((details: any) =>
                        details.name === c.schedule
                          ? `Horário: De ${details.classStart} a ${details.classEnd} hrs`
                          : null
                      )}
                      <p>Dias: {c.classDay}</p>
                      <p>Professor: {c.teacher}</p>
                    </label>
                  </div>
                ))}
              </div>
            </>
          ) : null
        ) : (
          "Selecione um colégio e uma turma para ver as modalidades disponíveis."
        )}

        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none"
            checked={studentData.confirmInsert}
            onChange={() => {
              setStudentData({
                ...studentData,
                confirmInsert: !studentData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmInsert"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            {studentData.name
              ? `Confirmar criação de ${studentData.name}`
              : `Confirmar criação`}
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
