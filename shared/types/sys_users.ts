import { z } from 'zod/v4';

export const sys_users_sort_enum = z.enum([
  'a.user_name',
  'a.user_lastname',
  'a.user_sex',
  'a.is_active',
  'a.email',
  'b.name_es',
]);
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
  filterSex: z.coerce.string().array(),
  filterIsActive: z.coerce.string().array(),
  sortBy: sys_users_sort_enum,
  sortByOrder: sys_sortbyorder_enum,
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
export type sys_users_query = z.infer<typeof sys_users_query_schema>;

export const sys_users_schema = z.object({
  id: z.string().default(''),
  user_name: z.string().default(''),
  user_lastname: z.string().default(''),
  is_active: z.coerce.boolean().default(true),
  user_sex: z.coerce.boolean().default(true),
  avatar_url: z.coerce.string().nullable(),
  avatar_file: z.string().nullable().default(null),
  email: z.coerce.string().default(''),
  sys_profile_id: z.coerce.string().default(''),
  sys_profile_name: z.coerce.string(),
  sys_companies_users: z.string().array().default([]),
  is_saving: z.boolean().default(false),
  is_new: z.boolean().default(false),
  change_password: z.coerce.boolean().default(false),
  new_password: z.string().optional(),
  new_password_confirm: z.string().optional(),
})
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.id && z.uuidv4().safeParse(val.id).success)),
    { message: `ID debe  versión 4.`, path: ['id'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.email && val.email.length >= 3)),
    { message: `Email debe incluir 3 o más caracteres.`, path: ['email'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.user_name && val.user_name.length >= 3)),
    { message: `Nombres debe incluir 3 o más caracteres.`, path: ['user_name'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.user_lastname && val.user_lastname.length >= 3)),
    { message: `Apellidos debe incluir 3 o más caracteres.`, path: ['user_lastname'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && val.sys_companies_users && val.sys_companies_users.length > 0)),
    { message: `Organizaciones no puede estar vacío.`, path: ['sys_companies_users'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && !val.change_password) || (val.is_saving && val.change_password && val.new_password && val.new_password.length > 3)),
    { message: `Nueva contraseña debe tener más de 3 caracteres`, path: ['new_password'] },
  )
  .refine(
    val => ((!val.is_saving) || (val.is_saving && !val.change_password) || (val.is_saving && val.change_password && val.new_password === val.new_password_confirm)),
    { message: `Contraseñas no coinciden`, path: ['new_password_confirm'] },
  )
;
export type sys_users = z.infer<typeof sys_users_schema>;
