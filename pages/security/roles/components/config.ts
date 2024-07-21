import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_userMenuData } from '~/types/server/sys_users';
import { type type_filter_option, type type_filter_payload, type type_sort_option_client } from '@/types/client/filter_payload';

export const title = 'Perfiles';
export const module = 'perfil';

export const useActions = (filterPayload: type_filter_payload, permissions: type_userMenuData[] ): DropdownItemExtended[][] => {
  const actions: DropdownItemExtended[][] = [];
  actions[0] = [];
  if (permissions.some(x => x.id === PermissionsList.ROLES_CREATE)) {
    actions[0].push(
      {
        id: PermissionsList.ROLES_CREATE,
        isMainAction: true,
        disabled: false,
        label: 'Nuevo perfil',
        icon: 'i-heroicons-plus',
        click: () => { navigateTo('/security/roles/role-new'); }  
      },
    );
  }
  if (permissions.some(x => x.id === PermissionsList.ROLES_EXPORT)) {
    actions[0].push(
      {
        id: PermissionsList.ROLES_EXPORT,
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
  { value: 'basic', slot: 'basic', label: 'Perfil', icon: 'i-heroicons-shield-check', defaultOpen: true },
  { value: 'users', slot: 'users', label: 'Usuarios', icon: 'i-heroicons-user-group', defaultOpen: false },
];
export const filter_options: Array<type_filter_option> = [
  { key: FilterQueriesKeys.SECURITY_ROLES_ACTIVE, label: 'Estado', valueType: 'boolean', requiresOrganization: false, endpointURL: '/api/lookups/security/roles_active' },
];
export const sort_options: Array<type_sort_option_client> = [
  { key: FilterQueriesKeys.SECURITY_ROLES_ID, label: 'Código' },
  { key: FilterQueriesKeys.SECURITY_ROLES_NAME, label: 'Nombre' },
  { key: FilterQueriesKeys.SECURITY_ROLES_ACTIVE, label: 'Estado' },
];
//Functions
const downloadFile = async(filterPayload: type_filter_payload) => {
  try {
    const response: Blob = await $fetch('/api/security/roles/download', {
      method: 'post',
      body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Perfiles.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};
// export const actions: DropdownItemExtended[][] = [
//   [
//     {
//       id: PermissionsList.ROLES_CREATE,
//       isMainAction: true,
//       disabled: false,
//       label: 'Nuevo perfil',
//       icon: 'i-heroicons-plus',
//       click: () => { navigateTo('/security/roles/create'); }  
//     },
//     {
//       id: PermissionsList.ROLES_EXPORT,
//       isMainAction: false,
//       disabled: false,
//       label: 'Descargar',
//       icon: 'i-heroicons-document-arrow-down',
//       click: async () => { downloadFile(); }
//     },
//   ],
// ];
// export const tabs = [
//   { value: 'basic', slot: 'basic', label: 'Perfil', icon: 'i-heroicons-user-circle', defaultOpen: true },
//   { value: 'users', slot: 'users', label: 'Usuarios Asignados', icon: 'i-heroicons-users', defaultOpen: false },
// ];
// //Functions
// const downloadFile = async() => {
//   try {
//     if (window.useNuxtApp && window.useNuxtApp().payload.state.$suseSecurityRoles) {
//       const nuxtApp = window.useNuxtApp();
//       const state = nuxtApp.payload.state.$suseSecurityRoles;
//       state.isLoading = true;
//       const { data, error } = await useFetch('/api/roles/download', {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         method: 'post', 
//         body: state.filterPayload,
//       });
//       if (!error.value && data.value) {
//         const url = window.URL.createObjectURL(data.value);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'Perfiles.xlsx');
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//       state.isLoading = false;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };