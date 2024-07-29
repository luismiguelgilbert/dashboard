<script setup lang="ts">
import { type type_sys_companies } from '@/types/server/lookups/security_sys_companies';
const { state } = useSecurityUsersForm();

const { data, pending } = await useLazyFetch('/api/lookups/security/sys_companies');

const makeDefault = (company: type_sys_companies) => {
  if (state.value.data) {
    if (!state.value.data.sys_companies_users) {
      state.value.data.sys_companies_users = [];
    }
    state.value.data.sys_companies_users = state.value.data.sys_companies_users.map(x => {return {...x, is_default: false};});

    const isAdded = state.value.data.sys_companies_users.some(x => x.sys_company_id === company.id);
    if (!isAdded) {
      state.value.data.sys_companies_users.push({
        sys_company_id: company.id,
        is_default: true,
      });
    } else {
      state.value.data.sys_companies_users = state.value.data.sys_companies_users.map(x => {
        if (x.sys_company_id === company.id) {
          x.is_default = true;
        } else {
          x.is_default = false;
        }
        return x;
      });
    }
  }
};

const toggleCompany = (company: type_sys_companies) => {
  if (state.value.data) {
    if (!state.value.data.sys_companies_users) {
      state.value.data.sys_companies_users = [];
    }
    const isAdded = state.value.data.sys_companies_users.some(x => x.sys_company_id === company.id);
    if (!isAdded) {
      state.value.data.sys_companies_users.push({
        sys_company_id: company.id,
        is_default: state.value.data.sys_companies_users.length > 0 ? false : true,
      });
    } else {
      state.value.data.sys_companies_users = state.value.data.sys_companies_users.filter(x => x.sys_company_id !== company.id);
    }
  }
};
</script>

<template>
  <SkeletonHeader v-if="pending" />
  <div
    v-else
    class="pl-6 pr-6 md:pl-2 md:pr-2 mt-4 md:mt-2">
    <div class="grid px-2 sm:px-4 content-start">
      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0 mt-2 overflow-x-hidden">
        <ul
          v-if="data?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(company, index) in data"
            :key="index"
            class="flex w-full justify-around gap-3 py-3 px-4 sm:px-6">
            <!--max-w-[65%]-->
            <div class="min-w-[60%] sm:min-w-[70%] text-left">
              <div class="flex">
                <UAvatar 
                  v-if="company.avatar_url && company.avatar_url.length > 0"
                  :src="company.avatar_url"
                  size="lg"
                  class="mr-3 rounded" />
                <UAvatar
                  v-else-if="company.name_es_short"
                  size="lg"
                  class="mr-3">
                  {{ company.name_es_short[0] }}
                </UAvatar>
                <div class="text-base font-semibold dark:text-white text-black truncate text-ellipsis">
                  {{ company.name_es_short }}
                  <p class="text-gray-500 dark:text-gray-400 truncate">
                    {{ company.name_es }}
                  </p>
                </div>
              </div>
            </div>
            <span class="min-w-[40%] sm:min-w-[30%] text-center sm:text-right">
              <UButton
                icon="i-heroicons-check-circle"
                size="sm"
                :color="state.data?.sys_companies_users?.some(x => x.sys_company_id === company.id && x.is_default) ? 'primary' : 'gray'"
                variant="solid"
                label="Default"
                class="pr-4 mr-3"
                @click="makeDefault(company)" />
              <UToggle
                :model-value="state.data?.sys_companies_users?.some(x => x.sys_company_id === company.id)"
                class="mt-4 mr-1 sm:mr-4"
                @click="toggleCompany(company)" />
            </span>
          </li>
        </ul>
      </UCard>
      <br /> <br />
    </div>
  </div>
</template>