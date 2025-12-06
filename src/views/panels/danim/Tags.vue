<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">مدیریت برچسب‌ها</h1>
        <p class="text-gray-600">برچسب‌های محتوا را مدیریت کنید</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="exportToExcel"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <i class="ti ti-file-export"></i>
          خروجی Excel
        </button>
        <button 
          @click="showAddModal = true" 
          class="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <i class="ti ti-plus"></i>
          برچسب جدید
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">کل برچسب‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ tags.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-tags text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">برچسب‌های فعال</p>
            <p class="text-2xl font-bold text-green-600">{{ activeTags }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">مجموع استفاده</p>
            <p class="text-2xl font-bold text-purple-600">{{ totalUsage }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-article text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">میانگین استفاده</p>
            <p class="text-2xl font-bold text-orange-600">{{ Math.round(totalUsage / Math.max(tags.length, 1)) }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-chart-bar text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در برچسب‌ها..."
              class="input-field pr-10"
            >
          </div>
        </div>
        
        <div class="flex gap-3">
          <div class="relative">
            <button
              @click="showSortDropdown = !showSortDropdown"
              class="btn-secondary flex items-center gap-2"
            >
              <span>{{ selectedSort.label }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-if="showSortDropdown" class="dropdown-menu">
              <li v-for="sort in sortOptions" :key="sort.value">
                <button @click="selectSort(sort)" class="dropdown-item">
                  {{ sort.label }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="tag in filteredTags"
        :key="tag.id"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ tag.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ tag.slug }}</p>
          </div>
          <div class="flex gap-1">
            <button
              @click="editTag(tag)"
              class="btn-icon hover:bg-blue-50 hover:text-blue-600"
            >
              <i class="ti ti-edit text-sm"></i>
            </button>
            <button
              @click="deleteTag(tag)"
              class="btn-icon hover:bg-red-50 hover:text-red-600"
            >
              <i class="ti ti-trash text-sm"></i>
            </button>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">تعداد استفاده:</span>
            <span class="font-medium text-gray-900">{{ tag.count }}</span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">آخرین استفاده:</span>
            <span class="text-gray-900">{{ tag.lastUsed }}</span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">وضعیت:</span>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="tag.count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ tag.count > 0 ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
        </div>
        
        <div v-if="tag.description" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">{{ tag.description }}</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingTag" class="modal-overlay" @click="closeModal">
      <div @click.stop class="modal-content">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingTag ? 'ویرایش برچسب' : 'برچسب جدید' }}
          </h2>
          <button @click="closeModal" class="btn-icon">
            <i class="ti ti-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveTag" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام برچسب</label>
            <input
              v-model="tagForm.name"
              type="text"
              placeholder="نام برچسب..."
              class="input-field"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Slug</label>
            <input
              v-model="tagForm.slug"
              type="text"
              placeholder="tag-slug"
              class="input-field"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              v-model="tagForm.description"
              rows="3"
              placeholder="توضیحات اختیاری برای برچسب..."
              class="input-field resize-none"
            ></textarea>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="submit" class="btn-primary flex-1">
              {{ editingTag ? 'بروزرسانی' : 'ایجاد برچسب' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirm" class="modal-overlay" @click="deleteConfirm = null">
      <div @click.stop class="modal-content max-w-md">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-trash text-red-600 text-2xl"></i>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">حذف برچسب</h3>
          <p class="text-gray-600 mb-6">
            آیا از حذف برچسب "{{ deleteConfirm.name }}" اطمینان دارید؟
            این عمل قابل بازگشت نیست.
          </p>
          
          <div class="flex gap-3">
            <button @click="confirmDelete" class="btn-danger flex-1">
              حذف برچسب
            </button>
            <button @click="deleteConfirm = null" class="btn-secondary flex-1">
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useTagStore} from "@/stores/tag.ts";
import {useTagTypeStore} from "@/stores/tag-type.ts";

const searchQuery = ref('')
const showAddModal = ref(false)
const editingTag = ref(null)
const deleteConfirm = ref(null)
const showSortDropdown = ref(false)

const selectedSort = ref({ value: 'name', label: 'نام برچسب' })
const tagTypeStore=useTagTypeStore()
const tagStore=useTagStore()
const sortOptions = ref([
  { value: 'name', label: 'نام برچسب' },
  { value: 'count', label: 'تعداد استفاده' },
  { value: 'recent', label: 'جدیدترین' },
  { value: 'lastUsed', label: 'آخرین استفاده' }
])

const tagForm = ref({
  name: '',
  slug: '',
  description: '',
  contentType:'danim',
})

const tags=computed(()=>tagStore.tags)
/*const tags = ref([
  {
    id: 1,
    name: 'سلامت',
    slug: 'health',
    description: 'مطالب مربوط به سلامت حیوانات',
    count: 15,
    lastUsed: '1403/08/05'
  },
  {
    id: 2,
    name: 'تغذیه',
    slug: 'nutrition',
    description: 'راهنمای تغذیه صحیح',
    count: 12,
    lastUsed: '1403/08/04'
  },
  {
    id: 3,
    name: 'آموزش',
    slug: 'training',
    description: 'آموزش و تربیت حیوانات',
    count: 8,
    lastUsed: '1403/08/03'
  },
  {
    id: 4,
    name: 'مراقبت',
    slug: 'care',
    description: 'نکات مراقبتی',
    count: 0,
    lastUsed: 'هرگز'
  }
])*/

const activeTags = computed(() => {
  return tags.value.filter(tag => tag.count > 0).length
})

const totalUsage = computed(() => {
  return tags.value.reduce((sum, tag) => sum + tag.count, 0)
})

const usedTags = computed(() => {
  return tags.value.filter(tag => tag.count > 0).length
})

const unusedTags = computed(() => {
  return tags.value.filter(tag => tag.count === 0).length
})

const filteredTags = computed(() => {
  let filtered = tags.value

  if (searchQuery.value) {
    filtered = filtered.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (tag.description && tag.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Sort tags
  filtered.sort((a, b) => {
    switch (selectedSort.value.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'count':
        return b.count - a.count
      case 'recent':
        return b.id - a.id
      case 'lastUsed':
        return new Date(b.lastUsed) - new Date(a.lastUsed)
      default:
        return 0
    }
  })

  return filtered
})

const selectSort = (sort) => {
  selectedSort.value = sort
  showSortDropdown.value = false
}

const editTag = (tag) => {
  editingTag.value = tag
  tagForm.value = {
    name: tag.name,
    slug: tag.slug,
    description: tag.description || ''
  }
}

const deleteTag = async (tag) => {
  deleteConfirm.value = tag
}

const confirmDelete = async () => {
  tags.value = tags.value.filter(tag => tag.id !== deleteConfirm.value.id)
  await tagStore.removeTag(deleteConfirm.value.id)
  deleteConfirm.value = null
}

const closeModal = () => {
  showAddModal.value = false
  editingTag.value = null
  tagForm.value = {
    name: '',
    slug: '',
    description: ''
  }
}

const saveTag = async () => {
  if (editingTag.value) {
    // Update existing tag
    await tagStore.editTag({
      id: editingTag.value.id,
      name: tagForm.value.name,
      slug: tagForm.value.slug,
      description: tagForm.value.description || '',
      contentType:'danim',
      typeId:tagTypeStore.selectedType.id
    })

    const index = tags.value.findIndex(tag => tag.id === editingTag.value.id)
    tags.value[index] = {
      ...tags.value[index],
      ...tagForm.value
    }

  } else {
    // Add new tag
    await tagStore.addTag({
      name: tagForm.value.name,
      slug: tagForm.value.slug,
      description: tagForm.value.description || '',
      contentType:'danim',
      typeId:tagTypeStore.selectedType.id
    })
  }

  closeModal()
}

const exportToExcel = () => {
  // Create tags data for export
  const exportData = [
    ['نام', 'نامک', 'توضیحات', 'تعداد استفاده', 'آخرین استفاده'],
    ...filteredTags.value.map(tag => [
      tag.name,
      tag.slug,
      tag.description || '',
      tag.count.toString(),
      tag.lastUsed
    ])
  ]

  // Convert to CSV
  const csvContent = exportData.map(row => row.join(',')).join('\n')
  
  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `tags_export_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  console.log('Tags exported successfully!')
}

onMounted(async () => {
  await tagTypeStore.fetchType('post')
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showSortDropdown.value = false
    }
  })
})

watch(
    () => tagTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await tagStore.fetchTags({typeId: type.id,contentType:'danim'})
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

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-danger:hover {
  background-color: #b91c1c;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
}
</style>