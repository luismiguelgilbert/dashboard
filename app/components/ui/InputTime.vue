<script setup lang="ts">
import { DateTime } from 'luxon';
import type { MaskInputOptions } from "maska"

const props = defineProps<{
  initialDate: string; //expected format: "2025-04-29 03:56:00+00"
  disabled?: boolean;
}>();
const emit = defineEmits(['value-changed']);

const _value = ref(DateTime.fromSQL(props.initialDate).toString().slice(11, 16));

const options = computed<MaskInputOptions>(() => ({
  mask: "Hh:Mm",
  eager: true,
  tokens: {
    // First hour digit: 0, 1, 2
    H: { pattern: /[0-2]/ },
    // Second hour digit: 0-3 if first digit is 2, else 0-9
    h: { pattern: _value.value.startsWith('2') ? /[0-3]/ : /[0-9]/ },
    // First minute digit: 0-5
    M: { pattern: /[0-5]/ },
    // Second minute digit: 0-9
    m: { pattern: /[0-9]/ }
  }
}));

const isformattedTimeValid = computed(() => _value.value.length === 5);

watch(_value, () => {
  if (isformattedTimeValid.value) {
    emit('value-changed', _value.value);
  }
});
</script>

<template>
  <UFieldGroup class="w-full">
    <UInput
      v-model="_value"
      v-maska="options"
      :disabled="props.disabled"
      class="w-full"
      inputmode="numeric"
      icon="i-lucide-clock-3"
      placeholder="HH:MM" />
      <UButton
      :label="!isformattedTimeValid ? 'Hora incorrecta' : undefined"
      icon="i-lucide-circle-check"
      :color="isformattedTimeValid ? 'neutral' : 'error'"
      variant="subtle" />
  </UFieldGroup>
</template>