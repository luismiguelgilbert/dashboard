import { z } from 'zod/v4';

export const sys_users_sort_enum = z.enum(['a.user_name', 'a.user_lastname', 'a.user_sex', 'a.is_active', 'a.email', 'b.name_es']);
export type sys_users_sort = z.infer<typeof sys_users_sort_enum>;

export const sys_users_query_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  filterProfile: z.coerce.number().array(),
  filterSex: z.coerce.boolean().array(),
  filterIsActive: z.coerce.boolean().array(),
  sortBy: sys_users_sort_enum,
  page: z.coerce.number().optional().nullable(),
  // offset: z.coerce.number().optional().nullable(),
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
export type sys_users_query = z.infer<typeof sys_users_query_schema>;

export const sys_users_schema = z.object(
  {
    id: z.string().default(''),
    user_name: z.string().default(''),
    user_lastname: z.string().default(''),
    is_active: z.coerce.boolean().default(true),
    user_sex: z.coerce.boolean().default(true),
    avatar_url: z.coerce.string().optional().nullable(),
    email: z.coerce.string().default(''),
    // sys_profile_id: z.string().default(''),
    sys_profile_name: z.coerce.string(),
    is_new: z.boolean().default(true),
    // default_color: z.string().default(''),
    // default_dark_color: z.string().default(''),
    // dark_enabled: z.coerce.boolean().default(false),
    // created_at: z.string().optional().nullable(),
    // updated_at: z.string().optional().nullable(),
    // sys_companies_users: z.any().array(),
    // default_user_company: z.string().uuid().optional(),
    // last_sign_in_at: z.string().optional().nullable(),
    // rows_count: z.coerce.number().optional().nullable(),
    // row_num: z.coerce.number().default(1),
    // change_password: z.coerce.boolean().default(false),
    // new_password: z.string().optional(),
    // new_password_confirm: z.string().optional(),
    // is_saving: z.boolean().default(false),
    // rows_count: '829
  },
)
export type sys_users = z.infer<typeof sys_users_schema>;
