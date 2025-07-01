<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const open = ref(false);
const colorMode = useColorMode();
const appConfig = useAppConfig();
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
            <UButton
              :trailing-icon="colorMode.value === 'light' ? 'i-lucide-check' : undefined"
              label="Light"
              icon="i-lucide-sun"
              class="w-full cursor-pointer text-muted"
              variant="ghost"
              color="neutral"
              @click="colorMode.preference = 'light'" />
            <UButton
              :trailing-icon="colorMode.value === 'dark' ? 'i-lucide-check' : undefined"
              label="Dark"
              icon="i-lucide-moon"
              class="w-full cursor-pointer text-muted"
              variant="ghost"
              color="neutral"
              @click="colorMode.preference = 'dark'" />
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
            <div class="max-h-44 overflow-auto">
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
  <!-- <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      class="data-[state=open]:bg-elevated h-full cursor-pointer rounded-none"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      :ui="{
        trailingIcon: 'text-dimmed'
      }" />

    <template #chip-leading="{ item }">
      <span
        :style="{ '--chip': `var(--color-${(item as any).chip}-400)` }"
        class="ms-0.5 size-2 rounded-full bg-(--chip)" />
    </template>
  </UDropdownMenu> -->
</template>
