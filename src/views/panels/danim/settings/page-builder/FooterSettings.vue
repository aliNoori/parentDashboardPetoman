<template>
  <div class="space-y-6">
    <!-- About Section -->
    <div class="space-y-4">
      <h4 class="font-bold text-gray-900">بخش درباره</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">تیتر</label>
          <input v-model="section.data.aboutTitle" type="text" class="input-field" placeholder="درباره دانیم">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">لوگوی فوتر</label>
          <div class="flex items-center gap-2">
            <!-- Preview -->
            <div v-if="section.data.footerLogo" class="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0">
              <img :src="section.data.footerLogo" alt="لوگوی فوتر" class="w-full h-full object-contain" />
            </div>
            <div v-else class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-photo text-3xl text-gray-400"></i>
            </div>
            <input
              type="file"
              accept="image/*"
              @change="(e) => $emit('upload', e, section.data, 'footerLogo')"
              class="hidden"
              :id="'footer-logo-' + section.id"
            />
            <label
              :for="'footer-logo-' + section.id"
              class="inline-flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm"
            >
              <i class="ti ti-upload"></i>
              آپلود
            </label>
            <button
              v-if="section.data.footerLogo"
              @click="section.data.footerLogo = ''"
              class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              حذف
            </button>
          </div>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium mb-2">توضیحات</label>
          <textarea v-model="section.data.aboutText" rows="3" class="input-field" placeholder="درباره سایت..."></textarea>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="space-y-4 pt-4 border-t">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-gray-900">لینک‌های سریع</h4>
        <button @click="addQuickLink" class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
          <i class="ti ti-plus mr-1"></i>
          افزودن لینک
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">تیتر ستون اول</label>
          <input v-model="section.data.column1Title" type="text" class="input-field" placeholder="لینک‌های مفید">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">تیتر ستون دوم</label>
          <input v-model="section.data.column2Title" type="text" class="input-field" placeholder="خدمات">
        </div>
      </div>

      <div v-if="section.data.quickLinks && section.data.quickLinks.length > 0" class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div v-for="(link, linkIndex) in section.data.quickLinks.slice(0, Math.ceil(section.data.quickLinks.length / 2))" :key="linkIndex" class="flex items-center gap-2">
            <input v-model="link.label" type="text" class="input-field flex-1 text-sm" placeholder="عنوان">
            <input v-model="link.link" type="text" class="input-field w-24 text-sm" placeholder="/...">
            <button @click="removeQuickLink(linkIndex)" class="text-red-600 hover:text-red-700">
              <i class="ti ti-trash text-sm"></i>
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="(link, linkIndex) in section.data.quickLinks.slice(Math.ceil(section.data.quickLinks.length / 2))" :key="linkIndex + 100" class="flex items-center gap-2">
            <input v-model="link.label" type="text" class="input-field flex-1 text-sm" placeholder="عنوان">
            <input v-model="link.link" type="text" class="input-field w-24 text-sm" placeholder="/...">
            <button @click="removeQuickLink(Math.ceil(section.data.quickLinks.length / 2) + linkIndex)" class="text-red-600 hover:text-red-700">
              <i class="ti ti-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-4 pt-4 border-t">
      <h4 class="font-bold text-gray-900">اطلاعات تماس</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">آدرس</label>
          <textarea v-model="section.data.address" rows="2" class="input-field" placeholder="تهران، خیابان..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">تلفن</label>
          <input v-model="section.data.phone" type="tel" class="input-field" placeholder="۰۲۱-۱۲۳۴۵۶۷۸">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">ایمیل</label>
          <input v-model="section.data.email" type="email" class="input-field" placeholder="info@danim.com">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">ساعات کاری</label>
          <input v-model="section.data.workingHours" type="text" class="input-field" placeholder="شنبه تا پنجشنبه ۹-۱۸">
        </div>
      </div>
    </div>

    <!-- Social Media -->
    <div class="space-y-4 pt-4 border-t">
      <h4 class="font-bold text-gray-900">شبکه‌های اجتماعی</h4>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <i class="ti ti-brand-instagram text-pink-500 text-xl"></i>
          <input v-model="section.data.instagram" type="url" class="input-field flex-1" placeholder="https://instagram.com/...">
        </div>
        <div class="flex items-center gap-2">
          <i class="ti ti-brand-telegram text-blue-500 text-xl"></i>
          <input v-model="section.data.telegram" type="url" class="input-field flex-1" placeholder="https://t.me/...">
        </div>
        <div class="flex items-center gap-2">
          <i class="ti ti-brand-twitter text-sky-500 text-xl"></i>
          <input v-model="section.data.twitter" type="url" class="input-field flex-1" placeholder="https://twitter.com/...">
        </div>
        <div class="flex items-center gap-2">
          <i class="ti ti-brand-linkedin text-blue-700 text-xl"></i>
          <input v-model="section.data.linkedin" type="url" class="input-field flex-1" placeholder="https://linkedin.com/...">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

defineEmits(['upload'])

const addQuickLink = () => {
  if (!props.section.data.quickLinks) {
    props.section.data.quickLinks = []
  }
  props.section.data.quickLinks.push({
    label: '',
    link: ''
  })
}

const removeQuickLink = (index) => {
  if (confirm('آیا از حذف این لینک اطمینان دارید؟')) {
    props.section.data.quickLinks.splice(index, 1)
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
