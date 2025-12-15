<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-2">تیتر بخش</label>
      <input v-model="section.data.title" type="text" class="input-field" placeholder="آخرین مقالات">
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">دسته‌بندی</label>
      <select v-model="section.data.categoryId" class="input-field">
        <option value="">همه</option>
        <option
            v-for="cat in availableCategories"
            :key="cat.id"
            :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">تعداد پست</label>
      <input v-model.number="section.data.count" type="number" class="input-field" placeholder="6">
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">نمایش</label>
      <select v-model="section.data.layout" class="input-field">
        <option value="grid">شبکه‌ای</option>
        <option value="list">لیستی</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, watch} from "vue";

defineProps({
  section: {
    type: Object,
    required: true
  }
})

import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";

const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()

// دسته‌بندی‌های داینامیک
const availableCategories = computed(() =>
    categoryStore.categories.map(cat => ({
      id: cat.id,
      name: cat.title,
      icon: cat.logo || 'ti ti-folder',
      count: cat.posts?.length || 0
    }))
)

onMounted(async () => {
  await categoryTypeStore.fetchType('post')
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id, contentType: 'danim'})
      }
    },
    {immediate: true}
)
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
