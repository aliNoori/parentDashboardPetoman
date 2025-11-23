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
    category: string
    status: 'active' | 'inactive'
    isActive: boolean
}


export const useFaqStore = defineStore('faqStore', () => {
    const faqs = ref<Faq[]>([])
    const faq = ref<Faq | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')


    const fetchFaqs = async () => {
        try {
            const { data } = await axios.get('/v1/faqs')

            faqs.value = data.map((item: any) => ({
                id: item.id,
                order: item.order,
                question: item.question,
                answer: item.answer,
                categoryType:item.category,
                category: item.category?.displayName || item.category?.title || 'بدون دسته‌بندی',
                status: item.isActive ? 'active' : 'inactive',
                isActive: item.isActive,
                createdAt: item.createdAt || null,
                updatedAt: item.updatedAt || null,
            }))

            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت سوالات متداول:', error)
        }
    }


    const fetchFaq = async (id: string) => {
        try {
            const { data } = await axios.get(`/v1/faqs/${id}`)
            faq.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت سوال متداول:', error)
        }
    }


    const addFaq = async (newFaq: Partial<Faq>) => {
        try {
            const { data } = await axios.post('/v1/faqs', newFaq)

            const mapped = {
                id: data.id,
                order: data.order,
                question: data.question,
                answer: data.answer,
                category: data.category?.displayName || data.category?.title || 'بدون دسته‌بندی',
                status: data.isActive ? ('active' as const) : ('inactive' as const),
                isActive: data.isActive,
            }

            faqs.value.unshift(mapped)
            console.log('✅ سوال متداول ثبت شد')
        } catch (error) {
            console.error('❌ خطا در ثبت سوال متداول:', error)
        }
    }



    const editFaq = async (updatedFaq: any & { id: string }) => {
        try {
            const { id, ...body } = updatedFaq
            const { data } = await axios.patch(`/v1/faqs/${id}`, body)

            const mapped = {
                id: data.id,
                order: data.order,
                question: data.question,
                answer: data.answer,
                category: data.category?.displayName || data.category?.title || 'بدون دسته‌بندی',
                status: data.isActive ? ('active' as const) : ('inactive' as const),
                isActive: data.isActive,
            }

            const index = faqs.value.findIndex(f => f.id === data.id)
            if (index !== -1) faqs.value[index] = mapped

            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش سوال متداول:', error)
        }
    }




    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const { data } = await axios.patch(`/v1/faqs/${id}/status`, { isActive })
            const index = faqs.value.findIndex(f => f.id === id)
            if (index !== -1) faqs.value[index].isActive = data.isActive
            console.log(`✅ وضعیت سوال ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت سوال متداول:', error)
        }
    }



    const removeFaq = async (id: string) => {
        try {
            await axios.delete(`/v1/faqs/${id}`)
            faqs.value = faqs.value.filter(f => f.id !== id)
            console.log('✅ سوال متداول حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف سوال متداول:', error)
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