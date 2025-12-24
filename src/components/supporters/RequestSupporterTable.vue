<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">

    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-gray-600">
      <tr class="text-right">
        <th class="px-6 py-4 font-medium">کاربر</th>
        <th class="px-6 py-4 font-medium">نوع همکاری</th>
        <th class="px-6 py-4 font-medium">وضعیت</th>
        <th class="px-6 py-4 font-medium">تاریخ</th>
        <th class="px-6 py-4 font-medium text-left">اقدام</th>
      </tr>
      </thead>

      <tbody class="divide-y">
      <tr
          v-for="r in items"
          :key="r.id"
          class="hover:bg-gray-50 transition"
      >
        <!-- User -->
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              <img
                  v-if="r.avatar"
                  :src="r.avatar"
                  class="w-full h-full object-cover"
                  alt="avatar"
              />
              <span v-else class="font-bold text-gray-600">
                {{ r.firstName.charAt(0) }}
              </span>
            </div>

            <div>
              <div class="font-medium text-gray-900">
                {{ r.firstName }} {{ r.lastName }}
              </div>
              <div class="text-xs text-gray-500">
                {{ r.phone || r.email }}
              </div>
            </div>
          </div>
        </td>

        <!-- Type -->
        <td class="px-6 py-4">
          <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="typeClass(r.type)"
          >
            {{ typeLabel(r.type) }}
          </span>
        </td>

        <!-- Status -->
        <td class="px-6 py-4">
          <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              :class="statusClass(r.status)"
          >
            <span
                class="w-1.5 h-1.5 rounded-full"
                :class="statusDot(r.status)"
            />
            {{ statusLabel(r.status) }}
          </span>
        </td>

        <!-- Date -->
        <td class="px-6 py-4 text-gray-500">
          {{ new Date(r.createdAt).toLocaleDateString('fa-IR') }}
        </td>

        <!-- Actions -->
        <td class="px-6 py-4 text-left">
          <div class="flex gap-2">
            <button
                v-if="r.status === 'pending'"
                @click="$emit('approve', r.id)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700"
            >
              تأیید
            </button>

            <button
                v-if="r.status === 'pending'"
                @click="$emit('reject', r.id)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
            >
              رد
            </button>

            <span
                v-if="r.status !== 'pending'"
                class="text-xs text-gray-400 italic"
            >
              بررسی شده
            </span>
          </div>
        </td>
      </tr>

      <tr v-if="!items.length">
        <td colspan="5" class="py-10 text-center text-gray-400">
          درخواستی وجود ندارد
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: any[]
}>()

defineEmits<{
  (e: 'approve', id: string): void
  (e: 'reject', id: string): void
}>()

const typeLabel = (t: string) =>
    t === 'financial' ? 'حامی مالی' : t === 'volunteer' ? 'داوطلب' : 'مالی + داوطلب'

const typeClass = (t: string) =>
    t === 'financial'
        ? 'bg-green-100 text-green-700'
        : t === 'volunteer'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-purple-100 text-purple-700'

const statusLabel = (s: string) =>
    s === 'pending' ? 'در انتظار' : s === 'approved' ? 'تأیید شده' : 'رد شده'

const statusClass = (s: string) =>
    s === 'pending'
        ? 'bg-yellow-100 text-yellow-800'
        : s === 'approved'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'

const statusDot = (s: string) =>
    s === 'pending'
        ? 'bg-yellow-500'
        : s === 'approved'
            ? 'bg-green-500'
            : 'bg-red-500'
</script>