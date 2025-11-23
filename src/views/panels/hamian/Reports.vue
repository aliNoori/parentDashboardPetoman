<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">تراکنش‌ها و گزارش‌ها</h1>
        <p class="text-sm text-gray-600 mt-1">تحلیل تراکنش‌های مالی و آمار سیستم</p>
      </div>
      <div class="flex gap-2">
        <button @click="exportToPDF"
                class="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <i class="ti ti-download ml-2"></i>
          دانلود PDF
        </button>
        <button @click="exportToExcel"
                class="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <i class="ti ti-file-spreadsheet ml-2"></i>
          دانلود Excel
        </button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <button
              @click.stop="showPeriodDropdown = !showPeriodDropdown"
              class="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <span>{{ getSelectedPeriodLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>

          <Transition name="dropdown">
            <ul v-if="showPeriodDropdown"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
              <li
                  v-for="period in periods"
                  :key="period.value"
                  @click="selectPeriod(period.value)"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  :class="selectedPeriod === period.value ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700'"
              >
                <i :class="period.icon" class="ml-2"></i>
                {{ period.label }}
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
        <div class="flex items-center justify-between mb-3">
          <i class="ti ti-trending-up text-2xl opacity-80"></i>
          <span class="text-xs bg-white/20 px-2 py-1 rounded-full">+{{ reportData.growth }}%</span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-1">{{ formatCurrency(reportData.totalIncome) }}</h3>
        <p class="text-xs sm:text-sm opacity-90">کل درآمد</p>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 sm:p-6 text-white">
        <div class="flex items-center justify-between mb-3">
          <i class="ti ti-coin text-2xl opacity-80"></i>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-1">{{ reportData.totalDonations }}</h3>
        <p class="text-xs sm:text-sm opacity-90">تعداد کمک‌ها</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div class="flex items-center justify-between mb-3">
          <i class="ti ti-users text-2xl opacity-80"></i>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-1">{{ reportData.newSupporters }}</h3>
        <p class="text-xs sm:text-sm opacity-90">حامیان جدید</p>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
        <div class="flex items-center justify-between mb-3">
          <i class="ti ti-briefcase text-2xl opacity-80"></i>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold mb-1">{{ reportData.completedProjects }}</h3>
        <p class="text-xs sm:text-sm opacity-90">پروژه‌های تکمیل شده</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Income Chart -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-6">نمودار درآمد</h2>
        <div class="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <i class="ti ti-chart-area text-4xl text-green-600 mb-3"></i>
            <p class="text-gray-700 font-medium">نمودار درآمد ماهانه</p>
            <p class="text-sm text-gray-500 mt-2">{{ formatCurrency(reportData.totalIncome) }} تومان</p>
          </div>
        </div>
      </div>

      <!-- Donations by Category -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-6">کمک‌ها بر اساس دسته‌بندی</h2>
        <div class="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <i class="ti ti-chart-pie text-4xl text-blue-600 mb-3"></i>
            <p class="text-gray-700 font-medium">نمودار دسته‌بندی</p>
            <p class="text-sm text-gray-500 mt-2">{{ reportData.totalDonations }} کمک</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Projects Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h2 class="text-base sm:text-lg font-bold text-gray-900">پربازده‌ترین پروژه‌ها</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">رتبه</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">عنوان پروژه</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">مبلغ جمع‌آوری</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">تعداد کمک</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">پیشرفت</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="(project, index) in topProjects" :key="project.id" class="hover:bg-gray-50">
            <td class="px-4 py-4">
              <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                   :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="font-medium text-gray-900">{{ project.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ project.category }}</div>
            </td>
            <td class="px-4 py-4">
              <div class="font-bold text-green-600">{{ formatCurrency(project.amount) }}</div>
            </td>
            <td class="px-4 py-4">
              <div class="text-gray-900">{{ project.donations }}</div>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                      class="h-full rounded-full"
                      :class="getProgressClass(project.progress)"
                      :style="{ width: project.progress + '%' }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-700 min-w-[3rem]">{{ project.progress }}%</span>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Supporters Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h2 class="text-base sm:text-lg font-bold text-gray-900">برترین حامیان</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">رتبه</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">نام حامی</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">کل کمک‌ها</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">تعداد</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">نوع</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="(supporter, index) in topSupporters" :key="supporter.id" class="hover:bg-gray-50">
            <td class="px-4 py-4">
              <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                   :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                  {{ supporter.initials }}
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ supporter.name }}</div>
                  <div class="text-xs text-gray-500">{{ supporter.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="font-bold text-green-600">{{ formatCurrency(supporter.totalAmount) }}</div>
            </td>
            <td class="px-4 py-4">
              <div class="text-gray-900">{{ supporter.totalDonations }} کمک</div>
            </td>
            <td class="px-4 py-4">
                <span class="px-3 py-1 text-xs font-medium rounded-full"
                      :class="getTypeClass(supporter.type)">
                  {{ supporter.typeLabel }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch, watchEffect, reactive} from 'vue'
import {useSupporterStore} from "@/stores/supporter.ts";
import {useKindnessMeetingStore} from "@/stores/kindness-meeting.ts";
import {useDonationStore} from "@/stores/donation.ts";

const showPeriodDropdown = ref(false)
const selectedPeriod = ref('month')

const periods = [
  {value: 'week', label: 'هفته جاری', icon: 'ti ti-calendar-week'},
  {value: 'month', label: 'ماه جاری', icon: 'ti ti-calendar-month'},
  {value: 'quarter', label: 'سه ماهه', icon: 'ti ti-calendar'},
  {value: 'year', label: 'سال جاری', icon: 'ti ti-calendar-event'}
]
const projectStore = useKindnessMeetingStore()
const supporterStore = useSupporterStore()
const donationStore=useDonationStore()

const reportData = reactive({
  totalIncome: 0,
  growth: 0,
  totalDonations: 0,
  newSupporters: 0,
  completedProjects: 0
})

watchEffect(() => {
  if(selectedPeriod.value==='week'){
    reportData.totalIncome = supporterStore.totalAllSupportersAmount
    reportData.growth = donationStore.donationsGrowth
    //reportData.totalDonations = donationStore.weeklyCount
    reportData.newSupporters = supporterStore.newSupportersThisWeek
    reportData.completedProjects = projectStore.completedProjectsThisWeek
  }
  if(selectedPeriod.value==='month'){
    reportData.totalIncome = supporterStore.totalAllSupportersAmount
    reportData.growth = donationStore.donationsGrowth
    //reportData.totalDonations = donationStore.monthlyCount
    reportData.newSupporters = supporterStore.newSupportersThisMonth
    reportData.completedProjects = projectStore.countCompletedKindnessMeetings
  }
  if(selectedPeriod.value==='quarter'){
    reportData.totalIncome = supporterStore.totalAllSupportersAmount
    reportData.growth = donationStore.donationsGrowth
    //reportData.totalDonations = donationStore.quarterlyCount
    reportData.newSupporters = supporterStore.newSupportersThisMonth
    reportData.completedProjects = projectStore.countCompletedKindnessMeetings
  }
  if(selectedPeriod.value==='year'){
    reportData.totalIncome = supporterStore.totalAllSupportersAmount
    reportData.growth = donationStore.donationsGrowth
    //reportData.totalDonations = donationStore.yearlyCount
    reportData.newSupporters = supporterStore.newSupportersThisYear
    reportData.completedProjects = projectStore.countCompletedKindnessMeetings
  }
})

/*const topProjects = ref([
  {
    id: 1,
    title: 'کمک به حیوانات خیابانی',
    category: 'حمایت مالی',
    amount: 42500000,
    donations: 124,
    progress: 85
  },
  {
    id: 2,
    title: 'درمان حیوانات آسیب‌دیده',
    category: 'درمان',
    amount: 31000000,
    donations: 89,
    progress: 62
  },
  {
    id: 3,
    title: 'غذا و مراقبت',
    category: 'تغذیه',
    amount: 13500000,
    donations: 56,
    progress: 45
  },
  {
    id: 4,
    title: 'ساخت پناهگاه',
    category: 'زیرساخت',
    amount: 100000000,
    donations: 245,
    progress: 100
  },
  {
    id: 5,
    title: 'واکسیناسیون',
    category: 'بهداشت',
    amount: 9000000,
    donations: 42,
    progress: 30
  }
])*/
const topProjects = computed(() => projectStore.topProjects)
/*const topSupporters = ref([
  {
    id: 1,
    name: 'محمد حسینی',
    initials: 'م ح',
    email: 'mohammad@example.com',
    totalAmount: 45000000,
    totalDonations: 20,
    type: 'both',
    typeLabel: 'مالی و داوطلب'
  },
  {
    id: 2,
    name: 'زهرا احمدی',
    initials: 'ز ا',
    email: 'zahra@example.com',
    totalAmount: 35000000,
    totalDonations: 18,
    type: 'both',
    typeLabel: 'مالی و داوطلب'
  },
  {
    id: 3,
    name: 'احمد محمدی',
    initials: 'ا م',
    email: 'ahmad@example.com',
    totalAmount: 25000000,
    totalDonations: 12,
    type: 'financial',
    typeLabel: 'حامی مالی'
  },
  {
    id: 4,
    name: 'فاطمه کریمی',
    initials: 'ف ک',
    email: 'fatemeh@example.com',
    totalAmount: 15000000,
    totalDonations: 8,
    type: 'financial',
    typeLabel: 'حامی مالی'
  },
  {
    id: 5,
    name: 'سارا کاظمی',
    initials: 'س ک',
    email: 'sara@example.com',
    totalAmount: 0,
    totalDonations: 0,
    type: 'volunteer',
    typeLabel: 'داوطلب'
  }
])*/
const topSupporters = computed(() => supporterStore.topSupporters)
watch(
    topSupporters,
    (newVal) => {
      console.log('topSupporters updated:', newVal)
    },
    {deep: true, immediate: true}
)

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' میلیون'
  }
  return (amount / 1000).toLocaleString('fa-IR') + ' هزار'
}

const getSelectedPeriodLabel = () => {
  const period = periods.find(p => p.value === selectedPeriod.value)
  return period ? period.label : 'انتخاب بازه'
}

const selectPeriod = (value) => {
  selectedPeriod.value = value
  showPeriodDropdown.value = false
}

const getRankClass = (index) => {
  if (index === 0) return 'bg-yellow-100 text-yellow-700'
  if (index === 1) return 'bg-gray-100 text-gray-700'
  if (index === 2) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-50 text-gray-600'
}

const getProgressClass = (progress) => {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getTypeClass = (type) => {
  if (type === 'both') return 'bg-purple-100 text-purple-700'
  if (type === 'financial') return 'bg-green-100 text-green-700'
  return 'bg-blue-100 text-blue-700'
}

const exportToExcel = () => {
  // Create comprehensive report data
  const allData = []

  // Summary stats
  allData.push(['گزارش تراکنش‌ها و آمار سیستم حمایت'])
  allData.push(['بازه زمانی:', getSelectedPeriodLabel()])
  allData.push(['تاریخ گزارش:', new Date().toLocaleDateString('fa-IR')])
  allData.push([])

  // Summary section
  allData.push(['خلاصه آمار'])
  allData.push(['شاخص', 'مقدار'])
  allData.push(['کل درآمد', '542 میلیون تومان'])
  allData.push(['کل کمک‌ها', '1,234 تراکنش'])
  allData.push(['پروژه‌های فعال', '12 پروژه'])
  allData.push(['حامیان فعال', '567 نفر'])
  allData.push([])

  // Top projects
  allData.push(['برترین پروژه‌ها'])
  allData.push(['رتبه', 'عنوان', 'مبلغ جمع‌آوری شده', 'تعداد کمک‌ها', 'پیشرفت (%)'])
  topProjects.value.forEach((p, i) => {
    allData.push([i + 1, p.title, p.collected, p.donations, p.progress])
  })
  allData.push([])

  // Top supporters
  allData.push(['برترین حامیان'])
  allData.push(['رتبه', 'نام', 'نوع', 'مجموع کمک‌ها', 'تعداد کمک‌ها', 'ایمیل'])
  topSupporters.value.forEach((s, i) => {
    allData.push([i + 1, s.name, s.typeLabel, formatCurrency(s.totalAmount), s.totalDonations, s.email])
  })

  // Convert to CSV
  const csvContent = allData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

  // Add BOM for UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], {type: 'text/csv;charset=utf-8;'})

  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `transactions_report_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToPDF = () => {
  alert('📄 قابلیت خروجی PDF در نسخه بعدی اضافه می‌شود.\n\nفعلاً می‌توانید از خروجی Excel استفاده کنید.')
}

const handleClickOutside = () => {
  showPeriodDropdown.value = false
}

onMounted(async () => {
  await supporterStore.fetchSupporters()
  await projectStore.fetchKindnessMeetings()
  console.log('topSupporters updated:', projectStore.kindnessMeetings)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
