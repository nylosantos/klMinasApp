/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CurriculumRegistrationChangesProps,
  CurriculumStateProps,
  CurriculumToAddProps,
  CurriculumWithNamesProps,
  StudentFreeDayProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import CurriculumRegistration from "./CurriculumRegistration";
import { DropdownMenu } from "../layoutComponents/DropdownMenu";

interface Props {
  curriculumState: CurriculumStateProps;
  studentFreeDays: StudentFreeDayProps[];
  removedCurriculums: CurriculumToAddProps[];
  userRole: string;
  studentId: string;
  setRemovedCurriculums: Dispatch<SetStateAction<CurriculumToAddProps[]>>;
  setCurriculumState: Dispatch<SetStateAction<CurriculumStateProps>>;
  newAddCurriculums: CurriculumToAddProps[];
  onlyView: boolean;
}

export default function ShowCurriculums({
  curriculumState,
  studentFreeDays,
  studentId /*, userRole*/,
  setRemovedCurriculums,
  removedCurriculums,
  setCurriculumState,
  newAddCurriculums,
  onlyView,
}: Props) {
  // GET GLOBAL DATA
  const {
    handleOneCurriculumDetails,
    handleConfirmationToSubmit,
    curriculumDb,
    classDaysDb,
    getRegularCurriculums,
    getExperimentalCurriculums,
    getWaitingCurriculums,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // const [curriculumDetails, setCurriculumDetails] = useState<
  //   CurriculumWithNamesProps[]
  // >([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [curriculumToChangeId, setCurriculumToChangeId] = useState<string>();

  // Ref para garantir que o efeito execute apenas uma vez quando o curriculumState.curriculums for inicializado
  const initialLoad = useRef(false);

  const prevSelectedDays = useRef(selectedDays); // Referência para o valor anterior de selectedDays

  // const prevCurriculums = useRef(curriculumState.curriculums); // Armazena o valor anterior de curriculums

  const getOneCurriculum = (id: string) => {
    const curriculum = curriculumState.curriculums.find(
      (curriculum) => curriculum.id === id
    );
    return curriculum ? curriculum : null;
  };

  const toggleExistentCurriculum = (curriculumId: string) => {
    if (!classDaysDb || !curriculumDb) {
      throw new Error("Database is not defined");
    }
    // Verifica se o currículo está na lista
    const curriculumToRemove = curriculumState.curriculums.find(
      (curriculum) => curriculum.id === curriculumId
    );
    const curriculumToReturn = removedCurriculums.find(
      (curriculum) => curriculum.id === curriculumId
    );
    if (curriculumToRemove && !curriculumToReturn) {
      // console.log("tá chegando");

      // Remove os dias do selectedDays com base no curriculum removido
      setSelectedDays((prevDays) =>
        prevDays.filter((day) => !curriculumToRemove.indexDays.includes(day))
      );
      // Adiciona o currículo removido aos curriculums removidos
      setRemovedCurriculums((prevState) => [...prevState, curriculumToRemove]);
    } else {
      if (curriculumToRemove && curriculumToReturn) {
        // Tira o curriculum da edição

        // console.log("tá chegando agora");
        // Verifica se os dias do currículo que está sendo adicionado estão disponíveis
        const curriculumDays = curriculumToReturn.indexDays;

        // const allDaysAvailable = curriculumDays.every(
        //   (day) => !selectedDays.includes(day)
        // );
        const allDaysAvailable = curriculumDays.every((day) => {
          // Encontra o objeto correspondente ao dia em studentFreeDays
          const studentFreeDay = studentFreeDays.find(
            (freeDay) => freeDay.day === day
          );

          // Se o dia não for encontrado ou o curriculumId for null, significa que o dia está livre
          return !studentFreeDay || studentFreeDay.curriculumId === null;
        });

        if (allDaysAvailable) {
          // Se os dias estiverem disponíveis, adiciona o currículo
          setRemovedCurriculums((prevState) =>
            prevState.filter((curriculum) => curriculum.id !== curriculumId)
          );
          setSelectedDays((prevDays) => [
            ...prevDays,
            ...curriculumToReturn.indexDays,
          ]);
        } else {
          // Se algum dos dias não estiver disponível, pode exibir uma mensagem de erro ou prevenir a adição
          handleConfirmationToSubmit({
            showCancelButton: false,
            cancelButtonText: "Fechar",
            title: "Atenção",
            confirmButtonText: "Fechar",
            icon: "warning",
            text: "Não foi possível cancelar a exclusão. Alguns dias da matrícula antiga não estão disponíveis, pois existe alguma nova modalidade ocupando esses dias. Verifique e tente novamente.",
          });
        }
      }
    }
  };

  function handleCurriculumRegistrationChanges({
    id,
    date,
    whatChanged,
    resetDays = false,
  }: CurriculumRegistrationChangesProps) {
    if (whatChanged === "courseType") {
      setCurriculumState((prev) => {
        if (!prev) return prev; // Garante que prev existe
        return {
          ...prev,
          curriculums: prev.curriculums.map((curriculum) => {
            const actualDate = curriculum.date
              ? curriculum.date.toDate()
              : new Date("");
            const isAvailable = selectedDays.includes(actualDate.getDay());
            return curriculum.id === id
              ? {
                  ...curriculum,
                  isExperimental: !curriculum.isExperimental,
                  isWaiting: false,
                  indexDays: selectedDays, // Se estava experimental, mantém os dias
                  date: isAvailable ? curriculum.date : null,
                }
              : curriculum;
          }),
        };
      });
    }
    if (whatChanged === "date") {
      setCurriculumState((prev) => {
        if (!prev) return prev; // Garante que prev existe

        return {
          ...prev,
          isWaiting: false,
          curriculums: prev.curriculums.map((curriculum) =>
            curriculum.id === id ? { ...curriculum, date } : curriculum
          ),
        };
      });
    }
    if (whatChanged === "days" && id) {
      setCurriculumToChangeId(id); // Atualiza o estado curriculumToChangeId com o id necessário
      setCurriculumState((prev) => {
        if (!prev) return prev; // Garante que prev existe
        return {
          ...prev,
          curriculums: prev.curriculums
            .filter(
              (curriculum) =>
                !removedCurriculums.some(
                  (removed) => removed.id === curriculum.id
                )
            )
            .map((curriculum) => {
              return curriculum.id === id
                ? {
                    ...curriculum,
                    //   isExperimental: !curriculum.isExperimental,
                    indexDays: selectedDays, // Se estava experimental, mantém os dias
                    date: curriculum.date,
                    isWaiting: false,
                  }
                : curriculum;
            }),
        };
      });
    }
    resetDays;
  }

  // Primeiro useEffect - Atualiza selectedDays
  useEffect(() => {
    // Verifica se houve mudança no curriculumState.curriculums
    if (curriculumState.curriculums.length > 0) {
      if (initialLoad.current) return; // Evita rodar novamente após a primeira execução

      initialLoad.current = true; // Marca que o efeito foi executado

      // Verifica se houve alteração em selectedDays
      const newSelectedDays = curriculumState.curriculums
        .map((curriculum) => curriculum.indexDays)
        .flat();

      if (JSON.stringify(newSelectedDays) !== JSON.stringify(selectedDays)) {
        setSelectedDays(newSelectedDays);
      }
    }
  }, [curriculumState.curriculums, selectedDays]); // Só dispara se houver mudança

  useEffect(() => {
    // Verifica se houve uma mudança real em selectedDays ou curriculumToChangeId
    if (curriculumToChangeId) {
      // Verifica se selectedDays mudou
      const isSelectedDaysChanged =
        JSON.stringify(selectedDays) !==
        JSON.stringify(prevSelectedDays.current);

      if (isSelectedDaysChanged) {
        setCurriculumState((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            curriculums: prev.curriculums.map((curriculum) => {
              const actualDate = curriculum.date
                ? curriculum.date.toDate()
                : new Date("");
              const isAvailable = selectedDays.includes(actualDate.getDay());
              // Atualiza o curriculum somente se a mudança for relevante
              return curriculum.id === curriculumToChangeId
                ? {
                    ...curriculum,
                    indexDays: selectedDays.sort((a, b) => a - b),
                    date: isAvailable ? curriculum.date : null,
                  }
                : curriculum;
            }),
          };
        });

        // Após a mudança, atualiza a referência do selectedDays para o valor atual
        prevSelectedDays.current = selectedDays;
      }
    }
  }, [curriculumToChangeId, selectedDays]); // O useEffect depende de curriculumToChangeId e selectedDays

  const TableHeader = () => (
    <thead>
      <tr className="text-center bg-gray-100 dark:bg-gray-700">
        <th className="w-1/3 px-4 py-2 font-semibold">Escola</th>
        <th className="w-1/3 px-4 py-2 font-semibold">Modalidade</th>
        <th className="w-1/3 px-4 py-2 font-semibold">Professor</th>
        {!onlyView && <th className="w-1/3 px-4 py-2 font-semibold">Opções</th>}
      </tr>
    </thead>
  );

  interface TableBodyProps {
    curriculums: CurriculumWithNamesProps[];
    isExperimental?: boolean;
    isWaiting?: boolean;
  }

  function findInRemoved(curriculumId: string) {
    return removedCurriculums.find(
      (curriculum) => curriculum.id === curriculumId
    );
  }

  // Usar um Set ou array para armazenar múltiplos IDs de currículos em edição
  const [editingCurriculums, setEditingCurriculums] = useState<Set<string>>(
    new Set()
  );
  const TableBody = ({
    curriculums,
    isExperimental = false,
    isWaiting = false,
  }: TableBodyProps) => {
    // Função para alternar o estado de edição de um currículo
    const toggleEdit = (curriculumId: string) => {
      setEditingCurriculums((prev) => {
        const newEditingCurriculums = new Set(prev);
        if (newEditingCurriculums.has(curriculumId)) {
          newEditingCurriculums.delete(curriculumId); // Remove da edição
        } else {
          newEditingCurriculums.add(curriculumId); // Adiciona à edição
        }
        return newEditingCurriculums;
      });
    };

    return (
      <>
        {curriculums.map((details) => {
          // Verificar se o currículo está sendo editado
          const isEditing = editingCurriculums.has(details.id);
          const isRemoved = findInRemoved(details.id);
          return (
            <Fragment key={details.id}>
              <tr className={`${findInRemoved(details.id) && "bg-red-500/20"}`}>
                <td className="px-4 py-2">
                  <span className="text-red-600 dark:text-klOrange-500 font-semibold">
                    {details.schoolName}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-red-600 dark:text-klOrange-500 font-semibold">
                    {details.schoolCourseName}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-red-600 dark:text-klOrange-500 font-semibold">
                    {details.teacherName}
                  </span>
                </td>
                {!onlyView && (
                  <td className="px-4 py-2">
                    {/* Passar o estado de edição para o DropdownMenu */}
                    <DropdownMenu
                      curriculumId={details.id}
                      onEdit={toggleEdit} // Passa a função de alternar o estado
                      isEditing={isEditing} // Passa o valor booleano de se está editando ou não
                      onDel={toggleExistentCurriculum}
                      toDelete={isRemoved ? true : false}
                    />
                  </td>
                )}
              </tr>

              {/* Mostrar o componente de edição apenas se estiver sendo editado */}
              {isEditing && !isRemoved && (
                <tr>
                  <td colSpan={4} className="px-4 py-2">
                    <CurriculumRegistration
                      curriculumDays={details.classDayIndexDays}
                      curriculumDetails={details}
                      selectedCurriculum={getOneCurriculum(details.id)}
                      selectedDays={selectedDays}
                      setSelectedDays={setSelectedDays}
                      studentFreeDays={studentFreeDays}
                      studentId={studentId}
                      handleCurriculumRegistrationChanges={
                        handleCurriculumRegistrationChanges
                      }
                    />
                  </td>
                </tr>
              )}

              {/* Caso o currículo tenha sido removido */}
              {findInRemoved(details.id) && (
                <tr>
                  <td colSpan={4} className="px-4 pb-2 text-xs bg-red-500/20">
                    {isExperimental
                      ? "Aula Experimental acima está selecionada para remoção"
                      : isWaiting
                      ? "Aula em Fila de Espera acima está selecionada para remoção"
                      : "Matrícula acima está selecionada para remoção"}
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-2">
      {(() => {
        const filteredCurriculumState = curriculumState.curriculums.filter(
          (detail) =>
            !newAddCurriculums.some(
              (newCurriculum) => newCurriculum.id === detail.id
            )
        );

        const regularCurriculums = getRegularCurriculums(
          filteredCurriculumState
        );

        const formattedRegularCurriculums = regularCurriculums.map(
          (curriculum) => {
            return handleOneCurriculumDetails(curriculum.id);
          }
        );

        const experimentalCurriculums = getExperimentalCurriculums(
          filteredCurriculumState
        );

        const formattedExperimentalCurriculums = experimentalCurriculums.map(
          (curriculum) => {
            return handleOneCurriculumDetails(curriculum.id);
          }
        );

        const waitingCurriculums = getWaitingCurriculums(
          filteredCurriculumState
        );

        const formattedWaitingCurriculums = waitingCurriculums.map(
          (curriculum) => {
            return handleOneCurriculumDetails(curriculum.id);
          }
        );

        return (
          <>
            {/* Exibindo as "Aulas Experimentais" */}
            {formattedExperimentalCurriculums.length > 0 && (
              <>
                <div className="text-lg font-semibold text-klGreen-600 dark:text-gray-100 mb-2">
                  {formattedExperimentalCurriculums.length === 1
                    ? "Aula Experimental"
                    : "Aulas Experimentais"}
                </div>
                <table className="min-w-full table-auto text-sm text-klGreen-500 dark:text-gray-100">
                  <TableHeader />
                  <tbody>
                    <TableBody
                      curriculums={formattedExperimentalCurriculums}
                      isExperimental
                    />
                  </tbody>
                </table>
              </>
            )}

            {/* Exibindo as "Aulas Matriculadas" */}
            {formattedRegularCurriculums.length > 0 && (
              <>
                <div className="text-lg font-semibold text-klGreen-600 dark:text-gray-100 py-4">
                  {formattedRegularCurriculums.length === 1
                    ? "Aula Matriculada"
                    : "Aulas Matriculadas"}
                </div>
                <table className="min-w-full table-auto text-sm text-klGreen-500 dark:text-gray-100">
                  <TableHeader />
                  <tbody>
                    <TableBody curriculums={formattedRegularCurriculums} />
                  </tbody>
                </table>
              </>
            )}

            {/* Exibindo as "Aulas em Fila de Espera" */}
            {formattedWaitingCurriculums.length > 0 && (
              <>
                <div className="text-lg font-semibold text-klGreen-600 dark:text-gray-100 py-4">
                  {formattedWaitingCurriculums.length === 1
                    ? "Aula em Fila de Espera"
                    : "Aulas em Fila de Espera"}
                </div>
                <table className="min-w-full table-auto text-sm text-klGreen-500 dark:text-gray-100">
                  <TableHeader />
                  <tbody>
                    <TableBody
                      curriculums={formattedWaitingCurriculums}
                      isWaiting
                    />
                  </tbody>
                </table>
              </>
            )}
          </>
        );
      })()}
    </div>
  );
}
