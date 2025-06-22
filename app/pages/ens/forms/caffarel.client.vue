<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { promiseTimeout } from '@vueuse/core';
import html2canvas from 'html2canvas-pro';
import { jsPDF as JSPDF } from 'jspdf';

useHead({ title: 'ENS - Formulario P. Caffarel' });
definePageMeta({ layout: 'forms' });

useColorMode().preference = 'light';
useAppConfig().ui.colors.primary = 'blue';

const myFormHeader = useTemplateRef('myFormHeader');
const cardUI = { body: 'p-0 sm:p-0' };
const openPDF = ref<boolean>(false);
const openNewItemB = ref<boolean>(false);
const sectores = ['Sector Cuenca', 'Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E', 'Sector F', 'Sector G', 'Sector H'];
const ciudades = ['Cuenca', 'Guayaquil'];
const formData = ref<ens_form_caffarel>({
  fecha: '8 de diciembre de 2021',
  equipo: 1,
  sector: 'Sector Cuenca',
  ciudad: 'Cuenca',
  rows: [
    // { names: 'Lionel y Antonella, Messi', email: 'lionel.messi@gmail.com', amount: 100 },
    // { names: 'Ines Melina y Luis Miguel, Gilbert Cobo', email: 'luismiguelgilbert@gmail.com', amount: 15 },
    // { names: 'Gisella y Víctor, Almeida', email: 'victor.almeida@gmail.com', amount: 20 },
  ],
});
const df = new DateFormatter('es-EC', { dateStyle: 'full' });
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
const modelValue = ref(new CalendarDate(currentYear, currentMonth, currentDay));
const total = computed(() => formData.value.rows.reduce((acc, row) => acc + row.amount, 0));

const addRowB = ({ newRow, customValue }: { newRow: ens_form_caffarel_row_b; customValue: number }) => {
  const newObject = JSON.parse(JSON.stringify(newRow)) as ens_form_caffarel_row_b;
  newObject.amount = newRow.amount === 35 ? customValue : newRow.amount;
  formData.value.rows.push({
    names: `${newRow.name_wife} ${newRow.name_wife ? ' y ' : ''} ${newRow.name_husband} ${newRow.name_wife ? ' , ' : ''} ${newRow.lastname_husband} ${newRow.lastname_wife ? ' - ' : ''} ${newRow.lastname_wife}`,
    email: newRow.email,
    amount: newObject.amount,
  });
};

const downloadPDF = async () => {
  openPDF.value = true;
  await promiseTimeout(500);
  formData.value.fecha = new DateFormatter('es-EC', { dateStyle: 'medium' }).format(modelValue.value.toDate(getLocalTimeZone()));
  const myContent = myFormHeader.value as HTMLElement;
  if (myContent) {
    const A4_WIDTH = 842; // const A4_WIDTH = 3508;
    const A4_HEIGHT = 595; // const A4_HEIGHT = 2480;
    const canvas = await html2canvas(myContent, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: '#ffffff',
      height: A4_HEIGHT,
      width: A4_WIDTH,
    });

    /** print pageImg on to pdf */
    const pageImg = canvas.toDataURL('image/png', 1.0);
    const WIDTH_MARGIN = 0;
    const HEIGHT_MARGIN = -2;
    const position = HEIGHT_MARGIN;
    const pdf = new JSPDF({ orientation: 'landscape', unit: 'px', format: [A4_WIDTH, A4_HEIGHT] });
    pdf.addImage(
      pageImg,
      'PNG',
      WIDTH_MARGIN,
      position,
      A4_WIDTH,
      A4_HEIGHT,
    );
    pdf.save('FormularioCaffarel.pdf');
  }
};
</script>

<template>
  <div class="w-full flex justify-center sm:min-h-[calc(100dvh)] px-5 sm:px-0">
    <div class="pt-0 sm:pt-5">
      <UAlert
        :avatar="{
          src: '/img/caffarel.jpg'
        }"
        color="primary"
        title="ADHESIÓN A LA ASOCIACIÓN INTERNACIONAL DE APOYO  A LA CAUSA DE BEATIFICACIÓN DEL PADRE HENRI CAFFAREL" />

      <UCard
        class="mt-2 sm:mt-5"
        :ui="cardUI">
        <h2 class="text-lg font-bold p-5">
          Datos del Equipo:
        </h2>
        <UForm
          :state="formData"
          :schema="ens_form_caffarel_schema">
          <UiDashboardSection
            class="p-5"
            name="is_active"
            label="Fecha"
            hint="Día en que se entrega la contribución">
            <UPopover>
              <UButton
                variant="outline"
                icon="i-lucide-calendar"
                class="w-full"
                size="xl">
                {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
              </UButton>

              <template #content>
                <UCalendar
                  v-model="modelValue"
                  class="p-2" />
              </template>
            </UPopover>
          </UiDashboardSection>
          <UiDashboardSection
            class="p-5"
            name="is_active"
            label="Equipo"
            hint="Número de equipo">
            <UInputNumber
              v-model="formData.equipo"
              class="w-full"
              :min="1"
              :max="80" />
          </UiDashboardSection>
          <UiDashboardSection
            class="p-5"
            name="is_active"
            label="Sector"
            hint="Sector a la que pertenece el equipo">
            <USelect
              v-model="formData.sector"
              :items="sectores"
              class="w-full"
              color="primary"
              highlight />
          </UiDashboardSection>
          <UiDashboardSection
            class="p-5"
            name="is_active"
            label="Ciudad"
            hint="Ciudad a la que pertenece el equipo">
            <USelect
              v-model="formData.ciudad"
              :items="ciudades"
              class="w-full"
              color="primary"
              highlight />
          </UiDashboardSection>
        </UForm>

        <h2 class="text-lg font-bold p-5">
          Nos adherimos a la Asociación “Los amigos del Padre Caffarel” con la contribución anual:
        </h2>
        <UCard :ui="cardUI" class="mb-5 mx-5">
          <div class="flex justify-between items-center gap-2 px-4 py-3.5 overflow-x-auto">
            <UBadge :label="`Total: $${total}`" size="xl" />
            <div>
              <UButton class="cursor-pointer" icon="i-lucide-circle-plus" @click="openNewItemB = true">
                <span>Agregar</span>
              </UButton>
            </div>
          </div>
          <USeparator />

          <span
            v-if="!formData.rows.length"
            class="font-bold text-center text-sm/6 text-gray-500 p-5">
            Debe agregar registros para poder generar el PDF
          </span>

          <ul role="list" class="divide-y divide-gray-100">
            <li
              v-for="(row, index) in formData.rows"
              :key="index"
              class="flex justify-between py-2 px-5">
              <EnsFormsCaffarelListItem
                :index="index"
                :row="row"
                @remove="formData.rows = formData.rows.filter(x => x !== row)" />
            </li>
          </ul>
        </UCard>

        <template #footer>
          <UAlert
            color="error"
            variant="subtle"
            title="Este es un reporte informativo de su contribución. Recuerde entregarlo a su Hogar Responsable de Sector junto al comprobante de transferencia." />
          <UButton
            icon="i-lucide-file-pen-line"
            size="xl"
            class="h-12 w-full mt-2 cursor-pointer justify-between"
            :disabled="!formData.rows.length"
            @click="downloadPDF">
            Descargar formulario
            <UIcon name="i-lucide-file-down" class="text-2xl" />
          </UButton>
        </template>
      </UCard>
    </div>
  </div>

  <EnsFormsCaffarelListItemNew
    :key="`key-${openNewItemB}`"
    v-model:open="openNewItemB"
    @close="openNewItemB = false"
    @save="addRowB" />

  <UModal
    v-model:open="openPDF"
    title="Puede cerrar esta ventana luego de que haya descargado el archivo PDF."
    fullscreen>
    <template #body>
      <div
        id="myFormHeader"
        ref="myFormHeader"
        style="width: 842px; height: 595px;">
        <EnsFormsCaffarelForm :form-data="formData" />
      </div>
    </template>
  </UModal>
</template>
