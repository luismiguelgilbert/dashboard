import type { type_sp_system_menu } from '@/types/server/sp_system_menu'
import { sys_users, type type_sys_users } from '@/types/server/sys_users'
import { type type_sys_companies } from '@/types/server/sys_companies'

interface userState {
  colors: ['indigo', 'violet', 'fuchsia', 'slate', 'zinc', 'neutral', 'stone', 'cool', 'green', 'emerald', 'teal', 'cyan', 'lime', 'blue', 'sky', 'orange', 'amber', 'yellow', 'bitt'],
  darkColors: ['slate', 'cool', 'zinc', 'stone', 'neutral'],
  themes: ['light', 'dark'],
  isLoadingMenu: boolean,
  isLoadingUser: boolean,
  menuData: type_sp_system_menu[],
  userData: type_sys_users,
  userCompanies: type_sys_companies[],
  userCompany: string | null,
  menuSelected: string | null,
  isMenuOpen: boolean,
  theme: string,
  preferedColor: string,
  preferedDarkColor: string,
  rowsPerPage: number,
}

export const useUser = () => useState<userState>('user', () => {
  return {
    colors: ['indigo', 'violet', 'fuchsia', 'slate', 'zinc', 'neutral', 'stone', 'cool', 'green', 'emerald', 'teal', 'cyan', 'lime', 'blue', 'sky', 'orange', 'amber', 'yellow', 'bitt'],
    themes: ['light', 'dark'],
    darkColors: ['slate', 'cool', 'zinc', 'stone', 'neutral'],
    isLoadingMenu: false,
    isLoadingUser: false,
    menuData: [],
    userData: sys_users.parse({}),
    userCompanies: [],
    userCompany: null,
    menuSelected: '-1',
    isMenuOpen: false,
    theme: 'light',
    preferedColor: 'indigo',
    preferedDarkColor: 'neutral',
    rowsPerPage: 10,
  }
})