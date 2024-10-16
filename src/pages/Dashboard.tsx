import { useContext, useState } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import { InsertStudent } from "../components/insertComponents/InsertStudent";
import { SubmitLoading } from "../components/layoutComponents/SubmitLoading";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { TbCurrencyReal } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EditStudentForm } from "../components/formComponents/EditStudentForm";

// INITIALIZING FIRESTORE DB
// const db = getFirestore(app);

export default function Dashboard() {
  // GET GLOBAL DATA
  const {
    isSubmitting,
    schoolDatabaseData,
    schoolClassDatabaseData,
    schoolCourseDatabaseData,
    scheduleDatabaseData,
    teacherDatabaseData,
    curriculumDatabaseData,
    studentsDatabaseData,
    userFullData,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const [open, setOpen] = useState(false);

  const [studentId, setStudentId] = useState("");

  const handleClickOpen = (id: string) => {
    setStudentId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setStudentId("");
    setOpen(false);
    setIsEdit(false);
    setIsFinance(false);
  };

  const [isEdit, setIsEdit] = useState(false);
  const [isFinance, setIsFinance] = useState(false);

  function handleScheduleDetails(id: string) {
    const scheduleDetail = scheduleDatabaseData.find(
      (schedule) => schedule.id === id
    );
    if (scheduleDetail) {
      return scheduleDetail;
    } else {
      return;
    }
  }

  const [showPage, setShowPage] = useState<
    | "school"
    | "schoolClass"
    | "schoolCourse"
    | "schedule"
    | "teacher"
    | "curriculum"
    | "student"
    | "addStudent"
  >("school");

  function studentButtonDetails(id: string) {
    return (
      <Menu>
        <MenuButton className="inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-white focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-klGreen-500/70 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/70">
          Opções <IoIosArrowDown size={10} />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {!isEdit && (
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                onClick={() => {
                  setIsFinance(false);
                  setIsEdit(true);
                  handleClickOpen(id);
                }}
              >
                <IoPencil size={12} />
                Editar
                {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                      ⌘E
                                    </kbd> */}
              </button>
            </MenuItem>
          )}

          {!isFinance && (
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                onClick={() => {
                  setIsFinance(true);
                  setIsEdit(false);
                  handleClickOpen(id);
                }}
              >
                <TbCurrencyReal />
                Financeiro
                {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                      ⌘D
                                    </kbd> */}
              </button>
            </MenuItem>
          )}

          {open && studentId !== "" && (
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                onClick={() => {
                  setIsFinance(false);
                  setIsEdit(false);
                  handleClose();
                }}
              >
                <IoMdClose />
                Fechar Detalhes
                {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                        ⌘D
                                      </kbd> */}
              </button>
            </MenuItem>
          )}

          {userFullData && userFullData.role !== "user" && (
            <>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30">
                  <MdDelete />
                  Deletar
                  {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                                      ⌘D
                                    </kbd> */}
                </button>
              </MenuItem>
            </>
          )}
        </MenuItems>
      </Menu>
    );
  }

  // LOADING
  if (!userFullData) {
    return <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />;
  } else {
    return (
      <div className="w-screen h-full flex flex-col justify-start items-center overflow-scroll no-scrollbar">
        <div className="flex container items-center justify-center gap-4">
          {userFullData.role !== "user" && (
            <>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("school")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Escolas Cadastradas:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {schoolDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("schoolClass")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Anos Escolares Cadastrados:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {schoolClassDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("schoolCourse")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Modalidades Cadastradas:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {schoolCourseDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("schedule")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Horários Cadastrados:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {scheduleDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("teacher")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Professores Cadastrados:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {teacherDatabaseData.length}
                </p>
              </div>
              <div
                className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
                onClick={() => setShowPage("curriculum")}
              >
                <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                  Turmas cadastradas:
                </p>
                <p className="font-bold text-klOrange-500 text-2xl">
                  {curriculumDatabaseData.length}
                </p>
              </div>
            </>
          )}
          <div
            className="flex flex-col w-56 items-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 pt-4 rounded-xl cursor-pointer"
            onClick={() => setShowPage("student")}
          >
            <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
              Alunos Cadastrados:
            </p>
            <p className="font-bold text-klOrange-500 text-2xl">
              {studentsDatabaseData.length}
            </p>
          </div>
          {userFullData.role === "user" && (
            <div
              className="flex flex-col w-56 h-32 items-center justify-center gap-2 text-center bg-klGreen-500/20 dark:bg-klGreen-500/50 py-2 rounded-xl cursor-pointer"
              onClick={() => setShowPage("addStudent")}
            >
              <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
                Adicionar Aluno
              </p>
            </div>
          )}
        </div>
        <div
          className={
            showPage === "curriculum"
              ? `pb-4 flex h-full overflow-scroll no-scrollbar flex-wrap justify-center container mt-4 [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl gap-2`
              : showPage === "student"
              ? "pb-4 flex h-full overflow-scroll no-scrollbar justify-center w-full"
              : `pb-4 flex h-full overflow-scroll no-scrollbar flex-col container mt-4 [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl`
          }
        >
          {userFullData.role !== "user" && (
            <>
              {showPage === "school" &&
                (schoolDatabaseData.length !== 0 ? (
                  schoolDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((school) => {
                      return (
                        <div
                          className="flex justify-center p-4"
                          key={school.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {school.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhuma escola cadastrada.
                    </p>
                  </div>
                ))}
              {showPage === "schoolClass" &&
                (schoolClassDatabaseData.length !== 0 ? (
                  schoolClassDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((schoolClass) => {
                      return (
                        <div
                          className="flex justify-center p-4 "
                          key={schoolClass.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {schoolClass.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum Ano Escolar cadastrado.
                    </p>
                  </div>
                ))}
              {showPage === "schoolCourse" &&
                (schoolCourseDatabaseData.length !== 0 ? (
                  schoolCourseDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((schoolCourse) => {
                      return (
                        <div
                          className="flex justify-center p-4 "
                          key={schoolCourse.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {schoolCourse.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhuma modalidade cadastrada.
                    </p>
                  </div>
                ))}
              {showPage === "schedule" &&
                (scheduleDatabaseData.length !== 0 ? (
                  scheduleDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((schedule) => {
                      return (
                        <div
                          className="flex justify-center p-4 "
                          key={schedule.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {schedule.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum horário cadastrado.
                    </p>
                  </div>
                ))}
              {showPage === "teacher" &&
                (teacherDatabaseData.length !== 0 ? (
                  teacherDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((teacher) => {
                      return (
                        <div
                          className="flex justify-center p-4"
                          key={teacher.id}
                        >
                          <p className="text-klGreen-500 dark:text-white">
                            {teacher.name}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum professor cadastrado.
                    </p>
                  </div>
                ))}
              {showPage === "curriculum" &&
                (curriculumDatabaseData.length !== 0 ? (
                  curriculumDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((curriculum) => {
                      return (
                        <div
                          key={curriculum.id}
                          className="flex flex-col w-3/12 items-left p-4 my-4 gap-6 bg-white/50 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl text-left"
                        >
                          <p>
                            Colégio:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.school}
                            </span>
                          </p>

                          <p>
                            Ano Escolar:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.schoolClass}
                            </span>
                          </p>

                          <p>
                            Modalidade:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.schoolCourse}
                            </span>
                          </p>
                          <p>
                            Dias:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.classDay}
                            </span>
                          </p>
                          {handleScheduleDetails(curriculum.scheduleId) !==
                            undefined && (
                            <p>
                              Horário:{" "}
                              <span className="text-red-600 dark:text-yellow-500">
                                De{" "}
                                {`${handleScheduleDetails(
                                  curriculum.scheduleId
                                )!.classStart.slice(0, 2)}h${
                                  handleScheduleDetails(
                                    curriculum.scheduleId
                                  )!.classStart.slice(3, 5) === "00"
                                    ? ""
                                    : handleScheduleDetails(
                                        curriculum.scheduleId
                                      )!.classStart.slice(3, 5) + "min"
                                } a ${handleScheduleDetails(
                                  curriculum.scheduleId
                                )!.classEnd.slice(0, 2)}h${
                                  handleScheduleDetails(
                                    curriculum.scheduleId
                                  )!.classEnd.slice(3, 5) === "00"
                                    ? ""
                                    : handleScheduleDetails(
                                        curriculum.scheduleId
                                      )!.classEnd.slice(3, 5) + "min"
                                } (${curriculum.schedule})`}
                              </span>
                            </p>
                          )}
                          <p>
                            Professor:{" "}
                            <span className="text-red-600 dark:text-yellow-500">
                              {curriculum.teacher}
                            </span>
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhuma turma cadastrada.
                    </p>
                  </div>
                ))}
            </>
          )}
          {showPage === "student" && (
            <div className="flex w-full h-full justify-start container no-scrollbar rounded-xl pt-4 gap-4">
              <div
                className={`${
                  open && studentId !== "" ? "w-2/6" : "w-full"
                } ease-in-out flex flex-col h-full overflow-scroll no-scrollbar container [&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 rounded-xl transition-all duration-1000`}
              >
                {studentsDatabaseData.length !== 0 ? (
                  studentsDatabaseData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((student) => {
                      return (
                        <div
                          className="flex flex-col px-4 py-3"
                          key={student.id}
                        >
                          <div className="flex items-center w-full">
                            <div className="w-1/6" />
                            <p className="w-4/6 text-klGreen-500 dark:text-white">
                              {student.name}
                            </p>
                            {
                              !open &&
                                studentId === "" &&
                                studentButtonDetails(student.id)
                              // <Menu>
                              //   <MenuButton className="inline-flex items-center gap-2 rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-1 px-3 text-sm/6 text-white focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-klGreen-500/70 data-[open]:dark:bg-klGreen-500 data-[focus]:outline-1 data-[focus]:outline-white hover:dark:bg-klGreen-500 hover:bg-klGreen-500/70">
                              //     Opções <IoIosArrowDown size={10} />
                              //   </MenuButton>
                              //   <MenuItems
                              //     transition
                              //     anchor="bottom end"
                              //     className="w-52 origin-top-right rounded-xl border border-white/5 bg-klGreen-500 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                              //   >
                              //     {open && studentId !== "" && (
                              //       <MenuItem>
                              //         <button
                              //           className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30"
                              //           onClick={() => {
                              //             setIsFinance(false);
                              //             setIsEdit(false);
                              //             handleClose();
                              //           }}
                              //         >
                              //           <MdDelete />
                              //           Fechar
                              //           {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                              //           ⌘D
                              //         </kbd> */}
                              //         </button>
                              //       </MenuItem>
                              //     )}
                              //     {!isEdit && (
                              //       <MenuItem>
                              //         <button
                              //           className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                              //           onClick={() => {
                              //             setIsFinance(false);
                              //             setIsEdit(true);
                              //             handleClickOpen(student.id);
                              //           }}
                              //         >
                              //           <IoPencil size={12} />
                              //           Editar
                              //           {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                              //         ⌘E
                              //       </kbd> */}
                              //         </button>
                              //       </MenuItem>
                              //     )}
                              //     {!isFinance && (
                              //       <MenuItem>
                              //         <button
                              //           className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                              //           onClick={() => {
                              //             setIsFinance(true);
                              //             setIsEdit(false);
                              //             handleClickOpen(student.id);
                              //           }}
                              //         >
                              //           <TbCurrencyReal />
                              //           Financeiro
                              //           {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                              //         ⌘D
                              //       </kbd> */}
                              //         </button>
                              //       </MenuItem>
                              //     )}
                              //     <div className="my-1 h-px bg-white/5" />
                              //     <MenuItem>
                              //       <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-red-600/30">
                              //         <MdDelete />
                              //         Deletar
                              //         {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                              //         ⌘D
                              //       </kbd> */}
                              //       </button>
                              //     </MenuItem>
                              //   </MenuItems>
                              // </Menu>
                            }
                            {/* <p
                              className={`flex items-center justify-center gap-1 w-20 text-white cursor-pointer ${
                                studentId === student.id
                                  ? "bg-red-600 hover:bg-red-800"
                                  : "bg-klGreen-500 dark:bg-klGreen-500/50 hover:dark:bg-klGreen-500 hover:bg-klGreen-500/70"
                              } rounded py-1 text-center transition-all duration-100`}
                              onClick={() => {
                                if (studentId === student.id) {
                                  handleClose();
                                } else {
                                  handleClickOpen(student.id);
                                }
                              }}
                            >
                              {studentId === student.id ? (
                                "Fechar"
                              ) : (
                                <>
                                  Opções <IoIosArrowDown size={10} />
                                </>
                              )}
                            </p> */}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex justify-center p-4 ">
                    <p className="text-klGreen-500 dark:text-white">
                      Nenhum aluno cadastrado.
                    </p>
                  </div>
                )}
              </div>
              {open && isEdit && (
                <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-white dark:bg-gray-800 overflow-scroll no-scrollbar">
                  <EditStudentForm
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    studentId={studentId}
                    key={studentId}
                    onClose={handleClose}
                  />
                </div>
              )}
              {open && studentId !== "" && (
                <div>{studentButtonDetails(studentId)}</div>
              )}
              {/* EDIT STUDENT MODAL */}
              {/* {open && studentId !== "" && (
                <EditStudentModal
                  open={open && studentId !== ""}
                  studentId={studentId}
                  onClose={handleClose}
                />
              )} */}
            </div>
          )}
          {userFullData.role === "user" && showPage === "addStudent" && (
            <div className="flex flex-col w-screen px-8 pb-8 gap-6 items-center">
              <InsertStudent />
            </div>
          )}
        </div>
      </div>
    );
  }
}
