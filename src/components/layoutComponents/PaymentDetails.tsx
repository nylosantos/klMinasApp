import { SystemConstantsSearchProps } from "../../@types";

type PaymentDetailsProps<T> = {
  data: T;
  setData: (data: T) => void;
  enrolmentFee: number;
  appliedPrice: number;
  userRole: string;
  systemConstantsValues: SystemConstantsSearchProps;
  onlyView?: boolean;
};

export function PaymentDetails<
  T extends {
    paymentDay: string;
  }
>({
  data,
  setData,
  enrolmentFee,
  appliedPrice,
  userRole,
  onlyView = false,
  systemConstantsValues,
}: PaymentDetailsProps<T>) {
  interface PaymentDueDateProps {
    paymentDay: string; // O pagamento é esperado como uma string
  }

  const PaymentDueDate = ({ paymentDay }: PaymentDueDateProps) => {
    const displayPaymentDay =
      paymentDay !==
      systemConstantsValues.standardPaymentDay?.toString().padStart(2, "0")
        ? paymentDay
        : systemConstantsValues.standardPaymentDay?.toString().padStart(2, "0");

    return (
      <div className="flex w-full px-2 py-1 gap-10 justify-center items-center">
        <p className="text-sm text-red-600 dark:text-yellow-500">
          Data de vencimento dia {displayPaymentDay} do mês a cursar, pagamento
          antecipado
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
        Detalhes de Pagamento:
      </h1>

      <div className="flex gap-2 items-center">
        <label className="w-1/4 text-right">Matrícula:</label>
        <input
          type="text"
          className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          disabled
          value={enrolmentFee.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />
      </div>

      <div className="flex gap-2 items-center">
        <label className="w-1/4 text-right">Mensalidade:</label>
        <input
          type="text"
          className="uppercase w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          disabled
          value={appliedPrice.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />
      </div>

      <div className="flex gap-2 items-center">
        {onlyView ? (
          // Se for apenas visualização, mostra a data de vencimento
          <PaymentDueDate paymentDay={data.paymentDay} />
        ) : userRole !== "user" ? (
          // Se não for apenas visualização e o usuário não for "user", mostra os inputs de pagamento
          <>
            <label className="w-1/4 text-right">
              Melhor dia para pagamento:
            </label>
            {[5, 10, 15].map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="radio"
                  className="text-klGreen-500 dark:text-klGreen-500 border-none"
                  value={day}
                  checked={
                    data.paymentDay === String(day) ||
                    (data.paymentDay === "" && day === 5)
                  }
                  onChange={() => setData({ ...data, paymentDay: String(day) })}
                />
                {day}
              </label>
            ))}
          </>
        ) : (
          // Se for apenas visualização, mostra a data de vencimento para o usuário
          <PaymentDueDate paymentDay={data.paymentDay} />
        )}
      </div>
    </div>
  );
}
