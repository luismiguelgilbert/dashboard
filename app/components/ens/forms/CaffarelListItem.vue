<script setup lang="ts">
const props = defineProps<{
  index: number;
  row: ens_form_caffarel_row;
}>();
const emit = defineEmits(['remove']);
</script>

<template>
  <div class="flex min-w-0 gap-x-4 items-center">
    <UAvatar :text="String(props.index + 1)" />
    <div class="min-w-0 flex-auto">
      <p class="text-sm/6 font-semibold text-gray-900">
        {{ props.row.names }}
      </p>
      <p class="mt-1 truncate text-xs/5 text-gray-500">
        {{ props.row.email }}
      </p>
      <p class="mt-1 truncate text-xs/5 text-gray-500 font-bold">
        {{ props.row.amount === 15 ? 'Socio' : (props.row.amount === 20 ? 'Matrimonio' : 'Socio Benefactor') }} ${{ props.row.amount }}
      </p>
    </div>
  </div>
  <div class="flex items-center">
    <UButton
      color="error"
      icon="i-lucide-trash-2"
      size="xl"
      variant="ghost"
      class="cursor-pointer"
      @click="emit('remove')" />
  </div>
</template>
