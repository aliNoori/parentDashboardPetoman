<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-briefcase text-2xl text-blue-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">کل خدمات</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">24</h3>
        <p class="text-sm text-gray-500 mt-1">خدمات فعال</p>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-stethoscope text-2xl text-green-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">درمانی</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">12</h3>
        <p class="text-sm text-gray-500 mt-1">ویزیت و معاینه</p>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-vaccine text-2xl text-purple-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">پیشگیری</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">8</h3>
        <p class="text-sm text-gray-500 mt-1">واکسن و انگل‌زدایی</p>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-scissors text-2xl text-orange-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">زیبایی</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">4</h3>
        <p class="text-sm text-gray-500 mt-1">نگهداری و پرستاری</p>
      </div>
    </div>

    <!-- Add Service Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold text-gray-900">لیست خدمات</h2>
      <button class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
        <i class="ti ti-plus"></i>
        <span>افزودن خدمت جدید</span>
      </button>
    </div>

    <!-- Services Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div 
        v-for="service in services" 
        :key="service.id"
        class="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-3">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="service.iconBg"
            >
              <i :class="[service.icon, 'text-2xl']" :style="{ color: service.iconColor }"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
            </div>
          </div>
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-dots-vertical text-gray-600"></i>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">هزینه</p>
            <p class="font-bold text-gray-900">{{ service.price.toLocaleString() }} تومان</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">مدت زمان</p>
            <p class="font-bold text-gray-900">{{ service.duration }} دقیقه</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1 text-gray-600">
              <i class="ti ti-users text-gray-400"></i>
              <span>{{ service.bookings }} نوبت</span>
            </div>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="service.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'"
            >
              {{ service.active ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors" title="ویرایش">
              <i class="ti ti-edit"></i>
            </button>
            <button class="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="حذف">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const services = ref([
  {
    id: 1,
    name: 'ویزیت عمومی',
    description: 'معاینه و بررسی وضعیت سلامت حیوان',
    price: 150000,
    duration: 30,
    bookings: 45,
    active: true,
    icon: 'ti ti-stethoscope',
    iconBg: 'bg-blue-50',
    iconColor: '#3b82f6'
  },
  {
    id: 2,
    name: 'واکسیناسیون',
    description: 'تزریق واکسن‌های مورد نیاز',
    price: 200000,
    duration: 15,
    bookings: 38,
    active: true,
    icon: 'ti ti-vaccine',
    iconBg: 'bg-green-50',
    iconColor: '#10b981'
  },
  {
    id: 3,
    name: 'جراحی عمومی',
    description: 'اعمال جراحی عمومی و تخصصی',
    price: 1500000,
    duration: 120,
    bookings: 12,
    active: true,
    icon: 'ti ti-blade',
    iconBg: 'bg-red-50',
    iconColor: '#ef4444'
  },
  {
    id: 4,
    name: 'انگل‌زدایی',
    description: 'درمان و پیشگیری انگل‌های داخلی و خارجی',
    price: 100000,
    duration: 20,
    bookings: 52,
    active: true,
    icon: 'ti ti-bug',
    iconBg: 'bg-orange-50',
    iconColor: '#f97316'
  },
  {
    id: 5,
    name: 'سونوگرافی',
    description: 'تصویربرداری با امواج فراصوت',
    price: 350000,
    duration: 45,
    bookings: 18,
    active: true,
    icon: 'ti ti-scan',
    iconBg: 'bg-purple-50',
    iconColor: '#a855f7'
  },
  {
    id: 6,
    name: 'رادیوگرافی',
    description: 'عکس‌برداری با اشعه ایکس',
    price: 300000,
    duration: 30,
    bookings: 22,
    active: true,
    icon: 'ti ti-photo',
    iconBg: 'bg-indigo-50',
    iconColor: '#6366f1'
  },
  {
    id: 7,
    name: 'آزمایش خون',
    description: 'انجام آزمایشات مختلف خونی',
    price: 250000,
    duration: 15,
    bookings: 31,
    active: true,
    icon: 'ti ti-droplet',
    iconBg: 'bg-rose-50',
    iconColor: '#f43f5e'
  },
  {
    id: 8,
    name: 'دندانپزشکی',
    description: 'جرم‌گیری و درمان دندان',
    price: 400000,
    duration: 60,
    bookings: 15,
    active: true,
    icon: 'ti ti-dental',
    iconBg: 'bg-cyan-50',
    iconColor: '#06b6d4'
  },
  {
    id: 9,
    name: 'کوتاهی مو و ناخن',
    description: 'خدمات آرایشی و بهداشتی',
    price: 120000,
    duration: 45,
    bookings: 28,
    active: true,
    icon: 'ti ti-scissors',
    iconBg: 'bg-pink-50',
    iconColor: '#ec4899'
  },
  {
    id: 10,
    name: 'حمام و شستشو',
    description: 'حمام و شستشوی کامل حیوان',
    price: 150000,
    duration: 60,
    bookings: 35,
    active: true,
    icon: 'ti ti-bath',
    iconBg: 'bg-teal-50',
    iconColor: '#14b8a6'
  },
  {
    id: 11,
    name: 'مشاوره تغذیه',
    description: 'برنامه‌ریزی رژیم غذایی',
    price: 100000,
    duration: 30,
    bookings: 19,
    active: true,
    icon: 'ti ti-apple',
    iconBg: 'bg-lime-50',
    iconColor: '#84cc16'
  },
  {
    id: 12,
    name: 'بستری',
    description: 'نگهداری و مراقبت شبانه‌روزی',
    price: 500000,
    duration: 1440,
    bookings: 8,
    active: true,
    icon: 'ti ti-bed',
    iconBg: 'bg-amber-50',
    iconColor: '#f59e0b'
  }
])
</script>
