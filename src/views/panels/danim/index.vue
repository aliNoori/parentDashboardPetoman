<template>
  <DanimLayout @back="$emit('back')" ref="danimLayout">
    <template #default="{ currentView }">
      <Dashboard v-if="currentView === 'dashboard'" @navigate="handleNavigate" />
      <Posts v-else-if="currentView === 'posts'" />
      <AddPost v-else-if="currentView === 'add-post'" />
      <PostEdit v-else-if="currentView === 'post-edit'" />
      <PostCreate v-else-if="currentView === 'post-create'" />
      <Categories v-else-if="currentView === 'categories'" />
      <Tags v-else-if="currentView === 'tags'" />
      <Users v-else-if="currentView === 'users'" />
      <Pages v-else-if="currentView === 'pages'" />
      <PageCreate v-else-if="currentView === 'page-create'" />
      <PageEdit v-else-if="currentView === 'page-edit'" />
      <Settings v-else-if="currentView === 'settings'" />
    </template>
  </DanimLayout>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import DanimLayout from '../../../layouts/DanimLayout.vue'
import Dashboard from './Dashboard.vue'
import Posts from './Posts.vue'
import AddPost from './AddPost.vue'
import PostEdit from './PostEdit.vue'
import PostCreate from './PostCreate.vue'
import Categories from './Categories.vue'
import Tags from './Tags.vue'
import Users from './Users.vue'
import Pages from './Pages.vue'
import PageCreate from './PageCreate.vue'
import PageEdit from './PageEdit.vue'
import Settings from './Settings.vue'

const emit = defineEmits(['back'])
const danimLayout = ref(null)

const handleNavigate = (view) => {
  // Call the navigation method on DanimLayout to change view
  if (danimLayout.value && danimLayout.value.navigateTo) {
    danimLayout.value.navigateTo(view)
  }
}
</script>
