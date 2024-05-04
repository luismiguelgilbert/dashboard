import { ZodUndefined, unknown, z } from 'zod'

export const sys_users = z.object({
  id: z.coerce.string(),
  user_name: z.coerce.string(),
  user_lastname: z.coerce.string(),
  user_sex: z.coerce.boolean(),
  avatar_url: z.coerce.string().optional().nullable(),
  website: z.coerce.string().optional().nullable(),
  email: z.coerce.string(),
  sys_profile_id: z.coerce.number(),
  sys_profile_name: z.coerce.string().optional().nullable(),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
  prefered_company_id: z.coerce.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  last_sign_in_at: z.coerce.date(),
  row_count: z.coerce.number(),
});

export type type_sys_users = z.infer<typeof sys_users>;

export const sys_users_form = z.object({
  user_name: z.coerce.string().min(3, { message: 'Nombre debe incluir 3 o más caracteres.' }),
  user_lastname: z.coerce.string().min(3, { message: 'Apellido debe incluir 3 o más caracteres.' }),
  user_sex: z.coerce.boolean(),
  email: z.coerce.string().email({ message: 'Correo Electrónico no es válido.' }),
  sys_profile_id: z.coerce.number().positive({ message: 'Perfil no es válido.' }),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
});

export const userData = z.object({
  id: z.coerce.string(),
  user_name: z.coerce.string(),
  user_lastname: z.coerce.string(),
  user_sex: z.coerce.boolean(),
  avatar_url: z.coerce.string().optional().nullable(),
  website: z.coerce.string().optional().nullable(),
  email: z.coerce.string(),
  sys_profile_id: z.coerce.number(),
  sys_profile_name: z.coerce.string(),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
  prefered_company_id: z.coerce.string(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
  last_sign_in_at: z.coerce.string(),
});

export const userCompanies = z.object({
  id: z.coerce.string(),
  name_es: z.coerce.string(),
  name_es_short: z.coerce.string(),
  avatar_url: z.coerce.string(),
  is_active: z.coerce.boolean(),
  is_default: z.coerce.boolean(),
});

export const userMenuData = z.object({
  id: z.coerce.string(),
  parent: z.coerce.string().nullable(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().optional().nullable(),
  link: z.coerce.string().optional().nullable(),
});

export type type_userMenuData = z.infer<typeof userMenuData>;

export const UseUserSession = z.object({
  userData: userData.optional().nullable(),
  userCompanies: z.array(userCompanies).optional().nullable(),
  userCompany: z.coerce.string().optional().nullable(),
  userMenuData: z.array(userMenuData).optional().nullable(),
});

// const emailRegex = /\S+@\S+\.\S+/;

export const userDataForm = z.object({
  // should_validate: z.coerce.boolean().default(false),
  id: z.coerce.string().optional(),
  user_name: z.coerce.string().min(3, { message: 'Debe incluir 3 o más caracteres.' }),
  user_lastname: z.coerce.string().default(''),
  email: z.coerce.string().min(3, { message: 'Debe ser un correo electrónico válido.' }).default('a@mail.com'),
  // email: z.coerce.string().default('').min(1, { message: 'Debe incluir 1 o más caracteres.' }),
  user_sex: z.coerce.boolean(),
  avatar_url: z.coerce.string().optional().nullable(),
  // sys_profile_id: z.coerce.number().positive({ message: 'Debe seleccionar un Perfil.' }),
  sys_profile_id: z.coerce.number().nullable().optional(),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
  prefered_company_id: z.coerce.string().min(1, { message: 'Debe seleccionar una Organización.' }),
})
  // .refine(data => !data.email || data.email.length > 1, { message: 'Debe ser un correo electrónico válido.', path: ['email']})
  // .refine(data => !data.should_validate || emailRegex.test(data.email) , { message: 'Debe ser un correo electrónico válido.', path: ['email']})
  // .refine(data => !data.should_validate || data.user_name.length > 2, { message: 'Debe incluir 3 o más caracteres.', path: ['user_name']})
  // .refine(data => !data.should_validate || data.user_lastname.length > 2, { message: 'Debe incluir 3 o más caracteres.', path: ['user_lastname']})

export type type_userDataForm = z.infer<typeof userDataForm>;

export const userCompaniesForm = z.array(z.coerce.string());

export type type_userCompaniesForm = z.infer<typeof userCompaniesForm>;

export const userBody = z.object({
  userData: userDataForm,
  userCompanies: userCompaniesForm,
});

export type type_userBody = {
  userData: type_userDataForm,
  userCompanies: type_userCompaniesForm,
};

export const bulkMapping = z.object({
  email: z.coerce.string().min(1, { message: 'Debe incluir 1 o más caracteres.' }),
  user_name: z.coerce.string().min(1, { message: 'Debe incluir 1 o más caracteres.' }),
  user_lastname: z.coerce.string().min(1, { message: 'Debe incluir 1 o más caracteres.' }),
  user_sex: z.coerce.string().min(1, { message: 'Debe incluir 1 o más caracteres.' }),
  sys_profile_id: z.coerce.number().positive({ message: 'Debe seleccionar un Perfil.' }),
  prefered_company_id: z.coerce.string().min(1, { message: 'Debe seleccionar una Organización.' }),
});

export const bulkUsers = z.object({
  mapping: bulkMapping,
  users: z.array(z.unknown()),
});

export const filter_options = [
  { label: 'Todos los Usuarios', value: 1, sqlValue: 'true', icon: 'i-heroicons-funnel' },
];

export const sort_options = [
  { label: 'Apellidos', value: 1, sqlValue: 'b.user_lastname', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Nombres', value: 2, sqlValue: 'b.user_name', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Mail', value: 3, sqlValue: 'a.email', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Perfil', value: 4, sqlValue: 'd.name_es', icon: 'i-heroicons-bars-arrow-down' }
];