<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">وارد کردن فیلم از API</h1>
        <p class="text-gray-600 mt-1">جستجو و وارد کردن فیلم‌ها از OMDB</p>
      </div>
      <button @click="$emit('back')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
        <i class="ti ti-arrow-right"></i>
        بازگشت
      </button>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex gap-3">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            @keyup.enter="searchMovies"
            type="text"
            placeholder="نام فیلم یا سریال را جستجو کنید..."
            class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <i class="ti ti-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
          @click="searchMovies"
          :disabled="loading || !searchQuery"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <i class="ti ti-search"></i>
          جستجو
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p class="text-gray-600 mt-4">در حال جستجو...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6">
      <div class="flex items-start gap-3">
        <i class="ti ti-alert-circle text-red-600 text-2xl"></i>
        <div>
          <h3 class="font-bold text-red-900 mb-1">خطا در جستجو</h3>
          <p class="text-red-700">{{ error }}</p>
          <p class="text-sm text-red-600 mt-2">لطفاً از تنظیمات، API Key را بررسی کنید</p>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="results.length > 0" class="space-y-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="font-bold text-gray-900">نتایج جستجو ({{ results.length }} مورد)</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="movie in results"
          :key="movie.id || movie.imdbID"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="aspect-[2/3] bg-gray-100 relative">
            <img
              v-if="movie.Poster"
              :src="movie.Poster"
              :alt="movie.Title"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="ti ti-photo text-4xl text-gray-400"></i>
            </div>
            
            <!-- Rating Badge -->
            <div class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
              <i class="ti ti-star-filled"></i>
              {{ movie.imdbRating }}
            </div>
          </div>

          <div class="p-4">
            <h3 class="font-bold text-gray-900 mb-1 line-clamp-1">
              {{ movie.Title }}
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              {{ movie.Year }}
            </p>
            <p class="text-sm text-gray-600 line-clamp-2 mb-4">
              {{ movie.Plot }}
            </p>

            <button
              @click="importMovie(movie)"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-download"></i>
              وارد کردن
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="searched" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <i class="ti ti-search-off text-5xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-bold text-gray-900 mb-2">نتیجه‌ای یافت نشد</h3>
      <p class="text-gray-600">لطفاً کلمات کلیدی دیگری را امتحان کنید</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useMovieAPI } from '../../../composables/useMovieAPI'

const emit = defineEmits(['back', 'import'])
const toast = inject('toast')

const {
  loading,
  error,
  searchOMDBMovie,
  convertOMDBToLocal
} = useMovieAPI()

const searchQuery = ref('')
const results = ref([])
const searched = ref(false)

const searchMovies = async () => {
  if (!searchQuery.value.trim()) return

  searched.value = true
  results.value = []

  try {
    // OMDB doesn't have a search endpoint, so we search by title
    const data = await searchOMDBMovie(searchQuery.value)
    results.value = [data]
  } catch (e) {
    console.error('Search error:', e)
  }
}

const importMovie = (movie) => {
  const converted = convertOMDBToLocal(movie)

  console.log('Imported Movie:', converted)
  
  toast.success('فیلم با موفقیت وارد شد!', 'اطلاعات در Console قابل مشاهده است')
  
  // می‌توانید اطلاعات را به فرم MovieCreate ارسال کنید
  emit('import', converted)
}
</script>
