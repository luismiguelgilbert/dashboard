import { z } from 'zod'

export const sp_system_menu = z.object({
  id: z.coerce.string().nullable(),
  parent: z.coerce.string().nullable(),
  position_num: z.number(),
  link: z.string().nullable(),
  name_es: z.string(),
  icon: z.string().nullable(),
  comment_es: z.string().nullable(),
  requires_company: z.boolean().nullable(),
});
export type type_sp_system_menu = z.infer<typeof sp_system_menu>