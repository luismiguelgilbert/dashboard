import { object, string, boolean, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const ens_servicios = object({
  id: string(),
  is_active: boolean(),
  name_es: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_count: number().optional().nullable().default(0),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_servicios = InferType<typeof ens_servicios>;

export const ens_servicios_created = object({
  id: string(),
});
export type type_ens_servicios_created = InferType<typeof ens_servicios_created>;

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.ENS_SERVICIOS_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, query: 'a.is_active' },
  { key: FilterQueriesKeys.ENS_SERVICIOS_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, query: 'a.name_es' },
];

export const sort_options: Array<type_sort_option> = [
  { key: FilterQueriesKeys.ENS_SERVICIOS_ACTIVE, query: 'a.is_active' },
  { key: FilterQueriesKeys.ENS_SERVICIOS_NAME, query: 'a.name_es' },
  { key: FilterQueriesKeys.ENS_SERVICIOS_ID, query: 'a.id' },
];