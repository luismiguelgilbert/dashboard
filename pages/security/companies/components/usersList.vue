<script setup lang="ts">
const route = useRoute();

const { data, pending } = await useLazyFetch(`/api/security/companies/:${route.params.id}/users`);
</script>

<template>
  <SkeletonHeader v-if="pending" />
  <div
    v-else
    class="pl-6 pr-6 md:pl-2 md:pr-2 mt-4 md:mt-2">
    <div class="grid px-2 sm:px-4 content-start">
      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0 mt-4">
        <ul
          v-if="data?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(user, index) in data"
            :key="index"
            class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
            <div class="flex items-center gap-3 min-w-0">
              <div class="text-sm min-w-0">
                <div class="flex items-center gap-3">
                  <UAvatar
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    col
                    size="lg"
                    alt="Avatar" />
                  <UAvatar
                    v-else
                    :alt="user.user_lastname"
                    size="lg" />
                  <div class="text-base font-semibold dark:text-white text-black truncate">
                    {{ user.user_name }} {{ user.user_lastname }}
                    <p class="text-gray-500 dark:text-gray-400 truncate">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div
          v-else
          class="m-2">
          No hay usuarios
        </div>
      </UCard>
      <br /> <br />
    </div>
  </div>
</template>