import cep from "cep-promise";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
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

import { app } from "../../db/Firebase";
import { customerFullName } from "../../custom";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createStudentValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  CreateStudentValidationZProps,
  CurriculumSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  SearchCurriculumValidationZProps,
  StudentSearchProps,
} from "../../@types";
import {
  buttonWithInput,
  datePickerError,
  datePickerOk,
  divDatePicker,
  divItemsForm,
  divWithDoubleItems,
  divWithDoubleItemsLeft,
  divMasterPage,
  formMaster,
  inputError,
  inputOk,
  inputWithButtonError,
  inputWithButtonOk,
  labelTextError,
  labelTextOk,
  pageTitleH1,
  inputWithButtonDisabled,
  divWithDoubleItemsRight,
  labelTextRight,
  divWithDoubleItemsLeftExtended,
  divWithDoubleItemsRightExtended,
  buttonEditAddress,
  divPhoneMaster,
  divPhoneNumber,
  selectDDDError,
  selectDDDOk,
  inputCheckbox,
  labelCheckbox,
  labelSpan,
  selectError,
  selectOk,
  selectDisabled,
  hrElement,
  divDescriptionCardMasterWrap,
  divDescriptionCurriculumCardItemError,
  divDescriptionCurriculumCardItem,
  labelInputRadio,
  messageP,
  divDetailsAlternativeBgMaster,
  message2xlH1,
  messageLgH1,
  divCheckboxItem,
  divSubmitResetItems,
  buttonSubmit,
  buttonReset,
} from "../../styles/tailwindConstants";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertStudent() {
  // EDITOR / ADMIN STATES
  const [isEditor, setIsEditor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      familyAtSchool: false,
      familyAtSchoolId: "",
      curriculum: "",
      confirmInsert: false,
    }
  );

  // ---------------------------- FAMILY SCHOOL, CLASS, CURRICULUM AND STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //
  // STUDENT DATA
  const [familyStudentData, setFamilyStudentData] = useState({
    studentId: "",
    curriculumId: "",
    schoolId: "",
    schoolClassId: "",
    confirmDelete: false,
  });

  // -------------------------- FAMILY SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL
  const [familySchoolDataArray, setFamilySchoolDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilySchoolSelectedData = (data: SchoolSearchProps[]) => {
    setFamilySchoolDataArray(data);
  };

  // FAMILY SCHOOL SELECTED STATE DATA
  const [familySchoolSelectedData, setFamilySchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET FAMILY SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    if (familyStudentData.schoolId !== "") {
      setFamilySchoolSelectedData(
        familySchoolDataArray!.find(
          ({ id }) => id === familyStudentData.schoolId
        )
      );
    } else {
      setFamilySchoolSelectedData(undefined);
    }
  }, [familyStudentData.schoolId]);
  // -------------------------- END OF FAMILY SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT FAMILY SCHOOL CLASS
  const [familyschoolClassDataArray, setFamilySchoolClassDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilySchoolClassSelectedData = (
    data: SchoolClassSearchProps[]
  ) => {
    setFamilySchoolClassDataArray(data);
  };

  // FAMILY SCHOOL CLASS SELECTED STATE DATA
  const [familySchoolClassSelectedData, setFamilySchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET FAMILY SCHOOL CLASS SELECTED STATE WHEN SELECT FAMILY SCHOOL CLASS
  useEffect(() => {
    if (familyStudentData.schoolClassId !== "") {
      setFamilySchoolClassSelectedData(
        familyschoolClassDataArray!.find(
          ({ id }) => id === familyStudentData.schoolClassId
        )
      );
    } else {
      setFamilySchoolClassSelectedData(undefined);
    }
  }, [familyStudentData.schoolClassId]);
  // -------------------------- END OF FAMILY SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY CURRICULUM DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [familyCurriculumDataArray, setFamilyCurriculumDataArray] =
    useState<CurriculumSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY CURRICULUM SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilyCurriculumSelectedData = (
    data: CurriculumSearchProps[]
  ) => {
    setFamilyCurriculumDataArray(data);
  };

  // FAMILY CURRICULUM SELECTED STATE DATA
  const [familyCurriculumSelectedData, setFamilyCurriculumSelectedData] =
    useState<CurriculumSearchProps>();

  // SET FAMILY CURRICULUM SELECTED STATE WHEN SELECT FAMILY CURRICULUM
  useEffect(() => {
    if (familyStudentData.curriculumId !== "") {
      setFamilyCurriculumSelectedData(
        familyCurriculumDataArray!.find(
          ({ id }) => id === familyStudentData.curriculumId
        )
      );
    } else {
      setFamilyCurriculumSelectedData(undefined);
    }
  }, [familyStudentData.curriculumId]);
  // -------------------------- END OF FAMILY CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- FAMILY STUDENT SELECT STATES AND FUNCTIONS -------------------------- //
  // FAMILY STUDENT DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [familyStudentDataArray, setFamilyStudentDataArray] =
    useState<StudentSearchProps[]>();

  // FUNCTION THAT WORKS WITH FAMILY STUDENT SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleFamilyStudentSelectedData = (data: StudentSearchProps[]) => {
    setFamilyStudentDataArray(data);
  };

  // FAMILY STUDENT SELECTED STATE DATA
  const [familyStudentSelectedData, setFamilyStudentSelectedData] =
    useState<StudentSearchProps>();

  // SET FAMILY STUDENT SELECTED STATE WHEN SELECT FAMILY STUDENT
  useEffect(() => {
    if (familyStudentData.studentId !== "") {
      setFamilyStudentSelectedData(
        familyStudentDataArray!.find(
          ({ id }) => id === familyStudentData.studentId
        )
      );
    } else {
      setFamilyStudentSelectedData(undefined);
    }
  }, [familyStudentData.studentId]);

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER FAMILY SCHOOL SELECT WHEN CHANGE FAMILY SCHOOL
  useEffect(() => {
    if (studentData.familyAtSchool) {
      (
        document.getElementById("familySchoolClassSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("familySchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("familyStudentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      setFamilyStudentData({
        ...familyStudentData,
        schoolClassId: "",
        curriculumId: "",
        studentId: "",
      });
      setStudentData({
        ...studentData,
        confirmInsert: false,
      });
    }
  }, [familyStudentData.schoolId]);

  // RESET ALL UNDER FAMILY SCHOOL CLASS SELECT WHEN CHANGE FAMILY SCHOOL CLASS
  useEffect(() => {
    if (studentData.familyAtSchool) {
      (
        document.getElementById("familySchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("familyStudentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      setFamilyStudentData({
        ...familyStudentData,
        curriculumId: "",
        studentId: "",
      });
      setStudentData({
        ...studentData,
        confirmInsert: false,
      });
    }
  }, [familyStudentData.schoolClassId]);

  // RESET ALL UNDER FAMILY CURRICULUM SELECT WHEN CHANGE FAMILY CURRICULUM
  useEffect(() => {
    if (studentData.familyAtSchool) {
      (
        document.getElementById("familyStudentSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      setFamilyStudentData({
        ...familyStudentData,
        studentId: "",
      });
      setStudentData({
        ...studentData,
        confirmInsert: false,
      });
    }
  }, [familyStudentData.curriculumId]);

  // SET FAMILY STUDENT ID TO STUDENT DATA AND RESET CONFIRM INSERT WHEN CHANGE FAMILY STUDENT
  useEffect(() => {
    setStudentData({
      ...studentData,
      familyAtSchoolId: familyStudentData.studentId,
      confirmInsert: false,
    });
  }, [familyStudentData.studentId]);
  // -------------------------- END OF RESET SELECTS -------------------------- //
  // -------------------------- END OF FAMILY STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

  // ---------------------------- END OF FAMILY SCHOOL, CLASS, CURRICULUM AND STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //

  // ---------------------------- STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //
  // CURRICULUM DATA
  const [curriculumData, setCurriculumData] =
    useState<SearchCurriculumValidationZProps>({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
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
    if (curriculumData.schoolId !== "") {
      setSchoolSelectedData(
        schoolDataArray!.find(({ id }) => id === curriculumData.schoolId)
      );
    } else {
      setSchoolSelectedData(undefined);
    }
  }, [curriculumData.schoolId]);

  // SET SCHOOL NAME WITH SCHOOL SELECTED DATA WHEN SELECT SCHOOL
  useEffect(() => {
    if (schoolSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolName: schoolSelectedData!.name,
      });
    }
  }, [schoolSelectedData]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASS
  const [schoolClassDataArray, setSchoolClassDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolClassSelectedData = (data: SchoolClassSearchProps[]) => {
    setSchoolClassDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [schoolClassSelectedData, setSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setSchoolClassSelectedData(
        schoolClassDataArray!.find(
          ({ id }) => id === curriculumData.schoolClassId
        )
      );
    } else {
      setSchoolClassSelectedData(undefined);
    }
  }, [curriculumData.schoolClassId]);

  // SET SCHOOL CLASS NAME WITH SCHOOL CLASS SELECTED DATA WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (schoolClassSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolClassName: schoolClassSelectedData!.name,
      });
    }
  }, [schoolClassSelectedData]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSE
  const [schoolCourseDataArray, setSchoolCourseDataArray] =
    useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleSchoolCourseSelectedData = (data: SchoolCourseSearchProps[]) => {
    setSchoolCourseDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [schoolCourseSelectedData, setSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setSchoolCourseSelectedData(
        schoolCourseDataArray!.find(
          ({ id }) => id === curriculumData.schoolCourseId
        )
      );
    } else {
      setSchoolCourseSelectedData(undefined);
    }
  }, [curriculumData.schoolCourseId]);

  // SET SCHOOL COURSE NAME WITH SCHOOL COURSE SELECTED DATA WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (schoolCourseSelectedData !== undefined) {
      setCurriculumData({
        ...curriculumData,
        schoolCourseName: schoolCourseSelectedData!.name,
      });
    }
  }, [schoolCourseSelectedData]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULE DATA ARRAY WITH ALL OPTIONS OF SCHEDULES
  const [schedulesDetailsData, setSchedulesDetailsData] = useState([]);

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

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    handleSchedulesDetails();
  }, []);
  // -------------------------- END OF SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF CURRICULUM
  const [curriculumCoursesData, setCurriculumCoursesData] = useState([]);

  // GETTING CURRICULUM DATA
  const handleAvailableCoursesData = async () => {
    if (curriculumData.schoolCourseId === "all") {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", curriculumData.schoolId),
        where("schoolClassId", "==", curriculumData.schoolClassId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      setCurriculumCoursesData(promises);
    } else {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", curriculumData.schoolId),
        where("schoolClassId", "==", curriculumData.schoolClassId),
        where("schoolCourseId", "==", curriculumData.schoolCourseId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      setCurriculumCoursesData(promises);
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    handleAvailableCoursesData();
  }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // -------------------------- RESET SELECTS -------------------------- //
  // RESET ALL UNDER SCHOOL SELECT WHEN CHANGE SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setStudentData({
      ...studentData,
      confirmInsert: false,
    });
  }, [curriculumData.schoolId]);

  // RESET ALL UNDER SCHOOL CLASS SELECT WHEN CHANGE SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumData({
      ...curriculumData,
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setStudentData({
      ...studentData,
      confirmInsert: false,
    });
  }, [curriculumData.schoolClassId]);

  // RESET CONFIRM INSERT WHEN CHANGE SCHOOL COURSE OR CURRICULUM AVAILABLE
  useEffect(() => {
    setStudentData({
      ...studentData,
      confirmInsert: false,
    });
  }, [curriculumData.schoolCourseId, studentData.curriculum]);
  // -------------------------- END OF RESET SELECTS -------------------------- //
  // ---------------------------- END OF STUDENT VARIABLES, STATES AND FUNCTIONS ---------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      familyAtSchool: false,
      familyAtSchoolId: "",
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
      familyAtSchool: false,
      familyAtSchoolId: "",
      curriculum: "",
      confirmInsert: false,
    });
    setCurriculumData({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolCourseSelect") as HTMLSelectElement
    ).selectedIndex = 0;
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
    setValue("familyAtSchool", studentData.familyAtSchool);
    setValue("familyAtSchoolId", studentData.familyAtSchoolId);
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
      errors.familyAtSchool,
      errors.familyAtSchoolId,
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

    // ADD STUDENT FUNCTION
    const addStudent = async () => {
      const commonId = uuidv4();
      const newStudentId = commonId;
      const newStudentRef = doc(db, "students", commonId);
      const curriculumRef = collection(db, "curriculum");
      const q = query(curriculumRef, where("id", "==", data.curriculum));
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.id;
        promises.push(promise);
      });
      try {
        // ADD STUDENT TO CURRICULUM TABLE
        const curriculumId = doc(db, "curriculum", promises[0]);
        await updateDoc(curriculumId, {
          students: arrayUnion(newStudentId),
        });
        try {
          if (data.familyAtSchool) {
            // ADD STUDENT TO DATABASE WITH BROTHER
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
              phone: `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`,
              phoneSecondary: activePhoneSecondary
                ? `+55${data.phoneSecondary.ddd}${data.phoneSecondary.prefix}${data.phoneSecondary.suffix}`
                : "",
              phoneTertiary: activePhoneTertiary
                ? `+55${data.phoneTertiary.ddd}${data.phoneTertiary.prefix}${data.phoneTertiary.suffix}`
                : "",
              responsible: data.responsible,
              financialResponsible: data.financialResponsible,
              curriculum: [data.curriculum],
              familyAtSchool: [data.familyAtSchoolId],
              timestamp: serverTimestamp(),
            });
            try {
              const brotherId = doc(db, "students", data.familyAtSchoolId!);
              await updateDoc(brotherId, {
                familyAtSchool: arrayUnion(newStudentId),
              });
              toast.success(`Aluno ${data.name} criado com sucesso! 👌`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              });
              (
                document.getElementsByTagName(
                  "select"
                ) as unknown as HTMLSelectElement
              ).selectedIndex = 0;
              resetForm();
              setIsSubmitting(false);
            } catch (error) {
              console.log("ESSE É O ERROR", error);
              toast.error(
                `O aluno foi criado, mas ocorreu um erro ao adicioná-lo ao registro do seu irmão. Contate o suporte... 🤯`,
                {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                }
              );
              (
                document.getElementsByTagName(
                  "select"
                ) as unknown as HTMLSelectElement
              ).selectedIndex = 0;
              resetForm();
              setIsSubmitting(false);
            }
          } else {
            // ADD STUDENT TO DATABASE WITHOUT BROTHER
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
              phone: `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`,
              phoneSecondary: activePhoneSecondary
                ? `+55${data.phoneSecondary.ddd}${data.phoneSecondary.prefix}${data.phoneSecondary.suffix}`
                : "",
              phoneTertiary: activePhoneTertiary
                ? `+55${data.phoneTertiary.ddd}${data.phoneTertiary.prefix}${data.phoneTertiary.suffix}`
                : "",
              responsible: data.responsible,
              financialResponsible: data.financialResponsible,
              curriculum: [data.curriculum],
              familyAtSchool: [],
              timestamp: serverTimestamp(),
            });
            toast.success(`Aluno ${data.name} criado com sucesso! 👌`, {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            (
              document.getElementsByTagName(
                "select"
              ) as unknown as HTMLSelectElement
            ).selectedIndex = 0;
            resetForm();
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
      }
    };

    // CHEKING VALID SECONDARY PHONE
    if (studentData.activePhoneSecondary) {
      if (studentData.phoneSecondary.ddd === "DDD") {
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
    if (studentData.activePhoneTertiary) {
      if (studentData.phoneTertiary.ddd === "DDD") {
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

    // CHECK FAMILY AT SCHOOL DETAILS
    if (studentData.familyAtSchool) {
      if (
        familyStudentData.schoolId === "" ||
        familyStudentData.schoolClassId === "" ||
        familyStudentData.curriculumId === "" ||
        familyStudentData.studentId === ""
      ) {
        setIsSubmitting(false);
        return toast.error(
          `Por favor, verifique os dados do parente que já estuda na escola... ☑️`,
          {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        );
      }
    }

    // CHECK SCHOOL CLASS PICK
    if (curriculumData.schoolClassId === "") {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, verifique as opções de Colégio e Turma... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

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
        addStudent();
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
      <h1 className={pageTitleH1}>Adicionar Aluno</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleAddStudent)} className={formMaster}>
        {/* NAME */}
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
                ? "É necessário inserir o nome completo do aluno"
                : "Insira o nome completo do aluno"
            }
            className={errors.name ? inputError : inputOk}
            value={studentData.name}
            onChange={(e) => {
              setStudentData({ ...studentData, name: e.target.value });
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
            value={studentData.email}
            onChange={(e) => {
              setStudentData({ ...studentData, email: e.target.value });
            }}
          />
        </div>

        {/* BIRTHDATE */}
        <div className={divItemsForm}>
          <label
            htmlFor="birthDate"
            className={errors.birthDate ? labelTextError : labelTextOk}
          >
            Data de Nascimento:{" "}
          </label>
          <div className={divDatePicker}>
            <DatePicker
              placeholder={
                errors.birthDate
                  ? "É necessário selecionar uma Data"
                  : "Selecione uma Data"
              }
              currentDate={new DateObject().subtract(3, "years")}
              inputClass={errors.birthDate ? datePickerError : datePickerOk}
              maxDate={new DateObject().subtract(3, "years")}
              editable={false}
              format="DD/MM/YYYY"
              onChange={(e: DateObject) => {
                e !== null
                  ? setStudentData({
                      ...studentData,
                      birthDate: `${e.month}/${e.day}/${e.year}`,
                    })
                  : null;
              }}
            />
          </div>
        </div>

        {/* ADDRESS */}
        {/* CEP */}
        <div className={divItemsForm}>
          <label
            htmlFor="addressCep"
            className={errors.address?.cep ? labelTextError : labelTextOk}
          >
            CEP:{" "}
          </label>
          <div className={divWithDoubleItems}>
            <div className={divWithDoubleItemsLeft}>
              <input
                type="text"
                name="addressCep"
                pattern="^[+ 0-9]{8}$"
                maxLength={8}
                placeholder={
                  errors.address?.cep || cepError
                    ? "É necessário inserir um CEP"
                    : "Insira o CEP"
                }
                className={
                  errors.address?.cep || cepError
                    ? inputWithButtonError
                    : inputWithButtonOk
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
              className={buttonWithInput}
              onClick={() => {
                getCep(studentData.address.cep);
              }}
            >
              {cepSubmitting ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* STREET AND NUMBER */}
        <div className={`${divItemsForm} items-center`}>
          <label
            htmlFor="addressStreet"
            className={errors.address?.street ? labelTextError : labelTextOk}
          >
            Rua:{" "}
          </label>
          <div className={divWithDoubleItems}>
            <div className={`flex ${divWithDoubleItemsLeft}`}>
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
            <div className={divWithDoubleItemsRight}>
              <label htmlFor="addressNumber" className={labelTextRight}>
                Nº:
              </label>
              <input
                type="text"
                name="addressNumber"
                placeholder={errors.address?.number ? "Número" : "Número"}
                className={
                  errors.address?.number
                    ? inputWithButtonError
                    : inputWithButtonOk
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
        <div className={divItemsForm}>
          <label
            htmlFor="addressNeighborhood"
            className={
              errors.address?.neighborhood ? labelTextError : labelTextOk
            }
          >
            Bairro:{" "}
          </label>
          <div className={`${divWithDoubleItems} items-center`}>
            <div className={divWithDoubleItemsLeftExtended}>
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
            <div className={divWithDoubleItemsRightExtended}>
              <label htmlFor="addressComplement" className={labelTextRight}>
                Complemento:
              </label>
              <input
                type="text"
                name="addressComplement"
                placeholder={"Apto | Bloco"}
                className={
                  errors.address ? inputWithButtonError : inputWithButtonOk
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
        <div className={divItemsForm}>
          <label
            htmlFor="addressCity"
            className={errors.address?.city ? labelTextError : labelTextOk}
          >
            Cidade:{" "}
          </label>
          <div className={`${divWithDoubleItems} items-center`}>
            <div className={`flex ${divWithDoubleItemsLeft}`}>
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
            <div className={divWithDoubleItemsRight}>
              <label htmlFor="addressState" className={labelTextRight}>
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
        <div className={divItemsForm}>
          <label htmlFor="editAddressButton" className={labelTextOk}></label>
          <button
            type="button"
            name="editAddressButton"
            disabled={editAddress}
            className={buttonEditAddress}
            onClick={() => setEditAddress(true)}
          >
            {editAddress
              ? "Insira o Endereço manualmente, ou busque o CEP novamente"
              : "Editar Endereço"}
          </button>
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
                    ? inputWithButtonError
                    : inputWithButtonOk
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
                    ? inputWithButtonError
                    : inputWithButtonOk
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
            <div className={divWithDoubleItemsRight}></div>
          </div>
        </div>

        {/* PHONE SECONDARY */}
        <div className={divItemsForm}>
          <label
            htmlFor="phoneSecondary"
            className={errors.phoneSecondary ? labelTextError : labelTextOk}
          >
            Telefone 2:{" "}
          </label>
          <div className={divPhoneMaster}>
            <div className={divPhoneNumber}>
              {/** NUMBER SECONDARY DDD */}
              <select
                id="phoneSecondaryDDD"
                disabled={!studentData.activePhoneSecondary}
                defaultValue={"DDD"}
                className={
                  errors.phoneSecondary?.ddd ? selectDDDError : selectDDDOk
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
            <div className={divWithDoubleItemsRight}>
              <input
                type="checkbox"
                name="activePhoneSecondary"
                className={inputCheckbox}
                checked={activePhoneSecondary}
                onChange={() => {
                  setActivePhoneSecondary(!activePhoneSecondary);
                  setStudentData({
                    ...studentData,
                    activePhoneSecondary: !activePhoneSecondary,
                  });
                }}
              />
              <label htmlFor="activePhoneSecondary" className={labelCheckbox}>
                Incluir
              </label>
            </div>
          </div>
        </div>

        {/* PHONE TERTIARY */}
        <div className={divItemsForm}>
          <label
            htmlFor="phoneTertiary"
            className={errors.phoneTertiary ? labelTextError : labelTextOk}
          >
            Telefone 3:{" "}
          </label>
          <div className={divPhoneMaster}>
            <div className={divPhoneNumber}>
              {/** NUMBER TERTIARY DDD */}
              <select
                id="phoneTertiaryDDD"
                disabled={!studentData.activePhoneTertiary}
                defaultValue={"DDD"}
                className={
                  errors.phoneTertiary?.ddd ? selectDDDError : selectDDDOk
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
                      ? inputWithButtonError
                      : inputWithButtonOk
                    : inputWithButtonDisabled
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
            <div className={divWithDoubleItemsRight}>
              <input
                type="checkbox"
                name="activePhoneTertiary"
                className={inputCheckbox}
                checked={activePhoneTertiary}
                onChange={() => {
                  setActivePhoneTertiary(!activePhoneTertiary);
                  setStudentData({
                    ...studentData,
                    activePhoneTertiary: !activePhoneTertiary,
                  });
                }}
              />
              <label htmlFor="activePhoneTertiary" className={labelCheckbox}>
                Incluir
              </label>
            </div>
          </div>
        </div>

        {/* RESPONSIBLE */}
        <div className={divItemsForm}>
          <label
            htmlFor="responsible"
            className={errors.responsible ? labelTextError : labelTextOk}
          >
            Responsável{" "}
            <span className={labelSpan}>
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
            className={errors.responsible ? inputError : inputOk}
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
        <div className={divItemsForm}>
          <label
            htmlFor="financialResponsible"
            className={
              errors.financialResponsible ? labelTextError : labelTextOk
            }
          >
            Responsável Financeiro{" "}
            <span className={labelSpan}>(responsável pela cobrança)</span>:{" "}
          </label>
          <input
            type="text"
            name="financialResponsible"
            placeholder={
              errors.financialResponsible
                ? "É necessário inserir o Nome completo do Responsável Financeiro"
                : "Insira o nome completo do Responsável Financeiro"
            }
            className={errors.financialResponsible ? inputError : inputOk}
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
        <div className={divItemsForm}>
          <label
            htmlFor="schoolSelect"
            className={errors.curriculum ? labelTextError : labelTextOk}
          >
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className={errors.curriculum ? selectError : selectOk}
            name="schoolSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolId: e.target.value,
              });
              setStudentData({ ...studentData, curriculum: "" });
            }}
          >
            <SelectOptions
              returnId
              dataType="schools"
              handleData={handleSchoolSelectedData}
            />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
        <div className={divItemsForm}>
          <label
            htmlFor="schoolClassSelect"
            className={errors.curriculum ? labelTextError : labelTextOk}
          >
            Selecione a Turma:{" "}
          </label>
          <select
            id="schoolClassSelect"
            disabled={curriculumData.schoolId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumData.schoolId
                ? errors.curriculum
                  ? selectError
                  : selectOk
                : selectDisabled
            }
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolClassId: e.target.value,
              });
              setStudentData({ ...studentData, curriculum: "" });
            }}
          >
            <SelectOptions
              returnId
              dataType="schoolClasses"
              schoolId={curriculumData.schoolId}
              handleData={handleSchoolClassSelectedData}
            />
          </select>
        </div>

        {/* SCHOOL COURSE SELECT */}
        <div className={divItemsForm}>
          <label
            htmlFor="schoolCourseSelect"
            className={errors.curriculum ? labelTextError : labelTextOk}
          >
            Selecione a Modalidade:{" "}
          </label>
          <select
            id="schoolCourseSelect"
            disabled={curriculumData.schoolClassId ? false : true}
            defaultValue={" -- select an option -- "}
            className={
              curriculumData.schoolClassId
                ? errors.curriculum
                  ? selectError
                  : selectOk
                : selectDisabled
            }
            name="schoolCourseSelect"
            onChange={(e) => {
              setCurriculumData({
                ...curriculumData,
                schoolCourseId: e.target.value,
              });
              setStudentData({ ...studentData, curriculum: "" });
            }}
          >
            <SelectOptions
              returnId
              dataType="schoolCourses"
              handleData={handleSchoolCourseSelectedData}
            />
            <option value={"all"}>Todas as Modalidades</option>
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        {curriculumData.schoolId &&
        curriculumData.schoolClassId &&
        curriculumData.schoolCourseId ? (
          curriculumCoursesData.length !== 0 ? (
            <>
              <h1 className={pageTitleH1}>
                {schoolSelectedData?.name} - {schoolClassSelectedData?.name} -{" "}
                {curriculumData.schoolCourseId === "all"
                  ? "Todas as Modalidades"
                  : schoolCourseSelectedData?.name}
                :
              </h1>
              <hr className={hrElement} />
              <div className={divDescriptionCardMasterWrap}>
                {curriculumCoursesData.map((c: any) => (
                  <div
                    className={
                      errors.curriculum
                        ? divDescriptionCurriculumCardItemError
                        : divDescriptionCurriculumCardItem
                    }
                    key={c.id}
                  >
                    <input
                      key={c.id}
                      type="radio"
                      id={c.id}
                      name="curriculumRadio"
                      value={c.id}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          curriculum: e.target.value,
                        });
                      }}
                    />
                    <label
                      key={c.id}
                      htmlFor="curriculumRadio"
                      className={labelInputRadio}
                    >
                      {schoolSelectedData?.name === "Colégio Bernoulli" ? (
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
          ) : (
            <>
              <h1 className={pageTitleH1}>
                {schoolSelectedData?.name} - {schoolClassSelectedData?.name} -{" "}
                {curriculumData.schoolCourseId === "all"
                  ? "Todas as Modalidades"
                  : schoolCourseSelectedData?.name}
                :
              </h1>
              <hr className={hrElement} />
              <h1 className={message2xlH1}>
                Nenhuma vaga disponível com as opções selecionadas, tente
                novamente.
              </h1>
            </>
          )
        ) : (
          <p className={messageP}>
            Selecione um colégio e uma turma para ver as modalidades
            disponíveis.
          </p>
        )}

        {/* FAMILY AT SCHOOL QUESTION */}
        <div className={divItemsForm}>
          <label
            htmlFor="familySchoolSelectQuestion"
            className={errors.familyAtSchool ? labelTextError : labelTextOk}
          >
            Algum parente estuda na escola?:{" "}
          </label>
          <select
            id="familySchoolSelectQuestion"
            defaultValue={"Não"}
            className={errors.familyAtSchool ? selectError : selectOk}
            name="familySchoolSelectQuestion"
            onChange={() => {
              setStudentData({
                ...studentData,
                familyAtSchool: !studentData.familyAtSchool,
                confirmInsert: false,
              });
              setFamilyStudentData({
                ...familyStudentData,
                schoolId: "",
                schoolClassId: "",
                curriculumId: "",
                studentId: "",
              });
            }}
          >
            <option value={"Não"}>Não</option>
            <option value={"Sim"}>Sim</option>
          </select>
        </div>

        {studentData.familyAtSchool ? (
          <div className={divDetailsAlternativeBgMaster}>
            {/* FAMILY AT SCHOOL TITLE */}
            <h1 className={messageLgH1}>
              Atenção: a seguir insira os dados do aluno que já estuda na{" "}
              {customerFullName}, e é parente de {studentData.name}:
            </h1>

            {/* FAMILY SCHOOL SELECT */}
            <div className={divItemsForm}>
              <label
                htmlFor="familySchoolSelect"
                className={
                  errors.familyAtSchoolId ? labelTextError : labelTextOk
                }
              >
                Selecione a Escola do Parente:{" "}
              </label>
              <select
                id="familySchoolSelect"
                defaultValue={" -- select an option -- "}
                disabled={isSubmitting}
                className={errors.familyAtSchoolId ? selectError : selectOk}
                name="familySchoolSelect"
                onChange={(e) => {
                  setFamilyStudentData({
                    ...familyStudentData,
                    schoolId: e.target.value,
                  });
                  setStudentData({
                    ...studentData,
                    confirmInsert: false,
                  });
                }}
              >
                <SelectOptions
                  returnId
                  dataType="schools"
                  handleData={handleFamilySchoolSelectedData}
                />
              </select>
            </div>

            {/* FAMILY SCHOOL CLASS SELECT */}
            <div className={divItemsForm}>
              <label
                htmlFor="familySchoolClassSelect"
                className={
                  errors.familyAtSchoolId ? labelTextError : labelTextOk
                }
              >
                Selecione a Turma do Parente:{" "}
              </label>
              <select
                id="familySchoolClassSelect"
                defaultValue={" -- select an option -- "}
                disabled={!familyStudentData.schoolId ? true : isSubmitting}
                className={
                  familyStudentData.schoolId
                    ? errors.familyAtSchoolId
                      ? selectError
                      : selectOk
                    : selectDisabled
                }
                name="familySchoolClassSelect"
                onChange={(e) => {
                  setFamilyStudentData({
                    ...familyStudentData,
                    schoolClassId: e.target.value,
                  });
                  setStudentData({
                    ...studentData,
                    confirmInsert: false,
                  });
                }}
              >
                {familyStudentData.schoolId ? (
                  <SelectOptions
                    returnId
                    dataType="schoolClasses"
                    schoolId={familyStudentData.schoolId}
                    handleData={handleFamilySchoolClassSelectedData}
                  />
                ) : (
                  <option disabled value={" -- select an option -- "}>
                    {" "}
                    -- Selecione uma escola para ver as turmas disponíveis --{" "}
                  </option>
                )}
              </select>
            </div>

            {/* FAMILY SCHOOL COURSE SELECT */}
            <div className={divItemsForm}>
              <label
                htmlFor="familySchoolCourseSelect"
                className={
                  errors.familyAtSchoolId ? labelTextError : labelTextOk
                }
              >
                Selecione a Modalidade do Parente:{" "}
              </label>
              <select
                id="familySchoolCourseSelect"
                defaultValue={" -- select an option -- "}
                disabled={
                  !familyStudentData.schoolClassId ? true : isSubmitting
                }
                className={
                  familyStudentData.schoolClassId
                    ? errors.familyAtSchoolId
                      ? selectError
                      : selectOk
                    : selectDisabled
                }
                name="familySchoolCourseSelect"
                onChange={(e) => {
                  setFamilyStudentData({
                    ...familyStudentData,
                    curriculumId: e.target.value,
                  });
                  setStudentData({
                    ...studentData,
                    confirmInsert: false,
                  });
                }}
              >
                {familyStudentData.schoolClassId ? (
                  <SelectOptions
                    returnId
                    dataType="curriculum"
                    displaySchoolCourseAndSchedule
                    schoolId={familyStudentData.schoolId}
                    schoolClassId={familyStudentData.schoolClassId}
                    handleData={handleFamilyCurriculumSelectedData}
                  />
                ) : (
                  <option value={" -- select an option -- "}>
                    {" "}
                    -- Selecione uma Turma para ver as modalidades disponíveis
                    --{" "}
                  </option>
                )}
              </select>
            </div>

            {/* STUDENT SELECT */}
            <div className="flex gap-2 items-center pb-2">
              <label
                htmlFor="familyStudentSelect"
                className={
                  errors.familyAtSchoolId ? labelTextError : labelTextOk
                }
              >
                Selecione o Parente:{" "}
              </label>
              <select
                id="familyStudentSelect"
                defaultValue={" -- select an option -- "}
                disabled={!familyStudentData.curriculumId ? true : isSubmitting}
                className={
                  familyStudentData.curriculumId
                    ? errors.familyAtSchoolId
                      ? selectError
                      : selectOk
                    : selectDisabled
                }
                name="familyStudentSelect"
                onChange={(e) => {
                  setFamilyStudentData({
                    ...familyStudentData,
                    studentId: e.target.value,
                    confirmDelete: false,
                  });
                }}
              >
                {familyStudentData.curriculumId ? (
                  <SelectOptions
                    returnId
                    dataType="students"
                    schoolId={familyStudentData.schoolId}
                    schoolClassId={familyStudentData.schoolClassId}
                    curriculumId={familyStudentData.curriculumId}
                    handleData={handleFamilyStudentSelectedData}
                  />
                ) : (
                  <option disabled value={" -- select an option -- "}>
                    {" "}
                    -- Selecione Colégio, Turma e Modalidade para ver os alunos
                    disponíveis --{" "}
                  </option>
                )}
              </select>
            </div>
          </div>
        ) : null}

        {/** CHECKBOX CONFIRM INSERT */}
        <div className={divCheckboxItem}>
          <input
            type="checkbox"
            name="confirmInsert"
            className={inputCheckbox}
            checked={studentData.confirmInsert}
            onChange={() => {
              setStudentData({
                ...studentData,
                confirmInsert: !studentData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className={labelCheckbox}>
            {studentData.name
              ? `Confirmar criação de ${studentData.name}`
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
