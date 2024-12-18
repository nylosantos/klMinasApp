import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

type EditCurriculumButtonDetailsProps = {
  dashboardView: boolean;
  setDashboardView: (option: boolean) => void;
  setModal?: (option: boolean) => void;
  handleDeleteClass?: () => void;
};

export function EditDashboardCurriculumButton({
  dashboardView,
  handleDeleteClass,
  setDashboardView,
  setModal,
}: EditCurriculumButtonDetailsProps) {
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
              setDashboardView(!dashboardView);
            }}
          >
            <IoPencil size={12} />
            {dashboardView ? "Editar" : "Cancelar edição"}
          </button>
        </MenuItem>

        <div className="my-1 h-px bg-white/5" />

        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
            onClick={() => handleDeleteClass && handleDeleteClass()}
          >
            <MdDelete />
            Deletar Turma
          </button>
        </MenuItem>

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
