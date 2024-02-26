<script setup lang="ts">
const state = useUser()

const companies = computed(() => {
  return state.value.userCompanies
    .map(menu => { 
      return {
        label: menu.name_es_short,
        click: () => { updateSelectedCompany(menu.id) }
      }
    })
})

const companyName = computed(() => {
  return state.value.userCompanies.find(company => company.id === state.value.userCompany)?.name_es_short ?? '...'
})

const updateSelectedCompany = (company: string) => {
  state.value.userCompany = company
}
</script>

<template>
  <UDropdown
    v-slot="{ open }"
    mode="hover"
    :items="[companies]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton color="gray" variant="ghost" :class="[open && 'bg-gray-50 dark:bg-gray-800']" class="w-full">
      <!-- <UAvatar :src="team.avatar.src" size="2xs" /> -->
      <span class="truncate text-gray-900 dark:text-white font-semibold">{{ companyName }}</span>
    </UButton>
  </UDropdown>
</template>
