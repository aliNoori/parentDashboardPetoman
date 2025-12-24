// utils/useDebounce.ts
import { ref, watch } from 'vue'

export function useDebounce(value, delay = 400) {
    const debounced = ref(value.value)

    let timeout
    watch(value, val => {
        clearTimeout(timeout)
        timeout = setTimeout(() => debounced.value = val, delay)
    })

    return debounced
}
