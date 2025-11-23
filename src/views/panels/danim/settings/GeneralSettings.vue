<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-settings text-orange-600"></i>
          تنظیمات عمومی
        </h2>
        <p class="text-sm text-gray-500 mt-1">تنظیمات پایه و عمومی سایت دانیم</p>
      </div>
      <button @click="saveGeneralSettings" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">
        <i class="ti ti-device-floppy ml-2"></i>
        ذخیره تغییرات
      </button>
    </div>

    <div class="space-y-6">
      <!-- Site Title -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          عنوان سایت
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="settings.siteTitle"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="دانیم - دانشنامه حیوانات خانگی"
        />
      </div>

      <!-- Site Description -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          توضیحات سایت
        </label>
        <textarea
          v-model="settings.siteDescription"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="مرجع کامل دانش و آموزش نگهداری از حیوانات خانگی"
        ></textarea>
      </div>

      <!-- Site URL -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          آدرس سایت (URL)
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="settings.siteUrl"
          type="url"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="https://danim.petoman.ir"
        />
      </div>

      <!-- Contact Email -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            ایمیل تماس
          </label>
          <input
            v-model="settings.contactEmail"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="info@danim.ir"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            شماره تماس
          </label>
          <input
            v-model="settings.contactPhone"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="021-12345678"
          />
        </div>
      </div>

      <!-- Language & Timezone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            زبان پیش‌فرض
          </label>
          <button 
            @click="toggleDropdown('language')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
          >
            <span class="text-sm">{{ settings.language || 'انتخاب زبان' }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'language' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'language'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li 
              v-for="lang in languages" 
              :key="lang.value"
              @click="selectLanguage(lang.label)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {{ lang.label }}
            </li>
          </ul>
        </div>

        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            منطقه زمانی
          </label>
          <button 
            @click="toggleDropdown('timezone')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
          >
            <span class="text-sm">{{ settings.timezone || 'انتخاب منطقه زمانی' }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'timezone' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'timezone'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <li 
              v-for="tz in timezones" 
              :key="tz.value"
              @click="selectTimezone(tz.label)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {{ tz.label }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Posts Per Page -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            تعداد مقالات در صفحه
          </label>
          <input
            v-model.number="settings.postsPerPage"
            type="number"
            min="1"
            max="50"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            حداکثر طول عنوان
          </label>
          <input
            v-model.number="settings.maxTitleLength"
            type="number"
            min="10"
            max="200"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            حداکثر طول خلاصه
          </label>
          <input
            v-model.number="settings.maxExcerptLength"
            type="number"
            min="50"
            max="500"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      <!-- Features Toggle -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">ویژگی‌ها</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-message-circle text-orange-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">نظرات</div>
                <div class="text-xs text-gray-500">فعال‌سازی سیستم نظردهی</div>
              </div>
            </div>
            <input
              v-model="settings.enableComments"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-search text-orange-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">جستجو</div>
                <div class="text-xs text-gray-500">نمایش کادر جستجو</div>
              </div>
            </div>
            <input
              v-model="settings.enableSearch"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-share-2 text-orange-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">اشتراک‌گذاری</div>
                <div class="text-xs text-gray-500">دکمه‌های اشتراک‌گذاری</div>
              </div>
            </div>
            <input
              v-model="settings.enableSharing"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-bell text-orange-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">اعلان‌ها</div>
                <div class="text-xs text-gray-500">نوتیفیکیشن برای کاربران</div>
              </div>
            </div>
            <input
              v-model="settings.enableNotifications"
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
import {computed, onMounted, ref} from 'vue'
import {useDanimSettingStore} from "@/stores/danim-setting.ts";

const openDropdown = ref(null)
const settingStore=useDanimSettingStore()

const settings = ref({
  siteTitle: 'دانیم - دانشنامه حیوانات خانگی',
  siteDescription: 'مرجع کامل دانش و آموزش نگهداری از حیوانات خانگی با مقالات تخصصی',
  siteUrl: 'https://danim.petoman.ir',
  contactEmail: 'info@danim.ir',
  contactPhone: '021-12345678',
  language: 'فارسی',
  timezone: 'تهران (UTC+3:30)',
  postsPerPage: 12,
  maxTitleLength: 100,
  maxExcerptLength: 200,
  enableComments: true,
  enableSearch: true,
  enableSharing: true,
  enableNotifications: true
})

const languages = ref([
  { value: 'fa', label: 'فارسی' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' }
])

const timezones = ref([
  { value: 'Asia/Tehran', label: 'تهران (UTC+3:30)' },
  { value: 'Asia/Dubai', label: 'دبی (UTC+4:00)' },
  { value: 'Europe/Istanbul', label: 'استانبول (UTC+3:00)' }
])

const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}

const selectLanguage = (lang) => {
  settings.value.language = lang
  openDropdown.value = null
}

const selectTimezone = (tz) => {
  settings.value.timezone = tz
  openDropdown.value = null
}
const saveGeneralSettings = async () => {
  console.log('Saving general settings:', settings.value)
  await settingStore.saveGeneralSetting(settings.value)
  alert('تنظیمات عمومی با موفقیت ذخیره شد!')
}
onMounted(async () => {
  await settingStore.fetchGeneralSetting()
  // پس از fetch مقداردهی
  Object.assign(settings.value, settingStore.generalSetting)
  console.log('setting',settings.value)
})
</script>
