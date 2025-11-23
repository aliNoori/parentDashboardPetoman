<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-gray-900">افزودن بخش جدید</h3>
          <p class="text-sm text-gray-600 mt-1">یک بخش انتخاب کنید و به صفحه اضافه کنید</p>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="ti ti-x text-xl text-gray-600"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Slider -->
          <button
            @click="$emit('add', 'slider')"
            class="group flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-slideshow text-3xl text-white"></i>
            </div>
            <div class="text-center">
              <h4 class="font-bold text-gray-900">اسلایدر</h4>
              <p class="text-xs text-gray-600 mt-1">نمایش اسلایدهای تصویری</p>
            </div>
          </button>

          <!-- Banner -->
          <button
            @click="$emit('add', 'banner')"
            class="group flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-photo text-3xl text-white"></i>
            </div>
            <div class="text-center">
              <h4 class="font-bold text-gray-900">بنر تبلیغاتی</h4>
              <p class="text-xs text-gray-600 mt-1">بنر با طرح دلخواه</p>
            </div>
          </button>

          <!-- Posts -->
          <button
            @click="$emit('add', 'posts')"
            class="group flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-news text-3xl text-white"></i>
            </div>
            <div class="text-center">
              <h4 class="font-bold text-gray-900">آخرین مقالات</h4>
              <p class="text-xs text-gray-600 mt-1">نمایش مقالات منتشر شده</p>
            </div>
          </button>

          <!-- Categories -->
          <button
            @click="$emit('add', 'categories')"
            class="group flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-category text-3xl text-white"></i>
            </div>
            <div class="text-center">
              <h4 class="font-bold text-gray-900">دسته‌بندی‌ها</h4>
              <p class="text-xs text-gray-600 mt-1">نمایش دسته‌بندی محتوا</p>
            </div>
          </button>

          <!-- Header -->
          <button
            @click="$emit('add', 'header')"
            class="group flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-layout-navbar text-3xl text-white"></i>
            </div>
            <div class="text-center">
              <h4 class="font-bold text-gray-900">هدر</h4>
              <p class="text-xs text-gray-600 mt-1">هدر و منوی سایت</p>
            </div>
          </button>

          <!-- Footer -->
          <button
            @click="$emit('add', 'footer')"
            class="group flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-gray-600 hover:shadow-lg transition-all"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-layout-bottombar text-3xl text-white"></i>
            </div>
            <div class="text-center">
              <h4 class="font-bold text-gray-900">فوتر</h4>
              <p class="text-xs text-gray-600 mt-1">فوتر و اطلاعات پایین</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'add'])
</script>
