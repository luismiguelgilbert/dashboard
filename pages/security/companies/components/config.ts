import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { PermissionsList } from '~/types/client/permissionsEnum';

export const title = 'Organizaciones';
export const module = 'organización';
export const columns = [
  {
    key: 'id',
    label: 'Organización',
    sortable: false
  },
  {
    key: 'name_es',
    label: 'Razón Social',
    sortable: false
  },
  {
    key: 'company_number',
    label: 'RUC',
    sortable: false
  },
  {
    key: 'user_count',
    label: '# Usuarios',
    sortable: false,
    class: 'whitespace-nowrap'
  },
  {
    key: 'is_active',
    label: 'Estado',
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
      id: PermissionsList.COMPANIES_CREATE,
      isMainAction: true,
      disabled: false,
      label: 'Nuevo registro',
      icon: 'i-heroicons-plus',
      click: () => { navigateTo('/security/companies/create'); }  
    },
    {
      id: PermissionsList.COMPANIES_EXPORT,
      isMainAction: false,
      disabled: false,
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile(); }
    },
    
  ],
];
export const tabs = [
  { value: 'basic', slot: 'basic', label: 'Organización', icon: 'i-heroicons-user-group', defaultOpen: true },
  { value: 'users', slot: 'users', label: 'Usuarios Asignados', icon: 'i-heroicons-users', defaultOpen: false },
];
//Functions
const downloadFile = async() => {
  try {
    if (window.useNuxtApp && window.useNuxtApp().payload.state.$suseSecurityCompanies) {
      const nuxtApp = window.useNuxtApp();
      const state = nuxtApp.payload.state.$suseSecurityCompanies;
      state.isLoading = true;
      const { data, error } = await useFetch('/api/companies/download', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'post', 
        body: state.filterPayload,
      });
      if (!error.value && data.value) {
        const url = window.URL.createObjectURL(data.value);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Organizaciones.xls');
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