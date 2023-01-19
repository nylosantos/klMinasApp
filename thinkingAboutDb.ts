export function DeleteSchool() {
  const school = {
    id: "",
    name: "",
    timestamp: "serverTimestamp()",
  };

  const schoolClass = {
    id: "",
    name: "",
    schoolName: "",
    schoolId: "",
    available: true,
    timestamp: "serverTimestamp()",
  };

  const schoolCourse = {
    id: "",
    name: "",
    price: 145,
    timestamp: "serverTimestamp()",
  };

  const classDays = {
    id: "",
    name: "Terça e Quinta-feira", // <--
    sunday: false,
    monday: false,
    tuesday: true, // <--
    wednesday: false,
    thursday: true, // <--
    friday: false,
    saturday: false,
    timestamp: "serverTimestamp()",
  };

  const schedules = {
    id: "",
    name: "1º e 2º Período Matutino",
    transitionStart: "11:40",
    transitionEnd: "11:55",
    classStart: "11:55",
    classEnd: "12:40",
    exit: "12:45",
    timestamp: "serverTimestamp()",
  };

  const teacher = {
    id: "",
    name: "",
    timestamp: "serverTimestamp()",
  };

  const curriculum = {
    id: "",
    name: "",
    schoolId: "",
    schoolClassId: "",
    schoolCourseId: "",
    scheduleId: "",
    classDayId: "",
    teacherId: "",
    students: [],
    timestamp: "serverTimestamp()",
  };

  const students = {
    name: "",
    email: "",
    birth: 'Timestamp.fromDate(new Date("December 10, 1815"))',
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      cep: "",
    },
    phone: "",
    phoneSecondary: "",
    phoneTertiary: "",
    responsible: "",
    financialResponsible: "",
    cursos: ["curriculumId1", "curriculumId2", "curriculumId3"],
    timestamp: "serverTimestamp()",
  };
}


// REVISAR TODOS OS ARQUIVOS DE INSERT
// REVISAR O SEED INSERT (deixar pronto para testar a parte de delete e depois inserir tudo novamente de uma vez só)
// REVISAR TODOS OS ARQUIVOS DE DELETE
// IMPLEMENTAR O DELETESTUDENT

// IMPLEMENTAR A EDITPAGE

// IMPLEMENTAR O AUTHENTICATION