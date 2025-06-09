/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import { collection, getFirestore, Timestamp } from "firebase/firestore";
import { app } from "../../db/Firebase";
import { TeacherSearchProps, UserFullDataProps } from "../../@types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

// Tipo que cria a estrutura 'before' e 'after' automaticamente para cada propriedade
type Changes<T> = {
  [K in keyof T]: {
    before: T[K]; // valor anterior
    after: T[K]; // valor atualizado
  };
};

// Tipagem base para o log
interface LogEntry {
  id: string;
  action: "create" | "update" | "delete";
  entity: string;
  entityId: string;
  changedBy: string;
  timestamp: Timestamp;
  changes: Changes<TeacherSearchProps>; // A tipagem de changes será dinâmica
}
// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface TeacherLogsProps {
  teacherId: string;
  onClose: () => void; // Função para fechar o modal
}

export default function TeacherLogs({ teacherId, onClose }: TeacherLogsProps) {
  // GET GLOBAL DATA
  const {
    appUsersDb,
    // schoolsDb,
    // classDaysDb,
    // curriculumDb,
    // schedulesDb,
    // schoolClassesDb,
    // schoolCoursesDb,
    // studentsDb,
    // systemConstantsDb,
    teachersDb,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // LISTENER SCHOOLS DATA
  const [logsDb, logsDbLoading, logsDbError] = useCollectionData(
    collection(db, "logs")
  );

  const [filterSchoolLogs, setFilterSchoolLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (logsDb && logsDb.length > 0 && !logsDbLoading && !logsDbError) {
      // Logs é um array de DocumentSnapshot ou semelhante
      const logs = logsDb.map((doc) => ({
        ...(doc as LogEntry), // Dados do log
        id: uuidv4(), // Adiciona o ID do documento
      }));
      setFilterSchoolLogs(logs.filter((log) => log.entityId === teacherId));
    }
  }, [logsDb, logsDbLoading, logsDbError, teacherId]);

  function translateActions(action: string) {
    switch (action) {
      case "create":
        return "Criação";
      case "update":
        return "Atualização";
      case "delete":
        return "Exclusão";
      default:
        return action;
    }
  }

  // Mapeamento de tipos com os dados de exemplo
  const dataMap = {
    appUsers: appUsersDb as UserFullDataProps[],
    // classDays: classDaysDb as ClassDaySearchProps[],
    // curriculum: curriculumDb as CurriculumSearchProps[],
    // schedules: schedulesDb as ScheduleSearchProps[],
    // schoolClasses: schoolClassesDb as SchoolClassSearchProps[],
    // schoolCourses: schoolCoursesDb as SchoolCourseSearchProps[],
    // schools: schoolsDb as SchoolSearchProps[],
    // students: studentsDb as StudentSearchProps[],
    // systemConstants: systemConstantsDb as SystemConstantsSearchProps[],
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

  function renderChanges(log: LogEntry) {
    // Verifica a ação do log
    if (log.action === "create" || log.action === "delete") {
      // Para criação ou exclusão, exibe os dados relevantes
      return (
        <table>
          <tbody>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Id Database:</td>
              <td className="py-2">{log.entityId}</td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Nome:</td>
              <td className="py-2">
                {handleDetails({ id: log.entityId, type: "teachers" })?.name}
              </td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">E-mail:</td>
              <td className="py-2">
                {handleDetails({ id: log.entityId, type: "teachers" })?.email}
              </td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Telefone:</td>
              <td className="py-2">
                {handleDetails({ id: log.entityId, type: "teachers" })?.phone}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (log.action === "update") {
      // Para atualização, exibe o nome anterior e o nome atualizado
      return (
        <table>
          <tbody>
            {/* Verificando se a propriedade name existe dentro de changes */}
            {log.changes.name && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Nome
                  </td>
                </tr>
                {log.changes.name.before && log.changes.name.after && (
                  <tr className="flex gap-2 border-b border-klGreen-500">
                    <td className="py-2">Anterior:</td>
                    <td className="py-2 text-red-500">
                      {log.changes.name.before}
                    </td>

                    <td className="py-2">Atualizado:</td>
                    <td className="py-2 text-green-600">
                      {log.changes.name.after}
                    </td>
                  </tr>
                )}
              </>
            )}

            {/* Verificando se a propriedade email existe dentro de changes */}
            {log.changes.email && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    E-mail
                  </td>
                </tr>
                {log.changes.email.before && log.changes.email.after && (
                  <tr className="flex gap-2 border-b border-klGreen-500">
                    <td className="py-2">Anterior:</td>
                    <td className="py-2 text-red-500">
                      {log.changes.email.before}
                    </td>

                    <td className="py-2">Atualizado:</td>
                    <td className="py-2 text-green-600">
                      {log.changes.email.after}
                    </td>
                  </tr>
                )}
              </>
            )}

            {/* Verificando se a propriedade.?.phone existe dentro de changes */}
            {log.changes?.phone && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Telefone
                  </td>
                </tr>
                {log.changes?.phone.before && log.changes?.phone.after && (
                  <tr className="flex gap-2 border-b border-klGreen-500">
                    <td className="py-2">Anterior:</td>
                    <td className="py-2 text-red-500">
                      {log.changes?.phone.before}
                    </td>

                    <td className="py-2">Atualizado</td>
                    <td className="py-2 text-green-600">
                      {log.changes?.phone.after}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      );
    }

    return null; // Retorna null caso não seja criação, atualização ou exclusão
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-3/4 max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-gray-200">
              Logs Professor -{" "}
              <span className="uppercase">
                {
                  handleDetails({
                    id: teacherId,
                    type: "teachers",
                  })?.name
                }
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-klGreen-500 hover:text-klOrange-500 dark:text-klOrange-500 dark:hover:text-gray-100"
            >
              X
            </button>
          </div>

          <div className="flex">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-klGreen-500/60 text-left">
                  <th className="p-2">Data</th>
                  <th className="p-2">Ação</th>
                  <th className="p-2">Mudanças</th>
                  <th className="p-2">Alterado por</th>
                </tr>
              </thead>
              <tbody>
                {filterSchoolLogs &&
                  filterSchoolLogs
                    .filter((log) => log.changedBy !== "desconhecido")
                    .sort((a, b) => {
                      // Primeiro, damos prioridade para os logs de exclusão
                      if (a.action === "delete" && b.action !== "delete")
                        return -1;
                      if (a.action !== "delete" && b.action === "delete")
                        return 1;

                      // Agora, os logs de atualização
                      if (a.action === "update" && b.action !== "update")
                        return -1;
                      if (a.action !== "update" && b.action === "update")
                        return 1;

                      // Se os dois logs forem do tipo "create", colocamos o "create" no final
                      if (a.action === "create" && b.action !== "create")
                        return 1;
                      if (a.action !== "create" && b.action === "create")
                        return -1;

                      // Ordenação por timestamp (decrescente), considerando o timestamp de ambos os logs
                      return b.timestamp.toMillis() - a.timestamp.toMillis();
                    })
                    .map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-klGreen-500 uppercase"
                      >
                        <td className="p-2">
                          {log.timestamp.toDate().toLocaleString()}
                        </td>
                        <td className="p-2">{translateActions(log.action)}</td>
                        <td className="p-2">{renderChanges(log)}</td>
                        <td className="p-2">
                          {
                            handleDetails({
                              id: log.changedBy,
                              type: "appUsers",
                            })?.name
                          }
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
