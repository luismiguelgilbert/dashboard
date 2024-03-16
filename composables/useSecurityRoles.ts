export const useSecurityRoles = () => {
  const state = useState('useSecurityRoles', () => { return {
    isLoading: false,
    filterPayload: {
      pageSize: 50,
      filterBy: [],
      sortBy: 1,
      page: 1,
      searchString: ''
    }
  }});

  return { state };
};