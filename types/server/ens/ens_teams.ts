import { object, string, boolean, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const ens_teams = object({
  id: string().optional(),
  is_active: boolean(),
  name_es: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  nivel_0: string().required('Ciudad es requerida.').min(3, 'Ciudad debe incluir 3 o más caracteres.'),
  nivel_1: string().required('Sector es requerido.').min(3, 'Sector debe incluir 3 o más caracteres.'),
  nivel_2: string(),
  nivel_3: string(),
  nivel_4: string(),
  nivel_5: string(),
  nivel_6: string(),
  created_at: string().optional(),
  updated_at: string().optional(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_teams = InferType<typeof ens_teams>;

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, query: 'a.is_active' },
  { key: FilterQueriesKeys.ENS_TEAM_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, query: 'a.name_es' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad', valueType: 'string', requiresOrganization: false, query: 'a.nivel_0' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector', valueType: 'string', requiresOrganization: false, query: 'a.nivel_1' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia', valueType: 'string', requiresOrganization: false, query: 'a.nivel_2' },
];

export const sort_options: Array<type_sort_option> = [
  { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, query: 'a.is_active' },
  { key: FilterQueriesKeys.ENS_TEAM_NAME, query: 'a.name_es' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, query: 'a.nivel_0' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, query: 'a.nivel_1' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, query: 'a.nivel_2' },
  { key: FilterQueriesKeys.ENS_TEAM_ID, query: 'a.id' },
];