import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export const useBitacoraVisitsQueries = () => {
  const store = useBitacoraVisitsStore();
  const headers = useRequestHeaders(['cookie']);
  const userCompany = useState<sys_companies | undefined>('userCompany');
  const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
  const { currentRoute } = useRouter();
  const queryClient = useQueryClient();
  const { queryPayload, computedQueryKey, computedRecordQueryKey } = storeToRefs(store);

  // DataList Actions
	const {
    data: dataList,
    error: dataListError,
    isStale: dataListStale,
    isFetching: dataListFetching,
    dataUpdatedAt,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [computedQueryKey.value, userCompany.value?.id, userBitaPlace.value?.id, queryPayload],
    queryFn: ({ pageParam }) => $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visits`, { method: 'post', headers, body: JSON.stringify({ ...queryPayload.value, page: pageParam }) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage && lastPage.length > 0 ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3, // Retry failed requests up to 3 times
    enabled: Boolean(userCompany.value?.id) && Boolean(queryPayload.value), // Only run if payload is defined
  });

  // DataRecord Actions
  const { data: dataRecord, isFetching: dataRecordFetching } = useQuery({
    queryKey: [computedRecordQueryKey.value, userCompany.value?.id, currentRoute.value.params.id],
    queryFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visit`, { method: 'post', headers, body: { id: currentRoute.value.params.id } }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: Boolean(currentRoute.value.params.id), // Only run if an ID is provided
  });

  const postData = async (payload: bitacora_visits) => await $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visit-upsert`, { method: 'POST', body: payload });

  const { mutateAsync: dataRecordUpdate, isPending: dataRecordUpdating } = useMutation({
    mutationFn: postData,
    onSuccess: async () => {
      queryClient.resetQueries({ queryKey: [computedQueryKey.value, userCompany.value?.id] });
      queryClient.resetQueries({ queryKey: [computedRecordQueryKey.value] });
    },
    retry: 0, // Disable retries for this mutation
  });

	return {
    // DataList Props:
    dataList,
    dataListError,
    dataListStale,
    dataListFetching,
    dataUpdatedAt,
    fetchNextPage,
    hasNextPage,
    // DataRecord Props:
    dataRecord,
    dataRecordFetching,
    dataRecordUpdate,
    dataRecordUpdating,
	};
}