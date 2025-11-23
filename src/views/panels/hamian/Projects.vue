<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">مدیریت قرارهای مهربانی</h1>
        <p class="text-sm text-gray-600 mt-1">{{ filteredProjects.length }} قرار مهربانی در سیستم</p>
      </div>
      <div class="flex gap-2">
        <button
            @click="exportToExcel"
            class="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <i class="ti ti-file-spreadsheet"></i>
          <span>خروجی Excel</span>
        </button>
        <button
            @click="createNewProject"
            class="btn-primary w-full sm:w-auto"
        >
          <i class="ti ti-plus ml-2"></i>
          افزودن قرار مهربانی جدید
        </button>
      </div>
    </div>

    <!-- Filters - Mobile Optimized -->
    <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در قرارهای مهربانی..."
                class="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
          </div>
        </div>

        <!-- Type Filter -->
        <div class="relative">
          <button
              @click="showTypeDropdown = !showTypeDropdown"
              class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <span>{{ getTypeFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>

          <Transition name="dropdown">
            <ul v-if="showTypeDropdown"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[180px]">
              <li
                  v-for="type in typeFilters"
                  :key="type.value"
                  @click="selectTypeFilter(type.value)"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  :class="selectedType === type.value ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700'"
              >
                <i :class="type.icon" class="ml-2"></i>
                {{ type.label }}
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Status Filter Dropdown -->
        <div class="relative">
          <button
              @click.stop="showStatusDropdown = !showStatusDropdown"
              class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <span>{{ getStatusFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>

          <Transition name="dropdown">
            <ul v-if="showStatusDropdown"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[180px]">
              <li
                  v-for="status in statusFilters"
                  :key="status.value"
                  @click="selectStatusFilter(status.value)"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  :class="selectedStatus === status.value ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700'"
              >
                <i :class="status.icon" class="ml-2"></i>
                {{ status.label }}
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Projects Grid - Responsive -->
    <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div
          v-for="project in paginatedProjects"
          :key="project.id"
          class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <!-- Project Image -->
        <div class="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
          <div class="absolute inset-0 flex items-center justify-center">
            <img
                :src="project.image"
                alt="تصویر پروژه"
                class="object-cover w-full h-full"
            />
          </div>

          <div class="absolute top-4 right-4">
            <span
                class="px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm"
                :class="getStatusBadgeClass(project.status)"
            >
              {{ getStatusLabel(project.status) }}
            </span>
          </div>
          <div class="absolute top-4 left-4">
            <button
                @click="toggleFavorite(project.id)"
                class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              <i
                  :class="project.isFavorite ? 'ti ti-heart-filled text-red-500' : 'ti ti-heart text-gray-600'"
                  class="text-lg"
              ></i>
            </button>
          </div>
        </div>

        <!-- Project Content -->
        <div class="p-4 sm:p-6">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{{ project.title }}</h3>
            <span
                class="mr-2 px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap"
                :class="project.type === 'financial'
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'"
            >
              <i :class="project.type === 'financial' ? 'ti ti-coin' : 'ti ti-heart-handshake'"></i>
              {{ project.type === 'financial' ? 'قرار مالی' : 'قرار دورهمی' }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>

          <!-- Progress Bar - فقط برای قرارهای مالی -->
          <div v-if="project.type === 'financial'" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">پیشرفت: {{ project.progress }}%</span>
              <span v-if="project.supporters >0" class="text-sm text-gray-600">{{ project.supporters }} حامی</span>
              <span v-else class="text-sm text-gray-600">فعلاً هیچ حامی ندارد</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getProgressBarClass(project.progress)"
                  :style="{ width: project.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Volunteer Info - برای قرارهای دورهمی -->
          <div v-else class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center gap-2 text-sm text-blue-700 mb-2">
              <i class="ti ti-calendar-event"></i>
              <span class="font-semibold">{{ project.eventDate }}</span>
              <span class="mx-1">|</span>
              <i class="ti ti-clock"></i>
              <span>{{ project.eventTime }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-blue-600">
              <i class="ti ti-map-pin"></i>
              <span>{{ project.location }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-blue-600 mt-2">
              <i class="ti ti-users"></i>
              <span>{{ project.supporters }} داوطلب ثبت‌نام شده</span>
            </div>
          </div>

          <!-- Amount Info - فقط برای مالی -->
          <div v-if="project.type === 'financial'"
               class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500 mb-1">جمع‌آوری شده</p>
              <p class="text-lg font-bold text-purple-600">{{ formatCurrency(project.current) }}</p>
            </div>
            <div class="text-left">
              <p class="text-xs text-gray-500 mb-1">هدف</p>
              <p class="text-lg font-bold text-gray-900">{{ formatCurrency(project.goal) }}</p>
            </div>
          </div>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
            <div class="flex items-center gap-1">
              <i class="ti ti-calendar"></i>
              <span>{{ project.startDate }}</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="ti ti-clock"></i>
              <span>{{ project.duration }}</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="ti ti-user"></i>
              <span>{{ project.manager }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
                @click="viewProject(project)"
                class="flex-1 px-4 py-2.5 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors text-sm"
            >
              <i class="ti ti-eye ml-1"></i>
              مشاهده
            </button>
            <button
                @click="editProject(project)"
                class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <i class="ti ti-edit ml-1"></i>
              ویرایش
            </button>
            <button
                @click="toggleProjectStatus(project)"
                class="px-4 py-2.5 font-medium rounded-lg transition-colors text-sm"
                :class="project.status === 'active'
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'"
                :title="project.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'"
            >
              <i :class="project.status === 'active' ? 'ti ti-player-pause' : 'ti ti-player-play'"></i>
            </button>
            <button
                @click="deleteProject(project)"
                class="px-4 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
        <i class="ti ti-briefcase text-4xl text-purple-600"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">قرار مهربانی‌ای یافت نشد</h3>
      <p class="text-gray-600 mb-6">هنوز قرار مهربانی‌ای در سیستم ثبت نشده است</p>
      <button @click="createNewProject" class="btn-primary">
        <i class="ti ti-plus ml-2"></i>
        افزودن اولین قرار مهربانی
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
      >
        <i class="ti ti-chevron-right"></i>
      </button>

      <div class="flex gap-2">
        <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
            :class="currentPage === page ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ page }}
        </button>
      </div>

      <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
      >
        <i class="ti ti-chevron-left"></i>
      </button>
    </div>

    <!-- View Project Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showProjectModal"
             class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
             @click.self="showProjectModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <i class="ti ti-briefcase text-2xl"></i>
                  <h3 class="text-xl font-bold">جزئیات قرار مهربانی</h3>
                </div>
                <button @click="showProjectModal = false"
                        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                  <i class="ti ti-x text-xl"></i>
                </button>
              </div>
            </div>

            <div v-if="selectedProject" class="p-6 space-y-6">
              <!-- Title & Status -->
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedProject.title }}</h2>
                  <div class="flex items-center gap-2 mb-3">
                    <span
                        class="px-3 py-1 text-xs font-bold rounded-full"
                        :class="selectedProject.type === 'financial'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                        : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'"
                    >
                      <i :class="selectedProject.type === 'financial' ? 'ti ti-coin' : 'ti ti-heart-handshake'"></i>
                      {{ selectedProject.type === 'financial' ? 'قرار مالی' : 'قرار دورهمی' }}
                    </span>
                  </div>
                  <p class="text-gray-600">{{ selectedProject.description }}</p>
                </div>
                <span class="px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap"
                      :class="getStatusBadgeClass(selectedProject.status)">
                  {{ getStatusLabel(selectedProject.status) }}
                </span>
              </div>

              <!-- Progress - فقط برای قرارهای مالی -->
              <div v-if="selectedProject.type === 'financial'"
                   class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-lg font-bold text-purple-700">پیشرفت قرار مهربانی</span>
                  <span class="text-3xl font-bold text-purple-600">{{ selectedProject.progress }}%</span>
                </div>
                <div class="w-full bg-white rounded-full h-4 overflow-hidden mb-4">
                  <div class="h-full rounded-full transition-all duration-500"
                       :class="getProgressBarClass(selectedProject.progress)"
                       :style="{ width: selectedProject.progress + '%' }"></div>
                </div>
                <div class="flex justify-between text-sm">
                  <div>
                    <p class="text-purple-600 mb-1">جمع‌آوری شده</p>
                    <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(selectedProject.current) }}</p>
                    <p class="text-xs text-purple-600">تومان</p>
                  </div>
                  <div class="text-left">
                    <p class="text-purple-600 mb-1">هدف</p>
                    <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(selectedProject.goal) }}</p>
                    <p class="text-xs text-gray-600">تومان</p>
                  </div>
                </div>
              </div>

              <!-- Event Info - برای قرارهای دورهمی -->
              <div v-else class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h3 class="text-lg font-bold text-blue-700 mb-4">اطلاعات قرار دورهمی</h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-3 text-blue-700">
                    <i class="ti ti-calendar-event text-xl"></i>
                    <div>
                      <p class="text-xs text-blue-600">تاریخ رویداد</p>
                      <p class="font-bold">{{ selectedProject.eventDate }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-blue-700">
                    <i class="ti ti-clock text-xl"></i>
                    <div>
                      <p class="text-xs text-blue-600">ساعت شروع</p>
                      <p class="font-bold">{{ selectedProject.eventTime }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-blue-700">
                    <i class="ti ti-map-pin text-xl"></i>
                    <div>
                      <p class="text-xs text-blue-600">محل برگزاری</p>
                      <p class="font-bold">{{ selectedProject.location }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-blue-700">
                    <i class="ti ti-users text-xl"></i>
                    <div>
                      <p class="text-xs text-blue-600">داوطلبان ثبت‌نام شده</p>
                      <p class="font-bold">{{ selectedProject.supporters }} نفر</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-if="selectedProject.type === 'financial'" class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">تعداد حامیان</p>
                  <p class="text-2xl font-bold text-gray-900">{{ selectedProject.supporters }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">مدیر قرار مهربانی</p>
                  <p class="font-semibold text-gray-900">{{ selectedProject.manager }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">تاریخ شروع</p>
                  <p class="font-semibold text-gray-900">{{ selectedProject.startDate }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">مدت زمان</p>
                  <p class="font-semibold text-gray-900">{{ selectedProject.duration }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4">
                <button @click="editProject(selectedProject); showProjectModal = false"
                        class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium">
                  <i class="ti ti-edit ml-2"></i>
                  ویرایش قرار مهربانی
                </button>
                <button @click="deleteProject(selectedProject); showProjectModal = false"
                        class="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium">
                  <i class="ti ti-trash ml-2"></i>
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Project Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
             @click.self="showEditModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl z-50">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold">ویرایش قرار مهربانی</h3>
                <button @click="showEditModal = false"
                        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                  <i class="ti ti-x text-xl"></i>
                </button>
              </div>
            </div>

            <form @submit.prevent="saveEditProject" class="p-6">
              <div class="space-y-4">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">عنوان قرار مهربانی <span
                      class="text-red-500">*</span></label>
                  <input v-model="editForm.title" required type="text"
                         class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات <span
                      class="text-red-500">*</span></label>
                  <textarea v-model="editForm.description" required rows="3"
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                </div>

                <!-- Image Upload -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    تصویر قرار مهربانی
                  </label>
                  <div class="flex items-start gap-4">
                    <!-- Preview -->
                    <div v-if="editForm.image" class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img :src="editForm.image" alt="Preview" class="w-full h-full object-cover">
                      <button
                          @click="removeImage"
                          type="button"
                          class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <i class="ti ti-x text-sm"></i>
                      </button>
                    </div>

                    <!-- Upload Button -->
                    <div class="flex-1">
                      <input
                          ref="fileInput"
                          type="file"
                          accept="image/*"
                          @change="handleImageUpload"
                          class="hidden"
                      >
                      <button
                          @click="$refs.fileInput.click()"
                          type="button"
                          class="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-center"
                      >
                        <i class="ti ti-upload text-3xl text-gray-400 mb-2"></i>
                        <p class="text-sm font-medium text-gray-700">انتخاب تصویر</p>
                        <p class="text-xs text-gray-500 mt-1">PNG, JPG تا 5MB</p>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Amount Grid -->
                <div v-if="editForm.type === 'financial'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">هدف مالی (تومان) <span
                        class="text-red-500">*</span></label>
                    <input v-model.number="editForm.goal" required type="number" min="1000" step="1000"
                           class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">مبلغ جمع‌آوری شده (تومان)</label>
                    <input v-model.number="editForm.current" type="number" min="0" step="1000"
                           class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Volunteer Fields - Only for Volunteer Type -->
                  <template v-if="editForm.type === 'volunteer'">
                    <!-- Location -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        محل برگزاری <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                            v-model="editForm.location"
                            type="text"
                            :required="editForm.type === 'volunteer'"
                            placeholder="مثال: پارک ملت - درب شمالی"
                            class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        <i class="ti ti-map-pin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>

                    <!-- Event Date -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        تاریخ برگزاری <span class="text-red-500">*</span>
                      </label>
                      <input
                          v-model="editForm.eventDate"
                          type="text"
                          :required="editForm.type === 'volunteer'"
                          placeholder="مثال: 1404/02/28"
                          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          dir="ltr"
                      >
                      <p class="text-xs text-gray-500 mt-1">تاریخ شمسی - مثال: 28 اردیبهشت 1404</p>
                    </div>

                    <!-- Event Time -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        ساعت شروع <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                            v-model="editForm.eventTime"
                            type="text"
                            :required="editForm.type === 'volunteer'"
                            placeholder="مثال: 10:00 صبح"
                            class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        <i class="ti ti-clock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">زمان پایان مشخص نیست</p>
                    </div>
                    <!-- Manager -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        مدیر قرار مهربانی <span class="text-red-500">*</span>
                      </label>
                      <input
                          v-model="editForm.manager"
                          type="text"
                          required
                          placeholder="نام مدیر"
                          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                    </div>
                  </template>
                  <!-- Date Fields - Only for Financial Type -->
                  <template v-if="editForm.type === 'financial'">
                    <!-- Manager -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        مدیر قرار مهربانی <span class="text-red-500">*</span>
                      </label>
                      <input
                          v-model="editForm.manager"
                          type="text"
                          required
                          placeholder="نام مدیر"
                          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                    </div>
                    <!-- Start Date -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        تاریخ شروع <span class="text-red-500">*</span>
                      </label>
                      <PersianDatePicker
                          v-model="editForm.startDate"
                          :type="'date'"
                          :display-format="'jYYYY/jMM/jDD'"
                          :format="'YYYY/MM/DD'"
                          placeholder="انتخاب تاریخ شروع..."
                          :auto-submit="true"
                      />
                      <p class="text-xs text-gray-500 mt-1">با کلیک روی فیلد، تقویم شمسی باز می‌شود</p>
                    </div>

                    <!-- Start Time -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        ساعت شروع <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                            v-model="editForm.startTime"
                            type="text"
                            required
                            placeholder="09:00"
                            class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            dir="ltr"
                        >
                        <i class="ti ti-clock absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">فرمت: ساعت:دقیقه (مثال: 14:30)</p>
                    </div>

                    <!-- End Date -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        تاریخ پایان <span class="text-red-500">*</span>
                      </label>
                      <PersianDatePicker
                          v-model="editForm.endDate"
                          :type="'date'"
                          :display-format="'jYYYY/jMM/jDD'"
                          :format="'YYYY/MM/DD'"
                          placeholder="انتخاب تاریخ پایان..."
                          :auto-submit="true"
                      />
                      <p class="text-xs text-gray-500 mt-1">با کلیک روی فیلد، تقویم شمسی باز می‌شود</p>
                    </div>

                    <!-- End Time -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        ساعت پایان <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                            v-model="editForm.endTime"
                            type="text"
                            required
                            placeholder="18:00"
                            class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            dir="ltr"
                        >
                        <i class="ti ti-clock-hour-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">فرمت: ساعت:دقیقه (مثال: 23:59)</p>
                    </div>

                    <!-- Auto calculated duration -->
                    <div v-if="calculatedDuration" class="md:col-span-2">
                      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <i class="ti ti-clock text-blue-600 text-2xl mt-0.5"></i>
                        <div class="flex-1">
                          <p class="text-sm font-bold text-blue-900 mb-1">مدت زمان کامل قرار</p>
                          <p class="text-lg font-bold text-blue-700">{{ calculatedDuration }}</p>
                          <div v-if="editForm.startDate && editForm.startTime && editForm.endDate && editForm.endTime" class="mt-2 pt-2 border-t border-blue-200">
                            <div class="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span class="text-blue-600">شروع:</span>
                                <span class="font-medium text-blue-900 mr-1">{{ editForm.startDate }} ساعت {{ editForm.startTime }}</span>
                              </div>
                              <div>
                                <span class="text-blue-600">پایان:</span>
                                <span class="font-medium text-blue-900 mr-1">{{ editForm.endDate }} ساعت {{ editForm.endTime }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Countdown Timer Settings - Only for Financial -->
                    <div class="md:col-span-2">
                      <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-4">
                          <div class="flex items-center gap-2">
                            <i class="ti ti-alarm text-purple-600 text-xl"></i>
                            <h3 class="font-bold text-gray-900">تایمر شمارش معکوس</h3>
                          </div>
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                v-model="editForm.showTimer"
                                type="checkbox"
                                class="sr-only peer"
                            >
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div v-if="editForm.showTimer" class="space-y-4">
                          <!-- Timer Display Type -->
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                              نوع نمایش تایمر
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                              <label class="relative flex items-center p-3 bg-white border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                                     :class="editForm.timerType === 'countdown' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                                <input
                                    v-model="editForm.timerType"
                                    type="radio"
                                    value="countdown"
                                    class="sr-only"
                                >
                                <div class="flex items-center gap-2">
                                  <i class="ti ti-hourglass-high text-xl" :class="editForm.timerType === 'countdown' ? 'text-purple-600' : 'text-gray-400'"></i>
                                  <span class="text-sm font-medium" :class="editForm.timerType === 'countdown' ? 'text-purple-900' : 'text-gray-700'">شمارش معکوس</span>
                                </div>
                              </label>
                              <label class="relative flex items-center p-3 bg-white border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                                     :class="editForm.timerType === 'progress' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                                <input
                                    v-model="editForm.timerType"
                                    type="radio"
                                    value="progress"
                                    class="sr-only"
                                >
                                <div class="flex items-center gap-2">
                                  <i class="ti ti-progress text-xl" :class="editForm.timerType === 'progress' ? 'text-purple-600' : 'text-gray-400'"></i>
                                  <span class="text-sm font-medium" :class="editForm.timerType === 'progress' ? 'text-purple-900' : 'text-gray-700'">نوار پیشرفت</span>
                                </div>
                              </label>
                            </div>
                          </div>

                          <!-- Timer Preview -->
                          <div v-if="timerPreview" class="bg-white border border-purple-200 rounded-lg p-4">
                            <p class="text-xs text-gray-500 mb-2">پیش‌نمایش تایمر</p>
                            <div class="flex items-center justify-center gap-2">
                              <div v-for="(unit, label) in timerPreview" :key="label"
                                   class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-3 min-w-[60px] text-center">
                                <p class="text-2xl font-bold">{{ unit }}</p>
                                <p class="text-xs mt-1">{{ label }}</p>
                              </div>
                            </div>
                          </div>

                          <!-- Timer Alert Settings -->
                          <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <input
                                  v-model="editForm.timerAlert"
                                  type="checkbox"
                                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                              >
                              <span>هشدار قبل از پایان</span>
                            </label>
                            <div v-if="editForm.timerAlert" class="mr-6">
                              <select
                                  v-model="editForm.alertDays"
                                  class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              >
                                <option value="1">1 روز قبل</option>
                                <option value="3">3 روز قبل</option>
                                <option value="7">1 هفته قبل</option>
                                <option value="14">2 هفته قبل</option>
                                <option value="30">1 ماه قبل</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت <span
                        class="text-red-500">*</span></label>
                    <select v-model="editForm.status" required
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="active">در حال اجرا</option>
                      <option value="pending">در انتظار</option>
                      <option value="completed">تکمیل شده</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>
                  <!-- Show on Homepage -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      نمایش در صفحه اصلی
                    </label>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                          v-model="editForm.showOnHomepage"
                          type="checkbox"
                          class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                      <span class="ms-3 text-sm font-medium text-gray-700">
              {{ editForm.showOnHomepage ? 'فعال' : 'غیرفعال' }}
            </span>
                    </label>
                    <p class="text-xs text-gray-500 mt-1">این قرار در صفحه اصلی نمایش داده شود</p>
                  </div>

                  <!-- Category -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      دسته‌بندی
                    </label>
                    <select
                        v-model="editForm.category"
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="">انتخاب دسته‌بندی</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.title">
                        {{ cat.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button type="button" @click="showEditModal = false"
                        class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  انصراف
                </button>
                <button type="submit"
                        class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium">
                  <i class="ti ti-check ml-2"></i>
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useKindnessMeetingStore} from "@/stores/kindness-meeting.ts";
import PersianDatePicker from "@/components/PersianDatePicker.vue";
import {toGregorianDate} from "@/utils/date.ts";
import {useCategoryStore} from "@/stores/category.ts";

const router = useRouter()
const kindnessStore = useKindnessMeetingStore();
// State
const showStatusDropdown = ref(false)
const showTypeDropdown = ref(false)
const showProjectModal = ref(false)
const showEditModal = ref(false)
const selectedProject = ref(null)
const imageFile = ref(null)
const fileInput = ref(null)
const categoryStore = useCategoryStore()
const categories=computed(()=>categoryStore.categories)
const timerPreview = computed(() => {
  if (!editForm.value.endDate || !editForm.value.showTimer) return null

  const totalMinutes = minutesBetweenDates(
      editForm.value.startDate || '1403/08/01',
      editForm.value.startTime || '00:00',
      editForm.value.endDate,
      editForm.value.endTime || '23:59'
  )

  if (totalMinutes <= 0) return null

  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  const months = Math.floor(days / 30)
  const remainingDays = days % 30

  return {
    'ماه': months.toString().padStart(2, '0'),
    'روز': remainingDays.toString().padStart(2, '0'),
    'ساعت': hours.toString().padStart(2, '0'),
    'دقیقه': minutes.toString().padStart(2, '0')
  }
})
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('حجم فایل نباید بیشتر از 5 مگابایت باشد')
    return
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('لطفا یک فایل تصویری انتخاب کنید')
    return
  }

  imageFile.value = file
  editForm.value.image = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    editForm.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}
const removeImage = () => {
  imageFile.value = null
  editForm.value.image = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Parse time string to minutes
const parseTime = (timeStr) => {
  if (!timeStr || !timeStr.match(/^\d{1,2}:\d{2}$/)) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Parse Persian date (YYYY/MM/DD) to object
const parsePersianDate = (dateStr) => {
  if (!dateStr || !dateStr.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) return null
  const [year, month, day] = dateStr.split('/').map(Number)
  return { year, month, day }
}

// Calculate total minutes between two Persian dates with times
const minutesBetweenDates = (startDate, startTime, endDate, endTime) => {
  if (!startDate || !endDate) return 0

  const start = parsePersianDate(startDate)
  const end = parsePersianDate(endDate)

  if (!start || !end) return 0

  // Calculate days (simple approximation: 30 days per month)
  const startDays = start.year * 365 + start.month * 30 + start.day
  const endDays = end.year * 365 + end.month * 30 + end.day
  const daysDiff = endDays - startDays

  // Add time difference
  const startMinutes = parseTime(startTime)
  const endMinutes = parseTime(endTime)

  return (daysDiff * 24 * 60) + (endMinutes - startMinutes)
}
const calculatedDuration = computed(() => {
  if (!editForm.value.startDate || !editForm.value.endDate) return null

  const totalMinutes = minutesBetweenDates(
      editForm.value.startDate,
      editForm.value.startTime || '00:00',
      editForm.value.endDate,
      editForm.value.endTime || '23:59'
  )

  if (totalMinutes <= 0) return 'تاریخ و زمان پایان باید بعد از شروع باشد'

  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  let result = []

  if (days >= 365) {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    result.push(`${years} سال`)
    if (months > 0) result.push(`${months} ماه`)
  } else if (days >= 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    result.push(`${months} ماه`)
    if (remainingDays > 0) result.push(`${remainingDays} روز`)
  } else if (days > 0) {
    result.push(`${days} روز`)
  }

  if (days < 30) { // Show hours/minutes for shorter durations
    if (hours > 0) result.push(`${hours} ساعت`)
    if (minutes > 0) result.push(`${minutes} دقیقه`)
  }

  return result.join(' و ') || '0 دقیقه'
})
const editForm = ref({
  id: '',
  type:'',
  title: '',
  description: '',
  goal: 0,
  current: 0,
  manager: '',
  duration: '',
  startDate: '',
  endDate:'',
  startTime: '',
  endTime:'',
  image:'',
  location:'',
  showTimer:'',
  timerType:'',
  timerAlert:'',
  alertDays:'',
  eventDate:'',
  eventTime:'',
  showOnHomepage:'',
  category:'',
  status: 'active'
})
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedType = ref('all')
const currentPage = ref(1)
const itemsPerPage = 6

const statusFilters = [
  {value: 'all', label: 'همه قرارها', icon: 'ti ti-list'},
  {value: 'active', label: 'در حال اجرا', icon: 'ti ti-player-play'},
  {value: 'completed', label: 'تکمیل شده', icon: 'ti ti-check'},
  {value: 'pending', label: 'در انتظار', icon: 'ti ti-clock'},
  {value: 'cancelled', label: 'لغو شده', icon: 'ti ti-x'}
]

const typeFilters = [
  {value: 'all', label: 'همه انواع', icon: 'ti ti-list'},
  {value: 'financial', label: 'قرارهای مالی', icon: 'ti ti-coin'},
  {value: 'volunteer', label: 'قرارهای دورهمی', icon: 'ti ti-heart-handshake'}
]

const projects = ref([])

watch(
    () => kindnessStore.kindnessMeetings,
    (newValue) => {
      projects.value = newValue
    },
    { immediate: true } // برای مقداردهی اولیه
)

// Computed
const filteredProjects = computed(() => {
  let result = [...projects.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value !== 'all') {
    result = result.filter(p => p.status === selectedStatus.value)
  }

  if (selectedType.value !== 'all') {
    result = result.filter(p => p.type === selectedType.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' میلیون'
  }
  return (amount / 1000).toLocaleString('fa-IR') + ' هزار'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'در حال اجرا',
    completed: 'تکمیل شده',
    pending: 'در انتظار',
    cancelled: 'لغو شده'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-500/90 text-white',
    completed: 'bg-blue-500/90 text-white',
    pending: 'bg-yellow-500/90 text-white',
    cancelled: 'bg-red-500/90 text-white'
  }
  return classes[status] || 'bg-gray-500/90 text-white'
}

const getProgressBarClass = (progress) => {
  if (progress >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500'
  if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
  if (progress >= 30) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-red-500 to-rose-500'
}

const getStatusFilterLabel = () => {
  const filter = statusFilters.find(f => f.value === selectedStatus.value)
  return filter ? filter.label : 'همه قرارها'
}

const getTypeFilterLabel = () => {
  const filter = typeFilters.find(f => f.value === selectedType.value)
  return filter ? filter.label : 'همه انواع'
}

const selectStatusFilter = (value) => {
  selectedStatus.value = value
  showStatusDropdown.value = false
  currentPage.value = 1
}

const selectTypeFilter = (value) => {
  selectedType.value = value
  showTypeDropdown.value = false
  currentPage.value = 1
}

const toggleFavorite = (id) => {
  const project = projects.value.find(p => p.id === id)
  if (project) {
    project.isFavorite = !project.isFavorite
  }
}

const toggleProjectStatus = async (project) => {
  const newStatus = project.status === 'active' ? 'pending' : 'active'
  const statusText = newStatus === 'active' ? 'فعال' : 'غیرفعال'

  if (confirm(`آیا می‌خواهید قرار مهربانی "${project.title}" را ${statusText} کنید؟`)) {
    await kindnessStore.toggleKindnessMeetingStatus(project.id,newStatus)
    const index = projects.value.findIndex(p => p.id === project.id)
    if (index !== -1) {
      projects.value[index].status = newStatus
      alert(`✓ وضعیت قرار مهربانی به "${getStatusLabel(newStatus)}" تغییر یافت`)
    }
  }
}

const createNewProject = () => {
  router.push('/dashboard/hamian/projects/create')
}

const viewProject = (project) => {
  showProjectModal.value = true
  selectedProject.value = project
}

const editProject = (project) => {
  showEditModal.value = true
  editForm.value = {
    id: project.id,
    type:project.type,
    title: project.title,
    description: project.description,
    goal: project.goal,
    current: project.current,
    manager: project.manager,
    duration: project.duration,
    startDate: project.startDate,
    endDate:project.endDate,
    startTime: project.startTime,
    endTime:project.endTime,
    image:project.image,
    location:project.location,
    showTimer:project.showTimer,
    timerType: project.timerType,
    timerAlert: project.timerAlert,
    alertDays: project.alertDays,
    eventTime: project.eventTime,
    eventDate: project.eventDate,
    showOnHomepage:project.showOnHomepage,
    category:project.category.title,
    status: project.status
  }
}

const saveEditProject = () => {

  const selectedCategory = categories.value.find(
      c => c.slug === editForm.value.category || c.title === editForm.value.category
  )

  if (!selectedCategory) {
    alert('لطفاً یک دسته‌بندی معتبر انتخاب کنید!')
    return
  }
  const { id,duration,category, image, ...raw } = editForm.value
  const payload = {
    ...raw,
    categoryId: selectedCategory.id,
    startDate: raw.startDate ? toGregorianDate(raw.startDate) : undefined,
    endDate: raw.endDate ? toGregorianDate(raw.endDate) : undefined,
    eventDate: raw.eventDate ? toGregorianDate(raw.eventDate) : undefined,
  }
  const formData = new FormData()
  for (const key in payload) {
    formData.append(key, payload[key])
  }
  if (editForm.value.image) {
    if (typeof editForm.value.image === 'string' && editForm.value.image.startsWith('data:image')) {
      const mimeType = editForm.value.image.match(/data:(image\/[a-zA-Z]+);base64/)?.[1] || 'image/png'
      const file = base64ToFile(editForm.value.image, 'image.png', mimeType)
      formData.append('image', file)
    } else {
      formData.append('image', editForm.value.image)
    }
  }
  kindnessStore.updateKindnessMeeting(formData,editForm.value.id)
  const index = projects.value.findIndex(p => p.id === editForm.value.id)
  if (index !== -1) {
    const progress = Math.round((editForm.value.current / editForm.value.goal) * 100)
    projects.value[index] = {
      ...projects.value[index],
      ...editForm.value,
      progress
    }
    showEditModal.value = false
    alert('✓ قرار مهربانی با موفقیت ویرایش شد')
  }
}
function base64ToFile(base64, filename, mimeType) {
  const byteString = atob(base64.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new File([ab], filename, { type: mimeType })
}



const deleteProject = async (project) => {
  if (confirm(`آیا از حذف قرار مهربانی "${project.title}" اطمینان دارید؟\n\nتوجه: این عمل غیرقابل بازگشت است.`)) {
    await kindnessStore.removeKindnessMeeting(project.id)
    projects.value = projects.value.filter(p => p.id !== project.id)
    alert('✓ قرار مهربانی با موفقیت حذف شد')
  }
}

const exportToExcel = () => {
  // Create CSV content
  const headers = ['ردیف', 'عنوان قرار مهربانی', 'نوع', 'توضیحات', 'هدف (تومان)', 'جمع‌آوری شده (تومان)', 'پیشرفت (%)', 'تعداد حامیان/داوطلبان', 'مدیر', 'تاریخ شروع', 'مدت زمان', 'وضعیت']
  const rows = filteredProjects.value.map((p, index) => [
    index + 1,
    p.title,
    p.type === 'financial' ? 'قرار مالی' : 'قرار دورهمی',
    p.description,
    p.goal,
    p.current,
    p.progress,
    p.supporters,
    p.manager,
    p.startDate,
    p.duration,
    getStatusLabel(p.status)
  ])

  // Convert to CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Add BOM for UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], {type: 'text/csv;charset=utf-8;'})

  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `projects_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

// Close dropdowns
const handleClickOutside = () => {
  showStatusDropdown.value = false
}

onMounted(async () => {
  await kindnessStore.fetchKindnessMeetings()
  await categoryTypeStore.fetchType('danim')
  document.addEventListener('click', handleClickOutside)
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

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white, .modal-leave-to .bg-white {
  transform: scale(0.9);
}

.btn-primary {
  padding: 0.625rem 1.5rem;
  background: linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247));
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(to right, rgb(126, 34, 206), rgb(147, 51, 234));
}

.btn-secondary {
  padding: 0.625rem 1.5rem;
  background: white;
  color: rgb(107, 114, 128);
  font-weight: 500;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgb(249, 250, 251);
  border-color: rgb(209, 213, 219);
  color: rgb(75, 85, 99);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
