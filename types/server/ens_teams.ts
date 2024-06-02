import { object, string, boolean, number, date, type InferType } from 'yup';
import { FilterQueriesKeys } from './filter_search_queries';

export const ens_teams = object({
  id: string(),
  is_active: boolean(),
  name_es: string().required('El nombre es requerido.').min(3, 'Debe incluir 3 o más caracteres.'),
  nivel_0: string().required('La ciudad es requerida.').min(3, 'Debe incluir 3 o más caracteres.'),
  nivel_1: string().required('El sector es requerido.').min(3, 'Debe incluir 3 o más caracteres.'),
  nivel_2: string(),
  nivel_3: string(),
  nivel_4: string(),
  nivel_5: string(),
  nivel_6: string(),
  created_at: date(),
  updated_at: date(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_teams = InferType<typeof ens_teams>;

export const teams_filter_options = [
  { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado', dataType: 'boolean'},
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad', dataType: 'string' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector', dataType: 'string' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia', dataType: 'string' },
];

export const teams_sort_options = [
  { label: 'Nombre', value: 1, sqlValue: 'a.name_es', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Estado', value: 2, sqlValue: 'a.is_active', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Código', value: 4, sqlValue: 'a.id', icon: 'i-heroicons-bars-arrow-down' },
];