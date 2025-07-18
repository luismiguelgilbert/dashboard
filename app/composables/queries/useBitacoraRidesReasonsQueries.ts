import { useInfiniteQuery } from '@tanstack/vue-query';

export const useBitacoraRidesReasonsQueries = () => {
  const store = useBitacoraRidesReasonsStore();
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');
  const { queryPayload, computedQueryKey } = storeToRefs(store);

	const {
    data,
    error,
    isStale,
    dataUpdatedAt,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [computedQueryKey.value, userCompany.value?.id, queryPayload],
    queryFn: ({ pageParam }) => $fetch(`/api/${userCompany.value?.id}/bitacora/ridesReasons`, { method: 'post', headers, body: JSON.stringify({ ...queryPayload.value, page: pageParam }) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage && lastPage.length > 0 ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3, // Retry failed requests up to 3 times
    enabled: Boolean(queryPayload.value), // Only run if payload is defined
  });

  // const updateLookupVisitorsCars = (newVisitor: lookup_bitacora_visitors_cars) => {
  //   queryClient.setQueryData<lookup_bitacora_visitors_cars[]>(['lookup-bita-visitors_cars', userCompany.value?.id, userBitaPlace.value?.id], (oldData) => {
  //     return oldData ? [...oldData, newVisitor] : [newVisitor];
  //   }
  // )};

	return {
    data,
    error,
    isStale,
    dataUpdatedAt,
    fetchNextPage,
    isFetching,
    hasNextPage,
    // updateLookupVisitorsCars,
	};
}