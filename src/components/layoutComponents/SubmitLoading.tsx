import { Dna } from "react-loader-spinner";

import { SubmitLoadingProps } from "../../@types";

export function SubmitLoading({
  isSubmitting,
  whatsGoingOn,
}: SubmitLoadingProps) {
  return (
    <>
      {isSubmitting ? (
        <div className="flex flex-col w-screen h-screen top-0 left-0 absolute items-center justify-center bg-gray-900/60 dark:bg-gray-800/50 transition-all duration-300">
          {/* SUBMIT LOADING CARD */}
          <div className="flex flex-col items-center p-40 rounded-3xl bg-gray-900/80 dark:bg-gray-900/90">
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
            <h1 className="text-xl text-white mb-3">
              Aguarde, {whatsGoingOn}...
            </h1>
          </div>
        </div>
      ) : null}
    </>
  );
}
