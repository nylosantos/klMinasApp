import { useContext, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import { InsertStudent } from "../components/insertComponents/InsertStudent";
import { SubmitLoading } from "../components/layoutComponents/SubmitLoading";

// INITIALIZING FIRESTORE DB
// const db = getFirestore(app);

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
  } = useContext(GlobalDataContext) as GlobalDataContextType;

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

  const [showPage, setShowPage] = useState<
    | "school"
    | "schoolClass"
    | "schoolCourse"
    | "schedule"
    | "teacher"
    | "curriculum"
    | "student"
  >("school");

  const [userShowPage, setUserShowPage] = useState<"student" | "addStudent">(
    "student"
  );

  // LOADING
  if (!userFullData) {
    return <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />;
  } else if (userFullData.role === "user") {
    return (
      <div className="w-screen flex flex-col justify-center items-center">
        <div className="flex container items-center justify-center gap-4">
          <div
            className="flex flex-col w-56 h-32 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
            onClick={() => setUserShowPage("student")}
          >
            <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
              Alunos Cadastrados:
            </p>
            <p className="font-bold text-klOrange-500 text-2xl">
              {schoolDatabaseData.length}
            </p>
          </div>
          <div
            className="flex flex-col w-56 h-32 items-center justify-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 rounded-xl cursor-pointer"
            onClick={() => setUserShowPage("addStudent")}
          >
            <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
              Adicionar Aluno
            </p>
          </div>
        </div>
        {userShowPage === "student" && (
          <div
            className={
              showPage === "curriculum"
                ? `flex flex-wrap justify-center container mt-8 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl gap-2`
                : `pb-8 flex flex-col container mt-2 [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-3xl`
            }
          >
            {studentsDatabaseData.length !== 0 ? (
              studentsDatabaseData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => {
                  return (
                    <div className="flex justify-center p-4 " key={student.id}>
                      <p className="text-klGreen-500 dark:text-white">
                        {student.name}
                      </p>
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
        )}
        {userShowPage === "addStudent" && (
          <div className="flex flex-col w-screen px-8 pb-8 gap-6 items-center">
            <InsertStudent />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-screen flex flex-col justify-center items-center">
        <div className="flex container items-center justify-center gap-4">
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
          <div
            className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
            onClick={() => setShowPage("student")}
          >
            <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
              Alunos Cadastrados:
            </p>
            <p className="font-bold text-klOrange-500 text-2xl">
              {studentsDatabaseData.length}
            </p>
          </div>
        </div>
        <div
          className={
            showPage === "curriculum"
              ? `flex flex-wrap justify-center container mt-8 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl gap-2`
              : `flex flex-col container mt-8 [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl`
          }
        >
          {showPage === "school" &&
            (schoolDatabaseData.length !== 0 ? (
              schoolDatabaseData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((school) => {
                  return (
                    <div className="flex justify-center p-4" key={school.id}>
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
                    <div className="flex justify-center p-4 " key={schedule.id}>
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
                    <div className="flex justify-center p-4 " key={teacher.id}>
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
          {showPage === "student" &&
            (studentsDatabaseData.length !== 0 ? (
              studentsDatabaseData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => {
                  return (
                    <div className="flex justify-center p-4 " key={student.id}>
                      <p className="text-klGreen-500 dark:text-white">
                        {student.name}
                      </p>
                    </div>
                  );
                })
            ) : (
              <div className="flex justify-center p-4 ">
                <p className="text-klGreen-500 dark:text-white">
                  Nenhum aluno cadastrado.
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
