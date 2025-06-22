<script setup lang="ts">
import imageCompression from 'browser-image-compression';

const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityCompaniesStore();
const { selectedRowData } = storeToRefs(moduleStore);
const myFile = ref();
const myImagePreview = ref();
const isProcessing = ref(false);
const avatarComponent = useTemplateRef('avatarComponent');

const onFileChange = async (e: Event) => {
  try {
    isProcessing.value = true;
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
          selectedRowData.value.avatar_file = await filetoBase64(compressedFile);
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
    isProcessing.value = false;
  } catch (error) {
    isProcessing.value = false;
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
    class="m-4 md:m-6">
    <UPageFeature
      title="Avatar de la Organización"
      description="Imagen de perfil de la organización" />
    <br>

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
              :loading="isProcessing"
              label="Seleccionar archivo"
              size="xl"
              @click="avatarComponent?.inputRef?.click()" />
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
