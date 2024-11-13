import { HandleClickOpenFunctionProps } from "../../@types";
import { StudentButtonDetails } from "./StudentButtonDetails";

interface EditDashboardHeaderProps {
  isEdit?: boolean;
  isFinance?: boolean;
  isFinancialResponsible?: boolean;
  onlyView?: boolean;
  open?: boolean;
  studentId: string;
  studentName: string;
  handleClickOpen: ({ id, option }: HandleClickOpenFunctionProps) => void;
  handleDeleteUser: () => void;
  onClose: () => void;
  setIsEdit: (option: boolean) => void;
  setIsFinance: (option: boolean) => void;
  setIsDetailsViewing: (option: boolean) => void;
}

export default function EditDashboardHeader({
  isEdit = false,
  isFinance = false,
  isFinancialResponsible = false,
  onlyView = false,
  open = false,
  studentId,
  studentName,
  handleClickOpen,
  handleDeleteUser,
  onClose,
  setIsEdit,
  setIsFinance,
  setIsDetailsViewing,
}: EditDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-center text-md/snug text-klGreen-500 dark:text-gray-100 bg-klGreen-500/20 dark:bg-klGreen-500/70 rounded-xl uppercase p-1">
      <p className="flex absolute z-10">
        {`${
          isFinance
            ? "Registros Financeiros"
            : onlyView
            ? "Ficha de Cadastro"
            : "Editando Cadastro"
        } - ${studentName}`}
      </p>
      <div className="flex relative justify-end px-2 w-full z-50">
        <StudentButtonDetails
          id={studentId}
          isEdit={isEdit}
          isFinance={isFinance}
          isDetailsViewing={onlyView}
          isFinancialResponsible={isFinancialResponsible}
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={onClose}
          handleDeleteUser={handleDeleteUser}
          setIsEdit={setIsEdit}
          setIsFinance={setIsFinance}
          setIsDetailsViewing={setIsDetailsViewing}
        />
      </div>
    </div>
  );
}
