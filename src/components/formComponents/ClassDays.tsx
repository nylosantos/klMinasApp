import { ClassDaysCompProps, DaysProps } from "../../@types";
import { v4 as uuidv4 } from "uuid";

export function ClassDays({ classDay, toggleClassDays }: ClassDaysCompProps) {
  const days: DaysProps = {
    sunday: "Domingo",
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
  };
  return (
    <>
      <p className="mt-4 mb-2">Selecione os dias de aula</p>
      <div className="flex w-full justify-evenly items-center mb-4">
        {Object.keys(classDay).map((item) => {
          if (
            item !== "sunday" &&
            item !== "monday" &&
            item !== "tuesday" &&
            item !== "wednesday" &&
            item !== "thursday" &&
            item !== "friday" &&
            item !== "saturday"
          ) {
            return null;
          }
          return (
            <div
              key={uuidv4()}
              className="flex flex-col w-24 items-center gap-2 bg-white/50 dark:bg-gray-800 py-2 pt-4 rounded-xl"
            >
              <input
                type="checkbox"
                id={item}
                name={item}
                checked={classDay[item]}
                onChange={(e) =>
                  toggleClassDays({ day: item, value: !classDay[item] })
                }
              />
              <label htmlFor={item}> {days[item as keyof DaysProps]}</label>
            </div>
          );
        })}
      </div>
    </>
  );
}
