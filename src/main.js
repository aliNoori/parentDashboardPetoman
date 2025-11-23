import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import axiosPlugin from './plugins/axiosPlugins.ts'
import {createPinia} from "pinia";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: { template: '<div></div>' },
        meta: { activePanel: null }
      },
      {
        path: 'test',
        name: 'TestPanel',
        component: { template: '<div></div>' },
        meta: { activePanel: 'test' }
      },
      {
        path: 'danim',
        name: 'DanimDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim' }
      },
      {
        path: 'danim/posts',
        name: 'DanimPosts',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'posts' }
      },
      {
        path: 'danim/posts/create',
        name: 'DanimPostCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'posts', activeView: 'create' }
      },
      {
        path: 'danim/posts/edit/:id',
        name: 'DanimPostEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'posts', activeView: 'edit' }
      },
      {
        path: 'danim/pages',
        name: 'DanimPages',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'pages' }
      },
      {
        path: 'danim/pages/create',
        name: 'DanimPageCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'pages', activeView: 'create' }
      },
      {
        path: 'danim/pages/edit/:id',
        name: 'DanimPageEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'pages', activeView: 'edit' }
      },
      {
        path: 'danim/categories',
        name: 'DanimCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'categories' }
      },
      {
        path: 'danim/tags',
        name: 'DanimTags',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'tags' }
      },
      {
        path: 'danim/users',
        name: 'DanimUsers',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'users' }
      },
      {
        path: 'danim/settings',
        name: 'DanimSettings',
        component: { template: '<div></div>' },
        meta: { activePanel: 'danim', activeSection: 'settings' }
      },
      // Hamian Routes
      {
        path: 'hamian',
        name: 'HamianDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian' }
      },
      {
        path: 'hamian/donations',
        name: 'HamianDonations',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'donations' }
      },
      {
        path: 'hamian/donations/create',
        name: 'HamianDonationCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'donations', activeView: 'create' }
      },
      {
        path: 'hamian/projects',
        name: 'HamianProjects',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'projects' }
      },
      {
        path: 'hamian/projects/create',
        name: 'HamianProjectCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'projects', activeView: 'create' }
      },
      {
        path: 'hamian/supporters',
        name: 'HamianSupporters',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'supporters' }
      },
      {
        path: 'hamian/supporters/create',
        name: 'HamianSupporterCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'supporters', activeView: 'create' }
      },
      {
        path: 'hamian/faqs',
        name: 'HamianFaqs',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'faqs' }
      },
      {
        path: 'hamian/faqs/categories',
        name: 'HamianFaqCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'faq-categories' }
      },
      {
        path: 'hamian/documentaries',
        name: 'HamianDocumentaries',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentaries' }
      },
      {
        path: 'hamian/documentaries/categories',
        name: 'HamianDocumentaryCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentary-categories' }
      },
      {
        path: 'hamian/documentaries/create',
        name: 'HamianDocumentaryCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentaries', activeView: 'create' }
      },
      {
        path: 'hamian/documentaries/edit',
        name: 'HamianDocumentaryEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'documentaries', activeView: 'edit' }
      },
      {
        path: 'hamian/pages',
        name: 'HamianPages',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'pages' }
      },
      {
        path: 'hamian/pages/create',
        name: 'HamianPageCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'pages', activeView: 'create' }
      },
      {
        path: 'hamian/pages/edit/:id',
        name: 'HamianPageEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'pages', activeView: 'edit' }
      },
      {
        path: 'hamian/users',
        name: 'HamianUsers',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'users' }
      },
      {
        path: 'hamian/reports',
        name: 'HamianReports',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'reports' }
      },
      {
        path: 'hamian/settings',
        name: 'HamianSettings',
        component: { template: '<div></div>' },
        meta: { activePanel: 'hamian', activeSection: 'settings' }
      },
      // Film Routes
      {
        path: 'film',
        name: 'FilmDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film' }
      },
      {
        path: 'film/videos',
        name: 'FilmVideos',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'videos' }
      },
      {
        path: 'film/video-add',
        name: 'FilmVideoAdd',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'video-add' }
      },
      {
        path: 'film/categories',
        name: 'FilmCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'categories' }
      },
      {
        path: 'film/series',
        name: 'FilmSeries',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'series' }
      },
      {
        path: 'film/series/create',
        name: 'FilmSeriesCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'series', activeView: 'create' }
      },
      {
        path: 'film/series/edit/:id',
        name: 'FilmSeriesEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'series', activeView: 'edit' }
      },
      {
        path: 'film/movies',
        name: 'FilmMovies',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movies' }
      },
      {
        path: 'film/movies/create',
        name: 'FilmMovieCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movies', activeView: 'create' }
      },
      {
        path: 'film/movies/edit/:id',
        name: 'FilmMovieEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movies', activeView: 'edit' }
      },
      {
        path: 'film/movies/categories',
        name: 'FilmMovieCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movie-categories' }
      },
      {
        path: 'film/movies/tags',
        name: 'FilmMovieTags',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movie-tags' }
      },
      {
        path: 'film/movies/faq',
        name: 'FilmMovieFAQ',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'movie-faq' }
      },
      {
        path: 'film/comments',
        name: 'FilmComments',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'comments' }
      },
      {
        path: 'film/posts',
        name: 'FilmPosts',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'posts' }
      },
      {
        path: 'film/posts/create',
        name: 'FilmPostCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'posts', activeView: 'create' }
      },
      {
        path: 'film/posts/edit/:id',
        name: 'FilmPostEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'posts', activeView: 'edit' }
      },
      {
        path: 'film/posts/categories',
        name: 'FilmPostCategories',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'post-categories' }
      },
      {
        path: 'film/posts/tags',
        name: 'FilmPostTags',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'post-tags' }
      },
      {
        path: 'film/pages',
        name: 'FilmPages',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'pages' }
      },
      {
        path: 'film/pages/create',
        name: 'FilmPageCreate',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'pages', activeView: 'create' }
      },
      {
        path: 'film/pages/edit/:id',
        name: 'FilmPageEdit',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'pages', activeView: 'edit' }
      },
      {
        path: 'film/users',
        name: 'FilmUsers',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'users' }
      },
      {
        path: 'film/settings',
        name: 'FilmSettings',
        component: { template: '<div></div>' },
        meta: { activePanel: 'film', activeSection: 'settings' }
      },
      // Dampezeshki Routes
      {
        path: 'dampezeshki',
        name: 'DampezeshkiDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'dampezeshki' }
      },
      // Market Routes
      {
        path: 'market',
        name: 'MarketDashboard',
        component: { template: '<div></div>' },
        meta: { activePanel: 'market' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
  } else if (to.path === '/' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(axiosPlugin)
app.mount('#app')
