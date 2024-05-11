import { companyDataForm, type type_companyDataForm } from '@/types/server/sys_companies';
import { type type_userDataForm } from '@/types/server/sys_users';

export const useSecurityCompaniesForm = () => {
  const state = useState('useSecurityCompaniesForm', () => { return {
    isLoading: false as boolean,
    data: {} as type_companyDataForm,
    companyUsers: [] as type_userDataForm[],
    avatar: null as File|null,
  };});

  const resetCompanyData = () => { 
    state.value.data = {
      ...state.value.data,
      id: '',
      company_number: '',
      name_es: '',
      name_es_short: '',
      is_active: true,
      avatar_url: '',
      billing_address: '',
      billing_phone: '',
    };
    state.value.avatar = null;
    state.value.companyUsers = [];
  };

  const validateCompanyData = async () => {
    const isUserDataValid = await companyDataForm.safeParse(state.value.data);

    return isUserDataValid.success;
  };

  return { state, resetCompanyData, validateCompanyData };
};