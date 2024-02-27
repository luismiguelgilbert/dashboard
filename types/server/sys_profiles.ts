import { z } from 'zod'

export const sys_profiles = z.object({
  id: z.coerce.number().default(0),
  name_es: z.string()
    .min(3, { message: 'Nombre debe incluir 3 o más caracteres.' })
    .default(''),
  is_active: z.boolean().default(true),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  user_count: z.coerce.number().optional().nullable().default(0),
  row_count: z.coerce.number().optional().nullable().default(0),
})
export type type_sys_profiles = z.infer<typeof sys_profiles>

export const sys_profiles_lookup = z.object({
  id: z.coerce.number().default(0),
  name_es: z.string().default(''),
  is_disabled: z.boolean().default(true)
})

export type type_sys_profiles_lookup = z.infer<typeof sys_profiles_lookup>

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
  // { label: 'Activos', value: 1, sqlValue: 'true', icon: 'i-heroicons-funnel' },
  // { label: 'Inactivos', value: 2, sqlValue: 'false', icon: 'i-heroicons-funnel' },
  // { label: 'Todos los Perfiles', value: 3, sqlValue: 'a.is_active', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: '# Usuarios', value: 3, sqlValue: 'user_count desc', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
]