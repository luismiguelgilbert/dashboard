import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';

export const title = 'Equipos'
export const module = 'equipo'
export const columns = [
  {
    key: 'name_es',
    label: 'Equipo',
    sortable: false
  },
  {
    key: 'user_count',
    label: '# Equipistas',
    sortable: false
  },
  {
    key: 'nivel_0',
    label: 'Ciudad',
    sortable: false
  },
  {
    key: 'nivel_1',
    label: 'Sector',
    sortable: false
  },
  {
    key: 'nivel_2',
    label: 'Provincia',
    sortable: false
  },
  {
    key: 'nivel_3',
    label: 'Región',
    sortable: false
  },
  {
    key: 'nivel_4',
    label: 'País',
    sortable: false
  },
  {
    key: 'nivel_5',
    label: 'Super Región',
    sortable: false
  },
  {
    key: 'nivel_6',
    label: 'Zona',
    sortable: false
  },
  {
    key: 'is_active',
    label: 'Estado',
    sortable: false
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  },
];
export const actions: DropdownItemExtended[][] = [
  [
    {
      id: PermissionsList.ENSTEAMS_CREATE,
      isMainAction: true,
      disabled: false,
      label: 'Nuevo equipo',
      icon: 'i-heroicons-plus',
      click: () => { navigateTo('/ens/equipos/create') }  
    },
    {
      id: PermissionsList.ENSTEAMS_EXPORT,
      isMainAction: false,
      disabled: false,
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile() }
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
        headers: { "Content-Type": "multipart/form-data" },
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
    console.error(error)
  }
};