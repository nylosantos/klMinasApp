import { Dispatch, SetStateAction } from "react";
import { UserFullDataProps } from "../../@types";
import { DashboardMenuArrayProps } from "../../pages/Dashboard";

type DashboardMenuModalProps = {
  userFullData: UserFullDataProps | undefined;
  dashboardMenu: boolean;
  setDashboardMenu: Dispatch<SetStateAction<boolean>>;
  renderDashboardMenu(itemMenu: DashboardMenuArrayProps): JSX.Element;
  itemsMenu: DashboardMenuArrayProps[];
};

export default function DashboardMenuModal({
  dashboardMenu,
  itemsMenu,
  renderDashboardMenu,
  setDashboardMenu,
  userFullData,
}: DashboardMenuModalProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:p-[4vh] bg-white dark:bg-gray-800/95 transform transition-transform duration-300 ease-in-out z-50 ${
        dashboardMenu ? "translate-y-0" : "translate-y-full"
      } md:h-[25vh] md:bottom-0 md:top-auto`}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-white dark:bg-klGreen-500/40" />
      <div className="relative flex justify-end items-center mb-[1vh]">
        <button
          className="flex absolute top-4 right-4 md:sticky text-klGreen-500 dark:text-klOrange-500 z-50"
          onClick={() => setDashboardMenu(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-[3vh] h-[3vh]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {userFullData && (
        <ul className="flex flex-col md:flex-row gap-4 h-full justify-center items-center md:items-start relative">
          {itemsMenu.map((itemMenu) => renderDashboardMenu(itemMenu))}
        </ul>
      )}
    </div>
  );
}
