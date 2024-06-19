<script setup lang="ts">
import { type type_ens_teams } from '@/types/server/ens/ens_teams';

defineProps({
  rows: {
    type: Array<type_ens_teams>,
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
      v-for="(team, index) in rows"
      :key="index"
      class="border-b dark:border-gray-800"
      @click="emits('row-click', team)">
      <div
        :class="team.id == routerParamId
          ? 'p-4 text-sm cursor-pointer border-l-2 border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25'
          : 'p-4 text-sm cursor-pointer border-l-2 border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'">
        <div class="flex items-center justify-between">
          <div class="font-semibold">
            {{ team.name_es }}
          </div>
          <UBadge
            :label="team.is_active? 'activo' : 'inactivo'"
            :color="team.is_active ? 'primary' : 'red'"
            variant="subtle"
            class="capitalize"
          />
        </div>
        <div class="flex items-center justify-between">
          <div>
            {{ team.nivel_0 }} - {{ team.nivel_1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>