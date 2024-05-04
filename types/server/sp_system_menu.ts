import { object, string, boolean, number, type InferType } from 'yup';

export const sp_system_menu = object({
  id: string().nullable(),
  parent: string().nullable(),
  position_num: number(),
  link: string().nullable(),
  name_es: string(),
  icon: string().nullable(),
  comment_es: string().nullable(),
  requires_company: boolean().nullable(),
});
export type type_sp_system_menu = InferType<typeof sp_system_menu>