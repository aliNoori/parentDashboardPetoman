<template>
  <div class="p-6">
    <!-- Header -->
    <div class="sticky top-0 lg:top-[73px] bg-gray-50 z-30 -mx-6 px-6 py-4 mb-2 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'ویرایش مستند' : 'افزودن مستند جدید' }}</h2>
          <p class="text-gray-600 mt-1">اطلاعات ویدیوی مستند را با دقت وارد کنید</p>
        </div>
        <button
            @click="emit('navigate', 'documentaries')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <i class="ti ti-arrow-right"></i>
          بازگشت
        </button>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-info-circle text-rose-600"></i>
          اطلاعات اصلی
        </h3>

        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              عنوان مستند <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="عنوان جذاب و گویا برای مستند"
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              توضیحات <span class="text-red-500">*</span>
            </label>
            <textarea
                v-model="form.description"
                required
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder="توضیحات کامل درباره محتوای ویدیو..."
            ></textarea>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی <span class="text-red-500">*</span>
            </label>
            <select
                v-model="form.category"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">انتخاب دسته‌بندی</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.title">
                {{ cat.title }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Media -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-photo text-rose-600"></i>
          تصویر شاخص و ویدیو
        </h3>

        <div class="space-y-4">
          <!-- Thumbnail -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              تصویر شاخص (Thumbnail) <span class="text-red-500">*</span>
            </label>
            <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors">
              <div v-if="form.thumbnailPreview" class="mb-4">
                <img :src="form.thumbnailPreview" alt="Preview" class="max-h-48 mx-auto rounded-lg">
                <button
                    type="button"
                    @click="removeThumbnail"
                    class="mt-2 text-red-600 hover:text-red-700 text-sm"
                >
                  <i class="ti ti-trash"></i>
                  حذف تصویر
                </button>
              </div>
              <div v-else>
                <i class="ti ti-cloud-upload text-4xl text-gray-400 mb-2"></i>
                <p class="text-sm text-gray-600 mb-2">تصویر شاخص ویدیو را آپلود کنید</p>
                <input
                    type="file"
                    @change="handleThumbnailUpload"
                    accept="image/*"
                    class="hidden"
                    ref="thumbnailInput"
                >
                <button
                    type="button"
                    @click="$refs.thumbnailInput.click()"
                    class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  انتخاب فایل
                </button>
                <p class="text-xs text-gray-500 mt-2">فرمت‌های مجاز: JPG, PNG, WebP (حداکثر 2MB)</p>
              </div>
            </div>
          </div>

          <!-- Video URL or Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              روش آپلود ویدیو <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4 mb-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    v-model="form.videoUploadMethod"
                    type="radio"
                    value="url"
                    class="text-rose-600 focus:ring-rose-500"
                >
                <span class="text-sm text-gray-700">لینک ویدیو</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    v-model="form.videoUploadMethod"
                    type="radio"
                    value="file"
                    class="text-rose-600 focus:ring-rose-500"
                >
                <span class="text-sm text-gray-700">آپلود فایل</span>
              </label>
            </div>

            <!-- URL Input -->
            <div v-if="form.videoUploadMethod === 'url'">
              <input
                  v-model="form.videoUrl"
                  type="url"
                  :required="form.videoUploadMethod === 'url'"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="https://example.com/video.mp4"
              >
              <p class="text-xs text-gray-500 mt-1">لینک مستقیم فایل ویدیو یا لینک YouTube/Aparat</p>
            </div>

            <!-- File Upload -->
            <div v-else>
              <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors">
                <div v-if="form.videoFile" class="mb-4">
                  <div class="flex items-center justify-center gap-3 mb-2">
                    <i class="ti ti-file-video text-3xl text-rose-600"></i>
                    <div class="text-right">
                      <!-- نمایش پیش‌نمایش ویدیو -->
                      <div v-if="form.videoUrl" class="mt-4">
                        <video
                            :src="form.videoUrl"
                            controls
                            class="w-full max-h-96 rounded-lg border border-gray-300"
                        >
                          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                        </video>
                      </div>
                      <p class="text-sm font-medium text-gray-900">{{ form.videoFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(form.videoFile.size) }}</p>
                    </div>
                  </div>
                  <button
                      type="button"
                      @click="removeVideoFile"
                      class="text-red-600 hover:text-red-700 text-sm"
                  >
                    <i class="ti ti-trash"></i>
                    حذف فایل
                  </button>
                </div>
                <div v-else>
                  <i class="ti ti-cloud-upload text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-600 mb-2">فایل ویدیو را آپلود کنید</p>
                  <input
                      type="file"
                      @change="handleVideoUpload"
                      accept="video/*"
                      class="hidden"
                      ref="videoInput"
                  >
                  <button
                      type="button"
                      @click="$refs.videoInput.click()"
                      class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    انتخاب فایل ویدیو
                  </button>
                  <p class="text-xs text-gray-500 mt-2">فرمت‌های مجاز: MP4, WebM, MOV (حداکثر 500MB)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              مدت زمان ویدیو <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.duration"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="مثال: 08:45 یا 12:30"
                pattern="[0-9]{1,2}:[0-9]{2}"
            >
            <p class="text-xs text-gray-500 mt-1">فرمت: دقیقه:ثانیه (مثلاً 08:45)</p>
          </div>
        </div>
      </div>

      <!-- Tags and Meta -->

      <div class="bg-white p-6 rounded-lg border border-gray-200">

        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><i
            class="ti ti-tags text-rose-600"></i> برچسب‌ها و تاریخ </h3>

        <label class="block text-sm font-medium text-gray-700 mb-2"> برچسب‌ها (Tags) </label>
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

      <!-- SEO Settings -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-seo text-rose-600"></i>
          تنظیمات سئو (SEO)
        </h3>

        <div class="space-y-4">
          <!-- SEO Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              عنوان سئو (Meta Title)
            </label>
            <input
                v-model="form.seoTitle"
                type="text"
                maxlength="60"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="عنوان برای موتورهای جستجو"
            >
            <div class="flex justify-between items-center mt-1">
              <p class="text-xs text-gray-500">عنوانی که در نتایج گوگل نمایش داده می‌شود</p>
              <span class="text-xs" :class="form.seoTitle.length > 60 ? 'text-red-500' : 'text-gray-500'">
                {{ form.seoTitle.length }}/60
              </span>
            </div>
          </div>

          <!-- SEO Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              توضیحات سئو (Meta Description)
            </label>
            <textarea
                v-model="form.seoDescription"
                rows="3"
                maxlength="160"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder="توضیحات کوتاه برای موتورهای جستجو"
            ></textarea>
            <div class="flex justify-between items-center mt-1">
              <p class="text-xs text-gray-500">توضیحات کوتاه که در نتایج گوگل نمایش داده می‌شود</p>
              <span class="text-xs" :class="form.seoDescription.length > 160 ? 'text-red-500' : 'text-gray-500'">
                {{ form.seoDescription.length }}/160
              </span>
            </div>
          </div>

          <!-- SEO Keywords -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              کلمات کلیدی (Keywords)
            </label>
            <input
                v-model="form.seoKeywords"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="کلمات کلیدی را با کاما جدا کنید"
            >
            <p class="text-xs text-gray-500 mt-1">مثال: نجات حیوانات, مستند, سگ, گربه</p>
          </div>

          <!-- SEO Slug/URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              آدرس URL (Slug)
            </label>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">/documentaries/</span>
              <input
                  v-model="form.slug"
                  type="text"
                  pattern="[a-z0-9\-]+"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="url-friendly-title"
                  @input="validateSlug"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">فقط حروف انگلیسی کوچک، اعداد و خط تیره (-)</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-4">
        <button
            type="button"
            @click="emit('navigate', 'documentaries')"
            class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          انصراف
        </button>
        <button
            type="submit"
            class="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
        >
          <i class="ti ti-check"></i>
          {{ isEdit ? 'ذخیره تغییرات' : 'ایجاد مستند' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useDocumentaryStore} from "@/stores/documentary.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useTagStore} from "@/stores/tag.ts";

const emit = defineEmits(['navigate'])
const documentaryStore = useDocumentaryStore()
const tagStore = useTagStore()
const documentary = computed(() => documentaryStore.documentary)
const isEdit = ref(false) // TODO: Check if editing existing documentary
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const form = ref({
  title: '',
  description: '',
  category: '',
  thumbnailPreview: null,
  videoUploadMethod: 'url', // 'url' or 'file'
  videoUrl: '',
  videoFile: null,
  duration: '',
  tags: [],
  publishDate: new Date().toISOString().split('T')[0],
  status: 'draft',
  // SEO Fields
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  slug: ''
})
const categories = computed(() => categoryStore.categories)
const newTag = ref('')
const thumbnailInput = ref(null)
const videoInput = ref(null)

// Methods
const handleThumbnailUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 2 مگابایت باشد')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.thumbnailPreview = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeThumbnail = () => {
  form.value.thumbnailPreview = null
  if (thumbnailInput.value) {
    thumbnailInput.value.value = ''
  }
}

const handleVideoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 500 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 500 مگابایت باشد')
      return
    }
    form.value.videoFile = file
  }
}

const removeVideoFile = () => {
  form.value.videoFile = null
  if (videoInput.value) {
    videoInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const validateSlug = (event) => {
  const input = event.target
  input.value = input.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
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

/*const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    newTag.value = ''
  }
}*/

const removeTag = async (index) => {
  const tagName = form.value.tags[index]
  const tagObj = tagStore.tags.find(t => t.name === tagName)
  if (tagObj) {
    await tagStore.decrementTagCount(tagObj.id)
  }
  form.value.tags.splice(index, 1)
}


const handleSubmit = async () => {
  try {
    const selectedCategory = categories.value.find(
        c => c.slug === form.value.category || c.title === form.value.category
    )

    if (!selectedCategory) {
      alert('لطفاً یک دسته‌بندی معتبر انتخاب کنید!')
      return
    }

    const payload = {
      ...form.value,
      categoryId: selectedCategory.id,
    }

    console.log('Form submitted:', payload)

    if (isEdit.value && documentary.value?.id) {
      // 🔹 حالت ویرایش
      await documentaryStore.updateDocumentary(documentary.value.id, payload)
      alert('✅ تغییرات مستند با موفقیت ذخیره شد!')
    } else {
      // 🔹 حالت ایجاد
      await documentaryStore.addDocumentary(payload)
      alert('✅ مستند با موفقیت ایجاد شد!')
    }

    emit('navigate', 'documentaries')
  } catch (error) {
    console.error('❌ خطا در ارسال فرم:', error)
    alert('مشکلی در ذخیره‌ی مستند پیش آمد.')
  }
}
onMounted(async () => {
  //await documentaryStore.fetchDocumentaries()
  await tagStore.fetchTags()
  await categoryTypeStore.fetchType('document')

  if (documentary.value && documentary.value.id) {
    isEdit.value = true
    // پر کردن فرم با داده‌های مستند
    console.log('tags', documentary.value.tags)
    form.value = {
      title: documentary.value.title || '',
      description: documentary.value.description || '',
      category: documentary.value.category?.title || '',
      thumbnailPreview: documentary.value.thumbnailPreview || null,
      videoUploadMethod: documentary.value.videoUrl ? 'url' : 'file',
      videoUrl: documentary.value.videoUrl || '',
      videoFile: documentary.value.videoUrl || '',
      duration: documentary.value.duration || '',
      tags: documentary.value.tags || [],
      publishDate: documentary.value.publishDate
          ? documentary.value.publishDate.split('T')[0]
          : new Date().toISOString().split('T')[0],
      status: documentary.value.status || 'draft',
      seoTitle: documentary.value.seoTitle || '',
      seoDescription: documentary.value.seoDescription || '',
      seoKeywords: documentary.value.seoKeywords || '',
      slug: documentary.value.slug || ''
    }
  }
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id})
      }
    },
    {immediate: true}
)
</script>
