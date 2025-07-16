import { useQuery } from '@tanstack/vue-query';

export function useLookupBitaReasons() {
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');

	const {
    data: lookupReasons,
    isFetching: isFetchingLookupReasons,
  } = useQuery(
		{
      queryKey: ['lookup-bita-reasons', userCompany.value?.id],
      queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/reasons`, { method: 'get', headers }),
      staleTime: 1000 * 60 * 1440, // 1440 minutes = 1 day
		},
	);

	return {
    lookupReasons,
    isFetchingLookupReasons,
	};
}