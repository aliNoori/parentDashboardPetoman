<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-seo text-orange-600"></i>
          تنظیمات سئو (SEO)
        </h2>
        <p class="text-sm text-gray-500 mt-1">بهینه‌سازی برای موتورهای جستجو</p>
      </div>
      <button @click="saveSeoSettings" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">
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
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="دانیم - دانشنامه جامع حیوانات خانگی"
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
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="مرجع کامل آموزش و نگهداری از حیوانات خانگی با مقالات تخصصی درباره سگ، گربه، پرنده و سایر حیوانات"
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
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="حیوانات خانگی، سگ، گربه، دامپزشکی، آموزش"
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
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          placeholder="https://danim.petoman.ir"
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
              class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
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
                class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
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
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span class="mr-3 text-sm text-gray-700">اجازه فهرست‌نویسی به موتورهای جستجو</span>
          </label>
        </div>
      </div>

      <!-- Sitemap -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-sitemap text-blue-600"></i>
          نقشه سایت (Sitemap)
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">URL نقشه سایت</label>
            <input
              v-model="seo.sitemapUrl"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="https://danim.petoman.ir/sitemap.xml"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">فرکانس به‌روزرسانی</label>
            <div class="relative">
              <button 
                @click="toggleDropdown('changefreq')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
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
                  class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
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
      <div class="border border-gray-200 rounded-lg p-4">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-json text-purple-600"></i>
          داده‌های ساختاریافته
        </h4>
        
        <div class="space-y-3">
          <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-file-text text-orange-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Article Schema</div>
                <div class="text-xs text-gray-500">برای مقالات</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.article"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-star text-orange-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Rating Schema</div>
                <div class="text-xs text-gray-500">برای امتیازدهی</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.rating"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-breadcrumbs text-orange-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Breadcrumb Schema</div>
                <div class="text-xs text-gray-500">برای مسیر صفحه</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.breadcrumb"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-building text-orange-600"></i>
              <div>
                <div class="font-bold text-gray-900 text-sm">Organization Schema</div>
                <div class="text-xs text-gray-500">برای اطلاعات سازمان</div>
              </div>
            </div>
            <input
              v-model="seo.structuredData.organization"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>
      </div>

      <!-- Google Analytics -->
      <div class="border border-gray-200 rounded-lg p-4">
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
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
            <input
              v-model="seo.enableGA"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span class="mr-3 text-sm text-gray-700">فعال‌سازی Google Analytics</span>
          </label>
        </div>
      </div>

      <!-- Google Search Console -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-search text-blue-600"></i>
          Google Search Console
        </h4>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Verification Code</label>
          <input
            v-model="seo.googleSearchConsoleCode"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="google-site-verification=XXXXXXXXXX"
          />
          <p class="text-xs text-gray-500 mt-1">کد تأیید Google Search Console</p>
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
const seo = ref({
  metaTitle: 'دانیم - دانشنامه جامع حیوانات خانگی',
  metaDescription: 'مرجع کامل آموزش و نگهداری از حیوانات خانگی با مقالات تخصصی درباره سگ، گربه، پرنده و سایر حیوانات خانگی',
  metaKeywords: 'حیوانات خانگی، سگ، گربه، دامپزشکی، آموزش نگهداری، پرنده، ماهی',
  canonicalUrl: 'https://danim.petoman.ir',
  robots: 'index, follow',
  allowIndexing: true,
  sitemapUrl: 'https://danim.petoman.ir/sitemap.xml',
  changefreq: 'روزانه',
  structuredData: {
    article: true,
    rating: true,
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
const saveSeoSettings = async () => {
  console.log('Saving general settings:', seo.value)
  await settingStore.saveSeoSetting(seo.value)
  alert('تنظیمات سئو با موفقیت ذخیره شد!')
}
onMounted(async () => {
  await settingStore.fetchSeoSetting()
  // پس از fetch مقداردهی
  Object.assign(seo.value, settingStore.seoSetting)
})
</script>
