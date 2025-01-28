import { HandleClickOpenFunctionProps, StudentSearchProps } from "../../@types";
import { StudentButtonDetails } from "./StudentButtonDetails";

interface EditDashboardHeaderProps {
  isEdit?: boolean;
  isFinance?: boolean;
  isFinancialResponsible?: boolean;
  onlyView?: boolean;
  open?: boolean;
  student: StudentSearchProps;
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
  student,
  handleClickOpen,
  handleDeleteUser,
  onClose,
  setIsEdit,
  setIsFinance,
  setIsDetailsViewing,
}: EditDashboardHeaderProps) {
  return (
    <div className="flex w-full relative items-center justify-center text-md/snug text-gray-100 bg-klGreen-500/70 dark:bg-klGreen-500/70 rounded-xl uppercase p-4">
      <p className="flex absolute z-10">
        {`${
          isFinance
            ? "Registros Financeiros"
            : onlyView
            ? "Ficha de Cadastro"
            : "Editando Cadastro"
        } | ${student.publicId} - ${student.name}`}
      </p>
      <div className="flex relative justify-end px-2 w-full z-50">
        <StudentButtonDetails
          id={student.id}
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
