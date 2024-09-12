/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { CreateSeedValidationZProps } from "../../@types";
import { SubmitLoading } from "../layoutComponents/SubmitLoading";
import { createSeedValidationSchema } from "../../@types/zodValidation";

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
    setValue,
    formState: { errors },
  } = useForm<CreateSeedValidationZProps>({
    resolver: zodResolver(createSeedValidationSchema),
    defaultValues: {
      confirmInsert: false,
    },
  });

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
    const commomIdBernoulliFirstAndSecondPeriod = uuidv4();
    const bernoulliFirstAndSecondPeriod = doc(
      db,
      "schoolClasses",
      commomIdBernoulliFirstAndSecondPeriod
    );
    batch.set(bernoulliFirstAndSecondPeriod, {
      id: commomIdBernoulliFirstAndSecondPeriod,
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 1º e 2º Período",
      schoolName: "Colégio Bernoulli",
      schoolId: commonIdBernoulli,
      available: "open",
    });

    const commonIdBernoulliFirstAndSecondYear = uuidv4();
    const bernoulliFirstAndSecondYear = doc(
      db,
      "schoolClasses",
      commonIdBernoulliFirstAndSecondYear
    );
    batch.set(bernoulliFirstAndSecondYear, {
      id: commonIdBernoulliFirstAndSecondYear,
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 1º e 2º Ano",
      schoolName: "Colégio Bernoulli",
      schoolId: commonIdBernoulli,
      available: "open",
    });

    const commomIdBernoulliThirdToFifthYear = uuidv4();
    const bernoulliThirdToFifthYear = doc(
      db,
      "schoolClasses",
      commomIdBernoulliThirdToFifthYear
    );
    batch.set(bernoulliThirdToFifthYear, {
      id: commomIdBernoulliThirdToFifthYear,
      timestamp: serverTimestamp(),
      name: "Turma Bernoulli - 3º ao 5º Ano",
      schoolName: "Colégio Bernoulli",
      schoolId: commonIdBernoulli,
      available: "open",
    });

    const commomIdSchoolClassVillaBuritis = uuidv4();
    const schoolClassVillaBuritis = doc(
      db,
      "schoolClasses",
      commomIdSchoolClassVillaBuritis
    );
    batch.set(schoolClassVillaBuritis, {
      id: commomIdSchoolClassVillaBuritis,
      timestamp: serverTimestamp(),
      name: "Turma Villa Buritis",
      schoolName: "Colégio Villa Buritis",
      schoolId: commonIdVillaBuritis,
      available: "open",
    });

    const commomIdSchoolClassBilboqueGutierrez = uuidv4();
    const schoolClassBilboqueGutierrez = doc(
      db,
      "schoolClasses",
      commomIdSchoolClassBilboqueGutierrez
    );
    batch.set(schoolClassBilboqueGutierrez, {
      id: commomIdSchoolClassBilboqueGutierrez,
      timestamp: serverTimestamp(),
      name: "Turma Bilboquê Gutierrez",
      schoolName: "Colégio Bilboquê Gutierrez",
      schoolId: commonIdBilboqueGutierrez,
      available: "open",
    });

    const commomIdSchoolClassBilboqueBuritis = uuidv4();
    const schoolClassBilboqueBuritis = doc(
      db,
      "schoolClasses",
      commomIdSchoolClassBilboqueBuritis
    );
    batch.set(schoolClassBilboqueBuritis, {
      id: commomIdSchoolClassBilboqueBuritis,
      timestamp: serverTimestamp(),
      name: "Turma Bilboquê Buritis",
      schoolName: "Colégio Bilboquê Buritis",
      schoolId: commonIdBilboqueBuritis,
      available: "open",
    });

    const commomIdSchoolClassEdnaRoriz = uuidv4();
    const schoolClassEdnaRoriz = doc(
      db,
      "schoolClasses",
      commomIdSchoolClassEdnaRoriz
    );
    batch.set(schoolClassEdnaRoriz, {
      id: commomIdSchoolClassEdnaRoriz,
      timestamp: serverTimestamp(),
      name: "Turma Edna Roriz",
      schoolName: "Colégio Edna Roriz",
      schoolId: commonIdEdnaRoriz,
      available: "open",
    });

    // CREATING SCHOOL COURSES
    const commomIdBallet = uuidv4();
    const ballet = doc(db, "schoolCourses", commomIdBallet);
    batch.set(ballet, {
      id: commomIdBallet,
      timestamp: serverTimestamp(),
      name: "Ballet",
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
    });

    const commomIdFutsal = uuidv4();
    const futsal = doc(db, "schoolCourses", commomIdFutsal);
    batch.set(futsal, {
      id: commomIdFutsal,
      timestamp: serverTimestamp(),
      name: "Futsal",
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
    });

    const commomIdJudo = uuidv4();
    const judo = doc(db, "schoolCourses", commomIdJudo);
    batch.set(judo, {
      id: commomIdJudo,
      timestamp: serverTimestamp(),
      name: "Judô",
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
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
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
    });

    const commomIdJazz = uuidv4();
    const jazz = doc(db, "schoolCourses", commomIdJazz);
    batch.set(jazz, {
      id: commomIdJazz,
      timestamp: serverTimestamp(),
      name: "Jazz",
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
    });

    const commomIdXadrez = uuidv4();
    const xadrez = doc(db, "schoolCourses", commomIdXadrez);
    batch.set(xadrez, {
      id: commomIdXadrez,
      timestamp: serverTimestamp(),
      name: "Xadrez",
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
    });

    const commomIdFuncionalKids = uuidv4();
    const funcionalKids = doc(db, "schoolCourses", commomIdFuncionalKids);
    batch.set(funcionalKids, {
      id: commomIdFuncionalKids,
      timestamp: serverTimestamp(),
      name: "Funcional Kids",
      priceUnit: 160,
      priceBundle: 286,
      bundleDays: 2,
    });

    // CREATING CLASS DAYS
    const commomIdMondayWednesday = uuidv4();
    const mondayWednesday = doc(db, "classDays", commomIdMondayWednesday);
    batch.set(mondayWednesday, {
      id: commomIdMondayWednesday,
      timestamp: serverTimestamp(),
      name: "Segunda - Quarta",
      indexDays: [1, 3],
      indexNames: ["Segunda", "Quarta"],
    });

    const commomIdTuesdayThursday = uuidv4();
    const tuesdayThursday = doc(db, "classDays", commomIdTuesdayThursday);
    batch.set(tuesdayThursday, {
      id: commomIdTuesdayThursday,
      timestamp: serverTimestamp(),
      name: "Terça - Quinta",
      indexDays: [2, 4],
      indexNames: ["Terça", "Quinta"],
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
      name: "Terça - Quinta - Sexta",
      indexDays: [2, 4, 5],
      indexNames: ["Terça", "Quinta", "Sexta"],
    });

    const commomIdFriday = uuidv4();
    const friday = doc(db, "classDays", commomIdFriday);
    batch.set(friday, {
      id: commomIdFriday,
      timestamp: serverTimestamp(),
      name: "Sexta",
      indexDays: [5],
      indexNames: ["Sexta"],
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdBernoulli,
      schoolName: "Colégio Bernoulli",
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
      schoolId: commonIdVillaBuritis,
      schoolName: "Colégio Villa Buritis",
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
      schoolId: commonIdBilboqueGutierrez,
      schoolName: "Colégio Bilboquê Gutierrez",
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
      schoolId: commonIdBilboqueGutierrez,
      schoolName: "Colégio Bilboquê Gutierrez",
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
      schoolId: commonIdBilboqueBuritis,
      schoolName: "Colégio Bilboquê Buritis",
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
      schoolId: commonIdEdnaRoriz,
      schoolName: "Colégio Edna Roriz",
    });

    // CREATING TEACHER EXAMPLE
    const commonIdteacherExample = uuidv4();
    const teacherExample = doc(db, "teachers", commonIdteacherExample);
    batch.set(teacherExample, {
      name: "Natália Peruzzo Costa",
      email: "natalia@teste.com",
      phone: "+5511111111111",
      id: commonIdteacherExample,
      timestamp: serverTimestamp(),
    });

    // CREATING CURRICULUM
    // BERNOULLI - 1º AO 2º PERÍODO - BALLET
    const commomIdBernoulliBallet1to2PeriodMorningCurriculum = uuidv4();
    const bernoulliBallet1to2PeriodMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliBallet1to2PeriodMorningCurriculum
    );
    batch.set(bernoulliBallet1to2PeriodMorningCurriculum, {
      id: commomIdBernoulliBallet1to2PeriodMorningCurriculum,
      name: "Colégio Bernoulli | Ballet | Horário Bernoulli - 1º e 2º Período Matutino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodMorning,
      schedule: "Horário Bernoulli - 1º e 2º Período Matutino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliBallet1to2PeriodAfternoonCurriculum = uuidv4();
    const bernoulliBallet1to2PeriodAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliBallet1to2PeriodAfternoonCurriculum
    );
    batch.set(bernoulliBallet1to2PeriodAfternoonCurriculum, {
      id: commomIdBernoulliBallet1to2PeriodAfternoonCurriculum,
      name: "Colégio Bernoulli | Ballet | Horário Bernoulli - 1º e 2º Período Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Período Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º E 2º ANO - BALLET
    const commomIdBernoulliBallet1and2YearMorningCurriculum = uuidv4();
    const bernoulliBallet1and2YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliBallet1and2YearMorningCurriculum
    );
    batch.set(bernoulliBallet1and2YearMorningCurriculum, {
      id: commomIdBernoulliBallet1and2YearMorningCurriculum,
      name: "Colégio Bernoulli | Ballet | Horário Bernoulli - 1º e 2º Ano Matutino - Ballet | Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearMorningBallet,
      schedule: "Horário Bernoulli - 1º e 2º Ano Matutino - Ballet",
      classDayId: commomIdFriday,
      classDay: "Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliBallet1and2YearAfternoonCurriculum = uuidv4();
    const bernoulliBallet1and2YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliBallet1and2YearAfternoonCurriculum
    );
    batch.set(bernoulliBallet1and2YearAfternoonCurriculum, {
      id: commomIdBernoulliBallet1and2YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Ballet | Horário Bernoulli - 1º e 2º Ano Vespertino - Ballet | Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearAfternoonBallet,
      schedule: "Horário Bernoulli - 1º e 2º Ano Vespertino - Ballet",
      classDayId: commomIdFriday,
      classDay: "Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º AO 2º PERÍODO - FUTSAL
    const commomIdBernoulliFutsal1to2PeriodMorningCurriculum = uuidv4();
    const bernoulliFutsal1to2PeriodMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliFutsal1to2PeriodMorningCurriculum
    );
    batch.set(bernoulliFutsal1to2PeriodMorningCurriculum, {
      id: commomIdBernoulliFutsal1to2PeriodMorningCurriculum,
      name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 1º e 2º Período Matutino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodMorning,
      schedule: "Horário Bernoulli - 1º e 2º Período Matutino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliFutsal1to2PeriodAfternoonCurriculum = uuidv4();
    const bernoulliFutsal1to2PeriodAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliFutsal1to2PeriodAfternoonCurriculum
    );
    batch.set(bernoulliFutsal1to2PeriodAfternoonCurriculum, {
      id: commomIdBernoulliFutsal1to2PeriodAfternoonCurriculum,
      name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 1º e 2º Período Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Período Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º E 2º ANO - FUTSAL
    const commomIdBernoulliFutsal1and2YearMorningCurriculum = uuidv4();
    const bernoulliFutsal1and2YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliFutsal1and2YearMorningCurriculum
    );
    batch.set(bernoulliFutsal1and2YearMorningCurriculum, {
      id: commomIdBernoulliFutsal1and2YearMorningCurriculum,
      name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 1º e 2º Ano Matutino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearMorning,
      schedule: "Horário Bernoulli - 1º e 2º Ano Matutino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliFutsal1and2YearAfternoonCurriculum = uuidv4();
    const bernoulliFutsal1and2YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliFutsal1and2YearAfternoonCurriculum
    );
    batch.set(bernoulliFutsal1and2YearAfternoonCurriculum, {
      id: commomIdBernoulliFutsal1and2YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 1º e 2º Ano Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 3º AO 5º ANO - FUTSAL
    const commomIdBernoulliFutsal3to5YearMorningCurriculum = uuidv4();
    const bernoulliFutsal3to5YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliFutsal3to5YearMorningCurriculum
    );
    batch.set(bernoulliFutsal3to5YearMorningCurriculum, {
      id: commomIdBernoulliFutsal3to5YearMorningCurriculum,
      name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 3º ao 5º Ano Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearMorning,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliFutsal3to5YearAfternoonCurriculum = uuidv4();
    const bernoulliFutsal3to5YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliFutsal3to5YearAfternoonCurriculum
    );
    batch.set(bernoulliFutsal3to5YearAfternoonCurriculum, {
      id: commomIdBernoulliFutsal3to5YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Futsal | Horário Bernoulli - 3º ao 5º Ano Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearAfternoon,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º AO 2º PERÍODO - JUDÔ
    const commomIdBernoulliJudo1to2PeriodMorningCurriculum = uuidv4();
    const bernoulliJudo1to2PeriodMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJudo1to2PeriodMorningCurriculum
    );
    batch.set(bernoulliJudo1to2PeriodMorningCurriculum, {
      id: commomIdBernoulliJudo1to2PeriodMorningCurriculum,
      name: "Colégio Bernoulli | Judô | Horário Bernoulli - 1º e 2º Período Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodMorning,
      schedule: "Horário Bernoulli - 1º e 2º Período Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliJudo1to2PeriodAfternoonCurriculum = uuidv4();
    const bernoulliJudo1to2PeriodAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJudo1to2PeriodAfternoonCurriculum
    );
    batch.set(bernoulliJudo1to2PeriodAfternoonCurriculum, {
      id: commomIdBernoulliJudo1to2PeriodAfternoonCurriculum,
      name: "Colégio Bernoulli | Judô | Horário Bernoulli - 1º e 2º Período Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Período Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º E 2º ANO - JUDÔ
    const commomIdBernoulliJudo1and2YearMorningCurriculum = uuidv4();
    const bernoulliJudo1and2YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJudo1and2YearMorningCurriculum
    );
    batch.set(bernoulliJudo1and2YearMorningCurriculum, {
      id: commomIdBernoulliJudo1and2YearMorningCurriculum,
      name: "Colégio Bernoulli | Judô | Horário Bernoulli - 1º e 2º Ano Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearMorning,
      schedule: "Horário Bernoulli - 1º e 2º Ano Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliJudo1and2YearAfternoonCurriculum = uuidv4();
    const bernoulliJudo1and2YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJudo1and2YearAfternoonCurriculum
    );
    batch.set(bernoulliJudo1and2YearAfternoonCurriculum, {
      id: commomIdBernoulliJudo1and2YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Judô | Horário Bernoulli - 1º e 2º Ano Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 3º AO 5º ANO - JUDÔ
    const commomIdBernoulliJudo3to5YearMorningCurriculum = uuidv4();
    const bernoulliJudo3to5YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJudo3to5YearMorningCurriculum
    );
    batch.set(bernoulliJudo3to5YearMorningCurriculum, {
      id: commomIdBernoulliJudo3to5YearMorningCurriculum,
      name: "Colégio Bernoulli | Judô | Horário Bernoulli - 3º ao 5º Ano Matutino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearMorning,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Matutino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliJudo3to5YearAfternoonCurriculum = uuidv4();
    const bernoulliJudo3to5YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJudo3to5YearAfternoonCurriculum
    );
    batch.set(bernoulliJudo3to5YearAfternoonCurriculum, {
      id: commomIdBernoulliJudo3to5YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Judô | Horário Bernoulli - 3º ao 5º Ano Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearAfternoon,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º AO 2º PERÍODO - INICIAÇÃO ESPORTIVA
    const commomIdBernoulliIniciacaoEsportiva1to2PeriodMorningCurriculum =
      uuidv4();
    const bernoulliIniciacaoEsportiva1to2PeriodMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliIniciacaoEsportiva1to2PeriodMorningCurriculum
    );
    batch.set(bernoulliIniciacaoEsportiva1to2PeriodMorningCurriculum, {
      id: commomIdBernoulliIniciacaoEsportiva1to2PeriodMorningCurriculum,
      name: "Colégio Bernoulli | Iniciação Esportiva | Horário Bernoulli - 1º e 2º Período Matutino | Terça - Quinta - Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdIniciacaoEsportiva,
      schoolCourse: "Iniciação Esportiva",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodMorning,
      schedule: "Horário Bernoulli - 1º e 2º Período Matutino",
      classDayId: commomIdTuesdayThursdayFriday,
      classDay: "Terça - Quinta - Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliIniciacaoEsportiva1to2PeriodAfternoonCurriculum =
      uuidv4();
    const bernoulliIniciacaoEsportiva1to2PeriodAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliIniciacaoEsportiva1to2PeriodAfternoonCurriculum
    );
    batch.set(bernoulliIniciacaoEsportiva1to2PeriodAfternoonCurriculum, {
      id: commomIdBernoulliIniciacaoEsportiva1to2PeriodAfternoonCurriculum,
      name: "Colégio Bernoulli | Iniciação Esportiva | Horário Bernoulli - 1º e 2º Período Vespertino | Terça - Quinta - Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliFirstAndSecondPeriod,
      schoolClass: "Turma Bernoulli - 1º e 2º Período",
      schoolCourseId: commomIdIniciacaoEsportiva,
      schoolCourse: "Iniciação Esportiva",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondPeriodAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Período Vespertino",
      classDayId: commomIdTuesdayThursdayFriday,
      classDay: "Terça - Quinta - Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º E 2º ANO - INICIAÇÃO ESPORTIVA
    const commomIdBernoulliIniciacaoEsportiva1and2YearMorningCurriculum =
      uuidv4();
    const bernoulliIniciacaoEsportiva1and2YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliIniciacaoEsportiva1and2YearMorningCurriculum
    );
    batch.set(bernoulliIniciacaoEsportiva1and2YearMorningCurriculum, {
      id: commomIdBernoulliIniciacaoEsportiva1and2YearMorningCurriculum,
      name: "Colégio Bernoulli | Iniciação Esportiva | Horário Bernoulli - 1º e 2º Ano Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdIniciacaoEsportiva,
      schoolCourse: "Iniciação Esportiva",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearMorning,
      schedule: "Horário Bernoulli - 1º e 2º Ano Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliIniciacaoEsportiva1and2YearAfternoonCurriculum =
      uuidv4();
    const bernoulliIniciacaoEsportiva1and2YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliIniciacaoEsportiva1and2YearAfternoonCurriculum
    );
    batch.set(bernoulliIniciacaoEsportiva1and2YearAfternoonCurriculum, {
      id: commomIdBernoulliIniciacaoEsportiva1and2YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Iniciação Esportiva | Horário Bernoulli - 1º e 2º Ano Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdIniciacaoEsportiva,
      schoolCourse: "Iniciação Esportiva",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º E 2º ANO - JAZZ
    const commomIdBernoulliJazz1and2YearMorningCurriculum = uuidv4();
    const bernoulliJazz1and2YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJazz1and2YearMorningCurriculum
    );
    batch.set(bernoulliJazz1and2YearMorningCurriculum, {
      id: commomIdBernoulliJazz1and2YearMorningCurriculum,
      name: "Colégio Bernoulli | Jazz | Horário Bernoulli - 1º e 2º Ano Matutino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdJazz,
      schoolCourse: "Jazz",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearMorning,
      schedule: "Horário Bernoulli - 1º e 2º Ano Matutino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliJazz1and2YearAfternoonCurriculum = uuidv4();
    const bernoulliJazz1and2YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJazz1and2YearAfternoonCurriculum
    );
    batch.set(bernoulliJazz1and2YearAfternoonCurriculum, {
      id: commomIdBernoulliJazz1and2YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Jazz | Horário Bernoulli - 1º e 2º Ano Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdJazz,
      schoolCourse: "Jazz",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 3º AO 5º ANO - JAZZ
    const commomIdBernoulliJazz3to5YearMorningCurriculum = uuidv4();
    const bernoulliJazz3to5YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJazz3to5YearMorningCurriculum
    );
    batch.set(bernoulliJazz3to5YearMorningCurriculum, {
      id: commomIdBernoulliJazz3to5YearMorningCurriculum,
      name: "Colégio Bernoulli | Jazz | Horário Bernoulli - 3º ao 5º Ano Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdJazz,
      schoolCourse: "Jazz",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearMorning,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliJazz3to5YearAfternoonCurriculum = uuidv4();
    const bernoulliJazz3to5YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliJazz3to5YearAfternoonCurriculum
    );
    batch.set(bernoulliJazz3to5YearAfternoonCurriculum, {
      id: commomIdBernoulliJazz3to5YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Jazz | Horário Bernoulli - 3º ao 5º Ano Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdJazz,
      schoolCourse: "Jazz",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearAfternoon,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 1º E 2º ANO - XADREZ
    const commomIdBernoulliXadrez1and2YearMorningCurriculum = uuidv4();
    const bernoulliXadrez1and2YearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliXadrez1and2YearMorningCurriculum
    );
    batch.set(bernoulliXadrez1and2YearMorningCurriculum, {
      id: commomIdBernoulliXadrez1and2YearMorningCurriculum,
      name: "Colégio Bernoulli | Xadrez | Horário Bernoulli - 1º e 2º Ano Matutino | Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdXadrez,
      schoolCourse: "Xadrez",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearMorning,
      schedule: "Horário Bernoulli - 1º e 2º Ano Matutino",
      classDayId: commomIdFriday,
      classDay: "Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliXadrez1and2YearAfternoonCurriculum = uuidv4();
    const bernoulliXadrez1and2YearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliXadrez1and2YearAfternoonCurriculum
    );
    batch.set(bernoulliXadrez1and2YearAfternoonCurriculum, {
      id: commomIdBernoulliXadrez1and2YearAfternoonCurriculum,
      name: "Colégio Bernoulli | Xadrez | Horário Bernoulli - 1º e 2º Ano Vespertino | Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commonIdBernoulliFirstAndSecondYear,
      schoolClass: "Turma Bernoulli - 1º e 2º Ano",
      schoolCourseId: commomIdXadrez,
      schoolCourse: "Xadrez",
      scheduleId: commonIdScheduleBernoulliFirstAndSecondYearAfternoon,
      schedule: "Horário Bernoulli - 1º e 2º Ano Vespertino",
      classDayId: commomIdFriday,
      classDay: "Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BERNOULLI - 3º AO 5º ANO - XADREZ
    const commomIdBernoulliXadrez3to5yearMorningCurriculum = uuidv4();
    const bernoulliXadrez3to5yearMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliXadrez3to5yearMorningCurriculum
    );
    batch.set(bernoulliXadrez3to5yearMorningCurriculum, {
      id: commomIdBernoulliXadrez3to5yearMorningCurriculum,
      name: "Colégio Bernoulli | Xadrez | Horário Bernoulli - 3º ao 5º Ano Matutino | Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdXadrez,
      schoolCourse: "Xadrez",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearMorning,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Matutino",
      classDayId: commomIdFriday,
      classDay: "Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBernoulliXadrez3to5yearAfternoonCurriculum = uuidv4();
    const bernoulliXadrez3to5yearAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBernoulliXadrez3to5yearAfternoonCurriculum
    );
    batch.set(bernoulliXadrez3to5yearAfternoonCurriculum, {
      id: commomIdBernoulliXadrez3to5yearAfternoonCurriculum,
      name: "Colégio Bernoulli | Xadrez | Horário Bernoulli - 3º ao 5º Ano Vespertino | Sexta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBernoulli,
      school: "Colégio Bernoulli",
      schoolClassId: commomIdBernoulliThirdToFifthYear,
      schoolClass: "Turma Bernoulli - 3º ao 5º Ano",
      schoolCourseId: commomIdXadrez,
      schoolCourse: "Xadrez",
      scheduleId: commonIdScheduleBernoulliThirdToFifthYearAfternoon,
      schedule: "Horário Bernoulli - 3º ao 5º Ano Vespertino",
      classDayId: commomIdFriday,
      classDay: "Sexta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // VILLA BURITIS - BALLET
    const commomIdVillaBuritisBalletCurriculum = uuidv4();
    const villaBuritisBalletCurriculum = doc(
      db,
      "curriculum",
      commomIdVillaBuritisBalletCurriculum
    );
    batch.set(villaBuritisBalletCurriculum, {
      id: commomIdVillaBuritisBalletCurriculum,
      name: "Colégio Villa Buritis | Ballet | Horário Villa Buritis | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdVillaBuritis,
      school: "Colégio VillaBuritis",
      schoolClassId: commomIdSchoolClassVillaBuritis,
      schoolClass: "Turma Villa Buritis",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleVillaBuritis,
      schedule: "Horário Villa Buritis",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // VILLA BURITIS - FUTSAL
    const commomIdVillaBuritisFutsalCurriculum = uuidv4();
    const villaBuritisFutsalCurriculum = doc(
      db,
      "curriculum",
      commomIdVillaBuritisFutsalCurriculum
    );
    batch.set(villaBuritisFutsalCurriculum, {
      id: commomIdVillaBuritisFutsalCurriculum,
      name: "Colégio Villa Buritis | Futsal | Horário Villa Buritis | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdVillaBuritis,
      school: "Colégio VillaBuritis",
      schoolClassId: commomIdSchoolClassVillaBuritis,
      schoolClass: "Turma Villa Buritis",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleVillaBuritis,
      schedule: "Horário Villa Buritis",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // VILLA BURITIS - JUDÔ
    const commomIdVillaBuritisJudoCurriculum = uuidv4();
    const villaBuritisJudoCurriculum = doc(
      db,
      "curriculum",
      commomIdVillaBuritisJudoCurriculum
    );
    batch.set(villaBuritisJudoCurriculum, {
      id: commomIdVillaBuritisJudoCurriculum,
      name: "Colégio Villa Buritis | Judô | Horário Villa Buritis | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdVillaBuritis,
      school: "Colégio Villa Buritis",
      schoolClassId: commomIdSchoolClassVillaBuritis,
      schoolClass: "Turma Villa Buritis",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleVillaBuritis,
      schedule: "Horário Villa Buritis",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // VILLA BURITIS - FUNCIONAL KIDS
    const commomIdVillaBuritisFuncionalKidsCurriculum = uuidv4();
    const villaBuritisFuncionalKidsCurriculum = doc(
      db,
      "curriculum",
      commomIdVillaBuritisFuncionalKidsCurriculum
    );
    batch.set(villaBuritisFuncionalKidsCurriculum, {
      id: commomIdVillaBuritisFuncionalKidsCurriculum,
      name: "Colégio Villa Buritis | Funcional Kids | Horário Villa Buritis | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdVillaBuritis,
      school: "Colégio Villa Buritis",
      schoolClassId: commomIdSchoolClassVillaBuritis,
      schoolClass: "Turma Villa Buritis",
      schoolCourseId: commomIdFuncionalKids,
      schoolCourse: "Funcional Kids",
      scheduleId: commonIdScheduleVillaBuritis,
      schedule: "Horário Villa Buritis",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ GUTIERREZ - BALLET
    const commomIdBilboqueGutierrezBalletMorningCurriculum = uuidv4();
    const bilboqueGutierrezBalletMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueGutierrezBalletMorningCurriculum
    );
    batch.set(bilboqueGutierrezBalletMorningCurriculum, {
      id: commomIdBilboqueGutierrezBalletMorningCurriculum,
      name: "Colégio Bilboquê Gutierrez | Ballet | Horário Bilboquê Gutierrez - Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueGutierrez,
      school: "Colégio Bilboquê Gutierrez",
      schoolClassId: commomIdSchoolClassBilboqueGutierrez,
      schoolClass: "Turma Bilboquê Gutierrez",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBilboqueGutierrezMorning,
      schedule: "Horário Bilboquê Gutierrez - Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBilboqueGutierrezBalletAfternoonCurriculum = uuidv4();
    const bilboqueGutierrezBalletAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueGutierrezBalletAfternoonCurriculum
    );
    batch.set(bilboqueGutierrezBalletAfternoonCurriculum, {
      id: commomIdBilboqueGutierrezBalletAfternoonCurriculum,
      name: "Colégio Bilboquê Gutierrez | Ballet | Horário Bilboquê Gutierrez - Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueGutierrez,
      school: "Colégio Bilboquê Gutierrez",
      schoolClassId: commomIdSchoolClassBilboqueGutierrez,
      schoolClass: "Turma Bilboquê Gutierrez",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBilboqueGutierrezAfternoon,
      schedule: "Horário Bilboquê Gutierrez - Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ GUTIERREZ - FUTSAL
    const commomIdBilboqueGutierrezFutsalMorningCurriculum = uuidv4();
    const bilboqueGutierrezFutsalMorningCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueGutierrezFutsalMorningCurriculum
    );
    batch.set(bilboqueGutierrezFutsalMorningCurriculum, {
      id: commomIdBilboqueGutierrezFutsalMorningCurriculum,
      name: "Colégio Bilboquê Gutierrez | Futsal | Horário Bilboquê Gutierrez - Matutino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueGutierrez,
      school: "Colégio Bilboquê Gutierrez",
      schoolClassId: commomIdSchoolClassBilboqueGutierrez,
      schoolClass: "Turma Bilboquê Gutierrez",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBilboqueGutierrezMorning,
      schedule: "Horário Bilboquê Gutierrez - Matutino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    const commomIdBilboqueGutierrezFutsalAfternoonCurriculum = uuidv4();
    const bilboqueGutierrezFutsalAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueGutierrezFutsalAfternoonCurriculum
    );
    batch.set(bilboqueGutierrezFutsalAfternoonCurriculum, {
      id: commomIdBilboqueGutierrezFutsalAfternoonCurriculum,
      name: "Colégio Bilboquê Gutierrez | Futsal | Horário Bilboquê Gutierrez - Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueGutierrez,
      school: "Colégio Bilboquê Gutierrez",
      schoolClassId: commomIdSchoolClassBilboqueGutierrez,
      schoolClass: "Turma Bilboquê Gutierrez",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBilboqueGutierrezAfternoon,
      schedule: "Horário Bilboquê Gutierrez - Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ GUTIERREZ - JUDÔ
    const commomIdBilboqueGutierrezJudoAfternoonCurriculum = uuidv4();
    const bilboqueGutierrezJudoAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueGutierrezJudoAfternoonCurriculum
    );
    batch.set(bilboqueGutierrezJudoAfternoonCurriculum, {
      id: commomIdBilboqueGutierrezJudoAfternoonCurriculum,
      name: "Colégio Bilboquê Gutierrez | Judô | Horário Bilboquê Gutierrez - Vespertino | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueGutierrez,
      school: "Colégio Bilboquê Gutierrez",
      schoolClassId: commomIdSchoolClassBilboqueGutierrez,
      schoolClass: "Turma Bilboquê Gutierrez",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBilboqueGutierrezAfternoon,
      schedule: "Horário Bilboquê Gutierrez - Vespertino",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ GUTIERREZ - INICIAÇÃO ESPORTIVA
    const commomIdBilboqueGutierrezIniciacaoEsportivaAfternoonCurriculum =
      uuidv4();
    const bilboqueGutierrezIniciacaoEsportivaAfternoonCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueGutierrezIniciacaoEsportivaAfternoonCurriculum
    );
    batch.set(bilboqueGutierrezIniciacaoEsportivaAfternoonCurriculum, {
      id: commomIdBilboqueGutierrezIniciacaoEsportivaAfternoonCurriculum,
      name: "Colégio Bilboquê Gutierrez | Iniciação Esportiva | Horário Bilboquê Gutierrez - Vespertino | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueGutierrez,
      school: "Colégio Bilboquê Gutierrez",
      schoolClassId: commomIdSchoolClassBilboqueGutierrez,
      schoolClass: "Turma Bilboquê Gutierrez",
      schoolCourseId: commomIdIniciacaoEsportiva,
      schoolCourse: "Iniciação Esportiva",
      scheduleId: commonIdScheduleBilboqueGutierrezAfternoon,
      schedule: "Horário Bilboquê Gutierrez - Vespertino",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ BURITIS - BALLET
    const commomIdBilboqueBuritisBalletCurriculum = uuidv4();
    const bilboqueBuritisBalletCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueBuritisBalletCurriculum
    );
    batch.set(bilboqueBuritisBalletCurriculum, {
      id: commomIdBilboqueBuritisBalletCurriculum,
      name: "Colégio Bilboquê Buritis | Ballet | Horário Bilboquê Buritis | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueBuritis,
      school: "Colégio Bilboquê Buritis",
      schoolClassId: commomIdSchoolClassBilboqueBuritis,
      schoolClass: "Turma Bilboquê Buritis",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleBilboqueBuritis,
      schedule: "Horário Bilboquê Buritis",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ BURITIS - FUTSAL
    const commomIdBilboqueBuritisFutsalCurriculum = uuidv4();
    const bilboqueBuritisFutsalCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueBuritisFutsalCurriculum
    );
    batch.set(bilboqueBuritisFutsalCurriculum, {
      id: commomIdBilboqueBuritisFutsalCurriculum,
      name: "Colégio Bilboquê Buritis | Futsal | Horário Bilboquê Buritis | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueBuritis,
      school: "Colégio Bilboquê Buritis",
      schoolClassId: commomIdSchoolClassBilboqueBuritis,
      schoolClass: "Turma Bilboquê Buritis",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleBilboqueBuritis,
      schedule: "Horário Bilboquê Buritis",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ BURITIS - JUDÔ
    const commomIdBilboqueBuritisJudoCurriculum = uuidv4();
    const bilboqueBuritisJudoCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueBuritisJudoCurriculum
    );
    batch.set(bilboqueBuritisJudoCurriculum, {
      id: commomIdBilboqueBuritisJudoCurriculum,
      name: "Colégio Bilboquê Buritis | Judô | Horário Bilboquê Buritis | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueBuritis,
      school: "Colégio Bilboquê Buritis",
      schoolClassId: commomIdSchoolClassBilboqueBuritis,
      schoolClass: "Turma Bilboquê Buritis",
      schoolCourseId: commomIdJudo,
      schoolCourse: "Judô",
      scheduleId: commonIdScheduleBilboqueBuritis,
      schedule: "Horário Bilboquê Buritis",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // BILBOQUÊ BURITIS - INICIAÇÃO ESPORTIVA
    const commomIdBilboqueBuritisIniciacaoEsportivaCurriculum = uuidv4();
    const bilboqueBuritisIniciacaoEsportivaCurriculum = doc(
      db,
      "curriculum",
      commomIdBilboqueBuritisIniciacaoEsportivaCurriculum
    );
    batch.set(bilboqueBuritisIniciacaoEsportivaCurriculum, {
      id: commomIdBilboqueBuritisIniciacaoEsportivaCurriculum,
      name: "Colégio Bilboquê Buritis | Iniciação Esportiva | Horário Bilboquê Buritis | Terça - Quinta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdBilboqueBuritis,
      school: "Colégio Bilboquê Buritis",
      schoolClassId: commomIdSchoolClassBilboqueBuritis,
      schoolClass: "Turma Bilboquê Buritis",
      schoolCourseId: commomIdIniciacaoEsportiva,
      schoolCourse: "Iniciação Esportiva",
      scheduleId: commonIdScheduleBilboqueBuritis,
      schedule: "Horário Bilboquê Buritis",
      classDayId: commomIdTuesdayThursday,
      classDay: "Terça - Quinta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // EDNA RORIZ - BALLET
    const commomIdEdnaRorizBalletCurriculum = uuidv4();
    const ednaRorizBalletCurriculum = doc(
      db,
      "curriculum",
      commomIdEdnaRorizBalletCurriculum
    );
    batch.set(ednaRorizBalletCurriculum, {
      id: commomIdEdnaRorizBalletCurriculum,
      name: "Colégio Edna Roriz | Ballet | Horário Edna Roriz | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdEdnaRoriz,
      school: "Colégio Edna Roriz",
      schoolClassId: commomIdSchoolClassEdnaRoriz,
      schoolClass: "Turma Edna Roriz",
      schoolCourseId: commomIdBallet,
      schoolCourse: "Ballet",
      scheduleId: commonIdScheduleEdnaRoriz,
      schedule: "Horário Edna Roriz",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
      timestamp: serverTimestamp(),
    });

    // EDNA RORIZ - FUTSAL
    const commomIdEdnaRorizFutsalCurriculum = uuidv4();
    const ednaRorizFutsalCurriculum = doc(
      db,
      "curriculum",
      commomIdEdnaRorizFutsalCurriculum
    );
    batch.set(ednaRorizFutsalCurriculum, {
      id: commomIdEdnaRorizFutsalCurriculum,
      name: "Colégio Edna Roriz | Futsal | Horário Edna Roriz | Segunda - Quarta | Professor: Natália Peruzzo Costa",
      schoolId: commonIdEdnaRoriz,
      school: "Colégio Edna Roriz",
      schoolClassId: commomIdSchoolClassEdnaRoriz,
      schoolClass: "Turma Edna Roriz",
      schoolCourseId: commomIdFutsal,
      schoolCourse: "Futsal",
      scheduleId: commonIdScheduleEdnaRoriz,
      schedule: "Horário Edna Roriz",
      classDayId: commomIdMondayWednesday,
      classDay: "Segunda - Quarta",
      teacherId: commonIdteacherExample,
      teacher: "Natália Peruzzo Costa",
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
      {/** SUBMIT LOADING */}
      <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="criando seed" />

      {/** TOAST CONTAINER */}
      <ToastContainer limit={5} />

      {/** PAGE TITLE */}
      <h1 className="font-bold text-2xl my-4">Adicionar Seed</h1>

      {/** FORM */}
      <form
        onSubmit={handleSubmit(handleAddSeed)}
        className="flex flex-col w-full gap-2 p-4 rounded-xl bg-klGreen-500/20 dark:bg-klGreen-500/30 mt-2"
      >
        {/** CHECKBOX CONFIRM INSERT */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="confirmInsert"
            className="ml-1 text-klGreen-500 dark:text-klGreen-500 border-none"
            checked={seedData.confirmInsert}
            onChange={() => {
              setSeedData({
                ...seedData,
                confirmInsert: !seedData.confirmInsert,
              });
            }}
          />
          <label htmlFor="confirmInsert" className="text-sm">
            Confirmar criação de todo o SEED
          </label>
        </div>

        {/* SUBMIT AND RESET BUTTONS */}
        <div className="flex gap-2 mt-4">
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border rounded-xl border-green-900/10 bg-klGreen-500 disabled:bg-klGreen-500/70 disabled:dark:bg-klGreen-500/40 disabled:border-green-900/10 text-white disabled:dark:text-white/50 w-full"
          >
            {!isSubmitting ? "Criar" : "Criando"}
          </button>
        </div>
      </form>
    </div>
  );
}
