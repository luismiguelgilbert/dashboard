<script setup lang="ts">
const { sessionData } = useUserSession()
const supabase = useSupabaseClient()

const items = computed(() => [
  [
    {
      slot: 'account',
      to: '/'
    }
  ],
  [
    {
      label: 'Cerrar sesión',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      click: () => logout()
    }
  ]
])

const logout = async () => {
  await supabase.auth.signOut()
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  await navigateTo('/auth/login')
  //Reset state
  sessionData.value.userData = null;
  sessionData.value.userCompanies = null;
  sessionData.value.userMenuData = null;
}
</script>

<template>
  <UDropdown mode="hover" :items="items" :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }" :popper="{ strategy: 'absolute', placement: 'top' }" class="w-full">
    <template #default="{ open }">
      <UButton color="gray" variant="ghost" class="w-full" :label="sessionData.userData?.user_name" :class="[open && 'bg-gray-50 dark:bg-gray-800']">
        <template #leading>
          <NuxtImg v-if="sessionData.userData?.avatar_url" :src="sessionData.userData.avatar_url" width="15" height="15" class="rounded" />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p class="font-extralight">
          Usuario:
        </p>
        <p class="truncate font-semibold text-gray-900 dark:text-white">
          {{ sessionData.userData?.email }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
