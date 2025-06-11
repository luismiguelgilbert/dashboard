import { z } from 'zod/v4';

export const sys_profiles_sort_enum = z.enum(['a.name_es', 'a.is_active']);
export type sys_profiles_sort = z.infer<typeof sys_profiles_sort_enum>;

export const sys_profiles_query_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  filterIsActive: z.coerce.string().array(),
  sortBy: sys_companies_sort_enum,
  page: z.coerce.number().optional().nullable(),
  pageSize: z.coerce.number().optional(),
  is_downloading: z.coerce.boolean().default(false),
})
  .refine(
    val => ((val.is_downloading) || (!val.is_downloading && z.number().min(1).safeParse(val.page).success)),
    { error: `Campo [page] es obligatorio`, path: ['page'] },
  )
  .refine(
    val => ((val.is_downloading) || (!val.is_downloading && z.number().min(5).max(1000).safeParse(val.pageSize).success)),
    { error: `Campo [pageSize] es obligatorio y debe ser menor a 1000`, path: ['pageSize'] },
  )
export type sys_profiles_query = z.infer<typeof sys_profiles_query_schema>;

export const sys_profiles_schema = z.object(
  {
    id: z.string().default(''),
    name_es: z.string().default(''),
    is_active: z.coerce.boolean().default(true),
    profile_users_count: z.coerce.number().default(0),
    disabled: z.coerce.boolean().default(true),
    sys_profiles_links: z.array(z.string()).optional().default([]),
    is_saving: z.boolean().default(false),
    is_new: z.boolean().default(false),
  })
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.name_es && val.name_es.length >= 3)),
    { message: `Razón Social debe incluir 3 o más caracteres.`, path: ['name_es'] },
  )
;
export type sys_profiles = z.infer<typeof sys_profiles_schema>;
