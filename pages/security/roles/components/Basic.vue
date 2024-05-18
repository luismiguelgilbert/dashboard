<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { roleDataForm } from '@/types/server/sys_profiles';
import { type type_sys_links } from '@/types/server/sys_links';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadingLinks: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const { state } = useSecurityRolesForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const form = ref();

const isSyslinkSelected = (selectedLink: type_sys_links): boolean => {
  return state.value.data.profileLinks.some(link => link.sys_link_id === selectedLink.id);
};

const toggleLink = (selectedLink: type_sys_links): void => {
  const isLinkFound = state.value.data.profileLinks.some(link => link.sys_link_id === selectedLink.id);
  if (isLinkFound) {
    state.value.data.profileLinks = state.value.data.profileLinks.filter(link => link.sys_link_id !== selectedLink.id);
  } else {
    state.value.data.profileLinks.push({ sys_link_id: selectedLink.id! });
  }
};

//LOOKUP DATA
const { data, pending } = await useLazyFetch('/api/lookups/sys_links');
state.value.syslinksOptions = data.value ?? [];
watch(data, (newData) => { state.value.syslinksOptions = newData ?? []; });

watch(() => props.saving, (newValue) => { if (newValue) { form.value.validate(); } });
</script>

<template>
  <SkeletonHeader v-if="props.loading || props.loadingLinks || pending" />
  <div v-else>
    <UForm
      ref="form"
      class="pl-6 pr-6 md:pl-2 md:pr-2 pt-4 md:pt-0"
      :schema="roleDataForm"
      :state="state.data.profileData">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
        <div class="col-span-1 sm:col-span-2 pt-1" />
        <div>
          <p class="text-gray-900 dark:text-white font-semibold">
            Perfil:
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nombre del Perfil de seguridad.
          </p>
        </div>
        <UFormGroup
          :size="inputSize"
          name="name_es">
          <UInput
            v-model:model-value="state.data.profileData.name_es"
            placeholder="Perfil del Usuario"
            icon="i-heroicons-user-circle"
            error
            :ui="inputUI"
            :loading="state.isLoading" />
        </UFormGroup>

        <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
        <div>
          <p class="text-gray-900 dark:text-white font-semibold">
            Estado:
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Estado del perfil.
          </p>
        </div>
        <UFormGroup
          :size="inputSize"
          name="is_active">
          <UToggle
            v-model="state.data.profileData.is_active"
            :disabled="state.isLoading" />
          <span
            class="ml-5"
            style="vertical-align: text-bottom;">{{ state.data.profileData.is_active ? 'Activo' : 'Inactivo' }}</span>
        </UFormGroup>

        <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
        <div>
          <p class="text-gray-900 dark:text-white font-semibold">
            Permisos:
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lista de funcionalides permitidas.
          </p>
        </div>
        <UCard
          :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
          class="min-w-0">
          <ul
            role="list"
            class="divide-y divide-gray-200 dark:divide-gray-800">
            <li
              v-for="(syslink, index) in state.syslinksOptions"
              :key="index"
              class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
              <div class="flex items-center gap-3 min-w-0">
                <div class="text-sm min-w-0">
                  <p class="text-gray-900 dark:text-white font-medium truncate">
                    {{ syslink.path }}
                  </p>
                  <p class="text-gray-500 dark:text-gray-400 truncate">
                    {{ syslink.comment_es }}
                  </p>
                </div>
              </div>
      
              <div class="flex items-center gap-3">
                <UToggle
                  :model-value="isSyslinkSelected(syslink)"
                  :disabled="state.isLoading"
                  @update:model-value="toggleLink(syslink)" />
              </div>
            </li>
          </ul>
        </UCard>
        <br /> <br />
      </div>
      <br /> <br />
    </UForm>
  </div>
</template>