<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-pill text-2xl text-blue-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">کل سفارشات</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">156</h3>
        <p class="text-sm text-gray-500 mt-1">این ماه</p>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-check text-2xl text-green-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">تحویل شده</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">142</h3>
        <p class="text-sm text-gray-500 mt-1">91% موفقیت</p>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-clock text-2xl text-orange-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">در انتظار</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">14</h3>
        <p class="text-sm text-gray-500 mt-1">نیاز به پیگیری</p>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-file-description text-2xl text-purple-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-500">با نسخه</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">89</h3>
        <p class="text-sm text-gray-500 mt-1">57% از کل</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent">
            <option value="">همه</option>
            <option value="pending">در انتظار</option>
            <option value="processing">در حال پردازش</option>
            <option value="ready">آماده تحویل</option>
            <option value="delivered">تحویل شده</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">نوع سفارش</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent">
            <option value="">همه</option>
            <option value="prescription">با نسخه</option>
            <option value="no-prescription">بدون نسخه</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">از تاریخ</label>
          <input type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="نام صاحب حیوان یا کد سفارش..."
              class="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">کد سفارش</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">صاحب حیوان</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">حیوان</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">دارو</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">نوع</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">وضعیت</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-mono text-sm text-gray-900">{{ order.code }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ order.owner }}</p>
                  <p class="text-sm text-gray-500">{{ order.phone }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                    <i class="ti ti-paw text-sky-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ order.pet }}</p>
                    <p class="text-xs text-gray-500">{{ order.petType }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ order.medicine }}</p>
                  <p class="text-sm text-gray-500">{{ order.dosage }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="order.hasPrescription ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'"
                >
                  <i :class="order.hasPrescription ? 'ti ti-file-description' : 'ti ti-file-off'"></i>
                  {{ order.hasPrescription ? 'با نسخه' : 'بدون نسخه' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5 text-sm text-gray-600">
                  <i class="ti ti-calendar text-gray-400"></i>
                  <span>{{ order.date }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  <i :class="getStatusIcon(order.status)"></i>
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    v-if="order.hasPrescription"
                    class="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                    title="مشاهده نسخه"
                  >
                    <i class="ti ti-file-description"></i>
                  </button>
                  <button class="p-2 hover:bg-sky-50 text-sky-600 rounded-lg transition-colors" title="جزئیات">
                    <i class="ti ti-eye"></i>
                  </button>
                  <button class="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors" title="ویرایش">
                    <i class="ti ti-edit"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p class="text-sm text-gray-600">نمایش 1 تا 10 از 156 سفارش</p>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <i class="ti ti-chevron-right"></i>
          </button>
          <button class="px-3 py-1.5 bg-sky-600 text-white rounded-lg">1</button>
          <button class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
          <button class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
          <button class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  {
    id: 1,
    code: 'MED-1001',
    owner: 'علی محمدی',
    phone: '0912-345-6789',
    pet: 'ماکس',
    petType: 'سگ',
    medicine: 'آنتی‌بیوتیک آموکسی‌سیلین',
    dosage: '500mg - دو بار در روز',
    hasPrescription: true,
    date: '1403/07/15',
    status: 'delivered'
  },
  {
    id: 2,
    code: 'MED-1002',
    owner: 'فاطمه احمدی',
    phone: '0913-456-7890',
    pet: 'میلو',
    petType: 'گربه',
    medicine: 'شامپو ضد کک',
    dosage: 'هفته‌ای یکبار',
    hasPrescription: false,
    date: '1403/07/15',
    status: 'ready'
  },
  {
    id: 3,
    code: 'MED-1003',
    owner: 'محمد رضایی',
    phone: '0914-567-8901',
    pet: 'راکی',
    petType: 'سگ',
    medicine: 'مسکن ترامادول',
    dosage: '50mg - سه بار در روز',
    hasPrescription: true,
    date: '1403/07/14',
    status: 'processing'
  },
  {
    id: 4,
    code: 'MED-1004',
    owner: 'زهرا کریمی',
    phone: '0915-678-9012',
    pet: 'لونا',
    petType: 'گربه',
    medicine: 'ویتامین B12',
    dosage: 'ماهی یکبار تزریقی',
    hasPrescription: true,
    date: '1403/07/14',
    status: 'delivered'
  },
  {
    id: 5,
    code: 'MED-1005',
    owner: 'حسین نوری',
    phone: '0916-789-0123',
    pet: 'باکی',
    petType: 'سگ',
    medicine: 'قرص ضد انگل',
    dosage: 'ماهی یکبار',
    hasPrescription: false,
    date: '1403/07/13',
    status: 'pending'
  },
  {
    id: 6,
    code: 'MED-1006',
    owner: 'مریم حسینی',
    phone: '0917-890-1234',
    pet: 'چارلی',
    petType: 'گربه',
    medicine: 'آنتی‌هیستامین',
    dosage: '10mg - روزی یکبار',
    hasPrescription: true,
    date: '1403/07/13',
    status: 'ready'
  },
  {
    id: 7,
    code: 'MED-1007',
    owner: 'رضا احمدی',
    phone: '0918-901-2345',
    pet: 'دیزی',
    petType: 'سگ',
    medicine: 'قطره چشمی',
    dosage: 'دو بار در روز',
    hasPrescription: false,
    date: '1403/07/12',
    status: 'delivered'
  },
  {
    id: 8,
    code: 'MED-1008',
    owner: 'سارا مرادی',
    phone: '0919-012-3456',
    pet: 'کوکی',
    petType: 'گربه',
    medicine: 'آنتی‌بیوتیک سفالکسین',
    dosage: '250mg - سه بار در روز',
    hasPrescription: true,
    date: '1403/07/12',
    status: 'processing'
  }
])

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-orange-50 text-orange-700',
    processing: 'bg-blue-50 text-blue-700',
    ready: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700'
  }
  return classes[status] || 'bg-gray-50 text-gray-700'
}

const getStatusIcon = (status) => {
  const icons = {
    pending: 'ti ti-clock',
    processing: 'ti ti-loader',
    ready: 'ti ti-package',
    delivered: 'ti ti-check'
  }
  return icons[status] || 'ti ti-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'در انتظار',
    processing: 'در حال پردازش',
    ready: 'آماده تحویل',
    delivered: 'تحویل شده'
  }
  return labels[status] || 'نامشخص'
}
</script>
