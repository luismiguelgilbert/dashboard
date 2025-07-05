<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';
import type { AccordionItem } from '@nuxt/ui'

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
const accordionItems: AccordionItem[] = [
  {
    label: 'Appearance',
    icon: 'i-lucide-sun-moon',
    slot: 'appearance' as const,
  },
  {
    label: 'Tonalidad',
    icon: 'i-lucide-swatch-book',
    slot: 'background' as const,
  },
  {
    label: 'Color',
    icon: 'i-lucide-palette',
    slot: 'color' as const,
  },
];
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
      variant="ghost"
      class="w-full h-full cursor-pointer rounded-none"
      trailing-icon="i-lucide-chevron-up" />
    <template #body>
      <UCard variant="subtle">
        <UUser
          :name="user.name"
          :avatar="user.avatar"
          size="xl"
          class="p-3 pl-3 pr-6"
          description="Ir a mi configuración"
          to="/settings" />
        <USeparator />
        <UAccordion :items="accordionItems">
          <template #appearance="{ item }">
            <UColorModeSelect
              variant="soft"
              class="w-full mb-3" />
          </template>
          <template #background="{ item }">
            <UButton
              v-for="neutral in neutrals"
              :key="neutral"
              :label="neutral"
              :trailing-icon="appConfig.ui.colors.neutral === neutral ? 'i-lucide-check' : undefined"
              class="w-full cursor-pointer text-muted"
              variant="ghost"
              color="neutral"
              @click="appConfig.ui.colors.neutral = neutral" />
          </template>
          <template #color="{ item }">
            <div :class="{
              'max-h-44 overflow-auto': isMobile,
            }">
              <UButton
                v-for="color in colors"
                :key="color"
                :label="color"
                :trailing-icon="appConfig.ui.colors.primary === color ? 'i-lucide-check' : undefined"
                class="w-full cursor-pointer text-muted"
                :class="appConfig.ui.colors.primary === color ? 'text-primary-500' : 'text-muted'"
                variant="ghost"
                color="neutral"
                @click="appConfig.ui.colors.primary = color" />
            </div>
          </template>
        </UAccordion>
        <USeparator />
        <UButton
          label="Cerrar sesión"
          icon="i-lucide-log-out"
          class="mt-5 w-full cursor-pointer"
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
