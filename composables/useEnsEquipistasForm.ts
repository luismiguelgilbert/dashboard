import {
  ens_members_form,
  type type_ens_members_form,
  type type_ens_members_teams,
  type type_ens_members_services,
  type type_ens_members_lookup,
  type type_ens_teams_lookup,
  type type_ens_services_lookup,
} from '@/types/server/ens_types';

export const useEnsEquipistasForm = () => {
  const state = useState('useEnsEquipistasForm', () => { return {
    isLoading: false as boolean,
    data: {} as type_ens_members_form,
    data_teams: [] as type_ens_members_teams[],
    data_services: [] as type_ens_members_services[],
    equipistas: [] as type_ens_members_lookup[],
    teams: [] as type_ens_teams_lookup[],
    services: [] as type_ens_services_lookup[],
    avatar: null as File|null,
  };});

  const resetData = () => { 
    state.value.data = {
      ...state.value.data,
      id: '',
      partner_id: '',
      is_active: true,
      avatar_url: '',
    };
    state.value.avatar = null;
  };

  const validateData = async () => {
    const isDataValid = await ens_members_form.safeParse(state.value.data);

    return isDataValid.success;
  };

  return { state, resetData, validateData };
};