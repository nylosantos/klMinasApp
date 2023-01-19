import { useController } from "react-hook-form";
import { InputStateProps } from "../@types";

export function InputForm(props: InputStateProps) {
  const { field, fieldState } = useController(props);

  return (
    <div>
      <input
        {...field}
        value={props.inputValue}
        type="text"
        onChange={(e) => props.handleGetCep(e.target.value)}
        placeholder={props.name}
        className={
          // errors.name
          //   ? "w-2/4 px-2 py-1 border border-red-600"
          //   :
          "w-full px-2 py-1 border border-gray-100 dark:border-black"
        }
      />
      {/* <p>{fieldState.isTouched && "Touched"}</p>
      <p>{fieldState.isDirty && "Dirty"}</p>
      <p>{fieldState.invalid ? "invalid" : "valid"}</p> */}
    </div>
  );
}
