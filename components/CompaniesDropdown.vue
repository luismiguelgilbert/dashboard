<script setup lang="ts">
const { sessionData } = useUserSession()

const companies = computed(() => {
  return sessionData.value.userCompanies?.map(company => { 
    return {
      label: company.name_es_short,
      click: () => { updateSelectedCompany(company.id) }
    }
  }) ?? [];
})

const companyName = computed(() => {
  return sessionData.value?.userCompanies?.find(company => company.id === sessionData.value.userCompany)?.name_es_short ?? '...'
})

const updateSelectedCompany = (company: string) => { sessionData.value.userCompany = company };
</script>

<template>
  <UDropdown
    v-slot="{ open }"
    :items="[companies]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton color="gray" variant="ghost" :class="[open && 'bg-gray-50 dark:bg-gray-800']" class="w-full">
      <!-- <UAvatar :src="team.avatar.src" size="2xs" /> -->
      <span class="truncate text-gray-900 dark:text-white font-semibold uppercase">{{ companyName }}</span>
    </UButton>
  </UDropdown>
</template>
