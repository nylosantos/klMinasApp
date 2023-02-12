import { ButtonSignProps } from "../../@types";

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
      className="w-full px-4 py-2 mt-4 border rounded-3xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 font-bold text-sm text-white disabled:dark:text-white/50 uppercase"
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
