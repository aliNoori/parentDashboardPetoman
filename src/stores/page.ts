// stores/pageStore.ts
import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface Page {
    id: number | string
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDescription?: string
    status: 'draft' | 'published'
    showInMenu: boolean
    featuredImage?: string
    createdAt: string
    updatedAt: string
    views: number
}

export const usePageStore = defineStore('pageStore', () => {
    const pages = ref<Page[]>([])
    const page = ref<Page>()
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const fetchPage = async (id:string) => {
        try {
            const { data } = await axios.get(`/v1/pages/${id}`)
            page.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ Failed to fetch pages', error)
        }
    }

    const fetchPages = async () => {
        try {
            const { data } = await axios.get('/v1/pages')
            pages.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ Failed to fetch pages', error)
        }
    }

    const getPageById = (id: string | number) =>
        pages.value.find(p => p.id === id)

    const uploadImage = (file: File): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData()
                formData.append('file', file)

                const { data } = await axios.post('/v1/uploads/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })

                if (!data?.url) throw new Error('No URL returned from server')
                resolve(data.url.toString())
            } catch (error: any) {
                console.error('❌ Image upload failed', error)
                reject(error?.message || 'Upload failed')
            }
        })
    }

    // داخل pageStore.ts

    const addPage = async (newPage: Partial<Page>) => {
        try {
            let featuredImageUrl = newPage.featuredImage

            if (featuredImageUrl?.startsWith('data:image')) {
                const blob = await fetch(featuredImageUrl).then(res => res.blob())
                const file = new File([blob], 'featured-image.png', { type: blob.type })
                featuredImageUrl = await uploadImage(file)
            }

            const formData = new FormData()
            formData.append('title', newPage.title || '')
            formData.append('slug', newPage.slug || '')
            formData.append('content', newPage.content || '')
            formData.append('metaTitle', newPage.metaTitle || '')
            formData.append('metaDescription', newPage.metaDescription || '')
            formData.append('status', newPage.status || 'draft')
            formData.append('showInMenu', String(newPage.showInMenu))
            formData.append('featuredImage', featuredImageUrl || '')

            const { data } = await axios.post('/v1/pages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            pages.value.push(data)
            return data
        } catch (error) {
            console.error('❌ Failed to add page', error)
            throw error
        }
    }

    const updatePage = async (id: string | number, updatedPage: Partial<Page>) => {
        try {
            let featuredImageUrl = updatedPage.featuredImage

            if (featuredImageUrl?.startsWith('data:image')) {
                const blob = await fetch(featuredImageUrl).then(res => res.blob())
                const file = new File([blob], 'featured-image.png', { type: blob.type })
                featuredImageUrl = await uploadImage(file)
            }

            const formData = new FormData()
            formData.append('title', updatedPage.title || '')
            formData.append('slug', updatedPage.slug || '')
            formData.append('content', updatedPage.content || '')
            formData.append('metaTitle', updatedPage.metaTitle || '')
            formData.append('metaDescription', updatedPage.metaDescription || '')
            formData.append('status', updatedPage.status || 'draft')
            formData.append('showInMenu', String(updatedPage.showInMenu))
            formData.append('featuredImage', featuredImageUrl || '')

            const { data } = await axios.patch(`/v1/pages/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const index = pages.value.findIndex(p => p.id === id)
            if (index !== -1) pages.value[index] = data
            return data
        } catch (error) {
            console.error('❌ Failed to update page', error)
            throw error
        }
    }

    const deletePage = async (id: string | number) => {
        try {
            await axios.delete(`/v1/pages/${id}`)
            pages.value = pages.value.filter(p => p.id !== id)
        } catch (error) {
            console.error('❌ Failed to delete page', error)
            throw error
        }
    }

    const publishedPages = computed(() => pages.value.filter(p => p.status === 'published').length)
    const totalPages = computed(() => pages.value.length)

    return {
        pages,
        page,
        fetched,
        fetchPages,
        fetchPage,
        getPageById,
        addPage,
        updatePage,
        deletePage,
        uploadImage,
        publishedPages,
        totalPages
    }
})