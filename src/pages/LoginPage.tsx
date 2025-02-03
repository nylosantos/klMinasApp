import { useContext } from "react";
import { Header } from "../components/layoutComponents/Header";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../context/GlobalDataContext";
import { FormLogin } from "../components/signComponents/FormLogin";
import { FormRegister } from "../components/signComponents/FormRegister";
import { DNA } from "react-loader-spinner";
import CopyrightBottom from "../components/layoutComponents/CopyrightBottom";

export default function LoginPage() {
  // GET GLOBAL DATA
  const { login, userLoading, systemConstantsValues, setLogin } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  return (
    <div className="text-center flex flex-col gap-5 items-center justify-center">
      <Header />
      {userLoading ? (
        <div className="flex flex-col gap-5 mt-60">
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
          <h1 className="text-xl text-white mb-3">Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 justify-center mt-12">
          {/* <h1
            className={`font-bold text-2xl ${
              systemConstantsValues ? "opacity-100" : "opacity-0"
            } transition-all duration-500`}
          >
            Bem-vindo(a) à {systemConstantsValues?.customerFullName}!
          </h1> */}

          {login ? <FormLogin /> : <FormRegister />}
          <p className="flex gap-1 text-sm text-gray-400">
            {login ? "Para criar uma conta" : "Já tem uma conta?"}
            <span
              className="dark:text-white text-gray-500 underline cursor-pointer"
              onClick={() => setLogin(!login)}
            >
              {login ? "clique aqui" : "Clique aqui"}
            </span>
          </p>
        </div>
      )}
      <CopyrightBottom systemConstantsValues={systemConstantsValues} />
    </div>
  );
}
