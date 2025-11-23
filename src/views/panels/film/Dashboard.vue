<template>
  <div class="space-y-4" dir="rtl">
    <!-- فیلترهای زمانی -->
    <div class="flex gap-2 mb-4">
      <button 
        @click="setFilter('today')"
        :class="{'bg-gradient-to-r from-purple-500 to-purple-600 text-white': filter === 'today', 'bg-white text-gray-700': filter !== 'today'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        امروز
      </button>
      <button 
        @click="setFilter('weekly')"
        :class="{'bg-gradient-to-r from-purple-500 to-purple-600 text-white': filter === 'weekly', 'bg-white text-gray-700': filter !== 'weekly'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        این هفته
      </button>
      <button 
        @click="setFilter('monthly')"
        :class="{'bg-gradient-to-r from-purple-500 to-purple-600 text-white': filter === 'monthly', 'bg-white text-gray-700': filter !== 'monthly'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        ماهانه
      </button>
      <button 
        @click="setFilter('quarterly')"
        :class="{'bg-gradient-to-r from-purple-500 to-purple-600 text-white': filter === 'quarterly', 'bg-white text-gray-700': filter !== 'quarterly'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        3 ماهه
      </button>
    </div>

    <!-- کارت‌های آماری -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-video text-xl text-purple-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ totalVideos }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل ویدیوها</p>
        <p class="text-xs text-purple-600 font-medium">
          <i class="ti ti-check text-xs"></i>
          {{ publishedVideos }} منتشر شده
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-playlist text-xl text-blue-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ totalPlaylists }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل پلی‌لیست‌ها</p>
        <p class="text-xs text-blue-600 font-medium">
          <i class="ti ti-check text-xs"></i>
          {{ publishedPlaylists }} منتشر شده
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-eye text-xl text-green-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalViews }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل بازدیدها</p>
        <p class="text-xs text-green-600 font-medium">
          <i class="ti ti-arrow-up text-xs"></i>
          +{{ stats.viewGrowth }}%
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <i class="ti ti-users text-xl text-amber-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.uniqueViewers }}</h3>
        <p class="text-sm text-gray-600 mb-1">تماشاچی‌ها</p>
        <p class="text-xs text-amber-600 font-medium">
          <i class="ti ti-user-plus text-xs"></i>
          کاربران فعال
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- آخرین ویدیوها -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">آخرین ویدیوها</h2>
          <button @click="navigateTo('videos')" class="text-purple-600 hover:text-purple-700 text-sm">
            مشاهده همه →
          </button>
        </div>

        <div v-if="recentVideos.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-video-off text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز ویدیویی ایجاد نشده است</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="video in recentVideos" :key="video.id" class="flex items-start gap-3 pb-3 border-b last:border-0">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-video text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ video.title }}</p>
                <span class="text-xs font-medium text-gray-500 mr-2">{{ video.views || 0 }} بازدید</span>
              </div>
              <p class="text-xs text-gray-500 mb-1">{{ formatDate(video.createdAt) }}</p>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(video.status)">
                  {{ getStatusLabel(video.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button @click="navigateTo('videos')" class="w-full mt-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          مشاهده همه ویدیوها
        </button>
      </div>

      <!-- آخرین پلی‌لیست‌ها -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">آخرین پلی‌لیست‌ها</h2>
          <button @click="navigateTo('playlists')" class="text-blue-600 hover:text-blue-700 text-sm">
            مشاهده همه →
          </button>
        </div>

        <div v-if="recentPlaylists.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-playlist-off text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز پلی‌لیستی ایجاد نشده است</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="playlist in recentPlaylists" :key="playlist.id" class="flex items-start gap-3 pb-3 border-b last:border-0">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-playlist text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ playlist.title }}</p>
                <span class="text-xs font-medium text-gray-500 mr-2">{{ playlist.videoCount || 0 }} ویدیو</span>
              </div>
              <p class="text-xs text-gray-500 mb-1">{{ formatDate(playlist.createdAt) }}</p>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(playlist.status)">
                  {{ getStatusLabel(playlist.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button @click="navigateTo('playlists')" class="w-full mt-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          مشاهده همه پلی‌لیست‌ها
        </button>
      </div>
    </div>

    <!-- پربازدیدترین محتوا -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- پربازدیدترین ویدیوها -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">پربازدیدترین ویدیوها</h2>
          <i class="ti ti-trending-up text-purple-600"></i>
        </div>

        <div v-if="topVideos.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-chart-line text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز آماری وجود ندارد</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(video, index) in topVideos" :key="video.id" class="flex items-center gap-3 pb-3 border-b last:border-0">
            <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-purple-600">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ video.title }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(video.createdAt) }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-purple-600">{{ video.views || 0 }}</p>
              <p class="text-xs text-gray-400">بازدید</p>
            </div>
          </div>
        </div>
      </div>

      <!-- پربازدیدترین پلی‌لیست‌ها -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">پربازدیدترین پلی‌لیست‌ها</h2>
          <i class="ti ti-trending-up text-blue-600"></i>
        </div>

        <div v-if="topPlaylists.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-chart-line text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز آماری وجود ندارد</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(playlist, index) in topPlaylists" :key="playlist.id" class="flex items-center gap-3 pb-3 border-b last:border-0">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-blue-600">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ playlist.title }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(playlist.createdAt) }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-blue-600">{{ playlist.views || 0 }}</p>
              <p class="text-xs text-gray-400">بازدید</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['navigate'])
const filter = ref('weekly')
const videos = ref([])
const playlists = ref([])

const setFilter = (newFilter) => {
  filter.value = newFilter
}

// Load data from localStorage
const loadData = () => {
  const savedVideos = localStorage.getItem('film-videos')
  const savedPlaylists = localStorage.getItem('film-playlists')
  
  if (savedVideos) {
    videos.value = JSON.parse(savedVideos)
  }
  
  if (savedPlaylists) {
    playlists.value = JSON.parse(savedPlaylists)
  }
}

// Computed stats
const totalVideos = computed(() => videos.value.length)
const publishedVideos = computed(() => videos.value.filter(v => v.status === 'published').length)

const totalPlaylists = computed(() => playlists.value.length)
const publishedPlaylists = computed(() => playlists.value.filter(p => p.status === 'published').length)

const totalViews = computed(() => {
  const videoViews = videos.value.reduce((sum, v) => sum + (v.views || 0), 0)
  const playlistViews = playlists.value.reduce((sum, p) => sum + (p.views || 0), 0)
  return videoViews + playlistViews
})

// Recent videos (last 5)
const recentVideos = computed(() => {
  return [...videos.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// Recent playlists (last 5)
const recentPlaylists = computed(() => {
  return [...playlists.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// Top videos by views (top 5)
const topVideos = computed(() => {
  return [...videos.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

// Top playlists by views (top 5)
const topPlaylists = computed(() => {
  return [...playlists.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

const stats = computed(() => {
  const data = {
    today: {
      totalViews: '534',
      uniqueViewers: '256',
      viewGrowth: 10
    },
    weekly: {
      totalViews: '2,434',
      uniqueViewers: '867',
      viewGrowth: 15
    },
    monthly: {
      totalViews: '8,678',
      uniqueViewers: '3,345',
      viewGrowth: 22
    },
    quarterly: {
      totalViews: '25,432',
      uniqueViewers: '9,789',
      viewGrowth: 30
    }
  }
  
  return data[filter.value] || data.weekly
})

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Get status label
const getStatusLabel = (status) => {
  const labels = {
    draft: 'پیش‌نویس',
    published: 'منتشر شده',
    scheduled: 'زمان‌بندی'
  }
  return labels[status] || 'پیش‌نویس'
}

// Get status class
const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-orange-100 text-orange-700',
    published: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// Navigation
const navigateTo = (section) => {
  emit('navigate', section)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.space-y-4 {
  direction: rtl;
}
</style>
