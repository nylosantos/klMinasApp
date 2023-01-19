import { z } from "zod";

// CREATE VALIDATION SCHEMA
export const createStudentValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}),
  birthDate: z.string().min(1, {message: `Por favor, selecione a Data de Nascimento`}),
  address: z.object({
    street: z.string().min(1, {message: `Por favor, preencha o campo "CEP" para buscar o endereço completo, ou insira manualmente`}),
    number: z.string().min(1, {message: `Por favor, preencha o campo "Número"`}),
    complement: z.string().min(1, {message: `Por favor, preencha o campo "CEP" para buscar o endereço completo, ou insira manualmente`}).optional().or(z.literal('')),
    neighborhood: z.string().min(1, {message: `Por favor, preencha o campo "CEP" para buscar o endereço completo, ou insira manualmente`}),
    city: z.string().min(1, {message: `Por favor, preencha o campo "CEP" para buscar o endereço completo, ou insira manualmente`}),
    state: z.string().min(1, {message: `Por favor, preencha o campo "CEP" para buscar o endereço completo, ou insira manualmente`}),
    cep: z.string().min(1, {message: `Por favor, preencha o campo "CEP" para buscar o endereço completo, ou insira manualmente`}),
  }),
  phone: z.object({
    ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone de contato`}),
    prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone de contato`}),
    suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone de contato`}),
  }),
  activePhoneSecondary: z.boolean(),
  phoneSecondary: z.object({
    ddd: z.string().optional().or(z.literal('')),
    prefix: z.string().optional().or(z.literal('')),
    suffix: z.string().optional().or(z.literal('')),
  }),
  activePhoneTertiary: z.boolean(),
  phoneTertiary: z.object({
    ddd: z.string().optional().or(z.literal('')),
    prefix: z.string().optional().or(z.literal('')),
    suffix: z.string().optional().or(z.literal('')),
  }),
  responsible: z.string().min(1, {message: `Por favor, preencha o campo "Responsável"`}),
  financialResponsible: z.string().min(1, {message: `Por favor, preencha o campo "Responsável Financeiro"`}),
  curriculum: z.string().min(1, {message: 'Por favor, selecione uma modalidade de curso'}),
  confirmInsert: z.boolean()
})

export const createSchoolValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  confirmInsert: z.boolean()
})

export const createClassValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  schoolName: z.string().min(1, {message: `Por favor, preencha o campo "Colégio"`}),
  schoolId: z.string().min(1, {message: `Por favor, preencha o campo "Colégio"`}),
  available: z.boolean(),
  confirmInsert: z.boolean()
})

export const createCourseValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Modalidade"`}),
  price: z.number().min(1, {message: `Por favor, preencha o campo "Preço"`}),
  confirmInsert: z.boolean()
})

export const createClassDaysValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Identificador"`}),
  sunday: z.boolean(),
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  confirmInsert: z.boolean()
})

export const createScheduleValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  transitionStart: z.string().min(1, {message: `Por favor, preencha o campo "Início da Transição"`}),
  transitionEnd: z.string().min(1, {message: `Por favor, preencha o campo "Fim da Transição"`}),
  classStart: z.string().min(1, {message: `Por favor, preencha o campo "Início da Aula"`}),
  classEnd: z.string().min(1, {message: `Por favor, preencha o campo "Fim da Aula"`}),
  exit: z.string().min(1, {message: `Por favor, preencha o campo "Saída"`}),
  confirmInsert: z.boolean()
})

export const createTeacherValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  confirmInsert: z.boolean()
})

export const createCurriculumValidationSchema = z.object ({
  school: z.string().min(1, {message: `Por favor, escolha o Colégio`}),
  schoolClass: z.string().min(1, {message: `Por favor, escolha a Turma`}),
  schoolCourse: z.string().min(1, {message: `Por favor, escolha a Modalade`}),
  schedule: z.string().min(1, {message: `Por favor, escolha o Horário`}),
  classDay: z.string().min(1, {message: `Por favor, escolha os Dias de Aula`}),
  teacher: z.string().min(1, {message: `Por favor, escolha o Professor`}),
  confirmInsert: z.boolean()
})

export const createSeedValidationSchema = z.object ({
  confirmInsert: z.boolean()
})

// DELETE VALIDATION SCHEMA
export const deleteSchoolValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolName: z.string().min(1, {message: `Por favor, selecione a Escola`}),
})

export const deleteClassValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolClassId: z.string().min(1, {message: `Por favor, selecione a Turma`}),
  schoolClassName: z.string().min(1, {message: `Por favor, selecione a Turma`}),
})

export const deleteStudentValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  id: z.string().min(1, {message: `Por favor, selecione o Aluno`}),
})

export const deleteSchoolCourseValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolCourseId: z.string().min(1, {message: `Por favor, selecione o Curso`}),
  schoolCourseName: z.string().min(1, {message: `Por favor, selecione o Curso`}),
})

export const deleteClassDaysValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  classDayId: z.string().min(1, {message: `Por favor, selecione Dia de Aula`}),
  classDayName: z.string().min(1, {message: `Por favor, selecione Dia de Aula`}),
})

export const deleteScheduleValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  scheduleId: z.string().min(1, {message: `Por favor, selecione o Identificador`}),
  scheduleName: z.string().min(1, {message: `Por favor, selecione o Identificador`}),
})

export const deleteTeacherValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  teacherId: z.string().min(1, {message: `Por favor, selecione o Professor`}),
  teacherName: z.string().min(1, {message: `Por favor, selecione o Professor`}),
})

export const deleteCurriculumValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  school: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolId: z.string().optional(),
  schoolClass: z.string().min(1, {message: `Por favor, selecione a Turma`}),
  schoolClassId: z.string().optional(),
  schoolCourse: z.string().min(1, {message: `Por favor, selecione a Modalidade`}),
  schoolCourseId: z.string().optional(),
  curriculum: z.string().min(1, {message: `Por favor, selecione o Currículo`}).optional(),
  curriculumId: z.string().min(1, {message: `Por favor, selecione o Currículo`}),
})

// SEARCH VALIDATION SCHEMA
export const searchCurriculumValidationSchema = z.object ({
  school: z.string().min(1, {message: `Por favor, escolha o Colégio`}),
  schoolClass: z.string().min(1, {message: `Por favor, escolha a Turma`}),
  schoolCourse: z.string().min(1, {message: `Por favor, escolha a Modalidade`})
})