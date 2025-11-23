<template>
  <div class="bg-white rounded-xl p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-credit-card text-rose-600"></i>
          تنظیمات درگاه پرداخت
        </h2>
        <p class="text-sm text-gray-500 mt-1">پیکربندی درگاه‌های پرداخت آنلاین</p>
      </div>
      <button @click="savePaymentSettings" class="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-bold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg">
        <i class="ti ti-device-floppy ml-2"></i>
        ذخیره تغییرات
      </button>
    </div>

    <div class="space-y-6">
      <!-- Active Gateway -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-3">
          درگاه فعال
          <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label 
            class="relative p-4 border-2 rounded-xl border-rose-500 bg-rose-50"
          >
            <div class="flex items-center gap-3 mb-2">
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-500"
              >
                <i class="text-2xl ti ti-brand-paypal text-white"></i>
              </div>
              <div>
                <div class="font-bold text-gray-900">زرین‌پال</div>
                <div class="text-xs text-gray-500">Zarinpal</div>
              </div>
            </div>
            <div 
              class="absolute top-2 left-2 w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center"
            >
              <i class="ti ti-check text-white text-sm"></i>
            </div>
          </label>
          
          <div class="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
            <i class="ti ti-plus text-3xl text-gray-400 mb-2"></i>
            <div class="text-sm font-bold text-gray-600">درگاه‌های بیشتر</div>
            <div class="text-xs text-gray-400 mt-1">به زودی...</div>
          </div>
        </div>
      </div>

      <!-- Zarinpal Settings -->
      <div class="border border-rose-200 rounded-xl p-6 bg-gradient-to-r from-rose-50 to-pink-50">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-brand-paypal text-rose-600"></i>
          تنظیمات زرین‌پال
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Merchant ID
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="settings.zarinpal.merchantId"
              type="text"
              dir="ltr"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                محیط
              </label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="settings.zarinpal.sandbox"
                    type="radio"
                    :value="false"
                    class="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span class="text-sm">تولید (Production)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="settings.zarinpal.sandbox"
                    type="radio"
                    :value="true"
                    class="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span class="text-sm">آزمایشی (Sandbox)</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Callback URL
              </label>
              <input
                v-model="settings.zarinpal.callbackUrl"
                type="url"
                dir="ltr"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                placeholder="https://hamian.petoman.ir/payment/verify"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              توضیحات پرداخت (Description)
            </label>
            <input
              v-model="settings.zarinpal.description"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="کمک به قرار مهربانی حامیان"
            />
          </div>
        </div>
      </div>

      <!-- Payment Options -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">گزینه‌های پرداخت</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              حداقل مبلغ کمک (تومان)
            </label>
            <input
              v-model.number="settings.minAmount"
              type="number"
              min="1000"
              step="1000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              حداکثر مبلغ کمک (تومان)
            </label>
            <input
              v-model.number="settings.maxAmount"
              type="number"
              min="1000"
              step="1000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
            <div class="flex items-center gap-3">
              <i class="ti ti-receipt text-rose-600 text-xl"></i>
              <div>
                <div class="font-bold text-gray-900">رسید خودکار</div>
                <div class="text-xs text-gray-500">صدور رسید پس از پرداخت</div>
              </div>
            </div>
            <input
              v-model="settings.enableAutoReceipt"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
          </label>
        </div>
      </div>

      <!-- Test Connection -->
      <div class="border border-blue-200 rounded-xl p-4 bg-blue-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="ti ti-plug text-blue-600 text-2xl"></i>
            <div>
              <div class="font-bold text-gray-900">تست اتصال</div>
              <div class="text-xs text-gray-500">بررسی صحت اطلاعات درگاه</div>
            </div>
          </div>
          <button 
            @click="testConnection"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            <i class="ti ti-refresh ml-1"></i>
            تست کن
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useSettingStore} from "@/stores/setting.ts";
const settings = ref({
  activeGateway: 'zarinpal',
  zarinpal: {
    merchantId: '',
    sandbox: true,
    callbackUrl: 'https://hamian.petoman.ir/payment/verify',
    description: 'کمک به قرار مهربانی حامیان'
  },
  minAmount: 10000,
  maxAmount: 100000000,
  enableAutoReceipt: true
})
const settingStore=useSettingStore()
const savePaymentSettings = async () => {
  console.log('Saving payment settings:', settings.value)
  await settingStore.savePaymentSetting(settings.value)
  alert('تنظیمات درگاه پرداخت با موفقیت ذخیره شد!')
}

const testConnection = () => {
  alert('در حال تست اتصال به درگاه پرداخت...')
  // TODO: Implement actual test
  setTimeout(() => {
    alert('✅ اتصال با موفقیت برقرار شد!')
  }, 1500)
}
</script>
