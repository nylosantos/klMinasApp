import { v4 as uuidv4 } from "uuid";

type FinanceStudentModalProps = {
  isFinancialResponsible: boolean;
};

export function FinanceStudentModal({
  isFinancialResponsible,
}: FinanceStudentModalProps) {
  const paymentArray: PaymentArrayProps[] = [
    {
      type: "enrolledFee",
      dueDate: new Date("01/31/2024"),
      paymentDate: new Date("01/10/2024"),
      creationDate: new Date("01/5/2024"),
      description: "Matrícula 2024",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("01/15/2024"),
      paymentDate: new Date("01/10/2024"),
      creationDate: new Date("01/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("02/15/2024"),
      paymentDate: new Date("02/6/2024"),
      creationDate: new Date("02/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("03/15/2024"),
      paymentDate: new Date("03/5/2024"),
      creationDate: new Date("03/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("04/15/2024"),
      paymentDate: new Date("04/11/2024"),
      creationDate: new Date("04/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("05/15/2024"),
      paymentDate: new Date("05/17/2024"),
      creationDate: new Date("05/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("06/15/2024"),
      paymentDate: new Date("06/20/2024"),
      creationDate: new Date("06/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("07/15/2024"),
      paymentDate: new Date("07/22/2024"),
      creationDate: new Date("07/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("08/15/2024"),
      paymentDate: new Date("08/8/2024"),
      creationDate: new Date("08/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("09/15/2024"),
      paymentDate: new Date("09/9/2024"),
      creationDate: new Date("09/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("10/15/2024"),
      paymentDate: "   ",
      creationDate: new Date("10/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("11/15/2024"),
      paymentDate: "   ",
      creationDate: new Date("11/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
    {
      type: "montlyPayment",
      dueDate: new Date("12/15/2024"),
      paymentDate: "   ",
      creationDate: new Date("12/5/2024"),
      description:
        "BERNOULLI GO | INICIAÇÃO ESPORTIVA | MATUTINO 1º E 2º PERÍODO | Terça - Quinta | TURMA 14 B.GO | Professor: MARCELO HENRIQUE DOS SANTOS",
      invoiceId: Math.floor(Math.random() * 20 * 100000000),
      value: Math.floor(Math.random() * 20 * 100),
    },
  ];

  type PaymentArrayProps = {
    type: "enrolledFee" | "montlyPayment";
    dueDate: Date;
    paymentDate: Date | string;
    creationDate: Date;
    description: string;
    invoiceId: number;
    value: number;
  };

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
    <div className="flex flex-col w-full h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl transition-all duration-1000">
      <div
        className="text-center flex flex-col px-4 py-3 uppercase text-klGreen-500 dark:text-white"
        key={uuidv4()}
      >
        Registros Financeiros
      </div>

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
          "w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-none [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/10 dark:[&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 transition-all duration-1000"
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
                      className={`flex items-center justify-center text-center w-1/12 dark:text-white rounded-lg text-sm/snug px-1 ${handlePaymentStatusColor(
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
  );
}
