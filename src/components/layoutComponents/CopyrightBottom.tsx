import { SystemConstantsSearchProps } from "../../@types";

type CopyrightBottomProps = {
  systemConstantsValues: SystemConstantsSearchProps | undefined;
};

export default function CopyrightBottom({
  systemConstantsValues,
}: CopyrightBottomProps) {
  return (
    <div className="z-10 absolute bottom-[4vh] left-0 right-0 pb-4 w-full text-center text-xs text-klGreen-500 dark:text-klOrange-500">
      &copy; {new Date().getFullYear()}{" "}
      {systemConstantsValues?.customerShortName}. Todos os direitos reservados.
    </div>
  );
}
