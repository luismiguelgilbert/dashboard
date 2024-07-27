import type { DropdownItemExtended } from '@/types/client/DropdownItemExtended';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_userMenuData } from '~/types/server/sys_users';
import { type type_filter_option, type type_filter_payload, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Usuarios';
export const module = 'usuario';

export const useActions = (filterPayload: type_filter_payload, permissions: type_userMenuData[] ): DropdownItemExtended[][] => {
  const actions: DropdownItemExtended[][] = [];
  actions[0] = [];
  if (permissions?.some(x => x.id === PermissionsList.USERS_CREATE)) {
    actions[0].push(
      {
        id: PermissionsList.USERS_CREATE,
        isMainAction: true,
        disabled: false,
        label: 'Nuevo usuario',
        icon: 'i-heroicons-plus',
        click: () => { navigateTo('/security/users/user-new'); }  
      },
    );
  }
  if (permissions?.some(x => x.id === PermissionsList.USERS_EXPORT)) {
    actions[0].push(
      {
        id: PermissionsList.USERS_EXPORT,
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
  { value: 'basic', slot: 'basic', label: 'Usuario', icon: 'i-hugeicons-user', defaultOpen: true },
  { value: 'companies', slot: 'companies', label: 'Organizaciones', icon: 'i-heroicons-user-group', defaultOpen: false },
];
export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.SECURITY_USERS_SEX, label: 'Sexo', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/security/users_sex' },
  { key: FilterQueriesKeys.SECURITY_USERS_PROFILE, label: 'Perfil', valueType: 'number', requiresOrganization: false, endpointURL: '/api/lookups/security/users_profile' },
];
export const sort_options: Array<type_sort_option_client> = [
  { key: FilterQueriesKeys.SECURITY_USERS_ID, label: 'Código' },
  { key: FilterQueriesKeys.SECURITY_USERS_NAME, label: 'Nombres' },
  { key: FilterQueriesKeys.SECURITY_USERS_LASTNAME, label: 'Apellidos' },
];
//Functions
const downloadFile = async(filterPayload: type_filter_payload) => {
  try {
    const response: Blob = await $fetch('/api/security/users/download', {
      method: 'post',
      body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Usuarios.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};