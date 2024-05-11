import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';

export const title = 'Perfiles';
export const module = 'perfil';
export const columns = [
  {
    key: 'name_es',
    label: 'Perfil',
    sortable: false
  },
  {
    key: 'user_count',
    label: '# Usuarios',
    sortable: false
  },
  {
    key: 'is_active',
    label: 'Estado',
    sortable: false
  },
  {
    key: 'updated_at',
    label: 'Actualizado',
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
      id: PermissionsList.ROLES_CREATE,
      isMainAction: true,
      disabled: false,
      label: 'Nuevo perfil',
      icon: 'i-heroicons-plus',
      click: () => { navigateTo('/security/roles/create'); }  
    },
    {
      id: PermissionsList.ROLES_EXPORT,
      isMainAction: false,
      disabled: false,
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile(); }
    },
  ],
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
        link.setAttribute('download', 'Perfiles.xls');
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