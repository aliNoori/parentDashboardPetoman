<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <i class="ti ti-paw text-4xl text-white"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">داشبورد والدین</h1>
        <p class="text-gray-600">به پنل مدیریت خود خوش آمدید</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              نام کاربری یا ایمیل
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="ti ti-user text-gray-400"></i>
              </div>
              <input
                v-model="username"
                type="text"
                required
                class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              رمز عبور
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="ti ti-lock text-gray-400"></i>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="رمز عبور خود را وارد کنید"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span class="text-sm text-gray-600">مرا به خاطر بسپار</span>
            </label>
            <a href="#" class="text-sm text-orange-600 hover:text-orange-700 font-medium">
              فراموشی رمز عبور
            </a>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600 flex items-center gap-2">
              <i class="ti ti-alert-circle"></i>
              {{ errorMessage }}
            </p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="!loading" class="ti ti-login"></i>
            <i v-else class="ti ti-loader-2 animate-spin"></i>
            {{ loading ? 'در حال ورود...' : 'ورود به داشبورد' }}
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            حساب کاربری ندارید؟
            <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">ثبت نام کنید</a>
          </p>
        </div>
      </div>

      <!-- Copyright -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">© 2025 پتومن. تمامی حقوق محفوظ است.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from "@/stores/auth.ts";
import {useNotificationStore} from "@/stores/notification.ts";
const notificationStore = useNotificationStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const authStore=useAuthStore()
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  const success = await authStore.login(username.value, password.value)

  loading.value = false

  if (success) {
    await router.push('/dashboard')
  } else {
    errorMessage.value = authStore.error || 'نام کاربری یا رمز عبور اشتباه است'
  }
}

</script>
