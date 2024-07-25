import { array, object, string, boolean, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const sys_roles = object({
  id: number(),
  name_es: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  is_active: boolean(),
  user_count: number().optional(),
  row_count: number().optional(),
  sys_profiles_links: array(object({
    sys_link_id: string(),
  })).min(1, 'Debe seleccionar al menos un permiso.')
});
export type type_sys_roles = InferType<typeof sys_roles>;

export const sys_roles_created = object({
  id: number(),
});
export type type_sys_roles_created = InferType<typeof sys_roles_created>;

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.SECURITY_ROLES_ACTIVE, label: 'Estado', valueType: 'string', requiresOrganization: false, query: 'a.is_active' },
];

export const sort_options: Array<type_sort_option> = [
  { key: FilterQueriesKeys.SECURITY_ROLES_ACTIVE, query: 'a.is_active' },
  { key: FilterQueriesKeys.SECURITY_ROLES_NAME, query: 'a.name_es' },
  { key: FilterQueriesKeys.SECURITY_ROLES_ID, query: 'a.id' },
  { key: FilterQueriesKeys.SECURITY_ROLES_USERS_COUNT, query: 'COALESCE(b.user_count,0)' },
];