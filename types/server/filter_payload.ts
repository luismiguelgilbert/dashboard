import { z } from 'zod';

export const filter_payload = z.object({
  sys_company_id: z.string().optional(),
  pageSize: z.coerce.number().default(50),
  filterBy: z.array(z.coerce.number()).default([]),
  sortBy: z.coerce.number().default(1),
  page: z.coerce.number().default(1),
  searchString: z.string().default(''),
});
export type type_filter_payload = z.infer<typeof filter_payload>;