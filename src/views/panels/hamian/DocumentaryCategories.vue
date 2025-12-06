<template>
  <div class="p-6">
    <!-- Header -->
    <div class="sticky top-0 lg:top-[73px] bg-gray-50 z-30 -mx-6 px-6 py-4 mb-2 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">دسته‌بندی‌های مستندات</h2>
          <p class="text-gray-600 mt-1">مدیریت دسته‌بندی‌ها و سازماندهی ویدیوهای مستند</p>
        </div>
        <button
            @click="$emit('navigate', 'documentaries')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <i class="ti ti-arrow-right"></i>
          بازگشت
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">کل دسته‌بندی‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ categories.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-category text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">کل مستندات</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalDocumentaries }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-video text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">آخرین به‌روزرسانی</p>
            <p class="text-sm font-medium text-gray-900">{{ lastUpdate }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-clock text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Category -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">افزودن دسته‌بندی جدید</h3>
      <form @submit.prevent="addCategory" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              نام دسته‌بندی <span class="text-red-500">*</span>
            </label>
            <input
                v-model="newCategory.title"
                type="text"
                required
                placeholder="مثال: نجات اضطراری"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              اسلاگ (URL) <span class="text-red-500">*</span>
            </label>
            <input
                v-model="newCategory.slug"
                type="text"
                required
                pattern="[a-z0-9-]+"
                placeholder="مثال: rescue"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                @input="validateSlug"
            >
            <p class="text-xs text-gray-500 mt-1">فقط حروف انگلیسی کوچک، اعداد و خط تیره</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              رنگ برچسب <span class="text-red-500">*</span>
            </label>
            <input
                v-model="newCategory.color"
                type="color"
                class="w-full h-[42px] rounded-lg border border-gray-300 cursor-pointer"
                title="انتخاب رنگ"
            >
          </div>
        </div>

        <div class="flex justify-end">
          <button
              type="submit"
              class="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            افزودن دسته‌بندی
          </button>
        </div>
      </form>
    </div>

    <!-- Categories List -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900">دسته‌بندی‌های موجود</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">رنگ</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">نام دسته‌بندی</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">اسلاگ</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">تعداد مستندات</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr
              v-for="category in categories"
              :key="category.id"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3">
              <div
                  class="w-6 h-6 rounded"
                  :style="{ backgroundColor: category.color }"
              ></div>
            </td>
            <td class="px-4 py-3">
              <span class="font-medium text-gray-900">{{ category.title }}</span>
            </td>
            <td class="px-4 py-3">
              <code class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ category.slug }}</code>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm text-gray-600">{{ getCategoryCount(category.slug) }} مستند</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                    @click="editCategory(category)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                >
                  <i class="ti ti-edit text-lg"></i>
                </button>
                <button
                    @click="deleteCategory(category.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                    :disabled="getCategoryCount(category.slug) > 0"
                    :class="{ 'opacity-50 cursor-not-allowed': getCategoryCount(category.slug) > 0 }"
                >
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0" class="p-12 text-center">
        <i class="ti ti-category text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">هیچ دسته‌بندی‌ای وجود ندارد</h3>
        <p class="text-gray-500">برای شروع، اولین دسته‌بندی را اضافه کنید</p>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-xl w-full max-w-md">
        <div class="border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">ویرایش دسته‌بندی</h3>
          <button
              @click="showEditModal = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="ti ti-x text-xl text-gray-600"></i>
          </button>
        </div>

        <form @submit.prevent="updateCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              نام دسته‌بندی <span class="text-red-500">*</span>
            </label>
            <input
                v-model="editingCategory.title"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              اسلاگ (URL) <span class="text-red-500">*</span>
            </label>
            <input
                v-model="editingCategory.slug"
                type="text"
                required
                pattern="[a-z0-9-]+"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              رنگ <span class="text-red-500">*</span>
            </label>
            <input
                v-model="editingCategory.color"
                type="color"
                class="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            >
          </div>
          <div class="flex gap-3 pt-2">
            <button
                type="button"
                @click="showEditModal = false"
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              انصراف
            </button>
            <button
                type="submit"
                class="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useDocumentaryStore} from "@/stores/documentary.ts";

defineEmits(['navigate'])
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.categories)

const newCategory = ref({
  title: '',
  slug: '',
  color: '#6B7280',
  contentType:'hamian',
  typeId: categoryTypeStore.selectedType?.id || null
})

const editingCategory = ref(null)
const showEditModal = ref(false)
const documentaryStore=useDocumentaryStore()
// Sample count (در واقعیت باید از API بیاید)
const totalDocumentaries = computed(() => documentaryStore.documentaries.length)

// Methods
const getCategoryCount = (slug) => {
  return categoryCounts.value[slug] || 0
}
const documentaries = computed(() => documentaryStore.documentaries)
watch(
    () => documentaryStore.documentaries,
    (newDocs) => {
      documentaries.value ={...newDocs}
    },
    { immediate: true, deep: true }
)
const categoryCounts = computed(() => {
  const counts = {}  // آبجکت خالی ساده
  if (!documentaries.value) return counts
  documentaries.value.forEach(doc => {
    if (doc.category && doc.category.slug) {
      const slug = doc.category.slug
      counts[slug] = (counts[slug] || 0) + 1
    }
  })
  return counts
})
const lastUpdate = computed(() => {
  //const docs = documentaryStore.documentaries
  //if (!docs || docs.length === 0) return 'هیچ مستندی وجود ندارد'
  if (!categories.value || categories.value.length === 0) return 'هیچ دسته بندی وجود ندارد'
  // پیدا کردن آخرین تاریخ آپدیت
  const latest = categories.value.reduce((prev, curr) => {
    const prevDate = new Date(prev.updatedAt)
    const currDate = new Date(curr.updatedAt)
    return currDate > prevDate ? curr : prev
  })

  const date = new Date(latest.updatedAt)
  return date.toLocaleDateString('fa-IR')
})

const validateSlug = (event) => {
  const input = event.target
  input.value = input.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
}

const addCategory = async () => {
  if (!newCategory.value.title.trim() || !newCategory.value.slug.trim()) return

  // Check if slug already exists
  if (categories.value.some(c => c.slug === newCategory.value.slug)) {
    alert('این اسلاگ قبلاً استفاده شده است. لطفاً یک اسلاگ دیگر انتخاب کنید.')
    return
  }


  await categoryStore.addCategory(newCategory.value)

  newCategory.value = {
    title: '',
    slug: '',
    color: '#6B7280',
    contentType:'hamian',
    typeId: categoryTypeStore.selectedType?.id || null
  }

  alert('دسته‌بندی با موفقیت اضافه شد!')
}

const editCategory = (category) => {
  const clean = { ...category }
  delete clean.posts
  delete clean.parent

  editingCategory.value = clean
  showEditModal.value = true
}

const updateCategory = async () => {
  const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
  if (index !== -1) {
    // فراخوانی store برای ویرایش
    editingCategory.value.typeId = newCategory.value.typeId
    await categoryStore.editCategory({id: editingCategory.value.id, ...editingCategory.value})
    // به‌روزرسانی محلی آرایه
    categories.value[index] = {...editingCategory.value}
  }

  showEditModal.value = false
  editingCategory.value = null
  alert('دسته‌بندی با موفقیت به‌روزرسانی شد!')
}

const deleteCategory = async (id) => {
  const category = categories.value.find(c => c.id === id)
  const count = getCategoryCount(category.slug)

  if (count > 0) {
    alert(`این دسته‌بندی دارای ${count} مستند است و قابل حذف نیست.`)
    return
  }

  if (confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
    await categoryStore.removeCategory(id)
    categories.value = categories.value.filter(c => c.id !== id)
    alert('دسته‌بندی با موفقیت حذف شد!')
  }
}

onMounted(async () => {
  await documentaryStore.fetchDocumentaries()
  await categoryTypeStore.fetchType('document')
})
watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        newCategory.value.typeId = type.id
        await categoryStore.fetchCategories({typeId: type.id,contentType:'hamian'})
      }
    },
    {immediate: true}
)
</script>
