import { object, array, string, boolean, number, date, type InferType } from 'yup';

export const sys_users = object({
  id: string().uuid(),
  user_name: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required('Apellido es requerido.').min(3, 'Apellido debe incluir 3 o más caracteres.'),
  email: string().email('Deber ser un email válido').required('Email es requerido.'),
  user_sex: boolean(),
  avatar_url: string().optional().nullable(),
  website: string().optional().nullable(),
  sys_profile_id: number().required('Debe seleccionar un Perfil.'),
  sys_profile_name: string().optional().nullable(),
  dark_enabled: boolean(),
  default_color: string(),
  default_dark_color: string(),
  created_at: date(),
  updated_at: date(),
  last_sign_in_at: date().optional().nullable(),
  row_count: number(),
});
export type type_sys_users = InferType<typeof sys_users>;

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

export const bulkMapping = object({
  email: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  user_name: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  user_lastname: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  user_sex: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  sys_profile_id: number().required().positive('Debe seleccionar un Perfil.'),
  prefered_company_id: string().required().min(1, 'Debe seleccionar una Organización.'),
});

export const userValidationSchema = object({
  email: string().required().email('Correo Electrónico no es válido.'),
  user_name: string().required().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required().min(3, 'Apellido debe incluir 3 o más caracteres.'),
  user_sex: boolean().default(false),
  errors: array(),
});
export type type_userValidationSchema = InferType<typeof userValidationSchema>;

export const bulkUsers = object({
  mapping: bulkMapping,
  users: array(),
});

export const bulkUsersUpload = object({
  email: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  user_name: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  user_lastname: string().required().min(1, 'Debe incluir 1 o más caracteres.'),
  user_sex: boolean().default(false),
  sys_profile_id: number().required().positive('Debe seleccionar un Perfil.'),
  prefered_company_id: string().required().min(1, 'Debe seleccionar una Organización.'),
});
export type type_bulkUsersUpload = InferType<typeof bulkUsersUpload>;
