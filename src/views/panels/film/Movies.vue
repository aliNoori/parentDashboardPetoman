<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">فیلم‌ها و سریال‌ها</h1>
        <p class="text-gray-600 mt-1">مدیریت محتوای ویدیویی</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="showCreateModal = true" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
          <i class="ti ti-plus ml-2"></i>
          محتوای جدید
        </button>
        <button @click="exportToExcel" class="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex gap-2 p-2">
          <button
            @click="activeTab = 'movies'"
            class="px-4 py-2.5 rounded-lg font-medium transition-colors"
            :class="activeTab === 'movies' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <i class="ti ti-movie ml-2"></i>
            فیلم‌ها
            <span class="mr-2 text-xs px-2 py-0.5 rounded-full" :class="activeTab === 'movies' ? 'bg-purple-100' : 'bg-gray-100'">
              {{ stats.movies }}
            </span>
          </button>
          <button
            @click="activeTab = 'series'"
            class="px-4 py-2.5 rounded-lg font-medium transition-colors"
            :class="activeTab === 'series' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <i class="ti ti-device-tv ml-2"></i>
            سریال‌ها
            <span class="mr-2 text-xs px-2 py-0.5 rounded-full" :class="activeTab === 'series' ? 'bg-purple-100' : 'bg-gray-100'">
              {{ stats.series }}
            </span>
          </button>

        </nav>
      </div>

      <!-- Filters and Search -->
      <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجوی فیلم یا سریال..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
          <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        <div class="relative">
          <button
            @click="showStatusDropdown = !showStatusDropdown"
            class="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center w-full justify-between"
          >
            <span class="truncate">{{ selectedStatus.label }}</span>
            <i class="ti ti-chevron-down text-sm flex-shrink-0 ml-2"></i>
          </button>
          <ul v-if="showStatusDropdown" class="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full">
            <li v-for="status in statusOptions" :key="status.value">
              <button
                @click="selectStatus(status)"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-right w-full"
                :class="selectedStatus.value === status.value ? 'bg-purple-50 text-purple-600' : ''"
              >
                {{ status.label }}
              </button>
            </li>
          </ul>
        </div>

        <div class="relative">
          <button
            @click="showCategoryDropdown = !showCategoryDropdown"
            class="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center w-full justify-between"
          >
            <span class="truncate">{{ selectedCategory.label }}</span>
            <i class="ti ti-chevron-down text-sm flex-shrink-0 ml-2"></i>
          </button>
          <ul v-if="showCategoryDropdown" class="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full">
            <li v-for="category in categoryOptions" :key="category.value">
              <button
                @click="selectCategory(category)"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-right w-full"
                :class="selectedCategory.value === category.value ? 'bg-purple-50 text-purple-600' : ''"
              >
                {{ category.label }}
              </button>
            </li>
          </ul>
        </div>

        <div class="relative">
          <button
            @click="showDateDropdown = !showDateDropdown"
            class="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center w-full justify-between"
          >
            <span class="truncate">{{ selectedDate.label }}</span>
            <i class="ti ti-chevron-down text-sm flex-shrink-0 ml-2"></i>
          </button>
          <ul v-if="showDateDropdown" class="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full">
            <li v-for="date in dateOptions" :key="date.value">
              <button
                @click="selectDate(date)"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-right w-full"
                :class="selectedDate.value === date.value ? 'bg-purple-50 text-purple-600' : ''"
              >
                {{ date.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Movies List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">عنوان</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">دسته‌بندی</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">وضعیت</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">بازدید</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="movies.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <i class="ti ti-movie-off text-4xl mb-2 block"></i>
                <p>هنوز فیلمی ایجاد نشده است</p>
              </td>
            </tr>
            <tr v-for="movie in filteredMovies" :key="movie.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="movie.image || 'https://via.placeholder.com/40x40'"
                    :alt="movie.title"
                    class="w-10 h-10 rounded-lg object-cover"
                  >
                  <div>
                    <p class="font-medium text-gray-900">{{ movie.title }}</p>
                    <p class="text-sm text-gray-500">{{ movie.excerpt }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {{ movie.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusColor(movie.status)"
                >
                  {{ getStatusLabel(movie.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-900">{{ movie.views }}</td>
              <td class="px-6 py-4 text-gray-900">{{ movie.date }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="editMovie(movie)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <i class="ti ti-edit text-sm"></i>
                  </button>
                  <button 
                    @click="deleteMovie(movie)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <i class="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="lg:hidden divide-y divide-gray-200">
        <div v-if="movies.length === 0" class="p-8 text-center">
          <i class="ti ti-movie-off text-4xl mb-2 block text-gray-400"></i>
          <p class="text-gray-500">هنوز فیلمی ایجاد نشده است</p>
        </div>
        <div v-for="movie in filteredMovies" :key="movie.id" class="p-4">
          <div class="flex items-start gap-3">
            <img
              :src="movie.image || 'https://via.placeholder.com/60x60'"
              :alt="movie.title"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            >
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 truncate">{{ movie.title }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ movie.excerpt }}</p>
              <div class="flex items-center gap-4 mt-3 text-sm">
                <span class="text-gray-600">{{ movie.views }} بازدید</span>
                <span class="text-gray-600">{{ movie.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const showStatusDropdown = ref(false)
const showCategoryDropdown = ref(false)
const showDateDropdown = ref(false)

const stats = ref({
  total: 0,
  published: 0,
  draft: 0,
  todayViews: 0
})

const selectedStatus = ref({ value: 'all', label: 'همه وضعیت‌ها' })
const selectedCategory = ref({ value: 'all', label: 'همه دسته‌ها' })
const selectedDate = ref({ value: 'all', label: 'همه تاریخ‌ها' })

const statusOptions = ref([
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'published', label: 'منتشر شده' },
  { value: 'draft', label: 'پیش‌نویس' }
])

const categoryOptions = ref([
  { value: 'all', label: 'همه دسته‌ها' },
  { value: 'action', label: 'اکشن' },
  { value: 'comedy', label: 'کمدی' },
  { value: 'drama', label: 'درام' }
])

const dateOptions = ref([
  { value: 'all', label: 'همه تاریخ‌ها' },
  { value: 'today', label: 'امروز' },
  { value: 'week', label: 'این هفته' },
  { value: 'month', label: 'این ماه' }
])

const movies = ref([])

const filteredMovies = computed(() => {
  let filtered = movies.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedStatus.value.value !== 'all') {
    filtered = filtered.filter(m => m.status === selectedStatus.value.value)
  }
  
  if (selectedCategory.value.value !== 'all') {
    filtered = filtered.filter(m => m.category === selectedCategory.value.value)
  }
  
  return filtered
})

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const selectCategory = (category) => {
  selectedCategory.value = category
  showCategoryDropdown.value = false
}

const selectDate = (date) => {
  selectedDate.value = date
  showDateDropdown.value = false
}

const getStatusColor = (status) => {
  const colors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'منتشر شده',
    draft: 'پیش‌نویس'
  }
  return labels[status] || status
}

const createNewMovie = () => {
  window.dispatchEvent(new CustomEvent('navigate-to-movie-create'))
}

const editMovie = (movie) => {
  console.log('Edit movie:', movie)
}

const deleteMovie = (movie) => {
  console.log('Delete movie:', movie)
}

const exportToExcel = () => {
  console.log('Export to Excel')
}
</script>
