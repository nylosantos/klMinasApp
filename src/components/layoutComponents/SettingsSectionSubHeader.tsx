import { Dispatch, SetStateAction } from "react";
import { SettingsMenuArrayProps } from "../../pages/Settings";

type SettingsSectionSubHeaderProps = {
  settingsMenu: boolean;
  setSettingsMenu: Dispatch<SetStateAction<boolean>>;
  data: SettingsMenuArrayProps[];
  showSettingsPage: { page: string };
};

export default function SettingsSectionSubHeader({
  setSettingsMenu,
  data,
  settingsMenu,
  showSettingsPage,
}: SettingsSectionSubHeaderProps) {
  const filteredData = data.find((item) => item.page === showSettingsPage.page);
  if (filteredData) {
    return (
      <div className="flex items-center w-full justify-center py-4">
        <div className="flex w-auto rounded-md bg-klGreen-500 dark:bg-klGreen-500/50 py-2 px-2 text-xs md:text-sm/6 focus:outline-none hover:dark:bg-klGreen-500 hover:bg-klGreen-500/80">
          <button
            className="flex w-full gap-2 items-center justify-evenly text-gray-100"
            onClick={() => {
              setSettingsMenu(!settingsMenu);
            }}
          >
            {filteredData.title} {filteredData.icon}
          </button>
        </div>
      </div>
    );
  }
}
