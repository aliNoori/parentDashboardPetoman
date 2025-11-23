<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت اسلایدرها</h1>
        <p class="text-gray-600 mt-1">اسلایدرهای صفحه اصلی با لینک، عنوان و توضیحات</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary">
        <i class="ti ti-plus ml-2"></i>
        اسلایدر جدید
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل اسلایدرها</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ sliders.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-photo text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">فعال</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ activeSliders }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-eye text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">غیرفعال</p>
            <p class="text-2xl font-bold text-gray-600 mt-1">{{ inactiveSliders }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
            <i class="ti ti-eye-off text-gray-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در اسلایدرها..."
              class="input-field pr-10"
            >
          </div>
        </div>
        
        <div class="flex gap-3">
          <div class="relative">
            <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="btn-secondary flex items-center gap-2"
            >
              <span>{{ selectedStatus.label }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-if="showStatusDropdown" class="dropdown-menu">
              <li v-for="status in statusOptions" :key="status.value">
                <button @click="selectStatus(status)" class="dropdown-item">
                  {{ status.label }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Sliders List -->
    <div class="space-y-4">
      <div
        v-for="(slider, index) in filteredSliders"
        :key="slider.id"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start gap-6">
          <!-- Image -->
          <div class="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              :src="slider.image"
              :alt="slider.title"
              class="w-full h-full object-cover"
            >
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ slider.title }}</h3>
                <p class="text-gray-600 text-sm">{{ slider.description }}</p>
              </div>
              
              <div class="flex items-center gap-2 ml-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="slider.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ slider.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
                
                <div class="flex items-center gap-1">
                  <button
                    @click="moveUp(index)"
                    :disabled="index === 0"
                    class="btn-icon"
                    :class="index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'"
                  >
                    <i class="ti ti-chevron-up text-sm"></i>
                  </button>
                  
                  <button
                    @click="moveDown(index)"
                    :disabled="index === filteredSliders.length - 1"
                    class="btn-icon"
                    :class="index === filteredSliders.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'"
                  >
                    <i class="ti ti-chevron-down text-sm"></i>
                  </button>
                  
                  <button
                    @click="editSlider(slider)"
                    class="btn-icon hover:bg-green-50 hover:text-green-600"
                  >
                    <i class="ti ti-edit text-sm"></i>
                  </button>
                  
                  <button
                    @click="toggleStatus(slider)"
                    class="btn-icon hover:bg-orange-50 hover:text-orange-600"
                  >
                    <i :class="slider.isActive ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-sm"></i>
                  </button>
                  
                  <button
                    @click="deleteSlider(slider)"
                    class="btn-icon hover:bg-red-50 hover:text-red-600"
                  >
                    <i class="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-500">لینک:</span>
                <a
                  :href="slider.link"
                  target="_blank"
                  class="block text-blue-600 hover:text-blue-700 truncate"
                >
                  {{ slider.link }}
                </a>
              </div>
              
              <div>
                <span class="text-gray-500">ترتیب:</span>
                <span class="font-medium text-gray-900">{{ slider.order }}</span>
              </div>
              
              <div>
                <span class="text-gray-500">تاریخ ایجاد:</span>
                <span class="text-gray-900">{{ slider.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingSlider" class="modal-overlay" @click="closeModal">
      <div @click.stop class="modal-content">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingSlider ? 'ویرایش اسلایدر' : 'اسلایدر جدید' }}
          </h2>
          <button @click="closeModal" class="btn-icon">
            <i class="ti ti-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveSlider" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
            <input
              v-model="sliderForm.title"
              type="text"
              placeholder="عنوان اسلایدر..."
              class="input-field"
              required
            >
          </div>
          
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              v-model="sliderForm.description"
              rows="3"
              placeholder="توضیحات کوتاه..."
              class="input-field resize-none"
              required
            ></textarea>
          </div>
          
          <!-- Link Settings -->
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">نوع لینک</label>
            
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="sliderForm.linkType"
                  value="post"
                  type="radio"
                  class="text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">پست</span>
              </label>
              
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="sliderForm.linkType"
                  value="page"
                  type="radio"
                  class="text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">صفحه</span>
              </label>
              
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="sliderForm.linkType"
                  value="external"
                  type="radio"
                  class="text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">لینک خارجی</span>
              </label>
            </div>
            
            <!-- Post Selection -->
            <div v-if="sliderForm.linkType === 'post'">
              <label class="block text-sm font-medium text-gray-700 mb-2">انتخاب پست</label>
              <select v-model="sliderForm.selectedPost" class="input-field">
                <option value="">پست را انتخاب کنید...</option>
                <option v-for="post in availablePosts" :key="post.id" :value="post.slug">
                  {{ post.title }}
                </option>
              </select>
            </div>
            
            <!-- Page Selection -->
            <div v-if="sliderForm.linkType === 'page'">
              <label class="block text-sm font-medium text-gray-700 mb-2">انتخاب صفحه</label>
              <select v-model="sliderForm.selectedPage" class="input-field">
                <option value="">صفحه را انتخاب کنید...</option>
                <option v-for="page in availablePages" :key="page.id" :value="page.slug">
                  {{ page.title }}
                </option>
              </select>
            </div>
            
            <!-- External Link -->
            <div v-if="sliderForm.linkType === 'external'">
              <label class="block text-sm font-medium text-gray-700 mb-2">لینک خارجی</label>
              <input
                v-model="sliderForm.externalLink"
                type="url"
                placeholder="https://example.com"
                class="input-field"
              >
            </div>
          </div>
          
          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تصویر</label>
            
            <div v-if="!sliderForm.image" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <i class="ti ti-photo text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-600 mb-4">تصویر اسلایدر را انتخاب کنید</p>
              <button type="button" @click="uploadSliderImage" class="btn-secondary">
                <i class="ti ti-upload ml-2"></i>
                انتخاب تصویر
              </button>
            </div>
            
            <div v-else class="space-y-3">
              <img :src="sliderForm.image" alt="Slider" class="w-full h-32 object-cover rounded-lg">
              <div class="flex gap-2">
                <button type="button" @click="uploadSliderImage" class="btn-secondary flex-1">تغییر تصویر</button>
                <button
                  type="button"
                  @click="sliderForm.image = null"
                  class="btn-icon text-red-600 hover:bg-red-50"
                >
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Settings -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ترتیب</label>
              <input
                v-model.number="sliderForm.order"
                type="number"
                min="1"
                class="input-field"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="sliderForm.isActive"
                  type="checkbox"
                  class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">اسلایدر فعال باشد</span>
              </label>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="submit" class="btn-primary flex-1">
              {{ editingSlider ? 'بروزرسانی' : 'ایجاد اسلایدر' }}
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
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">حذف اسلایدر</h3>
          <p class="text-gray-600 mb-6">
            آیا از حذف اسلایدر "{{ deleteConfirm.title }}" اطمینان دارید؟
            این عمل قابل بازگشت نیست.
          </p>
          
          <div class="flex gap-3">
            <button @click="confirmDelete" class="btn-danger flex-1">
              حذف اسلایدر
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
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const showAddModal = ref(false)
const editingSlider = ref(null)
const deleteConfirm = ref(null)
const showStatusDropdown = ref(false)

const selectedStatus = ref({ value: 'all', label: 'همه اسلایدرها' })

const statusOptions = ref([
  { value: 'all', label: 'همه اسلایدرها' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' }
])

const sliderForm = ref({
  title: '',
  description: '',
  linkType: 'post',
  selectedPost: '',
  selectedPage: '',
  externalLink: '',
  image: null,
  order: 1,
  isActive: true
})

const availablePosts = ref([
  { id: 1, title: 'نکات مراقبت از سگ', slug: 'dog-care-tips' },
  { id: 2, title: 'تغذیه گربه‌های خانگی', slug: 'cat-nutrition' },
  { id: 3, title: 'بیماری‌های شایع پرندگان', slug: 'bird-diseases' },
  { id: 4, title: 'آموزش ماهی‌داری', slug: 'fish-keeping' }
])

const availablePages = ref([
  { id: 1, title: 'درباره ما', slug: 'about-us' },
  { id: 2, title: 'تماس با ما', slug: 'contact' },
  { id: 3, title: 'حریم خصوصی', slug: 'privacy' },
  { id: 4, title: 'قوانین و مقررات', slug: 'terms' }
])

const sliders = ref([
  {
    id: 1,
    title: 'مراقبت از حیوانات خانگی',
    description: 'راهنمای کامل مراقبت از سگ و گربه',
    link: 'https://example.com/pet-care',
    image: 'https://via.placeholder.com/400x200',
    order: 1,
    isActive: true,
    createdAt: '1403/08/01'
  },
  {
    id: 2,
    title: 'تغذیه صحیح حیوانات',
    description: 'نکات مهم برای تغذیه سالم',
    link: 'https://example.com/nutrition',
    image: 'https://via.placeholder.com/400x200',
    order: 2,
    isActive: true,
    createdAt: '1403/08/02'
  },
  {
    id: 3,
    title: 'آموزش و تربیت',
    description: 'روش‌های موثر آموزش حیوانات',
    link: 'https://example.com/training',
    image: 'https://via.placeholder.com/400x200',
    order: 3,
    isActive: false,
    createdAt: '1403/08/03'
  }
])

const activeSliders = computed(() => {
  return sliders.value.filter(slider => slider.isActive).length
})

const inactiveSliders = computed(() => {
  return sliders.value.filter(slider => !slider.isActive).length
})

const filteredSliders = computed(() => {
  let filtered = sliders.value

  if (searchQuery.value) {
    filtered = filtered.filter(slider =>
      slider.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      slider.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatus.value.value !== 'all') {
    const isActive = selectedStatus.value.value === 'active'
    filtered = filtered.filter(slider => slider.isActive === isActive)
  }

  // Sort by order
  return filtered.sort((a, b) => a.order - b.order)
})

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const moveUp = (index) => {
  if (index > 0) {
    const temp = sliders.value[index].order
    sliders.value[index].order = sliders.value[index - 1].order
    sliders.value[index - 1].order = temp
  }
}

const moveDown = (index) => {
  if (index < sliders.value.length - 1) {
    const temp = sliders.value[index].order
    sliders.value[index].order = sliders.value[index + 1].order
    sliders.value[index + 1].order = temp
  }
}

const editSlider = (slider) => {
  editingSlider.value = slider
  sliderForm.value = {
    title: slider.title,
    description: slider.description,
    link: slider.link,
    image: slider.image,
    order: slider.order,
    isActive: slider.isActive
  }
}

const toggleStatus = (slider) => {
  slider.isActive = !slider.isActive
}

const deleteSlider = (slider) => {
  deleteConfirm.value = slider
}

const confirmDelete = () => {
  sliders.value = sliders.value.filter(slider => slider.id !== deleteConfirm.value.id)
  deleteConfirm.value = null
}

const closeModal = () => {
  showAddModal.value = false
  editingSlider.value = null
  sliderForm.value = {
    title: '',
    description: '',
    link: '',
    image: null,
    order: sliders.value.length + 1,
    isActive: true
  }
}

const resetForm = () => {
  sliderForm.value = {
    title: '',
    description: '',
    linkType: 'post',
    selectedPost: '',
    selectedPage: '',
    externalLink: '',
    image: null,
    order: sliders.value.length + 1,
    isActive: true
  }
}

const uploadSliderImage = () => {
  // Simulate image upload
  sliderForm.value.image = 'https://via.placeholder.com/800x400'
  console.log('Slider image uploaded')
}

const saveSlider = () => {
  // Generate final link based on type
  let finalLink = ''
  switch (sliderForm.value.linkType) {
    case 'post':
      finalLink = `/post/${sliderForm.value.selectedPost}`
      break
    case 'page':
      finalLink = `/page/${sliderForm.value.selectedPage}`
      break
    case 'external':
      finalLink = sliderForm.value.externalLink
      break
  }

  if (editingSlider.value) {
    // Update existing slider
    const index = sliders.value.findIndex(slider => slider.id === editingSlider.value.id)
    sliders.value[index] = {
      ...sliders.value[index],
      ...sliderForm.value,
      link: finalLink
    }
  } else {
    // Add new slider
    const newSlider = {
      id: Date.now(),
      ...sliderForm.value,
      link: finalLink,
      createdAt: new Date().toLocaleDateString('fa-IR')
    }
    sliders.value.push(newSlider)
  }
  
  closeModal()
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showStatusDropdown.value = false
    }
  })
})
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
  max-width: 42rem;
  max-height: 90vh;
  overflow-y: auto;
}
</style>