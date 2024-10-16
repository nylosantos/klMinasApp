import { EditStudentForm } from "../formComponents/EditStudentForm";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { useState } from "react";

export interface EditStudentModalProps {
  open: boolean;
  studentId: string;
  onClose: () => void;
}

export function EditStudentModal(props: EditStudentModalProps) {
  const { onClose, studentId } = props;

  const handleClose = () => {
    onClose();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex w-full h-full items-center justify-start transition-all duration-300">
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="salvando" />
      
      <div className="flex h-full w-11/12 items-start justify-center rounded-xl bg-white dark:bg-gray-800 overflow-scroll no-scrollbar">
        <EditStudentForm
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          studentId={studentId}
          key={studentId}
          onClose={handleClose}
        />
      </div>
      <div className="flex h-full w-1/12 justify-center items-start">
        <p
          className="text-center w-20 text-gray-100 cursor-pointer bg-red-600 hover:bg-red-800 rounded py-1 transition-all duration-100"
          onClick={handleClose}
        >
          Fechar
        </p>
      </div>
    </div>
  );
}
