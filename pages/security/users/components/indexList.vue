<script setup lang="ts">
import { type type_sys_users } from '@/types/server/security/sys_users';

defineProps({
  rows: {
    type: Array<type_sys_users>,
    required: false,
    default: () => []
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
});
const emits = defineEmits(['row-click']);

const route = useRoute();
const routerParamId = computed(() => route.params.id);
</script>

<template>
  <div class="overflow-y-auto h-full">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="border-b dark:border-gray-800"
      @click="emits('row-click', row)">
      <div
        :class="row.id == routerParamId
          ? 'p-4 text-sm cursor-pointer border-l-2 border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25'
          : 'p-4 text-sm cursor-pointer border-l-2 border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'">
        <div class="flex items-center justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <UAvatar
              v-if="row.avatar_url"
              :src="row.avatar_url"
              col
              size="lg"
              alt="Avatar" />
            <UAvatar
              v-else
              size="lg">
              <UIcon
                :name="row.user_sex ? 'i-hugeicons-manager' : 'i-hugeicons-dress-02'"
                :class="row.user_sex ? '' : 'dark:bg-rose-300 bg-rose-400'"/>
            </UAvatar>
            <div class="min-w-0 flex-auto text-base font-semibold">
              <p class="dark:text-white text-black truncate text-ellipsis">
                {{ row.user_name }} {{ row.user_lastname }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 truncate text-ellipsis">
                {{ row.email }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 truncate text-ellipsis">
                <UBadge
                  color="primary"
                  variant="subtle"
                  class="gap-1 mt-1">
                  {{ row.sys_profile_name }}
                </UBadge>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>