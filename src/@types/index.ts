import { UseControllerProps } from "react-hook-form";
import { z } from "zod";
import {
  createClassDaysValidationSchema,
  createClassValidationSchema,
  createCourseValidationSchema,
  createCurriculumValidationSchema,
  createScheduleValidationSchema,
  createSchoolValidationSchema,
  createSeedValidationSchema,
  createStudentValidationSchema,
  createTeacherValidationSchema,
  createUserValidationSchema,
  deleteClassDaysValidationSchema,
  deleteClassValidationSchema,
  deleteCurriculumValidationSchema,
  deleteScheduleValidationSchema,
  deleteSchoolCourseValidationSchema,
  deleteSchoolValidationSchema,
  deleteStudentValidationSchema,
  deleteTeacherValidationSchema,
  deleteUserValidationSchema,
  editClassDayValidationSchema,
  editCurriculumValidationSchema,
  editScheduleValidationSchema,
  editSchoolClassValidationSchema,
  editSchoolCourseValidationSchema,
  editSchoolValidationSchema,
  editStudentValidationSchema,
  editTeacherValidationSchema,
  editUserValidationSchema,
  loginEmailAndPasswordValidationSchema,
  searchCurriculumValidationSchema,
  signUpEmailAndPasswordValidationSchema,
  testeBancoValidationSchema,
} from "./zodValidation";

// LOGIN VALIDATIONS
export type LoginWithEmailAndPasswordZProps = z.infer<
  typeof loginEmailAndPasswordValidationSchema
>;
export type SignUpWithEmailAndPasswordZProps = z.infer<
  typeof signUpEmailAndPasswordValidationSchema
>;

export interface UserFullDataProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: "root" | "admin" | "editor" | "teacher" | "user";
  timestamp: Date;
}

// CREATE VALIDATIONS USERS
export type CreateUserValidationZProps = z.infer<
  typeof createUserValidationSchema
>;

// EDIT VALIDATIONS USERS
export type EditUserValidationZProps = z.infer<typeof editUserValidationSchema>;

// DELETE VALIDATIONS USERS
export type DeleteUserValidationZProps = z.infer<
  typeof deleteUserValidationSchema
>;

// CREATE VALIDATIONS SCHOOLS
export type CreateStudentValidationZProps = z.infer<
  typeof createStudentValidationSchema
>;
export type CreateSchoolValidationZProps = z.infer<
  typeof createSchoolValidationSchema
>;
export type CreateClassValidationZProps = z.infer<
  typeof createClassValidationSchema
>;
export type CreateCourseValidationZProps = z.infer<
  typeof createCourseValidationSchema
>;
export type CreateClassDaysValidationZProps = z.infer<
  typeof createClassDaysValidationSchema
>;
export type CreateScheduleValidationZProps = z.infer<
  typeof createScheduleValidationSchema
>;
export type CreateTeacherValidationZProps = z.infer<
  typeof createTeacherValidationSchema
>;
export type CreateCurriculumValidationZProps = z.infer<
  typeof createCurriculumValidationSchema
>;
export type CreateSeedValidationZProps = z.infer<
  typeof createSeedValidationSchema
>;
export type TesteBancoValidationZProps = z.infer<
  typeof testeBancoValidationSchema
>;

// DELETE VALIDATIONS SCHOOLS
export type DeleteSchoolValidationZProps = z.infer<
  typeof deleteSchoolValidationSchema
>;
export type DeleteClassValidationZProps = z.infer<
  typeof deleteClassValidationSchema
>;
export type DeleteSchoolCourseValidationZProps = z.infer<
  typeof deleteSchoolCourseValidationSchema
>;
export type DeleteClassDaysValidationZProps = z.infer<
  typeof deleteClassDaysValidationSchema
>;
export type DeleteScheduleValidationZProps = z.infer<
  typeof deleteScheduleValidationSchema
>;
export type DeleteTeacherValidationZProps = z.infer<
  typeof deleteTeacherValidationSchema
>;
export type DeleteCurriculumValidationZProps = z.infer<
  typeof deleteCurriculumValidationSchema
>;
export type DeleteStudentValidationZProps = z.infer<
  typeof deleteStudentValidationSchema
>;

// EDIT VALIDATIONS SCHOOLS
export type EditSchoolValidationZProps = z.infer<
  typeof editSchoolValidationSchema
>;
export type EditSchoolClassValidationZProps = z.infer<
  typeof editSchoolClassValidationSchema
>;
export type EditSchoolCourseValidationZProps = z.infer<
  typeof editSchoolCourseValidationSchema
>;
export type EditClassDayValidationZProps = z.infer<
  typeof editClassDayValidationSchema
>;
export type EditScheduleValidationZProps = z.infer<
  typeof editScheduleValidationSchema
>;
export type EditTeacherValidationZProps = z.infer<
  typeof editTeacherValidationSchema
>;
export type EditCurriculumValidationZProps = z.infer<
  typeof editCurriculumValidationSchema
>;
export type EditStudentValidationZProps = z.infer<
  typeof editStudentValidationSchema
>;

// SEARCH VALIDATIONS SCHOOLS
export type SearchCurriculumValidationZProps = z.infer<
  typeof searchCurriculumValidationSchema
>;

export interface StateDataProps {
  id: string;
  ddd: string;
  state: string;
}

export interface DaysProps {
  sunday: String;
  monday: String;
  tuesday: String;
  wednesday: String;
  thursday: String;
  friday: String;
  saturday: String;
}

export interface SelectProps {
  dataType:
    | "schools"
    | "schoolClasses"
    | "schoolCourses"
    | "schedules"
    | "classDays"
    | "teachers"
    | "curriculum"
    | "students"
    | "allStudents"
    | "enrolledStudents"
    | "allCurriculum"
    | "enrolledCurriculum"
    | "appUsers";
  schoolId?: string;
  schoolClassId?: string;
  schoolCourseId?: string;
  classDayId?: string;
  scheduleId?: string;
  teacherId?: string;
  curriculumId?: string;
  studentId?: string;
  familyIds?: Array<string>;
  curriculumIds?: Array<string>;
  experimentalCurriculumIds?: Array<string>;
  returnId?: boolean;
  displaySchoolCourseAndSchedule?: boolean;
  displayAdmins?: boolean;
  onlyAvailableClasses?: boolean;
  availableAndWaitingClasses?: boolean;
  onlyEnrolledStudents?: boolean;
  dontShowMyself?: boolean;
  handleData?: (data: any) => void;
}

export interface ToggleClassDaysFunctionProps {
  day: string;
  value: boolean;
}

export interface ClassDaysCompProps {
  classDay: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    name: string;
    confirmInsert?: boolean;
  };
  toggleClassDays: ({ day, value }: ToggleClassDaysFunctionProps) => void;
}

export interface SchoolSearchProps {
  id: string;
  name: string;
  timestamp: Date;
}

export interface SchoolClassSearchProps {
  id: string;
  name: string;
  schoolName: string;
  schoolId: string;
  available: "open" | "closed" | "waitingList";
  timestamp: Date;
}

export interface SchoolCourseSearchProps {
  id: string;
  name: string;
  price: number;
  timestamp: Date;
}

export interface ClassDaySearchProps {
  id: string;
  name: string;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  timestamp: Date;
}

export interface TeacherSearchProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: Date;
}

export interface ScheduleSearchProps {
  id: string;
  name: string;
  transitionStart: string;
  transitionEnd: string;
  classStart: string;
  classEnd: string;
  exit: string;
  schoolId: string;
  schoolName: string;
  timestamp: Date;
}

export interface StudentSearchProps {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  phone: string;
  activePhoneSecondary: boolean;
  phoneSecondary: string;
  activePhoneTertiary: boolean;
  phoneTertiary: string;
  responsible: string;
  financialResponsible: string;
  familyAtSchoolDetails: {};
  familyAtSchoolIds: [];
  experimentalCurriculumDetails: {};
  experimentalCurriculumIds: [];
  arrayCurriculumDetails?: [];
  curriculumDetails: {};
  curriculumIds: [];
  timestamp: Date;
}

export interface CurriculumSearchProps {
  id: string;
  name: string;
  school: string;
  schoolId: string;
  schoolClass: string;
  schoolClassId: string;
  schoolCourse: string;
  schoolCourseId: string;
  classDay: string;
  classDayId: string;
  schedule: string;
  scheduleId: string;
  teacher: string;
  teacherId: string;
  students: [];
  timestamp: Date;
}

export interface ExcludeCurriculumProps {
  exclude: boolean;
  id: string;
  name: string;
  isExperimental: boolean;
  date: string;
}

export interface ExcludeFamilyProps {
  exclude: boolean;
  id: string;
  name: string;
}

export interface SubmitLoadingProps {
  isSubmitting: boolean;
  whatsGoingOn: string;
  isNotFullScreen?: boolean;
}

export interface ButtonSignProps {
  isSubmitting: boolean;
  signType: "signIn" | "signUp";
  isClosed?: boolean;
}

export interface SubCollectionDetailsProps {
  date: string;
  id: string;
  name: string;
  isExperimental: boolean;
}

export interface SubCollectionFamilyDetailsProps {
  id: string;
  name: string;
}

export interface SubCollectionFamilyProps {
  idsArray: Array<string>;
  detailsArray: Array<SubCollectionFamilyDetailsProps>;
  id: string;
  name: string;
}

export interface SubCollectionProps {
  idsArray: Array<string>;
  detailsArray: Array<SubCollectionDetailsProps>;
  id: string;
  name: string;
}
