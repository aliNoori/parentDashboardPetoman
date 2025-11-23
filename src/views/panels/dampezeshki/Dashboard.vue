<template>
  <div class="space-y-4">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
            <i class="ti ti-calendar-check text-xl text-sky-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.todayAppointments }}</h3>
        <p class="text-sm text-gray-600 mb-1">نوبت‌های امروز</p>
        <p class="text-xs text-sky-600 font-medium">
          <i class="ti ti-arrow-up text-xs"></i>
          8 نوبت جدید
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-paw text-xl text-blue-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalPatients }}</h3>
        <p class="text-sm text-gray-600 mb-1">بیماران فعال</p>
        <p class="text-xs text-blue-600 font-medium">
          <i class="ti ti-heart text-xs"></i>
          در مراقبت
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-xl text-green-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.completedToday }}</h3>
        <p class="text-sm text-gray-600 mb-1">انجام شده امروز</p>
        <p class="text-xs text-green-600 font-medium">
          <i class="ti ti-circle-check text-xs"></i>
          موفق
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-wallet text-xl text-purple-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.income.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600 mb-1">درآمد امروز (تومان)</p>
        <p class="text-xs text-purple-600 font-medium">
          <i class="ti ti-trending-up text-xs"></i>
          +12%
        </p>
      </div>
    </div>

    <!-- Today's Appointments & Recent Patients -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Today's Appointments -->
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">نوبت‌های امروز</h2>
          <i class="ti ti-calendar text-sky-600"></i>
        </div>

        <div class="space-y-3">
          <div v-for="appointment in todayAppointments" :key="appointment.id" class="flex items-start gap-3 pb-3 border-b last:border-0">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-paw text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-gray-900">{{ appointment.petName }}</p>
                <span class="text-xs font-bold text-sky-600">{{ appointment.time }}</span>
              </div>
              <p class="text-xs text-gray-600 mb-1">صاحب: {{ appointment.ownerName }}</p>
              <div class="flex items-center gap-2">
                <span :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                  appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                ]">
                  {{ appointment.status === 'completed' ? 'انجام شده' : 
                     appointment.status === 'in-progress' ? 'در حال انجام' : 'در انتظار' }}
                </span>
                <span class="text-xs text-gray-500">{{ appointment.service }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="w-full mt-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
          مشاهده همه نوبت‌ها
        </button>
      </div>

      <!-- Recent Patients -->
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">بیماران اخیر</h2>
          <i class="ti ti-paw text-purple-600"></i>
        </div>

        <div class="space-y-3">
          <div v-for="patient in recentPatients" :key="patient.id" class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', patient.typeColor]">
                  <i class="ti ti-paw text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">{{ patient.name }}</h3>
                  <p class="text-xs text-gray-600">{{ patient.type }} - {{ patient.age }}</p>
                </div>
              </div>
              <span class="text-xs text-gray-500">{{ patient.lastVisit }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-gray-600">صاحب:</span>
              <span class="font-medium text-gray-900">{{ patient.owner }}</span>
            </div>
          </div>
        </div>

        <button class="w-full mt-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          مشاهده همه بیماران
        </button>
      </div>
    </div>

    <!-- Services Overview -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">خدمات پرطرفدار</h2>
        <i class="ti ti-briefcase text-orange-600"></i>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="service in popularServices" :key="service.id" class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', service.color]">
              <i :class="[service.icon, 'text-2xl text-white']"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-bold text-gray-900">{{ service.name }}</h3>
              <p class="text-xs text-gray-600">{{ service.count }} مورد</p>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">درآمد:</span>
            <span class="font-bold text-gray-900">{{ service.revenue.toLocaleString() }} تومان</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  todayAppointments: 12,
  totalPatients: 156,
  completedToday: 8,
  income: 3200000
})

const todayAppointments = ref([
  {
    id: 1,
    petName: 'ماکس',
    ownerName: 'محمد رضایی',
    time: '10:00',
    service: 'معاینه عمومی',
    status: 'completed'
  },
  {
    id: 2,
    petName: 'میلو',
    ownerName: 'زهرا احمدی',
    time: '11:30',
    service: 'واکسیناسیون',
    status: 'in-progress'
  },
  {
    id: 3,
    petName: 'لوسی',
    ownerName: 'علی کریمی',
    time: '14:00',
    service: 'جراحی',
    status: 'pending'
  },
  {
    id: 4,
    petName: 'چارلی',
    ownerName: 'فاطمه حسینی',
    time: '15:30',
    service: 'دندانپزشکی',
    status: 'pending'
  }
])

const recentPatients = ref([
  {
    id: 1,
    name: 'ماکس',
    type: 'سگ باکسر',
    age: '3 ساله',
    owner: 'محمد رضایی',
    lastVisit: 'امروز',
    typeColor: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    id: 2,
    name: 'میلو',
    type: 'گربه پرشین',
    age: '2 ساله',
    owner: 'زهرا احمدی',
    lastVisit: 'دیروز',
    typeColor: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    id: 3,
    name: 'لوسی',
    type: 'سگ گلدن',
    age: '5 ساله',
    owner: 'علی کریمی',
    lastVisit: '2 روز پیش',
    typeColor: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    id: 4,
    name: 'چارلی',
    type: 'گربه ملوس',
    age: '1 ساله',
    owner: 'فاطمه حسینی',
    lastVisit: '3 روز پیش',
    typeColor: 'bg-gradient-to-br from-orange-400 to-orange-600'
  }
])

const popularServices = ref([
  {
    id: 1,
    name: 'معاینه عمومی',
    count: 45,
    revenue: 9000000,
    icon: 'ti ti-stethoscope',
    color: 'bg-gradient-to-br from-sky-400 to-sky-600'
  },
  {
    id: 2,
    name: 'واکسیناسیون',
    count: 38,
    revenue: 5700000,
    icon: 'ti ti-vaccine',
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    id: 3,
    name: 'جراحی',
    count: 12,
    revenue: 18000000,
    icon: 'ti ti-cut',
    color: 'bg-gradient-to-br from-red-400 to-red-600'
  },
  {
    id: 4,
    name: 'دندانپزشکی',
    count: 22,
    revenue: 8800000,
    icon: 'ti ti-tooth',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  }
])
</script>
