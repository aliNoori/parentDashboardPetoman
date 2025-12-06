// stores/faqStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface Faq {
    id: string
    order: number
    question: string
    answer: string
    contentType:string
    contentTitle:string
    typeId:string
    color:string
    category: string
    isActive:boolean
    status: 'active' | 'inactive'
    createdAt:Date
}


export const useFaqStore = defineStore('faqStore', () => {
    const faqs = ref<Faq[]>([])
    const faq = ref<Faq | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')


    // =====================================================================
    // 📌 دریافت همه سوال‌ها
    // =====================================================================
    const fetchFaqs = async (filters?: { typeId?: string; activeOnly?: boolean }) => {
        try {
            const { data } = await axios.get('/faqs', { params: filters })
            faqs.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت سوال ها:', error)
        }


    }

    // =====================================================================
    // 📌 دریافت یک سوال
    // =====================================================================
    const fetchFaq = async (id: number) => {
        try {
            const { data } = await axios.get(`/faqs/${id}`)
            faq.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت سوال:', error)
        }
    }

    // =====================================================================
    // 📌 افزودن سوال جدید
    // =====================================================================
    const addFaq = async (newFaq: Partial<Faq>) => {
        try {
            const payload = {
                question: newFaq.question,
                answer: newFaq.answer,
                typeId:newFaq.typeId,
                categoryId:newFaq.categoryId,
                status:newFaq.status,
                isActive:newFaq.isActive,
                contentTitle:newFaq.contentTitle,
                contentType:newFaq.contentType,
            }

            const { data } = await axios.post('/faqs', payload)

            const mapped: Faq = {
                id: data.id,
                category:data.category,
                contentTitle:data.contentTitle,
                order:data.order,
                status:data.status,
                isActive:data.isActive,
                contentType:data.contentType,
                typeId:data.typeId,
                color:data.color,
                question: data.question,
                answer: data.answer,
                createdAt:data.createdAt
            }

            faqs.value.unshift(mapped)
            console.log('✅ سوال ثبت شد')
        } catch (error) {
            console.error('❌ خطا در ثبت سوال:', error)
        }
    }

    // =====================================================================
    // 📌 ویرایش سوال
    // =====================================================================
    const editFaq = async (updatedFaq: any & { id: number }) => {
        try {
            const payload = {
                order:updatedFaq.order,
                question: updatedFaq.question,
                answer: updatedFaq.answer,
                typeId:updatedFaq.typeId,
                status:updatedFaq.status,
                categoryId:updatedFaq.categoryId,
                isActive:updatedFaq.isActive,
                contentTitle:updatedFaq.contentTitle,
                contentType:updatedFaq.contentType,
            }

            const { data } = await axios.patch(`/faqs/${updatedFaq.id}`, payload)

            const mapped: Faq = {
                id: data.id,
                contentTitle:data.contentTitle,
                order:data.order,
                contentType:data.contentType,
                typeId:data.typeId,
                category:data.category,
                color:data.color,
                status:data.isActive?'active':'inactive',
                isActive:data.isActive,
                question: data.question,
                answer: data.answer,
                createdAt:data.createdAt
            }

            const index = faqs.value.findIndex(t => t.id === data.id)
            if (index !== -1) faqs.value[index] = mapped

            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش سوال:', error)
        }
    }

    // =====================================================================
    // 📌 حذف سوال
    // =====================================================================
    const removeFaq = async (id: string) => {
        try {
            await axios.delete(`/faqs/${id}`)
            faqs.value = faqs.value.filter(t => t.id !== id)
            console.log('✅ سوال حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف سوال:', error)
        }
    }



    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const { data } = await axios.patch(`/faqs/${id}/status`, { isActive })
            const index = faqs.value.findIndex(f => f.id === id)
            if (index !== -1) faqs.value[index].isActive = data.isActive
            console.log(`✅ وضعیت سوال ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت سوال متداول:', error)
        }
    }

    return {
        faqs,
        faq,
        fetched,
        fetchFaqs,
        fetchFaq,
        addFaq,
        editFaq,
        removeFaq,
        toggleStatus
    }
})