import { z } from 'zod'

export const sys_companies = z.object({
  id: z.coerce.string(),
  company_number: z.coerce.string().min(3, { message: 'RUC debe incluir 3 o más caracteres.' }).max(13, { message: 'RUC debe incluir máximo 13 caracteres.' }),
  name_es: z.coerce.string().min(3, { message: 'Razón Social debe incluir 3 o más caracteres.' }),
  name_es_short: z.coerce.string().min(3, { message: 'Nombre debe incluir 3 o más caracteres.' }),
  billing_phone: z.coerce.string().optional().default(''),
  billing_address: z.coerce.string().optional().default(''),
  is_active: z.coerce.boolean().default(true),
  avatar_url: z.coerce.string().optional().nullable(),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  row_count: z.coerce.number().optional().nullable().default(0),
})
export type type_sys_companies = z.infer<typeof sys_companies>

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es_short', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Razón Social', value: 2, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'RUC', value: 3, sqlValue: 'a.company_number', icon: 'i-heroicons-bars-arrow-down' }
]

export const companyDataForm = z.object({
  id: z.coerce.string().optional().nullable(),
  company_number: z.coerce.string().min(3, { message: 'Debe incluir 3 o más caracteres.' }).max(13, { message: 'RUC debe incluir máximo 13 caracteres.' }),
  name_es: z.coerce.string().min(3, { message: 'Debe incluir 3 o más caracteres.' }),
  name_es_short: z.coerce.string().min(3, { message: 'Debe incluir 3 o más caracteres.' }),
  is_active: z.coerce.boolean(),
  billing_phone: z.coerce.string().optional(),
  billing_address: z.coerce.string().optional(),
  avatar_url: z.coerce.string().optional().nullable(),
});

export type type_companyDataForm = z.infer<typeof companyDataForm>

export const companyBody = z.object({
  companyData: companyDataForm,
  // userCompanies: userCompaniesForm,
});

export type type_companyBody = z.infer<typeof companyBody>