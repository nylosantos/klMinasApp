import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext } from "react";
import { FaList } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

type EditTeacherButtonDetailsProps = {
  isEdit: boolean;
  setIsEdit: (option: boolean) => void;
  resetTeacherData: () => void;
  setModal?: (option: boolean) => void;
  handleDeleteTeacher?: () => void;
  id?: string;
  onCloseLogModal?: (teacherId: string) => void; // Função para fechar o modal
};

export function EditDashboardTeacherButton({
  isEdit,
  handleDeleteTeacher,
  resetTeacherData,
  setIsEdit,
  setModal,
  id,
  onCloseLogModal,
}: EditTeacherButtonDetailsProps) {
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
        className="w-66 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
      >
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={() => {
              setIsEdit(!isEdit);
              resetTeacherData();
            }}
          >
            <IoPencil size={12} />
            {!isEdit ? "Editar" : "Cancelar edição"}
          </button>
        </MenuItem>

        <div className="my-1 h-px bg-white/5" />

        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
            onClick={() => handleDeleteTeacher && handleDeleteTeacher()}
          >
            <MdDelete />
            Deletar Professor
          </button>
        </MenuItem>

        {userFullData && userFullData.role !== "user" && (
          <>
            <div className="my-1 h-px bg-white/5" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
                onClick={() => onCloseLogModal && id && onCloseLogModal(id)}
              >
                <FaList />
                Ver Logs
              </button>
            </MenuItem>
          </>
        )}

        <div className="my-1 h-px bg-white/5" />

        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={() => {
              setModal && setModal(false);
            }}
          >
            <IoClose size={12} />
            Fechar
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
