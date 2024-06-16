import { object, string, array, boolean, number, mixed, type InferType } from 'yup';
// import { FilterQueriesKeys } from '@/types/server/filter_keys';
export const filter_search = object({
  key: string().required(),
  label: string().required(),
  dataType: string().required(),
});
export type type_filter_search = InferType<typeof filter_search>;

export const filter_object = object({
  value: mixed().oneOf([string(), boolean(), number()]).required(),
  label: string().required(),
});
export type type_filter_object = InferType<typeof filter_object>;

export const filter_selections = array(
  mixed().oneOf([string(), boolean(), number()]).required()
);
export type type_filter_selections = InferType<typeof filter_selections>;

export const filter_search_option = object({
  key: string().required(),
  options: array(filter_object),
});
export type type_filter_search_option = InferType<typeof filter_search_option>;