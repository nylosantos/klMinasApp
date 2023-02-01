/* eslint-disable react-hooks/exhaustive-deps */
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
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { editStudentValidationSchema } from "../../@types/zodValidation";
import {
  CurriculumSearchProps,
  EditStudentValidationZProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  SearchCurriculumValidationZProps,
  StudentSearchProps,
} from "../../@types";
import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import DatePicker, { DateObject } from "react-multi-date-picker";
import cep from "cep-promise";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function EditStudent() {
  // STUDENT DATA
  const [studentData, setStudentData] = useState({
    schoolId: "",
    schoolClassId: "",
    curriculumId: "",
    studentId: "",
  });

  // STUDENT EDIT DATA
  const [studentEditData, setStudentEditData] =
    useState<EditStudentValidationZProps>({
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
      familyAtSchool: [],
      curriculum: [],
    });

  // STUDENT SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOLS
  const [schoolsDataArray, setSchoolsDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setSchoolsDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [schoolSelectedData, setSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setSchoolClassSelectedData(undefined);
    setCurriculumSelectedData(undefined);
    setStudentSelectedData(undefined);
    if (studentData.schoolId !== "") {
      setSchoolSelectedData(
        schoolsDataArray!.find(({ id }) => id === studentData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [schoolSelectedData]);

  // RESET SCHOOL CLASS, SCHOOL COURSE AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [studentData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASSES
  const [schoolClassesDataArray, setSchoolClassesDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolClassSelectedData = (data: SchoolClassSearchProps[]) => {
    setSchoolClassesDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setCurriculumSelectedData(undefined);
    setStudentSelectedData(undefined);
    if (studentData.schoolClassId !== "") {
      setSchoolSelectedData(
        schoolClassesDataArray!.find(
          ({ id }) => id === studentData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [schoolClassSelectedData]);

  // RESET STUDENT SELECT TO INDEX 0 WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [studentData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF SELECT STUDENTS
  const [curriculumDataArray, setCurriculumDataArray] =
    useState<CurriculumSearchProps[]>();

  // FUNCTION THAT WORKS WITH CURRICULUM SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleCurriculumSelectedData = (data: CurriculumSearchProps[]) => {
    setCurriculumDataArray(data);
  };

  // CURRICULUM SELECTED STATE DATA
  const [curriculumSelectedData, setCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    setIsEdit(false);
    setIsSelected(false);
    setStudentSelectedData(undefined);
    if (studentData.curriculumId !== "") {
      setCurriculumSelectedData(
        curriculumDataArray!.find(({ id }) => id === studentData.curriculumId)
      );
    } else {
      setCurriculumSelectedData(undefined);
    }
  }, [curriculumSelectedData]);

  // RESET STUDENT SELECT TO INDEX 0 WHEN CURRICULUM CHANGE
  useEffect(() => {
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsEdit(false);
    setIsSelected(false);
  }, [studentData.curriculumId]);
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT SELECT STATES AND FUNCTIONS -------------------------- //
  // STUDENT DATA ARRAY WITH ALL OPTIONS OF SELECT STUDENTS
  const [studentsDataArray, setStudentsDataArray] =
    useState<StudentSearchProps[]>();

  // FUNCTION THAT WORKS WITH STUDENT SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleStudentSelectedData = (data: StudentSearchProps[]) => {
    setStudentsDataArray(data);
  };

  // STUDENT SELECTED STATE DATA
  const [studentSelectedData, setStudentSelectedData] =
    useState<StudentSearchProps>();

  // SET STUDENT EDIT STATE WHEN SELECT STUDENT
  useEffect(() => {
    if (studentSelectedData !== undefined) {
      setIsSelected(true);
      setIsEdit(false);
      if (studentData.studentId !== "") {
        setStudentEditData({
          ...studentEditData,
          name: studentSelectedData.name,
          email: studentSelectedData.email,
          birthDate: studentSelectedData.birthDate,
          address: {
            street: studentSelectedData.address.street,
            number: studentSelectedData.address.number,
            complement: studentSelectedData.address.complement,
            neighborhood: studentSelectedData.address.neighborhood,
            city: studentSelectedData.address.city,
            state: studentSelectedData.address.state,
            cep: studentSelectedData.address.cep,
          },
          phone: {
            ddd: studentSelectedData.phone.slice(3, 5),
            prefix: studentSelectedData.phone.slice(5, 10),
            suffix: studentSelectedData.phone.slice(-4),
          },
          activePhoneSecondary:
            studentSelectedData?.phoneSecondary !== "" ? true : false,
          phoneSecondary: {
            ddd: studentSelectedData?.phoneSecondary
              ? studentSelectedData.phoneSecondary.slice(3, 5)
              : "DDD",
            prefix: studentSelectedData?.phoneSecondary
              ? studentSelectedData.phoneSecondary.slice(5, 10)
              : "",
            suffix: studentSelectedData?.phoneSecondary
              ? studentSelectedData.phoneSecondary.slice(-4)
              : "",
          },
          activePhoneTertiary:
            studentSelectedData?.phoneTertiary !== "" ? true : false,
          phoneTertiary: {
            ddd: studentSelectedData?.phoneTertiary
              ? studentSelectedData.phoneTertiary.slice(3, 5)
              : "DDD",
            prefix: studentSelectedData?.phoneTertiary
              ? studentSelectedData.phoneTertiary.slice(5, 10)
              : "",
            suffix: studentSelectedData?.phoneTertiary
              ? studentSelectedData.phoneTertiary.slice(-4)
              : "",
          },
          responsible: studentSelectedData.responsible,
          financialResponsible: studentSelectedData.financialResponsible,
          familyAtSchool: studentSelectedData.familyAtSchool,
          curriculum: studentSelectedData.curriculum,
        });
      }
    }
  }, [studentSelectedData]);

  // HAVE CURRICULUM STATE
  const [haveCurriculum, setHaveCurriculum] = useState(false);

  // IF STUDENT HAVE CURRICULUM SET STATE AND SHOW INPUTS
  useEffect(() => {
    if (studentEditData.curriculum.length > 0) {
      setHaveCurriculum(true);
      // for (let index = 0; index < studentEditData.curriculum.length; index++) {
      //   setExcludeCurriculum({[index + 1]: false });
      // }
    } else {
      setHaveCurriculum(false);
    }
  }, [studentEditData.curriculum]);

  // INCLUDE / EXLUDE CURRICULUM STATES
  const [excludeCurriculum, setExcludeCurriculum] = useState({});

  // SET PHONE FORMATTED
  useEffect(() => {
    if (studentSelectedData !== undefined) {
      setStudentEditData({
        ...studentEditData,
        phoneSecondary: {
          ...studentEditData.phoneSecondary,
          ddd: studentEditData.activePhoneSecondary
            ? studentSelectedData.phoneSecondary !== ""
              ? studentSelectedData.phoneSecondary.slice(3, 5)
              : "DDD"
            : "DDD",
          prefix: studentEditData.activePhoneSecondary
            ? studentSelectedData.phoneSecondary.slice(5, 10)
            : "",
          suffix: studentEditData.activePhoneSecondary
            ? studentSelectedData.phoneSecondary.slice(-4)
            : "",
        },
        phoneTertiary: {
          ...studentEditData.phoneTertiary,
          ddd: studentEditData.activePhoneTertiary
            ? studentSelectedData.phoneTertiary !== ""
              ? studentSelectedData.phoneTertiary.slice(3, 5)
              : "DDD"
            : "DDD",
          prefix: studentEditData.activePhoneTertiary
            ? studentSelectedData.phoneTertiary.slice(5, 10)
            : "",
          suffix: studentEditData.activePhoneTertiary
            ? studentSelectedData.phoneTertiary.slice(-4)
            : "",
        },
      });
    }
  }, [
    studentEditData.activePhoneSecondary,
    studentEditData.activePhoneTertiary,
  ]);

  // SET STUDENT SELECTED STATE WHEN SELECT STUDENT ON FORM
  useEffect(() => {
    if (studentData.studentId !== "") {
      setIsEdit(false);
      setIsSelected(true);
      setStudentSelectedData(
        studentsDataArray!.find(({ id }) => id === studentData.studentId)
      );
    } else {
      setStudentSelectedData(undefined);
    }
  }, [studentData.studentId]);

  // STUDENT NOT FOUND STATE
  const [studentNotFound, setStudentNotFound] = useState(false);

  // SET STUDENT NOT FOUND WHEN NO STUDENT IS FOUND
  useEffect(() => {
    if (
      studentData.schoolId &&
      studentData.schoolClassId &&
      studentData.curriculumId &&
      studentsDataArray?.length === 0
    ) {
      setStudentNotFound(true);
    }
  }, [studentsDataArray]);
  // -------------------------- END OF STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT EDIT STATES AND FUNCTIONS -------------------------- //
  // DATE STRING STATE
  const [dateToString, setDateToString] = useState("");

  // DATE SUBMIT STRING STATE
  const [dateSubmitToString, setDateSubmitToString] = useState("");

  // TRANSFORM FIREBASE TIMESTAMP DATE TO STRING AND SET TO STATE
  useEffect(() => {
    setDateToString(
      //@ts-ignore
      studentSelectedData?.birthDate.toDate().toLocaleDateString()
    );
  }, [studentSelectedData]);

  // TRANSFORM DATE TO FORMAT OF FIREBASE MM/DD/YYYY
  useEffect(() => {
    if (dateToString) {
      setDateSubmitToString(
        `${dateToString.slice(3, 5)}/${dateToString.slice(
          0,
          2
        )}/${dateToString.slice(-4)}`
      );
    }
  }, [dateToString]);

  // CEP SUBMITTING STATE
  const [cepSubmitting, setCepSubmitting] = useState(false);

  // CEP ERROR STATE
  const [cepError, setCepError] = useState(false);

  // EDIT ADDRESS STATE
  const [editAddress, setEditAddress] = useState(false);

  // GET CEP (BRAZILIAN ZIP CODE) FUNCTION
  const getCep = async (data: string) => {
    setEditAddress(false);
    if (data) {
      setCepSubmitting(true);
      await cep(data)
        .then((response) => {
          setCepSubmitting(false);
          setStudentEditData({
            ...studentEditData,
            address: {
              ...studentEditData.address,
              cep: data,
              street: response.street,
              neighborhood: response.neighborhood,
              city: response.city,
              state: response.state,
              // RESETING NUMBER AND COMPLEMENT WHEN GET CEP
              number: "",
              complement: "",
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

  // BROTHER DATA STATE
  const [studentBrotherDataArray, setStudentBrotherDataArray] = useState<
    StudentSearchProps[]
  >([
    {
      id: "",
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
      phone: "",
      activePhoneSecondary: false,
      phoneSecondary: "",
      activePhoneTertiary: false,
      phoneTertiary: "",
      responsible: "",
      financialResponsible: "",
      familyAtSchool: [],
      curriculum: [],
      timestamp: new Date(),
    },
  ]);

  const [teste, setTeste] = useState("");
  // GET BROTHER NAME TO PUT ON FORM
  useEffect(() => {
    const formated: any = [];
    studentEditData.familyAtSchool.forEach((item) => {
      formated.push(item);
    });
    setTeste(formated.length.toString());

    // if (studentSelectedData !== undefined) {
    //   if (studentEditData.familyAtSchool.length > 0) {
    //     const promises: any = [];
    //     studentEditData.familyAtSchool.forEach((id) => {
    //       const q = query(collection(db, "students"), where("id", "==", id));
    //       const unsubscribe = onSnapshot(q, (querySnapShot) => {
    //         querySnapShot.forEach((doc) => {
    //           const promise = doc.data();
    //           promises.push(promise);
    //         });
    //       });
    //     });
    //     setStudentBrotherDataArray(promises);
    //   }
    // }
  }, [studentEditData.familyAtSchool]);

  // BROTHER NAME STATE
  const [brotherFormattedName, setBrotherFormattedName] = useState("");

  // CREATE AN ARRAY OF BROTHERS NAMES
  useEffect(() => {
    // console.log(studentBrotherDataArray);
    function handle() {
      studentBrotherDataArray.forEach((item) => {
        console.log(item.name);
      });
    }
    handle();
    // studentBrotherDataArray?.map((item) => {
    //   console.log(item.name)
    // })
  }, [studentBrotherDataArray]);
  // -------------------------- END OF STUDENT EDIT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- // // -------------------------- VIEW THIS -------------------------- //
  // // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF SELECT CURRICULUM
  // const [curriculumEditDataArray, setCurriculumEditDataArray] =
  //   useState<CurriculumSearchProps[]>();

  //   // FUNCTION THAT WORKS WITH CURRICULUM SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  // const handleCurriculumEditSelectedData = (data: CurriculumSearchProps[]) => {
  //   setCurriculumEditDataArray(data);
  // };

  // // CURRICULUM SELECTED STATE DATA
  // const [curriculumEditSelectedData, setCurriculumEditSelectedData] =
  //   useState<CurriculumSearchProps>();

  //   // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  // useEffect(() => {
  //   if (studentData.curriculumId !== "") {
  //     setCurriculumEditSelectedData(
  //       curriculumEditDataArray!.find(({ id }) => id === studentData.curriculumId)
  //     );
  //   } else {
  //     setCurriculumEditSelectedData(undefined);
  //   }
  // }, [curriculumEditSelectedData]);

  // // CURRICULUM DATA
  // const [curriculumData, setCurriculumData] =
  //   useState<SearchCurriculumValidationZProps>({
  //     school: "",
  //     schoolClass: "",
  //     schoolCourse: "",
  //   });

  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditStudentValidationZProps>({
    resolver: zodResolver(editStudentValidationSchema),
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
      familyAtSchool: [],
      curriculum: [],
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("studentSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setStudentEditData({
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
      familyAtSchool: [],
      curriculum: [],
    });
    setStudentData({
      schoolId: "",
      schoolClassId: "",
      curriculumId: "",
      studentId: "",
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("name", studentEditData.name);
    setValue("email", studentEditData.email);
    setValue("birthDate", dateToString);
    setValue("address.street", studentEditData.address.street);
    setValue("address.number", studentEditData.address.number);
    setValue("address.complement", studentEditData.address.complement);
    setValue("address.neighborhood", studentEditData.address.neighborhood);
    setValue("address.city", studentEditData.address.city);
    setValue("address.state", studentEditData.address.state);
    setValue("address.cep", studentEditData.address.cep);
    setValue("phone.ddd", studentEditData.phone.ddd);
    setValue("phone.prefix", studentEditData.phone.prefix);
    setValue("phone.suffix", studentEditData.phone.suffix);
    setValue("activePhoneSecondary", studentEditData.activePhoneSecondary);
    setValue("phoneSecondary.ddd", studentEditData.phoneSecondary.ddd);
    setValue("phoneSecondary.prefix", studentEditData.phoneSecondary.prefix);
    setValue("phoneSecondary.suffix", studentEditData.phoneSecondary.suffix);
    setValue("activePhoneTertiary", studentEditData.activePhoneTertiary);
    setValue("phoneTertiary.ddd", studentEditData.phoneTertiary.ddd);
    setValue("phoneTertiary.prefix", studentEditData.phoneTertiary.prefix);
    setValue("phoneTertiary.suffix", studentEditData.phoneTertiary.suffix);
    setValue("responsible", studentEditData.responsible);
    setValue("financialResponsible", studentEditData.financialResponsible);
    setValue("familyAtSchool", studentEditData.familyAtSchool);
    setValue("curriculum", studentEditData.curriculum);
  }, [studentEditData, dateToString]);

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
      errors.familyAtSchool,
      errors.curriculum,
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
  const handleEditClass: SubmitHandler<EditStudentValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHEKING VALID SECONDARY PHONE
    if (studentEditData.activePhoneSecondary) {
      if (studentEditData.phoneSecondary.ddd === "DDD") {
        return (
          setIsSubmitting(false),
          toast.error(
            `Preencha o número de telefone 2 ou desmarque a opção "incluir"...... ❕`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          )
        );
      }
    }

    // CHEKING VALID TERTIARY PHONE
    if (studentEditData.activePhoneTertiary) {
      if (studentEditData.phoneTertiary.ddd === "DDD") {
        return (
          setIsSubmitting(false),
          toast.error(
            `Preencha o número de telefone 3 ou desmarque a opção "incluir"...... ❕`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          )
        );
      }
    }

    // CHECKING IF STUDENT EXISTS ON CURRRICULUM DATABASE
    const studentRef = collection(db, "students");
    const q = query(studentRef, where("id", "==", studentData.studentId));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      // IF NO EXISTS, RETURN ERROR
      if (results.length === 0) {
        return (
          setIsSubmitting(false),
          toast.error(`Aluno não existe no banco de dados...... ❕`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          })
        );
      } else {
        // IF EXISTS, EDIT
        const editStudent = async () => {
          try {
            await updateDoc(doc(db, "students", studentData.studentId), {
              name: studentEditData.name,
              email: studentEditData.email,
              birthDate: Timestamp.fromDate(new Date(dateSubmitToString)),
              "address.street": studentEditData.address.street,
              "address.number": studentEditData.address.number,
              "address.complement": studentEditData.address.complement,
              "address.neighborhood": studentEditData.address.neighborhood,
              "address.city": studentEditData.address.city,
              "address.state": studentEditData.address.state,
              "address.cep": studentEditData.address.cep,
              phone: `+55${studentEditData.phone.ddd}${studentEditData.phone.prefix}${studentEditData.phone.suffix}`,
              phoneSecondary:
                studentEditData.phoneSecondary.ddd === "DDD"
                  ? ""
                  : `+55${studentEditData.phoneSecondary.ddd}${studentEditData.phoneSecondary.prefix}${studentEditData.phoneSecondary.suffix}`,
              phoneTertiary:
                studentEditData.phoneTertiary.ddd === "DDD"
                  ? ""
                  : `+55${studentEditData.phoneTertiary.ddd}${studentEditData.phoneTertiary.prefix}${studentEditData.phoneTertiary.suffix}`,
              responsible: studentEditData.responsible,
              financialResponsible: studentEditData.financialResponsible,
              // familyAtSchool: arrayUnion(studentEditData.familyAtSchoolId),
              // curriculum: arrayUnion(studentEditData.curriculum),
            });
            resetForm();
            toast.success(`${studentEditData.name} alterado com sucesso! 👌`, {
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
        editStudent();
      }
    });
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${studentEditData.name}` : "Editar Aluno"}
      </h1>
      <form
        onSubmit={handleSubmit(handleEditClass)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={
              errors.name
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            }
            name="schoolSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                schoolId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              handleData={handleSchoolSelectedData}
              dataType="schools"
            />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolClassSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Turma:{" "}
          </label>
          <select
            id="schoolClassSelect"
            defaultValue={" -- select an option -- "}
            disabled={studentData.schoolId ? false : true}
            className={
              studentData.schoolId
                ? errors.name
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                schoolClassId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              handleData={handleSchoolClassSelectedData}
              dataType="schoolClasses"
              schoolId={studentData.schoolId}
            />
          </select>
        </div>

        {/* SCHOOL COURSE SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="curriculumSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="curriculumSelect"
            defaultValue={" -- select an option -- "}
            disabled={studentData.schoolClassId ? false : true}
            className={
              studentData.schoolId
                ? errors.name
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="curriculumSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                curriculumId: e.target.value,
              });
            }}
          >
            <SelectOptions
              returnId
              handleData={handleCurriculumSelectedData}
              dataType="curriculum"
              schoolId={studentData.schoolId}
              schoolClassId={studentData.schoolClassId}
            />
          </select>
        </div>

        {/* STUDENT SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="studentSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right text-gray-900 dark:text-gray-100"
            }
          >
            Selecione o Aluno:{" "}
          </label>
          <select
            id="studentSelect"
            defaultValue={" -- select an option -- "}
            disabled={studentData.curriculumId ? false : true}
            className={
              studentData.schoolId
                ? errors.name
                  ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
            }
            name="studentSelect"
            onChange={(e) => {
              setStudentData({
                ...studentData,
                studentId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              handleData={handleStudentSelectedData}
              dataType="students"
              schoolId={studentData.schoolId}
              schoolClassId={studentData.schoolClassId}
              curriculumId={studentData.curriculumId}
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
                className="w-3/4 border rounded-xl border-green-900/10 bg-green-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                {!isEdit
                  ? "Editar"
                  : "Clique em CANCELAR para desfazer a Edição"}
              </button>
            </div>
          </>
        ) : null}

        {isEdit ? (
          <>
            {/* STUDENT NAME */}
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
                    ? "É necessário inserir o nome do Aluno"
                    : "Insira o nome do Aluno"
                }
                className={
                  errors.name
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.name}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    name: e.target.value,
                  });
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
                  errors.email
                    ? "É necessário inserir o e-mail"
                    : "Insira o e-mail"
                }
                className={
                  errors.email
                    ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                value={studentEditData.email}
                onChange={(e) => {
                  setStudentEditData({
                    ...studentEditData,
                    email: e.target.value,
                  });
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
                  editable={false}
                  format="DD/MM/YYYY"
                  value={dateToString}
                  onChange={(e: DateObject) => {
                    if (e !== null) {
                      setStudentEditData({
                        ...studentEditData,
                        birthDate: `${e.month}/${e.day}/${e.year}`,
                      }),
                        setDateToString(
                          `${e.day < 10 ? `0${e.day}` : e.day}/${
                            e.month.number < 10 ? `0${e.month.number}` : e.month
                          }/${e.year}`
                        );
                    }
                  }}
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
                    value={studentEditData.address.cep}
                    onChange={(e) => {
                      setCepError(false);
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
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
                    getCep(studentEditData.address.cep);
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
                    value={studentEditData.address?.street}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
                          street: e.target.value,
                        },
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
                    value={studentEditData.address.number}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
                          number: e.target.value,
                        },
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
                    value={studentEditData.address.neighborhood}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
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
                    value={studentEditData.address.complement}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
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
                    value={studentEditData.address.city}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
                          city: e.target.value,
                        },
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
                    value={studentEditData.address.state}
                    onChange={(e) =>
                      setStudentEditData({
                        ...studentEditData,
                        address: {
                          ...studentEditData.address,
                          state: e.target.value,
                        },
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
                    id="phoneDDD"
                    defaultValue={"DDD"}
                    className={
                      errors.phone?.ddd
                        ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    value={studentEditData.phone.ddd}
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phone: {
                          ...studentEditData.phone,
                          ddd: e.target.value,
                        },
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
                    value={studentEditData.phone.prefix}
                    placeholder={
                      errors.phone?.prefix ? "É necessário um" : "99999"
                    }
                    className={
                      errors.phone?.prefix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phone: {
                          ...studentEditData.phone,
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
                    value={studentEditData.phone.suffix}
                    placeholder={
                      errors.phone?.suffix ? "telefone válido" : "9990"
                    }
                    className={
                      errors.phone?.suffix
                        ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phone: {
                          ...studentEditData.phone,
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
                    id="phoneSecondaryDDD"
                    disabled={!studentEditData.activePhoneSecondary}
                    defaultValue={"DDD"}
                    value={studentEditData.phoneSecondary.ddd}
                    className={
                      studentEditData.activePhoneSecondary
                        ? errors.phoneSecondary?.ddd
                          ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phoneSecondary: {
                          ...studentEditData.phoneSecondary,
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
                    disabled={!studentEditData.activePhoneSecondary}
                    pattern="^[+ 0-9]{5}$"
                    maxLength={5}
                    value={studentEditData.phoneSecondary.prefix}
                    placeholder={
                      errors.phoneSecondary?.prefix
                        ? "É necessário um"
                        : "99999"
                    }
                    className={
                      studentEditData.activePhoneSecondary
                        ? errors.phoneSecondary?.prefix
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phoneSecondary: {
                          ...studentEditData.phoneSecondary,
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
                    disabled={!studentEditData.activePhoneSecondary}
                    pattern="^[+ 0-9]{4}$"
                    maxLength={4}
                    value={studentEditData.phoneSecondary.suffix}
                    placeholder={
                      errors.phoneSecondary?.prefix ? "telefone válido" : "9999"
                    }
                    className={
                      studentEditData.activePhoneSecondary
                        ? errors.phoneSecondary?.suffix
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phoneSecondary: {
                          ...studentEditData.phoneSecondary,
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
                    checked={studentEditData.activePhoneSecondary}
                    onChange={() => {
                      setStudentEditData({
                        ...studentEditData,
                        activePhoneSecondary:
                          !studentEditData.activePhoneSecondary,
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
                    id="phoneTertiaryDDD"
                    disabled={!studentEditData.activePhoneTertiary}
                    defaultValue={"DDD"}
                    value={studentEditData.phoneTertiary.ddd}
                    className={
                      studentEditData.activePhoneTertiary
                        ? errors.phoneTertiary?.ddd
                          ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="DDD"
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phoneTertiary: {
                          ...studentEditData.phoneTertiary,
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
                    disabled={!studentEditData.activePhoneTertiary}
                    pattern="^[+ 0-9]{5}$"
                    maxLength={5}
                    value={studentEditData.phoneTertiary.prefix}
                    placeholder={
                      errors.phoneTertiary?.prefix ? "É necessário um" : "99999"
                    }
                    className={
                      studentEditData.activePhoneTertiary
                        ? errors.phoneTertiary?.prefix
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phoneTertiary: {
                          ...studentEditData.phoneTertiary,
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
                    disabled={!studentEditData.activePhoneTertiary}
                    pattern="^[+ 0-9]{4}$"
                    maxLength={4}
                    value={studentEditData.phoneTertiary.suffix}
                    placeholder={
                      errors.phoneTertiary?.prefix ? "telefone válido" : "9999"
                    }
                    className={
                      studentEditData.activePhoneTertiary
                        ? errors.phoneTertiary?.suffix
                          ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    onChange={(e) => {
                      setStudentEditData({
                        ...studentEditData,
                        phoneTertiary: {
                          ...studentEditData.phoneTertiary,
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
                    checked={studentEditData.activePhoneTertiary}
                    onChange={() => {
                      setStudentEditData({
                        ...studentEditData,
                        activePhoneTertiary:
                          !studentEditData.activePhoneTertiary,
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
                value={studentEditData.responsible}
                onChange={(e) =>
                  setStudentEditData({
                    ...studentEditData,
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
                value={studentEditData.financialResponsible}
                onChange={(e) =>
                  setStudentEditData({
                    ...studentEditData,
                    financialResponsible: e.target.value,
                  })
                }
              />
            </div>

            {/* CURRICULUM INCLUDE / EXCLUDE */}
            {haveCurriculum
              ? studentEditData.curriculum.map((curriculum, index) => (
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="name"
                      className="w-1/4 text-right text-gray-900 dark:text-gray-100"
                    >
                      Aula {index + 1}:{" "}
                    </label>
                    <div className="flex w-3/4 gap-2">
                      <div className="w-10/12">
                        <input
                          type="text"
                          name="name"
                          disabled={isSubmitting}
                          className={
                            excludeCurriculum[`${index + 1}`]
                              ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          value={curriculum}
                          readOnly
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          excludeCurriculum[`${index + 1}`]
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          setExcludeCurriculum({
                            ...excludeCurriculum,
                            [index + 1]: !excludeCurriculum[`${index + 1}`],
                          });
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : excludeCurriculum[`${index + 1}`]
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    </div>
                  </div>
                ))
              : null}

            {/* FAMILY AT SCHOOL ? NAME : NULL */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="name"
                className="w-1/4 text-right text-gray-900 dark:text-gray-100"
              >
                Familiares estudando na escola:{" "}
              </label>
              <input
                type="text"
                name="name"
                disabled={isSubmitting}
                className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                value={teste}
                readOnly
              />
            </div>

            {/* SUBMIT AND RESET BUTTONS */}
            <div className="flex gap-2 mt-4">
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
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
