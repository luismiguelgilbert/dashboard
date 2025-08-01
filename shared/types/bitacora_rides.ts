import { z } from 'zod/v4';
// import { DateTime } from 'luxon';

export const bitacora_rides_sort_enum_keys_schema = z.enum(['1', '2']);
export type bitacora_rides_sort_enum_keys = z.infer<typeof bitacora_rides_sort_enum_keys_schema>;
export const bitacora_rides_sort_enum_client: sort_enum_array[] = [
  { id: '1', label: 'Vehículo' },
  { id: '2', label: 'Responsable' },
];

export const bitacora_rides_sort_enum_server: sort_enum_array[] = [
  { id: '1', label: 'a.name_es' },
  { id: '2', label: 'a.updated_by' },
];

export const bitacora_rides_query_schema = z.object({
  search: z.coerce.string().optional()
    .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  sort: bitacora_rides_sort_enum_keys_schema.catch('1'),
  order: sys_sort_order_enum.catch('asc'),
  page: z.coerce.number().optional().refine(p => !p || p > 0, 'Página debe ser mayor a 0'),
  is_active: z
    .union([
      z.literal('True'),
      z.literal('False'),
      z.array(z.union([z.literal('True'), z.literal('False')]))
    ])
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (Array.isArray(val)) return val;
      return [val];
    }),
})
export type bitacora_rides_query = z.infer<typeof bitacora_rides_query_schema>;

export const bitacora_rides_schema = z.object(
  {
    id: z.string().default(''),
    name_es: z.string().default(''),
    name_es_short: z.string().default(''),
    driver: z.string().nullable().transform(val => !val ? undefined : val).optional(),
    reason_id: z.string().nullable().transform(val => !val ? undefined : val).optional(),
    reason_name: z.coerce.string().nullable(),
    is_active: z.coerce.boolean().default(true),
    is_complete: z.coerce.boolean().default(false),
    ride_start: z.string().nullable(),
    ride_start_km: z.number().nullable().transform(val => !val ? undefined : val).optional(),
    ride_start_comment: z.string().nullable().transform(val => !val ? undefined : val).optional(),
    ride_end: z.string().nullable(),
    ride_end_km: z.number().nullable().transform(val => !val ? undefined : val).optional(),
    ride_end_comment: z.string().nullable().transform(val => !val ? undefined : val).optional(),
    // disabled: z.coerce.boolean().default(true),
    is_saving: z.boolean().default(false),
    is_new: z.boolean().default(false),
  })
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.reason_id && val.reason_id.length >= 3)),
    { message: `Motivo debe estar seleccionado`, path: ['reason_id'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.driver && val.driver.length >= 3)),
    { message: `Responsable debe estar seleccionado`, path: ['driver'] },
  )
  // .refine(
  //   val => ((!val.is_saving) || (val.is_saving && !val.is_complete) || (val.is_saving && val.is_complete && val.ride_end && DateTime.fromFormat(val.ride_end, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }).isValid)),
  //   { message: `Fecha de salida debe tener un formato correcto`, path: ['visit_end'] },
  // )
;
export type bitacora_rides = z.infer<typeof bitacora_rides_schema>;
