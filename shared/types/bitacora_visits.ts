import { z } from 'zod/v4';
import { DateTime } from 'luxon';

export const bitacora_visits_sort_enum_keys_schema = z.enum(['1', '2']);
export type bitacora_visits_sort_enum_keys = z.infer<typeof bitacora_visits_sort_enum_keys_schema>;
export const bitacora_visits_sort_enum_client: sort_enum_array[] = [
  { id: '1', label: 'Fecha Ingreso' },
  { id: '2', label: 'Responsable' },
];

export const bitacora_visits_sort_enum_server: sort_enum_array[] = [
  { id: '1', label: 'a.visit_start' },
  { id: '2', label: 'a.updated_by' },
];

export const bitacora_visits_query_schema = z.object({
  search: z.coerce.string().optional()
    .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  sort: bitacora_visits_sort_enum_keys_schema.catch('1'),
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
export type bitacora_visits_query = z.infer<typeof bitacora_visits_query_schema>;

export const bitacora_visits_report_query_schema = z.object({
  page: z.coerce.number().optional().refine(p => !p || p > 0, 'Página debe ser mayor a 0'),
  start: z.string(),
  end: z.string(),
})
  .refine(
    val => ((val.start && DateTime.fromFormat(val.start, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }).isValid)),
    { message: `Fecha de inicio debe tener un formato correcto`, path: ['start'] },
  )
  .refine(
    val => ((val.end && DateTime.fromFormat(val.end, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }).isValid)),
    { message: `Fecha de corte debe tener un formato correcto`, path: ['end'] },
  )
  .refine(
    val => ((val.start && val.end && DateTime.fromFormat(val.end, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }) > DateTime.fromFormat(val.start, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }))),
    { message: `Fecha de corte debe ser mayor a fecha de inicio`, path: ['end'] },
  )
export type bitacora_visits_report_query = z.infer<typeof bitacora_visits_report_query_schema>;

export const bitacora_visits_schema = z.object(
  {
    id: z.string().default(''),
    visitor_name: z.string().default(''),
    visitor_number: z.string().default(''),
    visitor_company: z.string().default('').optional().nullable(),
    visit_start: z.string().default(DateTime.now().toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22)),
    visit_end: z.string().nullable(),
    reason_id: z.coerce.string().default(''),
    reason_name: z.coerce.string(),
    visited_name: z.string().nullable().optional().default(''),
    visited_area: z.string().nullable().optional().default(''),
    vehicle_name: z.string().nullable().optional().default(''),
    vehicle_plate: z.string().nullable().optional().default(''),
    comments_in: z.string().nullable().optional().default(''),
    comments_out: z.string().nullable().optional().default(''),
    is_active: z.coerce.boolean().default(true),
    is_complete: z.coerce.boolean().default(false),
    avatar_url: z.coerce.string().nullable(),
    avatar_file: z.string().nullable().default(null),
    responsible: z.string().default(''),
    disabled: z.coerce.boolean().default(true),
    is_saving: z.boolean().default(false),
    is_new: z.boolean().default(false),
  })
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.reason_id && val.reason_id.length >= 3)),
    { message: `Motivo debe estar seleccionado`, path: ['reason_id'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.visitor_name && val.visitor_name.length >= 3)),
    { message: `Visitante debe estar seleccionado`, path: ['visitor_name'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.visitor_number && val.visitor_number.length >= 3)),
    { message: `Visitante debe estar seleccionado`, path: ['visitor_number'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && !val.is_complete) || (val.is_saving && val.is_complete && val.visit_end && DateTime.fromFormat(val.visit_end, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }).isValid)),
    { message: `Fecha de salida debe tener un formato correcto`, path: ['visit_end'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.is_new) || (val.is_saving && !val.is_new && val.visit_end && DateTime.fromFormat(val.visit_end, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }).isValid)),
    { message: `Fin de visita debe tener un formato correcto`, path: ['visit_end'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.is_new) || (val.is_saving && !val.is_new && val.visit_start && val.visit_end && DateTime.fromFormat(val.visit_end, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }) > DateTime.fromFormat(val.visit_start, 'yyyy-MM-dd HH:mm:ssZZ', { zone: 'UTC' }))),
    { message: `Fin de visita debe ser mayor a Inicio de visita`, path: ['visit_end'] },
  )
;
export type bitacora_visits = z.infer<typeof bitacora_visits_schema>;
