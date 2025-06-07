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
