/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { MdDelete } from "react-icons/md";

type EditFamilyButtonDetailsProps = {
  family: any;
  index: number;
  handleIncludeExcludeFunction: (index: number, data: any) => void;
};

export function EditFamilyButton({
  family,
  index,
  handleIncludeExcludeFunction,
}: EditFamilyButtonDetailsProps) {
  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
        Opções <IoIosArrowDown size={10} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-66 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button
            className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 ${
              family.exclude
                ? "data-[focus]:bg-klOrange-500/30"
                : "data-[focus]:bg-red-600/30"
            }`}
            onClick={() => {
              const data: any = {
                exclude: !family.exclude,
                id: family.id,
              };
              handleIncludeExcludeFunction(index, data);
            }}
          >
            <MdDelete />
            {family.exclude
              ? "Cancelar Exclusão do vínculo familiar"
              : "Excluir vínculo familiar"}
            {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                      </kbd> */}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
