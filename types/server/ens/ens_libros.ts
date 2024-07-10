import { object, string, boolean, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const ens_libros = object({
  id: string(),
  is_active: boolean(),
  name_es: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  comment_es: string(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_libros = InferType<typeof ens_libros>;

export const ens_libros_created = object({
  id: string(),
});
export type type_ens_libros_created = InferType<typeof ens_libros_created>;

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.ENS_LIBROS_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, query: 'a.is_active' },
  { key: FilterQueriesKeys.ENS_LIBROS_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, query: 'a.name_es' },
];

export const sort_options: Array<type_sort_option> = [
  { key: FilterQueriesKeys.ENS_LIBROS_ACTIVE, query: 'a.is_active' },
  { key: FilterQueriesKeys.ENS_LIBROS_NAME, query: 'a.name_es' },
  { key: FilterQueriesKeys.ENS_LIBROS_ID, query: 'a.id' },
];