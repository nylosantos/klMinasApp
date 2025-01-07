import { v4 as uuidv4 } from "uuid";
import EditDashboardHeader from "../layoutComponents/EditDashboardHeader";
import { useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { HandleClickOpenFunctionProps } from "../../@types";
import { PaymentArrayProps } from "../dashboardComponents/DashboardStudents";

type FinanceStudentModalProps = {
  studentId: string;
  onClose?: () => void;
  onlyView?: boolean;

  isEdit?: boolean;
  isFinance?: boolean;
  isFinancialResponsible?: boolean;
  open?: boolean;
  paymentArray: PaymentArrayProps[];
  studentName: string;

  handleClickOpen?: ({ id, option }: HandleClickOpenFunctionProps) => void;
  handleDeleteUser?: () => void;
  setIsEdit?: (option: boolean) => void;
  setIsFinance?: (option: boolean) => void;
  setIsDetailsViewing?: (option: boolean) => void;
};

export function FinanceStudentModal({
  studentId,
  onClose,
  onlyView = false,
  isEdit = false,
  isFinance = false,
  isFinancialResponsible = false,
  open = false,
  paymentArray,
  studentName,
  handleClickOpen,
  handleDeleteUser,
  setIsEdit,
  setIsFinance,
  setIsDetailsViewing,
}: FinanceStudentModalProps) {
  // GET GLOBAL DATA
  const { page } = useContext(GlobalDataContext) as GlobalDataContextType;

  function handlePaymentStatusColor(payment: PaymentArrayProps) {
    if (
      payment.dueDate < new Date() &&
      typeof payment.paymentDate === "string"
    ) {
      return "bg-red-600 text-white";
    } else if (payment.dueDate > new Date()) {
      return "border border-klOrange-500 ";
    } else {
      return "border border-klGreen-500 ";
    }
  }

  function handlePaymentStatusMessage(payment: PaymentArrayProps) {
    if (
      payment.dueDate < new Date() &&
      typeof payment.paymentDate === "string"
    ) {
      return "Pagamento em Atraso";
    } else if (payment.dueDate > new Date()) {
      return "Aguardando Pagamento";
    } else {
      return "Pagamento Efetuado";
    }
  }

  function handlePaymentActionColor(payment: PaymentArrayProps) {
    if (typeof payment.paymentDate === "string") {
      return "bg-klOrange-500 hover:bg-klOrange-500/70";
    } else {
      return "bg-klGreen-500 hover:bg-klGreen-500/80";
    }
  }

  function handlePaymentActionMessage(payment: PaymentArrayProps) {
    if (typeof payment.paymentDate === "string") {
      return "Efetuar Pagamento";
    } else {
      return "Imprimir Comprovante";
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full overflow-scroll no-scrollbar gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 text-center">
      {/** DAHSBOARD SECTION TITLE */}
      {page.show === "Dashboard" &&
        studentName &&
        handleClickOpen &&
        handleDeleteUser &&
        onClose &&
        setIsEdit &&
        setIsFinance &&
        setIsDetailsViewing && (
          <EditDashboardHeader
            handleClickOpen={handleClickOpen}
            handleDeleteUser={handleDeleteUser}
            onClose={onClose}
            setIsDetailsViewing={setIsDetailsViewing}
            setIsEdit={setIsEdit}
            setIsFinance={setIsFinance}
            studentId={studentId}
            studentName={studentName}
            isEdit={isEdit}
            isFinance={isFinance}
            isFinancialResponsible={isFinancialResponsible}
            onlyView={onlyView}
            open={open}
            key={studentId}
          />
        )}
      <div className="flex flex-col w-full h-full overflow-scroll no-scrollbar [&>*:nth-child(2)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/00 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/0 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl transition-all duration-1000">
        <div className="flex flex-col px-4 py-3" key={uuidv4()}>
          <div className="flex items-center w-full gap-3">
            <div className="text-sm/6 text-center w-1/12 text-klGreen-500 dark:text-white">
              Número do Lançamento
            </div>
            <div className="text-sm/6 text-center w-1/12 text-klGreen-500 dark:text-white">
              Data de Lançamento
            </div>
            <div className="text-sm/6 text-center w-1/12 text-klGreen-500 dark:text-white">
              Data de Vencimento
            </div>
            <div
              className={`text-sm/6 text-center ${
                isFinancialResponsible ? "w-3/12" : "w-4/12"
              } text-klGreen-500 dark:text-white`}
            >
              Descrição
            </div>
            <div className="text-sm/6 text-center w-1/12 text-klGreen-500 dark:text-white">
              Data de Pagamento
            </div>
            <div className="text-sm/6 text-center w-2/12 text-klGreen-500 dark:text-white">
              Valor
            </div>
            <div className="text-sm/6 text-center w-1/12 text-klGreen-500 dark:text-white">
              Status
            </div>
            {isFinancialResponsible && (
              <div className="text-sm/6 text-center w-1/12 text-klGreen-500 dark:text-white">
                Ação
              </div>
            )}
          </div>
        </div>
        <div
          className={
            "w-full ease-in-out flex flex-col overflow-scroll no-scrollbar [&>*:nth-child(1)]:rounded-t-none [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/10 dark:[&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 transition-all duration-1000"
          }
        >
          {paymentArray.length !== 0 ? (
            paymentArray
              .sort(
                (a, b) =>
                  Number(new Date(b.dueDate)) - Number(new Date(a.dueDate))
              )
              .map((payment) => {
                return (
                  <div className="flex flex-col px-4 py-3" key={uuidv4()}>
                    <div className="flex items-center w-full gap-3">
                      <div className="flex items-center justify-center text-left w-1/12 text-klGreen-500 dark:text-white">
                        {payment.invoiceId}
                      </div>
                      <div className="flex items-center justify-center text-left w-1/12 text-klGreen-500 dark:text-white">
                        {payment.creationDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center justify-center text-left w-1/12 text-klGreen-500 dark:text-white">
                        {payment.dueDate.toLocaleDateString()}
                      </div>
                      <div
                        className={`flex items-center justify-center text-center ${
                          isFinancialResponsible ? "w-3/12" : "w-4/12"
                        } text-klGreen-500 dark:text-white`}
                      >
                        <p className="truncate">{payment.description}</p>
                      </div>
                      <div className="flex items-center justify-center text-center w-1/12 text-klGreen-500 dark:text-white">
                        {typeof payment.paymentDate !== "string"
                          ? payment.paymentDate.toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="flex text-right w-2/12 justify-center text-klGreen-500 dark:text-white">
                        <div className="flex items-center justify-center w-1/12 text-left">
                          R${" "}
                        </div>
                        <div className="flex items-center justify-center w-4/12 text-right">
                          {payment.value < 100
                            ? 100 - payment.value + payment.value
                            : payment.value}
                          ,00
                        </div>
                      </div>
                      <div
                        className={`flex items-center justify-center text-center w-1/12 dark:text-white rounded-lg text-sm/snug px-1 py-2 ${handlePaymentStatusColor(
                          payment
                        )}`}
                      >
                        {handlePaymentStatusMessage(payment)}
                      </div>
                      {isFinancialResponsible && (
                        <div
                          className={`flex items-center justify-center text-center w-1/12 h-full text-white rounded-lg text-sm/snug px-1 ${handlePaymentActionColor(
                            payment
                          )} cursor-pointer`}
                        >
                          {handlePaymentActionMessage(payment)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex justify-center p-4 ">
              <p className="text-klGreen-500 dark:text-white">
                Nenhum registro financeiro encontrado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
