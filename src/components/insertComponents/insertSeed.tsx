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

import { createSeedValidationSchema } from "../zodValidation";
import { CreateSeedValidationZProps } from "../../@types";
import { app } from "../../db/Firebase";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InsertSeed() {
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
    const commonIdBernoulli = uuidv4();
    const schoolBernoulli = doc(db, "schools", commonIdBernoulli);
    batch.set(schoolBernoulli, {
      name: "Colégio Bernoulli",
      id: commonIdBernoulli,
      timestamp: serverTimestamp(),
    });

    const commonIdEdnaRoriz = uuidv4();
    const schoolEdnaRoriz = doc(db, "schools", commonIdEdnaRoriz);
    batch.set(schoolEdnaRoriz, {
      name: "Colégio Edna Roriz",
      id: commonIdEdnaRoriz,
      timestamp: serverTimestamp(),
    });

    const commonIdBilboqueBuritis = uuidv4();
    const schoolBilboqueBuritis = doc(db, "schools", commonIdBilboqueBuritis);
    batch.set(schoolBilboqueBuritis, {
      name: "Colégio Bilboquê Buritis",
      id: commonIdBilboqueBuritis,
      timestamp: serverTimestamp(),
    });

    const commonIdBilboqueGutierrez = uuidv4();
    const schoolBilboqueGutierrez = doc(
      db,
      "schools",
      commonIdBilboqueGutierrez
    );
    batch.set(schoolBilboqueGutierrez, {
      name: "Colégio Bilboquê Gutierrez",
      id: commonIdBilboqueGutierrez,
      timestamp: serverTimestamp(),
    });

    const commonIdVillaBuritis = uuidv4();
    const schoolVillaBuritis = doc(db, "schools", commonIdVillaBuritis);
    batch.set(schoolVillaBuritis, {
      name: "Colégio Villa Buritis",
      id: commonIdVillaBuritis,
      timestamp: serverTimestamp(),
    });

    // CREATING SCHOOL CLASSES
    const commomIdbernoulliFirstAndSecondPeriod = uuidv4();
    const bernoulliFirstAndSecondPeriod = doc(
      db,
      "schoolClasses",
      commomIdbernoulliFirstAndSecondPeriod
    );
    batch.set(bernoulliFirstAndSecondPeriod, {
      id: commomIdbernoulliFirstAndSecondPeriod,
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 1º e 2º Período",
      schoolName: "Colégio Bernoulli",
      schoolId: commonIdBernoulli,
      available: true,
    });

    const commonIdbernoulliFirstAndSecondYear = uuidv4();
    const bernoulliFirstAndSecondYear = doc(
      db,
      "schoolClasses",
      commonIdbernoulliFirstAndSecondYear
    );
    batch.set(bernoulliFirstAndSecondYear, {
      id: commonIdbernoulliFirstAndSecondYear,
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 1º e 2º Ano",
      schoolName: "Colégio Bernoulli",
      schoolId: commonIdBernoulli,
      available: true,
    });

    const commomIdbernoulliThirdToFifthYear = uuidv4();
    const bernoulliThirdToFifthYear = doc(
      db,
      "schoolClasses",
      commomIdbernoulliThirdToFifthYear
    );
    batch.set(bernoulliThirdToFifthYear, {
      id: commomIdbernoulliThirdToFifthYear,
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 3º ao 5º Ano",
      schoolName: "Colégio Bernoulli",
      schoolId: commonIdBernoulli,
      available: true,
    });

    const commomIdschoolClassVillaBuritis = uuidv4();
    const schoolClassVillaBuritis = doc(
      db,
      "schoolClasses",
      commomIdschoolClassVillaBuritis
    );
    batch.set(schoolClassVillaBuritis, {
      id: commomIdschoolClassVillaBuritis,
      timestamp: serverTimestamp(),
      name: "Turma Villa Buritis",
      schoolName: "Colégio Villa Buritis",
      schoolId: commonIdVillaBuritis,
      available: true,
    });

    const commomIdschoolClassBilboqueGutierrez = uuidv4();
    const schoolClassBilboqueGutierrez = doc(
      db,
      "schoolClasses",
      commomIdschoolClassBilboqueGutierrez
    );
    batch.set(schoolClassBilboqueGutierrez, {
      id: commomIdschoolClassBilboqueGutierrez,
      timestamp: serverTimestamp(),
      name: "Turma Bilboquê Gutierrez",
      schoolName: "Colégio Bilboquê Gutierrez",
      schoolId: "commonIdBilboqueGutierrez",
      available: true,
    });

    const commomIdschoolClassBilboqueBuritis = uuidv4();
    const schoolClassBilboqueBuritis = doc(
      db,
      "schoolClasses",
      commomIdschoolClassBilboqueBuritis
    );
    batch.set(schoolClassBilboqueBuritis, {
      id: commomIdschoolClassBilboqueBuritis,
      timestamp: serverTimestamp(),
      name: "Turma Bilboquê Buritis",
      schoolName: "Colégio Bilboquê Buritis",
      schoolId: commonIdBilboqueBuritis,
      available: true,
    });

    const commomIdschoolClassEdnaRoriz = uuidv4();
    const schoolClassEdnaRoriz = doc(
      db,
      "schoolClasses",
      commomIdschoolClassEdnaRoriz
    );
    batch.set(schoolClassEdnaRoriz, {
      id: commomIdschoolClassEdnaRoriz,
      timestamp: serverTimestamp(),
      name: "Turma Edna Roriz",
      schoolName: "Colégio Edna Roriz",
      schoolId: commonIdEdnaRoriz,
      available: true,
    });

    // CREATING SCHOOL COURSES
    const commomIdBallet = uuidv4();
    const ballet = doc(db, "schoolCourses", commomIdBallet);
    batch.set(ballet, {
      id: commomIdBallet,
      timestamp: serverTimestamp(),
      name: "Ballet",
      price: 145,
    });

    const commomIdFutsal = uuidv4();
    const futsal = doc(db, "schoolCourses", commomIdFutsal);
    batch.set(futsal, {
      id: commomIdFutsal,
      timestamp: serverTimestamp(),
      name: "Futsal",
      price: 145,
    });

    const commomIdJudo = uuidv4();
    const judo = doc(db, "schoolCourses", commomIdJudo);
    batch.set(judo, {
      id: commomIdJudo,
      timestamp: serverTimestamp(),
      name: "Judô",
      price: 145,
    });
    const commomIdIniciacaoEsportiva = uuidv4();
    const iniciacaoEsportiva = doc(
      db,
      "schoolCourses",
      commomIdIniciacaoEsportiva
    );
    batch.set(iniciacaoEsportiva, {
      id: commomIdIniciacaoEsportiva,
      timestamp: serverTimestamp(),
      name: "Iniciação Esportiva",
      price: 145,
    });

    const commomIdJazz = uuidv4();
    const jazz = doc(db, "schoolCourses", commomIdJazz);
    batch.set(jazz, {
      id: commomIdJazz,
      timestamp: serverTimestamp(),
      name: "Jazz",
      price: 145,
    });

    const commomIdXadrez = uuidv4();
    const xadrez = doc(db, "schoolCourses", commomIdXadrez);
    batch.set(xadrez, {
      id: commomIdXadrez,
      timestamp: serverTimestamp(),
      name: "Xadrez",
      price: 145,
    });

    const commomIdFuncionalKids = uuidv4();
    const funcionalKids = doc(db, "schoolCourses", commomIdFuncionalKids);
    batch.set(funcionalKids, {
      id: commomIdFuncionalKids,
      timestamp: serverTimestamp(),
      name: "Funcional Kids",
      price: 145,
    });

    // CREATING CLASS DAYS
    const commomIdMondayWednesday = uuidv4();
    const mondayWednesday = doc(db, "classDays", commomIdMondayWednesday);
    batch.set(mondayWednesday, {
      id: commomIdMondayWednesday,
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

    const commomIdTuesdayThursday = uuidv4();
    const tuesdayThursday = doc(db, "classDays", commomIdTuesdayThursday);
    batch.set(tuesdayThursday, {
      id: commomIdTuesdayThursday,
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

    const commomIdTuesdayThursdayFriday = uuidv4();
    const tuesdayThursdayFriday = doc(
      db,
      "classDays",
      commomIdTuesdayThursdayFriday
    );
    batch.set(tuesdayThursdayFriday, {
      id: commomIdTuesdayThursdayFriday,
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

    const commomIdFriday = uuidv4();
    const friday = doc(db, "classDays", commomIdFriday);
    batch.set(friday, {
      id: commomIdFriday,
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
    const commonIdScheduleBernoulliFirstAndSecondPeriodMorning = uuidv4();
    const scheduleBernoulliFirstAndSecondPeriodMorning = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliFirstAndSecondPeriodMorning
    );
    batch.set(scheduleBernoulliFirstAndSecondPeriodMorning, {
      id: commonIdScheduleBernoulliFirstAndSecondPeriodMorning,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Período Matutino",
      transitionStart: "11:40",
      transitionEnd: "11:55",
      classStart: "11:55",
      classEnd: "12:40",
      exit: "12:45",
    });

    const commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon = uuidv4();
    const scheduleBernoulliFirstAndSecondPeriodAfternoon = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon
    );
    batch.set(scheduleBernoulliFirstAndSecondPeriodAfternoon, {
      id: commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Período Vespertino",
      transitionStart: "17:40",
      transitionEnd: "17:55",
      classStart: "17:55",
      classEnd: "18:40",
      exit: "18:45",
    });

    const commonIdScheduleBernoulliFirstAndSecondYearMorning = uuidv4();
    const scheduleBernoulliFirstAndSecondYearMorning = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliFirstAndSecondYearMorning
    );
    batch.set(scheduleBernoulliFirstAndSecondYearMorning, {
      id: commonIdScheduleBernoulliFirstAndSecondYearMorning,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Matutino",
      transitionStart: "12:15",
      transitionEnd: "12:40",
      classStart: "12:40",
      classEnd: "13:25",
      exit: "13:30",
    });

    const commonIdScheduleBernoulliFirstAndSecondYearAfternoon = uuidv4();
    const scheduleBernoulliFirstAndSecondYearAfternoon = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliFirstAndSecondYearAfternoon
    );
    batch.set(scheduleBernoulliFirstAndSecondYearAfternoon, {
      id: commonIdScheduleBernoulliFirstAndSecondYearAfternoon,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      transitionStart: "18:15",
      transitionEnd: "18:40",
      classStart: "18:40",
      classEnd: "19:25",
      exit: "19:30",
    });

    const commonIdScheduleBernoulliFirstAndSecondYearMorningBallet = uuidv4();
    const scheduleBernoulliFirstAndSecondYearMorningBallet = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliFirstAndSecondYearMorningBallet
    );
    batch.set(scheduleBernoulliFirstAndSecondYearMorningBallet, {
      id: commonIdScheduleBernoulliFirstAndSecondYearMorningBallet,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Matutino - Ballet",
      transitionStart: "12:15",
      transitionEnd: "12:40",
      classStart: "12:40",
      classEnd: "13:15",
      exit: "13:20",
    });

    const commonIdScheduleBernoulliFirstAndSecondYearAfternoonBallet = uuidv4();
    const scheduleBernoulliFirstAndSecondYearAfternoonBallet = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliFirstAndSecondYearAfternoonBallet
    );
    batch.set(scheduleBernoulliFirstAndSecondYearAfternoonBallet, {
      id: commonIdScheduleBernoulliFirstAndSecondYearAfternoonBallet,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 1º e 2º Ano Vespertino - Ballet",
      transitionStart: "18:15",
      transitionEnd: "18:40",
      classStart: "18:40",
      classEnd: "19:15",
      exit: "19:20",
    });

    const commonIdScheduleBernoulliThirdToFifthYearMorning = uuidv4();
    const scheduleBernoulliThirdToFifthYearMorning = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliThirdToFifthYearMorning
    );
    batch.set(scheduleBernoulliThirdToFifthYearMorning, {
      id: commonIdScheduleBernoulliThirdToFifthYearMorning,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Matutino",
      transitionStart: "12:00",
      transitionEnd: "12:15",
      classStart: "12:15",
      classEnd: "13:00",
      exit: "13:05",
    });

    const commonIdScheduleBernoulliThirdToFifthYearAfternoon = uuidv4();
    const scheduleBernoulliThirdToFifthYearAfternoon = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliThirdToFifthYearAfternoon
    );
    batch.set(scheduleBernoulliThirdToFifthYearAfternoon, {
      id: commonIdScheduleBernoulliThirdToFifthYearAfternoon,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Vespertino",
      transitionStart: "18:00",
      transitionEnd: "18:15",
      classStart: "18:15",
      classEnd: "19:00",
      exit: "19:05",
    });

    const commonIdScheduleBernoulliThirdToFifthYearMorningXadrez = uuidv4();
    const scheduleBernoulliThirdToFifthYearMorningXadrez = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliThirdToFifthYearMorningXadrez
    );
    batch.set(scheduleBernoulliThirdToFifthYearMorningXadrez, {
      id: commonIdScheduleBernoulliThirdToFifthYearMorningXadrez,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Matutino - Xadrez",
      transitionStart: "12:00",
      transitionEnd: "12:15",
      classStart: "12:15",
      classEnd: "12:50",
      exit: "12:55",
    });

    const commonIdScheduleBernoulliThirdToFifthYearAfternoonXadrez = uuidv4();
    const scheduleBernoulliThirdToFifthYearAfternoonXadrez = doc(
      db,
      "schedules",
      commonIdScheduleBernoulliThirdToFifthYearAfternoonXadrez
    );
    batch.set(scheduleBernoulliThirdToFifthYearAfternoonXadrez, {
      id: commonIdScheduleBernoulliThirdToFifthYearAfternoonXadrez,
      timestamp: serverTimestamp(),
      name: "Horário Bernoulli - 3º ao 5º Ano Vespertino - Xadrez",
      transitionStart: "18:00",
      transitionEnd: "18:15",
      classStart: "18:15",
      classEnd: "18:50",
      exit: "18:55",
    });

    const commonIdScheduleVillaBuritis = uuidv4();
    const scheduleVillaBuritis = doc(
      db,
      "schedules",
      commonIdScheduleVillaBuritis
    );
    batch.set(scheduleVillaBuritis, {
      id: commonIdScheduleVillaBuritis,
      timestamp: serverTimestamp(),
      name: "Horário Villa Buritis",
      transitionStart: "17:35",
      transitionEnd: "17:50",
      classStart: "17:50",
      classEnd: "18:40",
      exit: "18:45",
    });

    const commonIdScheduleBilboqueGutierrezMorning = uuidv4();
    const scheduleBilboqueGutierrezMorning = doc(
      db,
      "schedules",
      commonIdScheduleBilboqueGutierrezMorning
    );
    batch.set(scheduleBilboqueGutierrezMorning, {
      id: commonIdScheduleBilboqueGutierrezMorning,
      timestamp: serverTimestamp(),
      name: "Horário Bilboquê Gutierrez - Matutino",
      transitionStart: "11:35",
      transitionEnd: "11:50",
      classStart: "11:50",
      classEnd: "12:40",
      exit: "12:45",
    });

    const commonIdScheduleBilboqueGutierrezAfternoon = uuidv4();
    const scheduleBilboqueGutierrezAfternoon = doc(
      db,
      "schedules",
      commonIdScheduleBilboqueGutierrezAfternoon
    );
    batch.set(scheduleBilboqueGutierrezAfternoon, {
      id: commonIdScheduleBilboqueGutierrezAfternoon,
      timestamp: serverTimestamp(),
      name: "Horário Bilboquê Gutierrez - Vespertino",
      transitionStart: "17:35",
      transitionEnd: "17:50",
      classStart: "17:50",
      classEnd: "18:40",
      exit: "18:45",
    });

    const commonIdScheduleBilboqueBuritis = uuidv4();
    const scheduleBilboqueBuritis = doc(
      db,
      "schedules",
      commonIdScheduleBilboqueBuritis
    );
    batch.set(scheduleBilboqueBuritis, {
      id: commonIdScheduleBilboqueBuritis,
      timestamp: serverTimestamp(),
      name: "Horário Bilboquê Buritis",
      transitionStart: "17:35",
      transitionEnd: "17:50",
      classStart: "17:50",
      classEnd: "18:40",
      exit: "18:45",
    });

    const commonIdScheduleEdnaRoriz = uuidv4();
    const scheduleEdnaRoriz = doc(db, "schedules", commonIdScheduleEdnaRoriz);
    batch.set(scheduleEdnaRoriz, {
      id: commonIdScheduleEdnaRoriz,
      timestamp: serverTimestamp(),
      name: "Horário Edna Roriz",
      transitionStart: "11:45",
      transitionEnd: "12:00",
      classStart: "12:00",
      classEnd: "13:00",
      exit: "13:05",
    });

    // CREATING TEACHER EXAMPLE
    const commonIdteacherExample = uuidv4();
    const teacherExample = doc(db, "teachers", commonIdteacherExample);
    batch.set(teacherExample, {
      name: "Natália Peruzzo Costa",
      id: commonIdteacherExample,
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
            {!isSubmitting ? "Criar" : "Criando"}
          </button>
        </div>
      </form>
    </div>
  );
}
