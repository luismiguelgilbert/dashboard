<script setup lang="ts">
const { sessionData } = useUserSession()

const companyName = computed(() => {
  return sessionData.value?.userCompanies?.find(company => company.id === sessionData.value.userCompany)?.name_es_short ?? '...'
})

const companyAvatar = computed(() => {
  return sessionData.value?.userCompanies?.find(company => company.id === sessionData.value.userCompany)?.avatar_url ?? null
})

</script>

<template>
  <USelectMenu
    v-model="sessionData.userCompany" 
    :options="sessionData.userCompanies"
    class="w-full"
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
  </USelectMenu>
    <!-- {{ sessionData.userCompanies }} -->
  <!-- <UDropdown
    v-slot="{ open }"
    :items="[companies]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton color="gray" variant="ghost" :class="[open && 'bg-gray-50 dark:bg-gray-800']" class="w-full">
      <UAvatar v-if="companyAvatar" :src="companyAvatar" size="2xs" />
      <span class="truncate text-gray-900 dark:text-white font-semibold uppercase">{{ companyName }}</span>
    </UButton>
  </UDropdown> -->
</template>
