/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import { InsertStudent } from "../components/insertComponents/InsertStudent";
import { SubmitLoading } from "../components/layoutComponents/SubmitLoading";
import DashboardStudents from "../components/dashboardComponents/DashboardStudents";
import DashboardCurriculum from "../components/dashboardComponents/DashboardCurriculum";
import DashboardTeacher from "../components/dashboardComponents/DashboardTeacher";
import DashboardSchool from "../components/dashboardComponents/DashboardSchool";
import DashboardCourse from "../components/dashboardComponents/DashboardCourse";
import DashboardSchedule from "../components/dashboardComponents/DashboardSchedule";
import { FilteredStudentsProps, StudentSearchProps } from "../@types";
import SchoolLogs from "../components/logComponents/SchoolLogs";
import SchoolCourseLogs from "../components/logComponents/SchoolCourseLogs";
import ScheduleLogs from "../components/logComponents/ScheduleLogs";
import TeacherLogs from "../components/logComponents/TeachersLogs";
// import CurriculumLogs from "../components/logComponents/CurriculumLogs";

export type DashBoardPageProps = {
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
export interface DashboardMenuArrayProps extends DashBoardPageProps {
  title: string;
  array: unknown[];
}

export default function Dashboard() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
    setIsSubmitting,
    userFullData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // DETAILS STATES
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isFinance, setIsFinance] = useState(false);
  const [isDetailsViewing, setIsDetailsViewing] = useState(false);

  // STATE FOR THE FILTERED SEARCH STUDENTS
  const [filteredSearchStudents, setFilteredSearchStudents] =
    useState(studentsDatabaseData);

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
  }, [userFullData, studentsDatabaseData]);

  const [showDashboardPage, setShowDashboardPage] =
    useState<DashBoardPageProps>({
      page: "school",
    });

  useEffect(() => {
    if (userFullData) {
      if (userFullData.role === "user") {
        setShowDashboardPage({ page: "student" });
      } else if (userFullData.role === "teacher") {
        setShowDashboardPage({ page: "curriculum" });
      } else {
        setShowDashboardPage({ page: "school" });
      }
    }
  }, [userFullData]);

  const dashboardMenuArray: DashboardMenuArrayProps[] = [
    { title: "Escolas Cadastradas", page: "school", array: schoolDatabaseData },
    // {
    //   title: "Anos Escolares Cadastrados",
    //   page: "schoolClass",
    //   array: schoolClassDatabaseData,
    // },
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
      array: filteredStudents,
    },
  ];

  function renderDashboardMenu(itemMenu: DashboardMenuArrayProps) {
    return (
      <div
        className="flex flex-col w-2/3 md:w-[7vw] md:h-[5vw] py-2 px-3 md:px-14 md:py-10 mt-4 justify-center items-center text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 hover:bg-klGreen-500/30 hover:dark:bg-klGreen-500/70 rounded-xl cursor-pointer"
        onClick={() => {
          setShowDashboardPage({ page: itemMenu.page }),
            setIsEdit(false),
            setOpen(false);
          setIsFinance(false);
          setIsDetailsViewing(false);
        }}
        key={uuidv4()}
      >
        <p className="text-klGreen-500 dark:text-gray-100">{itemMenu.title}</p>
        <p className="text-klOrange-500 ">
          {itemMenu.title === "Adicionar Aluno"
            ? ""
            : itemMenu.array.length > 0
            ? itemMenu.page === "student"
              ? (
                  itemMenu.array.filter(
                    //@ts-expect-error
                    (student: StudentSearchProps) => student.active
                  ) as StudentSearchProps[]
                ).length
              : itemMenu.array.length
            : "0"}
        </p>
      </div>
    );
  }

  const [logSchoolModal, setLogSchoolModal] = useState<{
    id: string | null;
    open: boolean;
  }>({
    id: null,
    open: false,
  });

  const toggleSchoolLogModal = (schoolId: string | null) => {
    setLogSchoolModal({
      id: schoolId,
      open: !logSchoolModal.open,
    });
  };
  const [logSchoolCourseModal, setLogSchoolCourseModal] = useState<{
    id: string | null;
    open: boolean;
  }>({
    id: null,
    open: false,
  });

  const toggleSchoolCourseLogModal = (schoolCourseId: string | null) => {
    setLogSchoolCourseModal({
      id: schoolCourseId,
      open: !logSchoolCourseModal.open,
    });
  };
  const [logScheduleModal, setLogScheduleModal] = useState<{
    id: string | null;
    open: boolean;
  }>({
    id: null,
    open: false,
  });

  const toggleScheduleLogModal = (scheduleId: string | null) => {
    setLogScheduleModal({
      id: scheduleId,
      open: !logScheduleModal.open,
    });
  };
  const [logTeacherModal, setLogTeacherModal] = useState<{
    id: string | null;
    open: boolean;
  }>({
    id: null,
    open: false,
  });

  const toggleTeacherLogModal = (teacherId: string | null) => {
    setLogTeacherModal({
      id: teacherId,
      open: !logTeacherModal.open,
    });
  };
  const [logCurriculumModal, setLogCurriculumModal] = useState<{
    id: string | null;
    open: boolean;
  }>({
    id: null,
    open: false,
  });

  const toggleCurriculumLogModal = (curriculumId: string | null) => {
    setLogCurriculumModal({
      id: curriculumId,
      open: !logCurriculumModal.open,
    });
  };
  const [logStudentModal, setLogStudentModal] = useState<{
    id: string | null;
    open: boolean;
  }>({
    id: null,
    open: false,
  });

  const toggleStudentLogModal = (studentId: string | null) => {
    setLogStudentModal({
      id: studentId,
      open: !logStudentModal.open,
    });
  };

  // LOADING
  if (!userFullData) {
    return <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />;
  } else {
    return (
      <div className="w-screen h-full flex flex-col justify-start items-center overflow-scroll no-scrollbar">
        {/* PAGES TO SHOW */}
        <div
          className={
            showDashboardPage.page === "schoolClass"
              ? "pb-4 flex h-full overflow-scroll no-scrollbar flex-col container mt-4 [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl"
              : "flex overflow-scroll no-scrollbar justify-center w-full container bg-klGreen-500/20 my-4 rounded-xl"
          }
        >
          {userFullData.role !== "user" && (
            <>
              {showDashboardPage.page === "school" && (
                <DashboardSchool
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  renderDashboardMenu={renderDashboardMenu}
                  itemsMenu={dashboardMenuArray}
                  onCloseLogModal={toggleSchoolLogModal}
                />
              )}
              {/* {showDashboardPage.page === "schoolClass" && (
                <DefaultListComponent
                  database={schoolClassDatabaseData}
                  emptyMessage="Nenhuma turma encontrada."
                />
              )} */}
              {showDashboardPage.page === "schoolCourse" && (
                <DashboardCourse
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  renderDashboardMenu={renderDashboardMenu}
                  itemsMenu={dashboardMenuArray}
                  onCloseLogModal={toggleSchoolCourseLogModal}
                />
              )}
              {showDashboardPage.page === "schedule" && (
                <DashboardSchedule
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  renderDashboardMenu={renderDashboardMenu}
                  itemsMenu={dashboardMenuArray}
                  onCloseLogModal={toggleScheduleLogModal}
                />
              )}
              {showDashboardPage.page === "teacher" && (
                <DashboardTeacher
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  renderDashboardMenu={renderDashboardMenu}
                  itemsMenu={dashboardMenuArray}
                  onCloseLogModal={toggleTeacherLogModal}
                />
              )}
              {showDashboardPage.page === "curriculum" && (
                <DashboardCurriculum
                  setIsDetailsViewing={setIsDetailsViewing}
                  setIsEdit={setIsEdit}
                  setOpen={setOpen}
                  renderDashboardMenu={renderDashboardMenu}
                  itemsMenu={dashboardMenuArray}
                  onCloseLogModal={toggleCurriculumLogModal}
                />
              )}
            </>
          )}
          {showDashboardPage.page === "student" && (
            <DashboardStudents
              filteredStudents={filteredStudents}
              filteredSearchStudents={filteredSearchStudents}
              isDetailsViewing={isDetailsViewing}
              isEdit={isEdit}
              isFinance={isFinance}
              open={open}
              setFilteredSearchStudents={setFilteredSearchStudents}
              setIsDetailsViewing={setIsDetailsViewing}
              setIsEdit={setIsEdit}
              setIsFinance={setIsFinance}
              setOpen={setOpen}
              renderDashboardMenu={renderDashboardMenu}
              itemsMenu={dashboardMenuArray}
              onCloseLogModal={toggleStudentLogModal}
            />
          )}
          {userFullData.role === "user" &&
            showDashboardPage.page === "addStudent" && <InsertStudent />}
        </div>
        {/* Modal será exibido dinamicamente com o id da escola */}
        {logSchoolModal.open && logSchoolModal.id && (
          <SchoolLogs
            schoolId={logSchoolModal.id}
            onClose={() => toggleSchoolLogModal(null)} // Passa null para fechar
          />
        )}
        {logSchoolCourseModal.open && logSchoolCourseModal.id && (
          <SchoolCourseLogs
            schoolCourseId={logSchoolCourseModal.id}
            onClose={() => toggleSchoolCourseLogModal(null)} // Passa null para fechar
          />
        )}
        {logScheduleModal.open && logScheduleModal.id && (
          <ScheduleLogs
            scheduleId={logScheduleModal.id}
            onClose={() => toggleScheduleLogModal(null)} // Passa null para fechar
          />
        )}
        {logTeacherModal.open && logTeacherModal.id && (
          <TeacherLogs
            teacherId={logTeacherModal.id}
            onClose={() => toggleTeacherLogModal(null)} // Passa null para fechar
          />
        )}
        {/* {logCurriculumModal.open && logCurriculumModal.id && (
          <CurriculumLogs
            curriculumId={logCurriculumModal.id}
            onClose={() => toggleCurriculumLogModal(null)} // Passa null para fechar
          />
        )} */}
      </div>
    );
  }
}
