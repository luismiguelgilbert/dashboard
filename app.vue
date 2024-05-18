<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
const colorMode = useColorMode();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white');
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: `width=device-width, initial-scale=${isMobile.value ? '0.90':'1'}, user-scalable=0` },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
});

useSeoMeta({
  title: 'Framework - Powered by BITT',
  description: 'Framework es una plataforma para administrar organizaciones.',
  // ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  // twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  // twitterCard: 'summary_large_image'
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator :throttle="100" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>

      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </UNotifications>
    <UModals />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>