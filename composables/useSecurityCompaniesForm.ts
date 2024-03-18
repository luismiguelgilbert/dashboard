import { companyDataForm, type type_companyDataForm } from '@/types/server/sys_companies';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityCompaniesForm = () => {
  const state = useState('useSecurityCompaniesForm', () => { return {
    isLoading: false as boolean,
    companyData: {} as type_companyDataForm,
    avatar: null as File|null,
    // companyOptions: [] as type_sys_companies[],
  }});

  const resetCompanyData = () => { 
    state.value.companyData = {
      ...state.value.companyData,
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
  };

  const validateCompanyData = async () => {
    const isUserDataValid = await companyDataForm.safeParse(state.value.companyData);

    return isUserDataValid.success;
  };

  return { state, resetCompanyData, validateCompanyData };
};