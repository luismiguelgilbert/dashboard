export const useSystemInvTypes = () => {
  const { sessionData } = useUserSession();

  const state = useState('useSystemInvTypes', () => { return {
    isLoading: false,
    filterPayload: {
      sys_company_id: sessionData.value.userCompany,
      pageSize: 50,
      filterBy: [],
      sortBy: 1,
      page: 1,
      searchString: ''
    }
  }});

  return { state };
};