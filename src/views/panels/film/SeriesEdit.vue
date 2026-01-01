<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ویرایش سریال</h1>
        <p class="text-gray-600 mt-1">ویرایش اطلاعات سریال، فصل‌ها و قسمت‌ها</p>
      </div>
      <div class="flex gap-3">
        <button @click="$router.back()" class="btn-secondary">
          <i class="ti ti-arrow-right ml-2"></i>
          بازگشت
        </button>
        <button @click="updateSeries" class="btn-primary">
          <i class="ti ti-check ml-2"></i>
          به‌روزرسانی
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <i class="ti ti-loader-2 text-4xl text-purple-600 animate-spin mb-4"></i>
      <p class="text-gray-600">در حال بارگذاری...</p>
    </div>

    <!-- Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <!-- Statistics -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">آمار</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ form.views || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">بازدید</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ form.likes || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">لایک</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ form.seasons?.length || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">فصل</p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <p class="text-2xl font-bold text-orange-600">{{ totalEpisodes }}</p>
              <p class="text-xs text-gray-600 mt-1">قسمت</p>
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
            <span>تغییر پوستر</span>
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

        <!-- Delete -->
        <div class="bg-white rounded-xl border border-red-200 p-6">
          <h3 class="text-lg font-bold text-red-600 mb-4">حذف سریال</h3>
          <p class="text-sm text-gray-600 mb-4">با حذف سریال، تمام فصل‌ها و قسمت‌ها نیز حذف خواهند شد.</p>
          <button @click="deleteSeries"
                  class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            <i class="ti ti-trash ml-2"></i>
            حذف دائمی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useToast} from "@/composables/useToast.js";
import {useSeriesStore} from "@/stores/series.ts";
import {useCategoryTypeStore} from "@/stores/category-type.ts";
import {useCategoryStore} from "@/stores/category.ts";


const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(true)
const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)
const expandedSeasons = ref([])
const selectedCategory = ref()
const categories = computed(() => categoryStore.categories)

const form = ref({
  id: null,
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
  views: 0,
  likes: 0,
  seasons: []
})

const totalEpisodes = computed(() => {
  return form.value.seasons.reduce((total, season) => {
    return total + (season.episodes?.length || 0)
  }, 0)
})
const seriesStore = useSeriesStore()

const mapSeriesToForm = (item) => {
  return {
    id: item.id,
    title: item.title || '',
    titleEn: item.titleEn || '',
    description: item.description || '',
    director: item.director || '',
    year: item.year || new Date().getFullYear(),
    country: item.country || '',
    language: item.language || '',
    actors: item.actors || '',
    poster: item.poster || '',
    category: item.category.title || '',
    categoryId: item.category.id || '',
    status: item.status || 'ongoing',
    rating: item.rating || 0,
    published: item.status === 'published', // یا هر منطق دلخواه
    views: item.views || 0,
    likes: item.likes || 0,
    seasons: (item.seasonsList || []).map(season => ({
      ...season,
      episodes: (season.episodes || []).map(ep => ({
        ...ep,
        sourceType: ep.videoUrl ? 'link' : 'upload',
        videoFile: null,
        uploadProgress: 0
      }))
    }))
  }
}
// Initialize
onMounted(async () => {
  await loadSeries()
  await categoryTypeStore.fetchType('film')
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

const loadSeries = async () => {
  loading.value = true
  const seriesId = route.params.id

  const series = seriesStore.findById(String(seriesId))

  if (series == null) {
    await router.push('/dashboard/film/series')
  }
  selectedCategory.value = series.category.title

  if (series) {
    form.value = mapSeriesToForm(series)
  }
  loading.value = false
}
const episodeFileInputs = ref({})
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
const removeEpisodeFile = (sIndex, eIndex) => {
  form.value.seasons[sIndex].episodes[eIndex].videoFile = null
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

const removeSeason = async (index) => {
  const season = form.value.seasons[index]
  if (confirm('آیا از حذف این فصل اطمینان دارید؟')) {
    await seriesStore.removeSeason(form.value.id, season.id)
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
    videoUrl: ''
  })
}

const removeEpisode = async (seasonIndex, episodeIndex) => {
  const season = form.value.seasons[seasonIndex]
  const episode = season.episodes[episodeIndex]

  if (confirm('آیا از حذف این قسمت اطمینان دارید؟')) {
    // حذف از سرور
    await seriesStore.removeEpisode(form.value.id, season.id, episode.id)

    // حذف از لیست محلی
    form.value.seasons[seasonIndex].episodes.splice(episodeIndex, 1)

    console.log('🗑️ اپیزود حذف شد (محلی + سرور)')
  }
}


const updateSeries = async () => {
  // اعتبارسنجی
  if (!form.value.title) {
    toast.warning('لطفاً عنوان سریال را وارد کنید')
    return
  }

  if (!form.value.description) {
    toast.warning('لطفاً خلاصه داستان را وارد کنید')
    return
  }

  if (!form.value.categoryId) {
    toast.warning('لطفاً دسته‌بندی را انتخاب کنید')
    return
  }

  // فقط payload اصلی رو می‌سازیم
  const cleanPayload = {
    ...form.value,
    seasons: form.value.seasons // 👈 استور خودش اپیزودها رو پردازش می‌کنه
  }

  await seriesStore.updateSeries(cleanPayload, form.value.poster)
  toast.success('سریال با موفقیت به‌روزرسانی شد!', 'تغییرات ذخیره گردید')
  await router.push('/dashboard/film/series')
}



const deleteSeries = async () => {
  if (confirm('آیا از حذف این سریال اطمینان دارید؟ این عمل غیرقابل بازگشت است!')) {
    await seriesStore.removeSeries(form.value.id)
    toast.success('سریال با موفقیت حذف شد', 'تغییرات اعمال گردید')
    setTimeout(() => {
      router.push('/dashboard/film/series')
    }, 1000)
  }
}
</script>

<style scoped>
.btn-primary {
  padding: 0.5rem 1rem;
  background-color: #9333ea;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #7e22ce;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
