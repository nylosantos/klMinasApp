import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext, useState } from "react";
import { IoPencil } from "react-icons/io5";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdUndo } from "react-icons/md";

type DropdownMenuProps = {
  curriculumId: string;
  isEditing: boolean;
  toDelete: boolean;
  onEdit: (curriculumId: string) => void;
  onDel: (curriculumId: string) => void;
};

export function DropdownMenu({
  curriculumId,
  onEdit,
  onDel,
  toDelete,
  isEditing,
}: DropdownMenuProps) {
  // GET GLOBAL DATA
  const { userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;
  const [openCurriculumRegistration, setOpenCurriculumRegistration] =
    useState(false);

  return (
    <Menu>
      <MenuButton
        onClick={() =>
          setOpenCurriculumRegistration(!openCurriculumRegistration)
        }
        className="inline-flex items-center justify-evenly rounded-mdtext-sm/6 text-green-600 hover:text-green-400"
      >
        <FaEdit size={20} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-66 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
      >
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            onClick={() => onEdit(curriculumId)}
          >
            <IoPencil size={12} />
            {isEditing ? "Cancelar edição" : "Editar"}
          </button>
        </MenuItem>

        {userFullData && userFullData.role !== "user" && (
          <div className="my-1 h-px bg-white/5" />
        )}

        <MenuItem>
          <button
            className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 ${
              toDelete
                ? "data-[focus]:bg-klOrange-500/30"
                : "data-[focus]:bg-red-600/30"
            }`}
            onClick={() => {
              onDel(curriculumId), isEditing && onEdit(curriculumId);
            }}
          >
            {toDelete ? (
              <MdUndo className="text-green-600" />
            ) : (
              <MdDelete className="text-red-600" />
            )}
            {toDelete ? "Cancelar Exclusão" : "Excluir"}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
