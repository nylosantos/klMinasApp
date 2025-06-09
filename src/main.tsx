import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "animate.css";
import { GlobalDataProvider } from "./context/GlobalDataContext.tsx";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalDataProvider>
      <App />
      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />
    </GlobalDataProvider>
  </React.StrictMode>
);
