import { profileDataForm,  type type_profileDataForm } from '@/types/server/sys_profiles';
import { type type_sys_links } from '@/types/server/sys_links';

export const useSecurityRolesForm = () => {
  const state = useState('useSecurityRolesForm', () => { return {
    isLoading: false as boolean,
    profileData: {} as type_profileDataForm,
    profileLinks: [] as string[],
    syslinksOptions: [] as type_sys_links[],
  }});

  const resetProfileData = () => { 
    state.value.profileData = {
      ...state.value.profileData,
      id: '',
      name_es: '',
      is_active: true,
    };
    state.value.profileLinks = [];
  };

  const validateProfileData = async () => {
    const isProfileDataValid = await profileDataForm.safeParse(state.value.profileData);
    const isLinksDataValid = state.value.profileLinks.length > 0;

    return isProfileDataValid.success && isLinksDataValid;
  };

  return { state, resetProfileData, validateProfileData };
};