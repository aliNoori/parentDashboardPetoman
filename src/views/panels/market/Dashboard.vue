<template>
  <div class="space-y-4">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-package text-xl text-purple-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalProducts }}</h3>
        <p class="text-sm text-gray-600 mb-1">کل محصولات</p>
        <p class="text-xs text-purple-600 font-medium">
          <i class="ti ti-box text-xs"></i>
          موجود
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-shopping-bag text-xl text-blue-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.todayOrders }}</h3>
        <p class="text-sm text-gray-600 mb-1">سفارش امروز</p>
        <p class="text-xs text-blue-600 font-medium">
          <i class="ti ti-arrow-up text-xs"></i>
          +15%
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-wallet text-xl text-green-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.revenue.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600 mb-1">فروش امروز (تومان)</p>
        <p class="text-xs text-green-600 font-medium">
          <i class="ti ti-trending-up text-xs"></i>
          عالی
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <i class="ti ti-users text-xl text-orange-600"></i>
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ stats.customers.toLocaleString() }}</h3>
        <p class="text-sm text-gray-600 mb-1">مشتریان فعال</p>
        <p class="text-xs text-orange-600 font-medium">
          <i class="ti ti-heart text-xs"></i>
          وفادار
        </p>
      </div>
    </div>

    <!-- Best Selling Products & Recent Orders -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Best Selling -->
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">پرفروش‌ترین محصولات</h2>
          <i class="ti ti-star text-yellow-600"></i>
        </div>

        <div class="space-y-3">
          <div v-for="product in bestSelling" :key="product.id" class="flex items-start gap-3 pb-3 border-b last:border-0">
            <div class="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-900 mb-1">{{ product.name }}</h3>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-bold text-purple-600">{{ product.price.toLocaleString() }} تومان</span>
                <span class="text-xs text-gray-500">فروش: {{ product.sold }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ product.stock > 10 ? 'موجود' : 'کمبود موجودی' }}
                </span>
                <span class="text-xs text-gray-500">{{ product.stock }} عدد</span>
              </div>
            </div>
          </div>
        </div>

        <button class="w-full mt-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          مشاهده همه محصولات
        </button>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">سفارشات اخیر</h2>
          <i class="ti ti-shopping-bag text-blue-600"></i>
        </div>

        <div class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="text-sm font-bold text-gray-900 mb-1">سفارش #{{ order.id }}</h3>
                <p class="text-xs text-gray-600">{{ order.customer }}</p>
              </div>
              <span class="text-xs font-bold text-purple-600">{{ order.amount.toLocaleString() }} تومان</span>
            </div>
            <div class="flex items-center justify-between">
              <span :class="[
                'text-xs px-2 py-0.5 rounded-full',
                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              ]">
                {{ order.status === 'completed' ? 'تحویل شده' :
                   order.status === 'processing' ? 'در حال پردازش' :
                   order.status === 'pending' ? 'در انتظار' : 'لغو شده' }}
              </span>
              <span class="text-xs text-gray-500">{{ order.date }}</span>
            </div>
          </div>
        </div>

        <button class="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          مشاهده همه سفارشات
        </button>
      </div>
    </div>

    <!-- Top Categories -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">دسته‌بندی‌های برتر</h2>
        <i class="ti ti-category text-green-600"></i>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="category in topCategories" :key="category.id" class="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', category.color]">
              <i :class="[category.icon, 'text-2xl text-white']"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-bold text-gray-900">{{ category.name }}</h3>
              <p class="text-xs text-gray-600">{{ category.products }} محصول</p>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">فروش:</span>
            <span class="font-bold text-gray-900">{{ category.sales.toLocaleString() }} تومان</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  totalProducts: 456,
  todayOrders: 28,
  revenue: 8900000,
  customers: 3240
})

const bestSelling = ref([
  {
    id: 1,
    name: 'غذای خشک سگ رویال کنین',
    price: 450000,
    sold: 156,
    stock: 24,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: 2,
    name: 'غذای گربه پرشین پرومیوم',
    price: 320000,
    sold: 142,
    stock: 8,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: 3,
    name: 'تشک حیوانات خانگی',
    price: 280000,
    sold: 98,
    stock: 15,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: 4,
    name: 'اسباب بازی سگ',
    price: 85000,
    sold: 87,
    stock: 42,
    image: 'https://via.placeholder.com/100'
  }
])

const recentOrders = ref([
  {
    id: 10234,
    customer: 'محمد رضایی',
    amount: 680000,
    status: 'completed',
    date: '10 دقیقه پیش'
  },
  {
    id: 10233,
    customer: 'زهرا احمدی',
    amount: 450000,
    status: 'processing',
    date: '1 ساعت پیش'
  },
  {
    id: 10232,
    customer: 'علی کریمی',
    amount: 920000,
    status: 'pending',
    date: '2 ساعت پیش'
  },
  {
    id: 10231,
    customer: 'فاطمه حسینی',
    amount: 350000,
    status: 'completed',
    date: '3 ساعت پیش'
  }
])

const topCategories = ref([
  {
    id: 1,
    name: 'غذای حیوانات',
    products: 78,
    sales: 45600000,
    icon: 'ti ti-bone',
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    id: 2,
    name: 'لوازم نگهداری',
    products: 92,
    sales: 32400000,
    icon: 'ti ti-tool',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    id: 3,
    name: 'اسباب بازی',
    products: 65,
    sales: 18900000,
    icon: 'ti ti-ball-baseball',
    color: 'bg-gradient-to-br from-orange-400 to-orange-600'
  },
  {
    id: 4,
    name: 'لباس و پوشاک',
    products: 45,
    sales: 12700000,
    icon: 'ti ti-shirt',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  }
])
</script>
