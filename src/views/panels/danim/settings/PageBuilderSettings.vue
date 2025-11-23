<template>
  <div class="space-y-6">
    <!-- Header با دکمه افزودن بخش -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-gray-900">صفحه‌ساز</h2>
        <p class="text-sm text-gray-600 mt-1">طراحی و مدیریت بخش‌های مختلف صفحه اصلی</p>
      </div>
      <div class="flex items-center gap-3">
        <button
            @click="showAddSectionModal = true"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          <i class="ti ti-plus"></i>
          افزودن بخش جدید
        </button>

        <button
            @click="saveHomepage"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>

    <!-- لیست بخش‌ها (Draggable) -->
    <div class="space-y-3">
      <div
          v-for="(section, index) in pageSections"
          :key="section.id"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragend="onDragEnd"
          @dragover.prevent="(e) => onDragOver(e, index)"
          @drop="(e) => onDrop(e, index)"
          :class="[
          'group relative bg-gray-50 rounded-xl border-2 transition-all cursor-move',
          draggedIndex === index ? 'opacity-40 border-orange-500 scale-95' : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
        ]"
      >
        <div class="p-4">
          <div class="flex items-center gap-4">
            <!-- Drag Handle -->
            <div class="text-gray-400 group-hover:text-orange-500 transition-colors">
              <i class="ti ti-grip-vertical text-2xl"></i>
            </div>

            <!-- Section Icon & Info -->
            <div class="flex items-center gap-3 flex-1">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', getSectionColor(section.type)]">
                <i :class="[getSectionIcon(section.type), 'text-2xl text-white']"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-gray-900">{{ getSectionLabel(section.type) }}</h3>
                <p class="text-sm text-gray-600">{{ section.description || getSectionDescription(section.type) }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Visibility Toggle -->
              <button
                  @click="section.visible = !section.visible"
                  :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  section.visible 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                ]"
              >
                <i :class="section.visible ? 'ti ti-eye' : 'ti ti-eye-off'"></i>
              </button>

              <!-- Settings Toggle -->
              <button
                  @click="section.expanded = !section.expanded"
                  class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <i :class="section.expanded ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" class="text-gray-600"></i>
              </button>

              <!-- Delete -->
              <button
                  @click="removeSection(index)"
                  class="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
              >
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>

          <!-- کامپوننت‌های تنظیمات بخش -->
          <div v-if="section.expanded" class="mt-4 pt-4 border-t border-gray-200">
            <SliderSettings v-if="section.type === 'slider'" :section="section" @upload="uploadImage"/>
            <BannerSettings v-else-if="section.type === 'banner'" :section="section" @upload="uploadImage"/>
            <PostsSettings v-else-if="section.type === 'posts'" :section="section"/>
            <CategoriesSettings v-else-if="section.type === 'categories'" :section="section"
                                :categories="availableCategories"/>
            <HeaderSettings v-else-if="section.type === 'header'" :section="section" @upload="uploadImage"/>
            <FooterSettings v-else-if="section.type === 'footer'" :section="section" @upload="uploadImage"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal افزودن بخش -->
    <AddSectionModal
        v-if="showAddSectionModal"
        @close="showAddSectionModal = false"
        @add="addSection"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import SliderSettings from './page-builder/SliderSettings.vue'
import BannerSettings from './page-builder/BannerSettings.vue'
import PostsSettings from './page-builder/PostsSettings.vue'
import CategoriesSettings from './page-builder/CategoriesSettings.vue'
import HeaderSettings from './page-builder/HeaderSettings.vue'
import FooterSettings from './page-builder/FooterSettings.vue'
import AddSectionModal from './page-builder/AddSectionModal.vue'
import {useDanimSettingStore} from "@/stores/danim-setting.ts";

// State
const settingStore = useDanimSettingStore()
const showAddSectionModal = ref(false)
const draggedIndex = ref(null)
const pageSections = computed(() => settingStore.pageSections)

const availableCategories = ref([
  {id: 1, name: 'مراقبت از سگ', icon: 'ti ti-paw', count: 15},
  {id: 2, name: 'مراقبت از گربه', icon: 'ti ti-cat', count: 12},
  {id: 3, name: 'تغذیه', icon: 'ti ti-apple', count: 10},
  {id: 4, name: 'سلامت', icon: 'ti ti-heart', count: 8}
])

// Helper Functions
const getSectionLabel = (type) => {
  const labels = {
    slider: 'اسلایدر',
    banner: 'بنر تبلیغاتی',
    posts: 'آخرین مقالات',
    categories: 'دسته‌بندی‌ها',
    header: 'هدر',
    footer: 'فوتر'
  }
  return labels[type] || type
}

const getSectionIcon = (type) => {
  const icons = {
    slider: 'ti ti-slideshow',
    banner: 'ti ti-photo',
    posts: 'ti ti-news',
    categories: 'ti ti-category',
    header: 'ti ti-layout-navbar',
    footer: 'ti ti-layout-bottombar'
  }
  return icons[type] || 'ti ti-box'
}

const getSectionColor = (type) => {
  const colors = {
    slider: 'bg-gradient-to-br from-purple-500 to-purple-600',
    banner: 'bg-gradient-to-br from-orange-500 to-orange-600',
    posts: 'bg-gradient-to-br from-blue-500 to-blue-600',
    categories: 'bg-gradient-to-br from-green-500 to-green-600',
    header: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    footer: 'bg-gradient-to-br from-gray-600 to-gray-700'
  }
  return colors[type] || 'bg-gray-500'
}

const getSectionDescription = (type) => {
  const descriptions = {
    slider: 'نمایش اسلایدهای تصویری متحرک',
    banner: 'بنر تبلیغاتی با طرح دلخواه',
    posts: 'نمایش آخرین مقالات منتشر شده',
    categories: 'نمایش دسته‌بندی‌های محتوا',
    header: 'هدر و منوی بالای سایت',
    footer: 'فوتر و اطلاعات پایین سایت'
  }
  return descriptions[type] || ''
}

// Drag & Drop
const onDragStart = (index) => {
  draggedIndex.value = index
}

const onDragEnd = () => {
  draggedIndex.value = null
}

const onDragOver = (e, index) => {
  e.preventDefault()
}

const onDrop = (e, dropIndex) => {
  e.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return

  const sections = [...pageSections.value]
  const [draggedItem] = sections.splice(draggedIndex.value, 1)
  sections.splice(dropIndex, 0, draggedItem)

  pageSections.value = sections
  draggedIndex.value = null
}

// Section Management
const addSection = (type) => {
  const newSection = {
    id: Date.now(),
    type,
    visible: true,
    expanded: true,
    description: getSectionDescription(type),
    data: getDefaultSectionData(type)
  }
  pageSections.value.push(newSection)
  showAddSectionModal.value = false
}

const removeSection = (index) => {
  if (confirm('آیا از حذف این بخش اطمینان دارید؟')) {
    pageSections.value.splice(index, 1)
  }
}

const getDefaultSectionData = (type) => {
  const defaults = {
    slider: {
      slides: [],
      autoPlay: true,
      speed: 5,
      height: 400,
      showDots: true,
      showArrows: true,
      transition: 'fade'
    },
    banner: {
      bannerType: 'gradient',
      title: '',
      subtitle: '',
      description: '',
      gradientStart: '#FF6B35',
      gradientEnd: '#F97316',
      gradientDirection: 'to-r',
      primaryButton: null,
      primaryLink: '',
      secondaryButton: null,
      secondaryLink: '',
      image: '',
      link: '',
      openInNewTab: false
    },
    posts: {
      title: 'آخرین مقالات',
      categoryId: '',
      count: 6,
      layout: 'grid'
    },
    categories: {
      title: 'دسته‌بندی‌ها',
      selectedCategories: [],
      count: 6,
      layout: 'grid',
      showCount: true,
      showDescription: false
    },
    header: {
      logo: '',
      logoSize: 120,
      logoAlt: 'دانیم',
      logoLink: '/',
      menuItems: [],
      position: 'fixed',
      bgColor: '#ffffff',
      opacity: 100
    },
    footer: {
      aboutTitle: 'درباره دانیم',
      aboutText: '',
      footerLogo: '',
      quickLinks: [],
      column1Title: 'لینک‌های مفید',
      column2Title: 'خدمات',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      instagram: '',
      telegram: '',
      twitter: '',
      linkedin: ''
    }
  }
  return defaults[type] || {}
}

// Image Upload
const uploadImage = async (event, target, field) => {
  const file = event.target.files[0]
  if (!file) return

  // TODO: Implement actual upload to server
  // For now, create a local URL
  const reader = new FileReader()
  reader.onload = (e) => {
    target[field] = e.target.result
  }
  reader.readAsDataURL(file)
}


const saveHomepage = async () => {
  try {
    await settingStore.processPageSectionImages(pageSections.value)
    await settingStore.savePageSections(pageSections.value)
    alert('صفحه اصلی با موفقیت ذخیره شد');
  } catch (error) {
    console.error(error);
    alert('خطا در ذخیره داده‌ها');
  }
}

onMounted(async () => {
  await settingStore.fetchPageSections()

})

</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
