import { array, object, string, boolean, date, number, type InferType } from 'yup';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option } from '@/types/server/filter_payload';

export const ens_members_phone = object({
  phone_type: number().required('Tipo de teléfono es requerido.'),
  phone_number: string().required('Número de teléfono es requerido.'),
});
export type type_ens_members_phone = InferType<typeof ens_members_phone>;

export const ens_members_address = object({
  address_type: number().required('Tipo de dirección es requerido.'),
  address: string().required('Dirección es requerido.'),
});
export type type_ens_members_address = InferType<typeof ens_members_address>;

export const ens_members_mail = object({
  email: string().email('Debe ser un email válido').required('Email es requerido.'),
});
export type type_ens_members_mail = InferType<typeof ens_members_mail>;

export const ens_members_children = object({
  child_name: string().required('Nombre es requerido.'),
  child_sex: boolean().required('Sexo es requerido.'),
});
export type type_ens_members_children = InferType<typeof ens_members_children>;

export const ens_members = object({
  id: string(),
  user_name: string().required('Nombre es requerido.').min(3, 'Nombre debe incluir 3 o más caracteres.'),
  user_lastname: string().required('Apellido es requerido.').min(3, 'Apellido debe incluir 3 o más caracteres.'),
  user_full_name: string(),
  email: string().email('Deber ser un email válido').required('Email es requerido.'),
  user_sex: boolean(),
  website: string(),
  avatar_url: string().optional().nullable(),
  partner_id: string().optional(),
  partner_full_name: string(),
  fecha_matrimonio: date().optional(),
  fecha_nacimiento: date().optional(),
  is_active: boolean(),
  es_consiliario: boolean(),
  phones: array(ens_members_phone),
  emails: array(ens_members_mail),
  addresses: array(ens_members_address),
  children: array(ens_members_children),
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