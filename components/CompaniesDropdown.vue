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
    variant="none"
    option-attribute="name_es_short"
    value-attribute="id"
    placeholder="Organización">
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
    <template #trailing>
      <UIcon name="i-heroicons-home-modern" />
    </template>
  </USelectMenu>
</template>
