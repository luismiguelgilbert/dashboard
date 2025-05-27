<script setup lang="ts">
import imageCompression from 'browser-image-compression';

const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityCompaniesStore();
const { selectedRowData, selectedRowDataAvatarHelper } = storeToRefs(moduleStore);
const myFile = ref();
const myImagePreview = ref();
const avatarComponent = useTemplateRef('avatarComponent');

async function onFileChange(e: Event) {
  try {
    const inputElement: HTMLInputElement = e.target as HTMLInputElement;
    if (!(inputElement).files?.length) {
      throw new Error('No se seleccionó archivo.');
    }
    if (inputElement.files[0]) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false,
      };
      try {
        const compressedFile = await imageCompression(inputElement.files[0], options);

        if (compressedFile.size / 1024 / 1024 > 1) {
          throw new Error('Tamaño incorrecto.');
        }
        if (compressedFile && selectedRowData.value) {
          selectedRowDataAvatarHelper.value = compressedFile;
          myImagePreview.value = URL.createObjectURL(compressedFile);
        }
      } catch (error) {
        console.error(error);
        useToast().add({
          title: `Error al cargar archivo: ${error}`,
          icon: 'i-hugeicons-settings-error-01',
          color: 'error',
        });
      }
    }
  } catch (error) {
    useToast().add({
      title: `Error al cargar archivo: ${error}`,
      icon: 'i-hugeicons-settings-error-01',
      color: 'error',
    });
  }
}
onUpdated(() => myFile.value = undefined /* Prevent UInput error when compontent is updated after save */);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-1 md:m-6">
    <div class="pb-2 md:pb-5">
      <p class="font-bold pb-0 text-xl">
        Avatar de la Organización
      </p>
      <p class="text-(--ui-text-muted)">
        Imagen de perfil de la organización
      </p>
    </div>
    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_companies_schema">
        <UiDashboardSection
          class="p-5"
          name="avatar_url"
          label="Avatar"
          hint="Tamaño máximo permitido: 1mb">
          <template #hint-content>
            <UButton
              icon="i-lucide-folder-open"
              class="cursor-pointer mt-5"
              :disabled="props.disable"
              label="Seleccionar archivo"
              @click="avatarComponent?.$el.firstChild.click()" />
            <UInput
              ref="avatarComponent"
              v-model="myFile"
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              class="hidden"
              @change="onFileChange" />
          </template>
          <div class="w-full justify-items-center">
            <div class="max-w-48 max-h-48">
              <img v-if="myImagePreview" :src="myImagePreview">
              <img v-else-if="selectedRowData.avatar_url" :src="selectedRowData.avatar_url">
            </div>
          </div>
        </UiDashboardSection>
      </UForm>
    </UCard>
  </div>
</template>
