<script setup lang="ts">
import { type type_ens_members } from '@/types/server/ens_types';
// const { state } = useEnsEquipos();
const route = useRoute();
// const teamMebers = ref<Array<type_ens_members>>([]);
// const isLoading = ref(false);
// console.log()

// watch( () => state.value.selectedTeam, async () => { 
  const { data, pending } = await useLazyFetch<type_ens_members[]>(`/api/ens/equipos/:${route.params.id}/members`);
  // teamMebers.value = data.value ?? [];
  // isLoading.value = pending.value;
  // watch(pending, (newData) => { isLoading.value = newData; });
// });
</script>

<template>
  <SkeletonHeader v-if="pending" />
  <div
    v-else
    class="pl-6 pr-6 md:pl-2 md:pr-2 mt-4 md:mt-2">
    <div class="grid px-2 sm:px-4 content-start">
      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0">
        <ul
          v-if="data?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(user, index) in data"
            :key="index"
            class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
            <div class="flex items-center gap-3 min-w-0">
              <div class="text-sm min-w-0">
                <div class="flex items-center gap-3">
                  <NuxtImg 
                    v-if="user.avatar_url && user.avatar_url.length > 0"
                    :src="user.avatar_url"
                    width="20"
                    height="15"
                    class="mt-1 rounded" />
                  <UAvatar
                    v-else-if="user.user_full_name"
                    size="xs">
                    {{ user.user_full_name[0] }}
                  </UAvatar>
                  <div class="text-base font-semibold dark:text-white text-black">
                    {{ user.user_full_name }}
                    <p class="text-gray-500 dark:text-gray-400 truncate">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div
          v-else
          class="m-2">
          No hay usuarios
        </div>
      </UCard>
      <br /> <br />
    </div>
  </div>
</template>