<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تحلیل و بررسی</h1>
        <p class="text-gray-600 mt-1">آمار تفصیلی بازدیدها و تعاملات کاربران</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportData" class="btn-secondary">
          <i class="ti ti-download ml-2"></i>
          خروجی گزارش
        </button>
        <button @click="refreshData" class="btn-primary">
          <i class="ti ti-refresh ml-2"></i>
          بروزرسانی
        </button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-eye text-xl text-blue-600"></i>
          </div>
          <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
            +23%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">125,678</h3>
        <p class="text-sm text-gray-600">مجموع بازدید</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-users text-xl text-green-600"></i>
          </div>
          <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
            +15%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">8,934</h3>
        <p class="text-sm text-gray-600">کاربران منحصر</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-clock text-xl text-purple-600"></i>
          </div>
          <span class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
            +8%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">4:45</h3>
        <p class="text-sm text-gray-600">مدت زمان متوسط</p>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <i class="ti ti-percentage text-xl text-red-600"></i>
          </div>
          <span class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">
            42%
          </span>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">42%</h3>
        <p class="text-sm text-gray-600">نرخ ترک</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Traffic Chart -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">ترافیک سایت</h2>
        </div>
        
        <div class="h-64">
          <canvas ref="trafficChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- Popular Content -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">محتوای محبوب</h2>
        </div>
        
        <div class="h-64">
          <canvas ref="contentChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Detailed Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Pages -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">صفحات پربازدید</h2>
        
        <div class="space-y-4">
          <div v-for="page in topPages" :key="page.url" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 truncate">{{ page.title }}</h3>
              <p class="text-xs text-gray-600 truncate">{{ page.url }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">{{ page.views.toLocaleString() }}</p>
              <p class="text-xs text-gray-500">بازدید</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">منابع ترافیک</h2>
        
        <div class="space-y-4">
          <div v-for="source in trafficSources" :key="source.name" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: source.color }"></div>
              <span class="text-sm font-medium text-gray-900">{{ source.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">{{ source.percentage }}%</p>
              <p class="text-xs text-gray-500">{{ source.visits.toLocaleString() }} بازدید</p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Demographics -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">جمعیت‌شناسی کاربران</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">دستگاه</h3>
            <div class="space-y-2">
              <div v-for="device in deviceStats" :key="device.name" class="flex items-center justify-between">
                <span class="text-sm text-gray-700">{{ device.name }}</span>
                <span class="text-sm font-medium text-gray-900">{{ device.percentage }}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">مرورگر</h3>
            <div class="space-y-2">
              <div v-for="browser in browserStats" :key="browser.name" class="flex items-center justify-between">
                <span class="text-sm text-gray-700">{{ browser.name }}</span>
                <span class="text-sm font-medium text-gray-900">{{ browser.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const trafficChart = ref(null)
const contentChart = ref(null)

const topPages = ref([
  { title: 'نکات مراقبت از سگ', url: '/post/dog-care-tips', views: 5430 },
  { title: 'تغذیه گربه‌های خانگی', url: '/post/cat-nutrition', views: 4782 },
  { title: 'بیماری‌های شایع پرندگان', url: '/post/bird-diseases', views: 3921 },
  { title: 'آموزش ماهی‌داری', url: '/post/fish-keeping', views: 3456 },
  { title: 'مراقبت از خرگوش', url: '/post/rabbit-care', views: 2789 }
])

const trafficSources = ref([
  { name: 'جستجوی ارگانیک', percentage: 45, visits: 12340, color: '#22c55e' },
  { name: 'مستقیم', percentage: 28, visits: 7650, color: '#3b82f6' },
  { name: 'شبکه‌های اجتماعی', percentage: 18, visits: 4920, color: '#f59e0b' },
  { name: 'ایمیل مارکتینگ', percentage: 6, visits: 1640, color: '#8b5cf6' },
  { name: 'سایر', percentage: 3, visits: 820, color: '#6b7280' }
])

const deviceStats = ref([
  { name: 'موبایل', percentage: 65 },
  { name: 'دسکتاپ', percentage: 28 },
  { name: 'تبلت', percentage: 7 }
])

const browserStats = ref([
  { name: 'Chrome', percentage: 48 },
  { name: 'Safari', percentage: 26 },
  { name: 'Firefox', percentage: 15 },
  { name: 'Edge', percentage: 8 },
  { name: 'سایر', percentage: 3 }
])

const createTrafficChart = () => {
  if (!trafficChart.value) return
  
  const ctx = trafficChart.value.getContext('2d')
  const rect = trafficChart.value.getBoundingClientRect()
  
  trafficChart.value.width = rect.width * window.devicePixelRatio
  trafficChart.value.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  ctx.clearRect(0, 0, rect.width, rect.height)
  
  // Sample data
  const data = [1200, 1890, 2340, 1567, 2100, 1890, 1456]
  
  const maxValue = Math.max(...data)
  const padding = 40
  const chartWidth = rect.width - padding * 2
  const chartHeight = rect.height - padding * 2
  
  // Draw line chart
  const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = padding + chartHeight - (value / maxValue) * chartHeight
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  // Fill area
  ctx.fillStyle = gradient
  ctx.lineTo(rect.width - padding, padding + chartHeight)
  ctx.lineTo(padding, padding + chartHeight)
  ctx.closePath()
  ctx.fill()
}

const createContentChart = () => {
  if (!contentChart.value) return
  
  const ctx = contentChart.value.getContext('2d')
  const rect = contentChart.value.getBoundingClientRect()
  
  contentChart.value.width = rect.width * window.devicePixelRatio
  contentChart.value.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  ctx.clearRect(0, 0, rect.width, rect.height)
  
  // Sample data for bar chart
  const data = [2340, 1890, 1234, 890, 567]
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444']
  
  const maxValue = Math.max(...data)
  const padding = 40
  const chartWidth = rect.width - padding * 2
  const chartHeight = rect.height - padding * 2
  const barWidth = chartWidth / data.length * 0.6
  const barSpacing = chartWidth / data.length * 0.4
  
  data.forEach((value, index) => {
    const x = padding + (chartWidth / data.length) * index + barSpacing / 2
    const height = (value / maxValue) * chartHeight
    const y = padding + chartHeight - height
    
    // Draw bar
    ctx.fillStyle = colors[index]
    ctx.fillRect(x, y, barWidth, height)
    
    // Draw value label
    ctx.fillStyle = '#374151'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
  })
}

const exportData = () => {
  // Create mock data for analytics export
  const analyticsData = [
    ['تاریخ', 'بازدید', 'کاربران منحصر', 'صفحات بازدید شده', 'نرخ بازگشت'],
    ['1403/08/01', '1250', '890', '3450', '32%'],
    ['1403/08/02', '1180', '820', '3200', '28%'],
    ['1403/08/03', '1420', '950', '3800', '35%'],
    ['1403/08/04', '1350', '900', '3600', '30%'],
    ['1403/08/05', '1480', '1020', '4100', '25%'],
    ['1403/08/06', '1680', '1180', '4500', '22%'],
    ['1403/08/07', '1520', '1080', '4200', '28%']
  ]

  // Convert to CSV
  const csvContent = analyticsData.map(row => row.join(',')).join('\n')
  
  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  console.log('Analytics data exported successfully!')
}

const refreshData = () => {
  console.log('Refreshing analytics data...')
  createTrafficChart()
  createContentChart()
}

onMounted(() => {
  nextTick(() => {
    createTrafficChart()
    createContentChart()
  })
})
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
</style>