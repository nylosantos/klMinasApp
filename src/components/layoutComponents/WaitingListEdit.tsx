import { useContext } from "react";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";

interface WaitingListEditProps {
  studentId: string;
  curriculumId: string;
}

export default function WaitingListEdit({
  studentId,
  curriculumId,
}: WaitingListEditProps) {
  // GET GLOBAL DATA
  const { handleOneCurriculumDetails } = useContext(
    GlobalDataContext
  ) as GlobalDataContextType;

  const waitingList = handleOneCurriculumDetails(curriculumId).students.filter(
    (student) => student.isWaiting
  );
  const waitingListPosition =
    waitingList
      .sort((a, b) => Number(a.date?.toDate()) - Number(b.date?.toDate()))
      .findIndex((student) => student.id === studentId) + 1;
  return (
    <p className="font-bold">
      Posição na lista de espera: {waitingListPosition}
    </p>
  );
}
