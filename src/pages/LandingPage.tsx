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
    <div className="flex flex-col justify-between scroll-smooth">
      {/* <Notification /> */}
      {/* HEADER */}
      <Header />
      {renderPage(page)}
    </div>
  );
}
