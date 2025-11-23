// stores/categoryTypeStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface CategoryType {
    id: string
    name: string
    displayName?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export const useCategoryTypeStore = defineStore('categoryTypeStore', () => {
    const categoryTypes = ref<CategoryType[]>([])
    const selectedType = ref<CategoryType | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // fetch all types
    const fetchTypes = async () => {
        try {
            const { data } = await axios.get('/category-types')
            categoryTypes.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت نوع دسته‌بندی‌ها:', error)
        }
    }

    // fetch single type
    const fetchType = async (name: string) => {
        try {
            const { data } = await axios.get(`/category-types/${name}`)
            selectedType.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت نوع دسته‌بندی:', error)
        }
    }

    // add new type
    const addType = async (newType: Partial<CategoryType>) => {
        try {
            const { data } = await axios.post('/category-types', newType)
            categoryTypes.value.unshift(data)
            console.log('✅ نوع دسته‌بندی ثبت شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ثبت نوع دسته‌بندی:', error)
        }
    }

    // edit type
    const editType = async (updatedType: Partial<CategoryType> & { id: string }) => {
        try {
            const { id, ...body } = updatedType
            const { data } = await axios.patch(`/category-types/${id}`, body)
            const index = categoryTypes.value.findIndex(t => t.id === data.id)
            if (index !== -1) categoryTypes.value[index] = data
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش نوع دسته‌بندی:', error)
        }
    }

    // toggle status
    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const { data } = await axios.patch(`/category-types/${id}/status`, { isActive })
            const index = categoryTypes.value.findIndex(t => t.id === id)
            if (index !== -1) categoryTypes.value[index].isActive = data.isActive
            console.log(`✅ وضعیت نوع دسته‌بندی ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت نوع دسته‌بندی:', error)
        }
    }

    // delete type
    const removeType = async (id: string) => {
        try {
            await axios.delete(`/category-types/${id}`)
            categoryTypes.value = categoryTypes.value.filter(t => t.id !== id)
            console.log('✅ نوع دسته‌بندی حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف نوع دسته‌بندی:', error)
        }
    }

    return {
        categoryTypes,
        selectedType,
        fetched,
        fetchTypes,
        fetchType,
        addType,
        editType,
        removeType,
        toggleStatus,
    }
})