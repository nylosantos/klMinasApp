// import PWABadge from "./PWABadge.tsx";

import { useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "./context/GlobalDataContext";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";

{
  /* <PWABadge /> */
}
function App() {
  // GET GLOBAL DATA
  const { logged } = useContext(GlobalDataContext) as GlobalDataContextType;

  if (!logged) {
    return <LoginPage />;
  } else {
    return <LandingPage />;
  }
}

export default App;
