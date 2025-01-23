/* eslint-disable @typescript-eslint/no-explicit-any */
// import { UseControllerProps } from "react-hook-form";
import { z } from "zod";
import {
  createClassDaysValidationSchema,
  createClassValidationSchema,
  createCourseValidationSchema,
  createCurriculumValidationSchema,
  createScheduleValidationSchema,
  createSchoolValidationSchema,
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
  editSystemConstantsValidationSchema,
  editTeacherValidationSchema,
  editUserValidationSchema,
  loginEmailAndPasswordValidationSchema,
  searchCurriculumValidationSchema,
  signUpEmailAndPasswordValidationSchema,
} from "./zodValidation";
import { Timestamp } from "firebase/firestore";

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
  document?: string;
  role: "root" | "admin" | "editor" | "teacher" | "user";
  updatedAt: Date;
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
export type EditSystemConstantsValidationZProps = z.infer<
  typeof editSystemConstantsValidationSchema
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
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
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
    | "appUsers"
    | "searchEnrolledStudent"
    | "schoolStage"
    | "schoolYears"
    | "schoolYearsComplement"
    | "searchStudent";
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
  setSchedule?: boolean;
  setClassDay?: boolean;
  setTeacher?: boolean;
  displaySchoolCourseAndSchedule?: boolean;
  displayAdmins?: boolean;
  onlyAvailableClasses?: boolean;
  onlyEnrolledStudents?: boolean;
  dontShowMyself?: boolean;
  showAllCourses?: boolean;
  parentOneEmail?: string;
  parentTwoEmail?: string;
  financialResponsibleDocument?: string;
  handleData?: (data: any) => void;
}

export interface FilteredStudentsProps extends StudentSearchProps {
  isFinancialResponsible: boolean;
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
  onlyView?: boolean;
}

export interface SystemConstantsSearchProps {
  id: string;
  enrolmentFee: number;
  enrolmentFeeDiscount: number;
  systemSignInClosed: boolean;
  systemSignUpClosed: boolean;
  customerFullName: string;
  customerShortName: string;
  employeeDiscountValue: number;
  familyDiscountValue: number;
  secondCourseDiscountValue: number;
  standardPaymentDay: string;
  year: string;
}

export interface SchoolSearchProps {
  id: string;
  name: string;
  updatedAt: Date;
}

export interface SchoolClassSearchProps {
  id: string;
  name: string;
  schoolStageId: string;
  updatedAt: Date;
}

export interface SchoolCourseSearchProps {
  id: string;
  name: string;
  priceUnit: number;
  priceBundle: number;
  bundleDays: number;
  updatedAt: Date;
}

export interface ClassDaySearchProps {
  id: string;
  name: string;
  indexDays: Array<number>;
  indexNames: Array<string>;
  updatedAt: Date;
}

export interface TeacherSearchProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  haveAccount: boolean;
  updatedAt: Date;
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
  updatedAt: Date;
}

export interface StudentSearchProps {
  [x: string]: any;
  // Section 1: Student Data
  id: string;
  name: string;
  birthDate: string;
  schoolYears: string;
  schoolYearsComplement: string;
  parentOne: {
    name: string;
    email: string;
    phone: string;
  };
  parentTwo: {
    name: string;
    email: string;
    phone: string;
  };

  // Section 2: Student Course and Family Data | Prices
  enrolmentExemption: boolean;
  enrolmentFee: number;
  enrolmentFeePaid: boolean;
  fullPrice: number;
  appliedPrice: number;
  customDiscount: boolean;
  customDiscountValue: string;
  employeeDiscount: boolean;
  familyDiscount: boolean;
  secondCourseDiscount: boolean;
  paymentDay?: string;
  experimentalCurriculumIds: Array<CurriculumArrayProps>;
  curriculumIds: Array<CurriculumArrayProps>;
  studentFamilyAtSchool: Array<string>;
  paymentRegister: PaymentRegisterProps;

  // Section 3: Student Financial Responsible Data
  financialResponsible: {
    name: string;
    document: string;
    email: string;
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
    phoneSecondary: string;
    phoneTertiary: string;
  };

  // Section 4: Student Contract Data
  // Accept Contract: boolean
  // Contract attached (pdf)

  // Section 5: Last Updated Time
  updatedAt: Date;
}

// export interface StudentFamilyAtSchoolProps {
//   id: string;
//   // applyDiscount: boolean;
// }
export interface ExcludeFamilyProps {
  exclude: boolean;
  id: string;
}

export interface CurriculumArrayProps {
  date: string;
  id: string;
  isExperimental: boolean;
  indexDays: Array<number>;
  price: number;
}

export interface ExcludeCurriculumProps extends CurriculumArrayProps {
  exclude: boolean;
}

export interface CurriculumWithNamesProps extends CurriculumSearchProps {
  schoolName: string;
  schoolClassNames: string[];
  schoolCourseName: string;
  classDayName: string;
  classDayIndexDays: Array<number>;
  scheduleName: string;
  teacherName: string;
}

export interface WaitingListProps {
  id: string;
  date: Timestamp;
}
export interface ExcludeWaitingListProps extends WaitingListProps {
  exclude: boolean;
}

export interface CurriculumSearchProps {
  id: string;
  schoolId: string;
  schoolClassIds: Array<string>;
  schoolCourseId: string;
  classDayId: string;
  scheduleId: string;
  teacherId: string;
  students: Array<CurriculumArrayProps>;
  experimentalStudents: Array<CurriculumArrayProps>;
  waitingList: Array<WaitingListProps>;
  placesAvailable: number;
  updatedAt: Date;
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

export interface SubCollectionFamilyProps {
  idsArray: Array<string>;
  detailsArray: Array<SubCollectionFamilyDetailsProps>;
  id: string;
  name: string;
}

export interface SubCollectionFamilyDetailsProps {
  id: string;
  name: string;
  applyDiscount: boolean;
}

export interface PaymentRegisterProps {
  date: string;
  month: string;
  note: string;
  value: number;
  year: string;
}
export interface HandleClickOpenFunctionProps {
  id: string;
  option: "edit" | "finance" | "details";
}
