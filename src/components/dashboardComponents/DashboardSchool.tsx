/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { HandleClickOpenFunctionProps, SchoolSearchProps } from "../../@types";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import { IoIosAddCircleOutline, IoIosArrowBack } from "react-icons/io";
import { InsertSchool } from "../insertComponents/InsertSchool";
import EditSchoolForm from "../formComponents/EditSchoolForm";
import { SchoolButtonDetails } from "../layoutComponents/SchoolButtonDetails";

interface DashboardSchoolProps {
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardSchool({
  setIsEdit,
  isEdit,
}: DashboardSchoolProps) {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolDatabaseData,
    handleDeleteSchool,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  // CURRICULUM LIST OR ADD CURRICULUM STATE
  const [showSchoolList, setShowSchoolList] = useState(true);

  // MODAL STATE
  const [modal, setModal] = useState(false);

  // CURRICULUM SELECTED FOR SHOW DETAILS STATE
  const [schoolSelected, setSchoolSelected] = useState<SchoolSearchProps>();

  // OPEN DETAILS FUNCTION
  const handleClickOpen = ({ id, option }: HandleClickOpenFunctionProps) => {
    const schoolToShow = filteredSchool.find((school) => school.id === id);
    if (schoolToShow) {
      setSchoolSelected(schoolToShow);
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
    setSchoolSelected(undefined);
    setModal(false);
    setIsEdit(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  // FILTER SCHOOL STATE
  const [filteredSchool, setFilteredSchool] =
    useState<SchoolSearchProps[]>(schoolDatabaseData);

  // FILTER CURRICULUM
  useEffect(() => {
    // Realiza os filtros com base nos inputs
    setFilteredSchool(
      schoolDatabaseData.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, schoolDatabaseData]);

  // HANDLER FOR CHANGES IN THE TEACHER NAME SEARCH FIELD
  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  function closeModal() {
    setModal(false);
  }

  // DELETE TEACHER FUNCTION
  function handleDeleteData() {
    if (schoolSelected) {
      handleDeleteSchool(schoolSelected.id, handleClose, closeModal);
    } else {
      console.log("Nenhuma escola selecionada.");
    }
  }

  return (
    <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
      <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container  rounded-xl transition-all duration-1000">
        <div className="flex w-full flex-col px-4 pb-4 gap-2 z-40">
          <div className="flex w-full gap-2 justify-start">
            {showSchoolList ? (
              <>
                <div className="flex flex-col w-full gap-2">
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearchTermChange(e)}
                      placeholder="Procurar Escola"
                      className="w-full px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-[5.55vw] w-min-[4.55vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                    <button
                      className="flex w-full items-center justify-evenly"
                      onClick={() => setShowSchoolList(false)}
                    >
                      <IoIosAddCircleOutline size={15} />
                      Adicionar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute w-[4.65vw] inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 text-sm/6 text-gray-100 dark:text-white focus:outline-none data-[open]:bg-klGreen-500/80 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
                  <button
                    className="flex w-full items-center justify-evenly"
                    onClick={() => setShowSchoolList(!showSchoolList)}
                  >
                    <IoIosArrowBack size={10} /> Voltar
                  </button>
                </div>
                <p className="w-full px-2 py-1 dark:text-gray-100 cursor-default text-center font-bold text-lg">
                  Adicionar Escola
                </p>
              </>
            )}
          </div>
        </div>
        {showSchoolList ? (
          <>
            {/* TEACHER LIST */}
            <div className="w-full ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-sm [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 transition-all duration-1000">
              {filteredSchool.length ? (
                filteredSchool
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((school) => {
                    return (
                      <div className="flex flex-col px-4 py-3" key={school.id}>
                        <div className="flex items-center w-full">
                          <div className="w-1/6" />
                          <div className="flex w-4/6">
                            <p
                              className="text-klGreen-500 dark:text-white hover:text-klOrange-500 hover:dark:text-klOrange-500 cursor-pointer"
                              onClick={() => {
                                handleClickOpen({
                                  id: school.id,
                                  option: "details",
                                });
                              }}
                            >
                              {school.name}
                            </p>
                          </div>
                          <SchoolButtonDetails
                            id={school.id}
                            handleClickOpen={handleClickOpen}
                            handleDeleteSchool={() => {
                              handleDeleteSchool(school.id, () => {});
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex justify-center p-4 ">
                  <p className="text-klGreen-500 dark:text-white">
                    Nenhum professor encontrado.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <InsertSchool />
        )}
      </div>
      {modal && schoolSelected && (
        <div
          className="relative z-50"
          aria-labelledby="crop-image-dialog"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
          <div className="flex fixed inset-0 z-10 w-screen items-center justify-center overflow-y-auto">
            <EditSchoolForm
              schoolSelectedData={schoolSelected}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              modal={modal}
              setModal={setModal}
              onClose={() => setModal(false)}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              handleDeleteSchool={handleDeleteData}
            />
          </div>
        </div>
      )}
    </div>
  );
}
