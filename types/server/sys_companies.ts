import { z } from 'zod'

export const sys_companies = z.object({
  id: z.coerce.string(),
  company_number: z.string()
    .min(3, { message: 'RUC debe incluir 3 o más caracteres.' })
    .max(13, { message: 'RUC debe incluir máximo 13 caracteres.' })
    .default(''),
  name_es: z.string()
    .min(3, { message: 'Razón Social debe incluir 3 o más caracteres.' })
    .default(''),
  name_es_short: z.string()
    .min(3, { message: 'Nombre debe incluir 3 o más caracteres.' })
    .default(''),
  billing_phone: z.string().optional().default(''),
  billing_address: z.string().optional().default(''),
  is_active: z.boolean().default(true),
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