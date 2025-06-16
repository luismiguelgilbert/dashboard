<script setup lang="ts">
const userCompanies = useState<sys_companies[]>('userCompanies');
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
        class="border-b border-default p-2 mx-6 flex items-center gap-4 hover:bg-default/10">
        <UUser
          class="w-full p-2  border-b-neutral-200 dark:boder-b-neutral-600 hover:bg-default/10"
          :name="company.name_es_short"
          :description="company.name_es"
          :avatar="{
            src: company.avatar_url || undefined,
            icon: 'i-lucide-image'
          }" />
      </div>
    </UPageCard>
  </div>
</template>
