<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت گزارش‌ها</h1>
        <p class="text-gray-600 mt-1">بررسی گزارش تخلف کاربران</p>
      </div>
      <div class="flex gap-3">
        <button
            @click="filterStatus = 'all'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium', filterStatus === 'all' ? 'btn-primary' : 'btn-secondary']"
        >
          همه ({{ stats.total }})
        </button>
        <button
            @click="filterStatus = 'pending'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium', filterStatus === 'pending' ? 'btn-primary' : 'btn-secondary']"
        >
          در انتظار ({{ stats.pending }})
        </button>
        <button
            @click="filterStatus = 'resolved'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium', filterStatus === 'resolved' ? 'btn-primary' : 'btn-secondary']"
        >
          رسیدگی شده ({{ stats.resolved }})
        </button>
        <button
            @click="filterStatus = 'dismissed'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium', filterStatus === 'dismissed' ? 'btn-primary' : 'btn-secondary']"
        >
          رد شده ({{ stats.dismissed }})
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <ReportStat title="کل گزارش‌ها" :value="stats.total" icon="ti-flag" />
      <ReportStat title="در انتظار بررسی" :value="stats.pending" icon="ti-clock" color="orange" />
      <ReportStat title="رسیدگی شده" :value="stats.resolved" icon="ti-check" color="green" />
      <ReportStat title="رد شده" :value="stats.dismissed" icon="ti-x" color="red" />
    </div>

    <!-- List -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6 border-b">
        <input
            v-model="searchQuery"
            placeholder="جستجو در گزارش‌ها..."
            class="px-4 py-2 border rounded-lg w-full lg:w-1/3"
        />
      </div>

      <div v-if="filteredReports.length === 0" class="p-12 text-center text-gray-500">
        گزارشی یافت نشد
      </div>

      <div v-for="report in filteredReports" :key="report.id" class="p-6 hover:bg-gray-50 transition-colors">
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span class="text-white font-medium">{{ report.reporter.charAt(0) }}</span>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="font-bold text-gray-900">{{ report.reporter }}</h4>
              <span :class="getStatusColor(report.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {{ getStatusLabel(report.status) }}
        </span>
              <span class="text-sm text-gray-500">{{ report.date }}</span>
            </div>

            <p class="text-gray-700 mb-3">{{ report.reason }}</p>

            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span><i class="ti ti-alert-circle"></i> {{ report.reportType }}</span>
              <span><i class="ti ti-link"></i> {{ report.targetTitle }}</span>
            </div>

            <div class="flex gap-2 mt-4">
              <button
                  v-if="report.status === 'pending'"
                  @click="resolveReport(report.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
              >
                رسیدگی
              </button>
              <button
                  v-if="report.status !== 'dismissed'"
                  @click="dismissReport(report.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
              >
                رد
              </button>
              <button
                  @click="viewReport(report.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
              >
                جزئیات
              </button>
              <button
                  @click="deleteReport(report.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,onMounted } from 'vue'
import ReportStat from "../../../components/ReportStat.vue";
import {useReportStore} from "../../../stores/film-report";

const filterStatus = ref('all')
const searchQuery = ref('')

/*const stats = ref({
  total: 32,
  pending: 6,
  resolved: 22,
  dismissed: 4
})*/
const reportStore = useReportStore()

onMounted(() => {
  reportStore.fetchReports()
})

const reports = computed(() => reportStore.reports)
const stats = computed(() => reportStore.stats)

/*const reports = ref([
  {
    id: 1,
    reporter: 'علی رضایی',
    reason: 'محتوای توهین‌آمیز',
    reportType: 'Abuse',
    targetTitle: 'نظر زیر فیلم Inception',
    status: 'pending',
    date: '1 ساعت پیش'
  },
  {
    id: 2,
    reporter: 'مریم کاظمی',
    reason: 'اسپم تبلیغاتی',
    reportType: 'Spam',
    targetTitle: 'پست آموزش ارز دیجیتال',
    status: 'resolved',
    date: '5 ساعت پیش'
  }
])*/

const filteredReports = computed(() => {
  let result = reports.value
  if (filterStatus.value !== 'all') {
    result = result.filter(r => r.status === filterStatus.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r =>
        r.reporter.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    )
  }
  return result
})

const getStatusColor = (status: string) => ({
  pending: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-red-100 text-red-800'
}[status])

const getStatusLabel = (status: string) => ({
  pending: 'در انتظار',
  resolved: 'رسیدگی شده',
  dismissed: 'رد شده'
}[status])
const resolveReport = async (id: string) => {
  const r = reports.value.find(r => r.id === id)
  if (r && r.status === 'pending') {
    // آپدیت سرور
    await reportStore.changeStatus(id, 'resolved')
    // آپدیت استور و UI
    r.status = 'resolved'
  }
}

const dismissReport = async (id: string) => {
  const r = reports.value.find(r => r.id === id)
  if (r && r.status !== 'dismissed') {
    await reportStore.changeStatus(id, 'dismissed')
    r.status = 'dismissed'
  }
}

const viewReport = (id: string) => {
  console.log('view report', id)
  // می‌تونی پنجره جزئیات یا modal باز کنی
}

const deleteReport = async (id: string) => {
  const index = reports.value.findIndex(r => r.id === id)
  if (index !== -1) {
    // ابتدا می‌تونی درخواست سرور برای حذف ارسال کنی
    await reportStore.deleteReport(id)
    reports.value.splice(index, 1)
  }
}

</script>
