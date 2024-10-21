/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import { InsertStudent } from "../components/insertComponents/InsertStudent";
import { SubmitLoading } from "../components/layoutComponents/SubmitLoading";
import { EditStudentForm } from "../components/formComponents/EditStudentForm";
import { StudentButtonDetails } from "../components/layoutComponents/StudentButtonDetails";
import { FinanceStudentModal } from "../components/modalComponents/FinanceStudentModal";
import { StudentSearchProps } from "../@types";

export interface HandleClickOpenFunctionProps {
  id: string;
  option: "edit" | "finance" | "details";
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

export default function Dashboard() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
    userFullData,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const [open, setOpen] = useState(false);

  const [studentSelected, setStudentSelected] =
    useState<FilteredStudentsProps>();

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

  const handleClose = () => {
    setStudentSelected(undefined);
    setOpen(false);
    setIsEdit(false);
    setIsFinance(false);
    setIsDetailsViewing(false);
  };

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

  const [isEdit, setIsEdit] = useState(false);
  const [isFinance, setIsFinance] = useState(false);
  const [isDetailsViewing, setIsDetailsViewing] = useState(false);

  function handleScheduleDetails(id: string) {
    const scheduleDetail = scheduleDatabaseData.find(
      (schedule) => schedule.id === id
    );
    if (scheduleDetail) {
      return scheduleDetail;
    } else {
      return;
    }
  }

  interface FilteredStudentsProps extends StudentSearchProps {
    isFinancialResponsible: boolean;
  }

  // FILTER STUDENTS STATE
  const [filteredStudents, setFilteredStudents] = useState<
    FilteredStudentsProps[]
  >([]);

  // FILTER STUDENTS IF USER.ROLE IS 'USER'
  function filterStudents() {
    if (userFullData) {
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
    }
  }

  useEffect(() => {
    filterStudents();
  }, [studentsDatabaseData, userFullData]);

  function handleDeleteUser() {
    if (studentSelected) {
      console.log(
        "Deletando usuário: ",
        studentSelected.name,
        " - ID: ",
        studentSelected.id
      );
    } else {
      console.log("Nenhum usuário selecionado.");
    }
  }

  type DashBoardPageProps = {
    page:
      | "school"
      | "schoolClass"
      | "schoolCourse"
      | "schedule"
      | "teacher"
      | "curriculum"
      | "student"
      | "addStudent";
  };

  const [showDashboardPage, setShowDashboardPage] =
    useState<DashBoardPageProps>({
      page: "school",
    });

  useEffect(() => {
    userFullData && userFullData.role === "user"
      ? setShowDashboardPage({ page: "student" })
      : setShowDashboardPage({ page: "school" });
  }, [userFullData]);

  interface DashboardMenuArrayProps extends DashBoardPageProps {
    title: string;
    array: unknown[];
  }

  const dashboardMenuArray: DashboardMenuArrayProps[] = [
    { title: "Escolas Cadastradas", page: "school", array: schoolDatabaseData },
    {
      title: "Anos Escolares Cadastrados",
      page: "schoolClass",
      array: schoolClassDatabaseData,
    },
    {
      title: "Modalidades Cadastradas",
      page: "schoolCourse",
      array: schoolCourseDatabaseData,
    },
    {
      title: "Horários Cadastrados",
      page: "schedule",
      array: scheduleDatabaseData,
    },
    {
      title: "Professores Cadastrados",
      page: "teacher",
      array: teacherDatabaseData,
    },
    {
      title: "Turmas cadastradas",
      page: "curriculum",
      array: curriculumDatabaseData,
    },
    {
      title: "Alunos Cadastrados",
      page: "student",
      array: studentsDatabaseData,
    },
    { title: "Adicionar Aluno", page: "addStudent", array: [] },
  ];

  function renderDashboardMenu(itemMenu: DashboardMenuArrayProps) {
    return (
      <div
        className="flex flex-col w-36 h-full justify-center items-center text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 hover:bg-klGreen-500/30 hover:dark:bg-klGreen-500/70 py-2 px-3 rounded-xl cursor-pointer"
        onClick={() => setShowDashboardPage({ page: itemMenu.page })}
        key={uuidv4()}
      >
        <p className="text-klGreen-500 dark:text-gray-100 text-md/snug">
          {itemMenu.title}
        </p>
        <p className="text-klOrange-500 text-md/snug">
          {itemMenu.title === "Adicionar Aluno"
            ? ""
            : itemMenu.array.length > 0
            ? itemMenu.array.length
            : "0"}
        </p>
      </div>
    );
  }

  // LOADING
  if (!userFullData) {
    return <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />;
  } else {
    return (
      <div className="w-screen h-full flex flex-col justify-start items-center overflow-scroll no-scrollbar">
        {/* DASHBOARD BUTTONS MENU */}
        <div className="flex container items-center justify-center gap-4">
          {dashboardMenuArray.map((itemMenu) => {
            if (userFullData) {
              if (
                userFullData.role !== "user" &&
                itemMenu.page !== "addStudent"
              ) {
                return renderDashboardMenu(itemMenu);
              } else if (
                userFullData.role === "user" &&
                (itemMenu.page === "addStudent" || itemMenu.page === "student")
              ) {
                return renderDashboardMenu(itemMenu);
              } else return;
            }
          })}
        </div>

        {/* PAGES TO SHOW */}
        <div
          className={
            showDashboardPage.page === "curriculum"
              ? `pb-4 flex h-full overflow-scroll no-scrollbar flex-wrap justify-center container mt-4 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl gap-2`
              : showDashboardPage.page === "student"
              ? "pb-4 flex h-full overflow-scroll no-scrollbar justify-center w-full"
              : `pb-4 flex h-full overflow-scroll no-scrollbar flex-col container mt-4 [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl`
          }
        >
          {userFullData.role !== "user" && (
            <>
              {showDashboardPage.page === "school" &&
                (schoolDatabaseData.length !== 0 ? (
                  schoolDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((school) => {
                      return (
                        <div
                          className="flex justify-center p-4"
                          key={school.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {school.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhuma escola cadastrada.
                    </p>
                  </div>
                ))}
              {showDashboardPage.page === "schoolClass" &&
                (schoolClassDatabaseData.length !== 0 ? (
                  schoolClassDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((schoolClass) => {
                      return (
                        <div
                          className="flex justify-center p-4 "
                          key={schoolClass.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {schoolClass.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum Ano Escolar cadastrado.
                    </p>
                  </div>
                ))}
              {showDashboardPage.page === "schoolCourse" &&
                (schoolCourseDatabaseData.length !== 0 ? (
                  schoolCourseDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((schoolCourse) => {
                      return (
                        <div
                          className="flex justify-center p-4 "
                          key={schoolCourse.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {schoolCourse.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhuma modalidade cadastrada.
                    </p>
                  </div>
                ))}
              {showDashboardPage.page === "schedule" &&
                (scheduleDatabaseData.length !== 0 ? (
                  scheduleDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((schedule) => {
                      return (
                        <div
                          className="flex justify-center p-4 "
                          key={schedule.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {schedule.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum horário cadastrado.
                    </p>
                  </div>
                ))}
              {showDashboardPage.page === "teacher" &&
                (teacherDatabaseData.length !== 0 ? (
                  teacherDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((teacher) => {
                      return (
                        <div
                          className="flex justify-center p-4"
                          key={teacher.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {teacher.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum professor cadastrado.
                    </p>
                  </div>
                ))}
              {showDashboardPage.page === "curriculum" &&
                (curriculumDatabaseData.length !== 0 ? (
                  curriculumDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((curriculum) => {
                      return (
                        <div
                          key={curriculum.id}
                          className="flex flex-col w-3/12 items-left p-4 my-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                        >
                          <p>
                            Colégio:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.school}
                            </span>
                          </p>

                          <p>
                            Ano Escolar:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.schoolClass}
                            </span>
                          </p>

                          <p>
                            Modalidade:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.schoolCourse}
                            </span>
                          </p>
                          <p>
                            Dias:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.classDay}
                            </span>
                          </p>
                          {handleScheduleDetails(curriculum.scheduleId) !==
                            undefined && (
                            <p>
                              Horário:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                De{" "}
                                {`${handleScheduleDetails(
                                  curriculum.scheduleId
                                )!.classStart.slice(0, 2)}h${
                                  handleScheduleDetails(
                                    curriculum.scheduleId
                                  )!.classStart.slice(3, 5) === "00"
                                    ? ""
                                    : handleScheduleDetails(
                                        curriculum.scheduleId
                                      )!.classStart.slice(3, 5) + "min"
                                } a ${handleScheduleDetails(
                                  curriculum.scheduleId
                                )!.classEnd.slice(0, 2)}h${
                                  handleScheduleDetails(
                                    curriculum.scheduleId
                                  )!.classEnd.slice(3, 5) === "00"
                                    ? ""
                                    : handleScheduleDetails(
                                        curriculum.scheduleId
                                      )!.classEnd.slice(3, 5) + "min"
                                } (${curriculum.schedule})`}
                              </span>
                            </p>
                          )}
                          <p>
                            Professor:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.teacher}
                            </span>
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhuma turma cadastrada.
                    </p>
                  </div>
                ))}
            </>
          )}
          {showDashboardPage.page === "student" && (
            <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
              <div
                className={`${
                  open && studentSelected ? "w-2/6" : "w-full"
                } ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl transition-all duration-1000`}
              >
                {filteredStudents.length !== 0 ? (
                  filteredStudents
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((student) => {
                      return (
                        <div
                          className="flex flex-col px-4 py-3"
                          key={student.id}
                        >
                          <div className="flex items-center w-full">
                            <div className="w-1/6" />
                            <div className="flex w-4/6">
                              <p
                                className="text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                                onClick={() =>
                                  handleClickOpen({
                                    id: student.id,
                                    option: "details",
                                  })
                                }
                              >
                                {student.name}
                              </p>
                            </div>
                            {!open && student.id !== "" && (
                              <StudentButtonDetails
                                id={student.id}
                                isEdit={isEdit}
                                isFinance={isFinance}
                                isDetailsViewing={isDetailsViewing}
                                isFinancialResponsible={
                                  student.isFinancialResponsible
                                }
                                open={open}
                                handleClickOpen={handleClickOpen}
                                handleClose={handleClose}
                                handleDeleteUser={handleDeleteUser}
                                setIsEdit={setIsEdit}
                                setIsFinance={setIsFinance}
                                setIsDetailsViewing={setIsDetailsViewing}
                              />
                            )}
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

              {/* STUDENT FORM FOR VIEW DETAILS OR EDIT STUDENT */}
              {open && (isEdit || isDetailsViewing) && (
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
              {open && isFinance && studentSelected && (
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
          )}
          {userFullData.role === "user" &&
            showDashboardPage.page === "addStudent" && <InsertStudent />}
        </div>
      </div>
    );
  }
}
