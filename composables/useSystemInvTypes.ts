export const useSystemInvTypes = () => {
  const state = useState('useSystemInvTypes', () => { return {
    isLoading: false,
    filterPayload: {
      sys_company_id: '0017c671-7039-44f1-8772-81ac9555b4f9',
      pageSize: 50,
      filterBy: [],
      sortBy: 1,
      page: 1,
      searchString: ''
    }
  }});

  return { state };
};