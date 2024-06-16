import { object, string, boolean, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';

export const filter_payload = object({
  sys_company_id: string().optional(),
  pageSize: number().default(50),
  filterSelection: object(),
  sortBy: string().oneOf(Object.values(FilterQueriesKeys)).required(),
  sortByOrder: boolean().optional().nullable().default(true),
  page: number().default(1),
  searchString: string().default(''),
});
export type type_filter_payload = InferType<typeof filter_payload>;

export const filter_option = object({
  key: string().oneOf(Object.values(FilterQueriesKeys)).required(),
  label: string().required(),
  valueType: string().required(),
  requiresOrganization: boolean().required(),
  query: string().required(),
});
export type type_filter_option = InferType<typeof filter_option>;

export const sort_option = object({
  key: string().oneOf(Object.values(FilterQueriesKeys)).required(),
  query: string().required(),
});
export type type_sort_option = InferType<typeof sort_option>;