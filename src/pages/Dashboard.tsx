import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  CurriculumSearchProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  StudentSearchProps,
  TeacherSearchProps,
} from "../@types";
import { Header } from "../components/layoutComponents/Header";
import { customerFullName } from "../custom";
import { app } from "../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function Dashboard() {
  // SCHOOL DATA STATE
  const [schoolData, setSchoolData] = useState<SchoolSearchProps[]>([]);

  // SCHOOL CLASS DATA STATE
  const [schoolClassData, setSchoolClassData] = useState<
    SchoolClassSearchProps[]
  >([]);

  // SCHOOL COURSE DATA STATE
  const [schoolCourseData, setSchoolCourseData] = useState<
    SchoolCourseSearchProps[]
  >([]);

  // SCHEDULE DATA STATE
  const [scheduleData, setScheduleData] = useState<ScheduleSearchProps[]>([]);

  // TEACHER DATA STATE
  const [teacherData, setTeacherData] = useState<TeacherSearchProps[]>([]);

  // CURRICULUM DATA STATE
  const [curriculumData, setCurriculumData] = useState<CurriculumSearchProps[]>(
    []
  );

  // STUDENTS DATA STATE
  const [studentsData, setStudentsData] = useState<StudentSearchProps[]>([]);

  // GET DATA
  const handleData = async () => {
    // GET SCHOOL DATA
    const querySnapshotSchool = await getDocs(collection(db, "schools"));
    const schoolPromises: any = [];
    querySnapshotSchool.forEach((doc) => {
      const promise = doc.data();
      schoolPromises.push(promise);
    });
    setSchoolData(schoolPromises);

    // GET SCHOOL CLASS DATA
    const querySnapshotSchoolClass = await getDocs(
      collection(db, "schoolClasses")
    );
    const schoolClassPromises: any = [];
    querySnapshotSchoolClass.forEach((doc) => {
      const promise = doc.data();
      schoolClassPromises.push(promise);
    });
    setSchoolClassData(schoolClassPromises);

    // GET SCHOOL COURSE DATA
    const querySnapshotSchoolCourse = await getDocs(
      collection(db, "schoolCourses")
    );
    const schoolCoursePromises: any = [];
    querySnapshotSchoolCourse.forEach((doc) => {
      const promise = doc.data();
      schoolCoursePromises.push(promise);
    });
    setSchoolCourseData(schoolCoursePromises);

    // GET SCHEDULE DATA
    const querySnapshotSchedule = await getDocs(collection(db, "schedules"));
    const schedulePromises: any = [];
    querySnapshotSchedule.forEach((doc) => {
      const promise = doc.data();
      schedulePromises.push(promise);
    });
    setScheduleData(schedulePromises);

    // GET TEACHER DATA
    const querySnapshotTeacher = await getDocs(collection(db, "teachers"));
    const teacherPromises: any = [];
    querySnapshotTeacher.forEach((doc) => {
      const promise = doc.data();
      teacherPromises.push(promise);
    });
    setTeacherData(teacherPromises);

    // GET CURRICULUM DATA
    const querySnapshotCurriculum = await getDocs(collection(db, "curriculum"));
    const curriculumPromises: any = [];
    querySnapshotCurriculum.forEach((doc) => {
      const promise = doc.data();
      curriculumPromises.push(promise);
    });
    setCurriculumData(curriculumPromises);
    // GET STUDENTS DATA
    const querySnapshotStudents = await getDocs(collection(db, "students"));
    const studentsPromises: any = [];
    querySnapshotStudents.forEach(async (doc) => {
      const promise = doc.data();
      studentsPromises.push(promise);
    });
    setStudentsData(studentsPromises);
  };

  useEffect(() => {
    handleData();
  }, []);

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
        <Header />
        <div className="flex container items-center justify-center gap-4">
          <div
            className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
            onClick={() => setShowPage("school")}
          >
            <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
              Escolas Cadastradas:
            </p>
            <p className="font-bold text-klOrange-500 text-2xl">
              {schoolData.length}
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
              {schoolClassData.length}
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
              {schoolCourseData.length}
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
              {scheduleData.length}
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
              {teacherData.length}
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
              {curriculumData.length}
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
              {studentsData.length}
            </p>
          </div>
        </div>
        <div className="flex flex-col container mt-8 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl">
          {showPage === "school" ? (
            schoolData.length !== 0 ? (
              schoolData.map((school) => {
                return (
                  <div className="flex justify-center p-4">
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
            schoolClassData.length !== 0 ? (
              schoolClassData.map((schoolClass) => {
                return (
                  <div className="flex justify-center p-4 ">
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
            schoolCourseData.length !== 0 ? (
              schoolCourseData.map((schoolCourse) => {
                return (
                  <div className="flex justify-center p-4 ">
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
            scheduleData.length !== 0 ? (
              scheduleData.map((schedule) => {
                return (
                  <div className="flex justify-center p-4 ">
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
            teacherData.length !== 0 ? (
              teacherData.map((teacher) => {
                return (
                  <div className="flex justify-center p-4 ">
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
            curriculumData.length !== 0 ? (
              curriculumData.map((curriculum) => {
                return (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      {curriculum.name}
                    </p>
                  </div>
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
            studentsData.length !== 0 ? (
              studentsData.map((student) => {
                return (
                  <div className="flex justify-center p-4 ">
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
