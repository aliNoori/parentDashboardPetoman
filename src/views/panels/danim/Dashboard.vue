<template>
  <div class="space-y-4" dir="rtl">
    <!-- فیلترهای زمانی -->
    <div class="flex gap-2 mb-4">
      <button 
        @click="setFilter('today')"
        :class="{'bg-gradient-to-r from-blue-500 to-blue-600 text-white': filter === 'today', 'bg-white text-gray-700': filter !== 'today'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        امروز
      </button>
      <button 
        @click="setFilter('weekly')"
        :class="{'bg-gradient-to-r from-blue-500 to-blue-600 text-white': filter === 'weekly', 'bg-white text-gray-700': filter !== 'weekly'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        این هفته
      </button>
      <button 
        @click="setFilter('monthly')"
        :class="{'bg-gradient-to-r from-blue-500 to-blue-600 text-white': filter === 'monthly', 'bg-white text-gray-700': filter !== 'monthly'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        ماهانه
      </button>
      <button 
        @click="setFilter('quarterly')"
        :class="{'bg-gradient-to-r from-blue-500 to-blue-600 text-white': filter === 'quarterly', 'bg-white text-gray-700': filter !== 'quarterly'}"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        3 ماهه
      </button>
    </div>

    <!-- کارت‌های آماری -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-article text-xl text-blue-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ totalPosts }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل نوشته‌ها</p>
        <p class="text-xs text-blue-600 font-medium">
          <i class="ti ti-check text-xs"></i>
          {{ publishedPosts }} منتشر شده
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-file-text text-xl text-purple-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ totalPages }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل صفحات</p>
        <p class="text-xs text-purple-600 font-medium">
          <i class="ti ti-check text-xs"></i>
          {{ publishedPages }} منتشر شده
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-eye text-xl text-green-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalVisits }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل بازدیدها</p>
        <p class="text-xs text-green-600 font-medium">
          <i class="ti ti-arrow-up text-xs"></i>
          +{{ stats.visitGrowth }}%
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <i class="ti ti-users text-xl text-amber-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.uniqueVisitors }}</h3>
        <p class="text-sm text-gray-600 mb-1">بازدیدکنندگان</p>
        <p class="text-xs text-amber-600 font-medium">
          <i class="ti ti-user-plus text-xs"></i>
          کاربران فعال
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- آخرین نوشته‌ها -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">آخرین نوشته‌ها</h2>
          <button @click="navigateTo('posts')" class="text-blue-600 hover:text-blue-700 text-sm">
            مشاهده همه →
          </button>
        </div>

        <div v-if="recentPosts.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-article-off text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز نوشته‌ای ایجاد نشده است</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="post in recentPosts" :key="post.id" class="flex items-start gap-3 pb-3 border-b last:border-0">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-file-text text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</p>
                <span class="text-xs font-medium text-gray-500 mr-2">{{ post.views || 0 }} بازدید</span>
              </div>
              <p class="text-xs text-gray-500 mb-1">{{ formatDate(post.createdAt) }}</p>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(post.status)">
                  {{ getStatusLabel(post.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button @click="navigateTo('posts')" class="w-full mt-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          مشاهده همه نوشته‌ها
        </button>
      </div>

      <!-- آخرین صفحات -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">آخرین صفحات</h2>
          <button @click="navigateTo('pages')" class="text-purple-600 hover:text-purple-700 text-sm">
            مشاهده همه →
          </button>
        </div>

        <div v-if="recentPages.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-file-off text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز صفحه‌ای ایجاد نشده است</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="page in recentPages" :key="page.id" class="flex items-start gap-3 pb-3 border-b last:border-0">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-file-text text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ page.title }}</p>
                <span class="text-xs font-medium text-gray-500 mr-2">{{ page.views || 0 }} بازدید</span>
              </div>
              <p class="text-xs text-gray-500 mb-1">{{ formatDate(page.createdAt) }}</p>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(page.status)">
                  {{ getStatusLabel(page.status) }}
                </span>
                <span class="text-xs text-gray-400">{{ page.template }}</span>
              </div>
            </div>
          </div>
        </div>

        <button @click="navigateTo('pages')" class="w-full mt-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          مشاهده همه صفحات
        </button>
      </div>
    </div>

    <!-- پربازدیدترین محتوا -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- پربازدیدترین نوشته‌ها -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">پربازدیدترین نوشته‌ها</h2>
          <i class="ti ti-trending-up text-blue-600"></i>
        </div>

        <div v-if="topPosts.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-chart-line text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز آماری وجود ندارد</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(post, index) in topPosts" :key="post.id" class="flex items-center gap-3 pb-3 border-b last:border-0">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-blue-600">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-blue-600">{{ post.views || 0 }}</p>
              <p class="text-xs text-gray-400">بازدید</p>
            </div>
          </div>
        </div>
      </div>

      <!-- پربازدیدترین صفحات -->
      <div class="bg-white rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">پربازدیدترین صفحات</h2>
          <i class="ti ti-trending-up text-purple-600"></i>
        </div>

        <div v-if="topPages.length === 0" class="text-center py-8 text-gray-500">
          <i class="ti ti-chart-line text-3xl mb-2 block"></i>
          <p class="text-sm">هنوز آماری وجود ندارد</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(page, index) in topPages" :key="page.id" class="flex items-center gap-3 pb-3 border-b last:border-0">
            <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-purple-600">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ page.title }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(page.createdAt) }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-purple-600">{{ page.views || 0 }}</p>
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
import {usePostStore} from "@/stores/post.ts";
import {useDanimPageStore} from "@/stores/danim-page.ts";

const emit = defineEmits(['navigate'])
const filter = ref('weekly')


const pageStore=useDanimPageStore()
const pages = computed(()=>pageStore.pages)
const postStore=usePostStore()
const posts = computed(()=>postStore.posts)
const setFilter = (newFilter) => {
  filter.value = newFilter
}

// Load data from localStorage
const loadData = () => {
  const savedPosts = localStorage.getItem('posts')
  const savedPages = localStorage.getItem('pages')
  
  if (savedPosts) {
    posts.value = JSON.parse(savedPosts)
  }
  
  if (savedPages) {
    pages.value = JSON.parse(savedPages)
  }
}

// Computed stats
const totalPosts = computed(() => posts.value.length)
const publishedPosts = computed(() => posts.value.filter(p => p.status === 'published').length)
const draftPosts = computed(() => posts.value.filter(p => p.status === 'draft').length)

const totalPages = computed(() => pages.value.length)
const publishedPages = computed(() => pages.value.filter(p => p.status === 'published').length)
const draftPages = computed(() => pages.value.filter(p => p.status === 'draft').length)

const totalViews = computed(() => {
  const postViews = posts.value.reduce((sum, p) => sum + (p.views || 0), 0)
  const pageViews = pages.value.reduce((sum, p) => sum + (p.views || 0), 0)
  return postViews + pageViews
})

const avgViews = computed(() => {
  const total = totalPosts.value + totalPages.value
  return total > 0 ? Math.round(totalViews.value / total) : 0
})

const recentPosts = computed(() => {
  return [...filteredPosts.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
})


// Recent pages (last 5)
const recentPages = computed(() => {
  return [...filteredPages.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// Top posts by views (top 5)
const topPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

// Top pages by views (top 5)
const topPages = computed(() => {
  return [...pages.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

const stats = computed(() => {
  const data = {
    today: {
      totalVisits: postStore.postsToday.reduce((sum, p) => sum + (p.views || 0), 0),
      uniqueVisitors: postStore.postsToday.length,
      visitGrowth: 8 // میتونی محاسبه واقعی اضافه کنی
    },
    weekly: {
      totalVisits: postStore.postsThisWeek.reduce((sum, p) => sum + (p.views || 0), 0),
      uniqueVisitors: postStore.postsThisWeek.length,
      visitGrowth: 12
    },
    monthly: {
      totalVisits: postStore.postsThisMonth.reduce((sum, p) => sum + (p.views || 0), 0),
      uniqueVisitors: postStore.postsThisMonth.length,
      visitGrowth: 18
    },
    quarterly: {
      totalVisits: postStore.postsLast3Months.reduce((sum, p) => sum + (p.views || 0), 0),
      uniqueVisitors: postStore.postsLast3Months.length,
      visitGrowth: 25
    },
    yearly: {
      totalVisits: postStore.postsThisYear.reduce((sum, p) => sum + (p.views || 0), 0),
      uniqueVisitors: postStore.postsThisYear.length,
      visitGrowth: 30
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

const filteredPages = computed(() => {
  if (!pages.value || pages.value.length === 0) return []

  return pages.value.filter(p => {
    const date = p.publishDate || p.createdAt

    switch (filter.value) {
      case 'today':
        return isToday(date)
      case 'weekly':
        return isThisWeek(date)
      case 'monthly':
        return isThisMonth(date)
      case 'quarterly':
        return isThisQuarter(date)
      case 'yearly':
        return isThisYear(date)
      default:
        return true
    }
  })
})


const filteredPosts = computed(() => {
  if (!posts.value || posts.value.length === 0) return []

  return posts.value.filter(p => {
    const date = p.publishDate || p.createdAt

    switch (filter.value) {
      case 'today':
        return isToday(date)
      case 'weekly':
        return isThisWeek(date)
      case 'monthly':
        return isThisMonth(date)
      case 'quarterly':
        return isThisQuarter(date)
      case 'yearly':
        return isThisYear(date)
      default:
        return true
    }
  })
})

const isToday = (date) => {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

const isThisWeek = (date) => {
  const now = new Date()
  const d = new Date(date)

  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)) // Monday
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)

  return d >= startOfWeek && d <= endOfWeek
}

const isThisMonth = (date) => {
  const d = new Date(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

const isThisQuarter = (date) => {
  const d = new Date(date)
  const now = new Date()

  const quarter = Math.floor(now.getMonth() / 3)
  const start = new Date(now.getFullYear(), quarter * 3, 1)
  const end = new Date(now.getFullYear(), quarter * 3 + 3, 0)

  return d >= start && d <= end
}

const isThisYear = (date) => {
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
}



onMounted(async () => {
  await pageStore.fetchPages()
  await postStore.fetchPosts()
})
</script>

<style scoped>
/* پشتیبانی کامل از RTL */
.space-y-4 {
  direction: rtl;
}
</style>
