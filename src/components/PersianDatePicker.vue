<template>
  <div class="persian-datepicker-wrapper">
    <DatePicker
      v-model="dateValue"
      :placeholder="placeholder"
      :format="displayFormat"
      :display-format="displayFormat"
      :clearable="clearable"
      :editable="false"
      :type="type"
      :auto-submit="autoSubmit"
      color="#f97316"
      input-class="date-input"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DatePicker from 'vue3-persian-datetime-picker'

const props = defineProps({
  modelValue: {
    type: [String, Number, Date, null, undefined],
    default: null
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  },
  displayFormat: {
    type: String,
    default: 'jYYYY/jMM/jDD - HH:mm'
  },
  type: {
    type: String,
    default: 'datetime'
  },
  autoSubmit: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: 'انتخاب تاریخ و زمان شمسی...'
  },
  inputClass: {
    type: String,
    default: 'input-field cursor-pointer'
  }
})

const emit = defineEmits(['update:modelValue'])

const dateValue = ref(props.modelValue || null)

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  dateValue.value = newVal || null
})

// Emit changes
watch(dateValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
.persian-datepicker-wrapper {
  width: 100%;
}

:deep(.date-input) {
  width: 100%;
  padding: 10px 40px 10px 12px;
  font-family: Vazirmatn, Vazir, sans-serif !important;
  direction: rtl !important;
  text-align: right !important;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: #fff;
}

:deep(.date-input:focus) {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

:deep(.vpd-container) {
  font-family: Vazirmatn, Vazir, sans-serif !important;
  direction: rtl !important;
}

:deep(.vpd-header) {
  background-color: #f97316 !important;
}

:deep(.vpd-actions button) {
  font-family: Vazirmatn, Vazir, sans-serif !important;
}
</style>
