import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  getFirestore,
  collection,
  doc,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  query,
  onSnapshot,
  where,
  getDocs,
  collectionGroup,
  arrayRemove,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  useCollection,
  useDocument,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";

import { app } from "../../db/Firebase";
import {
  CurriculumSearchProps,
  SubCollectionDetailsProps,
  SubCollectionProps,
  TesteBancoValidationZProps,
} from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { testeBancoValidationSchema } from "../../@types/zodValidation";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function TestesBanco() {
  // SEED DATA
  const [seedData, setSeedData] = useState<TesteBancoValidationZProps>({
    confirmInsert: false,
  });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TesteBancoValidationZProps>({
    resolver: zodResolver(testeBancoValidationSchema),
    defaultValues: {
      confirmInsert: false,
    },
  });

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("confirmInsert", seedData.confirmInsert);
  }, [seedData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.confirmInsert];
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

  // SUBMIT SEED DATA FUNCTION
  const handleAddSeed: SubmitHandler<TesteBancoValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);
    const oldCurriculumArray: DetailsProps[] = [
      {
        date: "Timestamp(seconds=1674415946, nanoseconds=419000000)",
        id: "3683d2cb-3cf3-4f5f-b15b-0242861d5fa7",
        name: "Colégio Bernoulli | Xadrez | Horário Bernoulli - 3º ao 5º Ano Vespertino | Sexta-feira | Professor: Natália Peruzzo Costa",
      },
      {
        date: "Timestamp(seconds=1674415946, nanoseconds=419000000)",
        id: "aa79ba81-9a48-4b7c-83dc-7857f613db92",
        name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 1º e 2º Ano Vespertino | Segunda e Quarta-feira | Professor: Natália Peruzzo Costa",
      },
      {
        date: "Timestamp(seconds=1674415946, nanoseconds=419000000)",
        id: "c2876b59-2368-4b20-8742-969921c2894e",
        name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 1º e 2º Período Vespertino | Segunda e Quarta-feira | Professor: Natália Peruzzo Costa",
      },
    ];
    const idExampleArray = [
      // "aa79ba81-9a48-4b7c-83dc-7857f613db92",
      // "3683d2cb-3cf3-4f5f-b15b-0242861d5fa7",
      "c2876b59-2368-4b20-8742-969921c2894e",
    ];

    // PEGANDO ID E RETIRANDO DETAILS QUE RECEBI DO STUDENT
    // const deleteCurriculumDetails = () => {
    //   idExampleArray.map((id) => {
    //     oldCurriculumArray.splice(
    //       oldCurriculumArray.findIndex((curriculum) => curriculum.id === id),
    //       1
    //     );
    //   });
    // };
    // deleteCurriculumDetails();
    // console.log("Array Modificado:", oldCurriculumArray);

    // PEGANDO DADOS DO CURRICULUM E JOGANDO NUM ARRAY QUE SERIA O CURRICULUM DETAILS DO STUDENT
    // const handleOptionData = async () => {
    //   const q = query(collection(db, "curriculum"));
    //   const promises: any = [];
    //   const getCurriculum = await getDocs(q);
    //   getCurriculum.forEach((doc) => {
    //     const promise = doc.data();
    //     promises.push(promise);
    //   });
    //   Promise.all(promises).then((result: CurriculumSearchProps[]) => {
    //     if (result.length > 0) {
    //       result.map((curriculum: CurriculumSearchProps) => {
    //         idExampleArray.forEach((id: string) => {
    //           if (id === curriculum.id) {
    //             newCurriculumDetailsArray.push({
    //               id: curriculum.id,
    //               name: curriculum.name,
    //               date: curriculum.timestamp.toString(),
    //             });
    //           }
    //         });
    //       });
    //     }
    //   });
    // };
    // handleOptionData();
    // console.log("Novo Array:", newCurriculumDetailsArray);

    // PEGANDO CURRICULUM IDS E CURRICULUM DETAILS DO STUDENT
    const handleOptionData = async () => {
      const curriculumQuery = query(
        collection(
          db,
          `/students/053e245c-25b5-495c-b7bc-202df0be68d2/studentCurriculum`
        )
      );
      const getCurriculum = await getDocs(curriculumQuery);
      getCurriculum.forEach((doc: any) => {
        const detailsData: SubCollectionProps = doc.data();
        detailsData.detailsArray.map(
          (curriculumDetail: SubCollectionDetailsProps) => {
            setStudentCurriculumDetails(studentCurriculumDetails => [...studentCurriculumDetails, curriculumDetail])
          }
        );
      });
      const experimentalCurriculumQuery = query(
        collection(
          db,
          `/students/053e245c-25b5-495c-b7bc-202df0be68d2/studentExperimentalCurriculum`
        )
      );
      const getExperimentalCurriculum = await getDocs(
        experimentalCurriculumQuery
      );
      getExperimentalCurriculum.forEach((doc: any) => {
        const detailsData: SubCollectionProps = doc.data();
        detailsData.detailsArray.map(
          (curriculumDetail: SubCollectionDetailsProps) => {
            setStudentCurriculumDetails(studentCurriculumDetails => [...studentCurriculumDetails, curriculumDetail])
          }
        );
      });


      //   const q1 = query(collection(db, "curriculum"));
      //   const promisesCurriculum: any = [];
      //   const getCurriculumAll = await getDocs(q1);
      //   getCurriculumAll.forEach((doc) => {
      //     const promiseCurriculum = doc.data();
      //     promisesCurriculum.push(promiseCurriculum);
      //   });
      //   Promise.all(promisesCurriculum).then(
      //     (result: CurriculumSearchProps[]) => {
      //       if (result.length > 0) {
      //         result.map((curriculum: CurriculumSearchProps) => {
      //           if (arrayBanco !== undefined) {
      //             arrayBanco.curriculumIds.forEach((id: string) => {
      //               if (id === curriculum.id) {
      //                 newCurriculumDetailsArray.push({
      //                   id: curriculum.id,
      //                   name: curriculum.name,
      //                   date: curriculum.timestamp.toString(),
      //                 });
      //               }
      //             });
      //           }
      //         });
      //       }
      //       console.log("Novo Array:", newCurriculumDetailsArray);
      //     }
      //   );
    };
    handleOptionData();
    // setIsSubmitting(false);

    // const handleOptionData = async () => {
    //   const queryCurriculum = query(
    //     collectionGroup(db, "studentExperimentalCurriculum"),
    //     where("experimentalCurriculumIds", "array-contains", "e5bad4ab-b1e8-4e5b-94da-25f516e61ccc"),
    //   );
    //   const promises: any = [];
    //   const getCurriculum = await getDocs(queryCurriculum);
    //   getCurriculum.forEach((doc) => {
    //     const promise = doc.data();
    //     promises.push(promise);
    //   });
    //   Promise.all(promises).then((result: CurriculumCollectionProps[]) => {
    //     if (result.length > 0) {
    //       const detailsData = result;
    //       console.log("Array do Banco:", detailsData);
    //     }
    //   });
    // };
    // handleOptionData();
    // setIsSubmitting(false);

    // const handleOptionData = async () => {
    //   const queryExperimental = query(
    //     collectionGroup(db, "studentExperimentalCurriculum"),
    //     where(
    //       "experimentalCurriculumIds",
    //       "array-contains",
    //       "c2876b59-2368-4b20-8742-969921c2894e"
    //     )
    //   );
    //   const promises: any = [];
    //   const getData = await getDocs(queryExperimental);
    //   getData.forEach(async (doc) => {
    //     // console.log(doc.ref.parent.parent?.id);
    //     const studentId = doc.ref.parent.parent?.id;
    //     // console.log("StudentId:", studentId)
    //     if (studentId) {
    //       const queryStudent = query(
    //         collection(db, "students"),
    //         where("id", "==", studentId)
    //       );
    //       const getStudentFullData = await getDocs(queryStudent);
    //       getStudentFullData.forEach((doc : any) => {
    //         const dataStudent = doc.data()
    //         setUserData(userData => [...userData, dataStudent]);
    //         // console.log("Dentro:", doc.data())
    //       });
    //     }
    //     // const promise = doc.data();
    //     // promises.push(promise);
    //   });
    //   // Promise.all(promises).then((result: CurriculumCollectionProps[]) => {
    //   //   if (result.length > 0) {
    //   //     const detailsData = result;
    //   //     console.log("Array do Banco:", detailsData);
    //   //   }
    //   // });
    // };
    // handleOptionData();
    // setIsSubmitting(false);

    setIsSubmitting(false);
  };
  const [userData, setUserData] = useState([]);

  // STUDENT CURRICULUM DETAILS STATE
  const [studentCurriculumDetails, setStudentCurriculumDetails] = useState<
    SubCollectionDetailsProps[]
  >([]);

  useEffect(() => {
    console.log("StudentCurriculumDetails:", studentCurriculumDetails);
  }, [studentCurriculumDetails]);

  interface DetailsProps {
    date: string;
    id: string;
    name: string;
  }

  interface CurriculumCollectionProps {
    curriculumIds: Array<string>;
    curriculumDetails: Array<DetailsProps>;
  }
  const [arrayBanco, setArrayBanco] = useState<CurriculumCollectionProps>();

  const newCurriculumDetailsArray: DetailsProps[] = [];

  return (
    <div className="flex flex-col container text-center">
      {/** SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando seed" />

      {/** TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/** PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Testar</h1>

      {/** FORM */}
      <form
        onSubmit={handleSubmit(handleAddSeed)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-full"
          >
            {!isSubmitting ? "Testar" : "Testando"}
          </button>
        </div>
      </form>
    </div>
  );
}
