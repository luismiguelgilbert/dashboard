import { object, string, boolean, date, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const ens_members = object({
  id: string(),
  user_name: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required('Apellido es requerido.').min(3, 'Apellido debe incluir 3 o más caracteres.'),
  email: string().email('Deber ser un email válido').required('Email es requerido.'),
  user_sex: boolean(),
  website: string(),
  avatar_url: string().optional().nullable(),
  partner_full_name: string(),
  fecha_matrimonio: date(),
  fecha_nacimiento: date(),
  is_active: boolean(),
  es_consiliario: boolean(),
  created_at: date(),
  updated_at: date(),
  row_count: number().optional().nullable().default(0),
});
export type type_ens_members = InferType<typeof ens_members>;

export const filter_options: Array<type_filter_option> = [
  // { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, query: 'a.is_active' },
  // { key: FilterQueriesKeys.ENS_TEAM_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, query: 'a.name_es' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad', valueType: 'string', requiresOrganization: false, query: 'a.nivel_0' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector', valueType: 'string', requiresOrganization: false, query: 'a.nivel_1' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia', valueType: 'string', requiresOrganization: false, query: 'a.nivel_2' },
];

export const sort_options: Array<type_sort_option> = [
  // { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, query: 'a.is_active' },
  // { key: FilterQueriesKeys.ENS_TEAM_NAME, query: 'a.name_es' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, query: 'a.nivel_0' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, query: 'a.nivel_1' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, query: 'a.nivel_2' },
  { key: FilterQueriesKeys.ENS_MEMBERS_ID, query: 'a.id' },
];