<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-palette text-rose-600"></i>
            تنظیمات ظاهر
          </h2>
          <p class="text-sm text-gray-500 mt-1">مدیریت لوگو و برندینگ سیستم حامیان</p>
        </div>
        <button @click="saveAppearanceSettings" class="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-bold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره تغییرات
        </button>
      </div>
    </div>

    <!-- Logo & Favicon Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Logo -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">لوگوی اصلی</label>
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-rose-500 transition-colors cursor-pointer h-40 flex items-center justify-center"
            @click="$refs.logoInput.click()"
        >
          <input
              type="file"
              ref="logoInput"
              accept="image/png,image/jpeg"
              class="hidden"
              @change="handleImageUpload($event, 'logo')"
          />

          <template v-if="appearance.logo">
            <img
                :src="appearance.logo"
                alt="لوگو"
                class="w-full h-full object-cover rounded-lg"
            />
          </template>

          <template v-else>
            <div>
              <i class="ti ti-upload text-4xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-600">کلیک کنید یا فایل را بکشید</p>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG (حداکثر 2MB)</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Favicon -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">فاویکون</label>
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-rose-500 transition-colors cursor-pointer h-40 flex items-center justify-center"
            @click="$refs.faviconInput.click()"
        >
          <input
              type="file"
              ref="faviconInput"
              accept="image/png,image/x-icon"
              class="hidden"
              @change="handleImageUpload($event, 'favicon')"
          />

          <template v-if="appearance.favicon">
            <img
                :src="appearance.favicon"
                alt="فاویکون"
                class="w-full h-full object-cover rounded-lg"
            />
          </template>

          <template v-else>
            <div>
              <i class="ti ti-upload text-4xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-600">کلیک کنید یا فایل را بکشید</p>
              <p class="text-xs text-gray-400 mt-1">ICO, PNG (32x32px)</p>
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- Meta Theme Color -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-color-swatch text-purple-600"></i>
        رنگ متا (Meta Theme Color)
      </h3>

      <div class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-2">
            <i class="ti ti-info-circle text-blue-600 ml-1"></i>
            رنگ متا برای نمایش در مرورگرهای موبایل و PWA استفاده می‌شود. این رنگ در نوار آدرس مرورگر و صفحه اسپلش نمایش داده می‌شود.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">رنگ تم (Light Mode)</label>
            <div class="flex gap-2">
              <input
                v-model="appearance.metaThemeColor"
                type="color"
                class="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div class="flex-1">
                <input
                  v-model="appearance.metaThemeColor"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="#e11d48"
                />
                <p class="text-xs text-gray-500 mt-2">
                  پیش‌فرض: #e11d48 (صورتی)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">رنگ تم (Dark Mode)</label>
            <div class="flex gap-2">
              <input
                v-model="appearance.metaThemeColorDark"
                type="color"
                class="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div class="flex-1">
                <input
                  v-model="appearance.metaThemeColorDark"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="#1f2937"
                />
                <p class="text-xs text-gray-500 mt-2">
                  پیش‌فرض: #1f2937 (خاکستری تیره)
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h4 class="text-sm font-bold text-gray-700 mb-3">پیش‌نمایش</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-600 mb-2">حالت روشن (Light)</p>
              <div class="relative rounded-lg overflow-hidden border-2 border-gray-300">
                <div
                  class="h-8 flex items-center justify-center text-white text-xs font-bold"
                  :style="{ backgroundColor: appearance.metaThemeColor }"
                >
                  نوار مرورگر موبایل
                </div>
                <div class="bg-white p-4">
                  <div class="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-xs">
                    محتوای صفحه
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-600 mb-2">حالت تاریک (Dark)</p>
              <div class="relative rounded-lg overflow-hidden border-2 border-gray-700">
                <div
                  class="h-8 flex items-center justify-center text-white text-xs font-bold"
                  :style="{ backgroundColor: appearance.metaThemeColorDark }"
                >
                  نوار مرورگر موبایل
                </div>
                <div class="bg-gray-900 p-4">
                  <div class="w-full h-20 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs">
                    محتوای صفحه
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Presets -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">پالت‌های پیش‌فرض</label>
          <div class="flex flex-wrap gap-2">
            <button
              @click="applyColorPreset('rose')"
              class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transition-all"
            >
              صورتی
            </button>
            <button
              @click="applyColorPreset('purple')"
              class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 transition-all"
            >
              بنفش
            </button>
            <button
              @click="applyColorPreset('blue')"
              class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              آبی
            </button>
            <button
              @click="applyColorPreset('green')"
              class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              سبز
            </button>
            <button
              @click="applyColorPreset('orange')"
              class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all"
            >
              نارنجی
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useSettingStore} from "@/stores/setting.ts";

const appearance = ref({
  logo: '',
  favicon: '',
  metaThemeColor: '#e11d48',      // rose-600
  metaThemeColorDark: '#1f2937'   // gray-800
})

const applyColorPreset = (preset) => {
  const presets = {
    rose: {
      light: '#e11d48',
      dark: '#1f2937'
    },
    purple: {
      light: '#9333ea',
      dark: '#1f2937'
    },
    blue: {
      light: '#2563eb',
      dark: '#1e293b'
    },
    green: {
      light: '#059669',
      dark: '#1f2937'
    },
    orange: {
      light: '#ea580c',
      dark: '#1f2937'
    }
  }

  if (presets[preset]) {
    appearance.value.metaThemeColor = presets[preset].light
    appearance.value.metaThemeColorDark = presets[preset].dark
  }
}
const handleImageUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return

  // محدودیت حجم
  if (file.size > 2 * 1024 * 1024) {
    alert('حجم فایل نباید بیشتر از 2MB باشد')
    return
  }

  const reader = new FileReader()
  reader.onload = e => {
    appearance.value[type] = e.target.result
  }
  reader.readAsDataURL(file)
}
const settingStore=useSettingStore()
const saveAppearanceSettings = async () => {
  console.log('Saving appearance settings:', appearance.value)
  await settingStore.saveAppearanceSetting(appearance.value)
  alert('تنظیمات ظاهر با موفقیت ذخیره شد!')
}

onMounted(async () => {
  await settingStore.fetchAppearanceSetting()
  // پس از fetch مقداردهی
  Object.assign(appearance.value, settingStore.appearanceSetting)
})
</script>
