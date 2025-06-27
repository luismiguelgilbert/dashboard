import { z } from 'zod/v4';

export const bitacora_events_sort_enum_keys_schema = z.enum(['1', '2', '3', '4', '5']);
export type bitacora_events_sort_enum_keys = z.infer<typeof bitacora_events_sort_enum_keys_schema>;
export const bitacora_events_sort_enum_client: sort_enum_array[] = [
  { id: '1', label: 'Fecha' },
  { id: '2', label: 'Crítico' },
  { id: '3', label: 'Estado' },
  { id: '4', label: 'Responsable' },
  { id: '5', label: 'Creación' },
];

export const bitacora_events_sort_enum_server: sort_enum_array[] = [
  { id: '1', label: 'a.event_at' },
  { id: '2', label: 'a.is_critical' },
  { id: '3', label: 'a.is_active' },
  { id: '4', label: 'a.updated_by' },
  { id: '5', label: 'a.updated_at' },
];

export const bitacora_events_query_schema = z.object({
  search: z.coerce.string().optional()
    .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  sort: bitacora_events_sort_enum_keys_schema.catch('1'),
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
  is_critical: z
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
export type bitacora_events_query = z.infer<typeof bitacora_events_query_schema>;

export const bitacora_events_schema = z.object(
  {
    id: z.string().default(''),
    comments: z.string().default(''),
    event_at: z.string().default(''),
    is_active: z.coerce.boolean().default(true),
    is_critical: z.coerce.boolean().default(false),
    avatar_url: z.coerce.string().nullable(),
    avatar_file: z.string().nullable().default(null),
    responsible: z.string().default(''),
    disabled: z.coerce.boolean().default(true),
    is_saving: z.boolean().default(false),
    is_new: z.boolean().default(false),
  })
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.comments && val.comments.length >= 3)),
    { message: `Comentario debe incluir 3 o más caracteres.`, path: ['comments'] },
  )
;
export type bitacora_events = z.infer<typeof bitacora_events_schema>;

export const bitacora_events_query_cache_schema = z.object({
  pageParams: z.array(z.number()).default([]),
  pages: z.array(bitacora_events_schema.array()).default([]),
});
export type bitacora_events_query_cache = z.infer<typeof bitacora_events_query_cache_schema>;
