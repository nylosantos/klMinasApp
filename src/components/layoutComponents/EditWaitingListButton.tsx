import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { ExcludeWaitingListProps } from "../../@types";

type EditWaitingListButtonDetailsProps = {
  studentId: string;
  curriculum: ExcludeWaitingListProps;
  index: number;
  handleIncludeExcludeFunction: (
    index: number,
    data: ExcludeWaitingListProps
  ) => void;
  handleEnrollClick: (id: string) => void;
  showEnrollWaitingCurriculumDetails: boolean;
  setShowEnrollWaitingCurriculumDetails: Dispatch<SetStateAction<boolean>>;
};

export function EditWaitingListButton({
  curriculum,
  index,
  studentId,
  showEnrollWaitingCurriculumDetails,
  handleEnrollClick,
  handleIncludeExcludeFunction,
  setShowEnrollWaitingCurriculumDetails,
}: EditWaitingListButtonDetailsProps) {
  // GET GLOBAL DATA
  const { handleOneCurriculumDetails } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  const waitingListPosition =
    handleOneCurriculumDetails(curriculum.id)
      .waitingList.sort(
        (a, b) => Number(a.date.toDate()) - Number(b.date.toDate())
      )
      .findIndex((student) => student.id === studentId) + 1;

  const placesAvailable =
    handleOneCurriculumDetails(curriculum.id).placesAvailable -
    handleOneCurriculumDetails(curriculum.id).students.length;

  return (
    <Menu>
      <MenuButton className="w-[5.65vw] inline-flex items-center justify-evenly rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-0 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        Opções <IoIosArrowDown size={10} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-66 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {placesAvailable > 0 && waitingListPosition <= placesAvailable ? (
          <MenuItem>
            <button
              className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 ${
                showEnrollWaitingCurriculumDetails
                  ? "data-[focus]:bg-white/10"
                  : "data-[focus]:bg-green-600/30"
              }`}
              onClick={() =>
                showEnrollWaitingCurriculumDetails
                  ? setShowEnrollWaitingCurriculumDetails(false)
                  : handleEnrollClick(curriculum.id)
              }
            >
              <IoPencil size={10} /> Efetuar Matrícula
            </button>
          </MenuItem>
        ) : (
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              <FaRegClock />
              Posição na lista de espera: {waitingListPosition}º
            </button>
          </MenuItem>
        )}
        <div className="my-1 h-px bg-white/5" />
        <MenuItem>
          <button
            className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 ${
              curriculum.exclude
                ? "data-[focus]:bg-klOrange-500/30"
                : "data-[focus]:bg-red-600/30"
            }`}
            onClick={() => {
              const data: ExcludeWaitingListProps = {
                exclude: !curriculum.exclude,
                id: curriculum.id,
                date: curriculum.date,
              };
              handleIncludeExcludeFunction(index, data);
            }}
          >
            <MdDelete />
            {curriculum.exclude
              ? "Cancelar Saída da lista de espera"
              : "Sair da lista de espera"}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
