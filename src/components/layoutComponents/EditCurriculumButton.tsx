import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { ExcludeCurriculumProps } from "../../@types";

type EditCurriculumButtonDetailsProps = {
  isExperimental?: boolean;
  openEditCurriculumDays: boolean;
  setOpenEditCurriculumDays: (option: boolean) => void;
  curriculum: ExcludeCurriculumProps;
  index: number;
  handleIncludeExcludeFunction: (
    index: number,
    data: ExcludeCurriculumProps
  ) => void;
  cancelEditFunction: (id: string) => void;
};

export function EditCurriculumButton({
  curriculum,
  index,
  isExperimental = false,
  openEditCurriculumDays,
  handleIncludeExcludeFunction,
  setOpenEditCurriculumDays,
  cancelEditFunction,
}: EditCurriculumButtonDetailsProps) {
  // GET GLOBAL DATA
  const { userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        Opções <IoIosArrowDown size={10} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {!isExperimental && (
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => {
                setOpenEditCurriculumDays(!openEditCurriculumDays);
                cancelEditFunction(curriculum.id);
              }}
            >
              <IoPencil size={12} />
              {openEditCurriculumDays ? "Cancelar edição" : "Editar"}
              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
              ⌘E
            </kbd> */}
            </button>
          </MenuItem>
        )}
        {!isExperimental && userFullData && userFullData.role !== "user" && (
          <div className="my-1 h-px bg-white/5" />
        )}

        {userFullData && userFullData.role !== "user" && (
          <MenuItem>
            <button
              className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 ${
                curriculum.exclude
                  ? "data-[focus]:bg-klOrange-500/30"
                  : "data-[focus]:bg-red-600/30"
              }`}
              onClick={() => {
                const data: ExcludeCurriculumProps = {
                  exclude: !curriculum.exclude,
                  id: curriculum.id,
                  date: curriculum.date,
                  isExperimental: curriculum.isExperimental,
                  indexDays: curriculum.indexDays,
                  price: curriculum.price,
                };
                handleIncludeExcludeFunction(index, data);
              }}
            >
              <MdDelete />
              {curriculum.exclude ? "Cancelar Exclusão" : "Excluir"}
              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                      </kbd> */}
            </button>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
}
