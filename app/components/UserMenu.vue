<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

defineProps<{
  collapsed?: boolean
}>()

const appConfig = useAppConfig();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const { clear, session } = useUserSession();
const clearCookies = async () => {
  const companiesCookie = await useCookie('nuxt-session-companies');
  const permissionsCookie = await useCookie('nuxt-session-permissions');
  companiesCookie.value = '';
  permissionsCookie.value = '';
}

const colors = ['bitt', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const user = ref({
  name: session.value?.user?.email || 'NA',
  avatar: {
    src: session.value?.user?.avatar_url,
    alt: session.value?.user?.email || 'NA'
  }
})
const updateLocalStorage = (key: 'nuxt-color-tone-mode'|'nuxt-color-accent-mode', value: string ) => {
  localStorage.setItem(key, value);
}
</script>

<template>
  <UDrawer
    title="Mis Ajustes"
    :direction="!isMobile ? 'left' : 'bottom'"
    :handle="true">
    <UButton
      :label="user.name"
      :avatar="{
        src: user.avatar.src,
        alt: user.name || 'NA'
      }"
      color="neutral"
      variant="link"
      class="w-full h-full cursor-pointer rounded-none"
      trailing-icon="i-lucide-chevron-up" />
    <template #body>
      <UCard variant="subtle">
        <UUser
          :name="user.name"
          :avatar="user.avatar"
          :size="isMobile ? 'sm' : 'xl'"
          class="p-3 pl-3 pr-6"
          description="Ir a mi configuración"
          to="/" />
        <USeparator class="py-2" />
        <UiDashboardSection
          vertical
          class="py-3"
          name="theme"
          label="Apariencia:">
          <UColorModeSelect
            variant="outline"
            class="w-full" />
        </UiDashboardSection>
        <UiDashboardSection
          vertical
          class="py-3"
          name="tone"
          label="Tonalidad:">
          <USelect
            v-model="appConfig.ui.colors.neutral"
            :items="neutrals"
            icon="i-lucide-swatch-book"
            class="w-full"
            @update:model-value="updateLocalStorage('nuxt-color-tone-mode', appConfig.ui.colors.neutral)" />
        </UiDashboardSection>
        <UiDashboardSection
          vertical
          class="py-3"
          name="color"
          label="Color:">
          <USelect
            v-model="appConfig.ui.colors.primary"
            :items="colors"
            icon="i-lucide-palette"
            class="w-full"
            @update:model-value="updateLocalStorage('nuxt-color-accent-mode', appConfig.ui.colors.primary)" />
        </UiDashboardSection>
        <USeparator class="py-3" />
        <UButton
          label="Cerrar sesión"
          icon="i-lucide-log-out"
          class="w-full cursor-pointer"
          variant="ghost"
          color="error"
          size="xl"
          @click="() => {
            clear();
            clearCookies();
            navigateTo('/auth/login');
          }" />
      </UCard>
    </template>
  </UDrawer>
</template>
