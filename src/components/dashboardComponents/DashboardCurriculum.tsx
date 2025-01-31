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
  CurriculumSearchProps,
} from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  IoIosAddCircleOutline,
  IoIosArrowBack,
  IoMdClose,
} from "react-icons/io";
import { InsertCurriculum } from "../insertComponents/InsertCurriculum";
import EditCurriculumForm from "../formComponents/EditCurriculumForm";
import { TbFilterSearch } from "react-icons/tb";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";

interface DashboardCurriculumProps {
  isDetailsViewing: boolean;
  isEdit: boolean;
  isFinance: boolean;
  setIsDetailsViewing: Dispatch<SetStateAction<boolean>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCurriculum({
  setIsDetailsViewing,
  setIsEdit,
  setOpen,
}: DashboardCurriculumProps) {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    userFullData,
    handleDeleteCurriculum,
    handleOneCurriculumDetails,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CURRICULUM LIST OR ADD CURRICULUM STATE
  const [showCurriculumList, setShowCurriculumList] = useState(true);

  // MODAL STATE
  const [modal, setModal] = useState(false);

  // CURRICULUM SELECTED FOR SHOW DETAILS STATE
  const [curriculumSelected, setCurriculumSelected] =
    useState<CurriculumSearchProps>();

  // OPEN DETAILS FUNCTION
  const handleClickOpen = ({ id, option }: HandleClickOpenFunctionProps) => {
    const curriculumToShow = filteredCurriculum.find(
      (curriculum) => curriculum.id === id
    );
    if (curriculumToShow) {
      setCurriculumSelected(curriculumToShow);
      setOpen(true);
      if (option === "details") {
        setIsDetailsViewing(true);
        setIsEdit(false);
      } else if (option === "edit") {
        setIsDetailsViewing(false);
        setIsEdit(true);
      } else {
        setIsDetailsViewing(false);
        setIsEdit(false);
      }
    }
  };

  // MOBILE MENU FILTER STATE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // CLOSE DETAILS FUNCTION
  const handleClose = () => {
    setCurriculumSelected(undefined);
    setOpen(false);
    setIsEdit(false);
    setIsDetailsViewing(false);
  };

  const [filters, setFilters] = useState({
    publicId: "",
    school: "",
    schoolYear: "",
    modality: "",
    schedule: "",
    teacher: "",
  });

  // FILTER Curriculum STATE
  const [filteredCurriculum, setFilteredCurriculum] = useState<
    CurriculumSearchProps[]
  >(curriculumDatabaseData);

  // FILTER CURRICULUM
  useEffect(() => {
    // Realiza os filtros com base nos inputs
    let filteredByPublicId = curriculumDatabaseData;
    let filteredBySchool = curriculumDatabaseData;
    let filteredBySchoolYear = curriculumDatabaseData;
    let filteredByModality = curriculumDatabaseData;
    let filteredBySchedule = curriculumDatabaseData;
    let filteredByTeacher = curriculumDatabaseData;

    if (filters.publicId) {
      filteredByPublicId = curriculumDatabaseData.filter((curriculum) =>
        curriculum.publicId
          ?.toString()
          .toLowerCase()
          .includes(filters.publicId.toLowerCase())
      );
    }

    if (filters.school) {
      const schoolIds = schoolDatabaseData
        .filter((school) =>
          school.name.toLowerCase().includes(filters.school.toLowerCase())
        )
        .map((school) => school.id);

      filteredBySchool = filteredBySchool.filter((curriculum) =>
        schoolIds.includes(curriculum.schoolId)
      );
    }

    if (filters.schoolYear) {
      const classIds = schoolClassDatabaseData
        .filter((schoolClass) =>
          schoolClass.name
            .toLowerCase()
            .includes(filters.schoolYear.toLowerCase())
        )
        .map((schoolClass) => schoolClass.id);

      filteredBySchoolYear = filteredBySchoolYear.filter((curriculum) =>
        curriculum.schoolClassIds.some((id) => classIds.includes(id))
      );
    }

    if (filters.modality) {
      const courseIds = schoolCourseDatabaseData
        .filter((course) =>
          course.name.toLowerCase().includes(filters.modality.toLowerCase())
        )
        .map((course) => course.id);

      filteredByModality = filteredByModality.filter((curriculum) =>
        courseIds.includes(curriculum.schoolCourseId)
      );
    }

    if (filters.schedule) {
      const scheduleIds = scheduleDatabaseData
        .filter((schedule) =>
          schedule.name.toLowerCase().includes(filters.schedule.toLowerCase())
        )
        .map((schedule) => schedule.id);

      filteredBySchedule = filteredBySchedule.filter((curriculum) =>
        scheduleIds.includes(curriculum.scheduleId)
      );
    }

    if (filters.teacher) {
      const teacherIds = teacherDatabaseData
        .filter((teacher) =>
          teacher.name.toLowerCase().includes(filters.teacher.toLowerCase())
        )
        .map((teacher) => teacher.id);

      filteredByTeacher = filteredByTeacher.filter((curriculum) =>
        teacherIds.includes(curriculum.teacherId)
      );
    }

    // Combina os filtros
    const combinedFilter = filteredBySchool
      .filter((item) => filteredByPublicId.includes(item))
      .filter((item) => filteredBySchoolYear.includes(item))
      .filter((item) => filteredByModality.includes(item))
      .filter((item) => filteredBySchedule.includes(item))
      .filter((item) => filteredByTeacher.includes(item));

    setFilteredCurriculum(combinedFilter);
  }, [
    filters,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
  ]);

  // Atualiza o valor do filtro ao digitar nos inputs
  const handleInputChange = (field: keyof typeof filters, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  // FUNCTION TO CLEAR SEARCH FIELDS
  const clearSearch = () => {
    setFilters({
      publicId: "",
      school: "",
      schoolYear: "",
      modality: "",
      schedule: "",
      teacher: "",
    });
  };

  function closeModal() {
    setModal(false);
  }

  // DELETE CURRICULUM FUNCTION
  function handleDeleteData() {
    if (curriculumSelected) {
      handleDeleteCurriculum(curriculumSelected.id, handleClose, closeModal);
    } else {
      console.log("Nenhuma turma selecionada.");
    }
  }

  function renderFiltersInput() {
    return (
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col md:flex-row w-full gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.publicId}
            onChange={(e) => handleInputChange("publicId", e.target.value)}
            placeholder="Identificador"
            className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            value={filters.school}
            onChange={(e) => handleInputChange("school", e.target.value)}
            placeholder="Escola"
            className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            value={filters.schoolYear}
            onChange={(e) => handleInputChange("schoolYear", e.target.value)}
            placeholder="Ano Escolar"
            className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
        </div>
        <div className="flex flex-col md:flex-row w-full gap-2">
          <input
            type="text"
            value={filters.modality}
            onChange={(e) => handleInputChange("modality", e.target.value)}
            placeholder="Modalidade"
            className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
          <input
            type="text"
            value={filters.teacher}
            onChange={(e) => handleInputChange("teacher", e.target.value)}
            placeholder="Professor"
            className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          />
        </div>
        <div className="flex md:hidden flex-col gap-4 mt-6">
          <button
            className="flex w-full items-center justify-center gap-4 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white outline-none active:dark:bg-klGreen-500 active:bg-klGreen-500/80 transition-all rounded-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FcFilledFilter size={15} />
            Aplicar Filtros
          </button>
          <button
            className="flex w-full items-center justify-center gap-4 bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white outline-none active:dark:bg-klGreen-500 active:bg-klGreen-500/80 transition-all rounded-xl"
            onClick={clearSearch}
          >
            <IoMdClose size={15} />
            Limpar
          </button>
        </div>
      </div>
    );
  }

  function toggleFilterIcon() {
    if (
      filters.publicId ||
      filters.school ||
      filters.schoolYear ||
      filters.modality ||
      filters.teacher
    ) {
      return <FcClearFilters />;
    } else {
      return <TbFilterSearch size={15} />;
    }
  }

  return (
    <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
      <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container rounded-xl transition-all duration-1000">
        <div className="flex w-full flex-col px-4 pb-4 gap-2">
          <div className="flex w-full gap-2 justify-start">
            {showCurriculumList ? (
              <>
                <div className="hidden md:flex w-full">
                  {renderFiltersInput()}
                </div>
                {/* MOBILE MENU BUTTON */}
                <div className="md:hidden flex items-center w-full justify-between">
                  {userFullData && (
                    <p className="relative z-10 text-klGreen-500 dark:text-klOrange-500">
                      Olá, {userFullData.name.split(" ")[0]}
                    </p>
                  )}
                  <button
                    className="text-klGreen-500 dark:text-klOrange-500"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {toggleFilterIcon()}
                  </button>
                </div>
                {userFullData &&
                  (userFullData.role === "admin" ||
                    userFullData.role === "editor") && (
                    <div className="flex flex-col gap-2">
                      <div className="w-[5.55vw] w-min-[4.55vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                        <button
                          className="flex w-full items-center justify-evenly"
                          onClick={() => setShowCurriculumList(false)}
                        >
                          <IoIosAddCircleOutline size={15} />
                          Adicionar
                        </button>
                      </div>
                      <div className="w-[5.55vw] w-min-[4.55vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                        <button
                          className="flex w-full items-center justify-evenly"
                          onClick={clearSearch}
                        >
                          <IoMdClose size={15} />
                          Limpar
                        </button>
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <>
                <div className="absolute w-[4.65vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                  <button
                    className="flex w-full items-center justify-evenly"
                    onClick={() => setShowCurriculumList(!showCurriculumList)}
                  >
                    <IoIosArrowBack size={10} /> Voltar
                  </button>
                </div>
                <p className="w-full px-2 py-1 dark:text-gray-100 cursor-default text-center font-bold text-lg">
                  Adicionar Turma
                </p>
              </>
            )}
          </div>
        </div>
        {showCurriculumList ? (
          <>
            {/* CURRICULUM LISTS */}
            <div className="flex overflow-x-auto no-scrollbar">
              <table className="table-auto w-full border-collapse border border-transparent">
                {filteredCurriculum.length !== 0 && (
                  <thead className="bg-klGreen-500 sticky top-0 text-gray-100 text-sm md:text-base z-40">
                    <tr>
                      <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                        #ID
                      </th>
                      <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                        Escola
                      </th>
                      <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                        Ano Escolar
                      </th>
                      <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                        Modalidade
                      </th>
                      <th className="p-2 font-normal">Professor</th>
                    </tr>
                  </thead>
                )}
                <tbody className="[&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 text-sm md:text-base">
                  {filteredCurriculum.length ? (
                    filteredCurriculum
                      .sort((a, b) =>
                        handleOneCurriculumDetails(
                          a.id
                        ).schoolName.localeCompare(
                          handleOneCurriculumDetails(b.id).schoolName
                        )
                      )
                      // .sort((a, b) =>
                      //   handleOneCurriculumDetails(
                      //     a.id
                      //   ).scheduleName.localeCompare(
                      //     handleOneCurriculumDetails(b.id).scheduleName
                      //   )
                      // )
                      .sort((a, b) =>
                        handleOneCurriculumDetails(
                          a.id
                        ).schoolCourseName.localeCompare(
                          handleOneCurriculumDetails(b.id).schoolCourseName
                        )
                      )
                      .sort((a, b) => a.publicId! - b.publicId!)
                      .map((curriculum, index) => (
                        <>
                          <tr
                            key={index}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              if (
                                curriculumSelected &&
                                curriculumSelected.id === curriculum.id
                              ) {
                                setCurriculumSelected(undefined);
                              } else {
                                handleClickOpen({
                                  id: curriculum.id,
                                  option: "details",
                                });
                                setModal(true);
                              }
                            }}
                          >
                            <td
                              key={index}
                              className="border-r dark:border-klGreen-500 p-2 text-center"
                            >
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .publicId
                              }
                            </td>
                            <td
                              key={index + 1}
                              className="border-r dark:border-klGreen-500 p-2 text-center"
                            >
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolName
                              }
                            </td>
                            <td
                              key={index + 2}
                              className="border-r dark:border-klGreen-500 p-2 text-center"
                            >
                              {handleOneCurriculumDetails(
                                curriculum.id
                              ).schoolClassNames.join(" - ")}
                            </td>
                            <td
                              key={index + 3}
                              className="border-r dark:border-klGreen-500 p-2 text-center"
                            >
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolCourseName
                              }
                            </td>
                            <td key={index + 4} className="p-2 text-center">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .teacherName
                              }
                            </td>
                          </tr>
                        </>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-4">
                        <p className="text-klGreen-500 dark:text-white">
                          Nenhuma turma encontrada
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <InsertCurriculum />
        )}
      </div>
      {modal && curriculumSelected && (
        <div
          className="relative z-50"
          aria-labelledby="crop-image-dialog"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
          <div className="flex fixed inset-0 z-10 w-screen min-h-screen items-center justify-center overflow-scroll no-scrollbar">
            <EditCurriculumForm
              curriculumId={curriculumSelected.id}
              onlyView
              modal={modal}
              setModal={setModal}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              handleDeleteClass={handleDeleteData}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
      {/* BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[75vw] max-w-[75vw] p-[4vh] bg-white dark:bg-gray-800/95 transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 bg-klGreen-500/20 dark:bg-klGreen-500/40" />
        <div className="relative z-10 flex justify-between items-center mb-[4vh]">
          <p className="relative z-10 text-klGreen-500 dark:text-klOrange-500">
            Procurar Turma
          </p>
          <button
            className="text-klGreen-500 dark:text-klOrange-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[3vh] h-[3vh]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {userFullData && (
          <ul className="relative z-10">{renderFiltersInput()}</ul>
        )}
      </div>
    </div>
  );
}
