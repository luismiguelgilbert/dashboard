<script setup lang="ts">
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
</script>

<template>
  <div>
    <h1>Dashboard for Place ID: {{ userBitaPlace?.id }}</h1>
    <p>Company: {{ userCompany?.name_es }}</p>
  </div>
</template>