export function useLookupBitaVisitorsCars() {
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
      staleTime: 1000 * 60 * 1440, // 1440 minutes = 1 day
		},
	);

	return {
    lookupVisitorsCars,
    isFetchingLookupVisitorsCars,
	};
}