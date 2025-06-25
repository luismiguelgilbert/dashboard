import { z } from 'zod/v4';

export const sys_companies_sort_enum_keys_schema = z.enum(['1', '2', '3']);
export type sys_companies_sort_enum_keys = z.infer<typeof sys_companies_sort_enum_keys_schema>;
export const sys_companies_sort_enum_client: sort_enum_array[] = [
  { id: '1', label: 'Nombre' },
  { id: '2', label: 'Razón Social' },
  { id: '3', label: 'Estado' },
];
export const sys_companies_sort_enum_server: sort_enum_array[] = [
  { id: '1', label: 'a.name_es_short' },
  { id: '2', label: 'a.name_es' },
  { id: '3', label: 'a.is_active' },
];

export const sys_companies_query_schema = z.object({
  search: z.coerce.string().optional()
    .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  sort: sys_profiles_sort_enum_keys_schema.catch('1'),
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
export type sys_companies_query = z.infer<typeof sys_companies_query_schema>;

export const sys_companies_schema = z.object(
  {
    id: z.string().default(''),
    company_number: z.coerce.string().default(''),
    name_es: z.string().default(''),
    name_es_short: z.string().default(''),
    billing_phone: z.coerce.string().nullable(),
    billing_address: z.coerce.string().nullable(),
    is_active: z.coerce.boolean().default(true),
    is_default: z.coerce.boolean().default(false),
    disabled: z.coerce.boolean().default(true),
    avatar_url: z.coerce.string().nullable(),
    avatar_file: z.string().nullable().default(null),
    is_saving: z.boolean().default(false),
    is_new: z.boolean().default(false),
  })
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.company_number && val.company_number.length >= 10)),
    { message: `RUC debe incluir 10 o más caracteres.`, path: ['company_number'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.name_es && val.name_es.length >= 3)),
    { message: `Razón Social debe incluir 3 o más caracteres.`, path: ['name_es'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.name_es_short && val.name_es_short.length >= 3)),
    { message: `Nombre debe incluir 3 o más caracteres.`, path: ['name_es_short'] },
  )
;
export type sys_companies = z.infer<typeof sys_companies_schema>;

export const sys_companies_query_cache_schema = z.object({
  pageParams: z.array(z.number()).default([]),
  pages: z.array(sys_companies_schema.array()).default([]),
});
export type sys_companies_query_cache = z.infer<typeof sys_companies_query_cache_schema>;
