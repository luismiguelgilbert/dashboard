import { object, array, string, boolean, number, date, type InferType } from 'yup';

export const sys_profiles = object({
  id: number().default(0),
  name_es: string().required().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  is_active: boolean().default(true),
  created_at: date(),
  updated_at: date(),
  user_count: number().optional().nullable(),
  row_count: number().optional().nullable(),
});
export type type_sys_profiles = InferType<typeof sys_profiles>

export const sys_profiles_lookup = object({
  id: number(),
  name_es: string(),
  is_disabled: boolean().default(true)
});
export type type_sys_profiles_lookup = InferType<typeof sys_profiles_lookup>

export const roleDataForm = object({
  id: number().default(0),
  name_es: string().required().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  is_active: boolean().default(true),
});
export type type_roleDataForm = InferType<typeof roleDataForm>;

export const roleLinks = object({
  sys_link_id: string(),
});

export const roleLinksForm = array(roleLinks).min(1, 'Debe seleccionar un link.').required('Debe seleccionar un link');

export const rolePayload = object({
  profileData: roleDataForm,
  profileLinks: roleLinksForm,
});
export type type_rolePayload = InferType<typeof rolePayload>;

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

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
];

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: '# Usuarios', value: 3, sqlValue: 'user_count desc', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
];

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