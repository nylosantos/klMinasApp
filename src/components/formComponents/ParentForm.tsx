import { useContext } from "react";
import { FieldErrors, useFormContext } from "react-hook-form";
import { BrazilianStateSelectOptions } from "./BrazilianStateSelectOptions";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

interface ParentProps {
  name?: string;
  email?: string;
  phone: {
    ddd?: string;
    number?: string;
  };
}

interface ParentFormProps<T> {
  parent: "parentOne" | "parentTwo";
  onlyView: boolean;
  student: { parentOne: ParentProps; parentTwo: ParentProps };
  setStudentData: React.Dispatch<React.SetStateAction<T>>;
}

const ParentForm = <
  T extends { parentOne: ParentProps; parentTwo: ParentProps }
>({
  parent,
  onlyView,
  student,
  setStudentData,
}: ParentFormProps<T>) => {
  // GET GLOBAL DATA
  const { isSubmitting } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  const {
    formState: { errors },
  } =
    useFormContext<
      FieldErrors<{ parentOne: ParentProps; parentTwo: ParentProps }>
    >();

  return (
    <>
      {/* PARENT E-MAIL */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="parentEmail"
          className={
            errors[parent]?.email
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          E-mail:{" "}
        </label>
        <input
          type="text"
          name="parentEmail"
          disabled={onlyView ?? isSubmitting}
          placeholder={
            errors[parent]?.email
              ? "É necessário inserir o e-mail"
              : "Insira o e-mail"
          }
          className={
            errors[parent]?.email
              ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          value={student[parent].email}
          onChange={(e) => {
            setStudentData((prevData) => ({
              ...prevData,
              [parent]: {
                ...prevData[parent],
                email: e.target.value,
              },
            }));
          }}
        />
      </div>

      {/* PARENT NAME */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="parentName"
          className={
            errors[parent]?.name
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Nome:{" "}
        </label>
        <input
          type="text"
          name="parentName"
          disabled={onlyView ?? isSubmitting}
          placeholder={
            errors[parent]?.name
              ? "É necessário inserir o nome completo"
              : "Insira o nome completo"
          }
          className={
            errors[parent]?.name
              ? "w-3/4 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
              : "w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          }
          value={student[parent].name}
          onChange={(e) => {
            setStudentData((prevData) => ({
              ...prevData,
              [parent]: {
                ...prevData[parent],
                name: e.target.value,
              },
            }));
          }}
        />
      </div>

      {/* PARENT PHONE */}
      <div className="flex gap-2 items-center">
        <label
          htmlFor="parentPhone"
          className={
            errors[parent]?.phone
              ? "w-1/4 text-right text-red-500 dark:text-red-400"
              : "w-1/4 text-right"
          }
        >
          Telefone:{" "}
        </label>
        <div className="flex w-2/4 gap-2">
          <div className="flex w-10/12 items-center gap-1">
            <select
              id="parentPhoneDDD"
              value={
                student[parent].phone.ddd !== ""
                  ? student[parent].phone.ddd
                  : "DDD"
              }
              disabled={onlyView ?? isSubmitting}
              className={
                errors[parent]?.phone?.ddd
                  ? "pr-8 px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "pr-8 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              name="DDD"
              onChange={(e) => {
                setStudentData((prevData) => ({
                  ...prevData,
                  [parent]: {
                    ...prevData[parent],
                    phone: { ...prevData[parent].phone, ddd: e.target.value },
                  },
                }));
              }}
            >
              <BrazilianStateSelectOptions />
            </select>
            <input
              type="text"
              name="parentPhoneFinal"
              pattern="^[+ 0-9]{9}$"
              disabled={onlyView ?? isSubmitting}
              maxLength={9}
              value={student[parent].phone.number}
              placeholder={
                errors[parent]?.phone ? "telefone válido" : "988887777"
              }
              className={
                errors[parent]?.phone
                  ? "w-full px-2 py-1 dark:bg-gray-800 border dark:text-gray-100 border-red-600 rounded-2xl"
                  : "w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
              }
              onChange={(e) => {
                setStudentData((prevData) => ({
                  ...prevData,
                  [parent]: {
                    ...prevData[parent],
                    phone: {
                      ...prevData[parent].phone,
                      number: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    },
                  },
                }));
              }}
            />
          </div>
          <div className="flex w-2/12 items-center gap-2"></div>
        </div>
      </div>
    </>
  );
};
export default ParentForm;
