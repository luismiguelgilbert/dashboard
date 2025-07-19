import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export const useSecurityUsersQueries = () => {
  const store = useSecurityUsersStore();
  const headers = useRequestHeaders(['cookie']);
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
    queryKey: [computedQueryKey.value, queryPayload],
    queryFn: ({ pageParam }) => $fetch('/api/security/users', { method: 'post', headers, body: JSON.stringify({ ...queryPayload.value, page: pageParam }) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage && lastPage.length > 0 ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3, // Retry failed requests up to 3 times
    enabled: Boolean(queryPayload.value), // Only run if payload is defined
  });

  // DataRecord Actions
  const { data: dataRecord, isFetching: dataRecordFetching } = useQuery({
    queryKey: [computedRecordQueryKey.value, currentRoute.value.params.id],
    queryFn: () => $fetch('/api/security/user', { method: 'post', headers, body: { id: currentRoute.value.params.id } }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: Boolean(currentRoute.value.params.id), // Only run if an ID is provided
  });

  const postData = async (payload: sys_users) => await $fetch('/api/security/user-upsert', { method: 'POST', body: payload });

  const { mutateAsync: dataRecordUpdate, isPending: dataRecordUpdating } = useMutation({
    mutationFn: postData,
    onSuccess: async () => {
      queryClient.resetQueries({ queryKey: [computedQueryKey.value] });
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