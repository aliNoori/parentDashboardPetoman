// stores/tagTypeStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface TagType {
    id: string
    name: string
    displayName?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export const useTagTypeStore = defineStore('tagTypeStore', () => {
    const tagTypes = ref<TagType[]>([])
    const selectedType = ref<TagType | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // fetch all types
    const fetchTypes = async () => {
        try {
            const { data } = await axios.get('/tag-types')
            tagTypes.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت نوع برچسپ ها:', error)
        }
    }

    // fetch single type
    const fetchType = async (name: string) => {
        try {
            const { data } = await axios.get(`/tag-types/${name}`)
            selectedType.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت نوع برچسپ ها:', error)
        }
    }

    // add new type
    const addType = async (newType: Partial<TagType>) => {
        try {
            const { data } = await axios.post('/tag-types', newType)
            tagTypes.value.unshift(data)
            console.log('✅ نوع برچسپ  ثبت شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ثبت نوع برچسپ:', error)
        }
    }

    // edit type
    const editType = async (updatedType: Partial<TagType> & { id: string }) => {
        try {
            const { id, ...body } = updatedType
            const { data } = await axios.patch(`/tag-types/${id}`, body)
            const index = tagTypes.value.findIndex(t => t.id === data.id)
            if (index !== -1) tagTypes.value[index] = data
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش نوع دسته‌بندی:', error)
        }
    }

    // toggle status
    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const { data } = await axios.patch(`/category-types/${id}/status`, { isActive })
            const index = tagTypes.value.findIndex(t => t.id === id)
            if (index !== -1) tagTypes.value[index].isActive = data.isActive
            console.log(`✅ وضعیت نوع برچسپ ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت نوع برچسپ:', error)
        }
    }

    // delete type
    const removeType = async (id: string) => {
        try {
            await axios.delete(`/tag-types/${id}`)
            tagTypes.value = tagTypes.value.filter(t => t.id !== id)
            console.log('✅ نوع برچسپ حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف نوع برچسپ:', error)
        }
    }

    return {
        tagTypes,
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