<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تنظیمات سایت</h1>
        <p class="text-gray-600 mt-1">تنظیمات کامل سایت، سئو و صفحه اصلی</p>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="flex overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2',
            activeTab === tab.id
              ? 'bg-orange-50 text-orange-600 border-orange-600'
              : 'text-gray-600 hover:bg-gray-50 border-transparent'
          ]"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="space-y-6">
      <GeneralSettings v-if="activeTab === 'general'" />
      <PageBuilderSettings v-else-if="activeTab === 'homepage'" />
      <SeoSettings v-else-if="activeTab === 'seo'" />
      <OpenGraphSettings v-else-if="activeTab === 'opengraph'" />
      <SchemaSettings v-else-if="activeTab === 'schema'" />
      <PerformanceSettings v-else-if="activeTab === 'performance'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GeneralSettings from './settings/GeneralSettings.vue'
import PageBuilderSettings from './settings/PageBuilderSettings.vue'
import SeoSettings from './settings/SeoSettings.vue'
import OpenGraphSettings from './settings/OpenGraphSettings.vue'
import SchemaSettings from './settings/SchemaSettings.vue'
import PerformanceSettings from './settings/PerformanceSettings.vue'

// Import کامپوننت‌های داخلی صفحه‌ساز نیاز نیست چون توسط PageBuilderSettings import میشن

const activeTab = ref('general')

const tabs = ref([
  { id: 'general', label: 'عمومی', icon: 'ti ti-settings' },
  { id: 'homepage', label: 'صفحه اصلی', icon: 'ti ti-home' },
  { id: 'seo', label: 'سئو', icon: 'ti ti-search' },
  { id: 'opengraph', label: 'Open Graph', icon: 'ti ti-share' },
  { id: 'schema', label: 'Schema', icon: 'ti ti-code' },
  { id: 'performance', label: 'عملکرد', icon: 'ti ti-speedboat' }
])

const saveSettings = () => {
  console.log('Saving all settings...')
  alert('تنظیمات با موفقیت ذخیره شد!')
}

const resetSettings = () => {
  if (confirm('آیا از بازنشانی تمام تنظیمات اطمینان دارید؟')) {
    console.log('Resetting settings...')
    alert('تنظیمات بازنشانی شد!')
  }
}
</script>

<style scoped>
.btn-primary {
  background-color: #f97316;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background-color: #ea580c;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
