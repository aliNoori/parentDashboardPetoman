import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

// -------------------------
// 🎬 Documentary Entity
// -------------------------
export interface Documentary {
    id: string
    title: string
    description?: string
    category: string
    slug: string
    duration?: string
    publishDate?: string
    status: 'draft' | 'published'
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    thumbnailUrl?: string
    videoUrl?: string
    createdAt: string
    updatedAt: string
}

// -------------------------
// ✏️ DTO Types
// -------------------------
export interface CreateDocumentaryDto {
    title: string
    description?: string
    category: string
    categoryId:string
    duration?: string
    publishDate?: string
    status?: 'draft' | 'published'
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    slug?: string
    // media
    videoUploadMethod: 'url' | 'file'
    videoUrl?: string
    videoFile?: File | null
    thumbnailPreview?: string | null
}

// -------------------------
// 📦 Pinia Store
// -------------------------
export const useDocumentaryStore = defineStore('documentaryStore', () => {
    const documentaries = ref<Documentary[]>([])
    const documentary = ref<Documentary | null>(null)
    const loading = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // -------------------------
    // 📥 Fetch All
    // -------------------------
    const fetchDocumentaries = async () => {
        try {
            const { data } = await axios.get('/v1/documentaries')

            documentaries.value = data.map((doc: any) => ({
                ...doc,
                videoUrl: doc.videoUrl || '',
                videoFile: doc.videoFile||'',
                thumbnailUrl: doc.thumbnailPreview || '',
                tags: Array.isArray(doc.tags) ? doc.tags : JSON.parse(doc.tags || '[]')
            }))
        } catch (err) {
            console.error('❌ خطا در دریافت مستندها:', err)
        }
    }

    const selectDocumentary = (doc: Documentary) => {
        documentary.value = doc
    }


    // -------------------------
    // ➕ Add New Documentary
    // -------------------------
    const addDocumentary = async (form: CreateDocumentaryDto) => {
        try {
            loading.value = true

            const formData = new FormData()

            // 🧩 فیلدهای ساده
            formData.append('categoryId', form.categoryId)
            formData.append('title', form.title)
            formData.append('description', form.description || '')
            //formData.append('category', form.category)
            formData.append('duration', form.duration || '')
            formData.append('publishDate', form.publishDate || '')
            formData.append('status', form.status || 'draft')
            formData.append('seoTitle', form.seoTitle || '')
            formData.append('seoDescription', form.seoDescription || '')
            formData.append('seoKeywords', form.seoKeywords || '')
            formData.append('slug', form.slug || '')

            // 🏷️ تگ‌ها
            if (form.tags && form.tags.length > 0) {
                form.tags.forEach(tag => formData.append('tags[]', tag));
            }


            // 🎞️ ویدیو
            if (form.videoUploadMethod === 'file' && form.videoFile) {
                formData.append('videoFile', form.videoFile)
                formData.append('videoUrl', '')
            } else if (form.videoUploadMethod === 'url' && form.videoUrl) {
                formData.append('videoUrl', form.videoUrl)
                formData.append('videoFile','')
            }

            // 🖼️ Thumbnail (اختیاری)
            if (form.thumbnailPreview) {
                // Base64 را به Blob تبدیل می‌کنیم
                const blob = base64ToBlob(form.thumbnailPreview)
                formData.append('thumbnailPreview', blob, 'thumbnail.png')
            }

            const { data } = await axios.post('/v1/documentaries', formData)
            documentaries.value.unshift(data)
            console.log('✅ مستند جدید ثبت شد')
            return data
        } catch (err) {
            console.error('❌ خطا در ثبت مستند:', err)
            throw err
        } finally {
            loading.value = false
        }
    }


    // -------------------------
// ✏️ Update Documentary
// -------------------------
    const updateDocumentary = async (id: string, form: CreateDocumentaryDto) => {
        try {
            loading.value = true

            const formData = new FormData()

            // 🧩 فیلدهای ساده
            formData.append('categoryId', form.categoryId)
            formData.append('title', form.title)
            formData.append('description', form.description || '')
            formData.append('duration', form.duration || '')
            formData.append('publishDate', form.publishDate || '')
            formData.append('status', form.status || 'draft')
            formData.append('seoTitle', form.seoTitle || '')
            formData.append('seoDescription', form.seoDescription || '')
            formData.append('seoKeywords', form.seoKeywords || '')
            formData.append('slug', form.slug || '')

            // 🏷️ تگ‌ها
            if (form.tags && form.tags.length > 0) {
                form.tags.forEach(tag => formData.append('tags[]', tag));
            }

            // 🎞️ ویدیو
            if (form.videoUploadMethod === 'file' && form.videoFile instanceof File) {
                formData.append('videoFile', form.videoFile)
            } else if (form.videoUploadMethod === 'url' && form.videoUrl) {
                formData.append('videoUrl', form.videoUrl)
            }

            if (form.thumbnailPreview) {
                // اگر Base64 است، به Blob تبدیل می‌کنیم
                if (form.thumbnailPreview.startsWith('data:image')) {
                    const blob = base64ToBlob(form.thumbnailPreview)
                    formData.append('thumbnailPreview', blob, 'thumbnail.png')
                }
            }

            const { data } = await axios.patch(`/v1/documentaries/${id}?_method=PUT`, formData)

            const index = documentaries.value.findIndex(d => d.id === id)
            if (index !== -1) {
                documentaries.value[index] = { ...documentaries.value[index], ...data }
            }
            if (documentary.value && documentary.value.id === id) {
                documentary.value = { ...documentary.value, ...data }
            }

            console.log('✅ مستند با موفقیت به‌روزرسانی شد')
            return data
        } catch (err) {
            console.error('❌ خطا در بروزرسانی مستند:', err)
            throw err
        } finally {
            loading.value = false
        }
    }


    // -------------------------
    // ❌ Remove
    // -------------------------
    const removeDocumentary = async (id: string) => {
        try {
            await axios.delete(`/v1/documentaries/${id}`)
            documentaries.value = documentaries.value.filter(d => d.id !== id)
        } catch (err) {
            console.error('❌ خطا در حذف مستند:', err)
        }
    }

    // -------------------------
    // 🧠 Helper: Base64 → Blob
    // -------------------------
    const base64ToBlob = (base64: string) => {
        const arr = base64.split(',')
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) u8arr[n] = bstr.charCodeAt(n)
        return new Blob([u8arr], { type: mime })
    }

    return {
        documentaries,
        documentary,
        loading,
        fetchDocumentaries,
        selectDocumentary,
        addDocumentary,
        updateDocumentary,
        removeDocumentary
    }
})