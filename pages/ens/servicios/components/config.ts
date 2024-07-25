import type { DropdownItemExtended } from '@/types/client/DropdownItemExtended';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_userMenuData } from '~/types/server/sys_users';
import { type type_filter_option, type type_filter_payload, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Servicios';
export const module = 'servicio';

export const useActions = (filterPayload: type_filter_payload, permissions: type_userMenuData[] ): DropdownItemExtended[][] => {
  const actions: DropdownItemExtended[][] = [];
  actions[0] = [];
  if (permissions?.some(x => x.id === PermissionsList.ENSSERVICIOS_CREATE)) {
    actions[0].push(
      {
        id: PermissionsList.ENSSERVICIOS_CREATE,
        isMainAction: true,
        disabled: false,
        label: 'Nuevo servicio',
        icon: 'i-heroicons-plus',
        click: () => { navigateTo('/ens/servicios/servicio-new'); }  
      },
    );
  }
  if (permissions?.some(x => x.id === PermissionsList.ENSSERVICIOS_EXPORT)) {
    actions[0].push(
      {
        id: PermissionsList.ENSSERVICIOS_EXPORT,
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
  { value: 'basic', slot: 'basic', label: 'Servicio', icon: 'i-heroicons-lifebuoy', defaultOpen: true },
  { value: 'users', slot: 'users', label: 'Equipistas', icon: 'i-heroicons-user-group', defaultOpen: false },
];
export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.ENS_SERVICIOS_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_servicios_active' },
  { key: FilterQueriesKeys.ENS_SERVICIOS_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_servicios_name' },
];
export const sort_options: Array<type_sort_option_client> = [
  { key: FilterQueriesKeys.ENS_SERVICIOS_ACTIVE, label: 'Estado' },
  { key: FilterQueriesKeys.ENS_SERVICIOS_NAME, label: 'Nombre' },
  { key: FilterQueriesKeys.ENS_SERVICIOS_ID, label: 'Código' },
];
//Functions
const downloadFile = async(filterPayload: type_filter_payload) => {
  try {
    const response: Blob = await $fetch('/api/ens/servicios/download', {
      method: 'post',
      body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Servicios.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};