<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">دسته‌بندی نوشته‌ها</h1>
        <p class="text-gray-600">مدیریت دسته‌بندی‌های نوشته‌ها و مقالات</p>
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            <p class="text-gray-600 text-sm mb-1">دسته‌های فعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-check text-2xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">کل نوشته‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalPosts }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-article text-2xl text-blue-600"></i>
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
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">دسته والد</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">تعداد نوشته</th>
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
                  <div>
                    <div class="font-medium text-gray-900">{{ category.title }}</div>
                    <div v-if="category.description" class="text-xs text-gray-500 mt-0.5">{{ category.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded">{{ category.slug }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="category.parent" class="text-sm text-gray-600">{{ category.parent.title }}</span>
                <span v-else class="text-sm text-gray-400">—</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900 font-semibold">{{ category.posts.length }}</span>
                <span class="text-xs text-gray-500 mr-1">نوشته</span>
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
            <!-- Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                نام دسته‌بندی <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                @input="generateSlug"
                type="text"
                placeholder="مثال: آموزش، تکنولوژی، سرگرمی"
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
                placeholder="education"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                :class="{ 'border-red-500': errors.slug }"
              />
              <p v-if="errors.slug" class="mt-1 text-sm text-red-600">{{ errors.slug }}</p>
              <p class="mt-1 text-xs text-gray-500">نامک به صورت خودکار از نام دسته‌بندی ایجاد می‌شود</p>
            </div>

            <!-- Parent Category -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                دسته والد
              </label>
              <div class="relative">
                <button
                  @click="parentDropdownOpen = !parentDropdownOpen"
                  type="button"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all flex items-center justify-between"
                >
                  <span v-if="form.parent" class="text-gray-900">{{ form.parent.title }}</span>
                  <span v-else class="text-gray-400">بدون والد (دسته اصلی)</span>
                  <i class="ti ti-chevron-down text-gray-400"></i>
                </button>
                <ul v-if="parentDropdownOpen" class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <li
                    @click="selectParent(null)"
                    class="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors"
                    :class="{ 'bg-purple-100': !form.parent }"
                  >
                    <span class="text-gray-600">بدون والد (دسته اصلی)</span>
                  </li>
                  <li
                    v-for="cat in parentCategories"
                    :key="cat.id"
                    @click="selectParent(cat)"
                    class="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors"
                    :class="{ 'bg-purple-100': form.parent === cat.title }"
                  >
                    {{ cat.title }}
                  </li>
                </ul>
              </div>
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
import {ref, computed, inject, onMounted, watch} from 'vue'
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";

const toast = inject('toast')
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()

const categories = computed(() =>
    categoryStore.categories.map(cat => ({
      ...cat,
      status: cat.isActive ? 'active' : 'inactive'
    }))
)

/*
const stats = computed(() => {
  const cats = categoryyStore.categories

  return {
    total: cats.length,
    active: cats.filter(t => t.isActive === true).length,
    totalPosts: 0//tags.reduce((sum, t) => sum + (t.count ?? 0), 0)
  }
})*/
// Stats
const stats = computed(() => {
  const cats = categoryStore.categories

  return {
    total: cats.length,
    active: cats.filter(t => t.isActive === true).length,
    totalPosts: cats.reduce((sum, t) => sum + (t.posts ?? 0), 0)
  }
})

// Parent categories (only main categories)
const parentCategories = computed(() => {
  return categories.value.filter(c => !c.parent)
})

// Modal state
const showModal = ref(false)
const editMode = ref(false)
const parentDropdownOpen = ref(false)

// Form data
const form = ref({
  title: '',
  slug: '',
  parent: null,
  parentId:'',
  color: '#9333ea',
  description: '',
  status: 'active'
})

const errors = ref({})

// Generate slug from name
const generateSlug = () => {
  const persianToEnglish = {
    'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'i', 'ئ': 'i', 'ة': 'e', 'ى': 'a'
  }
  
  let slug = form.value.title.toLowerCase()
  for (const [persian, english] of Object.entries(persianToEnglish)) {
    slug = slug.replace(new RegExp(persian, 'g'), english)
  }
  slug = slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  form.value.slug = slug
}

// Select parent
const selectParent = (parent) => {
  form.value.parent = parent
  form.value.parentId=parent.id
  parentDropdownOpen.value = false
}

// Open add modal
const openAddModal = () => {
  editMode.value = false
  form.value = {
    title: '',
    slug: '',
    parent: null,
    parentId:'',
    color: '#9333ea',
    description: '',
    status: 'active'
  }
  errors.value = {}
  showModal.value = true
}

// Edit category
const editCategory = (category) => {
  editMode.value = true
  form.value = { ...category }
  errors.value = {}
  showModal.value = true
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title) {
    errors.value.title = 'نام دسته‌بندی الزامی است'
  }
  
  if (!form.value.slug) {
    errors.value.slug = 'نامک الزامی است'
  }
  
  return Object.keys(errors.value).length === 0
}

// Save category
const saveCategory = async () => {

  if (!validateForm()) {
    toast.warning('لطفا فیلدهای الزامی را تکمیل کنید')
    return
  }
  closeModal()

  try{
    if (editMode.value) {
      const {id,count,posts, status,parent, ...rest} = form.value
      const cleanPayload = {
        ...rest,
        //parentId: parent ? parent.id : null,
        isActive: status === 'active',
        contentType:'film'
      }
      await categoryStore.editCategory({id: form.value.id, ...cleanPayload})
      const index = categories.value.findIndex(c => c.id === form.value.id)
      if (index !== -1) {
        categories.value[index] = {...form.value}
        toast.success('دسته‌بندی با موفقیت بروزرسانی شد')
      }
    } else {
      const newCategory = {
        ...form.value,
        id: categories.value.length + 1,
        count: 0
      }
      const {id, status,count,parent, ...rest} = newCategory
      const cleanPayload = {
        ...rest,
        typeId: categoryTypeStore.selectedType.id,
        isActive: status === 'active',
        contentType:'film'
      }
      await categoryStore.addCategory(cleanPayload)

      toast.success('دسته‌بندی جدید با موفقیت اضافه شد')
    }
  }catch(err){
    console.error(err)
    toast.error('عملیات با خطا مواجه شد')
  }

}

// Delete category
const deleteCategory = async (category) => {
  if (category.count > 0) {
    toast.error('امکان حذف دسته‌بندی با نوشته وجود ندارد')
    return
  }

  // Check if any category has this as parent
  const hasChildren = categories.value.some(c => c.parent === category.title)
  if (hasChildren) {
    toast.error('ابتدا باید دسته‌های فرعی را حذف یا منتقل کنید')
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
  parentDropdownOpen.value = false
}
onMounted(async () => {
  await categoryTypeStore.fetchType('post')
})
watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId:type.id,contentType:'film'})

      }
    },
    {immediate: true}
)
</script>
