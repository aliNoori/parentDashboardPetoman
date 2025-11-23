<template>
  <FilmLayout @back="$emit('back')" ref="filmLayout">
    <template #default="{ currentView }">
      <Dashboard v-if="currentView === 'dashboard'" @navigate="handleNavigate" />
      
      <!-- Movies and Series Combined -->
      <MoviesNew v-else-if="currentView === 'movies' || currentView === 'series'" />
      <MovieCreate v-else-if="currentView === 'movie-create' || currentView === 'add-movie'" />
      <MovieEdit v-else-if="currentView === 'movie-edit'" />
      <SeriesCreate v-else-if="currentView === 'series-create' || currentView === 'add-series'" />
      <SeriesEdit v-else-if="currentView === 'series-edit'" />
      <MovieCategories v-else-if="currentView === 'movie-categories'" />
      <MovieTags v-else-if="currentView === 'movie-tags'" />
      <MovieFAQ v-else-if="currentView === 'movie-faq'" />
      
      <!-- Pages Section -->
      <Pages v-else-if="currentView === 'pages'" />
      <PageCreate v-else-if="currentView === 'page-create' || currentView === 'add-page'" />
      <PageEdit v-else-if="currentView === 'page-edit'" />
      
      <!-- Posts Section -->
      <Posts v-else-if="currentView === 'posts'" />
      <PostCreate v-else-if="currentView === 'post-create' || currentView === 'add-post'" />
      <PostEdit v-else-if="currentView === 'post-edit'" />
      <PostCategories v-else-if="currentView === 'post-categories'" />
      <PostTags v-else-if="currentView === 'post-tags'" />
      
      <!-- Comments -->
      <Comments v-else-if="currentView === 'comments'" />
      
      <!-- Users -->
      <Users v-else-if="currentView === 'users'" />
      
      <!-- Settings -->
      <NewSettings v-else-if="currentView === 'settings'" />
    </template>
  </FilmLayout>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import FilmLayout from '../../../layouts/FilmLayout.vue'
import Dashboard from './Dashboard.vue'

// Movies and Series Combined
import MoviesNew from './MoviesNew.vue'
import MovieCreate from './MovieCreate.vue'
import MovieEdit from './MovieEdit.vue'
import SeriesCreate from './SeriesCreate.vue'
import SeriesEdit from './SeriesEdit.vue'
import MovieCategories from './MovieCategories.vue'
import MovieTags from './MovieTags.vue'
import MovieFAQ from './MovieFAQ.vue'

// Pages
import Pages from './Pages.vue'
import PageCreate from './PageCreate.vue'
import PageEdit from './PageEdit.vue'

// Posts
import Posts from './Posts.vue'
import PostCreate from './PostCreate.vue'
import PostEdit from './PostEdit.vue'
import PostCategories from './PostCategories.vue'
import PostTags from './PostTags.vue'

// Comments
import Comments from './Comments.vue'

// Users
import Users from './Users.vue'

// Settings
import NewSettings from './NewSettings.vue'

const emit = defineEmits(['back'])
const filmLayout = ref(null)

const handleNavigate = (view) => {
  if (filmLayout.value && filmLayout.value.navigateTo) {
    filmLayout.value.navigateTo(view)
  }
}
</script>
