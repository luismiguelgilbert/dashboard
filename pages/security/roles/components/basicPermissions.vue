<script setup lang="ts">
import type { AccordionItem } from '#ui/types';
const { data } = await useLazyFetch('/api/lookups/security/roles_columns');
const { state } = useSecurityRolesForm();

const rows = computed<AccordionItem[]>(() => {
  return data.value
    ?.map((item) => {
      return {
        label: `${item.root_name_es} > ${item.page_name_es}`,
        icon: item.icon,
        data: item,
      };
    }) ?? [];
});

const getPermissionStatus = (row: any) => state.value.data?.sys_profiles_links?.some(x => x.sys_link_id === row.id);

const updatePermissionStatus = (row: any, column: any) => {
  // if adding   => add the record, add the root id if it doesn't exist,  add the parent id if it doesn't exist (**order is important**)
  // if removing => remove the record, remove the page id if no other records, remove the root id if no other records (**order is important**)
  if (state.value.data) {
    const pageId = column.id.substring(0, 4);
    const rootId = column.id.substring(0, 2);
    const isAdding = state.value.data?.sys_profiles_links?.findIndex(x => x.sys_link_id === column.id) === -1;
    if (isAdding) {
      const doesPageIdExist = state.value.data?.sys_profiles_links?.some(x => x.sys_link_id === pageId);
      const doesRootIdExist = state.value.data?.sys_profiles_links?.some(x => x.sys_link_id === rootId);
      if (!doesRootIdExist) {
        state.value.data?.sys_profiles_links?.push({ sys_link_id: rootId });
      }
      if (!doesPageIdExist) {
        state.value.data?.sys_profiles_links?.push({ sys_link_id: pageId });
      }
      state.value.data?.sys_profiles_links?.push({ sys_link_id: column.id });
    } else {
      state.value.data.sys_profiles_links = state.value.data?.sys_profiles_links?.filter(x => x.sys_link_id !== column.id);
      const shouldKeepPageId = state.value.data?.sys_profiles_links?.some(x => x.sys_link_id !== pageId && x.sys_link_id?.startsWith(pageId));
      if (!shouldKeepPageId) {
        state.value.data.sys_profiles_links = state.value.data?.sys_profiles_links?.filter(x => x.sys_link_id !== pageId);
      }
      const shouldKeepRootId = state.value.data?.sys_profiles_links?.some(x => x.sys_link_id !== rootId && x.sys_link_id?.startsWith(rootId));
      if (!shouldKeepRootId) {
        state.value.data.sys_profiles_links = state.value.data?.sys_profiles_links?.filter(x => x.sys_link_id !== rootId);
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="text-base font-semibold my-5">
      Permisos:
    </div>
    <UAccordion
      :items="rows"
      variant="ghost"
      class="items-start"
      size="xl">
      <template #item="{ item }">
        <div
          v-for="(column, index) in item.data.permissions"
          :key="index"
          class="w-full flex flex-row justify-between px-6 py-2 font-semibold">
          <span class="text-base">
            <UIcon :name="column.icon" />
            {{ column.name_es }}
          </span>
          <UToggle
            :model-value="getPermissionStatus(column)"
            @click="updatePermissionStatus(item.data, column)" />
        </div>
      </template>
    </UAccordion>
  </div>
</template>
