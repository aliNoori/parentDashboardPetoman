<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-seo text-rose-600"></i>
          تنظیمات سئو (SEO)
        </h2>
        <p class="text-sm text-gray-500 mt-1">بهینه‌سازی برای موتورهای جستجو</p>
      </div>
      <button @click="saveSeoSettings" class="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-bold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg">
        <i class="ti ti-device-floppy ml-2"></i>
        ذخیره تغییرات
      </button>
    </div>

    <div class="space-y-6">
      <!-- Meta Title -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          عنوان متا (Meta Title)
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="seo.metaTitle"
          type="text"
          maxlength="60"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="حامیان - سیستم مدیریت حامیان و کمک‌ها"
        />
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-gray-500">حداکثر 60 کاراکتر برای بهینه بودن در گوگل</p>
          <span class="text-xs" :class="seo.metaTitle.length > 60 ? 'text-red-600' : 'text-gray-500'">
            {{ seo.metaTitle.length }}/60
          </span>
        </div>
      </div>

      <!-- Meta Description -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          توضیحات متا (Meta Description)
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="seo.metaDescription"
          rows="3"
          maxlength="160"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="سیستم جامع مدیریت حامیان، قرارهای مهربانی و کمک‌های مالی برای حمایت از حیوانات"
        ></textarea>
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-gray-500">حداکثر 160 کاراکتر برای نمایش کامل در نتایج جستجو</p>
          <span class="text-xs" :class="seo.metaDescription.length > 160 ? 'text-red-600' : 'text-gray-500'">
            {{ seo.metaDescription.length }}/160
          </span>
        </div>
      </div>

      <!-- Meta Keywords -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          کلمات کلیدی (Meta Keywords)
        </label>
        <input
          v-model="seo.metaKeywords"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="حامیان، کمک خیریه، قرار مهربانی، حمایت از حیوانات"
        />
        <p class="text-xs text-gray-500 mt-1">کلمات را با ویرگول جدا کنید</p>
      </div>

      <!-- Canonical URL -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          URL کانونیکال (Canonical URL)
        </label>
        <input
          v-model="seo.canonicalUrl"
          type="url"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="https://hamian.petoman.ir"
        />
        <p class="text-xs text-gray-500 mt-1">URL اصلی برای جلوگیری از محتوای تکراری</p>
      </div>

      <!-- Robots Meta -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Robots Meta
          </label>
          <div class="relative">
            <button 
              @click="toggleDropdown('robots')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right"
            >
              <span class="text-sm">{{ seo.robots }}</span>
              <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'robots' ? 'rotate-180' : '']"></i>
            </button>
            <ul 
              v-if="openDropdown === 'robots'"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <li 
                v-for="robot in robotsOptions" 
                :key="robot"
                @click="selectRobots(robot)"
                class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
              >
                {{ robot }}
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            فهرست‌نویسی
          </label>
          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
            <input
              v-model="seo.allowIndexing"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <span class="mr-3 text-sm text-gray-700">اجازه فهرست‌نویسی به موتورهای جستجو</span>
          </label>
        </div>
      </div>

      <!-- Sitemap -->
      <div class="border border-rose-200 rounded-lg p-4 bg-rose-50">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-sitemap text-rose-600"></i>
          نقشه سایت (Sitemap)
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">URL نقشه سایت</label>
            <input
              v-model="seo.sitemapUrl"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm bg-white"
              placeholder="https://hamian.petoman.ir/sitemap.xml"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">فرکانس به‌روزرسانی</label>
            <div class="relative">
              <button 
                @click="toggleDropdown('changefreq')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right bg-white"
              >
                <span class="text-sm">{{ seo.changefreq }}</span>
                <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'changefreq' ? 'rotate-180' : '']"></i>
              </button>
              <ul 
                v-if="openDropdown === 'changefreq'"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <li 
                  v-for="freq in changefreqOptions" 
                  :key="freq"
                  @click="selectChangefreq(freq)"
                  class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
                >
                  {{ freq }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-3">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
            <i class="ti ti-refresh ml-1"></i>
            ساخت Sitemap
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
            <i class="ti ti-send ml-1"></i>
            ارسال به Google
          </button>
        </div>
      </div>

      <!-- Structured Data -->
      <div class="border border-purple-200 rounded-lg p-4 bg-purple-50">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-json text-purple-600"></i>
          داده‌های ساختاریافته
        </h4>
        
        <div class="space-y-3">
          <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-heart-handshake text-rose-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Charity Schema</div>
                <div class="text-xs text-gray-500">برای قرارهای مهربانی</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.charity"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-users text-rose-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Person Schema</div>
                <div class="text-xs text-gray-500">برای حامیان</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.person"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-breadcrumbs text-rose-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Breadcrumb Schema</div>
                <div class="text-xs text-gray-500">برای مسیر صفحه</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.breadcrumb"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-building text-rose-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Organization Schema</div>
                <div class="text-xs text-gray-500">برای اطلاعات سازمان</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.organization"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>
        </div>
      </div>

      <!-- Google Analytics -->
      <div class="border border-green-200 rounded-lg p-4 bg-green-50">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-chart-line text-green-600"></i>
          Google Analytics
        </h4>
        
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Tracking ID</label>
            <input
              v-model="seo.googleAnalyticsId"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white"
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <label class="flex items-center p-3 bg-white rounded-lg cursor-pointer">
            <input
              v-model="seo.enableGA"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span class="mr-3 text-sm text-gray-700">فعال‌سازی Google Analytics</span>
          </label>
        </div>
      </div>

      <!-- Google Search Console -->
      <div class="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-search text-blue-600"></i>
          Google Search Console
        </h4>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Verification Code</label>
          <input
            v-model="seo.googleSearchConsoleCode"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            placeholder="google-site-verification=XXXXXXXXXX"
          />
          <p class="text-xs text-gray-500 mt-1">کد تأیید Google Search Console</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useSettingStore} from "@/stores/setting.ts";

const openDropdown = ref(null)

const seo = ref({
  metaTitle: 'حامیان - سیستم مدیریت حامیان و کمک‌ها',
  metaDescription: 'سیستم جامع مدیریت حامیان، قرارهای مهربانی و کمک‌های مالی برای حمایت از حیوانات بی‌سرپناه',
  metaKeywords: 'حامیان، کمک خیریه، قرار مهربانی، حمایت از حیوانات، کمک مالی، داوطلب',
  canonicalUrl: 'https://hamian.petoman.ir',
  robots: 'index, follow',
  allowIndexing: true,
  sitemapUrl: 'https://hamian.petoman.ir/sitemap.xml',
  changefreq: 'روزانه',
  structuredData: {
    charity: true,
    person: true,
    breadcrumb: true,
    organization: true
  },
  googleAnalyticsId: 'G-XXXXXXXXXX',
  enableGA: true,
  googleSearchConsoleCode: ''
})

const robotsOptions = ref([
  'index, follow',
  'noindex, follow',
  'index, nofollow',
  'noindex, nofollow'
])

const changefreqOptions = ref([
  'همیشه',
  'ساعتی',
  'روزانه',
  'هفتگی',
  'ماهانه',
  'سالانه',
  'هرگز'
])

const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}

const selectRobots = (robot) => {
  seo.value.robots = robot
  openDropdown.value = null
}

const selectChangefreq = (freq) => {
  seo.value.changefreq = freq
  openDropdown.value = null
}
const settingStore=useSettingStore()
const saveSeoSettings = async () => {
  console.log('Saving SEO settings:', seo.value)
  await settingStore.saveSeoSetting(seo.value)
  alert('تنظیمات سئو با موفقیت ذخیره شد!')
}

onMounted(async () => {
  await settingStore.fetchSeoSetting()
  // پس از fetch مقداردهی
  Object.assign(seo.value, settingStore.seoSetting)
})
</script>
