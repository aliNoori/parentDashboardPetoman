<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت نظرات</h1>
        <p class="text-gray-600 mt-1">بررسی و تایید نظرات کاربران</p>
      </div>
      <div class="flex gap-3">
        <button @click="filterStatus = 'all'" :class="filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'">
          همه ({{ stats.total }})
        </button>
        <button @click="filterStatus = 'pending'" :class="filterStatus === 'pending' ? 'btn-primary' : 'btn-secondary'">
          در انتظار ({{ stats.pending }})
        </button>
        <button @click="filterStatus = 'approved'" :class="filterStatus === 'approved' ? 'btn-primary' : 'btn-secondary'">
          تایید شده ({{ stats.approved }})
        </button>
        <button @click="filterStatus = 'rejected'" :class="filterStatus === 'rejected' ? 'btn-primary' : 'btn-secondary'">
          رد شده ({{ stats.rejected }})
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل نظرات</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-message-circle text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">در انتظار تایید</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-clock text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">تایید شده</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.approved }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">رد شده</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.rejected }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
            <i class="ti ti-x text-red-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">لیست نظرات</h3>
          <div class="flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در نظرات..."
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
          </div>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div v-if="filteredComments.length === 0" class="p-12 text-center text-gray-500">
          <i class="ti ti-message-circle-off text-4xl mb-2 block"></i>
          <p>نظری یافت نشد</p>
        </div>
        
        <div v-for="comment in filteredComments" :key="comment.id" class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <span class="text-white font-medium">{{ comment.author.charAt(0) }}</span>
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="font-bold text-gray-900">{{ comment.author }}</h4>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusColor(comment.status)"
                >
                  {{ getStatusLabel(comment.status) }}
                </span>
                <span class="text-sm text-gray-500">{{ comment.date }}</span>
              </div>
              
              <p class="text-gray-700 mb-3">{{ comment.text }}</p>
              
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <i class="ti ti-movie"></i>
                  {{ comment.postTitle }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="ti ti-star-filled text-yellow-500"></i>
                  امتیاز: {{ comment.rating }}/5
                </span>
              </div>
              
              <div class="flex gap-2 mt-4">
                <button
                  v-if="comment.status === 'pending'"
                  @click="approveComment(comment.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                >
                  <i class="ti ti-check"></i>
                  تایید
                </button>
                <button
                  v-if="comment.status !== 'rejected'"
                  @click="rejectComment(comment.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                >
                  <i class="ti ti-x"></i>
                  رد
                </button>
                <button
                  @click="replyToComment(comment.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                >
                  <i class="ti ti-message"></i>
                  پاسخ
                </button>
                <button
                  @click="deleteComment(comment.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  <i class="ti ti-trash"></i>
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterStatus = ref('all')
const searchQuery = ref('')

const stats = ref({
  total: 145,
  pending: 12,
  approved: 128,
  rejected: 5
})

const comments = ref([
  {
    id: 1,
    author: 'علی محمدی',
    text: 'فیلم بسیار عالی بود! واقعا لذت بردم. کارگردانی و بازیگری درجه یک',
    postTitle: 'آموزش گیتار مقدماتی',
    rating: 5,
    status: 'pending',
    date: '2 ساعت پیش'
  },
  {
    id: 2,
    author: 'مریم احمدی',
    text: 'خیلی خوب بود ولی صدا کمی مشکل داشت. لطفا بهبود بدید',
    postTitle: 'آشپزی ایتالیایی',
    rating: 4,
    status: 'approved',
    date: '5 ساعت پیش'
  },
  {
    id: 3,
    author: 'رضا کریمی',
    text: 'محتوای اسپم و تبلیغاتی نامناسب',
    postTitle: 'مستند طبیعت',
    rating: 1,
    status: 'rejected',
    date: '1 روز پیش'
  }
])

const filteredComments = computed(() => {
  let result = comments.value
  
  if (filterStatus.value !== 'all') {
    result = result.filter(c => c.status === filterStatus.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.author.toLowerCase().includes(query) ||
      c.text.toLowerCase().includes(query) ||
      c.postTitle.toLowerCase().includes(query)
    )
  }
  
  return result
})

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'در انتظار',
    approved: 'تایید شده',
    rejected: 'رد شده'
  }
  return labels[status] || status
}

const approveComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.status = 'approved'
    stats.value.pending--
    stats.value.approved++
  }
}

const rejectComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    const oldStatus = comment.status
    comment.status = 'rejected'
    if (oldStatus === 'pending') stats.value.pending--
    if (oldStatus === 'approved') stats.value.approved--
    stats.value.rejected++
  }
}

const replyToComment = (id) => {
  console.log('Reply to comment:', id)
}

const deleteComment = (id) => {
  if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
    const index = comments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const comment = comments.value[index]
      if (comment.status === 'pending') stats.value.pending--
      if (comment.status === 'approved') stats.value.approved--
      if (comment.status === 'rejected') stats.value.rejected--
      stats.value.total--
      comments.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.btn-primary {
  background-color: #9333ea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background-color: #7e22ce;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}
</style>
