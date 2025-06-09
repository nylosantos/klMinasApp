import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { FaList } from "react-icons/fa6";

type EditCurriculumButtonDetailsProps = {
  curriculumId?: string;
  dashboardView: boolean;
  classCall: boolean;
  setDashboardView: Dispatch<SetStateAction<boolean>>;
  setModal?: Dispatch<SetStateAction<boolean>>;
  setClassCall: Dispatch<SetStateAction<boolean>>;
  handleDeleteClass?: () => void;
  onCloseLogModal?: (curriculumId: string) => void; // Função para fechar o modal
};

export function EditDashboardCurriculumButton({
  curriculumId,
  dashboardView,
  classCall,
  handleDeleteClass,
  setDashboardView,
  setModal,
  setClassCall,
  onCloseLogModal,
}: EditCurriculumButtonDetailsProps) {
  // GET GLOBAL DATA
  const { userFullData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;
  return (
    <Menu>
      <MenuButton className="w-auto px-3 inline-flex items-center justify-evenly rounded-md md:bg-klGreen-500 md:dark:bg-klGreen-500/50 py-[0.325rem] text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white md:hover:dark:bg-klGreen-500 md:hover:bg-klGreen-500/80">
        <p className="hidden md:flex">Opções</p>
        <div className="hidden md:flex">
          <IoIosArrowDown size={10} />
        </div>
        <div className="flex md:hidden text-klOrange-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-[2.5vh] h-[2.5vh]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
            />
          </svg>
        </div>
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
              if (userFullData && userFullData.role === "teacher") {
                setClassCall(!classCall);
              } else {
                setDashboardView(!dashboardView);
              }
            }}
          >
            <IoPencil size={12} />
            {dashboardView
              ? userFullData && userFullData.role === "teacher"
                ? classCall
                  ? "Detalhes da Turma"
                  : "Registro de Aula"
                : "Editar"
              : "Cancelar edição"}
          </button>
        </MenuItem>

        <div className="my-1 h-px bg-white/5" />

        {userFullData && userFullData.role !== "teacher" && (
          <>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
                onClick={() => onCloseLogModal && curriculumId && onCloseLogModal(curriculumId)}
              >
                <FaList />
                Ver Logs
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
          </>
        )}

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
