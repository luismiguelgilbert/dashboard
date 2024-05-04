<script setup lang="ts">
import { colors, darkColors } from '@/components/home/config';
import { userDataForm, type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const { state } = useSecurityUsersForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const fileRef = ref<{ input: HTMLInputElement }>();

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) { return }
  if (input.files[0].size / 1024 / 1024 > 1) { return }
  state.value.avatar = input.files[0];
  state.value.data.avatar_url = URL.createObjectURL(input.files[0]);
};

const onFileClick = () => { fileRef.value?.input.click() };

const toggleCompany = (selectedCompanyId: any) => {
  const isCompanyFound = state.value.userCompanies.some(company => company === selectedCompanyId);
  if (!isCompanyFound) {
    state.value.userCompanies.push(selectedCompanyId);
  }
};
//LOOKUP DATA
const { data: profileOptionsData, pending: pendingProfiles } = await useLazyFetch<type_sys_profiles[]>('/api/lookups/sys_profiles');
state.value.profileOptions = profileOptionsData.value?.map(p => ({ ...p, disabled: !p.is_active })) ?? [];
watch(profileOptionsData, (newData) => { if (newData?.length) { state.value.profileOptions = newData } });
</script>

<template>
  <SkeletonHeader v-if="props.loading" />
  <div v-else>
    <UForm :schema="userDataForm" :state="state.data">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
      <div class="col-span-1 sm:col-span-2 pt-1" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Email:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Correo electrónico (requerido en el inicio de sesión).
        </p>
      </div>
      <UFormGroup size="xl" name="email">
        <UInput
          v-model:model-value="state.data.email"
          placeholder="Email del Usuario"
          icon="i-heroicons-envelope"
          error
          :disabled="isEditing"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Nombres:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nombres del usuario.
        </p>
      </div>
      <UFormGroup size="xl" name="user_name">
        <UInput
          v-model:model-value="state.data.user_name"
          required
          placeholder="Nombres del Usuario"
          icon="i-heroicons-user"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Apellidos:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Apellidos del usuarios.
        </p>
      </div>
      <UFormGroup size="xl" name="user_lastname">
        <UInput
          v-model:model-value="state.data.user_lastname"
          required
          placeholder="Apellidos del Usuario"
          icon="i-heroicons-user"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>
  
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Sexo:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sexo del usuario.
        </p>
      </div>
      <UFormGroup size="xl" name="user_sex">
        <UToggle
          v-model="state.data.user_sex"
          :disabled="state.isLoading" />
        <span class="ml-5" style="vertical-align: text-bottom;">{{ state.data.user_sex ? 'Hombre' : 'Mujer' }}</span>
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Rol:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Define acceso a funcionalidades.
        </p>
      </div>
      <UFormGroup size="xl" name="sys_profile_id">
        <USelectMenu
          v-model="state.data.sys_profile_id"
          searchable
          :loading="pendingProfiles"
          searchable-placeholder="Buscar rol..."
          placeholder="Seleccionar rol..."
          icon="i-heroicons-user-circle"
          value-attribute="id"
          option-attribute="name_es"
          :options="state.profileOptions" />
      </UFormGroup>
  
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Organización preferida:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organización seleccionada al iniciar sesión.
        </p>
      </div>
      <UFormGroup size="xl" name="prefered_company_id">
        <USelectMenu
          v-model="state.data.prefered_company_id"
          searchable
          :loading="state.isLoading"
          searchable-placeholder="Buscar organización..."
          placeholder="Seleccionar organización..."
          icon="i-heroicons-building-office-2"
          value-attribute="id"
          option-attribute="name_es_short"
          :options="state.companyOptions"
          @update:model-value="toggleCompany" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Avatar:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Foto del usuario (1MB max).
        </p>
      </div>
      <UFormGroup size="xl" name="avatar_url">
        <div class="flex items-center">
          <UAvatar :src="state.data.avatar_url!" :alt="state.data.user_lastname" size="lg" />
          <UButton label="Seleccionar" color="white" size="md" @click="onFileClick" class="ml-5" />
          <UInput ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange" />
        </div>
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Tema oscuro::
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Utilizar fondo oscuro.
        </p>
      </div>
      <UFormGroup size="xl" name="dark_enabled">
        <UToggle
          v-model="state.data.dark_enabled"
          on-icon="i-heroicons-moon"
          off-icon="i-heroicons-sun"
          :disabled="state.isLoading" />
        <span class="ml-5" style="vertical-align: text-bottom;">{{ state.data.dark_enabled ? 'Oscuro' : 'Claro' }}</span>
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Tonalidad de fondo oscuro:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Al activar el fondo oscuro, se usará el tono seleccionado.
        </p>
      </div>
      <UFormGroup size="xl" name="default_dark_color">
        <USelectMenu
          v-model="state.data.default_dark_color"
          size="xl"
          icon="i-heroicons-moon"
          :options="darkColors"
          :loading="state.isLoading"/>
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Color:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Color de acentuación preferido.
        </p>
      </div>
      <UFormGroup size="xl" name="default_dark_color">
        <USelectMenu
          v-model="state.data.default_color"
          size="xl"
          icon="i-heroicons-swatch"
          :options="colors"
          :loading="state.isLoading"/>
      </UFormGroup>
      
      <UDivider v-if="isEditing" class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div v-if="isEditing">
        <p class="text-gray-900 dark:text-white font-semibold">
          Código:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Código reservado para uso del sistema.
        </p>
      </div>
      <UInput
        v-if="isEditing"
        v-model:model-value="state.data.id"
        required
        label="Código"
        size="xl"
        readonly
        placeholder="ID del Usuario"
        icon="i-heroicons-circle-stack"
        :ui="inputUI"
        :loading="state.isLoading" />
    </div>
    <br /> <br />
    </UForm>
  </div>
</template>