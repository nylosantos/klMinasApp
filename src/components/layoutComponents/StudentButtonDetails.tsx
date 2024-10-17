import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext } from "react";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdDelete, MdOutlinePreview } from "react-icons/md";
import { TbCurrencyReal } from "react-icons/tb";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { HandleClickOpenFunctionProps } from "../../pages/Dashboard";

type StudentButtonDetailsProps = {
  id: string;
  isEdit: boolean;
  isFinance: boolean;
  isDetailsViewing: boolean;
  isFinancialResponsible: boolean;
  open: boolean;

  handleClickOpen: ({ id, option }: HandleClickOpenFunctionProps) => void;
  handleClose: () => void;
  setIsEdit: (option: boolean) => void;
  setIsFinance: (option: boolean) => void;
  setIsDetailsViewing: (option: boolean) => void;
};

export function StudentButtonDetails({
  id,
  isEdit,
  isFinance,
  isDetailsViewing,
  isFinancialResponsible,
  open,
  handleClickOpen,
  handleClose,
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
      <MenuButton className="inline-flex items-center gap-2 rounded-md bg-klGreen-500/20 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-klGreen-500 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/10 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/10">
        Opções <IoIosArrowDown size={10} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
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

        {!isFinance && (
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
              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                      </kbd> */}
            </button>
          </MenuItem>
        )}

        {open && id !== "" && (
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={() => {
                setIsFinance(false);
                setIsDetailsViewing(false);
                setIsEdit(false);
                handleClose();
              }}
            >
              <IoMdClose />
              Fechar Detalhes
              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                          ⌘D
                                        </kbd> */}
            </button>
          </MenuItem>
        )}

        {userFullData && userFullData.role !== "user" && (
          <>
            <div className="my-1 h-px bg-white/5" />
            <MenuItem>
              <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30">
                <MdDelete />
                Deletar
                {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                      </kbd> */}
              </button>
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
}
