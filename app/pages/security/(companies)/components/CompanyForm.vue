<script setup lang="ts">
const props = defineProps<{
  title: string
}>();
const emits = defineEmits(['close-clicked', 'save-clicked']);

const store = useSecurityCompaniesStore();
const { isLoading, isSaveDisabled } = storeToRefs(store);
</script>

<template>
  <UDashboardPanel id="companies-2">
    <UDashboardNavbar
      :title="props.title"
      :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-circle-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5 cursor-pointer"
          :disabled="isLoading"
          :loading="isLoading"
          @click="emits('close-clicked')" />
      </template>

      <template #right>
        <UButton
          class="cursor-pointer"
          label="Guardar"
          icon="i-lucide-save"
          color="neutral"
          :disabled="isSaveDisabled"
          :loading="isLoading"
          @click="emits('save-clicked')" />
      </template>
    </UDashboardNavbar>
    <CompanyFormContent />
  </UDashboardPanel>
</template>
