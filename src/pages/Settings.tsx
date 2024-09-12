export default function Settings() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex flex-col gap-7 text-center pt-4">
        <p className="font-bold text-klGreen-500 dark:text-gray-100 text-2xl">
          Página em construção ou não encontrada...
        </p>
        <p className="text-red-600 dark:text-klOrange-500 text-xl">
          Parece que a página que você procura está em construção ou ainda não
          existe...
        </p>
      </div>
    </div>
  );
}
