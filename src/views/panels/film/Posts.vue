<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">نوشته‌ها</h1>
        <p class="text-gray-600 mt-1">مدیریت تمام نوشته‌ها و مقالات</p>
      </div>
      <div class="flex gap-3">
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
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل نوشته‌ها</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-article text-purple-600 text-xl"></i>
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

    <!-- Posts List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
            <tr v-if="posts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <i class="ti ti-article-off text-4xl mb-2 block"></i>
                <p>هنوز نوشته‌ای ایجاد نشده است</p>
              </td>
            </tr>
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ post.title }}</p>
                <p class="text-sm text-gray-500">{{ post.excerpt }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {{ post.category.title }}
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
              <td class="px-6 py-4 text-gray-900">{{ post.views || 0 }}</td>
              <td class="px-6 py-4 text-gray-900">{{ post.date }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="editPost(post)" 
                    class="btn-icon hover:bg-blue-50 hover:text-blue-600"
                  >
                    <i class="ti ti-edit text-sm"></i>
                  </button>
                  <button 
                    @click="deletePost(post)" 
                    class="btn-icon hover:bg-red-50 hover:text-red-600"
                  >
                    <i class="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import { useRouter } from 'vue-router'
import {useFilmPostStore} from "@/stores/film-post.ts";

const router = useRouter()
const postStore=useFilmPostStore()
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

const posts = computed(()=>postStore.posts)

const getStatusColor = (status) => {
  const colors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'منتشر شده',
    draft: 'پیش‌نویس'
  }
  return labels[status] || status
}

const createNewPost = () => {
  router.push('/dashboard/film/posts/create')
}

const editPost = (post) => {
  router.push(`/dashboard/film/posts/edit/${post.id}`)
}

const deletePost = async (post) => {
  if (confirm(`آیا از حذف نوشته "${post.title}" مطمئن هستید؟`)) {
    const index = posts.value.findIndex(p => p.id === post.id)
    if (index > -1) {
      await postStore.deletePost(post.id)
      posts.value.splice(index, 1)
      stats.value.total--
      if (post.status === 'published') {
        stats.value.published--
      } else {
        stats.value.draft--
      }
      console.log('Post deleted:', post)
    }
  }
}

const exportToExcel = () => {
  console.log('Export to Excel')
}

onMounted(async () => {

  await postStore.fetchPosts()

})
</script>

<style scoped>
.btn-primary {
  background-color: #9333ea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.btn-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
</style>
