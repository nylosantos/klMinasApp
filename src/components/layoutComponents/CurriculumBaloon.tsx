import React, { useState, useEffect, useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { CurriculumStateProps, CurriculumWithNamesProps } from "../../@types";

interface Props {
  curriculumState: CurriculumStateProps;
  userRole: string;
  customDiscount: boolean;
  customDiscountValue: string;
  familyDiscount: boolean;
  secondCourseDiscount: boolean;
  employeeDiscount: boolean;
  studentFamilyAtSchool: string[];
  paymentDay?: string;
}

const CurriculumBalloon: React.FC<Props> = ({
  curriculumState,
  userRole,
  customDiscount,
  customDiscountValue,
  familyDiscount,
  secondCourseDiscount,
  employeeDiscount,
  studentFamilyAtSchool,
  paymentDay,
}) => {
  // GET GLOBAL DATA
  const { systemConstantsValues, handleOneCurriculumDetails } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  const [isExpanded, setIsExpanded] = useState(false);
  const [curriculumDetails, setCurriculumDetails] = useState<
    CurriculumWithNamesProps[]
  >([]);
  const [hasNonExperimentalCurriculum, setHasNonExperimentalCurriculum] =
    useState<boolean>(false);
  const [isPriceChanged, setIsPriceChanged] = useState(false); // Novo estado para gerenciar a animação

  useEffect(() => {
    const details = curriculumState.curriculums.map((curriculum) =>
      handleOneCurriculumDetails(curriculum.id)
    );
    setCurriculumDetails(details);

    // Verificar se existe algum curriculum com isExperimental como false
    const hasNonExperimental = curriculumState.curriculums.some(
      (curriculum) => !curriculum.isExperimental
    );
    setHasNonExperimentalCurriculum(hasNonExperimental);
  }, [curriculumState.curriculums, handleOneCurriculumDetails]);

  useEffect(() => {
    // Disparar a animação quando o appliedPrice mudar
    setIsPriceChanged(true);
    const timeout = setTimeout(() => setIsPriceChanged(false), 1000); // Desativa o estado de animação após 1 segundo
    return () => clearTimeout(timeout); // Limpeza do timeout
  }, [curriculumState.appliedPrice]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Função para obter se o currículo é experimental
  const getIsExperimental = (id: string) => {
    const curriculum = curriculumState.curriculums.find(
      (curriculum) => curriculum.id === id
    );
    return curriculum ? curriculum.isExperimental : false;
  };

  return (
    <div className="relative">
      {/* Balão minimizado */}
      {!isExpanded ? (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white dark:text-gray-100 rounded-full p-4 cursor-pointer shadow-lg hover:scale-105 transition-all"
          onClick={toggleExpand}
        >
          <div
            className={`text-xl font-semibold ${
              isPriceChanged
                ? "animate__animated animate__pulse animate-fast-pulse"
                : ""
            }`} // Animação suave no preço
          >
            {`${curriculumState.appliedPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`}
          </div>
        </div>
      ) : (
        // Balão expandido
        <div className="fixed w-full max-w-2xl bottom-4 py-4 max-h-[97%] overflow-scroll z-[9999] no-scrollbar left-1/2 transform -translate-x-1/2 bg-white dark:bg-klGreen-500 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg p-6 animate__animated animate__fadeIn animate__faster">
          <div className="space-y-4">
            {/* Curriculums */}
            <div className="space-y-2">
              {/* Primeiro, filtra as aulas experimentais e regulares */}
              {(() => {
                const experimentalCurriculums = curriculumDetails.filter(
                  (curriculum) => getIsExperimental(curriculum.id)
                );
                const regularCurriculums = curriculumDetails.filter(
                  (curriculum) => !getIsExperimental(curriculum.id)
                );

                return (
                  <>
                    {/* Exibindo as "Aulas Experimentais" */}
                    {experimentalCurriculums.length > 0 && (
                      <>
                        <div className="text-lg font-semibold mb-2">
                          {experimentalCurriculums.length === 1
                            ? "Aula Experimental"
                            : "Aulas Experimentais"}
                        </div>
                        <table className="min-w-full table-auto text-sm text-klGreen-500 dark:text-gray-100">
                          <thead>
                            <tr className="text-center bg-gray-100 dark:bg-gray-700">
                              <th className="w-1/3 px-4 py-2 font-semibold">
                                Escola
                              </th>
                              <th className="w-1/3 px-4 py-2 font-semibold">
                                Modalidade
                              </th>
                              <th className="w-1/3 px-4 py-2 font-semibold">
                                Professor
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {experimentalCurriculums.map((details) => (
                              <tr key={details.id}>
                                <td className="px-4 py-2">
                                  <span className="text-klOrange-500 font-semibold">
                                    {details.schoolName}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <span className="text-klOrange-500 font-semibold">
                                    {details.schoolCourseName}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <span className="text-klOrange-500 font-semibold">
                                    {details.teacherName}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}

                    {/* Exibindo as "Aulas Matriculadas" */}
                    {regularCurriculums.length > 0 && (
                      <>
                        <div className="text-lg font-semibold mb-2">
                          {regularCurriculums.length === 1
                            ? "Aula Matriculada"
                            : "Aulas Matriculadas"}
                        </div>
                        <table className="min-w-full table-auto text-sm text-klGreen-500 dark:text-gray-100">
                          <thead>
                            <tr className="text-center bg-gray-100 dark:bg-gray-700">
                              <th className="w-1/3 px-4 py-2 font-semibold">
                                Escola
                              </th>
                              <th className="w-1/3 px-4 py-2 font-semibold">
                                Modalidade
                              </th>
                              <th className="w-1/3 px-4 py-2 font-semibold">
                                Professor
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {regularCurriculums.map((details) => (
                              <tr key={details.id}>
                                <td className="px-4 py-2">
                                  <span className="text-klOrange-500 font-semibold">
                                    {details.schoolName}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <span className="text-klOrange-500 font-semibold">
                                    {details.schoolCourseName}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <span className="text-klOrange-500 font-semibold">
                                    {details.teacherName}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Preço total e preço com desconto */}
            <div className="text-base font-semibold text-klGreen-500 dark:text-gray-100">
              <p>
                <span>Matrícula:</span>{" "}
                <span className="text-klOrange-500 font-semibold">{`${curriculumState.enrollmentFee.toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}`}</span>
              </p>
              {userRole !== "user" && (
                <p>
                  <span>Mensalidade valor total:</span>{" "}
                  <span className="text-klOrange-500 font-semibold">{`${curriculumState.fullPrice.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}`}</span>
                </p>
              )}
              <p>
                <span>
                  {userRole !== "user"
                    ? "Mensalidade com Desconto"
                    : "Mensalidade"}
                  :
                </span>{" "}
                <span className="text-klOrange-500 font-semibold">{`${curriculumState.appliedPrice.toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}`}</span>
              </p>
            </div>

            {/* Data do pagamento (apenas se existir algum currículo não experimental) */}
            {hasNonExperimentalCurriculum &&
              systemConstantsValues &&
              (customDiscount ||
                employeeDiscount ||
                (familyDiscount && studentFamilyAtSchool.length > 0) ||
                secondCourseDiscount) && (
                <div className="mt-4 text-sm text-klGreen-500 dark:text-gray-100">
                  {customDiscount &&
                  customDiscountValue !== "0" &&
                  customDiscountValue !== "" ? (
                    <p>
                      Desconto Customizado aplicado:{" "}
                      {customDiscountValue.replace(/^0+/, "")}%
                    </p>
                  ) : employeeDiscount ? (
                    <p>
                      Desconto de funcionário aplicado:{" "}
                      {100 - systemConstantsValues.employeeDiscountValue * 100}%
                    </p>
                  ) : familyDiscount && studentFamilyAtSchool.length > 0 ? (
                    <>
                      <p>
                        Desconto Familiar aplicado:{" "}
                        {100 - systemConstantsValues.familyDiscountValue * 100}%
                      </p>
                      {curriculumState.fullPrice ===
                        curriculumState.appliedPrice && (
                        <p className="text-xs text-red-600 dark:text-yellow-500">
                          Atenção: Este é o curso com maior valor, o desconto
                          está sendo aplicado nas mensalidades dos familiares.
                        </p>
                      )}
                    </>
                  ) : (
                    secondCourseDiscount && (
                      <p>
                        Desconto de segundo curso aplicado:{" "}
                        {100 -
                          systemConstantsValues.secondCourseDiscountValue * 100}
                        %
                      </p>
                    )
                  )}
                </div>
              )}
            {hasNonExperimentalCurriculum && systemConstantsValues && (
              <div className="mt-4 text-sm text-klGreen-500 dark:text-gray-100">
                <p>
                  Dia de pagamento:{" "}
                  {paymentDay || systemConstantsValues.standardPaymentDay}
                </p>
              </div>
            )}
          </div>
          {/* Botão para minimizar */}
          <button
            className="mt-4 text-klOrange-500 font-semibold hover:underline"
            onClick={toggleExpand}
          >
            Minimizar
          </button>
        </div>
      )}
    </div>
  );
};

export default CurriculumBalloon;
