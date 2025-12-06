<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">فیلم‌ها و سریال‌ها</h1>
        <p class="text-gray-600 mt-1">مدیریت محتوای ویدیویی</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
          <i class="ti ti-plus ml-2"></i>
          محتوای جدید
        </button>

        <button
            @click="exportToExcel"
            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex gap-2 p-2">

          <!-- Movies Tab -->
          <button
              @click="activeTab = 'movies'"
              class="px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center"
              :class="activeTab === 'movies'
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <i class="ti ti-movie ml-2"></i>
            فیلم‌ها
            <span class="mr-2 text-xs px-2 py-0.5 rounded-full"
                  :class="activeTab === 'movies' ? 'bg-purple-100' : 'bg-gray-100'">
              {{ movies.length }}
            </span>
          </button>

          <!-- Series Tab -->
          <button
              @click="activeTab = 'series'"
              class="px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center"
              :class="activeTab === 'series'
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <i class="ti ti-device-tv ml-2"></i>
            سریال‌ها
            <span class="mr-2 text-xs px-2 py-0.5 rounded-full"
                  :class="activeTab === 'series' ? 'bg-purple-100' : 'bg-gray-100'">
              {{ series.length }}
            </span>
          </button>

        </nav>
      </div>

      <!-- Content List -->
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">دسته</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">سال</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">

            <tr v-if="displayedContent.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <i class="ti ti-inbox-off text-4xl mb-2 block"></i>
                <p>محتوایی یافت نشد</p>
              </td>
            </tr>

            <tr v-for="item in displayedContent" :key="item.id" class="hover:bg-gray-50">

              <!-- Poster + Title -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="item.poster" class="w-12 h-16 object-cover rounded">
                  <div>
                    <p class="font-medium">{{ item.title }}</p>
                    <p class="text-sm text-gray-500">{{ item.year }}</p>
                  </div>
                </div>
              </td>

              <!-- Type -->
              <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs"
                    :class="item.type === 'movie'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'">
                {{ item.type === 'movie' ? 'سریال' : 'فیلم' }}
              </span>
              </td>

              <!-- Category -->
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ item.category.title ?? '—' }}
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs"
                    :class="item.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'">
                {{ item.status === 'published' ? 'منتشر شده' : 'پیش‌نویس' }}
              </span>
              </td>

              <!-- Year -->
              <td class="px-6 py-4 text-sm text-gray-600">{{ item.year }}</td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="editContent(item)" class="text-blue-600 hover:text-blue-800">
                    <i class="ti ti-edit"></i>
                  </button>
                  <button @click="deleteContent(item)" class="text-red-600 hover:text-red-800">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </td>

            </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showCreateModal = false">

      <div class="bg-white rounded-xl max-w-md w-full">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">نوع محتوا را انتخاب کنید</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <div class="p-6 space-y-3">

          <!-- Movie -->
          <button
              @click="createContent('movies')"
              class="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition group">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                <i class="ti ti-movie text-white text-2xl"></i>
              </div>
              <div class="flex-1 text-right">
                <h4 class="text-lg font-bold">فیلم</h4>
                <p class="text-sm text-gray-500">ساخت فیلم تک قسمتی</p>
              </div>
            </div>
          </button>

          <!-- Series -->
          <button
              @click="createContent('series')"
              class="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition group">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center group-hover:scale-110 transition">
                <i class="ti ti-device-tv text-white text-2xl"></i>
              </div>
              <div class="flex-1 text-right">
                <h4 class="text-lg font-bold">سریال</h4>
                <p class="text-sm text-gray-500">ساخت سریال چند قسمتی</p>
              </div>
            </div>
          </button>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie.ts'
import {useSeriesStore} from "@/stores/series.ts";

const router = useRouter()

const activeTab = ref('movies')
const showCreateModal = ref(false)

// Stores
const movieStore = useMovieStore()
const seriesStore = useSeriesStore()

// Data from store
const movies = computed(() => movieStore.movies)
const series =computed(() => seriesStore.seriesList)

// What to show based on active tab
const displayedContent = computed(() => {
  return activeTab.value === 'movies' ? movies.value : series.value
})

// Create page
const createContent = (type) => {
  showCreateModal.value = false
  router.push(`/dashboard/film/${type}/create`)
}

// Edit
const editContent = (item) => {
  console.log('item',item)
  router.push(`/dashboard/film/${item.type}/edit/${item.id}`)
}

// Delete
const deleteContent = async (item) => {
  if (!confirm(`حذف "${item.title}"؟`)) return

  if (item.type === 'movies')
    await movieStore.removeMovie(item.id)
  else
    await seriesStore.removeSeries(item.id)
}

const exportToExcel = () => {
  console.log('Export to Excel')
}
// Initial load
onMounted(async () => {
  await seriesStore.fetchSeries()
  await movieStore.fetchMovies()

})
</script>