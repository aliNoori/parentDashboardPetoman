<template>
  <div class="space-y-4">
    <!-- Header با دکمه افزودن پت -->
    <div class="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2 flex items-center gap-2">
            <i class="ti ti-paw text-3xl"></i>
            مدیریت حیوانات دانیم
          </h1>
          <p class="text-white/80">مدیریت اطلاعات حیوانات خانگی در سیستم دانیم</p>
        </div>
        <button @click="showAddModal = true" class="bg-white text-orange-600 px-4 py-2 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2">
          <i class="ti ti-plus"></i>
          افزودن پت جدید
        </button>
      </div>
    </div>

    <!-- فیلترها و جستجو -->
    <div class="bg-white rounded-xl p-4 border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <!-- جستجو -->
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="جستجوی نام پت..."
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        <!-- فیلتر نوع حیوان -->
        <div class="relative">
          <button 
            @click="toggleDropdown('petType')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors"
          >
            <span class="text-sm">{{ selectedPetType || 'نوع حیوان' }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'petType' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'petType'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <li 
              @click="selectPetType('')"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              همه
            </li>
            <li 
              v-for="type in petTypes" 
              :key="type.id"
              @click="selectPetType(type.name)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
            >
              <span>{{ type.emoji }}</span>
              <span>{{ type.name }}</span>
            </li>
          </ul>
        </div>

        <!-- فیلتر سن -->
        <div class="relative">
          <button 
            @click="toggleDropdown('ageRange')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors"
          >
            <span class="text-sm">{{ selectedAgeRange || 'محدوده سنی' }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'ageRange' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'ageRange'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li 
              @click="selectAgeRange('')"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              همه
            </li>
            <li 
              v-for="range in ageRanges" 
              :key="range.value"
              @click="selectAgeRange(range.label)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {{ range.label }}
            </li>
          </ul>
        </div>

        <!-- فیلتر وضعیت -->
        <div class="relative">
          <button 
            @click="toggleDropdown('status')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors"
          >
            <span class="text-sm">{{ selectedStatus || 'وضعیت' }}</span>
            <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'status' ? 'rotate-180' : '']"></i>
          </button>
          <ul 
            v-if="openDropdown === 'status'"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li 
              @click="selectStatus('')"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              همه
            </li>
            <li 
              v-for="status in statusOptions" 
              :key="status.value"
              @click="selectStatus(status.label)"
              class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
            >
              <span :class="status.dotClass" class="w-2 h-2 rounded-full"></span>
              <span>{{ status.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- لیست پت‌ها -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">تصویر</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">نام پت</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">نوع</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">نژاد</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">سن</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">صاحب</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">وضعیت</th>
              <th class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="pet in filteredPets" :key="pet.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img :src="pet.image" :alt="pet.name" class="w-full h-full object-cover">
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="font-bold text-gray-900">{{ pet.name }}</div>
                <div class="text-xs text-gray-500">{{ pet.id }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-sm">
                  {{ pet.typeEmoji }} {{ pet.type }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ pet.breed }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ pet.age }}</td>
              <td class="px-4 py-3">
                <div class="text-sm font-medium text-gray-900">{{ pet.owner }}</div>
                <div class="text-xs text-gray-500">{{ pet.ownerContact }}</div>
              </td>
              <td class="px-4 py-3">
                <span :class="getStatusBadge(pet.status)">
                  {{ pet.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="relative">
                  <button 
                    @click="toggleActionMenu(pet.id)"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <i class="ti ti-dots-vertical text-gray-600"></i>
                  </button>
                  <ul 
                    v-if="openActionMenu === pet.id"
                    class="absolute left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-10"
                  >
                    <li 
                      @click="viewPet(pet)"
                      class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center gap-2 text-blue-600"
                    >
                      <i class="ti ti-eye"></i>
                      <span>مشاهده</span>
                    </li>
                    <li 
                      @click="editPet(pet)"
                      class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2 text-orange-600"
                    >
                      <i class="ti ti-edit"></i>
                      <span>ویرایش</span>
                    </li>
                    <li 
                      @click="deletePet(pet)"
                      class="px-4 py-2 hover:bg-red-50 cursor-pointer text-sm flex items-center gap-2 text-red-600 border-t border-gray-100"
                    >
                      <i class="ti ti-trash"></i>
                      <span>حذف</span>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          نمایش {{ filteredPets.length }} از {{ pets.length }} پت
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm">
            قبلی
          </button>
          <button class="px-3 py-1 bg-orange-600 text-white rounded-lg font-bold text-sm">
            1
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm">
            2
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm">
            بعدی
          </button>
        </div>
      </div>
    </div>

    <!-- Modal افزودن/ویرایش پت -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">افزودن پت جدید</h2>
          <button @click="showAddModal = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <i class="ti ti-x text-gray-600"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- فرم افزودن پت -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نام پت</label>
              <input 
                v-model="newPet.name"
                type="text" 
                placeholder="مثال: ماکس"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div class="relative">
              <label class="block text-sm font-bold text-gray-700 mb-2">نوع حیوان</label>
              <button 
                @click="toggleDropdown('newPetType')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
              >
                <span class="text-sm">{{ newPet.type || 'انتخاب نوع' }}</span>
                <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'newPetType' ? 'rotate-180' : '']"></i>
              </button>
              <ul 
                v-if="openDropdown === 'newPetType'"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                <li 
                  v-for="type in petTypes" 
                  :key="type.id"
                  @click="selectNewPetType(type)"
                  class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
                >
                  <span>{{ type.emoji }}</span>
                  <span>{{ type.name }}</span>
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نژاد</label>
              <input 
                v-model="newPet.breed"
                type="text" 
                placeholder="مثال: گلدن رتریور"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">سن</label>
              <input 
                v-model="newPet.age"
                type="text" 
                placeholder="مثال: 3 سال"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نام صاحب</label>
              <input 
                v-model="newPet.owner"
                type="text" 
                placeholder="نام و نام خانوادگی"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">شماره تماس</label>
              <input 
                v-model="newPet.ownerContact"
                type="text" 
                placeholder="09123456789"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div class="relative">
              <label class="block text-sm font-bold text-gray-700 mb-2">وضعیت</label>
              <button 
                @click="toggleDropdown('newPetStatus')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors text-right"
              >
                <span class="text-sm">{{ newPet.status || 'انتخاب وضعیت' }}</span>
                <i :class="['ti ti-chevron-down transition-transform', openDropdown === 'newPetStatus' ? 'rotate-180' : '']"></i>
              </button>
              <ul 
                v-if="openDropdown === 'newPetStatus'"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <li 
                  v-for="status in statusOptions" 
                  :key="status.value"
                  @click="selectNewPetStatus(status.label)"
                  class="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
                >
                  <span :class="status.dotClass" class="w-2 h-2 rounded-full"></span>
                  <span>{{ status.label }}</span>
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">URL تصویر</label>
              <input 
                v-model="newPet.image"
                type="text" 
                placeholder="https://..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">توضیحات</label>
            <textarea 
              v-model="newPet.description"
              rows="3"
              placeholder="توضیحات اضافی..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div class="flex items-center gap-3 pt-4">
            <button 
              @click="savePet"
              class="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors"
            >
              ذخیره پت
            </button>
            <button 
              @click="showAddModal = false"
              class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Dropdown state
const openDropdown = ref(null)
const openActionMenu = ref(null)
const showAddModal = ref(false)

// Filter states
const searchQuery = ref('')
const selectedPetType = ref('')
const selectedAgeRange = ref('')
const selectedStatus = ref('')

// Pet types
const petTypes = ref([
  { id: 1, name: 'سگ', emoji: '🐕' },
  { id: 2, name: 'گربه', emoji: '🐈' },
  { id: 3, name: 'پرنده', emoji: '🦜' },
  { id: 4, name: 'ماهی', emoji: '🐠' },
  { id: 5, name: 'خزنده', emoji: '🐢' },
  { id: 6, name: 'خرگوش', emoji: '🐰' },
])

// Age ranges
const ageRanges = ref([
  { value: 'baby', label: 'کمتر از 1 سال' },
  { value: 'young', label: '1 تا 3 سال' },
  { value: 'adult', label: '3 تا 7 سال' },
  { value: 'senior', label: 'بیشتر از 7 سال' },
])

// Status options
const statusOptions = ref([
  { value: 'active', label: 'فعال', dotClass: 'bg-green-500' },
  { value: 'inactive', label: 'غیرفعال', dotClass: 'bg-gray-400' },
  { value: 'medical', label: 'تحت درمان', dotClass: 'bg-red-500' },
])

// New pet data
const newPet = ref({
  name: '',
  type: '',
  breed: '',
  age: '',
  owner: '',
  ownerContact: '',
  status: '',
  image: '',
  description: ''
})

// Pets data
const pets = ref([
  {
    id: 'PET-001',
    name: 'ماکس',
    type: 'سگ',
    typeEmoji: '🐕',
    breed: 'گلدن رتریور',
    age: '3 سال',
    owner: 'محمد رضایی',
    ownerContact: '09121234567',
    status: 'فعال',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop'
  },
  {
    id: 'PET-002',
    name: 'لونا',
    type: 'گربه',
    typeEmoji: '🐈',
    breed: 'پرشین',
    age: '2 سال',
    owner: 'سارا احمدی',
    ownerContact: '09122345678',
    status: 'فعال',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop'
  },
  {
    id: 'PET-003',
    name: 'راکی',
    type: 'سگ',
    typeEmoji: '🐕',
    breed: 'ژرمن شپرد',
    age: '5 سال',
    owner: 'علی کریمی',
    ownerContact: '09123456789',
    status: 'تحت درمان',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=100&h=100&fit=crop'
  },
  {
    id: 'PET-004',
    name: 'میمی',
    type: 'گربه',
    typeEmoji: '🐈',
    breed: 'بریتیش شورتهیر',
    age: '1 سال',
    owner: 'فاطمه حسینی',
    ownerContact: '09124567890',
    status: 'فعال',
    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=100&h=100&fit=crop'
  },
  {
    id: 'PET-005',
    name: 'پیکو',
    type: 'پرنده',
    typeEmoji: '🦜',
    breed: 'طوطی کوکاتیل',
    age: '6 ماه',
    owner: 'رضا موسوی',
    ownerContact: '09125678901',
    status: 'فعال',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=100&h=100&fit=crop'
  },
])

// Methods
const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}

const toggleActionMenu = (petId) => {
  openActionMenu.value = openActionMenu.value === petId ? null : petId
}

const selectPetType = (type) => {
  selectedPetType.value = type
  openDropdown.value = null
}

const selectAgeRange = (range) => {
  selectedAgeRange.value = range
  openDropdown.value = null
}

const selectStatus = (status) => {
  selectedStatus.value = status
  openDropdown.value = null
}

const selectNewPetType = (type) => {
  newPet.value.type = type.name
  newPet.value.typeEmoji = type.emoji
  openDropdown.value = null
}

const selectNewPetStatus = (status) => {
  newPet.value.status = status
  openDropdown.value = null
}

const getStatusBadge = (status) => {
  const badges = {
    'فعال': 'px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full',
    'غیرفعال': 'px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full',
    'تحت درمان': 'px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full'
  }
  return badges[status] || badges['فعال']
}

const viewPet = (pet) => {
  alert(`مشاهده جزئیات: ${pet.name}`)
  openActionMenu.value = null
}

const editPet = (pet) => {
  alert(`ویرایش: ${pet.name}`)
  openActionMenu.value = null
}

const deletePet = (pet) => {
  if (confirm(`آیا از حذف ${pet.name} مطمئن هستید؟`)) {
    const index = pets.value.findIndex(p => p.id === pet.id)
    if (index > -1) {
      pets.value.splice(index, 1)
    }
  }
  openActionMenu.value = null
}

const savePet = () => {
  const newPetData = {
    id: `PET-${String(pets.value.length + 1).padStart(3, '0')}`,
    name: newPet.value.name,
    type: newPet.value.type,
    typeEmoji: newPet.value.typeEmoji,
    breed: newPet.value.breed,
    age: newPet.value.age,
    owner: newPet.value.owner,
    ownerContact: newPet.value.ownerContact,
    status: newPet.value.status,
    image: newPet.value.image || 'https://via.placeholder.com/100'
  }
  
  pets.value.unshift(newPetData)
  showAddModal.value = false
  
  // Reset form
  newPet.value = {
    name: '',
    type: '',
    breed: '',
    age: '',
    owner: '',
    ownerContact: '',
    status: '',
    image: '',
    description: ''
  }
}

// Computed
const filteredPets = computed(() => {
  return pets.value.filter(pet => {
    const matchesSearch = !searchQuery.value || 
      pet.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !selectedPetType.value || 
      pet.type === selectedPetType.value
    
    const matchesStatus = !selectedStatus.value || 
      pet.status === selectedStatus.value
    
    return matchesSearch && matchesType && matchesStatus
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
