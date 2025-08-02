import { useQuery, useQueryClient } from '@tanstack/vue-query';

export function useLookupBitaVisitorsCars() {
  const queryClient = useQueryClient();
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');
  const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

	const {
    data: lookupVisitorsCars,
    isFetching: isFetchingLookupVisitorsCars,
  } = useQuery(
		{
      queryKey: ['lookup-bita-visitors_cars', userCompany.value?.id, userBitaPlace.value?.id],
      queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visitors-cars`, { method: 'get', headers }),
      staleTime: Infinity,
		},
	);

  const updateLookupVisitorsCars = (newVisitor: lookup_bitacora_visitors_cars) => {
    queryClient.setQueryData<lookup_bitacora_visitors_cars[]>(['lookup-bita-visitors_cars', userCompany.value?.id, userBitaPlace.value?.id], (oldData) => {
      return oldData ? [...oldData, newVisitor] : [newVisitor];
    }
  )};

	return {
    lookupVisitorsCars,
    isFetchingLookupVisitorsCars,
    updateLookupVisitorsCars,
	};
}