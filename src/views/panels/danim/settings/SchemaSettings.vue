<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-code text-orange-600"></i>
          تنظیمات Schema Markup
        </h2>
        <p class="text-sm text-gray-500 mt-1">داده‌های ساختاریافته برای موتورهای جستجو</p>
      </div>
      <button @click="saveSchemaSettings" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">
        <i class="ti ti-device-floppy ml-2"></i>
        ذخیره تغییرات
      </button>
    </div>

    <div class="space-y-6">
      <!-- Organization Schema -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-building text-blue-600"></i>
            Organization Schema
          </h3>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="schema.organization.enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>

        <div v-if="schema.organization.enabled" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نام سازمان</label>
              <input
                v-model="schema.organization.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                placeholder="دانیم"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">URL</label>
              <input
                v-model="schema.organization.url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                placeholder="https://danim.petoman.ir"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">لوگو</label>
              <input
                v-model="schema.organization.logo"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                placeholder="https://danim.petoman.ir/logo.png"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">شماره تماس</label>
              <input
                v-model="schema.organization.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                placeholder="021-12345678"
              />
            </div>
          </div>

          <!-- JSON Preview -->
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto">
            <pre>{{ JSON.stringify(generateOrganizationSchema(), null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Article Schema -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-file-text text-green-600"></i>
            Article Schema
          </h3>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="schema.article.enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>

        <div v-if="schema.article.enabled" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نویسنده پیش‌فرض</label>
              <input
                v-model="schema.article.author"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                placeholder="تیم تحریریه دانیم"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">ناشر</label>
              <input
                v-model="schema.article.publisher"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                placeholder="دانیم"
              />
            </div>
          </div>

          <div class="bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto">
            <pre>{{ JSON.stringify(generateArticleSchema(), null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Breadcrumb Schema -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-breadcrumbs text-purple-600"></i>
            Breadcrumb Schema
          </h3>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="schema.breadcrumb.enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>

        <div v-if="schema.breadcrumb.enabled">
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto">
            <pre>{{ JSON.stringify(generateBreadcrumbSchema(), null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- FAQ Schema -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-help text-yellow-600"></i>
            FAQ Schema
          </h3>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="schema.faq.enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>

        <div v-if="schema.faq.enabled" class="space-y-3">
          <div v-for="(item, index) in schema.faq.items" :key="index" class="p-3 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 gap-2">
              <input
                v-model="item.question"
                type="text"
                placeholder="سوال"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <textarea
                v-model="item.answer"
                rows="2"
                placeholder="پاسخ"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              ></textarea>
            </div>
            <button @click="removeFaqItem(index)" class="mt-2 text-xs text-red-600 hover:text-red-700">
              <i class="ti ti-trash"></i> حذف
            </button>
          </div>

          <button @click="addFaqItem" class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors">
            <i class="ti ti-plus ml-1"></i>
            افزودن سوال
          </button>
        </div>
      </div>

      <!-- HowTo Schema -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-list-check text-red-600"></i>
            HowTo Schema
          </h3>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="schema.howto.enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>

        <div v-if="schema.howto.enabled">
          <p class="text-xs text-gray-500 mb-3">برای مقالات آموزشی گام به گام</p>
        </div>
      </div>

      <!-- Video Schema -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-video text-pink-600"></i>
            Video Schema
          </h3>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="schema.video.enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>

        <div v-if="schema.video.enabled">
          <p class="text-xs text-gray-500">برای محتوای ویدیویی</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useDanimSettingStore} from "@/stores/danim-setting.ts";

const schema = ref({
  organization: {
    enabled: true,
    name: 'دانیم',
    url: 'https://danim.petoman.ir',
    logo: 'https://danim.petoman.ir/logo.png',
    phone: '021-12345678'
  },
  article: {
    enabled: true,
    author: 'تیم تحریریه دانیم',
    publisher: 'دانیم'
  },
  breadcrumb: {
    enabled: true
  },
  faq: {
    enabled: false,
    items: [
      { question: 'چگونه از سگ نگهداری کنیم؟', answer: 'برای نگهداری از سگ باید...' }
    ]
  },
  howto: {
    enabled: false
  },
  video: {
    enabled: false
  }
})

const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": schema.value.organization.name,
    "url": schema.value.organization.url,
    "logo": schema.value.organization.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": schema.value.organization.phone,
      "contactType": "customer service"
    }
  }
}

const generateArticleSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "author": {
      "@type": "Person",
      "name": schema.value.article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": schema.value.article.publisher
    }
  }
}

const generateBreadcrumbSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "خانه",
        "item": "https://danim.petoman.ir"
      }
    ]
  }
}

const addFaqItem = () => {
  schema.value.faq.items.push({ question: '', answer: '' })
}

const removeFaqItem = (index) => {
  schema.value.faq.items.splice(index, 1)
}
const settingStore=useDanimSettingStore()
const saveSchemaSettings = async () => {

  await settingStore.saveSchemaSetting(schema.value)
  alert('تنظیمات Schema با موفقیت ذخیره شد!')
}

onMounted(async () => {
  await settingStore.fetchSchemaSetting()
  // پس از fetch مقداردهی
  Object.assign(schema.value, settingStore.schemaSetting)
})
</script>
