/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  CurriculumSearchProps,
  SchoolCourseSearchProps,
  SchoolSearchProps,
  CurriculumToAddProps,
  CurriculumStateProps,
  StudentFreeDayProps,
  CurriculumWithNamesProps,
  CurriculumRegistrationChangesProps,
} from "../../@types";
import CurriculumCard from "../layoutComponents/CurriculumCard";
import CurriculumRegistration from "./CurriculumRegistration";
import { Timestamp } from "firebase/firestore";

interface SelectSchoolAndCourseProps {
  studentId: string;
  selectedSchoolClassId: string;
  curriculumState: CurriculumStateProps; // Adicionado para acessar curriculums existentes
  onAdd?: (data: CurriculumToAddProps) => void;
  onDel?: (uniqueId: string) => void;
  studentFreeDays: StudentFreeDayProps[];
  setNewAddCurriculums?: Dispatch<SetStateAction<CurriculumToAddProps[]>>;
}

const SelectSchoolAndCourse: React.FC<SelectSchoolAndCourseProps> = ({
  studentId,
  selectedSchoolClassId,
  curriculumState,
  onAdd,
  onDel,
  studentFreeDays,
  setNewAddCurriculums,
}) => {
  const {
    curriculumDatabaseData,
    schoolDatabaseData,
    schoolCourseDatabaseData,
    classDaysDatabaseData,
    handleOneCurriculumDetails,
    calculatePlacesAvailable,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // const [dateValue, setDateValue] = useState<Value>(null);

  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [curriculumDetails, setCurriculumDetails] =
    useState<CurriculumWithNamesProps>();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [filteredCurriculums, setFilteredCurriculums] = useState<
    CurriculumSearchProps[]
  >([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolSearchProps[]>(
    []
  );
  const [filteredCourses, setFilteredCourses] = useState<
    SchoolCourseSearchProps[]
  >([]);
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CurriculumToAddProps | null>(null);

  const [curriculumDays, setCurriculumDays] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false); // Para controlar a primeira renderização

  // Resetar as opções sempre que o selectedSchoolClassId mudar
  useEffect(() => {
    setSelectedSchoolId(null);
    setSelectedCourseId(null);
    setSelectedCurriculum(null);
    if (selectedSchoolClassId) {
      const filtered = curriculumDatabaseData.filter((curriculum) =>
        curriculum.schoolClassIds.includes(selectedSchoolClassId)
      );
      setFilteredCurriculums(filtered);
    } else {
      setFilteredCurriculums([]);
    }
  }, [selectedSchoolClassId, curriculumDatabaseData]);

  // Resetar a escola e as modalidades sempre que selectedSchoolClassId mudar
  useEffect(() => {
    setSelectedCourseId(null);
    setSelectedCurriculum(null);
    if (selectedSchoolClassId) {
      const schoolIds = [
        ...new Set(filteredCurriculums.map((c) => c.schoolId)),
      ];
      setFilteredSchools(
        schoolDatabaseData.filter((s) => schoolIds.includes(s.id))
      );
    } else {
      setFilteredSchools([]);
    }
  }, [selectedSchoolClassId, filteredCurriculums, schoolDatabaseData]);

  // Resetar o curriculum selecionado e refiltrar as modalidades quando a escola mudar
  useEffect(() => {
    setSelectedCourseId(null);
    setSelectedCurriculum(null);
    setInitialized(false);
    if (selectedSchoolId) {
      const courseIds = [
        ...new Set(
          filteredCurriculums
            .filter((c) => c.schoolId === selectedSchoolId)
            .map((c) => c.schoolCourseId)
        ),
      ];
      setFilteredCourses(
        schoolCourseDatabaseData.filter((course) =>
          courseIds.includes(course.id)
        )
      );
    } else {
      setFilteredCourses([]);
    }
  }, [selectedSchoolId, filteredCurriculums, schoolCourseDatabaseData]);

  // Resetar o curriculum selecionado quando a modalidade mudar
  useEffect(() => {
    setSelectedCurriculum(null);
    setInitialized(false);
  }, [selectedCourseId]);

  const handleSelectCurriculum = async (curriculum: CurriculumSearchProps) => {
    if (selectedCurriculum?.id === curriculum.id) {
      // Se clicarmos no currículo já selecionado, desselecionamos ele
      setSelectedCurriculum(null);

      if (initialized) {
        // Removemos os dias desse currículo do selectedDays
        setSelectedDays((prevDays) =>
          prevDays.filter((day) => !selectedCurriculum?.indexDays.includes(day))
        );
      }

      setCurriculumDays([]); // Reset dos dias de curriculum
    } else {
      // Selecionamos um novo currículo
      setUniqueId(curriculum.id);
      const classIndexDays =
        classDaysDatabaseData.find((day) => day.id === curriculum.classDayId)
          ?.indexDays || [];
      setCurriculumDays(classIndexDays);
      const placesAvailableData = await calculatePlacesAvailable(
        curriculum.id,
        classIndexDays,
        studentId
      );
      if (placesAvailableData) {
        if (placesAvailableData.vacanciesAvailable) {
          setSelectedCurriculum({
            date: null,
            id: curriculum.id,
            isExperimental: true, // Inicialmente como experimental
            isWaiting: false,
            indexDays: [],
          });
        } else {
          setSelectedCurriculum({
            date: Timestamp.now(),
            id: curriculum.id,
            isExperimental: false,
            isWaiting: true, // Se não há vagas, adicionar como lista de espera
            indexDays: [],
          });
        }
      }
    }
  };

  useEffect(() => {
    const newDays = selectedDays;
    setSelectedCurriculum((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        indexDays: newDays.sort((a, b) => a - b),
      };
    });
  }, [selectedDays]); // Atualiza apenas quando o usuário altera os dias

  useEffect(() => {
    if (selectedCurriculum) {
      // Verifica se realmente houve alteração
      setCurriculumDetails((prevDetails) => {
        if (prevDetails?.id !== selectedCurriculum.id) {
          return handleOneCurriculumDetails(selectedCurriculum.id);
        }
        return prevDetails;
      });
      // Chama onAdd apenas se selectedCurriculum for alterado
      onAdd && onAdd(selectedCurriculum);
      setNewAddCurriculums &&
        setNewAddCurriculums((prevState) => {
          // Verificar se já existe um objeto com o mesmo id
          if (
            prevState.some(
              (curriculum) => curriculum.id === selectedCurriculum.id
            )
          ) {
            // Se já existir, retorna o estado anterior sem alterações
            return prevState;
          }

          // Caso contrário, adiciona o novo objeto
          return [...prevState, selectedCurriculum];
        });
    } else if (onDel && uniqueId) {
      onDel(uniqueId);
      setUniqueId(null);
      setCurriculumDetails(undefined); // Reset dos detalhes
      setNewAddCurriculums &&
        setNewAddCurriculums((prevState) =>
          prevState.filter((curriculum) => curriculum.id !== uniqueId)
        );
    }
  }, [selectedCurriculum]);

  function handleCurriculumRegistrationChanges({
    id,
    date,
    whatChanged,
    resetDays = false,
  }: CurriculumRegistrationChangesProps) {
    if (whatChanged === "courseType") {
      setSelectedCurriculum((prev) =>
        prev
          ? {
              ...prev,
              isExperimental: !prev.isExperimental,
              indexDays: prev.isExperimental
                ? // ? selectedDays.filter((day) => availableDays.includes(day)) // Se estava experimental, mantém os dias
                  selectedDays // Se estava experimental, mantém os dias
                : [], // Se for regular, limpa os dias
              date: null,
            }
          : prev
      );
      resetDays && setSelectedDays([]); // Reseta os dias se necessário
    }
    if (whatChanged === "date") {
      setSelectedCurriculum((prev) => {
        return prev ? { ...prev, date: date } : prev;
      });
    }
    if (whatChanged === "days") {
      setSelectedCurriculum((prev) =>
        prev
          ? {
              ...prev,
              // isExperimental: !prev.isExperimental,
              indexDays: prev.isExperimental
                ? // ? selectedDays.filter((day) => availableDays.includes(day)) // Se estava experimental, mantém os dias
                  selectedDays // Se estava experimental, mantém os dias
                : [], // Se for regular, limpa os dias
              date: null,
            }
          : prev
      );
    }
    id;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <label htmlFor="selectSchool" className="w-1/4 text-right">
          Escola:{" "}
        </label>
        <select
          value={selectedSchoolId || ""}
          onChange={(e) => setSelectedSchoolId(e.target.value)}
          disabled={!selectedSchoolClassId || filteredSchools.length === 0}
          className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
        >
          <option value="" disabled>
            Selecione a escola
          </option>
          {filteredSchools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label htmlFor="selectCourse" className="w-1/4 text-right">
          Modalidade:{" "}
        </label>
        <select
          value={selectedCourseId || ""}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          disabled={!selectedSchoolId || filteredCourses.length === 0}
          className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
        >
          <option value="" disabled>
            Selecione a modalidade
          </option>
          {filteredCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCourseId && (
        <div className="flex flex-wrap w-full justify-center gap-2">
          {filteredCurriculums
            .filter(
              (c) =>
                c.schoolCourseId === selectedCourseId &&
                c.schoolId === selectedSchoolId
            )
            .filter(
              (c) =>
                !curriculumState.curriculums.some(
                  (curriculum) =>
                    curriculum.id === c.id &&
                    curriculum.id !== selectedCurriculum?.id
                )
            ) // Filtra os currículos que NÃO estão dentro de curriculumState.curriculums
            .filter(
              (c) => !selectedCurriculum || c.id === selectedCurriculum.id
            ) // Se nenhum curriculum estiver selecionado, mostra todos
            .map((curriculum) => (
              <div className="flex w-full xl:w-1/3" key={curriculum.id}>
                <CurriculumCard
                  curriculum={curriculum}
                  selectedCurriculumId={
                    selectedCurriculum ? selectedCurriculum.id : null
                  }
                  onSelect={() => handleSelectCurriculum(curriculum)}
                />
              </div>
            ))}
        </div>
      )}
      {selectedCurriculum && (
        <CurriculumRegistration
          curriculumDays={curriculumDays}
          curriculumDetails={curriculumDetails}
          selectedCurriculum={selectedCurriculum}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          studentFreeDays={studentFreeDays}
          initialized={initialized}
          setInitialized={setInitialized}
          handleCurriculumRegistrationChanges={
            handleCurriculumRegistrationChanges
          }
        />
      )}
    </div>
  );
};

export default SelectSchoolAndCourse;
