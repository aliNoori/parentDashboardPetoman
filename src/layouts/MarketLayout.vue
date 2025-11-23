<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <button @click="toggleMobileSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-menu-2 text-xl text-gray-700"></i>
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-900">داشبورد مارکت</h1>
            <p class="text-xs text-gray-500">مدیریت فروشگاه</p>
          </div>
        </div>
        <button @click="$emit('back')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="ti ti-x text-xl text-gray-700"></i>
        </button>
      </div>
    </header>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block fixed top-0 right-0 w-64 h-screen bg-white border-l border-gray-200 z-50">
      <div class="flex flex-col h-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <i class="ti ti-shopping-cart text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">مارکت</h2>
              <p class="text-xs text-gray-500">فروشگاه آنلاین</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.id">
              <button
                @click="currentView = item.id"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                :class="currentView === item.id ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
              >
                <i :class="item.icon" class="text-xl"></i>
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="mr-auto bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {{ item.badge }}
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <div class="p-4 border-t border-gray-200">
          <button @click="$emit('back')" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
            <i class="ti ti-arrow-right text-xl"></i>
            <span>بازگشت به داشبورد اصلی</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <Transition name="fade">
      <div v-if="mobileSidebarOpen" @click="toggleMobileSidebar" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide-right">
      <aside v-if="mobileSidebarOpen" class="fixed top-0 right-0 w-64 h-screen bg-white z-[60] lg:hidden overflow-y-auto">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <i class="ti ti-shopping-cart text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">مارکت</h2>
                <p class="text-xs text-gray-500">فروشگاه آنلاین</p>
              </div>
            </div>
            <button @click="toggleMobileSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-700"></i>
            </button>
          </div>

          <nav class="flex-1 p-4">
            <ul class="space-y-2">
              <li v-for="item in menuItems" :key="item.id">
                <button
                  @click="currentView = item.id; toggleMobileSidebar()"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  :class="currentView === item.id ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <i :class="item.icon" class="text-xl"></i>
                  <span>{{ item.label }}</span>
                  <span v-if="item.badge" class="mr-auto bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {{ item.badge }}
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          <div class="p-4 border-t border-gray-200">
            <button @click="$emit('back')" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <i class="ti ti-arrow-right text-xl"></i>
              <span>بازگشت به داشبورد اصلی</span>
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="lg:mr-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
      <header class="hidden lg:block sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ getPageTitle() }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ getPageDescription() }}</p>
          </div>
        </div>
      </header>

      <div class="p-4 lg:p-6">
        <slot :currentView="currentView" />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[50] lg:hidden">
      <div class="flex items-center justify-around px-2 py-2">
        <button
          v-for="item in bottomNavItems"
          :key="item.id"
          @click="currentView = item.id"
          class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]"
          :class="currentView === item.id ? 'text-purple-600' : 'text-gray-600'"
        >
          <i :class="item.icon" class="text-2xl"></i>
          <span class="text-xs font-medium">{{ item.label }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['back'])
const mobileSidebarOpen = ref(false)
const currentView = ref('dashboard')

const menuItems = ref([
  { id: 'dashboard', label: 'داشبورد', icon: 'ti ti-dashboard' },
  { id: 'products', label: 'محصولات', icon: 'ti ti-package', badge: '142' },
  { id: 'orders', label: 'سفارشات', icon: 'ti ti-shopping-bag', badge: '23' },
  { id: 'customers', label: 'مشتریان', icon: 'ti ti-users' },
  { id: 'analytics', label: 'تحلیل‌ها', icon: 'ti ti-chart-bar' }
])

const bottomNavItems = ref([
  { id: 'dashboard', label: 'خانه', icon: 'ti ti-home' },
  { id: 'products', label: 'محصولات', icon: 'ti ti-package' },
  { id: 'orders', label: 'سفارشات', icon: 'ti ti-shopping-bag' },
  { id: 'customers', label: 'مشتریان', icon: 'ti ti-users' }
])

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const getPageTitle = () => {
  const item = menuItems.value.find(m => m.id === currentView.value)
  return item ? item.label : 'داشبورد'
}

const getPageDescription = () => {
  const descriptions = {
    dashboard: 'آمار و عملکرد فروشگاه',
    products: 'مدیریت محصولات و موجودی',
    orders: 'سفارشات و تحویل‌ها',
    customers: 'مدیریت مشتریان',
    analytics: 'تحلیل فروش و درآمد'
  }
  return descriptions[currentView.value] || ''
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}
</style>
