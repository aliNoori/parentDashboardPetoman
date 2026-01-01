<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ایجاد سریال جدید</h1>
        <p class="text-gray-600 mt-1">سریال جدید با فصل‌ها و قسمت‌ها ایجاد کنید</p>
      </div>
      <div class="flex gap-3">
        <button @click="$router.back()"
                class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center font-medium">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="saveSeries"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center font-medium">
          <i class="ti ti-check ml-2"></i>
          ذخیره سریال
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات پایه</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان سریال *</label>
              <input
                  v-model="form.title"
                  type="text"
                  placeholder="نام سریال را وارد کنید..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان انگلیسی</label>
              <input
                  v-model="form.titleEn"
                  type="text"
                  placeholder="English Title..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">خلاصه داستان *</label>
              <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="خلاصه‌ای از داستان سریال..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">کارگردان</label>
                <input
                    v-model="form.director"
                    type="text"
                    placeholder="نام کارگردان..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">سال تولید</label>
                <input
                    v-model.number="form.year"
                    type="number"
                    placeholder="2024"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">کشور سازنده</label>
                <input
                    v-model="form.country"
                    type="text"
                    placeholder="ایالات متحده آمریکا"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">زبان</label>
                <input
                    v-model="form.language"
                    type="text"
                    placeholder="انگلیسی"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">بازیگران</label>
              <input
                  v-model="form.actors"
                  type="text"
                  placeholder="نام بازیگران را با ویرگول جدا کنید..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <p class="text-xs text-gray-500 mt-1">نام‌ها را با ویرگول از هم جدا کنید</p>
            </div>
          </div>
        </div>

        <!-- Seasons & Episodes -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">فصل‌ها و قسمت‌ها</h3>
            <button @click="addSeason"
                    class="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm">
              <i class="ti ti-plus ml-2"></i>
              افزودن فصل
            </button>
          </div>

          <div v-if="form.seasons.length === 0" class="text-center py-12 text-gray-500">
            <i class="ti ti-folder-off text-4xl mb-2"></i>
            <p class="mb-4">هنوز فصلی اضافه نشده است</p>
            <button @click="addSeason" class="btn-primary">
              <i class="ti ti-plus ml-2"></i>
              افزودن اولین فصل
            </button>
          </div>

          <div class="space-y-4">
            <div
                v-for="(season, sIndex) in form.seasons"
                :key="sIndex"
                class="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                  @click="toggleSeason(sIndex)"
                  class="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span
                      class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {{ sIndex + 1 }}
                  </span>
                  <div>
                    <h4 class="font-bold text-gray-900">{{ season.title || `فصل ${sIndex + 1}` }}</h4>
                    <p class="text-xs text-gray-500">{{ season.episodes.length }} قسمت</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                      @click.stop="removeSeason(sIndex)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <i class="ti ti-trash"></i>
                  </button>
                  <i
                      :class="expandedSeasons.includes(sIndex) ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                      class="text-gray-600"
                  ></i>
                </div>
              </div>

              <div v-if="expandedSeasons.includes(sIndex)" class="p-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">عنوان فصل</label>
                    <input
                        v-model="season.title"
                        type="text"
                        placeholder="فصل اول"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">شماره فصل</label>
                    <input
                        v-model.number="season.number"
                        type="number"
                        placeholder="1"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-2">توضیحات فصل</label>
                  <textarea
                      v-model="season.description"
                      rows="2"
                      placeholder="توضیحات مختصر درباره این فصل..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none"
                  ></textarea>
                </div>

                <div class="border-t border-gray-200 pt-4">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="text-sm font-bold text-gray-900">قسمت‌ها</h5>
                    <button
                        @click="addEpisode(sIndex)"
                        class="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"
                    >
                      <i class="ti ti-plus ml-1"></i>
                      افزودن قسمت
                    </button>
                  </div>

                  <div v-if="season.episodes.length === 0" class="text-center py-6 text-gray-400 text-sm">
                    <i class="ti ti-movie-off text-2xl mb-1"></i>
                    <p>هنوز قسمتی اضافه نشده</p>
                  </div>

                  <div class="space-y-2">
                    <div
                        v-for="(episode, eIndex) in season.episodes"
                        :key="eIndex"
                        class="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors"
                    >
                      <div class="flex items-start gap-3">
                        <span
                            class="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
                          {{ eIndex + 1 }}
                        </span>
                        <div class="flex-1 space-y-2">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                                v-model="episode.title"
                                type="text"
                                placeholder="عنوان قسمت..."
                                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-xs"
                            />
                            <input
                                v-model.number="episode.duration"
                                type="number"
                                placeholder="مدت زمان (دقیقه)"
                                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-xs"
                            />
                          </div>

                          <!-- Video Source Type -->
                          <div class="flex gap-3 mb-2">
                            <label class="flex items-center gap-1 cursor-pointer text-xs">
                              <input
                                  v-model="episode.sourceType"
                                  type="radio"
                                  value="link"
                                  class="w-3 h-3 text-purple-600 focus:ring-purple-500"
                              >
                              <span class="text-gray-700">لینک</span>
                            </label>
                            <label class="flex items-center gap-1 cursor-pointer text-xs">
                              <input
                                  v-model="episode.sourceType"
                                  type="radio"
                                  value="upload"
                                  class="w-3 h-3 text-purple-600 focus:ring-purple-500"
                              >
                              <span class="text-gray-700">آپلود</span>
                            </label>
                          </div>

                          <!-- Link Input -->
                          <div v-if="episode.sourceType === 'link'">
                            <input
                                v-model="episode.videoUrl"
                                type="url"
                                placeholder="لینک ویدیو..."
                                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-xs"
                                dir="ltr"
                            />
                          </div>

                          <!-- Upload Input -->
                          <div v-else-if="episode.sourceType === 'upload'">
                            <div
                                @click="triggerEpisodeFileInput(sIndex, eIndex)"
                                class="border border-dashed border-gray-300 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
                            >
                              <div v-if="!episode.videoFile" class="text-xs text-gray-500">
                                <i class="ti ti-upload text-lg"></i>
                                <p>کلیک برای آپلود</p>
                              </div>
                              <div v-else class="flex items-center justify-center gap-1 text-xs">
                                <i class="ti ti-file-video text-purple-600"></i>
                                <span class="text-gray-900">{{ episode.videoFile.name }}</span>
                                <button
                                    @click.stop="removeEpisodeFile(sIndex, eIndex)"
                                    class="text-red-600 hover:text-red-700"
                                >
                                  <i class="ti ti-x"></i>
                                </button>
                              </div>
                            </div>
                            <input
                                :ref="el => setEpisodeFileInput(sIndex, eIndex, el)"
                                type="file"
                                accept="video/*"
                                class="hidden"
                                @change="handleEpisodeFileUpload($event, sIndex, eIndex)"
                            />
                            <!-- 🟩 نمایش progress -->
                            <div  v-if="episode.videoFile">
                              <progress class="w-full" :value="episode.uploadProgress || 0" max="100"></progress>
                              <span class="text-xs text-gray-600 ml-2">
                               {{ episode.uploadProgress || 0 }}%
                              </span>
                            </div>
                          </div>

                          <!-- Quality Selection -->
                          <div v-if="episode.sourceType" class="relative">
                            <button
                                @click="toggleEpisodeQualityDropdown(sIndex, eIndex)"
                                class="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between text-xs"
                            >
                              <span>{{ episode.quality || '1080p' }}</span>
                              <i class="ti ti-chevron-down text-xs"></i>
                            </button>
                            <ul
                                v-if="episode.showQualityDropdown"
                                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                            >
                              <li v-for="quality in qualities" :key="quality.value">
                                <button
                                    @click="selectEpisodeQuality(sIndex, eIndex, quality.value)"
                                    class="w-full px-3 py-1.5 text-xs text-right hover:bg-gray-50"
                                    :class="episode.quality === quality.value ? 'bg-purple-50 text-purple-600' : 'text-gray-700'"
                                >
                                  {{ quality.label }}
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button
                            @click="removeEpisode(sIndex, eIndex)"
                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <i class="ti ti-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Poster -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">پوستر سریال</h3>

          <div class="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden mb-4 border-2 border-gray-200">
            <img
                v-if="form.poster"
                :src="form.poster"
                alt="Poster"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="ti ti-photo text-gray-400 text-4xl"></i>
            </div>
          </div>

          <input
              v-model="form.poster"
              type="url"
              placeholder="https://example.com/poster.jpg"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm mb-2"
          />

          <input
              type="file"
              accept="image/*"
              @change="handlePosterUpload"
              class="hidden"
              id="poster-upload"
          />
          <label
              for="poster-upload"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm"
          >
            <i class="ti ti-upload text-purple-600"></i>
            <span>انتخاب فایل</span>
          </label>

          <p class="text-xs text-gray-500 mt-2">توصیه: 500x750 پیکسل</p>
        </div>

        <!-- Category -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">دسته‌بندی</h3>

          <div class="relative">
            <button
                @click="showCategoryDropdown = !showCategoryDropdown"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
            >
              <span class="text-gray-700">{{ selectedCategory || 'انتخاب دسته‌بندی' }}</span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <ul
                v-if="showCategoryDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <li
                  v-for="category in categories"
                  :key="category"
                  @click="selectCategory(category)"
                  class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                {{ category.title }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Tags Block (Separate) -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">برچسب‌ها</h3>
          <!-- پیشنهادات -->
          <div class="flex flex-wrap gap-2 mb-2">
  <span
      v-for="tag in tagStore.tags"
      :key="tag.name"
      @click="addTag(tag.name)"
      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-rose-100 hover:text-rose-700"
  >
    {{ tag.name }} ({{ tag.count }})
  </span>
          </div>
          <!-- تگ‌های انتخاب‌شده -->
          <div class="flex flex-wrap gap-2 mb-2">
         <span v-for="(tag, index) in form.tags" :key="index"
               class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm flex items-center gap-2">
    {{ tag }}
    <button type="button" @click="removeTag(index)" class="hover:text-rose-900">
      <i class="ti ti-x text-xs"></i>
    </button>
  </span>
          </div>
          <!-- ورودی تگ جدید -->
          <div class="flex gap-2">
            <input
                v-model="newTag"
                type="text"
                @keypress.enter.prevent="addTag()"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="برچسب جدید را وارد کنید..."
            >
            <button type="button" @click="addTag()"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <i class="ti ti-plus"></i>
            </button>
          </div>

        </div>

        <!-- Status -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">وضعیت</h3>

          <div class="relative">
            <button
                @click="showStatusDropdown = !showStatusDropdown"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:border-purple-500 transition-colors"
            >
              <span class="text-gray-700">{{ getStatusLabel(form.status) }}</span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <ul
                v-if="showStatusDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <li
                  @click="selectStatus('ongoing')"
                  class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                در حال پخش
              </li>
              <li
                  @click="selectStatus('completed')"
                  class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                پایان یافته
              </li>
              <li
                  @click="selectStatus('upcoming')"
                  class="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                به زودی
              </li>
            </ul>
          </div>
        </div>

        <!-- Rating -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">امتیاز</h3>

          <div class="flex items-center gap-3">
            <input
                v-model.number="form.rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="8.5"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <span class="text-gray-500">/10</span>
          </div>
        </div>

        <!-- Publish -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">انتشار</h3>

          <label class="flex items-center gap-3 cursor-pointer">
            <input
                v-model="form.published"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span class="text-gray-700">منتشر شود</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from "@/composables/useToast.js";
import {useTagTypeStore} from "@/stores/tag-type.ts";
import {useTagStore} from "@/stores/tag.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";
import {useSeriesStore} from "@/stores/series.ts";


const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const toast = useToast()

const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)
const expandedSeasons = ref([])
const selectedCategory = ref()
const categories = computed(() => categoryStore.categories)
const tagTypeStore = useTagTypeStore()
const tagStore = useTagStore()
const tags = computed(() => tagStore.tags)


const form = ref({
  title: '',
  titleEn: '',
  description: '',
  director: '',
  year: new Date().getFullYear(),
  country: '',
  language: '',
  actors: '',
  poster: '',
  category: '',
  categoryId: '',
  status: 'ongoing',
  rating: 0,
  published: false,
  seasons: [],
  tags: []
})

const newTag = ref('')

function addTag(tagName) {
  const tag = tagName || newTag.value.trim()
  if (!tag) return

  if (!form.value.tags.includes(tag)) {
    form.value.tags.push(tag)

    // اگر تگ از پیشنهادات بود، شمارنده زیاد بشه
    if (tagStore.tags.some(t => t.name === tag)) {
      tagStore.incrementTagCount(tag)
    }
  }
  newTag.value = ''
}

const removeTag = async (index) => {
  const tagName = form.value.tags[index]
  const tagObj = tagStore.tags.find(t => t.name === tagName)
  if (tagObj) {
    await tagStore.decrementTagCount(tagObj.id)
  }
  form.value.tags.splice(index, 1)
}

const episodeFileInputs = ref({})

const qualities = [
  {value: '480p', label: '480p - SD'},
  {value: '720p', label: '720p - HD'},
  {value: '1080p', label: '1080p - Full HD'},
  {value: '1440p', label: '1440p - 2K'},
  {value: '2160p', label: '2160p - 4K'}
]

const setEpisodeFileInput = (sIndex, eIndex, el) => {
  const key = `${sIndex}-${eIndex}`
  episodeFileInputs.value[key] = el
}

const triggerEpisodeFileInput = (sIndex, eIndex) => {
  const key = `${sIndex}-${eIndex}`
  if (episodeFileInputs.value[key]) {
    episodeFileInputs.value[key].click()
  }
}

const handleEpisodeFileUpload = (event, sIndex, eIndex) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
    toast.error('حجم فایل نباید بیشتر از 2 گیگابایت باشد')
    return
  }

  if (!file.type.startsWith('video/')) {
    toast.error('لطفاً یک فایل ویدیویی انتخاب کنید')
    return
  }

  form.value.seasons[sIndex].episodes[eIndex].videoFile = file
  toast.success('فایل ویدیو با موفقیت انتخاب شد')
}

const removeEpisodeFile = (sIndex, eIndex) => {
  form.value.seasons[sIndex].episodes[eIndex].videoFile = null
}

const toggleEpisodeQualityDropdown = (sIndex, eIndex) => {
  const episode = form.value.seasons[sIndex].episodes[eIndex]
  episode.showQualityDropdown = !episode.showQualityDropdown
}

const selectEpisodeQuality = (sIndex, eIndex, quality) => {
  const episode = form.value.seasons[sIndex].episodes[eIndex]
  episode.quality = quality
  episode.showQualityDropdown = false
}

const selectCategory = (category) => {
  form.value.categoryId = category.id
  selectedCategory.value = category.title
  showCategoryDropdown.value = false
}

const selectStatus = (status) => {
  form.value.status = status
  showStatusDropdown.value = false
}

const getStatusLabel = (status) => {
  const labels = {
    ongoing: 'در حال پخش',
    completed: 'پایان یافته',
    upcoming: 'به زودی'
  }
  return labels[status] || 'انتخاب وضعیت'
}

const handlePosterUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'لطفاً یک فایل کوچکتر انتخاب کنید')
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('فقط فایل‌های تصویری مجاز هستند', 'فرمت‌های مجاز: JPG, PNG, WebP')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.poster = e.target.result
  }
  reader.readAsDataURL(file)
}

const addSeason = () => {
  form.value.seasons.push({
    number: form.value.seasons.length + 1,
    title: '',
    description: '',
    episodes: []
  })
  expandedSeasons.value.push(form.value.seasons.length - 1)
}

const removeSeason = (index) => {
  if (confirm('آیا از حذف این فصل اطمینان دارید؟')) {
    form.value.seasons.splice(index, 1)
    expandedSeasons.value = expandedSeasons.value.filter(i => i !== index).map(i => i > index ? i - 1 : i)
  }
}

const toggleSeason = (index) => {
  const idx = expandedSeasons.value.indexOf(index)
  if (idx > -1) {
    expandedSeasons.value.splice(idx, 1)
  } else {
    expandedSeasons.value.push(index)
  }
}

const addEpisode = (seasonIndex) => {
  form.value.seasons[seasonIndex].episodes.push({
    title: '',
    duration: 45,
    sourceType: 'link', // 'link' or 'upload'
    videoUrl: '',
    videoFile: null,
    quality: '1080p',
    showQualityDropdown: false
  })
}

const removeEpisode = (seasonIndex, episodeIndex) => {
  if (confirm('آیا از حذف این قسمت اطمینان دارید؟')) {
    form.value.seasons[seasonIndex].episodes.splice(episodeIndex, 1)
  }
}
const seriesStore = useSeriesStore()
const saveSeries = async () => {
  if (!form.value.title) {
    toast.warning('لطفاً عنوان سریال را وارد کنید', 'عنوان الزامی است')
    return
  }

  if (!form.value.description) {
    toast.warning('لطفاً خلاصه داستان را وارد کنید', 'خلاصه داستان الزامی است')
    return
  }

  if (!form.value.categoryId) {
    toast.warning('لطفاً دسته‌بندی را انتخاب کنید', 'انتخاب دسته‌بندی الزامی است')
    return
  }
  console.log('Saving series:', form.value)

  await seriesStore.addSeries(form.value,form.value.poster)

  toast.success('سریال با موفقیت ایجاد شد!', 'اطلاعات ذخیره گردید')
  setTimeout(() => {
    router.push('/dashboard/film/series')
  }, 1000)
}


// Initialize
onMounted(async () => {
  await categoryTypeStore.fetchType('film')
  await tagTypeStore.fetchType('film')
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id})
      }
    },
    {immediate: true}
)

watch(
    () => tagTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await tagStore.fetchTags({typeId: type.id,contentType:'series'})
      }
    },
    {immediate: true}
)
</script>
