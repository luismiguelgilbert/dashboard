import { z } from 'zod/v4';
import type { CheckboxGroupItem } from '@nuxt/ui';

export const login_schema = z.object({
  email: z.coerce.string(),
  password: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
});
export type login = z.infer<typeof login_schema>;

export const session_companies_schema = z.object({
  userId: z.coerce.string(),
  userCompanies: z.string().array(),
});
export type session_companies = z.infer<typeof session_companies_schema>;

export const session_permissions_schema = z.object({
  userId: z.coerce.string(),
  userPermissions: z.string().array(),
});
export type session_permissions = z.infer<typeof session_permissions_schema>;

export const session_bitaplaces_schema = z.object({
  userId: z.coerce.string(),
  userPlaces: z.string().array(),
});
export type session_bitaplaces = z.infer<typeof session_bitaplaces_schema>;

export const sort_by_options_schema = z.object(
  {
    id: z.coerce.string().default(''),
    label: z.coerce.string().default(''),
  },
)
export type sort_by_options = z.infer<typeof sort_by_options_schema>;

export const filter_by_options_enum_keys_schema = z.enum(['boolean']);
export const filter_by_options_schema = z.object(
  {
    id: z.coerce.string(),
    legend: z.coerce.string(),
    category: filter_by_options_enum_keys_schema,
  }
);
export type filter_by_options = z.infer<typeof filter_by_options_schema> & { options: CheckboxGroupItem[] };

export const filter_string_options_schema = z.object(
  {
    id: z.coerce.string().default(''),
    label: z.coerce.string().default(''),
  },
)
export type filter_string_options = z.infer<typeof filter_string_options_schema>;

export const filter_boolean_options_schema = z.object(
  {
    id: z.stringbool().default(false),
    label: z.coerce.string().default(''),
  },
)
export type filter_boolean_options = z.infer<typeof filter_boolean_options_schema>;

export const get_record_schema = z.object(
  {
    id: z.string().min(1).max(50)
      .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
      .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
      .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
      .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
      .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
      .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
      .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!'),
  },
)
export type get_record = z.infer<typeof get_record_schema>;

export const get_company_schema = z.string().min(1).max(50)
  .refine(s => !s || (!!s && !s.includes(';')), 'Sin caracteres especiales!')
  .refine(s => !s || (!!s && !s.includes('truncate')), 'Sin caracteres especiales!')
  .refine(s => !s || (!!s && !s.includes('drop')), 'Sin caracteres especiales!')
  .refine(s => !s || (!!s && !s.includes('delete')), 'Sin caracteres especiales!')
  .refine(s => !s || (!!s && !s.includes('select')), 'Sin caracteres especiales!')
  .refine(s => !s || (!!s && !s.includes('insert')), 'Sin caracteres especiales!')
  .refine(s => !s || (!!s && !s.includes('update')), 'Sin caracteres especiales!')
export type get_company = z.infer<typeof get_company_schema>;

export const sys_links_schema = z.object({
  id: z.string(),
  parent: z.string().nullable(),
  position: z.coerce.number(),
  link: z.coerce.string(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().optional(),
  comment_es: z.coerce.string().optional().nullable(),
  row_level: z.coerce.number(),
});

export type sys_links = z.infer<typeof sys_links_schema>;

export const sys_sort_order_enum = z.enum(['asc', 'desc']);
export type sys_sortbyorder = z.infer<typeof sys_sort_order_enum>;

export const sys_url_params_schema = z.object({
  company: z.string(),
  id: z.string().optional(),
  search: z.string().optional(),
  is_new: z.string().optional(),
});
export type sys_url_params = z.infer<typeof sys_url_params_schema>;

export const sort_array_keys_schema = z.enum(['id', 'label']);
export const sort_array_schema = z.record(sort_array_keys_schema, z.string());
export type sort_enum_array = z.infer<typeof sort_array_schema>;
export const sys_filter_boolean_schema = z.enum(['True', 'False']);
