<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">صفحات</h1>
        <p class="text-gray-600">مدیریت صفحات ثابت سایت</p>
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
      <div class="bg-white rounded-xl p-6 border">
        <p class="text-gray-600 text-sm">کل صفحات</p>
        <p class="text-2xl font-bold">{{ totalPages }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 border">
        <p class="text-gray-600 text-sm">منتشر شده</p>
        <p class="text-2xl font-bold text-green-600">{{ publishedPages }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 border">
        <p class="text-gray-600 text-sm">پیش‌نویس</p>
        <p class="text-2xl font-bold text-orange-600">{{ draftPages }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 border">
        <p class="text-gray-600 text-sm">بازدید کل</p>
        <p class="text-2xl font-bold text-purple-600">{{ totalViews }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border">
      <table class="w-full hidden lg:table">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-right">عنوان</th>
            <th class="px-6 py-4 text-right">وضعیت</th>
            <th class="px-6 py-4 text-right">بازدید</th>
            <th class="px-6 py-4 text-right">تاریخ</th>
            <th class="px-6 py-4 text-right">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pages.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
              <i class="ti ti-folder-off text-4xl mb-2 block"></i>
              <p>هنوز صفحه‌ای ایجاد نشده است</p>
              <button @click="createNewPage" class="mt-4 btn-primary">
                <i class="ti ti-plus ml-2"></i>
                ایجاد اولین صفحه
              </button>
            </td>
          </tr>
          <tr v-for="page in pages" :key="page.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-4">
              <p class="font-medium">{{ page.title }}</p>
              <p class="text-sm text-gray-500">{{ page.slug }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs" :class="getStatusColor(page.status)">
                {{ getStatusLabel(page.status) }}
              </span>
            </td>
            <td class="px-6 py-4">{{ page.views || 0 }}</td>
            <td class="px-6 py-4">{{ formatDate(page.createdAt) }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button @click="editPage(page.id)" class="text-blue-600 hover:text-blue-800">
                  <i class="ti ti-edit"></i>
                </button>
                <button @click="deletePage(page.id)" class="text-red-600 hover:text-red-800">
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y">
        <div v-if="pages.length === 0" class="p-8 text-center text-gray-500">
          <i class="ti ti-folder-off text-4xl mb-2 block"></i>
          <p>هنوز صفحه‌ای ایجاد نشده است</p>
          <button @click="createNewPage" class="mt-4 btn-primary">
            <i class="ti ti-plus ml-2"></i>
            ایجاد اولین صفحه
          </button>
        </div>
        <div v-for="page in pages" :key="page.id" class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium flex-1">{{ page.title }}</h3>
            <div class="flex gap-2 mr-2">
              <button @click="editPage(page.id)" class="text-blue-600">
                <i class="ti ti-edit"></i>
              </button>
              <button @click="deletePage(page.id)" class="text-red-600">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-2">{{ page.slug }}</p>
          <div class="flex justify-between items-center">
            <span class="px-2 py-1 rounded text-xs" :class="getStatusColor(page.status)">
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
    <div v-for="notif in notifications" :key="notif.id" class="bg-white border rounded-lg shadow-lg p-4 mb-2 min-w-[300px]">
      <p class="text-sm">{{ notif.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {useDanimPageStore} from "@/stores/danim-page.ts";

const router = useRouter()
const danimPageStore=useDanimPageStore()
const notifications = ref([])
const pages = computed(()=>danimPageStore.pages)

// Computed stats
const totalPages = computed(() => pages.value.length)
const publishedPages = computed(() => pages.value.filter(p => p.status === 'published').length)
const draftPages = computed(() => pages.value.filter(p => p.status === 'draft').length)
const totalViews = computed(() => pages.value.reduce((sum, p) => sum + (p.views || 0), 0))

// Delete page
const deletePage = async (id) => {
  if (confirm('آیا از حذف این صفحه اطمینان دارید؟')) {
    await danimPageStore.deletePage(id)
    pages.value = pages.value.filter(p => p.id !== id)

    showNotification('صفحه با موفقیت حذف شد', 'success')
  }
}

// Edit page
const editPage = (id) => {
  router.push(`/dashboard/danim/pages/edit/${id}`)
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

const showNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

const createNewPage = () => {
  router.push('/dashboard/danim/pages/create')
}

onMounted(async () => {
  await danimPageStore.fetchPages()
})
</script>

<style scoped>
.btn-primary {
  background-color: #f97316;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background-color: #ea580c;
}
</style>
