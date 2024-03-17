import { type DropdownItem } from '#ui/types';

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
export const mainAction: DropdownItem = {
  label: 'Nuevo usuario',
  icon: 'i-heroicons-plus',
  click: () => { navigateTo('/security/users/create') }  
};
export const actions: DropdownItem[][] = [
  [
    {
      label: 'Descargar',
      icon: 'i-heroicons-document-arrow-down',
      click: async () => { downloadFile() }
    },
  ],
];
//Functions
const downloadFile = async() => {
  try {
    if (window.useNuxtApp && window.useNuxtApp().payload.state.$suseSecurityUsers) {
      const nuxtApp = window.useNuxtApp();
      const state = nuxtApp.payload.state.$suseSecurityUsers;
      state.isLoading = true;
      const { data, error } = await useFetch('/api/companies/download', {
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