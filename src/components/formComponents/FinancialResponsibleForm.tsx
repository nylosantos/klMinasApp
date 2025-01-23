import { formataCPF, testaCPF } from "../../custom";
import { BrazilianStateSelectOptions } from "./BrazilianStateSelectOptions";
import { useContext, useState } from "react";
import cep from "cep-promise";
import { toast } from "react-toastify";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { FieldErrors, useFormContext } from "react-hook-form";

interface FinancialResponsibleFormProps<T> {
  onlyView: boolean;
  isExperimental: boolean;
  placesAvailable: boolean;
  emptyWaitingList: boolean;
  testFinancialCPF: boolean;
  activePhoneSecondary: boolean;
  activePhoneTertiary: boolean;
  editAddress: boolean;
  student: { financialResponsible: FinancialResponsibleProps };
  setStudentData: React.Dispatch<React.SetStateAction<T>>;
  setEditAddress: React.Dispatch<React.SetStateAction<boolean>>;
  setTestFinancialCPF: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePhoneSecondary?: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePhoneTertiary?: React.Dispatch<React.SetStateAction<boolean>>;
}

type AddressProps = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
};

type PhoneProps = { ddd: string; number: string };
type PhoneOptionalProps = { ddd?: string; number?: string };

interface FinancialResponsibleProps {
  name: string;
  document: string;
  email: string;
  address: AddressProps;
  phone: PhoneProps;
  activePhoneSecondary: boolean;
  phoneSecondary: PhoneOptionalProps;
  activePhoneTertiary: boolean;
  phoneTertiary: PhoneOptionalProps;
}

const FinancialResponsibleForm = <
  T extends { financialResponsible: FinancialResponsibleProps }
>({
  onlyView,
  activePhoneSecondary,
  activePhoneTertiary,
  isExperimental,
  placesAvailable,
  emptyWaitingList,
  testFinancialCPF,
  editAddress,
  student,
  setEditAddress,
  setStudentData,
  setTestFinancialCPF,
  setActivePhoneSecondary,
  setActivePhoneTertiary,
}: FinancialResponsibleFormProps<T>) => {
  // GET GLOBAL DATA
  const { isSubmitting } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  // CEP SUBMITTING STATE
  const [cepSubmitting, setCepSubmitting] = useState(false);

  // CEP ERROR STATE
  const [cepError, setCepError] = useState(false);

  // GET CEP (BRAZILIAN ZIP CODE) FUNCTION
  const getCep = async (data: string) => {
    setEditAddress(false);
    if (data) {
      setCepSubmitting(true);
      await cep(data)
        .then((response) => {
          setCepSubmitting(false);
          setStudentData((prevData) => ({
            ...prevData,
            financialResponsible: {
              ...prevData.financialResponsible,
              address: {
                ...prevData.financialResponsible.address,
                cep: data,
                street: response.street,
                neighborhood: response.neighborhood,
                city: response.city,
                state: response.state,
              },
            },
          }));
        })
        .catch((error) => {
          console.log("ESSE É O ERROR", error);
          setCepSubmitting(false);
          toast.error(
            `Erro ao pesquisar o CEP, verifique o número ou insira o endereço manualmente... 🤯`,
            {
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            }
          );
        });
    } else {
      setCepError(true);
      setCepSubmitting(false);
      toast.error(`Por favor, preencha o CEP para pesquisa.`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
  };

  // FORMAT CEP (BRAZILIAN ZIP CODE) FUNCTION
  const formatCEP = (cepNumber: string) => {
    cepNumber = cepNumber.replace(/[^\d]/g, "");
    return cepNumber.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
  };

  const {
    formState: { errors },
  } =
    useFormContext<
      FieldErrors<{ financialResponsible: FinancialResponsibleProps }>
    >();

  return (
    <>
      {/** STUDENT FINANCIAL RESPONSIBLE SECTION TITLE */}
      <h1 className="font-bold text-lg py-4 text-red-600 dark:text-yellow-500">
        Dados do Responsável Financeiro:
      </h1>

      {/** STUDENT FINANCIAL RESPONSIBLE SECTION SUBTITLE */}
      {!onlyView && (
        <div className="flex gap-2 items-center py-2">
          <div className="w-1/4" />
          <div className="flex flex-col gap-2 w-3/4 items-start text-left pb-2">
            {/* EXPERIMENTAL CLASS DISCLAIMER */}
            {isExperimental && placesAvailable && emptyWaitingList && (
              <p className="text-sm text-red-600 dark:text-yellow-500">
                Em caso de desistência dos serviços, o responsável tem o prazo
                de até 5 dias para entrar no cadastro e realizar o cancelamento.
                Os dados serão descartados sem ônus de matrícula.
              </p>
            )}
            <p className="text-sm font-bold text-red-600 dark:text-yellow-500">
              ATENÇÃO: A VERACIDADE DOS DADOS É DE SUA RESPONSABILIDADE AO
              PREENCHER O CADASTRO
            </p>
          </div>
        </div>
      )}

      {/* FINANCIAL RESPONSIBLE DOCUMENT*/}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsibleDocument"
          className={
            testFinancialCPF
              ? errors.financialResponsible?.document
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
              : "w-1/4 text-right text-red-500 dark:text-red-400"
          }
        >
          CPF
          {testFinancialCPF ? (
            ": "
          ) : (
            <span className="text-red-500 dark:text-red-400">
              {" "}
              Inválido, verifique:
            </span>
          )}
        </label>
        <input
          type="text"
          name="financialResponsibleDocument"
          disabled={onlyView ?? isSubmitting}
          pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
          maxLength={11}
          placeholder={
            testFinancialCPF
              ? errors.financialResponsible?.document
                ? "É necessário inserir o CPF do Responsável Financeiro"
                : "Insira o CPF do Responsável Financeiro"
              : "CPF Inválido"
          }
          className={
            testFinancialCPF
              ? errors.financialResponsible?.document
                ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
          }
          value={student.financialResponsible.document}
          onChange={(e) => {
            if (e.target.value.length === 11) {
              setTestFinancialCPF(testaCPF(e.target.value));
            }
            setStudentData((prevData) => ({
              ...prevData,
              financialResponsible: {
                ...prevData.financialResponsible,
                document: formataCPF(e.target.value),
              },
            }));
          }}
        />
      </div>

      {/* FINANCIAL RESPONSIBLE NAME */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsible"
          className={
            errors.financialResponsible?.name
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Nome:{" "}
        </label>
        <input
          type="text"
          disabled={onlyView ?? isSubmitting}
          name="financialResponsible"
          placeholder={
            errors.financialResponsible?.name
              ? "É necessário inserir o Nome completo do Responsável Financeiro"
              : "Insira o nome completo do Responsável Financeiro"
          }
          className={
            errors.financialResponsible?.name
              ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          value={student.financialResponsible.name}
          onChange={(e) =>
            setStudentData((prevData) => ({
              ...prevData,
              financialResponsible: {
                ...prevData.financialResponsible,
                name: e.target.value,
              },
            }))
          }
        />
      </div>

      {/* FINANCIAL RESPONSIBLE E-MAIL */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsibleEmail"
          className={
            errors.financialResponsible?.email
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          E-mail:{" "}
        </label>
        <input
          type="text"
          name="financialResponsibleEmail"
          disabled={onlyView ?? isSubmitting}
          placeholder={
            errors.financialResponsible?.email
              ? "É necessário inserir o e-mail do Responsável Financeiro"
              : "Insira o e-mail do Responsável Financeiro"
          }
          className={
            errors.financialResponsible?.email
              ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          value={student.financialResponsible?.email}
          onChange={(e) => {
            setStudentData((prevData) => ({
              ...prevData,
              financialResponsible: {
                ...prevData.financialResponsible,
                email: e.target.value,
              },
            }));
          }}
        />
      </div>

      {/* FINANCIAL RESPONSIBLE PHONE */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsiblePhone"
          className={
            errors.financialResponsible?.phone
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Telefone:{" "}
        </label>
        <div className="flex w-2/4 gap-2">
          <div className="flex w-full items-center gap-1">
            <select
              id="financialResponsiblePhoneDDD"
              value={
                student.financialResponsible?.phone.ddd !== ""
                  ? student.financialResponsible?.phone.ddd
                  : "DDD"
              }
              disabled={onlyView ?? isSubmitting}
              className={
                errors.financialResponsible?.phone?.ddd
                  ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              name="DDD"
              onChange={(e) => {
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    phone: {
                      ...prevData.financialResponsible.phone,
                      ddd: e.target.value,
                    },
                  },
                }));
              }}
            >
              <BrazilianStateSelectOptions />
            </select>
            <input
              type="text"
              name="financialResponsiblePhoneNumber"
              disabled={onlyView ?? isSubmitting}
              pattern="^[+ 0-9]{9}$"
              maxLength={9}
              value={student.financialResponsible?.phone.number}
              placeholder={
                errors.financialResponsible?.phone?.number
                  ? "telefone válido"
                  : "988887777"
              }
              className={
                errors.financialResponsible?.phone?.number
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) => {
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    phone: {
                      ...prevData.financialResponsible.phone,
                      number: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  },
                }));
              }}
            />
          </div>
          {!onlyView && <div className="flex w-2/12 items-center gap-2"></div>}
        </div>
      </div>

      {/* FINANCIAL RESPONSIBLE PHONE SECONDARY */}
      {!(onlyView && !student.financialResponsible.activePhoneSecondary) && (
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phoneSecondary"
            className={
              errors.financialResponsible?.phoneSecondary
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Telefone 2:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-full items-center gap-1">
              {/** NUMBER SECONDARY DDD */}
              <select
                id="financialResponsiblePhoneSecondaryDDD"
                disabled={
                  onlyView
                    ? true
                    : !student.financialResponsible?.activePhoneSecondary
                }
                value={
                  student.financialResponsible?.phoneSecondary.ddd !== ""
                    ? student.financialResponsible?.phoneSecondary.ddd
                    : "DDD"
                }
                className={
                  errors.financialResponsible?.phoneSecondary?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData((prevData) => ({
                    ...prevData,
                    financialResponsible: {
                      ...prevData.financialResponsible,
                      phoneSecondary: {
                        ...prevData.financialResponsible.phoneSecondary,
                        ddd: e.target.value,
                      },
                    },
                  }));
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              <input
                type="text"
                name="financialResponsiblePhoneSecondaryNumber"
                disabled={onlyView}
                readOnly={!student.financialResponsible?.activePhoneSecondary}
                pattern="^[+ 0-9]{9}$"
                maxLength={9}
                value={student.financialResponsible?.phoneSecondary.number}
                placeholder={
                  errors.financialResponsible?.phoneSecondary?.number
                    ? "telefone válido"
                    : "988887777"
                }
                className={
                  student.financialResponsible?.activePhoneSecondary
                    ? errors.financialResponsible?.phoneSecondary?.number
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData((prevData) => ({
                    ...prevData,
                    financialResponsible: {
                      ...prevData.financialResponsible,
                      phoneSecondary: {
                        ...prevData.financialResponsible.phoneSecondary,
                        number: e.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*?)\..*/g, "$1"),
                      },
                    },
                  }));
                }}
              />
            </div>
            {/** CHECKBOX INCLUDE NUMBER SECONDARY */}
            {!onlyView && (
              <div className="flex w-2/12 items-center gap-2">
                <input
                  type="checkbox"
                  name="activePhoneSecondary"
                  disabled={onlyView}
                  className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={activePhoneSecondary}
                  onChange={() => {
                    setActivePhoneSecondary &&
                      setActivePhoneSecondary(!activePhoneSecondary);
                    setStudentData((prevData) => ({
                      ...prevData,
                      financialResponsible: {
                        ...prevData.financialResponsible,
                        activePhoneSecondary: !activePhoneSecondary,
                        phoneSecondary: {
                          ...prevData.financialResponsible.phoneSecondary,
                          ddd: "DDD",
                        },
                      },
                    }));
                  }}
                />
                <label htmlFor="activePhoneSecondary" className="text-sm">
                  Incluir
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FINANCIAL RESPONSIBLE PHONE TERTIARY */}
      {!(onlyView && !student.financialResponsible.activePhoneTertiary) && (
        <div className="flex gap-2 items-center">
          <label
            htmlFor="phoneTertiary"
            className={
              errors.financialResponsible?.phoneTertiary
                ? "w-1/4 text-right text-red-500 dark:text-red-400"
                : "w-1/4 text-right"
            }
          >
            Telefone 3:{" "}
          </label>
          <div className="flex w-2/4 gap-2">
            <div className="flex w-full items-center gap-1">
              {/** NUMBER TERTIARY DDD */}
              <select
                id="financialResponsiblePhoneTertiaryDDD"
                disabled={
                  onlyView
                    ? true
                    : !student.financialResponsible?.activePhoneTertiary
                }
                value={
                  student.financialResponsible?.phoneTertiary.ddd !== ""
                    ? student.financialResponsible?.phoneTertiary.ddd
                    : "DDD"
                }
                className={
                  errors.financialResponsible?.phoneTertiary?.ddd
                    ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                }
                name="DDD"
                onChange={(e) => {
                  setStudentData((prevData) => ({
                    ...prevData,
                    financialResponsible: {
                      ...prevData.financialResponsible,
                      phoneTertiary: {
                        ...prevData.financialResponsible.phoneTertiary,
                        ddd: e.target.value,
                      },
                    },
                  }));
                }}
              >
                <BrazilianStateSelectOptions />
              </select>
              <input
                type="text"
                name="financialResponsiblePhoneTertiaryNumber"
                disabled={onlyView}
                readOnly={!student.financialResponsible?.activePhoneTertiary}
                pattern="^[+ 0-9]{9}$"
                maxLength={9}
                value={student.financialResponsible?.phoneTertiary.number}
                placeholder={
                  errors.financialResponsible?.phoneTertiary?.number
                    ? "telefone válido"
                    : "988887777"
                }
                className={
                  student.financialResponsible?.activePhoneTertiary
                    ? errors.financialResponsible?.phoneTertiary?.number
                      ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                      : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
                }
                onChange={(e) => {
                  setStudentData((prevData) => ({
                    ...prevData,
                    financialResponsible: {
                      ...prevData.financialResponsible,
                      phoneTertiary: {
                        ...prevData.financialResponsible.phoneTertiary,
                        number: e.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*?)\..*/g, "$1"),
                      },
                    },
                  }));
                }}
              />
            </div>
            {/** CHECKBOX INCLUDE NUMBER TERTIARY */}
            {!onlyView && (
              <div className="flex w-2/12 items-center gap-2">
                <input
                  type="checkbox"
                  name="activePhoneTertiary"
                  className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                  checked={activePhoneTertiary}
                  onChange={() => {
                    setActivePhoneTertiary &&
                      setActivePhoneTertiary(!activePhoneTertiary);
                    setStudentData((prevData) => ({
                      ...prevData,
                      financialResponsible: {
                        ...prevData.financialResponsible,
                        activePhoneTertiary: !activePhoneTertiary,
                        phoneTertiary: {
                          ...prevData.financialResponsible.phoneTertiary,
                          ddd: "DDD",
                        },
                      },
                    }));
                    setActivePhoneTertiary &&
                      setStudentData((prevData) => ({
                        ...prevData,
                        financialResponsible: {
                          ...prevData.financialResponsible,
                          phoneTertiary: {
                            ...prevData.financialResponsible.phoneTertiary,
                            ddd: "DDD",
                          },
                        },
                      }));
                  }}
                />
                <label htmlFor="activePhoneTertiary" className="text-sm">
                  Incluir
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FINANCIAL RESPONSIBLE ADDRESS */}
      {/* CEP */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsibleAddressCep"
          className={
            errors.financialResponsible?.address?.cep
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          CEP:{" "}
        </label>
        <div className="flex w-3/4 gap-2">
          <div className="w-10/12">
            <input
              type="text"
              name="financialResponsibleAddressCep"
              disabled={onlyView ?? isSubmitting}
              maxLength={8}
              placeholder={
                errors.financialResponsible?.address?.cep || cepError
                  ? "É necessário inserir um CEP"
                  : "Insira o CEP"
              }
              className={
                errors.financialResponsible?.address?.cep || cepError
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              value={student.financialResponsible.address.cep}
              onChange={(e) => {
                setCepError(false);
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      cep: formatCEP(e.target.value),
                    },
                  },
                }));
              }}
            />
          </div>
          {!onlyView && (
            <button
              type="button"
              disabled={cepSubmitting}
              className="border rounded-2xl border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/12"
              onClick={() => {
                getCep(student.financialResponsible.address.cep);
              }}
            >
              {cepSubmitting ? "Buscando..." : "Buscar"}
            </button>
          )}
        </div>
      </div>

      {/* STREET AND NUMBER */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsibleAddressStreet"
          className={
            errors.financialResponsible?.address?.street
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Rua:{" "}
        </label>
        <div className="flex w-3/4 gap-2">
          <div className={`flex w-10/12`}>
            <input
              type="text"
              name="financialResponsibleAddressStreet"
              disabled={!editAddress}
              placeholder={
                errors.financialResponsible?.address?.street
                  ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                  : "Rua / Av. / Pça"
              }
              className={
                !onlyView && editAddress
                  ? errors.financialResponsible?.address?.street
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
              }
              value={student.financialResponsible?.address?.street}
              onChange={(e) =>
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      street: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
          <div className="flex w-2/12 items-center gap-2">
            <label
              htmlFor="financialResponsibleAddressNumber"
              className="text-right"
            >
              Nº:
            </label>
            <input
              type="text"
              name="financialResponsibleAddressNumber"
              disabled={onlyView ?? isSubmitting}
              placeholder={
                errors.financialResponsible?.address?.number
                  ? "Número"
                  : "Número"
              }
              className={
                errors.financialResponsible?.address?.number
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              value={student.financialResponsible?.address?.number}
              onChange={(e) =>
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      number: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* NEIGHBORHOOD AND COMPLEMENT */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsibleAddressNeighborhood"
          className={
            errors.financialResponsible?.address?.neighborhood
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Bairro:{" "}
        </label>
        <div className={`flex w-3/4 gap-2 items-center`}>
          <div className="w-10/12">
            <input
              type="text"
              name="financialResponsibleAddressNeighborhood"
              disabled={!editAddress}
              placeholder={
                errors.financialResponsible?.address?.neighborhood
                  ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                  : "Bairro"
              }
              className={
                !onlyView && editAddress
                  ? errors.financialResponsible?.address?.neighborhood
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
              }
              value={student.financialResponsible.address.neighborhood}
              onChange={(e) =>
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      neighborhood: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
          <div className="flex w-4/12 items-center gap-2">
            <label
              htmlFor="financialResponsibleAddressComplement"
              className="text-right"
            >
              Complemento:
            </label>
            <input
              type="text"
              name="financialResponsibleAddressComplement"
              disabled={onlyView ?? isSubmitting}
              placeholder={"Apto | Bloco"}
              className={
                errors.financialResponsible?.address
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              value={student.financialResponsible.address.complement}
              onChange={(e) =>
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      complement: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* CITY AND STATE */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="financialResponsibleAddressCity"
          className={
            errors.financialResponsible?.address?.city
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Cidade:{" "}
        </label>
        <div className={`flex w-3/4 gap-2 items-center`}>
          <div className={`flex w-10/12`}>
            <input
              type="text"
              name="financialResponsibleAddressCity"
              disabled={!editAddress}
              placeholder={
                errors.financialResponsible?.address?.city
                  ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                  : "Cidade"
              }
              className={
                !onlyView && editAddress
                  ? errors.financialResponsible?.address?.city
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
              }
              value={student.financialResponsible.address.city}
              onChange={(e) =>
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      city: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
          <div className="flex w-2/12 items-center gap-2">
            <label
              htmlFor="financialResponsibleAddressState"
              className="text-right"
            >
              Estado:
            </label>
            <input
              type="text"
              name="financialResponsibleAddressState"
              disabled={!editAddress}
              placeholder={
                errors.financialResponsible?.address?.state
                  ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                  : "UF"
              }
              className={
                !onlyView && editAddress
                  ? errors.financialResponsible?.address?.state
                    ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                    : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default opacity-70"
              }
              value={student.financialResponsible.address.state}
              onChange={(e) =>
                setStudentData((prevData) => ({
                  ...prevData,
                  financialResponsible: {
                    ...prevData.financialResponsible,
                    address: {
                      ...prevData.financialResponsible.address,
                      state: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* EDIT ADDRESS BUTTON */}
      {!onlyView && (
        <div className="flex gap-2 items-center">
          <label
            htmlFor="editAddressButton"
            className="w-1/4 text-right"
          ></label>
          <button
            type="button"
            name="editAddressButton"
            disabled={editAddress}
            className="border rounded-2xl mt-2 mb-4 border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-3/4"
            onClick={() => setEditAddress(true)}
          >
            {editAddress
              ? "Insira o Endereço manualmente, ou busque o CEP novamente"
              : "Editar Endereço"}
          </button>
        </div>
      )}
    </>
  );
};

export default FinancialResponsibleForm;
