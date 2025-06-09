/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IoIosAddCircleOutline } from "react-icons/io";
import { StudentSearchProps, UserFullDataProps } from "../../@types";
import { Dispatch, SetStateAction } from "react";
import { formatUserName } from "../../custom";

type DashboardSectionSubHeaderProps<T = unknown> = {
  userFullData: UserFullDataProps | undefined;
  dashboardMenu: boolean;
  mobileMenuOpen: boolean;
  setShowList: Dispatch<SetStateAction<boolean>>;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  setDashboardMenu: Dispatch<SetStateAction<boolean>>;
  toggleFilterIcon(): JSX.Element;
  dataArray: T[];
  title: string;
};

export default function DashboardSectionSubHeader<T>({
  setDashboardMenu,
  setMobileMenuOpen,
  setShowList,
  toggleFilterIcon,
  title,
  dashboardMenu,
  mobileMenuOpen,
  userFullData,
  dataArray,
}: DashboardSectionSubHeaderProps<T>) {
  return (
    <div className="flex items-center w-full justify-between">
      <div
        className={`flex w-auto rounded-md ${
          userFullData && userFullData.role !== "teacher"
            ? "bg-klGreen-500 dark:bg-klGreen-500/50"
            : "bg-transparent"
        } py-1 px-1 md:px-3 text-xs md:text-sm/6 focus:outline-none hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80`}
      >
        {userFullData && userFullData.role !== "teacher" ? (
          <button
            className="flex w-full gap-2 items-center justify-evenly text-gray-100"
            onClick={() => setShowList(false)}
          >
            <span className="text-klOrange-500">
              <IoIosAddCircleOutline size={15} />
            </span>
            Adicionar
          </button>
        ) : (
          userFullData && (
            <p className="md:hidden flex relative z-10 text-klGreen-500 dark:text-klOrange-500">
              Olá, {formatUserName(userFullData.name.split(" ")[0])}
            </p>
          )
        )}
      </div>
      {userFullData &&
        (userFullData.role === "root" ||
          userFullData.role === "admin" ||
          userFullData.role === "editor") && (
          <div className="flex w-auto rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-1 md:px-3 text-xs md:text-sm/6 focus:outline-none hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
            <button
              className="flex w-full gap-2 items-center justify-evenly text-gray-100"
              onClick={() => {
                setDashboardMenu(!dashboardMenu);
              }}
            >
              {title}:
              <span className="text-klOrange-500">
                {title === "Alunos cadastrados"
                  ? (
                      dataArray.filter(
                        //@ts-expect-error
                        (student) => student.active
                      ) as StudentSearchProps[]
                    ).length
                  : dataArray.length}
              </span>
            </button>
          </div>
        )}
      <div className="flex w-auto rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-1 md:px-3 text-xs md:text-sm/6 focus:outline-none hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        <button
          className="flex w-full gap-2 items-center justify-evenly text-gray-100"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          Pesquisar
          {toggleFilterIcon()}
        </button>
      </div>
    </div>
  );
}
