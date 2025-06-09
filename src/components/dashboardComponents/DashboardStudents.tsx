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
import { IoMdClose } from "react-icons/io";
import { StudentButtonDetails } from "../layoutComponents/StudentButtonDetails";
import { EditStudentForm } from "../formComponents/EditStudentForm";
import { FinanceStudentModal } from "../modalComponents/FinanceStudentModal";
import { InsertStudent } from "../insertComponents/InsertStudent";
import { DashboardMenuArrayProps } from "../../pages/Dashboard";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";
import { TbFilterSearch } from "react-icons/tb";
import DashboardMenuModal from "../layoutComponents/DashboardMenuModal";
import BackdropModal from "../layoutComponents/BackdropModal";
import SearchInputModal from "../layoutComponents/SearchInputModal";
import DashboardSectionSubHeader from "../layoutComponents/DashboardSectionSubHeader";
import DashboardSectionAddHeader from "../layoutComponents/DashboardSectionAddHeader";
import { formataCPF } from "../../custom";

interface DashboardStudentsProps {
  filteredStudents: FilteredStudentsProps[];
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
  renderDashboardMenu(itemMenu: DashboardMenuArrayProps): JSX.Element;
  itemsMenu: DashboardMenuArrayProps[];
  onCloseLogModal: (schoolId: string) => void; // Função para fechar o modal
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
  filteredStudents,
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
  renderDashboardMenu,
  itemsMenu,
  onCloseLogModal,
}: DashboardStudentsProps) {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    studentsDatabaseData,
    userFullData,
    handleDeleteStudent,
    toggleActiveStudent,
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

  // FILTER STUDENTS BY SEARCH STATES
  // STATE FOR THE SEARCH TERM
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [financialResponsibleName, setFinancialResponsibleName] =
    useState<string>("");
  const [financialResponsibleDocument, setFinancialResponsibleDocument] =
    useState<string>("");
  const [studentDocument, setStudentDocument] = useState<string>("");
  const [showInactiveStudents, setShowInactiveStudents] =
    useState<boolean>(false);

  // FUNCTION TO CLEAR THE ADVANCED SEARCH FIELDS
  const clearAdvancedSearch = () => {
    setSearchId("");
    setSearchTerm("");
    setFinancialResponsibleName("");
    setFinancialResponsibleDocument("");
    setStudentDocument("");
    setShowInactiveStudents(false);
  };

  // EFFECT TO FILTER STUDENTS BASED ON SEARCH TERMS
  useEffect(() => {
    // SEARCH CONSIDERING STUDENT NAME, RESPONSIBLE NAME, AND CPF
    setFilteredSearchStudents(
      filteredStudents.filter((student) => {
        const matchesPublicId = student.publicId
          .toString()
          .toLowerCase()
          .includes(searchId.toLowerCase());
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
        const matchesStudentDocument =
          student.document.includes(studentDocument);

        // Lógica para filtrar com base no showInactiveStudents
        const matchesActive = showInactiveStudents || student.active === true;

        // Aplique o filtro apenas para os campos que possuem valores preenchidos
        return (
          (matchesPublicId || !searchId) &&
          (matchesName || !searchTerm) &&
          (matchesResponsibleName || !financialResponsibleName) &&
          (matchesResponsibleDocument || !financialResponsibleDocument) &&
          (matchesStudentDocument || !studentDocument) &&
          matchesActive // Adicionando a verificação de ativo
        );
      })
    );
  }, [
    searchId,
    searchTerm,
    studentDocument,
    financialResponsibleName,
    financialResponsibleDocument,
    filteredStudents,
    showInactiveStudents,
  ]);

  // HANDLER FOR CHANGES IN THE STUDENT ID SEARCH FIELD
  const handleSearchIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(event.target.value);
  };
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
    // Recebe o valor do input, formata o CPF em tempo real e atualiza o estado
    const formattedCPF = formataCPF(event.target.value);

    // Atualiza o estado com o CPF formatado
    setFinancialResponsibleDocument(formattedCPF);
  };

  // HANDLER FOR CHANGES IN THE STUDENT CPF SEARCH FIELD
  const handleStudentDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Recebe o valor do input, formata o CPF em tempo real e atualiza o estado
    const formattedCPF = formataCPF(event.target.value);

    // Atualiza o estado com o CPF formatado
    setStudentDocument(formattedCPF);
  };

  function closeModal() {
    setOpen(false);
  }

  // DELETE STUDENT FUNCTION
  function handleDeleteUser() {
    if (studentSelected) {
      handleDeleteStudent(studentSelected.id, handleClose, closeModal);
    } else {
      console.log("Nenhum usuário selecionado.");
    }
  }

  function toggleActiveUser() {
    if (studentSelected) {
      toggleActiveStudent(
        studentSelected.active,
        studentSelected.id,
        handleClose,
        closeModal
      );
    } else {
      console.log("Nenhum usuário selecionado.");
    }
  }

  // MOBILE MENU FILTER STATE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // DASHBOARD MENU STATE
  const [dashboardMenu, setDashboardMenu] = useState(false);

  // FILTER ACTIVE STATE
  const [filterActive, setFilterActive] = useState(false);

  // FILTER ACTIVE EFFECT
  useEffect(() => {
    if (
      searchId ||
      searchTerm ||
      studentDocument ||
      financialResponsibleName ||
      financialResponsibleDocument ||
      showInactiveStudents
    ) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [
    searchTerm,
    searchId,
    showInactiveStudents,
    studentDocument,
    financialResponsibleName,
    financialResponsibleDocument,
  ]);

  function toggleFilterIcon() {
    if (filterActive) {
      return (
        <span className="text-klOrange-500">
          <FcClearFilters />
        </span>
      );
    } else {
      return (
        <span className="text-klOrange-500">
          <TbFilterSearch size={15} />
        </span>
      );
    }
  }

  // FILTERS INPUT RENDER
  function renderFiltersInput() {
    return (
      <>
        <div className="flex flex-col w-full gap-2">
          <input
            type="number"
            inputMode="numeric"
            name="searchId"
            placeholder="Identificador"
            value={searchId}
            onChange={handleSearchIdChange}
            className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            id="searchStudent"
            placeholder="Nome do Aluno"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            name="searchStudentDocument"
            placeholder="CPF do Aluno"
            maxLength={14}
            value={studentDocument}
            onChange={handleStudentDocumentChange}
            className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            name="financialResponsibleName"
            placeholder="Nome do Responsável Financeiro"
            value={financialResponsibleName}
            onChange={handleFinancialResponsibleNameChange}
            className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            name="financialResponsibleDocument"
            pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
            placeholder="CPF do Responsável Financeiro"
            value={financialResponsibleDocument}
            onChange={handleFinancialResponsibleDocumentChange}
            className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <div className="w-full px-1 py-2">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700 text-center">
                <tr>
                  <th className="px-4 py-2 text-center" colSpan={3}>
                    Alunos
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-2">Ativos</th>
                  <th className="px-4 py-2">Inativos</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="px-4 py-2 text-red-600 dark:text-klOrange-500">
                    {
                      filteredStudents.filter((student) => student.active)
                        .length
                    }
                  </td>
                  <td className="px-4 py-2 text-red-600 dark:text-klOrange-500">
                    {
                      filteredStudents.filter((student) => !student.active)
                        .length
                    }
                  </td>
                  <td className="px-4 py-2 text-red-600 dark:text-klOrange-500">
                    {filteredStudents.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 justify-between px-1">
            <p>Mostrar Inativos?</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showInactiveStudents}
                onChange={() => {
                  setShowInactiveStudents(!showInactiveStudents);
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-500 peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-transparent rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:shadow-md after:transform after:-translate-y-1/2"></div>
            </label>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              className="flex w-full items-center justify-center gap-4 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white outline-none active:dark:bg-klGreen-500 active:bg-klGreen-500/80 transition-all rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FcFilledFilter size={15} />
              Aplicar Filtros
            </button>

            {filterActive && (
              <button
                className="flex w-full items-center justify-center gap-4 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white outline-none active:dark:bg-klGreen-500 active:bg-klGreen-500/80 transition-all rounded-xl"
                onClick={clearAdvancedSearch}
              >
                <IoMdClose size={15} />
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </>
    );
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
              <DashboardSectionSubHeader
                title="Alunos cadastrados"
                dashboardMenu={dashboardMenu}
                dataArray={studentsDatabaseData}
                mobileMenuOpen={mobileMenuOpen}
                setDashboardMenu={setDashboardMenu}
                setMobileMenuOpen={setMobileMenuOpen}
                setShowList={setShowStudentList}
                toggleFilterIcon={toggleFilterIcon}
                userFullData={userFullData}
              />
            ) : (
              <DashboardSectionAddHeader
                setShowList={setShowStudentList}
                showList={showStudentList}
                title="Adicionar Aluno"
              />
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
                  .sort((a, b) => a.publicId! - b.publicId!)
                  .map((student) => {
                    return (
                      <div className="flex flex-col px-4 py-3" key={student.id}>
                        <div className="flex items-center w-full">
                          <div className="flex w-1/6">
                            <p
                              className="w-auto text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                              onClick={() => {
                                handleClickOpen({
                                  id: student.id,
                                  option: "details",
                                });
                              }}
                            >
                              {student.publicId}
                            </p>
                          </div>
                          <div className="flex w-4/6">
                            <p
                              className="text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                              onClick={() => {
                                handleClickOpen({
                                  id: student.id,
                                  option: "details",
                                });
                              }}
                            >
                              {student.name}
                            </p>
                          </div>
                          <StudentButtonDetails
                            id={student.id}
                            isActive={student.isActive}
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
                            toggleActiveUser={toggleActiveUser}
                            setIsEdit={setIsEdit}
                            setIsFinance={setIsFinance}
                            setIsDetailsViewing={setIsDetailsViewing}
                            onCloseLogModal={onCloseLogModal}
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
            {(isEdit || isDetailsViewing) && studentSelected && (
              <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 overflow-scroll no-scrollbar">
                <EditStudentForm
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  studentId={studentSelected.id}
                  key={studentSelected.id}
                  onClose={handleClose}
                  isEdit={isEdit}
                  isFinance={isFinance}
                  isFinancialResponsible={
                    studentSelected.isFinancialResponsible
                  }
                  open={open}
                  handleClickOpen={handleClickOpen}
                  handleDeleteUser={handleDeleteUser}
                  toggleActiveUser={toggleActiveUser}
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
                  student={studentSelected}
                  key={studentSelected.id}
                  onClose={handleClose}
                  isEdit={isEdit}
                  isFinance={isFinance}
                  isFinancialResponsible={
                    studentSelected.isFinancialResponsible
                  }
                  open={open}
                  paymentArray={paymentArray}
                  handleClickOpen={handleClickOpen}
                  handleDeleteUser={handleDeleteUser}
                  setIsEdit={setIsEdit}
                  setIsFinance={setIsFinance}
                  setIsDetailsViewing={setIsDetailsViewing}
                  onlyView={isDetailsViewing}
                  toggleActiveUser={toggleActiveUser}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* BACKDROP */}
      {(mobileMenuOpen || dashboardMenu) && (
        <BackdropModal
          setDashboardMenu={setDashboardMenu}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      {/* MOBILE MENU DRAWER */}
      <SearchInputModal
        title="Aluno"
        mobileMenuOpen={mobileMenuOpen}
        renderFiltersInput={renderFiltersInput}
        setMobileMenuOpen={setMobileMenuOpen}
        userFullData={userFullData}
      />

      {/* DASHBOARD MENU DRAWER */}
      <DashboardMenuModal
        dashboardMenu={dashboardMenu}
        itemsMenu={itemsMenu}
        renderDashboardMenu={renderDashboardMenu}
        setDashboardMenu={setDashboardMenu}
        userFullData={userFullData}
      />
    </div>
  );
}
