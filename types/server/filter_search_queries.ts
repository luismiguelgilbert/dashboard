import { object, string, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';

export const filter_query = object({
  key: string().required(),
  valueType: string().required(),
  query: string().required(),
});
export type type_filter_query = InferType<typeof filter_query>;



//Pending inject company on queries
export const filter_queries: Array<type_filter_query> = [
  { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, valueType: 'boolean', query: 'select distinct is_active as value, case is_active when true then \'Activo\' else \'Inactivo\' end label from ens_teams order by 1' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, valueType: 'string', query: 'select distinct nivel_0 as value, nivel_0 as label from ens_teams order by 1' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, valueType: 'string', query: 'select distinct nivel_1 as value, nivel_1 as label from ens_teams order by 1' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, valueType: 'string', query: 'select distinct nivel_2 as value, nivel_2 as label from ens_teams order by 1' },
];