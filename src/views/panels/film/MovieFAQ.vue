<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">سوالات متداول</h1>
        <p class="text-gray-600 mt-1">مدیریت سوالات متداول فیلم‌ها و سریال‌ها</p>
      </div>
      <button @click="showAddModal = true"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
        <i class="ti ti-plus ml-2"></i>
        سوال جدید
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="relative">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجوی سوال..."
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        <div class="relative">
          <button
              @click="showContentTypeDropdown = !showContentTypeDropdown"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span>{{ selectedContentType.label }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>
          <ul v-if="showContentTypeDropdown"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <li v-for="type in contentTypes" :key="type.value">
              <button
                  @click="selectContentType(type)"
                  class="w-full px-4 py-2 text-sm text-right hover:bg-gray-50"
                  :class="selectedContentType.value === type.value ? 'bg-purple-50 text-purple-600' : 'text-gray-700'"
              >
                {{ type.label }}
              </button>
            </li>
          </ul>
        </div>

        <div class="relative">
          <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span>{{ selectedStatus.label }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>
          <ul v-if="showStatusDropdown"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <li v-for="status in statuses" :key="status.value">
              <button
                  @click="selectStatus(status)"
                  class="w-full px-4 py-2 text-sm text-right hover:bg-gray-50"
                  :class="selectedStatus.value === status.value ? 'bg-purple-50 text-purple-600' : 'text-gray-700'"
              >
                {{ status.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FAQs List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="filteredFAQs.length === 0" class="p-12 text-center">
        <i class="ti ti-help-circle text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">هنوز سوالی ایجاد نشده است</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
            v-for="faq in filteredFAQs"
            :key="faq.id"
            class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div
                class="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <i class="ti ti-help text-lg"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4 mb-2">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ faq.question }}</h3>
                  <p class="text-gray-600">{{ faq.answer }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                      @click="editFAQ(faq)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <i class="ti ti-edit text-sm"></i>
                  </button>
                  <button
                      @click="deleteFAQ(faq)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <i class="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="faq.contentType === 'movie' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                  <i class="ti ml-1" :class="faq.contentType === 'movie' ? 'ti-movie' : 'ti-device-tv'"></i>
                  {{ faq.contentType === 'movie' ? 'فیلم' : 'سریال' }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="faq.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ faq.status === 'active' ? 'فعال' : 'غیرفعال' }}
                </span>
                <span class="text-gray-500">{{ faq.contentTitle }}</span>
                <span class="text-gray-400">{{ faq.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            {{ showEditModal ? 'ویرایش سوال' : 'افزودن سوال جدید' }}
          </h2>
          <button @click="closeModal"
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نوع محتوا *</label>
            <div class="relative">
              <button
                  @click="showModalContentTypeDropdown = !showModalContentTypeDropdown"
                  class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span>{{
                    modalForm.contentType === 'movie' ? 'فیلم' : modalForm.contentType === 'series' ? 'سریال' : 'انتخاب کنید'
                  }}</span>
                <i class="ti ti-chevron-down text-sm"></i>
              </button>
              <ul v-if="showModalContentTypeDropdown"
                  class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <li>
                  <button
                      @click="selectModalContentType('movie')"
                      class="w-full px-4 py-2 text-sm text-right hover:bg-gray-50"
                      :class="modalForm.contentType === 'movie' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'"
                  >
                    فیلم
                  </button>
                </li>
                <li>
                  <button
                      @click="selectModalContentType('series')"
                      class="w-full px-4 py-2 text-sm text-right hover:bg-gray-50"
                      :class="modalForm.contentType === 'series' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'"
                  >
                    سریال
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان محتوا *</label>
            <input
                v-model="modalForm.contentTitle"
                type="text"
                placeholder="نام فیلم یا سریال..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">سوال *</label>
            <input
                v-model="modalForm.question"
                type="text"
                placeholder="سوال متداول را وارد کنید..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">پاسخ *</label>
            <textarea
                v-model="modalForm.answer"
                rows="5"
                placeholder="پاسخ سوال را وارد کنید..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                  v-model="modalForm.status"
                  type="checkbox"
                  true-value="active"
                  false-value="inactive"
                  class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              >
              <span class="text-sm text-gray-700">فعال</span>
            </label>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button @click="closeModal"
                  class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            انصراف
          </button>
          <button @click="saveFAQ"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            {{ showEditModal ? 'ذخیره تغییرات' : 'افزودن سوال' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, inject, onMounted, watch} from 'vue'
import {useFaqTypeStore} from "@/stores/faq-type.ts";
import {useFaqStore} from "@/stores/faq.ts";

const faqTypeStore = useFaqTypeStore()
const faqStore = useFaqStore()
const toast = inject('toast')

const searchQuery = ref('')
const showContentTypeDropdown = ref(false)
const showStatusDropdown = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showModalContentTypeDropdown = ref(false)

const selectedContentType = ref({value: 'all', label: 'همه محتواها'})
const selectedStatus = ref({value: 'all', label: 'همه وضعیت‌ها'})

const contentTypes = [
  {value: 'all', label: 'همه محتواها'},
  {value: 'movie', label: 'فیلم'},
  {value: 'series', label: 'سریال'}
]

const statuses = [
  {value: 'all', label: 'همه وضعیت‌ها'},
  {value: 'active', label: 'فعال'},
  {value: 'inactive', label: 'غیرفعال'}
]

const modalForm = ref({
  contentType: '',
  contentTitle: '',
  question: '',
  answer: '',
  status: 'inactive',
  typeId: ''
})

const editingFAQ = ref(null)
const faqs = computed(() =>faqStore.faqs)

const filteredFAQs = computed(() => {
  let filtered = faqs.value

  if (searchQuery.value) {
    filtered = filtered.filter(f =>
        f.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        f.contentTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedContentType.value.value !== 'all') {
    filtered = filtered.filter(f => f.contentType === selectedContentType.value.value)
  }

  if (selectedStatus.value.value !== 'all') {
    filtered = filtered.filter(f => f.status === selectedStatus.value.value)
  }

  return filtered
})

const selectContentType = (type) => {
  selectedContentType.value = type
  showContentTypeDropdown.value = false
}

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const selectModalContentType = (type) => {
  modalForm.value.contentType = type
  showModalContentTypeDropdown.value = false
}

const editFAQ = (faq) => {
  editingFAQ.value = faq
  modalForm.value = {...faq}
  showEditModal.value = true
}

const deleteFAQ = async (faq) => {
  if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
    const index = faqs.value.findIndex(f => f.id === faq.id)
    if (index !== -1) {
      await faqStore.removeFaq(faq.id)
      toast.success('سوال با موفقیت حذف شد')
    }
  }
}

const saveFAQ = async () => {
  if (!modalForm.value.contentType || !modalForm.value.contentTitle || !modalForm.value.question || !modalForm.value.answer) {
    toast.warning('لطفاً همه فیلدهای الزامی را پر کنید')
    return
  }

  if (showEditModal.value) {
    await faqStore.editFaq({...modalForm.value, id: editingFAQ.value.id})
    const index = faqs.value.findIndex(f => f.id === editingFAQ.value.id)
    if (index !== -1) {
      faqs.value[index] = {...modalForm.value, id: editingFAQ.value.id}
      toast.success('سوال با موفقیت ویرایش شد')
    }
  } else {

    modalForm.value.typeId = faqTypeStore.selectedType.id

    await faqStore.addFaq(modalForm.value)
    toast.success('سوال جدید با موفقیت اضافه شد')
  }

  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingFAQ.value = null
  modalForm.value = {
    contentType: '',
    contentTitle: '',
    question: '',
    answer: '',
    status: 'inactive'
  }
  showModalContentTypeDropdown.value = false
}

onMounted(async () => {
  await faqTypeStore.fetchType('film')
})
watch(
    () => faqTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await faqStore.fetchFaqs({typeId: type.id})
      }
    },
    {immediate: true}
)
</script>
