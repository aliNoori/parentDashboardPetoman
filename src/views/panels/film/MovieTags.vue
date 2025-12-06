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
      <div v-for="tag in tags" :key="tag.id"
           class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
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
            <span v-if="tag.contentType === 'movie'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              <i class="ti ti-movie text-xs"></i>
              فیلم
            </span>
            <span v-else-if="tag.contentType === 'series'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
              <i class="ti ti-device-tv text-xs"></i>
              سریال
            </span>
            <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
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
            <span v-if="tag.status === 'active'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
              <i class="ti ti-check text-xs"></i>
              فعال
            </span>
            <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
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
                  <span v-if="form.contentType" class="flex items-center gap-2">
                    <i v-if="form.contentType === 'movie'" class="ti ti-movie text-blue-600"></i>
                    <i v-else-if="form.contentType === 'series'" class="ti ti-device-tv text-green-600"></i>
                    <i v-else class="ti ti-circles text-orange-600"></i>
                    {{ typeOptions.find(t => t.value === form.contentType)?.label }}
                  </span>
                  <span v-else class="text-gray-400">انتخاب نوع محتوا</span>
                  <i class="ti ti-chevron-down text-gray-400"></i>
                </button>
                <ul v-if="typeDropdownOpen"
                    class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
          <div
              class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
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
import {ref, inject, onMounted, watch, computed} from 'vue'
import {useTagTypeStore} from "@/stores/tag-type.ts";
import {useTagStore} from "@/stores/tag.ts";

const toast = inject('toast')

const tagTypeStore = useTagTypeStore()
const tagStore = useTagStore()
// Stats
const stats = computed(() => {
  const tags = tagStore.tags

  return {
    total: tags.length,
    movies: tags.filter(c => c.contentType === 'movie').length,
    series: tags.filter(c => c.contentType === 'series').length,
    both: tags.filter(c => c.contentType === 'both').length
  }
})
const tags = computed(() =>
    tagStore.tags.map(tag => ({
      ...tag,
      status: tag.isActive ? 'active' : 'inactive'
    }))
)
// Modal state
const showModal = ref(false)
const editMode = ref(false)
const typeDropdownOpen = ref(false)

// Form data
const form = ref({
  name: '',
  slug: '',
  contentType: '',
  color: '#9333ea',
  description: '',
  status: 'active'
})

const errors = ref({})

// Type options
const typeOptions = [
  {value: 'movie', label: 'فیلم', icon: 'ti ti-movie text-blue-600'},
  {value: 'series', label: 'سریال', icon: 'ti ti-device-tv text-green-600'},
  {value: 'both', label: 'هر دو', icon: 'ti ti-circles text-orange-600'}
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
  form.value.contentType = value
  typeDropdownOpen.value = false
}

// Open add modal
const openAddModal = () => {
  editMode.value = false
  form.value = {
    name: '',
    slug: '',
    contentType: '',
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
  form.value = {...tag}
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

  if (!form.value.contentType) {
    errors.value.type = 'انتخاب نوع محتوا الزامی است'
  }

  return Object.keys(errors.value).length === 0
}

// Save tag
const saveTag = async () => {
  if (!validateForm()) {
    toast.warning('لطفا فیلدهای الزامی را تکمیل کنید')
    return
  }

  if (editMode.value) {
    const {id, count, status, ...rest} = form.value
    const cleanPayload = {
      ...rest,
      isActive: status === 'active'
    }

    await tagStore.editTag({id:form.value.id,...cleanPayload})
    const index = tags.value.findIndex(t => t.id === form.value.id)
    if (index !== -1) {
      tags.value[index] = {...form.value}
      toast.success('برچسب با موفقیت بروزرسانی شد')
    }
  } else {
    const newTag = {
      ...form.value,
      id: tags.value.length + 1,
      count: 0
    }
    const {id, count, status, ...rest} = newTag
    const cleanPayload = {
      ...rest,
      typeId: tagTypeStore.selectedType.id,
      isActive: status === 'active'
    }

    await tagStore.addTag(cleanPayload)

    toast.success('برچسب جدید با موفقیت اضافه شد')
  }

  closeModal()
}

// Delete tag
const deleteTag = async (tag) => {
  if (tag.count > 0) {
    if (!confirm(`این برچسب در ${tag.count} محتوا استفاده شده است. آیا از حذف آن اطمینان دارید؟`)) {
      return
    }
  }

  if (confirm(`آیا از حذف برچسب "${tag.name}" اطمینان دارید؟`)) {
    await tagStore.removeTag(tag.id)
    const index = tags.value.findIndex(t => t.id === tag.id)
    if (index !== -1) {
      tags.value.splice(index, 1)
      toast.success('برچسب با موفقیت حذف شد')
    }
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
  typeDropdownOpen.value = false
}

onMounted(async () => {
  await tagTypeStore.fetchType('film')
})
watch(
    () => tagTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await tagStore.fetchTags({typeId: type.id})
      }
    },
    {immediate: true}
)
</script>
