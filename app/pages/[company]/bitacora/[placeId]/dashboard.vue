<script setup lang="ts">
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
</script>

<template>
  <div class="lg:ml-5 border-l border-l-neutral-200 dark:border-l-neutral-800">
    <h1>Dashboard for Place ID: {{ userBitaPlace?.id }}</h1>
    <p>Company: {{ userCompany?.name_es }}</p>
  </div>
</template>