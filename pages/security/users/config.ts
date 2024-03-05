import { type type_sys_users } from '@/types/server/sys_users';
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
    sortable: false
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  },
];

export const rowActions = (row: type_sys_users) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: async () => { await navigateTo(`/security/users/${row.id}`) },
    }
  ]
];