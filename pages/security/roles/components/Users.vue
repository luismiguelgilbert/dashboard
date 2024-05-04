<script setup lang="ts">
const { state } = useSecurityRolesForm();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Usuarios:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Lista de usuarios que tienen este perfil de seguridad.
      </p>
    </div>
  
    <UCard :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }" class="min-w-0">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
        <li v-for="(user, index) in state.profileUsers" :key="index" class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
          <div class="flex items-center gap-3 min-w-0">
            <div class="text-sm min-w-0">
              <div class="flex items-center gap-3">
                <NuxtImg 
                  v-if="user.avatar_url && user.avatar_url.length > 0"
                  :src="user.avatar_url"
                  width="20"
                  height="15"
                  class="mt-1 rounded" />
                <UAvatar
                  v-else
                  size="xs">
                  {{ user.user_name[0] }}
                </UAvatar>
                <div class="text-base font-semibold dark:text-white text-black">
                  {{ `${user.user_name} ${user.user_lastname}` }}
                  <p class="text-gray-500 dark:text-gray-400 truncate">
                    {{ user.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </UCard>
  </div>
</template>