<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-palette text-orange-600"></i>
            تنظیمات ظاهر
          </h2>
          <p class="text-sm text-gray-500 mt-1">سفارشی‌سازی ظاهر و احساس سایت دانیم</p>
        </div>
        <button @click="saveAppearanceSettings" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره تغییرات
        </button>
      </div>
    </div>

    <!-- Theme Colors -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-color-swatch text-purple-600"></i>
        رنگ‌بندی تم
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">رنگ اصلی</label>
          <div class="flex gap-2">
            <input
              v-model="appearance.colors.primary"
              type="color"
              class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              v-model="appearance.colors.primary"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">رنگ ثانویه</label>
          <div class="flex gap-2">
            <input
              v-model="appearance.colors.secondary"
              type="color"
              class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              v-model="appearance.colors.secondary"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">رنگ لینک</label>
          <div class="flex gap-2">
            <input
              v-model="appearance.colors.link"
              type="color"
              class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              v-model="appearance.colors.link"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">رنگ پس‌زمینه</label>
          <div class="flex gap-2">
            <input
              v-model="appearance.colors.background"
              type="color"
              class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              v-model="appearance.colors.background"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button @click="resetColors" class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          بازگردانی به پیش‌فرض
        </button>
        <button @click="applyPreset('blue')" class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          پالت آبی
        </button>
        <button @click="applyPreset('green')" class="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          پالت سبز
        </button>
        <button @click="applyPreset('purple')" class="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          پالت بنفش
        </button>
      </div>
    </div>

    <!-- Typography -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-typography text-blue-600"></i>
        تایپوگرافی
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">فونت اصلی</label>
          <button 
            @click="toggleDropdown('fontFamily')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
          >
            <span class="text-sm">{{ appearance.typography.fontFamily }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'fontFamily' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'fontFamily'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <li 
              v-for="font in fonts" 
              :key="font"
              @click="selectFont(font)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {{ font }}
            </li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">اندازه فونت پایه</label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="appearance.typography.baseFontSize"
              type="range"
              min="12"
              max="20"
              class="flex-1"
            />
            <span class="text-sm font-bold text-gray-900 w-12">{{ appearance.typography.baseFontSize }}px</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">ارتفاع خط (Line Height)</label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="appearance.typography.lineHeight"
              type="range"
              min="1.2"
              max="2"
              step="0.1"
              class="flex-1"
            />
            <span class="text-sm font-bold text-gray-900 w-12">{{ appearance.typography.lineHeight }}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">فاصله حروف</label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="appearance.typography.letterSpacing"
              type="range"
              min="-0.05"
              max="0.1"
              step="0.01"
              class="flex-1"
            />
            <span class="text-sm font-bold text-gray-900 w-12">{{ appearance.typography.letterSpacing }}em</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout Settings -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-layout text-green-600"></i>
        تنظیمات لیآوت
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">حداکثر عرض محتوا</label>
          <div class="relative">
            <button 
              @click="toggleDropdown('maxWidth')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
            >
              <span class="text-sm">{{ appearance.layout.maxWidth }}</span>
              <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'maxWidth' ? 'rotate-180' : '']"></i>
            </button>
            <ul 
              v-if="openDropdown === 'maxWidth'"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <li 
                v-for="width in maxWidths" 
                :key="width"
                @click="selectMaxWidth(width)"
                class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
              >
                {{ width }}
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">فاصله بین بخش‌ها</label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="appearance.layout.spacing"
              type="range"
              min="16"
              max="64"
              step="8"
              class="flex-1"
            />
            <span class="text-sm font-bold text-gray-900 w-12">{{ appearance.layout.spacing }}px</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">شعاع گوشه‌ها</label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="appearance.layout.borderRadius"
              type="range"
              min="0"
              max="24"
              step="2"
              class="flex-1"
            />
            <span class="text-sm font-bold text-gray-900 w-12">{{ appearance.layout.borderRadius }}px</span>
          </div>
        </div>
      </div>

      <div class="mt-4 space-y-3">
        <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
          <div class="flex items-center gap-3">
            <i class="ti ti-layout-sidebar text-orange-600"></i>
            <div>
              <div class="font-bold text-gray-900 text-sm">نمایش سایدبار</div>
              <div class="text-xs text-gray-500">سایدبار جانبی در صفحات</div>
            </div>
          </div>
          <input
            v-model="appearance.layout.showSidebar"
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
        </label>

        <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
          <div class="flex items-center gap-3">
            <i class="ti ti-shadow text-orange-600"></i>
            <div>
              <div class="font-bold text-gray-900 text-sm">سایه کارت‌ها</div>
              <div class="text-xs text-gray-500">افزودن سایه به کارت‌ها</div>
            </div>
          </div>
          <input
            v-model="appearance.layout.cardShadow"
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
        </label>
      </div>
    </div>

    <!-- Header & Footer -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-layout-navbar text-red-600"></i>
        هدر و فوتر
      </h3>

      <div class="space-y-4">
        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">استایل هدر</label>
          <button 
            @click="toggleDropdown('headerStyle')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
          >
            <span class="text-sm">{{ appearance.header.style }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'headerStyle' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'headerStyle'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li 
              v-for="style in headerStyles" 
              :key="style.value"
              @click="selectHeaderStyle(style.label)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {{ style.label }}
            </li>
          </ul>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <span class="text-sm text-gray-700">ثابت در بالای صفحه</span>
            <input
              v-model="appearance.header.sticky"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <span class="text-sm text-gray-700">نمایش جستجو در هدر</span>
            <input
              v-model="appearance.header.showSearch"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Custom CSS -->
    <div class="bg-white rounded-xl p-6 border border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-code text-purple-600"></i>
        CSS سفارشی
      </h3>

      <textarea
        v-model="appearance.customCss"
        rows="10"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
        placeholder="/* CSS سفارشی خود را اینجا بنویسید */&#10;.custom-class {&#10;  color: #ff6600;&#10;}"
      ></textarea>
      <p class="text-xs text-gray-500 mt-2">⚠️ توجه: از CSS سفارشی با احتیاط استفاده کنید</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openDropdown = ref(null)

const appearance = ref({
  colors: {
    primary: '#f97316',
    secondary: '#fb923c',
    link: '#ea580c',
    background: '#f9fafb'
  },
  typography: {
    fontFamily: 'Vazirmatn',
    baseFontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0
  },
  layout: {
    maxWidth: '1280px',
    spacing: 32,
    borderRadius: 12,
    showSidebar: true,
    cardShadow: true
  },
  header: {
    style: 'شفاف با گرادیانت',
    sticky: true,
    showSearch: true
  },
  customCss: ''
})

const fonts = ref(['Vazirmatn', 'Yekan', 'IRANSans', 'Shabnam', 'Samim'])
const maxWidths = ref(['1024px', '1280px', '1536px', '100%'])
const headerStyles = ref([
  { value: 'transparent', label: 'شفاف با گرادیانت' },
  { value: 'solid', label: 'پس‌زمینه یکپارچه' },
  { value: 'bordered', label: 'با بوردر' }
])

const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}

const selectFont = (font) => {
  appearance.value.typography.fontFamily = font
  openDropdown.value = null
}

const selectMaxWidth = (width) => {
  appearance.value.layout.maxWidth = width
  openDropdown.value = null
}

const selectHeaderStyle = (style) => {
  appearance.value.header.style = style
  openDropdown.value = null
}

const resetColors = () => {
  appearance.value.colors = {
    primary: '#f97316',
    secondary: '#fb923c',
    link: '#ea580c',
    background: '#f9fafb'
  }
}

const applyPreset = (preset) => {
  const presets = {
    blue: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      link: '#2563eb',
      background: '#eff6ff'
    },
    green: {
      primary: '#10b981',
      secondary: '#34d399',
      link: '#059669',
      background: '#ecfdf5'
    },
    purple: {
      primary: '#a855f7',
      secondary: '#c084fc',
      link: '#9333ea',
      background: '#faf5ff'
    }
  }
  
  appearance.value.colors = presets[preset]
}

const saveAppearanceSettings = () => {
  console.log('Saving appearance settings:', appearance.value)
  alert('تنظیمات ظاهر با موفقیت ذخیره شد!')
}
</script>
