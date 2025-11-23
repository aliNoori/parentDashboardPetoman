<template>
  <FilmIndex @back="handleBack" />
</template>

<script setup>
import { defineEmits } from 'vue'
import FilmIndex from './film/index.vue'

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
}
</script>
