<template>
  <HamianLayout @back="$emit('back')">
    <template #default="{ currentView, navigateTo }">
      <!-- Debug Log -->
      <div v-if="true" class="hidden">{{ logCurrentView(currentView) }}</div>
      
      <!-- Dashboard -->
      <Dashboard v-if="currentView === 'dashboard'" />
      
      <!-- Donations -->
      <Donations v-else-if="currentView === 'donations'" />
      <DonationCreate v-else-if="currentView === 'add-donation' || currentView === 'donation-create'" />
      
      <!-- Projects -->
      <Projects v-else-if="currentView === 'projects'" />
      <ProjectCreate v-else-if="currentView === 'add-project' || currentView === 'project-create'" />
      
      <!-- Supporters -->
      <Supporters v-else-if="currentView === 'supporters'" />
      <SupporterCreate v-else-if="currentView === 'add-supporter' || currentView === 'supporter-create'" />
      
      <!-- FAQs -->
      <Faqs v-else-if="currentView === 'faqs'" @navigate="navigateTo" />
      <FaqCategories v-else-if="currentView === 'faq-categories'" @navigate="navigateTo" />
      
      <!-- Documentaries -->
      <Documentaries v-else-if="currentView === 'documentaries'" @navigate="navigateTo" />
      <DocumentaryCategories v-else-if="currentView === 'documentary-categories'" @navigate="navigateTo" />
      <DocumentaryCreate v-else-if="currentView === 'documentary-create'" @navigate="navigateTo" />
      <!-- Pages -->
      <Pages v-else-if="currentView === 'pages'" />
      <PageCreate v-else-if="currentView === 'page-create'" />
      
      <!-- Users -->
      <Users v-else-if="currentView === 'users'" />
      
      <!-- Reports -->
      <Reports v-else-if="currentView === 'reports'" />
      
      <!-- Settings -->
      <Settings v-else-if="currentView === 'settings'" />

      <!-- Requests -->
      <Requests v-else-if="currentView === 'requests'" />
      
      <!-- Default -->
      <Dashboard v-else />
    </template>
  </HamianLayout>
</template>

<script setup>
import { defineEmits } from 'vue'
import HamianLayout from '../../../layouts/HamianLayout.vue'
import Dashboard from './Dashboard.vue'
import Donations from './Donations.vue'
import DonationCreate from './DonationCreate.vue'
import Projects from './Projects.vue'
import ProjectCreate from './ProjectCreate.vue'
import Supporters from './Supporters.vue'
import SupporterCreate from './SupporterCreate.vue'
import Faqs from './Faqs.vue'
import FaqCategories from './FaqCategories.vue'
import Documentaries from './Documentaries.vue'
import DocumentaryCategories from './DocumentaryCategories.vue'
import DocumentaryCreate from './DocumentaryCreate.vue'
import Pages from './Pages.vue'
import PageCreate from './PageCreate.vue'
import Reports from './Reports.vue'
import Settings from './Settings.vue'
import Users from './Users.vue'
import Requests from "./Requests.vue";

defineEmits(['back'])

const logCurrentView = (view) => {
  console.log('Hamian Panel - Current View:', view)
  return ''
}
</script>
