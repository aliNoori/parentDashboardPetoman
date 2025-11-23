<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تنظیمات سایت</h1>
        <p class="text-gray-600 mt-1">تنظیمات کامل سایت، سئو و اوپن گراف</p>
      </div>
      <div class="flex gap-3">
        <button @click="resetSettings" class="btn-secondary">
          <i class="ti ti-restore ml-2"></i>
          بازنشانی
        </button>
        <button @click="saveSettings" class="btn-primary">
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره تغییرات
        </button>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="flex overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2',
            activeTab === tab.id
              ? 'bg-orange-50 text-orange-600 border-orange-600'
              : 'text-gray-600 hover:bg-gray-50 border-transparent'
          ]"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="space-y-6">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات عمومی</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نام سایت</label>
              <input
                v-model="settings.general.siteName"
                type="text"
                placeholder="نام سایت..."
                class="input-field"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">شعار سایت</label>
              <input
                v-model="settings.general.tagline"
                type="text"
                placeholder="شعار کوتاه..."
                class="input-field"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل مدیریت</label>
              <input
                v-model="settings.general.adminEmail"
                type="email"
                placeholder="admin@example.com"
                class="input-field"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">زبان سایت</label>
              <select v-model="settings.general.language" class="input-field">
                <option value="fa">فارسی</option>
                <option value="en">انگلیسی</option>
                <option value="ar">عربی</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات سایت</label>
            <textarea
              v-model="settings.general.description"
              rows="4"
              placeholder="توضیحات کوتاه درباره سایت..."
              class="input-field resize-none"
            ></textarea>
          </div>
          
          <div class="mt-6 space-y-4">
            <h3 class="text-md font-semibold text-gray-900">تنظیمات نمایش</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="settings.general.showComments"
                  type="checkbox"
                  class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">نمایش کامنت‌ها</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="settings.general.showSearch"
                  type="checkbox"
                  class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">نمایش جستجو</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="settings.general.showSidebar"
                  type="checkbox"
                  class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">نمایش نوار کناری</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="settings.general.showSocialMedia"
                  type="checkbox"
                  class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                >
                <span class="text-gray-700">نمایش شبکه‌های اجتماعی</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Homepage Settings -->
      <div v-if="activeTab === 'homepage'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-bold text-gray-900">چیدمان صفحه اصلی</h2>
              <p class="text-sm text-gray-600 mt-1">بخش‌های صفحه را با drag & drop مرتب کنید</p>
            </div>
            <button @click="showAddSectionModal = true" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all">
              <i class="ti ti-plus"></i>
              افزودن بخش جدید
            </button>
          </div>

          <!-- Page Sections (Draggable) -->
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

                <!-- Section Settings (Expandable) -->
                <div v-if="section.expanded" class="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <!-- Slider Section -->
                  <div v-if="section.type === 'slider'" class="space-y-6">
                    <!-- Slider Items -->
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <h4 class="font-bold text-gray-900">اسلایدهای موجود</h4>
                        <button @click="addSlideToSection(section)" class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
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
                                    @change="uploadImage($event, slide, 'image')"
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
                                <button @click="removeSlideFromSection(section, slideIndex)" class="text-red-600 hover:text-red-700 text-sm">
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

                  <!-- Banner Section -->
                  <div v-if="section.type === 'banner'" class="space-y-4">
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
                              @change="uploadImage($event, section.data, 'image')"
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
                          :style="`background: linear-gradient(${section.data.gradientDirection || 'to-r'}, ${section.data.gradientStart || '#FF6B35'}, ${section.data.gradientEnd || '#F97316'}) !important`"
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

                  <!-- Posts Section -->
                  <div v-if="section.type === 'posts'">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium mb-2">تیتر بخش</label>
                        <input v-model="section.data.title" type="text" class="input-field" placeholder="آخرین مقالات">
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">دسته‌بندی</label>
                        <select v-model="section.data.categoryId" class="input-field">
                          <option value="">همه</option>
                          <option value="1">مراقبت از سگ</option>
                          <option value="2">مراقبت از گربه</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">تعداد پست</label>
                        <input v-model.number="section.data.count" type="number" class="input-field" placeholder="6">
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">نمایش</label>
                        <select v-model="section.data.layout" class="input-field">
                          <option value="grid">شبکه‌ای</option>
                          <option value="list">لیستی</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Categories Section -->
                  <div v-if="section.type === 'categories'">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="col-span-2">
                        <label class="block text-sm font-medium mb-2">تیتر بخش</label>
                        <input v-model="section.data.title" type="text" class="input-field" placeholder="دسته‌بندی‌ها">
                      </div>
                      
                      <!-- Category Selection -->
                      <div class="col-span-2">
                        <label class="block text-sm font-medium mb-2">انتخاب دسته‌بندی‌ها</label>
                        <div class="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                          <label class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              :checked="section.data.selectedCategories.length === 0"
                              @change="section.data.selectedCategories = []"
                              class="rounded ml-2"
                            />
                            <span class="font-medium">همه دسته‌بندی‌ها</span>
                          </label>
                          <div class="border-t pt-2 space-y-1">
                            <label
                              v-for="category in availableCategories"
                              :key="category.id"
                              class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                :value="category.id"
                                v-model="section.data.selectedCategories"
                                class="rounded ml-2"
                              />
                              <i :class="category.icon" class="text-lg ml-2"></i>
                              <span>{{ category.name }}</span>
                              <span class="mr-auto text-sm text-gray-500">({{ category.count }} مقاله)</span>
                            </label>
                          </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-2">
                          {{ section.data.selectedCategories.length > 0 
                            ? `${section.data.selectedCategories.length} دسته‌بندی انتخاب شده` 
                            : 'همه دسته‌بندی‌ها نمایش داده می‌شوند' }}
                        </p>
                      </div>

                      <div>
                        <label class="block text-sm font-medium mb-2">حداکثر تعداد نمایش</label>
                        <input v-model.number="section.data.count" type="number" min="1" max="20" class="input-field" placeholder="6">
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium mb-2">نمایش</label>
                        <select v-model="section.data.layout" class="input-field">
                          <option value="grid">شبکه‌ای</option>
                          <option value="slider">اسلایدر</option>
                          <option value="list">لیستی</option>
                        </select>
                      </div>

                      <div class="col-span-2">
                        <label class="flex items-center text-sm">
                          <input v-model="section.data.showCount" type="checkbox" class="rounded ml-2" />
                          نمایش تعداد مقالات هر دسته
                        </label>
                      </div>

                      <div class="col-span-2">
                        <label class="flex items-center text-sm">
                          <input v-model="section.data.showDescription" type="checkbox" class="rounded ml-2" />
                          نمایش توضیحات دسته‌بندی
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Header Section -->
                  <div v-if="section.type === 'header'" class="space-y-6">
                    <!-- Logo Settings -->
                    <div class="space-y-4">
                      <h4 class="font-bold text-gray-900">لوگو</h4>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                          <label class="block text-sm font-medium mb-2">آپلود لوگو</label>
                          <div class="flex items-center gap-4">
                            <!-- Preview -->
                            <div v-if="section.data.logo" class="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0">
                              <img :src="section.data.logo" alt="لوگو" class="w-full h-full object-contain" />
                            </div>
                            <div v-else class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                              <i class="ti ti-photo text-3xl text-gray-400"></i>
                            </div>
                            <!-- Upload Button -->
                            <div class="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                @change="uploadImage($event, section.data, 'logo')"
                                class="hidden"
                                :id="'logo-upload-' + section.id"
                              />
                              <label
                                :for="'logo-upload-' + section.id"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
                              >
                                <i class="ti ti-upload"></i>
                                انتخاب فایل
                              </label>
                              <button
                                v-if="section.data.logo"
                                @click="section.data.logo = ''"
                                class="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              >
                                <i class="ti ti-trash ml-1"></i>
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label class="block text-sm font-medium mb-2">اندازه لوگو (px)</label>
                          <input v-model.number="section.data.logoSize" type="number" class="input-field" placeholder="120">
                        </div>
                        <div>
                          <label class="block text-sm font-medium mb-2">متن جایگزین</label>
                          <input v-model="section.data.logoAlt" type="text" class="input-field" placeholder="دانیم">
                        </div>
                        <div class="col-span-2">
                          <label class="block text-sm font-medium mb-2">لینک لوگو</label>
                          <input v-model="section.data.logoLink" type="text" class="input-field" placeholder="/">
                        </div>
                      </div>
                    </div>

                    <!-- Menu Items -->
                    <div class="space-y-4 pt-4 border-t">
                      <div class="flex items-center justify-between">
                        <h4 class="font-bold text-gray-900">منوی ناوبری</h4>
                        <button @click="addMenuItemToHeader(section)" class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
                          <i class="ti ti-plus mr-1"></i>
                          افزودن آیتم
                        </button>
                      </div>

                      <div v-if="section.data.menuItems && section.data.menuItems.length > 0" class="space-y-2">
                        <div v-for="(item, itemIndex) in section.data.menuItems" :key="itemIndex" class="flex items-center gap-2 p-3 border rounded-lg bg-white">
                          <i class="ti ti-grip-vertical text-gray-400"></i>
                          <input v-model="item.label" type="text" class="input-field flex-1 text-sm" placeholder="عنوان">
                          <input v-model="item.link" type="text" class="input-field w-32 text-sm" placeholder="/link">
                          <button @click="removeMenuItemFromHeader(section, itemIndex)" class="text-red-600 hover:text-red-700">
                            <i class="ti ti-trash"></i>
                          </button>
                        </div>
                      </div>

                      <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <p class="text-sm text-gray-600">هیچ آیتم منویی اضافه نشده</p>
                      </div>
                    </div>

                    <!-- Header Style -->
                    <div class="space-y-4 pt-4 border-t">
                      <h4 class="font-bold text-gray-900">استایل هدر</h4>
                      <div class="grid grid-cols-3 gap-4">
                        <div>
                          <label class="block text-sm font-medium mb-2">حالت</label>
                          <select v-model="section.data.position" class="input-field">
                            <option value="fixed">ثابت</option>
                            <option value="sticky">چسبان</option>
                            <option value="static">استاتیک</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium mb-2">رنگ پس‌زمینه</label>
                          <input v-model="section.data.bgColor" type="color" class="w-full h-10 rounded border">
                        </div>
                        <div>
                          <label class="block text-sm font-medium mb-2">شفافیت (%)</label>
                          <input v-model.number="section.data.opacity" type="number" min="0" max="100" class="input-field">
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer Section -->
                  <div v-if="section.type === 'footer'" class="space-y-6">
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
                            <input
                              type="file"
                              accept="image/*"
                              @change="uploadImage($event, section.data, 'footerLogo')"
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
                        <button @click="addQuickLinkToFooter(section)" class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
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
                            <button @click="removeQuickLinkFromFooter(section, linkIndex)" class="text-red-600 hover:text-red-700">
                              <i class="ti ti-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                        <div class="space-y-2">
                          <div v-for="(link, linkIndex) in section.data.quickLinks.slice(Math.ceil(section.data.quickLinks.length / 2))" :key="linkIndex + 100" class="flex items-center gap-2">
                            <input v-model="link.label" type="text" class="input-field flex-1 text-sm" placeholder="عنوان">
                            <input v-model="link.link" type="text" class="input-field w-24 text-sm" placeholder="/...">
                            <button @click="removeQuickLinkFromFooter(section, Math.ceil(section.data.quickLinks.length / 2) + linkIndex)" class="text-red-600 hover:text-red-700">
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
                          <i class="ti ti-brand-whatsapp text-green-500 text-xl"></i>
                          <input v-model="section.data.whatsapp" type="url" class="input-field flex-1" placeholder="https://wa.me/...">
                        </div>
                        <div class="flex items-center gap-2">
                          <i class="ti ti-brand-youtube text-red-500 text-xl"></i>
                          <input v-model="section.data.youtube" type="url" class="input-field flex-1" placeholder="https://youtube.com/...">
                        </div>
                      </div>
                    </div>

                    <!-- Footer Bottom -->
                    <div class="space-y-4 pt-4 border-t">
                      <h4 class="font-bold text-gray-900">قسمت پایین فوتر</h4>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium mb-2">متن کپی‌رایت</label>
                          <input v-model="section.data.copyright" type="text" class="input-field" placeholder="© ۲۰۲۴ دانیم...">
                        </div>
                        <div>
                          <label class="block text-sm font-medium mb-2">رنگ پس‌زمینه</label>
                          <input v-model="section.data.bgColor" type="color" class="w-full h-10 rounded border">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="pageSections.length === 0" class="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
              <i class="ti ti-layout text-6xl text-gray-300 mb-4"></i>
              <h3 class="text-lg font-bold text-gray-900 mb-2">هیچ بخشی اضافه نشده</h3>
              <p class="text-gray-600 mb-6">برای شروع، اولین بخش را اضافه کنید</p>
              <button @click="showAddSectionModal = true" class="btn-primary">
                <i class="ti ti-plus mr-2"></i>
                افزودن بخش
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO Settings -->
      <div v-else-if="activeTab === 'seo'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات سئو</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Meta Title پیش‌فرض</label>
              <input
                v-model="settings.seo.defaultTitle"
                type="text"
                placeholder="عنوان پیش‌فرض سایت..."
                class="input-field"
              >
              <p class="text-xs text-gray-500 mt-1">{{ settings.seo.defaultTitle.length }}/60 کاراکتر</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Meta Description پیش‌فرض</label>
              <textarea
                v-model="settings.seo.defaultDescription"
                rows="4"
                placeholder="توضیحات پیش‌فرض سایت..."
                class="input-field resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ settings.seo.defaultDescription.length }}/160 کاراکتر</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">کلمات کلیدی پیش‌فرض</label>
              <input
                v-model="settings.seo.defaultKeywords"
                type="text"
                placeholder="کلمه1، کلمه2، کلمه3"
                class="input-field"
              >
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input
                  v-model="settings.seo.googleAnalyticsId"
                  type="text"
                  placeholder="GA-XXXXXXXXX-X"
                  class="input-field"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Google Search Console</label>
                <input
                  v-model="settings.seo.googleSearchConsole"
                  type="text"
                  placeholder="کد تایید Google Search Console"
                  class="input-field"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Robots.txt</label>
              <textarea
                v-model="settings.seo.robotsTxt"
                rows="6"
                placeholder="محتوای فایل robots.txt..."
                class="input-field resize-none font-mono text-sm"
              ></textarea>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-md font-semibold text-gray-900">تنظیمات پیشرفته سئو</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.seo.enableSitemap"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">فعال‌سازی sitemap.xml</span>
                </label>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.seo.enableBreadcrumbs"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">نمایش مسیر صفحه</span>
                </label>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.seo.enableCleanUrls"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">URL های تمیز</span>
                </label>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.seo.enableCompression"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">فشرده‌سازی فایل‌ها</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Open Graph Settings -->
      <div v-else-if="activeTab === 'opengraph'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات Open Graph</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع سایت</label>
              <select v-model="settings.openGraph.type" class="input-field">
                <option value="website">وب‌سایت</option>
                <option value="blog">وبلاگ</option>
                <option value="article">مقاله</option>
                <option value="business">کسب‌وکار</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان Open Graph</label>
              <input
                v-model="settings.openGraph.title"
                type="text"
                placeholder="عنوان برای اشتراک‌گذاری..."
                class="input-field"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات Open Graph</label>
              <textarea
                v-model="settings.openGraph.description"
                rows="3"
                placeholder="توضیحات برای اشتراک‌گذاری..."
                class="input-field resize-none"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تصویر پیش‌فرض</label>
              
              <div v-if="!settings.openGraph.image" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i class="ti ti-photo text-3xl text-gray-400 mb-2"></i>
                <p class="text-gray-600 mb-4">تصویر پیش‌فرض برای اشتراک‌گذاری</p>
                <button type="button" class="btn-secondary">
                  <i class="ti ti-upload ml-2"></i>
                  انتخاب تصویر
                </button>
              </div>
              
              <div v-else class="space-y-3">
                <img :src="settings.openGraph.image" alt="OG Image" class="w-full h-32 object-cover rounded-lg">
                <div class="flex gap-2">
                  <button type="button" class="btn-secondary flex-1">تغییر تصویر</button>
                  <button
                    type="button"
                    @click="settings.openGraph.image = null"
                    class="btn-icon text-red-600 hover:bg-red-50"
                  >
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>
              
              <p class="text-xs text-gray-500 mt-2">سایز توصیه شده: 1200x630 پیکسل</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter Card</label>
                <select v-model="settings.openGraph.twitterCard" class="input-field">
                  <option value="summary">خلاصه</option>
                  <option value="summary_large_image">خلاصه با تصویر بزرگ</option>
                  <option value="app">اپلیکیشن</option>
                  <option value="player">پخش‌کننده</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter Site</label>
                <input
                  v-model="settings.openGraph.twitterSite"
                  type="text"
                  placeholder="@username"
                  class="input-field"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Facebook App ID</label>
              <input
                v-model="settings.openGraph.facebookAppId"
                type="text"
                placeholder="Facebook App ID"
                class="input-field"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Schema Markup Settings -->
      <div v-else-if="activeTab === 'schema'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Schema Markup</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع سازمان</label>
              <select v-model="settings.schema.organizationType" class="input-field">
                <option value="Organization">سازمان</option>
                <option value="LocalBusiness">کسب‌وکار محلی</option>
                <option value="Corporation">شرکت</option>
                <option value="EducationalOrganization">سازمان آموزشی</option>
                <option value="GovernmentOrganization">سازمان دولتی</option>
                <option value="NGO">سازمان غیرانتفاعی</option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام سازمان</label>
                <input
                  v-model="settings.schema.name"
                  type="text"
                  placeholder="نام شرکت/سازمان..."
                  class="input-field"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL سایت</label>
                <input
                  v-model="settings.schema.url"
                  type="url"
                  placeholder="https://example.com"
                  class="input-field"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">لوگو سازمان</label>
              
              <div v-if="!settings.schema.logo" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i class="ti ti-photo text-3xl text-gray-400 mb-2"></i>
                <p class="text-gray-600 mb-4">لوگو سازمان برای Schema</p>
                <button type="button" class="btn-secondary">
                  <i class="ti ti-upload ml-2"></i>
                  انتخاب لوگو
                </button>
              </div>
              
              <div v-else class="space-y-3">
                <img :src="settings.schema.logo" alt="Logo" class="w-32 h-32 object-contain rounded-lg border">
                <div class="flex gap-2">
                  <button type="button" class="btn-secondary">تغییر لوگو</button>
                  <button
                    type="button"
                    @click="settings.schema.logo = null"
                    class="btn-icon text-red-600 hover:bg-red-50"
                  >
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
              <textarea
                v-model="settings.schema.address"
                rows="3"
                placeholder="آدرس کامل سازمان..."
                class="input-field resize-none"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">تلفن</label>
                <input
                  v-model="settings.schema.telephone"
                  type="tel"
                  placeholder="021-12345678"
                  class="input-field"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                <input
                  v-model="settings.schema.email"
                  type="email"
                  placeholder="info@example.com"
                  class="input-field"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">شبکه‌های اجتماعی</label>
              <div class="space-y-3">
                <div v-for="(social, index) in settings.schema.socialMedia" :key="index" class="flex gap-3">
                  <input
                    v-model="social.url"
                    type="url"
                    placeholder="https://..."
                    class="input-field flex-1"
                  >
                  <button
                    @click="removeSocialMedia(index)"
                    class="btn-icon text-red-600 hover:bg-red-50"
                  >
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
                
                <button @click="addSocialMedia" class="btn-secondary">
                  <i class="ti ti-plus ml-2"></i>
                  افزودن شبکه اجتماعی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Settings -->
      <div v-else-if="activeTab === 'performance'" class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">تنظیمات عملکرد</h2>
          
          <div class="space-y-6">
            <div class="space-y-4">
              <h3 class="text-md font-semibold text-gray-900">کش و بهینه‌سازی</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.performance.enableCache"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">فعال‌سازی کش</span>
                </label>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.performance.enableImageOptimization"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">بهینه‌سازی تصاویر</span>
                </label>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.performance.enableLazyLoading"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">بارگذاری تنبل</span>
                </label>
                
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="settings.performance.enableMinification"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  >
                  <span class="text-gray-700">کوچک‌سازی فایل‌ها</span>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">مدت زمان کش (ثانیه)</label>
              <input
                v-model.number="settings.performance.cacheTimeout"
                type="number"
                min="0"
                placeholder="3600"
                class="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Section Modal -->
  <Transition name="modal">
    <div v-if="showAddSectionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        @click="showAddSectionModal = false" 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-white">افزودن بخش جدید</h3>
          <button 
            @click="showAddSectionModal = false" 
            class="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p class="text-gray-600 mb-6">یکی از بخش‌های زیر را برای افزودن به صفحه اصلی انتخاب کنید:</p>
          
          <!-- Section Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Slider Section -->
            <button
              @click="addSection('slider')"
              class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            >
              <div class="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
                <i class="ti ti-slideshow text-4xl mb-3"></i>
                <h4 class="text-lg font-bold mb-2">اسلایدر</h4>
                <p class="text-sm text-blue-100 opacity-90">اسلایدر تصاویر با متن و لینک</p>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <!-- Banner Section -->
            <button
              @click="addSection('banner')"
              class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all duration-300 hover:shadow-lg"
            >
              <div class="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
                <i class="ti ti-rectangle-ad text-4xl mb-3"></i>
                <h4 class="text-lg font-bold mb-2">بنر تبلیغاتی</h4>
                <p class="text-sm text-orange-100 opacity-90">بنر تبلیغاتی با تصویر و لینک</p>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <!-- Posts Section -->
            <button
              @click="addSection('posts')"
              class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-300 hover:shadow-lg"
            >
              <div class="bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white">
                <i class="ti ti-article text-4xl mb-3"></i>
                <h4 class="text-lg font-bold mb-2">آخرین مقالات</h4>
                <p class="text-sm text-green-100 opacity-90">نمایش مقالات اخیر منتشر شده</p>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <!-- Categories Section -->
            <button
              @click="addSection('categories')"
              class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg"
            >
              <div class="bg-gradient-to-br from-yellow-500 to-amber-500 p-6 text-white">
                <i class="ti ti-category text-4xl mb-3"></i>
                <h4 class="text-lg font-bold mb-2">دسته‌بندی‌ها</h4>
                <p class="text-sm text-yellow-100 opacity-90">نمایش دسته‌بندی‌های اصلی</p>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <!-- Header Section -->
            <button
              @click="addSection('header')"
              class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg"
            >
              <div class="bg-gradient-to-br from-indigo-500 to-purple-500 p-6 text-white">
                <i class="ti ti-layout-navbar text-4xl mb-3"></i>
                <h4 class="text-lg font-bold mb-2">هدر</h4>
                <p class="text-sm text-indigo-100 opacity-90">تنظیمات هدر و منوی سایت</p>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <!-- Footer Section -->
            <button
              @click="addSection('footer')"
              class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-gray-700 transition-all duration-300 hover:shadow-lg"
            >
              <div class="bg-gradient-to-br from-gray-700 to-gray-900 p-6 text-white">
                <i class="ti ti-layout-bottombar text-4xl mb-3"></i>
                <h4 class="text-lg font-bold mb-2">فوتر</h4>
                <p class="text-sm text-gray-300 opacity-90">تنظیمات فوتر و لینک‌ها</p>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('general')

const tabs = ref([
  { id: 'general', label: 'عمومی', icon: 'ti ti-settings' },
  { id: 'homepage', label: 'صفحه اصلی', icon: 'ti ti-home' },
  { id: 'seo', label: 'سئو', icon: 'ti ti-search' },
  { id: 'opengraph', label: 'Open Graph', icon: 'ti ti-share' },
  { id: 'schema', label: 'Schema', icon: 'ti ti-code' },
  { id: 'performance', label: 'عملکرد', icon: 'ti ti-speedboat' }
])

// Page Builder - Homepage Sections
const pageSections = ref([
  {
    id: 1,
    type: 'header',
    title: 'هدر',
    expanded: false,
    visible: true,
    data: {
      logo: '',
      logoSize: 120,
      logoAlt: 'دانیم',
      logoLink: '/',
      position: 'sticky',
      bgColor: '#ffffff',
      opacity: 100,
      menuItems: [
        { label: 'خانه', link: '/' },
        { label: 'دوره‌ها', link: '/courses' },
        { label: 'بلاگ', link: '/blog' },
        { label: 'تماس با ما', link: '/contact' }
      ]
    }
  },
  {
    id: 2,
    type: 'slider',
    title: 'اسلایدر',
    expanded: false,
    visible: true,
    data: {
      autoPlay: true,
      speed: 5,
      height: 400,
      transition: 'fade',
      showDots: true,
      showArrows: true,
      slides: [
        {
          id: 1,
          title: 'خوش آمدید به دانیم',
          subtitle: 'بهترین پلتفرم آموزش حیوانات خانگی',
          image: '',
          linkType: 'page',
          link: '/courses',
          buttonText: 'شروع یادگیری',
          active: true,
          openInNewTab: false
        }
      ]
    }
  },
  {
    id: 3,
    type: 'banner',
    title: 'بنر تبلیغاتی',
    expanded: false,
    visible: true,
    data: {
      bannerType: 'gradient', // 'gradient' or 'image'
      // Gradient type data
      title: 'پیشنهاد ویژه!',
      subtitle: 'تخفیف ۵۰٪ برای دوره‌های آموزشی',
      description: 'برای مدت محدود، تمام دوره‌های آموزشی با ۵۰٪ تخفیف',
      gradientStart: '#FF6B35',
      gradientEnd: '#F97316',
      gradientDirection: 'to-r',
      primaryButton: 'مشاهده دوره‌ها',
      primaryLink: '/courses',
      secondaryButton: 'اطلاعات بیشتر',
      secondaryLink: '/about',
      // Image type data
      image: '',
      link: '',
      openInNewTab: false
    }
  },
  {
    id: 5,
    type: 'posts',
    title: 'آخرین مقالات',
    expanded: false,
    visible: true,
    data: {
      title: 'آخرین مقالات',
      categoryId: '',
      count: 6,
      layout: 'grid'
    }
  },
  {
    id: 6,
    type: 'categories',
    title: 'دسته‌بندی‌ها',
    expanded: false,
    visible: true,
    data: {
      title: 'دسته‌بندی‌های محبوب',
      selectedCategories: [], // [] means all, or [1, 2, 3] for specific
      count: 6,
      layout: 'grid',
      showCount: true,
      showDescription: true
    }
  },
  {
    id: 7,
    type: 'footer',
    title: 'فوتر',
    expanded: false,
    visible: true,
    data: {
      aboutTitle: 'درباره دانیم',
      aboutText: 'دانیم بهترین پلتفرم آموزش و مراقبت از حیوانات خانگی است.',
      footerLogo: '',
      column1Title: 'لینک‌های مفید',
      column2Title: 'خدمات',
      quickLinks: [
        { label: 'درباره ما', link: '/about' },
        { label: 'تماس با ما', link: '/contact' },
        { label: 'دوره‌ها', link: '/courses' },
        { label: 'مشاوره', link: '/consultation' }
      ],
      address: 'تهران، خیابان ولیعصر',
      phone: '۰۲۱-۱۲۳۴۵۶۷۸',
      email: 'info@danim.com',
      workingHours: 'شنبه تا پنجشنبه ۹ تا ۱۸',
      instagram: '',
      telegram: '',
      whatsapp: '',
      youtube: '',
      copyright: '© ۲۰۲۴ دانیم. تمامی حقوق محفوظ است.',
      bgColor: '#1F2937'
    }
  }
])

const showAddSectionModal = ref(false)
const draggedIndex = ref(null)

// Available Categories for Selection
const availableCategories = ref([
  { id: 1, name: 'آموزش سگ', icon: 'ti ti-dog', count: 24 },
  { id: 2, name: 'آموزش گربه', icon: 'ti ti-cat', count: 32 },
  { id: 3, name: 'تغذیه', icon: 'ti ti-apple', count: 18 },
  { id: 4, name: 'بهداشت و درمان', icon: 'ti ti-first-aid-kit', count: 15 },
  { id: 5, name: 'بازی و سرگرمی', icon: 'ti ti-ball-tennis', count: 12 },
  { id: 6, name: 'رفتار شناسی', icon: 'ti ti-brain', count: 20 },
  { id: 7, name: 'تربیت و آموزش', icon: 'ti ti-school', count: 28 },
  { id: 8, name: 'لوازم و تجهیزات', icon: 'ti ti-shopping-bag', count: 16 }
])

// Drag & Drop Functions
const onDragStart = (index) => {
  draggedIndex.value = index
}

const onDragEnd = () => {
  draggedIndex.value = null
}

const onDragOver = (event, index) => {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === index) return
  
  // Reorder sections
  const draggedItem = pageSections.value[draggedIndex.value]
  pageSections.value.splice(draggedIndex.value, 1)
  pageSections.value.splice(index, 0, draggedItem)
  draggedIndex.value = index
}

const onDrop = (event, index) => {
  event.preventDefault()
}

// Section Management Functions
const addSection = (type) => {
  const newSection = {
    id: Date.now(),
    type,
    title: getSectionLabel(type),
    expanded: false,
    visible: true,
    data: getDefaultSectionSettings(type)
  }
  
  pageSections.value.push(newSection)
  showAddSectionModal.value = false
}

const removeSection = (index) => {
  if (confirm('آیا از حذف این بخش مطمئن هستید؟')) {
    pageSections.value.splice(index, 1)
  }
}

const toggleSection = (index) => {
  pageSections.value[index].expanded = !pageSections.value[index].expanded
}

// Slider Functions
const addSlideToSection = (section) => {
  if (!section.data.slides) {
    section.data.slides = []
  }
  
  section.data.slides.push({
    id: Date.now(),
    title: '',
    subtitle: '',
    image: '',
    linkType: 'none',
    link: '',
    buttonText: 'ادامه مطلب',
    active: true,
    openInNewTab: false
  })
}

const removeSlideFromSection = (section, slideIndex) => {
  if (confirm('آیا از حذف این اسلاید مطمئن هستید؟')) {
    section.data.slides.splice(slideIndex, 1)
  }
}

// Header Functions
const addMenuItemToHeader = (section) => {
  if (!section.data.menuItems) {
    section.data.menuItems = []
  }
  
  section.data.menuItems.push({
    label: 'آیتم جدید',
    link: '/'
  })
}

const removeMenuItemFromHeader = (section, itemIndex) => {
  section.data.menuItems.splice(itemIndex, 1)
}

// Footer Functions
const addQuickLinkToFooter = (section) => {
  if (!section.data.quickLinks) {
    section.data.quickLinks = []
  }
  
  section.data.quickLinks.push({
    label: 'لینک جدید',
    link: '/'
  })
}

const removeQuickLinkFromFooter = (section, linkIndex) => {
  section.data.quickLinks.splice(linkIndex, 1)
}

// Image Upload Function
const uploadImage = (event, target, fieldName) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('لطفا فقط فایل تصویر انتخاب کنید')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('حجم فایل نباید بیشتر از ۵ مگابایت باشد')
    return
  }
  
  // Read and convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    target[fieldName] = e.target.result
  }
  reader.readAsDataURL(file)
}

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
    banner: 'ti ti-rectangle-ad',
    posts: 'ti ti-article',
    categories: 'ti ti-category',
    header: 'ti ti-layout-navbar',
    footer: 'ti ti-layout-bottombar'
  }
  return icons[type] || 'ti ti-puzzle'
}

const getSectionColor = (type) => {
  const colors = {
    slider: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    banner: 'bg-gradient-to-r from-orange-500 to-red-500',
    posts: 'bg-gradient-to-r from-green-500 to-emerald-500',
    categories: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    header: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    footer: 'bg-gradient-to-r from-gray-700 to-gray-900'
  }
  return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-700'
}

const getSectionDescription = (type) => {
  const descriptions = {
    slider: 'اسلایدر تصاویر با امکان افزودن متن و لینک',
    banner: 'بنر تبلیغاتی با تصویر و لینک',
    posts: 'نمایش آخرین مقالات منتشر شده',
    categories: 'نمایش دسته‌بندی‌های اصلی',
    header: 'تنظیمات هدر سایت (لوگو، منو، و...)',
    footer: 'تنظیمات فوتر سایت (لینک‌ها، شبکه‌های اجتماعی، و...)'
  }
  return descriptions[type] || ''
}

const getDefaultSectionSettings = (type) => {
  const defaults = {
    slider: {
      autoPlay: true,
      speed: 5,
      height: 400,
      transition: 'fade',
      showDots: true,
      showArrows: true,
      slides: []
    },
    banner: {
      bannerType: 'gradient',
      title: 'پیشنهاد ویژه!',
      subtitle: 'تخفیف ۵۰٪ برای دوره‌های آموزشی',
      description: 'برای مدت محدود، تمام دوره‌های آموزشی با ۵۰٪ تخفیف',
      gradientStart: '#FF6B35',
      gradientEnd: '#F97316',
      gradientDirection: 'to-r',
      primaryButton: 'مشاهده دوره‌ها',
      primaryLink: '/courses',
      secondaryButton: 'اطلاعات بیشتر',
      secondaryLink: '/about',
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
      showDescription: true
    },
    header: {
      logo: '',
      logoSize: 120,
      logoAlt: 'دانیم',
      logoLink: '/',
      position: 'sticky',
      bgColor: '#ffffff',
      opacity: 100,
      menuItems: [
        { label: 'خانه', link: '/' },
        { label: 'دوره‌ها', link: '/courses' },
        { label: 'تماس با ما', link: '/contact' }
      ]
    },
    footer: {
      aboutTitle: 'درباره دانیم',
      aboutText: 'دانیم بهترین پلتفرم آموزش و مراقبت از حیوانات خانگی است.',
      footerLogo: '',
      column1Title: 'لینک‌های مفید',
      column2Title: 'خدمات',
      quickLinks: [
        { label: 'درباره ما', link: '/about' },
        { label: 'تماس با ما', link: '/contact' },
        { label: 'دوره‌ها', link: '/courses' },
        { label: 'مشاوره', link: '/consultation' }
      ],
      address: 'تهران، خیابان ولیعصر',
      phone: '۰۲۱-۱۲۳۴۵۶۷۸',
      email: 'info@danim.com',
      workingHours: 'شنبه تا پنجشنبه ۹ تا ۱۸',
      instagram: '',
      telegram: '',
      whatsapp: '',
      youtube: '',
      copyright: '© ۲۰۲۴ دانیم. تمامی حقوق محفوظ است.',
      bgColor: '#1F2937'
    }
  }
  return defaults[type] || {}
}

const settings = ref({
  general: {
    siteName: 'سایت دانیم',
    tagline: 'بانک دانش حیوانات خانگی',
    adminEmail: 'admin@danim.com',
    language: 'fa',
    description: 'سایت جامع اطلاعات و دانش حیوانات خانگی',
    showComments: true,
    showSearch: true,
    showSidebar: true,
    showSocialMedia: true
  },
  seo: {
    defaultTitle: 'سایت دانیم - بانک دانش حیوانات خانگی',
    defaultDescription: 'مرجع کامل اطلاعات، مراقبت و تغذیه حیوانات خانگی',
    defaultKeywords: 'حیوانات خانگی، سگ، گربه، پرنده، ماهی، مراقبت',
    googleAnalyticsId: '',
    googleSearchConsole: '',
    robotsTxt: 'User-agent: *\nDisallow: /admin/\nSitemap: https://yoursite.com/sitemap.xml',
    enableSitemap: true,
    enableBreadcrumbs: true,
    enableCleanUrls: true,
    enableCompression: true
  },
  openGraph: {
    type: 'website',
    title: 'سایت دانیم - بانک دانش حیوانات خانگی',
    description: 'مرجع کامل اطلاعات، مراقبت و تغذیه حیوانات خانگی',
    image: null,
    twitterCard: 'summary_large_image',
    twitterSite: '@danim_site',
    facebookAppId: ''
  },
  schema: {
    organizationType: 'Organization',
    name: 'سایت دانیم',
    url: 'https://danim.com',
    logo: null,
    address: 'تهران، ایران',
    telephone: '',
    email: 'info@danim.com',
    socialMedia: [
      { url: 'https://instagram.com/danim' },
      { url: 'https://twitter.com/danim' }
    ]
  },
  performance: {
    enableCache: true,
    enableImageOptimization: true,
    enableLazyLoading: true,
    enableMinification: true,
    cacheTimeout: 3600
  }
})

const addSocialMedia = () => {
  settings.value.schema.socialMedia.push({ url: '' })
}

const removeSocialMedia = (index) => {
  settings.value.schema.socialMedia.splice(index, 1)
}

// Helper function for banner gradient style
const setBannerPreviewStyle = (el, section) => {
  if (el && section.data) {
    const direction = section.data.gradientDirection || 'to-r'
    const startColor = section.data.gradientStart || '#FF6B35'
    const endColor = section.data.gradientEnd || '#F97316'
    el.style.background = `linear-gradient(${direction}, ${startColor}, ${endColor})`
  }
}

const getBannerGradientStyle = (data) => {
  const direction = data.gradientDirection || 'to-r'
  const startColor = data.gradientStart || '#FF6B35'
  const endColor = data.gradientEnd || '#F97316'
  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`
  }
}

const saveSettings = () => {
  // Save settings logic
  console.log('Settings saved:', settings.value)
  // Show success message
}

const resetSettings = () => {
  if (confirm('آیا از بازنشانی تمام تنظیمات اطمینان دارید؟')) {
    // Reset to default values
    console.log('Settings reset')
  }
}
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

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.modal-enter-to > div:last-child,
.modal-leave-from > div:last-child {
  transform: scale(1) translateY(0);
  opacity: 1;
}
</style>