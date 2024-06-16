<script setup lang="ts">
const { sessionData } = useUserSession();

const companyName = computed(() => {
  return sessionData.value?.userCompanies?.find(company => company.id === sessionData.value.userCompany)?.name_es_short ?? '...';
});

const companyAvatar = computed(() => {
  return sessionData.value?.userCompanies?.find(company => company.id === sessionData.value.userCompany)?.avatar_url ?? null;
});
</script>

<template>
  <USelectMenu
    v-model="sessionData.userCompany" 
    :options="sessionData.userCompanies"
    color="gray"
    option-attribute="name_es_short"
    value-attribute="id"
    placeholder="Organización">
    <UButton
      variant="ghost"
      color="gray"
      class="flex-1 justify-between">
      {{ companyName }}
      <UIcon
        name="i-heroicons-chevron-right-20-solid"
        class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500"
        :class="['transform rotate-90']" />
      <template #leading>
        <UAvatar
          v-if="companyAvatar && companyAvatar != 'null'"
          :src="companyAvatar"
          size="2xs" />
        <UAvatar
          v-if="!companyAvatar || companyAvatar == 'null'"
          size="xs">
          {{ companyName[0] }}
        </UAvatar>
      </template>
    </UButton>
  </USelectMenu>
</template>
