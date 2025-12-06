<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ایجاد نوشته جدید</h1>
        <p class="text-gray-600 mt-1">نوشته جدید خود را ایجاد و منتشر کنید</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="goBack" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="saveDraft" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center" :disabled="isLoading">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره پیش‌نویس
        </button>
        <button @click="publishPost" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center" :disabled="isLoading">
          <i class="ti ti-send ml-2" v-if="!isLoading"></i>
          <i class="ti ti-loader animate-spin ml-2" v-else></i>
          {{ isLoading ? 'در حال انتشار...' : 'انتشار نوشته' }}
        </button>
      </div>
    </div>

    <!-- Form Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">عنوان نوشته *</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="عنوان جذاب برای نوشته خود وارد کنید..."
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            :class="errors.title ? 'border-red-500' : ''"
          >
          <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <!-- Excerpt with Auto-generate -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">خلاصه نوشته</label>
            <button
              @click="generateExcerpt"
              type="button"
              class="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center"
              :disabled="!form.content"
            >
              <i class="ti ti-sparkles ml-1"></i>
              تولید خودکار
            </button>
          </div>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="خلاصه‌ای جذاب و مختصر از محتوای نوشته..."
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
            :class="errors.excerpt ? 'border-red-500' : ''"
            maxlength="200"
          ></textarea>
          <p v-if="errors.excerpt" class="text-red-600 text-sm mt-1">{{ errors.excerpt }}</p>
          <div class="flex justify-between items-center mt-1">
            <p class="text-xs text-gray-500">{{ form.excerpt.length }}/200 کاراکتر</p>
          </div>
        </div>

        <!-- Content Editor -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">محتوای نوشته *</label>
          
          <TinyMCEEditor
            v-model="form.content"
            placeholder="محتوای نوشته خود را اینجا بنویسید..."
            :height="400"
          />
          
          <p v-if="errors.content" class="text-red-600 text-sm mt-2">{{ errors.content }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ getContentLength() }} کاراکتر</p>
        </div>

        <!-- SEO Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <i class="ti ti-seo ml-2"></i>
            تنظیمات SEO
          </h3>
          
          <!-- Slug -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              اسلاگ (URL)
              <span class="text-xs text-gray-500 mr-1">(نامک)</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model="form.slug"
                type="text"
                placeholder="url-friendly-slug"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors flex-1 font-mono text-sm"
              >
              <button @click="generateSlug" type="button" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap">
                <i class="ti ti-refresh ml-1"></i>
                تولید
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1 flex items-center">
              <i class="ti ti-link text-blue-500 ml-1"></i>
              پیش‌نمایش: /blog/{{ form.slug || 'post-slug' }}
            </p>
          </div>

          <!-- Meta Title -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان متا</label>
            <input
              v-model="form.metaTitle"
              type="text"
              placeholder="عنوان برای موتورهای جستجو..."
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              maxlength="70"
            >
            <div class="flex justify-between text-xs mt-1">
              <span class="text-gray-500">{{ form.metaTitle.length }}/70 کاراکتر</span>
              <span v-if="form.metaTitle.length >= 50 && form.metaTitle.length <= 60" class="text-green-500">✓ عالی</span>
            </div>
          </div>

          <!-- Meta Description -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات متا</label>
            <textarea
              v-model="form.metaDescription"
              rows="3"
              placeholder="توضیحات مختصر برای موتورهای جستجو..."
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
              maxlength="170"
            ></textarea>
            <div class="flex justify-between text-xs mt-1">
              <span class="text-gray-500">{{ form.metaDescription.length }}/170 کاراکتر</span>
              <span v-if="form.metaDescription.length >= 150 && form.metaDescription.length <= 160" class="text-green-500">✓ عالی</span>
            </div>
          </div>

          <!-- SEO Preview -->
          <div class="border-t pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">پیش‌نمایش در گوگل</h4>
            <div class="bg-gray-50 rounded-lg p-3 border">
              <div class="text-blue-600 text-sm hover:underline cursor-pointer">
                {{ form.metaTitle || form.title || 'عنوان نوشته شما' }}
              </div>
              <div class="text-green-700 text-xs mt-1">
                https://yoursite.com/blog/{{ form.slug || 'post-slug' }}
              </div>
              <div class="text-gray-600 text-xs mt-1 line-clamp-2">
                {{ form.metaDescription || form.excerpt || 'توضیحات متا نوشته شما...' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Publish Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">تنظیمات انتشار</h3>
          
          <!-- Status Dropdown -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">تاریخ انتشار</label>
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
            <p class="text-xs text-gray-500 mt-1">برای انتشار فوری خالی بگذارید</p>
          </div>
        </div>

        <!-- Category Block -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">دسته‌بندی</h3>
          <div class="relative">
            <button
              @click="showCategoryDropdown = !showCategoryDropdown"
              class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
            >
              <span>{{ form.category.title || 'انتخاب دسته‌بندی' }}</span>
              <i class="ti ti-chevron-down"></i>
            </button>
            <ul
              v-show="showCategoryDropdown"
              class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <li
                v-for="category in categories"
                :key="category"
                @click="selectCategory(category)"
                class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                :class="{ 'bg-purple-50 text-purple-600 font-medium': form.category === category }"
              >
                {{ category.title }}
              </li>
            </ul>
          </div>
          <p v-if="errors.category" class="text-red-600 text-sm mt-1">{{ errors.category }}</p>
        </div>

        <!-- Tags Block (Separate) -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">برچسب‌ها</h3>
          <!-- پیشنهادات -->
          <div class="flex flex-wrap gap-2 mb-2">
  <span
      v-for="tag in tagStore.tags"
      :key="tag.name"
      @click="addTag(tag.name)"
      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-rose-100 hover:text-rose-700"
  >
    {{ tag.name }} ({{ tag.count }})
  </span>
          </div>
          <!-- تگ‌های انتخاب‌شده -->
          <div class="flex flex-wrap gap-2 mb-2">
         <span v-for="(tag, index) in form.tags" :key="index"
               class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm flex items-center gap-2">
    {{ tag }}
    <button type="button" @click="removeTag(index)" class="hover:text-rose-900">
      <i class="ti ti-x text-xs"></i>
    </button>
  </span>
          </div>
          <!-- ورودی تگ جدید -->
          <div class="flex gap-2">
            <input
                v-model="newTag"
                type="text"
                @keypress.enter.prevent="addTag()"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="برچسب جدید را وارد کنید..."
            >
            <button type="button" @click="addTag()"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <i class="ti ti-plus"></i>
            </button>
          </div>

        </div>

        <!-- Featured Image with Drag & Drop -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">تصویر شاخص</h3>
          
          <!-- Current Image -->
          <div v-if="form.thumbnail" class="relative mb-4 rounded-lg overflow-hidden">
            <img :src="form.thumbnail" alt="Thumbnail" class="w-full h-48 object-cover" />
            <button
              @click="form.thumbnail = ''"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <i class="ti ti-x"></i>
            </button>
          </div>

          <!-- Upload Area with Drag & Drop -->
          <label
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            class="border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer hover:border-purple-400 transition-colors"
            :class="isDragging ? 'border-purple-400 bg-purple-50' : 'border-gray-300'"
          >
            <i class="ti ti-cloud-upload text-4xl mb-2 block" :class="isDragging ? 'text-purple-600' : 'text-gray-400'"></i>
            <p class="text-gray-600 mb-1">{{ isDragging ? 'رها کنید...' : 'تصویر را بکشید یا کلیک کنید' }}</p>
            <p class="text-sm text-gray-500">حداکثر 2MB - JPG, PNG, WebP</p>
            <input type="file" @change="handleThumbnailUpload" accept="image/*" class="hidden" />
          </label>
        </div>

        <!-- Writing Tips -->
        <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
          <h3 class="text-lg font-medium text-purple-900 mb-3">
            <i class="ti ti-bulb ml-2"></i>
            نکات نوشتن
          </h3>
          <ul class="text-sm text-purple-800 space-y-2">
            <li class="flex items-start gap-2">
              <i class="ti ti-check text-purple-600 mt-0.5 flex-shrink-0"></i>
              <span>عنوان جذاب و مرتبط انتخاب کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="ti ti-check text-purple-600 mt-0.5 flex-shrink-0"></i>
              <span>خلاصه کوتاه و شفاف بنویسید</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="ti ti-check text-purple-600 mt-0.5 flex-shrink-0"></i>
              <span>تصویر مناسب اضافه کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="ti ti-check text-purple-600 mt-0.5 flex-shrink-0"></i>
              <span>برچسب‌های مرتبط انتخاب کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="ti ti-check text-purple-600 mt-0.5 flex-shrink-0"></i>
              <span>تنظیمات SEO را تکمیل کنید</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import { useRouter } from 'vue-router'
import { useToast} from "@/composables/useToast.js";
import TinyMCEEditor from '../../../components/TinyMCEEditor.vue'
import VuePersianDatetimePicker from 'vue3-persian-datetime-picker'
import {useFilmPostStore} from "@/stores/film-post.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useTagTypeStore} from "@/stores/tag-type.ts";
import {useTagStore} from "@/stores/tag.ts";

const tagTypeStore = useTagTypeStore()
const tagStore=useTagStore()
const router = useRouter()
const toast = useToast()
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
// Category Management - Tree Structure
const categoryTree = computed(() => categoryStore.categoryTree)
const isLoading = ref(false)
const isDragging = ref(false)
const showStatusDropdown = ref(false)
const showCategoryDropdown = ref(false)
const newTag = ref('')
const postStore=useFilmPostStore()
const categories = computed(() => categoryStore.categories)

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  status: 'draft',
  publishDate: '',
  category: '',
  categoryId:'',
  tags: [],
  thumbnail: '',
  slug: '',
  metaTitle: '',
  metaDescription: ''
})

const errors = ref({
  title: '',
  excerpt: '',
  content: '',
  category: ''
})

const formatPersianDate = (date) => {
  if (!date) return ''
  return date
}

const getContentLength = () => {
  // Strip HTML tags to get text length
  const textContent = form.value.content.replace(/<[^>]*>/g, '')
  return textContent.length
}

const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const selectCategory = (category) => {
  form.value.category = category
  form.value.categoryId = category.id
  showCategoryDropdown.value = false
  errors.value.category = ''
}

const getStatusLabel = (status) => {
  return status === 'published' ? 'منتشر شده' : 'پیش‌نویس'
}

const generateSlug = () => {
  if (!form.value.title) {
    toast.warning('ابتدا عنوان را وارد کنید', 'برای تولید اسلاگ نیاز به عنوان است')
    return
  }
  
  // Convert Persian to English letters and create slug
  const persianToEnglish = {
    'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
    'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
    'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
    'ی': 'y', 'ئ': 'y', ' ': '-'
  }
  
  let slug = form.value.title.toLowerCase()
  for (const [persian, english] of Object.entries(persianToEnglish)) {
    slug = slug.replace(new RegExp(persian, 'g'), english)
  }
  
  slug = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  form.value.slug = slug
  
  if (!form.value.metaTitle) {
    form.value.metaTitle = form.value.title
  }
  
  toast.success('اسلاگ تولید شد', 'نامک URL از عنوان ساخته شد')
}

const generateExcerpt = () => {
  if (!form.value.content) {
    toast.warning('ابتدا محتوا را وارد کنید', 'برای تولید خلاصه نیاز به محتوا است')
    return
  }
  
  // Extract text from HTML content
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = form.value.content
  const plainText = (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim()
  
  form.value.excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')
  
  if (!form.value.metaDescription) {
    form.value.metaDescription = form.value.excerpt
  }
  
  toast.success('خلاصه تولید شد', 'از 150 کاراکتر اول محتوا')
}

function addTag(tagName) {
  const tag = tagName || newTag.value.trim()
  if (!tag) return

  if (!form.value.tags.includes(tag)) {
    form.value.tags.push(tag)

    // اگر تگ از پیشنهادات بود، شمارنده زیاد بشه
    if (tagStore.tags.some(t => t.name === tag)) {
      tagStore.incrementTagCount(tag)
    }
  }
  newTag.value = ''
}

const removeTag = async (index) => {
  const tagName = form.value.tags[index]
  const tagObj = tagStore.tags.find(t => t.name === tagName)
  if (tagObj) {
    await tagStore.decrementTagCount(tagObj.id)
  }
  form.value.tags.splice(index, 1)
}

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'لطفاً یک فایل کوچکتر انتخاب کنید')
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('فقط فایل‌های تصویری مجاز هستند', 'فرمت‌های مجاز: JPG, PNG, WebP')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.thumbnail = e.target.result
    toast.success('تصویر آپلود شد', 'تصویر شاخص با موفقیت افزوده شد')
  }
  reader.readAsDataURL(file)
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'لطفاً یک فایل کوچکتر انتخاب کنید')
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('فقط فایل‌های تصویری مجاز هستند', 'فرمت‌های مجاز: JPG, PNG, WebP')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.thumbnail = e.target.result
    toast.success('تصویر آپلود شد', 'تصویر شاخص با موفقیت افزوده شد')
  }
  reader.readAsDataURL(file)
}

const validateForm = () => {
  let isValid = true
  errors.value = { title: '', excerpt: '', content: '', category: '' }

  if (!form.value.title.trim()) {
    errors.value.title = 'عنوان الزامی است'
    isValid = false
  }

  if (!form.value.content.trim()) {
    errors.value.content = 'محتوا الزامی است'
    isValid = false
  }

  if (!form.value.category) {
    errors.value.category = 'انتخاب دسته‌بندی الزامی است'
    isValid = false
  }

  return isValid
}

const goBack = () => {
  router.back()
}

const saveDraft = () => {
  form.value.status = 'draft'
  publishPost()
}

const publishPost = async () => {
  if (!validateForm()) {
    toast.warning('لطفاً فیلدهای الزامی را پر کنید', 'عنوان، محتوا و دسته‌بندی الزامی هستند')
    return
  }

  isLoading.value = true

  console.log('Creating post:', form.value)
  await postStore.addPost(form.value)
  isLoading.value = false
  if (form.value.status === 'draft') {
    toast.success('پیش‌نویس ذخیره شد!', 'نوشته به عنوان پیش‌نویس ذخیره گردید')
  } else {
    toast.success('نوشته منتشر شد!', 'نوشته شما با موفقیت منتشر شد')
  }
  await router.push('/dashboard/film/posts')

}


// Initialize
onMounted(async () => {
  await categoryTypeStore.fetchType('post')
  await tagTypeStore.fetchType('post')
  // Persian DatePicker handles default date automatically
  // No need for manual initialization
})

watch(
    () => tagTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await tagStore.fetchTags({typeId: type.id,contentType:'film'})
      }
    },
    {immediate: true}
)

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategoryTree(type.id,'film')
        await categoryStore.fetchCategories({typeId: type.id,contentType:'film'})
      }
    },
    {immediate: true}
)

</script>
