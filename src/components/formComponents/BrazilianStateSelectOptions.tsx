import { v4 as uuidv4 } from "uuid";
import { StateDataProps } from "../../@types";

const statesDdd = [
  { id: uuidv4(), ddd: "11", state: "SP" },
  { id: uuidv4(), ddd: "12", state: "SP" },
  { id: uuidv4(), ddd: "13", state: "SP" },
  { id: uuidv4(), ddd: "14", state: "SP" },
  { id: uuidv4(), ddd: "15", state: "SP" },
  { id: uuidv4(), ddd: "16", state: "SP" },
  { id: uuidv4(), ddd: "17", state: "SP" },
  { id: uuidv4(), ddd: "18", state: "SP" },
  { id: uuidv4(), ddd: "19", state: "SP" },
  { id: uuidv4(), ddd: "21", state: "RJ" },
  { id: uuidv4(), ddd: "22", state: "RJ" },
  { id: uuidv4(), ddd: "24", state: "RJ" },
  { id: uuidv4(), ddd: "27", state: "ES" },
  { id: uuidv4(), ddd: "28", state: "ES" },
  { id: uuidv4(), ddd: "32", state: "MG" },
  { id: uuidv4(), ddd: "33", state: "MG" },
  { id: uuidv4(), ddd: "34", state: "MG" },
  { id: uuidv4(), ddd: "35", state: "MG" },
  { id: uuidv4(), ddd: "37", state: "MG" },
  { id: uuidv4(), ddd: "38", state: "MG" },
  { id: uuidv4(), ddd: "41", state: "PR" },
  { id: uuidv4(), ddd: "42", state: "PR" },
  { id: uuidv4(), ddd: "43", state: "PR" },
  { id: uuidv4(), ddd: "44", state: "PR" },
  { id: uuidv4(), ddd: "45", state: "PR" },
  { id: uuidv4(), ddd: "46", state: "PR" },
  { id: uuidv4(), ddd: "47", state: "SC" },
  { id: uuidv4(), ddd: "48", state: "SC" },
  { id: uuidv4(), ddd: "49", state: "SC" },
  { id: uuidv4(), ddd: "51", state: "RS" },
  { id: uuidv4(), ddd: "53", state: "RS" },
  { id: uuidv4(), ddd: "54", state: "RS" },
  { id: uuidv4(), ddd: "55", state: "RS" },
  { id: uuidv4(), ddd: "61", state: "DF" },
  { id: uuidv4(), ddd: "62", state: "GO" },
  { id: uuidv4(), ddd: "63", state: "TO" },
  { id: uuidv4(), ddd: "64", state: "GO" },
  { id: uuidv4(), ddd: "65", state: "MT" },
  { id: uuidv4(), ddd: "66", state: "MT" },
  { id: uuidv4(), ddd: "67", state: "MS" },
  { id: uuidv4(), ddd: "68", state: "AC" },
  { id: uuidv4(), ddd: "69", state: "RO" },
  { id: uuidv4(), ddd: "71", state: "BA" },
  { id: uuidv4(), ddd: "73", state: "BA" },
  { id: uuidv4(), ddd: "74", state: "BA" },
  { id: uuidv4(), ddd: "75", state: "BA" },
  { id: uuidv4(), ddd: "77", state: "BA" },
  { id: uuidv4(), ddd: "79", state: "SE" },
  { id: uuidv4(), ddd: "81", state: "PE" },
  { id: uuidv4(), ddd: "82", state: "AL" },
  { id: uuidv4(), ddd: "83", state: "PB" },
  { id: uuidv4(), ddd: "84", state: "RN" },
  { id: uuidv4(), ddd: "85", state: "CE" },
  { id: uuidv4(), ddd: "86", state: "PI" },
  { id: uuidv4(), ddd: "87", state: "PE" },
  { id: uuidv4(), ddd: "88", state: "CE" },
  { id: uuidv4(), ddd: "89", state: "PI" },
  { id: uuidv4(), ddd: "91", state: "PA" },
  { id: uuidv4(), ddd: "92", state: "AM" },
  { id: uuidv4(), ddd: "93", state: "PA" },
  { id: uuidv4(), ddd: "94", state: "PA" },
  { id: uuidv4(), ddd: "95", state: "RR" },
  { id: uuidv4(), ddd: "96", state: "AP" },
  { id: uuidv4(), ddd: "97", state: "AM" },
  { id: uuidv4(), ddd: "98", state: "MA" },
  { id: uuidv4(), ddd: "99", state: "MA" },
];

export function BrazilianStateSelectOptions() {
  return (
    <>
      <option disabled value={"DDD"}>
        DDD
      </option>
      <option value={"31"}>
        31
      </option>
      <option disabled value={"DDD"}>
        -
      </option>
      {statesDdd.map((data: StateDataProps) => (
        <option key={data.id} value={data.ddd}>
          {data.ddd}
        </option>
      ))}
    </>
  );
}
