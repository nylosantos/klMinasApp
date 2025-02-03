import { Dispatch, SetStateAction } from "react";
import { UserFullDataProps } from "../../@types";

type SearchInputModalProps = {
  title: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  userFullData: UserFullDataProps | undefined;
  renderFiltersInput(): JSX.Element;
};

export default function SearchInputModal({
  title,
  mobileMenuOpen,
  setMobileMenuOpen,
  userFullData,
  renderFiltersInput,
}: SearchInputModalProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[75vw] max-w-[75vw] md:w-[20vw] md:max-w-[20vw] p-[4vh] bg-white dark:bg-gray-800/95 transform transition-transform duration-300 ease-in-out z-50 ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-white dark:bg-klGreen-500/40" />
      <div className="relative z-10 flex justify-between items-center mb-[4vh]">
        <p className="relative z-10 text-klGreen-500 dark:text-klOrange-500">
          Procurar {title}
        </p>
        <button
          className="text-klGreen-500 dark:text-klOrange-500"
          onClick={() => setMobileMenuOpen(false)}
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
        <ul className="relative z-10">{renderFiltersInput()}</ul>
      )}
    </div>
  );
}
