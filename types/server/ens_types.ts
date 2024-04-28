import { z } from 'zod';

export const ens_members = z.object({
  id: z.coerce.string(),
  user_full_name: z.coerce.string(),
  email: z.coerce.string(),
  user_sex: z.coerce.boolean(),
  avatar_url: z.coerce.string().optional().nullable(),
  partner_full_name: z.coerce.string(),
  fecha_matrimonio: z.coerce.date(),
  fecha_nacimiento: z.coerce.date(),
  is_active: z.coerce.boolean(),
  es_consiliario: z.coerce.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_ens_members = z.infer<typeof ens_members>;

export const ens_members_lookup = z.object({
  id: z.coerce.string(),
  user_full_name: z.coerce.string(),
  es_consiliario: z.coerce.boolean(),
  avatar_url: z.coerce.string().optional().nullable(),
  user_sex: z.coerce.boolean(),
  email: z.coerce.string(),
});
export type type_ens_members_lookup = z.infer<typeof ens_members_lookup>;

export const ens_members_form = z.object({
  id: z.coerce.string(),
  user_full_name: z.coerce.string(),
  es_consiliario: z.coerce.boolean(),
  avatar_url: z.coerce.string().optional().nullable(),
  user_sex: z.coerce.boolean(),
  email: z.coerce.string(),
  partner_id: z.coerce.string(),
  fecha_matrimonio: z.coerce.date().nullable().optional(),
  fecha_nacimiento: z.coerce.date().nullable().optional(),
  is_active: z.coerce.boolean(),
});
export type type_ens_members_form = z.infer<typeof ens_members_form>;

export const ens_teams = z.object({
  id: z.coerce.string(),
  name_es: z.coerce.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_ens_teams = z.infer<typeof ens_teams>;

export const ens_members_teams = z.object({
  id: z.coerce.string(),
  user_id: z.coerce.string(),
  team_id: z.coerce.string(),
  team_name_es: z.coerce.string(),
  fecha_pilotaje: z.coerce.date().nullable().optional(),
  fecha_alianza: z.coerce.date().nullable().optional(),
  fecha_salida: z.coerce.date().nullable().optional(),
});
export type type_ens_members_teams = z.infer<typeof ens_members_teams>;

export const ens_members_services = z.object({
  id: z.coerce.string(),
  user_id: z.coerce.string(),
  service_id: z.coerce.string(),
  date_start: z.coerce.date().nullable().optional(),
  date_stop: z.coerce.date().nullable().optional(),
});
export type type_ens_members_services = z.infer<typeof ens_members_services>;

export const ens_services_lookup = z.object({
  id: z.coerce.string(),
  name_es: z.coerce.string(),
  is_active: z.coerce.boolean(),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_ens_services_lookup = z.infer<typeof ens_services_lookup>;

export const ens_teams_lookup = z.object({
  id: z.coerce.string(),
  name_es: z.coerce.string(),
  is_active: z.coerce.boolean(),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_ens_teams_lookup = z.infer<typeof ens_teams_lookup>;

export const filter_options = [
  { label: 'Activos', value: 1, sqlValue: 'a.is_active = true', icon: 'i-heroicons-funnel' },
  { label: 'Inactivos', value: 2, sqlValue: 'a.is_active = false', icon: 'i-heroicons-funnel' },
  { label: 'Hombre', value: 3, sqlValue: 'b.user_sex = true', icon: 'i-heroicons-funnel' },
  { label: 'Mujer', value: 4, sqlValue: 'b.user_sex = false', icon: 'i-heroicons-funnel' },
  { label: 'Consiliario', value: 5, sqlValue: 'a.es_consiliario = true', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'user_full_name', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
]

export const profileDataForm = z.object({
  id: z.coerce.string().optional(),
  name_es: z.coerce.string().min(3, { message: 'Debe incluir 3 o más caracteres.' }),
  is_active: z.coerce.boolean(),
});