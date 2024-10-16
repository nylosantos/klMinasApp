/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { Header } from "../components/layoutComponents/Header";
import {
  GlobalDataContext,
  GlobalDataContextType,
  SetPageProps,
} from "../context/GlobalDataContext";
import Dashboard from "./Dashboard";
import ManageSchools from "./ManageSchools";
import ManageUsers from "./ManageUsers";
import Settings from "./Settings";
import { ToastContainer } from "react-toastify";

export default function LandingPage() {
  // GET GLOBAL DATA
  const { page, setPage } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  useEffect(() => {
    setPage({ show: "Dashboard", prev: "Dashboard" });
  }, []);

  function renderPage(pageTo: SetPageProps) {
    if (pageTo.show === "Dashboard") {
      return <Dashboard />;
    } else if (pageTo.show === "Settings") {
      return <Settings />;
    } else if (pageTo.show === "ManageSchools") {
      return <ManageSchools />;
    } else if (pageTo.show === "ManageUsers") {
      return <ManageUsers />;
    }
  }

  return (
    <div className="flex flex-col w-screen h-screen justify-between scroll-smooth overflow-scroll no-scrollbar">
      {/* <Notification /> */}
      {/* HEADER */}
      <Header />
      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />
      <div className="flex justify-start h-full overflow-scroll no-scrollbar">{renderPage(page)}</div>
    </div>
  );
}
