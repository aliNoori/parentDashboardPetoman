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
        <option value="1">مراقبت از سگ</option>
        <option value="2">مراقبت از گربه</option>
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
defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
