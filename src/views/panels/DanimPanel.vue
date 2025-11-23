<template>
  <DanimIndex @back="handleBack" />
</template>

<script setup>
import { defineEmits } from 'vue'
import DanimIndex from './danim/index.vue'

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
}
</script>
