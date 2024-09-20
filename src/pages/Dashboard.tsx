import { useContext, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";

// INITIALIZING FIRESTORE DB
// const db = getFirestore(app);

export default function Dashboard() {
  // GET GLOBAL DATA
  const {
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
  } = useContext(GlobalDataContext) as GlobalDataContextType;
  // // SCHOOL DATA STATE
  // const [schoolData, setSchoolData] = useState<SchoolSearchProps[]>([]);

  // // SCHOOL CLASS DATA STATE
  // const [schoolClassData, setSchoolClassData] = useState<
  //   SchoolClassSearchProps[]
  // >([]);

  // // SCHOOL COURSE DATA STATE
  // const [schoolCourseData, setSchoolCourseData] = useState<
  //   SchoolCourseSearchProps[]
  // >([]);

  // // SCHEDULE DATA STATE
  // const [scheduleData, setScheduleData] = useState<ScheduleSearchProps[]>([]);

  // // TEACHER DATA STATE
  // const [teacherData, setTeacherData] = useState<TeacherSearchProps[]>([]);

  // // CURRICULUM DATA STATE
  // const [curriculumData, setCurriculumData] = useState<CurriculumSearchProps[]>(
  //   []
  // );

  // // STUDENTS DATA STATE
  // const [studentsData, setStudentsData] = useState<StudentSearchProps[]>([]);

  // // GET DATA
  // const handleData = async () => {
  //   // GET SCHOOL DATA
  //   const querySnapshotSchool = await getDocs(collection(db, "schools"));
  //   const schoolDatabaseData: SchoolSearchProps[] = [];
  //   querySnapshotSchool.forEach((doc) => {
  //     const school = doc.data() as SchoolSearchProps;
  //     schoolDatabaseData.push(school);
  //   });
  //   setSchoolData(schoolDatabaseData);

  //   // GET SCHOOL CLASS DATA
  //   const querySnapshotSchoolClass = await getDocs(
  //     collection(db, "schoolClasses")
  //   );
  //   const schoolClassPromises: SchoolClassSearchProps[] = [];
  //   querySnapshotSchoolClass.forEach((doc) => {
  //     const promise = doc.data() as SchoolClassSearchProps;
  //     schoolClassPromises.push(promise);
  //   });
  //   setSchoolClassData(schoolClassPromises);

  //   // GET SCHOOL COURSE DATA
  //   const querySnapshotSchoolCourse = await getDocs(
  //     collection(db, "schoolCourses")
  //   );
  //   const schoolCoursePromises: SchoolCourseSearchProps[] = [];
  //   querySnapshotSchoolCourse.forEach((doc) => {
  //     const promise = doc.data() as SchoolCourseSearchProps;
  //     schoolCoursePromises.push(promise);
  //   });
  //   setSchoolCourseData(schoolCoursePromises);

  //   // GET SCHEDULE DATA
  //   const querySnapshotSchedule = await getDocs(collection(db, "schedules"));
  //   const schedulePromises: ScheduleSearchProps[] = [];
  //   querySnapshotSchedule.forEach((doc) => {
  //     const promise = doc.data() as ScheduleSearchProps;
  //     schedulePromises.push(promise);
  //   });
  //   setScheduleData(schedulePromises);

  //   // GET TEACHER DATA
  //   const querySnapshotTeacher = await getDocs(collection(db, "teachers"));
  //   const teacherPromises: TeacherSearchProps[] = [];
  //   querySnapshotTeacher.forEach((doc) => {
  //     const promise = doc.data() as TeacherSearchProps;
  //     teacherPromises.push(promise);
  //   });
  //   setTeacherData(teacherPromises);

  //   // GET CURRICULUM DATA
  //   const querySnapshotCurriculum = await getDocs(collection(db, "curriculum"));
  //   const curriculumPromises: CurriculumSearchProps[] = [];
  //   querySnapshotCurriculum.forEach((doc) => {
  //     const promise = doc.data() as CurriculumSearchProps;
  //     curriculumPromises.push(promise);
  //   });
  //   setCurriculumData(curriculumPromises);
  //   // GET STUDENTS DATA
  //   const querySnapshotStudents = await getDocs(collection(db, "students"));
  //   const studentsPromises: StudentSearchProps[] = [];
  //   querySnapshotStudents.forEach(async (doc) => {
  //     const promise = doc.data() as StudentSearchProps;
  //     studentsPromises.push(promise);
  //   });
  //   setStudentsData(studentsPromises);
  // };

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

  // useEffect(() => {
  //   handleData();
  // }, []);

  const [showPage, setShowPage] = useState<
    | "school"
    | "schoolClass"
    | "schoolCourse"
    | "schedule"
    | "teacher"
    | "curriculum"
    | "student"
  >("school");

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <>
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
              Turmas Cadastradas:
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
              Currículos cadastrados:
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
              : `flex flex-col container mt-8 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl`
          }
        >
          {showPage === "school" ? (
            schoolDatabaseData.length !== 0 ? (
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
            )
          ) : null}
          {showPage === "schoolClass" ? (
            schoolClassDatabaseData.length !== 0 ? (
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
                  Nenhuma turma cadastrada.
                </p>
              </div>
            )
          ) : null}
          {showPage === "schoolCourse" ? (
            schoolCourseDatabaseData.length !== 0 ? (
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
            )
          ) : null}
          {showPage === "schedule" ? (
            scheduleDatabaseData.length !== 0 ? (
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
            )
          ) : null}
          {showPage === "teacher" ? (
            teacherDatabaseData.length !== 0 ? (
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
            )
          ) : null}
          {showPage === "curriculum" ? (
            curriculumDatabaseData.length !== 0 ? (
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
                        Turma:{" "}
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
                      undefined ? (
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
                      ) : null}
                      <p>
                        Professor:{" "}
                        <span className="text-red-600 dark:text-yellow-500">
                          {curriculum.teacher}
                        </span>
                      </p>
                    </div>

                    // <div
                    //   className="flex flex-col w-3/12 justify-center p-4 gap-2 rounded-xl"
                    //   key={curriculum.id}
                    // >
                    //   <p className="text-klGreen-500 dark:text-white">
                    //     Escola: {curriculum.school}
                    //   </p>
                    //   <p className="text-klGreen-500 dark:text-white">
                    //     Modalidade: {curriculum.schoolCourse}
                    //   </p>
                    //   <p className="text-klGreen-500 dark:text-white">
                    //     Horário: {curriculum.schedule}
                    //   </p>
                    //   <p className="text-klGreen-500 dark:text-white">
                    //     Dias de Aula: {curriculum.classDay}
                    //   </p>
                    //   <p className="text-klGreen-500 dark:text-white">
                    //     Turma: {curriculum.schoolClass}
                    //   </p>
                    //   <p className="text-klGreen-500 dark:text-white">
                    //     Professor: {curriculum.teacher}
                    //   </p>
                    // </div>
                  );
                })
            ) : (
              <div className="flex justify-center p-4 ">
                <p className="text-klGreen-500 dark:text-white">
                  Nenhum currículo cadastrado.
                </p>
              </div>
            )
          ) : null}
          {showPage === "student" ? (
            studentsDatabaseData.length !== 0 ? (
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
            )
          ) : null}
        </div>
      </>
    </div>
  );
}
