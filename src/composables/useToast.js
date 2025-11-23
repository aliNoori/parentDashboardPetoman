import { inject } from 'vue'

export function useToast() {
  const toast = inject('toast')
  
  if (!toast) {
    console.warn('Toast not available')
    return {
      success: (msg) => console.log('Success:', msg),
      error: (msg) => console.error('Error:', msg),
      warning: (msg) => console.warn('Warning:', msg),
      info: (msg) => console.info('Info:', msg)
    }
  }
  
  return toast
}
