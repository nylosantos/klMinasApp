import { SystemConstantsSearchProps } from "../../@types";

interface TitleAddFamilyProps {
  studentName: string;
  systemConstantsValues: SystemConstantsSearchProps;
}

export default function TitleAddFamily({
  studentName,
  systemConstantsValues,
}: TitleAddFamilyProps) {
  return (
    <>
      <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
        Atenção: a seguir selecione o aluno que já é matriculado na{" "}
        {systemConstantsValues.customerFullName}, e é irmão de {studentName}:
      </h1>

      <div className="flex gap-2 items-center py-2">
        <div className="flex gap-2 w-full justify-center items-center text-center py-2">
          <p className="text-sm text-red-600 dark:text-yellow-500">
            Não encontrou o irmão? Verifique os dados de Filiação e/ou
            Responsável financeiro.
            <br />
            Apenas alunos com a mesma filiação e/ou Responsáveis Financeiros
            podem ser selecionados como "parentes".
          </p>
        </div>
      </div>
    </>
  );
}
