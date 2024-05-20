import { type type_userValidationSchema } from '@/types/server/sys_users';

type column = {
  index: number,
  key: string,
  label: string,
  sortable: boolean
}

export const useSecurityUsersBatch = () => {
  const state = useState('useSecurityUsersBatch', () => { return {
    isLoading: false as boolean,
    isValidated: false as boolean,
    validationTab: 'results',
    mapping: {
      email: null,
      user_name: null,
      user_lastname: null,
      user_sex: null,
      sys_profile_id: null,
      prefered_company_id: null,
    },
    tab: 'file',
    rows: [] as any[],
    columns: [] as column[],
    resultsError: [] as type_userValidationSchema[],
    resultsErrorPage: 1,
    resultsValid: [] as type_userValidationSchema[],
    resultsValidPage: 1,
    page: 1,
    pageCount: 50,
  };});
  return { state };
};