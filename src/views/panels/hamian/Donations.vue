<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">مدیریت کمک‌ها</h1>
        <p class="text-sm text-gray-600 mt-1">{{ filteredDonations.length }} کمک در سیستم</p>
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
            @click="createNewDonation"
            class="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <i class="ti ti-plus"></i>
          <span>افزودن کمک جدید</span>
        </button>
      </div>
    </div>

    <!-- Filters & Search - Mobile Optimized -->
    <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در کمک‌ها..."
                class="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
            >
          </div>
        </div>

        <!-- Status Filter -->
        <div class="relative">
          <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <span>{{ getStatusFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>

          <!-- Status Dropdown -->
          <Transition name="dropdown">
            <ul v-if="showStatusDropdown"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
              <li
                  v-for="status in statusFilters"
                  :key="status.value"
                  @click="selectStatusFilter(status.value)"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  :class="selectedStatus === status.value ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700'"
              >
                {{ status.label }}
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Sort -->
        <div class="relative">
          <button
              @click="showSortDropdown = !showSortDropdown"
              class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <i class="ti ti-sort-descending"></i>
            <span>{{ getSortLabel() }}</span>
            <i class="ti ti-chevron-down text-sm"></i>
          </button>

          <!-- Sort Dropdown -->
          <Transition name="dropdown">
            <ul v-if="showSortDropdown"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
              <li
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  :class="selectedSort === option.value ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700'"
              >
                {{ option.label }}
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Donations Grid - Responsive -->
    <div v-if="filteredDonations.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div
          v-for="donation in paginatedDonations"
          :key="donation.id"
          class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-visible relative"
      >
        <div class="p-4 sm:p-5">
          <!-- Header with Icon & Status -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                <i class="ti ti-coin text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">{{ donation.supporter }}</h3>
                <span
                    class="inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1"
                    :class="getStatusClass(donation.status)"
                >
                  {{ getStatusLabel(donation.status) }}
                </span>
              </div>
            </div>

            <!-- Actions Dropdown -->
            <div class="relative">
              <button
                  @click.stop="toggleActionsDropdown(donation.id)"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i class="ti ti-dots-vertical text-gray-600"></i>
              </button>

              <!-- Actions Dropdown Menu -->
              <Transition name="dropdown">
                <ul v-if="activeActionsDropdown === donation.id"
                    class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                  <li
                      @click="viewDonation(donation)"
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  >
                    <i class="ti ti-eye text-blue-600"></i>
                    <span>مشاهده جزئیات</span>
                  </li>
                  <li
                      @click="editDonation(donation)"
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  >
                    <i class="ti ti-edit text-green-600"></i>
                    <span>ویرایش</span>
                  </li>
                  <li
                      @click="printReceipt(donation)"
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                  >
                    <i class="ti ti-printer text-purple-600"></i>
                    <span>چاپ رسید</span>
                  </li>
                  <li
                      @click="deleteDonation(donation)"
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 cursor-pointer text-sm transition-colors text-red-600"
                  >
                    <i class="ti ti-trash"></i>
                    <span>حذف</span>
                  </li>
                </ul>
              </Transition>
            </div>
          </div>

          <!-- Project Info -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="ti ti-briefcase text-rose-600"></i>
              <span class="truncate">{{ donation.project }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <i class="ti ti-calendar"></i>
                <span>{{ donation.date }}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="ti ti-clock"></i>
                <span>{{ donation.time }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1 text-xs text-gray-500">
              <i class="ti ti-credit-card"></i>
              <span>{{ donation.method }}</span>
            </div>
          </div>

          <!-- Note -->
          <div v-if="donation.note" class="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
            <i class="ti ti-note text-rose-600 ml-1"></i>
            {{ donation.note }}
          </div>

          <!-- Amount -->
          <div class="pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">مبلغ کمک:</span>
              <div class="text-left">
                <p class="text-xl font-bold text-rose-600">{{ formatCurrency(donation.amount) }}</p>
                <p class="text-xs text-gray-500">تومان</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <i class="ti ti-coin text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">کمکی یافت نشد</h3>
      <p class="text-gray-600 mb-6">هنوز کمکی در سیستم ثبت نشده است</p>
      <button @click="createNewDonation" class="btn-primary">
        <i class="ti ti-plus ml-2"></i>
        افزودن اولین کمک
      </button>
    </div>

    <!-- Pagination - Mobile Optimized -->
    <div v-if="totalPages > 1" class="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
      <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 1
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-gray-700 hover:bg-gray-100'"
      >
        <i class="ti ti-chevron-right ml-1"></i>
        قبلی
      </button>

      <div class="flex items-center gap-2">
        <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
            :class="currentPage === page
            ? 'bg-rose-600 text-white' 
            : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ page }}
        </button>
      </div>

      <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === totalPages
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-gray-700 hover:bg-gray-100'"
      >
        بعدی
        <i class="ti ti-chevron-left mr-1"></i>
      </button>
    </div>

    <!-- View Donation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDonationModal"
             class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
             @click.self="showDonationModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold">جزئیات کمک</h3>
                <button @click="showDonationModal = false"
                        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                  <i class="ti ti-x text-xl"></i>
                </button>
              </div>
            </div>

            <div v-if="selectedDonation" class="p-6 space-y-6">
              <!-- Amount Card -->
              <div
                  class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
                <p class="text-sm text-green-700 mb-2">مبلغ کمک</p>
                <p class="text-4xl font-bold text-green-600">{{ formatCurrency(selectedDonation.amount) }}</p>
                <p class="text-sm text-green-600 mt-1">تومان</p>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">شماره رسید</p>
                  <p class="font-semibold text-gray-900">{{ selectedDonation.id }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">وضعیت</p>
                  <span class="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                        :class="getStatusClass(selectedDonation.status)">
                    {{ getStatusLabel(selectedDonation.status) }}
                  </span>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">نام حامی</p>
                  <p class="font-semibold text-gray-900">{{ selectedDonation.supporter }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">پروژه</p>
                  <p class="font-semibold text-gray-900">{{ selectedDonation.project }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">روش پرداخت</p>
                  <p class="font-semibold text-gray-900">{{ selectedDonation.method }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">تاریخ</p>
                  <p class="font-semibold text-gray-900">{{ selectedDonation.date }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-1">ساعت</p>
                  <p class="font-semibold text-gray-900">{{ selectedDonation.time }}</p>
                </div>
              </div>

              <!-- Note -->
              <div v-if="selectedDonation.note" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p class="text-xs text-blue-700 mb-2 font-medium">یادداشت</p>
                <p class="text-sm text-blue-900">{{ selectedDonation.note }}</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4">
                <button @click="printReceipt(selectedDonation); showDonationModal = false"
                        class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium">
                  <i class="ti ti-printer ml-2"></i>
                  چاپ رسید
                </button>
                <button @click="editDonation(selectedDonation); showDonationModal = false"
                        class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium">
                  <i class="ti ti-edit ml-2"></i>
                  ویرایش
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Donation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
             @click.self="showEditModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold">ویرایش کمک</h3>
                <button @click="showEditModal = false"
                        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                  <i class="ti ti-x text-xl"></i>
                </button>
              </div>
            </div>

            <form @submit.prevent="saveEditDonation" class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Supporter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام حامی <span
                      class="text-red-500">*</span></label>
                  <input v-model="editForm.supporter"
                         disabled
                         class="bg-gray-100 cursor-not-allowed w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Project -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">پروژه <span class="text-red-500">*</span></label>
                  <input v-model="editForm.project"
                         disabled
                         class="bg-gray-100 cursor-not-allowed w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Amount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">مبلغ (تومان) <span
                      class="text-red-500">*</span></label>
                  <input v-model.number="editForm.amount"
                         required
                         :disabled="isLocked"
                         type="number" min="1000" step="1000"
                         class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Payment Method -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">روش پرداخت <span
                      class="text-red-500">*</span></label>
                  <select v-model="editForm.method"
                          required
                          :disabled="isLocked"
                          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="کارت به کارت">کارت به کارت</option>
                    <option value="نقدی">نقدی</option>
                    <option value="چک">چک</option>
                  </select>
                </div>

                <!-- Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تاریخ <span class="text-red-500">*</span></label>
                  <input v-model="editForm.date"
                         required
                         :disabled="isLocked"
                         type="text"
                         class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ساعت <span
                      class="text-red-500">*</span></label>
                  <input v-model="editForm.time"
                         required
                         :disabled="isLocked"
                         type="text"
                         class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت <span class="text-red-500">*</span></label>
                  <select v-model="editForm.status"
                          required
                          :disabled="isLocked"
                          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="completed">تکمیل شده</option>
                    <option value="pending">در انتظار</option>
                    <option value="cancelled">لغو شده</option>
                  </select>
                </div>

                <!-- Note -->
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">یادداشت</label>
                  <textarea v-model="editForm.note"
                            :disabled="isLocked"
                            rows="3"
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                </div>
              </div>
              <div v-if="isLocked" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                این کمک نهایی شده است و امکان ویرایش اطلاعات وجود ندارد.
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button type="button"
                        @click="showEditModal = false"
                        class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  انصراف
                </button>
                <button type="submit"
                        :disabled="isLocked"
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
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {useUserStore} from "@/stores/user.ts";
import {useDonationStore} from "@/stores/donation.ts";

const isLocked = ref(false)
const router = useRouter()
const userStore = useUserStore()
// Dropdowns State
const showStatusDropdown = ref(false)
const showSortDropdown = ref(false)
const activeActionsDropdown = ref(null)

// Modals State
const showDonationModal = ref(false)
const showEditModal = ref(false)
const selectedDonation = ref(null)
const editForm = ref({
  id: '',
  supporter: '',
  project: '',
  amount: 0,
  method: '',
  date: '',
  time: '',
  status: '',
  note: ''
})

// Filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedSort = ref('newest')

const statusFilters = [
  {value: 'all', label: 'همه کمک‌ها'},
  {value: 'completed', label: 'تکمیل شده'},
  {value: 'pending', label: 'در انتظار تایید'},
  {value: 'cancelled', label: 'لغو شده'}
]

const sortOptions = [
  {value: 'newest', label: 'جدیدترین'},
  {value: 'oldest', label: 'قدیمی‌ترین'},
  {value: 'amount_high', label: 'بیشترین مبلغ'},
  {value: 'amount_low', label: 'کمترین مبلغ'}
]

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const donations = computed(() => userStore.donations)
// Computed
const filteredDonations = computed(() => {
  let result = [...donations.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(d =>
        d.supporter.toLowerCase().includes(query) ||
        d.project.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(d => d.status === selectedStatus.value)
  }

  // Sort
  switch (selectedSort.value) {
    case 'oldest':
      result.reverse()
      break
    case 'amount_high':
      result.sort((a, b) => b.amount - a.amount)
      break
    case 'amount_low':
      result.sort((a, b) => a.amount - b.amount)
      break
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredDonations.value.length / itemsPerPage))

const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDonations.value.slice(start, end)
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
  return (amount / 10).toLocaleString('fa-IR')
}

const getStatusLabel = (status) => {
  const labels = {
    completed: 'تکمیل شده',
    pending: 'در انتظار',
    cancelled: 'لغو شده'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusFilterLabel = () => {
  const filter = statusFilters.find(f => f.value === selectedStatus.value)
  return filter ? filter.label : 'همه کمک‌ها'
}

const getSortLabel = () => {
  const option = sortOptions.find(o => o.value === selectedSort.value)
  return option ? option.label : 'مرتب‌سازی'
}

const selectStatusFilter = (value) => {
  selectedStatus.value = value
  showStatusDropdown.value = false
  currentPage.value = 1
}

const selectSort = (value) => {
  selectedSort.value = value
  showSortDropdown.value = false
  currentPage.value = 1
}

const toggleActionsDropdown = (id) => {
  activeActionsDropdown.value = activeActionsDropdown.value === id ? null : id
}

const createNewDonation = () => {
  router.push('/dashboard/hamian/donations/create')
}

const viewDonation = (donation) => {
  showDonationModal.value = true
  selectedDonation.value = donation
  activeActionsDropdown.value = null
}

const editDonation = (donation) => {
  showEditModal.value = true
  isLocked.value = donation.status === 'completed'
  editForm.value = {
    id: donation.id,
    supporter: donation.supporter,
    project: donation.project,
    amount: donation.amount,
    method: donation.method,
    date: donation.date,
    time: donation.time,
    status: donation.status,
    note: donation.note || ''
  }
  activeActionsDropdown.value = null
}

const printReceipt = (donation) => {
  // Create a printable receipt
  const receiptWindow = window.open('', '_blank')
  const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <title>رسید کمک</title>
  <style>
    body { font-family: Tahoma, Arial; padding: 40px; direction: rtl; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .header h1 { color: #e11d48; margin: 0; }
    .receipt-id { text-align: center; color: #666; margin: 20px 0; }
    .details { margin: 30px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ddd; }
    .label { font-weight: bold; color: #333; }
    .value { color: #666; }
    .amount { background: #f0fdf4; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px; }
    .amount-value { font-size: 32px; font-weight: bold; color: #10b981; }
    .footer { text-align: center; margin-top: 50px; color: #999; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>رسید کمک مالی</h1>
    <p>سیستم مدیریت حامیان پتومن</p>
  </div>
  <div class="receipt-id">شماره رسید: ${donation.id}</div>
  <div class="details">
    <div class="detail-row"><span class="label">نام حامی:</span><span class="value">${donation.supporter}</span></div>
    <div class="detail-row"><span class="label">پروژه:</span><span class="value">${donation.project}</span></div>
    <div class="detail-row"><span class="label">روش پرداخت:</span><span class="value">${donation.method}</span></div>
    <div class="detail-row"><span class="label">تاریخ:</span><span class="value">${donation.date}</span></div>
    <div class="detail-row"><span class="label">ساعت:</span><span class="value">${donation.time}</span></div>
    <div class="detail-row"><span class="label">وضعیت:</span><span class="value">${getStatusLabel(donation.status)}</span></div>
  </div>
  <div class="amount">
    <div style="margin-bottom: 10px; color: #666;">مبلغ کمک</div>
    <div class="amount-value">${formatCurrency(donation.amount)} تومان</div>
  </div>
  ${donation.note ? `<div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>یادداشت:</strong><br>${donation.note}</div>` : ''}
  <div class="footer">
    <p>با تشکر از همراهی شما</p>
    <p>این رسید به صورت الکترونیکی صادر شده است</p>
    <p>تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')}</p>
  </div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`
  receiptWindow.document.write(htmlContent)
  receiptWindow.document.close()
  activeActionsDropdown.value = null
}
const donationStore = useDonationStore()
const saveEditDonation = async () => {
  await donationStore.editDonation(editForm.value)
  const index = donations.value.findIndex(d => d.id === editForm.value.id)
  if (index !== -1) {
    showEditModal.value = false
    alert('✓ کمک با موفقیت ویرایش شد')
  }
}

const exportToExcel = () => {
  // Create CSV content
  const headers = ['ردیف', 'نام حامی', 'پروژه', 'مبلغ (تومان)', 'روش پرداخت', 'تاریخ', 'ساعت', 'وضعیت', 'یادداشت']
  const rows = filteredDonations.value.map((d, index) => [
    index + 1,
    d.supporter,
    d.project,
    d.amount,
    d.method,
    d.date,
    d.time,
    getStatusLabel(d.status),
    d.note || '-'
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
  link.setAttribute('download', `donations_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const deleteDonation = async (donation) => {
  if (confirm(`آیا از حذف کمک "${donation.supporter}" اطمینان دارید؟`)) {
    await donationStore.removeDonation(donation.id)
    userStore.removeDonation(donation.id)
  }
  activeActionsDropdown.value = null
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showStatusDropdown.value = false
    showSortDropdown.value = false
    activeActionsDropdown.value = null
  }
}

onMounted(async () => {
  await userStore.fetchSupportersWithDonations()
  document.addEventListener('click', handleClickOutside)
})

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
  background: linear-gradient(to right, rgb(225, 29, 72), rgb(219, 39, 119));
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(to right, rgb(190, 18, 60), rgb(190, 24, 93));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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

/* Fix overflow for dropdown visibility */
:deep(.grid) > div {
  overflow: visible !important;
}
</style>
