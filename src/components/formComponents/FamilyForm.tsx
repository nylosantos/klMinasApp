import { useContext, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { SystemConstantsSearchProps } from "../../@types";
import FamilyFormSelect from "./FamilyFormSelect";

// Propriedades que são usadas especificamente no studentData
interface StudentData {
  familyDiscount: boolean;
  name: string;
  studentFamilyAtSchool: string[];
  parentOne?: { email: string };
  parentTwo?: { email: string };
  financialResponsible?: { document: string };
}

interface FamilyFormProps<T> {
  studentData: T; // studentData pode ter qualquer tipo, mas precisa incluir as propriedades de StudentData
  setStudentData: React.Dispatch<React.SetStateAction<T>>;
  systemConstantsValues: SystemConstantsSearchProps;
}

const FamilyForm = <T extends StudentData>({
  studentData,
  setStudentData,
  systemConstantsValues,
}: FamilyFormProps<T>) => {
  // Usamos o contexto global para saber se o formulário está sendo submetido
  const { isSubmitting } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  const [newAddFamily, setNewAddFamily] = useState<string[]>([]);

  return (
    <>
      {/* Algum irmão estuda na escola? */}
      <div className="grid gap-4 grid-cols-4 items-center w-full justify-center py-2">
        <p className="col-span-2 text-right">Algum irmão estuda na escola?</p>
        <div className="flex gap-4">
          <p>Não</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={studentData.familyDiscount}
              onChange={() => {
                setStudentData({
                  ...studentData,
                  familyDiscount: !studentData.familyDiscount,
                  studentFamilyAtSchool: studentData.familyDiscount
                    ? studentData.studentFamilyAtSchool
                    : [],
                });
              }}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-500 peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-transparent rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:shadow-md after:transform after:-translate-y-1/2"></div>
          </label>
          <p>Sim</p>
        </div>
      </div>

      {/* Se aluno tem desconto, mostrar a seção de família na escola */}
      {studentData.familyDiscount && (
        <FamilyFormSelect
          studentData={studentData}
          setStudentData={setStudentData}
          systemConstantsValues={systemConstantsValues}
          isSubmitting={isSubmitting}
          newStudent
          newAddFamily={newAddFamily}
          setNewAddFamily={setNewAddFamily}
        />
      )}
    </>
  );
};

export default FamilyForm;
