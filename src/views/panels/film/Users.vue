<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
        <p class="text-gray-600 mt-1">مدیریت کاربران عادی و مدیران سیستم</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel" class="btn-secondary">
          <i class="ti ti-download ml-2"></i>
          خروجی Excel
        </button>
        <button @click="showAddModal = true" class="btn-primary">
          <i class="ti ti-user-plus ml-2"></i>
          کاربر جدید
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کل کاربران</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ users.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="ti ti-users text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">مدیران</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ adminCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="ti ti-crown text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">کاربران فعال</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ activeCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">آنلاین</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ onlineCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <i class="ti ti-circle-dot text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900">لیست کاربران</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام کاربر</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">یوزرنیم / موبایل</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نقش</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ عضویت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="users.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <i class="ti ti-users-off text-4xl mb-2 block"></i>
                <p>هنوز کاربری ثبت نشده است</p>
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" alt="" class="w-8 h-8 rounded-full">
                  <span class="font-medium">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="user.role === 'admin'" class="text-sm">
                  <div class="font-mono text-purple-600">@{{ user.username }}</div>
                  <div class="text-gray-500 text-xs mt-0.5">{{ user.phone }}</div>
                </div>
                <div v-else class="text-sm text-gray-700">
                  {{ user.phone }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.role === 'admin' ? 'مدیر' : 'کاربر' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs flex items-center gap-1 w-fit" :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  <i class="ti ti-circle-filled text-[6px]" :class="user.online ? 'text-green-500' : ''"></i>
                  {{ user.active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.joinDate }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button class="text-blue-600 hover:text-blue-800" title="ویرایش">
                    <i class="ti ti-edit"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-800" title="حذف">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showAddModal = false">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">افزودن کاربر جدید</h3>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام کامل *</label>
            <input
              v-model="newUser.name"
              type="text"
              placeholder="نام و نام خانوادگی"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">شماره موبایل *</label>
            <input
              v-model="newUser.phone"
              type="tel"
              placeholder="09123456789"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              maxlength="11"
            >
          </div>

          <div v-if="newUser.role === 'admin'">
            <label class="block text-sm font-medium text-gray-700 mb-2">یوزرنیم *</label>
            <div class="relative">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                v-model="newUser.username"
                type="text"
                placeholder="username"
                class="w-full pr-8 pl-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل *</label>
            <input
              v-model="newUser.email"
              type="email"
              placeholder="example@email.com"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رمز عبور *</label>
            <input
              v-model="newUser.password"
              type="password"
              placeholder="حداقل 8 کاراکتر"
              class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نقش *</label>
            <div class="relative">
              <button
                @click="showRoleDropdown = !showRoleDropdown"
                type="button"
                class="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-right hover:border-purple-300 transition-colors flex items-center justify-between"
              >
                <span>{{ newUser.role === 'admin' ? 'مدیر' : 'کاربر عادی' }}</span>
                <i class="ti ti-chevron-down"></i>
              </button>
              <ul
                v-show="showRoleDropdown"
                class="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
              >
                <li
                  @click="selectRole('user')"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': newUser.role === 'user' }"
                >
                  کاربر عادی
                </li>
                <li
                  @click="selectRole('admin')"
                  class="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  :class="{ 'bg-purple-50 text-purple-600 font-medium': newUser.role === 'admin' }"
                >
                  مدیر
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center">
            <input
              v-model="newUser.active"
              type="checkbox"
              id="active"
              class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            >
            <label for="active" class="mr-2 text-sm text-gray-700">کاربر فعال باشد</label>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showAddModal = false" class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            انصراف
          </button>
          <button @click="addUser" class="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            افزودن کاربر
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../../../composables/useToast'

const toast = useToast()

const users = ref([
  {
    id: 1,
    name: 'علی احمدی',
    username: 'ali_ahmadi',
    phone: '09121234567',
    email: 'ali.ahmadi@example.com',
    role: 'admin',
    active: true,
    online: true,
    joinDate: '1403/06/15',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'سارا محمدی',
    phone: '09129876543',
    email: 'sara.mohammadi@example.com',
    role: 'user',
    active: true,
    online: true,
    joinDate: '1403/06/20',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 3,
    name: 'حسین رضایی',
    phone: '09135551234',
    email: 'hossein.rezaei@example.com',
    role: 'user',
    active: true,
    online: false,
    joinDate: '1403/07/01',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 4,
    name: 'مریم کریمی',
    username: 'maryam_k',
    phone: '09191112233',
    email: 'maryam.karimi@example.com',
    role: 'admin',
    active: true,
    online: true,
    joinDate: '1403/07/10',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 5,
    name: 'محمد نوری',
    phone: '09123334455',
    email: 'mohammad.noori@example.com',
    role: 'user',
    active: false,
    online: false,
    joinDate: '1403/07/15',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 6,
    name: 'فاطمه حسینی',
    phone: '09365556677',
    email: 'fatemeh.hosseini@example.com',
    role: 'user',
    active: true,
    online: false,
    joinDate: '1403/08/01',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: 7,
    name: 'امیر صادقی',
    phone: '09177778899',
    email: 'amir.sadeghi@example.com',
    role: 'user',
    active: true,
    online: true,
    joinDate: '1403/08/05',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 8,
    name: 'زهرا مرادی',
    username: 'zahra_admin',
    phone: '09389990011',
    email: 'zahra.moradi@example.com',
    role: 'admin',
    active: true,
    online: false,
    joinDate: '1403/08/10',
    avatar: 'https://i.pravatar.cc/150?img=20'
  }
])

const showAddModal = ref(false)
const showRoleDropdown = ref(false)

const newUser = ref({
  name: '',
  phone: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
  active: true
})

const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const activeCount = computed(() => users.value.filter(u => u.active).length)
const onlineCount = computed(() => users.value.filter(u => u.online).length)

const selectRole = (role) => {
  newUser.value.role = role
  showRoleDropdown.value = false
}

const addUser = () => {
  // Validation
  if (!newUser.value.name || !newUser.value.phone || !newUser.value.email || !newUser.value.password) {
    toast.warning('لطفاً همه فیلدها را پر کنید', 'نام، موبایل، ایمیل و رمز عبور الزامی هستند')
    return
  }

  // Validate phone number
  if (!/^09\d{9}$/.test(newUser.value.phone)) {
    toast.error('شماره موبایل نامعتبر است', 'فرمت صحیح: 09123456789')
    return
  }

  // Check admin username
  if (newUser.value.role === 'admin' && !newUser.value.username) {
    toast.warning('یوزرنیم برای مدیر الزامی است', 'لطفاً یوزرنیم را وارد کنید')
    return
  }

  if (newUser.value.password.length < 8) {
    toast.error('رمز عبور باید حداقل 8 کاراکتر باشد', 'رمز عبور ضعیف است')
    return
  }

  // Check duplicate email
  if (users.value.some(u => u.email === newUser.value.email)) {
    toast.error('این ایمیل قبلاً ثبت شده است', 'لطفاً ایمیل دیگری وارد کنید')
    return
  }

  // Check duplicate phone
  if (users.value.some(u => u.phone === newUser.value.phone)) {
    toast.error('این شماره موبایل قبلاً ثبت شده است', 'لطفاً شماره دیگری وارد کنید')
    return
  }

  // Check duplicate username for admins
  if (newUser.value.role === 'admin' && users.value.some(u => u.username === newUser.value.username)) {
    toast.error('این یوزرنیم قبلاً استفاده شده است', 'لطفاً یوزرنیم دیگری انتخاب کنید')
    return
  }

  const user = {
    id: users.value.length + 1,
    name: newUser.value.name,
    phone: newUser.value.phone,
    email: newUser.value.email,
    role: newUser.value.role,
    active: newUser.value.active,
    online: false,
    joinDate: new Date().toLocaleDateString('fa-IR'),
    avatar: `https://i.pravatar.cc/150?img=${users.value.length + 1}`
  }

  // Add username only for admins
  if (newUser.value.role === 'admin') {
    user.username = newUser.value.username
  }

  users.value.push(user)
  toast.success('کاربر جدید اضافه شد!', `${user.name} با موفقیت ثبت شد`)
  
  // Reset form
  newUser.value = {
    name: '',
    phone: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    active: true
  }
  
  showAddModal.value = false
}

const exportToExcel = () => {
  toast.info('در حال خروجی گرفتن...', 'فایل Excel در حال آماده‌سازی است')
  console.log('Export to Excel')
}
</script>

<style scoped>
.btn-primary {
  background-color: #9333ea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}
</style>
