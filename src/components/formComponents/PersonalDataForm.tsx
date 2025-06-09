import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import BirthDaySelect from "./BirthDaySelect"; // Importando o componente de seleção de data de nascimento

// Tipos importados de seus arquivos
import { formataCPF, schoolYearsComplementData, testaCPF } from "../../custom";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// Aqui criamos um tipo genérico para o props do componente filho
interface PersonalDataFormProps<T> {
  studentData: T;
  setStudentData: React.Dispatch<React.SetStateAction<T>>;
  testCPF: boolean;
  isSubmitting: boolean;
  renewBirthDayValue: boolean;
  onlyView?: boolean;
  setTestCPF: React.Dispatch<React.SetStateAction<boolean>>;
}

// Aqui você define o tipo base do seu StudentData
interface StudentData {
  name: string;
  document?: string;
  birthDate: string;
  schoolYears: string;
  schoolYearsComplement: string;
}

const PersonalDataForm = <T extends StudentData>({
  studentData,
  setStudentData,
  testCPF,
  isSubmitting,
  renewBirthDayValue,
  setTestCPF,
  onlyView = false,
}: PersonalDataFormProps<T>) => {
  const {
    formState: { errors },
  } = useFormContext(); // Pega os métodos do useFormContext e os erros

  const { schoolClassDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
    <div className="flex flex-col w-full gap-2">
      <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
        Dados Pessoais:
      </h1>
      {/* Nome */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="name"
          className={
            errors.name
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Nome do aluno:{" "}
        </label>
        <input
          // {...register("name")} // Usa o método register para integrar com o react-hook-form
          type="text"
          name="name"
          disabled={isSubmitting}
          readOnly={onlyView}
          placeholder={
            errors.name
              ? "É necessário inserir o nome completo do aluno"
              : "Insira o nome completo do aluno"
          }
          className={
            errors.name
              ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          value={studentData.name}
          onChange={(e) => {
            setStudentData({ ...studentData, name: e.target.value });
          }}
        />
      </div>

      {/* Data de Nascimento */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="birthDate"
          className={
            errors.birthDate
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Data de Nascimento:{" "}
        </label>
        <div className="flex w-3/4">
          <BirthDaySelect
            setStudentData={setStudentData}
            errors={errors}
            renewBirthDayValue={renewBirthDayValue}
            isDisabled={onlyView}
            birthDateValue={studentData.birthDate || ""}
          />
        </div>
      </div>

      {/* CPF */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="document"
          className={
            testCPF
              ? errors.document
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
              : "w-1/4 text-right text-red-500 dark:text-red-400"
          }
        >
          CPF
          {testCPF ? (
            ": "
          ) : (
            <span className="text-red-500 dark:text-red-400">
              {" "}
              Inválido, verifique:
            </span>
          )}
        </label>
        <input
          type="text"
          name="document"
          disabled={isSubmitting}
          maxLength={14}
          minLength={14}
          readOnly={onlyView}
          placeholder={
            testCPF
              ? errors.document
                ? "É necessário inserir o CPF do Aluno"
                : "Insira o CPF do Aluno"
              : "CPF Inválido"
          }
          className={
            testCPF
              ? errors.document
                ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
          }
          value={studentData.document}
          onChange={(e) => {
            if (e.target.value.length === 14) {
              setTestCPF(testaCPF(e.target.value));
            }
            setStudentData((prevData) => ({
              ...prevData,
              document: formataCPF(e.target.value),
            }));
          }}
          onBlur={(e) => {
            // Se não estiver vazio, testa o CPF
            if (e.target.value.trim() !== "") {
              setTestCPF(testaCPF(e.target.value));
            } else {
              setTestCPF(true); // Considera válido se vazio (opcional)
            }
          }}
        />
      </div>

      {/* Ano escolar */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="schoolStageSelect"
          className={
            errors.schoolYears
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Ano escolar:{" "}
        </label>
        <select
          disabled={onlyView}
          value={studentData.schoolYears || " -- select an option -- "}
          className={
            errors.schoolYears
              ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          name="schoolStageSelect"
          onChange={(e) => {
            setStudentData({ ...studentData, schoolYears: e.target.value });
          }}
        >
          <option disabled value={" -- select an option -- "}>
            {" "}
            -- Selecione --{" "}
          </option>
          {schoolClassDatabaseData
            .sort((a, b) => a.schoolStageId.localeCompare(b.schoolStageId))
            .map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
        </select>
      </div>

      {/* Turma */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="schoolYearsSelectComplement"
          className={
            errors.schoolYearsComplement
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Turma:{" "}
        </label>
        <select
          disabled={onlyView}
          value={
            studentData.schoolYearsComplement || " -- select an option -- "
          }
          className={
            errors.schoolYearsComplement
              ? "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          name="schoolYearsSelectComplement"
          onChange={(e) => {
            setStudentData({
              ...studentData,
              schoolYearsComplement: e.target.value,
            });
          }}
        >
          <option disabled value={" -- select an option -- "}>
            {" "}
            -- Selecione --{" "}
          </option>
          {schoolYearsComplementData.map((schoolYearComplement) => (
            <option
              key={schoolYearComplement.id}
              value={schoolYearComplement.id}
            >
              {schoolYearComplement.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PersonalDataForm;
