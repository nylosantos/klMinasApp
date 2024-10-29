import { Timestamp } from "firebase/firestore";

// COMPANY NAME
export const customerFullName = "KL Minas";
// COMPANY SHORT NAME
export const customerShortName = "KL";
// OPEN/CLOSE APP SIGN IN
export const systemSignInClosed = false;
// OPEN/CLOSE APP SIGN UP
export const systemSignUpClosed = false;
// ENROLMENT FEE FULL VALUES
export const enrolmentFee = 157
export const enrolmentFeeDiscount = 67.5

// CUSTOM MONTHS OF DATEPICKER
export const months = [
  ["Jan", "J"],
  ["Fev", "F"],
  ["Mar", "M"],
  ["Abr", "A"],
  ["Mai", "M"],
  ["Jun", "J"],
  ["Jul", "J"],
  ["Ago", "A"],
  ["Set", "S"],
  ["Out", "O"],
  ["Nov", "N"],
  ["Dez", "D"],
];
// CUSTOM DAYS OF DATEPICKER
export const weekDays = [
  ["Dom", "D"],
  ["Seg", "S"],
  ["Ter", "T"],
  ["Qua", "Q"],
  ["Qui", "Q"],
  ["Sex", "S"],
  ["Sab", "S"],
];

// DAYS TO NAMES
export const daysToNames = [
  { number: 1, name: "um" },
  { number: 2, name: "dois" },
  { number: 3, name: "três" },
  { number: 4, name: "quatro" },
  { number: 5, name: "cinco" },
  { number: 6, name: "seis" },
  { number: 7, name: "sete" },
  { number: 8, name: "oito" },
  { number: 9, name: "nove" },
  { number: 10, name: "dez" },
  { number: 11, name: "onze" },
  { number: 12, name: "doze" },
  { number: 13, name: "treze" },
  { number: 14, name: "quatorze" },
  { number: 15, name: "quinze" },
  { number: 16, name: "dezesseis" },
  { number: 17, name: "dezessete" },
  { number: 18, name: "dezoito" },
  { number: 19, name: "dezenove" },
  { number: 20, name: "vinte" },
  { number: 21, name: "vinte e um" },
  { number: 22, name: "vinte e dois" },
  { number: 23, name: "vinte e três" },
  { number: 24, name: "vinte e quatro" },
  { number: 25, name: "vinte e cinco" },
  { number: 26, name: "vinte e seis" },
  { number: 27, name: "vinte e sete" },
  { number: 28, name: "vinte e oito" },
];

// CLASSDAY INDEX
export const classDayIndex = [
  { id: 0, name: "Domingo" },
  { id: 1, name: "Segunda" },
  { id: 2, name: "Terça" },
  { id: 3, name: "Quarta" },
  { id: 4, name: "Quinta" },
  { id: 5, name: "Sexta" },
  { id: 6, name: "Sábado" },
];

// CLASSDAY INDEX
export const classDayIndexNames = [
  { id: "sunday", name: "Domingo" },
  { id: "monday", name: "Segunda" },
  { id: "tuesday", name: "Terça" },
  { id: "wednesday", name: "Quarta" },
  { id: "thursday", name: "Quinta" },
  { id: "friday", name: "Sexta" },
  { id: "saturday", name: "Sábado" },
];

// IMPORTANT VARIABLES
// MINIMUM CLASS STUDENTS
export const minimumStudents = 20;

// STANDARD PAYMENT DAY
export const standardPaymentDay = "5";

// DISCOUNT VARIABLES
export const employeeDiscountValue = 0.8;
export const familyDiscountValue = 0.9;
export const secondCourseDiscountValue = 0.9;

// PAYMENT ARRAY (UPDATE WHEN A NEW YEAR BEGIN)
export const paymentArray = [
  {
    year: "2023",
    month: "Janeiro",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Fevereiro",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Março",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Abril",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Maio",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Junho",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Julho",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Agosto",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Setembro",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Outubro",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Novembro",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
  {
    year: "2023",
    month: "Dezembro",
    value: 0,
    date: Timestamp.fromDate(new Date("01/01/1900")),
    note: "",
  },
];

// TEST VALID CPF (BRAZILIAN DOCUMENT) FUNCTION
export function testaCPF(cpfNumber: string) {
  let Soma;
  let Resto;
  Soma = 0;
  if (cpfNumber == "00000000000") return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(cpfNumber.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(cpfNumber.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(cpfNumber.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(cpfNumber.substring(10, 11))) return false;
  return true;
}

// FORMAT CPF (BRAZILIAN DOCUMENT) FUNCTION
export const formataCPF = (cpfNumber: string) => {
  cpfNumber = cpfNumber.replace(/[^\d]/g, "");
  return cpfNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const convertTimestamp = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return date;
};
