<script setup lang="ts">

definePageMeta({
  layout: 'auth'
});

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
});

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
});

useHead({
  htmlAttrs: {
    lang: 'en'
  }
});
</script>

<template>
  <div>
    <UMain>
      <UContainer>
        <UPage>
          <UPageError
            :error="error"
            :status="404"
            name="Página no existe"
            message="Esta página no existe."
          />
        </UPage>
      </UContainer>
    </UMain>

    <UNotifications />
  </div>
</template>
