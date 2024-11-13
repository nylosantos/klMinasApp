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
import DefaultListComponent from "../components/dashboardComponents/DefaultListComponent";

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
    handleOneCurriculumDetails,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // DETAILS STATES
  const [open, setOpen] = useState(false);
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

  // STATE FOR THE FILTERED STUDENTS
  const [filteredSearchStudents, setFilteredSearchStudents] =
    useState(studentsDatabaseData);

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
      array: filteredSearchStudents,
    },
    { title: "Adicionar Aluno", page: "addStudent", array: [] },
  ];

  function renderDashboardMenu(itemMenu: DashboardMenuArrayProps) {
    return (
      <div
        className="flex flex-col w-36 h-full justify-center items-center text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 hover:bg-klGreen-500/30 hover:dark:bg-klGreen-500/70 py-2 px-3 rounded-xl cursor-pointer"
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
              {showDashboardPage.page === "school" && (
                <DefaultListComponent
                  database={schoolDatabaseData}
                  emptyMessage="Nenhuma escola encontrada."
                />
              )}
              {showDashboardPage.page === "schoolClass" && (
                <DefaultListComponent
                  database={schoolClassDatabaseData}
                  emptyMessage="Nenhuma turma encontrada."
                />
              )}
              {showDashboardPage.page === "schoolCourse" && (
                <DefaultListComponent
                  database={schoolCourseDatabaseData}
                  emptyMessage="Nenhuma modalidade encontrada."
                />
              )}
              {showDashboardPage.page === "schedule" && (
                <DefaultListComponent
                  database={scheduleDatabaseData}
                  emptyMessage="Nenhum horário encontrado."
                />
              )}
              {showDashboardPage.page === "teacher" && (
                <DefaultListComponent
                  database={teacherDatabaseData}
                  emptyMessage="Nenhum professor encontrado."
                />
              )}
              {showDashboardPage.page === "curriculum" &&
                (curriculumDatabaseData.length !== 0 ? (
                  curriculumDatabaseData
                    .sort((a, b) =>
                      handleOneCurriculumDetails(a.id).schoolName.localeCompare(
                        handleOneCurriculumDetails(b.id).schoolName
                      )
                    )
                    .sort((a, b) =>
                      handleOneCurriculumDetails(
                        a.id
                      ).scheduleName.localeCompare(
                        handleOneCurriculumDetails(b.id).scheduleName
                      )
                    )
                    .sort((a, b) =>
                      handleOneCurriculumDetails(
                        a.id
                      ).schoolCourseName.localeCompare(
                        handleOneCurriculumDetails(b.id).schoolCourseName
                      )
                    )
                    .map((curriculum) => {
                      return (
                        <div
                          key={curriculum.id}
                          className="flex flex-col w-3/12 items-left p-4 my-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                        >
                          <p>
                            Colégio:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolName
                              }
                            </span>
                          </p>

                          <p>
                            Ano Escolar:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolClassName
                              }
                            </span>
                          </p>

                          <p>
                            Modalidade:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolCourseName
                              }
                            </span>
                          </p>
                          <p>
                            Dias:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .classDayName
                              }
                            </span>
                          </p>
                          {handleScheduleDetails(
                            handleOneCurriculumDetails(curriculum.id).scheduleId
                          ) !== undefined && (
                            <p>
                              Horário:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                De{" "}
                                {`${handleScheduleDetails(
                                  handleOneCurriculumDetails(curriculum.id)
                                    .scheduleId
                                )!.classStart.slice(0, 2)}h${
                                  handleScheduleDetails(
                                    handleOneCurriculumDetails(curriculum.id)
                                      .scheduleId
                                  )!.classStart.slice(3, 5) === "00"
                                    ? ""
                                    : handleScheduleDetails(
                                        handleOneCurriculumDetails(
                                          curriculum.id
                                        ).scheduleId
                                      )!.classStart.slice(3, 5) + "min"
                                } a ${handleScheduleDetails(
                                  handleOneCurriculumDetails(curriculum.id)
                                    .scheduleId
                                )!.classEnd.slice(0, 2)}h${
                                  handleScheduleDetails(
                                    handleOneCurriculumDetails(curriculum.id)
                                      .scheduleId
                                  )!.classEnd.slice(3, 5) === "00"
                                    ? ""
                                    : handleScheduleDetails(
                                        handleOneCurriculumDetails(
                                          curriculum.id
                                        ).scheduleId
                                      )!.classEnd.slice(3, 5) + "min"
                                } (${
                                  handleOneCurriculumDetails(curriculum.id)
                                    .scheduleName
                                })`}
                              </span>
                            </p>
                          )}
                          <p>
                            Professor:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .teacherName
                              }
                            </span>
                          </p>
                          <p>
                            Total de vagas:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .placesAvailable
                              }
                            </span>
                          </p>
                          <p>
                            Alunos Matriculados:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .students.length
                              }
                            </span>
                          </p>
                          <p>
                            Vagas Disponíveis:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {handleOneCurriculumDetails(curriculum.id)
                                .placesAvailable -
                                handleOneCurriculumDetails(curriculum.id)
                                  .students.length}
                            </span>
                          </p>
                          {handleOneCurriculumDetails(curriculum.id).waitingList
                            .length > 0 && (
                            <p>
                              Alunos na lista de espera:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                {
                                  handleOneCurriculumDetails(curriculum.id)
                                    .waitingList.length
                                }
                              </span>
                            </p>
                          )}
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
            <DashboardStudents
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
