import { z } from 'zod/v4';

export const login_schema = z.object({
  email: z.coerce.string(),
  password: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
});
export type login = z.infer<typeof login_schema>;

export const sort_by_options_schema = z.object(
  {
    id: z.coerce.string().default(''),
    label: z.coerce.string().default(''),
  },
)
export type sort_by_options = z.infer<typeof sort_by_options_schema>;

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
    id: z.string().min(1).max(50),
  },
)
export type get_record = z.infer<typeof get_record_schema>;

export const sys_links_schema = z.object({
  id: z.string(),
  parent: z.string().nullable(),
  position: z.coerce.number(),
  link: z.coerce.string(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().optional(),
  comment_es: z.coerce.string().optional().nullable(),
  row_level: z.coerce.number(),
  requires_company: z.coerce.boolean(),
});

export type sys_links = z.infer<typeof sys_links_schema>;
