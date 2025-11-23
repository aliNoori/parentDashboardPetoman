<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ویرایش نوشته</h1>
        <p class="text-gray-600 mt-1">ویرایش و به‌روزرسانی نوشته</p>
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
        <button @click="updatePost" class="btn-primary">
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
          <label class="block text-sm font-medium text-gray-700 mb-2">عنوان نوشته</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="عنوان جذاب برای نوشته خود وارد کنید..."
            class="input-field"
          >
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">خلاصه نوشته</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="خلاصه‌ای جذاب و مختصر از محتوای نوشته..."
            class="input-field resize-none"
          ></textarea>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">محتوای نوشته</label>
          <textarea
            v-model="form.content"
            rows="15"
            placeholder="محتوای کامل نوشته خود را بنویسید..."
            class="input-field resize-none font-['Vazirmatn']"
          ></textarea>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">آمار نوشته</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ form.views || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">بازدید</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ form.likes || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">لایک</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ form.comments || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">نظر</p>
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
          <h3 class="text-lg font-bold text-gray-900 mb-4">دسته‌بندی</h3>
          <div class="relative">
            <button
              @click="showCategoryDropdown = !showCategoryDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
            >
              <span class="text-gray-700">{{ form.category || 'انتخاب دسته‌بندی' }}</span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <ul
              v-if="showCategoryDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <li
                v-for="category in categories"
                :key="category"
                @click="selectCategory(category)"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                {{ category }}
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">برچسب‌ها</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="hover:text-purple-900">
                <i class="ti ti-x text-xs"></i>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              @keypress.enter="addTag"
              type="text"
              placeholder="برچسب جدید..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
            <button @click="addTag" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <i class="ti ti-plus"></i>
            </button>
          </div>
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
          <h3 class="text-lg font-bold text-gray-900 mb-4">نظرات</h3>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.commentsEnabled"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span class="text-gray-700">امکان ثبت نظر</span>
          </label>
        </div>

        <div class="bg-white rounded-xl border border-red-200 p-6">
          <h3 class="text-lg font-bold text-red-600 mb-4">حذف نوشته</h3>
          <p class="text-sm text-gray-600 mb-4">با حذف نوشته، تمام نظرات و داده‌های آن نیز حذف می‌شود.</p>
          <button @click="deletePost" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            <i class="ti ti-trash ml-2"></i>
            حذف دائمی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../../../composables/useToast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(true)
const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)
const newTag = ref('')

const categories = ref([
  'فیلم',
  'سریال',
  'انیمیشن',
  'مستند',
  'نقد و بررسی',
  'اخبار',
  'مصاحبه',
  'آموزشی'
])

const form = ref({
  id: null,
  title: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  category: '',
  tags: [],
  status: 'draft',
  commentsEnabled: true,
  views: 0,
  likes: 0,
  comments: 0
})

onMounted(() => {
  loadPost()
})

const loadPost = () => {
  loading.value = true
  const postId = route.params.id
  
  setTimeout(() => {
    form.value = {
      id: postId,
      title: 'بررسی فیلم The Shawshank Redemption',
      excerpt: 'یکی از بهترین فیلم‌های تاریخ سینما که داستان امید و دوستی را روایت می‌کند',
      content: 'محتوای کامل نوشته درباره این فیلم استثنایی...\n\nاین فیلم که در سال 1994 ساخته شد، یکی از محبوب‌ترین آثار سینمایی است.',
      thumbnail: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      category: 'نقد و بررسی',
      tags: ['فیلم', 'درام', 'کلاسیک'],
      status: 'published',
      commentsEnabled: true,
      views: 5420,
      likes: 328,
      comments: 42
    }
    loading.value = false
  }, 1000)
}

const selectCategory = (category) => {
  form.value.category = category
  showCategoryDropdown.value = false
}

const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const getStatusLabel = (status) => {
  return status === 'published' ? 'منتشر شده' : 'پیش‌نویس'
}

const addTag = () => {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
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
  updatePost()
}

const updatePost = () => {
  if (!form.value.title) {
    toast.warning('لطفاً عنوان نوشته را وارد کنید', 'عنوان الزامی است')
    return
  }

  console.log('Updating post:', form.value)
  toast.success('نوشته با موفقیت به‌روزرسانی شد!', 'تغییرات ذخیره گردید')
  setTimeout(() => {
    router.push('/dashboard/film/posts')
  }, 1000)
}

const deletePost = () => {
  if (confirm('آیا از حذف این نوشته اطمینان دارید؟')) {
    console.log('Deleting post:', form.value.id)
    toast.success('نوشته با موفقیت حذف شد', 'تغییرات اعمال گردید')
    setTimeout(() => {
      router.push('/dashboard/film/posts')
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
