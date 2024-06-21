import type { DropdownItemExtended } from '@/types/client/DropdownItemExtended';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_option, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Equipos';
export const module = 'equipo';
export const actions: DropdownItemExtended[][] = [
  [
    {
      id: PermissionsList.ENSTEAMS_CREATE,
      isMainAction: true,
      disabled: false,
      label: 'Nuevo equipo',
      icon: 'i-heroicons-plus',
      click: () => { navigateTo('/ens/equipos/equipo-new'); }  
    },
    {
      id: PermissionsList.ENSTEAMS_EXPORT,
      isMainAction: false,
      disabled: false,
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile(); }
    },
  ],
];
export const tabs = [
  { value: 'basic', slot: 'basic', label: 'Equipo', icon: 'i-heroicons-user-group', defaultOpen: true },
  { value: 'users', slot: 'users', label: 'Equipistas', icon: 'i-heroicons-user-group', defaultOpen: false },
];
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
//Functions
const downloadFile = async() => {
  try {
    if (window.useNuxtApp && window.useNuxtApp().payload.state.$suseSecurityRoles) {
      const nuxtApp = window.useNuxtApp();
      const state = nuxtApp.payload.state.$suseSecurityRoles;
      state.isLoading = true;
      const { data, error } = await useFetch('/api/roles/download', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'post', 
        body: state.filterPayload,
      });
      if (!error.value && data.value) {
        const url = window.URL.createObjectURL(data.value);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Equipos.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      state.isLoading = false;
    }
  } catch (error) {
    console.error(error);
  }
};