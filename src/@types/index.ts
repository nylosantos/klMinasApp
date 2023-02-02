import { UseControllerProps } from "react-hook-form";
import { DateObject } from "react-multi-date-picker";
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
export interface UserRouterProps {
  username: string;
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

export interface stateDataProps {
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

export interface FormValues {
  name: string;
  email: string;
  birthDate: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressCep: string;
  phone: string;
  phoneSecondary?: string;
  phoneTertiary?: string;
  responsible: string;
  financialResponsible: string;
  schoolId: string;
  schoolClassId: string;
  schoolCourseId: string;
  scheduleId: string;
}

export interface InputStateProps extends UseControllerProps<FormValues> {
  inputValue?: string;
  handleGetCep: (c: string) => void;
}

export interface CurriculumProps {
  name: string;
  schoolId: string;
  schoolClassId: string;
  schoolCourseId: string;
  scheduleId: string;
  classDayId: string;
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
    | "appUsers";
  schoolId?: string;
  schoolClassId?: string;
  schoolCourseId?: string;
  classDayId?: string;
  scheduleId?: string;
  teacherId?: string;
  curriculumId?: string;
  studentId?: string;
  returnId?: boolean;
  handleData?: (data: any) => void;
}

export interface CurriculumReadInputProps {
  curriculumArray: Array<string>;
}

export interface HandleCurriculumNameNameProps {
  id: string;
  idName:
    | "schoolId"
    | "schoolClassId"
    | "schoolCourseId"
    | "scheduleId"
    | "classDayId"
    | "teacherId";
  fieldName:
    | "school"
    | "schoolClass"
    | "schoolCourse"
    | "schedule"
    | "classDay"
    | "teacher";
  dataType:
    | "schools"
    | "schoolClasses"
    | "schoolCourses"
    | "schedules"
    | "classDays"
    | "teachers"
    | "curriculum"
    | "students";
}

export interface FormatPhoneProps {
  ddd: string;
  initial: string;
  final: string;
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

export interface GetCurriculumNameProps {
  name: {
    schoolName: string;
    schoolCourseName: string;
    scheduleName: string;
    classDayName: string;
    teacherName: string;
  };
}

export interface DataTypeArrayProps {
  schools: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  schoolClasses: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  schoolCourses: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  schedules: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  classDays: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  teachers: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  curriculum: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
  students: [
    {
      id: string;
      name: string;
      timestamp: { nanoseconds: number; seconds: number };
    }
  ];
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
  available: boolean;
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
  familyAtSchool: [];
  curriculum: [];
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
}

export interface ExcludeFamilyProps {
  exclude: boolean;
  id: string;
}
