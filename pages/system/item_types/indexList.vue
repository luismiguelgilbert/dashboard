<script setup lang="ts">
defineProps({
  rows: {
    type: Array<any>,
    required: false,
    default: () => []
  }
});
</script>

<template>
  <div class="w-full block sm:hidden">
    <ul
      role="list"
      class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="(row, index) in rows"
        :key="index"
        class="flex justify-between gap-x-6 py-5">
        <div class="flex min-w-0 gap-x-4">
          <div class="pl-2">
            <!-- <NuxtImg 
              v-if="row.avatar_url && row.avatar_url.length > 0"
              :src="row.avatar_url"
              width="15"
              height="15"
              class="ml-2 mt-1 rounded" />
            <UAvatar
              v-else
              size="xs">
              {{ row.user_name[0] }}
            </UAvatar> -->
          </div>
          <div class="min-w-0 flex-auto">
            <p class="text-sm font-semibold leading-6">
              {{ row.name_es }}
            </p>
            <!-- <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              {{ row.email }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              {{ row.sys_profile_name }}
            </p> -->
          </div>
        </div>
        <UButton
          class="ml-2"
          icon="i-heroicons-pencil-square"
          variant="link"
          color="gray"
          @click="navigateTo(`/security/users/${row.id}`)" />
      </li>
    </ul>
  </div>
</template>