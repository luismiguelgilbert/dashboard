import { useQuery, useQueryClient } from '@tanstack/vue-query';

export function useLookupBitaRiders() {
  const queryClient = useQueryClient();
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');
  const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

	const {
    data: lookupBitaRiders,
    isFetching: isFetchingLookupRiders,
  } = useQuery(
		{
      queryKey: ['lookup-bita-riders', userCompany.value?.id, userBitaPlace.value?.id],
      queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/riders`, { method: 'get', headers }),
      staleTime: 1000 * 60 * 1440, // 1440 minutes = 1 day
		},
	);

  const updateLookupRiders = (newVisitor: lookup_bitacora_riders) => {
    queryClient.setQueryData<lookup_bitacora_riders[]>(['lookup-bita-riders', userCompany.value?.id, userBitaPlace.value?.id], (oldData) => {
      return oldData ? [...oldData, newVisitor] : [newVisitor];
    }
  )};

	return {
    lookupBitaRiders,
    isFetchingLookupRiders,
    updateLookupRiders,
	};
}