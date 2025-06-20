<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

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

const items = computed<DropdownMenuItem[][]>(() => ([
  [
    {
      type: 'label',
      label: user.value.name,
      avatar: user.value.avatar
    }
  ],
  [
    {
      label: 'Configuración',
      icon: 'i-lucide-settings',
      to: '/settings'
    }
  ],
  [
    {
      label: 'Theme',
      icon: 'i-lucide-palette',
      children: [{
        label: 'Primary',
        slot: 'chip',
        chip: appConfig.ui.colors.primary,
        content: {
          align: 'center',
          collisionPadding: 16
        },
        children: colors.map(color => ({
          label: color,
          chip: color,
          checked: appConfig.ui.colors.primary === color,
          slot: 'chip',
          type: 'checkbox',
          class: 'cursor-pointer',
          onSelect: (e) => {
            e.preventDefault()

            appConfig.ui.colors.primary = color
          }
        }))
      }, {
        label: 'Neutral',
        slot: 'chip',
        chip: appConfig.ui.colors.neutral,
        content: {
          align: 'end',
          collisionPadding: 16
        },
        children: neutrals.map(color => ({
          label: color,
          chip: color,
          slot: 'chip',
          type: 'checkbox',
          class: 'cursor-pointer',
          checked: appConfig.ui.colors.neutral === color,
          onSelect: (e) => {
            e.preventDefault()

            appConfig.ui.colors.neutral = color
          }
        }))
      }]
    },
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [{
        class: 'cursor-pointer',
        label: 'Light',
        icon: 'i-lucide-sun',
        type: 'checkbox',
        checked: colorMode.value === 'light',
        onSelect(e: Event) {
          e.preventDefault()

          colorMode.preference = 'light'
        }
      }, {
        class: 'cursor-pointer',
        label: 'Dark',
        icon: 'i-lucide-moon',
        type: 'checkbox',
        checked: colorMode.value === 'dark',
        onUpdateChecked(checked: boolean) {
          if (checked) {
            colorMode.preference = 'dark'
          }
        },
        onSelect(e: Event) {
          e.preventDefault()
        }
      }]
    }
  ],
  [
    {
      label: 'Cerrar sesión',
      icon: 'i-lucide-log-out',
      class: 'cursor-pointer',
      onSelect: () => {
        clear();
        clearCookies();
        navigateTo('/auth/login');
      }
    }
  ]
]
))
</script>

<template>
  <UDropdownMenu
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
  </UDropdownMenu>
</template>
