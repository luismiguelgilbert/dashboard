<script setup lang="ts">
export interface bTabItem {
  value: string | number,
  label: string,
  icon?: string,
  slot?: string,
}
export interface bTabsProps {
  items: bTabItem[],
}

const props = defineProps({
  items: {
    type: Array<bTabItem>,
    default: () => []
  },
});
const innerValue = defineModel<string | number>(); // default modelValue

const tabClick = (tab: bTabItem) => {
  innerValue.value = tab.value;
};
</script>

<template>
  <div class="min-h-[49px] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 gap-x-4 py-0 px-1.5 overflow-x-auto">
    <div class="flex items-center justify-between flex-1 gap-x-1.5">
      <nav class="relative w-full flex items-center justify-between">
        <ul class="flex items-center min-w-0">
          <li
            v-for="item in props.items"
            :key="item.value"
            class="min-w-0 cursor-pointer"
            @click="tabClick(item)"
          >
            <a
              class="group relative w-full flex items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm
                hover:before:bg-gray-50 hover:text-gray-900 dark:hover:before:bg-gray-800/50
                focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500
                dark:focus-visible:ring-primary-400 before:absolute
                before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md 
                "
              :class="item.value === innerValue ? 'after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 after:bg-primary-500 dark:after:bg-primary-400 after:rounded-full' : undefined"
            >
              <span
                v-if="item.icon"
                :class="`${item.icon} flex-shrink-0 w-5 h-5 text-gray-700 dark:text-gray-200`"
              />
              <span class="truncate relative text-gray-700 dark:text-gray-200">
                {{ item.label }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div
    v-for="(item, index) of props.items"
    :key="index"
    class="overflow-scroll"
    :class="{'hidden': innerValue !== item.slot}">
    <slot :name="item.slot">
    </slot>
  </div>
</template>