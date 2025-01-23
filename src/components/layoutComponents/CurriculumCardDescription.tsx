import { useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

interface CurriculumCardDescriptionProps {
  id: string;
}

export default function CurriculumCardDescription({
  id,
}: CurriculumCardDescriptionProps) {
  // GET GLOBAL DATA
  const { userFullData, scheduleDatabaseData, handleOneCurriculumDetails } =
    useContext(GlobalDataContext) as GlobalDataContextType;

  return (
    <div className="w-full p-4 mb-4 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left">
      <div className="grid grid-cols-2 gap-6">
        <p>
          Escola:{" "}
          <span className="text-red-600 dark:text-yellow-500">
            {handleOneCurriculumDetails(id).schoolName}
          </span>
        </p>
        <p>
          Ano Escolar:{" "}
          <span className="text-red-600 dark:text-yellow-500">
            {handleOneCurriculumDetails(id).schoolClassNames.join(" - ")}
          </span>
        </p>
        <p>
          Modalidade:{" "}
          <span className="text-red-600 dark:text-yellow-500">
            {handleOneCurriculumDetails(id).schoolCourseName}
          </span>
        </p>
        {scheduleDatabaseData.map(
          (details) =>
            details.id === handleOneCurriculumDetails(id).scheduleId && (
              <p>
                Horário:{" "}
                <span className="text-red-600 dark:text-yellow-500">
                  De{" "}
                  {`${details.classStart.slice(0, 2)}h${
                    details.classStart.slice(3, 5) === "00"
                      ? ""
                      : details.classStart.slice(3, 5) + "min"
                  } a ${details.classEnd.slice(0, 2)}h${
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
          <span className="text-red-600 dark:text-yellow-500">
            {handleOneCurriculumDetails(id).classDayName}
          </span>
        </p>
        <p>
          Professor:{" "}
          <span className="text-red-600 dark:text-yellow-500">
            {handleOneCurriculumDetails(id).teacherName}
          </span>
        </p>
        {userFullData && userFullData.role !== "user" && (
          <p>
            Vagas Disponíveis:{" "}
            <span className="text-red-600 dark:text-yellow-500">
              {handleOneCurriculumDetails(id).placesAvailable -
                handleOneCurriculumDetails(id).students.length}
            </span>
          </p>
        )}
        {handleOneCurriculumDetails(id).waitingList.length > 0 && (
          <p>
            Alunos na lista de espera:{" "}
            <span className="text-red-600 dark:text-yellow-500">
              {handleOneCurriculumDetails(id).waitingList.length}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
