import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute();
  const isNotificationsSlideoverOpen = ref(false);

  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isNotificationsSlideoverOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
