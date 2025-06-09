/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, Fragment, SetStateAction, useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { MdDelete, MdUndo } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { StudentSearchProps } from "../../@types";

interface Props {
  studentFamilyAtSchool: string[];
  removedFamily: string[];
  newAddFamily: string[];
  setRemovedFamily: Dispatch<SetStateAction<string[]>>;
  onlyView: boolean;
}

export default function ShowFamily({
  studentFamilyAtSchool,
  removedFamily,
  newAddFamily,
  setRemovedFamily,
  onlyView,
}: Props) {
  // GET GLOBAL DATA
  const { handleOneStudentDetails, studentsDb } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  function toggleRemovedFamily(id: string) {
    setRemovedFamily((prevRemovedFamily) => {
      // Verifica se o id já existe em removedFamily
      if (prevRemovedFamily.includes(id)) {
        // Se o id já existe, remove ele do array
        return prevRemovedFamily.filter((familyId) => familyId !== id);
      } else {
        // Se o id não existe, adiciona ele ao array
        return [...prevRemovedFamily, id];
      }
    });
  }

  const TableHeader = () => (
    <thead>
      <tr className="text-center bg-gray-100 dark:bg-gray-700">
        <th className="w-4/5 px-4 py-2 font-semibold">Irmão</th>
        {!onlyView && <th className="w-1/5 px-4 py-2 font-semibold">Opções</th>}
      </tr>
    </thead>
  );

  interface TableBodyProps {
    studentFamilyAtSchool: string[];
  }

  function findInRemoved(familyId: string) {
    return removedFamily.find((id) => id === familyId);
  }

  const TableBody = ({ studentFamilyAtSchool }: TableBodyProps) => {
    const filteredFamily = studentFamilyAtSchool.filter(
      (id) => !newAddFamily.includes(id)
    );
    return (
      <>
        {filteredFamily
          .filter((id) => {
            // Verifica se o banco de dados está disponível
            if (!studentsDb) return false;

            const studentData = studentsDb.find(
              (document) => document.id === id
            ) as StudentSearchProps;

            // Verifica se o estudante foi encontrado e se está ativo
            return studentData?.active ?? false;
          })
          .map((id) => {
            // Verificar se o familiar está sendo removido
            const isRemoved = findInRemoved(id);
            // Definir mensagem da tooltip
            let tooltipMessage = "";
            if (isRemoved) {
              tooltipMessage = "Cancelar Exclusão";
            } else {
              tooltipMessage = "Excluir";
            }
            return (
              <Fragment key={id}>
                <tr className={`${isRemoved && "bg-red-500/20"}`}>
                  <td className="px-4 py-2">
                    <span className="text-red-600 dark:text-klOrange-500 font-semibold">
                      {handleOneStudentDetails(id)?.name}
                    </span>
                  </td>
                  {!onlyView && (
                    <td className="px-4 py-2 flex justify-center items-center">
                      {isRemoved ? (
                        <MdUndo
                          onClick={() => toggleRemovedFamily(id)}
                          className="text-green-600 hover:text-green-400 cursor-pointer"
                          size={20}
                          data-tooltip-id={`tooltip-${id}-${isRemoved}`}
                        />
                      ) : (
                        <MdDelete
                          onClick={() => toggleRemovedFamily(id)}
                          className="text-red-600 hover:text-red-400 cursor-pointer"
                          size={20}
                          data-tooltip-id={`tooltip-${id}-${isRemoved}`}
                        />
                      )}
                      <Tooltip
                        id={`tooltip-${id}-${isRemoved}`}
                        content={tooltipMessage}
                      />
                    </td>
                  )}
                </tr>

                {/* Caso o currículo tenha sido removido */}
                {isRemoved && (
                  <tr>
                    <td colSpan={4} className="px-4 pb-2 text-xs bg-red-500/20">
                      Familiar acima está selecionada para remoção
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
      {studentFamilyAtSchool.length > 0 && (
        <>
          <div className="text-lg font-semibold text-klGreen-600 dark:text-gray-100 py-4">
            {studentFamilyAtSchool.length === 1 ? "Familiar" : "Familiares"}
          </div>
          <table className="min-w-full table-auto text-sm text-klGreen-500 dark:text-gray-100">
            <TableHeader />
            <tbody>
              <TableBody studentFamilyAtSchool={studentFamilyAtSchool} />
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
