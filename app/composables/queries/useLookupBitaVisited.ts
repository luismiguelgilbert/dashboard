import { useQuery, useQueryClient } from '@tanstack/vue-query';

export function useLookupBitaVisited() {
  const queryClient = useQueryClient();
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');
  const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

	const {
    data: lookupVisited,
    isFetching: isFetchingLookupVisited,
  } = useQuery(
		{
      queryKey: ['lookup-bita-visited', userCompany.value?.id, userBitaPlace.value?.id],
      queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visited`, { method: 'get', headers }),
      staleTime: Infinity,
		},
	);

  const updateLookupVisited = (newVisitor: lookup_bitacora_visited) => {
    queryClient.setQueryData<lookup_bitacora_visited[]>(['lookup-bita-visited', userCompany.value?.id, userBitaPlace.value?.id], (oldData) => {
      return oldData ? [...oldData, newVisitor] : [newVisitor];
    }
  )};

	return {
    lookupVisited,
    isFetchingLookupVisited,
    updateLookupVisited,
	};
}