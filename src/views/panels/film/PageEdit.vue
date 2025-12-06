<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ویرایش صفحه</h1>
        <p class="text-gray-600 mt-1">ویرایش و به‌روزرسانی صفحه ثابت</p>
      </div>
      <div class="flex gap-3">
        <button @click="goBack" class="btn-secondary">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="saveDraft" class="btn-secondary">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره پیش‌نویس
        </button>
        <button @click="updatePage" class="btn-primary">
          <i class="ti ti-check ml-2"></i>
          به‌روزرسانی
        </button>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-xl border p-12 text-center">
      <i class="ti ti-loader-2 text-4xl text-purple-600 animate-spin mb-4"></i>
      <p class="text-gray-600">در حال بارگذاری...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">عنوان صفحه</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="عنوان صفحه..."
            class="input-field"
          >
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Slug (نامک URL)</label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="page-slug"
            class="input-field font-mono"
          >
          <p class="text-xs text-gray-500 mt-1">آدرس صفحه: /pages/{{ form.slug || 'page-slug' }}</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">محتوای صفحه</label>
          <TinyMCEEditor
              v-model="form.content"
              placeholder="محتوای صفحه خود را اینجا بنویسید..."
              :height="400"
          />
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">آمار صفحه</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ form.views || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">بازدید کل</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ form.todayViews || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">بازدید امروز</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">تصویر شاخص</h3>
          <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 border-2 border-gray-200">
            <img
              v-if="form.thumbnail"
              :src="form.thumbnail"
              alt="Thumbnail"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="ti ti-photo text-gray-400 text-4xl"></i>
            </div>
          </div>
          <input
            v-model="form.thumbnail"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="input-field text-sm mb-2"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleThumbnailUpload"
            class="hidden"
            id="thumbnail-upload"
          />
          <label
            for="thumbnail-upload"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm"
          >
            <i class="ti ti-upload text-purple-600"></i>
            <span>تغییر تصویر</span>
          </label>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">وضعیت</h3>
          <div class="relative">
            <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
            >
              <span class="text-gray-700">{{ getStatusLabel(form.status) }}</span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <ul
              v-if="showStatusDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <li
                @click="selectStatus('published')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                منتشر شده
              </li>
              <li
                @click="selectStatus('draft')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                پیش‌نویس
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">تنظیمات SEO</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">عنوان متا (Meta Title)</label>
              <input
                v-model="form.seoTitle"
                type="text"
                placeholder="عنوان برای موتورهای جستجو (حداکثر ۶۰ کاراکتر)"
                class="input-field text-sm"
                maxlength="100"
              />
              <div class="mt-1 text-xs" :class="form.seoTitle.length > 60 ? 'text-red-500' : 'text-gray-500'">
                {{ form.seoTitle.length }}/60 کاراکتر
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">توضیحات متا (Meta Description)</label>
              <textarea
                v-model="form.seoDescription"
                rows="3"
                placeholder="توضیحات مختصر برای موتورهای جستجو (حداکثر ۱۶۰ کاراکتر)"
                class="input-field text-sm resize-none"
                maxlength="200"
              ></textarea>
              <div class="mt-1 text-xs" :class="form.seoDescription.length > 160 ? 'text-red-500' : 'text-gray-500'">
                {{ form.seoDescription.length }}/160 کاراکتر
              </div>
            </div>
            
            <!-- Google Search Preview -->
            <div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div class="text-xs text-gray-500 mb-2">پیش‌نمایش نتایج گوگل:</div>
              <div class="space-y-1">
                <div class="text-blue-600 text-lg hover:underline cursor-pointer">
                  {{ form.seoTitle || form.title || 'عنوان صفحه' }}
                </div>
                <div class="text-green-700 text-sm">
                  https://yoursite.com/page/{{ form.slug || 'slug' }}
                </div>
                <div class="text-gray-600 text-sm">
                  {{ form.seoDescription || 'توضیحات صفحه در نتایج جستجو نمایش داده می‌شود...' }}
                </div>
              </div>
            </div>

            <!-- SEO Tips -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-xs text-blue-800">
                  <div class="font-semibold mb-1">نکات سئو:</div>
                  <ul class="list-disc list-inside space-y-1 text-blue-700">
                    <li>عنوان متا باید بین ۵۰ تا ۶۰ کاراکتر باشد</li>
                    <li>توضیحات متا باید بین ۱۵۰ تا ۱۶۰ کاراکتر باشد</li>
                    <li>از کلمات کلیدی مرتبط با محتوا استفاده کنید</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">تنظیمات</h3>
          <div class="space-y-3">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.showInMenu"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span class="text-gray-700">نمایش در منو</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.commentsEnabled"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span class="text-gray-700">امکان ثبت نظر</span>
            </label>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-red-200 p-6">
          <h3 class="text-lg font-bold text-red-600 mb-4">حذف صفحه</h3>
          <p class="text-sm text-gray-600 mb-4">با حذف صفحه، تمام محتوا و داده‌های آن حذف می‌شود.</p>
          <button @click="deletePage" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            <i class="ti ti-trash ml-2"></i>
            حذف دائمی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast} from "@/composables/useToast.js";
import {useFilmPageStore} from "@/stores/film-page.ts";
import TinyMCEEditor from "@/components/TinyMCEEditor.vue";

const router = useRouter()
const route = useRoute()
const toast = useToast()
const pageFound = ref(false)
const pageId = ref(null)
const loading = ref(true)
const filmPageStore=useFilmPageStore()
const showStatusDropdown = ref(false)
const pages = computed(()=>filmPageStore.pages)
const form = ref({
  id: null,
  title: '',
  slug: '',
  content: '',
  thumbnail: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
  showInMenu: false,
  commentsEnabled: false,
  views: 0,
  todayViews: 0
})
function mapPageToForm(page) {
  form.value = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    thumbnail: page.thumbnailUrl,
    status: page.status || 'draft',
    seoTitle: page.metaTitle || '',
    seoDescription: page.metaDescription || '',
    showInMenu: page.showInMenu ?? false,
    commentsEnabled: page.commentsEnabled ?? false,
    views: page.views ?? 0,
    todayViews: page.todayViews ?? 0
  }
}

onMounted(() => {
  loadPage()
})
const loadPage = () => {
  pageId.value = route.params.id
  const page = pages.value.find(p => p.id === pageId.value)

  if (page) {
    mapPageToForm(page)
    pageFound.value = true
  } else {
    pageFound.value = false
  }

  loading.value = false
}
const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const getStatusLabel = (status) => {
  return status === 'published' ? 'منتشر شده' : 'پیش‌نویس'
}

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'لطفاً یک فایل کوچکتر انتخاب کنید')
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
  updatePage()
}

const updatePage = async () => {
  if (!form.value.title) {
    toast.warning('لطفاً عنوان صفحه را وارد کنید', 'عنوان الزامی است')
    return
  }

  if (!form.value.slug) {
    toast.warning('لطفاً Slug صفحه را وارد کنید', 'Slug الزامی است')
    return
  }

  console.log('Updating page:', form.value)
  await filmPageStore.updatePage(form.value.id,form.value)
  toast.success('صفحه با موفقیت به‌روزرسانی شد!', 'تغییرات ذخیره گردید')
  setTimeout(() => {
    router.push('/dashboard/film/pages')
  }, 1000)
}

const deletePage = async () => {
  if (confirm('آیا از حذف این صفحه اطمینان دارید؟')) {
    console.log('Deleting page:', form.value.id)
    await filmPageStore.deletePage(form.value.id)
    toast.success('صفحه با موفقیت حذف شد', 'تغییرات اعمال گردید')
    setTimeout(() => {
      router.push('/dashboard/film/pages')
    }, 1000)
  }
}
</script>

<style scoped>
.btn-primary {
  padding: 0.5rem 1rem;
  background-color: #9333ea;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #7e22ce;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
