import { z } from 'zod'

export const sys_users = z.object({
  id: z.coerce.string(),
  user_name: z.coerce.string(),
  user_lastname: z.coerce.string(),
  avatar_url: z.coerce.string().optional().nullable(),
  website: z.coerce.string().optional().nullable(),
  email: z.coerce.string(),
  sys_profile_id: z.coerce.number(),
  sys_profile_name: z.coerce.string().optional().nullable(),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  last_sign_in_at: z.coerce.date(),
  row_count: z.coerce.number(),
})//.refine(data => data.user_name.length >= 3, { message: 'Nombres debe tener al menos 3 caracteres.' });

export type type_sys_users = z.infer<typeof sys_users>

export const sys_users_form = z.object({
  user_name: z.coerce.string().min(3, { message: 'Nombre debe incluir 3 o más caracteres.' }),
  user_lastname: z.coerce.string().min(3, { message: 'Apellido debe incluir 3 o más caracteres.' }),
  email: z.coerce.string().email({ message: 'Correo Electrónico no es válido.' }),
  sys_profile_id: z.coerce.number().positive({ message: 'Perfil no es válido.' }),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
});

export const userData = z.object({
  id: z.coerce.string(),
  user_name: z.coerce.string(),
  user_lastname: z.coerce.string(),
  avatar_url: z.coerce.string().optional().nullable(),
  website: z.coerce.string().optional().nullable(),
  email: z.coerce.string(),
  sys_profile_id: z.coerce.number(),
  sys_profile_name: z.coerce.string(),
  dark_enabled: z.coerce.boolean(),
  default_color: z.coerce.string(),
  default_dark_color: z.coerce.string(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
  last_sign_in_at: z.coerce.string(),
});

export const userCompanies = z.object({
  id: z.coerce.string(),
  name_es: z.coerce.string(),
  name_es_short: z.coerce.string(),
  is_active: z.coerce.boolean(),
  is_default: z.coerce.boolean(),
});

export const userMenuData = z.object({
  id: z.coerce.string(),
  parent: z.coerce.string().nullable(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().optional().nullable(),
  link: z.coerce.string().optional().nullable(),
});

export const UseUserSession = z.object({
  userData: userData.optional().nullable(),
  userCompanies: z.array(userCompanies).optional().nullable(),
  userCompany: z.coerce.string().optional().nullable(),
  userMenuData: z.array(userMenuData).optional().nullable(),
});
// user_name.min(3, { message: 'Apellidos del Usuario debe incluir 3 o más caracteres.' }),
// user_lastname.min(3, { message: 'Apellidos del Usuario debe incluir 3 o más caracteres.' }),
// email.email({ message: 'Correo Electrónico no es válido.' }),
// sys_profile_id: z.coerce.number().default(1)
// dark_enabled: z.coerce.boolean().optional().nullable().default(false),
// default_color: z.coerce.string().optional().nullable().default('indigo'),
// default_dark_color: z.coerce.string().optional().nullable().default('neutral'),
// created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
// updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
// last_sign_in_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),

export const filter_options = [
  { label: 'Todos los Usuarios', value: 1, sqlValue: 'true', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Apellidos', value: 1, sqlValue: 'b.user_lastname', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Nombres', value: 2, sqlValue: 'b.user_name', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Mail', value: 3, sqlValue: 'a.email', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Perfil', value: 4, sqlValue: 'd.name_es', icon: 'i-heroicons-bars-arrow-down' }
]