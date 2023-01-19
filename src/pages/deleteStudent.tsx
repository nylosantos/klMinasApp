/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { SelectOptions } from "../components/SelectOptions";
import { api } from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "../components/Header";
import { SubmitHandler, useForm } from "react-hook-form";
import { deleteStudentValidationSchema } from "../components/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteStudentValidationZProps } from "../@types";

{
  /* APAGAR DEPOIS ------------------------------------------------------------------------------------------------------------------------------- */
}
{
  /* AJUSTAR TELEFONE ATRAVÉS DO QUE ESTÁ FEITO NO zodStudentValidation */
  /* ALÉM DE DESCREVER AS FUNÇÕES E O CÓDIGO COMO UM TODO */
  /* CRIAR O FORM SUBMIT E, POR FIM, DELETAR OS CÓDIGOS NÃO UTILIZADOS */
}
{
  /* APAGAR DEPOIS ------------------------------------------------------------------------------------------------------------------------------- */
}

export default function DeleteStudent(props: any) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [studentData, setStudentData] = useState<DeleteStudentValidationZProps>(
    {
      confirmDelete: false,
      id: "",
      schoolId: "",
    }
  );

  const [studentArray, setStudentArray] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // SELECT STUDENTS FROM SCHOOL DATA
  const handleStudentsBySchool = async (schoolId: string) => {
    await api.get(`/student/school/${schoolId}`).then((response) => {
      setStudentArray(response.data.count);
    });
  };

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeleteStudentValidationZProps>({
    resolver: zodResolver(deleteStudentValidationSchema),
    defaultValues: {
      id: "",
      schoolId: "",
      confirmDelete: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setStudentData({
      id: "",
      confirmDelete: false,
      schoolId: "",
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("id", studentData.id);
    setValue("schoolId", studentData.schoolId);
    setValue("confirmDelete", studentData.confirmDelete);
  }, [studentData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.id, errors.schoolId];
    fullErrors.map((fieldError) => {
      toast.error(fieldError?.message, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    });
  }, [errors]);

  const handleDeleteStudent: SubmitHandler<
    DeleteStudentValidationZProps
  > = async (data) => {
    // TESTING CONFIRM DELETE
    if (!confirmDelete) {
      toast.error(`Por favor, selecione "Confirmar exclusão" para continuar.`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
      return console.log("Terminou no confirmar exclusão");
    }
    console.log(data);
    setIsSubmitting(true);
    await api
      .post("/deleteStudent", {
        id: data.id,
      })
      .then((response) => {
        resetForm();
        console.log("ESSA É A RESPONSE", response);
        toast.success(`Aluno deletado com sucesso! 👌`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log("ESSE É O ERROR", error);
        console.log(error.response.data);
        toast.error(`Ocorreu um erro... 🤯`, {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-col container">
        <ToastContainer limit={5} />
        <h1 className="font-bold text-2xl mb-4">Deletar Aluno</h1>
        <form
          onSubmit={handleSubmit(handleDeleteStudent)}
          className="flex flex-col w-11/12 gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800"
        >
          {/* SCHOOL SELECT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="schoolSelect" className="w-2/4 text-right">
              Selecione a Escola:{" "}
            </label>
            <select
              className={
                errors.schoolId
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
              name="schoolSelect"
              value={
                studentData.schoolId
                  ? studentData.schoolId
                  : " -- select an option -- "
              }
              onChange={(e) => {
                handleStudentsBySchool(e.target.value);
                setStudentData({
                  ...studentData,
                  id: "",
                  schoolId: e.target.value,
                });
              }}
            >
              <SelectOptions optionProps={props.school} />
            </select>
          </div>

          {/* STUDENT SELECT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="id" className="w-2/4 text-right">
              Selecione o Aluno:{" "}
            </label>
            <select
              className={
                errors.id
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
              name="id"
              value={
                studentData.id ? studentData.id : " -- select an option -- "
              }
              onChange={(e) =>
                setStudentData({
                  ...studentData,
                  id: e.target.value,
                })
              }
            >
              <SelectOptions optionProps={studentArray} />
            </select>
          </div>

          {/** CHECKBOX CONFIRM DELETE */}
          <div className="flex justify-center items-center gap-2">
            <input
              type="checkbox"
              name="confirmDelete"
              className="ml-1"
              checked={confirmDelete}
              onChange={() => {
                setConfirmDelete(!confirmDelete);
                setStudentData({
                  ...studentData,
                  confirmDelete: !confirmDelete,
                });
              }}
            />
            <label
              htmlFor="confirmDelete"
              className="text-sm text-gray-600 dark:text-gray-100"
            >
              Confirmar exclusão - Atenção: esse processo é{" "}
              <span className="font-bold">irreversível</span>!
            </label>
          </div>

          {/* SUBMIT AND RESET BUTTONS */}
          <div className="flex gap-2">
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="border rounded border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/4"
            >
              {!isSubmitting ? "Criar" : "Criando"}
            </button>

            {/* RESET BUTTON */}
            <button
              type="reset"
              className="border rounded border-gray-600 bg-gray-200 disabled:bg-gray-100 text-gray-600 w-2/4"
              disabled={isSubmitting}
              onClick={() => {
                resetForm();
              }}
            >
              {isSubmitting ? "Aguarde" : "Limpar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const [
    schoolResponse,
    schoolClassResponse,
    schoolCourseResponse,
    scheduleResponse,
    classDayResponse,
  ] = await Promise.all([
    api.get("school"),
    api.get("schoolClass"),
    api.get("schoolCourse"),
    api.get("schedule"),
    api.get("classDays"),
  ]);

  return {
    props: {
      school: schoolResponse.data.count,
      schoolClass: schoolClassResponse.data.count,
      schoolCourse: schoolCourseResponse.data.count,
      schedule: scheduleResponse.data.count,
      classDay: classDayResponse.data.count,
    },
  };
};
