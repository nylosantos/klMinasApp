import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./Button";

export function Header() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigations = [
    { label: "Home", path: "/" },
    { label: "Adicionar", path: "/insertPage" },
    { label: "Excluir", path: "/deletePage" },
  ];

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;
    if (currentTheme === "dark") {
      return (
        <Button
          className="dark:bg-gray-700 dark:text-yellow-500"
          onClick={() => setTheme("light")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        </Button>
      );
    } else {
      return (
        <Button
          className="bg-gray-100 text-slate-800"
          onClick={() => setTheme("dark")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </Button>
      );
    }
  };
  return (
    <div className="w-screen flex justify-center top-0 left-0 mb-4 bg-gray-100 dark:bg-gray-600">
      <div className="flex container justify-between items-center py-6">
        <div className="flex gap-4">
          {navigations.map((nav) => (
            <div key={nav.path} className="flex border-b-2 border-gray-100 hover:border-black dark:border-gray-600 dark:hover:border-gray-100">
              <Link href={nav.path}>
                {nav.label}
              </Link>
            </div>
          ))}
        </div>
        {renderThemeChanger()}
      </div>
    </div>
  );
}
