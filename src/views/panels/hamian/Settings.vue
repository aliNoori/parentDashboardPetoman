<template>
  <div class="space-y-4">
    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-2 px-6 py-4 font-bold transition-all whitespace-nowrap',
            activeTab === tab.id
              ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-600'
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="space-y-4">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="space-y-4">
        <GeneralSettings />
      </div>

      <!-- SEO Settings -->
      <div v-else-if="activeTab === 'seo'" class="space-y-4">
        <SeoSettings />
      </div>

      <!-- Open Graph -->
      <div v-else-if="activeTab === 'opengraph'" class="space-y-4">
        <OpenGraphSettings />
      </div>

      <!-- Schema Markup -->
      <div v-else-if="activeTab === 'schema'" class="space-y-4">
        <SchemaSettings />
      </div>

      <!-- Appearance -->
      <div v-else-if="activeTab === 'appearance'" class="space-y-4">
        <AppearanceSettings />
      </div>

      <!-- Payment Gateway -->
      <div v-else-if="activeTab === 'payment'" class="space-y-4">
        <PaymentGatewaySettings />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GeneralSettings from './settings/GeneralSettings.vue'
import SeoSettings from './settings/SeoSettings.vue'
import OpenGraphSettings from './settings/OpenGraphSettings.vue'
import SchemaSettings from './settings/SchemaSettings.vue'
import AppearanceSettings from './settings/AppearanceSettings.vue'
import PaymentGatewaySettings from './settings/PaymentGatewaySettings.vue'

const activeTab = ref('general')

const tabs = ref([
  { id: 'general', label: 'تنظیمات عمومی', icon: 'ti ti-settings' },
  { id: 'seo', label: 'سئو', icon: 'ti ti-seo' },
  { id: 'opengraph', label: 'Open Graph', icon: 'ti ti-share' },
  { id: 'schema', label: 'Schema', icon: 'ti ti-code' },
  { id: 'appearance', label: 'ظاهر', icon: 'ti ti-palette' },
  { id: 'payment', label: 'درگاه پرداخت', icon: 'ti ti-credit-card' }
])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
