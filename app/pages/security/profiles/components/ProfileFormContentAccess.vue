<script setup lang="ts">
import type { TreeItem as TreeItemNode } from 'performant-array-to-tree';
import { arrayToTree } from 'performant-array-to-tree';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const headers = useRequestHeaders(['cookie']);
const moduleStore = useSecurityProfilesStore();
const { selectedRowData } = storeToRefs(moduleStore);

const {
  data: lookupSysLinks,
  isFetching: isFetchingLookupSysLinks,
} = useQuery({
  queryKey: ['lookup-sys-links'],
  queryFn: () => $fetch('/api/lookup/sys_links', { method: 'get', headers }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const items = computed<TreeItemNode[]>(() => {
  if (lookupSysLinks.value) {
    const lookupLinksFormat = lookupSysLinks.value.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.name_es,
      };
    });
    return arrayToTree(lookupLinksFormat, {
      id: 'id',
      parentId: 'parent',
      childrenField: 'children',
      dataField: null,
    });
  }
  return [];
});

const toggleLinkID = (itemID: string) => {
  if (selectedRowData.value) {
    const linkIndex = selectedRowData.value?.sys_profiles_links.findIndex(x => x === itemID);
    if (linkIndex === -1) {
      selectedRowData.value.sys_profiles_links = [...selectedRowData.value.sys_profiles_links, itemID];
    } else {
      selectedRowData.value.sys_profiles_links = selectedRowData.value.sys_profiles_links.filter(x => x !== itemID);
    }
  }
};
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Permisos"
      description="Seleccione los permisos que desea asignar al perfil" />
    <br>

    <UCard variant="subtle">
      <UForm
        v-if="selectedRowData && !isFetchingLookupSysLinks"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_profiles_schema">
        <UiDashboardSection
          name="is_active"
          label="Lista de funciones"
          vertical>
          <UTree
            :items="items"
            size="xl"
            color="primary">
            <template #item-label="{ item }">
              <div class="flex items-center gap-x-2">
                <UCheckbox
                  v-if="!item.children || item.children.length === 0"
                  :model-value="selectedRowData?.sys_profiles_links.includes(String(item.value))"
                  :disabled="props.disable"
                  @click="toggleLinkID(String(item.value))" />
                <span>{{ item.label }}</span>
              </div>
            </template>
          </UTree>
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
