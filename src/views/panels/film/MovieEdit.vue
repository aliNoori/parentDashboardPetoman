<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ویرایش فیلم</h1>
        <p class="text-gray-600 mt-1">ویرایش اطلاعات فیلم</p>
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
        <button @click="updateMovie" class="btn-primary">
          <i class="ti ti-check ml-2"></i>
          به‌روزرسانی فیلم
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات اصلی</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان فیلم</label>
              <input
                  v-model="form.title"
                  type="text"
                  placeholder="عنوان فیلم فارسی..."
                  class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان انگلیسی</label>
              <input
                  v-model="form.titleEn"
                  type="text"
                  placeholder="English Title..."
                  class="input-field"
                  dir="ltr"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">خلاصه داستان</label>
              <textarea
                  v-model="form.description"
                  rows="5"
                  placeholder="خلاصه داستان فیلم را بنویسید..."
                  class="input-field resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">کارگردان</label>
                <input
                    v-model="form.director"
                    type="text"
                    placeholder="نام کارگردان..."
                    class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">سال تولید</label>
                <input
                    v-model="form.year"
                    type="number"
                    placeholder="2024"
                    class="input-field"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">مدت زمان (دقیقه)</label>
                <input
                    v-model="form.duration"
                    type="number"
                    placeholder="120"
                    class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">امتیاز IMDB</label>
                <input
                    v-model="form.imdbRating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="8.5"
                    class="input-field"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">بازیگران</label>
              <input
                  v-model="form.cast"
                  type="text"
                  placeholder="نام بازیگران را با کاما جدا کنید..."
                  class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لینک تریلر</label>
              <input
                  v-model="form.trailerUrl"
                  type="text"
                  placeholder="https://..."
                  class="input-field"
                  dir="ltr"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لینک دانلود</label>
              <input
                  v-model="form.downloadUrl"
                  type="text"
                  placeholder="https://..."
                  class="input-field"
                  dir="ltr"
              />
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات تکمیلی</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">کشور سازنده</label>
              <input
                  v-model="form.country"
                  type="text"
                  placeholder="نام کشور..."
                  class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">زبان</label>
              <input
                  v-model="form.language"
                  type="text"
                  placeholder="فارسی، انگلیسی، ..."
                  class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">محدودیت سنی</label>
              <input
                  v-model="form.ageRating"
                  type="text"
                  placeholder="مثلا: +13، +18"
                  class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">کلمات کلیدی</label>
              <input
                  v-model="form.keywords"
                  type="text"
                  placeholder="کلمات کلیدی با کاما جدا کنید..."
                  class="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Stats -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">آمار</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 text-sm">بازدیدها</span>
              <span class="font-bold text-gray-900">{{ form.views.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 text-sm">لایک‌ها</span>
              <span class="font-bold text-green-600">{{ form.likes.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 text-sm">نظرات</span>
              <span class="font-bold text-purple-600">{{ form.comments.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Poster -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">پوستر فیلم</label>
          <div class="space-y-3">
            <div v-if="form.poster" class="relative aspect-[2/3] rounded-lg overflow-hidden border-2 border-gray-200">
              <img :src="form.poster" alt="Poster" class="w-full h-full object-cover"/>
              <button
                  @click="form.poster = ''"
                  class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <i class="ti ti-x"></i>
              </button>
            </div>
            <label class="btn-secondary w-full text-center cursor-pointer">
              <i class="ti ti-upload ml-2"></i>
              {{ form.poster ? 'تغییر پوستر' : 'آپلود پوستر' }}
              <input type="file" @change="handlePosterUpload" accept="image/*" class="hidden"/>
            </label>
          </div>
        </div>

        <!-- Category -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">دسته‌بندی</label>
          <div class="relative">
            <button
                @click="showCategoryDropdown = !showCategoryDropdown"
                class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
            >
              <span>{{ selectedCategory || 'انتخاب دسته‌بندی' }}</span>
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
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': form.category === category.title }"
              >
                {{ category.title }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Status -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">وضعیت انتشار</label>
          <div class="relative">
            <button
                @click="showStatusDropdown = !showStatusDropdown"
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

        <!-- Featured -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
                v-model="form.featured"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span class="text-gray-700 font-medium">فیلم ویژه</span>
          </label>
        </div>

        <!-- Delete -->
        <div class="bg-white rounded-xl border border-red-200 p-6">
          <h3 class="text-lg font-bold text-red-600 mb-4">حذف فیلم</h3>
          <p class="text-sm text-gray-600 mb-4">با حذف فیلم، تمام اطلاعات آن نیز حذف می‌شود.</p>
          <button @click="deleteMovie"
                  class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            <i class="ti ti-trash ml-2"></i>
            حذف دائمی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useToast} from "@/composables/useToast.js";
import {useMovieStore} from "@/stores/movie.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";

const router = useRouter()
const route = useRoute()
const toast = useToast()
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const loading = ref(true)
const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)
const selectedCategory = ref()
const categories = computed(() => categoryStore.categories)


const form = ref({
  id: null,
  title: '',
  titleEn: '',
  description: '',
  director: '',
  year: 2024,
  duration: 0,
  imdbRating: 0,
  cast: '',
  trailerUrl: '',
  downloadUrl: '',
  country: '',
  language: '',
  ageRating: '',
  keywords: '',
  poster: '',
  category: '',
  categoryId: '',
  status: 'draft',
  featured: false,
  views: 0,
  likes: 0,
  comments: 0
})
const movieStore = useMovieStore()

onMounted(async () => {
  await categoryTypeStore.fetchType('film')
  const data = movieStore.findById(String(route.params.id))
  if (data == null) {
    await router.push('/dashboard/film/movies')
  }
  selectedCategory.value = data.category.title
  form.value = {
    id: route.params.id,
    type: data.type,
    title: data.title,
    titleEn: data.titleEn,
    description: data.description,
    director: data.director,
    year: data.year,
    duration: data.duration,
    imdbRating: data.imdbRating,
    cast: data.cast,
    trailerUrl: data.trailerUrl,
    downloadUrl: data.downloadUrl,
    country: data.country,
    language: data.language,
    ageRating: data.ageRating,
    keywords: data.keywords,
    poster: data.poster,
    category: data.category.title,
    categoryId: data.category.id,
    status: data.status ?? '',
    featured: data.featured ?? '',
    views: data.views ?? 0,
    likes: data.likes ?? 0,
    comments: data.comments ?? 0
  }
  loading.value = false

})
watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id,contentType:'movie'})
      }
    },
    {immediate: true}
)

const selectCategory = (category) => {
  form.value.categoryId = category.id
  selectedCategory.value = category.title
  showCategoryDropdown.value = false
}

const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const getStatusLabel = (status) => {
  return status === 'published' ? 'منتشر شده' : 'پیش‌نویس'
}

const handlePosterUpload = (event) => {
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
    form.value.poster = e.target.result
  }
  reader.readAsDataURL(file)
}

const goBack = () => {
  router.back()
}

const saveDraft = () => {
  form.value.status = 'draft'
  updateMovie()
}

const updateMovie = async () => {
  if (!form.value.title) {
    toast.warning('لطفاً عنوان فیلم را وارد کنید', 'عنوان الزامی است')
    return
  }

  if (!form.value.description) {
    toast.warning('لطفاً خلاصه داستان را وارد کنید', 'خلاصه داستان الزامی است')
    return
  }

  if (!form.value.categoryId) {
    toast.warning('لطفاً دسته‌بندی را انتخاب کنید', 'انتخاب دسته‌بندی الزامی است')
    return
  }
  await movieStore.updateMovie(form.value)
  toast.success('فیلم با موفقیت به‌روزرسانی شد!', 'تغییرات ذخیره گردید')
  setTimeout(() => {
    router.push('/dashboard/film/movies')
  }, 1000)
}

const deleteMovie = async () => {
  if (confirm('آیا از حذف این فیلم اطمینان دارید؟ این عمل غیرقابل بازگشت است!')) {
    console.log('Deleting movie:', form.value.id)
    await movieStore.removeMovie(form.value.id)
    toast.success('فیلم با موفقیت حذف شد', 'تغییرات اعمال گردید')
    setTimeout(() => {
      router.push('/dashboard/film/movies')
    }, 1000)
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors;
}

.btn-primary {
  @apply px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center;
}

.btn-secondary {
  @apply px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center;
}
</style>
