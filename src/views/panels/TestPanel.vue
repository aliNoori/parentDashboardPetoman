<template>
  <div class="p-8 bg-green-100 text-center">
    <h1 class="text-2xl font-bold text-green-800">✅ تست کامپوننت</h1>
    <p class="mt-4 text-green-600">اگر این متن رو می‌بینید، یعنی routing کار می‌کنه!</p>
    <div class="mt-6 space-x-4">
      <button @click="$emit('back')" class="bg-blue-500 text-white px-4 py-2 rounded">
        بازگشت
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['back'])
</script>