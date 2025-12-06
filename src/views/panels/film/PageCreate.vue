<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ایجاد صفحه جدید</h1>
        <p class="text-gray-600 mt-1">صفحه ثابت جدید خود را ایجاد کنید</p>
      </div>
      <div class="flex gap-3">
        <button @click="goBack" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="saveDraft" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره پیش‌نویس
        </button>
        <button @click="publishPage" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center">
          <i class="ti ti-send ml-2"></i>
          انتشار صفحه
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            عنوان صفحه <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            @input="generateSlug"
            type="text"
            placeholder="عنوان صفحه خود را وارد کنید..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
          >
        </div>

        <!-- Slug -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            نامک (Slug) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="page-slug"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all font-mono"
            dir="ltr"
          >
          <p class="text-xs text-gray-500 mt-2">نامک به صورت خودکار از عنوان ایجاد می‌شود</p>
        </div>

        <!-- Content Editor -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-4">
            محتوای صفحه <span class="text-red-500">*</span>
          </label>
          <TinyMCEEditor
            v-model="form.content"
            :height="500"
            placeholder="محتوای صفحه خود را اینجا بنویسید..."
          />
        </div>

        <!-- SEO Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <i class="ti ti-seo ml-2 text-purple-600"></i>
            تنظیمات سئو (SEO)
          </h3>

          <!-- Meta Title -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-semibold text-gray-700">
                عنوان متا (Meta Title)
              </label>
              <span class="text-xs" :class="form.metaTitle.length > 60 ? 'text-red-600 font-semibold' : 'text-gray-500'">
                {{ form.metaTitle.length }}/60
              </span>
            </div>
            <input
              v-model="form.metaTitle"
              type="text"
              placeholder="عنوان برای موتورهای جستجو (60 کاراکتر)"
              maxlength="70"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
            />
            <p class="text-xs text-gray-500 mt-1">عنوانی که در نتایج گوگل نمایش داده می‌شود</p>
          </div>

          <!-- Meta Description -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-semibold text-gray-700">
                توضیحات متا (Meta Description)
              </label>
              <span class="text-xs" :class="form.metaDescription.length > 160 ? 'text-red-600 font-semibold' : 'text-gray-500'">
                {{ form.metaDescription.length }}/160
              </span>
            </div>
            <textarea
              v-model="form.metaDescription"
              rows="3"
              placeholder="توضیحات مختصر برای موتورهای جستجو (160 کاراکتر)"
              maxlength="170"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all resize-none"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">توضیحاتی که در نتایج گوگل نمایش داده می‌شود</p>
          </div>

          <!-- Google Preview -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-2 font-semibold">پیش‌نمایش در گوگل:</p>
            <div class="space-y-1">
              <div class="text-blue-600 hover:underline cursor-pointer text-sm font-medium line-clamp-1">
                {{ form.metaTitle || form.title || 'عنوان صفحه شما' }}
              </div>
              <div class="text-green-700 text-xs flex items-center gap-1">
                <span>yoursite.com</span>
                <span>/</span>
                <span>{{ form.slug || 'page-slug' }}</span>
              </div>
              <div class="text-gray-600 text-xs line-clamp-2">
                {{ form.metaDescription || 'توضیحات متای صفحه شما اینجا نمایش داده می‌شود. این متن را به گونه‌ای بنویسید که کاربران را به کلیک روی لینک تشویق کند.' }}
              </div>
            </div>
          </div>

          <!-- SEO Tips -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p class="text-xs text-blue-800 font-semibold mb-2 flex items-center gap-1">
              <i class="ti ti-bulb text-sm"></i>
              نکات سئو:
            </p>
            <ul class="text-xs text-blue-700 space-y-1">
              <li class="flex items-start gap-1">
                <span class="text-blue-600 mt-0.5">•</span>
                <span>عنوان متا را بین 50-60 کاراکتر نگه دارید</span>
              </li>
              <li class="flex items-start gap-1">
                <span class="text-blue-600 mt-0.5">•</span>
                <span>توضیحات متا را بین 150-160 کاراکتر بنویسید</span>
              </li>
              <li class="flex items-start gap-1">
                <span class="text-blue-600 mt-0.5">•</span>
                <span>از کلمات کلیدی مرتبط استفاده کنید</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Publish Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">تنظیمات انتشار</h3>
          
          <!-- Status -->
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">وضعیت</label>
            <div class="relative">
              <button
                @click="showStatusDropdown = !showStatusDropdown"
                type="button"
                class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
              >
                <span>{{ getStatusLabel(form.status) }}</span>
                <i class="ti ti-chevron-down"></i>
              </button>
              <ul
                v-show="showStatusDropdown"
                class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
              >
                <li
                  @click="selectStatus('draft')"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': form.status === 'draft' }"
                >
                  پیش‌نویس
                </li>
                <li
                  @click="selectStatus('published')"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': form.status === 'published' }"
                >
                  منتشر شده
                </li>
              </ul>
            </div>
          </div>

          <!-- Persian Date Picker -->
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">تاریخ انتشار</label>
            <VuePersianDatetimePicker
              v-model="form.publishDate"
              format="YYYY-MM-DD HH:mm"
              display-format="jYYYY/jMM/jDD - HH:mm"
              type="datetime"
              auto-submit
              :clearable="true"
              placeholder="انتخاب تاریخ و ساعت..."
              custom-input=".custom-datepicker-input"
            />
            <input 
              type="text" 
              readonly
              :value="form.publishDate ? formatPersianDate(form.publishDate) : ''"
              placeholder="انتخاب تاریخ و ساعت..."
              class="custom-datepicker-input w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors"
            />
          </div>
        </div>

        <!-- Featured Image -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">تصویر شاخص</h3>
          <div v-if="form.thumbnail" class="relative mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
            <img :src="form.thumbnail" alt="Thumbnail" class="w-full h-48 object-cover" />
            <button
              @click="form.thumbnail = ''"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <i class="ti ti-x"></i>
            </button>
          </div>
          <label class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center block cursor-pointer hover:border-purple-400 transition-colors">
            <i class="ti ti-photo text-4xl text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-600 font-medium">{{ form.thumbnail ? 'تغییر تصویر' : 'آپلود تصویر' }}</p>
            <p class="text-xs text-gray-500 mt-1">JPG, PNG یا WebP (حداکثر 2MB)</p>
            <input type="file" @change="handleThumbnailUpload" accept="image/*" class="hidden">
          </label>
        </div>

        <!-- Page Template -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">الگوی صفحه</h3>
          <div class="relative">
            <button
              @click="showTemplateDropdown = !showTemplateDropdown"
              type="button"
              class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
            >
              <span>{{ getTemplateLabel(form.template) }}</span>
              <i class="ti ti-chevron-down"></i>
            </button>
            <ul
              v-show="showTemplateDropdown"
              class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
            >
              <li
                @click="selectTemplate('default')"
                class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                :class="{ 'bg-purple-50 text-purple-600 font-medium': form.template === 'default' }"
              >
                پیش‌فرض
              </li>
              <li
                @click="selectTemplate('full-width')"
                class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                :class="{ 'bg-purple-50 text-purple-600 font-medium': form.template === 'full-width' }"
              >
                تمام عرض
              </li>
              <li
                @click="selectTemplate('sidebar')"
                class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                :class="{ 'bg-purple-50 text-purple-600 font-medium': form.template === 'sidebar' }"
              >
                با نوار کناری
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import TinyMCEEditor from '../../../components/TinyMCEEditor.vue'
import VuePersianDatetimePicker from 'vue3-persian-datetime-picker'
import {useFilmPageStore} from "@/stores/film-page.ts";

const router = useRouter()
const toast = inject('toast')

const showStatusDropdown = ref(false)
const showTemplateDropdown = ref(false)

const form = ref({
  title: '',
  slug: '',
  content: '',
  status: 'draft',
  publishDate: '',
  template: 'default',
  thumbnail: '',
  metaTitle: '',
  metaDescription: ''
})

// Generate slug from Persian title
const generateSlug = () => {
  const persianToEnglish = {
    'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'i', 'ئ': 'i', 'ة': 'e', 'ى': 'a'
  }
  
  let slug = form.value.title.toLowerCase()
  for (const [persian, english] of Object.entries(persianToEnglish)) {
    slug = slug.replace(new RegExp(persian, 'g'), english)
  }
  slug = slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  form.value.slug = slug
  
  // Auto-fill meta title if empty
  if (!form.value.metaTitle && form.value.title) {
    form.value.metaTitle = form.value.title
  }
}

const formatPersianDate = (date) => {
  if (!date) return ''
  // This will show the selected date in Persian format
  return date
}

const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const selectTemplate = (template) => {
  form.value.template = template
  showTemplateDropdown.value = false
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'پیش‌نویس',
    published: 'منتشر شده'
  }
  return labels[status] || 'پیش‌نویس'
}

const getTemplateLabel = (template) => {
  const labels = {
    default: 'پیش‌فرض',
    'full-width': 'تمام عرض',
    sidebar: 'با نوار کناری'
  }
  return labels[template] || 'پیش‌فرض'
}

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد')
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('فقط فایل‌های تصویری مجاز هستند')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.thumbnail = e.target.result
  }
  reader.readAsDataURL(file)
}

const goBack = () => {
  router.back()
}

const saveDraft = () => {
  form.value.status = 'draft'
  publishPage()
}
const filmPageStore=useFilmPageStore()
const publishPage = async () => {
  if (!form.value.title) {
    toast.warning('لطفاً عنوان صفحه را وارد کنید')
    return
  }

  if (!form.value.slug) {
    toast.warning('لطفاً نامک صفحه را وارد کنید')
    return
  }

  if (!form.value.content) {
    toast.warning('لطفاً محتوای صفحه را وارد کنید')
    return
  }

  console.log('Publishing page:', form.value)
  await filmPageStore.addPage(form.value)
  toast.success('صفحه با موفقیت ایجاد شد!')
  setTimeout(() => {
    router.push('/dashboard/film/pages')
  }, 1000)
}
</script>
