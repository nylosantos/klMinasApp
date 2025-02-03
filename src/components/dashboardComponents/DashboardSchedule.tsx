/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  HandleClickOpenFunctionProps,
  ScheduleSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { IoMdClose } from "react-icons/io";
import { InsertSchedule } from "../insertComponents/InsertSchedule";
import EditScheduleForm from "../formComponents/EditScheduleForm";
import { ScheduleButtonDetails } from "../layoutComponents/ScheduleButtonDetails";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";
import { TbFilterSearch } from "react-icons/tb";
import { DashboardMenuArrayProps } from "../../pages/Dashboard";
import DashboardMenuModal from "../layoutComponents/DashboardMenuModal";
import BackdropModal from "../layoutComponents/BackdropModal";
import SearchInputModal from "../layoutComponents/SearchInputModal";
import DashboardSectionSubHeader from "../layoutComponents/DashboardSectionSubHeader";
import DashboardSectionAddHeader from "../layoutComponents/DashboardSectionAddHeader";

interface DashboardScheduleProps {
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  renderDashboardMenu(itemMenu: DashboardMenuArrayProps): JSX.Element;
  itemsMenu: DashboardMenuArrayProps[];
}

export default function DashboardSchedule({
  setIsEdit,
  isEdit,
  renderDashboardMenu,
  itemsMenu,
}: DashboardScheduleProps) {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    scheduleDatabaseData,
    userFullData,
    handleDeleteSchedule,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // SCHEDULE LIST OR ADD SCHEDULE STATE
  const [showScheduleList, setShowScheduleList] = useState(true);

  // MODAL STATE
  const [modal, setModal] = useState(false);

  // SCHEDULE SELECTED FOR SHOW DETAILS STATE
  const [scheduleSelected, setScheduleSelected] =
    useState<ScheduleSearchProps>();

  // OPEN DETAILS FUNCTION
  const handleClickOpen = ({ id, option }: HandleClickOpenFunctionProps) => {
    const scheduleToShow = filteredSchedule.find(
      (schedule) => schedule.id === id
    );
    if (scheduleToShow) {
      setScheduleSelected(scheduleToShow);
      setModal(true);
      if (option === "details") {
        setIsEdit(false);
      } else {
        setIsEdit(true);
      }
    }
  };

  // CLOSE DETAILS FUNCTION
  const handleClose = () => {
    setScheduleSelected(undefined);
    setModal(false);
    setIsEdit(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  // FILTER SCHEDULE STATE
  const [filteredSchedule, setFilteredSchedule] =
    useState<ScheduleSearchProps[]>(scheduleDatabaseData);

  // FILTER SCHEDULE
  useEffect(() => {
    // Realiza os filtros com base nos inputs
    setFilteredSchedule(
      scheduleDatabaseData.filter((schedule) =>
        schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, scheduleDatabaseData]);

  // HANDLER FOR CHANGES IN THE SCHEDULE NAME SEARCH FIELD
  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  function closeModal() {
    setModal(false);
  }

  // DELETE SCHEDULE FUNCTION
  function handleDeleteData() {
    if (scheduleSelected) {
      handleDeleteSchedule(scheduleSelected.id, handleClose, closeModal);
    } else {
      console.log("Nenhum professor selecionado.");
    }
  }

  // MOBILE MENU FILTER STATE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // DASHBOARD MENU STATE
  const [dashboardMenu, setDashboardMenu] = useState(false);

  // FILTER ACTIVE STATE
  const [filterActive, setFilterActive] = useState(false);

  // FILTER ACTIVE EFFECT
  useEffect(() => {
    if (searchTerm) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [searchTerm]);

  function toggleFilterIcon() {
    if (filterActive) {
      return (
        <span className="text-klOrange-500">
          <FcClearFilters />
        </span>
      );
    } else {
      return (
        <span className="text-klOrange-500">
          <TbFilterSearch size={15} />
        </span>
      );
    }
  }

  // CLEAR SEARCH TERM
  function clearSearch() {
    setSearchTerm("");
  }

  // FILTERS INPUT RENDER
  function renderFiltersInput() {
    return (
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e)}
            placeholder="Digite o nome do Horário"
            className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <button
            className="flex w-full items-center justify-center gap-4 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white outline-none active:dark:bg-klGreen-500 active:bg-klGreen-500/80 transition-all rounded-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FcFilledFilter size={15} />
            Aplicar Filtros
          </button>

          {filterActive && (
            <button
              className="flex w-full items-center justify-center gap-4 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white outline-none active:dark:bg-klGreen-500 active:bg-klGreen-500/80 transition-all rounded-xl"
              onClick={clearSearch}
            >
              <IoMdClose size={15} />
              Limpar Filtros
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
      <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container  rounded-xl transition-all duration-1000">
        <div className="flex w-full flex-col px-4 pb-4 gap-2 z-40">
          <div className="flex w-full gap-2 justify-start">
            {showScheduleList ? (
              <DashboardSectionSubHeader
                title="Horários cadastrados"
                dashboardMenu={dashboardMenu}
                dataArray={scheduleDatabaseData}
                mobileMenuOpen={mobileMenuOpen}
                setDashboardMenu={setDashboardMenu}
                setMobileMenuOpen={setMobileMenuOpen}
                setShowList={setShowScheduleList}
                toggleFilterIcon={toggleFilterIcon}
                userFullData={userFullData}
              />
            ) : (
              <DashboardSectionAddHeader
                setShowList={setShowScheduleList}
                showList={showScheduleList}
                title="Adicionar Horário"
              />
            )}
          </div>
        </div>
        {showScheduleList ? (
          <>
            {/* TEACHER LIST */}
            <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-sm [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 transition-all duration-1000">
              {filteredSchedule.length ? (
                filteredSchedule
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((schedule) => {
                    return (
                      <div
                        className="flex flex-col px-4 py-3"
                        key={schedule.id}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-1/6" />
                          <div className="flex w-4/6">
                            <p
                              className="text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                              onClick={() => {
                                handleClickOpen({
                                  id: schedule.id,
                                  option: "details",
                                });
                              }}
                            >
                              {schedule.name}
                            </p>
                          </div>
                          <ScheduleButtonDetails
                            id={schedule.id}
                            handleClickOpen={handleClickOpen}
                            handleDeleteSchedule={() => {
                              handleDeleteSchedule(schedule.id, () => {});
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex justify-center p-4 ">
                  <p className="text-klGreen-500 dark:text-white">
                    Nenhum horário encontrado.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <InsertSchedule />
        )}
      </div>
      {modal && scheduleSelected && (
        <div
          className="relative z-50"
          aria-labelledby="crop-image-dialog"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
          <div className="flex fixed inset-0 z-10 w-screen items-center justify-center overflow-y-auto">
            <EditScheduleForm
              scheduleSelectedData={scheduleSelected}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              modal={modal}
              setModal={setModal}
              onClose={() => setModal(false)}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              handleDeleteSchedule={handleDeleteData}
            />
          </div>
        </div>
      )}

      {/* BACKDROP */}
      {(mobileMenuOpen || dashboardMenu) && (
        <BackdropModal
          setDashboardMenu={setDashboardMenu}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      {/* MOBILE MENU DRAWER */}
      <SearchInputModal
        title="Horário"
        mobileMenuOpen={mobileMenuOpen}
        renderFiltersInput={renderFiltersInput}
        setMobileMenuOpen={setMobileMenuOpen}
        userFullData={userFullData}
      />

      {/* DASHBOARD MENU DRAWER */}
      <DashboardMenuModal
        dashboardMenu={dashboardMenu}
        itemsMenu={itemsMenu}
        renderDashboardMenu={renderDashboardMenu}
        setDashboardMenu={setDashboardMenu}
        userFullData={userFullData}
      />
    </div>
  );
}
