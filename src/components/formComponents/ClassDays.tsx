import { v4 as uuidv4 } from "uuid";

import { ClassDaysCompProps, DaysProps } from "../../@types";

export function ClassDays({
  classDay,
  toggleClassDays,
  onlyView = false,
}: ClassDaysCompProps) {
  // DAYS DATA
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
      {/* CLASS DAY SECTION TITLE */}
      <p className="mt-4 mb-2 text-center">
        {onlyView ? "Dias de Aula" : "Selecione os dias de aula"}
      </p>

      {/* CLASS DAY CARD */}
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
          if (onlyView && classDay[item]) {
            return (
              <div
                key={uuidv4()}
                className="flex flex-col w-24 items-center gap-2 bg-white/50 dark:bg-klGreen-500/20 py-2 pt-4 rounded-xl"
              >
                <input
                  disabled={onlyView}
                  key={uuidv4()}
                  type="checkbox"
                  className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                  id={item}
                  name={item}
                  checked={classDay[item]}
                  onChange={() =>
                    toggleClassDays({ day: item, value: !classDay[item] })
                  }
                />
                <label key={uuidv4()} htmlFor={item}>
                  {" "}
                  {days[item as keyof DaysProps]}
                </label>
              </div>
            );
          } else if (!onlyView) {
            return (
              <div
                key={uuidv4()}
                className="flex flex-col w-24 items-center gap-2 bg-white/50 dark:bg-klGreen-500/20 py-2 pt-4 rounded-xl"
              >
                <input
                  disabled={onlyView}
                  key={uuidv4()}
                  type="checkbox"
                  className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
                  id={item}
                  name={item}
                  checked={classDay[item]}
                  onChange={() =>
                    toggleClassDays({ day: item, value: !classDay[item] })
                  }
                />
                <label key={uuidv4()} htmlFor={item}>
                  {" "}
                  {days[item as keyof DaysProps]}
                </label>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}
