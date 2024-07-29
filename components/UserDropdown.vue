<script setup lang="ts">
const { sessionData } = useUserSession();
</script>

<template>
  <div class="flex flex-col w-full">
    <UButton
      label="Ajustes"
      icon="i-heroicons-cog"
      size="xl"
      variant="ghost"
      color="white"
      to="/" />
    <div class="flex min-w-0 items-center gap-3 mt-2">
      <UAvatar
        v-if="sessionData.userData?.avatar_url"
        :src="sessionData.userData.avatar_url"
        col
        size="md"
        alt="Avatar" />
      <UAvatar
        v-else-if="sessionData.userData?.user_lastname"
        :alt="sessionData.userData?.user_lastname[0]"
        size="md" />
      <div class="min-w-0 flex-auto text-base font-semibold">
        <p class="dark:text-white text-black truncate text-ellipsis">
          {{ sessionData.userData?.user_name }} {{ sessionData.userData?.user_lastname }}
        </p>
        <p class="dark:text-white text-black truncate text-xs text-ellipsis font-extralight">
          {{ sessionData.userData?.email }}
        </p>
      </div>
    </div>
  </div>
</template>
