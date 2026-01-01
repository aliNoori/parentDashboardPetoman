<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">مدیریت دسته‌بندی‌ها</h1>
        <p class="text-gray-600">مدیریت دسته‌بندی‌های فیلم‌ها و سریال‌ها</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
      >
        <i class="ti ti-plus text-xl"></i>
        <span class="font-semibold">دسته‌بندی جدید</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">کل دسته‌بندی‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-category text-2xl text-purple-600"></i>
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

    <!-- Categories Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">نام دسته‌بندی</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">نامک (Slug)</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">نوع</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">تعداد محتوا</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">وضعیت</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                       :style="{ backgroundColor: category.color }">
                    {{ category.title.charAt(0) }}
                  </div>
                  <span class="font-medium text-gray-900">{{ category.title }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded">{{ category.slug }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="category.contentType === 'movie'" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <i class="ti ti-movie text-base"></i>
                  فیلم
                </span>
                <span v-else-if="category.contentType === 'series'" class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <i class="ti ti-device-tv text-base"></i>
                  سریال
                </span>
                <span v-else class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  <i class="ti ti-circles text-base"></i>
                  هر دو
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900 font-semibold">{{ category.count }}</span>
                <span class="text-xs text-gray-500 mr-1">محتوا</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="category.status === 'active'" class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <i class="ti ti-check text-base"></i>
                  فعال
                </span>
                <span v-else class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  <i class="ti ti-x text-base"></i>
                  غیرفعال
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="editCategory(category)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="ویرایش"
                  >
                    <i class="ti ti-edit text-lg"></i>
                  </button>
                  <button 
                    @click="deleteCategory(category)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">
              {{ editMode ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="ti ti-x text-2xl"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <!-- Icon Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                آیکون دسته‌بندی
              </label>
              <div class="relative">
                <button
                    @click="iconDropdownOpen = !iconDropdownOpen"
                    type="button"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all flex items-center justify-between"
                >
                  <span v-if="form.icon" class="flex items-center gap-2">
                    <i :class="form.icon"></i>
                    {{ iconOptions.find(i => i.value === form.icon)?.label }}
                  </span>
                  <span v-else class="text-gray-400">انتخاب آیکون</span>
                  <i class="ti ti-chevron-down text-gray-400"></i>
                </button>

                <!-- Dropdown -->
                <ul
                    v-if="iconDropdownOpen"
                    class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <li
                      v-for="option in iconOptions"
                      :key="option.value"
                      @click="selectIcon(option.value)"
                      class="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors flex items-center gap-2"
                      :class="{ 'bg-purple-100': form.icon === option.value }"
                  >
                    <i :class="option.value"></i>
                    <span>{{ option.label }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                نام دسته‌بندی <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                @input="generateSlug"
                type="text"
                placeholder="مثال: اکشن، درام، کمدی"
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
                placeholder="action-movies"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                :class="{ 'border-red-500': errors.slug }"
              />
              <p v-if="errors.slug" class="mt-1 text-sm text-red-600">{{ errors.slug }}</p>
              <p class="mt-1 text-xs text-gray-500">نامک به صورت خودکار از نام دسته‌بندی ایجاد می‌شود</p>
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
                  <span v-if="form.contentType" class="flex items-center gap-2">
                    <i v-if="form.contentType === 'movie'" class="ti ti-movie text-blue-600"></i>
                    <i v-else-if="form.contentType === 'series'" class="ti ti-device-tv text-green-600"></i>
                    <i v-else class="ti ti-circles text-orange-600"></i>
                    {{ typeOptions.find(t => t.value === form.contentType)?.label }}
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
                    :class="{ 'bg-purple-100': form.contentType === option.value }"
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
                رنگ دسته‌بندی
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
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="توضیحات مختصری درباره این دسته‌بندی..."
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
              @click="saveCategory"
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
import {ref, inject, onMounted, watch, computed, reactive} from 'vue'
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";

const toast = inject('toast')
const iconOptions = [
  { value: 'ti ti-deer', label: 'گوزن' },
  { value: 'ti ti-fish', label: 'ماهی' },
  { value: 'ti ti-feather', label: 'پر' },
  { value: 'ti ti-paw', label: 'پنجه' },
  { value: 'ti ti-bug', label: 'حشره' },
  { value: 'ti ti-milk', label: 'مزرعه' },
  { value: 'ti ti-snake', label: 'مار' },
  { value: 'ti ti-tree', label: 'درخت' },
  { value: 'ti ti-snowflake', label: 'برف' },
]
const iconDropdownOpen = ref(false)

function selectIcon(icon) {
  form.icon = icon
  iconDropdownOpen.value = false
}


const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const categories = computed(() =>
    categoryStore.categories.map(cat => {
      let count = 0

      if (cat.contentType === 'movie') {
        count = cat.movies?.length ?? 0
      } else if (cat.contentType === 'series') {
        count = cat.series?.length ?? 0
      } else if (cat.contentType === 'post') {
        count = cat.posts?.length ?? 0
      } else if (cat.contentType === 'document') {
        count = cat.documents?.length ?? 0
      } else {
        // حالت پیش‌فرض
        count =
            (cat.movies?.length ?? 0) +
            (cat.series?.length ?? 0) +
            (cat.posts?.length ?? 0) +
            (cat.documents?.length ?? 0)
      }

      return {
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        contentType: cat.contentType ?? 'movie',
        color: cat.color,
        count,
        status: cat.isActive ? 'active' : 'inactive',
        description: cat.description
      }
    })
)


const stats = computed(() => {
  const categories = categoryStore.categories

  return {
    total: categories.length,
    movies: categories.filter(c => c.contentType === 'movie').length,
    series: categories.filter(c => c.contentType === 'series').length,
    both: categories.filter(c => c.contentType === 'both').length
  }
})
// Categories data
/*const categories = ref([
  { id: 1, name: 'اکشن', slug: 'action', type: 'both', color: '#ef4444', count: 45, status: 'active', description: 'فیلم‌های اکشن و هیجان‌انگیز' },
  { id: 2, name: 'درام', slug: 'drama', type: 'both', color: '#8b5cf6', count: 32, status: 'active', description: 'فیلم‌های درام و احساسی' },
  { id: 3, name: 'کمدی', slug: 'comedy', type: 'movie', color: '#f59e0b', count: 28, status: 'active', description: 'فیلم‌های کمدی و خنده‌دار' },
  { id: 4, name: 'علمی-تخیلی', slug: 'sci-fi', type: 'both', color: '#06b6d4', count: 24, status: 'active', description: 'فیلم‌های علمی تخیلی' },
  { id: 5, name: 'انیمیشن', slug: 'animation', type: 'movie', color: '#10b981', count: 18, status: 'active', description: 'انیمیشن‌های سینمایی' },
  { id: 6, name: 'وحشت', slug: 'horror', type: 'both', color: '#dc2626', count: 15, status: 'active', description: 'فیلم‌های ترسناک و وحشت' },
  { id: 7, name: 'جنایی', slug: 'crime', type: 'series', color: '#0ea5e9', count: 21, status: 'active', description: 'سریال‌های جنایی' },
  { id: 8, name: 'مستند', slug: 'documentary', type: 'both', color: '#84cc16', count: 12, status: 'active', description: 'مستندهای آموزشی' },
  { id: 9, name: 'تاریخی', slug: 'historical', type: 'movie', color: '#a855f7', count: 0, status: 'inactive', description: 'فیلم‌های تاریخی' },
  { id: 10, name: 'ماجراجویی', slug: 'adventure', type: 'both', color: '#f97316', count: 27, status: 'active', description: 'فیلم‌های ماجراجویی' }
])*/

// Modal state
const showModal = ref(false)
const editMode = ref(false)
const typeDropdownOpen = ref(false)

// Form data
const form = reactive({
  title: '',
  slug: '',
  icon:'',
  contentType: '',
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
    'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'i', 'ئ': 'i', 'ة': 'e', 'ى': 'a'
  }
  
  let slug = form.title.toLowerCase()
  for (const [persian, english] of Object.entries(persianToEnglish)) {
    slug = slug.replace(new RegExp(persian, 'g'), english)
  }
  slug = slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  form.slug = slug
}

// Select type
const selectType = (value) => {
  form.contentType = value
  typeDropdownOpen.value = false
}

// Open add modal
const openAddModal = () => {
  editMode.value = false
  Object.assign(form, {
    title: '',
    icon:'',
    slug: '',
    contentType: '',
    color: '#9333ea',
    description: '',
    status: 'active'
  })

  errors.value = {}
  showModal.value = true
}

// Edit category
const editCategory = (category) => {
  editMode.value = true
  Object.assign(form, category)
  errors.value = {}
  showModal.value = true
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.title) {
    errors.value.name = 'نام دسته‌بندی الزامی است'
  }
  
  if (!form.slug) {
    errors.value.slug = 'نامک الزامی است'
  }
  
  if (!form.contentType) {
    errors.value.type = 'انتخاب نوع محتوا الزامی است'
  }
  
  return Object.keys(errors.value).length === 0
}
// Save category
const saveCategory = async () => {
  if (!validateForm()) {
    toast.warning('لطفا فیلدهای الزامی را تکمیل کنید')
    return
  }

  if (editMode.value) {
    const { count, status, ...rest } = form
    const cleanPayload = {
      ...rest,
      isActive: status === 'active'
    }
    await categoryStore.editCategory({id:form.id,...cleanPayload})
    const index = categories.value.findIndex(c => c.id === form.id)
    if (index !== -1) {
      categories.value[index] = {...form}
      toast.success('دسته‌بندی با موفقیت بروزرسانی شد')
    }
  } else {
    const newCategory = {
      ...form,
      typeId:categoryTypeStore.selectedType.id,
      id: categories.value.length + 1,
      count: 0
    }
    const { id, count, status, ...rest } = newCategory
    const cleanPayload = {
      ...rest,
      isActive: status === 'active'
    }

    await categoryStore.addCategory(cleanPayload)

    toast.success('دسته‌بندی جدید با موفقیت اضافه شد')
  }

  closeModal()
}

// Delete category
const deleteCategory = async (category) => {
  if (category.count > 0) {
    toast.error('امکان حذف دسته‌بندی با محتوا وجود ندارد')
    return
  }

  if (confirm(`آیا از حذف دسته‌بندی "${category.title}" اطمینان دارید؟`)) {
    await categoryStore.removeCategory(category.id)
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      toast.success('دسته‌بندی با موفقیت حذف شد')
    }
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
  typeDropdownOpen.value = false
}

onMounted(async () => {
  await categoryTypeStore.fetchType('film')
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
