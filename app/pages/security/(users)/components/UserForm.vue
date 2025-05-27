<script setup lang="ts">
const props = defineProps<{
  title: string
}>();
const emits = defineEmits(['close-clicked']);
</script>

<template>
  <UDashboardPanel id="user-2">
    <UDashboardNavbar
      :title="props.title"
      :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-circle-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5 cursor-pointer"
          @click="emits('close-clicked')" />
      </template>

      <template #right>
        <UButton
          class="cursor-pointer"
          label="Guardar"
          icon="i-lucide-save"
          color="neutral" />
      </template>
    </UDashboardNavbar>
    <UserFormContent />
  </UDashboardPanel>
</template>
