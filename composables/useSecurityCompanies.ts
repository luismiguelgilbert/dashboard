export const useSecurityCompanies = () => {
  const state = useState('useSecurityCompanies', () => { return {
    isLoading: false,
    filterPayload: {
      pageSize: 25,
      filterBy: [],
      sortBy: 1,
      page: 1,
      searchString: ''
    }
  };});

  return { state };
};