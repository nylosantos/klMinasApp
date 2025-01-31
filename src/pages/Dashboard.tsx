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
import { FilteredStudentsProps } from "../@types";

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

  interface DashboardMenuArrayProps extends DashBoardPageProps {
    title: string;
    array: unknown[];
  }

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
    // { title: "Adicionar Aluno", page: "addStudent", array: [] },
  ];

  function renderDashboardMenu(itemMenu: DashboardMenuArrayProps) {
    return (
      <div
        className="flex flex-col w-36 h-full mt-4 justify-center items-center text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 hover:bg-klGreen-500/30 hover:dark:bg-klGreen-500/70 py-2 px-3 rounded-xl cursor-pointer"
        onClick={() => {
          setShowDashboardPage({ page: itemMenu.page }),
            setIsEdit(false),
            setOpen(false);
          setIsFinance(false);
          setIsDetailsViewing(false);
        }}
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
                userFullData.role === "root" ||
                userFullData.role === "admin" ||
                userFullData.role === "editor"
              ) {
                return renderDashboardMenu(itemMenu);
              }
              // UNCOMMENT TO SHOW DASHBOARD MENU TO USERS
              // else if (
              //   userFullData.role === "user" &&
              //   (itemMenu.page === "addStudent" || itemMenu.page === "student")
              // ) {
              //   return renderDashboardMenu(itemMenu);
              // } else return;
            }
          })}
        </div>

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
                <DashboardSchool isEdit={isEdit} setIsEdit={setIsEdit} />
              )}
              {/* {showDashboardPage.page === "schoolClass" && (
                <DefaultListComponent
                  database={schoolClassDatabaseData}
                  emptyMessage="Nenhuma turma encontrada."
                />
              )} */}
              {showDashboardPage.page === "schoolCourse" && (
                <DashboardCourse isEdit={isEdit} setIsEdit={setIsEdit} />
              )}
              {showDashboardPage.page === "schedule" && (
                <DashboardSchedule isEdit={isEdit} setIsEdit={setIsEdit} />
              )}
              {showDashboardPage.page === "teacher" && (
                <DashboardTeacher isEdit={isEdit} setIsEdit={setIsEdit} />
              )}
              {showDashboardPage.page === "curriculum" && (
                <DashboardCurriculum
                  isDetailsViewing={isDetailsViewing}
                  isEdit={isEdit}
                  isFinance={isFinance}
                  setIsDetailsViewing={setIsDetailsViewing}
                  setIsEdit={setIsEdit}
                  setOpen={setOpen}
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
            />
          )}
          {userFullData.role === "user" &&
            showDashboardPage.page === "addStudent" && <InsertStudent />}
        </div>
      </div>
    );
  }
}
