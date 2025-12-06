// stores/tagStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface Tag {
    id: number
    contentType:string
    typeId:string
    color:string
    isActive:boolean
    status:'active'|'inactive'
    name: string
    slug: string
    description: string
    count: number
    lastUsed: string
}

export const useTagStore = defineStore('tagStore', () => {

    const tags = ref<Tag[]>([])
    const tag = ref<Tag | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // =====================================================================
    // 📌 دریافت همه برچسب‌ها
    // =====================================================================
    const fetchTags = async (filters?: { typeId?: string;contentType?:string; activeOnly?: boolean }) => {
        try {
            const { data } = await axios.get('/tags', { params: filters })
            tags.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت برچسب ها:', error)
        }


    }

    // =====================================================================
    // 📌 دریافت یک برچسب
    // =====================================================================
    const fetchTag = async (id: number) => {
        try {
            const { data } = await axios.get(`/tags/${id}`)
            tag.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت برچسب:', error)
        }
    }

    // =====================================================================
    // 📌 افزودن برچسب جدید
    // =====================================================================
    const addTag = async (newTag: Partial<Tag>) => {
        try {
            const payload = {
                name: newTag.name,
                typeId:newTag.typeId,
                contentType:newTag.contentType,
                isActive:newTag.isActive,
                color:newTag.color,
                slug: newTag.slug,
                description: newTag.description || '',
            }

            const { data } = await axios.post('/tags', payload)

            const mapped: Tag = {
                id: data.id,
                contentType:data.contentType,
                typeId:data.typeId,
                color:data.color,
                status:data.isActive?'active':'inactive',
                isActive:data.isActive,
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                count: data.count || 0,
                lastUsed: data.lastUsed || 'هرگز',
            }

            tags.value.unshift(mapped)
            console.log('✅ برچسب ثبت شد')
        } catch (error) {
            console.error('❌ خطا در ثبت برچسب:', error)
        }
    }

    // =====================================================================
    // 📌 ویرایش برچسب
    // =====================================================================
    const editTag = async (updatedTag: any & { id: number }) => {
        try {
            const payload = {
                name: updatedTag.name,
                typeId:updatedTag.typeId,
                contentType:updatedTag.contentType,
                isActive:updatedTag.isActive,
                color:updatedTag.color,
                slug: updatedTag.slug,
                description: updatedTag.description || '',
            }

            const { data } = await axios.patch(`/tags/${updatedTag.id}`, payload)

            const mapped: Tag = {
                id: data.id,
                contentType:data.contentType,
                typeId:data.typeId,
                color:data.color,
                status:data.status,
                isActive:data.isActive,
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                count: data.count || 0,
                lastUsed: data.lastUsed || 'هرگز',
            }

            const index = tags.value.findIndex(t => t.id === data.id)
            if (index !== -1) tags.value[index] = mapped

            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش برچسب:', error)
        }
    }

    // =====================================================================
    // 📌 حذف برچسب
    // =====================================================================
    const removeTag = async (id: number) => {
        try {
            await axios.delete(`/tags/${id}`)
            tags.value = tags.value.filter(t => t.id !== id)
            console.log('✅ برچسب حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف برچسب:', error)
        }
    }

    const incrementTagCount = async (tagName: string) => {
        try {
            const tagObj = tags.value.find(t => t.name === tagName)
            if (tagObj) {
                tagObj.count++

                await axios.patch(`/tags/${tagObj.id}/increment`, {
                    count: tagObj.count,
                    lastUsed: new Date().toISOString(),
                })
            }
        } catch (error) {
            console.error('❌ خطا در افزایش شمارنده‌ی تگ:', error)
        }
    }
    const decrementTagCount = async (id: number) => {
        try {
            const tagObj = tags.value.find(t => t.id === id)
            if (tagObj && tagObj.count > 0) {
                tagObj.count--

                // سمت سرور هم به‌روز کن
                await axios.patch(`/tags/${id}/decrement`, {
                    count: tagObj.count,
                    lastUsed: new Date().toISOString(),
                })
            }
        } catch (error) {
            console.error('❌ خطا در کاهش شمارنده‌ی تگ:', error)
        }
    }

    return {
        tags,
        tag,
        fetched,
        fetchTags,
        fetchTag,
        addTag,
        editTag,
        removeTag,
        incrementTagCount,
        decrementTagCount
    }
})
