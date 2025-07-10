export function useLookupBitaVisitors() {
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');
  const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

	const {
    data: lookupVisitors,
    isFetching: isFetchingLookupVisitors,
  } = useQuery(
		{
      queryKey: ['lookup-bita-visitors', userCompany.value?.id, userBitaPlace.value?.id],
      queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visitors`, { method: 'get', headers }),
      staleTime: 1000 * 60 * 1440, // 1440 minutes = 1 day
		},
	);

	return {
    lookupVisitors,
    isFetchingLookupVisitors,
	};
}