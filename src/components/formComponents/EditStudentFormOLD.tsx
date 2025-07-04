// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { v4 as uuidv4 } from "uuid";
// import { useContext, useEffect, useState } from "react";
// import "react-toastify/dist/ReactToastify.css";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import DatePicker, { DateObject } from "react-multi-date-picker";
// import {
//   arrayRemove,
//   arrayUnion,
//   doc,
//   getFirestore,
//   serverTimestamp,
//   Timestamp,
// } from "firebase/firestore";

// import { app } from "../../db/Firebase";
// import { SelectOptions } from "./SelectOptions";
// import { editStudentValidationSchema } from "../../@types/zodValidation";
// import {
//   ClassDaySearchProps,
//   CurriculumArrayProps,
//   CurriculumSearchProps,
//   CurriculumStateProps,
//   CurriculumToAddProps,
//   EditStudentValidationZProps,
//   // ExcludeCurriculumProps,
//   // ExcludeFamilyProps,
//   // ExcludeWaitingListProps,
//   HandleClickOpenFunctionProps,
//   SchoolClassSearchProps,
//   SchoolCourseSearchProps,
//   SchoolSearchProps,
//   SearchCurriculumValidationZProps,
//   StudentFreeDayProps,
//   StudentSearchProps,
//   ToggleClassDaysFunctionProps,
// } from "../../@types";
// import { classDayIndex, months, weekDays } from "../../custom";
// import {
//   GlobalDataContext,
//   GlobalDataContextType,
// } from "../../context/GlobalDataContext";
// import EditDashboardHeader from "../layoutComponents/EditDashboardHeader";
// import { EditFamilyButton } from "../layoutComponents/EditFamilyButton";
// import { EditWaitingListButton } from "../layoutComponents/EditWaitingListButton";
// import CurriculumCardDescription from "../layoutComponents/CurriculumCardDescription";
// import FinancialResponsibleForm from "./FinancialResponsibleForm";
// import ParentForm from "./ParentForm";
// import PersonalDataForm from "./PersonalDataForm";
// import ShowCurriculums from "./ShowCurriculums";
// import { MdAdd } from "react-icons/md";
// import SelectSchoolAndCourse from "./SelectSchoolAndCourse";
// import { DiscountForm } from "./DiscountForm";
// import { PaymentDetails } from "../layoutComponents/PaymentDetails";
// import CurriculumBalloon from "../layoutComponents/CurriculumBaloon";
// import { secureUpdateDoc } from "../../hooks/firestoreMiddleware";

// export type NewPricesProps = {
//   appliedPrice: number;
//   fullPrice: number;
// };

// type StudentDataProps = {
//   schoolId: string;
//   schoolClassId: string;
//   curriculumId: string;
//   schoolCoursePriceUnit: number;
//   schoolCoursePriceBundle: number;
//   schoolCourseBundleDays: number;
//   studentId: string;
// };

// interface EditStudentFormProps {
//   studentId: string;
//   isSubmitting: boolean;
//   setIsSubmitting: (isSubmitting: boolean) => void;
//   setStudentData?: (studentData: StudentDataProps) => void;
//   onClose?: () => void;
//   onlyView?: boolean;

//   isEdit?: boolean;
//   isFinance?: boolean;
//   isFinancialResponsible?: boolean;
//   open?: boolean;

//   handleClickOpen?: ({ id, option }: HandleClickOpenFunctionProps) => void;
//   handleDeleteUser?: () => void;
//   setIsEdit?: (option: boolean) => void;
//   setIsFinance?: (option: boolean) => void;
//   setIsDetailsViewing?: (option: boolean) => void;
// }

// // INITIALIZING FIRESTORE DB
// const db = getFirestore(app);

// export function EditStudentForm({
//   studentId,
//   isSubmitting,
//   setIsSubmitting,
//   setStudentData,
//   onClose,
//   onlyView = false,
//   isEdit = false,
//   isFinance = false,
//   isFinancialResponsible = false,
//   open = false,
//   handleClickOpen,
//   handleDeleteUser,
//   setIsEdit,
//   setIsFinance,
//   setIsDetailsViewing,
// }: EditStudentFormProps) {
//   // GET GLOBAL DATA
//   const {
//     classDaysDatabaseData,
//     curriculumDatabaseData,
//     schoolDatabaseData,
//     schoolClassDatabaseData,
//     schoolCourseDatabaseData,
//     studentsDatabaseData,
//     page,
//     userFullData,
//     systemConstantsValues,
//     formatCurriculumName,
//     handleOneCurriculumDetails,
//     handleOneStudentDetails,
//     // calculateEnrollmentFee,
//     // calculateStudentMonthlyFee,
//   } = useContext(GlobalDataContext) as GlobalDataContextType;

//   // STUDENT EDIT DATA
//   const [studentEditData, setStudentEditData] =
//     useState<EditStudentValidationZProps>({
//       // Section 1: Student Data
//       id: "",
//       active: true,
//       name: "",
//       document: "",
//       birthDate: "",
//       schoolYears: "",
//       schoolYearsComplement: "",
//       parentOne: {
//         name: "",
//         email: "",
//         phone: {
//           ddd: "",
//           number: "",
//         },
//       },
//       parentTwo: {
//         name: "",
//         email: "",
//         phone: {
//           ddd: "",
//           number: "",
//         },
//       },

//       // Section 2: Student Course and Family Data | Prices
//       addCurriculum: false,
//       addExperimentalCurriculum: false,
//       addFamily: false,
//       studentFamilyAtSchool: [],
//       enrolmentExemption: false,
//       enrolmentFee: 0,
//       enrolmentFeePaid: false,
//       customDiscount: false,
//       customDiscountValue: "0",
//       employeeDiscount: false,
//       familyDiscount: false,
//       secondCourseDiscount: false,
//       fullPrice: 0,
//       appliedPrice: 0,
//       paymentDay: "",

//       // Section 3: Student Financial Responsible Data
//       financialResponsible: {
//         name: "",
//         document: "",
//         email: "",
//         address: {
//           street: "",
//           number: "",
//           complement: "",
//           neighborhood: "",
//           city: "",
//           state: "",
//           cep: "",
//         },
//         phone: {
//           ddd: "",
//           number: "",
//         },
//         activePhoneSecondary: false,
//         phoneSecondary: {
//           ddd: "",
//           number: "",
//         },
//         activePhoneTertiary: false,
//         phoneTertiary: {
//           ddd: "",
//           number: "",
//         },
//       },
//     });

//   const [curriculumState, setCurriculumState] = useState<CurriculumStateProps>({
//     curriculums: [],
//     fullPrice: 0,
//     appliedPrice: 0,
//     enrollmentFee: 0,
//   });

//   const [removedCurriculums, setRemovedCurriculums] = useState<
//     CurriculumToAddProps[]
//   >([]);

//   useEffect(() => {
//     setRemovedCurriculums([]);
//   }, [onlyView]);

//   const [newAddCurriculums, setNewAddCurriculums] = useState<
//     CurriculumToAddProps[]
//   >([]);

//   const [hasNonExperimentalCurriculum, setHasNonExperimentalCurriculum] =
//     useState<boolean>(false);

//   useEffect(() => {
//     // Verificar se existe algum curriculum com isExperimental como false
//     const hasNonExperimental = curriculumState.curriculums.some(
//       (curriculum) => !curriculum.isExperimental
//     );
//     setHasNonExperimentalCurriculum(hasNonExperimental);
//   }, [curriculumState.curriculums]);

//   // Função para adicionar currículos aos dias livres
//   // const addInitialCurriculumsToStudentFreeDays = () => {
//   //   // Copiar o estado atual de studentFreeDays para não modificar diretamente
//   //   const updatedFreeDays = [...studentFreeDays];

//   //   // Percorrer os currículos e seus dias
//   //   curriculumState.curriculums.forEach((curriculum) => {
//   //     curriculum.indexDays.forEach((index) => {
//   //       // Encontrar o dia no estado
//   //       const dayIndex = updatedFreeDays.findIndex((d) => d.day === index);

//   //       if (dayIndex === -1) {
//   //         throw new Error(`Dia ${index} não encontrado em studentFreeDays.`);
//   //       }

//   //       const day = updatedFreeDays[dayIndex];

//   //       if (day.curriculumId !== null) {
//   //         throw new Error(`O dia ${index} já tem um ID atribuído.`);
//   //       }

//   //       // Atribuir o id do currículo ao dia
//   //       updatedFreeDays[dayIndex] = { ...day, curriculumId: curriculum.id };
//   //     });
//   //   });

//   //   // Atualizar o estado com a nova versão dos dias
//   //   setStudentFreeDays(updatedFreeDays);
//   // };
//   const addInitialCurriculumsToStudentFreeDays = () => {
//     setStudentFreeDays((prevState) => {
//       const updatedState = prevState.map((day) => {
//         let updatedDay = { ...day };

//         // Itera sobre o array curriculums
//         curriculumState.curriculums.forEach((curriculum) => {
//           if (curriculum.indexDays.includes(day.day)) {
//             // Se o dia está na lista de indexDays e curriculumId é null, atribui o curriculumId
//             if (updatedDay.curriculumId === null) {
//               updatedDay = { ...updatedDay, curriculumId: curriculum.id };
//             }
//           } else if (updatedDay.curriculumId === curriculum.id) {
//             // Se o dia não está na lista e o curriculumId é o mesmo, remove o curriculumId
//             updatedDay = { ...updatedDay, curriculumId: null };
//           }
//         });

//         return updatedDay;
//       });

//       return updatedState;
//     });
//   };

//   // Ref para garantir que o efeito execute apenas uma vez quando o curriculumState.curriculums for inicializado
//   // const initialLoad = useRef(false);

//   useEffect(() => {
//     if (curriculumState.curriculums.length > 0) {
//       // if (initialLoad.current) return; // Evita rodar novamente após a primeira execução

//       // initialLoad.current = true; // Marca que o efeito foi executado
//       addInitialCurriculumsToStudentFreeDays();
//     }
//   }, [curriculumState.curriculums]);

//   const removeCurriculum = (id: string) => {
//     setCurriculumState((prevState) => {
//       // Encontramos o currículo que será removido antes de atualizar o estado
//       const curriculumToRemove = prevState.curriculums.find(
//         (curriculum) => curriculum.id === id
//       );

//       if (!curriculumToRemove) return prevState; // Se não encontrou, retorna o estado inalterado

//       // Atualiza studentFreeDays para liberar os dias ocupados pelo currículo removido
//       setStudentFreeDays((prevFreeDays) =>
//         prevFreeDays.map((freeDay) =>
//           curriculumToRemove.indexDays.includes(freeDay.day) &&
//           freeDay.curriculumId === id // Somente se o ID for o mesmo do removido
//             ? { ...freeDay, curriculumId: null } // Libera o dia ocupado
//             : freeDay
//         )
//       );

//       return {
//         ...prevState,
//         // Remove o currículo do array
//         curriculums: prevState.curriculums.filter(
//           (curriculum) => curriculum.id !== id
//         ),
//       };
//     });
//   };

//   const [studentFreeDays, setStudentFreeDays] = useState<StudentFreeDayProps[]>(
//     [
//       { day: 0, curriculumId: null },
//       { day: 1, curriculumId: null },
//       { day: 2, curriculumId: null },
//       { day: 3, curriculumId: null },
//       { day: 4, curriculumId: null },
//       { day: 5, curriculumId: null },
//       { day: 6, curriculumId: null },
//     ]
//   );

//   const upsertCurriculum = (newCurriculum: CurriculumToAddProps) => {
//     setStudentFreeDays((prevState) => {
//       const updatedState = prevState.map((day) => {
//         if (
//           newCurriculum.indexDays.includes(day.day) &&
//           day.curriculumId === null
//         ) {
//           // Se o dia está na lista e o curriculumId é null, atribui o novo curriculumId
//           return { ...day, curriculumId: newCurriculum.id };
//         } else if (
//           !newCurriculum.indexDays.includes(day.day) &&
//           day.curriculumId === newCurriculum.id
//         ) {
//           // Se o dia não está na lista e o curriculumId é o mesmo, remove o curriculumId
//           return { ...day, curriculumId: null };
//         }
//         return day; // Caso contrário, mantém o dia inalterado
//       });

//       return updatedState;
//     });
//     // console.log("newCurriculum:", newCurriculum);

//     setCurriculumState((prevState) => {
//       // console.log("PrevState:", prevState);

//       // Cópia do estado atual
//       const curriculumsCopy = structuredClone(prevState.curriculums); // Evita mutação
//       // console.log("Curriculums Copy:", curriculumsCopy);

//       // Criar um mapa de currículos
//       const curriculumsMap = new Map(curriculumsCopy.map((c) => [c.id, c]));
//       // console.log(
//       //   "Curriculums Map (antes da modificação):",
//       //   Array.from(curriculumsMap.entries())
//       // );

//       // Criar um clone real do currículo recebido
//       const updatedCurriculum = {
//         ...newCurriculum,
//         indexDays: [...newCurriculum.indexDays], // Copia profunda do array
//       };
//       // console.log(
//       //   "Novo Currículo (cópia real) (antes de modificar os dias):",
//       //   updatedCurriculum
//       // );

//       if (!updatedCurriculum.isExperimental) {
//         // Filtrar currículos regulares EXCLUINDO o que está sendo editado
//         const occupiedDays = curriculumsCopy
//           .filter((c) => !c.isExperimental && c.id !== updatedCurriculum.id)
//           .flatMap((c) => c.indexDays);

//         // console.log(
//         //   "Dias ocupados (outros currículos regulares, excluindo o atual):",
//         //   occupiedDays
//         // );

//         // Atualiza os dias, removendo apenas os já ocupados pelos outros currículos
//         updatedCurriculum.indexDays = updatedCurriculum.indexDays.filter(
//           (day) => !occupiedDays.includes(day)
//         );

//         // console.log(
//         //   "Dias do novo currículo após filtragem (sem excluir os próprios dias):",
//         //   updatedCurriculum.indexDays
//         // );
//       } else {
//         updatedCurriculum.indexDays = [];
//         // console.log(
//         //   "Currículo é experimental, indexDays resetado para:",
//         //   updatedCurriculum.indexDays
//         // );
//       }

//       // Atualizar o mapa
//       curriculumsMap.set(updatedCurriculum.id, { ...updatedCurriculum });

//       // console.log(
//       //   "Curriculums Map (após adição/atualização):",
//       //   Array.from(curriculumsMap.entries())
//       // );

//       // Criar um novo estado imutável
//       const newState = {
//         ...prevState,
//         curriculums: Array.from(curriculumsMap.values()),
//       };
//       // console.log("Novo estado antes de ser retornado:", newState);

//       return newState;
//     });
//   };

//   // useEffect(() => {
//   //   const fetchStudentMonthlyFee = async () => {
//   //     try {
//   //       const curriculums = curriculumState.curriculums.map((curriculum) => ({
//   //         date: curriculum.date,
//   //         id: curriculum.id,
//   //         indexDays: curriculum.indexDays,
//   //         isExperimental: curriculum.isExperimental,
//   //         price: 0,
//   //       }));

//   //       const fee = await calculateStudentMonthlyFee(studentEditData.id, {
//   //         curriculums,
//   //         customDiscount: studentEditData.customDiscount,
//   //         customDiscountValue: studentEditData.customDiscountValue || "0",
//   //         employeeDiscount: studentEditData.employeeDiscount,
//   //         familyDiscount: studentEditData.familyDiscount,
//   //         secondCourseDiscount: studentEditData.secondCourseDiscount,
//   //         studentFamilyAtSchool: studentEditData.studentFamilyAtSchool,
//   //       });

//   //       setCurriculumState((prevState) => ({
//   //         ...prevState,
//   //         appliedPrice: fee.appliedPrice,
//   //         fullPrice: fee.fullPrice,
//   //       }));
//   //       setStudentEditData((prevData) => ({
//   //         ...prevData,
//   //         secondCourseDiscount: fee.secondCourseDiscount,
//   //       }));
//   //       setCurriculumState((prevState) => ({
//   //         ...prevState,
//   //         enrollmentFee: hasNonExperimentalCurriculum
//   //           ? calculateEnrollmentFee(studentEditData.enrolmentExemption)
//   //           : 0,
//   //       }));
//   //     } catch (error) {
//   //       console.error("Erro ao calcular a mensalidade do aluno:", error);
//   //     }
//   //   };

//   //   if (curriculumState.curriculums.length > 0) {
//   //     fetchStudentMonthlyFee();
//   //   } else {
//   //     setCurriculumState((prevState) => ({
//   //       ...prevState,
//   //       appliedPrice: 0,
//   //       fullPrice: 0,
//   //       enrollmentFee: 0,
//   //     }));
//   //   }
//   // }, [
//   //   curriculumState.curriculums,
//   //   studentEditData.familyDiscount,
//   //   studentEditData.customDiscount,
//   //   studentEditData.customDiscountValue,
//   //   studentEditData.employeeDiscount,
//   //   studentEditData.enrolmentExemption,
//   //   studentEditData.studentFamilyAtSchool,
//   //   hasNonExperimentalCurriculum,
//   // ]);

//   // Estado local para controlar quantos SelectSchoolAndCourse devem ser renderizados
//   const [curriculumCount, setCurriculumCount] = useState<number>(0); // Começa com 0

//   // Função para adicionar um novo currículo (apenas aumenta o contador)
//   const handleAddCurriculum = () => {
//     setCurriculumCount((prevCount) => prevCount + 1); // Aumenta o contador para renderizar mais um SelectSchoolAndCourse
//   };

//   // Efeito que será executado sempre que studentData.schoolYears mudar
//   // useEffect(() => {
//   //   // Se studentData.schoolYears for diferente de "", então podemos começar com 1
//   //   if (studentEditData.schoolYears !== "") {
//   //     setCurriculumCount(1);
//   //   } else {
//   //     setCurriculumCount(0);
//   //   }
//   // }, [studentEditData.schoolYears]); // Dependência de studentData.schoolYears

//   // TEST FINANCIAL RESPONSIBLE CPF (BRAZILIAN DOCUMENT) STATE
//   const [testFinancialCPF, setTestFinancialCPF] = useState(true);

//   // TEST FINANCIAL STUDENT CPF (BRAZILIAN DOCUMENT) STATE
//   const [testCPF, setTestCPF] = useState(true);

//   // NEW STUDENT DATA STATE
//   const [newStudentData, setNewStudentData] = useState({
//     confirmAddFamily: false,
//     confirmAddCurriculum: false,
//     confirmAddExperimentalCurriculum: false,
//     curriculum: "",
//     curriculumName: "",
//     curriculumClassDayId: "",
//     curriculumInitialDate: "",
//     curriculumCoursePriceUnit: 0,
//     curriculumCoursePriceBundle: 0,
//     curriculumCourseBundleDays: 0,
//     experimentalCurriculum: "",
//     experimentalCurriculumName: "",
//     experimentalCurriculumClassDayId: "",
//     experimentalCurriculumInitialDate: "",
//     familyId: "",
//     familyName: "",
//     newFamilySchoolId: "",
//     newFamilySchoolClassId: "",
//     newFamilyCurriculumId: "",
//     indexDays: [] as number[],
//   });

//   // CURRICULUM PLACES AVAILABLE STATE
//   const [curriculumPlacesAvailable, setCurriculumPlacesAvailable] =
//     useState(true);

//   // CHANGE CURRICULUM PLACES AVAILABLE STATE
//   useEffect(() => {
//     if (newStudentData.curriculum) {
//       setCurriculumPlacesAvailable(
//         handleOneCurriculumDetails(newStudentData.curriculum).placesAvailable -
//           handleOneCurriculumDetails(newStudentData.curriculum).students
//             .length >
//           0
//       );
//     }
//   }, [newStudentData.curriculum]);

//   // // CURRICULUM EMPTY WAITING LIST STATE
//   // const [curriculumEmptyWaitingList, setCurriculumEmptyWaitingList] =
//   //   useState(true);

//   // // CHANGE CURRICULUM EMPTY WAITING LIST STATE
//   // useEffect(() => {
//   //   if (newStudentData.curriculum) {
//   //     setCurriculumEmptyWaitingList(
//   //       handleOneCurriculumDetails(newStudentData.curriculum).waitingList
//   //         .length === 0
//   //     );
//   //   }
//   // }, [newStudentData.curriculum]);

//   // EXPERIMENTAL CURRICULUM PLACES AVAILABLE STATE
//   const [
//     experimentalCurriculumPlacesAvailable,
//     setExperimentalCurriculumPlacesAvailable,
//   ] = useState(true);

//   // CHANGE EXPERIMENTAL CURRICULUM PLACES AVAILABLE STATE
//   useEffect(() => {
//     if (newStudentData.experimentalCurriculum) {
//       setExperimentalCurriculumPlacesAvailable(
//         handleOneCurriculumDetails(newStudentData.experimentalCurriculum)
//           .placesAvailable -
//           handleOneCurriculumDetails(newStudentData.experimentalCurriculum)
//             .students.length >
//           0
//       );
//     }
//   }, [newStudentData.experimentalCurriculum]);

//   // // EXPERIMENTAL CURRICULUM PLACES AVAILABLE STATE
//   // const [
//   //   experimentalCurriculumEmptyWaitingList,
//   //   setExperimentalCurriculumEmptyWaitingList,
//   // ] = useState(true);

//   // // CHANGE EXPERIMENTAL CURRICULUM PLACES AVAILABLE
//   // useEffect(() => {
//   //   if (newStudentData.experimentalCurriculum) {
//   //     setExperimentalCurriculumEmptyWaitingList(
//   //       handleOneCurriculumDetails(newStudentData.experimentalCurriculum)
//   //         .waitingList.length === 0
//   //     );
//   //   }
//   // }, [newStudentData.experimentalCurriculum]);

//   type NewPricesProps = {
//     appliedPrice: number;
//     fullPrice: number;
//   };

//   // NEW PRICES STATE
//   const [newPrices, setNewPrices] = useState<NewPricesProps>({
//     appliedPrice: 0,
//     fullPrice: 0,
//   });

//   // // REGISTRATION EXEMPTION STATE
//   // const [enrolmentExemption, setEnrolmentExemption] = useState(false);

//   // CHANGE ENROLMENT FEE VALUE WHEN ACTIVATE REGISTRATION EXEMPTION
//   useEffect(() => {
//     if (systemConstantsValues) {
//       if (enrolmentExemption) {
//         setStudentEditData({ ...studentEditData, enrolmentFee: 0 });
//       } else {
//         setStudentEditData({
//           ...studentEditData,
//           enrolmentFee:
//             new Date().getMonth() < 6
//               ? systemConstantsValues.enrolmentFee
//               : new Date().getMonth() < 10
//               ? systemConstantsValues.enrolmentFeeDiscount
//               : 0,
//         });
//       }
//     }
//   }, [enrolmentExemption, systemConstantsValues]);

//   // SET CUSTOM DISCOUNT VALUE TO 0 WHEN CUSTOM DISCOUNT IS UNCHECKED
//   useEffect(() => {
//     if (studentEditData.customDiscount) {
//       setStudentEditData({ ...studentEditData, customDiscountValue: "0" });
//     }
//   }, [studentEditData.customDiscount]);

//   // CURRICULUM / EXPERMIENTAL CLASS STATE
//   const [newClass, setNewClass] = useState({
//     date: "",
//     name: "",
//     enrolledDays: [] as number[],
//   });

//   // PICK STUDENT CLASS DAYS
//   // CLASS DAY BOOLEAN DATA
//   const [classDaysData, setClassDaysData] = useState({
//     Domingo: true,
//     Segunda: true,
//     Terça: true,
//     Quarta: true,
//     Quinta: true,
//     Sexta: true,
//     Sábado: true,
//   });

//   // TOGGLE CLASS DAYS VALUE FUNCTION
//   function toggleClassDays({ day, value }: ToggleClassDaysFunctionProps) {
//     setClassDaysData({ ...classDaysData, [day]: value });
//     if (value) {
//       classDayIndex.map((dayIndex) => {
//         if (dayIndex.name === day) {
//           if (dayIndex.name === "Domingo") {
//             setNewClass({
//               ...newClass,
//               enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
//             });
//           }
//           if (dayIndex.name === "Segunda") {
//             const foundSunday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 0
//             );
//             if (foundSunday !== -1) {
//               const insertAt = foundSunday + 1;
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, insertAt),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(insertAt),
//                 ],
//               });
//             } else {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
//               });
//             }
//           }
//           if (dayIndex.name === "Terça") {
//             const foundSunday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 0
//             );
//             const foundMonday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 1
//             );
//             if (foundMonday !== -1) {
//               const insertAt = foundMonday + 1;
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, insertAt),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(insertAt),
//                 ],
//               });
//             } else if (foundSunday !== -1) {
//               const insertAt = foundSunday + 1;
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, insertAt),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(insertAt),
//                 ],
//               });
//             } else {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
//               });
//             }
//           }
//           if (dayIndex.name === "Quarta") {
//             const foundSunday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 0
//             );
//             const foundMonday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 1
//             );
//             const foundTuesday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 2
//             );
//             if (foundTuesday !== -1) {
//               const insertAt = foundTuesday + 1;
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, insertAt),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(insertAt),
//                 ],
//               });
//             } else if (foundMonday !== -1) {
//               const insertAt = foundMonday + 1;
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, insertAt),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(insertAt),
//                 ],
//               });
//             } else if (foundSunday !== -1) {
//               const insertAt = foundSunday + 1;
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, insertAt),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(insertAt),
//                 ],
//               });
//             } else {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [dayIndex.id, ...newClass.enrolledDays],
//               });
//             }
//           }
//           if (dayIndex.name === "Quinta") {
//             const foundSaturday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 6
//             );
//             const foundFriday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 5
//             );
//             if (foundFriday !== -1) {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, foundFriday),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(foundFriday),
//                 ],
//               });
//             } else if (foundSaturday !== -1) {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, foundSaturday),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(foundSaturday),
//                 ],
//               });
//             } else {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [...newClass.enrolledDays, dayIndex.id],
//               });
//             }
//           }
//           if (dayIndex.name === "Sexta") {
//             const foundSaturday = newClass.enrolledDays.findIndex(
//               (classDayId) => classDayId === 6
//             );
//             if (foundSaturday !== -1) {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [
//                   ...newClass.enrolledDays.slice(0, foundSaturday),
//                   dayIndex.id,
//                   ...newClass.enrolledDays.slice(foundSaturday),
//                 ],
//               });
//             } else {
//               setNewClass({
//                 ...newClass,
//                 enrolledDays: [...newClass.enrolledDays, dayIndex.id],
//               });
//             }
//           }
//           if (dayIndex.name === "Sábado") {
//             setNewClass({
//               ...newClass,
//               enrolledDays: [...newClass.enrolledDays, dayIndex.id],
//             });
//           }
//         }
//       });
//     } else {
//       classDayIndex.map((dayIndex) => {
//         if (dayIndex.name === day) {
//           setNewClass({
//             ...newClass,
//             enrolledDays: newClass.enrolledDays.filter(
//               (classDayId) => classDayId !== dayIndex.id
//             ),
//           });
//         }
//       });
//     }
//   }
//   type WasCurriculumEditProps = {
//     id: string;
//     isEdited: boolean;
//   };

//   const [wasCurriculumEdit, setWasCurriculumEdit] = useState<
//     WasCurriculumEditProps[]
//   >([]);

//   // OPEN EDIT CURRICULUM PANEL DAYS
//   const [openEditCurriculumDays, setOpenEditCurriculumDays] = useState(false);

//   // OPEN EDIT EXPERIMENTAL CURRICULUM PANEL DAYS
//   const [
//     openEditExperimentalCurriculumDays,
//     setOpenEditExperimentalCurriculumDays,
//   ] = useState(false);

//   type ToggleCurriculumClassDaysProps = {
//     day: number;
//     curriculum: ExcludeCurriculumProps;
//     index: number;
//   };

//   const toggleCurriculumClassDays = ({
//     day,
//     curriculum,
//     index,
//   }: ToggleCurriculumClassDaysProps) => {
//     let indexDaysToUpdate: number[] = curriculum.indexDays;

//     if (indexDaysToUpdate.includes(day)) {
//       if (indexDaysToUpdate.length === 1) {
//         return toast.error("É preciso selecionar ao menos um dia de aula.");
//       } else {
//         indexDaysToUpdate = indexDaysToUpdate.filter(
//           (classDay) => classDay !== day
//         );
//       }
//     } else {
//       if (day === 0) {
//         indexDaysToUpdate = [day, ...curriculum.indexDays];
//       }
//       if (day === 1) {
//         const foundSunday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 0
//         );
//         if (foundSunday !== -1) {
//           const insertAt = foundSunday + 1;
//           indexDaysToUpdate = [
//             ...curriculum.indexDays.slice(0, insertAt),
//             day,
//             ...curriculum.indexDays.slice(insertAt),
//           ];
//         } else {
//           indexDaysToUpdate = [day, ...curriculum.indexDays];
//         }
//       }
//       if (day === 2) {
//         const foundSunday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 0
//         );
//         const foundMonday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 1
//         );
//         if (foundMonday !== -1) {
//           const insertAt = foundMonday + 1;
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, insertAt),
//             day,
//             ...indexDaysToUpdate.slice(insertAt),
//           ];
//         } else if (foundSunday !== -1) {
//           const insertAt = foundSunday + 1;
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, insertAt),
//             day,
//             ...indexDaysToUpdate.slice(insertAt),
//           ];
//         } else {
//           indexDaysToUpdate = [day, ...indexDaysToUpdate];
//         }
//       }
//       if (day === 3) {
//         const foundSunday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 0
//         );
//         const foundMonday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 1
//         );
//         const foundTuesday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 2
//         );
//         if (foundTuesday !== -1) {
//           const insertAt = foundTuesday + 1;
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, insertAt),
//             day,
//             ...indexDaysToUpdate.slice(insertAt),
//           ];
//         } else if (foundMonday !== -1) {
//           const insertAt = foundMonday + 1;
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, insertAt),
//             day,
//             ...indexDaysToUpdate.slice(insertAt),
//           ];
//         } else if (foundSunday !== -1) {
//           const insertAt = foundSunday + 1;
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, insertAt),
//             day,
//             ...indexDaysToUpdate.slice(insertAt),
//           ];
//         } else {
//           indexDaysToUpdate = [day, ...indexDaysToUpdate];
//         }
//       }
//       if (day === 4) {
//         const foundSaturday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 6
//         );
//         const foundFriday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 5
//         );
//         if (foundFriday !== -1) {
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, foundFriday),
//             day,
//             ...indexDaysToUpdate.slice(foundFriday),
//           ];
//         } else if (foundSaturday !== -1) {
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, foundSaturday),
//             day,
//             ...indexDaysToUpdate.slice(foundSaturday),
//           ];
//         } else {
//           indexDaysToUpdate = [...indexDaysToUpdate, day];
//         }
//       }
//       if (day === 5) {
//         const foundSaturday = curriculum.indexDays.findIndex(
//           (classDayId) => classDayId === 6
//         );
//         if (foundSaturday !== -1) {
//           indexDaysToUpdate = [
//             ...indexDaysToUpdate.slice(0, foundSaturday),
//             day,
//             ...indexDaysToUpdate.slice(foundSaturday),
//           ];
//         } else {
//           indexDaysToUpdate = [...indexDaysToUpdate, day];
//         }
//       }
//       if (day === 6) {
//         indexDaysToUpdate = [...indexDaysToUpdate, day];
//       }
//     }
//     // NEW PRICE CALC
//     const changedCurriculum = curriculumDatabaseData.find(
//       (changedCurriculumDatabase) =>
//         changedCurriculumDatabase.id === curriculum.id
//     );
//     if (changedCurriculum) {
//       const foundedSchoolCourseDetails = schoolCourseDatabaseData.find(
//         (schoolCourse) => schoolCourse.id === changedCurriculum.schoolCourseId
//       );
//       if (foundedSchoolCourseDetails) {
//         const result = Math.floor(
//           indexDaysToUpdate.length / foundedSchoolCourseDetails.bundleDays
//         );
//         const rest =
//           indexDaysToUpdate.length % foundedSchoolCourseDetails.bundleDays;
//         const newExcludeCurriculum = excludeCurriculum.map((curriculum, i) => {
//           if (i === index) {
//             return {
//               exclude: curriculum.exclude,
//               id: curriculum.id,
//               date: curriculum.date,
//               isExperimental: curriculum.isExperimental,
//               indexDays: indexDaysToUpdate,
//               price:
//                 result * foundedSchoolCourseDetails.priceBundle +
//                 rest *
//                   (foundedSchoolCourseDetails.priceUnit *
//                     systemConstantsValues!.secondCourseDiscountValue),
//             };
//           } else {
//             // THE REST HAVEN'T CHANGED
//             return curriculum;
//           }
//         });
//         const newWasCurriculumEdit = excludeCurriculum.map((curriculum, i) => {
//           if (i === index) {
//             return {
//               id: curriculum.id,
//               isEdited: true,
//             };
//           } else {
//             // THE REST HAVEN'T CHANGED
//             return {
//               id: curriculum.id,
//               isEdited: false,
//             };
//           }
//         });
//         setWasCurriculumEdit(newWasCurriculumEdit);
//         setExcludeCurriculum(newExcludeCurriculum);
//       }
//     }
//   };

//   function restoreEditedExcludeCurriculum(id: string) {
//     if (studentCurriculumDetails !== undefined) {
//       if (studentCurriculumDetails.length > 0) {
//         const foundedExcludeCurriculum = studentCurriculumDetails.find(
//           (curriculumDetails) => curriculumDetails.id === id
//         );

//         if (foundedExcludeCurriculum) {
//           const newExcludeCurriculum = excludeCurriculum.map((curriculum) => {
//             if (curriculum.id === foundedExcludeCurriculum.id) {
//               return {
//                 exclude: curriculum.exclude,
//                 id: curriculum.id,
//                 date: curriculum.date,
//                 isExperimental: curriculum.isExperimental,
//                 indexDays: foundedExcludeCurriculum.indexDays,
//                 price: foundedExcludeCurriculum.price,
//               };
//             } else {
//               // THE REST HAVEN'T CHANGED
//               return curriculum;
//             }
//           });
//           setExcludeCurriculum(newExcludeCurriculum);
//         }
//       }
//     }
//   }

//   // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- STUDENT SELECT STATES AND FUNCTIONS -------------------------- //
//   // STUDENT SELECTED STATE DATA
//   const [studentSelectedData, setStudentSelectedData] =
//     useState<StudentSearchProps>();

//   // HAVE CURRICULUM STATE
//   const [haveCurriculum, setHaveCurriculum] = useState(false);

//   // INCLUDE / EXLUDE CURRICULUM STATES
//   const [excludeWaitingList, setExcludeWaitingList] = useState<
//     ExcludeWaitingListProps[]
//   >([]);

//   // INCLUDE / EXLUDE CURRICULUM STATES
//   const [excludeCurriculum, setExcludeCurriculum] = useState<
//     ExcludeCurriculumProps[]
//   >([]);

//   // NEW STUDENT CURRICULUM STATE ARRAY
//   const [newStudentCurriculumArray, setNewStudentCurriculumArray] = useState<
//     (string | undefined)[]
//   >([]);

//   // INCLUDE / EXLUDE EXPERIMENTAL CURRICULUM STATES
//   const [excludeExperimentalCurriculum, setExcludeExperimentalCurriculum] =
//     useState<ExcludeCurriculumProps[]>([]);

//   // NEW STUDENT CURRICULUM STATE ARRAY
//   const [
//     newStudentExperimentalCurriculumArray,
//     setNewStudentExperimentalCurriculumArray,
//   ] = useState<(string | undefined)[]>([]);

//   // CHANGE STUDENT CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
//   function handleIncludeExcludeCurriculum(
//     index: number,
//     data: ExcludeCurriculumProps
//   ) {
//     if (data.exclude) {
//       setNewStudentCurriculumArray(
//         newStudentCurriculumArray.filter((id) => id !== data.id)
//       );
//     } else {
//       setNewStudentCurriculumArray((newStudentCurriculumArray) => [
//         ...newStudentCurriculumArray,
//         data.id,
//       ]);
//     }

//     const newExcludeCurriculum = excludeCurriculum.map((curriculum, i) => {
//       if (i === index) {
//         return {
//           exclude: data.exclude,
//           id: data.id,
//           date: data.date,
//           isExperimental: data.isExperimental,
//           indexDays: data.indexDays,
//           price: data.price,
//         };
//       } else {
//         // THE REST HAVEN'T CHANGED
//         return curriculum;
//       }
//     });
//     setExcludeCurriculum(newExcludeCurriculum);
//   }

//   // CHANGE STUDENT EXPERIMENTAL CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
//   function handleIncludeExcludeExperimentalCurriculum(
//     index: number,
//     data: ExcludeCurriculumProps
//   ) {
//     if (data.exclude) {
//       setNewStudentExperimentalCurriculumArray(
//         newStudentExperimentalCurriculumArray.filter((id) => id !== data.id)
//       );
//     } else {
//       setNewStudentExperimentalCurriculumArray(
//         (newStudentExperimentalCurriculumArray) => [
//           ...newStudentExperimentalCurriculumArray,
//           data.id,
//         ]
//       );
//     }
//     const newExcludeExperimentalCurriculum = excludeExperimentalCurriculum.map(
//       (curriculum, i) => {
//         if (i === index) {
//           return {
//             exclude: data.exclude,
//             id: data.id,
//             date: data.date,
//             isExperimental: data.isExperimental,
//             indexDays: data.indexDays,
//             price: data.price,
//           };
//         } else {
//           // THE REST HAVEN'T CHANGED
//           return curriculum;
//         }
//       }
//     );
//     setExcludeExperimentalCurriculum(newExcludeExperimentalCurriculum);
//   }

//   // CHANGE STUDENT WAITING LIST CURRICULUM (INCLUDE / EXCLUDE) FUNCTION
//   function handleIncludeExcludeWaitingCurriculum(
//     index: number,
//     data: ExcludeWaitingListProps
//   ) {
//     const newExcludeWaitingList = excludeWaitingList.map((curriculum, i) => {
//       if (i === index) {
//         return {
//           exclude: data.exclude,
//           id: data.id,
//           date: data.date,
//         };
//       } else {
//         // THE REST HAVEN'T CHANGED
//         return curriculum;
//       }
//     });
//     setExcludeWaitingList(newExcludeWaitingList);
//   }

//   // SET PHONE FORMATTED
//   useEffect(() => {
//     if (studentSelectedData) {
//       setStudentEditData({
//         ...studentEditData,
//         financialResponsible: {
//           ...studentEditData.financialResponsible,
//           phoneSecondary: {
//             ...studentEditData.financialResponsible.phoneSecondary,
//             ddd: studentEditData.financialResponsible.activePhoneSecondary
//               ? studentSelectedData.financialResponsible.phoneSecondary !== ""
//                 ? studentSelectedData.financialResponsible.phoneSecondary.slice(
//                     3,
//                     5
//                   )
//                 : "DDD"
//               : "DDD",
//             number: studentEditData.financialResponsible.activePhoneSecondary
//               ? studentSelectedData.financialResponsible.phoneSecondary.slice(
//                   -9
//                 )
//               : "",
//           },
//           phoneTertiary: {
//             ...studentEditData.financialResponsible.phoneTertiary,
//             ddd: studentEditData.financialResponsible.activePhoneTertiary
//               ? studentSelectedData.financialResponsible.phoneTertiary !== ""
//                 ? studentSelectedData.financialResponsible.phoneTertiary.slice(
//                     3,
//                     5
//                   )
//                 : "DDD"
//               : "DDD",
//             number: studentEditData.financialResponsible.activePhoneTertiary
//               ? studentSelectedData.financialResponsible.phoneTertiary.slice(-9)
//               : "",
//           },
//         },
//       });
//     }
//   }, [
//     studentEditData.financialResponsible.activePhoneSecondary,
//     studentEditData.financialResponsible.activePhoneTertiary,
//   ]);

//   // SET STUDENT SELECTED STATE WITH RECEIVED ID
//   useEffect(() => {
//     if (studentId !== "") {
//       studentsDatabaseData.map((student) => {
//         if (student.id === studentId) {
//           setStudentSelectedData(student);
//         }
//       });
//     }
//   }, [studentId]);

//   // STUDENT FAMILY DETAILS STATE
//   const [studentFamilyDetails, setStudentFamilyDetails] = useState<string[]>(
//     []
//   );

//   // STUDENT CURRICULUM DETAILS STATE
//   const [studentCurriculumDetails, setStudentCurriculumDetails] = useState<
//     CurriculumArrayProps[]
//   >([]);

//   // SET STUDENT EDIT ARRAYS
//   // SET STUDENT FAMILY DETAILS
//   const handleStudentFamilyDetails = async () => {
//     const foundedStudent = studentsDatabaseData.find(
//       (student) => student.id === studentId
//     );

//     if (foundedStudent) {
//       setStudentFamilyDetails(foundedStudent.studentFamilyAtSchool);
//     }
//   };

//   // ARRAY TO STORE ORIGINAL STUDENT CLASS DAYS
//   const [originalStudentClassDays, setOriginalStudentClassDays] = useState<
//     number[]
//   >([]);

//   // SET STUDENT CURRICULUM DETAILS
//   const handleStudentCurriculumDetails = async () => {
//     const foundedStudent = studentsDatabaseData.find(
//       (student) => student.id === studentId
//     );
//     if (foundedStudent) {
//       const allStudentClassDays: number[] = [];
//       foundedStudent.curriculums.map((curriculumDetail) => {
//         setStudentCurriculumDetails((studentCurriculumDetails) => [
//           ...studentCurriculumDetails,
//           curriculumDetail,
//         ]);
//         setNewStudentData({
//           ...newStudentData,
//           indexDays: curriculumDetail.indexDays,
//         });
//         curriculumDetail.indexDays.map((day) => {
//           allStudentClassDays.push(day);
//         });
//       });
//       setOriginalStudentClassDays(allStudentClassDays);
//     }
//   };

//   // SET STUDENT EXPERIMENTAL CURRICULUM DETAILS
//   // const handleStudentExperimentalCurriculumDetails = async () => {
//   //   const foundedStudent = studentsDatabaseData.find(
//   //     (student) => student.id === studentId
//   //   );

//   //   if (foundedStudent) {
//   //     foundedStudent.experimentalCurriculums.map((curriculumDetail) => {
//   //       setStudentCurriculumDetails((studentCurriculumDetails) => [
//   //         ...studentCurriculumDetails,
//   //         curriculumDetail,
//   //       ]);
//   //     });
//   //   }
//   // };

//   // SET STUDENT WAITING LISTS CURRICULUM DETAILS
//   // const handleStudentWaitingListCurriculumDetails = async () => {
//   //   const curriculumsWaiting: WaitingListProps[] = [];
//   //   curriculumDatabaseData.map((curriculum) => {
//   //     curriculum.waitingList.map((studentWaiting) => {
//   //       if (studentWaiting.id === studentId) {
//   //         curriculumsWaiting.push({
//   //           date: studentWaiting.date,
//   //           id: curriculum.id,
//   //         });
//   //       }
//   //     });
//   //   });

//   //   if (curriculumsWaiting.length > 0) {
//   //     curriculumsWaiting.map((waitingCurriculumDetail) => {
//   //       setExcludeWaitingList((excludeWaitingList) => [
//   //         ...excludeWaitingList,
//   //         {
//   //           exclude: false,
//   //           date: waitingCurriculumDetail.date,
//   //           id: waitingCurriculumDetail.id,
//   //         },
//   //       ]);
//   //     });
//   //   } else {
//   //     setExcludeWaitingList([]);
//   //   }
//   // };

//   // SET STUDENT FAMILY ARRAY DETAILS WHEN STUDENT IS SELECTED
//   // useEffect(() => {
//   //   setExcludeExperimentalCurriculum([]);
//   //   setExcludeFamily([]);
//   //   setStudentCurriculumDetails([]);
//   //   setStudentFamilyDetails([]);
//   //   setExcludeWaitingList([]);
//   //   if (studentId !== "") {
//   //     handleStudentFamilyDetails();
//   //     handleStudentCurriculumDetails();
//   //     handleStudentExperimentalCurriculumDetails();
//   //     handleStudentWaitingListCurriculumDetails();
//   //   }
//   // }, [studentId]);

//   // SET STUDENT EDIT WHEN SELECT STUDENT
//   useEffect(() => {
//     if (studentSelectedData) {
//       setDateToString(
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         //@ts-expect-error
//         // studentSelectedData.birthDate.toDate()
//         studentSelectedData.birthDate.toDate().toLocaleDateString()
//       );
//       // SET STUDENT EDIT ALL DATA
//       setStudentEditData({
//         ...studentEditData,
//         // Section 1: Student Data
//         id: studentId,
//         name: studentSelectedData.name,
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         //@ts-expect-error
//         birthDate: studentSelectedData.birthDate.toDate().toLocaleDateString(),
//         schoolYears: studentSelectedData.schoolYears,
//         schoolYearsComplement: studentSelectedData.schoolYearsComplement,
//         parentOne: {
//           name: studentSelectedData.parentOne.name,
//           email: studentSelectedData.parentOne.email,
//           phone: {
//             ddd: studentSelectedData.parentOne.phone.slice(3, 5),
//             number: studentSelectedData.parentOne.phone.slice(-9),
//           },
//         },
//         parentTwo: {
//           name: studentSelectedData.parentTwo.name,
//           email: studentSelectedData.parentTwo.email,
//           phone: {
//             ddd: studentSelectedData.parentTwo.phone.slice(3, 5),
//             number: studentSelectedData.parentTwo.phone.slice(-9),
//           },
//         },

//         // Section 2: Student Course and Family Data | Prices
//         enrolmentExemption: studentSelectedData.enrolmentExemption,
//         enrolmentFee: studentSelectedData.enrolmentFee,
//         enrolmentFeePaid: studentSelectedData.enrolmentFeePaid,
//         fullPrice: studentSelectedData.fullPrice,
//         appliedPrice: studentSelectedData.appliedPrice,
//         customDiscount: studentSelectedData.customDiscount,
//         customDiscountValue: studentSelectedData.customDiscountValue,
//         employeeDiscount: studentSelectedData.employeeDiscount,
//         familyDiscount: studentSelectedData.familyDiscount,
//         studentFamilyAtSchool: studentSelectedData.studentFamilyAtSchool,
//         secondCourseDiscount: studentSelectedData.secondCourseDiscount,
//         paymentDay: studentSelectedData.paymentDay!,

//         // Section 3: Student Financial Responsible Data
//         financialResponsible: {
//           name: studentSelectedData.financialResponsible.name,
//           document: studentSelectedData.financialResponsible.document,
//           email: studentSelectedData.financialResponsible.email,
//           address: {
//             street: studentSelectedData.financialResponsible.address.street,
//             number: studentSelectedData.financialResponsible.address.number,
//             complement:
//               studentSelectedData.financialResponsible.address.complement,
//             neighborhood:
//               studentSelectedData.financialResponsible.address.neighborhood,
//             city: studentSelectedData.financialResponsible.address.city,
//             state: studentSelectedData.financialResponsible.address.state,
//             cep: studentSelectedData.financialResponsible.address.cep,
//           },
//           phone: {
//             ddd: studentSelectedData.financialResponsible.phone.slice(3, 5),
//             number: studentSelectedData.financialResponsible.phone.slice(-9),
//           },
//           activePhoneSecondary:
//             studentSelectedData.financialResponsible.phoneSecondary !== ""
//               ? true
//               : false,
//           phoneSecondary: {
//             ddd: studentSelectedData.financialResponsible.phoneSecondary
//               ? studentSelectedData.financialResponsible.phoneSecondary.slice(
//                   3,
//                   5
//                 )
//               : "DDD",
//             number: studentSelectedData.financialResponsible.phoneSecondary
//               ? studentSelectedData.financialResponsible.phoneSecondary.slice(
//                   -9
//                 )
//               : "",
//           },
//           activePhoneTertiary:
//             studentSelectedData.financialResponsible.phoneTertiary !== ""
//               ? true
//               : false,
//           phoneTertiary: {
//             ddd: studentSelectedData.financialResponsible.phoneTertiary
//               ? studentSelectedData.financialResponsible.phoneTertiary.slice(
//                   3,
//                   5
//                 )
//               : "DDD",
//             number: studentSelectedData.financialResponsible.phoneTertiary
//               ? studentSelectedData.financialResponsible.phoneTertiary.slice(-9)
//               : "",
//           },
//         },
//       });
//       setCurriculumState({
//         appliedPrice: studentSelectedData.appliedPrice,
//         fullPrice: studentSelectedData.fullPrice,
//         enrollmentFee: studentSelectedData.enrolmentFee,
//         curriculums: studentSelectedData.curriculums,
//       });
//     }
//   }, [studentSelectedData]);

//   // SET STUDENT CURRENCY VALUES TO NEW PRICES STATE
//   useEffect(() => {
//     setNewPrices({
//       appliedPrice: studentEditData.appliedPrice,
//       fullPrice: studentEditData.fullPrice,
//     });
//   }, [studentEditData.appliedPrice, studentEditData.fullPrice]);

//   // IF STUDENT HAVE CURRICULUM SET STATE AND SHOW INPUTS
//   useEffect(() => {
//     setExcludeCurriculum([]);
//     setExcludeExperimentalCurriculum([]);
//     // if (studentCurriculumDetails !== undefined) {
//     if (
//       studentCurriculumDetails !== undefined &&
//       studentCurriculumDetails.length > 0
//     ) {
//       setHaveCurriculum(true);
//       for (let index = 0; index < studentCurriculumDetails.length; index++) {
//         if (studentCurriculumDetails[index]! !== undefined) {
//           if (studentCurriculumDetails[index]!.isExperimental) {
//             setExcludeExperimentalCurriculum(
//               (excludeExperimentalCurriculum) => [
//                 ...excludeExperimentalCurriculum,
//                 {
//                   exclude: false,
//                   id: studentCurriculumDetails![index]!.id,
//                   isExperimental:
//                     studentCurriculumDetails![index]!.isExperimental,
//                   date: studentCurriculumDetails![index]!.date,
//                   indexDays: studentCurriculumDetails![index]!.indexDays,
//                   price: studentCurriculumDetails![index]!.price,
//                 },
//               ]
//             );
//           } else {
//             setExcludeCurriculum((excludeCurriculum) => [
//               ...excludeCurriculum,
//               {
//                 exclude: false,
//                 id: studentCurriculumDetails![index]!.id,
//                 isExperimental:
//                   studentCurriculumDetails![index]!.isExperimental,
//                 date: studentCurriculumDetails![index]!.date,
//                 indexDays: studentCurriculumDetails![index]!.indexDays,
//                 price: studentCurriculumDetails![index]!.price,
//               },
//             ]);
//           }
//         }
//       }
//     } else {
//       setHaveCurriculum(false);
//     }
//     // }
//   }, [studentCurriculumDetails]);
//   // -------------------------- END OF STUDENT SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- STUDENT EDIT STATES AND FUNCTIONS -------------------------- //
//   // DATE TO STRING STATE
//   const [dateToString, setDateToString] = useState("");

//   // EDIT ADDRESS STATE
//   const [editAddress, setEditAddress] = useState(false);

//   // HAVE FAMILY STATE
//   const [haveFamily, setHaveFamily] = useState(false);

//   // GET BROTHER NAME TO PUT ON FORM
//   useEffect(() => {
//     if (studentFamilyDetails !== undefined) {
//       if (studentFamilyDetails.length > 0) {
//         setExcludeFamily([]);
//         setHaveFamily(true);
//         for (let index = 0; index < studentFamilyDetails.length; index++) {
//           setExcludeFamily((excludeFamily) => [
//             ...excludeFamily,
//             {
//               exclude: false,
//               // applyDiscount: studentFamilyDetails![index]!.applyDiscount,
//               id: studentFamilyDetails![index]!,
//             },
//           ]);
//         }
//       } else {
//         setHaveFamily(false);
//       }
//     }
//   }, [studentFamilyDetails]);

//   // INCLUDE / EXLUDE FAMILY STATES
//   const [excludeFamily, setExcludeFamily] = useState<ExcludeFamilyProps[]>([]);

//   // NEW STUDENT FAMILY STATE ARRAY
//   const [newStudentFamilyArray, setNewStudentFamilyArray] = useState<
//     (string | undefined)[]
//   >([]);

//   // CHANGE STUDENT FAMILY (INCLUDE / EXCLUDE) FUNCTION
//   function handleIncludeExcludeFamily(index: number, data: ExcludeFamilyProps) {
//     if (data.exclude) {
//       setNewStudentFamilyArray(
//         newStudentFamilyArray.filter((id) => id !== data.id)
//       );
//     } else {
//       setNewStudentFamilyArray((newStudentFamilyArray) => [
//         ...newStudentFamilyArray,
//         data.id,
//       ]);
//     }

//     const newExcludeFamily = excludeFamily.map((family, i) => {
//       if (i === index) {
//         return {
//           exclude: data.exclude,
//           // applyDiscount: data.applyDiscount,
//           id: data.id,
//         };
//       } else {
//         // THE REST HAVEN'T CHANGED
//         return family;
//       }
//     });
//     setExcludeFamily(newExcludeFamily);
//   }
//   // -------------------------- END OF STUDENT EDIT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- NEW FAMILY STATES AND FUNCTIONS -------------------------- //
//   // NEW FAMILY SELECTED STATE DATA
//   const [newFamilySelectedData, setNewFamilySelectedData] =
//     useState<StudentSearchProps>();

//   // SET NEW FAMILY SELECTED STATE WHEN SELECT NEW FAMILY
//   useEffect(() => {
//     if (newStudentData.familyId !== "") {
//       setNewFamilySelectedData(
//         studentsDatabaseData.find(({ id }) => id === newStudentData.familyId)
//       );
//     } else {
//       setNewSchoolSelectedData(undefined);
//     }
//   }, [newStudentData.familyId]);

//   // SET FAMILY NAME WHEN SELECTED NEW FAMILY
//   useEffect(() => {
//     if (newFamilySelectedData !== undefined) {
//       setNewStudentData({
//         ...newStudentData,
//         familyName: newFamilySelectedData.name,
//       });
//     }
//   }, [newFamilySelectedData]);

//   // RESET ADD NEW FAMILY CONFIRMATION WHEN NEW FAMILY CHANGE
//   useEffect(() => {
//     setNewStudentData({ ...newStudentData, confirmAddFamily: false });
//   }, [newStudentData.familyId]);
//   // -------------------------- END OF NEW FAMILY STATES AND FUNCTIONS -------------------------- //

//   // ---------------------------------------- ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //
//   // EXPERIMENTAL CURRICULUM DATA
//   const [experimentalCurriculumData, setExperimentalCurriculumData] =
//     useState<SearchCurriculumValidationZProps>({
//       schoolId: "",
//       schoolClassId: "",
//       schoolCourseId: "",
//     });

//   // CURRICULUM DATA
//   const [curriculumData, setCurriculumData] =
//     useState<SearchCurriculumValidationZProps>({
//       schoolId: "",
//       schoolClassId: "",
//       schoolCourseId: "",
//     });

//   // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
//   const [newClassError, setNewClassError] = useState(false);

//   // SCHOOL SELECTED STATE DATA
//   const [newSchoolSelectedData, setNewSchoolSelectedData] =
//     useState<SchoolSearchProps>();

//   // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
//   useEffect(() => {
//     setNewSchoolClassSelectedData(undefined);
//     if (curriculumData.schoolId !== "") {
//       setNewSchoolSelectedData(
//         schoolDatabaseData.find(({ id }) => id === curriculumData.schoolId)
//       );
//     } else {
//       setNewSchoolSelectedData(undefined);
//     }
//   }, [curriculumData.schoolId]);

//   // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
//   useEffect(() => {
//     if (studentEditData.addCurriculum) {
//       (
//         document.getElementById("newSchoolClassSelect") as HTMLSelectElement
//       ).selectedIndex = 0;
//       (
//         document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
//       ).selectedIndex = 0;
//     }
//   }, [curriculumData.schoolId]);
//   // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
//   // SCHOOL CLASS SELECTED STATE DATA
//   const [newSchoolClassSelectedData, setNewSchoolClassSelectedData] =
//     useState<SchoolClassSearchProps>();

//   // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
//   useEffect(() => {
//     if (curriculumData.schoolClassId !== "") {
//       setNewSchoolClassSelectedData(
//         schoolClassDatabaseData.find(
//           ({ id }) => id === curriculumData.schoolClassId
//         )
//       );
//     } else {
//       setNewSchoolClassSelectedData(undefined);
//     }
//   }, [curriculumData.schoolClassId]);

//   // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
//   useEffect(() => {
//     if (studentEditData.addCurriculum) {
//       (
//         document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
//       ).selectedIndex = 0;
//       handleNewAvailableCoursesData();
//     }
//   }, [curriculumData.schoolClassId]);
//   // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
//   // SCHOOL COURSE SELECTED STATE DATA
//   const [newSchoolCourseSelectedData, setNewSchoolCourseSelectedData] =
//     useState<SchoolCourseSearchProps>();

//   // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
//   useEffect(() => {
//     if (curriculumData.schoolCourseId !== "") {
//       setNewSchoolCourseSelectedData(
//         schoolCourseDatabaseData.find(
//           ({ id }) => id === curriculumData.schoolCourseId
//         )
//       );
//     } else {
//       setNewSchoolCourseSelectedData(undefined);
//     }
//   }, [curriculumData.schoolCourseId]);

//   // SET SCHOOL COURSE PRICES WHEN SELECTED COURSE
//   useEffect(() => {
//     if (newStudentData.curriculum) {
//       const foundedCurriculum = curriculumDatabaseData.find(
//         (curriculum) => curriculum.id === newStudentData.curriculum
//       );

//       if (foundedCurriculum) {
//         const foundedSchoolCourse = schoolCourseDatabaseData.find(
//           (schoolCourse) => schoolCourse.id === foundedCurriculum.schoolCourseId
//         );
//         if (foundedSchoolCourse) {
//           setNewStudentData({
//             ...newStudentData,
//             curriculumCourseBundleDays: foundedSchoolCourse.bundleDays,
//             curriculumCoursePriceBundle: foundedSchoolCourse.priceBundle,
//             curriculumCoursePriceUnit: foundedSchoolCourse.priceUnit,
//           });
//         }
//       }
//     }
//   }, [newStudentData.curriculum, newClass]);

//   // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
//   // CURRICULUM DETAILS ARRAY STATE
//   const [newCurriculumCoursesData, setNewCurriculumCoursesData] = useState<
//     CurriculumSearchProps[]
//   >([]);

//   // GETTING CURRICULUM DATA
//   const handleNewAvailableCoursesData = async () => {
//     if (curriculumData.schoolCourseId === "all") {
//       const filterCurriculum = curriculumDatabaseData.filter(
//         (curriculum) =>
//           curriculum.schoolId === curriculumData.schoolId &&
//           curriculum.schoolClassIds.includes(curriculumData.schoolClassId)
//       );
//       setNewCurriculumCoursesData(filterCurriculum);
//     } else {
//       const filterCurriculum = curriculumDatabaseData.filter(
//         (curriculum) =>
//           curriculum.schoolId === curriculumData.schoolId &&
//           curriculum.schoolClassIds.includes(curriculumData.schoolClassId) &&
//           curriculum.schoolCourseId === curriculumData.schoolCourseId
//       );
//       setNewCurriculumCoursesData(filterCurriculum);
//     }
//   };

//   // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
//   useEffect(() => {
//     handleNewAvailableCoursesData();
//   }, [curriculumData.schoolCourseId]);
//   // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
//   // NEW CURRICULUM CLASS DAY SELECTED STATE DATA
//   const [classDayCurriculumSelectedData, setClassDayCurriculumSelectedData] =
//     useState<ClassDaySearchProps>();

//   // DAY ALREADY WITH CLASS ALERT
//   const [dayIsAlreadyWithClass, setDayIsAlreadyWithClass] = useState(false);

//   // GET CLASS DAY FULL DATA WHEN HAVE CURRICULUM SELECTED DATA
//   useEffect(() => {
//     const handleNewCurriculumClassDayFullData = async () => {
//       const filterClassDays = classDaysDatabaseData.find(
//         (classDays) => classDays.id === newStudentData.curriculumClassDayId
//       );

//       if (filterClassDays) {
//         setClassDayCurriculumSelectedData(filterClassDays);
//       } else {
//         setClassDayCurriculumSelectedData(undefined);
//       }
//     };
//     handleNewCurriculumClassDayFullData();
//   }, [newStudentData.curriculumClassDayId]);

//   // ARRAY TO GET ENROLLED DAYS STATE
//   const [newClassDayArray, setNewClassDayArray] = useState<number[]>([]);

//   // COUNTING ENROLLED DAYS STATE
//   const [daysFoundCount, setDaysFoundCount] = useState(0);

//   // GET THE DAY TO KNOW IF IT ALREADY EXISTS ON STUDENT DATABASE
//   useEffect(() => {
//     if (daysFoundCount > 0) {
//       setDayIsAlreadyWithClass(true);
//     } else {
//       setDayIsAlreadyWithClass(false);
//     }
//   }, [daysFoundCount]);

//   // SET AN ARRAY WITH ENROLLED DAYS WHEN CLASS DAY CURRICULUM IS SELECTED
//   useEffect(() => {
//     setNewStudentData({
//       ...newStudentData,
//       indexDays: originalStudentClassDays,
//     });
//     setNewClassDayArray([]);
//     setDaysFoundCount(0);
//     if (classDayCurriculumSelectedData) {
//       const daysToNewClassDayArray = [] as number[];
//       classDayCurriculumSelectedData.indexDays.map((curriculumClassDay) => {
//         const alreadyExists =
//           newStudentData.indexDays.includes(curriculumClassDay);
//         if (!alreadyExists) {
//           const existInArray =
//             daysToNewClassDayArray.includes(curriculumClassDay);
//           // const existInArray = newClassDayArray.includes(curriculumClassDay);
//           if (!existInArray) {
//             daysToNewClassDayArray.push(curriculumClassDay);
//           }
//         }
//         const showMessage =
//           newStudentData.indexDays.includes(curriculumClassDay);
//         if (showMessage) {
//           setDaysFoundCount(daysFoundCount + 1);
//         }
//       });
//       setNewClassDayArray(daysToNewClassDayArray);
//     }
//   }, [
//     classDayCurriculumSelectedData,
//     newStudentData.curriculum,
//     // excludeCurriculum,
//   ]);

//   // SET NEW CLASS ENROLLED DAYS
//   useEffect(() => {
//     setNewClass({
//       ...newClass,
//       enrolledDays: newClassDayArray,
//     });
//   }, [newClassDayArray]);

//   // -------------------------- END OF NEW CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //
//   // NEW EXPERIMENTAL CURRICULUM CLASS DAY SELECTED STATE DATA
//   const [
//     classDayExperimentalCurriculumSelectedData,
//     setClassDayExperimentalCurriculumSelectedData,
//   ] = useState<ClassDaySearchProps>();

//   // GET CLASS DAY FULL DATA WHEN HAVE EXPERIMENTAL CURRICULUM SELECTED DATA
//   useEffect(() => {
//     const handleNewExperimentalCurriculumClassDayFullData = async () => {
//       const filterClassDays = classDaysDatabaseData.find(
//         (classDays) =>
//           classDays.id === newStudentData.experimentalCurriculumClassDayId
//       );

//       if (filterClassDays) {
//         setClassDayExperimentalCurriculumSelectedData(filterClassDays);
//       } else {
//         setClassDayExperimentalCurriculumSelectedData(undefined);
//       }
//     };
//     handleNewExperimentalCurriculumClassDayFullData();
//   }, [newStudentData.experimentalCurriculumClassDayId]);

//   // -------------------------- END OF NEW EXPERIMENTAL CURRICULUM CLASS DAY STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
//   // EXPERIMENTAL CLASS ERROR STATE
//   const [experimentalClassError, setExperimentalClassError] = useState(false);

//   // SCHOOL SELECTED STATE DATA
//   const [
//     newExperimentalSchoolSelectedData,
//     setNewExperimentalSchoolSelectedData,
//   ] = useState<SchoolSearchProps>();

//   // SET SCHOOL SELECTED STATE WHEN SELECT SCHOOL
//   useEffect(() => {
//     setNewExperimentalSchoolClassSelectedData(undefined);
//     if (experimentalCurriculumData.schoolId !== "") {
//       setNewExperimentalSchoolSelectedData(
//         schoolDatabaseData.find(
//           ({ id }) => id === experimentalCurriculumData.schoolId
//         )
//       );
//     } else {
//       setNewExperimentalSchoolSelectedData(undefined);
//     }
//   }, [experimentalCurriculumData.schoolId]);

//   // RESET SCHOOL CLASS, CURRICULUM AND STUDENT SELECT TO INDEX 0 WHEN SCHOOL CHANGE
//   useEffect(() => {
//     if (studentEditData.addExperimentalCurriculum) {
//       (
//         document.getElementById(
//           "newExperimentalSchoolClassSelect"
//         ) as HTMLSelectElement
//       ).selectedIndex = 0;
//       (
//         document.getElementById(
//           "newExperimentalSchoolCourseSelect"
//         ) as HTMLSelectElement
//       ).selectedIndex = 0;
//     }
//   }, [experimentalCurriculumData.schoolId]);
//   // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
//   // SCHOOL CLASS SELECTED STATE DATA
//   const [
//     newExperimentalSchoolClassSelectedData,
//     setNewExperimentalSchoolClassSelectedData,
//   ] = useState<SchoolClassSearchProps>();

//   // SET SCHOOL CLASS SELECTED STATE WHEN SELECT SCHOOL CLASS
//   useEffect(() => {
//     if (experimentalCurriculumData.schoolClassId !== "") {
//       setNewExperimentalSchoolClassSelectedData(
//         schoolClassDatabaseData.find(
//           ({ id }) => id === experimentalCurriculumData.schoolClassId
//         )
//       );
//     } else {
//       setNewExperimentalSchoolClassSelectedData(undefined);
//     }
//   }, [experimentalCurriculumData.schoolClassId]);

//   // RESET CURRICULUM AND STUDENT SELECT TO INDEX 0 AND GET AVAILABLE COURSES DATA WHEN SCHOOL CLASS CHANGE
//   useEffect(() => {
//     if (studentEditData.addExperimentalCurriculum) {
//       (
//         document.getElementById(
//           "newExperimentalSchoolCourseSelect"
//         ) as HTMLSelectElement
//       ).selectedIndex = 0;
//       handleNewAvailableExperimentalCoursesData();
//     }
//   }, [experimentalCurriculumData.schoolClassId]);
//   // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //
//   // SCHOOL COURSE SELECTED STATE DATA
//   const [
//     newExperimentalSchoolCourseSelectedData,
//     setNewExperimentalSchoolCourseSelectedData,
//   ] = useState<SchoolCourseSearchProps>();

//   // SET SCHOOL COURSE SELECTED STATE WHEN SELECT SCHOOL COURSE
//   useEffect(() => {
//     if (experimentalCurriculumData.schoolCourseId !== "") {
//       setNewExperimentalSchoolCourseSelectedData(
//         schoolCourseDatabaseData.find(
//           ({ id }) => id === experimentalCurriculumData.schoolCourseId
//         )
//       );
//     } else {
//       setNewExperimentalSchoolCourseSelectedData(undefined);
//     }
//   }, [experimentalCurriculumData.schoolCourseId]);
//   // -------------------------- END OF SCHOOL COURSE SELECT STATES AND FUNCTIONS -------------------------- //

//   // -------------------------- CURRICULUM STATES AND FUNCTIONS -------------------------- //
//   // CURRICULUM DETAILS ARRAY STATE
//   const [
//     newExperimentalCurriculumCoursesData,
//     setNewExperimentalCurriculumCoursesData,
//   ] = useState<CurriculumSearchProps[]>([]);

//   // GETTING CURRICULUM DATA
//   const handleNewAvailableExperimentalCoursesData = async () => {
//     if (experimentalCurriculumData.schoolCourseId === "all") {
//       const filterCurriculum = curriculumDatabaseData.filter(
//         (curriculum) =>
//           curriculum.schoolId === experimentalCurriculumData.schoolId &&
//           curriculum.schoolClassIds.includes(
//             experimentalCurriculumData.schoolClassId
//           )
//       );
//       setNewExperimentalCurriculumCoursesData(filterCurriculum);
//     } else {
//       const filterCurriculum = curriculumDatabaseData.filter(
//         (curriculum) =>
//           curriculum.schoolId === experimentalCurriculumData.schoolId &&
//           curriculum.schoolClassIds.includes(
//             experimentalCurriculumData.schoolClassId
//           ) &&
//           curriculum.schoolCourseId ===
//             experimentalCurriculumData.schoolCourseId
//       );
//       setNewExperimentalCurriculumCoursesData(filterCurriculum);
//     }
//   };

//   // GET AVAILABLE COURSES DATA WHEN SCHOOL COURSE CHANGE
//   useEffect(() => {
//     handleNewAvailableExperimentalCoursesData();
//   }, [experimentalCurriculumData.schoolCourseId]);
//   // -------------------------- END OF CURRICULUM STATES AND FUNCTIONS -------------------------- //

//   // SET SELECTS INDEX WHEN ARE CHANGES
//   // WHEN ADD FAMILY CHANGE
//   useEffect(() => {
//     if (studentSelectedData) {
//       setNewStudentData({
//         ...newStudentData,
//         familyId: "",
//         newFamilySchoolId: "",
//         newFamilySchoolClassId: "",
//         newFamilyCurriculumId: "",
//       });
//       if (studentEditData.addFamily) {
//         (
//           document.getElementById("newFamilyStudentSelect") as HTMLSelectElement
//         ).selectedIndex = 0;
//       }
//     }
//   }, [studentEditData.addFamily]);

//   // WHEN ADD CURRICULUM CHANGE
//   useEffect(() => {
//     if (studentSelectedData) {
//       setNewStudentData({
//         ...newStudentData,
//         curriculum: "",
//         curriculumClassDayId: "",
//         curriculumInitialDate: "",
//         curriculumName: "",
//         confirmAddCurriculum: false,
//       });
//       if (studentEditData.addCurriculum) {
//         (
//           document.getElementById("newSchoolSelect") as HTMLSelectElement
//         ).selectedIndex = 0;
//         (
//           document.getElementById("newSchoolClassSelect") as HTMLSelectElement
//         ).selectedIndex = 0;
//         (
//           document.getElementById("newSchoolCourseSelect") as HTMLSelectElement
//         ).selectedIndex = 0;
//       }
//     }
//   }, [studentEditData.addCurriculum]);

//   // WHEN ADD EXPERIMENTAL CURRICULUM CHANGE
//   useEffect(() => {
//     if (studentSelectedData) {
//       setNewStudentData({
//         ...newStudentData,
//         experimentalCurriculum: "",
//         experimentalCurriculumClassDayId: "",
//         experimentalCurriculumInitialDate: "",
//         experimentalCurriculumName: "",
//         confirmAddExperimentalCurriculum: false,
//       });
//       if (studentEditData.addExperimentalCurriculum) {
//         (
//           document.getElementById(
//             "newExperimentalSchoolSelect"
//           ) as HTMLSelectElement
//         ).selectedIndex = 0;
//         (
//           document.getElementById(
//             "newExperimentalSchoolClassSelect"
//           ) as HTMLSelectElement
//         ).selectedIndex = 0;
//         (
//           document.getElementById(
//             "newExperimentalSchoolCourseSelect"
//           ) as HTMLSelectElement
//         ).selectedIndex = 0;
//       }
//     }
//   }, [studentEditData.addExperimentalCurriculum]);

//   // ---------------------------------------- END OF ADD NEW CURRICULUM STATES AND FUNCTIONS ---------------------------------------- //

//   // CHANGE MONTHLY PAYMENT WHEN ADD SCHOOL CLASS
//   // SECOND CURRICULUM DATE AND PRICE CALC STATE
//   const [curriculumDatePriceCalc, setCurriculumDatePriceCalc] = useState({
//     mostExpensiveCourse: 0,
//     othersPriceSum: 0,
//   });

//   // CHECKING IF STUDENT WILL HAVE CURRICULUM AFTER CHANGINGS
//   useEffect(() => {
//     setCurriculumDatePriceCalc({
//       mostExpensiveCourse: 0,
//       othersPriceSum: 0,
//     });
//   }, [excludeCurriculum]);

//   // CALC OF MOST EXPENSIVE COURSE PRICE AND SUM THE SMALLEST VALUES
//   // useEffect(() => {
//   //   if (
//   //     curriculumDatePriceCalc.mostExpensiveCourse === 0 ||
//   //     curriculumDatePriceCalc.othersPriceSum === 0
//   //   ) {
//   //     excludeCurriculum.map((curriculumDetail: ExcludeCurriculumProps) => {
//   //       if (!curriculumDetail.exclude) {
//   //         if (
//   //           curriculumDetail.price > curriculumDatePriceCalc.mostExpensiveCourse
//   //         ) {
//   //           setCurriculumDatePriceCalc({
//   //             ...curriculumDatePriceCalc,
//   //             mostExpensiveCourse: curriculumDetail.price,
//   //           });
//   //         } else {
//   //           setCurriculumDatePriceCalc({
//   //             ...curriculumDatePriceCalc,
//   //             othersPriceSum:
//   //               curriculumDatePriceCalc.othersPriceSum + curriculumDetail.price,
//   //           });
//   //         }
//   //       }
//   //     });
//   //   }
//   // }, [curriculumDatePriceCalc]);

//   // STATE TO TOGGLE SHOW ADD FAMILY ON FORM
//   const [willHaveFamily, setWillHaveFamily] = useState(false);

//   // MONITORING EXCLUDE FAMILY TO SET WILL HAVE FAMILY
//   useEffect(() => {
//     let haveFamilyWill = false;
//     excludeFamily.map((familyExclude) => {
//       if (!familyExclude.exclude) {
//         haveFamilyWill = true;
//       } else {
//         haveFamilyWill = false;
//       }
//     });
//     setWillHaveFamily(haveFamilyWill);
//   }, [excludeFamily]);

//   useEffect(() => {
//     if (willHaveFamily) {
//       setStudentEditData({ ...studentEditData, addFamily: false });
//     }
//   }, [willHaveFamily]);

//   // MONITORING IF WAITING LIST IS ENROLLING
//   const [
//     showEnrollWaitingCurriculumDetails,
//     setShowEnrollWaitingCurriculumDetails,
//   ] = useState(false);

//   const [addEnrollWaitingCurriculum, setAddEnrollWaitingCurriculum] =
//     useState(false);

//   // WAITING LIST ENROLLMENT HANDLING FUNCTION
//   const handleEnrollWithCurriculum = (curriculumId: string) => {
//     // SEARCHING CURRICULUM IN THE DATABASE
//     const foundedCurriculum = curriculumDatabaseData.find(
//       (curriculum) => curriculum.id === curriculumId
//     );

//     // UNCHECKING ADD CURRICULUM CHECKBOX
//     setStudentEditData((prevData) => ({
//       ...prevData,
//       addCurriculum: false,
//     }));

//     // CHECKING ALL CLASSDAYSDATA DAYS
//     setClassDaysData((prevData) => ({
//       ...prevData,
//       Domingo: true,
//       Segunda: true,
//       Terça: true,
//       Quarta: true,
//       Quinta: true,
//       Sexta: true,
//       Sábado: true,
//     }));

//     setNewClass({
//       ...newClass,
//       enrolledDays: [],
//     });

//     if (foundedCurriculum) {
//       setAddEnrollWaitingCurriculum(true);
//       setCurriculumData({
//         ...curriculumData,
//         schoolId: foundedCurriculum.schoolId,
//         // schoolClassIds: foundedCurriculum.schoolClassIds,
//         schoolCourseId: foundedCurriculum.schoolCourseId,
//       });
//       setNewStudentData({
//         ...newStudentData,
//         curriculum: foundedCurriculum.id,
//         curriculumClassDayId: foundedCurriculum.classDayId,
//         confirmAddCurriculum: false,
//       });
//       setNewClass({
//         ...newClass,
//         date: "",
//       });
//       setClassDaysData({
//         Domingo: true,
//         Segunda: true,
//         Terça: true,
//         Quarta: true,
//         Quinta: true,
//         Sexta: true,
//         Sábado: true,
//       });
//       setShowEnrollWaitingCurriculumDetails(true);
//     }
//   };

//   // SET MONTHLY PAYMENT WHEN SCHOOL COURSE PRICE, OR ADD FAMILY, OR EMPLOYEE DISCOUNT CHANGE
//   useEffect(() => {
//     let haveFamilyWill = false;
//     excludeFamily.map((familyExclude) => {
//       if (!familyExclude.exclude) {
//         haveFamilyWill = true;
//       } else {
//         haveFamilyWill = false;
//       }
//     });

//     let haveCurriculumWill = false;

//     const checkCurriculumForDiscount = excludeCurriculum.filter(
//       (curriculum) => !curriculum.exclude
//     );

//     excludeCurriculum.find((curriculumExclude) => {
//       if (!curriculumExclude.exclude) {
//         haveCurriculumWill = true;
//       }
//     });

//     if (studentId !== "" && studentEditData.name !== "" && excludeCurriculum) {
//       // DISCOUNT VARIABLE
//       const customDiscountValueSum =
//         100 -
//         (studentEditData.customDiscount
//           ? +studentEditData.customDiscountValue!
//           : 0);
//       const customDiscountFinalValue =
//         !studentEditData.customDiscount ||
//         studentEditData.customDiscountValue === "0" ||
//         studentEditData.customDiscountValue === ""
//           ? 1
//           : +`0.${
//               customDiscountValueSum > 9
//                 ? customDiscountValueSum
//                 : `0${customDiscountValueSum}`
//             }`;

//       const discountVariable = studentEditData.customDiscount
//         ? customDiscountFinalValue
//         : studentEditData.employeeDiscount
//         ? systemConstantsValues!.employeeDiscountValue
//         : (haveFamilyWill && studentEditData.familyDiscount) ||
//           studentEditData.addFamily
//         ? systemConstantsValues!.familyDiscountValue
//         : checkCurriculumForDiscount.length > 1 ||
//           (checkCurriculumForDiscount.length === 1 &&
//             studentEditData.addCurriculum)
//         ? systemConstantsValues!.secondCourseDiscountValue
//         : 1; // WITHOUT DISCOUNT

//       if (haveCurriculumWill) {
//         const curriculumsAfterChanging = excludeCurriculum.filter(
//           (curriculum) => !curriculum.exclude
//         );
//         let smallestPrice = 0;
//         let olderSmallestPrice = 0;
//         let otherSumPrices = 0;
//         curriculumsAfterChanging.map((curriculum, index) => {
//           if (index === 0) {
//             smallestPrice = curriculum.price;
//           } else {
//             if (curriculum.price <= smallestPrice) {
//               olderSmallestPrice = smallestPrice;
//               smallestPrice = curriculum.price;
//               otherSumPrices = olderSmallestPrice + otherSumPrices;
//             } else {
//               otherSumPrices = otherSumPrices + curriculum.price;
//             }
//           }
//         });
//         let newSmallestPrice = smallestPrice;
//         let newOtherSumPrices = 0;
//         const result = Math.floor(
//           newClass.enrolledDays.length /
//             newStudentData.curriculumCourseBundleDays
//         );
//         const rest =
//           newClass.enrolledDays.length %
//           newStudentData.curriculumCourseBundleDays;
//         let newCoursePrice;
//         if (
//           !curriculumEmptyWaitingList &&
//           !showEnrollWaitingCurriculumDetails
//         ) {
//           newCoursePrice = 0;
//         } else if (isNaN(result) || isNaN(rest)) {
//           newCoursePrice = 0;
//         } else {
//           newCoursePrice =
//             result * newStudentData.curriculumCoursePriceBundle +
//             rest *
//               (newStudentData.curriculumCoursePriceUnit *
//                 systemConstantsValues!.secondCourseDiscountValue);
//         }
//         if (newCoursePrice !== 0) {
//           if (newSmallestPrice >= newCoursePrice) {
//             smallestPrice = newSmallestPrice;
//             newSmallestPrice = newCoursePrice;
//             newOtherSumPrices = smallestPrice + otherSumPrices;
//           } else {
//             newOtherSumPrices = otherSumPrices + newCoursePrice;
//           }

//           setNewPrices({
//             appliedPrice:
//               newSmallestPrice * discountVariable + newOtherSumPrices,
//             fullPrice: newSmallestPrice + newOtherSumPrices,
//           });
//         } else {
//           setNewPrices({
//             appliedPrice: smallestPrice * discountVariable + otherSumPrices,
//             fullPrice: smallestPrice + otherSumPrices,
//           });
//         }
//       } else if (
//         studentEditData.addCurriculum ||
//         showEnrollWaitingCurriculumDetails
//       ) {
//         // ----------- CALC ALSO PRESENT IN INSERT STUDENT ----------- //
//         if (
//           !curriculumEmptyWaitingList &&
//           !showEnrollWaitingCurriculumDetails
//         ) {
//           setNewPrices({
//             appliedPrice: 0,
//             fullPrice: 0,
//           });
//         } else if (newClass.enrolledDays.length === 0) {
//           setNewPrices({
//             appliedPrice: 0,
//             fullPrice: 0,
//           });
//         } else if (newClass.enrolledDays.length === 1) {
//           setNewPrices({
//             appliedPrice: newStudentData.curriculumCoursePriceUnit,
//             fullPrice: newStudentData.curriculumCoursePriceUnit,
//           });
//         } else if (newClass.enrolledDays.length > 1) {
//           const result = Math.floor(
//             newClass.enrolledDays.length /
//               newStudentData.curriculumCourseBundleDays
//           );
//           const rest =
//             newClass.enrolledDays.length %
//             newStudentData.curriculumCourseBundleDays;
//           setNewPrices({
//             appliedPrice:
//               result * newStudentData.curriculumCoursePriceBundle +
//               rest * newStudentData.curriculumCoursePriceUnit,
//             fullPrice:
//               result * newStudentData.curriculumCoursePriceBundle +
//               rest * newStudentData.curriculumCoursePriceUnit,
//           });
//         }
//         // ----------- CALC ALSO PRESENT IN INSERT STUDENT ----------- //
//       } else {
//         setNewPrices({
//           appliedPrice: 0,
//           fullPrice: 0,
//         });
//       }
//     }
//   }, [
//     studentId,
//     studentEditData.familyDiscount,
//     studentEditData.employeeDiscount,
//     studentEditData.customDiscount,
//     studentEditData.secondCourseDiscount,
//     studentEditData.customDiscountValue,
//     studentEditData.addFamily,
//     studentEditData.addCurriculum,
//     excludeCurriculum,
//     excludeFamily,
//     newStudentData.curriculum,
//     newClass.enrolledDays,
//     showEnrollWaitingCurriculumDetails,
//   ]);

//   // REACT HOOK FORM SETTINGS
//   const methods = useForm<EditStudentValidationZProps>({
//     resolver: zodResolver(editStudentValidationSchema),
//     defaultValues: {
//       // Section 1: Student Data
//       id: "",
//       name: "",
//       birthDate: "",
//       schoolYears: "",
//       schoolYearsComplement: "",
//       parentOne: {
//         name: "",
//         email: "",
//         phone: {
//           ddd: "",
//           number: "",
//         },
//       },
//       parentTwo: {
//         name: "",
//         email: "",
//         phone: {
//           ddd: "",
//           number: "",
//         },
//       },

//       // Section 2: Student Course and Family Data | Prices
//       addCurriculum: false,
//       addExperimentalCurriculum: false,
//       addFamily: false,
//       enrolmentFee: 0,
//       enrolmentFeePaid: false,
//       fullPrice: 0,
//       appliedPrice: 0,
//       enrolmentExemption: false,
//       customDiscount: false,
//       customDiscountValue: "",
//       employeeDiscount: false,
//       familyDiscount: false,
//       secondCourseDiscount: false,
//       paymentDay: "",

//       // Section 3: Student Financial Responsible Data
//       financialResponsible: {
//         name: "",
//         document: "",
//         email: "",
//         address: {
//           street: "",
//           number: "",
//           complement: "",
//           neighborhood: "",
//           city: "",
//           state: "",
//           cep: "",
//         },
//         phone: {
//           ddd: "",
//           number: "",
//         },
//         activePhoneSecondary: false,
//         phoneSecondary: {
//           ddd: "",
//           number: "",
//         },
//         activePhoneTertiary: false,
//         phoneTertiary: {
//           ddd: "",
//           number: "",
//         },
//       },
//     },
//   });

//   // REACT HOOK FORM VARIABLES
//   const {
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = methods;

//   const [renewBirthDayValue, setRenewBirthDayValue] = useState(false);

//   // RESET FORM FUNCTION
//   const resetForm = () => {
//     setRenewBirthDayValue(!renewBirthDayValue);
//     setNewPrices({
//       appliedPrice: 0,
//       fullPrice: 0,
//     });
//     setStudentEditData({
//       // Section 1: Student Data
//       id: "",
//       name: "",
//       document: "",
//       birthDate: "",
//       schoolYears: "",
//       schoolYearsComplement: "",
//       parentOne: {
//         name: "",
//         email: "",
//         phone: {
//           ddd: "",
//           number: "",
//         },
//       },
//       parentTwo: {
//         name: "",
//         email: "",
//         phone: {
//           ddd: "",
//           number: "",
//         },
//       },

//       // Section 2: Student Course and Family Data | Prices
//       addCurriculum: false,
//       addExperimentalCurriculum: false,
//       addFamily: false,
//       studentFamilyAtSchool: [],
//       enrolmentExemption: false,
//       enrolmentFee: 0,
//       enrolmentFeePaid: false,
//       customDiscount: false,
//       customDiscountValue: "",
//       employeeDiscount: false,
//       familyDiscount: false,
//       secondCourseDiscount: false,
//       fullPrice: 0,
//       appliedPrice: 0,
//       paymentDay: "",

//       // Section 3: Student Financial Responsible Data
//       financialResponsible: {
//         name: "",
//         document: "",
//         email: "",
//         address: {
//           street: "",
//           number: "",
//           complement: "",
//           neighborhood: "",
//           city: "",
//           state: "",
//           cep: "",
//         },
//         phone: {
//           ddd: "",
//           number: "",
//         },
//         activePhoneSecondary: false,
//         phoneSecondary: {
//           ddd: "",
//           number: "",
//         },
//         activePhoneTertiary: false,
//         phoneTertiary: {
//           ddd: "",
//           number: "",
//         },
//       },
//     });
//     setStudentData &&
//       setStudentData({
//         schoolId: "",
//         schoolClassId: "",
//         curriculumId: "",
//         studentId: "",
//         schoolCoursePriceUnit: 0,
//         schoolCoursePriceBundle: 0,
//         schoolCourseBundleDays: 0,
//       });
//     setNewStudentData({
//       confirmAddFamily: false,
//       confirmAddCurriculum: false,
//       confirmAddExperimentalCurriculum: false,
//       curriculum: "",
//       curriculumName: "",
//       curriculumClassDayId: "",
//       curriculumInitialDate: "",
//       curriculumCoursePriceUnit: 0,
//       curriculumCoursePriceBundle: 0,
//       curriculumCourseBundleDays: 0,
//       experimentalCurriculum: "",
//       experimentalCurriculumName: "",
//       experimentalCurriculumClassDayId: "",
//       experimentalCurriculumInitialDate: "",
//       familyId: "",
//       familyName: "",
//       newFamilySchoolId: "",
//       newFamilySchoolClassId: "",
//       newFamilyCurriculumId: "",
//       indexDays: [],
//     });
//     setDayIsAlreadyWithClass(false);
//     setNewClass({
//       date: "",
//       enrolledDays: [],
//       name: "",
//     });
//     setCurriculumData({
//       schoolId: "",
//       schoolClassId: "",
//       schoolCourseId: "",
//     });
//     setExperimentalCurriculumData({
//       schoolId: "",
//       schoolClassId: "",
//       schoolCourseId: "",
//     });
//     setExcludeCurriculum([]);
//     setExcludeExperimentalCurriculum([]);
//     setExcludeFamily([]);
//     setStudentFamilyDetails([]);
//     setStudentCurriculumDetails([]);
//     reset();
//     onClose && onClose();
//   };

//   // SET REACT HOOK FORM VALUES
//   useEffect(() => {
//     // Section 1: Student Data
//     setValue("id", studentEditData.id);
//     setValue("name", studentEditData.name);
//     setValue("birthDate", studentEditData.birthDate);
//     setValue("schoolYears", studentEditData.schoolYears);
//     setValue("schoolYearsComplement", studentEditData.schoolYearsComplement);
//     setValue("parentOne.name", studentEditData.parentOne.name);
//     setValue("parentOne.phone.ddd", studentEditData.parentOne.phone.ddd);
//     setValue("parentOne.phone.number", studentEditData.parentOne.phone.number);
//     setValue("parentOne.email", studentEditData.parentOne.email);
//     setValue("parentTwo.name", studentEditData.parentTwo.name);
//     setValue("parentTwo.phone.ddd", studentEditData.parentTwo.phone.ddd);
//     setValue("parentTwo.phone.number", studentEditData.parentTwo.phone.number);
//     setValue("parentTwo.email", studentEditData.parentTwo.email);

//     // Section 2: Student Course and Family Data | Prices
//     setValue("enrolmentExemption", studentEditData.enrolmentExemption);
//     setValue("customDiscount", studentEditData.customDiscount);
//     setValue(
//       "customDiscountValue",
//       studentEditData.customDiscountValue
//         ? studentEditData.customDiscountValue
//         : "0"
//     );
//     setValue("employeeDiscount", studentEditData.employeeDiscount);
//     setValue("familyDiscount", studentEditData.familyDiscount);
//     setValue("secondCourseDiscount", studentEditData.secondCourseDiscount);
//     setValue("paymentDay", studentEditData.paymentDay);
//     setValue("addCurriculum", studentEditData.addCurriculum);
//     setValue(
//       "addExperimentalCurriculum",
//       studentEditData.addExperimentalCurriculum
//     );
//     setValue("addFamily", studentEditData.addFamily);
//     setValue("enrolmentFee", studentEditData.enrolmentFee);
//     setValue("fullPrice", newPrices.fullPrice);
//     setValue("appliedPrice", newPrices.appliedPrice);
//     setValue("customDiscount", studentEditData.customDiscount);
//     setValue("customDiscountValue", studentEditData.customDiscountValue);
//     setValue("employeeDiscount", studentEditData.employeeDiscount);
//     setValue("enrolmentExemption", studentEditData.enrolmentExemption);
//     setValue("familyDiscount", studentEditData.familyDiscount);
//     setValue("secondCourseDiscount", studentEditData.secondCourseDiscount);

//     // Section 3: Student Financial Responsible Data
//     setValue(
//       "financialResponsible.name",
//       studentEditData.financialResponsible.name
//     );
//     setValue(
//       "financialResponsible.document",
//       studentEditData.financialResponsible.document
//     );
//     setValue(
//       "financialResponsible.email",
//       studentEditData.financialResponsible.email
//     );
//     setValue(
//       "financialResponsible.address.street",
//       studentEditData.financialResponsible.address.street
//     );
//     setValue(
//       "financialResponsible.address.number",
//       studentEditData.financialResponsible.address.number
//     );
//     setValue(
//       "financialResponsible.address.complement",
//       studentEditData.financialResponsible.address.complement
//     );
//     setValue(
//       "financialResponsible.address.neighborhood",
//       studentEditData.financialResponsible.address.neighborhood
//     );
//     setValue(
//       "financialResponsible.address.city",
//       studentEditData.financialResponsible.address.city
//     );
//     setValue(
//       "financialResponsible.address.state",
//       studentEditData.financialResponsible.address.state
//     );
//     setValue(
//       "financialResponsible.address.cep",
//       studentEditData.financialResponsible.address.cep
//     );
//     setValue(
//       "financialResponsible.phone.ddd",
//       studentEditData.financialResponsible.phone.ddd
//     );
//     setValue(
//       "financialResponsible.phone.number",
//       studentEditData.financialResponsible.phone.number
//     );
//     setValue(
//       "financialResponsible.activePhoneSecondary",
//       studentEditData.financialResponsible.activePhoneSecondary
//     );
//     setValue(
//       "financialResponsible.phoneSecondary.ddd",
//       studentEditData.financialResponsible.phoneSecondary.ddd
//     );
//     setValue(
//       "financialResponsible.phoneSecondary.number",
//       studentEditData.financialResponsible.phoneSecondary.number
//     );
//     setValue(
//       "financialResponsible.activePhoneTertiary",
//       studentEditData.financialResponsible.activePhoneTertiary
//     );
//     setValue(
//       "financialResponsible.phoneTertiary.ddd",
//       studentEditData.financialResponsible.phoneTertiary.ddd
//     );
//     setValue(
//       "financialResponsible.phoneTertiary.number",
//       studentEditData.financialResponsible.phoneTertiary.number
//     );
//   }, [studentEditData, newPrices, dateToString]);

//   // SET REACT HOOK FORM ERRORS
//   useEffect(() => {
//     const fullErrors = [
//       // Section 1: Student Data
//       errors.id,
//       errors.name,
//       errors.birthDate,
//       errors.schoolYears,
//       errors.schoolYearsComplement,
//       errors.parentOne?.name,
//       errors.parentOne?.email,
//       errors.parentOne?.phone?.ddd,
//       errors.parentOne?.phone?.number,
//       errors.parentTwo?.name,
//       errors.parentTwo?.email,
//       errors.parentTwo?.phone?.ddd,
//       errors.parentTwo?.phone?.number,

//       // Section 2: Student Course and Family Data | Prices
//       errors.addCurriculum,
//       errors.addExperimentalCurriculum,
//       errors.addFamily,
//       errors.enrolmentFee,
//       errors.enrolmentFeePaid,
//       errors.fullPrice,
//       errors.appliedPrice,
//       errors.enrolmentExemption,
//       errors.customDiscount,
//       errors.customDiscountValue,
//       errors.employeeDiscount,
//       errors.familyDiscount,
//       errors.secondCourseDiscount,
//       errors.paymentDay,

//       // Section 3: Student Financial Responsible Data
//       errors.financialResponsible?.name,
//       errors.financialResponsible?.document,
//       errors.financialResponsible?.email,
//       errors.financialResponsible?.address?.street,
//       errors.financialResponsible?.address?.number,
//       errors.financialResponsible?.address?.complement,
//       errors.financialResponsible?.address?.neighborhood,
//       errors.financialResponsible?.address?.city,
//       errors.financialResponsible?.address?.state,
//       errors.financialResponsible?.address?.cep,
//       errors.financialResponsible?.phone?.ddd,
//       errors.financialResponsible?.phone?.number,
//       errors.financialResponsible?.activePhoneSecondary,
//       errors.financialResponsible?.phoneSecondary?.ddd,
//       errors.financialResponsible?.phoneSecondary?.number,
//       errors.financialResponsible?.activePhoneTertiary,
//       errors.financialResponsible?.phoneTertiary?.ddd,
//       errors.financialResponsible?.phoneTertiary?.number,
//     ];

//     fullErrors.map((fieldError) => {
//       toast.error(fieldError?.message, {
//         theme: "colored",
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         autoClose: 3000,
//       });
//     });
//   }, [errors]);

//   // SUBMIT DATA FUNCTION
//   const handleEditStudent: SubmitHandler<EditStudentValidationZProps> = async (
//     data
//   ) => {
//     setIsSubmitting(true);

//     const waitingListPosition =
//       handleOneCurriculumDetails(newStudentData.curriculum)
//         .waitingList.sort(
//           (a, b) => Number(a.date.toDate()) - Number(b.date.toDate())
//         )
//         .findIndex((student) => student.id === data.id) + 1;

//     // CHECKING VALID FINANCIAL RESPONSIBLE DOCUMENT
//     if (!testFinancialCPF) {
//       return (
//         setIsSubmitting(false),
//         setExperimentalClassError(true),
//         toast.error(
//           "CPF do responsável financeiro é inválido, por favor verifique... ❕",
//           {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           }
//         )
//       );
//     }

//     // CHECKING IF WAITING CURRICULUM WAS DELETED
//     const waitingCurriculumsToDelete: ExcludeWaitingListProps[] = [];
//     excludeWaitingList.map(async (waitingCurriculum) => {
//       if (waitingCurriculum.exclude) {
//         waitingCurriculumsToDelete.push(waitingCurriculum);
//       }
//     });
//     if (waitingCurriculumsToDelete.length > 0) {
//       waitingCurriculumsToDelete.map(async (waitingCurriculums) => {
//         const foundedCurriculum = curriculumDatabaseData.find(
//           (curriculum) => curriculum.id === waitingCurriculums.id
//         );
//         if (foundedCurriculum) {
//           const foundedStudentOnCurriculumWaitingList =
//             foundedCurriculum.waitingList.find(
//               (student) => student.id === data.id
//             );
//           if (foundedStudentOnCurriculumWaitingList) {
//             // UPDATE CURRICULUM (DELETE STUDENT FROM CURRICULUM WAITING LIST)
//             await secureUpdateDoc(doc(db, "curriculum", foundedCurriculum.id), {
//               waitingList: arrayRemove({
//                 date: foundedStudentOnCurriculumWaitingList.date,
//                 id: foundedStudentOnCurriculumWaitingList.id,
//               }),
//             });
//           }
//         }
//       });
//     }

//     // CHECKING IF CURRICULUM WAS EDITED
//     let triggerCurriculumEdit = false;
//     const newStudentsCurriculumIds: CurriculumArrayProps[] = [];
//     wasCurriculumEdit.map((curriculum) => {
//       if (curriculum.isEdited) {
//         triggerCurriculumEdit = true;
//       }
//     });
//     if (triggerCurriculumEdit) {
//       excludeCurriculum.map(async (curriculum) => {
//         // SET ALL STUDENTS CURRICULUM
//         newStudentsCurriculumIds.push({
//           id: curriculum.id,
//           date: curriculum.date,
//           indexDays: curriculum.indexDays,
//           isExperimental: curriculum.isExperimental,
//           price: curriculum.price,
//         });

//         // SEARCH CURRICULUM TO CHANGE STUDENT ON CURRICULUM DATABASE
//         const changedCurriculum = curriculumDatabaseData.find(
//           (changedCurriculumDatabase) =>
//             changedCurriculumDatabase.id === curriculum.id
//         );
//         if (changedCurriculum) {
//           const oldStudentOnCurriculum = changedCurriculum.students.find(
//             (student) => student.id === data.id
//           );
//           if (oldStudentOnCurriculum) {
//             // UPDATE CURRICULUM (UPDATE STUDENT IN CURRICULUM DATABASE)
//             await secureUpdateDoc(doc(db, "curriculum", changedCurriculum.id), {
//               students: arrayRemove({
//                 date: oldStudentOnCurriculum.date,
//                 id: oldStudentOnCurriculum.id,
//                 indexDays: oldStudentOnCurriculum.indexDays,
//                 isExperimental: oldStudentOnCurriculum.isExperimental,
//                 price: oldStudentOnCurriculum.price,
//               }),
//             });
//             await secureUpdateDoc(doc(db, "curriculum", changedCurriculum.id), {
//               students: arrayUnion({
//                 date: oldStudentOnCurriculum.date,
//                 id: oldStudentOnCurriculum.id,
//                 indexDays: curriculum.indexDays,
//                 isExperimental: oldStudentOnCurriculum.isExperimental,
//                 price: curriculum.price,
//               }),
//             });
//           }
//         }
//       });

//       // UPDATE STUDENT (UPDATE CURRICULUM IN STUDENT DATABASE)
//       await secureUpdateDoc(doc(db, "students", data.id), {
//         curriculumIds: newStudentsCurriculumIds,
//       });
//     }

//     // CHECKING IF EXPERIMENTAL CLASS DATE WAS PICKED
//     if (experimentalCurriculumPlacesAvailable) {
//       if (
//         newStudentData.confirmAddExperimentalCurriculum &&
//         newStudentData.experimentalCurriculumInitialDate === ""
//       ) {
//         return (
//           setIsSubmitting(false),
//           setExperimentalClassError(true),
//           toast.error("Escolha a data da Aula Experimental... ❕", {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           })
//         );
//       } else {
//         setExperimentalClassError(false);
//       }
//     }

//     // CHECKING IF CURRICULUM INITIAL CLASS DATE WAS PICKED
//     if (
//       curriculumPlacesAvailable &&
//       waitingListPosition <=
//         handleOneCurriculumDetails(newStudentData.curriculum).placesAvailable -
//           handleOneCurriculumDetails(newStudentData.curriculum).students.length
//     ) {
//       if (
//         newStudentData.confirmAddCurriculum &&
//         newStudentData.curriculumInitialDate === ""
//       ) {
//         return (
//           setIsSubmitting(false),
//           setNewClassError(true),
//           toast.error("Escolha a data de início na nova modalidade... ❕", {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           })
//         );
//       } else {
//         setNewClassError(false);
//       }
//     }

//     // CHECK IF ADD EXPERIMENTAL CURRICULUM
//     if (
//       studentEditData.addExperimentalCurriculum &&
//       !newStudentData.confirmAddExperimentalCurriculum
//     ) {
//       return (
//         setIsSubmitting(false),
//         toast.error(
//           `Selecione uma nova Aula Experimental para incluir ou desmarque a opção "Adicionar Aula Experimental"...... ❕`,
//           {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           }
//         )
//       );
//     } else {
//       // CHECK IF EXPERIMENTAL CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
//       const checkExistentExperimentalCurriculum = [];
//       studentCurriculumDetails!.map((curriculumDetail) => {
//         if (
//           curriculumDetail!.id === newStudentData.experimentalCurriculum &&
//           curriculumDetail!.isExperimental
//         ) {
//           checkExistentExperimentalCurriculum.push(curriculumDetail!.id);
//         }
//       });
//       if (checkExistentExperimentalCurriculum.length > 0) {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Aluno já fez uma Aula Experimental na modalidade selecionada. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       }
//       // CHECK IF STUDENT IS TRYING TO ADD EXPERIMENTAL CLASS INTO A COURSE THAT IS ALREADY ENROLLED
//       const checkExistentCurriculum = [];
//       studentCurriculumDetails!.map((curriculumDetail) => {
//         if (
//           curriculumDetail!.id === newStudentData.experimentalCurriculum &&
//           !curriculumDetail!.isExperimental
//         ) {
//           checkExistentCurriculum.push(curriculumDetail!.id);
//         }
//       });
//       if (checkExistentCurriculum.length > 0) {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Não é possível agendar uma aula experimental para uma modalidade a qual o Aluno já está matriculado. Selecione uma nova modalidade para fazer uma Aula Experimental ou desmarque a opção "Adicionar Aula Experimental"... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       }
//     }

//     // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS EXCLUDED
//     const experimentalCurriculumLength = [];
//     studentCurriculumDetails!.map((curriculumDetail) => {
//       if (curriculumDetail!.isExperimental) {
//         experimentalCurriculumLength.push(curriculumDetail!.id);
//       }
//     });
//     if (
//       newStudentExperimentalCurriculumArray.length !==
//       experimentalCurriculumLength.length
//     ) {
//       excludeExperimentalCurriculum.map(async (curriculumToExclude) => {
//         if (curriculumToExclude.exclude && curriculumToExclude.isExperimental) {
//           // UPDATE STUDENT (DELETE EXPERIMENTAL CURRICULUM)
//           await secureUpdateDoc(doc(db, "students", data.id), {
//             experimentalCurriculumIds: arrayRemove({
//               date: curriculumToExclude.date,
//               id: curriculumToExclude.id,
//               indexDays: [],
//               isExperimental: curriculumToExclude.isExperimental,
//               price: curriculumToExclude.price,
//             }),
//           });

//           // UPDATE CURRICULUM (DELETE EXPERIMENTAL STUDENT)
//           await secureUpdateDoc(doc(db, "curriculum", curriculumToExclude.id), {
//             experimentalStudents: arrayRemove({
//               date: Timestamp.fromDate(
//                 new Date(newStudentData.curriculumInitialDate)
//               ),
//               id: data.id,
//               isExperimental: curriculumToExclude.isExperimental,
//               indexDays: curriculumToExclude.indexDays,
//               price: curriculumToExclude.price,
//             }),
//           });
//         }
//       });
//     }

//     // CHECK IF SOME EXPERIMENTAL CURRICULUM WAS INCLUDED
//     if (experimentalCurriculumPlacesAvailable) {
//       if (studentEditData.addExperimentalCurriculum) {
//         // UPDATE STUDENT (INSERT EXPERIMENTAL CURRICULUM)
//         await secureUpdateDoc(doc(db, "students", data.id), {
//           experimentalCurriculumIds: arrayUnion({
//             date: Timestamp.fromDate(
//               new Date(newStudentData.experimentalCurriculumInitialDate)
//             ),
//             id: newStudentData.experimentalCurriculum,
//             indexDays: [],
//             isExperimental: true,
//             price: newStudentData.curriculumCoursePriceBundle,
//           }),
//         });

//         // UPDATE CURRICULUM (INSERT EXPERIMENTAL STUDENT)
//         await secureUpdateDoc(
//           doc(db, "curriculum", newStudentData.experimentalCurriculum),
//           {
//             experimentalStudents: arrayUnion({
//               date: Timestamp.fromDate(
//                 new Date(newStudentData.experimentalCurriculumInitialDate)
//               ),
//               id: data.id,
//               indexDays: [],
//               isExperimental: true,
//               price: newStudentData.curriculumCoursePriceBundle,
//             }),
//           }
//         );
//       }
//     } else {
//       if (newStudentData.experimentalCurriculum) {
//         // ADD STUDENT TO WAITING LIST ARRAY OF CURRICULUM TABLE
//         await secureSetDoc(
//           doc(db, "curriculum", newStudentData.experimentalCurriculum),
//           {
//             waitingList: arrayUnion({
//               id: data.id,
//               date: Timestamp.now(),
//             }),
//           },
//           { merge: true }
//         );
//       }
//     }

//     // CHECK IF ADD CURRICULUM AND CONFIRM ADD
//     if (
//       (studentEditData.addCurriculum || addEnrollWaitingCurriculum) &&
//       !newStudentData.confirmAddCurriculum
//     ) {
//       if (studentEditData.addCurriculum) {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       } else {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Selecione a data de início para a sair da lista de espera...... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       }
//     } else {
//       // CHECK IF CURRICULUM ALREADY EXISTS ON STUDENT DATABASE
//       const checkExistentCurriculum = [];
//       studentCurriculumDetails!.map((curriculumDetail) => {
//         if (
//           curriculumDetail!.id === newStudentData.curriculum &&
//           !curriculumDetail!.isExperimental
//         ) {
//           checkExistentCurriculum.push(curriculumDetail!.id);
//         }
//       });
//       if (checkExistentCurriculum.length > 0) {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Aluno já matriculado na modalidade selecionada. Selecione uma nova modalidade para incluir ou desmarque a opção "Adicionar Modalidade"...... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       }
//     }

//     // CHECK IF SOME CURRICULUM WAS EXCLUDED
//     const curriculumLength = [];
//     studentCurriculumDetails!.map((curriculumDetail) => {
//       if (!curriculumDetail!.isExperimental) {
//         curriculumLength.push(curriculumDetail!.id);
//       }
//     });
//     if (newStudentCurriculumArray.length !== curriculumLength.length) {
//       excludeCurriculum.map(async (curriculumToExclude) => {
//         if (
//           curriculumToExclude.exclude &&
//           !curriculumToExclude.isExperimental
//         ) {
//           // UPDATE STUDENT (DELETE CURRICULUM)
//           await secureUpdateDoc(doc(db, "students", data.id), {
//             curriculumIds: arrayRemove({
//               date: curriculumToExclude.date,
//               id: curriculumToExclude.id,
//               isExperimental: curriculumToExclude.isExperimental,
//               indexDays: curriculumToExclude.indexDays,
//               price: curriculumToExclude.price,
//             }),
//           });

//           // UPDATE CURRICULUM (DELETE STUDENT)
//           await secureUpdateDoc(doc(db, "curriculum", curriculumToExclude.id), {
//             students: arrayRemove({
//               date: curriculumToExclude.date,
//               id: data.id,
//               isExperimental: curriculumToExclude.isExperimental,
//               indexDays: curriculumToExclude.indexDays,
//               price: curriculumToExclude.price,
//             }),
//           });
//         }
//       });
//     }

//     // CHECK IF SOME CURRICULUM WAS INCLUDED
//     if (
//       curriculumPlacesAvailable &&
//       waitingListPosition <=
//         handleOneCurriculumDetails(newStudentData.curriculum).placesAvailable -
//           handleOneCurriculumDetails(newStudentData.curriculum).students.length
//     ) {
//       if (studentEditData.addCurriculum || addEnrollWaitingCurriculum) {
//         const waitingCurriculumToExcludeStudent = excludeWaitingList.find(
//           (waitingCurriculum) =>
//             waitingCurriculum.id === newStudentData.curriculum
//         );
//         if (waitingCurriculumToExcludeStudent) {
//           const result = Math.floor(
//             newClass.enrolledDays.length /
//               newStudentData.curriculumCourseBundleDays
//           );
//           const rest =
//             newClass.enrolledDays.length %
//             newStudentData.curriculumCourseBundleDays;

//           // UPDATE STUDENT (INSERT CURRICULUM)
//           await secureUpdateDoc(doc(db, "students", data.id), {
//             curriculumIds: arrayUnion({
//               date: Timestamp.fromDate(
//                 new Date(newStudentData.curriculumInitialDate)
//               ),
//               id: newStudentData.curriculum,
//               isExperimental: false,
//               indexDays: newClass.enrolledDays,
//               price:
//                 result * newStudentData.curriculumCoursePriceBundle +
//                 rest * newStudentData.curriculumCoursePriceUnit,
//             }),
//           });

//           // UPDATE CURRICULUM (INSERT STUDENT IN ENROLLED STUDENTS AND REMOVE FROM WAITING LIST)
//           await secureUpdateDoc(
//             doc(db, "curriculum", newStudentData.curriculum),
//             {
//               students: arrayUnion({
//                 date: Timestamp.fromDate(
//                   new Date(newStudentData.curriculumInitialDate)
//                 ),
//                 id: data.id,
//                 indexDays: newClass.enrolledDays,
//                 isExperimental: false,
//                 price:
//                   result * newStudentData.curriculumCoursePriceBundle +
//                   rest * newStudentData.curriculumCoursePriceUnit,
//               }),
//               waitingList: arrayRemove({
//                 id: data.id,
//                 date: waitingCurriculumToExcludeStudent.date,
//               }),
//             }
//           );
//         } else {
//           console.log("não achei o aluno...");
//         }
//       }
//     } else {
//       if (newStudentData.curriculum) {
//         // ADD STUDENT TO WAITING LIST ARRAY OF CURRICULUM TABLE
//         await secureSetDoc(
//           doc(db, "curriculum", newStudentData.curriculum),
//           {
//             waitingList: arrayUnion({
//               id: data.id,
//               date: Timestamp.now(),
//             }),
//           },
//           { merge: true }
//         );
//       }
//     }

//     // CHECK IF ADD FAMILY
//     if (studentEditData.addFamily && !newStudentData.familyId) {
//       return (
//         setIsSubmitting(false),
//         toast.error(
//           `Selecione um familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
//           {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           }
//         )
//       );
//     }
//     // CHECK CONFIRM ADD NEW FAMILY MEMBER
//     if (newStudentData.familyId && !newStudentData.confirmAddFamily) {
//       return (
//         setIsSubmitting(false),
//         toast.error(
//           `Confirme a adição do familiar ou desmarque a opção "Adicionar Familiar"...... ❕`,
//           {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           }
//         )
//       );
//     }

//     // CHECK IF NEW FAMILY MEMBER ALREADY EXISTS ON STUDENT DATABASE
//     const checkExistentFamily = [];
//     studentFamilyDetails!.map((familyDetail) => {
//       if (familyDetail! === newStudentData.familyId) {
//         checkExistentFamily.push(familyDetail);
//       }
//     });
//     if (checkExistentFamily.length > 0) {
//       return (
//         setIsSubmitting(false),
//         toast.error(
//           `Familiar já consta na ficha do aluno. Selecione um novo familiar para incluir ou desmarque a opção "Adicionar Familiar"...... ❕`,
//           {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           }
//         )
//       );
//     }

//     // CHECK IF SOME FAMILY WAS EXCLUDED
//     if (
//       newStudentFamilyArray.length !==
//       studentSelectedData?.studentFamilyAtSchool.length
//     ) {
//       // VERIFY IF USER HAVE SOME FAMILY AFTER EXCLUSION
//       const familyArray: string[] = studentFamilyDetails;
//       familyArray.push(data.id);
//       const familyToExcludeArray: string[] = [];
//       excludeFamily.map(async (familyToExclude) => {
//         if (familyToExclude.exclude) {
//           familyToExcludeArray.push(familyToExclude.id);
//         }
//       });
//       // UPDATE STUDENT AND FAMILY
//       familyArray.map(async (studentToDeleteFamily) => {
//         const filteredMySelf = familyArray.filter(
//           (item) => item !== studentToDeleteFamily
//         );
//         const familyArrayToStay = filteredMySelf.filter(
//           (familyMember) => !familyToExcludeArray.includes(familyMember)
//         );
//         const studentAllDetails = studentsDatabaseData.find(
//           (student) => student.id === studentToDeleteFamily
//         );
//         if (studentAllDetails) {
//           if (familyToExcludeArray.includes(studentToDeleteFamily)) {
//             await secureUpdateDoc(doc(db, "students", studentToDeleteFamily), {
//               familyDiscount: false,
//               studentFamilyAtSchool: [],
//             });
//           } else {
//             if (studentAllDetails.studentFamilyAtSchool.length > 1) {
//               await secureUpdateDoc(
//                 doc(db, "students", studentToDeleteFamily),
//                 {
//                   familyDiscount: true,
//                   studentFamilyAtSchool: familyArrayToStay,
//                 }
//               );
//             } else {
//               await secureUpdateDoc(
//                 doc(db, "students", studentToDeleteFamily),
//                 {
//                   familyDiscount: false,
//                   studentFamilyAtSchool: familyArrayToStay,
//                 }
//               );
//             }
//           }
//         }
//       });
//     }

//     // CHECK IF SOME FAMILY WAS INCLUDED
//     if (studentEditData.addFamily) {
//       //CHECK AND GETTING EXISTENT FAMILY
//       const familyArray: string[] = [];

//       familyArray.push(data.id);
//       familyArray.push(newStudentData.familyId);
//       const foundedStudentFamilyDetails = studentsDatabaseData.find(
//         (student) => student.id === newStudentData.familyId
//       );
//       if (foundedStudentFamilyDetails) {
//         foundedStudentFamilyDetails.studentFamilyAtSchool.map(
//           (otherStudentFamily) => familyArray.push(otherStudentFamily)
//         );
//       }
//       const addNewFamily = async () => {
//         // UPDATE STUDENT (INSERT FAMILY TO STUDENT DATABASE)
//         await secureUpdateDoc(doc(db, "students", data.id), {
//           familyDiscount: true,
//           studentFamilyAtSchool: familyArray.filter(
//             (student) => student !== data.id
//           ),
//         });

//         // IF YOU WANT CREATE FAMILY IN BOTH DIRECTIONS UNCOMMENT THIS SECTION FOR INSERT STUDENT TO FAMILY DATABASE
//         // UPDATE FAMILY (INSERT STUDENT TO FAMILY DATABASE)
//         familyArray.map(async (familyStudent) => {
//           await secureSetDoc(
//             doc(db, "students", familyStudent),
//             {
//               studentFamilyAtSchool: familyArray.filter(
//                 (student) => student !== familyStudent
//               ),
//             },
//             { merge: true }
//           );
//         });
//       };
//       addNewFamily();
//     }

//     // CHECKING VALID SECONDARY PHONE
//     if (studentEditData.financialResponsible.activePhoneSecondary) {
//       if (studentEditData.financialResponsible.phoneSecondary.ddd === "DDD") {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Preencha o número de telefone 2 ou desmarque a opção "incluir"...... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       }
//     }

//     // CHECKING VALID TERTIARY PHONE
//     if (studentEditData.financialResponsible.activePhoneTertiary) {
//       if (studentEditData.financialResponsible.phoneTertiary.ddd === "DDD") {
//         return (
//           setIsSubmitting(false),
//           toast.error(
//             `Preencha o número de telefone 3 ou desmarque a opção "incluir"...... ❕`,
//             {
//               theme: "colored",
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               autoClose: 3000,
//             }
//           )
//         );
//       }
//     }

//     // CHECKING IF STUDENT EXISTS ON CURRRICULUM DATABASE
//     const foundedStudent = studentsDatabaseData.find(
//       (student) => student.id === data.id
//     );

//     if (!foundedStudent) {
//       // IF NO EXISTS, RETURN ERROR
//       return (
//         setIsSubmitting(false),
//         toast.error(`Aluno não existe no banco de dados...... ❕`, {
//           theme: "colored",
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           autoClose: 3000,
//         })
//       );
//     } else {
//       // IF EXISTS, EDIT
//       // STUDENT DATA OBJECT
//       const updateData = {
//         // Section 1: Student Data
//         name: data.name,
//         birthDate: Timestamp.fromDate(new Date(data.birthDate)),
//         schoolYears: data.schoolYears,
//         schoolYearsComplement: data.schoolYearsComplement,
//         "parentOne.name": data.parentOne.name,
//         "parentOne.email": data.parentOne.email,
//         "parentOne.phone": `+55${data.parentOne.phone.ddd}${data.parentOne.phone.number}`,
//         "parentTwo.name": data.parentTwo.name,
//         "parentTwo.email": data.parentTwo.email,
//         "parentTwo.phone": `+55${data.parentTwo.phone.ddd}${data.parentTwo.phone.number}`,

//         // Section 2: Student Course and Family Data | Prices
//         enrolmentExemption: data.enrolmentExemption,
//         enrolmentFee: data.enrolmentFee,
//         enrolmentFeePaid: data.enrolmentFeePaid,
//         fullPrice: data.fullPrice,
//         appliedPrice: +data.appliedPrice.toFixed(2),
//         customDiscount: data.customDiscount,
//         customDiscountValue: data.customDiscountValue,
//         employeeDiscount: data.employeeDiscount,
//         secondCourseDiscount: data.secondCourseDiscount,
//         paymentDay: data.paymentDay,

//         // Section 3: Student Financial Responsible Data
//         "financialResponsible.name": data.financialResponsible.name,
//         "financialResponsible.document": data.financialResponsible.document,
//         "financialResponsible.email": data.financialResponsible.email,
//         "financialResponsible.address.street":
//           data.financialResponsible.address.street,
//         "financialResponsible.address.number":
//           data.financialResponsible.address.number,
//         "financialResponsible.address.complement":
//           data.financialResponsible.address.complement,
//         "financialResponsible.address.neighborhood":
//           data.financialResponsible.address.neighborhood,
//         "financialResponsible.address.city":
//           data.financialResponsible.address.city,
//         "financialResponsible.address.state":
//           data.financialResponsible.address.state,
//         "financialResponsible.address.cep":
//           data.financialResponsible.address.cep,
//         "financialResponsible.phone": `+55${data.financialResponsible.phone.ddd}${data.financialResponsible.phone.number}`,
//         "financialResponsible.phoneSecondary":
//           data.financialResponsible.phoneSecondary.ddd === "DDD"
//             ? ""
//             : `+55${data.financialResponsible.phoneSecondary.ddd}${data.financialResponsible.phoneSecondary.number}`,
//         "financialResponsible.phoneTertiary":
//           data.financialResponsible.phoneTertiary.ddd === "DDD"
//             ? ""
//             : `+55${data.financialResponsible.phoneTertiary.ddd}${data.financialResponsible.phoneTertiary.number}`,

//         // Section 4: Student Contract Data
//         // Accept Contract: boolean
//         // Contract attached (pdf)

//         // Section 5: Last Updated Time
//         updatedAt: serverTimestamp(),
//       };

//       // EDIT STUDENT FUNCTION
//       const editStudent = async () => {
//         console.log(updateData);
//         try {
//           await secureUpdateDoc(doc(db, "students", data.id), updateData);
//           toast.success(`${data.name} alterado com sucesso! 👌`, {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           });
//           resetForm();
//           setIsSubmitting(false);
//         } catch (error) {
//           console.log("ESSE É O ERROR", error);
//           toast.error(`Ocorreu um erro... 🤯`, {
//             theme: "colored",
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             autoClose: 3000,
//           });
//           setIsSubmitting(false);
//         }
//       };
//       editStudent();
//     }
//   };

//   return (
//     <div
//       className={`w-full ${
//         open
//           ? "flex flex-col h-full max-w-9xl bg-white/80 dark:bg-klGreen-500/60 rounded-xl overflow-y-auto no-scrollbar"
//           : ""
//       } `}
//     >
//       <div className="flex flex-col w-full h-full overflow-scroll no-scrollbar gap-2 pt-4 px-4 rounded-xl text-center">
//         {/** DAHSBOARD SECTION TITLE */}
//         {page.show === "Dashboard" &&
//           studentSelectedData &&
//           handleClickOpen &&
//           handleDeleteUser &&
//           onClose &&
//           setIsEdit &&
//           setIsFinance &&
//           setIsDetailsViewing && (
//             <EditDashboardHeader
//               handleClickOpen={handleClickOpen}
//               handleDeleteUser={handleDeleteUser}
//               onClose={onClose}
//               setIsDetailsViewing={setIsDetailsViewing}
//               setIsEdit={setIsEdit}
//               setIsFinance={setIsFinance}
//               student={studentSelectedData}
//               isEdit={isEdit}
//               isFinance={isFinance}
//               isFinancialResponsible={isFinancialResponsible}
//               onlyView={onlyView}
//               open={open}
//               key={studentId}
//             />
//           )}

//         {/* FORM */}
//         <FormProvider {...methods}>
//           <form
//             onSubmit={handleSubmit(handleEditStudent)}
//             className="flex flex-col w-full gap-2 px-4 rounded-xl bg-klGreen-500/0 dark:bg-klGreen-500/0 text-center h-full overflow-scroll no-scrollbar "
//           >
//             {/** PERSONAL DATA FORM */}
//             <PersonalDataForm
//               studentData={studentEditData}
//               setStudentData={setStudentEditData}
//               testCPF={testCPF} // Defina a lógica do CPF aqui
//               setTestCPF={setTestCPF} // Passar a função de validação do CPF
//               isSubmitting={isSubmitting} // Defina o estado de submissão aqui
//               renewBirthDayValue={renewBirthDayValue} // Passando valor para renewBirthDayValue
//               onlyView={onlyView}
//             />

//             {/** PERSONAL DATA SECTION TITLE */}
//             {/* <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//               Dados Pessoais:
//             </h1> */}

//             {/* STUDENT NAME */}
//             {/* <div className="flex gap-2 items-center">
//               <label
//                 htmlFor="name"
//                 className={
//                   errors.name
//                     ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                     : "w-1/4 text-right"
//                 }
//               >
//                 Nome:{" "}
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 disabled={onlyView ?? isSubmitting}
//                 placeholder={
//                   errors.name
//                     ? "É necessário inserir o nome do Aluno"
//                     : "Insira o nome do Aluno"
//                 }
//                 className={
//                   errors.name
//                     ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                     : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 }
//                 value={studentEditData.name}
//                 onChange={(e) => {
//                   setStudentEditData({
//                     ...studentEditData,
//                     name: e.target.value,
//                   });
//                 }}
//               />
//             </div> */}

//             {/* BIRTHDATE */}
//             {/* <div className="flex gap-2 items-center">
//               <label
//                 htmlFor="birthDate"
//                 className={
//                   errors.birthDate
//                     ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                     : "w-1/4 text-right"
//                 }
//               >
//                 Data de Nascimento:{" "}
//               </label>
//               <div className="flex w-3/4">
//                 <BirthDaySelect
//                   setStudentData={setStudentEditData}
//                   errors={errors}
//                   renewBirthDayValue={renewBirthDayValue}
//                   birthDateValue={dateToString}
//                   isDisabled={onlyView}
//                 />
//               </div>
//             </div> */}

//             {/* SCHOOL YEARS SELECT */}
//             {/* <div className="flex gap-2 items-center">
//               <label
//                 htmlFor="schoolYearsSelect"
//                 className={
//                   errors.schoolYears
//                     ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                     : "w-1/4 text-right"
//                 }
//               >
//                 Ano escolar:{" "}
//               </label>
//               <select
//                 id="schoolYearsSelect"
//                 disabled={onlyView}
//                 value={studentEditData.schoolYears}
//                 className={
//                   errors.schoolYears
//                     ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                     : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 }
//                 name="schoolYearsSelect"
//                 onChange={(e) => {
//                   setStudentEditData({
//                     ...studentEditData,
//                     schoolYears: e.target.value,
//                   });
//                 }}
//               >
//                 <SelectOptions returnId dataType="schoolYears" />
//               </select>
//             </div> */}

//             {/* SCHOOL YEARS COMPLEMENT SELECT */}
//             {/* <div className="flex gap-2 items-center">
//               <label
//                 htmlFor="schoolYearsSelectComplement"
//                 className={
//                   errors.schoolYearsComplement
//                     ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                     : "w-1/4 text-right"
//                 }
//               >
//                 Turma:{" "}
//               </label>
//               <select
//                 id="schoolYearsSelectComplement"
//                 disabled={onlyView}
//                 value={studentEditData.schoolYearsComplement}
//                 className={
//                   errors.schoolYearsComplement
//                     ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                     : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 }
//                 name="schoolYearsSelectComplement"
//                 onChange={(e) => {
//                   setStudentEditData({
//                     ...studentEditData,
//                     schoolYearsComplement: e.target.value,
//                   });
//                 }}
//               >
//                 <SelectOptions returnId dataType="schoolYearsComplement" />
//               </select>
//             </div> */}

//             {/** PARENT ONE SECTION TITLE */}
//             {/* <h3 className="text-lg py-2 text-klGreen-600 dark:text-gray-100">
//               Filiação 1:
//             </h3> */}

//             {/* PARENT ONE FORM */}
//             <ParentForm
//               onlyView={onlyView}
//               parent="parentOne"
//               setStudentData={setStudentEditData}
//               student={studentEditData}
//             />

//             {/** PARENT TWO SECTION TITLE */}
//             {/* <h3 className="text-lg py-2 text-klGreen-600 dark:text-gray-100">
//               Filiação 2:
//             </h3> */}

//             {/* PARENT TWO FORM */}
//             <ParentForm
//               onlyView={onlyView}
//               parent="parentTwo"
//               setStudentData={setStudentEditData}
//               student={studentEditData}
//             />

//             {/* // --------------------------------------------- SECTION 2: STUDENT FINANCIAL RESPONSIBLE DATA --------------------------------------------- // */}

//             <FinancialResponsibleForm
//               activePhoneSecondary={
//                 studentEditData.financialResponsible.activePhoneSecondary
//               }
//               activePhoneTertiary={
//                 studentEditData.financialResponsible.activePhoneTertiary
//               }
//               emptyWaitingList={experimentalCurriculumEmptyWaitingList}
//               isExperimental={studentEditData.addExperimentalCurriculum}
//               placesAvailable={experimentalCurriculumPlacesAvailable}
//               setStudentData={setStudentEditData}
//               setTestFinancialCPF={setTestFinancialCPF}
//               student={studentEditData}
//               testFinancialCPF={testFinancialCPF}
//               onlyView={onlyView}
//               editAddress={editAddress}
//               setEditAddress={setEditAddress}
//             />

//             {/** EXPERIMENTAL CURRICULUM SECTION TITLE */}
//             {/* {!(onlyView && excludeExperimentalCurriculum.length < 1) && (
//               <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//                 Aulas Experimentais:
//               </h1>
//             )} */}

//             {/* EXISTENT EXPERIMENTAL CURRICULUM */}
//             {!(onlyView && excludeExperimentalCurriculum.length < 1) &&
//               haveCurriculum &&
//               excludeExperimentalCurriculum.map((curriculum, index) => (
//                 // <>
//                 //   <div className="flex gap-2 items-center" key={curriculum.id}>
//                 //     <label
//                 //       htmlFor="existentExperimentalCurriculumName"
//                 //       className="w-1/4 text-right"
//                 //     >
//                 //       Aula Experimental {index + 1}{" "}
//                 //       {curriculum.exclude && (
//                 //         <span className="text-xs">
//                 //           {" "}
//                 //           (selecionada para exclusão)
//                 //         </span>
//                 //       )}
//                 //       :{" "}
//                 //     </label>
//                 //     <div className="flex w-3/4 gap-2">
//                 //       <div className="w-11/12">
//                 //         <input
//                 //           type="text"
//                 //           name="existentExperimentalCurriculumName"
//                 //           disabled={
//                 //             isSubmitting
//                 //               ? true
//                 //               : onlyView
//                 //               ? true
//                 //               : curriculum.exclude
//                 //           }
//                 //           className={
//                 //             curriculum.exclude
//                 //               ? "w-full px-2 py-1 dark:bg-gray-800 border border-klOrange-500 dark:border-klOrange-500 dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                 //               : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 //           }
//                 //           value={formatCurriculumName(curriculum.id)}
//                 //           readOnly
//                 //         />
//                 //       </div>
//                 //       {!onlyView && (
//                 //         <EditCurriculumButton
//                 //           index={index}
//                 //           isExperimental
//                 //           curriculum={curriculum}
//                 //           handleIncludeExcludeFunction={
//                 //             handleIncludeExcludeExperimentalCurriculum
//                 //           }
//                 //           openEditExperimentalCurriculumDays={
//                 //             openEditExperimentalCurriculumDays
//                 //           }
//                 //           setOpenEditExperimentalCurriculumDays={
//                 //             setOpenEditExperimentalCurriculumDays
//                 //           }
//                 //           cancelEditFunction={restoreEditedExcludeCurriculum}
//                 //         />
//                 //       )}
//                 //     </div>
//                 //   </div>
//                 //   {openEditExperimentalCurriculumDays && (
//                 //     <div className="flex gap-2 items-center">
//                 //       <label
//                 //         htmlFor="experimentalClassPick"
//                 //         className={
//                 //           experimentalClassError
//                 //             ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                 //             : "w-1/4 text-right"
//                 //         }
//                 //       >
//                 //         Alterar o dia da Aula Experimental:
//                 //       </label>
//                 //       <div className="flex w-3/4">
//                 //         <DatePicker
//                 //           months={months}
//                 //           weekDays={weekDays}
//                 //           placeholder={
//                 //             experimentalClassError
//                 //               ? "É necessário selecionar uma Data"
//                 //               : "Selecione uma Data"
//                 //           }
//                 //           currentDate={new DateObject()}
//                 //           //@ts-ignore
//                 //           value={curriculum.date.toDate()}
//                 //           containerClassName="w-full"
//                 //           style={{ width: "100%" }}
//                 //           inputClass={
//                 //             experimentalClassError
//                 //               ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                 //               : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 //           }
//                 //           minDate={new DateObject()}
//                 //           mapDays={({ date }) => {
//                 //             if (!curriculum.isExperimental) {
//                 //               const isWeekend = handleOneCurriculumDetails(
//                 //                 curriculum.id
//                 //               ).classDayIndexDays.includes(date.weekDay.index);
//                 //               if (!isWeekend)
//                 //                 return {
//                 //                   disabled: true,
//                 //                   style: { color: "#ccc" },
//                 //                   title: "Aula não disponível neste dia",
//                 //                 };
//                 //             } else {
//                 //               const isWeekend = handleOneCurriculumDetails(
//                 //                 curriculum.id
//                 //               ).classDayIndexDays.includes(date.weekDay.index);
//                 //               if (!isWeekend)
//                 //                 return {
//                 //                   disabled: true,
//                 //                   style: { color: "#ccc" },
//                 //                   title: "Aula não disponível neste dia",
//                 //                 };
//                 //             }
//                 //           }}
//                 //           editable={false}
//                 //           format="DD/MM/YYYY"
//                 //           onChange={(e: DateObject) => {
//                 //             e !== null &&
//                 //               setNewClass({
//                 //                 ...newClass,
//                 //                 date: `${e.month}/${e.day}/${e.year}`,
//                 //               });
//                 //           }}
//                 //         />
//                 //       </div>
//                 //     </div>
//                 //   )}
//                 //   {/** SEPARATOR */}
//                 //   {openEditExperimentalCurriculumDays && (
//                 //     <hr className="pb-4" />
//                 //   )}
//                 // </>
//                 <></>
//               ))}

//             {/** CHECKBOX ADD EXPERIMENTAL CURRICULUM */}
//             {/* {!onlyView && (
//               <div className="flex gap-2 items-center">
//                 <label
//                   htmlFor="addExperimentalCurriculum"
//                   className={
//                     errors.addExperimentalCurriculum
//                       ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                       : "w-1/4 text-right"
//                   }
//                 >
//                   Adicionar Aula Experimental ?{" "}
//                 </label>
//                 <div className="w-3/4 flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="addExperimentalCurriculum"
//                     className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                     checked={studentEditData.addExperimentalCurriculum}
//                     onChange={() => {
//                       setStudentEditData({
//                         ...studentEditData,
//                         addExperimentalCurriculum:
//                           !studentEditData.addExperimentalCurriculum,
//                       });
//                       setExperimentalCurriculumData({
//                         schoolId: "",
//                         schoolClassId: "",
//                         schoolCourseId: "",
//                       });
//                     }}
//                   />
//                 </div>
//               </div>
//             )} */}

//             {/** ADD EXPERIMENTAL CURRICULUM */}
//             {studentEditData.addExperimentalCurriculum && (
//               <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
//                 {/** ADD EXPERIMENTAL CURRICULUM SECTION TITLE */}
//                 {/* <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//                   Atenção: você está adicionando uma nova aula experimental para{" "}
//                   {studentEditData.name}:
//                 </h1> */}

//                 {/* SCHOOL SELECT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="newExperimentalSchoolSelect"
//                     className={
//                       errors.addExperimentalCurriculum
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione a Escola:{" "}
//                   </label>
//                   <select
//                     id="newExperimentalSchoolSelect"
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       errors.addExperimentalCurriculum
//                         ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                     }
//                     name="newExperimentalSchoolSelect"
//                     onChange={(e) => {
//                       setExperimentalCurriculumData({
//                         ...experimentalCurriculumData,
//                         schoolId: e.target.value,
//                         schoolClassId: "",
//                         schoolCourseId: "",
//                       });
//                     }}
//                   >
//                     <SelectOptions returnId dataType="schools" />
//                   </select>
//                 </div> */}

//                 {/* SCHOOL CLASS SELECT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="newExperimentalSchoolClassSelect"
//                     className={
//                       errors.addExperimentalCurriculum
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione o Ano Escolar:{" "}
//                   </label>
//                   <select
//                     id="newExperimentalSchoolClassSelect"
//                     disabled={
//                       experimentalCurriculumData.schoolId ? false : true
//                     }
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       experimentalCurriculumData.schoolId
//                         ? errors.addExperimentalCurriculum
//                           ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                           : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                     }
//                     name="newExperimentalSchoolClassSelect"
//                     onChange={(e) => {
//                       setExperimentalCurriculumData({
//                         ...experimentalCurriculumData,
//                         schoolClassId: e.target.value,
//                         schoolCourseId: "",
//                       });
//                       setNewStudentData({
//                         ...newStudentData,
//                         experimentalCurriculum: "",
//                       });
//                     }}
//                   >
//                     <SelectOptions
//                       returnId
//                       dataType="schoolClasses"
//                       schoolId={experimentalCurriculumData.schoolId}
//                     />
//                   </select>
//                 </div> */}

//                 {/* SCHOOL COURSE SELECT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="newExperimentalSchoolCourseSelect"
//                     className={
//                       errors.addExperimentalCurriculum
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione a Modalidade:{" "}
//                   </label>
//                   <select
//                     id="newExperimentalSchoolCourseSelect"
//                     disabled={
//                       experimentalCurriculumData.schoolClassId ? false : true
//                     }
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       experimentalCurriculumData.schoolClassId
//                         ? errors.addExperimentalCurriculum
//                           ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                           : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                     }
//                     name="newExperimentalSchoolCourseSelect"
//                     onChange={(e) => {
//                       setExperimentalCurriculumData({
//                         ...experimentalCurriculumData,
//                         schoolCourseId: e.target.value,
//                       });
//                       setNewStudentData({
//                         ...newStudentData,
//                         experimentalCurriculum: "",
//                       });
//                     }}
//                   >
//                     <SelectOptions
//                       returnId
//                       schoolId={experimentalCurriculumData.schoolId}
//                       schoolClassId={experimentalCurriculumData.schoolClassId}
//                       dataType="schoolCourses"
//                     />
//                     <option value={"all"}>Todas as Modalidades</option>
//                   </select>
//                 </div> */}

//                 {/* EXPERIMENTAL CURRICULUM SELECT */}
//                 {experimentalCurriculumData.schoolId &&
//                 experimentalCurriculumData.schoolClassId &&
//                 experimentalCurriculumData.schoolCourseId ? (
//                   <>
//                     {/* EXPERIMENTAL CURRICULUM CARD DETAILS SECTION TITLE */}
//                     {/* <h1 className="font-bold text-2xl py-4">
//                       {newExperimentalSchoolSelectedData?.name} -{" "}
//                       {newExperimentalSchoolClassSelectedData?.name} -{" "}
//                       {newExperimentalSchoolCourseSelectedData?.name}:
//                     </h1> */}

//                     {/* SEPARATOR */}
//                     {/* <hr className="pb-4" /> */}

//                     {newExperimentalCurriculumCoursesData.length !== 0 ? (
//                       <>
//                         {/* EXPERIMENTAL CURRICULUM CARD DETAILS */}
//                         {/* <div className="flex flex-wrap gap-4 justify-center">
//                           {newExperimentalCurriculumCoursesData.map(
//                             (curriculum) => (
//                               <div
//                                 className={
//                                   errors.addExperimentalCurriculum
//                                     ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
//                                     : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
//                                 }
//                                 key={curriculum.id}
//                               >
//                                 <input
//                                   type="radio"
//                                   id={curriculum.id}
//                                   name="experimentalCurriculumCardDetails"
//                                   className="text-klGreen-500 dark:text-klGreen-500 border-none"
//                                   value={curriculum.id}
//                                   onChange={(e) => {
//                                     setNewStudentData({
//                                       ...newStudentData,
//                                       experimentalCurriculum: e.target.value,

//                                       experimentalCurriculumClassDayId:
//                                         curriculum.classDayId,
//                                       confirmAddExperimentalCurriculum: false,
//                                     });
//                                   }}
//                                 />
//                                 <label
//                                   htmlFor="experimentalCurriculumCardDetails"
//                                   className="flex flex-col gap-4"
//                                 >
//                                   <CurriculumCardDescription
//                                     id={curriculum.id}
//                                     key={curriculum.id}
//                                   />
//                                 </label>
//                               </div>
//                             )
//                           )}
//                         </div> */}
//                       </>
//                     ) : (
//                       <>
//                         {/* EXPERIMENTAL CURRICULUM EMPTY DESCRIPTION */}
//                         {/* <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
//                           Nenhuma vaga disponível com as opções selecionadas,
//                           tente novamente.
//                         </h1> */}
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     {/* EXPERIMENTAL CURRICULUM PRE-SELECT DESCRIPTION */}
//                     {/* <p className="text-red-600 dark:text-yellow-500">
//                       Selecione um colégio e um Ano Escolar para ver as
//                       modalidades disponíveis.
//                     </p> */}
//                   </>
//                 )}

//                 {newStudentData.experimentalCurriculum &&
//                   classDayExperimentalCurriculumSelectedData !== undefined && (
//                     <>
//                       {experimentalCurriculumPlacesAvailable &&
//                       experimentalCurriculumEmptyWaitingList ? (
//                         <>
//                           {/* EXPERIMENTAL/INITIAL DAY */}
//                           {/* <div className="flex gap-2 items-center">
//                             <label
//                               htmlFor="experimentalClassPick"
//                               className={
//                                 experimentalClassError
//                                   ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                                   : "w-1/4 text-right"
//                               }
//                             >
//                               Escolha o dia da aula experimental:
//                             </label>
//                             <div className="flex w-3/4">
//                               <DatePicker
//                                 months={months}
//                                 weekDays={weekDays}
//                                 placeholder={
//                                   experimentalClassError
//                                     ? "É necessário selecionar uma Data"
//                                     : "Selecione uma Data"
//                                 }
//                                 currentDate={new DateObject()}
//                                 inputClass={
//                                   experimentalClassError
//                                     ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                                     : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                                 }
//                                 minDate={new DateObject()}
//                                 mapDays={({ date }) => {
//                                   const isWeekend =
//                                     classDayExperimentalCurriculumSelectedData.indexDays.includes(
//                                       date.weekDay.index
//                                     );

//                                   if (!isWeekend)
//                                     return {
//                                       disabled: true,
//                                       style: { color: "#ccc" },
//                                       title: "Aula não disponível neste dia",
//                                     };
//                                 }}
//                                 editable={false}
//                                 format="DD/MM/YYYY"
//                                 onChange={(e: DateObject) => {
//                                   e !== null
//                                     ? setNewStudentData({
//                                         ...newStudentData,
//                                         experimentalCurriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
//                                       })
//                                     : null;
//                                 }}
//                               />
//                             </div>
//                           </div> */}
//                         </>
//                       ) : (
//                         <div className="flex flex-col w-full items-center justify-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent rounded-2xl text-center text-lg text-red-600 dark:text-yellow-500">
//                           {/* CLASS WAITING LIST DISCLAIMER */}
//                           {/* <h1 className="font-bold">FILA DE ESPERA</h1>
//                           <p className="flex items-center">
//                             A turma selecionada está sem vaga disponível para
//                             matrícula, confirme a inclusão abaixo e salve o
//                             cadastro para entrar na fila de espera.
//                             <br /> Seguimos uma ordem nesta fila por data de
//                             cadastro, sendo assim, à medida que as vagas forem
//                             disponibilizadas, entraremos em contato.
//                           </p> */}
//                         </div>
//                       )}
//                     </>
//                   )}

//                 {/** CHECKBOX CONFIRM INSERT NEW EXPERIMENTAL CURRICULUM */}
//                 {/* <div className="flex justify-center items-center gap-2 mt-6">
//                   <input
//                     type="checkbox"
//                     name="confirmAddExperimentalCurriculum"
//                     className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                     checked={newStudentData.confirmAddExperimentalCurriculum}
//                     onChange={() => {
//                       setNewStudentData({
//                         ...newStudentData,
//                         confirmAddExperimentalCurriculum:
//                           !newStudentData.confirmAddExperimentalCurriculum,
//                       });
//                     }}
//                   />
//                   <label
//                     htmlFor="confirmAddExperimentalCurriculum"
//                     className="text-sm"
//                   >
//                     Confirmar inclusão da Aula Experimental
//                   </label>
//                 </div> */}
//               </div>
//             )}

//             {/** WAITING LIST SECTION TITLE */}
//             {!(onlyView && excludeWaitingList.length < 1) && (
//               <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//                 Lista de espera:
//               </h1>
//             )}

//             {/* EXISTENT WAITING LIST CURRICULUM */}
//             {!(onlyView && excludeWaitingList.length < 1) &&
//               excludeWaitingList.map((curriculum, index) => (
//                 <div className="flex gap-2 items-center" key={curriculum.id}>
//                   <label
//                     htmlFor="existentCurriculumName"
//                     className="w-1/4 text-right"
//                   >
//                     Aula {index + 1}
//                     {curriculum.exclude && (
//                       <span className="text-xs">
//                         {" "}
//                         (selecionada para exclusão)
//                       </span>
//                     )}
//                     :{" "}
//                   </label>
//                   <div className="flex w-3/4 gap-2">
//                     <div className="w-11/12">
//                       <input
//                         type="text"
//                         name="existentCurriculumName"
//                         disabled={
//                           isSubmitting
//                             ? true
//                             : onlyView
//                             ? true
//                             : curriculum.exclude
//                         }
//                         className={
//                           curriculum.exclude
//                             ? "w-full px-2 py-1 dark:bg-gray-800 border border-klOrange-500 dark:border-klOrange-500 dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                             : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                         }
//                         value={formatCurriculumName(curriculum.id)}
//                         readOnly
//                       />
//                     </div>
//                     {!onlyView && (
//                       <EditWaitingListButton
//                         studentId={studentId}
//                         curriculum={curriculum}
//                         index={index}
//                         handleIncludeExcludeFunction={
//                           handleIncludeExcludeWaitingCurriculum
//                         }
//                         handleEnrollClick={handleEnrollWithCurriculum}
//                         showEnrollWaitingCurriculumDetails={
//                           showEnrollWaitingCurriculumDetails
//                         }
//                         setShowEnrollWaitingCurriculumDetails={
//                           setShowEnrollWaitingCurriculumDetails
//                         }
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))}

//             {showEnrollWaitingCurriculumDetails &&
//               newStudentData.curriculum &&
//               classDayCurriculumSelectedData &&
//               classDayCurriculumSelectedData.indexDays.length !== undefined && (
//                 <div className="flex flex-col w-full items-center justify-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent rounded-2xl">
//                   <CurriculumCardDescription id={newStudentData.curriculum} />

//                   {/* STUDENT CLASS DAYS */}
//                   <div className="flex w-full gap-2 items-center py-2">
//                     <label
//                       htmlFor="experimentalClassPick"
//                       className={
//                         experimentalClassError
//                           ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                           : "w-1/4 text-right"
//                       }
//                     >
//                       Escolha os dias de Aula:
//                     </label>
//                     <div className="flex w-3/4">
//                       <div className="flex w-full items-center">
//                         {classDayCurriculumSelectedData.indexDays.map(
//                           (classDayIndexNumber) =>
//                             classDayIndex.map(
//                               (day) =>
//                                 day.id === classDayIndexNumber &&
//                                 (newStudentData.indexDays.includes(day.id) ? (
//                                   <>
//                                     <div
//                                       key={uuidv4()}
//                                       className="flex w-full items-center gap-2"
//                                     >
//                                       <input
//                                         key={uuidv4()}
//                                         type="checkbox"
//                                         className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none opacity-70"
//                                         id={day.name}
//                                         name={day.name}
//                                         checked={false}
//                                         disabled
//                                       />
//                                       <label
//                                         key={uuidv4()}
//                                         htmlFor={day.name}
//                                         className="opacity-70"
//                                       >
//                                         {" "}
//                                         {day.name}{" "}
//                                         <span className="text-xs">
//                                           (aluno já faz aula neste dia)
//                                         </span>
//                                       </label>
//                                     </div>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <div
//                                       key={uuidv4()}
//                                       className="flex w-full items-center gap-2"
//                                     >
//                                       <input
//                                         key={uuidv4()}
//                                         type="checkbox"
//                                         className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
//                                         id={day.name}
//                                         name={day.name}
//                                         checked={
//                                           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                                           //@ts-ignore
//                                           classDaysData[day.name]
//                                         }
//                                         onChange={() =>
//                                           toggleClassDays({
//                                             day: day.name,
//                                             value:
//                                               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                                               //@ts-ignore
//                                               !classDaysData[day.name],
//                                           })
//                                         }
//                                       />
//                                       <label key={uuidv4()} htmlFor={day.name}>
//                                         {" "}
//                                         {day.name}
//                                       </label>
//                                     </div>
//                                   </>
//                                 ))
//                             )
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* NEW CURRICULUM/INITIAL DAY */}
//                   <div className="flex w-full gap-2 items-center">
//                     <label
//                       htmlFor="newCurriculumClassPick"
//                       className={
//                         newClassError
//                           ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                           : "w-1/4 text-right"
//                       }
//                     >
//                       Escolha o dia de início da nova modalidade:
//                     </label>
//                     <div className="flex w-3/4">
//                       <DatePicker
//                         months={months}
//                         weekDays={weekDays}
//                         placeholder={
//                           newClassError
//                             ? "É necessário selecionar uma Data"
//                             : "Selecione uma Data"
//                         }
//                         currentDate={new DateObject()}
//                         inputClass={
//                           newClassError
//                             ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                             : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                         }
//                         minDate={new DateObject().add(1, "day")}
//                         mapDays={({ date }) => {
//                           const isWeekend = newClass.enrolledDays.includes(
//                             date.weekDay.index
//                           );

//                           if (!isWeekend)
//                             return {
//                               disabled: true,
//                               style: { color: "#ccc" },
//                               title: "Aula não disponível neste dia",
//                             };
//                         }}
//                         editable={false}
//                         format="DD/MM/YYYY"
//                         onChange={(e: DateObject) => {
//                           e !== null
//                             ? setNewStudentData({
//                                 ...newStudentData,
//                                 curriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
//                               })
//                             : null;
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {dayIsAlreadyWithClass && (
//                     <>
//                       {/* DAY WITH OTHER CLASS ALREADY PICKED ALERT */}
//                       <h1 className="font-bold py-4 text-red-600 dark:text-yellow-500">
//                         Atenção: alguns dias não estão disponíveis pois o Aluno
//                         já está matriculado em outra modalidade neste mesmo dia,
//                         após excluir e salvar os dias estarão disponíveis.
//                       </h1>
//                     </>
//                   )}
//                   {/** CHECKBOX CONFIRM INSERT NEW CURRICULUM */}
//                   <div className="flex justify-center items-center gap-2 mt-6">
//                     <input
//                       type="checkbox"
//                       name="confirmAddCurriculum"
//                       className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                       checked={newStudentData.confirmAddCurriculum}
//                       onChange={() => {
//                         setNewStudentData({
//                           ...newStudentData,
//                           confirmAddCurriculum:
//                             !newStudentData.confirmAddCurriculum,
//                         });
//                       }}
//                     />
//                     <label htmlFor="confirmAddCurriculum" className="text-sm">
//                       Confirmar inclusão da Aula
//                     </label>
//                   </div>
//                 </div>
//               )}

//             <ShowCurriculums
//               curriculumState={curriculumState}
//               userRole={userFullData ? userFullData.role : "user"}
//               studentId={studentEditData.id}
//               studentFreeDays={studentFreeDays}
//               removedCurriculums={removedCurriculums}
//               setRemovedCurriculums={setRemovedCurriculums}
//               setCurriculumState={setCurriculumState}
//               newAddCurriculums={newAddCurriculums}
//               onlyView={onlyView}
//             />

//             {/** CURRICULUM SECTION TITLE */}
//             {curriculumCount > 0 && (
//               <h1 className="font-bold text-lg py-4  text-red-600 dark:text-yellow-500">
//                 Selecionar Modalidade:
//               </h1>
//             )}
//             {Array.from({ length: curriculumCount }).map((_, index) => (
//               <SelectSchoolAndCourse
//                 key={index}
//                 curriculumState={curriculumState}
//                 selectedSchoolClassId={studentEditData.schoolYears}
//                 onAdd={upsertCurriculum}
//                 onDel={removeCurriculum}
//                 studentFreeDays={studentFreeDays}
//                 setNewAddCurriculums={setNewAddCurriculums}
//               />
//             ))}

//             {/* Botão para adicionar um novo currículo (apenas aparece quando o contador é maior que 0) */}
//             {!onlyView && (
//               <div className="flex justify-center py-2">
//                 <div
//                   className="flex md:w-2/4 items-center justify-center gap-4 px-4 py-1 cursor-pointer border rounded-md border-green-900/10 bg-klGreen-500 hover:bg-klGreen-500/80 transition-all disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
//                   onClick={handleAddCurriculum}
//                 >
//                   <MdAdd />
//                   <span>Adicionar modalidade ou aula experimental</span>
//                 </div>
//               </div>
//             )}

//             {/** CURRICULUM SECTION TITLE */}
//             {/* {!(onlyView && excludeCurriculum.length < 1) && (
//               <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//                 Matriculado em:
//               </h1>
//             )} */}

//             {/* EXISTENT CURRICULUM */}
//             {!(onlyView && excludeCurriculum.length < 1) &&
//               haveCurriculum &&
//               excludeCurriculum.map((curriculum, index) => (
//                 <>
//                   {/* <div className="flex gap-2 items-center" key={curriculum.id}>
//                     <label
//                       htmlFor="existentCurriculumName"
//                       className="w-1/4 text-right"
//                     >
//                       Aula {index + 1}
//                       {curriculum.exclude && (
//                         <span className="text-xs">
//                           {" "}
//                           (selecionada para exclusão)
//                         </span>
//                       )}
//                       :{" "}
//                     </label>
//                     <div className="flex w-3/4 gap-2">
//                       <div className="w-11/12">
//                         <input
//                           type="text"
//                           name="existentCurriculumName"
//                           disabled={
//                             isSubmitting
//                               ? true
//                               : onlyView
//                               ? true
//                               : curriculum.exclude
//                           }
//                           className={
//                             curriculum.exclude
//                               ? "w-full px-2 py-1 dark:bg-gray-800 border border-klOrange-500 dark:border-klOrange-500 dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                               : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                           }
//                           value={formatCurriculumName(curriculum.id)}
//                           readOnly
//                         />
//                       </div>
//                       {!onlyView && (
//                         <EditCurriculumButton
//                           index={index}
//                           isExperimental={false}
//                           curriculum={curriculum}
//                           openEditCurriculumDays={openEditCurriculumDays}
//                           setOpenEditCurriculumDays={() =>
//                             setOpenEditCurriculumDays(!openEditCurriculumDays)
//                           }
//                           handleIncludeExcludeFunction={
//                             handleIncludeExcludeCurriculum
//                           }
//                           cancelEditFunction={restoreEditedExcludeCurriculum}
//                         />
//                       )}
//                     </div>
//                   </div> */}
//                   {openEditCurriculumDays && (
//                     <>
//                       {/* STUDENT CLASS DAYS */}
//                       {/* <div className="flex gap-2 items-center py-2">
//                         <label
//                           htmlFor="experimentalClassPick"
//                           className={
//                             experimentalClassError
//                               ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                               : "w-1/4 text-right"
//                           }
//                         >
//                           Escolha os dias de Aula:
//                         </label>
//                         <div className="flex w-3/4">
//                           <div className="flex w-full items-center">
//                             {curriculumDatabaseData.map(
//                               (curriculumDatabase) =>
//                                 curriculumDatabase.id === curriculum.id &&
//                                 classDaysDatabaseData.map(
//                                   (classDaysDatabase) =>
//                                     classDaysDatabase.id ===
//                                       curriculumDatabase.classDayId &&
//                                     classDaysDatabase.indexDays.map(
//                                       (classDayIndexNumber) =>
//                                         classDayIndex.map(
//                                           (day) =>
//                                             day.id === classDayIndexNumber && (
//                                               <div
//                                                 key={uuidv4()}
//                                                 className="flex w-full items-center gap-2"
//                                               >
//                                                 <input
//                                                   key={uuidv4()}
//                                                   type="checkbox"
//                                                   className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
//                                                   id={day.name}
//                                                   name={day.name}
//                                                   checked={curriculum.indexDays.includes(
//                                                     day.id
//                                                   )}
//                                                   onChange={() => {
//                                                     const data: ExcludeCurriculumProps =
//                                                       {
//                                                         exclude:
//                                                           curriculum.exclude,
//                                                         id: curriculum.id,
//                                                         date: curriculum.date,
//                                                         isExperimental:
//                                                           curriculum.isExperimental,
//                                                         indexDays:
//                                                           curriculum.indexDays,
//                                                         price: curriculum.price,
//                                                       };
//                                                     handleIncludeExcludeCurriculum(
//                                                       index,
//                                                       data
//                                                     );
//                                                     toggleCurriculumClassDays({
//                                                       day: day.id,
//                                                       curriculum: curriculum,
//                                                       index: index,
//                                                     });
//                                                   }}
//                                                 />
//                                                 <label
//                                                   key={uuidv4()}
//                                                   htmlFor={day.name}
//                                                 >
//                                                   {" "}
//                                                   {day.name}
//                                                 </label>
//                                               </div>
//                                             )
//                                         )
//                                     )
//                                 )
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <hr className="py-4" /> */}
//                     </>
//                   )}
//                 </>
//               ))}

//             {/** CHECKBOX ADD CURRICULUM */}
//             {/* {!onlyView && (
//               <div className="flex gap-2 items-center">
//                 <label
//                   htmlFor="addCurriculum"
//                   className={
//                     errors.addCurriculum
//                       ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                       : "w-1/4 text-right"
//                   }
//                 >
//                   Adicionar Modalidade ?{" "}
//                 </label>
//                 <div className="w-3/4 flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="addCurriculum"
//                     className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                     checked={studentEditData.addCurriculum}
//                     onChange={() => {
//                       setStudentEditData({
//                         ...studentEditData,
//                         addCurriculum: !studentEditData.addCurriculum,
//                       });
//                       setCurriculumData({
//                         schoolId: "",
//                         schoolClassId: "",
//                         schoolCourseId: "",
//                       });
//                       setNewClass({
//                         ...newClass,
//                         enrolledDays: [],
//                       });
//                     }}
//                   />
//                 </div>
//               </div>
//             )} */}

//             {/** ADD CURRICULUM */}
//             {studentEditData.addCurriculum && (
//               <div className="flex flex-col py-2 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
//                 {/** ADD CURRICULUM SECTION TITLE */}
//                 {/* <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//                   Atenção: você está adicionando uma nova aula para{" "}
//                   {studentEditData.name}:
//                 </h1> */}

//                 {/* SCHOOL SELECT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="newSchoolSelect"
//                     className={
//                       errors.addCurriculum
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione a Escola:{" "}
//                   </label>
//                   <select
//                     id="newSchoolSelect"
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       errors.addCurriculum
//                         ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                     }
//                     name="newSchoolSelect"
//                     onChange={(e) => {
//                       setCurriculumData({
//                         ...curriculumData,
//                         schoolId: e.target.value,
//                         schoolClassId: "",
//                         schoolCourseId: "",
//                       });
//                       setNewClass({
//                         name: "",
//                         date: "",
//                         enrolledDays: [],
//                       });
//                       setClassDaysData({
//                         Domingo: true,
//                         Segunda: true,
//                         Terça: true,
//                         Quarta: true,
//                         Quinta: true,
//                         Sexta: true,
//                         Sábado: true,
//                       });
//                     }}
//                   >
//                     <SelectOptions returnId dataType="schools" />
//                   </select>
//                 </div> */}

//                 {/* SCHOOL CLASS SELECT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="newSchoolClassSelect"
//                     className={
//                       errors.addCurriculum
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione o Ano Escolar:{" "}
//                   </label>
//                   <select
//                     id="newSchoolClassSelect"
//                     disabled={curriculumData.schoolId ? false : true}
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       curriculumData.schoolId
//                         ? errors.addCurriculum
//                           ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                           : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                     }
//                     name="newSchoolClassSelect"
//                     onChange={(e) => {
//                       setCurriculumData({
//                         ...curriculumData,
//                         schoolClassId: e.target.value,
//                         schoolCourseId: "",
//                       });
//                       setNewStudentData({ ...newStudentData, curriculum: "" });
//                       setNewClass({
//                         name: "",
//                         date: "",
//                         enrolledDays: [],
//                       });
//                       setClassDaysData({
//                         Domingo: true,
//                         Segunda: true,
//                         Terça: true,
//                         Quarta: true,
//                         Quinta: true,
//                         Sexta: true,
//                         Sábado: true,
//                       });
//                     }}
//                   >
//                     <SelectOptions
//                       returnId
//                       dataType="schoolClasses"
//                       schoolId={curriculumData.schoolId}
//                     />
//                   </select>
//                 </div> */}

//                 {/* SCHOOL COURSE SELECT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="newSchoolCourseSelect"
//                     className={
//                       errors.addCurriculum
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione a Modalidade:{" "}
//                   </label>
//                   <select
//                     id="newSchoolCourseSelect"
//                     disabled={curriculumData.schoolClassId ? false : true}
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       curriculumData.schoolClassId
//                         ? errors.addCurriculum
//                           ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                           : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                     }
//                     name="newSchoolCourseSelect"
//                     onChange={(e) => {
//                       setCurriculumData({
//                         ...curriculumData,
//                         schoolCourseId: e.target.value,
//                       });
//                       setNewStudentData({ ...newStudentData, curriculum: "" });
//                       setNewClass({
//                         name: "",
//                         date: "",
//                         enrolledDays: [],
//                       });
//                       setClassDaysData({
//                         Domingo: true,
//                         Segunda: true,
//                         Terça: true,
//                         Quarta: true,
//                         Quinta: true,
//                         Sexta: true,
//                         Sábado: true,
//                       });
//                     }}
//                   >
//                     <SelectOptions
//                       returnId
//                       schoolId={curriculumData.schoolId}
//                       schoolClassId={curriculumData.schoolClassId}
//                       dataType="schoolCourses"
//                     />
//                     <option value={"all"}>Todas as Modalidades</option>
//                   </select>
//                 </div> */}

//                 {/* CURRICULUM SELECT */}
//                 {curriculumData.schoolId &&
//                 curriculumData.schoolClassId &&
//                 curriculumData.schoolCourseId ? (
//                   <>
//                     {/* CURRICULUM CARD DETAILS SECTION TITLE */}
//                     {/* <h1 className="font-bold text-2xl py-4">
//                       {newSchoolSelectedData?.name} -{" "}
//                       {newSchoolClassSelectedData?.name} -{" "}
//                       {newSchoolCourseSelectedData?.name}:
//                     </h1> */}

//                     {/* SEPARATOR */}
//                     {/* <hr className="pb-4" /> */}

//                     {newCurriculumCoursesData.length !== 0 ? (
//                       <>
//                         {/* CURRICULUM CARD DETAILS */}
//                         {/* <div className="flex flex-wrap gap-4 justify-center">
//                           {newCurriculumCoursesData.map((curriculum) => (
//                             <div
//                               className={
//                                 errors.addCurriculum
//                                   ? "flex flex-col items-center p-4 mb-4 gap-6 bg-red-500/50 dark:bg-red-800/70 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
//                                   : "flex flex-col items-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
//                               }
//                               key={curriculum.id}
//                             >
//                               <input
//                                 type="radio"
//                                 id={curriculum.id}
//                                 name="curriculumCardDetails"
//                                 className="text-klGreen-500 dark:text-klGreen-500 border-none"
//                                 value={curriculum.id}
//                                 onChange={(e) => {
//                                   setNewStudentData({
//                                     ...newStudentData,
//                                     curriculum: e.target.value,
//                                     curriculumClassDayId: curriculum.classDayId,
//                                     confirmAddCurriculum: false,
//                                   });
//                                   setNewClass({
//                                     ...newClass,
//                                     date: "",
//                                   });
//                                   setClassDaysData({
//                                     Domingo: true,
//                                     Segunda: true,
//                                     Terça: true,
//                                     Quarta: true,
//                                     Quinta: true,
//                                     Sexta: true,
//                                     Sábado: true,
//                                   });
//                                 }}
//                               />
//                               <label
//                                 htmlFor="curriculumCardDetails"
//                                 className="flex flex-col gap-4"
//                               >
//                                 <CurriculumCardDescription id={curriculum.id} />
//                               </label>
//                             </div>
//                           ))}
//                         </div> */}
//                       </>
//                     ) : (
//                       <>
//                         {/* CURRICULUM EMPTY DESCRIPTION */}
//                         {/* <h1 className="font-bold text-2xl pb-10 text-red-600 dark:text-yellow-500">
//                           Nenhuma vaga disponível com as opções selecionadas,
//                           tente novamente.
//                         </h1> */}
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     {/* CURRICULUM PRE-SELECT DESCRIPTION */}
//                     {/* <p className="text-red-600 dark:text-yellow-500">
//                       Selecione um colégio e um Ano Escolar para ver as
//                       modalidades disponíveis.
//                     </p> */}
//                   </>
//                 )}

//                 {newStudentData.curriculum &&
//                   classDayCurriculumSelectedData &&
//                   classDayCurriculumSelectedData.indexDays.length !==
//                     undefined && (
//                     <>
//                       {curriculumPlacesAvailable &&
//                       curriculumEmptyWaitingList ? (
//                         <div>
//                           {/* STUDENT CLASS DAYS */}
//                           {/* <div className="flex gap-2 items-center py-2">
//                             <label
//                               htmlFor="experimentalClassPick"
//                               className={
//                                 experimentalClassError
//                                   ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                                   : "w-1/4 text-right"
//                               }
//                             >
//                               Escolha os dias de Aula:
//                             </label>
//                             <div className="flex w-3/4">
//                               <div className="flex w-full items-center">
//                                 {classDayCurriculumSelectedData.indexDays.map(
//                                   (classDayIndexNumber) =>
//                                     classDayIndex.map(
//                                       (day) =>
//                                         day.id === classDayIndexNumber &&
//                                         (newStudentData.indexDays.includes(
//                                           day.id
//                                         ) ? (
//                                           <>
//                                             <div
//                                               key={uuidv4()}
//                                               className="flex w-full items-center gap-2"
//                                             >
//                                               <input
//                                                 key={uuidv4()}
//                                                 type="checkbox"
//                                                 className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none opacity-70"
//                                                 id={day.name}
//                                                 name={day.name}
//                                                 checked={false}
//                                                 disabled
//                                               />
//                                               <label
//                                                 key={uuidv4()}
//                                                 htmlFor={day.name}
//                                                 className="opacity-70"
//                                               >
//                                                 {" "}
//                                                 {day.name}{" "}
//                                                 <span className="text-xs">
//                                                   (aluno já faz aula neste dia)
//                                                 </span>
//                                               </label>
//                                             </div>
//                                           </>
//                                         ) : (
//                                           <>
//                                             <div
//                                               key={uuidv4()}
//                                               className="flex w-full items-center gap-2"
//                                             >
//                                               <input
//                                                 key={uuidv4()}
//                                                 type="checkbox"
//                                                 className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
//                                                 id={day.name}
//                                                 name={day.name}
//                                                 checked={
//                                                   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                                                   //@ts-ignore
//                                                   classDaysData[day.name]
//                                                 }
//                                                 onChange={() =>
//                                                   toggleClassDays({
//                                                     day: day.name,
//                                                     value:
//                                                       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                                                       //@ts-ignore
//                                                       !classDaysData[day.name],
//                                                   })
//                                                 }
//                                               />
//                                               <label
//                                                 key={uuidv4()}
//                                                 htmlFor={day.name}
//                                               >
//                                                 {" "}
//                                                 {day.name}
//                                               </label>
//                                             </div>
//                                           </>
//                                         ))
//                                     )
//                                 )}
//                               </div>
//                             </div>
//                           </div> */}

//                           {/* NEW CURRICULUM/INITIAL DAY */}
//                           {/* <div className="flex gap-2 items-center">
//                             <label
//                               htmlFor="newCurriculumClassPick"
//                               className={
//                                 newClassError
//                                   ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                                   : "w-1/4 text-right"
//                               }
//                             >
//                               Escolha o dia de início da nova modalidade:
//                             </label>
//                             <div className="flex w-3/4">
//                               <DatePicker
//                                 months={months}
//                                 weekDays={weekDays}
//                                 placeholder={
//                                   newClassError
//                                     ? "É necessário selecionar uma Data"
//                                     : "Selecione uma Data"
//                                 }
//                                 currentDate={new DateObject()}
//                                 inputClass={
//                                   newClassError
//                                     ? "px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                                     : "px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                                 }
//                                 minDate={new DateObject().add(1, "day")}
//                                 mapDays={({ date }) => {
//                                   const isWeekend =
//                                     newClass.enrolledDays.includes(
//                                       date.weekDay.index
//                                     );

//                                   if (!isWeekend)
//                                     return {
//                                       disabled: true,
//                                       style: { color: "#ccc" },
//                                       title: "Aula não disponível neste dia",
//                                     };
//                                 }}
//                                 editable={false}
//                                 format="DD/MM/YYYY"
//                                 onChange={(e: DateObject) => {
//                                   e !== null
//                                     ? setNewStudentData({
//                                         ...newStudentData,
//                                         curriculumInitialDate: `${e.month}/${e.day}/${e.year}`,
//                                       })
//                                     : null;
//                                 }}
//                               />
//                             </div>
//                           </div> */}

//                           {dayIsAlreadyWithClass && (
//                             <>
//                               {/* DAY WITH OTHER CLASS ALREADY PICKED ALERT */}
//                               {/* <h1 className="font-bold py-4 text-red-600 dark:text-yellow-500">
//                                 Atenção: alguns dias não estão disponíveis pois
//                                 o Aluno já está matriculado em outra modalidade
//                                 neste mesmo dia, após excluir e salvar os dias
//                                 estarão disponíveis.
//                               </h1> */}
//                             </>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="flex flex-col w-full items-center justify-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent rounded-2xl text-center text-lg text-red-600 dark:text-yellow-500">
//                           {/* CLASS WAITING LIST DISCLAIMER */}
//                           {/* <h1 className="font-bold">FILA DE ESPERA</h1>
//                           <p className="flex items-center">
//                             A turma selecionada está sem vaga disponível para
//                             matrícula, confirme a inclusão abaixo e salve o
//                             cadastro para entrar na fila de espera.
//                             <br /> Seguimos uma ordem nesta fila por data de
//                             cadastro, sendo assim, à medida que as vagas forem
//                             disponibilizadas, entraremos em contato.
//                           </p> */}
//                         </div>
//                       )}
//                     </>
//                   )}

//                 {/** CHECKBOX CONFIRM INSERT NEW CURRICULUM */}
//                 {/* <div className="flex justify-center items-center gap-2 mt-6">
//                   <input
//                     type="checkbox"
//                     name="confirmAddCurriculum"
//                     className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                     checked={newStudentData.confirmAddCurriculum}
//                     onChange={() => {
//                       setNewStudentData({
//                         ...newStudentData,
//                         confirmAddCurriculum:
//                           !newStudentData.confirmAddCurriculum,
//                       });
//                     }}
//                   />
//                   <label htmlFor="confirmAddCurriculum" className="text-sm">
//                     Confirmar inclusão da Aula
//                   </label>
//                 </div> */}
//               </div>
//             )}

//             {/** FAMILY SECTION TITLE */}
//             {!(onlyView && !haveFamily) && (
//               <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//                 Familiares:
//               </h1>
//             )}

//             {/* EXISTENT FAMILY */}
//             {haveFamily &&
//               excludeFamily
//                 .sort((a, b) =>
//                   handleOneStudentDetails(a.id)!.name.localeCompare(
//                     handleOneStudentDetails(b.id)!.name
//                   )
//                 )
//                 .map((family, index) => (
//                   <div className="flex gap-2 items-center" key={family.id}>
//                     <label
//                       htmlFor="existentFamilyName"
//                       className="w-1/4 text-right"
//                     >
//                       {index === 0 ? "Familiares: " : ""}
//                     </label>
//                     <div className="flex w-3/4 gap-2">
//                       <div className="w-10/12">
//                         <input
//                           type="text"
//                           name="existentFamilyName"
//                           disabled={
//                             isSubmitting
//                               ? true
//                               : onlyView
//                               ? true
//                               : family.exclude
//                           }
//                           className={
//                             family.exclude
//                               ? "w-full px-2 py-1 dark:bg-gray-800 border border-klOrange-500 dark:border-klOrange-500 dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                               : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                           }
//                           value={handleOneStudentDetails(family.id)?.name ?? ""}
//                           readOnly
//                         />
//                       </div>
//                       {!onlyView && (
//                         <EditFamilyButton
//                           family={family}
//                           index={index}
//                           handleIncludeExcludeFunction={
//                             handleIncludeExcludeFamily
//                           }
//                         />
//                       )}
//                     </div>
//                   </div>
//                 ))}

//             {/* {systemConstantsValues && (
//               <FamilyForm
//                 studentData={studentEditData}
//                 familyStudentData={familyStudentData}
//                 setStudentData={setStudentEditData}
//                 setFamilyStudentData={setFamilyStudentData}
//                 systemConstantsValues={systemConstantsValues}
//               />
//             )} */}
//             {/** CHECKBOX ADD FAMILY */}
//             {!onlyView &&
//               studentSelectedData &&
//               studentSelectedData.studentFamilyAtSchool.length < 1 &&
//               !willHaveFamily && (
//                 <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="addFamily"
//                     className={
//                       errors.addFamily
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Adicionar Familiar ?{" "}
//                   </label>
//                   <div className="w-3/4 flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="addFamily"
//                       className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                       checked={!willHaveFamily && studentEditData.addFamily}
//                       onChange={() => {
//                         setStudentEditData({
//                           ...studentEditData,
//                           addFamily: !studentEditData.addFamily,
//                         });
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}

//             {/** ADD FAMILY */}
//             {studentEditData.addFamily && (
//               <div className="flex flex-col p-4 gap-2 bg-white/50 dark:bg-gray-800/40 rounded-xl">
//                 {/** ADD FAMILY SECTION TITLE */}
//                 <h1 className="font-bold text-lg pb-4 text-red-600 dark:text-yellow-500">
//                   Atenção: a seguir insira os dados do aluno que estuda na KL
//                   Minas, <br />e é familiar de {studentEditData.name}:
//                 </h1>

//                 {/* FAMILY STUDENT SELECT */}
//                 <div className="flex gap-2 items-center pb-2">
//                   <label
//                     htmlFor="newFamilyStudentSelect"
//                     className={
//                       errors.addFamily
//                         ? "w-1/4 text-right text-red-500 dark:text-red-400"
//                         : "w-1/4 text-right"
//                     }
//                   >
//                     Selecione o Familiar:{" "}
//                   </label>
//                   <select
//                     id="newFamilyStudentSelect"
//                     defaultValue={" -- select an option -- "}
//                     className={
//                       errors.addFamily
//                         ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                         : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                     }
//                     name="newFamilyStudentSelect"
//                     onChange={(e) => {
//                       setNewStudentData({
//                         ...newStudentData,
//                         familyId: e.target.value,
//                       });
//                     }}
//                   >
//                     {/* {newStudentData.newFamilyCurriculumId ? ( */}
//                     <SelectOptions
//                       returnId
//                       dataType="searchEnrolledStudent"
//                       // dontShowMyself
//                       studentId={studentId}
//                       // curriculumId={newStudentData.newFamilyCurriculumId}
//                       parentOneEmail={studentEditData.parentOne.email}
//                       parentTwoEmail={studentEditData.parentTwo.email}
//                       financialResponsibleDocument={
//                         studentEditData.financialResponsible.document
//                       }
//                     />
//                     {/* ) : (
//                     <option disabled value={" -- select an option -- "}>
//                       {" "}
//                       -- Selecione Colégio, Ano Escolar e Modalidade para ver os
//                       alunos disponíveis --{" "}
//                     </option>
//                   )} */}
//                   </select>
//                 </div>

//                 {/** CHECKBOX CONFIRM INSERT NEW FAMILY */}
//                 <div className="flex justify-center items-center gap-2 mt-6">
//                   <input
//                     type="checkbox"
//                     name="confirmAddFamily"
//                     className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                     checked={newStudentData.confirmAddFamily}
//                     onChange={() => {
//                       setNewStudentData({
//                         ...newStudentData,
//                         confirmAddFamily: !newStudentData.confirmAddFamily,
//                       });
//                     }}
//                   />
//                   <label htmlFor="confirmAddFamily" className="text-sm">
//                     Confirmar inclusão do Familiar
//                   </label>
//                 </div>
//               </div>
//             )}

//             {/** PRICES SECTION TITLE */}
//             <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
//               Financeiro:
//             </h1>
//             {curriculumState.curriculums.length > 0 &&
//               systemConstantsValues &&
//               userFullData && (
//                 <>
//                   {/* <FamilyForm
//                     studentData={studentEditData}
//                     familyStudentData={familyStudentData}
//                     setStudentData={setStudentEditData}
//                     setFamilyStudentData={setFamilyStudentData}
//                     systemConstantsValues={systemConstantsValues}
//                   /> */}
//                   {hasNonExperimentalCurriculum && (
//                     <>
//                       <DiscountForm
//                         data={studentEditData}
//                         setData={setStudentEditData}
//                         systemConstantsValues={systemConstantsValues}
//                         userRole={userFullData.role}
//                       />
//                       <PaymentDetails
//                         data={studentEditData}
//                         setData={setStudentEditData}
//                         systemConstantsValues={systemConstantsValues}
//                         userRole={userFullData.role}
//                         appliedPrice={curriculumState.appliedPrice}
//                         enrolmentFee={curriculumState.enrollmentFee}
//                       />
//                     </>
//                   )}
//                 </>
//               )}

//             {!onlyView && userFullData && userFullData.role !== "user" && (
//               <>
//                 {/** CHECKBOX ADD ENROLMENT EXEMPTION */}
//                 {/* <div className="flex gap-2 items-center py-2">
//                   <label
//                     htmlFor="enrolmentExemption"
//                     className="w-1/4 text-right"
//                   >
//                     Ativar Isenção de Matrícula ?{" "}
//                   </label>
//                   <div className="w-3/4 flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="enrolmentExemption"
//                       className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                       checked={enrolmentExemption}
//                       disabled={onlyView}
//                       onChange={() => {
//                         setEnrolmentExemption(!enrolmentExemption);
//                       }}
//                     />
//                   </div>
//                 </div> */}
//               </>
//             )}

//             {/* STUDENT ENROLMENT PRICE */}
//             {/* <div className="flex gap-2 items-center">
//               <label htmlFor="enrolmentFee" className="w-1/4 text-right">
//                 Matrícula:
//               </label>
//               <input
//                 type="text"
//                 name="enrolmentFee"
//                 className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 readOnly
//                 disabled={onlyView}
//                 value={studentEditData.enrolmentFee.toLocaleString("pt-BR", {
//                   style: "currency",
//                   currency: "BRL",
//                 })}
//               />
//             </div> */}

//             {!onlyView && userFullData && userFullData.role !== "user" && (
//               <>
//                 {/** CHECKBOX ADD EMPLOYEE DISCOUNT */}
//                 {/* <div className="flex gap-2 items-center">
//                   <label
//                     htmlFor="employeeDiscount"
//                     className="w-1/4 text-right"
//                   >
//                     Ativar Desconto de Funcionário ?{" "}
//                   </label>
//                   <div className="w-3/4 flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="employeeDiscount"
//                       className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                       disabled={
//                         onlyView ? true : studentEditData.customDiscount
//                       }
//                       checked={studentEditData.employeeDiscount}
//                       onChange={() => {
//                         setStudentEditData({
//                           ...studentEditData,
//                           employeeDiscount: !studentEditData.employeeDiscount,
//                         });
//                       }}
//                     />
//                   </div>
//                 </div> */}

//                 {/** CHECKBOX ADD CUSTOM DISCOUNT */}
//                 {/* <div className="flex gap-2 items-center py-2">
//                   <label htmlFor="customDiscount" className="w-1/4 text-right">
//                     Ativar Desconto Personalizado ?{" "}
//                   </label>
//                   <div className="w-3/4 flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="customDiscount"
//                       disabled={onlyView}
//                       className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none"
//                       checked={studentEditData.customDiscount}
//                       onChange={() => {
//                         setStudentEditData({
//                           ...studentEditData,
//                           employeeDiscount: false,
//                           customDiscount: !studentEditData.customDiscount,
//                         });
//                       }}
//                     />
//                     <label
//                       htmlFor="customDiscountValue"
//                       className="w-1/4 text-right"
//                     >
//                       Porcentagem de desconto:{" "}
//                     </label>
//                     <input
//                       type="text"
//                       name="customDiscountValue"
//                       disabled={
//                         onlyView ? true : !studentEditData.customDiscount
//                       }
//                       className={
//                         onlyView ?? studentEditData.customDiscount
//                           ? errors.customDiscountValue
//                             ? "w-1/12 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
//                             : "w-1/12 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                           : "w-1/12 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
//                       }
//                       pattern="^(100|[1-9]?[0-9])$"
//                       maxLength={3}
//                       value={
//                         studentEditData.customDiscount
//                           ? studentEditData.customDiscountValue
//                           : "0"
//                       }
//                       onChange={(e) => {
//                         const value = e.target.value.replace(/[^0-9]/g, "");
//                         if (Number(value) <= 100) {
//                           setStudentEditData({
//                             ...studentEditData,
//                             customDiscountValue: value,
//                           });
//                         }
//                       }}
//                     />
//                     <label
//                       htmlFor="customDiscountValue"
//                       className="w-1/4 text-left"
//                     >
//                       %
//                     </label>
//                   </div>
//                 </div> */}
//               </>
//             )}
//             {/* STUDENT CLASS DAYS MONTHLY PAYMENT PRICE */}
//             {/* <div className="flex gap-2 items-center">
//               <label htmlFor="monthlyPayment" className="w-1/4 text-right">
//                 Mensalidade:
//               </label>
//               <input
//                 type="text"
//                 name="monthlyPayment"
//                 className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
//                 disabled={onlyView}
//                 readOnly
//                 value={newPrices.appliedPrice.toLocaleString("pt-BR", {
//                   style: "currency",
//                   currency: "BRL",
//                 })}
//               />
//             </div> */}

//             {/* STUDENT PAYMENT DAY */}
//             {!onlyView && (
//               <div className="flex gap-2 items-center">
//                 {userFullData && userFullData.role !== "user" ? (
//                   <>
//                     {/* <label htmlFor="dayPayment" className="w-1/4 text-right">
//                       Melhor dia para pagamento:
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         className="text-klGreen-500 dark:text-klGreen-500 border-none"
//                         value="5"
//                         name="gender"
//                         checked={
//                           studentEditData.paymentDay === "5" ? true : false
//                         }
//                         onChange={(e) =>
//                           setStudentEditData({
//                             ...studentEditData,
//                             paymentDay: e.target.value,
//                           })
//                         }
//                       />{" "}
//                       5
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         className="text-klGreen-500 dark:text-klGreen-500 border-none"
//                         value="10"
//                         name="gender"
//                         checked={
//                           studentEditData.paymentDay === "10" ? true : false
//                         }
//                         onChange={(e) =>
//                           setStudentEditData({
//                             ...studentEditData,
//                             paymentDay: e.target.value,
//                           })
//                         }
//                       />{" "}
//                       10
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         className="text-klGreen-500 dark:text-klGreen-500 border-none"
//                         value="15"
//                         name="gender"
//                         checked={
//                           studentEditData.paymentDay === "15" ? true : false
//                         }
//                         onChange={(e) =>
//                           setStudentEditData({
//                             ...studentEditData,
//                             paymentDay: e.target.value,
//                           })
//                         }
//                       />{" "}
//                       15
//                     </label> */}
//                   </>
//                 ) : (
//                   <>
//                     {/* <div className="flex w-1/4" />
//                     <div className="flex w-3/4 px-2 py-1 gap-10 justify-start items-center">
//                       <p className="text-sm text-red-600 dark:text-yellow-500">
//                         Data de vencimento dia{" "}
//                         {systemConstantsValues &&
//                         +systemConstantsValues?.standardPaymentDay < 10
//                           ? `0${systemConstantsValues?.standardPaymentDay}`
//                           : systemConstantsValues?.standardPaymentDay}{" "}
//                         do mês a cursar, pagamento antecipado
//                       </p>
//                     </div> */}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* SUBMIT AND RESET BUTTONS */}
//             <div className="flex gap-2 my-4 justify-center">
//               {/* SUBMIT BUTTON */}
//               {!onlyView && (
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
//                 >
//                   {!isSubmitting ? "Salvar" : "Salvando"}
//                 </button>
//               )}

//               {/* RESET BUTTON */}
//               <button
//                 type="reset"
//                 className="border rounded-xl border-gray-600/20 bg-gray-200 disabled:bg-gray-200/30 disabled:border-gray-600/30 text-gray-600 disabled:text-gray-400 w-2/4"
//                 disabled={isSubmitting}
//                 onClick={() => {
//                   resetForm();
//                 }}
//               >
//                 {isSubmitting ? "Aguarde" : onlyView ? "Fechar" : "Cancelar"}
//               </button>
//             </div>
//           </form>
//         </FormProvider>
//         {userFullData && (
//           <CurriculumBalloon
//             curriculumState={curriculumState}
//             userRole={userFullData.role}
//             customDiscount={studentEditData.customDiscount}
//             customDiscountValue={studentEditData.customDiscountValue}
//             employeeDiscount={studentEditData.employeeDiscount}
//             familyDiscount={studentEditData.familyDiscount}
//             secondCourseDiscount={studentEditData.secondCourseDiscount}
//             studentFamilyAtSchool={studentEditData.studentFamilyAtSchool}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
