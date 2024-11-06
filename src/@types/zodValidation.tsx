import { z } from "zod";

// LOGIN VALIDATION SCHEMA
export const loginEmailAndPasswordValidationSchema = z.object({
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}),
  password: z.string().min(1, {message: `Por favor, digite sua senha`})
})

// SIGNUP VALIDATION SCHEMA
export const signUpEmailAndPasswordValidationSchema = z.object({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}),
  document: z.string().min(1, {message: `Por favor, preencha o campo "CPF"`}),
  password: z.string().min(1, {message: `Por favor, digite sua senha`}),
  confirmPassword: z.string().min(1, {message: `Por favor, confirme a sua senha`})
}).refine((data) => data.password === data.confirmPassword, {message: "As senhas não coincidem", path: ["confirmPassword"]})

// CREATE VALIDATION SCHEMA USERS
export const createUserValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}),
  password: z.string().min(6, {message: `A senha precisa ter, no mínimo, 6 caracteres.`}),
  confirmPassword: z.string().min(1, {message: `Por favor, confirme a sua senha`}),
  role: z.literal("root").or(z.literal("admin")).or(z.literal("editor")).or(z.literal("teacher")).or(z.literal("user")),
  phone: z.string().nullable(),
  confirmInsert: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {message: "As senhas não coincidem", path: ["confirmPassword"]})

// EDIT VALIDATION SCHEMA USERS
export const editUserValidationSchema = z.object ({
  id: z.string().min(1, {message: `Por favor, selecione o Usuário`}),
  name: z.string().min(1, {message: `Por favor, digite o nome do Usuário`}),
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}),
  changePassword: z.boolean(),
  password: z.string().min(6, {message: `A senha precisa ter, no mínimo, 6 caracteres.`}).or(z.string().nullable()),
  confirmPassword: z.string().min(1, {message: `Por favor, confirme a sua senha`}).or(z.string().nullable()),
  phone: z.string().nullable(),
  photo: z.string().optional().or(z.literal('')),
  document: z.string().optional().or(z.literal('')),
  role: z.literal("root").or(z.literal("admin")).or(z.literal("editor")).or(z.literal("teacher")).or(z.literal("user")),
}).refine((data) => data.password === data.confirmPassword, {message: "As senhas não coincidem", path: ["confirmPassword"]})

// DELETE VALIDATION SCHEMA USERS
export const deleteUserValidationSchema = z.object ({
  id: z.string().min(1, {message: `Por favor, selecione o Usuário`}),
})

// CREATE VALIDATION SCHEMA SCHOOLS
export const createStudentValidationSchema = z.object ({
  // Section 1: Student Data
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  birthDate: z.string().min(1, {message: `Por favor, selecione a Data de Nascimento`}),
  schoolYears: z.string().min(1, {message: `Por favor, selecione o Ano Escolar`}),
  schoolYearsComplement: z.string().min(1, {message: `Por favor, selecione a Turma`}),
  parentOne: z.object({
    name: z.string().min(1, {message: `Por favor, preencha o campo "Nome Filiação 1"`}),
    phone: z.object({
      ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone de contato Filiação 1`}),
      prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone de contato Filiação 1`}),
      suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone de contato Filiação 1`}),
    }),
    email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail Filiação 1"`}).email({message: "E-mail Filiação 1 inválido"}),
  }),
  parentTwo: z.object({
    name: z.string().min(1, {message: `Por favor, preencha o campo "Nome Filiação 2"`}).optional().or(z.literal('')),
    phone: z.object({
      ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone de contato Filiação 2`}).optional().or(z.literal('')),
      prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone de contato Filiação 2`}).optional().or(z.literal('')),
      suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone de contato Filiação 2`}).optional().or(z.literal('')),
    }),
    email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail Filiação 2"`}).email({message: "E-mail Filiação 2 inválido"}),
  }),

  // Section 2: Student Course and Family Data | Prices
  familyAtSchoolId: z.string().optional().or(z.literal('')),
  curriculum: z.string().min(1, {message: 'Por favor, selecione uma modalidade de curso'}),
  enrolmentExemption: z.boolean(),
  customDiscount: z.boolean(),
  customDiscountValue: z.string().min(1, {message: 'Ocorreu um erro ao preencher o valor de porcentagem personalizada de desconto. Contate o suporte.'}),
  employeeDiscount: z.boolean(),
  familyDiscount: z.boolean(),
  secondCourseDiscount: z.boolean(),
  paymentDay: z.string().min(1, {message: 'Por favor, informe o melhor dia para pagamento'}).or(z.literal('')),

  // Section 3: Student Financial Responsible Data
  financialResponsible: z.object({
    name: z.string().min(1, {message: `Por favor, preencha o campo "Nome" do Responsável Financeiro`}),
    document: z.string().min(1, {message: `Por favor, preencha o campo "CPF" do Responsável Financeiro`}),
    email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail" do Responsável Financeiro`}).email({message: "E-mail do Responsável Financeiro inválido"}),
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
      ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone do Responsável Financeiro`}),
      prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone do Responsável Financeiro`}),
      suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone do Responsável Financeiro`}),
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
  }),
  
  // Section 4: Student Contract Data
  // Accept Contract: boolean
  // Contract attached (pdf)

  // Section 5: Confirm Insert
  confirmInsert: z.boolean()
})

export const createSchoolValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  confirmInsert: z.boolean()
})

export const createClassValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  // schoolName: z.string().min(1, {message: `Por favor, preencha o campo "Colégio"`}),
  schoolId: z.string().min(1, {message: `Por favor, preencha o campo "Colégio"`}),
  confirmInsert: z.boolean()
})

export const createCourseValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Modalidade"`}),
  priceUnit: z.number().min(1, {message: `Por favor, preencha o campo "Preço da Aula Avulsa"`}),
  priceBundle: z.number().min(1, {message: `Por favor, preencha o campo "Preço do Pacote de Aulas"`}),
  bundleDays: z.number().min(1, {message: `Por favor, preencha o campo "Número de aulas no Pacote de Aulas"`}),
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
  // confirmInsert: z.boolean()
})

export const createScheduleValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  transitionStart: z.string().min(1, {message: `Por favor, preencha o campo "Início da Transição"`}),
  transitionEnd: z.string().min(1, {message: `Por favor, preencha o campo "Fim da Transição"`}),
  classStart: z.string().min(1, {message: `Por favor, preencha o campo "Início da Aula"`}),
  classEnd: z.string().min(1, {message: `Por favor, preencha o campo "Fim da Aula"`}),
  exit: z.string().min(1, {message: `Por favor, preencha o campo "Saída"`}),
  schoolId: z.string().min(1, {message: `Por favor, preencha o campo "Escola"`}),
  confirmInsert: z.boolean()
})

export const createTeacherValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}).or(z.literal("")),
  phone: z.object({
    ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone de contato`}).or(z.literal("")),
    prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone de contato`}).or(z.literal("")),
    suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone de contato`}).or(z.literal("")),
  }),
  createAccount: z.boolean(),
  confirmInsert: z.boolean()
})

export const createCurriculumValidationSchema = z.object ({
  schoolId: z.string().min(1, {message: `Por favor, escolha o Colégio`}),
  schoolClassId: z.string().min(1, {message: `Por favor, escolha a Faixa Escolar`}),
  schoolCourseId: z.string().min(1, {message: `Por favor, escolha a Modalade`}),
  scheduleId: z.string().min(1, {message: `Por favor, escolha o Horário`}),
  classDayId: z.string().min(1, {message: `Por favor, escolha os Dias de Aula`}),
  teacherId: z.string().min(1, {message: `Por favor, escolha o Professor`}),
  confirmInsert: z.boolean()
})

// DELETE VALIDATION SCHEMA SCHOOLS
export const deleteSchoolValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolName: z.string().min(1, {message: `Por favor, selecione a Escola`}),
})

export const deleteClassValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolClassId: z.string().min(1, {message: `Por favor, selecione a Faixa Escolar`}),
  schoolClassName: z.string().min(1, {message: `Por favor, selecione a Faixa Escolar`}),
})

export const deleteStudentValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolClassId: z.string().min(1, {message: `Por favor, selecione a Faixa Escolar`}),
  curriculumId: z.string().min(1, {message: `Por favor, selecione a Modalidade`}),
  studentId: z.string().min(1, {message: `Por favor, selecione o Aluno`}),
  studentName: z.string().min(1, {message: `Por favor, selecione o Aluno`}),
  studentType: z.literal('').or(z.literal('enrolled').or(z.literal('experimental')).or(z.literal('all'))),
})

export const deleteSchoolCourseValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolCourseId: z.string().min(1, {message: `Por favor, selecione o Curso`}),
  schoolCourseName: z.string().min(1, {message: `Por favor, selecione o Curso`}),
  priceUnit: z.number().min(1, {message: `Por favor, preencha o campo "Preço da Aula Avulsa"`}),
  priceBundle: z.number().min(1, {message: `Por favor, preencha o campo "Preço do Pacote de Aulas"`}),
  bundleDays: z.number().min(1, {message: `Por favor, preencha o campo "Número de aulas no Pacote de Aulas"`}),
})

export const deleteClassDaysValidationSchema = z.object ({
  classDayId: z.string().min(1, {message: `Por favor, selecione Dia de Aula`}),
})

export const deleteScheduleValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  scheduleId: z.string().min(1, {message: `Por favor, selecione o Identificador`}),
  scheduleName: z.string().min(1, {message: `Por favor, selecione o Identificador`}),
})

export const deleteTeacherValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  teacherId: z.string().min(1, {message: `Por favor, selecione o Professor`}),
})

export const deleteCurriculumValidationSchema = z.object ({
  confirmDelete: z.boolean(),
  schoolId: z.string().min(1, {message: `Por favor, selecione a Escola`}),
  schoolClassId: z.string().min(1, {message: `Por favor, selecione a Faixa Escolar`}),
  schoolCourseId: z.string().optional(),
  curriculumId: z.string().min(1, {message: `Por favor, selecione a Turma`}),
})

// EDIT VALIDATION SCHEMA SCHOOLS
export const editSchoolValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, digite o nome da Escola`}),
})

export const editSchoolClassValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, digite o nome da Faixa Escolar`}),
})

export const editSchoolCourseValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o nome da Modalidade`}),
  priceUnit: z.number().min(1, {message: `Por favor, preencha o campo "Preço da Aula Avulsa"`}),
  priceBundle: z.number().min(1, {message: `Por favor, preencha o campo "Preço do Pacote de Aulas"`}),
  bundleDays: z.number().min(1, {message: `Por favor, preencha o campo "Número de aulas no Pacote de Aulas"`}),
})

export const editClassDayValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Identificador"`}),
  sunday: z.boolean(),
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
})

export const editScheduleValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  transitionStart: z.string().min(1, {message: `Por favor, preencha o campo "Início da Transição"`}),
  transitionEnd: z.string().min(1, {message: `Por favor, preencha o campo "Fim da Transição"`}),
  classStart: z.string().min(1, {message: `Por favor, preencha o campo "Início da Aula"`}),
  classEnd: z.string().min(1, {message: `Por favor, preencha o campo "Fim da Aula"`}),
  exit: z.string().min(1, {message: `Por favor, preencha o campo "Saída"`}),
})

export const editTeacherValidationSchema = z.object ({
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail"`}).email({message: "E-mail inválido"}).or(z.literal("")),
  phone: z.string().nullable(),
})

export const editCurriculumValidationSchema = z.object ({
  curriculumId: z.string().min(1, {message: `Por favor, escolha a Turma`}),
  schoolId: z.string().min(1, {message: `Por favor, escolha o Colégio`}),
  schoolClassId: z.string().min(1, {message: `Por favor, escolha a Faixa Escolar`}),
  schoolCourseId: z.string().min(1, {message: `Por favor, escolha a Modalidade`}),
  scheduleId: z.string().min(1, {message: `Por favor, escolha o horário`}),
  classDayId: z.string().min(1, {message: `Por favor, escolha os dias de aula`}),
  teacherId: z.string().min(1, {message: `Por favor, escolha o professor`}),
})

export const editStudentValidationSchema = z.object ({
  // Section 1: Student Data
  id: z.string().min(1, {message: `Por favor, selecione o Aluno`}),
  name: z.string().min(1, {message: `Por favor, preencha o campo "Nome"`}),
  birthDate: z.string().min(1, {message: `Por favor, selecione a Data de Nascimento`}),
  schoolYears: z.string().min(1, {message: `Por favor, selecione o Ano Escolar`}),
  schoolYearsComplement: z.string().min(1, {message: `Por favor, selecione a Turma`}),
  parentOne: z.object({
    name: z.string().min(1, {message: `Por favor, preencha o campo "Nome Filiação 1"`}),
    phone: z.object({
      ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone de contato Filiação 1`}),
      prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone de contato Filiação 1`}),
      suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone de contato Filiação 1`}),
    }),
    email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail Filiação 1"`}).email({message: "E-mail Filiação 1 inválido"}),
  }),
  parentTwo: z.object({
    name: z.string().min(1, {message: `Por favor, preencha o campo "Nome Filiação 2"`}).optional().or(z.literal('')),
    phone: z.object({
      ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone de contato Filiação 2`}).optional().or(z.literal('')),
      prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone de contato Filiação 2`}).optional().or(z.literal('')),
      suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone de contato Filiação 2`}).optional().or(z.literal('')),
    }),
    email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail Filiação 2"`}).email({message: "E-mail Filiação 2 inválido"}),
  }),

  // Section 2: Student Course and Family Data | Prices
  addCurriculum: z.boolean(),
  addExperimentalCurriculum: z.boolean(),
  addFamily: z.boolean(),
  enrolmentExemption: z.boolean(),
  enrolmentFee: z.number(),
  enrolmentFeePaid: z.boolean(),
  customDiscount: z.boolean(),
  customDiscountValue: z.string().optional(),
  employeeDiscount: z.boolean(),
  familyDiscount: z.boolean(),
  secondCourseDiscount: z.boolean(),
  fullPrice: z.number(),
  appliedPrice: z.number(),
  paymentDay: z.string().min(1, {message: 'Por favor, informe o melhor dia para pagamento'}).or(z.literal('')),

  // Section 3: Student Financial Responsible Data
  financialResponsible: z.object({
    name: z.string().min(1, {message: `Por favor, preencha o campo "Nome" do Responsável Financeiro`}),
    document: z.string().min(1, {message: `Por favor, preencha o campo "CPF" do Responsável Financeiro`}),
    email: z.string().min(1, {message: `Por favor, preencha o campo "E-mail" do Responsável Financeiro`}).email({message: "E-mail do Responsável Financeiro inválido"}),
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
      ddd: z.string().min(2, {message: `Por favor, escolha um DDD para o Telefone do Responsável Financeiro`}),
      prefix: z.string().min(5, {message: `Por favor, insira corretamente o Telefone do Responsável Financeiro`}),
      suffix: z.string().min(4, {message: `Por favor, insira corretamente o Telefone do Responsável Financeiro`}),
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
  }),
  
  // Section 4: Student Contract Data
  // Accept Contract: boolean
  // Contract attached (pdf)

  // Section 5: Last Updated Time
  // updatedAt:
})

export const editSystemConstantsValidationSchema = z.object ({
  id: z.string(),
  enrolmentFee: z.number().min(1, {message: `Por favor, insira o valor da matrícula`}),
  enrolmentFeeDiscount: z.number().min(1, {message: `Por favor, insira o valor da matrícula com desconto`}),
  systemSignInClosed: z.boolean(),
  systemSignUpClosed: z.boolean(),
})

// SEARCH VALIDATION SCHEMA SCHOOLS
export const searchCurriculumValidationSchema = z.object ({
  schoolId: z.string().min(1, {message: `Por favor, escolha o Colégio`}),
  schoolClassId: z.string().min(1, {message: `Por favor, escolha a Faixa Escolar`}),
  schoolCourseId: z.string().min(1, {message: `Por favor, escolha a Modalidade`}),
})