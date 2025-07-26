import { useQuery } from '@tanstack/vue-query';

export function useLookupBitaRideReasons() {
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');

	const {
    data: lookupRideReasons,
    isFetching: isFetchingLookupRideReasons,
  } = useQuery(
		{
      queryKey: ['lookup-bita-ride-reasons', userCompany.value?.id],
      queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/ride-reasons`, { method: 'get', headers }),
      staleTime: 1000 * 60 * 1440, // 1440 minutes = 1 day
		},
	);

	return {
    lookupRideReasons,
    isFetchingLookupRideReasons,
	};
}