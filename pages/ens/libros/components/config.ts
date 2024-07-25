import type { DropdownItemExtended } from '@/types/client/DropdownItemExtended';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_userMenuData } from '~/types/server/sys_users';
import { type type_filter_option, type type_filter_payload, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Libros';
export const module = 'libro';

export const useActions = (filterPayload: type_filter_payload, permissions: type_userMenuData[] ): DropdownItemExtended[][] => {
  const actions: DropdownItemExtended[][] = [];
  actions[0] = [];
  if (permissions?.some(x => x.id === PermissionsList.ENSBOOKS_CREATE)) {
    actions[0].push(
      {
        id: PermissionsList.ENSBOOKS_CREATE,
        isMainAction: true,
        disabled: false,
        label: 'Nuevo libro',
        icon: 'i-heroicons-plus',
        click: () => { navigateTo('/ens/libros/libro-new'); }  
      },
    );
  }
  if (permissions?.some(x => x.id === PermissionsList.ENSBOOKS_EXPORT)) {
    actions[0].push(
      {
        id: PermissionsList.ENSBOOKS_EXPORT,
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
  { value: 'basic', slot: 'basic', label: 'Libro', icon: 'i-heroicons-book-open', defaultOpen: true },
];
export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.ENS_LIBROS_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_libros_active' },
  { key: FilterQueriesKeys.ENS_LIBROS_NAME, label: 'Nombre', valueType: 'string', requiresOrganization: false, endpointURL: '/api/lookups/ens/ens_libros_name' },
];
export const sort_options: Array<type_sort_option_client> = [
  { key: FilterQueriesKeys.ENS_LIBROS_ACTIVE, label: 'Estado' },
  { key: FilterQueriesKeys.ENS_LIBROS_NAME, label: 'Nombre' },
  { key: FilterQueriesKeys.ENS_LIBROS_ID, label: 'Código' },
];
//Functions
const downloadFile = async(filterPayload: type_filter_payload) => {
  try {
    const response: Blob = await $fetch('/api/ens/libros/download', {
      method: 'post',
      body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Libros.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};