import { object, string, boolean, number, date, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option_client } from '@/types/client/filter_payload';

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

export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_active' },
  { key: FilterQueriesKeys.ENS_TEAM_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_name' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_nivel_0' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_nivel_1' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_nivel_2' },
];

export const sort_options: Array<type_sort_option_client> = [
  { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado' },
  { key: FilterQueriesKeys.ENS_TEAM_NAME, label: 'Nombre' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector' },
  { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia' },
  { key: FilterQueriesKeys.ENS_TEAM_ID, label: 'Código' },
];