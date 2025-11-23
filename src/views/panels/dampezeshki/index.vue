<template>
  <DampezeshkiLayout @back="$emit('back')">
    <template #default="{ currentView }">
      <Dashboard v-if="currentView === 'dashboard'" />
      <Appointments v-else-if="currentView === 'appointments'" />
      <Patients v-else-if="currentView === 'patients'" />
      <MedicineOrders v-else-if="currentView === 'medicine-orders'" />
      <Services v-else-if="currentView === 'services'" />
      <Finance v-else-if="currentView === 'finance'" />
    </template>
  </DampezeshkiLayout>
</template>

<script setup>
import { defineEmits } from 'vue'
import DampezeshkiLayout from '../../../layouts/DampezeshkiLayout.vue'
import Dashboard from './Dashboard.vue'
import Appointments from './Appointments.vue'
import Patients from './Patients.vue'
import MedicineOrders from './MedicineOrders.vue'
import Services from './Services.vue'
import Finance from './Finance.vue'

const emit = defineEmits(['back'])
</script>
