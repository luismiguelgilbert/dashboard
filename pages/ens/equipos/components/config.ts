import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';

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