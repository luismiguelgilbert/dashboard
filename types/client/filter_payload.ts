import { boolean, object, string, mixed, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';

export const filter_option = object({
  key: string().oneOf(Object.values(FilterQueriesKeys)).required(),
  label: string().required(),
  valueType: string().required(),
  requiresOrganization: boolean().required(),
  endpointURL: string().required(),
});
export type type_filter_option = InferType<typeof filter_option>;

export const filter_object = object({
  value: mixed().oneOf([string(), boolean(), number()]).required(),
  label: string().required(),
});
export type type_filter_object = InferType<typeof filter_object>;

export type type_filter_selection = { [key: string]: Array<any> }

export const sort_option_client = object({
  key: string().oneOf(Object.values(FilterQueriesKeys)).required(),
  label: string().required(),
});
export type type_sort_option_client = InferType<typeof sort_option_client>;