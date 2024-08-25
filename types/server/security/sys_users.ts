import { object, string, boolean, number, type InferType, array } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const sys_users = object({
  id: string(),
  user_name: string().trim().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required('Apellido es requerido.').min(3, 'Apellido debe incluir 3 o más caracteres.'),
  email: string().email('Debe ser un email válido.').required('Email es requerido.'),
  user_sex: boolean(),
  avatar_url: string().optional().nullable(),
  website: string().optional().nullable(),
  sys_profile_id: number().positive('Debe seleccionar un Perfil.').required('Debe seleccionar un Perfil.'),
  sys_profile_name: string().optional().nullable(),
  dark_enabled: boolean(),
  default_color: string(),
  default_dark_color: string(),
  prefered_company_id: string(),
  created_at: string(),
  updated_at: string(),
  last_sign_in_at: string().optional().nullable(),
  row_count: number(),
  sys_companies_users: array(object({
    sys_company_id: string(),
    is_default: boolean(),
  }))
    .min(1, 'Debe seleccionar al menos una Organización.')
    .test('default-exists', 'Debe seleccionar una Organización por defecto.', (companies) => companies && companies?.some(company => company.is_default)),
});
export type type_sys_users = InferType<typeof sys_users>;

export const sys_users_created = object({
  id: string(),
});
export type type_sys_users_created = InferType<typeof sys_users_created>;

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.SECURITY_USERS_SEX, label: 'Sexo', valueType: 'boolean', requiresOrganization: false, query: 'b.user_sex', algoliaField: 'user_sex' },
  { key: FilterQueriesKeys.SECURITY_USERS_PROFILE, label: 'Perfil', valueType: 'string', requiresOrganization: false, query: 'b.sys_profile_id', algoliaField: 'sys_profile_id' },
];

export const sort_options: Array<type_sort_option> = [
  { key: FilterQueriesKeys.SECURITY_USERS_NAME, query: 'b.user_name' },
  { key: FilterQueriesKeys.SECURITY_USERS_LASTNAME, query: 'b.user_lastname' },
  { key: FilterQueriesKeys.SECURITY_USERS_ID, query: 'a.id' },
];