/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import {
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { createSeedValidationSchema } from "../../@types/zodValidation";
import { CreateSeedValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function DeleteSeed() {
  // SEED DATA
  const [seedData, setSeedData] = useState<CreateSeedValidationZProps>({
    confirmInsert: false,
  });

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REACT HOOK FORM SETTINGS
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSeedValidationZProps>({
    resolver: zodResolver(createSeedValidationSchema),
    defaultValues: {
      confirmInsert: false,
    },
  });

  // RESET FORM FUNCTION
  const resetForm = () => {
    setSeedData({
      confirmInsert: false,
    });
    reset();
  };

  // SET REACT HOOK FORM VALUES
  useEffect(() => {
    setValue("confirmInsert", seedData.confirmInsert);
  }, [seedData]);

  // SET REACT HOOK FORM ERRORS
  useEffect(() => {
    const fullErrors = [errors.confirmInsert];
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

  // SUBMIT SEED DATA FUNCTION
  const handleAddSeed: SubmitHandler<CreateSeedValidationZProps> = async (
    data
  ) => {
    setIsSubmitting(true);

    // CHECK INSERT CONFIRMATION
    if (!data.confirmInsert) {
      setIsSubmitting(false);
      return toast.error(
        `Por favor, clique em "CONFIRMAR CRIAÇÃO" para adicionar o SEED ao banco de dados... ☑️`,
        {
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        }
      );
    }

    // CREATE WRITE BATCH
    const batch = writeBatch(db);

    // CREATING SCHOOLS
    const schoolBernoulli = doc(db, "schools", uuidv4());
    const schoolEdnaRoriz = doc(db, "schools", uuidv4());
    const schoolBilboqueBuritis = doc(db, "schools", uuidv4());
    const schoolBilboqueGutierrez = doc(db, "schools", uuidv4());
    const schoolVillaBuritis = doc(db, "schools", uuidv4());
    batch.set(schoolBernoulli, {
      name: "Colégio Bernoulli",
      id: uuidv4(),
      timestamp: serverTimestamp(),
    });
    batch.set(schoolEdnaRoriz, {
      name: "Colégio Edna Roriz",
      id: uuidv4(),
      timestamp: serverTimestamp(),
    });
    batch.set(schoolBilboqueBuritis, {
      name: "Colégio Bilboquê Buritis",
      id: uuidv4(),
      timestamp: serverTimestamp(),
    });
    batch.set(schoolBilboqueGutierrez, {
      name: "Colégio Bilboquê Gutierrez",
      id: uuidv4(),
      timestamp: serverTimestamp(),
    });
    batch.set(schoolVillaBuritis, {
      name: "Colégio Villa Buritis",
      id: uuidv4(),
      timestamp: serverTimestamp(),
    });

    // CREATING SCHOOL CLASSES
    const bernoulliFirstAndSecondPeriod = doc(db, "schoolClasses", uuidv4());
    const bernoulliFirstAndSecondYear = doc(db, "schoolClasses", uuidv4());
    const bernoulliThirdToFifthYear = doc(db, "schoolClasses", uuidv4());
    const schoolClassVillaBuritis = doc(db, "schoolClasses", uuidv4());
    const schoolClassBilboqueGutierrez = doc(db, "schoolClasses", uuidv4());
    const schoolClassBilboqueBuritis = doc(db, "schoolClasses", uuidv4());
    const schoolClassEdnaRoriz = doc(db, "schoolClasses", uuidv4());
    batch.set(bernoulliFirstAndSecondPeriod, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 1º e 2º Período",
      available: true,
    });
    batch.set(bernoulliFirstAndSecondYear, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 1º e 2º Ano",
      available: true,
    });
    batch.set(bernoulliThirdToFifthYear, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 3º ao 5º Ano",
      available: true,
    });
    batch.set(schoolClassVillaBuritis, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Villa Buritis",
      available: true,
    });
    batch.set(schoolClassBilboqueGutierrez, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Bilboquê Gutierrez",
      available: true,
    });
    batch.set(schoolClassBilboqueBuritis, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Bilboquê Buritis",
      available: true,
    });
    batch.set(schoolClassEdnaRoriz, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Turma Edna Roriz",
      available: true,
    });

    // CREATING SCHOOL COURSES
    const ballet = doc(db, "schoolCourses", uuidv4());
    const futsal = doc(db, "schoolCourses", uuidv4());
    const judo = doc(db, "schoolCourses", uuidv4());
    const iniciacaoEsportiva = doc(db, "schoolCourses", uuidv4());
    const jazz = doc(db, "schoolCourses", uuidv4());
    const xadrez = doc(db, "schoolCourses", uuidv4());
    const funcionalKids = doc(db, "schoolCourses", uuidv4());
    batch.set(ballet, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Ballet",
      price: 145,
    });
    batch.set(futsal, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Futsal",
      price: 145,
    });
    batch.set(judo, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Judô",
      price: 145,
    });
    batch.set(iniciacaoEsportiva, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Iniciação Esportiva",
      price: 145,
    });
    batch.set(jazz, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Jazz",
      price: 145,
    });
    batch.set(xadrez, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Xadrez",
      price: 145,
    });
    batch.set(funcionalKids, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Funcional Kids",
      price: 145,
    });

    // CREATING CLASS DAYS
    const tuesdayThursday = doc(db, "classDays", uuidv4());
    const mondayWednesday = doc(db, "classDays", uuidv4());
    const tuesdayThursdayFriday = doc(db, "classDays", uuidv4());
    const friday = doc(db, "classDays", uuidv4());
    batch.set(tuesdayThursday, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Terça e Quinta-feira",
      sunday: false,
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: false,
    });
    batch.set(mondayWednesday, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Segunda e Quarta-feira",
      sunday: false,
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: false,
      saturday: false,
    });
    batch.set(tuesdayThursdayFriday, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Terça, Quinta e Sexta-Feira",
      sunday: false,
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
    });
    batch.set(friday, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Sexta-feira",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: false,
    });

    // CREATING SCHEDULES
    const scheduleBernoulliFirstAndSecondPeriodMorning = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliFirstAndSecondPeriodAfternoon = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliFirstAndSecondYearMorning = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliFirstAndSecondYearAfternoon = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliFirstAndSecondYearMorningBallet = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliFirstAndSecondYearAfternoonBallet = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliThirdToFifthYearMorning = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliThirdToFifthYearAfternoon = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliThirdToFifthYearMorningXadrez = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleBernoulliThirdToFifthYearAfternoonXadrez = doc(
      db,
      "schedules",
      uuidv4()
    );
    const scheduleVillaBuritis = doc(db, "schedules", uuidv4());
    const scheduleBilboqueGutierrezMorning = doc(db, "schedules", uuidv4());
    const scheduleBilboqueGutierrezAfternoon = doc(db, "schedules", uuidv4());
    const scheduleBilboqueBuritis = doc(db, "schedules", uuidv4());
    const scheduleEdnaRoriz = doc(db, "schedules", uuidv4());
    batch.set(scheduleBernoulliFirstAndSecondPeriodMorning, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Período Matutino",
      transitionStart: "11:40",
      transitionEnd: "11:55",
      classStart: "11:55",
      classEnd: "12:40",
      exit: "12:45",
    });
    batch.set(scheduleBernoulliFirstAndSecondPeriodAfternoon, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Período Vespertino",
      transitionStart: "17:40",
      transitionEnd: "17:55",
      classStart: "17:55",
      classEnd: "18:40",
      exit: "18:45",
    });
    batch.set(scheduleBernoulliFirstAndSecondYearMorning, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Matutino",
      transitionStart: "12:15",
      transitionEnd: "12:40",
      classStart: "12:40",
      classEnd: "13:25",
      exit: "13:30",
    });
    batch.set(scheduleBernoulliFirstAndSecondYearAfternoon, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      transitionStart: "18:15",
      transitionEnd: "18:40",
      classStart: "18:40",
      classEnd: "19:25",
      exit: "19:30",
    });
    batch.set(scheduleBernoulliFirstAndSecondYearMorningBallet, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Matutino - Ballet",
      transitionStart: "12:15",
      transitionEnd: "12:40",
      classStart: "12:40",
      classEnd: "13:15",
      exit: "13:20",
    });
    batch.set(scheduleBernoulliFirstAndSecondYearAfternoonBallet, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Vespertino - Ballet",
      transitionStart: "18:15",
      transitionEnd: "18:40",
      classStart: "18:40",
      classEnd: "19:15",
      exit: "19:20",
    });
    batch.set(scheduleBernoulliThirdToFifthYearMorning, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Matutino",
      transitionStart: "12:00",
      transitionEnd: "12:15",
      classStart: "12:15",
      classEnd: "13:00",
      exit: "13:05",
    });
    batch.set(scheduleBernoulliThirdToFifthYearAfternoon, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Vespertino",
      transitionStart: "18:00",
      transitionEnd: "18:15",
      classStart: "18:15",
      classEnd: "19:00",
      exit: "19:05",
    });
    batch.set(scheduleBernoulliThirdToFifthYearMorningXadrez, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Matutino - Xadrez",
      transitionStart: "12:00",
      transitionEnd: "12:15",
      classStart: "12:15",
      classEnd: "12:50",
      exit: "12:55",
    });
    batch.set(scheduleBernoulliThirdToFifthYearAfternoonXadrez, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Vespertino - Xadrez",
      transitionStart: "18:00",
      transitionEnd: "18:15",
      classStart: "18:15",
      classEnd: "18:50",
      exit: "18:55",
    });
    batch.set(scheduleVillaBuritis, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Villa Buritis",
      transitionStart: "17:35",
      transitionEnd: "17:50",
      classStart: "17:50",
      classEnd: "18:40",
      exit: "18:45",
    });
    batch.set(scheduleBilboqueGutierrezMorning, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bilboquê Gutierrez - Matutino",
      transitionStart: "11:35",
      transitionEnd: "11:50",
      classStart: "11:50",
      classEnd: "12:40",
      exit: "12:45",
    });
    batch.set(scheduleBilboqueGutierrezAfternoon, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bilboquê Gutierrez - Vespertino",
      transitionStart: "17:35",
      transitionEnd: "17:50",
      classStart: "17:50",
      classEnd: "18:40",
      exit: "18:45",
    });
    batch.set(scheduleBilboqueBuritis, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Bilboquê Buritis",
      transitionStart: "17:35",
      transitionEnd: "17:50",
      classStart: "17:50",
      classEnd: "18:40",
      exit: "18:45",
    });
    batch.set(scheduleEdnaRoriz, {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      name: "Horário Edna Roriz",
      transitionStart: "11:45",
      transitionEnd: "12:00",
      classStart: "12:00",
      classEnd: "13:00",
      exit: "13:05",
    });

    // CREATING TEACHER EXAMPLE
    const teacherExample = doc(db, "teachers", uuidv4());
    batch.set(teacherExample, {
      name: "Natália Peruzzo Costa",
      id: uuidv4(),
      timestamp: serverTimestamp(),
    });

    // SUBMITTING ALL DATA
    try {
      await batch.commit();
      toast.success(`Criado com sucesso! 👌`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.log("ERROR:", error);
      toast.error(`Ocorreu um erro... 🤯`, {
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col container text-center">
      <ToastContainer limit={5} />
      <h1 className="font-bold text-2xl my-4">Adicionar Seed</h1>
      <form
        onSubmit={handleSubmit(handleAddSeed)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-gray-700/20 dark:bg-gray-100/10 mt-2"
      >
        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmDelete"
            className="ml-1 dark: text-green-500 dark:text-green-500 border-none"
            checked={seedData.confirmInsert}
            onChange={() => {
              setSeedData({
                ...seedData,
                confirmInsert: !seedData.confirmInsert,
              });
            }}
          />
          <label
            htmlFor="confirmInsert"
            className="text-sm text-gray-600 dark:text-gray-100"
          >
            Confirmar criação de todo o SEED
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-green-500 disabled:bg-green-500/70 disabled:dark:bg-green-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-full"
          >
            {!isSubmitting ? "Excluir" : "Excluindo"}
          </button>
        </div>
      </form>
    </div>
  );
}
