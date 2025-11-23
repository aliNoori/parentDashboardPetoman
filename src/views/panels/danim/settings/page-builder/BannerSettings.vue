<template>
  <div class="space-y-4">
    <!-- Banner Type Selection -->
    <div>
      <label class="block text-sm font-medium mb-2">نوع بنر</label>
      <div class="flex gap-4">
        <label class="flex items-center">
          <input v-model="section.data.bannerType" type="radio" value="gradient" class="ml-2" />
          گرادینت + متن
        </label>
        <label class="flex items-center">
          <input v-model="section.data.bannerType" type="radio" value="image" class="ml-2" />
          فقط تصویر
        </label>
      </div>
    </div>

    <!-- Gradient Type Settings -->
    <div v-if="section.data.bannerType === 'gradient'" class="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">عنوان اصلی</label>
          <input v-model="section.data.title" type="text" class="input-field" placeholder="پیشنهاد ویژه!">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">زیرعنوان</label>
          <input v-model="section.data.subtitle" type="text" class="input-field" placeholder="تخفیف ویژه برای شما">
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium mb-2">توضیحات</label>
          <textarea v-model="section.data.description" rows="2" class="input-field" placeholder="توضیحات کامل..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">رنگ شروع گرادینت</label>
          <div class="flex gap-2">
            <input v-model="section.data.gradientStart" type="color" class="w-16 h-10 rounded border cursor-pointer" />
            <input v-model="section.data.gradientStart" type="text" class="input-field flex-1" placeholder="#FF6B35">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">رنگ پایان گرادینت</label>
          <div class="flex gap-2">
            <input v-model="section.data.gradientEnd" type="color" class="w-16 h-10 rounded border cursor-pointer" />
            <input v-model="section.data.gradientEnd" type="text" class="input-field flex-1" placeholder="#F97316">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">جهت گرادینت</label>
          <select v-model="section.data.gradientDirection" class="input-field">
            <option value="to-r">چپ به راست</option>
            <option value="to-l">راست به چپ</option>
            <option value="to-b">بالا به پایین</option>
            <option value="to-t">پایین به بالا</option>
            <option value="to-br">قطری (چپ-بالا به راست-پایین)</option>
            <option value="to-tr">قطری (چپ-پایین به راست-بالا)</option>
          </select>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="pt-4 border-t">
        <div class="flex items-center justify-between mb-3">
          <h5 class="font-bold text-gray-900">دکمه‌های اقدام (CTA)</h5>
        </div>
        <div class="space-y-3">
          <!-- Primary Button -->
          <div v-if="section.data.primaryButton !== null" class="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg border">
            <div>
              <label class="block text-sm font-medium mb-2">متن دکمه اصلی</label>
              <input v-model="section.data.primaryButton" type="text" class="input-field" placeholder="مشاهده بیشتر">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">لینک دکمه اصلی</label>
              <div class="flex gap-2">
                <input v-model="section.data.primaryLink" type="text" class="input-field flex-1" placeholder="/special">
                <button @click="section.data.primaryButton = null; section.data.primaryLink = ''" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Secondary Button -->
          <div v-if="section.data.secondaryButton !== null" class="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg border">
            <div>
              <label class="block text-sm font-medium mb-2">متن دکمه ثانویه</label>
              <input v-model="section.data.secondaryButton" type="text" class="input-field" placeholder="اطلاعات بیشتر">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">لینک دکمه ثانویه</label>
              <div class="flex gap-2">
                <input v-model="section.data.secondaryLink" type="text" class="input-field flex-1" placeholder="/info">
                <button @click="section.data.secondaryButton = null; section.data.secondaryLink = ''" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Add Button Actions -->
          <div class="flex gap-2">
            <button v-if="section.data.primaryButton === null" @click="section.data.primaryButton = ''; section.data.primaryLink = ''" class="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors">
              <i class="ti ti-plus ml-2"></i>
              افزودن دکمه اصلی
            </button>
            <button v-if="section.data.secondaryButton === null" @click="section.data.secondaryButton = ''; section.data.secondaryLink = ''" class="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
              <i class="ti ti-plus ml-2"></i>
              افزودن دکمه ثانویه
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Type Settings -->
    <div v-if="section.data.bannerType === 'image'" class="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label class="block text-sm font-medium mb-2">تصویر بنر تبلیغاتی</label>
        <div class="space-y-3">
          <!-- Image Preview -->
          <div v-if="section.data.image" class="relative rounded-lg border-2 border-gray-200 overflow-hidden">
            <img :src="section.data.image" alt="بنر" class="w-full h-48 object-cover" />
            <div class="absolute top-2 right-2 flex gap-2">
              <button
                @click="section.data.image = ''"
                class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm shadow-lg"
              >
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
          <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <i class="ti ti-photo text-6xl text-gray-400 mb-4"></i>
            <p class="text-gray-600 mb-4">هیچ تصویری انتخاب نشده</p>
          </div>

          <!-- Upload Button -->
          <div class="flex gap-2">
            <input
              type="file"
              accept="image/*"
              @change="(e) => $emit('upload', e, section.data, 'image')"
              class="hidden"
              :id="'banner-img-' + section.id"
            />
            <label
              :for="'banner-img-' + section.id"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
            >
              <i class="ti ti-upload text-xl"></i>
              انتخاب و آپلود تصویر بنر
            </label>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">لینک بنر</label>
        <input v-model="section.data.link" type="text" class="input-field" placeholder="/promotion">
      </div>

      <label class="flex items-center text-sm">
        <input v-model="section.data.openInNewTab" type="checkbox" class="rounded ml-2" />
        باز شدن در تب جدید
      </label>
    </div>

    <!-- Preview -->
    <div class="pt-4 border-t">
      <label class="block text-sm font-medium mb-2">پیش‌نمایش بنر</label>
      <div class="rounded-lg overflow-hidden border-2 border-gray-200">
        <!-- Gradient Preview -->
        <div
          v-if="section.data.bannerType === 'gradient'"
          :data-section-id="section.id"
          class="banner-gradient-preview p-8 text-white min-h-[200px] flex flex-col justify-center"
          :style="getBannerGradientStyle(section.data)"
        >
          <h3 class="text-3xl font-bold mb-2">{{ section.data.title || 'عنوان بنر' }}</h3>
          <p class="text-xl mb-2">{{ section.data.subtitle || 'زیرعنوان' }}</p>
          <p class="text-sm opacity-90 mb-4">{{ section.data.description || 'توضیحات بنر...' }}</p>
          <div class="flex gap-3">
            <button v-if="section.data.primaryButton" class="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100">
              {{ section.data.primaryButton }}
            </button>
            <button v-if="section.data.secondaryButton" class="px-6 py-2 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10">
              {{ section.data.secondaryButton }}
            </button>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-else-if="section.data.bannerType === 'image' && section.data.image" class="relative">
          <img :src="section.data.image" alt="بنر" class="w-full h-auto" />
        </div>

        <div v-else class="p-8 bg-gray-100 text-center text-gray-500">
          پیش‌نمایش بنر در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  section: {
    type: Object,
    required: true
  }
})

defineEmits(['upload'])

// تبدیل جهت Tailwind به CSS
const getBannerGradientStyle = (data) => {
  const directionMap = {
    'to-r': 'to right',
    'to-l': 'to left',
    'to-b': 'to bottom',
    'to-t': 'to top',
    'to-br': 'to bottom right',
    'to-tr': 'to top right',
    'to-bl': 'to bottom left',
    'to-tl': 'to top left'
  }
  
  const cssDirection = directionMap[data.gradientDirection] || 'to right'
  const startColor = data.gradientStart || '#FF6B35'
  const endColor = data.gradientEnd || '#F97316'
  
  return {
    background: `linear-gradient(${cssDirection}, ${startColor}, ${endColor}) !important`
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
