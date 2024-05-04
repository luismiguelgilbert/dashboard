import { object, array, string, boolean, number, date, type InferType } from 'yup';

export const sys_companies = object({
  id: string(),
  company_number: string().min(3, 'RUC debe incluir 3 o más caracteres.').max(13, 'RUC debe incluir máximo 13 caracteres.'),
  name_es: string().min(3, 'Razón Social debe incluir 3 o más caracteres.'),
  name_es_short: string().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  billing_phone: string().optional().nullable().default(''),
  billing_address: string().optional().nullable().default(''),
  is_active: boolean().default(true),
  avatar_url: string().optional().nullable(),
  created_at: string().optional().nullable().default(new Date().toISOString()),
  updated_at: string().optional().nullable().default(new Date().toISOString()),
  row_count: number().optional().nullable().default(0),
})
export type type_sys_companies = InferType<typeof sys_companies>

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es_short', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Razón Social', value: 2, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'RUC', value: 3, sqlValue: 'a.company_number', icon: 'i-heroicons-bars-arrow-down' }
]

export const companyDataForm = object({
  id: string().optional().nullable(),
  company_number: string().min(3, 'Debe incluir 3 o más caracteres.').max(13, 'RUC debe incluir máximo 13 caracteres.'),
  name_es: string().min(3, 'Debe incluir 3 o más caracteres.'),
  name_es_short: string().min(3, 'Debe incluir 3 o más caracteres.'),
  is_active: boolean(),
  billing_phone: string().optional(),
  billing_address: string().optional(),
  avatar_url: string().optional().nullable(),
});

export type type_companyDataForm = InferType<typeof companyDataForm>

export const companyBody = object({
  companyData: companyDataForm,
  // userCompanies: userCompaniesForm,
});

export type type_companyBody = InferType<typeof companyBody>