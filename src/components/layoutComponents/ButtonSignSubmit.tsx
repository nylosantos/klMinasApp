import { ButtonSignProps } from "../../@types";
import { buttonSignIn } from "../../styles/tailwindConstants";

export function ButtonSignSubmit({
  isSubmitting,
  isClosed = false,
  signType,
}: ButtonSignProps) {
  return (
    // SUBMIT BUTTON
    <button
      type="submit"
      disabled={isClosed ? true : isSubmitting}
      className={buttonSignIn}
    >
      {isClosed
        ? signType === "signIn"
          ? // IF SYSTEM IS CLOSED TO LOGIN
            "Sistema Indisponível no momento"
          : // IF SYSTEM IS CLOSED TO REGISTER
            "Registro temporariamente fechado"
        : !isSubmitting
        ? signType === "signIn"
          ? // IF SIGN IN
            "Entrar"
          : // IF SIGN UP
            "Criar Conta"
        : signType === "signIn"
        ? // SUBMITTING SIGN IN
          "Entrando"
        : // SUBMITTING SIGN UP
          "Criando"}
    </button>
  );
}
