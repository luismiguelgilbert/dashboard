<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

const { isNotificationsSlideoverOpen } = useDashboard();
const selectedTab = ref<'basic' | 'permissions' | 'password'>('basic');
const tabs = ref<TabsItem[]>([
  { value: 'basic', icon: 'i-lucide-user', label: 'Datos del Usuario' },
  { value: 'permissions', icon: 'i-lucide-building-2', label: 'Permisos' },
  { value: 'password', icon: 'i-lucide-rectangle-ellipsis', label: 'Contraseña' }
]);
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Mi configuración">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true">
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <UTabs
        v-model="selectedTab"
        :unmount-on-hide="false"
        :items="tabs"
        color="neutral"
        variant="link"
        class="w-full mt-1.5" />
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <template v-if="selectedTab === 'basic'">
          <SettingsBasicForm />
        </template>
        <template v-if="selectedTab === 'permissions'">
          <SettingsOrganizations />
        </template>
        <template v-if="selectedTab === 'password'">
          <SettingsSecurity />
        </template>
      </div>
    </template>
  </UDashboardPanel>
</template>
