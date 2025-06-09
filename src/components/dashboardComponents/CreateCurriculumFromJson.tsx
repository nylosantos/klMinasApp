/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  TeacherSearchProps,
} from "../../@types";
import { useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { v4 as uuidv4 } from "uuid";
import { app } from "../../db/Firebase";
import { secureSetDoc } from "../../hooks/firestoreMiddleware";

const turmasFromPlanilha = [
  {
    IDENTIFICADOR: "1",
    schoolName: "BERNOULLI GO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO GO A",
    teacher: "MARIANA ARAÚJO DE CASTRO ALMEIDA",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "2",
    schoolName: "BERNOULLI GO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO GO A",
    teacher: "MATHEUS HENRIQUE PENA DUARTE",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "3",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO GO A",
    teacher: "THAYS XAVIER MARINHO",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "4",
    schoolName: "BERNOULLI GO",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "MATUTINO GO A",
    teacher: "LORRAYNE ARIADNE COSTA SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "5",
    schoolName: "BERNOULLI GO",
    schoolCourse: "CIRCO",
    schedule: "MATUTINO GO A",
    teacher: "Jéssica Nunes Pereira",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "6",
    schoolName: "BERNOULLI GO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "MATUTINO GO A",
    teacher: "EVELYN CHIELI VASCONCELOS SILVA",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "7",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JAZZ",
    schedule: "MATUTINO GO B",
    teacher: "MARIANA ARAÚJO DE CASTRO ALMEIDA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "8",
    schoolName: "BERNOULLI GO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO GO B",
    teacher: "MATHEUS HENRIQUE PENA DUARTE",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "9",
    schoolName: "BERNOULLI GO",
    schoolCourse: "YOGA",
    schedule: "MATUTINO GO C",
    teacher: "MARCELO DA SILVEIRA MACHADO",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "10",
    schoolName: "BERNOULLI GO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO GO B",
    teacher: "KARINA APARECIDA PEREIRA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "11",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO GO B",
    teacher: "THAYS XAVIER MARINHO",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "12",
    schoolName: "BERNOULLI GO",
    schoolCourse: "INICIAÇÃO AO VOLEIBOL",
    schedule: "MATUTINO GO B",
    teacher: "LORRAYNE ARIADNE COSTA SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "13",
    schoolName: "BERNOULLI GO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "MATUTINO GO B",
    teacher: "EVELYN CHIELI VASCONCELOS SILVA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "QUARTA, SEXTA",
  },
  {
    IDENTIFICADOR: "14",
    schoolName: "BERNOULLI GO",
    schoolCourse: "XADREZ",
    schedule: "MATUTINO GO B",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "15",
    schoolName: "BERNOULLI GO",
    schoolCourse: "CIRCO",
    schedule: "MATUTINO GO B",
    teacher: "Jéssica Nunes Pereira",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "16",
    schoolName: "BERNOULLI GO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "VESPERTINO GO D",
    teacher: "MARIANA ARAÚJO DE CASTRO ALMEIDA",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "17",
    schoolName: "BERNOULLI GO",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO GO D",
    teacher: "ABILIO DAMASCENO JUNIOR",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "18",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO GO D",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "19",
    schoolName: "BERNOULLI GO",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "VESPERTINO GO D",
    teacher: "LORRAYNE ARIADNE COSTA SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "20",
    schoolName: "BERNOULLI GO",
    schoolCourse: "CIRCO",
    schedule: "VESPERTINO GO D",
    teacher: "Jéssica Nunes Pereira",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "21",
    schoolName: "BERNOULLI GO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "VESPERTINO GO D",
    teacher: "CAMILA GABRIELA DE SOUZA FERNANDES",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "22",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JAZZ",
    schedule: "VESPERTINO GO E",
    teacher: "MARIANA ARAÚJO DE CASTRO ALMEIDA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "23",
    schoolName: "BERNOULLI GO",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO GO E",
    teacher: "ABILIO DAMASCENO JUNIOR",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "24",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO GO E",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "25",
    schoolName: "BERNOULLI GO",
    schoolCourse: "INICIAÇÃO AO VOLEIBOL",
    schedule: "VESPERTINO GO E",
    teacher: "LORRAYNE ARIADNE COSTA SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "26",
    schoolName: "BERNOULLI GO",
    schoolCourse: "XADREZ",
    schedule: "VESPERTINO GO E",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "27",
    schoolName: "BERNOULLI GO",
    schoolCourse: "YOGA",
    schedule: "VESPERTINO GO F",
    teacher: "INGRID RODRIGUES LISBOA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "28",
    schoolName: "BERNOULLI GO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "VESPERTINO GO E",
    teacher: "KARINA APARECIDA PEREIRA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "29",
    schoolName: "BERNOULLI GO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "VESPERTINO GO E",
    teacher: "CAMILA GABRIELA DE SOUZA FERNANDES",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "QUARTA, SEXTA",
  },
  {
    IDENTIFICADOR: "30",
    schoolName: "BERNOULLI GO",
    schoolCourse: "CIRCO",
    schedule: "VESPERTINO GO E",
    teacher: "Jéssica Nunes Pereira",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "31",
    schoolName: "BERNOULLI GO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO GO C",
    teacher: "PHILLIPE AUGUSTO DE SOUSA BARROS",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "32",
    schoolName: "BERNOULLI GO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO GO C",
    teacher: "THAYS XAVIER MARINHO",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "33",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "CIRCUITO TEEN",
    schedule: "MATUTINO CJ A",
    teacher: "CAMILA GIOVANA FERREIRA MARTINS",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "34",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO CJ A",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "35",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "HANDEBOL",
    schedule: "MATUTINO CJ B",
    teacher: "LUCAS PEIXOTO FERNANDES GUIMARAES",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "36",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "XADREZ",
    schedule: "MATUTINO CJ A",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames:
      "4º ANO, 5º ANO, 6º ANO, 7º ANO, 8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "37",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "JAZZ",
    schedule: "MATUTINO CJ A",
    teacher: "MARIANA ARAÚJO DE CASTRO ALMEIDA",
    placesAvailable: "15",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "38",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "VOLEIBOL",
    schedule: "MATUTINO CJ B",
    teacher: "FERNANDA FERREIRA MACIEL",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "39",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO CJ B",
    teacher: "ABILIO DAMASCENO JUNIOR",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "40",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "BASQUETE",
    schedule: "MATUTINO CJ B",
    teacher: "HENRIQUE CLAUDIO DE OLIVEIRA",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "41",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "YOGA",
    schedule: "MATUTINO CJ A",
    teacher: "MARCELO DA SILVEIRA MACHADO",
    placesAvailable: "15",
    schoolClassNames:
      "4º ANO, 5º ANO, 6º ANO, 7º ANO, 8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "42",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "VOLEIBOL",
    schedule: "MATUTINO CJ C",
    teacher: "FERNANDA FERREIRA MACIEL",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "43",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO CJ C",
    teacher: "ABILIO DAMASCENO JUNIOR",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "44",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "DANÇAS RITMOS",
    schedule: "MATUTINO CJ A",
    teacher: "INGRID RODRIGUES LISBOA",
    placesAvailable: "15",
    schoolClassNames:
      "6º ANO, 7º ANO, 8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "45",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO CJ C",
    teacher: "LAIS FIGUEROA LAGE",
    placesAvailable: "15",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "46",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "HANDEBOL",
    schedule: "MATUTINO CJ C",
    teacher: "RÍVIA RAFAELLE DE SOUZA ANDRÉ",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "47",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO CJ D",
    teacher: "ABILIO DAMASCENO JUNIOR",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "48",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "VOLEIBOL",
    schedule: "MATUTINO CJ D",
    teacher: "FERNANDA FERREIRA MACIEL",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "49",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "BASQUETE",
    schedule: "MATUTINO CJ D",
    teacher: "HENRIQUE CLAUDIO DE OLIVEIRA",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "50",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "HANDEBOL",
    schedule: "MATUTINO CJ D",
    teacher: "LUCAS PEIXOTO FERNANDES GUIMARAES",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO",
    classDaysNames: "QUARTA, SEXTA",
  },
  {
    IDENTIFICADOR: "51",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "CIRCUITO TEEN",
    schedule: "VESPERTINO CJ E",
    teacher: "KATARINA BARBOSA FIGUEIREDO",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "52",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO CJ E",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "53",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "HANDEBOL",
    schedule: "VESPERTINO CJ E",
    teacher: "LUCAS PEIXOTO FERNANDES GUIMARAES",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "54",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "Xadrez",
    schedule: "VESPERTINO CJ F",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "55",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "JAZZ",
    schedule: "VESPERTINO CJ E",
    teacher: "INGRID RODRIGUES LISBOA",
    placesAvailable: "15",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "56",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "VOLEIBOL",
    schedule: "VESPERTINO CJ E",
    teacher: "JÚLIA TOLEDO SOARES",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "57",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO CJ E",
    teacher: "ABILIO DAMASCENO JUNIOR",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "58",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "BASQUETE",
    schedule: "VESPERTINO CJ E",
    teacher: "HENRIQUE CLAUDIO DE OLIVEIRA",
    placesAvailable: "20",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "59",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "YOGA",
    schedule: "VESPERTINO CJ F",
    teacher: "INGRID RODRIGUES LISBOA",
    placesAvailable: "15",
    schoolClassNames: "4º ANO, 5º ANO,  6º ANO, 7º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "60",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "VOLEIBOL",
    schedule: "VESPERTINO CJ G",
    teacher: "WERGITON DE CAMPOS CAPANEMA",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "61",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO CJ G",
    teacher: "MATHEUS HENRIQUE PENA DUARTE",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "62",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "DANÇAS RITMOS",
    schedule: "VESPERTINO CJ F",
    teacher: "INGRID RODRIGUES LISBOA",
    placesAvailable: "15",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "63",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO CJ G",
    teacher: "THAYS XAVIER MARINHO",
    placesAvailable: "15",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "64",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "HANDEBOL",
    schedule: "VESPERTINO CJ G",
    teacher: "KATARINA BARBOSA FIGUEIREDO",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "65",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO CJ H",
    teacher: "MATHEUS HENRIQUE PENA DUARTE",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "66",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "VOLEIBOL",
    schedule: "VESPERTINO CJ H",
    teacher: "WERGITON DE CAMPOS CAPANEMA",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "67",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "BASQUETE",
    schedule: "VESPERTINO CJ H",
    teacher: "HENRIQUE CLAUDIO DE OLIVEIRA",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUINTA",
  },
  {
    IDENTIFICADOR: "68",
    schoolName: "BERNOULLI CIDADE JARDIM",
    schoolCourse: "HANDEBOL",
    schedule: "VESPERTINO CJ H",
    teacher: "KATARINA BARBOSA FIGUEIREDO",
    placesAvailable: "20",
    schoolClassNames: "8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUINTA",
  },
  {
    IDENTIFICADOR: "69",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO VS A",
    teacher: "MARLON CORDEIRO DE AZEVEDO",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "70",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "MATUTINO VS A",
    teacher: "CAMILA GABRIELA DE SOUZA FERNANDES",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "71",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "MATUTINO VS A",
    teacher: "MARCELO HENRIQUE DOS SANTOS",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "72",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO VS A",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "73",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO VS A",
    teacher: "OLÍVIA LUÍZA RIBEIRO",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "QUARTA, SEXTA",
  },
  {
    IDENTIFICADOR: "74",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "CIRCO",
    schedule: "MATUTINO VS A",
    teacher: "DAMON LOPES ARAÚJO",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "75",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO VS B",
    teacher: "MARLON CORDEIRO DE AZEVEDO",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "76",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "MATUTINO VS B",
    teacher: "CAMILA GABRIELA DE SOUZA FERNANDES",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "77",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "MATUTINO VS B",
    teacher: "MARCELO HENRIQUE DOS SANTOS",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "78",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO VS B",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "79",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JAZZ",
    schedule: "MATUTINO VS C",
    teacher: "GABRIELLA SHELLEN OLIVEIRA DA COSTA",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "80",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "YOGA",
    schedule: "MATUTINO VS C",
    teacher: "MARCELO DA SILVEIRA MACHADO",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO, 3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "TERÇA",
  },
  {
    IDENTIFICADOR: "81",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO VS B",
    teacher: "OLÍVIA LUÍZA RIBEIRO",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "QUARTA, SEXTA",
  },
  {
    IDENTIFICADOR: "82",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "Xadrez",
    schedule: "MATUTINO VS C",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "QUARTA",
  },
  {
    IDENTIFICADOR: "83",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "CIRCO",
    schedule: "MATUTINO VS B",
    teacher: "DAMON LOPES ARAÚJO",
    placesAvailable: "15",
    schoolClassNames: "1º ANO, 2º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "84",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "VOLEIBOL",
    schedule: "MATUTINO VS C",
    teacher: "JÚLIA TOLEDO SOARES",
    placesAvailable: "20",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "85",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO VS C",
    teacher: "LAIS FIGUEROA LAGE",
    placesAvailable: "15",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "86",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JAZZ",
    schedule: "MATUTINO VS D",
    teacher: "GABRIELLA SHELLEN OLIVEIRA DA COSTA",
    placesAvailable: "15",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO, 6º ANO, 7º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "87",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO VS C",
    teacher: "MARLON CORDEIRO DE AZEVEDO",
    placesAvailable: "20",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "88",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "CIRCUITO TEEN",
    schedule: "MATUTINO VS D",
    teacher: "MATHEUS HENRIQUE PENA DUARTE",
    placesAvailable: "20",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO, 6º ANO, 7º ANO",
    classDaysNames: "TERÇA, QUINTA, SEXTA",
  },
  {
    IDENTIFICADOR: "89",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "YOGA",
    schedule: "MATUTINO VS C",
    teacher: "MARCELO DA SILVEIRA MACHADO",
    placesAvailable: "15",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "QUINTA",
  },
  {
    IDENTIFICADOR: "90",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO VS C",
    teacher: "GABRIELLA SHELLEN OLIVEIRA DA COSTA",
    placesAvailable: "15",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "91",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "BASQUETE",
    schedule: "MATUTINO VS C",
    teacher: "FILIPE OLIVEIRA FERREIRA",
    placesAvailable: "20",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO, 6º ANO, 7º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "92",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "HANDEBOL",
    schedule: "MATUTINO VS C",
    teacher: "JÚLIA TOLEDO SOARES",
    placesAvailable: "20",
    schoolClassNames: "3º ANO, 4º ANO, 5º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "93",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "VOLEIBOL",
    schedule: "MATUTINO VS D",
    teacher: "CÉRLEY AUGUSTO SANTANA PINTO",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO, 8º ANO, 9º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "94",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO VS D",
    teacher: "MARCELO HENRIQUE DOS SANTOS",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO, 8º ANO, 9º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "95",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "BASQUETE",
    schedule: "MATUTINO VS D",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO, 8º ANO, 9º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "96",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "HANDEBOL",
    schedule: "MATUTINO VS D",
    teacher: "JÚLIA TOLEDO SOARES",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO, 8º ANO, 9º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "97",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "YOGA",
    schedule: "MATUTINO VS D",
    teacher: "MARCELO DA SILVEIRA MACHADO",
    placesAvailable: "15",
    schoolClassNames:
      "6º ANO, 7º ANO, 8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUARTA",
  },
  {
    IDENTIFICADOR: "98",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "Xadrez",
    schedule: "MATUTINO VS D",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames: "6º ANO, 7º ANO, 8º ANO, 9º ANO",
    classDaysNames: "QUINTA",
  },
  {
    IDENTIFICADOR: "99",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JUDÔ",
    schedule: "MATUTINO VS D",
    teacher: "NILTON EDUARDO PINTO DOS SANTOS",
    placesAvailable: "15",
    schoolClassNames: "6º ANO, 7º ANO, 8º ANO, 9º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "100",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "DANÇAS RITMOS",
    schedule: "MATUTINO VS E",
    teacher: "GABRIELLA SHELLEN OLIVEIRA DA COSTA",
    placesAvailable: "15",
    schoolClassNames:
      "6º ANO, 7º ANO, 8º ANO, 9º ANO, 1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "101",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO VS E",
    teacher: "MARCELO HENRIQUE DOS SANTOS",
    placesAvailable: "20",
    schoolClassNames: "1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUARTA, QUINTA",
  },
  {
    IDENTIFICADOR: "102",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "VOLEIBOL",
    schedule: "MATUTINO VS E",
    teacher: "CÉRLEY AUGUSTO SANTANA PINTO",
    placesAvailable: "20",
    schoolClassNames: "1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUARTA, QUINTA",
  },
  {
    IDENTIFICADOR: "103",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "YOGA",
    schedule: "MATUTINO VS E",
    teacher: "MARCELO DA SILVEIRA MACHADO",
    placesAvailable: "15",
    schoolClassNames: "1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUARTA",
  },
  {
    IDENTIFICADOR: "104",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "XADREZ",
    schedule: "MATUTINO VS E",
    teacher: "DIEGO AUGUSTO DE SOUZA LAGES SILVA",
    placesAvailable: "20",
    schoolClassNames: "1ª SÉRIE EM, 2ª SÉRIE EM",
    classDaysNames: "QUINTA",
  },
  {
    IDENTIFICADOR: "105",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO VS F",
    teacher: "MARLON CORDEIRO DE AZEVEDO",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO, 1º ANO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "106",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "GINÁSTICA RÍTMICA",
    schedule: "VESPERTINO VS F",
    teacher: "CAMILA GABRIELA DE SOUZA FERNANDES",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO, 1º ANO",
    classDaysNames: "SEGUNDA",
  },
  {
    IDENTIFICADOR: "107",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "VESPERTINO VS F",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO, 1º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "108",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO VS F",
    teacher: "A DEFINIR",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO, 1º ANO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "109",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "VESPERTINO VS F",
    teacher: "A DEFINIR",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO, 1º ANO",
    classDaysNames: "QUARTA, SEXTA",
  },
  {
    IDENTIFICADOR: "110",
    schoolName: "BERNOULLI VALE DO SERENO",
    schoolCourse: "CIRCO",
    schedule: "VESPERTINO VS F",
    teacher: "DAMON LOPES ARAÚJO",
    placesAvailable: "15",
    schoolClassNames: "1º PERÍODO, 2º PERÍODO, 1º ANO",
    classDaysNames: "SEXTA",
  },
  {
    IDENTIFICADOR: "111",
    schoolName: "BILBOQUÊ GUTIERREZ",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO BG A",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "112",
    schoolName: "BILBOQUÊ GUTIERREZ",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO BG A",
    teacher: "A DEFINIR",
    placesAvailable: "15",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "113",
    schoolName: "BILBOQUÊ GUTIERREZ",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO BG B",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "114",
    schoolName: "BILBOQUÊ GUTIERREZ",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "VESPERTINO BG B",
    teacher: "OLÍVIA LUÍZA RIBEIRO",
    placesAvailable: "15",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "115",
    schoolName: "BILBOQUÊ GUTIERREZ",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "VESPERTINO BG B",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "116",
    schoolName: "BILBOQUÊ GUTIERREZ",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO BG B",
    teacher: "A DEFINIR",
    placesAvailable: "15",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "117",
    schoolName: "BILBOQUÊ BURITIS",
    schoolCourse: "FUTSAL",
    schedule: "MATUTINO BB A",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "118",
    schoolName: "BILBOQUÊ BURITIS",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "MATUTINO BB A",
    teacher: "A DEFINIR",
    placesAvailable: "15",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "119",
    schoolName: "BILBOQUÊ BURITIS",
    schoolCourse: "FUTSAL",
    schedule: "VESPERTINO BB B",
    teacher: "MARLON CORDEIRO DE AZEVEDO",
    placesAvailable: "20",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "120",
    schoolName: "BILBOQUÊ BURITIS",
    schoolCourse: "BALÉ CLÁSSICO",
    schedule: "VESPERTINO BB B",
    teacher: "GABRIELA MAGDA AMORIM CAMPOS",
    placesAvailable: "15",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "TERÇA, QUINTA",
  },
  {
    IDENTIFICADOR: "121",
    schoolName: "BILBOQUÊ BURITIS",
    schoolCourse: "INICIAÇÃO ESPORTIVA",
    schedule: "VESPERTINO BB B",
    teacher: "A DEFINIR",
    placesAvailable: "20",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
  {
    IDENTIFICADOR: "122",
    schoolName: "BILBOQUÊ BURITIS",
    schoolCourse: "JUDÔ",
    schedule: "VESPERTINO BB B",
    teacher: "A DEFINIR",
    placesAvailable: "15",
    schoolClassNames: "MATERNAL III, 1º PERÍODO, 2º PERÍODO",
    classDaysNames: "SEGUNDA, QUARTA",
  },
];

type Item = {
  IDENTIFICADOR: string;
  schoolName: string;
  schoolCourse: string;
  schedule: string;
  teacher: string;
  placesAvailable: string;
  schoolClassNames: string;
  classDaysNames: string;
};

interface ProcessedAltItem {
  IDENTIFICADOR: string;
  schoolName: string;
  schoolCourse: string;
  schedule: string;
  teacher: string;
  placesAvailable: string;
  schoolClassNames: string[];
  classDaysNames: string[];
}

interface ProcessedItem {
  IDENTIFICADOR: string;
  schoolId: string;
  schoolCourseId: string;
  scheduleId: string;
  teacherId: string;
  placesAvailable: number;
  schoolClassIds: string[];
  classDayIds: number[];
  classDayNames: string[];
}

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function CreateCurriculumFromJson() {
  // GET GLOBAL DATA
  const {
    handleConfirmationToSubmit,
    schoolsDb,
    schoolClassesDb,
    schoolCoursesDb,
    teachersDb,
    schedulesDb,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const processArray = (arr: Item[]): ProcessedAltItem[] => {
    return arr.map((item) => {
      const processedItem: ProcessedAltItem = {
        ...item,
        schoolClassNames:
          typeof item.schoolClassNames === "string"
            ? item.schoolClassNames.split(",").map((str) => str.trim())
            : [item.schoolClassNames],
        classDaysNames:
          typeof item.classDaysNames === "string"
            ? item.classDaysNames.split(",").map((str) => str.trim())
            : [item.classDaysNames],
      };

      return processedItem;
    });
  };

  function getIdFromDb(db: any[], name: string): string | undefined {
    return db.find((entry) => entry.name.toUpperCase() === name.toUpperCase())
      ?.id;
  }

  function diasParaNumeros(dias: string[]): number[] {
    const diasDaSemana = {
      DOMINGO: 0,
      SEGUNDA: 1,
      TERÇA: 2,
      QUARTA: 3,
      QUINTA: 4,
      SEXTA: 5,
      SÁBADO: 6,
    };

    return dias.map(
      (dia) => diasDaSemana[dia.toUpperCase() as keyof typeof diasDaSemana]
    );
  }

  // Função para transformar o array
  const transformArray = (arr: ProcessedAltItem[]): ProcessedItem[] => {
    return arr.map((item) => {
      return {
        IDENTIFICADOR: item.IDENTIFICADOR, // Mantém o identificador original

        // Substituindo os campos por IDs
        schoolId:
          getIdFromDb(schoolsDb as SchoolSearchProps[], item.schoolName) || "",
        schoolCourseId:
          getIdFromDb(
            schoolCoursesDb as SchoolCourseSearchProps[],
            item.schoolCourse
          ) || "",
        scheduleId:
          getIdFromDb(schedulesDb as ScheduleSearchProps[], item.schedule) ||
          "",
        teacherId:
          getIdFromDb(teachersDb as TeacherSearchProps[], item.teacher) || "",
        placesAvailable: +item.placesAvailable, // Mantém o valor de placesAvailable

        // Convertendo schoolClassNames para IDs
        schoolClassIds: item.schoolClassNames.map(
          (className: string) =>
            getIdFromDb(
              schoolClassesDb as SchoolClassSearchProps[],
              className
            ) || ""
        ),

        // Convertendo classDaysNames para o ID correspondente
        classDayIds: diasParaNumeros(item.classDaysNames),
        classDayNames: item.classDaysNames,
      };
    });
  };

  function contarValoresInvalidos(array: ProcessedItem[]) {
    const contador = {
      vazio: 0,
      undefined: 0,
      null: 0,
    };

    // Função recursiva para percorrer cada valor
    function verificarValor(valor: any, objeto: any) {
      if (valor === "") {
        contador.vazio++;
        console.log("String vazia encontrada no objeto:", objeto);
      } else if (valor === undefined) {
        contador.undefined++;
        console.log("Valor undefined encontrado no objeto:", objeto);
      } else if (valor === null) {
        contador.null++;
        console.log("Valor null encontrado no objeto:", objeto);
      } else if (Array.isArray(valor)) {
        // Se for um array, percorre os elementos do array
        valor.forEach((item) => verificarValor(item, objeto));
      } else if (typeof valor === "object" && valor !== null) {
        // Se for um objeto, percorre suas propriedades
        for (const chave in valor) {
          verificarValor(valor[chave], objeto);
        }
      }
    }

    // Percorre o array de objetos
    array.forEach((objeto: ProcessedItem) => {
      for (const chave in objeto) {
        verificarValor(objeto[chave as keyof ProcessedItem], objeto);
      }
    });
    return contador;
  }

  async function submitFromJson() {
    // Processar o array
    const processedArray = processArray(turmasFromPlanilha);

    // Exemplo de transformação do array
    const result = transformArray(processedArray);

    const valores = contarValoresInvalidos(result);

    console.log(valores);
    const confirmation = await handleConfirmationToSubmit({
      title: "Adicionar Turma",
      text: "Tem certeza que deseja adicionar esta Turma?",
      icon: "question",
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      setIsSubmitting(true);
      try {
        await Promise.all(
          result.map(async (item, index) => {
            const commonId = uuidv4();
            const classDayId = uuidv4();
            const newCurriculumRef = doc(db, "curriculum", commonId);

            const addClassDays = async () => {
              try {
                await secureSetDoc(doc(db, "classDays", classDayId), {
                  id: classDayId,
                  name: item.classDayNames.join(" - "),
                  indexDays: item.classDayIds,
                  indexNames: item.classDayNames,
                });
              } catch (error) {
                console.log("ESSE É O ERROR", error);
                toast.error(`Ocorreu um erro... 🤯`, {
                  theme: "colored",
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  autoClose: 3000,
                });
                setIsSubmitting(false);
              }
            };
            await addClassDays();

            // Define o valor inicial do publicId
            const publicId = index + 1;

            await secureSetDoc(newCurriculumRef, {
              publicId,
              id: commonId,
              schoolId: item.schoolId,
              schoolClassIds: item.schoolClassIds,
              schoolCourseId: item.schoolCourseId,
              scheduleId: item.scheduleId,
              classDayId: classDayId,
              teacherId: item.teacherId,
              students: [],
              placesAvailable: item.placesAvailable,
            });
          })
        );
        toast.success(`Turmas em lote criadas com sucesso! 👌`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      } catch (error) {
        console.log("ESSE É O ERROR", error);
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div
        onClick={submitFromJson}
        className="cursor-pointer border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-2/4"
      >
        Adicionar do JSON ao banco
      </div>
    </div>
  );
}
