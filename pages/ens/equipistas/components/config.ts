import type { DropdownItemExtended } from '@/types/client/DropdownItemExtended';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_userMenuData } from '~/types/server/sys_users';
import { type type_filter_option, type type_filter_payload, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Equipistas';
export const module = 'equipista';

export const useActions = (filterPayload: type_filter_payload, permissions: type_userMenuData[] ): DropdownItemExtended[][] => {
  const actions: DropdownItemExtended[][] = [];
  actions[0] = [];
  if (permissions?.some(x => x.id === PermissionsList.ENSMEMBERS_CREATE)) {
    actions[0].push(
      {
        id: PermissionsList.ENSTEAMS_CREATE,
        isMainAction: true,
        disabled: false,
        label: 'Nuevo equipo',
        icon: 'i-heroicons-plus',
        click: () => { navigateTo('/ens/equipistas/equipista-new'); }  
      },
    );
  }
  if (permissions?.some(x => x.id === PermissionsList.ENSMEMBERS_EXPORT)) {
    actions[0].push(
      {
        id: PermissionsList.ENSMEMBERS_EXPORT,
        isMainAction: false,
        disabled: false,
        label: 'Descargar',
        icon: 'i-heroicons-document-arrow-down',
        click: async () => { downloadFile(filterPayload); }
      },
    );
  }
  
  return actions;
};
export const tabs = [
  { value: 'basic', slot: 'basic', label: 'Equipista', icon: 'i-heroicons-user', defaultOpen: true },
  { value: 'teams', slot: 'teams', label: 'Equipo Y Servicios', icon: 'i-heroicons-users', defaultOpen: false },
  { value: 'jobs', slot: 'jobs', label: 'Bolsa de trabajo', icon: 'i-hugeicons-job-link', defaultOpen: false },
];
export const filter_options: Array<type_filter_option> = [
  // { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_active' },
  // { key: FilterQueriesKeys.ENS_TEAM_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_name' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_nivel_0' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_nivel_1' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_teams_nivel_2' },
];
export const sort_options: Array<type_sort_option_client> = [
  // { key: FilterQueriesKeys.ENS_TEAM_ACTIVE, label: 'Estado' },
  // { key: FilterQueriesKeys.ENS_TEAM_NAME, label: 'Nombre' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_0, label: 'Ciudad' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_1, label: 'Sector' },
  // { key: FilterQueriesKeys.ENS_TEAM_NIVEL_2, label: 'Provincia' },
  { key: FilterQueriesKeys.ENS_MEMBERS_ID, label: 'Código' },
];
//Functions
const downloadFile = async(filterPayload: type_filter_payload) => {
  try {
    const response: Blob = await $fetch('/api/ens/equipistas/download', {
      method: 'post',
      body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Equipistas.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};