/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import { collection, getFirestore, Timestamp } from "firebase/firestore";
import { app } from "../../db/Firebase";
import {
  ClassDaySearchProps,
  CurriculumAttendanceProps,
  CurriculumSearchProps,
  ScheduleSearchProps,
  SchoolClassSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  TeacherSearchProps,
  UserFullDataProps,
} from "../../@types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { classDayIndex } from "../../custom";

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
  changes: Changes<CurriculumAttendanceProps>; // A tipagem de changes será dinâmica
}
// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

interface CurriculumLogsProps {
  curriculumId: string;
  onClose: () => void; // Função para fechar o modal
}

export default function CurriculumLogs({
  curriculumId,
  onClose,
}: CurriculumLogsProps) {
  // GET GLOBAL DATA
  const {
    appUsersDb,
    schoolsDb,
    classDaysDb,
    curriculumDb,
    schedulesDb,
    schoolClassesDb,
    schoolCoursesDb,
    // studentsDb,
    // systemConstantsDb,
    teachersDb,
    handleOneCurriculumDetails,
    handleOneStudentDetails,
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
      setFilterSchoolLogs(logs.filter((log) => log.entityId === curriculumId));
    }
  }, [logsDb, logsDbLoading, logsDbError, curriculumId]);

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
    classDays: classDaysDb as ClassDaySearchProps[],
    curriculum: curriculumDb as CurriculumSearchProps[],
    schedules: schedulesDb as ScheduleSearchProps[],
    schoolClasses: schoolClassesDb as SchoolClassSearchProps[],
    schoolCourses: schoolCoursesDb as SchoolCourseSearchProps[],
    schools: schoolsDb as SchoolSearchProps[],
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
    const details = handleDetails({ id: log.entityId, type: "curriculum" });
    if (
      !schoolClassesDb ||
      !classDaysDb ||
      !curriculumDb ||
      !schedulesDb ||
      !teachersDb ||
      !details ||
      !schoolsDb ||
      !schoolCoursesDb
    )
      return null;

    function handleSchoolClassNames(schoolClassIds: string[]) {
      const schoolClassNames: string[] = [];
      const schoolClassDatabase = classDaysDb as SchoolClassSearchProps[];
      schoolClassDatabase.map((schoolClass) => {
        if (schoolClassIds.includes(schoolClass.id)) {
          schoolClassNames.push(schoolClass.name);
        }
      });
      return schoolClassNames;
    }
    function handleClassDayData(classDayId: string) {
      let classDayData: {
        classDayNames: string[];
        classDayIndexDays: number[];
      } = {
        classDayNames: [],
        classDayIndexDays: [],
      };
      const classDayDatabase = classDaysDb as ClassDaySearchProps[];
      classDayDatabase.map((classDay) => {
        if (classDay.id === classDayId) {
          classDayData = {
            classDayNames: classDay.indexNames,
            classDayIndexDays: classDay.indexDays,
          };
        }
      });
      return classDayData;
    }
    function handleScheduleName(scheduleId: string) {
      let scheduleName = "";
      const scheduleDatabase = schedulesDb as ScheduleSearchProps[];
      scheduleDatabase.map((schedule) => {
        if (schedule.id === scheduleId) {
          scheduleName = schedule.name;
        }
      });
      return scheduleName;
    }
    function handleTeacherName(teacherId: string) {
      let teacherName = "";
      const teacherDatabase = teachersDb as TeacherSearchProps[];
      teacherDatabase.map((teacher) => {
        if (teacher.id === teacherId) {
          teacherName = teacher.name;
        }
      });
      return teacherName;
    }
    function handleSchoolName(schoolId: string) {
      let schoolName = "";
      const schoolDatabase = schoolsDb as SchoolSearchProps[];
      schoolDatabase.map((school) => {
        if (school.id === schoolId) {
          schoolName = school.name;
        }
      });
      return schoolName;
    }
    function handleSchoolCourseName(schoolCourseId: string) {
      let schoolCourseName = "";
      const schoolCourseDatabase = schoolCoursesDb as SchoolCourseSearchProps[];
      schoolCourseDatabase.map((schoolCourse) => {
        if (schoolCourse.id === schoolCourseId) {
          schoolCourseName = schoolCourse.name;
        }
      });
      return schoolCourseName;
    }

    // Função para converter índices nos nomes dos dias da semana
    function getDaysNames(indexArray: number[]) {
      return indexArray
        .map((index) => classDayIndex.find((day) => day.id === index)?.name) // encontra o nome pelo index
        .filter((name) => name) // filtra caso algum index não seja válido
        .join(", "); // junta os nomes com vírgula
    }

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
              <td className="py-2 font-bold" colSpan={2}>
                {
                  handleDetails({
                    id: curriculumId,
                    type: "curriculum",
                  })?.publicId
                }{" "}
                - {handleSchoolName(details.schoolId)} -{" "}
                {handleSchoolClassNames(details.schoolClassIds).join(" - ")} -{" "}
                {handleSchoolCourseName(details.schoolCourseId)} -{" "}
                {handleTeacherName(details.teacherId)}
              </td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Número máximo de alunos:</td>
              <td className="py-2">
                {
                  handleDetails({ id: log.entityId, type: "curriculum" })
                    ?.placesAvailable
                }
              </td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Horário:</td>
              <td className="py-2">{handleScheduleName(details.scheduleId)}</td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Professor:</td>
              <td className="py-2">{handleTeacherName(details.teacherId)}</td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Anos Escolares:</td>
              <td className="py-2">
                {handleSchoolClassNames(details.schoolClassIds).join(", ")}
              </td>
            </tr>
            <tr className="flex gap-2">
              <td className="py-2 font-bold">Dias de Aula:</td>
              <td className="py-2">
                {handleClassDayData(details.classDayId).classDayNames.join(
                  ", "
                )}
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
            {/* Verificando se a propriedade placesAvailable existe dentro de changes */}
            {log.changes.placesAvailable && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Número máximo de alunos
                  </td>
                </tr>
                {log.changes.placesAvailable.before &&
                  log.changes.placesAvailable.after && (
                    <tr className="flex gap-2 border-b border-klGreen-500">
                      <td className="py-2">Anterior:</td>
                      <td className="py-2 text-red-500">
                        {log.changes.placesAvailable.before}
                      </td>

                      <td className="py-2">Atualizado:</td>
                      <td className="py-2 text-green-600">
                        {log.changes.placesAvailable.after}
                      </td>
                    </tr>
                  )}
              </>
            )}

            {/* Verificando se a propriedade scheduleId existe dentro de changes */}
            {log.changes.scheduleId && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Horário
                  </td>
                </tr>
                {log.changes.scheduleId.before &&
                  log.changes.scheduleId.after && (
                    <tr className="flex gap-2 border-b border-klGreen-500">
                      <td className="py-2">Anterior:</td>
                      <td className="py-2 text-red-500">
                        {log.changes.scheduleId.before}
                      </td>

                      <td className="py-2">Atualizado:</td>
                      <td className="py-2 text-green-600">
                        {log.changes.scheduleId.after}
                      </td>
                    </tr>
                  )}
              </>
            )}

            {/* Verificando se a propriedade schoolClassIds existe dentro de changes */}
            {log.changes.schoolClassIds && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Anos Escolares
                  </td>
                </tr>
                {log.changes.schoolClassIds.before &&
                  log.changes.schoolClassIds.after && (
                    <tr className="flex gap-2 border-b border-klGreen-500">
                      <td className="py-2">Anterior:</td>
                      <td className="py-2 text-red-500">
                        {log.changes.schoolClassIds.before}
                      </td>

                      <td className="py-2">Atualizado</td>
                      <td className="py-2 text-green-600">
                        {log.changes.schoolClassIds.after}
                      </td>
                    </tr>
                  )}
              </>
            )}

            {/* Verificando se a propriedade classDayId existe dentro de changes */}
            {log.changes.classDayId && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Dias de Aula
                  </td>
                </tr>
                {log.changes.classDayId.before &&
                  log.changes.classDayId.after && (
                    <tr className="flex gap-2 border-b border-klGreen-500">
                      <td className="py-2">Anterior:</td>
                      <td className="py-2 text-red-500">
                        {log.changes.classDayId.before}
                      </td>

                      <td className="py-2">Atualizado:</td>
                      <td className="py-2 text-green-600">
                        {log.changes.classDayId.after}
                      </td>
                    </tr>
                  )}
              </>
            )}
            {/* Verificando se a propriedade teacherId existe dentro de changes */}
            {log.changes.teacherId && (
              <>
                <tr className="flex gap-2">
                  <td className="py-2 font-bold" colSpan={2}>
                    Professor
                  </td>
                </tr>
                {log.changes.teacherId.before &&
                  log.changes.teacherId.after && (
                    <tr className="flex gap-2 border-b border-klGreen-500">
                      <td className="py-2">Anterior:</td>
                      <td className="py-2 text-red-500">
                        {log.changes.teacherId.before}
                      </td>

                      <td className="py-2">Atualizado:</td>
                      <td className="py-2 text-green-600">
                        {log.changes.teacherId.after}
                      </td>
                    </tr>
                  )}
              </>
            )}
            {/* Verificando se a propriedade classCalls existe dentro de changes */}
            {log.changes.classCalls &&
              log.changes.classCalls.before &&
              log.changes.classCalls.after &&
              log.changes.classCalls.before.map((classCall, index) => (
                <>
                  <tr className="w-full">
                    <td colSpan={2} className="py-2 text-left font-bold">
                      Chamada dia {classCall.id}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="py-2 pr-2 text-left">Anterior</th>
                            <th className="py-2 pl-2 text-left">Atualizado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-klGreen-500">
                            <td className="py-2 pr-2 text-red-500">
                              {log.changes.classCalls.before[
                                index
                              ].presenceList.map((call) => (
                                <p key={call.id}>
                                  {handleOneStudentDetails(call.id)?.name}:{" "}
                                  {call.presence ? "Presente" : "Ausente"}
                                </p>
                              ))}
                            </td>

                            <td className="py-2 pl-2 text-green-600">
                              {log.changes.classCalls.after[
                                index
                              ].presenceList.map((call) => (
                                <p key={call.id}>
                                  {handleOneStudentDetails(call.id)?.name}:{" "}
                                  {call.presence ? "Presente" : "Ausente"}
                                </p>
                              ))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </>
              ))}
            {/* Verificando se a propriedade students existe dentro de changes */}
            {log.changes.students &&
              log.changes.students.before &&
              log.changes.students.after &&
              log.changes.students.before.length >= 0 &&
              log.changes.students.before.map((beforeItem, index) => {
                // Garantir que caso o índice não exista em 'after', seja atribuído 'null'
                const afterItem = log.changes.students.after[index] || null;

                return (
                  <>
                    <tr className="w-full">
                      <td colSpan={2} className="py-2 text-left font-bold">
                        Alunos
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="py-2 pr-2 text-left">Anterior</th>
                              <th className="py-2 pl-2 text-left">
                                Atualizado
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Exibindo os detalhes do 'before' */}
                            <tr className="w-full">
                              <td
                                colSpan={2}
                                className="py-2 text-left font-bold"
                              >
                                Nome:{" "}
                                {handleOneStudentDetails(beforeItem?.id)
                                  ?.name || "Não disponível"}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="py-2 text-left">
                                        Atributo
                                      </th>
                                      <th className="py-2 text-left">Valor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Data</td>
                                      <td className="py-2">
                                        {beforeItem?.date
                                          ?.toDate()
                                          .toLocaleString() || "Não disponível"}
                                      </td>
                                    </tr>
                                    {!beforeItem?.isExperimental &&
                                      !beforeItem?.isWaiting && (
                                        <tr className="border-b border-klGreen-500">
                                          <td className="py-2">Dias de Aula</td>
                                          <td className="py-2">
                                            {beforeItem
                                              ? getDaysNames(
                                                  beforeItem.indexDays
                                                )
                                              : "Não disponível"}
                                          </td>
                                        </tr>
                                      )}
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Experimental?</td>
                                      <td className="py-2">
                                        {beforeItem?.isExperimental
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Fila de Espera?</td>
                                      <td className="py-2">
                                        {beforeItem?.isWaiting
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            {/* Exibindo os detalhes do 'after' */}
                            <tr className="w-full">
                              <td
                                colSpan={2}
                                className="py-2 text-left font-bold"
                              >
                                Nome:{" "}
                                {handleOneStudentDetails(afterItem?.id)?.name ||
                                  "Não disponível"}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2}>
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="py-2 text-left">
                                        Atributo
                                      </th>
                                      <th className="py-2 text-left">Valor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Data</td>
                                      <td className="py-2">
                                        {afterItem?.date
                                          ?.toDate()
                                          .toLocaleString() || "Não disponível"}
                                      </td>
                                    </tr>
                                    {!afterItem?.isExperimental &&
                                      !afterItem?.isWaiting && (
                                        <tr className="border-b border-klGreen-500">
                                          <td className="py-2">Dias de Aula</td>
                                          <td className="py-2">
                                            {afterItem
                                              ? getDaysNames(
                                                  afterItem.indexDays
                                                )
                                              : "Não disponível"}
                                          </td>
                                        </tr>
                                      )}
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Experimental?</td>
                                      <td className="py-2">
                                        {afterItem?.isExperimental
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Fila de Espera?</td>
                                      <td className="py-2">
                                        {afterItem?.isWaiting
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </>
                );
              })}
            {/* {log.changes.students &&
              log.changes.students.before &&
              log.changes.students.after &&
              log.changes.students.after
                .sort((a, b) => {
                  if (a.date && b.date) {
                    return a.date?.toMillis() - b.date?.toMillis();
                  } else if (!a.date && !b.date) {
                    return 0;
                  } else {
                    return a.date ? -1 : 1; // Coloca os itens sem data no final
                  }
                })
                .map((_, index) => (
                  <>
                    <tr className="w-full">
                      <td colSpan={2} className="py-2 text-left font-bold">
                        Alunos
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="py-2 pr-2 text-left">Anterior</th>
                              <th className="py-2 pl-2 text-left">
                                Atualizado
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="w-full">
                              <td
                                colSpan={2}
                                className="py-2 text-left font-bold"
                              >
                                Nome:{" "}
                                {
                                  handleOneStudentDetails(
                                    log.changes.students.before[index].id
                                  )?.name
                                }
                              </td>
                            </tr>

                            <tr>
                              <td colSpan={2}>
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="py-2 text-left">
                                        Atributo
                                      </th>
                                      <th className="py-2 text-left">Valor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Data</td>
                                      <td className="py-2">
                                        {log.changes.students.before[index].date
                                          ?.toDate()
                                          .toLocaleString()}
                                      </td>
                                    </tr>
                                    {!log.changes.students.before[index]
                                      .isExperimental &&
                                    !log.changes.students.before[index]
                                      .isWaiting ? (
                                      <tr className="border-b border-klGreen-500">
                                        <td className="py-2">Dias de Aula</td>
                                        <td className="py-2">
                                          {getDaysNames(
                                            log.changes.students.before[index]
                                              .indexDays
                                          )}
                                        </td>
                                      </tr>
                                    ) : null}
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Experimental?</td>
                                      <td className="py-2">
                                        {log.changes.students.before[index]
                                          .isExperimental
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Fila de Espera?</td>
                                      <td className="py-2">
                                        {log.changes.students.before[index]
                                          .isWaiting
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan={2}
                                className="py-2 text-left font-bold"
                              >
                                Nome:{" "}
                                {
                                  handleOneStudentDetails(
                                    log.changes.students.after[index].id
                                  )?.name
                                }
                              </td>
                            </tr>

                            <tr>
                              <td colSpan={2}>
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="py-2 text-left">
                                        Atributo
                                      </th>
                                      <th className="py-2 text-left">Valor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Data</td>
                                      <td className="py-2">
                                        {log.changes.students.after[index].date
                                          ?.toDate()
                                          .toLocaleString()}
                                      </td>
                                    </tr>
                                    {!log.changes.students.after[index]
                                      .isExperimental &&
                                    !log.changes.students.after[index]
                                      .isWaiting ? (
                                      <tr className="border-b border-klGreen-500">
                                        <td className="py-2">Dias de Aula</td>
                                        <td className="py-2">
                                          {getDaysNames(
                                            log.changes.students.after[index]
                                              .indexDays
                                          )}
                                        </td>
                                      </tr>
                                    ) : null}
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Experimental?</td>
                                      <td className="py-2">
                                        {log.changes.students.after[index]
                                          .isExperimental
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                    <tr className="border-b border-klGreen-500">
                                      <td className="py-2">Fila de Espera?</td>
                                      <td className="py-2">
                                        {log.changes.students.after[index]
                                          .isWaiting
                                          ? "Sim"
                                          : "Não"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </>
                ))} */}
            {/* <tr className="border-b border-klGreen-500">
                  <td className="py-2 pr-2 text-red-500">
                    <p>
                      Nome:{" "}
                      {
                        handleOneStudentDetails(
                          log.changes.students.before[index].id
                        )?.name
                      }
                    </p>
                    <p>
                      Data:{" "}
                      {log.changes.students.before[index].date
                        ?.toDate()
                        .toLocaleString()}
                    </p>
                    {!log.changes.students.before[index]
                      .isExperimental &&
                      !log.changes.students.before[index]
                        .isWaiting && (
                        <p>
                          Dias de Aula:{" "}
                          {getDaysNames(
                            log.changes.students.before[index]
                              .indexDays
                          )}
                        </p>
                      )}
                    <p>
                      Experimental?{" "}
                      {log.changes.students.before[index]
                        .isExperimental
                        ? "Sim"
                        : "Não"}
                    </p>
                    <p>
                      Fila de Espera?{" "}
                      {log.changes.students.before[index].isWaiting
                        ? "Sim"
                        : "Não"}
                    </p>
                  </td>

                  <td className="py-2 pr-2 text-red-500">
                    <p>
                      Nome:{" "}
                      {
                        handleOneStudentDetails(
                          log.changes.students.after[index].id
                        )?.name
                      }
                    </p>
                    <p>
                      Data:{" "}
                      {log.changes.students.after[index].date
                        ?.toDate()
                        .toLocaleString()}
                    </p>
                    {!log.changes.students.after[index]
                      .isExperimental &&
                      !log.changes.students.after[index]
                        .isWaiting && (
                        <p>
                          Dias de Aula:{" "}
                          {getDaysNames(
                            log.changes.students.after[index]
                              .indexDays
                          )}
                        </p>
                      )}
                    <p>
                      Experimental?{" "}
                      {log.changes.students.after[index]
                        .isExperimental
                        ? "Sim"
                        : "Não"}
                    </p>
                    <p>
                      Fila de Espera?{" "}
                      {log.changes.students.after[index].isWaiting
                        ? "Sim"
                        : "Não"}
                    </p>
                  </td>
                </tr> */}
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
              Logs Turma -{" "}
              <span className="uppercase">
                {
                  handleDetails({
                    id: curriculumId,
                    type: "curriculum",
                  })?.publicId
                }{" "}
                - {handleOneCurriculumDetails(curriculumId).schoolName} -{" "}
                {handleOneCurriculumDetails(curriculumId).schoolClassNames.join(
                  " - "
                )}{" "}
                - {handleOneCurriculumDetails(curriculumId).schoolCourseName} -{" "}
                {handleOneCurriculumDetails(curriculumId).teacherName}
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
