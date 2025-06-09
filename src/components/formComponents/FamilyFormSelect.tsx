/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef } from "react";
import {
  FilteredStudentsProps,
  StudentSearchProps,
  SystemConstantsSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import TitleAddFamily from "../layoutComponents/TitleAddFamily";

// Propriedades que são usadas especificamente no studentData
interface StudentData {
  id?: string;
  familyDiscount: boolean;
  name: string;
  studentFamilyAtSchool: string[];
  parentOne?: { email: string };
  parentTwo?: { email: string };
  financialResponsible?: { document: string };
}

interface FamilyFormSelectProps<T> {
  studentData: T; // studentData pode ter qualquer tipo, mas precisa incluir as propriedades de StudentData
  setStudentData: React.Dispatch<React.SetStateAction<T>>;
  systemConstantsValues: SystemConstantsSearchProps;
  isSubmitting: boolean;
  newStudent?: boolean;
  setNewAddFamily: React.Dispatch<React.SetStateAction<string[]>>;
  newAddFamily: string[];
}

export default function FamilyFormSelect<T extends StudentData>({
  studentData,
  setStudentData,
  systemConstantsValues,
  isSubmitting,
  newStudent = false,
  setNewAddFamily,
  newAddFamily,
}: FamilyFormSelectProps<T>) {
  // GET GLOBAL DATA
  const { studentsDb } = useContext(GlobalDataContext) as GlobalDataContextType;

  // Ref para garantir que o efeito execute apenas uma vez quando o curriculumState.curriculums for inicializado
  const initialLoad = useRef(false);

  // Ref para armazenar o valor anterior do select
  const previousFamilyIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialLoad.current) return; // Evita rodar novamente após a primeira execução

    initialLoad.current = true; // Marca que o efeito foi executado
    if (newStudent) {
      addFamilySelect();
    }
  }, []);

  const updateFamilyAtSchool = (newFamilyId: string) => {
    // Aqui você já tem o valor antigo, que foi salvo na ref
    const previousDataValue =
      previousFamilyIdRef.current === " -- select an option -- "
        ? ""
        : previousFamilyIdRef.current;

    // Altera o primeiro item de studentFamilyAtSchool que corresponda ao valor antigo
    const indexFamily = studentData.studentFamilyAtSchool.findIndex(
      (familyId) => familyId === previousDataValue
    );
    if (indexFamily >= 0) {
      const updatedFamilyAtSchool = [...studentData.studentFamilyAtSchool];
      updatedFamilyAtSchool[indexFamily] = newFamilyId; // Altera o primeiro item encontrado
      setStudentData({
        ...studentData,
        studentFamilyAtSchool: updatedFamilyAtSchool,
      });
    }

    // Altera o primeiro item de newAddFamily que corresponda ao valor antigo
    const indexNewFamily = newAddFamily.findIndex(
      (item) => item === previousDataValue
    );
    if (indexNewFamily >= 0) {
      const updatedNewFamily = [...newAddFamily];
      updatedNewFamily[indexNewFamily] = newFamilyId; // Altera o primeiro item encontrado
      setNewAddFamily(updatedNewFamily);
    }
  };

  // Função para adicionar um novo familiar
  const addFamilySelect = () => {
    setStudentData((prevState) => ({
      ...prevState,
      studentFamilyAtSchool: [...prevState.studentFamilyAtSchool, ""],
    }));
    !newStudent && setNewAddFamily((prevState) => [...prevState, ""]);
  };

  // Função para remover um familiar
  const removeFamilySelect = (id: string) => {
    // Remove o primeiro item de studentFamilyAtSchool que corresponda ao id
    const indexFamily = studentData.studentFamilyAtSchool.findIndex(
      (familyId) => familyId === id
    );
    if (indexFamily >= 0) {
      const updatedFamilyAtSchool = [...studentData.studentFamilyAtSchool];
      const isTheLastItem = updatedFamilyAtSchool.length === 1;
      updatedFamilyAtSchool.splice(indexFamily, 1); // Remove o primeiro item encontrado
      setStudentData({
        ...studentData,
        studentFamilyAtSchool: updatedFamilyAtSchool,
        familyDiscount:
          isTheLastItem && newStudent ? false : studentData.familyDiscount,
      });
    }

    // Remove o primeiro item de newAddFamily que corresponda ao id
    const indexNewFamily = newAddFamily.findIndex((item) => item === id);
    if (indexNewFamily >= 0) {
      const updatedNewFamily = [...newAddFamily];
      updatedNewFamily.splice(indexNewFamily, 1); // Remove o primeiro item encontrado
      setNewAddFamily(updatedNewFamily);
    }
  };

  // Filtra os estudantes já selecionados no array studentFamilyAtSchool
  const renderOptions = (index: number) => {
    if (
      studentData.parentOne?.email ||
      studentData.parentTwo?.email ||
      studentData.financialResponsible?.document
    ) {
      const studentsToShow: FilteredStudentsProps[] = [];
      const students = studentsDb as StudentSearchProps[];
      students.map((student) => {
        const compareParentsData =
          student.parentOne?.email === studentData.parentOne?.email ||
          student.parentOne?.email === studentData.parentTwo?.email ||
          student.parentTwo?.email === studentData.parentOne?.email ||
          student.parentTwo?.email === studentData.parentTwo?.email;

        const compareFinancialResponsibleData =
          student.financialResponsible.document ===
          studentData.financialResponsible?.document;

        if (studentData.id) {
          if (
            compareFinancialResponsibleData &&
            student.id !== studentData.id
          ) {
            studentsToShow.push({ ...student, isFinancialResponsible: true });
          } else if (compareParentsData && student.id !== studentData.id) {
            studentsToShow.push({ ...student, isFinancialResponsible: false });
          }
        } else {
          if (compareFinancialResponsibleData) {
            studentsToShow.push({ ...student, isFinancialResponsible: true });
          } else if (compareParentsData) {
            studentsToShow.push({ ...student, isFinancialResponsible: false });
          }
        }
      });

      // Filtra os alunos que já foram selecionados
      const availableStudents = studentsToShow.filter(
        (student) =>
          !studentData.studentFamilyAtSchool.includes(student.id || "") ||
          student.id === studentData.studentFamilyAtSchool[index] // Permite manter a opção já selecionada
      );

      return availableStudents
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ));
    }

    return null;
  };

  return (
    <div className="flex flex-col relative py-2 gap-2 rounded-xl">
      {/* Renderizar selects dinamicamente */}
      {studentData.studentFamilyAtSchool
        .filter((familyId) => {
          if (!newStudent) {
            // Filtra apenas se newStudent for false
            return newAddFamily.includes(familyId);
          }
          // Caso contrário, mantém o item no array
          return true;
        })
        .map((familyId, index) => (
          <>
            {index === 0 && (
              <TitleAddFamily
                studentName={studentData.name}
                systemConstantsValues={systemConstantsValues}
              />
            )}
            <div key={index} className="flex gap-2 items-center pb-2">
              <label
                htmlFor={`familyStudentSelect-${index}`}
                className="w-1/4 text-right"
              >
                Selecione o irmão {index + 1}:{" "}
              </label>
              <select
                id={`familyStudentSelect-${index}`}
                ref={(el) => {
                  // Associando a ref ao select
                  if (el) {
                    previousFamilyIdRef.current = el.value;
                  }
                }}
                value={familyId || " -- select an option -- "}
                disabled={isSubmitting}
                className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                onChange={(e) => {
                  updateFamilyAtSchool(e.target.value);
                }}
              >
                <option disabled value={" -- select an option -- "}>
                  {" "}
                  -- Selecione --{" "}
                </option>
                {renderOptions(index)}
              </select>
              <button
                type="button"
                className="text-red-600"
                onClick={() => removeFamilySelect(familyId)}
              >
                Remover
              </button>
            </div>
          </>
        ))}

      {/* Adicionar novo familiar */}
      {/* Está pronto e funcional para adicionar mais de um familiar por vez */}
      {/* Mas da forma com que o sistema funciona atualmente, não é necessário */}
      {/* Visto que no submit do form, o sistema adiciona todos os parentes para todos os envolvidos */}
      {/* <div className="flex justify-center py-2">
        <div
          className="flex md:w-2/4 items-center justify-center gap-4 px-4 py-1 cursor-pointer border rounded-md border-green-900/10 bg-klGreen-500 hover:bg-klGreen-500/80 transition-all disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
          onClick={addFamilySelect}
        >
          <MdAdd />
          <span>Adicionar novo familiar</span>
        </div>
      </div> */}
    </div>
  );
}
