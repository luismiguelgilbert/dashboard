<script setup lang="ts">
import type { MaskInputOptions } from "maska"

const _value = ref('');
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
</script>

<template>
  <UInput
    v-model="_value"
    v-maska="options"
    inputmode="numeric"
    icon="i-lucide-clock-3"
    placeholder="HH:MM" />
</template>