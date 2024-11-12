/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { CreateStudentValidationZProps } from "../../@types";
import { FieldErrors } from "react-hook-form";

interface Month {
  name: string;
  days: number;
}

interface BirthDateProps<T> {
  setStudentData: React.Dispatch<React.SetStateAction<T>>;
  errors: FieldErrors<CreateStudentValidationZProps>;
  renewBirthDayValue: boolean;
  birthDateValue: string;
  isDisabled: boolean;
}

const BirthDaySelect = <T extends { birthDate: string }>({
  setStudentData,
  errors,
  renewBirthDayValue,
  birthDateValue,
  isDisabled,
}: BirthDateProps<T>) => {
  const [day, setDay] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [availableDays, setAvailableDays] = useState<number[]>([]);

  const months: Month[] = [
    { name: "Janeiro", days: 31 },
    { name: "Fevereiro", days: 28 },
    { name: "Março", days: 31 },
    { name: "Abril", days: 30 },
    { name: "Maio", days: 31 },
    { name: "Junho", days: 30 },
    { name: "Julho", days: 31 },
    { name: "Agosto", days: 31 },
    { name: "Setembro", days: 30 },
    { name: "Outubro", days: 31 },
    { name: "Novembro", days: 30 },
    { name: "Dezembro", days: 31 },
  ];

  useEffect(() => {
    setDay("");
    setMonth("");
    setYear("");
  }, [renewBirthDayValue]);

  // Generate years from 1990 to three years before the current year
  const years: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = 1990; i <= currentYear - 3; i++) {
    years.push(i);
  }

  useEffect(() => {
    const daysInMonth = months[(month as number) - 1]?.days || 31;
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Adjust for leap years if the month is February
    if (
      month === 2 &&
      year &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    ) {
      daysArray.push(29);
    }

    setAvailableDays(daysArray);

    // Reset day if it's no longer valid for the selected month
    if (day && !daysArray.includes(day)) {
      setDay("");
    }
  }, [day, month, year]);

  useEffect(() => {
    if (day && month && year) {
      setStudentData((prevData) => ({
        ...prevData,
        birthDate: `${month}/${day}/${year}`,
      }));
    } else {
      setStudentData((prevData) => ({
        ...prevData,
        birthDate: "",
      }));
    }
  }, [day, month, year, setStudentData]);

  useEffect(() => {
    if (birthDateValue !== "") {
      const [birthDateDay, birthDateMonth, birthDateYear] = birthDateValue
        .split("/")
        .map((num) => parseInt(num, 10));
      setDay(birthDateDay);
      setMonth(birthDateMonth);
      setYear(birthDateYear);
    }
  }, [birthDateValue]);

  return (
    <div className="flex space-x-1">
      <div>
        <select
          disabled={isDisabled}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className={
            errors.birthDate
              ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
        >
          <option value="" disabled>
            Dia
          </option>
          {availableDays.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          disabled={isDisabled}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className={
            errors.birthDate
              ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
        >
          <option value="" disabled>
            Mês
          </option>
          {months.map((m, index) => (
            <option key={index} value={index + 1}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          disabled={isDisabled}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={
            errors.birthDate
              ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
        >
          <option value="" disabled>
            Ano
          </option>
          {years
            .sort((a, b) => b - a)
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default BirthDaySelect;
