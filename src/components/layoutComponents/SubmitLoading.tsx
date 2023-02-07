import { Dna } from "react-loader-spinner";
import { SubmitLoadingProps } from "../../@types";
import {
  divSubmitLoadingCard,
  divSubmitLoadingMaster,
  submitTitleH1,
} from "../../styles/tailwindConstants";

export function SubmitLoading({
  isSubmitting,
  whatsGoingOn,
}: SubmitLoadingProps) {
  return (
    <>
      {isSubmitting ? (
        <div className={divSubmitLoadingMaster}>
          <div className={divSubmitLoadingCard}>
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
            <h1 className={submitTitleH1}>Aguarde, {whatsGoingOn}...</h1>
          </div>
        </div>
      ) : null}
    </>
  );
}
