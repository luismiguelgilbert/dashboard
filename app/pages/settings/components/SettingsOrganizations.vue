<script setup lang="ts">
const userCompanies = useState<sys_companies[]>('userCompanies');
const isProcessing = ref(false);

const updateCompany = async (company: sys_companies) => {
  try {
    userCompanies.value.forEach(c => {
      c.is_default = c.id === company.id;
    });

    const headers = useRequestHeaders(['cookie']);
    isProcessing.value = true;
    await $fetch('/api/system/userOrganizationUpdate', {
      method: 'post',
      body: company,
      headers,
    })
    useToast().add({
      title: 'Listo',
      description: 'Sus cambios fueron guardados.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: `Error al guardar los cambios. (${error})`,
      icon: 'i-lucide-shield-alert',
      type: 'foreground',
      color: 'error',
    });
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div>
    <UPageCard
      title="Organizaciones"
      description="Puedo acceder a estas organizaciones:"
      variant="naked"
      orientation="horizontal"
      class="mb-4" />

    <UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
      <div
        v-for="company in userCompanies"
        :key="company.id"
        class="border-b border-default p-2 sm:mx-6 sm:flex grid items-center gap-4 hover:bg-default/10">
        <UUser
          class="w-full p-2  border-b-neutral-200 dark:boder-b-neutral-600 hover:bg-default/10"
          :name="company.name_es_short"
          :description="company.name_es"
          :avatar="{
            src: company.avatar_url || undefined,
            icon: 'i-lucide-image'
          }" />
        <USwitch
          v-model="company.is_default"
          :ui="{ root: 'cursor-pointer', label: 'cursor-pointer', base: 'cursor-pointer' }"
          :disabled="company.is_default"
          size="xl"
          label="Principal"
          @update:model-value="updateCompany(company)" />
      </div>
    </UPageCard>
  </div>
</template>
