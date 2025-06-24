<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const { currentRoute, push } = useRouter();
const userCompanies = useState<sys_companies[]>('userCompanies');
const userCompany = useState<sys_companies | undefined>('userCompany');

const userCompaniesFormatted = computed(() => {
  return [userCompanies.value.map(company => ({
    label: company.name_es_short,
    value: company.id,
    avatar: {
      src: company.avatar_url,
      alt: company.name_es
    },
    class: 'cursor-pointer',
    async onSelect() {
      userCompany.value = userCompanies.value.find(c => c.id === company.id);
      if (currentRoute.value.matched.length > 1 && currentRoute.value.matched[0]?.name) {
        await navigateTo({ name: currentRoute.value.matched[0].name, params: { company: company.id }, query: useRoute().query });
      } else {
        await push({ params: { company: company.id }, query: useRoute().query });
      }
    }
  }))]
})
</script>

<template>
  <UDropdownMenu
    :items="userCompaniesFormatted"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
    <UButton
      :label="userCompany?.name_es_short"
      :avatar="{
        src: userCompany?.avatar_url ?? undefined,
        alt: userCompany?.name_es_short
      }"
      :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
      color="neutral"
      variant="ghost"
      :square="collapsed"
      class="data-[state=open]:bg-elevated cursor-pointer"
      :class="collapsed ? 'pl-3' : undefined"
      block
      :ui="{
        trailingIcon: 'text-dimmed'
      }" />
  </UDropdownMenu>
</template>
