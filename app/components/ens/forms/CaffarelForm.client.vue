<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import { h } from 'vue';

const props = defineProps<{
  formData: ens_form_caffarel;
}>();

const columns: TableColumn<ens_form_caffarel_row>[] = [
  { accessorKey: 'id', header: '#', cell: ({ row }) => `${row.index + 1}` },
  { accessorKey: 'names', header: 'Nombres', cell: ({ row }) => `${row.getValue('names')}` },
  { accessorKey: 'email', header: 'Correo electrónico', cell: ({ row }) => `${row.getValue('email')}` },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Total'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const label = amount === 15 ? 'Socio' : amount === 20 ? 'Matrimonio' : 'Benefactor';

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return h('div', { class: 'text-right font-bold text-[var(--ui-text-highlighted)]' }, `${label}:  ${formatted}`);
    },
  },
];
const total = computed(() => props.formData.rows.reduce((acc, row) => acc + row.amount, 0));
</script>

<template>
  <div class="p-5">
    <!-- Header -->
    <div class="grid grid-cols-12 p-5">
      <div class="col-start-1 col-span-2">
        <img src="/img/caffarel.jpg" alt="Henri Caffarel">
      </div>
      <div class="col-start-3 col-span-6 font-black pl-1">
        <p>ADHESIÓN</p>
        <p>A LA ASOCIACIÓN INTERNACIONAL DE APOYO</p>
        <p>A LA CAUSA DE BEATIFICACIÓN</p>
        <p>DEL PADRE HENRI CAFFAREL</p>
      </div>
    </div>
    <!-- Info -->
    <div class="grid grid-cols-12 px-5">
      <table class="col-start-3 col-span-8">
        <tbody>
          <tr>
            <td class="font-bold pr-1">
              Fecha:
            </td>
            <td>{{ props.formData.fecha }}</td>
            <td class="pl-24 font-bold pr-1">
              Equipo #:
            </td>
            <td>{{ props.formData.equipo }}</td>
          </tr>
          <tr>
            <td class="font-bold pr-1">
              Sector:
            </td>
            <td>{{ props.formData.sector }}</td>
            <td class="pl-24 font-bold pr-1">
              Ciudad:
            </td>
            <td>{{ props.formData.ciudad }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Details -->
    <p class="mt-5 font-bold pl-2">
      Nos adherimos a la Asociación “Los amigos del Padre Caffarel” con la contribución anual:
    </p>
    <div class="border border-neutral-200 rounded-md">
      <div class="flex-1 divide-y divide-[var(--ui-border-accented)] w-full">
        <UTable
          :columns="columns"
          :data="props.formData.rows">
          <template #names-cell="{ row }">
            <div class="flex items-center gap-3">
              <div>
                <p class="font-medium text-[var(--ui-text-highlighted)]">
                  {{ row.original.names }}
                </p>
              </div>
            </div>
          </template>
          <template #email-cell="{ row }">
            <div class="flex items-center gap-3">
              <div>
                <p class="italic text-[var(--ui-text-highlighted)]">
                  {{ row.original.email }}
                </p>
              </div>
            </div>
          </template>
        </UTable>
        <div class="px-4 py-3.5 text-sm font-bold justify-self-end">
          Total: {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total) }}
        </div>
      </div>
    </div>

    <UAlert
      class="mt-2"
      color="error"
      variant="subtle"
      title="Este es un reporte informativo de su contribución. Recuerde entregarlo a su Hogar Responsable de Sector junto al comprobante de transferencia." />
  </div>
</template>
