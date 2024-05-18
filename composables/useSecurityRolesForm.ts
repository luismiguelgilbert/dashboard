import { type type_rolePayload,  type type_roleDataForm, type type_roleUsers } from '@/types/server/sys_profiles';
// import { type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_links } from '@/types/server/sys_links';

export const useSecurityRolesForm = () => {
  const state = useState('useSecurityRolesForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: {} as type_rolePayload,
    profileUsers: [] as type_roleUsers,
    syslinksOptions: [] as type_sys_links[],
  };});

  const resetState = () => { 
    state.value.data = {
      profileData: {} as type_roleDataForm,
      profileLinks: [],
    };
    state.value.isLoading = false;
    state.value.isSaving = false;
    state.value.syslinksOptions = [];
    state.value.profileUsers = [];
  };

  return { state, resetState };
};