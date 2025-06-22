<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits(['close', 'save']);

const items = [
  {
    label: 'Socio, viuda/o ó consiliario',
    description: '$15',
    id: 15,
  },
  {
    label: 'Matrimonio',
    description: '$20',
    id: 20,
  },
  {
    label: 'Socio Benefactor',
    description: 'Monto superior a $35',
    id: 35,
  },
];

const myForm = useTemplateRef('myForm');
const customValue = ref<number>(35);
const newRow = ref<ens_form_caffarel_row_b>({
  name_wife: '',
  lastname_wife: '',
  name_husband: '',
  lastname_husband: '',
  email: '',
  amount: 20,
});

const validateAndSave = async () => {
  try {
    await myForm.value?.validate();
    ens_form_caffarel_row_schema.parse(newRow.value);
    emit('save', { newRow: newRow.value, customValue: customValue.value });
  } catch (error) {
    console.error(error);
    const toast = useToast();
    toast.add({
      title: 'Error',
      description: 'Por favor revise que haya ingresado todos los datos de forma correcta',
      icon: 'i-lucide-shield-alert',
      type: 'foreground',
      color: 'error',
    });
    return;
  }
  emit('close');
};
</script>

<template>
  <UModal
    :open="props.open"
    :dismissible="false"
    fullscreen
    title="Agregar registro"
    @update:open="emit('close')">
    <template #body>
      <UForm
        ref="myForm"
        :state="newRow"
        :schema="ens_form_caffarel_row_b_schema">
        <UiDashboardSection
          class="p-5"
          name="amount"
          label="Contribución"
          hint="Valor de la contribución de la pareja/consiliario">
          <div class="flex items-end flex-wrap gap-2 lg:gap-24">
            <URadioGroup v-model="newRow.amount" value-key="id" :items="items" />
            <UInputNumber
              v-if="newRow.amount === 35"
              v-model="customValue"
              class="w-full sm:w-48"
              :min="35"
              :format-options="{
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'code',
                currencySign: 'accounting'
              }" />
          </div>
        </UiDashboardSection>
        <USeparator />
        <UiDashboardSection
          v-if="newRow.amount === 20"
          class="p-5"
          name="name_wife"
          label="Nombre de esposa"
          hint="Nombre de esposa">
          <UInput
            v-model="newRow.name_wife"
            class="w-full"
            placeholder="Antonella"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <UiDashboardSection
          v-if="newRow.amount === 20"
          class="p-5"
          name="lastname_wife"
          label="Apellido de esposa"
          hint="Apellido de esposa">
          <UInput
            v-model="newRow.lastname_wife"
            class="w-full"
            placeholder="Roccuzzo"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <USeparator />
        <UiDashboardSection
          class="p-5"
          name="name_husband"
          :label="newRow.amount === 20 ? 'Nombre de esposo' : (newRow.amount === 35 ? 'Nombre de socio benefactor' : 'Nombre de socio, viuda/o ó consiliario')"
          :hint="newRow.amount === 20 ? 'Nombre de esposo' : (newRow.amount === 35 ? 'Nombre de socio benefactor' : 'Nombre de socio, viuda/o ó consiliario')">
          <UInput
            v-model="newRow.name_husband"
            class="w-full"
            placeholder="Lionel"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <UiDashboardSection
          class="p-5"
          name="lastname_husband"
          :label="newRow.amount === 20 ? 'Apellido de esposo' : (newRow.amount === 35 ? 'Apellido de socio benefactor' : 'Apellido de socio, viuda/o ó consiliario')"
          :hint="newRow.amount === 20 ? 'Apellido de esposo' : (newRow.amount === 35 ? 'Apellido de socio benefactor' : 'Apellido de socio, viuda/o ó consiliario')">
          <UInput
            v-model="newRow.lastname_husband"
            class="w-full"
            placeholder="Messi"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator />
        <UiDashboardSection
          class="p-5"
          name="email"
          label="Correo electrónico"
          hint="Dirección de correo electrónico">
          <UInput
            v-model="newRow.email"
            class="w-full"
            placeholder="lionel.messi@gmail.com"
            icon="i-lucide-at-sign" />
        </UiDashboardSection>
      </UForm>
    </template>
    <template #footer>
      <UButton
        size="xl"
        class="h-12 w-full mt-2 cursor-pointer justify-between"
        @click="validateAndSave">
        Agregar
        <UIcon name="i-lucide-circle-plus" class="text-2xl" />
      </UButton>
    </template>
  </UModal>
</template>
