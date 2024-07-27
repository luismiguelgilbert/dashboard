import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_userMenuData } from '~/types/server/sys_users';
import { type type_filter_option, type type_filter_payload, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Organizaciones';
export const module = 'Organización';

export const useActions = (filterPayload: type_filter_payload, permissions: type_userMenuData[] ): DropdownItemExtended[][] => {
  const actions: DropdownItemExtended[][] = [];
  actions[0] = [];
  if (permissions?.some(x => x.id === PermissionsList.COMPANIES_CREATE)) {
    actions[0].push(
      {
        id: PermissionsList.COMPANIES_CREATE,
        isMainAction: true,
        disabled: false,
        label: 'Nueva Organización',
        icon: 'i-heroicons-plus',
        click: () => { navigateTo('/security/companies/company-new'); }  
      },
    );
  }
  if (permissions?.some(x => x.id === PermissionsList.COMPANIES_EXPORT)) {
    actions[0].push(
      {
        id: PermissionsList.COMPANIES_EXPORT,
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
  { value: 'basic', slot: 'basic', label: 'Organización', icon: 'i-hugeicons-building-03', defaultOpen: true },
  { value: 'users', slot: 'users', label: 'Usuarios', icon: 'i-heroicons-user-group', defaultOpen: false },
];
export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.SECURITY_COMPANIES_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/security/companies_active' },
];
export const sort_options: Array<type_sort_option_client> = [
  { key: FilterQueriesKeys.SECURITY_COMPANIES_ID, label: 'Código' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_NAME, label: 'Nombre' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_ACTIVE, label: 'Estado' },
  { key: FilterQueriesKeys.SECURITY_COMPANIES_USERS_COUNT, label: 'Conteo de Usuarios' },
];
//Functions
const downloadFile = async(filterPayload: type_filter_payload) => {
  try {
    const response: Blob = await $fetch('/api/security/companies/download', {
      method: 'post',
      body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Organizaciones.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};