import { object, array, string, boolean, number, date, type InferType } from 'yup';

export const sys_profiles = object({
  id: number().default(0),
  name_es: string().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  is_active: boolean().default(true),
  created_at: date(),
  updated_at: date(),
  user_count: number().optional().nullable(),
  row_count: number().optional().nullable(),
})
export type type_sys_profiles = InferType<typeof sys_profiles>

export const sys_profiles_lookup = object({
  id: number(),
  name_es: string(),
  is_disabled: boolean().default(true)
})

export type type_sys_profiles_lookup = InferType<typeof sys_profiles_lookup>

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: '# Usuarios', value: 3, sqlValue: 'user_count desc', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
]

export const profileDataForm = object({
  id: string().optional(),
  name_es: string().min(3, { message: 'Debe incluir 3 o más caracteres.' }),
  is_active: boolean(),
});

export type type_profileDataForm = InferType<typeof profileDataForm>;

export const profileLinksForm = array(string());

export const profileBody = object({
  profileData: profileDataForm,
  profileLinks: profileLinksForm,
});