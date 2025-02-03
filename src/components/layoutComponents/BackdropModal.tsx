import { Dispatch, SetStateAction } from "react";

type BackdropModalProps = {
  setDashboardMenu?: Dispatch<SetStateAction<boolean>>;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export default function BackdropModal({
  setDashboardMenu,
  setMobileMenuOpen,
}: BackdropModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => {
        if (setDashboardMenu) {
          setDashboardMenu(false);
        }
        setMobileMenuOpen(false);
      }}
    />
  );
}
