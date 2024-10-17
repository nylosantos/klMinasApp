/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(filteredStudents);
  }, [filteredStudents]);

  const [showPage, setShowPage] = useState<
    | "school"
    | "schoolClass"
    | "schoolCourse"
    | "schedule"
    | "teacher"
    | "curriculum"
    | "student"
    | "addStudent"
  >("school");

  // LOADING
  if (!userFullData) {
    return <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />;
  } else {
    return (
      <div className="w-screen h-full flex flex-col justify-start items-center overflow-scroll no-scrollbar">
        <div className="flex container items-center justify-center gap-4">
          {userFullData.role !== "user" && (
            <>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("school")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Escolas Cadastradas:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {schoolDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("schoolClass")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Anos Escolares Cadastrados:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {schoolClassDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("schoolCourse")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Modalidades Cadastradas:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {schoolCourseDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("schedule")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Horários Cadastrados:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {scheduleDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("teacher")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Professores Cadastrados:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {teacherDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("curriculum")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Turmas cadastradas:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {curriculumDatabaseData.length}
                </p>
              </div>
            </>
          )}
          <div
            className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
            onClick={() => setShowPage("student")}
          >
            <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
              Alunos Cadastrados:
            </p>
            <p className="font-bold text-klOrange-500 text-2xl">
              {filteredStudents.length}
            </p>
          </div>
          {userFullData.role === "user" && (
            <div
              className="flex flex-col w-56 h-32 items-center justify-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 rounded-xl cursor-pointer"
              onClick={() => setShowPage("addStudent")}
            >
              <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                Adicionar Aluno
              </p>
            </div>
          )}
        </div>
        <div
          className={
            showPage === "curriculum"
              ? `pb-4 flex h-full overflow-scroll no-scrollbar flex-wrap justify-center container mt-4 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl gap-2`
              : showPage === "student"
              ? "pb-4 flex h-full overflow-scroll no-scrollbar justify-center w-full"
              : `pb-4 flex h-full overflow-scroll no-scrollbar flex-col container mt-4 [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl`
          }
        >
          {userFullData.role !== "user" && (
            <>
              {showPage === "school" &&
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
              {showPage === "schoolClass" &&
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
              {showPage === "schoolCourse" &&
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
              {showPage === "schedule" &&
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
              {showPage === "teacher" &&
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
              {showPage === "curriculum" &&
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
          {showPage === "student" && (
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
              {/* VIEW STUDENT DETAILS */}
              {open && isDetailsViewing && (
                <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-white dark:bg-gray-800 overflow-scroll no-scrollbar">
                  <EditStudentForm
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    studentId={studentSelected!.id}
                    key={studentSelected!.id}
                    onClose={handleClose}
                    onlyView
                  />
                </div>
              )}
              {/* EDIT STUDENT */}
              {open && isEdit && (
                <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-white dark:bg-gray-800 overflow-scroll no-scrollbar">
                  <EditStudentForm
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    studentId={studentSelected!.id}
                    key={studentSelected!.id}
                    onClose={handleClose}
                  />
                </div>
              )}
              {/* FINANCE REGISTER STUDENT */}
              {open && isFinance && studentSelected && (
                <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-white dark:bg-gray-800 overflow-scroll no-scrollbar">
                  <FinanceStudentModal
                    isFinancialResponsible={
                      studentSelected.isFinancialResponsible
                    }
                  />
                </div>
              )}
              {open && studentSelected && (
                <div>
                  <StudentButtonDetails
                    id={studentSelected.id}
                    isEdit={isEdit}
                    isFinance={isFinance}
                    isDetailsViewing={isDetailsViewing}
                    isFinancialResponsible={
                      studentSelected.isFinancialResponsible
                    }
                    open={open}
                    handleClickOpen={handleClickOpen}
                    handleClose={handleClose}
                    setIsEdit={setIsEdit}
                    setIsFinance={setIsFinance}
                    setIsDetailsViewing={setIsDetailsViewing}
                  />
                </div>
              )}
            </div>
          )}
          {userFullData.role === "user" && showPage === "addStudent" && (
            <div className="flex flex-col w-screen px-8 pb-8 gap-6 items-center">
              <InsertStudent />
            </div>
          )}
        </div>
      </div>
    );
  }
}
