/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import {
  ClassDaySearchProps,
  CurriculumSearchProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  StudentSearchProps,
  SystemConstantsSearchProps,
  TeacherSearchProps,
  UserFullDataProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  CreateLogsState,
  DeleteLogsState,
  UpdateLogsState,
} from "../../pages/LogsDashboard";

interface LogsTableProps {
  createLogs: CreateLogsState[];
  updateLogs: UpdateLogsState[];
  deleteLogs: DeleteLogsState[];
}

const LogsTable = ({ createLogs, updateLogs, deleteLogs }: LogsTableProps) => {
  // GET GLOBAL DATA
  const {
    appUsersDb,
    schoolsDb,
    classDaysDb,
    curriculumDb,
    schedulesDb,
    schoolClassesDb,
    schoolCoursesDb,
    studentsDb,
    systemConstantsDb,
    teachersDb,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // Estado para armazenar o log selecionado
  const [selectedLogType, setSelectedLogType] = useState<
    "create" | "update" | "delete"
  >("create");

  // Função para alternar entre os tipos de logs
  const handleTabClick = (logType: "create" | "update" | "delete") => {
    setSelectedLogType(logType);
  };

  const [selectedLogs, setSelectedLogs] = useState<any[]>([]);

  useEffect(() => {
    if (selectedLogType === "create") {
      setSelectedLogs(createLogs);
    } else if (selectedLogType === "update") {
      setSelectedLogs(updateLogs);
    } else {
      setSelectedLogs(deleteLogs);
    }
  }, [createLogs, deleteLogs, selectedLogType, updateLogs]);

  // Definindo o objeto de mapeamento com as substituições
  const translationMap: { [key: string]: string } = {
    appUsers: "Usuários",
    classDays: "Dias de Aula",
    curriculum: "Turmas",
    schedules: "Horários",
    schoolClasses: "Anos Escolares",
    schoolCourses: "Modalidades",
    schools: "Escolas",
    students: "Alunos",
    systemConstants: "Variáveis do Sistema",
    teachers: "Professores",
  };

  // Função para substituir a chave pela tradução correspondente
  const translateTables = (key: string): string => {
    return translationMap[key] || key; // Se a chave não existir, retorna a chave original
  };

  // Mapeamento de tipos com os dados de exemplo
  const dataMap = {
    appUsers: appUsersDb as UserFullDataProps[],
    classDays: classDaysDb as ClassDaySearchProps[],
    curriculum: curriculumDb as CurriculumSearchProps[],
    schedules: schedulesDb as ScheduleSearchProps[],
    schoolClasses: schoolClassesDb as SchoolClassSearchProps[],
    schoolCourses: schoolCoursesDb as SchoolCourseSearchProps[],
    schools: schoolsDb as SchoolSearchProps[],
    students: studentsDb as StudentSearchProps[],
    systemConstants: systemConstantsDb as SystemConstantsSearchProps[],
    teachers: teachersDb as TeacherSearchProps[],
  };

  // Função `handleDetails` com tipagem condicional e narrowing
  function handleDetails<T extends keyof typeof dataMap>({
    id,
    type,
  }: {
    id: string;
    type: T;
  }): (typeof dataMap)[T][0] | null {
    // Pegamos o array correspondente ao tipo
    const data = dataMap[type];
    // Encontramos o item com o id correspondente
    const result = data.find((item) => item.id === id);
    return result ?? null; // Retorna o item encontrado ou null
  }

  function compareLogs(
    before: unknown[],
    after: unknown[]
  ): { id: string; field: string; before: string; after: string }[] {
    const changes: {
      id: string;
      field: string;
      before: string;
      after: string;
    }[] = [];

    before.forEach((beforeItem: any) => {
      const afterItem = after.find((item: any) => item.id === beforeItem.id);

      if (afterItem) {
        // Itera sobre as propriedades de 'beforeItem' e 'afterItem'
        Object.keys(beforeItem).forEach((key: string) => {
          const beforeValue = beforeItem[key as keyof typeof beforeItem];
          const afterValue = afterItem[key as keyof typeof afterItem];

          if (Array.isArray(beforeValue) && Array.isArray(afterValue)) {
            // Compara arrays (neste caso, 'presenceList')
            beforeValue.forEach((beforeSubItem: any, index: number) => {
              const afterSubItem = afterValue[index];
              if (
                JSON.stringify(beforeSubItem) !== JSON.stringify(afterSubItem)
              ) {
                changes.push({
                  id: beforeItem.id,
                  field: key,
                  before: JSON.stringify(beforeSubItem),
                  after: JSON.stringify(afterSubItem),
                });
              }
            });
          } else if (beforeValue !== afterValue) {
            // Se o valor de uma propriedade for diferente
            changes.push({
              id: beforeItem.id,
              field: key,
              before: JSON.stringify(beforeValue),
              after: JSON.stringify(afterValue),
            });
          }
        });
      }
    });

    return changes;
  }
  type Change = {
    id: string;
    field: string;
    before: string;
    after: string;
  };

  interface TableProps {
    changes: Change[];
    type:
      | "appUsers"
      | "classDays"
      | "curriculum"
      | "schedules"
      | "schoolClasses"
      | "schoolCourses"
      | "schools"
      | "students"
      | "systemConstants"
      | "teachers";
  }

  const generateTable = ({ changes }: TableProps): JSX.Element => {
    // Coletando os IDs únicos para a tabela
    const ids = [...new Set(changes.map((change) => change.id))];

    // Criando as linhas para a tabela
    const fields = [...new Set(changes.map((change) => change.field))];
    const beforeRow = fields.map(
      (field) => changes.find((change) => change.field === field)?.before || ""
    );
    const afterRow = fields.map(
      (field) => changes.find((change) => change.field === field)?.after || ""
    );

    function extractId(inputString: string) {
      const regex = /"id":\s*"([a-f0-9-]{36})"/; // Regex para capturar o id (formato UUID)
      const match = inputString.match(regex);

      if (match && match[1]) {
        return match[1]; // Retorna o id extraído
      }

      return null; // Caso não encontre o id
    }

    function replaceIdInString(inputString: string, newId: string) {
      const regex = /("id":\s*")[a-f0-9-]{36}(")/; // Regex para capturar o ID atual

      // Substitui o ID encontrado pelo novo ID (que você obteve do banco de dados)
      return inputString.replace(regex, `$1${newId}$2`);
    }

    function replaceTableString(
      inputString: string,
      type:
        | "appUsers"
        | "classDays"
        | "curriculum"
        | "schedules"
        | "schoolClasses"
        | "schoolCourses"
        | "schools"
        | "students"
        | "systemConstants"
        | "teachers"
    ) {
      const idFromString = extractId(inputString);
      if (!idFromString) return inputString;
      const data = handleDetails({ id: idFromString, type: type });
      if (!data) return inputString;
      return replaceIdInString(inputString, data.id);
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <tbody>
            {ids.map((id) => (
              <tr key={id}>
                {/* <td className="px-4 py-2 text-sm text-gray-600">{id}</td> */}
                {fields.map((field, index) => {
                  const before = beforeRow[index];
                  const after = afterRow[index];
                  return (
                    <td key={field} className="py-2 text-sm">
                      <div className="text-red-500">
                        {replaceTableString(before, "students")}
                      </div>
                      <div>{replaceTableString(after, "students")}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Menu lateral */}
      <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-4">
        <div className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Logs
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className={`p-2 rounded-md text-left ${
              selectedLogType === "create"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
            onClick={() => handleTabClick("create")}
          >
            Criação
          </button>
          <button
            className={`p-2 rounded-md text-left ${
              selectedLogType === "update"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
            onClick={() => handleTabClick("update")}
          >
            Atualização
          </button>
          <button
            className={`p-2 rounded-md text-left ${
              selectedLogType === "delete"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
            onClick={() => handleTabClick("delete")}
          >
            Exclusão
          </button>
        </div>
      </div>

      {/* Tabela de logs */}
      <div className="w-3/4 p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2">Tabela</th>
              <th className="p-2">Registro</th>
              <th className="p-2">Alterado por</th>
              <th className="p-2">Mudanças</th>
              <th className="p-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {selectedLogs &&
              selectedLogs
                .filter((log) => log.changedBy !== "desconhecido")
                .map((log) => (
                  <tr key={uuidv4()} className="border-b uppercase">
                    <td className="p-2">{translateTables(log.entity)}</td>
                    <td className="p-2">{handleDetails({id: log.entityId, type: log.entity}).publicId}</td>
                    <td className="p-2">
                      {
                        handleDetails({ id: log.changedBy, type: "appUsers" })
                          ?.name
                      }
                    </td>
                    <td className="p-2">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <div key={field}>
                          <strong>{field}:</strong>{" "}
                          {typeof (
                            change as { before: unknown; after: unknown }
                          ).before === "object" &&
                            generateTable({
                              changes: compareLogs(
                                (
                                  change as {
                                    before: unknown[];
                                    after: unknown[];
                                  }
                                ).before,
                                (
                                  change as {
                                    before: unknown[];
                                    after: unknown[];
                                  }
                                ).after
                              ),
                              type: log.entity,
                            })}
                          {typeof (
                            change as { before: unknown; after: unknown }
                          ).before === "string" &&
                            String(
                              (change as { before: unknown; after: unknown })
                                .before
                            )}
                          {typeof (
                            change as { before: unknown; after: unknown }
                          ).after === "string" &&
                            ` 
                          → ${String(
                            (change as { before: unknown; after: unknown })
                              .after
                          )}`}
                        </div>
                      ))}
                    </td>
                    <td className="p-2">
                      {new Date(log.timestamp?.seconds * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;
