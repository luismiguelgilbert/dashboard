import { z } from 'zod/v4';

export const ens_form_caffarel_sector_enum = z.enum(['Sector Cuenca', 'Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E', 'Sector F', 'Sector G', 'Sector H']);
export type ens_form_caffarel_sector = z.infer<typeof ens_form_caffarel_sector_enum>;

export const ens_form_caffarel_ciudad_enum = z.enum(['Cuenca', 'Guayaquil']);
export type ens_form_caffarel_ciudad = z.infer<typeof ens_form_caffarel_ciudad_enum>;

export const ens_form_caffarel_row_schema = z.object({
  names: z.coerce.string().min(5, 'Nombre debe estar completos'),
  email: z.email('Email debe ser válido'),
  amount: z.coerce.number().min(15, 'Monto mínimo es $15'),
});
export type ens_form_caffarel_row = z.infer<typeof ens_form_caffarel_row_schema>;

export const ens_form_caffarel_row_b_schema = z.object({
  name_wife: z.coerce.string(),
  lastname_wife: z.coerce.string(),
  name_husband: z.coerce.string().min(3, 'Nombre debe estar completos'),
  lastname_husband: z.coerce.string().min(2, 'Apellido debe estar completos'),
  email: z.email('Email debe ser válido'),
  amount: z.coerce.number().min(15, 'Monto mínimo es $15'),
});
export type ens_form_caffarel_row_b = z.infer<typeof ens_form_caffarel_row_b_schema>;

export const ens_form_caffarel_schema = z.object({
  fecha: z.coerce.string(),
  equipo: z.coerce.number().min(1, 'Número de equipo incorrecto'),
  sector: ens_form_caffarel_sector_enum,
  ciudad: ens_form_caffarel_ciudad_enum,
  rows: z.array(ens_form_caffarel_row_schema),
});

export type ens_form_caffarel = z.infer<typeof ens_form_caffarel_schema>;
