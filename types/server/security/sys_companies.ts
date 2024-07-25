import { object, string, boolean, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const sys_companies = object({
  id: string(),
  company_number: string().required('RUC es requerido.').min(3, 'RUC debe incluir 3 o más caracteres.').max(13, 'RUC debe incluir máximo 13 caracteres.'),
  name_es: string().required('Razón Social es requerido.').min(3, 'Razón Social debe incluir 3 o más caracteres.'),
  name_es_short: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  billing_phone: string().optional().default(''),
  billing_address: string().optional().default(''),
  is_active: boolean(),
  avatar_url: string().optional().nullable(),
  created_at: string(),
  updated_at: string(),
  user_count: number(),
  row_count: number(),
});
export type type_sys_companies = InferType<typeof sys_companies>;

export const sys_companies_created = object({
  id: string(),
});
export type type_sys_companies_created = InferType<typeof sys_companies_created>;

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.SECURITY_COMPANIES_ACTIVE, label: 'Estado', valueType: 'string', requiresOrganization: false, query: 'a.is_active' },
];

export const sort_options: Array<type_sort_option> = [
  { key: FilterQueriesKeys.SECURITY_COMPANIES_ACTIVE, query: 'a.is_active' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_NAME, query: 'a.name_es' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_NAME_SHORT, query: 'a.name_es_short' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_ID, query: 'a.id' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_USERS_COUNT, query: 'COALESCE(b.user_count,0)' },
];