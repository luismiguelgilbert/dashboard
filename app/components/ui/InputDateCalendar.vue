<script setup lang="ts">
import { DateTime } from 'luxon';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import type { DateValue } from '@internationalized/date'

const props = defineProps<{
  disabled?: boolean;
  clearable?: boolean;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const model = defineModel<string>()
const calendarModel = ref<CalendarDate>();
const utcDate = ref();
const userDate = ref();
const inputDate = ref();
const { disabled, clearable } = toRefs(props);

// COMPUTED PROPERTIES
const formattedValue = computed(() => {
  if (!utcDate.value) return null;
  return DateTime.fromFormat(userDate.value, 'yyyy-MM-dd HH:mm:ssZZ').toFormat('yyyy-MM-dd');
});

// ACTIONS
const parseModelIntoValues = (newValue: string | undefined) => {
  if (!newValue) return;
  
  const parsedDate = DateTime.fromFormat(newValue, 'yyyy-MM-dd HH:mm:ssZZ');
  utcDate.value = parsedDate.toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  userDate.value = parsedDate.toLocal().toFormat('yyyy-MM-dd HH:mm:ssZZ');
  inputDate.value = formattedValue.value;
  calendarModel.value = new CalendarDate(
    parsedDate.year,
    parsedDate.month,
    parsedDate.day
  );
};
const clearValues = () => {
  utcDate.value = null;
  userDate.value = null;
  inputDate.value = null;
  calendarModel.value = undefined;
};
const updateValues = (newModelDate: CalendarDate | undefined) => {
  if (!newModelDate) return;

  const jsDate = newModelDate.toDate(getLocalTimeZone());
  utcDate.value = DateTime.fromJSDate(jsDate).toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  userDate.value = DateTime.fromJSDate(jsDate).toLocal().toFormat('yyyy-MM-dd HH:mm:ssZZ');
  formatInputDate();
};
const validateInput = () => {
  const isInputDateValid = DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').isValid;
  if (!isInputDateValid) { // If the input date is invalid, reset the values
    inputDate.value = formattedValue.value
    return;
  }

  const isInputDateSameAsUserDate = DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').equals(DateTime.fromFormat(userDate.value, 'yyyy-MM-dd HH:mm:ssZZ'));
  if (isInputDateSameAsUserDate) return;

  utcDate.value = DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  userDate.value = DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').toLocal().toFormat('yyyy-MM-dd HH:mm:ssZZ');
  calendarModel.value = new CalendarDate(
    DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').year,
    DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').month,
    DateTime.fromFormat(inputDate.value, 'yyyy-MM-dd').day
  );
};
const formatInputDate = () => inputDate.value = formattedValue.value;
const isDateDisabled = (date: DateValue) => {
  if (!userDate.value) return false;
  
  return date.day ===  DateTime.fromFormat(userDate.value, 'yyyy-MM-dd HH:mm:ssZZ').day
    && date.month === DateTime.fromFormat(userDate.value, 'yyyy-MM-dd HH:mm:ssZZ').month
    && date.year === DateTime.fromFormat(userDate.value, 'yyyy-MM-dd HH:mm:ssZZ').year;
};

// HOOKS & WATCHERS
onMounted(() => parseModelIntoValues(model.value));
watch(model, (newValue) => parseModelIntoValues(newValue));
watch(calendarModel, (newValue) => updateValues(newValue));
watch(utcDate, (newValue) => model.value = newValue);
</script>

<template>
  <div class="grid">
    <UButtonGroup
      class="w-full">
      <UInput
        v-model="inputDate"
        placeholder="AAAA-MM-DD"
        icon="i-lucide-calendar"
        inputmode="numeric"
        :disabled="disabled"
        :class="{ 'cursor-not-allowed': disabled }"
        @blur="validateInput">
        <template v-if="clearable && !disabled" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="clearValues" />
        </template>
        
      </UInput>
      <UPopover :content="{ align: 'start' }" :modal="true">
        <UButton
          :disabled="disabled"
          icon="i-lucide-calendar-search"
          variant="subtle"
          :class="{
            'cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
          }" />
        <template #content>
          <UCalendar
            v-model="calendarModel"
            fixed-weeks
            :is-date-disabled="isDateDisabled"
            :size="isMobile ? 'xs' : 'md'" />
        </template>
      </UPopover>
    </UButtonGroup>
    <!-- <br>model: {{ model }}
    <br>inputDate: {{ inputDate }}
    <br>utcDate: {{ utcDate }}
    <br>userDate: {{ userDate }}
    <br>formattedValue: {{ formattedValue }}
    <br>calendarModel: {{ calendarModel }} -->
  </div>
</template>