<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-settings text-rose-600"></i>
          تنظیمات عمومی
        </h2>
        <p class="text-sm text-gray-500 mt-1">تنظیمات پایه و عمومی سیستم حامیان</p>
      </div>
      <button @click="saveGeneralSettings" class="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-bold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg">
        <i class="ti ti-device-floppy ml-2"></i>
        ذخیره تغییرات
      </button>
    </div>

    <div class="space-y-6">
      <!-- Site Title -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          عنوان سیستم
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="settings.siteTitle"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="حامیان - سیستم مدیریت حامیان و کمک‌ها"
        />
      </div>

      <!-- Site Description -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          توضیحات سیستم
        </label>
        <textarea
          v-model="settings.siteDescription"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="سیستم جامع مدیریت حامیان، قرارهای مهربانی و کمک‌های مالی"
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
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="https://hamian.petoman.ir"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            placeholder="support@hamian.ir"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            شماره تماس
          </label>
          <input
            v-model="settings.contactPhone"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right"
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
              class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right"
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
              class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
            >
              {{ tz.label }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Items Per Page -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            تعداد قرارها در صفحه
          </label>
          <input
            v-model.number="settings.projectsPerPage"
            type="number"
            min="1"
            max="50"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            تعداد حامیان در صفحه
          </label>
          <input
            v-model.number="settings.supportersPerPage"
            type="number"
            min="1"
            max="100"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            تعداد کمک‌ها در صفحه
          </label>
          <input
            v-model.number="settings.donationsPerPage"
            type="number"
            min="10"
            max="200"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          />
        </div>
      </div>

      <!-- Features Toggle -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">ویژگی‌ها</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-mail text-rose-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">ایمیل خودکار</div>
                <div class="text-xs text-gray-500">ارسال ایمیل به حامیان</div>
              </div>
            </div>
            <input
              v-model="settings.enableEmailNotifications"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-message text-rose-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">پیامک</div>
                <div class="text-xs text-gray-500">ارسال پیامک به حامیان</div>
              </div>
            </div>
            <input
              v-model="settings.enableSmsNotifications"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-file-invoice text-rose-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">رسید خودکار</div>
                <div class="text-xs text-gray-500">صدور رسید پس از کمک</div>
              </div>
            </div>
            <input
              v-model="settings.enableAutoReceipt"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>

          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-report text-rose-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">گزارش‌های دوره‌ای</div>
                <div class="text-xs text-gray-500">ارسال گزارش به مدیران</div>
              </div>
            </div>
            <input
              v-model="settings.enablePeriodicReports"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useSettingStore} from "@/stores/setting.ts";

const openDropdown = ref(null)

const settings = ref({
  siteTitle: 'حامیان - سیستم مدیریت حامیان و کمک‌ها',
  siteDescription: 'سیستم جامع مدیریت حامیان، قرارهای مهربانی و کمک‌های مالی',
  siteUrl: 'https://hamian.petoman.ir',
  contactEmail: 'support@hamian.ir',
  contactPhone: '021-12345678',
  language: 'فارسی',
  timezone: 'تهران (UTC+3:30)',
  projectsPerPage: 12,
  supportersPerPage: 20,
  donationsPerPage: 50,
  enableEmailNotifications: true,
  enableSmsNotifications: true,
  enableAutoReceipt: true,
  enablePeriodicReports: true
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
const settingStore=useSettingStore()
const saveGeneralSettings = async () => {

  await settingStore.saveGeneralSetting(settings.value)
  alert('تنظیمات عمومی با موفقیت ذخیره شد!')
}

onMounted(async () => {
  await settingStore.fetchGeneralSetting()
  // پس از fetch مقداردهی

  Object.assign(settings.value, settingStore.generalSetting)
})
</script>
