/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  CurriculumRegistrationChangesProps,
  CurriculumToAddProps,
  CurriculumWithNamesProps,
  StudentFreeDayProps,
  VacancyCalculationResult,
} from "../../@types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { FaCheck } from "react-icons/fa";
import { classDayIndex, months, weekDays } from "../../custom";
import { Tooltip } from "react-tooltip";
import { Timestamp } from "firebase/firestore";

interface CurriculumRegistrationProps {
  selectedCurriculum: CurriculumToAddProps | null;
  studentFreeDays: StudentFreeDayProps[];
  setSelectedDays: (value: React.SetStateAction<number[]>) => void;
  curriculumDays: number[];
  selectedDays: number[];
  curriculumDetails: CurriculumWithNamesProps | undefined;
  initialized?: boolean;
  setInitialized?: React.Dispatch<React.SetStateAction<boolean>>;
  studentId?: string;
  handleCurriculumRegistrationChanges({
    id,
    date,
    whatChanged,
  }: CurriculumRegistrationChangesProps): void;
}

export default function CurriculumRegistration({
  selectedCurriculum,
  studentFreeDays,
  setSelectedDays,
  curriculumDays,
  selectedDays,
  curriculumDetails,
  initialized = false,
  setInitialized,
  studentId,
  handleCurriculumRegistrationChanges,
}: CurriculumRegistrationProps) {
  const { calculatePlacesAvailable, handleOneCurriculumDetails } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // CURRICULUM PLACES AVAILABLE STATE
  const [placesAvailable, setPlacesAvailable] =
    useState<VacancyCalculationResult>();

  useEffect(() => {
    if (curriculumDetails && selectedCurriculum) {
      const { id, classDayIndexDays } = curriculumDetails;

      // Evitar chamadas desnecessárias se os dados não mudaram
      if (selectedCurriculum.id !== id || !initialized) {
        const fetchPlacesAvailable = async () => {
          try {
            const placesAvailableData = await calculatePlacesAvailable(
              id,
              classDayIndexDays,
              studentId
            );
            setPlacesAvailable(placesAvailableData);
          } catch (error) {
            console.error("Erro ao calcular as vagas disponíveis:", error);
          }
        };
        fetchPlacesAvailable();
      }
    }
  }, [curriculumDetails, selectedCurriculum, initialized]); // Dependendo de placesAvailable para evitar chamadas desnecessárias

  const toggleDaySelection = (day: number) => {
    handleCurriculumRegistrationChanges({
      date: null,
      whatChanged: "days",
      id: selectedCurriculum?.id,
    });
    setSelectedDays((prev) => {
      const updatedDays = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];

      return updatedDays.sort((a, b) => a - b); // Atualiza apenas os dias
    });
  };

  useEffect(() => {
    if (
      !initialized &&
      selectedCurriculum &&
      !selectedCurriculum.isExperimental &&
      placesAvailable
    ) {
      const availableDays = curriculumDays.filter(
        (day) =>
          studentFreeDays.find((freeDay) => freeDay.day === day)
            ?.curriculumId === null && placesAvailable.vacanciesPerDay[day] > 0 // Verifica se há vaga disponível na vaga compartilhada
      );
      setSelectedDays(availableDays);
      setInitialized && setInitialized(true); // Marca como inicializado para evitar novas execuções
    }
  }, [selectedCurriculum]); // Removi studentFreeDays da dependência para rodar só quando o currículo muda

  if (selectedCurriculum && placesAvailable) {
    const waitingList = handleOneCurriculumDetails(
      selectedCurriculum.id
    ).students.filter((student) => student.isWaiting);

    const waitingListPosition = waitingList
      .sort((a, b) => Number(a.date?.toDate()) - Number(b.date?.toDate()))
      .findIndex((student) => student.id === studentId);

    const studentAlreadyRegistered = handleOneCurriculumDetails(
      selectedCurriculum.id
    ).students.find(
      (student) =>
        student.id === studentId &&
        !student.isWaiting &&
        !student.isExperimental
    );

    if (
      placesAvailable.vacanciesAvailable &&
      (studentAlreadyRegistered ||
        waitingList.length === 0 ||
        waitingListPosition === 0)
    ) {
      return (
        <div className="flex flex-col items-center justify-evenly gap-4 p-2 xl:p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col xl:flex-row w-full items-center justify-evenly gap-4 xl:p-4">
            <div className="flex w-full xl:w-1/2 justify-center items-center gap-4 xl:gap-2">
              <p>Matríucula</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCurriculum.isExperimental}
                  onChange={() => {
                    handleCurriculumRegistrationChanges({
                      date: null,
                      whatChanged: "courseType",
                      id: selectedCurriculum.id,
                      resetDays: true,
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-green-600 peer-checked:bg-klOrange-500 peer-focus:ring-2 peer-focus:ring-transparent rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:shadow-md after:transform after:-translate-y-1/2"></div>
              </label>
              <p>Aula Experimental</p>
            </div>
          </div>
          {!selectedCurriculum.isExperimental && (
            <div className="flex flex-col gap-4 p-4 w-full rounded-lg bg-gray-100 dark:bg-gray-800">
              <p>Selecione os dias de Aula:</p>
              <div className="flex flex-wrap w-full items-center justify-center gap-2">
                {curriculumDays.map((i) => {
                  // Verifique se o dia está ocupado por OUTRO currículo
                  const occupiedCurriculum = studentFreeDays.find(
                    (freeDay) =>
                      freeDay.day === i && freeDay.curriculumId !== null
                  );

                  const isOccupied =
                    occupiedCurriculum !== undefined &&
                    occupiedCurriculum !== null &&
                    occupiedCurriculum.curriculumId !== selectedCurriculum.id;

                  // Verificar se o dia está disponível dentro das vagas parciais
                  const isDayUnavailable =
                    !placesAvailable.vacanciesPerDay[i] || // Se não há vagas disponíveis para esse dia
                    isOccupied; // Ou se o dia está ocupado por outro currículo

                  // Definir mensagem da tooltip
                  let tooltipMessage = "";
                  if (isOccupied) {
                    tooltipMessage = "Dia ocupado por outro currículo";
                  } else if (!placesAvailable.vacanciesPerDay[i]) {
                    tooltipMessage = "Nenhuma vaga disponível para este dia";
                  }

                  return (
                    <label
                      key={i}
                      className={`w-1/4 p-2 border rounded cursor-pointer relative ${
                        isDayUnavailable
                          ? "bg-gray-400 cursor-not-allowed" // Bloqueado caso o dia esteja ocupado
                          : selectedDays.includes(i)
                          ? // : selectedCurriculum?.indexDays.includes(i)
                            "bg-klGreen-500 text-white" // Selecionado
                          : "bg-white text-klGreen-500"
                      }`}
                      data-tooltip-id={`tooltip-${i}-${selectedCurriculum.id}`}
                    >
                      {selectedDays.includes(i) && (
                        <div className="flex flex-col absolute top-0 right-3 gap-2 justify-between h-full py-3">
                          <FaCheck className="text-green-600 dark:text-green-600 w-6 h-6" />
                        </div>
                      )}
                      <input
                        type="checkbox"
                        className="hidden"
                        disabled={isDayUnavailable} // Desabilita se o dia estiver ocupado por outro currículo
                        checked={selectedDays.includes(i)} // Marca se o dia está incluído no currículo atual
                        onChange={() => toggleDaySelection(i)}
                      />
                      {classDayIndex[i].name}

                      {/* Tooltip aparece apenas se o dia estiver ocupado por OUTRO currículo */}
                      {isDayUnavailable && (
                        <Tooltip
                          id={`tooltip-${i}-${selectedCurriculum.id}`}
                          content={tooltipMessage}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          {(selectedCurriculum.isExperimental ||
            (!selectedCurriculum.isExperimental &&
              selectedDays.length > 0)) && (
            <div className="flex flex-col xl:flex-row w-full items-center justify-evenly gap-4 xl:p-4">
              <label className="flex w-full xl:w-1/2 justify-center items-center gap-2">
                <span>
                  {selectedCurriculum.isExperimental
                    ? "Data da Aula Experimental"
                    : "Data de Início"}
                </span>
                <DatePicker
                  months={months}
                  weekDays={weekDays}
                  placeholder={"Selecione uma Data"}
                  containerClassName="w-full"
                  style={{ width: "100%" }}
                  value={
                    selectedCurriculum.date
                      ? selectedCurriculum.date.toDate()
                      : ""
                  }
                  inputClass={
                    "px-2 py-1 dark:bg-gray-700 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  }
                  minDate={new DateObject()}
                  mapDays={({ date }) => {
                    const isExperimental = selectedCurriculum.isExperimental;
                    const availableDays = curriculumDays.filter(
                      (day) => placesAvailable.vacanciesPerDay[day] > 0
                    );
                    const isAvailable = isExperimental
                      ? availableDays.includes(date.weekDay.index)
                      : selectedCurriculum.indexDays.includes(
                          date.weekDay.index
                        );
                    if (!isAvailable)
                      return {
                        disabled: true,
                        style: { color: "#ccc" },
                        title: "Aula não disponível neste dia",
                      };
                  }}
                  editable={false}
                  format="DD/MM/YYYY"
                  onOpenPickNewDate={false}
                  autoFocus={false}
                  onChange={(newDate) => {
                    if (newDate) {
                      const isExperimental = selectedCurriculum.isExperimental;
                      const availableDays = curriculumDays.filter(
                        (day) => placesAvailable.vacanciesPerDay[day] > 0
                      );
                      const newDayIndex = newDate.weekDay.index; // Obtemos o índice do dia (0-6 para Domingo-Sábado)

                      const isAvailable = isExperimental
                        ? availableDays.includes(newDayIndex)
                        : selectedCurriculum.indexDays.includes(newDayIndex);

                      if (isAvailable) {
                        const date = newDate.toDate();
                        handleCurriculumRegistrationChanges({
                          date: Timestamp.fromDate(date),
                          whatChanged: "date",
                          id: selectedCurriculum.id,
                        });
                      } else {
                        console.log("Data inválida:", selectedCurriculum.date);
                      }
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full items-center justify-center p-4 mb-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent rounded-2xl text-center text-lg text-red-600 dark:text-yellow-500">
          {/* CLASS WAITING LIST DISCLAIMER */}
          <h1 className="font-bold">FILA DE ESPERA</h1>
          <p className="flex items-center text-justify-center">
            A turma selecionada está sem vaga disponível para matrícula
            {waitingListPosition === -1 &&
              ", preencha os dados abaixo para entrar na fila de espera"}
            .
            <br /> Seguimos uma ordem nesta fila por data de cadastro, sendo
            assim, à medida que as vagas forem disponibilizadas, entraremos em
            contato.
          </p>
          {studentId ? (
            <p className="font-bold">
              Posição na lista de espera: {waitingListPosition + 1}º
            </p>
          ) : (
            <p className="font-bold">
              Alunos em fila de espera: {waitingList.length}
            </p>
          )}
        </div>
      );
    }
  }
}
