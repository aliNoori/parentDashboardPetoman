<template>
  <HamianIndex @back="handleBack" />
</template>

<script setup>
import { defineEmits } from 'vue'
import HamianIndex from './hamian/index.vue'

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
}
</script>
