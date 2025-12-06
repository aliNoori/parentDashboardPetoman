<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </button>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">افزودن حامی جدید</h1>
          <p class="text-sm text-gray-600 mt-1">ثبت اطلاعات حامی</p>
        </div>
      </div>
    </div>

    <!-- User Select with Search -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">انتخاب کاربر</label>
      <input
          v-model="userSearch"
          type="text"
          placeholder="جستجو بر اساس نام یا ایمیل..."
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-1"
      />
      <select
          v-model="selectedUserId"
          @change="fillFormFromUser"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="" disabled selected>انتخاب کاربر...</option>
        <option
            v-for="u in filteredUsers"
            :key="u.id"
            :value="u.id"
        >
          {{ u.fullName }}
        </option>
      </select>
    </div>


    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نام و نام خانوادگی <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.name"
              type="text"
              required
              placeholder="احمد محمدی"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نوع حامی <span class="text-red-500">*</span>
          </label>
          <select
              v-model="form.type"
              required
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="financial">حامی مالی</option>
            <option value="volunteer">داوطلب</option>
            <option value="both">مالی و داوطلب</option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            شماره تماس <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.phone"
              type="tel"
              required
              dir="ltr"
              placeholder="09121234567"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
          >
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ایمیل <span class="text-gray-400 text-xs">(اختیاری)</span>
          </label>
          <input
              v-model="form.email"
              type="email"
              dir="ltr"
              placeholder="ahmad@example.com"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
          >
        </div>

        <!-- Join Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            تاریخ عضویت <span class="text-red-500">*</span>
          </label>
          <PersianDatePicker
              v-model="form.joinDate"
              :type="'date'"
              :display-format="'jYYYY/jMM/jDD'"
              :format="'YYYY/MM/DD'"
              placeholder="انتخاب تاریخ شروع..."
              :auto-submit="true"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            وضعیت <span class="text-red-500">*</span>
          </label>
          <select
              v-model="form.status"
              required
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
        </div>

        <!-- Initial Donation Amount (Optional) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            مبلغ کمک اولیه (تومان)
          </label>
          <input
              v-model.number="form.initialAmount"
              type="number"
              min="0"
              step="100000"
              placeholder="0"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <!-- Address -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            آدرس
          </label>
          <textarea
              v-model="form.address"
              rows="3"
              placeholder="آدرس کامل..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Notes -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            یادداشت
          </label>
          <textarea
              v-model="form.notes"
              rows="3"
              placeholder="توضیحات اضافی..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
            type="button"
            @click="$router.back()"
            class="flex-1 px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          انصراف
        </button>
        <button
            type="submit"
            class="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
        >
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره حامی
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useSupporterStore} from "@/stores/supporter.ts";
import jalaali from 'jalaali-js'
import PersianDatePicker from "@/components/PersianDatePicker.vue";
import {useUserStore} from "@/stores/user.ts";
const router = useRouter()

const form = ref({
  name: '',
  type: 'financial',
  phone: '',
  email: '',
  joinDate: '',
  status: 'active',
  initialAmount: 0,
  address: '',
  notes: ''
})

const supporterStore = useSupporterStore()


const convertToISO = (jalaliDate) => {
  const [jy, jm, jd] = jalaliDate.split('/').map(Number)
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd)
  return new Date(gy, gm - 1, gd).toISOString().split('T')[0] // فقط تاریخ بدون زمان
}


const handleSubmit = async () => {
  console.log('Form submitted:', form.value)
  // TODO: Save to API
  form.value.joinDate = convertToISO(form.value.joinDate)
  await supporterStore.addSupporter(form.value)

  console.log('supporter',supporterStore.supporter)

  alert('حامی با موفقیت ثبت شد!')
  await router.push('/dashboard/hamian/supporters')
}
const userStore=useUserStore()
const users=computed(()=>userStore.users)

const userSearch = ref('')
const selectedUserId = ref('')

const filteredUsers = computed(() => {
  const query = userSearch.value.toLowerCase()
  return users.value.filter(u =>
      u.fullName?.toLowerCase().includes(query) ||
      (u.email && u.email.toLowerCase().includes(query))
  )
})

// وقتی کاربری انتخاب شد، فرم پر شود
const fillFormFromUser = () => {
  const user = users.value.find(u => u.id === selectedUserId.value)
  if (!user) return

  form.value.name = user.fullName || ''
  form.value.email = user.email || ''
  form.value.phone = user.phoneNumber || ''
  form.value.address = user.address || ''
}

onMounted(async () => {
  await userStore.fetchAllUsers()
})
</script>
