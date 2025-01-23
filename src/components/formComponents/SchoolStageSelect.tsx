import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { schoolStage } from "../../custom";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  CreateCurriculumValidationZProps,
  EditCurriculumValidationZProps,
  SchoolClassSearchProps,
} from "../../@types";

interface CurriculumFormattedNameProps {
  formattedName: string;
  schoolName: string;
  schoolClassNames: Array<SchoolClassSearchProps>;
  schoolCourseName: string;
  scheduleName: string;
  classDayName: string;
  teacherName: string;
}

interface SchoolStageSelectProps<T> {
  onlyView: boolean;
  dashboardView: boolean;
  curriculumData:
    | CreateCurriculumValidationZProps
    | EditCurriculumValidationZProps;
  setCurriculumData: React.Dispatch<React.SetStateAction<T>>;
  setCurriculumFormattedName?: React.Dispatch<
    React.SetStateAction<CurriculumFormattedNameProps>
  >;
  curriculumFormattedName?: CurriculumFormattedNameProps;
}

const SchoolStageSelect = <T extends { schoolClassIds: string[] }>({
  onlyView,
  dashboardView,
  curriculumData,
  setCurriculumData,
  setCurriculumFormattedName,
  curriculumFormattedName,
}: SchoolStageSelectProps<T>) => {
  // GET GLOBAL DATA
  const { schoolClassDatabaseData } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  function schoolClassIdsFunction(schoolClass: SchoolClassSearchProps) {
    let newSchoolClassIds;
    if (curriculumData.schoolClassIds.includes(schoolClass.id)) {
      newSchoolClassIds = curriculumData.schoolClassIds.filter(
        (id) => id !== schoolClass.id
      );
    } else {
      newSchoolClassIds = curriculumData.schoolClassIds;
      newSchoolClassIds.push(schoolClass.id);
    }
    const newSchoolClass: SchoolClassSearchProps[] = [];
    newSchoolClassIds.map((id) => {
      schoolClassDatabaseData.map((schoolClass) => {
        if (schoolClass.id === id) {
          newSchoolClass.push(schoolClass);
        }
      });
    });
    if (curriculumFormattedName && setCurriculumFormattedName) {
      setCurriculumFormattedName({
        ...curriculumFormattedName,
        schoolClassNames: newSchoolClass.sort((a, b) => {
          if (a.schoolStageId !== b.schoolStageId) {
            return a.schoolStageId.localeCompare(b.schoolStageId);
          }
          return a.name.localeCompare(b.name);
        }),
      });
    }
    setCurriculumData((prevData) => ({
      ...prevData,
      schoolClassIds: newSchoolClassIds,
    }));
  }

  return (
    <div className="flex flex-col w-full gap-4 items-center">
      {schoolStage.map((stage) => (
        <div className="flex gap-2 w-full items-center">
          <p className="w-1/4 text-right">{stage.name}:</p>
          <div className="flex w-3/4 flex-wrap items-center">
            {schoolClassDatabaseData
              .filter((schoolClass) =>
                schoolClass.schoolStageId.includes(stage.id)
              )
              .map((schoolClass) => {
                return (
                  <div className="flex items-center gap-2 mr-2" key={uuidv4()}>
                    <input
                      disabled={onlyView && dashboardView}
                      type="checkbox"
                      name={schoolClass.name}
                      id={uuidv4()}
                      className="ml-1 dark: text-klGreen-500 dark:text-klGreen-500 border-none "
                      checked={curriculumData.schoolClassIds.includes(
                        schoolClass.id
                      )}
                      onChange={() => schoolClassIdsFunction(schoolClass)}
                    />
                    <label htmlFor={schoolClass.name} className="text-sm">
                      {schoolClass.name}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
export default SchoolStageSelect;
