import { object, string, boolean, number, type InferType } from 'yup';

export const sys_links = object({
  id: string().nullable(),
  parent: string().optional().nullable(),
  position: number(),
  row_level: number(),
  link: string().nullable(),
  name_es: string(),
  icon: string().nullable(),
  comment_es: string().nullable(),
  created_at: string().optional().nullable().default(new Date().toISOString()),
  updated_at: string().optional().nullable().default(new Date().toISOString()),
  requires_company: boolean().default(false),
  path: string().optional().nullable(),
  sort_path: string().optional().nullable(),
});
export type type_sys_links = InferType<typeof sys_links>

export const profile_sys_links = object({
  sys_link_id: string(),
});
export type type_profile_sys_links = InferType<typeof profile_sys_links>
