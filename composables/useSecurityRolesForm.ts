import { type type_profileDataForm } from '@/types/server/sys_profiles';
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
  };

  return { state, resetProfileData };
};