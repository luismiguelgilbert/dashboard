import { object, string, array, boolean, number, type InferType } from 'yup';
import { filter_search_option } from '~/types/server/filter_search';

export const filter_payload = object({
  sys_company_id: string().optional(),
  pageSize: number().default(50),
  filterBy: array(filter_search_option).default([]),
  sortBy: number().default(1),
  sortByOrder: boolean().optional().nullable().default(true),
  page: number().default(1),
  searchString: string().default(''),
});
export type type_filter_payload = InferType<typeof filter_payload>;