<template>
  <teleport to="body">
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto rounded-xl shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[320px] max-w-md backdrop-blur-sm',
            toast.type === 'success' ? 'bg-green-500/95 text-white' :
            toast.type === 'error' ? 'bg-red-500/95 text-white' :
            toast.type === 'warning' ? 'bg-orange-500/95 text-white' :
            'bg-blue-500/95 text-white'
          ]"
        >
          <div class="flex-shrink-0">
            <i
              :class="[
                'text-2xl',
                toast.type === 'success' ? 'ti ti-circle-check' :
                toast.type === 'error' ? 'ti ti-circle-x' :
                toast.type === 'warning' ? 'ti ti-alert-triangle' :
                'ti ti-info-circle'
              ]"
            ></i>
          </div>
          <div class="flex-1">
            <p class="font-bold text-sm">{{ toast.message }}</p>
            <p v-if="toast.description" class="text-xs opacity-90 mt-1">{{ toast.description }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const addToast = (type, message, description = null, duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, type, message, description })
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods
defineExpose({
  success: (message, description) => addToast('success', message, description),
  error: (message, description) => addToast('error', message, description),
  warning: (message, description) => addToast('warning', message, description),
  info: (message, description) => addToast('info', message, description)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
