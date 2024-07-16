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
  <div class="overflow-scroll h-full sm:min-w-[25rem]">
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
          <div class="flex items-center gap-3">
            <UAvatar
              v-if="row.avatar_url"
              :src="row.avatar_url"
              col
              size="lg"
              alt="Avatar" />
            <UAvatar
              v-else-if="row.user_lastname"
              size="lg">
              <font-awesome-icon
                v-if="row.user_sex"
                icon="fa-solid fa-mars"
                class="text-primary-500" />
              <font-awesome-icon
                v-if="!row.user_sex"
                icon="fa-solid fa-venus"
                class="text-rose-300" />
            </UAvatar>
            <div class="text-base font-semibold">
              <span class="max-w-10 dark:text-white text-black truncate">
                {{ row.user_name }} {{ row.user_lastname }}
              </span>
              <div class="text-gray-500 dark:text-gray-400 truncate">
                {{ row.email }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>