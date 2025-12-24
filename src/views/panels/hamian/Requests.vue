<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

    <!-- Header -->
    <div class="px-6 py-5 border-b">
      <h2 class="text-lg font-bold text-gray-900">مدیریت مشارکت‌ها</h2>
      <p class="text-sm text-gray-500 mt-1">
        ثبت‌نام‌ها، درخواست‌ها و فعالیت‌های کاربران
      </p>
    </div>

    <!-- Tabs -->
    <div class="px-6 border-b">
      <div class="flex gap-6">
        <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="relative py-4 flex items-center gap-2 font-semibold"
        >
          {{ tab.label }}
          <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="activeTab === tab.key
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-600'"
          >
    {{ tab.count }}
  </span>
        </button>

      </div>
    </div>

    <!-- Search -->
    <div class="px-6 py-4 border-b bg-gray-50">
      <div class="relative max-w-md">
        <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
            v-model="search"
            type="text"
            placeholder="جستجو بر اساس نام، موبایل، ایمیل..."
            class="w-full pr-10 pl-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">

      <!-- TAB: Request Supporters -->
      <RequestSupporterTable
          v-if="activeTab === 'supporters'"
          :items="paginatedSupporters"
          @approve="approve"
          @reject="reject"
      />

      <!-- TAB: Kindness Meetups -->
      <KindnessMeetingRegistrationTable
          v-if="activeTab === 'meetups'"
          :items="paginatedRegisters"
      />

    </div>
    <div class="flex justify-between items-center mt-6">
  <span class="text-xs text-gray-500">
    صفحه {{ page }}
  </span>

      <div class="flex gap-2">
        <button
            @click="page--"
            :disabled="page === 1"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          قبلی
        </button>
        <button
            @click="page++"
            :disabled="page * perPage >= filteredSupporters.length"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          بعدی
        </button>
      </div>
    </div>

  </div>

</template>



<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue'
import { useRequestSupporterStore} from "../../../stores/request.ts";
import { useKindnessMeetingRegistrationStore} from "../../../stores/kindnessMeetingRegistrationStore.ts";
import KindnessMeetingRegistrationTable from "../../../components/meetups/KindnessMeetingRegistrationTable.vue";
import {useDebounce} from "../../../utils/useDebounce.ts";
import RequestSupporterTable from "../../../components/supporters/RequestSupporterTable.vue";

// stores
const supporterStore = useRequestSupporterStore()
const meetupStore = useKindnessMeetingRegistrationStore()

onMounted(() => {
  supporterStore.fetchRequests()
  meetupStore.fetchRegistrations()
})

const activeTab = ref('meetups')
const search = ref('')

// filters
const filteredSupporters = computed(() =>
    supporterStore.requests.filter(r =>
        `${r.firstName} ${r.lastName} ${r.phone}`
            .toLowerCase()
            .includes(search.value.toLowerCase())
    )
)

const filteredMeetups = computed(() =>
    meetupStore.registrations.filter(r =>
        `${r.fullName} ${r.mobile}`
            .toLowerCase()
            .includes(search.value.toLowerCase())
    )
)

// actions
const approve = id => supporterStore.approveRequest(id)
const reject = id => supporterStore.rejectRequest(id, 'رد توسط مدیر')


const debouncedSearch = useDebounce(search)

const page = ref(1)
const perPage = 10

const paginatedSupporters = computed(() => {
  const filtered = filteredSupporters.value
  const start = (page.value - 1) * perPage
  return filtered.slice(start, start + perPage)
})
const paginatedRegisters = computed(() => {
  const filtered = filteredMeetups.value
  const start = (page.value - 1) * perPage
  return filtered.slice(start, start + perPage)
})
const loadedTabs = ref<string[]>([])

watch(activeTab, tab => {
  if (!loadedTabs.value.includes(tab)) {
    loadedTabs.value.push(tab)

    if (tab === 'meetups') meetupStore.fetchRegistrations()
    if (tab === 'supporters') supporterStore.fetchRequests()
  }
}, { immediate: true })

const tabs = computed(() => [
  {
    key: 'meetups',
    label: 'قرارهای مهربانی',
    count: meetupStore.registrations.length
  },
  {
    key: 'supporters',
    label: 'درخواست حامیان',
    count: supporterStore.requests.filter(r => r.status === 'pending').length
  }
])


</script>

