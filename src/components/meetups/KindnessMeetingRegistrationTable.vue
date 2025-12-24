<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-gray-600">
      <tr class="text-right">
        <th class="px-6 py-4 font-medium">کاربر</th>
        <th class="px-6 py-4 font-medium">نوع مشارکت</th>
        <th class="px-6 py-4 font-medium">عنوان قرار</th>
        <th class="px-6 py-4 font-medium">مبلغ</th>
        <th class="px-6 py-4 font-medium">پیام</th>
        <th class="px-6 py-4 font-medium">تاریخ</th>
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
            <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold">
              {{ r.fullName.charAt(0) }}
            </div>
            <div>
              <div class="font-medium text-gray-900">{{ r.fullName }}</div>
              <div class="text-xs text-gray-500">{{ r.mobile }}</div>
            </div>
          </div>
        </td>

        <!-- Type -->
        <td class="px-6 py-4">
          <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="r.type === 'financial'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'"
          >
            {{ r.type === 'financial' ? 'مالی' : 'داوطلب' }}
          </span>
        </td>

        <!-- Title meeting -->
        <td class="px-6 py-4">
          {{ r.kindnessMeeting ? r.kindnessMeeting.title:''}}
        </td>

        <!-- Amount -->
        <td class="px-6 py-4 font-semibold text-green-600">
          {{ r.amount ? r.amount.toLocaleString('fa-IR') + ' تومان' : '—' }}
        </td>

        <!-- Message -->
        <td class="px-6 py-4 text-gray-600 max-w-xs truncate">
          {{ r.message || '—' }}
        </td>

        <!-- Date -->
        <td class="px-6 py-4 text-gray-500">
          {{ new Date(r.createdAt).toLocaleDateString('fa-IR') }}
        </td>
      </tr>

      <tr v-if="!items.length">
        <td colspan="5" class="py-10 text-center text-gray-400">
          موردی ثبت نشده است
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: any[] }>()
</script>