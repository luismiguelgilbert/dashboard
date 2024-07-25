import { array, object, string, number, type InferType } from 'yup';

export const roles_columns = object({
  root_id: string(),
  root_name_es: string(),
  page_id: string(),
  page_name_es: string(),
  icon: string(),
  columns_count: number(),
  permissions: array(object({
    id: string(),
    name_es: string(),
    icon: string(),
  })),
});
export type type_roles_columns = InferType<typeof roles_columns>;