<template>
  <div class="bg-white rounded-xl p-6 border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-600 text-sm">{{ title }}</p>
        <p class="text-2xl font-bold mt-1" :class="valueColor">
          {{ value }}
        </p>
      </div>

      <div
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="iconBg"
      >
        <i :class="`ti ${icon} text-xl`" :style="{ color: iconColor }"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
  icon: string
  color?: 'purple' | 'orange' | 'green' | 'red'
}

const props = defineProps<Props>()

const colorMap = {
  purple: {
    text: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: '#9333ea'
  },
  orange: {
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: '#ea580c'
  },
  green: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    icon: '#16a34a'
  },
  red: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    icon: '#dc2626'
  }
}

const activeColor = computed(() => colorMap[props.color || 'purple'])

const valueColor = computed(() => activeColor.value.text)
const iconBg = computed(() => activeColor.value.bg)
const iconColor = computed(() => activeColor.value.icon)
</script>
