<template>
  <DampezeshkiIndex @back="handleBack" />
</template>

<script setup>
import { defineEmits } from 'vue'
import DampezeshkiIndex from './dampezeshki/index.vue'

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
}
</script>
