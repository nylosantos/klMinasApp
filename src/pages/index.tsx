import {
  collection,
  getDocs,
  getFirestore
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { app } from "../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function Home() {
  // CURRICULUM DATA STATE
  const [curriculumData, setCurriculumData] = useState([]);

  // STUDENTS DATA STATE
  const [studentsData, setStudentsData] = useState([]);

  // GET DATA
  const handleData = async () => {
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

  const days = [
    {
      sunday: "Domingo",
      monday: "Segunda-Feira",
      tuesday: "Terça-Feira",
      wednesday: "Quarta-Feira",
      thursday: "Quinta-Feira",
      friday: "Sexta-Feira",
      saturday: "Sábado",
    },
  ];
  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-col container">
        {studentsData.length !== 0 ? (
          <h1 className="font-bold text-2xl">Alunos Cadastrados KL Minas</h1>
        ) : null}
        {studentsData.map((s: any) => (
          <div className="flex flex-col mb-4 gap-2" key={s.id}>
            <hr />
            <p>Nome: {s.name}</p>
            <p>E-mail: {s.email}</p>
            <p>
              Endereço:{" "}
              {`${s.address.street}, ${s.address.number}. ${s.address.neighborhood} - ${s.address.city}-${s.address.state} | CEP: ${s.address.cep}`}
            </p>
            <p>Telefone: {s.phone}</p>
          </div>
        ))}
        {curriculumData.length !== 0 ? (
          <h1 className="font-bold text-2xl">
            Currículos escolares Cadastrados KL Minas
          </h1>
        ) : null}
        {curriculumData.map((c: any) => (
          <div className="flex flex-col mb-4 gap-2" key={c.id}>
            <hr />
            <p>Nome: {c.name}</p>
            <p>Escola: {c.school}</p>
            <p>Turma: {c.schoolClass}</p>
            <p>Modalidade: {c.schoolCourse}</p>
            <p>Horário: {c.schedule}</p>
            <p>Dias: {c.classDay}</p>
            <p>Professor: {c.teacher}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// export const getServerSideProps = async () => {
//   const responseStudent = await fetch("http://localhost:3333/student");
//   const dataStudent = await responseStudent.json();

//   return {
//     props: {
//       student: dataStudent.count,
//     },
//   };
// };
