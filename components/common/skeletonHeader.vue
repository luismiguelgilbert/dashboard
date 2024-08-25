<template>
  <div class="flex items-center space-x-4 w-full px-5 py-5">
    <USkeleton
      class="h-10 w-12"
      :ui="{ rounded: 'rounded-full' }" />
    <div class="space-y-2 w-full">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-11/12" />
      <USkeleton class="h-4 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>