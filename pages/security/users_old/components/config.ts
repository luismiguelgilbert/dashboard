import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';

export const title = 'Usuarios';
export const module = 'usuario';
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
    sortable: false,
  },
  {
    key: 'last_sign_in_at',
    label: 'Ult. Ingreso',
    sortable: false,
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
      click: () => { navigateTo('/security/users/create'); }
    },
    {
      id: PermissionsList.USERS_EXPORT,
      isMainAction: false,
      disabled: false,
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile(); }
    },
    {
      id: PermissionsList.USERS_CREATE,
      isMainAction: false,
      disabled: false,
      label: 'Carga en lote',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => { navigateTo('/security/users/create-batch'); }
    }
  ],
];
export const tabs = [
  { value: 'basic', slot: 'basic', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies', slot: 'companies', label: 'Organizaciones', icon: 'i-heroicons-building-office-2', defaultOpen: false },
];
export const batchUploadTabs = [
  { value: 'file', slot: 'file', label: '1. Cargar archivo', icon: 'i-heroicons-document-magnifying-glass', defaultOpen: true },
  { value: 'mapping', slot: 'mapping', label: '2. Definiciones', icon: 'i-heroicons-adjustments-horizontal', defaultOpen: false },
  { value: 'errors', slot: 'errors', label: '3. Errores', icon: 'i-heroicons-exclamation-triangle', defaultOpen: false },
  { value: 'valid', slot: 'valid', label: '4. Cargar', icon: 'i-heroicons-check-badge', defaultOpen: false },
];
export const batchValidationTabs = [
  { value: 'results', slot: 'results', label: 'Resultados', icon: 'i-heroicons-chart-bar', defaultOpen: true },
  { value: 'error', slot: 'error', label: 'Errores', icon: 'i-heroicons-exclamation-triangle', defaultOpen: false },
  { value: 'valid', slot: 'valid', label: 'Válidos', icon: 'i-heroicons-check-circle', defaultOpen: false },
];
export const uploadResultTabs = [
  { value: 'valid', slot: 'valid', label: 'Válidos', icon: 'i-heroicons-check-circle', defaultOpen: false },
  { value: 'error', slot: 'error', label: 'Errores', icon: 'i-heroicons-exclamation-triangle', defaultOpen: false },
];


export const batchResultColumns = [
  {
    key: 'email',
    label: 'Email',
    sortable: false
  },
  {
    key: 'user_name',
    label: 'Nombres',
    sortable: false
  },
  {
    key: 'user_lastname',
    label: 'Apellidos',
    sortable: false,
  },
  {
    key: 'user_sex',
    label: 'Sexo',
    sortable: false,
  },
  {
    key: 'errors',
    label: 'Errores',
    sortable: false,
    class: 'w-1',
  },
];
//Functions
const downloadFile = async() => {
  try {
    if (window.useNuxtApp && window.useNuxtApp().payload.state.$suseSecurityUsers) {
      const nuxtApp = window.useNuxtApp();
      const state = nuxtApp.payload.state.$suseSecurityUsers;
      state.isLoading = true;
      const { data, error } = await useFetch('/api/users/download', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'post', 
        body: state.filterPayload,
      });
      if (!error.value && data.value) {
        const url = window.URL.createObjectURL(data.value);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Usuarios.xlsx');
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