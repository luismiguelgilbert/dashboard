import { type type_sys_profiles } from '@/types/server/sys_profiles'
export const title = 'Perfiles'
export const module = 'perfil'
export const columns = [
  {
    key: 'column-a',
    label: 'Perfil',
    sortable: false
  },
  {
    key: 'column-b',
    label: '# Usuarios',
    sortable: false
  },
  {
    key: 'column-c',
    label: 'Estado',
    sortable: false
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  },
]
export const pageSizeOptions = [
  { label: '25 registros', value: 25, icon: 'i-heroicons-bolt' },
  { label: '50 registros', value: 50, icon: 'i-heroicons-bolt' },
  { label: '100 registros', value: 100, icon: 'i-heroicons-clock' },
  { label: '500 registros', value: 500, icon: 'i-heroicons-clock' },
]
export const rowActions = (row: type_sys_profiles) => [
  [{
    label: `Editar ${row.name_es}`,
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.name_es)
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid'
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]