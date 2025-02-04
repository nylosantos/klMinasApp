import Switch from "react-switch";
import { CurriculumArrayProps, StudentSearchProps } from "../../@types";
import { useFormContext } from "react-hook-form";

type ClassAttendanceListProps = {
  students: CurriculumArrayProps[];
  title: string;
  handleOneStudentDetails: (id: string) => StudentSearchProps | undefined;
};

export default function ClassAttendanceList({
  students,
  title,
  handleOneStudentDetails,
}: ClassAttendanceListProps) {
  const { register, watch, setValue } = useFormContext();
  return (
    <>
      <tr>
        <td colSpan={2} className="text-center font-normal p-2">
          {title}
        </td>
      </tr>
      {students.map((student) => {
        return (
          <tr key={student.id}>
            <td className="py-2 px-6">{handleOneStudentDetails(student.id)?.name}</td>
            <td className="py-2 px-6 text-right">
              <Switch
                {...register(`attendance.${student.id}`)}
                checked={watch(`attendance.${student.id}`) ?? true}
                onChange={() =>
                  setValue(
                    `attendance.${student.id}`,
                    !watch(`attendance.${student.id}`)
                  )
                }
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}
