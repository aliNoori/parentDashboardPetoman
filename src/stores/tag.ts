// stores/tagStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface Tag {
    id: number
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
    const fetchTags = async () => {
        try {
            const { data } = await axios.get('/tags')

            tags.value = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                slug: item.slug,
                description: item.description || '',
                count: item.count || 0,
                lastUsed: item.lastUsed || 'هرگز',
            }))

            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت برچسب‌ها:', error)
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
                slug: newTag.slug,
                description: newTag.description || '',
            }

            const { data } = await axios.post('/tags', payload)

            const mapped: Tag = {
                id: data.id,
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
                slug: updatedTag.slug,
                description: updatedTag.description || '',
            }

            const { data } = await axios.patch(`/tags/${updatedTag.id}`, payload)

            const mapped: Tag = {
                id: data.id,
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

    return {
        tags,
        tag,
        fetched,
        fetchTags,
        fetchTag,
        addTag,
        editTag,
        removeTag,
    }
})
