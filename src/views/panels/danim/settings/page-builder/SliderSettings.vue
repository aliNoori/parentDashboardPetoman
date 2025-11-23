<template>
  <div class="space-y-4">
    <!-- Slider Items -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-gray-900">اسلایدهای موجود</h4>
        <button @click="addSlide" class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
          <i class="ti ti-plus mr-1"></i>
          افزودن اسلاید
        </button>
      </div>

      <div v-if="section.data.slides && section.data.slides.length > 0" class="space-y-3">
        <div v-for="(slide, slideIndex) in section.data.slides" :key="slideIndex" class="border border-gray-200 rounded-lg p-4 bg-white">
          <div class="flex gap-4">
            <!-- Preview -->
            <div class="w-24 h-16 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
              <img v-if="slide.image" :src="slide.image" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="ti ti-photo text-xl"></i>
              </div>
            </div>

            <!-- Slide Settings -->
            <div class="flex-1 space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium mb-1">عنوان</label>
                  <input v-model="slide.title" type="text" class="input-field text-sm" placeholder="عنوان...">
                </div>
                <div>
                  <label class="block text-xs font-medium mb-1">زیرعنوان</label>
                  <input v-model="slide.subtitle" type="text" class="input-field text-sm" placeholder="زیرعنوان...">
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium mb-1">آدرس تصویر</label>
                <div class="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    @change="(e) => $emit('upload', e, slide, 'image')"
                    class="hidden"
                    :id="'slide-img-' + section.id + '-' + slideIndex"
                  />
                  <label
                    :for="'slide-img-' + section.id + '-' + slideIndex"
                    class="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-xs"
                  >
                    <i class="ti ti-upload text-sm"></i>
                    آپلود
                  </label>
                  <input v-model="slide.image" type="text" class="input-field text-sm flex-1" placeholder="یا وارد کنید https://...">
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium mb-1">نوع لینک</label>
                  <select v-model="slide.linkType" class="input-field text-sm">
                    <option value="none">بدون لینک</option>
                    <option value="post">پست</option>
                    <option value="page">صفحه</option>
                    <option value="category">دسته‌بندی</option>
                    <option value="external">خارجی</option>
                  </select>
                </div>
                <div v-if="slide.linkType !== 'none'">
                  <label class="block text-xs font-medium mb-1">لینک</label>
                  <input v-model="slide.link" type="text" class="input-field text-sm" placeholder="/...">
                </div>
                <div v-if="slide.linkType !== 'none'">
                  <label class="block text-xs font-medium mb-1">متن دکمه</label>
                  <input v-model="slide.buttonText" type="text" class="input-field text-sm" placeholder="ادامه...">
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t">
                <div class="flex gap-3">
                  <label class="flex items-center text-sm">
                    <input v-model="slide.active" type="checkbox" class="rounded ml-1" />
                    فعال
                  </label>
                  <label class="flex items-center text-sm">
                    <input v-model="slide.openInNewTab" type="checkbox" class="rounded ml-1" />
                    تب جدید
                  </label>
                </div>
                <button @click="removeSlide(slideIndex)" class="text-red-600 hover:text-red-700 text-sm">
                  <i class="ti ti-trash ml-1"></i>
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <i class="ti ti-slideshow text-3xl text-gray-400 mb-2"></i>
        <p class="text-sm text-gray-600">هیچ اسلایدی اضافه نشده</p>
      </div>
    </div>

    <!-- Global Slider Settings -->
    <div class="pt-4 border-t space-y-3">
      <h4 class="font-bold text-gray-900">تنظیمات کلی اسلایدر</h4>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">سرعت تغییر (ثانیه)</label>
          <input v-model.number="section.data.speed" type="number" min="1" max="10" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">ارتفاع (px)</label>
          <input v-model.number="section.data.height" type="number" min="200" max="800" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">حالت نمایش</label>
          <select v-model="section.data.transition" class="input-field">
            <option value="fade">محو شدن</option>
            <option value="slide">کشیدن</option>
            <option value="zoom">زوم</option>
          </select>
        </div>
      </div>
      <div class="flex gap-4">
        <label class="flex items-center text-sm">
          <input v-model="section.data.autoPlay" type="checkbox" class="rounded ml-2" />
          پخش خودکار
        </label>
        <label class="flex items-center text-sm">
          <input v-model="section.data.showDots" type="checkbox" class="rounded ml-2" />
          نمایش نقاط
        </label>
        <label class="flex items-center text-sm">
          <input v-model="section.data.showArrows" type="checkbox" class="rounded ml-2" />
          نمایش فلش‌ها
        </label>
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

const addSlide = () => {
  if (!props.section.data.slides) {
    props.section.data.slides = []
  }
  props.section.data.slides.push({
    title: '',
    subtitle: '',
    image: '',
    linkType: 'none',
    link: '',
    buttonText: '',
    active: true,
    openInNewTab: false
  })
}

const removeSlide = (index) => {
  if (confirm('آیا از حذف این اسلاید اطمینان دارید؟')) {
    props.section.data.slides.splice(index, 1)
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500;
}
</style>
