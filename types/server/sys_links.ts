import { z } from 'zod'

export const sys_links = z.object({
  id: z.coerce.string().nullable(),
  parent: z.coerce.string().optional().nullable(),
  position: z.coerce.number(),
  row_level: z.coerce.number(),
  link: z.coerce.string().nullable(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().nullable(),
  comment_es: z.coerce.string().nullable(),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  requires_company: z.coerce.boolean().default(false),
  path: z.coerce.string().optional().nullable(),
  sort_path: z.coerce.string().optional().nullable(),
})
export type type_sys_links = z.infer<typeof sys_links>