<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-share text-rose-600"></i>
          تنظیمات Open Graph
        </h2>
        <p class="text-sm text-gray-500 mt-1">بهینه‌سازی برای اشتراک‌گذاری در شبکه‌های اجتماعی</p>
      </div>
      <button @click="saveOpenGraphSettings" class="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-bold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg">
        <i class="ti ti-device-floppy ml-2"></i>
        ذخیره تغییرات
      </button>
    </div>

    <div class="space-y-6">
      <!-- Preview -->
      <div class="border-2 border-rose-200 rounded-xl p-6 bg-gradient-to-br from-rose-50 to-white">
        <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i class="ti ti-eye text-rose-600"></i>
          پیش‌نمایش
        </h3>
        
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-md">
          <div class="aspect-video bg-gray-200 overflow-hidden">
            <img v-if="og.image" :src="og.image" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="ti ti-photo text-6xl"></i>
            </div>
          </div>
          <div class="p-4">
            <div class="text-xs text-gray-500 mb-1">{{ og.siteName }}</div>
            <div class="font-bold text-gray-900 mb-1 line-clamp-2">{{ og.title || 'عنوان پروژه' }}</div>
            <div class="text-sm text-gray-600 line-clamp-2">{{ og.description || 'توضیحات پروژه' }}</div>
          </div>
        </div>
      </div>

      <!-- OG Title -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          عنوان (og:title)
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="og.title"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="حامیان - سیستم مدیریت حامیان و کمک‌ها"
        />
        <p class="text-xs text-gray-500 mt-1">عنوانی که هنگام اشتراک‌گذاری نمایش داده می‌شود</p>
      </div>

      <!-- OG Description -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          توضیحات (og:description)
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="og.description"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="سیستم جامع مدیریت حامیان، قرارهای مهربانی و کمک‌های مالی"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">توضیحات کوتاه برای نمایش در شبکه‌های اجتماعی</p>
      </div>

      <!-- OG Image -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          تصویر (og:image)
          <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-3">
          <input
            v-model="og.image"
            type="url"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            placeholder="https://hamian.petoman.ir/og-image.jpg"
          />
          <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              class="hidden"
              @change="handleFileUpload"
          />
          <button
              @click="$refs.fileInput.click()"
              class="px-4 py-2 border-2 border-rose-500 text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-colors"
          >
            <i class="ti ti-upload ml-1"></i> آپلود
          </button>

        </div>
        <div class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-xs text-blue-800 font-bold mb-1">⚠️ توصیه‌های تصویر:</p>
          <ul class="text-xs text-blue-700 space-y-1 mr-4">
            <li>• ابعاد پیشنهادی: 1200×630 پیکسل</li>
            <li>• حداقل: 600×315 پیکسل</li>
            <li>• فرمت: JPG یا PNG</li>
            <li>• حجم: کمتر از 8 مگابایت</li>
            <li>• نسبت تصویر: 1.91:1</li>
          </ul>
        </div>
      </div>

      <!-- OG URL -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          URL (og:url)
        </label>
        <input
          v-model="og.url"
          type="url"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          placeholder="https://hamian.petoman.ir"
        />
      </div>

      <!-- OG Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            نوع (og:type)
          </label>
          <button 
            @click="toggleDropdown('ogType')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right"
          >
            <span class="text-sm">{{ og.type }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'ogType' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'ogType'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li 
              v-for="type in ogTypes" 
              :key="type"
              @click="selectOgType(type)"
              class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
            >
              {{ type }}
            </li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            نام سایت (og:site_name)
          </label>
          <input
            v-model="og.siteName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="حامیان"
          />
        </div>
      </div>

      <!-- OG Locale -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            زبان (og:locale)
          </label>
          <button 
            @click="toggleDropdown('locale')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right"
          >
            <span class="text-sm">{{ og.locale }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'locale' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'locale'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li 
              v-for="locale in locales" 
              :key="locale.value"
              @click="selectLocale(locale.label)"
              class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
            >
              {{ locale.label }}
            </li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            زبان‌های جایگزین
          </label>
          <input
            v-model="og.localeAlternate"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="en_US, ar_SA"
          />
        </div>
      </div>

      <!-- Twitter Card Settings -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-brand-twitter text-blue-500"></i>
          تنظیمات Twitter Card
        </h3>

        <div class="space-y-4">
          <div class="relative">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              نوع کارت (twitter:card)
            </label>
            <button 
              @click="toggleDropdown('twitterCard')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-rose-500 transition-colors text-right"
            >
              <span class="text-sm">{{ twitter.card }}</span>
              <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'twitterCard' ? 'rotate-180' : '']"></i>
            </button>
            <ul 
              v-if="openDropdown === 'twitterCard'"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <li 
                v-for="card in twitterCardTypes" 
                :key="card.value"
                @click="selectTwitterCard(card.label)"
                class="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
              >
                <div class="font-bold">{{ card.label }}</div>
                <div class="text-xs text-gray-500">{{ card.description }}</div>
              </li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                اکانت توییتر سایت
              </label>
              <input
                v-model="twitter.site"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="@hamian_ir"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                اکانت توییتر نویسنده
              </label>
              <input
                v-model="twitter.creator"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="@author_name"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Project Specific -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-heart-handshake text-green-600"></i>
          تنظیمات مخصوص پروژه‌ها
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              مدیر پیش‌فرض
            </label>
            <input
              v-model="project.manager"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="تیم حامیان"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              سازمان (Organization)
            </label>
            <input
              v-model="project.organization"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="حامیان"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              تگ‌های پیش‌فرض
            </label>
            <input
              v-model="project.tags"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="حامیان, کمک مالی, قرار مهربانی"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              دسته‌بندی (Category)
            </label>
            <input
              v-model="project.category"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="پروژه‌های حمایتی"
            />
          </div>
        </div>
      </div>

      <!-- Test Tools -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-tool text-purple-600"></i>
          ابزارهای تست
        </h3>

        <div class="flex flex-wrap gap-3">
          <a href="https://developers.facebook.com/tools/debug/" target="_blank"
             class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <i class="ti ti-brand-facebook"></i>
            Facebook Debugger
          </a>

          <a href="https://cards-dev.twitter.com/validator" target="_blank"
             class="px-4 py-2 bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600 transition-colors flex items-center gap-2">
            <i class="ti ti-brand-twitter"></i>
            Twitter Validator
          </a>

          <a href="https://www.linkedin.com/post-inspector/" target="_blank"
             class="px-4 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2">
            <i class="ti ti-brand-linkedin"></i>
            LinkedIn Inspector
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useSettingStore} from "@/stores/setting.ts";

const openDropdown = ref(null)

const og = ref({
  title: 'حامیان - سیستم مدیریت حامیان و کمک‌ها',
  description: 'سیستم جامع مدیریت حامیان، قرارهای مهربانی و کمک‌های مالی',
  image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=630&fit=crop',
  url: 'https://hamian.petoman.ir',
  type: 'website',
  siteName: 'حامیان',
  locale: 'fa_IR',
  localeAlternate: 'en_US'
})

const twitter = ref({
  card: 'summary_large_image',
  site: '@hamian_ir',
  creator: '@hamian_ir'
})

const project = ref({
  manager: 'تیم حامیان',
  organization: 'حامیان',
  tags: 'حامیان, کمک مالی, قرار مهربانی',
  category: 'پروژه‌های حمایتی'
})

const ogTypes = ref([
  'website',
  'article',
  'blog',
  'profile'
])

const locales = ref([
  { value: 'fa_IR', label: 'fa_IR' },
  { value: 'en_US', label: 'en_US' },
  { value: 'ar_SA', label: 'ar_SA' }
])

const twitterCardTypes = ref([
  { value: 'summary', label: 'summary', description: 'کارت خلاصه' },
  { value: 'summary_large_image', label: 'summary_large_image', description: 'کارت با تصویر بزرگ' },
  { value: 'app', label: 'app', description: 'کارت اپلیکیشن' },
  { value: 'player', label: 'player', description: 'کارت پخش‌کننده' }
])

const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}

const selectOgType = (type) => {
  og.value.type = type
  openDropdown.value = null
}

const selectLocale = (locale) => {
  og.value.locale = locale
  openDropdown.value = null
}

const selectTwitterCard = (card) => {
  twitter.value.card = card
  openDropdown.value = null
}
const settingStore=useSettingStore()
const saveOpenGraphSettings = async () => {
  console.log('Saving Open Graph settings:', {og: og.value, twitter: twitter.value, project: project.value})
  await settingStore.saveOpenGraphSetting({og: og.value, twitter: twitter.value, project: project.value})
  alert('تنظیمات Open Graph با موفقیت ذخیره شد!')
}
const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // پیش‌نمایش فوری بدون آپلود
  const reader = new FileReader()
  reader.onload = (e) => {
    og.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}


onMounted(async () => {
  await settingStore.fetchOpenGraphSetting()
  // پس از fetch مقداردهی
  if (settingStore.openGraphSetting) {
    // مقداردهی جداگانه برای هر بخش
    if (settingStore.openGraphSetting.og) {
      Object.assign(og.value, settingStore.openGraphSetting.og)
    }

    if (settingStore.openGraphSetting.twitter) {
      Object.assign(twitter.value, settingStore.openGraphSetting.twitter)
    }

    if (settingStore.openGraphSetting.article) {
      Object.assign(article.value, settingStore.openGraphSetting.article)
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
