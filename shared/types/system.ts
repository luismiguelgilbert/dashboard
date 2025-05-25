import { z } from 'zod/v4';

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
