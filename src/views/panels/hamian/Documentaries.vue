<template>
  <div class="p-6">
    <!-- Header -->
    <div class="sticky top-0 lg:top-[73px] bg-gray-50 z-30 -mx-6 px-6 py-4 mb-2 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">مدیریت مستندات</h2>
          <p class="text-gray-600 mt-1">مدیریت ویدیوهای مستند نجات حیوانات</p>
        </div>
        <div class="flex items-center gap-2">
          <button
              @click="emit('navigate', 'documentary-categories')"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <i class="ti ti-category"></i>
            <span class="hidden sm:inline">دسته‌بندی‌ها</span>
          </button>
          <button
              @click="emit('navigate', 'documentary-create')"
              class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            <span class="hidden sm:inline">افزودن مستند جدید</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">کل مستندات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-video text-2xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">منتشر شده</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.published }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-check text-2xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">پیش‌نویس</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.draft }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-clock text-2xl text-orange-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">کل بازدیدها</p>
            <p class="text-2xl font-bold text-purple-600">{{ stats.totalViews }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-eye text-2xl text-purple-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
          <input
              v-model="filters.search"
              type="text"
              placeholder="جستجو در عنوان و توضیحات..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
          <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
              {{ cat.title }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
          <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">مرتب‌سازی</label>
          <select
              v-model="filters.sort"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="most-viewed">بیشترین بازدید</option>
            <option value="title">عنوان (الفبا)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Documentaries List -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">دسته‌بندی</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مدت زمان</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">بازدید</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ انتشار</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="doc in filteredDocumentaries" :key="doc.id" class="hover:bg-gray-50">
          <td class="px-6 py-4">
            <img :src="doc.thumbnailPreview" :alt="doc.title" class="w-20 h-12 object-cover rounded">
          </td>
          <td class="px-6 py-4">
            <div class="text-sm font-medium text-gray-900">{{ doc.title }}</div>
            <div class="text-xs text-gray-500 line-clamp-1">{{ doc.description }}</div>
          </td>
          <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {{ getCategoryName(doc.category.title) }}
              </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ doc.duration }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ doc.views }}</td>
          <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(doc.publishDate) }}</td>
          <td class="px-6 py-4">
              <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="doc.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'"
              >
                {{ doc.status === 'published' ? 'منتشر شده' : 'پیش‌نویس' }}
              </span>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <button
                  @click="editDocumentary(doc)"
                  class="text-blue-600 hover:text-blue-800"
                  title="ویرایش"
              >
                <i class="ti ti-edit text-lg"></i>
              </button>
              <button
                  @click="deleteDocumentary(doc.id)"
                  class="text-red-600 hover:text-red-800"
                  title="حذف"
              >
                <i class="ti ti-trash text-lg"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredDocumentaries.length === 0" class="text-center py-12">
        <i class="ti ti-video-off text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">هیچ مستندی یافت نشد</h3>
        <p class="text-gray-500 mb-4">برای شروع، اولین مستند خود را اضافه کنید</p>
        <button
            @click="$emit('navigate', 'documentary-create')"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          افزودن مستند جدید
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useDocumentaryStore} from "@/stores/documentary.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useRouter} from "vue-router";

const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const emit = defineEmits(['navigate'])
const documentaryStore = useDocumentaryStore()
// Categories Data
const categories = computed(() => categoryStore.categories)

const documentaries = computed(() => documentaryStore.documentaries)
const filters = ref({
  search: '',
  category: '',
  status: '',
  sort: 'newest'
})

// Stats
const stats = computed(() => ({
  total: documentaries.value.length,
  published: documentaries.value.filter(d => d.status === 'published').length,
  draft: documentaries.value.filter(d => d.status === 'draft').length,
  totalViews: documentaries.value.reduce((sum, d) => sum + (d.views || 0), 0)
}))

// Filtered Documentaries
const filteredDocumentaries = computed(() => {
  let result = [...documentaries.value]
  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(doc =>
        doc.title.toLowerCase().includes(search) ||
        doc.title.toLowerCase().includes(search)
    )
  }

  // Category filter
  if (filters.value.category) {
    result = result.filter(doc => doc.category.slug === filters.value.category)
  }

  // Status filter
  if (filters.value.status) {
    result = result.filter(doc => doc.status === filters.value.status)
  }

  // Sort
  switch (filters.value.sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
      break
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  return result
})

// Methods
const getCategoryName = (slug) => {
  const cat = categories.value.find(c => c.slug === slug)
  return cat ? cat.name : slug
}

const getCategoryColor = (slug) => {
  const cat = categories.value.find(c => c.slug === slug)
  return cat ? cat.color : '#6B7280'
}

const getCategoryCount = (slug) => {
  return documentaries.value.filter(d => d.category === slug).length
}

// Validate slug input
const validateSlug = (event) => {
  const input = event.target
  input.value = input.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
}

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR')
}

const editDocumentary = (doc) => {
  documentaryStore.selectDocumentary(doc)
  emit('navigate', 'documentary-create')
}

const deleteDocumentary = async (id) => {
  if (confirm('آیا از حذف این مستند اطمینان دارید؟')) {
    await documentaryStore.removeDocumentary(id)
    const index = documentaries.value.findIndex(d => d.id === id)
    if (index > -1) {
      documentaries.value.splice(index, 1)
    }
  }
}
onMounted(async () => {
  await categoryTypeStore.fetchType('document')
  await documentaryStore.fetchDocumentaries()

})
watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id})
      }
    },
    {immediate: true}
)
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
