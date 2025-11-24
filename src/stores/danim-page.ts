// stores/danimPageStore.ts
import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface DanimPage {
    id: string
    title: string
    slug: string
    content: string

    excerpt?: string
    metaTitle?: string
    metaDescription?: string

    ogTitle?: string
    ogDescription?: string
    ogImage?: string

    template: string
    status: 'draft' | 'published' | 'scheduled'
    publishDate?: string

    image?: string

    createdAt: string
    updatedAt: string
}

export const useDanimPageStore = defineStore('danimPageStore', () => {
    const pages = ref<DanimPage[]>([])
    const page = ref<DanimPage>()
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // -----------------------------
    // FETCH ALL
    // -----------------------------
    const fetchPages = async () => {
        try {
            const { data } = await axios.get('/v1/danim-pages')
            pages.value = data
            fetched.value = true
        } catch (err) {
            console.error('❌ Failed to fetch DanimPages', err)
        }
    }

    // -----------------------------
    // FETCH ONE
    // -----------------------------
    const fetchPage = async (id: string) => {
        try {
            const { data } = await axios.get(`/v1/danim-pages/${id}`)
            page.value = data
            fetched.value = true
        } catch (err) {
            console.error('❌ Failed to fetch DanimPage', err)
        }
    }

    const getPageById = (id: string) =>
        pages.value.find(p => p.id === id)

    // -----------------------------
    // IMAGE UPLOAD
    // -----------------------------
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
            } catch (err: any) {
                console.error('❌ Image upload failed', err)
                reject(err?.message || 'Upload failed')
            }
        })
    }

    // -----------------------------
    // CREATE PAGE
    // -----------------------------
    const addPage = async (newPage: Partial<DanimPage>) => {
        try {
            let imageUrl = newPage.image
            let ogImageUrl = newPage.ogImage

            // auto upload images if base64
            if (imageUrl?.startsWith('data:image')) {
                const b = await fetch(imageUrl).then(r => r.blob())
                const f = new File([b], 'image.png', { type: b.type })
                imageUrl = await uploadImage(f)
            }

            if (ogImageUrl?.startsWith('data:image')) {
                const b = await fetch(ogImageUrl).then(r => r.blob())
                const f = new File([b], 'og-image.png', { type: b.type })
                ogImageUrl = await uploadImage(f)
            }

            const form = new FormData()
            form.append('title', newPage.title || '')
            form.append('slug', newPage.slug || '')
            form.append('content', newPage.content || '')

            form.append('excerpt', newPage.excerpt || '')
            form.append('metaTitle', newPage.metaTitle || '')
            form.append('metaDescription', newPage.metaDescription || '')

            form.append('ogTitle', newPage.ogTitle || '')
            form.append('ogDescription', newPage.ogDescription || '')
            form.append('ogImage', ogImageUrl || '')

            form.append('template', newPage.template || 'default')
            form.append('status', newPage.status || 'draft')
            form.append('publishDate', newPage.publishDate || '')

            form.append('image', imageUrl || '')

            const { data } = await axios.post('/v1/danim-pages', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            pages.value.unshift(data)
            return data
        } catch (err) {
            console.error('❌ Failed to add DanimPage', err)
            throw err
        }
    }

    // -----------------------------
    // UPDATE
    // -----------------------------
    const updatePage = async (id: string, updated: Partial<DanimPage>) => {
        try {
            let imageUrl = updated.image
            let ogImageUrl = updated.ogImage

            if (imageUrl?.startsWith('data:image')) {
                const b = await fetch(imageUrl).then(r => r.blob())
                const f = new File([b], 'image.png', { type: b.type })
                imageUrl = await uploadImage(f)
            }

            if (ogImageUrl?.startsWith('data:image')) {
                const b = await fetch(ogImageUrl).then(r => r.blob())
                const f = new File([b], 'og-image.png', { type: b.type })
                ogImageUrl = await uploadImage(f)
            }

            const form = new FormData()
            form.append('title', updated.title || '')
            form.append('slug', updated.slug || '')
            form.append('content', updated.content || '')
            form.append('excerpt', updated.excerpt || '')

            form.append('metaTitle', updated.metaTitle || '')
            form.append('metaDescription', updated.metaDescription || '')

            form.append('ogTitle', updated.ogTitle || '')
            form.append('ogDescription', updated.ogDescription || '')
            form.append('ogImage', ogImageUrl || '')

            form.append('template', updated.template || 'default')
            form.append('status', updated.status || 'draft')
            form.append('publishDate', updated.publishDate || '')

            form.append('image', imageUrl || '')

            const { data } = await axios.patch(`/v1/danim-pages/${id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const index = pages.value.findIndex(p => p.id === id)
            if (index !== -1) pages.value[index] = data

            return data
        } catch (err) {
            console.error('❌ Failed to update DanimPage', err)
            throw err
        }
    }

    // -----------------------------
    // DELETE
    // -----------------------------
    const deletePage = async (id: string) => {
        try {
            await axios.delete(`/v1/danim-pages/${id}`)
            pages.value = pages.value.filter(p => p.id !== id)
        } catch (err) {
            console.error('❌ Failed to delete DanimPage', err)
            throw err
        }
    }

    const deleteImage = async (url: string) => {
        try {
            await axios.delete('/v1/uploads', { data: { url } })
            console.log('✅ Image deleted on server')
        } catch (error) {
            console.error('❌ Error deleting image:', error)
        }
    }

    // -----------------------------
    // COMPUTED
    // -----------------------------
    const publishedPages = computed(() =>
        pages.value.filter(p => p.status === 'published').length
    )

    const totalPages = computed(() => pages.value.length)

    // -----------------------------
// DATE FILTERS
// -----------------------------
    const todayPages = computed(() => {
        const today = new Date().toDateString()
        return pages.value.filter(p =>
            new Date(p.publishDate || p.createdAt).toDateString() === today
        )
    })

    const thisWeekPages = computed(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // شروع هفته (یکشنبه)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 7)

        return pages.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d >= startOfWeek && d < endOfWeek
        })
    })

    const thisMonthPages = computed(() => {
        const now = new Date()
        const month = now.getMonth()
        const year = now.getFullYear()

        return pages.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d.getMonth() === month && d.getFullYear() === year
        })
    })

    const last3MonthsPages = computed(() => {
        const now = new Date()
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(now.getMonth() - 3)

        return pages.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d >= threeMonthsAgo
        })
    })

    const thisYearPages = computed(() => {
        const year = new Date().getFullYear()

        return pages.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d.getFullYear() === year
        })
    })


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
        deleteImage,

        publishedPages,
        totalPages,

        todayPages,
        thisWeekPages,
        thisMonthPages,
        last3MonthsPages,
        thisYearPages
    }
})