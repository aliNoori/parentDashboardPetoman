<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت سریال‌ها</h1>
        <p class="text-gray-600 mt-1">مدیریت سریال‌ها، فصل‌ها و قسمت‌ها</p>
      </div>
      <div class="flex gap-3">
        <button @click="$router.push('/dashboard/film/series/create')" class="btn-primary">
          <i class="ti ti-plus ml-2"></i>
          سریال جدید
        </button>
        <button @click="exportToExcel" class="btn-secondary">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل سریال‌ها</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-device-tv text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">در حال پخش</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.ongoing }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-play text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">پایان یافته</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ stats.completed }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-check text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل قسمت‌ها</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ stats.totalEpisodes }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-list text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در سریال‌ها..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div class="relative">
          <button
              @click="showCategoryDropdown = !showCategoryDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
          >
            <span class="text-gray-700">{{ selectedCategory || 'همه دسته‌بندی‌ها' }}</span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <ul
              v-if="showCategoryDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <li
                @click="selectCategory(null)"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              همه دسته‌بندی‌ها
            </li>
            <li
                v-for="category in categories"
                :key="category.id"
                @click="selectCategory(category.name)"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              {{ category.name }}
            </li>
          </ul>
        </div>

        <div class="relative">
          <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
          >
            <span class="text-gray-700">{{ getStatusLabel(selectedStatus) }}</span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <ul
              v-if="showStatusDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li
                @click="selectStatus('all')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              همه وضعیت‌ها
            </li>
            <li
                @click="selectStatus('ongoing')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              در حال پخش
            </li>
            <li
                @click="selectStatus('completed')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              پایان یافته
            </li>
            <li
                @click="selectStatus('upcoming')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              به زودی
            </li>
          </ul>
        </div>

        <div class="relative">
          <button
              @click="showSortDropdown = !showSortDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
          >
            <span class="text-gray-700">{{ getSortLabel(sortBy) }}</span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <ul
              v-if="showSortDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li
                @click="selectSort('newest')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              جدیدترین
            </li>
            <li
                @click="selectSort('oldest')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              قدیمی‌ترین
            </li>
            <li
                @click="selectSort('views')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              پربازدیدترین
            </li>
            <li
                @click="selectSort('rating')"
                class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              بهترین امتیاز
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Series Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-if="filteredSeries.length === 0" class="col-span-full">
        <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <i class="ti ti-device-tv-off text-6xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 text-lg mb-4">هنوز سریالی ایجاد نشده است</p>
          <button @click="$router.push('/dashboard/film/series/create')" class="btn-primary">
            <i class="ti ti-plus ml-2"></i>
            ایجاد اولین سریال
          </button>
        </div>
      </div>

      <div
          v-for="series in filteredSeries"
          :key="series.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
      >
        <div class="relative aspect-[2/3] overflow-hidden bg-gray-100">
          <img
              v-if="series.poster"
              :src="series.poster"
              :alt="series.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="ti ti-photo text-gray-400 text-4xl"></i>
          </div>

          <div class="absolute top-2 right-2 flex gap-2">
            <span
                :class="getStatusBadgeColor(series.status)"
                class="px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
            >
              {{ getStatusLabel(series.status) }}
            </span>
          </div>

          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div class="flex items-center gap-2 text-white text-xs">
              <div class="flex items-center gap-1">
                <i class="ti ti-star-filled text-yellow-400"></i>
                <span>{{ series.rating || '0.0' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="ti ti-eye"></i>
                <span>{{ formatNumber(series.views) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-bold text-gray-900 mb-1 line-clamp-1">{{ series.title }}</h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ series.description }}</p>

          <div class="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded">{{ series.category }}</span>
            <span>{{ series.seasons }} فصل</span>
            <span>{{ series.episodes }} قسمت</span>
          </div>

          <div class="flex gap-2">
            <button
                @click="$router.push(`/dashboard/film/series/edit/${series.id}`)"
                class="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
            >
              <i class="ti ti-edit ml-1"></i>
              ویرایش
            </button>
            <button
                @click="viewSeasons(series)"
                class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <i class="ti ti-list ml-1"></i>
              فصل‌ها
            </button>
            <button
                @click="deleteSeries(series.id)"
                class="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Seasons Modal -->
    <div
        v-if="showSeasonsModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showSeasonsModal = false"
    >
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">فصل‌های {{ selectedSeries?.title }}</h2>
            <p class="text-sm text-gray-600 mt-1">مدیریت فصل‌ها و قسمت‌ها</p>
          </div>
          <button
              @click="showSeasonsModal = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <button
              @click="addSeason"
              class="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors font-medium"
          >
            <i class="ti ti-plus ml-2"></i>
            افزودن فصل جدید
          </button>

          <div v-if="selectedSeries?.seasonsList?.length === 0" class="text-center py-12 text-gray-500">
            <i class="ti ti-folder-off text-4xl mb-2 block"></i>
            <p>هنوز فصلی اضافه نشده است</p>
          </div>

          <div
              v-for="(season, index) in selectedSeries?.seasonsList"
              :key="index"
              class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
                @click="toggleSeason(index)"
                class="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span
                    class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </span>
                <div>
                  <h4 class="font-bold text-gray-900">فصل {{ season.number }} - {{ season.title }}</h4>
                  <p class="text-xs text-gray-500">{{ season.episodes?.length || 0 }} قسمت</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                    @click.stop="editSeason(index)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <i class="ti ti-edit"></i>
                </button>
                <button
                    @click.stop="removeSeason(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <i class="ti ti-trash"></i>
                </button>
                <i
                    :class="expandedSeasons.includes(index) ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                    class="text-gray-600"
                ></i>
              </div>
            </div>

            <div v-if="expandedSeasons.includes(index)" class="p-4 space-y-3">
              <button
                  @click="addEpisode(index)"
                  class="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm"
              >
                <i class="ti ti-plus ml-2"></i>
                افزودن قسمت
              </button>

              <div v-if="!season.episodes || season.episodes.length === 0"
                   class="text-center py-6 text-gray-400 text-sm">
                <i class="ti ti-movie-off text-2xl mb-1 block"></i>
                <p>هنوز قسمتی اضافه نشده</p>
              </div>

              <div
                  v-for="(episode, epIndex) in season.episodes"
                  :key="epIndex"
                  class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <span
                    class="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                  {{ episode.number }}
                </span>
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900 text-sm">{{ episode.title }}</h5>
                  <p class="text-xs text-gray-500">مدت زمان: {{ episode.duration }} دقیقه</p>
                </div>
                <div class="flex gap-2">
                  <button
                      @click="editEpisode(index, epIndex)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <i class="ti ti-edit text-sm"></i>
                  </button>
                  <button
                      @click="removeEpisode(index, epIndex)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <i class="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from "@/composables/useToast.js";
import {useSeriesStore} from "@/stores/series.ts";

const router = useRouter()
const toast = useToast()

// State
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedStatus = ref('all')
const sortBy = ref('newest')
const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)
const showSortDropdown = ref(false)
const showSeasonsModal = ref(false)
const selectedSeries = ref(null)
const expandedSeasons = ref([])

// Stats
const stats = ref({
  total: 8,
  ongoing: 5,
  completed: 3,
  totalEpisodes: 302
})

// Categories
const categories = ref([
  {id: 1, name: 'اکشن'},
  {id: 2, name: 'کمدی'},
  {id: 3, name: 'درام'},
  {id: 4, name: 'علمی تخیلی'},
  {id: 5, name: 'ترسناک'},
  {id: 6, name: 'انیمیشن'},
  {id: 7, name: 'فانتزی'}
])
const seriesStore = useSeriesStore()
const series = computed(() => seriesStore.seriesList)
// Series Data
/*const series = ref([
  {
    id: 1,
    title: 'سریال Breaking Bad',
    description: 'داستان معلم شیمی که به تولید مواد مخدر می‌پردازد',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    category: 'درام',
    status: 'completed',
    rating: 9.5,
    views: 125000,
    seasons: 5,
    episodes: 62,
    seasonsList: [
      {
        number: 1,
        title: 'آغاز',
        episodes: [
          { number: 1, title: 'Pilot', duration: 58 },
          { number: 2, title: 'The Cat\'s in the Bag', duration: 48 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'سریال Game of Thrones',
    description: 'نبرد خاندان‌ها برای تصاحب تخت آهنین',
    poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    category: 'درام',
    status: 'completed',
    rating: 9.3,
    views: 250000,
    seasons: 8,
    episodes: 73,
    seasonsList: []
  },
  {
    id: 3,
    title: 'سریال Stranger Things',
    description: 'ماجراهای عجیب در شهر کوچک',
    poster: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    category: 'علمی تخیلی',
    status: 'ongoing',
    rating: 8.7,
    views: 180000,
    seasons: 4,
    episodes: 34,
    seasonsList: []
  },
  {
    id: 4,
    title: 'سریال The Crown',
    description: 'داستان ملکه الیزابت دوم و خاندان سلطنتی',
    poster: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
    category: 'درام',
    status: 'completed',
    rating: 8.6,
    views: 95000,
    seasons: 6,
    episodes: 60,
    seasonsList: []
  },
  {
    id: 5,
    title: 'سریال The Mandalorian',
    description: 'ماموریت‌های یک شکارچی جوایز در کهکشان',
    poster: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    category: 'علمی تخیلی',
    status: 'ongoing',
    rating: 8.8,
    views: 165000,
    seasons: 3,
    episodes: 24,
    seasonsList: []
  },
  {
    id: 6,
    title: 'سریال Wednesday',
    description: 'دختر خانواده آدامز در مدرسه جدید',
    poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    category: 'کمدی',
    status: 'ongoing',
    rating: 8.2,
    views: 210000,
    seasons: 2,
    episodes: 16,
    seasonsList: []
  },
  {
    id: 7,
    title: 'سریال The Last of Us',
    description: 'داستان بقا در دنیای پساآخرالزمانی',
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    category: 'اکشن',
    status: 'ongoing',
    rating: 8.9,
    views: 185000,
    seasons: 1,
    episodes: 9,
    seasonsList: []
  },
  {
    id: 8,
    title: 'سریال The Witcher',
    description: 'ماجراهای جرالت از ریویا',
    poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    category: 'فانتزی',
    status: 'ongoing',
    rating: 8.1,
    views: 175000,
    seasons: 3,
    episodes: 24,
    seasonsList: []
  }
])*/

// Computed
const filteredSeries = computed(() => {
  let result = series.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(s => s.category === selectedCategory.value)
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(s => s.status === selectedStatus.value)
  }

  // Sort
  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'oldest') {
    result = [...result].sort((a, b) => a.id - b.id)
  } else if (sortBy.value === 'views') {
    result = [...result].sort((a, b) => b.views - a.views)
  } else if (sortBy.value === 'rating') {
    result = [...result].sort((a, b) => b.rating - a.rating)
  }

  return result
})

// Methods
const selectCategory = (category) => {
  selectedCategory.value = category
  showCategoryDropdown.value = false
}

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const selectSort = (sort) => {
  sortBy.value = sort
  showSortDropdown.value = false
}

const getStatusLabel = (status) => {
  const labels = {
    all: 'همه وضعیت‌ها',
    ongoing: 'در حال پخش',
    completed: 'پایان یافته',
    upcoming: 'به زودی'
  }
  return labels[status] || status
}

const getSortLabel = (sort) => {
  const labels = {
    newest: 'جدیدترین',
    oldest: 'قدیمی‌ترین',
    views: 'پربازدیدترین',
    rating: 'بهترین امتیاز'
  }
  return labels[sort] || sort
}

const getStatusBadgeColor = (status) => {
  const colors = {
    ongoing: 'bg-green-500/90 text-white',
    completed: 'bg-blue-500/90 text-white',
    upcoming: 'bg-orange-500/90 text-white'
  }
  return colors[status] || 'bg-gray-500/90 text-white'
}

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num
}

const viewSeasons = (seriesItem) => {
  selectedSeries.value = seriesItem
  showSeasonsModal.value = true
  expandedSeasons.value = []
}

const toggleSeason = (index) => {
  const idx = expandedSeasons.value.indexOf(index)
  if (idx > -1) {
    expandedSeasons.value.splice(idx, 1)
  } else {
    expandedSeasons.value.push(index)
  }
}

const addSeason = () => {
  if (!selectedSeries.value.seasonsList) {
    selectedSeries.value.seasonsList = []
  }
  const newSeason = {
    number: selectedSeries.value.seasonsList.length + 1,
    title: prompt('عنوان فصل:') || `فصل ${selectedSeries.value.seasonsList.length + 1}`,
    episodes: []
  }
  selectedSeries.value.seasonsList.push(newSeason)
}

const editSeason = (index) => {
  const season = selectedSeries.value.seasonsList[index]
  const newTitle = prompt('عنوان جدید فصل:', season.title)
  if (newTitle) {
    season.title = newTitle
  }
}

const removeSeason = (index) => {
  if (confirm('آیا از حذف این فصل اطمینان دارید؟')) {
    selectedSeries.value.seasonsList.splice(index, 1)
  }
}

const addEpisode = (seasonIndex) => {
  const season = selectedSeries.value.seasonsList[seasonIndex]
  if (!season.episodes) {
    season.episodes = []
  }
  const newEpisode = {
    number: season.episodes.length + 1,
    title: prompt('عنوان قسمت:') || `قسمت ${season.episodes.length + 1}`,
    duration: parseInt(prompt('مدت زمان (دقیقه):') || '45')
  }
  season.episodes.push(newEpisode)
}

const editEpisode = (seasonIndex, episodeIndex) => {
  const episode = selectedSeries.value.seasonsList[seasonIndex].episodes[episodeIndex]
  const newTitle = prompt('عنوان جدید قسمت:', episode.title)
  if (newTitle) {
    episode.title = newTitle
  }
}

const removeEpisode = (seasonIndex, episodeIndex) => {
  if (confirm('آیا از حذف این قسمت اطمینان دارید؟')) {
    selectedSeries.value.seasonsList[seasonIndex].episodes.splice(episodeIndex, 1)
  }
}

const deleteSeries = (id) => {
  if (confirm('آیا از حذف این سریال اطمینان دارید؟')) {
    const index = series.value.findIndex(s => s.id === id)
    if (index > -1) {
      series.value.splice(index, 1)
      toast.success('سریال با موفقیت حذف شد', 'تغییرات اعمال گردید')
    }
  }
}

const exportToExcel = () => {
  toast.info('در حال آماده‌سازی فایل Excel...', 'لطفاً کمی صبر کنید')
  // Simulate export
  setTimeout(() => {
    toast.success('فایل Excel آماده است', 'دانلود خودکار شروع شد')
  }, 2000)
}

onMounted(async () => {
  await seriesStore.fetchSeries()
})
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
  justify-content: center;
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
  justify-content: center;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
