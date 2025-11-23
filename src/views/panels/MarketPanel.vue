<template>
  <MarketIndex @back="handleBack" />
</template>

<script setup>
import { defineEmits } from 'vue'
import MarketIndex from './market/index.vue'

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
}
</script>
