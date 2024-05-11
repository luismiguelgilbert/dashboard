import { ValidationError } from 'yup';
import { userDataForm, type type_userDataForm, userCompaniesForm, type type_userCompaniesForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';
const toast = useToast();

export const useSecurityUsersForm = () => {
  const state = useState('useSecurityUsersForm', () => { return {
    isLoading: false as boolean,
    data: {} as type_userDataForm,
    userCompanies: [] as type_userCompaniesForm,
    avatar: null as File|null,
    profileOptions: [] as type_sys_profiles[],
    companyOptions: [] as type_sys_companies[],
  };});

  const resetState = () => { 
    state.value.data = {} as type_userDataForm;
    state.value.avatar = null;
    state.value.userCompanies = [];
    state.value.profileOptions = [];
  };

  const validateData = async () => {
    try {
      state.value.isLoading = true;
      await userDataForm.validate(state.value.data, { strict: true, abortEarly: false });
      await userCompaniesForm.validate(state.value.userCompanies, { strict: true, abortEarly: false });
  
      // return isUserDataValid && isCompaniesDataValid;
      state.value.isLoading = false;
      return true;
    } catch (error) {
      state.value.isLoading = false;
      if (error instanceof ValidationError) {
        const description = error.errors.map(m => `${m}<br />`).join('');
        toast.add({
          title: 'Datos incompletos',
          description,
          icon: 'i-heroicons-no-symbol',
          color: 'rose',
          ui: {
            background: 'bg-red-100',
          },
          timeout: 1250 * error.errors.length,
        });
      }
      return false;
    }
  };

  return { state, resetState, validateData };
};