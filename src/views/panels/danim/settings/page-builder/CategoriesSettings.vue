<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2">
      <label class="block text-sm font-medium mb-2">تیتر بخش</label>
      <input v-model="section.data.title" type="text" class="input-field" placeholder="دسته‌بندی‌ها">
    </div>
    
    <!-- Category Selection -->
    <div class="col-span-2">
      <label class="block text-sm font-medium mb-2">انتخاب دسته‌بندی‌ها</label>
      <div class="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
        <label class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
          <input
            type="checkbox"
            :checked="section.data.selectedCategories.length === 0"
            @change="section.data.selectedCategories = []"
            class="rounded ml-2"
          />
          <span class="font-medium">همه دسته‌بندی‌ها</span>
        </label>
        <div class="border-t pt-2 space-y-1">
          <label
            v-for="category in categories"
            :key="category.id"
            class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              :value="category.id"
              v-model="section.data.selectedCategories"
              class="rounded ml-2"
            />
            <i :class="category.icon" class="text-lg ml-2"></i>
            <span>{{ category.name }}</span>
            <span class="mr-auto text-sm text-gray-500">({{ category.count }} مقاله)</span>
          </label>
        </div>
      </div>
      <p class="text-xs text-gray-600 mt-2">
        {{ section.data.selectedCategories.length > 0 
          ? `${section.data.selectedCategories.length} دسته‌بندی انتخاب شده` 
          : 'همه دسته‌بندی‌ها نمایش داده می‌شوند' }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">حداکثر تعداد نمایش</label>
      <input v-model.number="section.data.count" type="number" min="1" max="20" class="input-field" placeholder="6">
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-2">نمایش</label>
      <select v-model="section.data.layout" class="input-field">
        <option value="grid">شبکه‌ای</option>
        <option value="slider">اسلایدر</option>
        <option value="list">لیستی</option>
      </select>
    </div>

    <div class="col-span-2">
      <label class="flex items-center text-sm">
        <input v-model="section.data.showCount" type="checkbox" class="rounded ml-2" />
        نمایش تعداد مقالات هر دسته
      </label>
    </div>

    <div class="col-span-2">
      <label class="flex items-center text-sm">
        <input v-model="section.data.showDescription" type="checkbox" class="rounded ml-2" />
        نمایش توضیحات دسته‌بندی
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  section: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
