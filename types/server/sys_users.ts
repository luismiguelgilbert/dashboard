import { object, array, string, boolean, number, date, type InferType } from 'yup';

export const sys_users = object({
  id: string().uuid(),
  user_name: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required('Apellido es requerido.').min(3, 'Apellido debe incluir 3 o más caracteres.'),
  email: string().email().required('Email es requerido.'),
  user_sex: boolean(),
  avatar_url: string().optional().nullable(),
  website: string().optional().nullable(),
  sys_profile_id: number().required('Debe seleccionar un Perfil.'),
  sys_profile_name: string().optional().nullable(),
  dark_enabled: boolean(),
  default_color: string(),
  default_dark_color: string(),
  prefered_company_id: string(),
  created_at: date(),
  updated_at: date(),
  last_sign_in_at: date(),
  row_count: number(),
});
export type type_sys_users = InferType<typeof sys_users>;

export const sys_users_form = object({
  user_name: string().min(3,  'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().min(3,  'Apellido debe incluir 3 o más caracteres.'),
  user_sex: boolean(),
  email: string().email( 'Correo Electrónico no es válido.'),
  sys_profile_id: number().positive( 'Perfil no es válido.'),
  dark_enabled: boolean(),
  default_color: string(),
  default_dark_color: string(),
});

export const userData = object({
  id: string(),
  user_name: string(),
  user_lastname: string(),
  user_sex: boolean(),
  avatar_url: string().optional().nullable(),
  website: string().optional().nullable(),
  email: string(),
  sys_profile_id: number(),
  sys_profile_name: string(),
  dark_enabled: boolean(),
  default_color: string(),
  default_dark_color: string(),
  prefered_company_id: string(),
  created_at: string(),
  updated_at: string(),
  last_sign_in_at: string(),
});

export const userCompanies = object({
  id: string(),
  name_es: string(),
  name_es_short: string(),
  avatar_url: string().nullable(),
  is_active: boolean(),
  is_default: boolean(),
});

export const userMenuData = object({
  id: string(),
  parent: string().nullable(),
  name_es: string(),
  icon: string().optional().nullable(),
  link: string().optional().nullable(),
});
export type type_userMenuData = InferType<typeof userMenuData>;

export const UseUserSession = object({
  userData: userData.optional().nullable(),
  userCompanies: array(userCompanies).optional().nullable(),
  userCompany: string().optional().nullable(),
  userMenuData: array(userMenuData).optional().nullable(),
});

export const userDataForm = object({
  id: string(),
  user_name: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required('Apellido es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  email: string().email().required('Email es requerido.'),
  user_sex: boolean(),
  avatar_url: string().optional().nullable(),
  sys_profile_id: number().required('Debe seleccionar un Perfil.'),
  dark_enabled: boolean(),
  default_color: string(),
  default_dark_color: string(),
  prefered_company_id: string().min(1, 'Debe seleccionar una Organización.'),
});
export type type_userDataForm = InferType<typeof userDataForm>;

export const userCompaniesForm = array(string()).min(1, 'Debe seleccionar una Organización.');
export type type_userCompaniesForm = InferType<typeof userCompaniesForm>;

export const userBody = object({
  userData: userDataForm,
  userCompanies: userCompaniesForm,
});

export type type_userBody = {
  userData: type_userDataForm,
  userCompanies: type_userCompaniesForm,
};

export const bulkMapping = object({
  email: string().min(1,  'Debe incluir 1 o más caracteres.'),
  user_name: string().min(1,  'Debe incluir 1 o más caracteres.'),
  user_lastname: string().min(1,  'Debe incluir 1 o más caracteres.'),
  user_sex: string().min(1,  'Debe incluir 1 o más caracteres.'),
  sys_profile_id: number().positive( 'Debe seleccionar un Perfil.'),
  prefered_company_id: string().min(1,  'Debe seleccionar una Organización.'),
});

export const bulkUsers = object({
  mapping: bulkMapping,
  users: array(),
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