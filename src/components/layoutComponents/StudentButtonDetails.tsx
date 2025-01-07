import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoPencil } from "react-icons/io5";
import { MdDelete, MdOutlinePreview } from "react-icons/md";
// import { TbCurrencyReal } from "react-icons/tb";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { HandleClickOpenFunctionProps } from "../../@types";

type StudentButtonDetailsProps = {
  id: string;
  isEdit: boolean;
  isFinance: boolean;
  isDetailsViewing: boolean;
  isFinancialResponsible: boolean;
  open: boolean;
  handleClose: () => void;
  handleClickOpen: ({ id, option }: HandleClickOpenFunctionProps) => void;
  setIsEdit: (option: boolean) => void;
  setIsFinance: (option: boolean) => void;
  setIsDetailsViewing: (option: boolean) => void;
  handleDeleteUser: () => void;
};

export function StudentButtonDetails({
  id,
  isEdit,
  // isFinance,
  isDetailsViewing,
  isFinancialResponsible,
  open,
  handleClose,
  handleClickOpen,
  handleDeleteUser,
  setIsEdit,
  setIsFinance,
  setIsDetailsViewing,
}: StudentButtonDetailsProps) {
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
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
      >
        {!isDetailsViewing && (
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => {
                setIsFinance(false);
                setIsDetailsViewing(true);
                setIsEdit(false);
                handleClickOpen({ id: id, option: "details" });
              }}
            >
              <MdOutlinePreview size={12} />
              Ver Detalhes
              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘E
                                      </kbd> */}
            </button>
          </MenuItem>
        )}

        {isFinancialResponsible && !isEdit && (
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => {
                setIsFinance(false);
                setIsDetailsViewing(false);
                setIsEdit(true);
                handleClickOpen({ id: id, option: "edit" });
              }}
            >
              <IoPencil size={12} />
              Editar
              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘E
                                      </kbd> */}
            </button>
          </MenuItem>
        )}

        {/* BOTÃO PARA ACESSAR PARTE FINANCEIRA - DESATIVADO ATÉ IMPLANTAÇÃO */}
        {/* {!isFinance && (
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => {
                setIsFinance(true);
                setIsDetailsViewing(false);
                setIsEdit(false);
                handleClickOpen({ id: id, option: "finance" });
              }}
            >
              <TbCurrencyReal />
              Financeiro
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                      </kbd>
            </button>
          </MenuItem>
        )} */}

        {userFullData && userFullData.role !== "user" && open && (
          <>
            <div className="my-1 h-px bg-white/5" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
                onClick={() => handleDeleteUser()}
              >
                <MdDelete />
                Deletar Cadastro
                {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                        </kbd> */}
              </button>
            </MenuItem>
          </>
        )}
        {open && (
          <>
            <div className="my-1 h-px bg-white/5" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                onClick={handleClose}
              >
                <IoClose size={12} />
                Fechar
              </button>
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
}
