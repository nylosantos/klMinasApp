import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdDelete, MdOutlinePreview } from "react-icons/md";
// import { TbCurrencyReal } from "react-icons/tb";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { HandleClickOpenFunctionProps } from "../../@types";
import { FaList } from "react-icons/fa6";

type SchoolButtonDetailsProps = {
  id: string;
  handleClickOpen: ({ id, option }: HandleClickOpenFunctionProps) => void;
  handleDeleteSchool?: () => void;
  onCloseLogModal?: (schoolId: string) => void; // Função para fechar o modal
};

export function SchoolButtonDetails({
  id,
  handleClickOpen,
  handleDeleteSchool,
  onCloseLogModal,
}: SchoolButtonDetailsProps) {
  // GET GLOBAL DATA
  const { userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
    <Menu>
      <MenuButton className="w-[5.65vw] inline-flex items-center justify-evenly rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-0 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        Opções <IoIosArrowDown size={10} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-30"
      >
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={() => {
              handleClickOpen({ id: id, option: "details" });
            }}
          >
            <MdOutlinePreview size={12} />
            Ver Detalhes
          </button>
        </MenuItem>

        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={() => {
              handleClickOpen({ id: id, option: "edit" });
            }}
          >
            <IoPencil size={12} />
            Editar
          </button>
        </MenuItem>

        {userFullData && userFullData.role !== "user" && (
          <>
            <div className="my-1 h-px bg-white/5" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
                onClick={() => onCloseLogModal && onCloseLogModal(id)}
              >
                <FaList />
                Ver Logs
              </button>
            </MenuItem>
            <div className="my-1 h-px bg-white/5" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
                onClick={() => handleDeleteSchool && handleDeleteSchool()}
              >
                <MdDelete />
                Deletar Cadastro
              </button>
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
}
