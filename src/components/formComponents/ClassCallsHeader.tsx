/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useContext
} from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { ClassDaySearchProps } from "../../@types";

type ClassCallsHeaderProps = {
  curriculumId: string;
  classDaysData: ClassDaySearchProps | undefined
  setSelectedClassDate: Dispatch<SetStateAction<DateObject>>;
};

export default function ClassCallsHeader({
  curriculumId,
  classDaysData,
  setSelectedClassDate,
}: ClassCallsHeaderProps) {
  // GET GLOBAL DATA
  const { handleOneCurriculumDetails } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
    <>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          name="publicId"
          disabled
          className="w-full text-center px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
          value={`${handleOneCurriculumDetails(curriculumId).schoolName} - ${
            handleOneCurriculumDetails(curriculumId).schoolCourseName
          } - ${handleOneCurriculumDetails(curriculumId).teacherName}`}
        />
      </div>
      <div className="flex gap-2 items-center">
        <label htmlFor="experimentalClassPick" className="w-1/4 text-right">
          Data da Aula:
        </label>
        <div className="flex w-3/4">
          <DatePicker
            currentDate={new DateObject()}
            value={new DateObject().format("DD/MM/YYYY")}
            containerClassName="w-full"
            style={{ width: "100%" }}
            inputClass="px-2 py-1 dark:bg-gray-800 border border-transparent dark:border-transparent dark:text-gray-100 rounded-2xl cursor-default"
            mapDays={({ date }) => {
              const isWeekend = classDaysData?.indexDays.includes(
                date.weekDay.index
              );
              if (!isWeekend)
                return {
                  disabled: true,
                  style: { color: "#ccc" },
                  title: "Aula não disponível neste dia",
                };
            }}
            editable={false}
            minDate={`01/02/${new DateObject().year}`}
            format="DD/MM/YYYY"
            onChange={(e: DateObject) => {
              e !== null &&
                // setNewClass({
                //   ...newClass,
                //   date: `${e.month}/${e.day}/${e.year}`,
                // });
                setSelectedClassDate(e);
            }}
          />
        </div>
      </div>
    </>
  );
}
