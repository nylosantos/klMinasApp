import { useFormContext } from "react-hook-form";
import { SystemConstantsSearchProps } from "../../@types";
import { Tooltip } from "react-tooltip";

type DiscountFormProps<T> = {
  data: T;
  setData: (data: T) => void;
  systemConstantsValues: SystemConstantsSearchProps;
  userRole: string;
};

export function DiscountForm<
  T extends {
    enrolmentExemption: boolean;
    employeeDiscount: boolean;
    customDiscount: boolean;
    customDiscountValue: string;
  }
>({ data, setData, systemConstantsValues, userRole }: DiscountFormProps<T>) {
  const {
    formState: { errors },
  } = useFormContext();

  const familyDiscountValue = (
    (1 - systemConstantsValues.familyDiscountValue) *
    100
  ).toFixed();
  const secondCourseDiscountValue = (
    (1 - systemConstantsValues.secondCourseDiscountValue) *
    100
  ).toFixed();

  return (
    <>
      {userRole !== "user" && (
        <h1 className="font-bold text-lg py-4 text-klGreen-600 dark:text-gray-100">
          Aplicar Descontos:
        </h1>
      )}

      <div className="flex gap-2 w-full justify-center items-center py-2">
        <div className="flex gap-2 max-w-xl items-start text-justify py-2">
          <p className="text-sm text-red-600 dark:text-yellow-500">
            Desconto Familiar: Informando um irmão que já é matriculado na{" "}
            {systemConstantsValues.customerFullName}, você obterá{" "}
            {familyDiscountValue}% de desconto no curso com mensalidade de menor
            valor. <br /> Desconto de Segundo Curso: Ao se matricular em um
            segundo curso na {systemConstantsValues!.customerFullName}, você
            obterá {secondCourseDiscountValue}% de desconto no curso com
            mensalidade de menor valor. <br /> ATENÇÃO: Os descontos não são
            cumulativos.
          </p>
        </div>
      </div>

      {userRole !== "user" && (
        <div className="flex flex-col gap-4 items-center py-2 justify-center">
          {/* Isenção de Matrícula */}
          <div className="grid gap-4 grid-cols-3 items-center w-full justify-center">
            <p className="col-span-2">Ativar Isenção de Matrícula?</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.enrolmentExemption}
                onChange={() =>
                  setData({
                    ...data,
                    enrolmentExemption: !data.enrolmentExemption,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-500 peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-transparent rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:shadow-md after:transform after:-translate-y-1/2"></div>
            </label>
          </div>

          {/* Desconto de Funcionário */}
          <div className="grid gap-4 grid-cols-3 items-center w-full justify-center">
            <p className="col-span-2">Ativar Desconto de Funcionário?</p>
            <label
              className={`relative inline-flex items-center ${
                data.customDiscount
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              data-tooltip-id={`tooltip-${data.employeeDiscount}`}
            >
              <input
                type="checkbox"
                disabled={data.customDiscount}
                checked={data.employeeDiscount}
                onChange={() =>
                  setData({ ...data, employeeDiscount: !data.employeeDiscount })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-500 peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-transparent rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:shadow-md after:transform after:-translate-y-1/2"></div>
            </label>
            {data.customDiscount && (
              <Tooltip
                id={`tooltip-${data.employeeDiscount}`}
                content="Desconto personalizado ativado."
              />
            )}
          </div>

          {/* Desconto Personalizado */}
          <div className="grid gap-4 grid-cols-3 items-center w-full justify-center">
            <p className="col-span-2">Ativar Desconto Personalizado?</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.customDiscount}
                onChange={() =>
                  setData({
                    ...data,
                    employeeDiscount: false,
                    customDiscount: !data.customDiscount,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-500 peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-transparent rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:shadow-md after:transform after:-translate-y-1/2"></div>
            </label>
          </div>

          {data.customDiscount && (
            <div className="w-full flex items-center gap-2 justify-center">
              <label htmlFor="customDiscountValue">
                Porcentagem de desconto:
              </label>
              <input
                type="text"
                id="customDiscountValue"
                disabled={!data.customDiscount}
                className={`w-1/12 px-2 py-1 dark:bg-gray-800 border ${
                  errors.customDiscountValue
                    ? "border-red-600"
                    : "border-transparent"
                } dark:text-gray-100 rounded-2xl`}
                // value={data.customDiscount ? data.customDiscountValue.replace(/^0+/, "") : "0"}
                value={data.customDiscount ? data.customDiscountValue.replace(/^0+/, "") : "0"}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9]/g, "");
                  value = value === "" ? "0" : value;
                  if (Number(value) <= 100)
                    setData({ ...data, customDiscountValue: value });
                }}
              />
              <label htmlFor="customDiscountValue">%</label>
            </div>
          )}
        </div>
      )}
    </>
  );
}
