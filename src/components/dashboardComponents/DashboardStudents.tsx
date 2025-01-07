/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FilteredStudentsProps,
  HandleClickOpenFunctionProps,
  StudentSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  IoIosAddCircleOutline,
  IoIosArrowBack,
  IoMdClose,
} from "react-icons/io";
import { StudentButtonDetails } from "../layoutComponents/StudentButtonDetails";
import { EditStudentForm } from "../formComponents/EditStudentForm";
import { FinanceStudentModal } from "../modalComponents/FinanceStudentModal";
import { InsertStudent } from "../insertComponents/InsertStudent";

interface DashboardStudentsProps {
  filteredSearchStudents: StudentSearchProps[];
  isDetailsViewing: boolean;
  isEdit: boolean;
  isFinance: boolean;
  open: boolean;
  setFilteredSearchStudents: Dispatch<SetStateAction<StudentSearchProps[]>>;
  setIsDetailsViewing: Dispatch<SetStateAction<boolean>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setIsFinance: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export type PaymentArrayProps = {
  type: "enrolledFee" | "montlyPayment";
  dueDate: Date;
  paymentDate: Date | string;
  creationDate: Date;
  description: string;
  invoiceId: number;
  value: number;
};

export default function DashboardStudents({
  filteredSearchStudents,
  isDetailsViewing,
  isEdit,
  isFinance,
  open,
  setFilteredSearchStudents,
  setIsDetailsViewing,
  setIsEdit,
  setIsFinance,
  setOpen,
}: DashboardStudentsProps) {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    studentsDatabaseData,
    userFullData,
    calcStudentPrice2,
    handleDeleteStudent,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // STUDENT LIST OR ADD STUDENT STATE
  const [showStudentList, setShowStudentList] = useState(true);

  // STUDENT SELECTED FOR SHOW DETAILS STATE
  const [studentSelected, setStudentSelected] =
    useState<FilteredStudentsProps>();

  // OPEN DETAILS FUNCTION
  const handleClickOpen = ({ id, option }: HandleClickOpenFunctionProps) => {
    const studentToShow = filteredStudents.find((student) => student.id === id);
    if (studentToShow) {
      setStudentSelected(studentToShow);
      setOpen(true);
      if (option === "details") {
        setIsDetailsViewing(true);
        setIsEdit(false);
        setIsFinance(false);
      } else if (option === "edit") {
        setIsDetailsViewing(false);
        setIsEdit(true);
        setIsFinance(false);
      } else {
        setIsDetailsViewing(false);
        setIsEdit(false);
        setIsFinance(true);
      }
    }
  };

  // CLOSE DETAILS FUNCTION
  const handleClose = () => {
    setStudentSelected(undefined);
    setOpen(false);
    setIsEdit(false);
    setIsFinance(false);
    setIsDetailsViewing(false);
  };

  // FILTER STUDENTS STATE
  const [filteredStudents, setFilteredStudents] = useState<
    FilteredStudentsProps[]
  >([]);

  // FILTER STUDENTS IF USER.ROLE IS 'USER'
  function filterStudents() {
    if (userFullData) {
      setIsSubmitting(true);
      if (userFullData.role === "user") {
        const studentsToShow: FilteredStudentsProps[] = [];
        studentsDatabaseData.map((student) => {
          if (student.financialResponsible.document === userFullData.document) {
            studentsToShow.push({ ...student, isFinancialResponsible: true });
          } else if (
            student.parentOne?.email === userFullData.email ||
            student.parentTwo?.email === userFullData.email
          ) {
            studentsToShow.push({ ...student, isFinancialResponsible: false });
          }
        });
        setFilteredStudents(studentsToShow);
      } else {
        const studentsToShow: FilteredStudentsProps[] = [];
        studentsDatabaseData.map((student) => {
          studentsToShow.push({ ...student, isFinancialResponsible: true });
        });
        setFilteredStudents(studentsToShow);
      }
      setIsSubmitting(false);
    } else {
      console.log(`é porque não tem`);
    }
  }

  // FILTER STUDENTS WHEN USER CHANGE
  useEffect(() => {
    filterStudents();
  }, [userFullData]);

  // FILTER STUDENTS BY SEARCH STATES
  // STATE FOR THE SEARCH TERM
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [financialResponsibleName, setFinancialResponsibleName] =
    useState<string>("");
  const [financialResponsibleDocument, setFinancialResponsibleDocument] =
    useState<string>("");

  // STATE TO CONTROL IF THE SEARCH IS ADVANCED OR NOT
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  // FUNCTION TO TOGGLE THE ADVANCED SEARCH MODE
  // const toggleAdvancedSearch = () => {
  //   if (isAdvancedSearch) {
  //     // CLEARING THE ADVANCED SEARCH FIELDS WHEN CLOSING ADVANCED SEARCH
  //     setFinancialResponsibleName("");
  //     setFinancialResponsibleDocument("");
  //   }
  //   setIsAdvancedSearch(!isAdvancedSearch);
  // };

  // FUNCTION TO CLEAR THE ADVANCED SEARCH FIELDS
  const clearAdvancedSearch = () => {
    setSearchTerm("");
    setFinancialResponsibleName("");
    setFinancialResponsibleDocument("");
  };

  // EFFECT TO FILTER STUDENTS BASED ON SEARCH TERMS
  useEffect(() => {
    // SEARCH CONSIDERING STUDENT NAME, RESPONSIBLE NAME, AND CPF
    setFilteredSearchStudents(
      filteredStudents.filter((student) => {
        const matchesName = student.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesResponsibleName = student.financialResponsible.name
          .toLowerCase()
          .includes(financialResponsibleName.toLowerCase());
        const matchesResponsibleDocument =
          student.financialResponsible.document.includes(
            financialResponsibleDocument
          );

        // APPLY FILTER ONLY FOR FIELDS THAT HAVE BEEN FILLED
        return (
          (matchesName || !searchTerm) &&
          (matchesResponsibleName || !financialResponsibleName) &&
          (matchesResponsibleDocument || !financialResponsibleDocument)
        );
      })
    );

    // OLD HOOK WITH ADVANCED SEARCH
    // if (!isAdvancedSearch) {
    //   // SIMPLE SEARCH ONLY BASED ON STUDENT NAME
    //   setFilteredSearchStudents(
    //     filteredStudents.filter((student) =>
    //       student.name.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //   );
    // } else {
    //   // ADVANCED SEARCH CONSIDERING STUDENT NAME, RESPONSIBLE NAME, AND CPF
    //   setFilteredSearchStudents(
    //     filteredStudents.filter((student) => {
    //       const matchesName = student.name
    //         .toLowerCase()
    //         .includes(searchTerm.toLowerCase());
    //       const matchesResponsibleName = student.financialResponsible.name
    //         .toLowerCase()
    //         .includes(financialResponsibleName.toLowerCase());
    //       const matchesResponsibleDocument =
    //         student.financialResponsible.document.includes(
    //           financialResponsibleDocument
    //         );

    //       // APPLY FILTER ONLY FOR FIELDS THAT HAVE BEEN FILLED
    //       return (
    //         (matchesName || !searchTerm) &&
    //         (matchesResponsibleName || !financialResponsibleName) &&
    //         (matchesResponsibleDocument || !financialResponsibleDocument)
    //       );
    //     })
    //   );
    // }
  }, [
    searchTerm,
    financialResponsibleName,
    financialResponsibleDocument,
    filteredStudents,
    isAdvancedSearch,
  ]);

  // HANDLER FOR CHANGES IN THE STUDENT NAME SEARCH FIELD
  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  // HANDLER FOR CHANGES IN THE RESPONSIBLE NAME SEARCH FIELD
  const handleFinancialResponsibleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFinancialResponsibleName(event.target.value);
  };

  // HANDLER FOR CHANGES IN THE RESPONSIBLE CPF SEARCH FIELD
  const handleFinancialResponsibleDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFinancialResponsibleDocument(event.target.value);
  };

  // DELETE STUDENT FUNCTION
  function handleDeleteUser() {
    if (studentSelected) {
      handleDeleteStudent(studentSelected.id, handleClose);
    } else {
      console.log("Nenhum usuário selecionado.");
    }
  }

  // EXAMPLE ARRAY FOR STUDENT PAYMENTS TO USE ON PAYMENT DETAILS
  const paymentArray: PaymentArrayProps[] = [
    {
      type: "enrolledFee",
      dueDate: new Date("01/31/2024"),
      paymentDate: new Date("01/10/2024"),
      creationDate: new Date("01/5/2024"),
      description: "Matrícula 2024",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("01/15/2024"),
      paymentDate: new Date("01/10/2024"),
      creationDate: new Date("01/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("02/15/2024"),
      paymentDate: new Date("02/6/2024"),
      creationDate: new Date("02/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("03/15/2024"),
      paymentDate: new Date("03/5/2024"),
      creationDate: new Date("03/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("04/15/2024"),
      paymentDate: new Date("04/11/2024"),
      creationDate: new Date("04/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("05/15/2024"),
      paymentDate: new Date("05/17/2024"),
      creationDate: new Date("05/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("06/15/2024"),
      paymentDate: new Date("06/20/2024"),
      creationDate: new Date("06/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("07/15/2024"),
      paymentDate: new Date("07/22/2024"),
      creationDate: new Date("07/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("08/15/2024"),
      paymentDate: new Date("08/8/2024"),
      creationDate: new Date("08/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("09/15/2024"),
      paymentDate: new Date("09/9/2024"),
      creationDate: new Date("09/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("10/15/2024"),
      paymentDate: "   ",
      creationDate: new Date("10/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("11/15/2024"),
      paymentDate: "   ",
      creationDate: new Date("11/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("12/15/2024"),
      paymentDate: "   ",
      creationDate: new Date("12/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
  ];

  return (
    <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
      <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container  rounded-xl transition-all duration-1000">
        <div className="flex w-full flex-col px-4 pb-4 gap-2">
          <div className="flex w-full gap-2 justify-start">
            {showStudentList ? (
              <>
                <div className="flex flex-col w-full gap-2">
                  <input
                    type="text"
                    id="searchStudent"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Procurar"
                    className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  />
                  <div className="flex gap-2">
                    <div className="flex w-full gap-2">
                      <input
                        type="text"
                        placeholder="Nome do Responsável Financeiro"
                        value={financialResponsibleName}
                        onChange={handleFinancialResponsibleNameChange}
                        className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      />
                      <input
                        type="text"
                        name="financialResponsibleDocument"
                        pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
                        placeholder="CPF do Responsável Financeiro"
                        value={financialResponsibleDocument}
                        onChange={handleFinancialResponsibleDocumentChange}
                        className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-[5.55vw] w-min-[4.55vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                    <button
                      className="flex w-full items-center justify-evenly"
                      onClick={() => setShowStudentList(!showStudentList)}
                    >
                      <IoIosAddCircleOutline size={15} />
                      Adicionar
                    </button>
                  </div>
                  <div className="w-[5.55vw] w-min-[4.55vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                    <button
                      className="flex w-full items-center justify-evenly"
                      onClick={clearAdvancedSearch}
                    >
                      <IoMdClose size={15} />
                      Limpar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute w-[4.65vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                  <button
                    className="flex w-full items-center justify-evenly"
                    onClick={() => {
                      setShowStudentList(!showStudentList),
                        setIsAdvancedSearch(false);
                    }}
                  >
                    <IoIosArrowBack size={10} /> Voltar
                  </button>
                </div>
                <p className="w-full px-2 py-1 dark:text-gray-100 cursor-default text-center font-bold text-lg">
                  Adicionar Aluno
                </p>
              </>
            )}
          </div>
        </div>
        {showStudentList ? (
          <>
            {/* STUDENTS LISTS */}
            <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-none [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 transition-all duration-1000">
              {filteredSearchStudents.length !== 0 ? (
                filteredSearchStudents
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((student) => {
                    return (
                      <div className="flex flex-col px-4 py-3" key={student.id}>
                        <div className="flex items-center w-full">
                          <div className="w-1/6" />
                          <div className="flex w-4/6">
                            <p
                              className="text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                              onClick={() => {
                                handleClickOpen({
                                  id: student.id,
                                  option: "details",
                                });
                                calcStudentPrice2(student.id);
                              }}
                            >
                              {student.name}
                            </p>
                          </div>
                          <StudentButtonDetails
                            id={student.id}
                            isEdit={isEdit}
                            isFinance={isFinance}
                            isDetailsViewing={isDetailsViewing}
                            isFinancialResponsible={
                              student.isFinancialResponsible
                            }
                            open={open}
                            handleClose={() => setOpen(false)}
                            handleClickOpen={handleClickOpen}
                            handleDeleteUser={handleDeleteUser}
                            setIsEdit={setIsEdit}
                            setIsFinance={setIsFinance}
                            setIsDetailsViewing={setIsDetailsViewing}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex justify-center p-4 ">
                  <p className="text-klGreen-500 dark:text-white">
                    Nenhum aluno cadastrado.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <InsertStudent />
        )}
      </div>
      {/* STUDENT FORM FOR VIEW DETAILS OR EDIT STUDENT */}
      {open && (
        <div
          className="relative z-50"
          aria-labelledby="crop-image-dialog"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
          <div className="flex fixed inset-0 z-10 w-screen items-center justify-center overflow-y-auto">
            {(isEdit || isDetailsViewing) && (
              <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 overflow-scroll no-scrollbar">
                <EditStudentForm
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  studentId={studentSelected!.id}
                  key={studentSelected!.id}
                  onClose={handleClose}
                  isEdit={isEdit}
                  isFinance={isFinance}
                  isFinancialResponsible={
                    studentSelected && studentSelected.isFinancialResponsible
                  }
                  open={open}
                  handleClickOpen={handleClickOpen}
                  handleDeleteUser={handleDeleteUser}
                  setIsEdit={setIsEdit}
                  setIsFinance={setIsFinance}
                  setIsDetailsViewing={setIsDetailsViewing}
                  onlyView={isDetailsViewing}
                />
              </div>
            )}

            {/* FINANCE REGISTER STUDENT */}
            {isFinance && studentSelected && (
              <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-white dark:bg-gray-800 overflow-scroll no-scrollbar">
                <FinanceStudentModal
                  studentId={studentSelected!.id}
                  key={studentSelected!.id}
                  onClose={handleClose}
                  isEdit={isEdit}
                  isFinance={isFinance}
                  isFinancialResponsible={
                    studentSelected.isFinancialResponsible
                  }
                  open={open}
                  paymentArray={paymentArray}
                  studentName={studentSelected.name}
                  handleClickOpen={handleClickOpen}
                  handleDeleteUser={handleDeleteUser}
                  setIsEdit={setIsEdit}
                  setIsFinance={setIsFinance}
                  setIsDetailsViewing={setIsDetailsViewing}
                  onlyView={isDetailsViewing}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
