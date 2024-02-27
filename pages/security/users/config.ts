import { type type_sys_users } from '@/types/server/sys_users'
export const title = 'Usuarios'
export const module = 'usuario'
export const columns = [
  {
    key: 'column-a',
    label: 'Usuario',
    sortable: false
  },
  {
    key: 'column-b',
    label: 'Email',
    sortable: false
  },
  {
    key: 'column-c',
    label: 'Perfil',
    sortable: false
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  },
]

export const rowActions = (row: type_sys_users) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.user_name)
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