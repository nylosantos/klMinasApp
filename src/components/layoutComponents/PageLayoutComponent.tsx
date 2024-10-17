import { ReactNode } from "react";

type PageLayoutComponentProps = {
  children: ReactNode;
};

export function PageLayoutComponent({ children }: PageLayoutComponentProps) {
  return (
    <div className="flex flex-col h-full w-full mx-2 mt-4 sm:px-0 overflow-scroll no-scrollbar">
      {children}
    </div>
  );
}
