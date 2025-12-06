import { defineStore } from 'pinia'
import {ref, inject, computed} from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface Comment {
    id: number
    author: string
    text: string
    postTitle: string
    rating: number
    status: 'pending' | 'approved' | 'rejected'
    createdAt: Date
}

export const useCommentStore = defineStore('commentStore', () => {
    const comments = ref<Comment[]>([])
    const comment = ref<Comment | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // =====================================================================
    // 📊 محاسبه آمار از روی لیست نظرات
    // =====================================================================
    const stats = computed(() => {
        return {
            total: comments.value.length,
            pending: comments.value.filter(c => c.status === 'pending').length,
            approved: comments.value.filter(c => c.status === 'approved').length,
            rejected: comments.value.filter(c => c.status === 'rejected').length,
        }
    })

    // =====================================================================
    // 📌 دریافت همه نظرات
    // =====================================================================
    const fetchComments = async (filters?: { search?: string; status?: string }) => {
        try {
            const { data } = await axios.get('/v1/comments', { params: filters })
            comments.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت نظرات:', error)
        }
    }

    // =====================================================================
    // 📌 دریافت یک نظر
    // =====================================================================
    const fetchComment = async (id: number) => {
        try {
            const { data } = await axios.get(`/v1/comments/${id}`)
            comment.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت نظر:', error)
        }
    }

    // =====================================================================
    // 📌 افزودن نظر جدید
    // =====================================================================
    const addComment = async (newComment: Partial<Comment>) => {
        try {
            const payload = {
                author: newComment.author,
                text: newComment.text,
                postTitle: newComment.postTitle,
                rating: newComment.rating,
            }

            const { data } = await axios.post('/v1/comments', payload)

            const mapped: Comment = {
                id: data.id,
                author: data.author,
                text: data.text,
                postTitle: data.postTitle,
                rating: data.rating,
                status: data.status,
                createdAt: data.createdAt,
            }

            comments.value.unshift(mapped)
            console.log('✅ نظر ثبت شد')
        } catch (error) {
            console.error('❌ خطا در ثبت نظر:', error)
        }
    }

    // =====================================================================
    // 📌 تغییر وضعیت نظر (تایید/رد)
    // =====================================================================
    const updateStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
        try {
            const { data } = await axios.patch(`/v1/comments/${id}/status`, { status })
            const index = comments.value.findIndex(c => c.id === id)
            if (index !== -1) comments.value[index].status = data.status
            console.log(`✅ وضعیت نظر ${id} تغییر کرد به ${data.status}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت نظر:', error)
        }
    }

    // =====================================================================
    // 📌 حذف نظر
    // =====================================================================
    const removeComment = async (id: number) => {
        try {
            await axios.delete(`/v1/comments/${id}`)
            comments.value = comments.value.filter(c => c.id !== id)
            console.log('✅ نظر حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف نظر:', error)
        }
    }

    return {
        comments,
        comment,
        fetched,
        stats,
        fetchComments,
        fetchComment,
        addComment,
        updateStatus,
        removeComment,
    }
})
