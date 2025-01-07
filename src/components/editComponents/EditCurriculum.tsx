/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import { SelectOptions } from "../formComponents/SelectOptions";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import EditCurriculumForm from "../formComponents/EditCurriculumForm";

export function EditCurriculum() {
  // CURRICULUM DATA
  const [curriculumSelectedIds, setCurriculumSelectedIds] = useState({
    schoolId: "",
    schoolClassId: "",
    curriculumId: "",
  });

  // CURRICULUM SELECTED AND EDIT ACTIVE STATES
  const [isSelected, setIsSelected] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // -------------------------- SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //
  // SET SCHOOL SELECTED STATE AND RESET SELECTS ABOVE SELECT SCHOOL WHEN SELECT SCHOOL
  useEffect(() => {
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setIsEdit(false);
  }, [curriculumSelectedIds.schoolId]);
  // -------------------------- END OF SCHOOL SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //
  // SET SCHOOL CLASS SELECTED STATE AND RESET SELECTS ABOVE SELECT SCHOOL CLASS WHEN SELECT SCHOOL CLASS
  useEffect(() => {
    (
      document.getElementById("curriculumSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setIsSelected(false);
    setIsEdit(false);
  }, [curriculumSelectedIds.schoolClassId]);
  // -------------------------- END OF SCHOOL CLASS SELECT STATES AND FUNCTIONS -------------------------- //

  // -------------------------- CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //
  // SET CURRICULUM SELECTED STATE WHEN SELECT CURRICULUM
  useEffect(() => {
    if (curriculumSelectedIds.curriculumId !== "") {
      setIsSelected(true);
      setIsEdit(false);
    } else {
      // setCurriculumSelectedData(undefined);
      setIsSelected(false);
      setIsEdit(false);
    }
  }, [curriculumSelectedIds.curriculumId]);
  // -------------------------- END OF CURRICULUM SELECT STATES AND FUNCTIONS -------------------------- //

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RESET FORM FUNCTION
  const resetForm = () => {
    (
      document.getElementById("schoolSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    (
      document.getElementById("schoolClassSelect") as HTMLSelectElement
    ).selectedIndex = 0;
    setCurriculumSelectedIds({
      schoolId: "",
      schoolClassId: "",
      curriculumId: "",
    });
    setIsSelected(false);
    setIsEdit(false);
  };

  return (
    <div className="flex h-full flex-col container text-center overflow-scroll no-scrollbar rounded-xl">
      {/* SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />

      {/* PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Editar Turma</h1>

      {/* FORM */}
      <div
        // onSubmit={handleSubmit(handleEditCurriculum)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/* SCHOOL SELECT */}
        <div className="flex gap-2 items-center">
          <label htmlFor="schoolSelect" className="w-1/4 text-right">
            Selecione a Escola:{" "}
          </label>
          <select
            id="schoolSelect"
            defaultValue={" -- select an option -- "}
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            name="schoolSelect"
            onChange={(e) => {
              setCurriculumSelectedIds({
                ...curriculumSelectedIds,
                schoolId: e.target.value,
              });
            }}
          >
            <SelectOptions returnId dataType="schools" />
          </select>
        </div>

        {/* SCHOOL CLASS SELECT */}
        <div className="flex gap-2 items-center">
          <label htmlFor="schoolClassSelect" className="w-1/4 text-right">
            Selecione o Ano Escolar:{" "}
          </label>
          <select
            id="schoolClassSelect"
            defaultValue={" -- select an option -- "}
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            name="schoolClassSelect"
            onChange={(e) => {
              setCurriculumSelectedIds({
                ...curriculumSelectedIds,
                schoolClassId: e.target.value,
              });
            }}
          >
            {curriculumSelectedIds.schoolId ? (
              <SelectOptions
                returnId
                dataType="schoolClasses"
                schoolId={curriculumSelectedIds.schoolId}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione uma escola para ver os Anos Escolares disponíveis
                --{" "}
              </option>
            )}
          </select>
        </div>

        {/* CURRICULUM SELECT */}
        <div className="flex gap-2 items-center">
          <label htmlFor="curriculumSelect" className="w-1/4 text-right">
            Selecione a Turma:{" "}
          </label>
          <select
            id="curriculumSelect"
            defaultValue={" -- select an option -- "}
            className="w-3/4 px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            name="curriculumSelect"
            onChange={(e) => {
              setCurriculumSelectedIds({
                ...curriculumSelectedIds,
                curriculumId: e.target.value,
              });
              setIsSelected(true);
            }}
          >
            {curriculumSelectedIds.schoolClassId ? (
              <SelectOptions
                returnId
                dataType="curriculum"
                displaySchoolCourseAndSchedule
                schoolId={curriculumSelectedIds.schoolId}
                schoolClassId={curriculumSelectedIds.schoolClassId}
              />
            ) : (
              <option disabled value={" -- select an option -- "}>
                {" "}
                -- Selecione um Ano Escolar para ver as Turmas disponíveis --{" "}
              </option>
            )}
          </select>
        </div>

        {isSelected && (
          <>
            {/* EDIT BUTTON */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                type="button"
                disabled={isEdit}
                className="w-3/4 border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-amber-500/70 disabled:dark:bg-amber-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                {!isEdit
                  ? "Editar"
                  : "Clique em CANCELAR para desfazer a Edição"}
              </button>
            </div>
          </>
        )}

        {isEdit && (
          <EditCurriculumForm
            curriculumId={curriculumSelectedIds.curriculumId}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onClose={resetForm}
          />
        )}
      </div>
    </div>
  );
}
