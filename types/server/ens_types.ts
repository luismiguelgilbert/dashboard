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

export const ens_teams = z.object({
  id: z.coerce.string(),
  name_es: z.coerce.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_ens_teams = z.infer<typeof ens_teams>;

export const ens_members_teams = z.object({
  user_id: z.coerce.string(),
  team_id: z.coerce.string(),
  fecha_pilotaje: z.coerce.date().nullable().optional(),
  fecha_alianza: z.coerce.date().nullable().optional(),
  fecha_salida: z.coerce.date().nullable().optional(),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_ens_members_teams = z.infer<typeof ens_members_teams>;

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