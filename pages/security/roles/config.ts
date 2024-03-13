import { type type_sys_profiles } from '@/types/server/sys_profiles'
export const title = 'Perfiles'
export const module = 'perfil'
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
    sortable: false
  },
]
export const rowActions = (row: type_sys_profiles) => [
  [{
    label: `Editar ${row.name_es}`,
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.info('Edit', row.name_es)
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