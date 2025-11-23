<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">مدیریت برچسب‌ها</h1>
        <p class="text-gray-600">مدیریت برچسب‌های فیلم‌ها و سریال‌ها</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
      >
        <i class="ti ti-plus text-xl"></i>
        <span class="font-semibold">برچسب جدید</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">کل برچسب‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-tags text-2xl text-purple-600"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">فیلم‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.movies }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-movie text-2xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">سریال‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.series }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-device-tv text-2xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">مشترک</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.both }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-circles text-2xl text-orange-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="tag in tags" :key="tag.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                 :style="{ backgroundColor: tag.color + '20', color: tag.color }">
              <i class="ti ti-tag text-lg"></i>
            </div>
            <h3 class="font-semibold text-gray-900">{{ tag.name }}</h3>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="editTag(tag)"
              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
              title="ویرایش"
            >
              <i class="ti ti-edit text-sm"></i>
            </button>
            <button 
              @click="deleteTag(tag)"
              class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
              title="حذف"
            >
              <i class="ti ti-trash text-sm"></i>
            </button>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">نامک:</span>
            <span class="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{{ tag.slug }}</span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">نوع:</span>
            <span v-if="tag.type === 'movie'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              <i class="ti ti-movie text-xs"></i>
              فیلم
            </span>
            <span v-else-if="tag.type === 'series'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
              <i class="ti ti-device-tv text-xs"></i>
              سریال
            </span>
            <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
              <i class="ti ti-circles text-xs"></i>
              هر دو
            </span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">استفاده:</span>
            <span class="font-semibold text-gray-900">{{ tag.count }} محتوا</span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">وضعیت:</span>
            <span v-if="tag.status === 'active'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
              <i class="ti ti-check text-xs"></i>
              فعال
            </span>
            <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              <i class="ti ti-x text-xs"></i>
              غیرفعال
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">
              {{ editMode ? 'ویرایش برچسب' : 'افزودن برچسب جدید' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="ti ti-x text-2xl"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                نام برچسب <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                @input="generateSlug"
                type="text"
                placeholder="مثال: دوبله فارسی، ۴K، IMDB Top"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                نامک (Slug) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.slug"
                type="text"
                placeholder="dubbed-persian"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                :class="{ 'border-red-500': errors.slug }"
              />
              <p v-if="errors.slug" class="mt-1 text-sm text-red-600">{{ errors.slug }}</p>
              <p class="mt-1 text-xs text-gray-500">نامک به صورت خودکار از نام برچسب ایجاد می‌شود</p>
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                نوع محتوا <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <button
                  @click="typeDropdownOpen = !typeDropdownOpen"
                  type="button"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all flex items-center justify-between"
                  :class="{ 'border-red-500': errors.type }"
                >
                  <span v-if="form.type" class="flex items-center gap-2">
                    <i v-if="form.type === 'movie'" class="ti ti-movie text-blue-600"></i>
                    <i v-else-if="form.type === 'series'" class="ti ti-device-tv text-green-600"></i>
                    <i v-else class="ti ti-circles text-orange-600"></i>
                    {{ typeOptions.find(t => t.value === form.type)?.label }}
                  </span>
                  <span v-else class="text-gray-400">انتخاب نوع محتوا</span>
                  <i class="ti ti-chevron-down text-gray-400"></i>
                </button>
                <ul v-if="typeDropdownOpen" class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <li
                    v-for="option in typeOptions"
                    :key="option.value"
                    @click="selectType(option.value)"
                    class="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors flex items-center gap-2"
                    :class="{ 'bg-purple-100': form.type === option.value }"
                  >
                    <i :class="option.icon"></i>
                    <span>{{ option.label }}</span>
                  </li>
                </ul>
              </div>
              <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
            </div>

            <!-- Color -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                رنگ برچسب <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-4">
                <input
                  v-model="form.color"
                  type="color"
                  class="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  v-model="form.color"
                  type="text"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                  placeholder="#9333ea"
                />
                <div class="flex items-center gap-2 px-4 py-2 rounded-lg border-2"
                     :style="{ borderColor: form.color, color: form.color }">
                  <i class="ti ti-tag"></i>
                  <span class="font-medium">پیش‌نمایش</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="توضیحات مختصری درباره این برچسب..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                وضعیت
              </label>
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.status"
                    type="radio"
                    value="active"
                    class="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">فعال</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.status"
                    type="radio"
                    value="inactive"
                    class="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">غیرفعال</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              @click="closeModal"
              type="button"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              انصراف
            </button>
            <button
              @click="saveTag"
              type="button"
              class="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2"
            >
              <i class="ti ti-check"></i>
              <span>{{ editMode ? 'بروزرسانی' : 'افزودن' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const toast = inject('toast')

// Stats
const stats = ref({
  total: 15,
  movies: 6,
  series: 3,
  both: 6
})

// Tags data
const tags = ref([
  { id: 1, name: 'دوبله فارسی', slug: 'dubbed-persian', type: 'both', color: '#10b981', count: 156, status: 'active', description: 'محتوای دوبله شده به فارسی' },
  { id: 2, name: 'زیرنویس فارسی', slug: 'subtitle-persian', type: 'both', color: '#3b82f6', count: 243, status: 'active', description: 'محتوا با زیرنویس فارسی' },
  { id: 3, name: '4K', slug: '4k', type: 'both', color: '#8b5cf6', count: 89, status: 'active', description: 'کیفیت ۴K' },
  { id: 4, name: 'IMDB Top', slug: 'imdb-top', type: 'both', color: '#f59e0b', count: 67, status: 'active', description: 'بهترین‌های IMDB' },
  { id: 5, name: 'برنده اسکار', slug: 'oscar-winner', type: 'movie', color: '#eab308', count: 45, status: 'active', description: 'فیلم‌های برنده اسکار' },
  { id: 6, name: 'Netflix Original', slug: 'netflix-original', type: 'series', color: '#ef4444', count: 32, status: 'active', description: 'محصولات اختصاصی نتفلیکس' },
  { id: 7, name: 'محبوب', slug: 'popular', type: 'both', color: '#ec4899', count: 178, status: 'active', description: 'محتوای محبوب' },
  { id: 8, name: 'جدید', slug: 'new', type: 'both', color: '#06b6d4', count: 94, status: 'active', description: 'محتوای جدید' },
  { id: 9, name: 'کلاسیک', slug: 'classic', type: 'movie', count: 56, color: '#a855f7', status: 'active', description: 'فیلم‌های کلاسیک' },
  { id: 10, name: 'پربیننده', slug: 'most-viewed', type: 'both', color: '#f97316', count: 134, status: 'active', description: 'پربیننده‌ترین‌ها' },
  { id: 11, name: 'فصل کامل', slug: 'complete-season', type: 'series', color: '#84cc16', count: 23, status: 'active', description: 'سریال‌های تمام شده' },
  { id: 12, name: 'HDR', slug: 'hdr', type: 'both', color: '#14b8a6', count: 71, status: 'active', description: 'کیفیت HDR' },
  { id: 13, name: 'Dolby Atmos', slug: 'dolby-atmos', type: 'both', color: '#6366f1', count: 42, status: 'active', description: 'صدای Dolby Atmos' },
  { id: 14, name: 'تریلر موجود', slug: 'trailer-available', type: 'both', color: '#0ea5e9', count: 189, status: 'active', description: 'دارای تریلر' },
  { id: 15, name: 'محتوای انحصاری', slug: 'exclusive', type: 'both', color: '#dc2626', count: 28, status: 'active', description: 'محتوای انحصاری' }
])

// Modal state
const showModal = ref(false)
const editMode = ref(false)
const typeDropdownOpen = ref(false)

// Form data
const form = ref({
  name: '',
  slug: '',
  type: '',
  color: '#9333ea',
  description: '',
  status: 'active'
})

const errors = ref({})

// Type options
const typeOptions = [
  { value: 'movie', label: 'فیلم', icon: 'ti ti-movie text-blue-600' },
  { value: 'series', label: 'سریال', icon: 'ti ti-device-tv text-green-600' },
  { value: 'both', label: 'هر دو', icon: 'ti ti-circles text-orange-600' }
]

// Generate slug from name
const generateSlug = () => {
  const persianToEnglish = {
    'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'i', 'ئ': 'i', 'ة': 'e', 'ى': 'a',
    '۴': '4'
  }
  
  let slug = form.value.name.toLowerCase()
  for (const [persian, english] of Object.entries(persianToEnglish)) {
    slug = slug.replace(new RegExp(persian, 'g'), english)
  }
  slug = slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  form.value.slug = slug
}

// Select type
const selectType = (value) => {
  form.value.type = value
  typeDropdownOpen.value = false
}

// Open add modal
const openAddModal = () => {
  editMode.value = false
  form.value = {
    name: '',
    slug: '',
    type: '',
    color: '#9333ea',
    description: '',
    status: 'active'
  }
  errors.value = {}
  showModal.value = true
}

// Edit tag
const editTag = (tag) => {
  editMode.value = true
  form.value = { ...tag }
  errors.value = {}
  showModal.value = true
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = 'نام برچسب الزامی است'
  }
  
  if (!form.value.slug) {
    errors.value.slug = 'نامک الزامی است'
  }
  
  if (!form.value.type) {
    errors.value.type = 'انتخاب نوع محتوا الزامی است'
  }
  
  return Object.keys(errors.value).length === 0
}

// Save tag
const saveTag = () => {
  if (!validateForm()) {
    toast.warning('لطفا فیلدهای الزامی را تکمیل کنید')
    return
  }
  
  if (editMode.value) {
    const index = tags.value.findIndex(t => t.id === form.value.id)
    if (index !== -1) {
      tags.value[index] = { ...form.value }
      toast.success('برچسب با موفقیت بروزرسانی شد')
    }
  } else {
    const newTag = {
      ...form.value,
      id: tags.value.length + 1,
      count: 0
    }
    tags.value.push(newTag)
    stats.value.total++
    if (form.value.type === 'movie') stats.value.movies++
    else if (form.value.type === 'series') stats.value.series++
    else stats.value.both++
    toast.success('برچسب جدید با موفقیت اضافه شد')
  }
  
  closeModal()
}

// Delete tag
const deleteTag = (tag) => {
  if (tag.count > 0) {
    if (!confirm(`این برچسب در ${tag.count} محتوا استفاده شده است. آیا از حذف آن اطمینان دارید؟`)) {
      return
    }
  }
  
  if (confirm(`آیا از حذف برچسب "${tag.name}" اطمینان دارید؟`)) {
    const index = tags.value.findIndex(t => t.id === tag.id)
    if (index !== -1) {
      tags.value.splice(index, 1)
      stats.value.total--
      if (tag.type === 'movie') stats.value.movies--
      else if (tag.type === 'series') stats.value.series--
      else stats.value.both--
      toast.success('برچسب با موفقیت حذف شد')
    }
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
  typeDropdownOpen.value = false
}
</script>
