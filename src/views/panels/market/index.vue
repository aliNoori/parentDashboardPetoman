<template>
  <MarketLayout @back="$emit('back')">
    <template #default="{ currentView }">
      <Dashboard v-if="currentView === 'dashboard'" />
      <Products v-else-if="currentView === 'products'" />
      <Orders v-else-if="currentView === 'orders'" />
      <Customers v-else-if="currentView === 'customers'" />
      <Analytics v-else-if="currentView === 'analytics'" />
    </template>
  </MarketLayout>
</template>

<script setup>
import { defineEmits } from 'vue'
import MarketLayout from '../../../layouts/MarketLayout.vue'
import Dashboard from './Dashboard.vue'
import Products from './Products.vue'
import Orders from './Orders.vue'
import Customers from './Customers.vue'
import Analytics from './Analytics.vue'

const emit = defineEmits(['back'])
</script>
