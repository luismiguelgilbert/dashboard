import { object, string, boolean, number, date, type InferType } from 'yup';

export const ens_members = object({
  id: string(),
  user_full_name: string(),
  email: string(),
  user_sex: boolean(),
  avatar_url: string().optional().nullable(),
  partner_full_name: string(),
  fecha_matrimonio: date(),
  fecha_nacimiento: date(),
  is_active: boolean(),
  es_consiliario: boolean(),
  created_at: date(),
  updated_at: date(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_members = InferType<typeof ens_members>;

export const ens_members_lookup = object({
  id: string(),
  user_full_name: string(),
  es_consiliario: boolean(),
  avatar_url: string().optional().nullable(),
  user_sex: boolean(),
  email: string(),
});
export type type_ens_members_lookup = InferType<typeof ens_members_lookup>;

export const ens_members_form = object({
  id: string(),
  user_full_name: string(),
  es_consiliario: boolean(),
  avatar_url: string().optional().nullable(),
  user_sex: boolean(),
  email: string(),
  partner_id: string(),
  fecha_matrimonio: date().nullable().optional(),
  fecha_nacimiento: date().nullable().optional(),
  is_active: boolean(),
});
export type type_ens_members_form = InferType<typeof ens_members_form>;

export const ens_teams = object({
  id: string(),
  is_active: boolean(),
  name_es: string().required('El nombre es requerido.').min(3, 'Debe incluir 3 o más caracteres.'),
  nivel_0: string().required('La ciudad es requerida.').min(3, 'Debe incluir 3 o más caracteres.'),
  nivel_1: string().required('El sector es requerido.').min(3, 'Debe incluir 3 o más caracteres.'),
  nivel_2: string(),
  nivel_3: string(),
  nivel_4: string(),
  nivel_5: string(),
  nivel_6: string(),
  created_at: date(),
  updated_at: date(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_teams = InferType<typeof ens_teams>;

export const ens_members_teams = object({
  id: string(),
  user_id: string(),
  team_id: string(),
  team_name_es: string(),
  fecha_pilotaje: date().nullable().optional(),
  fecha_alianza: date().nullable().optional(),
  fecha_salida: date().nullable().optional(),
});
export type type_ens_members_teams = InferType<typeof ens_members_teams>;

export const ens_members_services = object({
  id: string(),
  user_id: string(),
  service_id: string(),
  date_start: date().nullable().optional(),
  date_stop: date().nullable().optional(),
});
export type type_ens_members_services = InferType<typeof ens_members_services>;

export const ens_services_lookup = object({
  id: string(),
  name_es: string(),
  is_active: boolean(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_services_lookup = InferType<typeof ens_services_lookup>;

export const ens_teams_lookup = object({
  id: string(),
  name_es: string(),
  is_active: boolean(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_teams_lookup = InferType<typeof ens_teams_lookup>;

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
  { label: 'Hombre', value: 3, sqlValue: 'b.user_sex = true', icon: 'i-heroicons-funnel' },
  { label: 'Mujer', value: 4, sqlValue: 'b.user_sex = false', icon: 'i-heroicons-funnel' },
  { label: 'Consiliario', value: 5, sqlValue: 'a.es_consiliario = true', icon: 'i-heroicons-funnel' },
];

export const member_sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'user_full_name', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
];

export const teams_sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
];

export const profileDataForm = object({
  id: string().optional(),
  name_es: string().min(3, 'Debe incluir 3 o más caracteres.'),
  is_active: boolean(),
});