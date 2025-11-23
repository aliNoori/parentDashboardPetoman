<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">داشبورد دانیم</h1>
        <p class="text-gray-600 mt-1">آمار و عملکرد کلی سایت</p>
      </div>
      <div class="flex gap-3">
        <button class="btn-secondary">
          <i class="ti ti-download ml-2"></i>
          گزارش
        </button>
        <button class="btn-primary">
          <i class="ti ti-plus ml-2"></i>
          پست جدید
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <i class="ti ti-article text-xl text-orange-600"></i>
          </div>
          <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
            +15%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalPosts.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600">کل نوشته‌ها</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-eye text-xl text-blue-600"></i>
          </div>
          <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
            +23%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalViews.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600">بازدید کل</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-users text-xl text-green-600"></i>
          </div>
          <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
            +8%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalUsers.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600">کاربران</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-message-circle text-xl text-purple-600"></i>
          </div>
          <span class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
            +45%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalComments.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600">کامنت‌ها</p>
      </div>
    </div>

    <!-- Views Chart -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-gray-900">آمار بازدید</h2>
        <div class="flex gap-2">
          <button
            v-for="period in chartPeriods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            class="px-3 py-1 text-sm rounded-lg transition-colors"
            :class="selectedPeriod === period.value ? 'bg-orange-100 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      
      <!-- Chart Placeholder -->
      <div class="h-64 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
        <div class="text-center">
          <i class="ti ti-chart-line text-4xl text-orange-600 mb-3"></i>
          <p class="text-gray-600">نمودار آمار بازدید {{ getSelectedPeriodLabel() }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ getTotalViewsForPeriod().toLocaleString() }} بازدید</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Posts -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">نوشته‌های جدید</h2>
          <i class="ti ti-article text-orange-600"></i>
        </div>

        <div class="space-y-4">
          <div v-for="post in recentPosts" :key="post.id" class="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <img :src="post.image" :alt="post.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{{ post.title }}</h3>
              <p class="text-xs text-gray-600 mb-2">{{ post.author }} • {{ post.date }}</p>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <i class="ti ti-eye"></i>
                  {{ post.views }}
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusColor(post.status)"
                >
                  {{ getStatusLabel(post.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button class="w-full mt-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
          مشاهده همه نوشته‌ها
        </button>
      </div>

      <!-- Quick Actions & Stats -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">دسترسی سریع</h2>
          
          <div class="grid grid-cols-2 gap-3">
            <button class="quick-action-btn">
              <i class="ti ti-plus text-xl text-blue-600"></i>
              <span>پست جدید</span>
            </button>
            
            <button class="quick-action-btn">
              <i class="ti ti-users text-xl text-green-600"></i>
              <span>کاربران</span>
            </button>
            
            <button class="quick-action-btn">
              <i class="ti ti-category text-xl text-purple-600"></i>
              <span>دسته‌بندی</span>
            </button>
            
            <button class="quick-action-btn">
              <i class="ti ti-settings text-xl text-gray-600"></i>
              <span>تنظیمات</span>
            </button>
          </div>
        </div>

        <!-- Top Categories -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">دسته‌های پربازدید</h2>
          
          <div class="space-y-3">
            <div v-for="category in topCategories" :key="category.id" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i class="ti ti-folder text-blue-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ category.views.toLocaleString() }}</p>
                <p class="text-xs text-gray-500">{{ category.posts }} نوشته</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Stats -->
    <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold mb-1">آمار امروز</h2>
          <p class="text-orange-100">{{ new Date().toLocaleDateString('fa-IR') }}</p>
        </div>
        <i class="ti ti-calendar-event text-3xl text-orange-200"></i>
      </div>
      
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold mb-1">{{ todayStats.views.toLocaleString() }}</p>
          <p class="text-orange-100 text-sm">بازدید</p>
        </div>
        
        <div class="text-center">
          <p class="text-2xl font-bold mb-1">{{ todayStats.newUsers }}</p>
          <p class="text-orange-100 text-sm">کاربر جدید</p>
        </div>
        
        <div class="text-center">
          <p class="text-2xl font-bold mb-1">{{ todayStats.newPosts }}</p>
          <p class="text-orange-100 text-sm">نوشته جدید</p>
        </div>
        
        <div class="text-center">
          <p class="text-2xl font-bold mb-1">{{ todayStats.comments }}</p>
          <p class="text-orange-100 text-sm">کامنت</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedPeriod = ref('week')

const chartPeriods = ref([
  { value: 'day', label: 'امروز' },
  { value: 'week', label: 'هفته' },
  { value: 'month', label: 'ماه' },
  { value: 'year', label: 'سال' }
])

const stats = ref({
  totalPosts: 156,
  totalViews: 45683,
  totalUsers: 2847,
  totalComments: 3921
})

const todayStats = ref({
  views: 1247,
  newUsers: 23,
  newPosts: 4,
  comments: 67
})

const recentPosts = ref([
  {
    id: 1,
    title: 'نکات مهم برای نگهداری از سگ‌ها در زمستان',
    author: 'دکتر احمدی',
    date: '1403/08/05',
    views: 1250,
    status: 'published',
    image: 'https://via.placeholder.com/48x48'
  },
  {
    id: 2,
    title: 'تغذیه صحیح گربه‌های خانگی',
    author: 'دکتر محمدی',
    date: '1403/08/04',
    views: 980,
    status: 'published',
    image: 'https://via.placeholder.com/48x48'
  },
  {
    id: 3,
    title: 'بیماری‌های شایع در پرندگان',
    author: 'دکتر کریمی',
    date: '1403/08/03',
    views: 0,
    status: 'draft',
    image: 'https://via.placeholder.com/48x48'
  }
])

const topCategories = ref([
  {
    id: 1,
    name: 'سلامت حیوانات',
    views: 12450,
    posts: 24
  },
  {
    id: 2,
    name: 'تغذیه',
    views: 9320,
    posts: 18
  },
  {
    id: 3,
    name: 'مراقبت',
    views: 7890,
    posts: 15
  },
  {
    id: 4,
    name: 'آموزش',
    views: 5640,
    posts: 12
  }
])

const getSelectedPeriodLabel = () => {
  const period = chartPeriods.value.find(p => p.value === selectedPeriod.value)
  return period ? period.label : 'هفته'
}

const getTotalViewsForPeriod = () => {
  const views = {
    day: 1247,
    week: 8945,
    month: 45683,
    year: 234567
  }
  return views[selectedPeriod.value] || 8945
}

const getStatusColor = (status) => {
  const colors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'منتشر شده',
    draft: 'پیش‌نویس',
    pending: 'در انتظار تایید'
  }
  return labels[status] || status
}
</script>

<style scoped>
.btn-primary {
  background-color: #f97316;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background-color: #ea580c;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.quick-action-btn span {
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>