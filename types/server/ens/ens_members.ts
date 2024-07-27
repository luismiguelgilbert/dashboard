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