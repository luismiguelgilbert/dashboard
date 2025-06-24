import { z } from 'zod/v4';

export const bitacora_cars_sort_enum_keys_schema = z.enum(['1', '2']);
export type bitacora_cars_sort_enum_keys = z.infer<typeof bitacora_cars_sort_enum_keys_schema>;
export const bitacora_cars_sort_enum_client: sort_enum_array[] = [
  { id: '1', label: 'Motivo' },
  { id: '2', label: 'Estado' },
];
export const bitacora_cars_sort_enum_server: sort_enum_array[] = [
  { id: '1', label: 'a.name_es' },
  { id: '2', label: 'a.is_active' },
];

export const bitacora_cars_query_schema = z.object({
  search: z.coerce.string().optional()
    .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  sort: bitacora_cars_sort_enum_keys_schema.catch('1'),
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
export type bitacora_cars_query = z.infer<typeof bitacora_cars_query_schema>;

export const bitacora_cars_schema = z.object(
  {
    id: z.string().default(''),
    name_es: z.string().default(''),
    name_es_short: z.string().default(''),
    is_active: z.coerce.boolean().default(true),
    avatar_url: z.coerce.string().nullable(),
    avatar_file: z.string().nullable().default(null),
    disabled: z.coerce.boolean().default(true),
    is_saving: z.boolean().default(false),
    is_new: z.boolean().default(false),
  })
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.name_es && val.name_es.length >= 3)),
    { message: `Nombre debe incluir 3 o más caracteres.`, path: ['name_es'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.name_es_short && val.name_es_short.length >= 3)),
    { message: `Código debe incluir 3 o más caracteres.`, path: ['name_es_short'] },
  )
;
export type bitacora_cars = z.infer<typeof bitacora_cars_schema>;

export const bitacora_cars_query_cache_schema = z.object({
  pageParams: z.array(z.number()).default([]),
  pages: z.array(bitacora_cars_schema.array()).default([]),
});
export type bitacora_cars_query_cache = z.infer<typeof bitacora_cars_query_cache_schema>;
