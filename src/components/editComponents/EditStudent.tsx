import cep from "cep-promise";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { editStudentValidationSchema } from "../../@types/zodValidation";
import { BrazilianStateSelectOptions } from "../formComponents/BrazilianStateSelectOptions";
import {
  ClassDaySearchProps,
  CurriculumSearchProps,
  EditStudentValidationZProps,
  ExcludeCurriculumProps,
  ExcludeFamilyProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  SearchCurriculumValidationZProps,
  StudentSearchProps,
  SubCollectionDetailsProps,
  SubCollectionFamilyDetailsProps,
  SubCollectionFamilyProps,
  SubCollectionProps,
} from "../../@types";
import { months, weekDays } from "../../custom";

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
      curriculumDetails: [],
      familyDetails: [],
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
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

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
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

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CLASS CHANGE
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
  // CURRICULUM DATA ARRAY WITH ALL OPTIONS OF SELECT CURRICULUM
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
    useState<SubCollectionProps[]>();

  // FUNCTION THAT WORKS WITH STUDENT SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleStudentSelectedData = (data: SubCollectionProps[]) => {
    setStudentsDataArray(data);
  };

  // STUDENT SELECTED STATE DATA
  const [studentSelectedData, setStudentSelectedData] =
    useState<StudentSearchProps>();

  // HAVE CURRICULUM STATE
  const [haveCurriculum, setHaveCurriculum] = useState(false);

  // INCLUDE / EXLUDE CURRICULUM STATES
  const [excludeCurriculum, setExcludeCurriculum] = useState<
    ExcludeCurriculumProps[]
  >([]);

  // NEW STUDENT CURRICULUM STATE ARRAY
  const [newStudentCurriculumArray, setNewStudentCurriculumArray] = useState<
    (string | undefined)[]
  >([]);

  // INCLUDE / EXLUDE CURRICULUM STATES
  const [excludeExperimentalCurriculum, setExcludeExperimentalCurriculum] =
    useState<ExcludeCurriculumProps[]>([]);

  // NEW STUDENT CURRICULUM STATE ARRAY
  const [
    newStudentExperimentalCurriculumArray,
    setNewStudentExperimentalCurriculumArray,
  ] = useState<(string | undefined)[]>([]);

  // IF STUDENT HAVE CURRICULUM SET STATE AND SHOW INPUTS
  useEffect(() => {
    if (studentEditData.curriculumDetails !== undefined) {
      if (studentEditData.curriculumDetails.length > 0) {
        setHaveCurriculum(true);
        for (
          let index = 0;
          index < studentEditData.curriculumDetails.length;
          index++
        ) {
          if (studentEditData.curriculumDetails[index]! !== undefined) {
            if (studentEditData.curriculumDetails[index]!.isExperimental) {
              setExcludeExperimentalCurriculum(
                (excludeExperimentalCurriculum) => [
                  ...excludeExperimentalCurriculum,
                  {
                    exclude: false,
                    id: studentEditData.curriculumDetails![index]!.id,
                    name: studentEditData.curriculumDetails![index]!.name,
                    isExperimental:
                      studentEditData.curriculumDetails![index]!.isExperimental,
                    date: studentEditData.curriculumDetails![index]!.date,
                  },
                ]
              );
            } else {
              setExcludeCurriculum((excludeCurriculum) => [
                ...excludeCurriculum,
                {
                  exclude: false,
                  id: studentEditData.curriculumDetails![index]!.id,
                  name: studentEditData.curriculumDetails![index]!.name,
                  isExperimental:
                    studentEditData.curriculumDetails![index]!.isExperimental,
                  date: studentEditData.curriculumDetails![index]!.date,
                },
              ]);
            }
          }
        }
      } else {
        setHaveCurriculum(false);
      }
    }
  }, [studentEditData.curriculumDetails]);

  // CHANGE STUDENT CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
  function handleIncludeExcludeCurriculum(
    index: number,
    data: ExcludeCurriculumProps
  ) {
    if (data.exclude) {
      setNewStudentCurriculumArray(
        newStudentCurriculumArray.filter((id) => id !== data.id)
      );
    } else {
      setNewStudentCurriculumArray((newStudentCurriculumArray) => [
        ...newStudentCurriculumArray,
        data.id,
      ]);
    }

    const newExcludeCurriculum = excludeCurriculum.map((curriculum, i) => {
      if (i === index) {
        return {
          exclude: data.exclude,
          id: data.id,
          name: data.name,
          date: data.date,
          isExperimental: data.isExperimental,
        };
      } else {
        // THE REST HAVEN'T CHANGED
        return curriculum;
      }
    });
    setExcludeCurriculum(newExcludeCurriculum);
  }

  // CHANGE STUDENT EXPERIMENTAL CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
  function handleIncludeExcludeExperimentalCurriculum(
    index: number,
    data: ExcludeCurriculumProps
  ) {
    if (data.exclude) {
      setNewStudentExperimentalCurriculumArray(
        newStudentExperimentalCurriculumArray.filter((id) => id !== data.id)
      );
    } else {
      setNewStudentExperimentalCurriculumArray(
        (newStudentExperimentalCurriculumArray) => [
          ...newStudentExperimentalCurriculumArray,
          data.id,
        ]
      );
    }
    const newExcludeExperimentalCurriculum = excludeExperimentalCurriculum.map(
      (curriculum, i) => {
        if (i === index) {
          return {
            exclude: data.exclude,
            id: data.id,
            name: data.name,
            date: data.date,
            isExperimental: data.isExperimental,
          };
        } else {
          // THE REST HAVEN'T CHANGED
          return curriculum;
        }
      }
    );
    setExcludeExperimentalCurriculum(newExcludeExperimentalCurriculum);
  }

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
      studentsDataArray?.map(async (data: SubCollectionProps) => {
        if (data.id === studentData.studentId) {
          const queryStudent = query(
            collection(db, "students"),
            where("id", "==", data.id)
          );
          const getStudentFullData = await getDocs(queryStudent);
          getStudentFullData.forEach(async (doc: any) => {
            const dataStudent: StudentSearchProps = doc.data();
            if (dataStudent.id === studentData.studentId) {
              setStudentSelectedData(dataStudent);
            }
          });
        }
      });
    }
  }, [studentData.studentId]);

  // STUDENT FAMILY DETAILS STATE
  const [studentFamilyDetails, setStudentFamilyDetails] = useState<
    SubCollectionFamilyDetailsProps[]
  >([]);

  // STUDENT CURRICULUM DETAILS STATE
  const [studentCurriculumDetails, setStudentCurriculumDetails] = useState<
    SubCollectionDetailsProps[]
  >([]);

  // SET STUDENT EDIT ARRAYS
  const handleStudentFamilyDetails = async () => {
    // SET STUDENT FAMILY DETAILS
    const familyQuery = query(
      collection(db, `/students/${studentData.studentId}/studentFamilyAtSchool`)
    );
    const getFamily = await getDocs(familyQuery);
    getFamily.forEach((doc: any) => {
      const detailsData: SubCollectionFamilyProps = doc.data();
      setStudentFamilyDetails(detailsData.detailsArray);
    });
  };

  const handleStudentCurriculumDetails = async () => {
    // SET STUDENT CURRICULUM DETAILS
    const curriculumQuery = query(
      collection(db, `/students/${studentData.studentId}/studentCurriculum`)
    );
    const getCurriculum = await getDocs(curriculumQuery);
    getCurriculum.forEach((doc: any) => {
      const detailsData: SubCollectionProps = doc.data();
      detailsData.detailsArray.map(
        (curriculumDetail: SubCollectionDetailsProps) => {
          setStudentCurriculumDetails((studentCurriculumDetails) => [
            ...studentCurriculumDetails,
            curriculumDetail,
          ]);
        }
      );
    });
  };

  const handleStudentExperimentalCurriculumDetails = async () => {
    // SET STUDENT EXPERIMENTAL CURRICULUM DETAILS
    const experimentalCurriculumQuery = query(
      collection(
        db,
        `/students/${studentData.studentId}/studentExperimentalCurriculum`
      )
    );
    const getExperimentalCurriculum = await getDocs(
      experimentalCurriculumQuery
    );
    getExperimentalCurriculum.forEach((doc: any) => {
      const detailsData: SubCollectionProps = doc.data();
      detailsData.detailsArray.map(
        (curriculumDetail: SubCollectionDetailsProps) => {
          setStudentCurriculumDetails((studentCurriculumDetails) => [
            ...studentCurriculumDetails,
            curriculumDetail,
          ]);
        }
      );
    });
  };

  // SET STUDENT FAMILY ARRAY DETAILS WHEN STUDENT IS SELECTED
  useEffect(() => {
    if (studentData.studentId !== "") {
      handleStudentFamilyDetails();
      handleStudentCurriculumDetails();
      handleStudentExperimentalCurriculumDetails();
    }
  }, [studentData.studentId]);

  // SET STUDENT EDIT WHEN SELECT STUDENT
  useEffect(() => {
    if (studentSelectedData !== undefined) {
      setDateToString(
        //@ts-ignore
        studentSelectedData.birthDate.toDate().toLocaleDateString()
      );
      // SET STUDENT EDIT ALL DATA
      setStudentEditData({
        ...studentEditData,
        id: studentData.studentId,
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
        familyDetails: studentFamilyDetails,
        curriculumDetails: studentCurriculumDetails,
      });
    }
  }, [studentSelectedData]);
  // -------------------------- END OF STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- STUDENT EDIT STATES AND FUNCTIONS -------------------------- //
  // DATE TO STRING STATE
  const [dateToString, setDateToString] = useState("");

  // DATE SUBMIT STRING STATE
  const [dateSubmitToString, setDateSubmitToString] = useState("");

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

  // HAVE FAMILY STATE
  const [haveFamily, setHaveFamily] = useState(false);

  // GET BROTHER NAME TO PUT ON FORM
  useEffect(() => {
    if (studentEditData.familyDetails !== undefined) {
      if (studentEditData.familyDetails.length > 0) {
        setHaveFamily(true);
        for (
          let index = 0;
          index < studentEditData.familyDetails.length;
          index++
        ) {
          setExcludeFamily((excludeFamily) => [
            ...excludeFamily,
            {
              exclude: false,
              id: studentEditData.familyDetails![index]!.id,
              name: studentEditData.familyDetails![index]!.name,
            },
          ]);
        }
      } else {
        setHaveFamily(false);
      }
    }
  }, [studentEditData.familyDetails]);

  // INCLUDE / EXLUDE FAMILY STATES
  const [excludeFamily, setExcludeFamily] = useState<ExcludeFamilyProps[]>([]);

  // NEW STUDENT FAMILY STATE ARRAY
  const [newStudentFamilyArray, setNewStudentFamilyArray] = useState<
    (string | undefined)[]
  >([]);

  // CHANGE STUDENT FAMILY (INCLUDE / EXCLUDE) FUNCTION
  function handleIncludeExcludeFamily(index: number, data: ExcludeFamilyProps) {
    if (data.exclude) {
      setNewStudentFamilyArray(
        newStudentFamilyArray.filter((id) => id !== data.id)
      );
    } else {
      setNewStudentFamilyArray((newStudentFamilyArray) => [
        ...newStudentFamilyArray,
        data.id,
      ]);
    }

    const newExcludeFamily = excludeFamily.map((family, i) => {
      if (i === index) {
        return { exclude: data.exclude, id: data.id, name: data.name };
      } else {
        // THE REST HAVEN'T CHANGED
        return family;
      }
    });
    setExcludeFamily(newExcludeFamily);
  }
  // -------------------------- END OF STUDENT EDIT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW FAMILY STATES AND FUNCTIONS -------------------------- //
  // NEW STUDENT DATA STATE
  const [newStudentData, setNewStudentData] = useState({
    confirmAddFamily: false,
    confirmAddCurriculum: false,
    confirmAddExperimentalCurriculum: false,
    curriculum: "",
    curriculumName: "",
    curriculumClassDayId: "",
    curriculumInitialDate: "",
    experimentalCurriculum: "",
    experimentalCurriculumName: "",
    experimentalCurriculumClassDayId: "",
    experimentalCurriculumInitialDate: "",
    familyId: "",
    familyName: "",
    newFamilySchoolId: "",
    newFamilySchoolClassId: "",
    newFamilyCurriculumId: "",
  });

  // NEW FAMILY DATA ARRAY WITH ALL OPTIONS OF SELECT NEW FAMILY
  const [newFamilyDataArray, setNewFamilyDataArray] =
    useState<StudentSearchProps[]>();

  // FUNCTION THAT WORKS WITH NEW FAMILY SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewFamilyDetailsData = (data: StudentSearchProps[]) => {
    setNewFamilyDataArray(data);
  };

  // NEW FAMILY SELECTED STATE DATA
  const [newFamilySelectedData, setNewFamilySelectedData] =
    useState<StudentSearchProps>();

  // SET NEW FAMILY SELECTED STATE WHEN SELECT NEW FAMILY
  useEffect(() => {
    if (curriculumData.schoolId !== "") {
      setNewFamilySelectedData(
        newFamilyDataArray!.find(({ id }) => id === newStudentData.familyId)
      );
    } else {
      setNewSchoolSelectedData(undefined);
    }
  }, [newStudentData.familyId]);

  // SET FAMILY NAME WHEN SELECTED NEW FAMILY
  useEffect(() => {
    if (newFamilySelectedData !== undefined) {
      setNewStudentData({
        ...newStudentData,
        familyName: newFamilySelectedData.name,
      });
    }
  }, [newFamilySelectedData]);

  // RESET ADD NEW FAMILY CONFIRMATION WHEN NEW FAMILY CHANGE
  useEffect(() => {
    setNewStudentData({ ...newStudentData, confirmAddFamily: false });
  }, [newStudentData.familyId]);
  // -------------------------- END OF NEW FAMILY STATES AND FUNCTIONS -------------------------- //

  // ---------------------------------------- ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //
  // EXPERIMENTAL CURRICULUM DATA
  const [experimentalCurriculumData, setExperimentalCurriculumData] =
    useState<SearchCurriculumValidationZProps>({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });

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
  const [newClassError, setNewClassError] = useState(false);

  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOLS
  const [newSchoolsDataArray, setNewSchoolsDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewSchoolSelectedData = (data: SchoolSearchProps[]) => {
    setNewSchoolsDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [newSchoolSelectedData, setNewSchoolSelectedData] =
    useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setNewSchoolClassSelectedData(undefined);
    if (curriculumData.schoolId !== "") {
      setNewSchoolSelectedData(
        newSchoolsDataArray!.find(({ id }) => id === curriculumData.schoolId)
      );
    } else {
      setNewSchoolSelectedData(undefined);
    }
  }, [curriculumData.schoolId]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    if (studentEditData.addCurriculum) {
      (
        document.getElementById("newSchoolClassSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
    }
  }, [curriculumData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASSES
  const [newSchoolClassesDataArray, setNewSchoolClassesDataArray] =
    useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewSchoolClassSelectedData = (data: SchoolClassSearchProps[]) => {
    setNewSchoolClassesDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [newSchoolClassSelectedData, setNewSchoolClassSelectedData] =
    useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (curriculumData.schoolClassId !== "") {
      setNewSchoolClassSelectedData(
        newSchoolClassesDataArray!.find(
          ({ id }) => id === curriculumData.schoolClassId
        )
      );
    } else {
      setNewSchoolClassSelectedData(undefined);
    }
  }, [curriculumData.schoolClassId]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    if (studentEditData.addCurriculum) {
      (
        document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
      ).selectedIndex = 0;
      handleNewAvailableCoursesData();
    }
  }, [curriculumData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSES
  const [newSchoolCoursesDataArray, setNewSchoolCoursesDataArray] =
    useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewSchoolCourseSelectedData = (
    data: SchoolCourseSearchProps[]
  ) => {
    setNewSchoolCoursesDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [newSchoolCourseSelectedData, setNewSchoolCourseSelectedData] =
    useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (curriculumData.schoolCourseId !== "") {
      setNewSchoolCourseSelectedData(
        newSchoolCoursesDataArray!.find(
          ({ id }) => id === curriculumData.schoolCourseId
        )
      );
    } else {
      setNewSchoolCourseSelectedData(undefined);
    }
  }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHEDULES DETAILS ARRAY STATE
  const [newSchedulesDetailsData, setNewSchedulesDetailsData] = useState([]);

  // GETTING SCHEDULES DATA
  const handleNewSchedulesDetails = async () => {
    const q = query(collection(db, "schedules"));
    const querySnapshot = await getDocs(q);
    const promises: any = [];
    querySnapshot.forEach((doc) => {
      const promise = doc.data();
      promises.push(promise);
    });
    setNewSchedulesDetailsData(promises);
  };

  // GETTING SCHEDULES DETAILS
  useEffect(() => {
    handleNewSchedulesDetails();
  }, []);
  // -------------------------- END OF SCHEDULES SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DETAILS ARRAY STATE
  const [newCurriculumCoursesData, setNewCurriculumCoursesData] = useState([]);

  // GETTING CURRICULUM DATA
  const handleNewAvailableCoursesData = async () => {
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
      setNewCurriculumCoursesData(promises);
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
      setNewCurriculumCoursesData(promises);
    }
  };
  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleNewAvailableCoursesData();
  }, [curriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
  // NEW CURRICULUM CLASS DAY SELECTED STATE DATA
  const [classDayCurriculumSelectedData, setClassDayCurriculumSelectedData] =
    useState<ClassDaySearchProps[]>();

  // GET CLASS DAY FULL DATA WHEN HAVE CURRICULUM SELECTED DATA
  useEffect(() => {
    setIndexDaysArray([]);
    const handleNewCurriculumClassDayFullData = async () => {
      if (newStudentData.curriculumClassDayId !== "") {
        const q = query(
          collection(db, "classDays"),
          where("id", "==", newStudentData.curriculumClassDayId)
        );
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          const promises: any = [];
          querySnapShot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
          setClassDayCurriculumSelectedData(promises);
        });
      } else {
        setClassDayCurriculumSelectedData(undefined);
      }
    };
    handleNewCurriculumClassDayFullData();
  }, [newStudentData.curriculumClassDayId]);

  // CREATING INDEX TO DAYS FO USE ON DATE PICKER
  const indexDays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const [indexDaysArray, setIndexDaysArray] = useState<number[]>([]);

  useEffect(() => {
    if (classDayCurriculumSelectedData !== undefined) {
      if (!classDayCurriculumSelectedData[0].sunday) {
        indexDaysArray.push(indexDays.sunday);
      }
      if (!classDayCurriculumSelectedData[0].monday) {
        indexDaysArray.push(indexDays.monday);
      }
      if (!classDayCurriculumSelectedData[0].tuesday) {
        indexDaysArray.push(indexDays.tuesday);
      }
      if (!classDayCurriculumSelectedData[0].wednesday) {
        indexDaysArray.push(indexDays.wednesday);
      }
      if (!classDayCurriculumSelectedData[0].thursday) {
        indexDaysArray.push(indexDays.thursday);
      }
      if (!classDayCurriculumSelectedData[0].friday) {
        indexDaysArray.push(indexDays.friday);
      }
      if (!classDayCurriculumSelectedData[0].saturday) {
        indexDaysArray.push(indexDays.saturday);
      }
    } else {
      //@ts-ignore
      setIndexDaysArray(undefined);
    }
  }, [classDayCurriculumSelectedData]);

  // -------------------------- END OF NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

  // -------------------------- NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
  // NEW EXPERIMENTAL CURRICULUM CLASS DAY SELECTED STATE DATA
  const [
    classDayExperimentalCurriculumSelectedData,
    setClassDayExperimentalCurriculumSelectedData,
  ] = useState<ClassDaySearchProps[]>();

  // GET CLASS DAY FULL DATA WHEN HAVE EXPERIMENTAL CURRICULUM SELECTED DATA
  useEffect(() => {
    setExperimentalIndexDaysArray([]);
    const handleNewExperimentalCurriculumClassDayFullData = async () => {
      if (newStudentData.experimentalCurriculumClassDayId !== "") {
        const q = query(
          collection(db, "classDays"),
          where("id", "==", newStudentData.experimentalCurriculumClassDayId)
        );
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
          const promises: any = [];
          querySnapShot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
          setClassDayExperimentalCurriculumSelectedData(promises);
        });
      } else {
        setClassDayExperimentalCurriculumSelectedData(undefined);
      }
    };
    handleNewExperimentalCurriculumClassDayFullData();
  }, [newStudentData.experimentalCurriculumClassDayId]);

  const [experimentalIndexDaysArray, setExperimentalIndexDaysArray] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (classDayExperimentalCurriculumSelectedData !== undefined) {
      if (!classDayExperimentalCurriculumSelectedData[0].sunday) {
        experimentalIndexDaysArray.push(indexDays.sunday);
      }
      if (!classDayExperimentalCurriculumSelectedData[0].monday) {
        experimentalIndexDaysArray.push(indexDays.monday);
      }
      if (!classDayExperimentalCurriculumSelectedData[0].tuesday) {
        experimentalIndexDaysArray.push(indexDays.tuesday);
      }
      if (!classDayExperimentalCurriculumSelectedData[0].wednesday) {
        experimentalIndexDaysArray.push(indexDays.wednesday);
      }
      if (!classDayExperimentalCurriculumSelectedData[0].thursday) {
        experimentalIndexDaysArray.push(indexDays.thursday);
      }
      if (!classDayExperimentalCurriculumSelectedData[0].friday) {
        experimentalIndexDaysArray.push(indexDays.friday);
      }
      if (!classDayExperimentalCurriculumSelectedData[0].saturday) {
        experimentalIndexDaysArray.push(indexDays.saturday);
      }
    } else {
      //@ts-ignore
      setExperimentalIndexDaysArray(undefined);
    }
  }, [classDayExperimentalCurriculumSelectedData]);

  // -------------------------- END OF NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  const [experimentalClassError, setExperimentalClassError] = useState(false);

  // SCHOOL DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOLS
  const [newExperimentalSchoolsDataArray, setNewExperimentalSchoolsDataArray] =
    useState<SchoolSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewExperimentalSchoolSelectedData = (
    data: SchoolSearchProps[]
  ) => {
    setNewExperimentalSchoolsDataArray(data);
  };

  // SCHOOL SELECTED STATE DATA
  const [
    newExperimentalSchoolSelectedData,
    setNewExperimentalSchoolSelectedData,
  ] = useState<SchoolSearchProps>();

  // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
  useEffect(() => {
    setNewExperimentalSchoolClassSelectedData(undefined);
    if (experimentalCurriculumData.schoolId !== "") {
      setNewExperimentalSchoolSelectedData(
        newExperimentalSchoolsDataArray!.find(
          ({ id }) => id === experimentalCurriculumData.schoolId
        )
      );
    } else {
      setNewExperimentalSchoolSelectedData(undefined);
    }
  }, [experimentalCurriculumData.schoolId]);

  // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
  useEffect(() => {
    if (studentEditData.addExperimentalCurriculum) {
      (
        document.getElementById(
          "newExperimentalSchoolClassSelect"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
      (
        document.getElementById(
          "newExperimentalSchoolCourseSelect"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
    }
  }, [experimentalCurriculumData.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL CLASS DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL CLASSES
  const [
    newExperimentalSchoolClassesDataArray,
    setNewExperimentalSchoolClassesDataArray,
  ] = useState<SchoolClassSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL CLASS SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewExperimentalSchoolClassSelectedData = (
    data: SchoolClassSearchProps[]
  ) => {
    setNewExperimentalSchoolClassesDataArray(data);
  };

  // SCHOOL CLASS SELECTED STATE DATA
  const [
    newExperimentalSchoolClassSelectedData,
    setNewExperimentalSchoolClassSelectedData,
  ] = useState<SchoolClassSearchProps>();

  // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    if (experimentalCurriculumData.schoolClassId !== "") {
      setNewExperimentalSchoolClassSelectedData(
        newExperimentalSchoolClassesDataArray!.find(
          ({ id }) => id === experimentalCurriculumData.schoolClassId
        )
      );
    } else {
      setNewExperimentalSchoolClassSelectedData(undefined);
    }
  }, [experimentalCurriculumData.schoolClassId]);

  // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
  useEffect(() => {
    if (studentEditData.addExperimentalCurriculum) {
      (
        document.getElementById(
          "newExperimentalSchoolCourseSelect"
        ) as HTMLSelectElement
      ).selectedIndex = 0;
      handleNewAvailableExperimentalCoursesData();
    }
  }, [experimentalCurriculumData.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
  // SCHOOL COURSE DATA ARRAY WITH ALL OPTIONS OF SELECT SCHOOL COURSES
  const [
    newExperimentalSchoolCoursesDataArray,
    setExperimentalNewSchoolCoursesDataArray,
  ] = useState<SchoolCourseSearchProps[]>();

  // FUNCTION THAT WORKS WITH SCHOOL COURSE SELECTOPTIONS COMPONENT FUNCTION "HANDLE DATA"
  const handleNewExperimentalSchoolCourseSelectedData = (
    data: SchoolCourseSearchProps[]
  ) => {
    setExperimentalNewSchoolCoursesDataArray(data);
  };

  // SCHOOL COURSE SELECTED STATE DATA
  const [
    newExperimentalSchoolCourseSelectedData,
    setNewExperimentalSchoolCourseSelectedData,
  ] = useState<SchoolCourseSearchProps>();

  // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
  useEffect(() => {
    if (experimentalCurriculumData.schoolCourseId !== "") {
      setNewExperimentalSchoolCourseSelectedData(
        newExperimentalSchoolCoursesDataArray!.find(
          ({ id }) => id === experimentalCurriculumData.schoolCourseId
        )
      );
    } else {
      setNewExperimentalSchoolCourseSelectedData(undefined);
    }
  }, [experimentalCurriculumData.schoolCourseId]);
  // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
  // CURRICULUM DETAILS ARRAY STATE
  const [
    newExperimentalCurriculumCoursesData,
    setNewExperimentalCurriculumCoursesData,
  ] = useState([]);

  // GETTING CURRICULUM DATA
  const handleNewAvailableExperimentalCoursesData = async () => {
    if (experimentalCurriculumData.schoolCourseId === "all") {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", experimentalCurriculumData.schoolId),
        where("schoolClassId", "==", experimentalCurriculumData.schoolClassId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      setNewExperimentalCurriculumCoursesData(promises);
    } else {
      const q = query(
        collection(db, "curriculum"),
        where("schoolId", "==", experimentalCurriculumData.schoolId),
        where("schoolClassId", "==", experimentalCurriculumData.schoolClassId),
        where(
          "schoolCourseId",
          "==",
          experimentalCurriculumData.schoolCourseId
        ),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const promises: any = [];
      querySnapshot.forEach((doc) => {
        const promise = doc.data();
        promises.push(promise);
      });
      setNewExperimentalCurriculumCoursesData(promises);
    }
  };

  // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
  useEffect(() => {
    handleNewAvailableExperimentalCoursesData();
  }, [experimentalCurriculumData.schoolCourseId]);
  // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

  // SET SELECTS INDEX WHEN ARE CHANGES
  // WHEN ADD FAMILY CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      setNewStudentData({
        ...newStudentData,
        familyId: "",
        newFamilySchoolId: "",
        newFamilySchoolClassId: "",
        newFamilyCurriculumId: "",
      });
      if (studentEditData.addFamily) {
        (
          document.getElementById("newFamilySchoolSelect") as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilySchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [studentEditData.addFamily]);

  // WHEN ADD CURRICULUM CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      setNewStudentData({
        ...newStudentData,
        curriculum: "",
        curriculumClassDayId: "",
        curriculumInitialDate: "",
        curriculumName: "",
        confirmAddCurriculum: false,
      });
      if (studentEditData.addCurriculum) {
        (
          document.getElementById("newSchoolSelect") as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newSchoolClassSelect") as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [studentEditData.addCurriculum]);

  // WHEN ADD EXPERIMENTAL CURRICULUM CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      setNewStudentData({
        ...newStudentData,
        experimentalCurriculum: "",
        experimentalCurriculumClassDayId: "",
        experimentalCurriculumInitialDate: "",
        experimentalCurriculumName: "",
        confirmAddExperimentalCurriculum: false,
      });
      if (studentEditData.addExperimentalCurriculum) {
        (
          document.getElementById(
            "newExperimentalSchoolSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newExperimentalSchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newExperimentalSchoolCourseSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [studentEditData.addExperimentalCurriculum]);

  // WHEN NEW FAMILY CURRICULUM SCHOOL ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById(
            "newFamilySchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilySchoolId]);

  // WHEN NEW FAMILY SCHOOL ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById(
            "newFamilySchoolClassSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilySchoolId]);

  // WHEN NEW FAMILY SCHOOL CLASS ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById(
            "newFamilyCurriculumSelect"
          ) as HTMLSelectElement
        ).selectedIndex = 0;
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilySchoolClassId]);

  // WHEN NEW FAMILY CURRICULUM ID CHANGE
  useEffect(() => {
    if (studentSelectedData) {
      if (studentEditData.addFamily) {
        (
          document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
        ).selectedIndex = 0;
      }
    }
  }, [newStudentData.newFamilyCurriculumId]);
  // ---------------------------------------- END OF ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //

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
      curriculumDetails: [],
      familyDetails: [],
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
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
      curriculumDetails: [],
      familyDetails: [],
      addCurriculum: false,
      addExperimentalCurriculum: false,
      addFamily: false,
    });
    setStudentData({
      schoolId: "",
      schoolClassId: "",
      curriculumId: "",
      studentId: "",
    });
    setNewStudentData({
      confirmAddFamily: false,
      confirmAddCurriculum: false,
      confirmAddExperimentalCurriculum: false,
      curriculum: "",
      curriculumName: "",
      curriculumClassDayId: "",
      curriculumInitialDate: "",
      experimentalCurriculum: "",
      experimentalCurriculumName: "",
      experimentalCurriculumClassDayId: "",
      experimentalCurriculumInitialDate: "",
      familyId: "",
      familyName: "",
      newFamilySchoolId: "",
      newFamilySchoolClassId: "",
      newFamilyCurriculumId: "",
    });
    setCurriculumData({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setExperimentalCurriculumData({
      schoolId: "",
      schoolName: "",
      schoolClassId: "",
      schoolClassName: "",
      schoolCourseId: "",
      schoolCourseName: "",
    });
    setExcludeCurriculum([]);
    setExcludeExperimentalCurriculum([]);
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("id", studentEditData.id);
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
    setValue("curriculumDetails", studentEditData.curriculumDetails);
    setValue("familyDetails", studentEditData.familyDetails);
    setValue("addCurriculum", studentEditData.addCurriculum);
    setValue(
      "addExperimentalCurriculum",
      studentEditData.addExperimentalCurriculum
    );
    setValue("addFamily", studentEditData.addFamily);
  }, [studentEditData, dateToString]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [
      errors.id,
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
      errors.familyDetails,
      errors.curriculumDetails,
      errors.addCurriculum,
      errors.addExperimentalCurriculum,
      errors.addFamily,
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
console.log(studentEditData)
  // SUBMIT DATA FUNCTION
  const handleEditStudent: SubmitHandler<EditStudentValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);
    // CHEKING IF EXPERIMENTAL CLASS DATE WAS PICKED
    if (
      newStudentData.confirmAddExperimentalCurriculum &&
      newStudentData.experimentalCurriculumInitialDate === ""
    ) {
      return (
        setIsSubmitting(false),
        setExperimentalClassError(true),
        toast.error("Escolha a data da Aula Experimental... ❕", {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      setExperimentalClassError(false);
    }

    // CHEKING IF CURRICULUM INITIAL CLASS DATE WAS PICKED
    if (
      newStudentData.confirmAddCurriculum &&
      newStudentData.curriculumInitialDate === ""
    ) {
      return (
        setIsSubmitting(false),
        setNewClassError(true),
        toast.error("Escolha a data de início na nova modalidade... ❕", {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        })
      );
    } else {
      setNewClassError(false);
    }

    // CHECK IF ADD EXPERIMENTAL CURRICULUM
    if (
      studentEditData.addExperimentalCurriculum &&
      !newStudentData.confirmAddExperimentalCurriculum
    ) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Selecione uma nova Aula Experimental para incluir ou desmarque a opção "Adicionar Aula Experimental"...... ❕`,
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
      // CHECK IF EXPERIMENTAL CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
      const checkExistentExperimentalCurriculum = [];
      studentEditData.curriculumDetails!.map((curriculumDetail) => {
        if (
          curriculumDetail!.id === newStudentData.experimentalCurriculum &&
          curriculumDetail!.isExperimental
        ) {
          checkExistentExperimentalCurriculum.push(curriculumDetail!.id);
        }
      });
      if (checkExistentExperimentalCurriculum.length > 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Aluno já fez uma Aula Experimental na modalidade selecionada. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
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
      // CHECK IF STUDENT IS TRYING TO ADD EXPERIMENTAL CLASS INTO A COURSE THAT IS ALREADY ENROLLED
      const checkExistentCurriculum = [];
      studentEditData.curriculumDetails!.map((curriculumDetail) => {
        if (
          curriculumDetail!.id === newStudentData.curriculum &&
          !curriculumDetail!.isExperimental
        ) {
          checkExistentCurriculum.push(curriculumDetail!.id);
        }
      });
      if (checkExistentCurriculum.length > 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Não é possível agendar uma aula experimental para uma modalidade a qual o Aluno já está matriculado. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
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

    // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS EXCLUDED
    const experimentalCurriculumLength = [];
    studentEditData.curriculumDetails!.map((curriculumDetail) => {
      if (curriculumDetail!.isExperimental) {
        experimentalCurriculumLength.push(curriculumDetail!.id);
      }
    });
    if (
      newStudentExperimentalCurriculumArray.length !==
      experimentalCurriculumLength.length
    ) {
      excludeExperimentalCurriculum.map(async (curriculumToExclude) => {
        if (curriculumToExclude.exclude && curriculumToExclude.isExperimental) {
          // UPDATE STUDENT (DELETE EXPERIMENTAL CURRICULUM)
          await updateDoc(
            doc(
              db,
              `students/${data.id}/studentExperimentalCurriculum`,
              data.id
            ),
            {
              idsArray: arrayRemove(curriculumToExclude.id),
              detailsArray: arrayRemove({
                date: curriculumToExclude.date,
                id: curriculumToExclude.id,
                isExperimental: curriculumToExclude.isExperimental,
                name: curriculumToExclude.name,
              }),
            }
          );
        }
      });
    }

    // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS INCLUDED
    if (studentEditData.addExperimentalCurriculum) {
      const addNewExperimentalCurriculum = async () => {
        // UPDATE STUDENT (INSERT EXPERIMENTAL CURRICULUM)
        await updateDoc(
          doc(db, `students/${data.id}/studentExperimentalCurriculum`, data.id),
          {
            idsArray: arrayUnion(newStudentData.experimentalCurriculum),
            detailsArray: arrayUnion({
              date: Timestamp.fromDate(
                new Date(newStudentData.experimentalCurriculumInitialDate)
              ),
              id: newStudentData.experimentalCurriculum,
              isExperimental: true,
              name: newStudentData.experimentalCurriculumName,
            }),
          }
        );
      };
      addNewExperimentalCurriculum();
    }

    // CHECK IF ADD CURRICULUM
    if (studentEditData.addCurriculum && !newStudentData.confirmAddCurriculum) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
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
      // CHECK IF CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
      const checkExistentCurriculum = [];
      studentEditData.curriculumDetails!.map((curriculumDetail) => {
        if (
          curriculumDetail!.id === newStudentData.curriculum &&
          !curriculumDetail!.isExperimental
        ) {
          checkExistentCurriculum.push(curriculumDetail!.id);
        }
      });
      if (checkExistentCurriculum.length > 0) {
        return (
          setIsSubmitting(false),
          toast.error(
            `Aluno já matriculado na modalidade selecionada. Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
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

    // CHECK IF SOME CURRICULUM WAS EXCLUDED
    const curriculumLength = [];
    studentEditData.curriculumDetails!.map((curriculumDetail) => {
      if (!curriculumDetail!.isExperimental) {
        curriculumLength.push(curriculumDetail!.id);
      }
    });
    if (newStudentCurriculumArray.length !== curriculumLength.length) {
      excludeCurriculum.map(async (curriculumToExclude) => {
        if (
          curriculumToExclude.exclude &&
          !curriculumToExclude.isExperimental
        ) {
          // UPDATE STUDENT (DELETE CURRICULUM)
          await updateDoc(
            doc(db, `students/${data.id}/studentCurriculum`, data.id),
            {
              idsArray: arrayRemove(curriculumToExclude.id),
              detailsArray: arrayRemove({
                date: curriculumToExclude.date,
                id: curriculumToExclude.id,
                isExperimental: curriculumToExclude.isExperimental,
                name: curriculumToExclude.name,
              }),
            }
          );
        }
      });
    }

    // CHECK IF SOME CURRICULUM WAS INCLUDED
    if (studentEditData.addCurriculum) {
      const addNewCurriculum = async () => {
        // UPDATE STUDENT (INSERT CURRICULUM)
        await updateDoc(
          doc(db, `students/${data.id}/studentCurriculum`, data.id),
          {
            idsArray: arrayUnion(newStudentData.curriculum),
            detailsArray: arrayUnion({
              date: Timestamp.fromDate(
                new Date(newStudentData.curriculumInitialDate)
              ),
              id: newStudentData.curriculum,
              isExperimental: false,
              name: newStudentData.curriculumName,
            }),
          }
        );
      };
      addNewCurriculum();
    }

    // CHECK IF ADD FAMILY
    if (studentEditData.addFamily && !newStudentData.familyId) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Selecione um familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
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
    // CHECK CONFIRM ADD NEW FAMILY MEMBER
    else if (!newStudentData.confirmAddFamily) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Confirme a adição do familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
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

    // CHECK IF NEW FAMILY MEMBER ALREADY EXISTS ON STUDENT DATABASE
    const checkExistentFamily = studentEditData.familyDetails!.map(
      (familyDetail) => {
        if (familyDetail!.id === newStudentData.familyId) {
          return true;
        } else false;
      }
    );
    if (checkExistentFamily) {
      return (
        setIsSubmitting(false),
        toast.error(
          `Familiar já consta na ficha do aluno. Selecione um novo familiar para incluir ou desmarque a opção "Adicionar Familiar"...... ❕`,
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

    // CHECK IF SOME FAMILY WAS EXCLUDED
    if (
      newStudentFamilyArray.length !== studentEditData.familyDetails!.length
    ) {
      excludeFamily.map(async (familyToExclude) => {
        if (familyToExclude.exclude) {
          // UPDATE STUDENT (DELETE FAMILY FROM STUDENT DATABASE)
          await updateDoc(
            doc(db, `students/${data.id}/studentFamilyAtSchool`, data.id),
            {
              idsArray: arrayRemove(familyToExclude.id),
              detailsArray: arrayRemove({
                id: familyToExclude.id,
                name: familyToExclude.name,
              }),
            }
          );
          // UPDATE FAMILY (DELETE STUDENT FROM FAMILY DATABASE)
          await updateDoc(
            doc(
              db,
              `students/${familyToExclude.id}/studentFamilyAtSchool`,
              familyToExclude.id
            ),
            {
              idsArray: arrayRemove(data.id),
              detailsArray: arrayRemove({
                id: data.id,
                name: data.name,
              }),
            }
          );
        }
      });
    }

    // CHECK IF SOME FAMILY WAS INCLUDED
    if (studentEditData.addFamily) {
      const addNewFamily = async () => {
        // UPDATE STUDENT (INSERT FAMILY TO STUDENT DATABASE)
        await updateDoc(
          doc(db, `students/${data.id}/studentFamilyAtSchool`, data.id),
          {
            idsArray: arrayUnion(newStudentData.familyId),
            detailsArray: arrayUnion({
              id: newStudentData.familyId,
              name: newStudentData.familyName,
            }),
          }
        );
        // UPDATE FAMILY (INSERT STUDENT TO FAMILY DATABASE)
        await updateDoc(
          doc(
            db,
            `students/${newStudentData.familyId}/studentFamilyAtSchool`,
            newStudentData.familyId
          ),
          {
            idsArray: arrayUnion(data.id),
            detailsArray: arrayUnion({
              id: data.id,
              name: data.name,
            }),
          }
        );
      };
      addNewFamily();
    }

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
    const q = query(studentRef, where("id", "==", data.id));
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
        // STUDENT DATA OBJECT
        const updateData = {
          name: data.name,
          email: data.email,
          birthDate: Timestamp.fromDate(new Date(dateSubmitToString)),
          "address.street": data.address.street,
          "address.number": data.address.number,
          "address.complement": data.address.complement,
          "address.neighborhood": data.address.neighborhood,
          "address.city": data.address.city,
          "address.state": data.address.state,
          "address.cep": data.address.cep,
          phone: `+55${data.phone.ddd}${data.phone.prefix}${data.phone.suffix}`,
          phoneSecondary:
            data.phoneSecondary.ddd === "DDD"
              ? ""
              : `+55${data.phoneSecondary.ddd}${data.phoneSecondary.prefix}${data.phoneSecondary.suffix}`,
          phoneTertiary:
            data.phoneTertiary.ddd === "DDD"
              ? ""
              : `+55${data.phoneTertiary.ddd}${data.phoneTertiary.prefix}${data.phoneTertiary.suffix}`,
          responsible: data.responsible,
          financialResponsible: data.financialResponsible,
        };
        // EDIT STUDENT FUNCTION
        const editStudent = async () => {
          try {
            await updateDoc(doc(db, "students", data.id), updateData);
            resetForm();
            toast.success(`${data.name} alterado com sucesso! 👌`, {
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
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">
        {isEdit ? `Editando ${studentEditData.name}` : "Editar Aluno"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(handleEditStudent)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="schoolSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
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
              dataType="schools"
              handleData={handleSchoolSelectedData}
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
                : "w-1/4 text-right"
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
              dataType="schoolClasses"
              handleData={handleSchoolClassSelectedData}
              schoolId={studentData.schoolId}
            />
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="curriculumSelect"
            className={
              errors.name
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
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
              dataType="curriculum"
              displaySchoolCourseAndSchedule
              handleData={handleCurriculumSelectedData}
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
                : "w-1/4 text-right"
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
              setExcludeCurriculum([]);
              setIsSelected(true);
            }}
          >
            <SelectOptions
              returnId
              dataType="allStudents"
              handleData={handleStudentSelectedData}
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
                className="w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
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
                    : "w-1/4 text-right"
                }
              >
                Data de Nascimento:{" "}
              </label>
              <div className="flex w-3/4">
                <DatePicker
                  months={months}
                  weekDays={weekDays}
                  placeholder={
                    errors.birthDate
                      ? "É necessário selecionar uma Data"
                      : "Selecione uma Data"
                  }
                  currentDate={new DateObject().subtract(3, "years")}
                  containerClassName="w-full"
                  style={{ width: "100%" }}
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
                    : "w-1/4 text-right"
                }
              >
                CEP:{" "}
              </label>
              <div className="flex w-3/4 gap-2">
                <div className="w-10/12">
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
                    : "w-1/4 text-right"
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
                    : "w-1/4 text-right"
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
                    : "w-1/4 text-right"
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
                    : "w-1/4 text-right"
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
                  <label htmlFor="activePhoneSecondary" className="text-sm">
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
                    : "w-1/4 text-right"
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
                  <label htmlFor="activePhoneTertiary" className="text-sm">
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
                    : "w-1/4 text-right"
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
                    : "w-1/4 text-right"
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

            {/* EXISTENT EXPERIMENTAL CURRICULUM */}
            {haveCurriculum
              ? excludeExperimentalCurriculum.map((curriculum, index) => (
                  <div className="flex gap-2 items-center" key={curriculum.id}>
                    <label
                      htmlFor="existentExperimentalCurriculumName"
                      className="w-1/4 text-right"
                    >
                      Aula Experimental {index + 1}:{" "}
                    </label>
                    <div className="flex w-3/4 gap-2">
                      <div className="w-10/12">
                        <input
                          type="text"
                          name="existentExperimentalCurriculumName"
                          disabled={isSubmitting ? true : curriculum.exclude}
                          className={
                            curriculum.exclude
                              ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          value={curriculum.name}
                          readOnly
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          curriculum.exclude
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          const data: ExcludeCurriculumProps = {
                            exclude: !curriculum.exclude,
                            id: curriculum.id,
                            date: curriculum.date,
                            isExperimental: curriculum.isExperimental,
                            name: curriculum.name,
                          };
                          handleIncludeExcludeExperimentalCurriculum(
                            index,
                            data
                          );
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : curriculum.exclude
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    </div>
                  </div>
                ))
              : null}

            {/** CHECKBOX ADD EXPERIMENTAL CURRICULUM */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addExperimentalCurriculum"
                className={
                  errors.addExperimentalCurriculum
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Adicionar Aula Experimental ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="addExperimentalCurriculum"
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={studentEditData.addExperimentalCurriculum}
                  onChange={() => {
                    setStudentEditData({
                      ...studentEditData,
                      addExperimentalCurriculum:
                        !studentEditData.addExperimentalCurriculum,
                    });
                  }}
                />
              </div>
            </div>

            {/** ADD EXPERIMENTAL CURRICULUM */}
            {studentEditData.addExperimentalCurriculum ? (
              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                {/** ADD EXPERIMENTAL CURRICULUM SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Atenção: você está adicionando uma nova aula experimental para{" "}
                  {studentEditData.name}:
                </h1>

                {/* SCHOOL SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newExperimentalSchoolSelect"
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Escola:{" "}
                  </label>
                  <select
                    id="newExperimentalSchoolSelect"
                    defaultValue={" -- select an option -- "}
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="newExperimentalSchoolSelect"
                    onChange={(e) => {
                      setExperimentalCurriculumData({
                        ...experimentalCurriculumData,
                        schoolId: e.target.value,
                        schoolClassId: "",
                        schoolCourseId: "",
                      });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schools"
                      handleData={handleNewExperimentalSchoolSelectedData}
                    />
                  </select>
                </div>

                {/* SCHOOL CLASS SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newExperimentalSchoolClassSelect"
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Turma:{" "}
                  </label>
                  <select
                    id="newExperimentalSchoolClassSelect"
                    disabled={
                      experimentalCurriculumData.schoolId ? false : true
                    }
                    defaultValue={" -- select an option -- "}
                    className={
                      experimentalCurriculumData.schoolId
                        ? errors.addExperimentalCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newExperimentalSchoolClassSelect"
                    onChange={(e) => {
                      setExperimentalCurriculumData({
                        ...experimentalCurriculumData,
                        schoolClassId: e.target.value,
                        schoolCourseId: "",
                      });
                      setNewStudentData({
                        ...newStudentData,
                        experimentalCurriculum: "",
                      });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schoolClasses"
                      schoolId={experimentalCurriculumData.schoolId}
                      handleData={handleNewExperimentalSchoolClassSelectedData}
                    />
                  </select>
                </div>

                {/* SCHOOL COURSE SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newExperimentalSchoolCourseSelect"
                    className={
                      errors.addExperimentalCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Modalidade:{" "}
                  </label>
                  <select
                    id="newExperimentalSchoolCourseSelect"
                    disabled={
                      experimentalCurriculumData.schoolClassId ? false : true
                    }
                    defaultValue={" -- select an option -- "}
                    className={
                      experimentalCurriculumData.schoolClassId
                        ? errors.addExperimentalCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newExperimentalSchoolCourseSelect"
                    onChange={(e) => {
                      setExperimentalCurriculumData({
                        ...experimentalCurriculumData,
                        schoolCourseId: e.target.value,
                      });
                      setNewStudentData({
                        ...newStudentData,
                        experimentalCurriculum: "",
                      });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schoolCourses"
                      handleData={handleNewExperimentalSchoolCourseSelectedData}
                    />
                    <option value={"all"}>Todas as Modalidades</option>
                  </select>
                </div>

                {/* EXPERIMENTAL CURRICULUM SELECT */}
                {experimentalCurriculumData.schoolId &&
                experimentalCurriculumData.schoolClassId &&
                experimentalCurriculumData.schoolCourseId ? (
                  <>
                    {/* EXPERIMENTAL CURRICULUM CARD DETAILS SECTION TITLE */}
                    <h1 className="font-bold text-2xl py-4">
                      {newExperimentalSchoolSelectedData?.name} -{" "}
                      {newExperimentalSchoolClassSelectedData?.name} -{" "}
                      {experimentalCurriculumData.schoolCourseId === "all"
                        ? "Todas as Modalidades"
                        : newExperimentalSchoolCourseSelectedData?.name}
                      :
                    </h1>

                    {/* SEPARATOR */}
                    <hr className="pb-4" />

                    {newExperimentalCurriculumCoursesData.length !== 0 ? (
                      <>
                        {/* EXPERIMENTAL CURRICULUM CARD DETAILS */}
                        <div className="flex flex-wrap gap-4 justify-center">
                          {newExperimentalCurriculumCoursesData.map(
                            (curriculum: any) => (
                              <div
                                className={
                                  errors.curriculumDetails
                                    ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                                    : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                                }
                                key={curriculum.id}
                              >
                                <input
                                  type="radio"
                                  id={curriculum.id}
                                  name="experimentalCurriculumCardDetails"
                                  className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                  value={curriculum.id}
                                  onChange={(e) => {
                                    setNewStudentData({
                                      ...newStudentData,
                                      experimentalCurriculum: e.target.value,
                                      experimentalCurriculumName:
                                        curriculum.name,
                                      experimentalCurriculumClassDayId:
                                        curriculum.classDayId,
                                    });
                                  }}
                                />
                                <label
                                  htmlFor="experimentalCurriculumCardDetails"
                                  className="flex flex-col gap-4"
                                >
                                  {experimentalCurriculumData.schoolName ===
                                  "Colégio Bernoulli" ? (
                                    <p>Turma: {curriculum.schoolClass}</p>
                                  ) : null}
                                  <p>Modalidade: {curriculum.schoolCourse}</p>
                                  {newSchedulesDetailsData.map((details: any) =>
                                    details.name === curriculum.schedule
                                      ? `Horário: De ${details.classStart.slice(
                                          0,
                                          2
                                        )}h${
                                          details.classStart.slice(3, 5) ===
                                          "00"
                                            ? ""
                                            : details.classStart.slice(3, 5) +
                                              "min"
                                        } a ${details.classEnd.slice(0, 2)}h${
                                          details.classEnd.slice(3, 5) === "00"
                                            ? ""
                                            : details.classEnd.slice(3, 5) +
                                              "min"
                                        }`
                                      : null
                                  )}
                                  <p>Dias: {curriculum.classDay}</p>
                                  <p>Professor: {curriculum.teacher}</p>
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* EXPERIMENTAL CURRICULUM EMPTY DESCRIPTION */}
                        <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
                          Nenhuma vaga disponível com as opções selecionadas,
                          tente novamente.
                        </h1>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* EXPERIMENTAL CURRICULUM PRE-SELECT DESCRIPTION */}
                    <p className="text-red-600 dark:text-yellow-500">
                      Selecione um colégio e uma turma para ver as modalidades
                      disponíveis.
                    </p>
                  </>
                )}

                {classDayExperimentalCurriculumSelectedData &&
                experimentalIndexDaysArray !== undefined ? (
                  <>
                    {/* EXPERIMENTAL/INITIAL DAY */}
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="experimentalClassPick"
                        className={
                          experimentalClassError
                            ? "w-1/4 text-right text-red-500 dark:text-red-400"
                            : "w-1/4 text-right"
                        }
                      >
                        Escolha o dia da aula experimental:
                      </label>
                      <div className="flex w-3/4">
                        <DatePicker
                          months={months}
                          weekDays={weekDays}
                          placeholder={
                            experimentalClassError
                              ? "É necessário selecionar uma Data"
                              : "Selecione uma Data"
                          }
                          currentDate={new DateObject()}
                          inputClass={
                            experimentalClassError
                              ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          minDate={new DateObject().add(1, "day")}
                          mapDays={({ date }) => {
                            let isWeekend = experimentalIndexDaysArray.includes(
                              date.weekDay.index
                            );

                            if (isWeekend)
                              return {
                                disabled: true,
                                style: { color: "#ccc" },
                                title: "Aula não disponível neste dia",
                              };
                          }}
                          editable={false}
                          format="DD/MM/YYYY"
                          onChange={(e: DateObject) => {
                            e !== null
                              ? setNewStudentData({
                                  ...newStudentData,
                                  experimentalCurriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
                                })
                              : null;
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {/** CHECKBOX CONFIRM INSERT NEW EXPERIMENTAL CURRICULUM */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmAddExperimentalCurriculum"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={newStudentData.confirmAddExperimentalCurriculum}
                    onChange={() => {
                      setNewStudentData({
                        ...newStudentData,
                        confirmAddExperimentalCurriculum:
                          !newStudentData.confirmAddExperimentalCurriculum,
                      });
                    }}
                  />
                  <label
                    htmlFor="confirmAddExperimentalCurriculum"
                    className="text-sm"
                  >
                    Confirmar inclusão da Aula Experimental
                  </label>
                </div>
              </div>
            ) : null}

            {/* EXISTENT CURRICULUM */}
            {haveCurriculum
              ? excludeCurriculum.map((curriculum, index) => (
                  <div className="flex gap-2 items-center" key={curriculum.id}>
                    <label
                      htmlFor="existentCurriculumName"
                      className="w-1/4 text-right"
                    >
                      Aula {index + 1}:{" "}
                    </label>
                    <div className="flex w-3/4 gap-2">
                      <div className="w-10/12">
                        <input
                          type="text"
                          name="existentCurriculumName"
                          disabled={isSubmitting ? true : curriculum.exclude}
                          className={
                            curriculum.exclude
                              ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          value={curriculum.name}
                          readOnly
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          curriculum.exclude
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          const data: ExcludeCurriculumProps = {
                            exclude: !curriculum.exclude,
                            id: curriculum.id,
                            date: curriculum.date,
                            isExperimental: curriculum.isExperimental,
                            name: curriculum.name,
                          };
                          handleIncludeExcludeCurriculum(index, data);
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : curriculum.exclude
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    </div>
                  </div>
                ))
              : null}

            {/** CHECKBOX ADD CURRICULUM */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addCurriculum"
                className={
                  errors.addCurriculum
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Adicionar Modalidade ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="addCurriculum"
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={studentEditData.addCurriculum}
                  onChange={() => {
                    setStudentEditData({
                      ...studentEditData,
                      addCurriculum: !studentEditData.addCurriculum,
                    });
                  }}
                />
              </div>
            </div>

            {/** ADD CURRICULUM */}
            {studentEditData.addCurriculum ? (
              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                {/** ADD CURRICULUM SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Atenção: você está adicionando uma nova aula para{" "}
                  {studentEditData.name}:
                </h1>

                {/* SCHOOL SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newSchoolSelect"
                    className={
                      errors.addCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Escola:{" "}
                  </label>
                  <select
                    id="newSchoolSelect"
                    defaultValue={" -- select an option -- "}
                    className={
                      errors.addCurriculum
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="newSchoolSelect"
                    onChange={(e) => {
                      setCurriculumData({
                        ...curriculumData,
                        schoolId: e.target.value,
                        schoolClassId: "",
                        schoolCourseId: "",
                      });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schools"
                      handleData={handleNewSchoolSelectedData}
                    />
                  </select>
                </div>

                {/* SCHOOL CLASS SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newSchoolClassSelect"
                    className={
                      errors.addCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Turma:{" "}
                  </label>
                  <select
                    id="newSchoolClassSelect"
                    disabled={curriculumData.schoolId ? false : true}
                    defaultValue={" -- select an option -- "}
                    className={
                      curriculumData.schoolId
                        ? errors.addCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newSchoolClassSelect"
                    onChange={(e) => {
                      setCurriculumData({
                        ...curriculumData,
                        schoolClassId: e.target.value,
                        schoolCourseId: "",
                      });
                      setNewStudentData({ ...newStudentData, curriculum: "" });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schoolClasses"
                      schoolId={curriculumData.schoolId}
                      handleData={handleNewSchoolClassSelectedData}
                    />
                  </select>
                </div>

                {/* SCHOOL COURSE SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newSchoolCourseSelect"
                    className={
                      errors.addCurriculum
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Modalidade:{" "}
                  </label>
                  <select
                    id="newSchoolCourseSelect"
                    disabled={curriculumData.schoolClassId ? false : true}
                    defaultValue={" -- select an option -- "}
                    className={
                      curriculumData.schoolClassId
                        ? errors.addCurriculum
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newSchoolCourseSelect"
                    onChange={(e) => {
                      setCurriculumData({
                        ...curriculumData,
                        schoolCourseId: e.target.value,
                      });
                      setNewStudentData({ ...newStudentData, curriculum: "" });
                    }}
                  >
                    <SelectOptions
                      returnId
                      dataType="schoolCourses"
                      handleData={handleNewSchoolCourseSelectedData}
                    />
                    <option value={"all"}>Todas as Modalidades</option>
                  </select>
                </div>

                {/* CURRICULUM SELECT */}
                {curriculumData.schoolId &&
                curriculumData.schoolClassId &&
                curriculumData.schoolCourseId ? (
                  <>
                    {/* CURRICULUM CARD DETAILS SECTION TITLE */}
                    <h1 className="font-bold text-2xl py-4">
                      {newSchoolSelectedData?.name} -{" "}
                      {newSchoolClassSelectedData?.name} -{" "}
                      {curriculumData.schoolCourseId === "all"
                        ? "Todas as Modalidades"
                        : newSchoolCourseSelectedData?.name}
                      :
                    </h1>

                    {/* SEPARATOR */}
                    <hr className="pb-4" />

                    {newCurriculumCoursesData.length !== 0 ? (
                      <>
                        {/* CURRICULUM CARD DETAILS */}
                        <div className="flex flex-wrap gap-4 justify-center">
                          {newCurriculumCoursesData.map((curriculum: any) => (
                            <div
                              className={
                                errors.curriculumDetails
                                  ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                                  : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                              }
                              key={curriculum.id}
                            >
                              <input
                                type="radio"
                                id={curriculum.id}
                                name="curriculumCardDetails"
                                className="text-klGreen-500 dark:text-klGreen-500 border-none"
                                value={curriculum.id}
                                onChange={(e) => {
                                  setNewStudentData({
                                    ...newStudentData,
                                    curriculum: e.target.value,
                                    curriculumName: curriculum.name,
                                    curriculumClassDayId: curriculum.classDayId,
                                  });
                                }}
                              />
                              <label
                                htmlFor="curriculumCardDetails"
                                className="flex flex-col gap-4"
                              >
                                {curriculumData.schoolName ===
                                "Colégio Bernoulli" ? (
                                  <p>Turma: {curriculum.schoolClass}</p>
                                ) : null}
                                <p>Modalidade: {curriculum.schoolCourse}</p>
                                {newSchedulesDetailsData.map((details: any) =>
                                  details.name === curriculum.schedule
                                    ? `Horário: De ${details.classStart.slice(
                                        0,
                                        2
                                      )}h${
                                        details.classStart.slice(3, 5) === "00"
                                          ? ""
                                          : details.classStart.slice(3, 5) +
                                            "min"
                                      } a ${details.classEnd.slice(0, 2)}h${
                                        details.classEnd.slice(3, 5) === "00"
                                          ? ""
                                          : details.classEnd.slice(3, 5) + "min"
                                      }`
                                    : null
                                )}
                                <p>Dias: {curriculum.classDay}</p>
                                <p>Professor: {curriculum.teacher}</p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* CURRICULUM EMPTY DESCRIPTION */}
                        <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
                          Nenhuma vaga disponível com as opções selecionadas,
                          tente novamente.
                        </h1>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* CURRICULUM PRE-SELECT DESCRIPTION */}
                    <p className="text-red-600 dark:text-yellow-500">
                      Selecione um colégio e uma turma para ver as modalidades
                      disponíveis.
                    </p>
                  </>
                )}

                {classDayCurriculumSelectedData &&
                indexDaysArray.length !== undefined ? (
                  <>
                    {/* NEW CURRICULUM/INITIAL DAY */}
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="newCurriculumClassPick"
                        className={
                          newClassError
                            ? "w-1/4 text-right text-red-500 dark:text-red-400"
                            : "w-1/4 text-right"
                        }
                      >
                        Escolha o dia de início da nova modalidade:
                      </label>
                      <div className="flex w-3/4">
                        <DatePicker
                          months={months}
                          weekDays={weekDays}
                          placeholder={
                            newClassError
                              ? "É necessário selecionar uma Data"
                              : "Selecione uma Data"
                          }
                          currentDate={new DateObject()}
                          inputClass={
                            newClassError
                              ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                              : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          minDate={new DateObject().add(1, "day")}
                          mapDays={({ date }) => {
                            let isWeekend = indexDaysArray.includes(
                              date.weekDay.index
                            );

                            if (isWeekend)
                              return {
                                disabled: true,
                                style: { color: "#ccc" },
                                title: "Aula não disponível neste dia",
                              };
                          }}
                          editable={false}
                          format="DD/MM/YYYY"
                          onChange={(e: DateObject) => {
                            e !== null
                              ? setNewStudentData({
                                  ...newStudentData,
                                  curriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
                                })
                              : null;
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {/** CHECKBOX CONFIRM INSERT NEW CURRICULUM */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmAddCurriculum"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={newStudentData.confirmAddCurriculum}
                    onChange={() => {
                      setNewStudentData({
                        ...newStudentData,
                        confirmAddCurriculum:
                          !newStudentData.confirmAddCurriculum,
                      });
                    }}
                  />
                  <label htmlFor="confirmAddCurriculum" className="text-sm">
                    Confirmar inclusão da Aula
                  </label>
                </div>
              </div>
            ) : null}

            {/* EXISTENT FAMILY */}
            {haveFamily
              ? excludeFamily.map((family, index) => (
                  <div className="flex gap-2 items-center" key={family.id}>
                    <label
                      htmlFor="existentFamilyName"
                      className="w-1/4 text-right"
                    >
                      {index === 0 ? "Familiares: " : ""}
                    </label>
                    <div className="flex w-3/4 gap-2">
                      <div className="w-10/12">
                        <input
                          type="text"
                          name="existentFamilyName"
                          disabled={isSubmitting ? true : family.exclude}
                          className={
                            family.exclude
                              ? "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                              : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                          }
                          value={family.name}
                          readOnly
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={
                          family.exclude
                            ? "border rounded-2xl border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/12"
                            : "border rounded-2xl border-red-900 bg-red-600 disabled:bg-red-400 text-white w-2/12"
                        }
                        onClick={() => {
                          const data: ExcludeFamilyProps = {
                            exclude: !family.exclude,
                            id: family.id,
                            name: excludeFamily[index].name,
                          };
                          handleIncludeExcludeFamily(index, data);
                        }}
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : family.exclude
                          ? "Cancelar Exclusão"
                          : "Excluir"}
                      </button>
                    </div>
                  </div>
                ))
              : null}

            {/** CHECKBOX ADD FAMILY */}
            <div className="flex gap-2 items-center">
              <label
                htmlFor="addFamily"
                className={
                  errors.addFamily
                    ? "w-1/4 text-right text-red-500 dark:text-red-400"
                    : "w-1/4 text-right"
                }
              >
                Adicionar Familiar ?{" "}
              </label>
              <div className="w-3/4 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="addFamily"
                  className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={studentEditData.addFamily}
                  onChange={() => {
                    setStudentEditData({
                      ...studentEditData,
                      addFamily: !studentEditData.addFamily,
                    });
                  }}
                />
              </div>
            </div>

            {/** ADD FAMILY */}
            {studentEditData.addFamily ? (
              <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
                {/** ADD FAMILY SECTION TITLE */}
                <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
                  Atenção: a seguir insira os dados do aluno que estuda na KL
                  Minas, e é parente de {studentEditData.name}:
                </h1>

                {/* FAMILY SCHOOL SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newFamilySchoolSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Escola do Parente:{" "}
                  </label>
                  <select
                    id="newFamilySchoolSelect"
                    defaultValue={" -- select an option -- "}
                    className={
                      errors.addFamily
                        ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    }
                    name="newFamilySchoolSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        newFamilySchoolId: e.target.value,
                      });
                    }}
                  >
                    <SelectOptions returnId dataType="schools" />
                  </select>
                </div>

                {/* FAMILY SCHOOL CLASS SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newFamilySchoolClassSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Turma do Parente:{" "}
                  </label>
                  <select
                    id="newFamilySchoolClassSelect"
                    defaultValue={" -- select an option -- "}
                    disabled={newStudentData.newFamilySchoolId ? false : true}
                    className={
                      newStudentData.newFamilySchoolId
                        ? errors.addFamily
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newFamilySchoolClassSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        newFamilySchoolClassId: e.target.value,
                      });
                    }}
                  >
                    {newStudentData.newFamilySchoolId ? (
                      <SelectOptions
                        returnId
                        dataType="schoolClasses"
                        schoolId={newStudentData.newFamilySchoolId}
                      />
                    ) : (
                      <option disabled value={" -- select an option -- "}>
                        {" "}
                        -- Selecione uma escola para ver as turmas disponíveis
                        --{" "}
                      </option>
                    )}
                  </select>
                </div>

                {/* FAMILY SCHOOL COURSE SELECT */}
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newFamilyCurriculumSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione a Modalidade do Parente:{" "}
                  </label>
                  <select
                    id="newFamilyCurriculumSelect"
                    defaultValue={" -- select an option -- "}
                    disabled={
                      newStudentData.newFamilySchoolClassId ? false : true
                    }
                    className={
                      newStudentData.newFamilySchoolClassId
                        ? errors.addFamily
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newFamilyCurriculumSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        newFamilyCurriculumId: e.target.value,
                      });
                    }}
                  >
                    {newStudentData.newFamilySchoolClassId ? (
                      <SelectOptions
                        returnId
                        dataType="curriculum"
                        displaySchoolCourseAndSchedule
                        schoolId={newStudentData.newFamilySchoolId}
                        schoolClassId={newStudentData.newFamilySchoolClassId}
                      />
                    ) : (
                      <option value={" -- select an option -- "}>
                        {" "}
                        -- Selecione uma Turma para ver as modalidades
                        disponíveis --{" "}
                      </option>
                    )}
                  </select>
                </div>

                {/* FAMILY STUDENT SELECT */}
                <div className="flex gap-2 items-center pb-2">
                  <label
                    htmlFor="newFamilyStudentSelect"
                    className={
                      errors.addFamily
                        ? "w-1/4 text-right text-red-500 dark:text-red-400"
                        : "w-1/4 text-right"
                    }
                  >
                    Selecione o Parente:{" "}
                  </label>
                  <select
                    id="newFamilyStudentSelect"
                    defaultValue={" -- select an option -- "}
                    disabled={
                      newStudentData.newFamilyCurriculumId ? false : true
                    }
                    className={
                      newStudentData.newFamilyCurriculumId
                        ? errors.addFamily
                          ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                          : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                        : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                    }
                    name="newFamilyStudentSelect"
                    onChange={(e) => {
                      setNewStudentData({
                        ...newStudentData,
                        familyId: e.target.value,
                      });
                    }}
                  >
                    {newStudentData.newFamilyCurriculumId ? (
                      <SelectOptions
                        returnId
                        dataType="allStudents"
                        // onlyEnrolledStudents
                        studentId={studentData.studentId}
                        handleData={handleNewFamilyDetailsData}
                        schoolId={newStudentData.newFamilySchoolId}
                        schoolClassId={newStudentData.newFamilySchoolClassId}
                        curriculumId={newStudentData.newFamilyCurriculumId}
                      />
                    ) : (
                      <option disabled value={" -- select an option -- "}>
                        {" "}
                        -- Selecione Colégio, Turma e Modalidade para ver os
                        alunos disponíveis --{" "}
                      </option>
                    )}
                  </select>
                </div>

                {/** CHECKBOX CONFIRM INSERT NEW FAMILY */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="confirmAddFamily"
                    className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
                    checked={newStudentData.confirmAddFamily}
                    onChange={() => {
                      setNewStudentData({
                        ...newStudentData,
                        confirmAddFamily: !newStudentData.confirmAddFamily,
                      });
                    }}
                  />
                  <label htmlFor="confirmAddFamily" className="text-sm">
                    Confirmar inclusão do Familiar
                  </label>
                </div>
              </div>
            ) : null}

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
