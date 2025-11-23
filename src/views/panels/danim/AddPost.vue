<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">افزودن پست جدید</h1>
        <p class="text-gray-600 mt-1">ایجاد نوشته جدید برای سایت</p>
      </div>
      <div class="flex gap-3">
        <button @click="showPreviewModal = true" class="btn-secondary">
          <i class="ti ti-eye ml-2"></i>
          پیش‌نمایش
        </button>
        <button @click="saveDraft" class="btn-secondary">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره پیش‌نویس
        </button>
        <button @click="publishPost" class="btn-primary">
          <i class="ti ti-send ml-2"></i>
          انتشار
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title and Excerpt -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان پست</label>
              <input
                v-model="post.title"
                type="text"
                placeholder="عنوان جذاب برای پست خود وارد کنید..."
                class="input-field"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">خلاصه (Excerpt)</label>
              <textarea
                v-model="post.excerpt"
                rows="3"
                placeholder="خلاصه‌ای کوتاه از محتوای پست..."
                class="input-field resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Content Editor -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">محتوای پست</label>
          
          <!-- Editor Toolbar -->
          <div class="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex flex-wrap gap-2">
            <button class="editor-btn" title="Bold">
              <i class="ti ti-bold"></i>
            </button>
            <button class="editor-btn" title="Italic">
              <i class="ti ti-italic"></i>
            </button>
            <button class="editor-btn" title="Underline">
              <i class="ti ti-underline"></i>
            </button>
            <div class="w-px h-6 bg-gray-300"></div>
            <button class="editor-btn" title="Heading 1">H1</button>
            <button class="editor-btn" title="Heading 2">H2</button>
            <button class="editor-btn" title="Heading 3">H3</button>
            <div class="w-px h-6 bg-gray-300"></div>
            <button class="editor-btn" title="Link">
              <i class="ti ti-link"></i>
            </button>
            <button class="editor-btn" title="Image">
              <i class="ti ti-photo"></i>
            </button>
            <button class="editor-btn" title="List">
              <i class="ti ti-list"></i>
            </button>
            <button class="editor-btn" title="Quote">
              <i class="ti ti-quote"></i>
            </button>
          </div>
          
          <!-- Content Area -->
          <textarea
            v-model="post.content"
            rows="20"
            placeholder="محتوای پست خود را اینجا بنویسید..."
            class="w-full border-l border-r border-b border-gray-300 rounded-b-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          ></textarea>
        </div>

        <!-- SEO Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">تنظیمات سئو</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                v-model="post.metaTitle"
                type="text"
                placeholder="عنوان برای موتورهای جستجو..."
                class="input-field"
              >
              <p class="text-xs text-gray-500 mt-1">{{ post.metaTitle.length }}/60 کاراکتر</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                v-model="post.metaDescription"
                rows="3"
                placeholder="توضیحات برای موتورهای جستجو..."
                class="input-field resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ post.metaDescription.length }}/160 کاراکتر</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
              <input
                v-model="post.slug"
                type="text"
                placeholder="url-slug-for-post"
                class="input-field"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Featured Image -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">تصویر شاخص</h3>
          
          <div v-if="!post.featuredImage" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <i class="ti ti-photo text-3xl text-gray-400 mb-2"></i>
            <p class="text-gray-600 mb-4">تصویر شاخص پست را انتخاب کنید</p>
            <button @click="uploadFeaturedImage" class="btn-secondary">
              <i class="ti ti-upload ml-2"></i>
              انتخاب تصویر
            </button>
          </div>
          
          <div v-else class="space-y-3">
            <img :src="post.featuredImage" alt="Featured" class="w-full h-32 object-cover rounded-lg">
            <div class="flex gap-2">
              <button @click="uploadFeaturedImage" class="btn-secondary flex-1">تغییر</button>
              <button @click="post.featuredImage = null" class="btn-icon text-red-600 hover:bg-red-50">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Publish Settings -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">تنظیمات انتشار</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
              <div class="relative">
                <button
                  @click="showStatusDropdown = !showStatusDropdown"
                  class="btn-secondary w-full justify-between"
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
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تاریخ انتشار</label>
              <input
                v-model="post.publishDate"
                type="datetime-local"
                class="input-field"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نویسنده</label>
              <div class="relative">
                <button
                  @click="showAuthorDropdown = !showAuthorDropdown"
                  class="btn-secondary w-full justify-between"
                >
                  <span>{{ selectedAuthor.name }}</span>
                  <i class="ti ti-chevron-down text-sm"></i>
                </button>
                <ul v-if="showAuthorDropdown" class="dropdown-menu">
                  <li v-for="author in authors" :key="author.id">
                    <button @click="selectAuthor(author)" class="dropdown-item">
                      {{ author.name }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">دسته‌بندی</h3>
          
          <div class="relative">
            <button
              @click="showCategoriesDropdown = !showCategoriesDropdown"
              class="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            >
              <span class="text-gray-700">
                {{ getSelectedCategories().length > 0 ? 
                   `${getSelectedCategories().length} دسته انتخاب شده` : 
                   'انتخاب دسته‌بندی' }}
              </span>
              <i :class="showCategoriesDropdown ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" class="text-gray-400"></i>
            </button>
            
            <Transition name="dropdown">
              <ul v-if="showCategoriesDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <li v-for="category in categories.filter(cat => cat.status === 'active')" :key="category.id">
                  <label class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <input
                      v-model="post.categories"
                      :value="category.id"
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    >
                    <div v-if="category.image" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img :src="category.image" :alt="category.name" class="w-full h-full object-cover">
                    </div>
                    <div v-else class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: category.color + '20' }">
                      <i :class="category.icon" :style="{ color: category.color }" class="text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-gray-900 truncate">{{ category.name }}</div>
                      <div class="text-sm text-gray-500 truncate">{{ category.description }}</div>
                    </div>
                  </label>
                </li>
              </ul>
            </Transition>
          </div>
          
          <button @click="navigateToCategories" class="text-orange-600 hover:text-orange-700 text-sm font-medium mt-3">
            + مدیریت دسته‌بندی‌ها
          </button>
        </div>

        <!-- Tags -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">برچسب‌ها</h3>
          
          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
              >
                {{ tag }}
                <button @click="removeTag(tag)" class="hover:text-orange-900">
                  <i class="ti ti-x text-xs"></i>
                </button>
              </span>
            </div>
            
            <div class="flex gap-2">
              <input
                v-model="newTag"
                @keyup.enter="addTag"
                type="text"
                placeholder="برچسب جدید..."
                class="input-field flex-1"
              >
              <button @click="addTag" class="btn-secondary">
                <i class="ti ti-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Preview Modal -->
  <Transition name="modal">
    <div v-if="showPreviewModal" @click="showPreviewModal = false" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <i class="ti ti-eye text-orange-600 text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">پیش‌نمایش پست</h3>
              <p class="text-sm text-gray-600">نمایش پست در حالت انتشار</p>
            </div>
          </div>
          <button @click="showPreviewModal = false" class="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
            <i class="ti ti-x text-xl text-gray-600"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div class="p-8">
            <!-- Preview Title -->
            <h1 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {{ post.title || 'عنوان پست' }}
            </h1>
            
            <!-- Preview Meta -->
            <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <div class="flex items-center gap-2">
                <i class="ti ti-user text-orange-600"></i>
                <span>{{ selectedAuthor.name || 'نویسنده' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="ti ti-calendar text-orange-600"></i>
                <span>{{ new Date().toLocaleDateString('fa-IR') }}</span>
              </div>
              <div v-if="getSelectedCategories().length > 0" class="flex items-center gap-2">
                <i class="ti ti-category text-orange-600"></i>
                <span>{{ getSelectedCategories().map(cat => cat.name).join('، ') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="ti ti-clock text-orange-600"></i>
                <span>{{ Math.ceil((post.content?.length || 0) / 200) }} دقیقه مطالعه</span>
              </div>
            </div>
            
            <!-- Featured Image -->
            <div v-if="post.featuredImage" class="mb-8">
              <img :src="post.featuredImage" alt="تصویر شاخص" class="w-full h-64 object-cover rounded-xl">
            </div>
            
            <!-- Preview Excerpt -->
            <div v-if="post.excerpt" class="bg-orange-50 border-r-4 border-orange-400 p-6 mb-8 rounded-lg">
              <p class="text-gray-700 text-lg italic leading-relaxed">{{ post.excerpt }}</p>
            </div>
            
            <!-- Preview Content -->
            <div class="prose prose-xl max-w-none">
              <div v-if="post.content" class="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
                {{ post.content }}
              </div>
              <div v-else class="text-gray-400 italic text-center py-16 text-lg">
                محتوای پست در اینجا نمایش داده می‌شود...
              </div>
            </div>
            
            <!-- Preview Tags -->
            <div v-if="post.tags && post.tags.length > 0" class="mt-12 pt-8 border-t border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">برچسب‌ها:</h4>
              <div class="flex flex-wrap gap-3">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag"
                  class="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Actions in Modal -->
            <div class="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
              <div class="flex gap-3">
                <button @click="saveDraft" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  <i class="ti ti-device-floppy ml-2"></i>
                  ذخیره پیش‌نویس
                </button>
                <button @click="publishPost" class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  <i class="ti ti-send ml-2"></i>
                  انتشار پست
                </button>
              </div>
              <button @click="showPreviewModal = false" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                بازگشت به ویرایش
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showStatusDropdown = ref(false)
const showAuthorDropdown = ref(false)
const showCategoriesDropdown = ref(false)
const showPreview = ref(false)
const showPreviewModal = ref(false)
const newTag = ref('')

const post = ref({
  title: '',
  excerpt: '',
  content: '',
  author: 'مدیر سایت',
  category: 'سلامت حیوانات',
  metaTitle: '',
  metaDescription: '',
  slug: '',
  featuredImage: null,
  publishDate: new Date().toISOString().slice(0, 16),
  categories: [],
  tags: []
})

const selectedStatus = ref({ value: 'draft', label: 'پیش‌نویس' })
const selectedAuthor = ref({ id: 1, name: 'مدیر سایت' })

const statusOptions = ref([
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'published', label: 'منتشر شده' },
  { value: 'pending', label: 'در انتظار تایید' }
])

const authors = ref([
  { id: 1, name: 'مدیر سایت' },
  { id: 2, name: 'نویسنده ۱' },
  { id: 3, name: 'نویسنده ۲' }
])

const categories = ref([
  { 
    id: 1, 
    name: 'سلامت و تندرستی', 
    slug: 'health-wellness', 
    description: 'مطالب مرتبط با سلامت حیوانات خانگی',
    icon: 'ti ti-heart', 
    color: '#10B981', 
    status: 'active',
    image: 'https://via.placeholder.com/400x300/10B981/ffffff?text=سلامت',
    cover: 'https://via.placeholder.com/800x200/10B981/ffffff?text=سلامت+و+تندرستی'
  },
  { 
    id: 2, 
    name: 'آموزش و تربیت', 
    slug: 'training-education', 
    description: 'آموزش های مربوط به تربیت حیوانات',
    icon: 'ti ti-book', 
    color: '#3B82F6', 
    status: 'active',
    image: 'https://via.placeholder.com/400x300/3B82F6/ffffff?text=آموزش',
    cover: 'https://via.placeholder.com/800x200/3B82F6/ffffff?text=آموزش+و+تربیت'
  },
  { 
    id: 3, 
    name: 'تغذیه مناسب', 
    slug: 'proper-nutrition', 
    description: 'راهنمای تغذیه صحیح حیوانات خانگی',
    icon: 'ti ti-apple', 
    color: '#F59E0B', 
    status: 'active',
    image: 'https://via.placeholder.com/400x300/F59E0B/ffffff?text=تغذیه',
    cover: 'https://via.placeholder.com/800x200/F59E0B/ffffff?text=تغذیه+مناسب'
  },
  { 
    id: 4, 
    name: 'بازی و سرگرمی', 
    slug: 'games-entertainment', 
    description: 'بازی ها و فعالیت های تفریحی',
    icon: 'ti ti-device-gamepad-2', 
    color: '#8B5CF6', 
    status: 'active',
    image: 'https://via.placeholder.com/400x300/8B5CF6/ffffff?text=بازی',
    cover: 'https://via.placeholder.com/800x200/8B5CF6/ffffff?text=بازی+و+سرگرمی'
  },
  { 
    id: 5, 
    name: 'مراقبت پزشکی', 
    slug: 'medical-care', 
    description: 'مراقبت های پزشکی و درمانی',
    icon: 'ti ti-medical-cross', 
    color: '#EF4444', 
    status: 'inactive',
    image: 'https://via.placeholder.com/400x300/EF4444/ffffff?text=پزشکی',
    cover: 'https://via.placeholder.com/800x200/EF4444/ffffff?text=مراقبت+پزشکی'
  },
  { 
    id: 6, 
    name: 'رفتار شناسی', 
    slug: 'animal-behavior', 
    description: 'بررسی رفتارهای حیوانات خانگی',
    icon: 'ti ti-brain', 
    color: '#06B6D4', 
    status: 'active',
    image: 'https://via.placeholder.com/400x300/06B6D4/ffffff?text=رفتار',
    cover: 'https://via.placeholder.com/800x200/06B6D4/ffffff?text=رفتار+شناسی'
  }
])

const selectStatus = (status) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const selectAuthor = (author) => {
  selectedAuthor.value = author
  showAuthorDropdown.value = false
}

const addTag = () => {
  if (newTag.value.trim() && !post.value.tags.includes(newTag.value.trim())) {
    post.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tagToRemove) => {
  post.value.tags = post.value.tags.filter(tag => tag !== tagToRemove)
}

const uploadFeaturedImage = () => {
  // Simulate image upload
  post.value.featuredImage = 'https://via.placeholder.com/400x300'
  console.log('Image uploaded')
}

const saveDraft = () => {
  // Save post as draft
  const draftData = {
    ...post.value,
    status: 'draft',
    author: selectedAuthor.value.name,
    updatedAt: new Date().toISOString()
  }
  
  console.log('Saving draft:', draftData)
  
  // Simulate saving to backend
  alert('پیش‌نویس با موفقیت ذخیره شد!')
}

const publishPost = () => {
  // Validate required fields
  if (!post.value.title.trim()) {
    alert('لطفا عنوان پست را وارد کنید!')
    return
  }
  
  if (!post.value.content.trim()) {
    alert('لطفا محتوای پست را وارد کنید!')
    return
  }
  
  // Publish post
  const publishData = {
    ...post.value,
    status: 'published',
    author: selectedAuthor.value.name,
    publishedAt: new Date().toISOString()
  }
  
  console.log('Publishing post:', publishData)
  
  // Simulate publishing to backend
  alert('پست با موفقیت منتشر شد!')
}

const navigateToCategories = () => {
  // Emit navigation event to parent layout
  // This will be handled by the parent layout to navigate
  window.dispatchEvent(new CustomEvent('navigate-to-categories'))
}

const getSelectedCategories = () => {
  if (!post.value.categories || post.value.categories.length === 0) return []
  return categories.value.filter(cat => post.value.categories.includes(cat.id))
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showStatusDropdown.value = false
      showAuthorDropdown.value = false
      showCategoriesDropdown.value = false
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

.editor-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.editor-btn:hover {
  background-color: #f3f4f6;
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>