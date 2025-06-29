<script setup lang="ts">
import { DateTime } from 'luxon';
import type { MaskInputOptions } from "maska"

const props = defineProps<{
  initialDate: string; //expected format: "2025-04-29 03:56:00+00"
  disabled?: boolean;
}>();
const emit = defineEmits(['value-changed']);

const _value = ref(DateTime.fromSQL(props.initialDate).toString().slice(0, 10));

const isLeapYear = (year: number): boolean => {
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    return true;
  } else {
    return false;
  }
};

const isThirtyDaysMonth = (month: string): boolean => {
  return ['04', '06', '09', '11'].includes(month);
};

const options = computed<MaskInputOptions>(() => ({
  mask: "ABCC-Mm-Dd",
  eager: true,
  tokens: {
    // First year digit: 1,2
    A: { pattern: /[1-2]/ },
    // Second year digit: 9 (allows 19XX) or 0 (allows 20XX)
    B: { pattern: _value.value.startsWith('1') ? /[9]/ : /[0]/ },
    C: { pattern: /[0-9]/ },
    // First month digit: 0-1
    M: { pattern: /[0-1]/ },
    // Second month digit: 0-9 when first digit is 1, else 0-2
    m: { pattern: _value.value && _value.value[5] === '0' ? /[0-9]/ : /[0-2]/ },
    // First day digit: 0-3 when not February, else 0-2
    D: { pattern: (_value.value && _value.value[5] === '0' && _value.value[6] === '2') ? /[0-2]/ : /[0-3]/ },
    // d: { pattern: /[0-9]/ },
    d: {
      pattern: 
        // When first DAY digit is 0, allow 1-9
        ( _value.value && _value.value[8] === '0' ) ? /[1-9]/
        // When first DAY digit is 1, allow 0-9
        : ( _value.value && _value.value[8] === '1' ) ? /[0-9]/
        // When first DAY digit is 2 + NOT leap year + month is February, allow 0-8
        : ( _value.value && _value.value[8] === '2' && !isLeapYear(Number(_value.value.slice(0,4))) && _value.value.slice(5,7) === '02' ) ? /[0-8]/
        // When first DAY digit is 2, allow 0-9 (because previous condition already checked for February)
        : ( _value.value && _value.value[8] === '2' ) ? /[0-9]/
        // When first DAY digit is 3 + NOT isThirtyDaysMonth, allow 0
        : ( _value.value && _value.value[8] === '3' && !isThirtyDaysMonth(_value.value.slice(5,7)) ) ? /[0-1]/
        // When first DAY digit is 3 + isThirtyDaysMonth, allow 0
        : ( _value.value && _value.value[8] === '3' && isThirtyDaysMonth(_value.value.slice(5,7)) ) ? /[0]/
        // Default case: allow 0-9
        : /[0-9]/
      }
    },
  }
));

const formattedDate = computed(() => {
  const date = DateTime.fromFormat(_value.value, 'yyyy-MM-dd', { locale: 'es' });

  return date.isValid 
    ? (date.hasSame(DateTime.local(), "day")) ? 'Hoy'
      : (date.hasSame(DateTime.local().plus({ days: -1 }), "day")) ? 'Ayer'
        : date.toFormat('dd-MMM-yyyy')
    : 'Fecha incorrecta';
});

const isformattedDateValid = computed(() => {
  // const date = DateTime.fromFormat(_value.value, 'yyyy-MM-dd', { locale: 'es' });
  const date = DateTime.fromFormat(_value.value, 'yyyy-MM-dd');
  return date.isValid;
});

watch(_value, () => {
  if (isformattedDateValid.value) {
    emit('value-changed', _value.value);
  }
});
</script>

<template>
  <UButtonGroup
    class="w-full">
    <UInput
      v-model="_value"
      v-maska="options"
      :disabled="props.disabled"
      class="w-full"
      inputmode="numeric"
      icon="i-lucide-calendar"
      placeholder="AAAA-MM-DD" />
    <UButton
      :label="formattedDate"
      :color="isformattedDateValid ? 'neutral' : 'error'"
      variant="subtle" />
  </UButtonGroup>
</template>