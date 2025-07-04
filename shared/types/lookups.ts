import { z } from 'zod/v4';

export const lookup_sys_profiles_schema = z.object({
  id: z.coerce.string(),
  name_es: z.string(),
  disabled: z.boolean(),
});
export type lookup_sys_profiles = z.infer<typeof lookup_sys_profiles_schema>;

export const lookup_sys_companies_schema = z.object({
  id: z.coerce.string(),
  name_es: z.string(),
  name_es_short: z.string(),
  disabled: z.boolean(),
});
export type lookup_sys_companies = z.infer<typeof lookup_sys_companies_schema>;

export const lookup_sys_links_schema = z.object({
  id: z.coerce.string(),
  parent: z.coerce.string().optional().nullable(),
  name_es: z.string(),
  icon: z.string(),
});
export type lookup_sys_links = z.infer<typeof lookup_sys_links_schema>;

export const lookup_bitacora_cars_schema = z.object({
  id: z.coerce.string(),
  name_es: z.string(),
  name_es_short: z.string(),
  is_active: z.boolean(),
  disabled: z.boolean(),
  avatar_url: z.string().optional().nullable(),
});
export type lookup_bitacora_cars = z.infer<typeof lookup_bitacora_cars_schema>;

export const lookup_sys_users_schema = z.object({
  id: z.coerce.string(),
  label: z.string(),
  suffix: z.string(),
  is_active: z.boolean(),
  disabled: z.boolean(),
  avatar_url: z.string().optional().nullable(),
});
export type lookup_sys_users = z.infer<typeof lookup_sys_users_schema>;
