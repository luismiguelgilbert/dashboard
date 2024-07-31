<script setup lang="ts">
import { type type_ens_libros } from '@/types/server/ens/ens_libros';

defineProps({
  rows: {
    type: Array<type_ens_libros>,
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
  <div class="overflow-y-auto h-full sm:min-w-[25rem]">
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
              :alt="row.name_es[0]"
              size="lg" />
            <div class="min-w-0 flex-auto text-base font-semibold">
              <p class="dark:text-white text-black truncate text-ellipsis">
                {{ row.name_es }}
              </p>
              <p class="text-gray-500 italic dark:text-gray-400 truncate text-ellipsis">
                {{ row.comment_es }}
              </p>
            </div>
          </div>
          <UToggle
            size="md"
            :model-value="row.is_active" />
        </div>
      </div>
    </div>
  </div>
</template>