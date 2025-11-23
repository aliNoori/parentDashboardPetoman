<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-seo text-orange-600"></i>
            تنظیمات عملکرد
          </h2>
          <p class="text-sm text-gray-500 mt-1">بهینه‌سازی برای موتورهای جستجو</p>
        </div>
        <button @click="savePerformanceSettings" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره تغییرات
        </button>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div class="font-bold text-gray-900">فشرده‌سازی تصاویر</div>
              <div class="text-xs text-gray-500 mt-1">بهینه‌سازی خودکار تصاویر</div>
            </div>
            <input
              v-model="settings.imageOptimization"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div class="font-bold text-gray-900">کش مرورگر</div>
              <div class="text-xs text-gray-500 mt-1">فعال‌سازی کش مرورگر</div>
            </div>
            <input
              v-model="settings.browserCache"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div class="font-bold text-gray-900">Lazy Loading</div>
              <div class="text-xs text-gray-500 mt-1">بارگذاری تنبل تصاویر</div>
            </div>
            <input
              v-model="settings.lazyLoading"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div class="font-bold text-gray-900">فشرده‌سازی CSS/JS</div>
              <div class="text-xs text-gray-500 mt-1">کاهش حجم فایل‌های استاتیک</div>
            </div>
            <input
              v-model="settings.minifyAssets"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useDanimSettingStore} from "@/stores/danim-setting.ts";
const settingStore=useDanimSettingStore()
const settings = ref({
  imageOptimization: true,
  browserCache: true,
  lazyLoading: true,
  minifyAssets: true
})

const savePerformanceSettings = async () => {
  console.log('Saving general settings:', settings.value)
  await settingStore.savePerformanceSetting(settings.value)
  alert('تنظیمات عملکرد با موفقیت ذخیره شد!')
}
onMounted(async () => {
  await settingStore.fetchPerformanceSetting()
  // پس از fetch مقداردهی
  Object.assign(settings.value, settingStore.performanceSetting)
})
</script>
