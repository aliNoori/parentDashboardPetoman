<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="sticky top-0 lg:top-[73px] bg-gray-50 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">سوالات متداول</h1>
          <p class="text-sm text-gray-600 mt-1">مدیریت سوالات و پاسخ‌های رایج</p>
        </div>
        <div class="flex items-center gap-2">
          <button
              @click="emit('navigate', 'faq-categories')"
              class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i class="ti ti-category text-lg"></i>
            <span class="hidden sm:inline">مدیریت دسته‌بندی‌ها</span>
          </button>
          <button
              @click="openCreateModal"
              class="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <i class="ti ti-plus text-lg"></i>
            <span class="hidden sm:inline">افزودن سوال جدید</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-message-question text-rose-600 text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">کل سوالات</p>
            <p class="text-2xl font-bold text-gray-900">{{ faqs.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">فعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeFaqs }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-eye-off text-gray-600 text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">غیرفعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ inactiveFaqs }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQs List -->
    <div class="bg-white rounded-xl border border-gray-200">
      <!-- Search & Filter -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی سوال..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <select
              v-model="filterCategory"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.title">
              {{ cat.title }}
            </option>
          </select>
          <select
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
        </div>
      </div>

      <!-- FAQs Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">ترتیب</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">سوال</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">دسته‌بندی</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">وضعیت</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-600">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr
              v-for="faq in filteredFaqs"
              :key="faq.id"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3">
              <span class="text-sm font-medium text-gray-900">{{ faq.order }}</span>
            </td>
            <td class="px-4 py-3">
              <div>
                <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ faq.question }}</p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ faq.answer }}</p>
              </div>
            </td>
            <td class="px-4 py-3">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                      :style="getCategoryClass(faq.category)">
                  {{ faq.category }}
                </span>
            </td>
            <td class="px-4 py-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                    v-model="faq.isActive"
                    type="checkbox"
                    class="sr-only peer"
                    @change="toggleStatus(faq)"
                >
                <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                    @click="editFaq(faq)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                >
                  <i class="ti ti-edit text-lg"></i>
                </button>
                <button
                    @click="deleteFaq(faq.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
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
      <div v-if="filteredFaqs.length === 0" class="p-8 text-center">
        <i class="ti ti-message-question text-gray-300 text-6xl mb-4"></i>
        <p class="text-gray-500 mb-2">هیچ سوالی یافت نشد</p>
        <button
            @click="openCreateModal"
            class="text-rose-600 hover:text-rose-700 font-medium"
        >
          افزودن اولین سوال
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
    >
      <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">
            {{ editingFaq ? 'ویرایش سوال' : 'افزودن سوال جدید' }}
          </h3>
          <button
              @click="closeModal"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="ti ti-x text-xl text-gray-600"></i>
          </button>
        </div>

        <form @submit.prevent="saveFaq" class="p-6 space-y-4">
          <!-- Order -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ترتیب نمایش <span class="text-red-500">*</span>
            </label>
            <input
                v-model.number="faqForm.order"
                type="number"
                required
                min="1"
                placeholder="1"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
          </div>

          <!-- Question -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              سوال <span class="text-red-500">*</span>
            </label>
            <input
                v-model="faqForm.question"
                type="text"
                required
                placeholder="سوال خود را وارد کنید..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
          </div>

          <!-- Answer -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              پاسخ <span class="text-red-500">*</span>
            </label>
            <textarea
                v-model="faqForm.answer"
                rows="5"
                required
                placeholder="پاسخ کامل را وارد کنید..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی <span class="text-red-500">*</span>
            </label>
            <select
                v-model="faqForm.category"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.title">
                {{ cat.title }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-2">
            <input
                v-model="faqForm.isActive"
                type="checkbox"
                id="faq-active"
                class="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
            >
            <label for="faq-active" class="text-sm font-medium text-gray-700">
              فعال
            </label>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              انصراف
            </button>
            <button
                type="submit"
                class="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              {{ editingFaq ? 'ذخیره تغییرات' : 'افزودن سوال' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useFaqStore} from "@/stores/faq.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";

const emit = defineEmits(['navigate'])

// Categories Data
const categories = computed(() => categoryStore.categories)

const faqStore = useFaqStore()
const categoryStore = useCategoryStore()
const categoryTypeStore = useCategoryTypeStore()

const faqs = computed(() => faqStore.faqs)
const searchQuery = ref('')
const filterCategory = ref('all')
const filterStatus = ref('all')
const showModal = ref(false)
const editingFaq = ref(null)
const faqForm = ref({
  order: 1,
  question: '',
  answer: '',
  category: '',
  isActive: true
})

// Computed
const activeFaqs = computed(() => faqs.value.filter(f => f.isActive).length)
const inactiveFaqs = computed(() => faqs.value.filter(f => !f.isActive).length)

const filteredFaqs = computed(() => {
  let filtered = faqs.value

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(faq =>
        faq.question.includes(searchQuery.value) ||
        faq.answer.includes(searchQuery.value)
    )
  }

  // Filter by category
  if (filterCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === filterCategory.value)
  }

  // Filter by status
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(faq =>
        filterStatus.value === 'active' ? faq.isActive : !faq.isActive
    )
  }

  // Sort by order
  return filtered.sort((a, b) => a.order - b.order)
})

// Methods
const getCategoryClass = (category) => {
  const cat = categories.value.find(c => c.title === category)
  if (!cat) return 'bg-gray-100 text-gray-700'

  // Convert hex to RGB for background with opacity
  const hex = cat.color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
    color: cat.color
  }
}

const getCategoryCount = (categoryName) => {
  return faqs.value.filter(f => f.category === categoryName).length
}

// FAQ Methods
const openCreateModal = () => {
  editingFaq.value = null
  faqForm.value = {
    order: faqs.value.length + 1,
    question: '',
    answer: '',
    category: '',
    isActive: true
  }
  showModal.value = true
}

const editFaq = async (faq) => {
  editingFaq.value = faq
  faqForm.value = {...faq}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingFaq.value = null
}


const saveFaq = async () => {
  const selectedCategory = categories.value.find(c => c.title === faqForm.value.category)
  const payload = {
    order: faqForm.value.order,
    question: faqForm.value.question,
    answer: faqForm.value.answer,
    isActive: faqForm.value.isActive,
    categoryId: selectedCategory?.id || null
  }
  if (editingFaq.value) {
    await faqStore.editFaq({ id: editingFaq.value.id, ...payload })
  } else {
    await faqStore.addFaq(payload)
  }
  closeModal()
}


const deleteFaq = async (id) => {
  if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
    await faqStore.removeFaq(id)
    faqs.value = faqs.value.filter(f => f.id !== id)
  }
}

const toggleStatus = async (faq) => {
  await faqStore.toggleStatus(faq.id, faq.isActive)
  console.log(`FAQ ${faq.id} status changed to ${faq.isActive}`)
}

onMounted(async () => {
  await faqStore.fetchFaqs()
  await categoryTypeStore.fetchType('faq')
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
