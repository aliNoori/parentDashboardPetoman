<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">نوشته‌ها</h1>
        <p class="text-gray-600 mt-1">مدیریت تمام نوشته‌ها و مقالات</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="createNewPost" class="btn-primary">
          <i class="ti ti-plus ml-2"></i>
          نوشته جدید
        </button>
        <button @click="exportToExcel" class="btn-secondary">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل نوشته‌ها</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-article text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">منتشر شده</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.published }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">پیش‌نویس</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ stats.draft }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-edit text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">بازدید امروز</p>
            <p class="text-2xl font-bold text-purple-600 mt-1">{{ stats.todayViews }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-eye text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <i class="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در نوشته‌ها..."
            class="input-field pl-10"
          >
        </div>
      </div>
      
      <!-- Filters Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Status Filter -->
        <div class="relative">
          <button
            @click="showStatusDropdown = !showStatusDropdown"
            class="btn-secondary w-full justify-between"
          >
            <span class="truncate">{{ selectedStatus.label }}</span>
            <i class="ti ti-chevron-down text-sm flex-shrink-0 ml-2"></i>
          </button>
          <ul v-if="showStatusDropdown" class="dropdown-menu w-full">
            <li v-for="status in statusOptions" :key="status.value">
              <button
                @click="selectStatus(status)"
                class="dropdown-item w-full"
                :class="selectedStatus.value === status.value ? 'bg-orange-50 text-orange-600' : ''"
              >
                {{ status.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Category Filter -->
        <div class="relative">
          <button
            @click="showCategoryDropdown = !showCategoryDropdown"
            class="btn-secondary w-full justify-between"
          >
            <span class="truncate">{{ selectedCategory.label }}</span>
            <i class="ti ti-chevron-down text-sm flex-shrink-0 ml-2"></i>
          </button>
          <ul v-if="showCategoryDropdown" class="dropdown-menu w-full">
            <li v-for="category in categoryOptions" :key="category.value">
              <button
                @click="selectCategory(category)"
                class="dropdown-item w-full"
                :class="selectedCategory.value === category.value ? 'bg-orange-50 text-orange-600' : ''"
              >
                {{ category.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Date Filter -->
        <div class="relative">
          <button
            @click="showDateDropdown = !showDateDropdown"
            class="btn-secondary w-full justify-between"
          >
            <span class="truncate">{{ selectedDate.label }}</span>
            <i class="ti ti-chevron-down text-sm flex-shrink-0 ml-2"></i>
          </button>
          <ul v-if="showDateDropdown" class="dropdown-menu w-full">
            <li v-for="date in dateOptions" :key="date.value">
              <button
                @click="selectDate(date)"
                class="dropdown-item w-full"
                :class="selectedDate.value === date.value ? 'bg-orange-50 text-orange-600' : ''"
              >
                {{ date.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        <span class="text-sm text-gray-600 flex-shrink-0">فیلترهای فعال:</span>
        <div class="flex flex-wrap gap-2">
          <span v-if="selectedStatus.value !== 'all'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {{ selectedStatus.label }}
            <button @click="selectStatus(statusOptions[0])" class="mr-1 hover:text-orange-600">
              <i class="ti ti-x text-xs"></i>
            </button>
          </span>
          <span v-if="selectedCategory.value !== 'all'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ selectedCategory.label }}
            <button @click="selectCategory(categoryOptions[0])" class="mr-1 hover:text-blue-600">
              <i class="ti ti-x text-xs"></i>
            </button>
          </span>
          <span v-if="selectedDate.value !== 'all'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {{ selectedDate.label }}
            <button @click="selectDate(dateOptions[0])" class="mr-1 hover:text-purple-600">
              <i class="ti ti-x text-xs"></i>
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Posts List - Desktop Table / Mobile Cards -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">عنوان</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">دسته‌بندی</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">وضعیت</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">بازدید</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-900">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="post.image"
                    :alt="post.title"
                    class="w-10 h-10 rounded-lg object-cover"
                  >
                  <div>
                    <p class="font-medium text-gray-900">{{ post.title }}</p>
                    <p class="text-sm text-gray-500">{{ post.excerpt }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ post.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusColor(post.status)"
                >
                  {{ getStatusLabel(post.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-900">{{ post.views.toLocaleString() }}</td>
              <td class="px-6 py-4 text-gray-900">{{ post.date }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="editPost(post)" 
                    class="btn-icon hover:bg-blue-50 hover:text-blue-600"
                    title="ویرایش"
                  >
                    <i class="ti ti-edit text-sm"></i>
                  </button>
                  <button 
                    @click="previewPost(post)" 
                    class="btn-icon hover:bg-green-50 hover:text-green-600"
                    title="پیش‌نمایش"
                  >
                    <i class="ti ti-eye text-sm"></i>
                  </button>
                  <button 
                    @click="deletePost(post)" 
                    class="btn-icon hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <i class="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="lg:hidden divide-y divide-gray-200">
        <div v-for="post in filteredPosts" :key="post.id" class="p-4">
          <div class="flex items-start gap-3">
            <img
              :src="post.image"
              :alt="post.title"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            >
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 truncate">{{ post.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ post.excerpt }}</p>
                </div>
                
                <!-- Actions Menu -->
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button 
                    @click="editPost(post)" 
                    class="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="ویرایش"
                  >
                    <i class="ti ti-edit text-lg"></i>
                  </button>
                  <button 
                    @click="previewPost(post)" 
                    class="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                    title="پیش‌نمایش"
                  >
                    <i class="ti ti-eye text-lg"></i>
                  </button>
                  <button 
                    @click="deletePost(post)" 
                    class="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="حذف"
                  >
                    <i class="ti ti-trash text-lg"></i>
                  </button>
                </div>
              </div>
              
              <!-- Post Meta Info -->
              <div class="flex items-center gap-4 mt-3 text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ post.category }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusColor(post.status)"
                >
                  {{ getStatusLabel(post.status) }}
                </span>
              </div>
              
              <!-- Views and Date -->
              <div class="flex items-center justify-between mt-3 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <i class="ti ti-eye text-gray-400"></i>
                  <span>{{ post.views.toLocaleString() }} بازدید</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="ti ti-calendar text-gray-400"></i>
                  <span>{{ post.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State for Mobile -->
        <div v-if="filteredPosts.length === 0" class="p-8 text-center">
          <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="ti ti-article text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">هیچ نوشته‌ای یافت نشد</h3>
          <p class="text-gray-500">با تغییر فیلترها یا جستجوی جدید تلاش کنید</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700 order-2 sm:order-1">
          نمایش {{ (currentPage - 1) * perPage + 1 }} تا {{ Math.min(currentPage * perPage, totalPosts) }} از {{ totalPosts }} نتیجه
        </div>
        
        <div class="flex items-center gap-2 order-1 sm:order-2">
          <!-- First Page -->
          <button
            @click="currentPage = 1"
            :disabled="currentPage === 1"
            class="hidden sm:flex btn-icon"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            title="صفحه اول"
          >
            <i class="ti ti-chevrons-right"></i>
          </button>
          
          <!-- Previous Page -->
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="btn-icon"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            title="صفحه قبل"
          >
            <i class="ti ti-chevron-right"></i>
          </button>
          
          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              class="btn-icon min-w-[2rem]"
              :class="currentPage === page ? 'bg-orange-500 text-white hover:bg-orange-600' : 'hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </div>
          
          <!-- Next Page -->
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="btn-icon"
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            title="صفحه بعد"
          >
            <i class="ti ti-chevron-left"></i>
          </button>
          
          <!-- Last Page -->
          <button
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
            class="hidden sm:flex btn-icon"
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            title="صفحه آخر"
          >
            <i class="ti ti-chevrons-left"></i>
          </button>
        </div>
      </div>
      
      <!-- Items per page selector -->
      <div class="flex items-center justify-center mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>نمایش</span>
          <select
            v-model="perPage"
            @change="currentPage = 1"
            class="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <span>نوشته در صفحه</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6">
      <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
        <i class="ti ti-trash text-red-600 text-xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 text-center mb-2">حذف نوشته</h3>
      <p class="text-gray-600 text-center mb-6">
        آیا مطمئن هستید که می‌خواهید نوشته "{{ selectedPost?.title }}" را حذف کنید؟ این عمل قابل بازگشت نیست.
      </p>
      <div class="flex gap-3">
        <button @click="confirmDelete" class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
          حذف کن
        </button>
        <button @click="cancelDelete" class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
          انصراف
        </button>
      </div>
    </div>
  </div>

  <!-- Preview Modal -->
  <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">پیش‌نمایش نوشته</h3>
        <button @click="showPreviewModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="ti ti-x text-xl text-gray-500"></i>
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="p-6" v-if="selectedPost">
        <!-- Post Image -->
        <img 
          :src="selectedPost.image" 
          :alt="selectedPost.title"
          class="w-full h-48 object-cover rounded-lg mb-6"
        >
        
        <!-- Post Meta -->
        <div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ selectedPost.category }}
          </span>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusColor(selectedPost.status)"
          >
            {{ getStatusLabel(selectedPost.status) }}
          </span>
          <span class="flex items-center gap-1">
            <i class="ti ti-eye"></i>
            {{ selectedPost.views.toLocaleString() }} بازدید
          </span>
          <span class="flex items-center gap-1">
            <i class="ti ti-calendar"></i>
            {{ selectedPost.date }}
          </span>
        </div>
        
        <!-- Post Title -->
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ selectedPost.title }}</h1>
        
        <!-- Post Excerpt -->
        <p class="text-gray-600 mb-6">{{ selectedPost.excerpt }}</p>
        
        <!-- Post Content (sample) -->
        <div class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed">
            این یک محتوای نمونه برای پیش‌نمایش نوشته است. در حقیقت، محتوای کامل نوشته از دیتابیس یا API دریافت می‌شود و در اینجا نمایش داده می‌شود.
          </p>
          <p class="text-gray-700 leading-relaxed mt-4">
            شما می‌توانید تمام فرمت‌های متنی، تصاویر، لیست‌ها و سایر عناصر HTML را در این بخش مشاهده کنید.
          </p>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200">
        <button @click="editPost(selectedPost)" class="btn-primary">
          <i class="ti ti-edit ml-2"></i>
          ویرایش
        </button>
        <button @click="showPreviewModal = false" class="btn-secondary">
          بستن
        </button>
      </div>
    </div>
  </div>

  <!-- Notifications -->
  <div class="fixed bottom-4 left-4 z-50 space-y-2">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] transform transition-all duration-300"
      :class="{
        'border-green-200 bg-green-50': notification.type === 'success',
        'border-red-200 bg-red-50': notification.type === 'error',
        'border-orange-200 bg-orange-50': notification.type === 'warning',
        'border-blue-200 bg-blue-50': notification.type === 'info'
      }"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <i
            class="text-lg"
            :class="{
              'ti ti-check text-green-600': notification.type === 'success',
              'ti ti-x text-red-600': notification.type === 'error',
              'ti ti-alert-triangle text-orange-600': notification.type === 'warning',
              'ti ti-info-circle text-blue-600': notification.type === 'info'
            }"
          ></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium" :class="{
            'text-green-800': notification.type === 'success',
            'text-red-800': notification.type === 'error',
            'text-orange-800': notification.type === 'warning',
            'text-blue-800': notification.type === 'info'
          }">
            {{ notification.message }}
          </p>
          <div class="mt-2 bg-gray-200 rounded-full h-1">
            <div
              class="h-1 rounded-full transition-all duration-75"
              :class="{
                'bg-green-500': notification.type === 'success',
                'bg-red-500': notification.type === 'error',
                'bg-orange-500': notification.type === 'warning',
                'bg-blue-500': notification.type === 'info'
              }"
              :style="{ width: notification.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {usePostStore} from "@/stores/post.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";

const router = null // Remove router for now
const postStore=usePostStore()
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const showStatusDropdown = ref(false)
const showCategoryDropdown = ref(false)
const showDateDropdown = ref(false)
const showDeleteModal = ref(false)
const showPreviewModal = ref(false)
const selectedPost = ref(null)

// Notification system
const notifications = ref([])

const showNotification = (message, type = 'success') => {
  const id = Date.now()
  const notification = {
    id,
    message,
    type,
    progress: 100
  }
  
  notifications.value.push(notification)
  
  // Auto remove after 4 seconds
  const timer = setInterval(() => {
    notification.progress -= 2
    if (notification.progress <= 0) {
      clearInterval(timer)
      notifications.value = notifications.value.filter(n => n.id !== id)
    }
  }, 80)
}
const posts=computed(()=>postStore.posts)
const stats = computed(() => {
  const total = posts.value.length
  const published = posts.value.filter(p => p.status === 'published').length
  const draft = posts.value.filter(p => p.status === 'draft').length
  const todayViews = posts.value
      .filter(p => {
        // مقایسه تاریخ امروز با publishDate یا createdAt
        const today = new Date().toLocaleDateString('fa-IR')
        const postDate = new Date(p.publishDate || p.createdAt).toLocaleDateString('fa-IR')
        return postDate === today
      })
      .reduce((sum, p) => sum + (p.views ?? 0), 0)

  return { total, published, draft, todayViews }
})

const selectedStatus = ref({ value: 'all', label: 'همه وضعیت‌ها' })
const selectedCategory = ref({ value: 'all', label: 'همه دسته‌ها' })
const selectedDate = ref({ value: 'all', label: 'همه تاریخ‌ها' })

const statusOptions = ref([
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'published', label: 'منتشر شده' },
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'pending', label: 'در انتظار تایید' }
])
const categoryTypeStore=useCategoryTypeStore()
const categoryStore=useCategoryStore()
const categories=computed(()=>categoryStore.categories)
const categoryOptions = computed(() => {
  const opts = categories.value.map(c => ({
    value: c.id,
    label: c.title
  }))
  return [
    { value: 'all', label: 'همه دسته‌ها' },
    ...opts
  ]
})

const dateOptions = ref([
  { value: 'all', label: 'همه تاریخ‌ها' },
  { value: 'today', label: 'امروز' },
  { value: 'week', label: 'این هفته' },
  { value: 'month', label: 'این ماه' },
  { value: 'year', label: 'امسال' }
])

/*const posts = ref([
  {
    id: 1,
    title: 'نکات مهم برای نگهداری از سگ‌ها',
    excerpt: 'راهنمای کامل برای مراقبت از سگ‌های خانگی',
    category: 'مراقبت',
    status: 'published',
    views: 1250,
    date: '1403/08/05',
    image: 'https://via.placeholder.com/40x40'
  },
  {
    id: 2,
    title: 'تغذیه صحیح گربه‌ها',
    excerpt: 'آنچه باید درباره تغذیه گربه‌ها بدانید',
    category: 'تغذیه',
    status: 'published',
    views: 980,
    date: '1403/08/04',
    image: 'https://via.placeholder.com/40x40'
  },
  {
    id: 3,
    title: 'بیماری‌های شایع در پرندگان',
    excerpt: 'شناخت و درمان بیماری‌های پرندگان خانگی',
    category: 'سلامت حیوانات',
    status: 'draft',
    views: 0,
    date: '1403/08/03',
    image: 'https://via.placeholder.com/40x40'
  }
])*/

const filteredPosts = computed(() => {
  let filtered = posts.value
console.log('searchQuery.value',searchQuery.value.toLowerCase())
  if (searchQuery.value) {
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatus.value.value !== 'all') {
    filtered = filtered.filter(post => post.status === selectedStatus.value.value)
  }

  if (selectedCategory.value.value !== 'all') {

    filtered = filtered.filter(post => post.categoryId === selectedCategory.value.value)
  }

  return filtered
})

const totalPosts = computed(() => filteredPosts.value.length)

const totalPages = computed(() => Math.ceil(totalPosts.value / perPage.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const hasActiveFilters = computed(() => {
  return selectedStatus.value.value !== 'all' || 
         selectedCategory.value.value !== 'all' || 
         selectedDate.value.value !== 'all'
})

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const selectCategory = (category) => {

  selectedCategory.value = category
  showCategoryDropdown.value = false
}

const selectDate = (date) => {
  selectedDate.value = date
  showDateDropdown.value = false
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

const exportToExcel = () => {
  // Create posts data for export
  const exportData = [
    ['عنوان', 'وضعیت', 'دسته‌بندی', 'نویسنده', 'تاریخ انتشار', 'بازدید'],
    ...filteredPosts.value.map(post => [
      post.title,
      getStatusLabel(post.status),
      post.category,
      post.author,
      post.date,
      post.views.toString()
    ])
  ]

  // Convert to CSV
  const csvContent = exportData.map(row => row.join(',')).join('\n')
  
  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `posts_export_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  showNotification('فایل Excel با موفقیت دانلود شد', 'success')
}

// Post actions
const createNewPost = () => {
  showNotification('انتقال به صفحه ایجاد نوشته جدید', 'info')
  // Navigate using event system
  window.dispatchEvent(new CustomEvent('navigate-to-post-create'))
}

const editPost = (post) => {
  selectedPost.value = post
  showNotification(`انتقال به صفحه ویرایش نوشته "${post.title}"`, 'info')
  // Navigate using event system with post data
  window.dispatchEvent(new CustomEvent('navigate-to-post-edit', { detail: { post } }))
}

const previewPost = (post) => {
  selectedPost.value = post
  showPreviewModal.value = true
}

const deletePost = async (post) => {
  selectedPost.value = post
  await postStore.deletePost(post.id)
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (selectedPost.value) {
    const index = posts.value.findIndex(p => p.id === selectedPost.value.id)
    if (index !== -1) {
      posts.value.splice(index, 1)
      showNotification(`نوشته "${selectedPost.value.title}" حذف شد`, 'success')
    }
  }
  showDeleteModal.value = false
  selectedPost.value = null
}

const cancelDelete = () => {
  showDeleteModal.value = false
  selectedPost.value = null
}

onMounted(async () => {

  await postStore.fetchPosts()
  await categoryTypeStore.fetchType('post')
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showStatusDropdown.value = false
      showCategoryDropdown.value = false
      showDateDropdown.value = false
    }
  })
})
watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id,contentType:'danim'})
      }
    },
    {immediate: true}
)
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

.btn-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: #6b7280;
}

.btn-icon:hover {
  background-color: #f3f4f6;
}

.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}

.input-field:focus {
  box-shadow: 0 0 0 2px #f97316;
  border-color: transparent;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 0.25rem 0;
}

.dropdown-item {
  width: 100%;
  text-align: right;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

/* Additional mobile-friendly styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .btn-secondary {
    justify-content: space-between;
    text-align: right;
  }
  
  .dropdown-menu {
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>