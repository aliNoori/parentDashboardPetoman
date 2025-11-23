<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">صفحات</h1>
        <p class="text-gray-600">مدیریت صفحات ثابت سایت حامیان</p>
      </div>
      <div class="flex gap-3">
        <button @click="createNewPage" class="btn-primary">
          <i class="ti ti-plus ml-2"></i>
          صفحه جدید
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <p class="text-gray-600 text-sm">کل صفحات</p>
        <p class="text-2xl font-bold">{{ totalPages }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <p class="text-gray-600 text-sm">منتشر شده</p>
        <p class="text-2xl font-bold text-green-600">{{ publishedPages }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <p class="text-gray-600 text-sm">پیش‌نویس</p>
        <p class="text-2xl font-bold text-orange-600">{{ draftPages }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <p class="text-gray-600 text-sm">بازدید کل</p>
        <p class="text-2xl font-bold text-rose-600">{{ totalViews }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200">
      <table class="w-full hidden lg:table">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-right text-sm font-medium text-gray-600">عنوان</th>
            <th class="px-6 py-4 text-right text-sm font-medium text-gray-600">وضعیت</th>
            <th class="px-6 py-4 text-right text-sm font-medium text-gray-600">بازدید</th>
            <th class="px-6 py-4 text-right text-sm font-medium text-gray-600">تاریخ</th>
            <th class="px-6 py-4 text-right text-sm font-medium text-gray-600">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pages.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
              <i class="ti ti-folder-off text-4xl mb-2 block text-gray-400"></i>
              <p class="mb-1">هنوز صفحه‌ای ایجاد نشده است</p>
              <p class="text-sm text-gray-400 mb-4">صفحاتی مانند: درباره ما، تماس با ما، سوالات متداول</p>
              <button @click="createNewPage" class="btn-primary">
                <i class="ti ti-plus ml-2"></i>
                ایجاد اولین صفحه
              </button>
            </td>
          </tr>
          <tr v-for="page in pages" :key="page.id" class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ page.title }}</p>
              <p class="text-sm text-gray-500">/{{ page.slug }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusColor(page.status)">
                {{ getStatusLabel(page.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-700">{{ page.views || 0 }}</td>
            <td class="px-6 py-4 text-gray-700">{{ formatDate(page.createdAt) }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button @click="editPage(page.id)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="ویرایش">
                  <i class="ti ti-edit"></i>
                </button>
                <button @click="deletePage(page.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-100">
        <div v-if="pages.length === 0" class="p-8 text-center text-gray-500">
          <i class="ti ti-folder-off text-4xl mb-2 block text-gray-400"></i>
          <p class="mb-1">هنوز صفحه‌ای ایجاد نشده است</p>
          <p class="text-sm text-gray-400 mb-4">صفحاتی مانند: درباره ما، تماس با ما، سوالات متداول</p>
          <button @click="createNewPage" class="btn-primary">
            <i class="ti ti-plus ml-2"></i>
            ایجاد اولین صفحه
          </button>
        </div>
        <div v-for="page in pages" :key="page.id" class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ page.title }}</h3>
              <p class="text-sm text-gray-500">/{{ page.slug }}</p>
            </div>
            <div class="flex gap-2 mr-2">
              <button @click="editPage(page.id)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <i class="ti ti-edit"></i>
              </button>
              <button @click="deletePage(page.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusColor(page.status)">
              {{ getStatusLabel(page.status) }}
            </span>
            <span class="text-sm text-gray-600">{{ page.views || 0 }} بازدید</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ formatDate(page.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Notifications -->
  <div class="fixed bottom-4 left-4 z-50">
    <div v-for="notif in notifications" :key="notif.id" class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-2 min-w-[300px] animate-slide-in">
      <div class="flex items-center gap-3">
        <i class="ti ti-check text-green-600 text-xl"></i>
        <p class="text-sm text-gray-700">{{ notif.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {usePageStore} from "@/stores/page.ts";

const router = useRouter()
const notifications = ref([])

// Computed stats
const pageStore=usePageStore()
const pages = computed(() => pageStore.pages)

const totalPages = computed(() => pageStore.totalPages)
const publishedPages = computed(() => pageStore.publishedPages)
const draftPages = computed(() =>
    pageStore.pages.filter(p => p.status === 'draft').length
)
const totalViews = computed(() =>
    pageStore.pages.reduce((sum, p) => sum + (p.views || 0), 0)
)
// Delete page
const deletePage = async (id) => {
  if (confirm('آیا از حذف این صفحه اطمینان دارید؟')) {
    try {
      await pageStore.deletePage(id)
      showNotification('صفحه با موفقیت حذف شد')
    } catch (error) {
      showNotification('حذف صفحه موفقیت‌آمیز نبود')
    }
  }
}

// ویرایش صفحه
const editPage = (page) => {
  router.push({
    path: '/dashboard/hamian/pages/create',
    state: { page }  // ارسال کل صفحه به فرم
  })
}


// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

// Get status label
const getStatusLabel = (status) => {
  const labels = {
    draft: 'پیش‌نویس',
    published: 'منتشر شده',
    scheduled: 'زمان‌بندی شده'
  }
  return labels[status] || 'پیش‌نویس'
}

// Get status color
const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-orange-100 text-orange-800',
    published: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const showNotification = (message) => {
  const id = Date.now()
  notifications.value.push({ id, message })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

const createNewPage = () => {
  router.push('/dashboard/hamian/pages/create')
}

onMounted(async () => {
  //loadPages()
  if (!pageStore.fetched) {
    await pageStore.fetchPages()
  }
})
</script>

<style scoped>
.btn-primary {
  background-color: #e11d48;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #be123c;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
