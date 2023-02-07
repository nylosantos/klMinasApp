import { v4 as uuidv4 } from "uuid";

import { ClassDaysCompProps, DaysProps } from "../../@types";
import {
  classDayTitleP,
  divClassDayCard,
  divClassDayCardMaster,
  inputCheckbox,
} from "../../styles/tailwindConstants";

export function ClassDays({ classDay, toggleClassDays }: ClassDaysCompProps) {
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
      <p className={classDayTitleP}>Selecione os dias de aula</p>

      {/* CLASS DAY CARD */}
      <div className={divClassDayCardMaster}>
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
            <div key={uuidv4()} className={divClassDayCard}>
              <input
                key={uuidv4()}
                type="checkbox"
                className={inputCheckbox}
                id={item}
                name={item}
                checked={classDay[item]}
                onChange={(e) =>
                  toggleClassDays({ day: item, value: !classDay[item] })
                }
              />
              <label key={uuidv4()} htmlFor={item}>
                {" "}
                {days[item as keyof DaysProps]}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
}
