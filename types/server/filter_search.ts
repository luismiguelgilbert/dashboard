import { object, string, array, boolean, number, mixed, type InferType } from 'yup';

export const filter_search = object({
  key: string().required(),
  label: string().required(),
  dataType: string().required(),
});
export type type_filter_search = InferType<typeof filter_search>;

export const filter_selections = array(
  mixed().oneOf([string(), boolean(), number()]).required()
);
export type type_filter_selections = InferType<typeof filter_selections>;

export const filter_search_option = object({
  key: string().required(),
  options: filter_selections,
});
export type type_filter_search_option = InferType<typeof filter_search_option>;