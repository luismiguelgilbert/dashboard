import { array, object, string, boolean, number, type InferType } from 'yup';

export const sys_companies = object({
  id: string().required(),
  company_number: string().required().min(3, 'RUC debe incluir 3 o más caracteres.').max(13, 'RUC debe incluir máximo 13 caracteres.'),
  name_es: string().required().min(3, 'Razón Social debe incluir 3 o más caracteres.'),
  name_es_short: string().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  billing_phone: string().optional().nullable().default(''),
  billing_address: string().optional().nullable().default(''),
  is_active: boolean().default(true),
  avatar_url: string().optional().nullable(),
  created_at: string().optional().nullable().default(new Date().toISOString()),
  updated_at: string().optional().nullable().default(new Date().toISOString()),
  user_count: number().optional().nullable(),
  row_count: number().optional().nullable().default(0),
});
export type type_sys_companies = InferType<typeof sys_companies>

export const roleUser = object({
  id: string(),
  user_name: string(),
  user_lastname: string(),
  avatar_url: string().optional().nullable(),
  user_sex: boolean(),
  email: string().email(),
});
export const roleUsers = array(roleUser);
export type type_roleUsers = InferType<typeof roleUsers>;

export const companyDataForm = object({
  id: string(),
  company_number: string().required('RUC es requerido.').min(3, 'Debe incluir 3 o más caracteres.').max(13, 'RUC debe incluir máximo 13 caracteres.'),
  name_es: string().required('Nombre es requerido.').min(3, 'Debe incluir 3 o más caracteres.'),
  name_es_short: string().required('Razón Social es requerido.').min(3, 'Debe incluir 3 o más caracteres.'),
  is_active: boolean(),
  billing_phone: string().optional(),
  billing_address: string().optional(),
  avatar_url: string().optional().nullable(),
});

export type type_companyDataForm = InferType<typeof companyDataForm>

export const companyPayload = object({
  companyData: companyDataForm,
  // profileLinks: roleLinksForm,
});
export type type_companyPayload = InferType<typeof companyPayload>;

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
];

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es_short', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Razón Social', value: 2, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'RUC', value: 3, sqlValue: 'a.company_number', icon: 'i-heroicons-bars-arrow-down' }
];