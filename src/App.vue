<template>
  <router-view />
  <Toast ref="toastRef" />
</template>

<script setup>
import {ref, provide, watch, onMounted} from 'vue'
import Toast from './components/Toast.vue'
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useUserStore} from "@/stores/user.ts";

const toastRef = ref(null)
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const userStore=useUserStore()
// Provide toast globally
provide('toast', {
  success: (message, description) => toastRef.value?.success(message, description),
  error: (message, description) => toastRef.value?.error(message, description),
  warning: (message, description) => toastRef.value?.warning(message, description),
  info: (message, description) => toastRef.value?.info(message, description)
})

// Initialize
onMounted(async () => {
  await categoryTypeStore.fetchType('danim')
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategoryTree(type.id)
        await categoryStore.fetchCategories({typeId: type.id})
      }
    },
    {immediate: true}
)
</script>

<style scoped>
</style>
