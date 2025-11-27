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
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">افزودن کمک جدید</h1>
          <p class="text-sm text-gray-600 mt-1">ثبت کمک مالی جدید</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Supporter Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نام حامی <span class="text-red-500">*</span>
          </label>
          <select
              v-model="form.supporter"
              required
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">انتخاب حامی</option>
            <option v-for="supporter in supporters" :key="supporter.id" :value="supporter.name">
              {{ supporter.name }} - {{ supporter.typeLabel }}
            </option>
          </select>
        </div>

        <!-- Project -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            قرار مهربانی <span class="text-red-500">*</span>
          </label>
          <select
              v-model="form.project"
              required
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">انتخاب پروژه</option>
            <option v-for="project in activeProjects" :key="project.id" :value="project.title">
              {{ project.title }}
            </option>
          </select>
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            مبلغ (تومان) <span class="text-red-500">*</span>
          </label>
          <input
              v-model.number="form.amount"
              type="number"
              required
              min="1000"
              step="1000"
              placeholder="5000000"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            روش پرداخت <span class="text-red-500">*</span>
          </label>
          <select
              v-model="form.method"
              required
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">انتخاب روش پرداخت</option>
            <option value="نقدی">نقدی</option>
            <option value="کارت به کارت">کارت به کارت</option>
            <option value="چک">چک</option>
          </select>
        </div>

        <!-- Conditional Fields for Card Transfer -->
        <div v-if="form.method === 'کارت به کارت'"
             class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              کد رهگیری تراکنش <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.trackingCode"
                type="text"
                required
                placeholder="123456789012"
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              زمان تراکنش <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.transactionTime"
                type="text"
                required
                placeholder="1403/08/15 - 14:30"
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Conditional Field for Check -->
        <div v-if="form.method === 'چک'" class="md:col-span-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            شماره چک <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.checkNumber"
              type="text"
              required
              placeholder="1234567890"
              class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            تاریخ <span class="text-red-500">*</span>
          </label>
          <PersianDatePicker
              v-model="form.date"
              :type="'date'"
              :display-format="'jYYYY/jMM/jDD'"
              :format="'YYYY/MM/DD'"
              placeholder="انتخاب تاریخ ..."
              :auto-submit="true"
          />
          <p class="text-xs text-gray-500 mt-1">با کلیک روی فیلد، تقویم شمسی باز می‌شود</p>
        </div>

        <!-- Time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ساعت <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.time"
              type="text"
              required
              placeholder="14:30"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            وضعیت <span class="text-red-500">*</span>
          </label>
          <select
              v-model="form.status"
              required
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="completed">تکمیل شده</option>
            <option value="pending">در انتظار تایید</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>

        <!-- Note -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            یادداشت
          </label>
          <textarea
              v-model="form.note"
              rows="4"
              placeholder="توضیحات اضافی..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
            class="flex-1 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          <i class="ti ti-device-floppy ml-2"></i>
          ذخیره کمک
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useDonationStore} from "@/stores/donation.ts";
import {useSupporterStore} from "@/stores/supporter.ts";
import {useKindnessMeetingStore} from "@/stores/kindness-meeting.ts";
import {toGregorianDate} from "@/utils/date.ts";
import PersianDatePicker from "@/components/PersianDatePicker.vue";

const router = useRouter()
const donationStore = useDonationStore()
const supporterStore = useSupporterStore()
const kindnessMeetingStore = useKindnessMeetingStore()
// Mock data - در حالت واقعی از API یا Store دریافت می‌شود
/*const supporters = ref([
  {
    id: 1,
    name: 'احمد محمدی',
    type: 'financial',
    typeLabel: 'حامی مالی'
  },
  {
    id: 2,
    name: 'فاطمه احمدی',
    type: 'operational',
    typeLabel: 'حامی عملیاتی'
  },
  {
    id: 3,
    name: 'محمد رضایی',
    type: 'financial',
    typeLabel: 'حامی مالی'
  },
  {
    id: 4,
    name: 'سارا کریمی',
    type: 'honorary',
    typeLabel: 'حامی افتخاری'
  },
  {
    id: 5,
    name: 'علی حسینی',
    type: 'financial',
    typeLabel: 'حامی مالی'
  }
])*/
const supporters = computed(() => supporterStore.supporterCases)
/*const projects = ref([
  {
    id: 1,
    title: 'کمک به حیوانات خیابانی',
    status: 'active'
  },
  {
    id: 2,
    title: 'درمان حیوانات آسیب‌دیده',
    status: 'active'
  },
  {
    id: 3,
    title: 'غذا و مراقبت از گربه‌های ولگرد',
    status: 'active'
  },
  {
    id: 4,
    title: 'واکسیناسیون حیوانات',
    status: 'pending'
  },
  {
    id: 5,
    title: 'ساخت پناهگاه حیوانات',
    status: 'active'
  }
])*/
const projects = computed(() => kindnessMeetingStore.kindnessMeetings)
// فقط پروژه‌های فعال
const activeProjects = computed(() => {
  return projects.value.filter(p => p.status === 'active')
})

const form = ref({
  supporter: '',
  project: '',
  amount: '',
  method: '',
  date: '',
  time: '',
  status: 'completed',
  note: '',
  // Conditional fields
  trackingCode: '',
  transactionTime: '',
  checkNumber: ''
})

const handleSubmit = async () => {
  const selectedSupporter = supporters.value.find(s => s.name === form.value.supporter)
  const selectedProject = projects.value.find(p => p.title === form.value.project)

  if (!selectedSupporter || !selectedProject) {
    alert('❌ لطفاً حامی و پروژه معتبر انتخاب کنید')
    return
  }

  const payload = {
    supporterId: selectedSupporter.id,
    projectId: selectedProject.id,
    amount: Number(form.value.amount),
    method:
        form.value.method === 'نقدی' ? 'cash' :
            form.value.method === 'کارت به کارت' ? 'card' :
                form.value.method === 'چک' ? 'check' : 'cash',
    status: form.value.status,
    date: toGregorianDate(form.value.date),
    time: form.value.time,
    note: form.value.note,
    trackingCode: form.value.trackingCode || undefined,
    transactionTime: form.value.transactionTime || undefined,
    checkNumber: form.value.checkNumber || undefined
  }

  await donationStore.addDonation(payload)

  await router.push('/dashboard/hamian/donations')
}

onMounted(async () => {
  await supporterStore.fetchSupporters()
  await kindnessMeetingStore.fetchKindnessMeetings()
})
</script>
