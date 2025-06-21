import { z } from 'zod/v4';

export const sys_users_sort_enum_keys_schema = z.enum(['1', '2', '3', '4', '5', '6']);
export type sys_users_sort_enum_keys = z.infer<typeof sys_users_sort_enum_keys_schema>;
export const sys_users_sort_enum_client: sys_users_sort_enum_array[] = [
  { id: '1', label: 'Nombre' },
  { id: '2', label: 'Apellidos' },
  { id: '3', label: 'Sexo' },
  { id: '4', label: 'Estado' },
  { id: '5', label: 'Email' },
  { id: '6', label: 'Perfil' },
];
export const sys_users_sort_enum_server: sys_users_sort_enum_array[] = [
  { id: '1', label: 'a.user_name' },
  { id: '2', label: 'a.user_lastname' },
  { id: '3', label: 'a.user_sex' },
  { id: '4', label: 'a.is_active' },
  { id: '5', label: 'a.email' },
  { id: '6', label: 'b.name_es' },
];

export const sys_users_query_schema = z.object({
  search: z.coerce.string().optional()
    .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
    .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  // filterProfile: z.coerce.number().array().optional(),
  sort: sys_users_sort_enum_keys_schema.catch('1'),
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
  user_sex: z
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
  .refine(
    val => ((!val.is_saving) || (val.is_saving && !val.is_new) || (val.is_saving && val.is_new && val.change_password)),
    { message: `Debe definir una contraseña`, path: ['new_password'] },
  )
;
export type sys_users = z.infer<typeof sys_users_schema>;

export const sys_users_query_cache_schema = z.object({
  pageParams: z.array(z.number()).default([]),
  pages: z.array(sys_users_schema.array()).default([]),
});
export type sys_users_query_cache = z.infer<typeof sys_users_query_cache_schema>;

export const profileSchema = z.object({
  user_name: z.string().min(3, 'Debe tener al menos 3 caracteres'),
  user_lastname: z.string().min(3, 'Debe tener al menos 3 caracteres'),
  email: z.string(),
  avatar: z.string().optional(),
  avatar_file: z.string().nullable().default(null),
});
export type ProfileSchema = z.output<typeof profileSchema>

export const passwordSchema = z.object({
  new: z.string().min(5, 'Debe tener al menos 5 caracteres'),
  confirm: z.string().min(5, 'Debe tener al menos 5 caracteres'),
})
export type PasswordSchema = z.output<typeof passwordSchema>
