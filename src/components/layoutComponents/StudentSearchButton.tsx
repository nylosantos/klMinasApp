import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { useContext } from "react";
import { IoIosAddCircleOutline, IoIosArrowDown } from "react-icons/io";
import { IoClose, IoList, IoSearch } from "react-icons/io5";
// import {
//   GlobalDataContext,
//   GlobalDataContextType,
// } from "../../context/GlobalDataContext";

type StudentSearchButtonDetailsProps = {
  isAdvancedSearch: boolean;
  showStudentList: boolean;
  setShowStudentList: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAdvancedSearch: () => void;
};

export function StudentSearchButton({
  isAdvancedSearch,
  showStudentList,
  setShowStudentList,
  toggleAdvancedSearch,
}: StudentSearchButtonDetailsProps) {
  // GET GLOBAL DATA
  // const { userFullData } = useContext(
  //   GlobalDataContext
  // ) as GlobalDataContextType;

  return (
    <Menu>
      <MenuButton className="w-[5.65vw] inline-flex items-center justify-evenly rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-0 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        Opções <IoIosArrowDown size={10} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={toggleAdvancedSearch}
          >
            {isAdvancedSearch ? (
              <>
                <IoClose size={15} />
                Fechar Pesquisa Avançada
              </>
            ) : (
              <>
                <IoSearch size={15} />
                Pesquisa Avançada
              </>
            )}
            {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
              ⌘E
            </kbd> */}
          </button>
        </MenuItem>

        <div className="my-1 h-px bg-white/5" />

        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={() => setShowStudentList(!showStudentList)}
          >
            {showStudentList ? (
              <>
                <IoIosAddCircleOutline size={15} />
                Adicionar Aluno
              </>
            ) : (
              <>
                <IoList size={15} />
                Mostrar Lista de Alunos
              </>
            )}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
