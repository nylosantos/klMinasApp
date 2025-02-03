import { Dispatch, SetStateAction } from "react";
import { IoIosArrowBack } from "react-icons/io";

type DashboardSectionAddHeaderProps = {
  setShowList: Dispatch<SetStateAction<boolean>>;
  title: string;
  showList: boolean;
};

export default function DashboardSectionAddHeader({
  setShowList,
  title,
  showList,
}: DashboardSectionAddHeaderProps) {
  return (
    <div className="flex w-full items-center">
      <div className="absolute w-auto px-1 md:px-3 items-center gap-2 rounded-md text-xs md:text-sm/6 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 text-gray-100 dark:text-white focus:outline-none hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        <button
          className="flex w-full gap-2 items-center justify-evenly text-gray-100"
          onClick={() => setShowList(!showList)}
        >
          <span className="text-klOrange-500">
            <IoIosArrowBack size={10} />
          </span>{" "}
          Voltar
        </button>
      </div>
      <p className="w-full px-2 py-1 dark:text-gray-100 cursor-default text-center font-bold text-base">
        {title}
      </p>
    </div>
  );
}
