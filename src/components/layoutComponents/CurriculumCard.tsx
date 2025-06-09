/* eslint-disable react-hooks/exhaustive-deps */
import { FaCheck, FaExchangeAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { VacancyCalculationResult } from "../../@types";

interface CurriculumCardProps {
  curriculum: {
    id: string;
    schoolCourseId: string;
  };
  selectedCurriculumId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CurriculumCard({
  curriculum,
  selectedCurriculumId,
  onSelect,
}: CurriculumCardProps) {
  const {
    userFullData,
    scheduleDatabaseData,
    handleOneCurriculumDetails,
    calculatePlacesAvailable,
    getWaitingCurriculums,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CURRICULUM PLACES AVAILABLE STATE
  const [placesAvailable, setPlacesAvailable] =
    useState<VacancyCalculationResult>();

  // CHANGE PLACES AVAILABLE
  useEffect(() => {
    const fetchPlacesAvailable = async () => {
      if (curriculum.id) {
        const { id, classDayIndexDays } = handleOneCurriculumDetails(
          curriculum.id
        );
        try {
          const placesAvailableData = await calculatePlacesAvailable(
            id,
            classDayIndexDays
          );
          // Atualize o estado com os dados retornados, se necessário
          setPlacesAvailable(placesAvailableData);
        } catch (error) {
          console.error("Erro ao calcular as vagas disponíveis:", error);
        }
      }
    };

    fetchPlacesAvailable();
  }, [curriculum.id]);

  const curriculumDetails = handleOneCurriculumDetails(curriculum.id);
  const isSelected = selectedCurriculumId === curriculum.id;

  const handleClick = () => {
    if (isSelected) {
      onSelect(null); // Deseleciona ao clicar no item já selecionado
    } else {
      onSelect(curriculum.id);
    }
  };
  if (placesAvailable) {
    return (
      <div
        className={`relative flex flex-col w-full items-center p-4 mb-4 gap-6 border rounded-2xl text-left cursor-pointer transition-all duration-300
      ${
        isSelected
          ? "bg-green-500 border-green-700 dark:bg-green-950 dark:border-green-500 text-white"
          : "bg-white/50 dark:bg-gray-800 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
      }`}
        onClick={handleClick}
      >
        {/* Ícone de check no canto superior direito */}
        {isSelected && (
          <div className="flex flex-col absolute top-0 right-3 gap-2 justify-between h-full py-3">
            <FaCheck className="text-green-600 dark:text-green-600 w-6 h-6" />
            <FaExchangeAlt className="text-yellow-500 dark:text-yellow-500 w-6 h-6" />
          </div>
        )}

        {/* Conteúdo do card */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-6">
            <p>
              Escola:{" "}
              <span
                className={`${
                  isSelected ? "text-yellow-500" : "text-red-600"
                } dark:text-yellow-500 font-semibold`}
              >
                {curriculumDetails.schoolName}
              </span>
            </p>
            <p>
              Ano Escolar:{" "}
              <span
                className={`${
                  isSelected ? "text-yellow-500" : "text-red-600"
                } dark:text-yellow-500 font-semibold`}
              >
                {curriculumDetails.schoolClassNames.join(" - ")}
              </span>
            </p>
            <p>
              Modalidade:{" "}
              <span
                className={`${
                  isSelected ? "text-yellow-500" : "text-red-600"
                } dark:text-yellow-500 font-semibold`}
              >
                {curriculumDetails.schoolCourseName}
              </span>
            </p>
            {scheduleDatabaseData.map(
              (details) =>
                details.id === curriculumDetails.scheduleId && (
                  <p className="font-semibold" key={details.id}>
                    Horário:{" "}
                    <span
                      className={`${
                        isSelected ? "text-yellow-500" : "text-red-600"
                      } dark:text-yellow-500`}
                    >
                      De{" "}
                      {`${details.classStart.slice(0, 2)}h${
                        details.classStart.slice(3, 5) === "00"
                          ? ""
                          : details.classStart.slice(3, 5) + "min"
                      } às ${details.classEnd.slice(0, 2)}h${
                        details.classEnd.slice(3, 5) === "00"
                          ? ""
                          : details.classEnd.slice(3, 5) + "min"
                      }`}
                    </span>
                  </p>
                )
            )}
            <p>
              Dias:{" "}
              <span
                className={`${
                  isSelected ? "text-yellow-500" : "text-red-600"
                } dark:text-yellow-500 font-semibold`}
              >
                {curriculumDetails.classDayName}
              </span>
            </p>
            <p>
              Professor:{" "}
              <span
                className={`${
                  isSelected ? "text-yellow-500" : "text-red-600"
                } dark:text-yellow-500 font-semibold`}
              >
                {curriculumDetails.teacherName}
              </span>
            </p>
            {userFullData && userFullData.role !== "user" && (
              <p>
                Vagas Disponíveis:{" "}
                <span
                  className={`${
                    isSelected ? "text-yellow-500" : "text-red-600"
                  } dark:text-yellow-500 font-semibold`}
                >
                  {placesAvailable.totalAvailableVacancies}
                </span>
              </p>
            )}
            {getWaitingCurriculums(curriculumDetails.students).length > 0 && (
              <p>
                Alunos na lista de espera:{" "}
                <span
                  className={`${
                    isSelected ? "text-yellow-500" : "text-red-600"
                  } dark:text-yellow-500 font-semibold`}
                >
                  {getWaitingCurriculums(curriculumDetails.students).length}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
