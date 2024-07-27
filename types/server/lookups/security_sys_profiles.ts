import { object, string, boolean, number, date, type InferType } from 'yup';

export const sys_profiles = object({
  id: number().default(0),
  name_es: string().required().min(3, 'Nombre debe incluir 3 o más caracteres.'),
  is_active: boolean().default(true),
  created_at: date(),
  updated_at: date(),
  user_count: number().optional().nullable(),
  row_count: number().optional().nullable(),
});
export type type_sys_profiles = InferType<typeof sys_profiles>