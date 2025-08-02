<script setup lang="ts">
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
</script>

<template>
  <div>
    <h1>Events Report for Place ID: {{ userBitaPlace?.id }}</h1>
    <p>Company: {{ userCompany?.name_es }}</p>
    <!-- Additional content for the visits report can be added here -->
  </div>
</template>