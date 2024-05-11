import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';

export const title = 'Clasificaciones';
export const module = 'clasificación';
export const columns = [
  {
    key: 'id',
    label: 'Usuario',
    sortable: false
  },
  {
    key: 'email',
    label: 'Email',
    sortable: false
  },
  {
    key: 'sys_profile_name',
    label: 'Perfil',
    sortable: false
  },
  {
    key: 'actions',
    label: '',
    sortable: false,
    class: 'w-1',
  },
];
export const actions: DropdownItemExtended[][] = [
  [
    {
      id: PermissionsList.USERS_CREATE,
      isMainAction: true,
      disabled: false,
      label: 'Nuevo usuario',
      icon: 'i-heroicons-plus',
      click: () => { navigateTo('/security/users/create') }  
    },
    {
      id: PermissionsList.USERS_EXPORT,
      isMainAction: false,
      disabled: false,
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile() }
    },
    {
      id: PermissionsList.USERS_CREATE,
      isMainAction: false,
      disabled: false,
      label: 'Carga en lote',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => { console.info('Bulk upload!!') }
    }
  ],
];
//Functions
const downloadFile = async() => {
  try {
    if (window.useNuxtApp && window.useNuxtApp().payload.state.$suseSecurityUsers) {
      const nuxtApp = window.useNuxtApp();
      const state = nuxtApp.payload.state.$suseSecurityUsers;
      state.isLoading = true;
      const { data, error } = await useFetch('/api/users/download', {
        headers: { "Content-Type": "multipart/form-data" },
        method: 'post', 
        body: state.filterPayload,
      });
      if (!error.value && data.value) {
        const url = window.URL.createObjectURL(data.value);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Usuarios.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      state.isLoading = false;
    }
  } catch (error) {
    console.error(error)
  }
};