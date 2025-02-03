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
  SchoolCourseSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { IoMdClose } from "react-icons/io";
import { InsertCourse } from "../insertComponents/InsertCourse";
import EditCourseForm from "../formComponents/EditCourseForm";
import { CourseButtonDetails } from "../layoutComponents/CourseButtonDetails";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";
import { TbFilterSearch } from "react-icons/tb";
import { DashboardMenuArrayProps } from "../../pages/Dashboard";
import DashboardMenuModal from "../layoutComponents/DashboardMenuModal";
import BackdropModal from "../layoutComponents/BackdropModal";
import SearchInputModal from "../layoutComponents/SearchInputModal";
import DashboardSectionSubHeader from "../layoutComponents/DashboardSectionSubHeader";
import DashboardSectionAddHeader from "../layoutComponents/DashboardSectionAddHeader";

interface DashboardCourseProps {
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  renderDashboardMenu(itemMenu: DashboardMenuArrayProps): JSX.Element;
  itemsMenu: DashboardMenuArrayProps[];
}

export default function DashboardCourse({
  setIsEdit,
  isEdit,
  renderDashboardMenu,
  itemsMenu,
}: DashboardCourseProps) {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolCourseDatabaseData,
    userFullData,
    handleDeleteCourse,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // COURSE LIST OR ADD COURSE STATE
  const [showCourseList, setShowCourseList] = useState(true);

  // MODAL STATE
  const [modal, setModal] = useState(false);

  // COURSE SELECTED FOR SHOW DETAILS STATE
  const [courseSelected, setCourseSelected] =
    useState<SchoolCourseSearchProps>();

  // OPEN DETAILS FUNCTION
  const handleClickOpen = ({ id, option }: HandleClickOpenFunctionProps) => {
    const courseToShow = filteredCourse.find((course) => course.id === id);
    if (courseToShow) {
      setCourseSelected(courseToShow);
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
    setCourseSelected(undefined);
    setModal(false);
    setIsEdit(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  // FILTER COURSE STATE
  const [filteredCourse, setFilteredCourse] = useState<
    SchoolCourseSearchProps[]
  >(schoolCourseDatabaseData);

  // FILTER COURSE
  useEffect(() => {
    // Realiza os filtros com base nos inputs
    setFilteredCourse(
      schoolCourseDatabaseData.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, schoolCourseDatabaseData]);

  // HANDLER FOR CHANGES IN THE COURSE NAME SEARCH FIELD
  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  function closeModal() {
    setModal(false);
  }

  // DELETE COURSE FUNCTION
  function handleDeleteData() {
    if (courseSelected) {
      handleDeleteCourse(courseSelected.id, handleClose, closeModal);
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
        <div className="flex flex-col w-full gap-2">
          <div className="flex w-full gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e)}
              placeholder="Digite o nome da Modalidade"
              className="w-full px-2 py-1 bg-klGreen-500/10 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            />
          </div>
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
        {/* <div className="flex w-full flex-col px-4 pb-4 gap-2 z-40"> */}
        <div className="flex w-full justify-start px-4 pb-4 z-40">
          {showCourseList ? (
            <DashboardSectionSubHeader
              title="Modalidades cadastradas"
              dashboardMenu={dashboardMenu}
              dataArray={schoolCourseDatabaseData}
              mobileMenuOpen={mobileMenuOpen}
              setDashboardMenu={setDashboardMenu}
              setMobileMenuOpen={setMobileMenuOpen}
              setShowList={setShowCourseList}
              toggleFilterIcon={toggleFilterIcon}
              userFullData={userFullData}
            />
          ) : (
            <DashboardSectionAddHeader
              setShowList={setShowCourseList}
              showList={showCourseList}
              title="Adicionar Modalidade"
            />
          )}
        </div>
        {/* </div> */}
        {showCourseList ? (
          <>
            {/* TEACHER LIST */}
            <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-sm [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 transition-all duration-1000">
              {filteredCourse.length ? (
                filteredCourse
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((course) => {
                    return (
                      <div className="flex flex-col px-4 py-3" key={course.id}>
                        <div className="flex items-center w-full">
                          <div className="w-1/6" />
                          <div className="flex w-4/6">
                            <p
                              className="text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                              onClick={() => {
                                handleClickOpen({
                                  id: course.id,
                                  option: "details",
                                });
                              }}
                            >
                              {course.name}
                            </p>
                          </div>
                          <CourseButtonDetails
                            id={course.id}
                            handleClickOpen={handleClickOpen}
                            handleDeleteCourse={() => {
                              handleDeleteCourse(course.id, () => {});
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex justify-center p-4 ">
                  <p className="text-klGreen-500 dark:text-white">
                    Nenhuma modalidade encontrada.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <InsertCourse />
        )}
      </div>
      {modal && courseSelected && (
        <div
          className="relative z-50"
          aria-labelledby="crop-image-dialog"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
          <div className="flex fixed inset-0 z-10 w-screen items-center justify-center overflow-y-auto">
            <EditCourseForm
              schoolCourseSelectedData={courseSelected}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              modal={modal}
              setModal={setModal}
              onClose={() => setModal(false)}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              handleDeleteCourse={handleDeleteData}
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
        title="Modalidade"
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
