/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  collection, getFirestore,
  Timestamp
} from "firebase/firestore";
import { app } from "../db/Firebase";
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
} from "../@types";
import LogsTable from "../components/layoutComponents/LogsTable";
import { useCollectionData } from "react-firebase-hooks/firestore";

// Tipagem base para o log
interface LogEntry {
  action: "create" | "update" | "delete";
  entity: string;
  entityId: string;
  changedBy: string;
  timestamp: Timestamp;
  changes: any; // A tipagem de changes será dinâmica
}

// LogEntry com id adicionado
interface LogEntryWithId extends LogEntry {
  id: string;
}

type LogChangesForEntity<T extends string> = T extends "appUsers"
  ? UserFullDataProps
  : T extends "classDays"
  ? ClassDaySearchProps
  : T extends "curriculum"
  ? CurriculumSearchProps
  : T extends "schedules"
  ? ScheduleSearchProps
  : T extends "schoolClasses"
  ? SchoolClassSearchProps
  : T extends "schoolCourses"
  ? SchoolCourseSearchProps
  : T extends "schools"
  ? SchoolSearchProps
  : T extends "students"
  ? StudentSearchProps
  : T extends "systemConstants"
  ? SystemConstantsSearchProps
  : T extends "teachers"
  ? TeacherSearchProps
  : never;

// Tipagem para cada log
interface CreateLog extends LogEntry {
  action: "create";
  changes: LogChangesForEntity<this["entity"]> & { updatedBy: string };
}

interface UpdateLog extends LogEntry {
  action: "update";
  changes: LogChangesForEntity<this["entity"]>;
}

interface DeleteLog extends LogEntry {
  action: "delete";
  changes: LogChangesForEntity<this["entity"]> & { updatedBy: string };
}

// Tipagem para os estados
export type CreateLogsState = CreateLog[];
export type UpdateLogsState = UpdateLog[];
export type DeleteLogsState = DeleteLog[];

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function LogsDashboard() {
  // Estados para logs separados por tipo
  const [createLogs, setCreateLogs] = useState<CreateLogsState[]>([]);
  const [updateLogs, setUpdateLogs] = useState<UpdateLogsState[]>([]);
  const [deleteLogs, setDeleteLogs] = useState<DeleteLogsState[]>([]);

  // LISTENER SCHOOLS DATA
  const [logsDb, logsDbLoading, logsDbError] = useCollectionData(
    collection(db, "logs")
  );

  useEffect(() => {
    const filterLogs = (logs: LogEntryWithId[]) => {
      const createLogsFiltered = logs.filter(
        (log) => log.action === "create"
      ) as unknown as CreateLogsState[];
      setCreateLogs(createLogsFiltered);

      const updateLogsFiltered = logs.filter(
        (log) => log.action === "update"
      ) as unknown as UpdateLogsState[];
      setUpdateLogs(updateLogsFiltered);

      const deleteLogsFiltered = logs.filter(
        (log) => log.action === "delete"
      ) as unknown as DeleteLogsState[];
      setDeleteLogs(deleteLogsFiltered);
    };

    if (logsDb && logsDb.length > 0 && !logsDbLoading && !logsDbError) {
      const logs = logsDb as LogEntryWithId[];
      filterLogs(logs);
    }
  }, [logsDb, logsDbLoading, logsDbError]); // Reexecuta quando os logs são atualizados

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Histórico de Alterações</h1>
      <LogsTable
        createLogs={createLogs}
        updateLogs={updateLogs}
        deleteLogs={deleteLogs}
      />
    </div>
  );
}
