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
// import { CurriculumSearchButton } from "../layoutComponents/CurriculumSearchButton";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  IoIosAddCircleOutline,
  IoIosArrowBack,
  IoMdClose,
} from "react-icons/io";
// import { EditCurriculumForm } from "../formComponents/EditCurriculumForm";
import { InsertCurriculum } from "../insertComponents/InsertCurriculum";
import EditCurriculumForm from "../formComponents/EditCurriculumForm";

interface DashboardCurriculumProps {
  isDetailsViewing: boolean;
  isEdit: boolean;
  isFinance: boolean;
  setIsDetailsViewing: Dispatch<SetStateAction<boolean>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export type PaymentArrayProps = {
  type: "enrolledFee" | "montlyPayment";
  dueDate: Date;
  paymentDate: Date | string;
  creationDate: Date;
  description: string;
  invoiceId: number;
  value: number;
};

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

  // CLOSE DETAILS FUNCTION
  const handleClose = () => {
    setCurriculumSelected(undefined);
    setOpen(false);
    setIsEdit(false);
    setIsDetailsViewing(false);
  };

  const [filters, setFilters] = useState({
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
    let filteredBySchool = curriculumDatabaseData;
    let filteredBySchoolYear = curriculumDatabaseData;
    let filteredByModality = curriculumDatabaseData;
    let filteredBySchedule = curriculumDatabaseData;
    let filteredByTeacher = curriculumDatabaseData;

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
        classIds.includes(curriculum.schoolClassId)
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
      school: "",
      schoolYear: "",
      modality: "",
      schedule: "",
      teacher: "",
    });
  };

  // DELETE curriculum FUNCTION
  function handleDeleteData() {
    if (curriculumSelected) {
      handleDeleteCurriculum(curriculumSelected.id, handleClose);
    } else {
      console.log("Nenhuma turma selecionada.");
    }
  }

  return (
    <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
      <div
        className={`w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container  rounded-xl transition-all duration-1000`}
      >
        <div className="flex w-full flex-col px-4 pb-4 gap-2">
          <div className="flex w-full gap-2 justify-start">
            {showCurriculumList ? (
              <>
                <div className="flex flex-col w-full gap-2">
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={filters.school}
                      onChange={(e) =>
                        handleInputChange("school", e.target.value)
                      }
                      placeholder="Escola"
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    />
                    <input
                      type="text"
                      value={filters.schoolYear}
                      onChange={(e) =>
                        handleInputChange("schoolYear", e.target.value)
                      }
                      placeholder="Ano Escolar"
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    />
                  </div>
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={filters.modality}
                      onChange={(e) =>
                        handleInputChange("modality", e.target.value)
                      }
                      placeholder="Modalidade"
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    />
                    {/* <input
                      type="text"
                      value={filters.schedule}
                      onChange={(e) =>
                        handleInputChange("schedule", e.target.value)
                      }
                      placeholder="Horário"
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    /> */}
                    <input
                      type="text"
                      value={filters.teacher}
                      onChange={(e) =>
                        handleInputChange("teacher", e.target.value)
                      }
                      placeholder="Professor"
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    />
                  </div>
                </div>
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
                <thead className="bg-klGreen-500 sticky top-0 text-gray-100 z-50">
                  <tr>
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
                <tbody className="[&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100">
                  {filteredCurriculum.length ? (
                    filteredCurriculum
                      .sort((a, b) =>
                        handleOneCurriculumDetails(
                          a.id
                        ).schoolName.localeCompare(
                          handleOneCurriculumDetails(b.id).schoolName
                        )
                      )
                      .sort((a, b) =>
                        handleOneCurriculumDetails(
                          a.id
                        ).scheduleName.localeCompare(
                          handleOneCurriculumDetails(b.id).scheduleName
                        )
                      )
                      .sort((a, b) =>
                        handleOneCurriculumDetails(
                          a.id
                        ).schoolCourseName.localeCompare(
                          handleOneCurriculumDetails(b.id).schoolCourseName
                        )
                      )
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
                            <td className="border-r dark:border-klGreen-500 p-2 text-center">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolName
                              }
                            </td>
                            <td className="border-r dark:border-klGreen-500 p-2 text-center">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolClassName
                              }
                            </td>
                            <td className="border-r dark:border-klGreen-500 p-2 text-center">
                              {
                                handleOneCurriculumDetails(curriculum.id)
                                  .schoolCourseName
                              }
                            </td>
                            <td className="p-2 text-center">
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
          <div className="flex fixed inset-0 z-10 w-screen items-center justify-center overflow-y-auto">
            <EditCurriculumForm
              curriculumId={curriculumSelected.id}
              onlyView
              modal={modal}
              setModal={setModal}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              handleDeleteClass={handleDeleteData}
            />
          </div>
        </div>
      )}
    </div>
  );
}
