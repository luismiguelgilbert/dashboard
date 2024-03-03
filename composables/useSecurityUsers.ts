import { type type_filter_payload } from '@/types/server/filter_payload';

export const useSecurityUsers = () => {
  const filterPayload = useState<type_filter_payload>('useSecurityUsers', () => { return {
    pageSize: 50,
    filterBy: [],
    sortBy: 1,
    page: 1,
    searchString: ''
  }});

  return { filterPayload };
};