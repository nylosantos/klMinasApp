/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DateObject } from "react-multi-date-picker";
import {
  GlobalDataContext,
  GlobalDataContextType,
} from "../../context/GlobalDataContext";
import {
  CurriculumAttendanceProps,
  CurriculumSearchProps,
  PresenceListProps,
} from "../../@types";
import { classDayIndex, schoolYearsComplementData } from "../../custom";
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import ClassAttendanceList from "./ClassAttendanceList";
import { app } from "../../db/Firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

type StudentsListForTeachersProps = {
  curriculumSelectedData: CurriculumSearchProps;
  classCall: boolean;
  selectedClassDate: DateObject | undefined;
};

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export default function StudentsListForTeachers({
  curriculumSelectedData,
  classCall,
  selectedClassDate,
}: StudentsListForTeachersProps) {
  const {
    schoolClassDatabaseData,
    curriculumDatabaseData,
    handleOneStudentDetails,
    setIsSubmitting,
  } = useContext(GlobalDataContext) as GlobalDataContextType;

  const [attendanceDataFromDB, setAttendanceDataFromDB] = useState<
    PresenceListProps[] | undefined
  >([]);

  const [shouldUpdateSwitches, setShouldUpdateSwitches] = useState(false);

  function fetchAttendanceData(id: string) {
    const curriculumUpdatedData = curriculumDatabaseData.find(
      (curriculum) => curriculum.id === curriculumSelectedData.id
    );
    const curriculumData = curriculumUpdatedData as CurriculumAttendanceProps;
    if (curriculumData.classCalls) {
      const dataFromDb = curriculumData.classCalls.find(
        (attendanceData) => attendanceData.id === id
      );
      if (dataFromDb) {
        return dataFromDb;
      } else {
        console.log("Dia sem chamada registrada.");
      }
    } else {
      console.log("Turma sem chamadas registradas.");
    }
  }

  useEffect(() => {
    if (selectedClassDate) {
      setAttendanceDataFromDB(
        fetchAttendanceData(selectedClassDate.format("DD-MM-YYYY").toString())
          ?.presenceList
      );
    }
  }, [selectedClassDate, curriculumDatabaseData]);

  function handleSchoolYearName(id: string) {
    const schoolYear = schoolClassDatabaseData.find(
      (schoolYear) => schoolYear.id === id
    );
    if (schoolYear) {
      return schoolYear.name;
    } else {
      return "";
    }
  }

  function handleSchoolYearComplementName(id: string) {
    const schoolYearComplement = schoolYearsComplementData.find(
      (schoolYear) => schoolYear.id === id
    );
    if (schoolYearComplement) {
      return schoolYearComplement.name;
    } else {
      return "";
    }
  }

  function handleClassDaysName(id: number) {
    const classDayName = classDayIndex.find((classDay) => classDay.id === id);
    if (classDayName) {
      return classDayName.name;
    } else {
      return "";
    }
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.length <= 6) return phone; // Verifica se o telefone tem comprimento suficiente
    const trimmedPhone = phone.slice(3); // Descartar os 3 primeiros caracteres
    return `${trimmedPhone.slice(0, 2)} ${trimmedPhone.slice(
      2,
      7
    )}-${trimmedPhone.slice(7)}`; // Adicionar espaço entre o caractere 5 e 6 e adicionar hífen
    // return `${trimmedPhone.slice(0, 2)} ${trimmedPhone.slice(2)}`; // Adicionar espaço entre o caractere 5 e 6
  };

  const selectedDayIndex = selectedClassDate
    ? selectedClassDate.weekDay.index
    : new Date().getDay();

  const enrolledStudents = curriculumSelectedData.students.filter(
    (studentId) => {
      const studentDetails = handleOneStudentDetails(studentId.id);
      return studentDetails?.curriculumIds.some((curriculum) => {
        const curriculumDate = (
          curriculum.date as unknown as Timestamp
        ).toDate();
        const selectedDate = new Date(
          selectedClassDate ? selectedClassDate.toDate() : new Date()
        );
        return (
          curriculum.id === curriculumSelectedData.id &&
          curriculum.indexDays.includes(selectedDayIndex) &&
          selectedDate >= curriculumDate
        );
      });
    }
  );

  const experimentalStudents =
    curriculumSelectedData.experimentalStudents.filter((studentId) => {
      const studentDetails = handleOneStudentDetails(studentId.id);
      const experimentalClassDate = (
        studentDetails?.experimentalCurriculumIds.find(
          (curriculum) => curriculum.id === curriculumSelectedData.id
        )?.date as unknown as Timestamp
      )
        .toDate()
        .toDateString();
      return studentDetails?.experimentalCurriculumIds.some(
        (curriculum) =>
          curriculum.id === curriculumSelectedData.id &&
          experimentalClassDate ===
            new Date(
              selectedClassDate ? selectedClassDate.toDate() : new Date()
            ).toDateString()
      );
    });

  const allStudents = useMemo(() => {
    const students = [];
    if (experimentalStudents.length > 0) {
      students.push(...experimentalStudents);
    }
    if (enrolledStudents.length > 0) {
      students.push(...enrolledStudents);
    }
    return students;
  }, [experimentalStudents, enrolledStudents, selectedClassDate]);

  const defaultValues = useMemo(() => {
    return allStudents.reduce<Record<string, boolean>>((acc, student) => {
      const attendanceRecord = attendanceDataFromDB?.find(
        (record) => record.id === student.id
      );
      acc[`attendance.${student.id}`] = attendanceRecord
        ? attendanceRecord.presence
        : true; // Defina o valor padrão como true ou o valor do banco de dados

      return acc;
    }, {});
  }, [allStudents, attendanceDataFromDB]);

  const methods = useForm<{
    attendance: Record<string, boolean>;
  }>({
    defaultValues,
  });

  const { handleSubmit, setValue, reset, watch } = methods;

  const watchedValues = watch();

  useEffect(() => {
    const currentValues = Object.keys(watchedValues.attendance || {}).reduce<
      Record<string, boolean>
    >((acc, key) => {
      acc[key] = watchedValues.attendance[key];
      return acc;
    }, {});

    if (JSON.stringify(currentValues) !== JSON.stringify(defaultValues)) {
      reset(defaultValues);
      setShouldUpdateSwitches(true);
    }
  }, [selectedClassDate, curriculumDatabaseData]);

  useEffect(() => {
    if (shouldUpdateSwitches) {
      allStudents.forEach((student) => {
        const attendanceRecord = attendanceDataFromDB?.find(
          (record) => record.id === student.id
        );
        setValue(
          `attendance.${student.id}`,
          attendanceRecord ? attendanceRecord.presence : true
        );
      });
      setShouldUpdateSwitches(false);
    }
  }, [shouldUpdateSwitches, attendanceDataFromDB]);

  // CONFIRM ALERT MODAL
  const ConfirmationAlert = withReactContent(Swal);

  const onSubmit = async (data: { attendance: Record<string, boolean> }) => {
    ConfirmationAlert.fire({
      title: "Enviar chamada?",
      text: "Não será possível desfazer essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2a5369",
      confirmButtonText: "Sim, enviar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        // Verifique se há dados no formulário
        if (
          !data ||
          !data.attendance ||
          Object.keys(data.attendance).length === 0
        ) {
          toast.error(`Nenhum aluno na chamada... 🤯`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
          return;
        }

        const attendanceData = Object.keys(data.attendance).map((key) => {
          const [id] = key.split(".");
          return {
            id,
            presence: data.attendance[key],
          };
        });

        // Verifique se attendanceData é um array válido
        if (Array.isArray(attendanceData) && attendanceData.length > 0) {
          const attendanceRecord = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            id: selectedClassDate?.format("DD-MM-YYYY").toString()!,
            presenceList: attendanceData,
          };

          const curriculumUpdatedData = curriculumDatabaseData.find(
            (curriculum) => curriculum.id === curriculumSelectedData.id
          );
          const curriculumData =
            curriculumUpdatedData as CurriculumAttendanceProps;
          if (curriculumData.classCalls) {
            const orderedArray = curriculumData.classCalls.sort((a, b) =>
              a.id.localeCompare(b.id)
            );
            const filteredArray = orderedArray.filter(
              (classCallData) => classCallData.id !== attendanceRecord.id
            );
            filteredArray.push(attendanceRecord);

            const curriculumDataToUpload: CurriculumAttendanceProps = {
              ...curriculumData,
              classCalls: filteredArray,
            };
            try {
              await setDoc(
                doc(db, "curriculum", curriculumData.id),
                curriculumDataToUpload
              );
              toast.success(`Chamada Registrada! 👌`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              });
            } catch (error) {
              console.log("ESSE É O ERROR", error);
              toast.error(`Ocorreu um erro... 🤯`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              });
            } finally {
              setIsSubmitting(false);
            }
          } else {
            //   updateStudentAttendance(attendanceRecord);
            const curriculumDataToUpload: CurriculumAttendanceProps = {
              ...curriculumSelectedData,
              classCalls: [attendanceRecord],
            };
            try {
              await setDoc(
                doc(db, "curriculum", curriculumData.id),
                curriculumDataToUpload
              );
              toast.success(`Chamada Registrada! 👌`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              });
            } catch (error) {
              console.log("ESSE É O ERROR", error);
              toast.error(`Ocorreu um erro... 🤯`, {
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              });
            } finally {
              setIsSubmitting(false);
            }
          }
        } else {
          console.error("Dados de attendance inválidos:", attendanceData);
          toast.error(`Dados inválidos...[attendanceData] 🤯`, {
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
          setIsSubmitting(false);
        }
      }
    });
  };

  if (!classCall) {
    return (
      <div className="flex flex-col w-full">
        <div className="bg-klGreen-500/20 dark:bg-klGreen-500/30 text-center p-[1vw]">
          Alunos
        </div>
        <table className="table-auto w-full border-collapse border border-transparent">
          {curriculumSelectedData.students.length !== 0 && (
            <thead className="bg-klGreen-500 sticky top-0 text-gray-100 text-sm md:text-base z-40">
              <tr>
                <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                  Nome
                </th>
                <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                  Turma
                </th>
                <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                  Dias de Aula
                </th>
                <th className="border-r dark:border-klGreen-500 p-2 font-normal">
                  Contato
                </th>
              </tr>
            </thead>
          )}
          <tbody className="[&>*:nth-child(1)]:rounded-t-xl [&>*:nth-last-child(1)]:rounded-b-xl [&>*:nth-child(odd)]:bg-klGreen-500/30 [&>*:nth-child(even)]:bg-klGreen-500/20 dark:[&>*:nth-child(odd)]:bg-klGreen-500/50 dark:[&>*:nth-child(even)]:bg-klGreen-500/20 [&>*:nth-child]:border-2 [&>*:nth-child]:border-gray-100 text-sm md:text-base">
            {curriculumSelectedData.students.length ? (
              curriculumSelectedData.students
                .sort(
                  (a, b) =>
                    handleOneStudentDetails(a.id)!.publicId! -
                    handleOneStudentDetails(b.id)!.publicId!
                )

                .map((student, index) => (
                  <>
                    <tr
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td
                        key={index}
                        className="border-r dark:border-klGreen-500 p-2 text-center"
                      >
                        {handleOneStudentDetails(student.id)?.name}
                      </td>
                      <td
                        key={index + 1}
                        className="border-r dark:border-klGreen-500 p-2 text-center"
                      >
                        {handleSchoolYearName(
                          handleOneStudentDetails(student.id)!.schoolYears
                        )}{" "}
                        -{" "}
                        {handleSchoolYearComplementName(
                          handleOneStudentDetails(student.id)!
                            .schoolYearsComplement
                        )}
                      </td>
                      <td
                        key={index + 2}
                        className="border-r dark:border-klGreen-500 p-2 text-center"
                      >
                        {handleOneStudentDetails(student.id)
                          ?.curriculumIds.filter(
                            (curriculum) =>
                              curriculum.id === curriculumSelectedData.id
                          )[0]
                          .indexDays.map(handleClassDaysName)
                          .join(" - ")}
                      </td>
                      <td
                        key={index + 3}
                        className="border-r dark:border-klGreen-500 p-2 text-center"
                      >
                        {handleOneStudentDetails(student.id)
                          ?.financialResponsible.phone &&
                          formatPhoneNumber(
                            handleOneStudentDetails(student.id)!
                              .financialResponsible.phone
                          )}
                      </td>
                    </tr>
                  </>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  <p className="text-klGreen-500 dark:text-white">
                    Nenhum aluno encontrado
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="bg-klGreen-500/20 dark:bg-klGreen-500/30 text-center p-[1vw]">
          Lista de Alunos
        </div>

        <table className="table-auto w-full border-collapse border border-transparent">
          <thead className="bg-klGreen-500 text-gray-100 text-sm md:text-base">
            <tr>
              <th className="py-2 px-6 font-normal text-left">Nome</th>
              <th className="py-2 px-6 font-normal text-right">Presença</th>
            </tr>
          </thead>

          <tbody>
            {enrolledStudents.length > 0 && (
              <ClassAttendanceList
                students={enrolledStudents}
                title="Matriculados"
                handleOneStudentDetails={handleOneStudentDetails}
              />
            )}

            {experimentalStudents.length > 0 && (
              <ClassAttendanceList
                students={experimentalStudents}
                title="Aula Experimental"
                handleOneStudentDetails={handleOneStudentDetails}
              />
            )}
          </tbody>
        </table>

        {selectedClassDate && (
          <button
            type="submit"
            disabled={selectedClassDate.toDate() > new Date() ? true : false}
            className={`mt-4 ${
              selectedClassDate.toDate() > new Date()
                ? "bg-gray-500"
                : "bg-blue-500"
            } text-white p-2 rounded`}
          >
            {selectedClassDate.toDate() > new Date()
              ? "Não é possível enviar Chamada Futura"
              : `Enviar Chamada`}
          </button>
        )}
      </form>
    </FormProvider>
  );
}
