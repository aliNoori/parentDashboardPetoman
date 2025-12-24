import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

/* ===========================
   Types & Enums
=========================== */

export type RequestSupporterStatus = 'pending' | 'approved' | 'rejected'
export type SupporterType = 'financial' | 'volunteer' | 'both'

export interface RequestSupporter {
    id: string
    firstName: string
    lastName: string
    avatar:string
    phone: string
    email?: string
    type: SupporterType
    status: RequestSupporterStatus
    agreement: boolean
    showInList: boolean
    province?: string
    city?: string
    notes?: string
    createdAt: Date
}

/* ===========================
   Store
=========================== */

export const useRequestSupporterStore = defineStore('requestSupporterStore', () => {
    const requests = ref<RequestSupporter[]>([])
    const request = ref<RequestSupporter | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // =====================================================================
    // 📌 دریافت همه درخواست‌ها
    // =====================================================================
    const fetchRequests = async (filters?: { status?: RequestSupporterStatus }) => {
        try {
            const { data } = await axios.get('v1/request-supporters', {
                params: filters
            })
            requests.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت درخواست‌ها:', error)
        }
    }

    // =====================================================================
    // ✅ تایید درخواست (approve)
    // backend: POST /request-supporters/:id/approve
    // =====================================================================
    const approveRequest = async (id: string) => {
        try {
            const { data } = await axios.patch(`v1/request-supporters/${id}/approve`)

            // بروزرسانی لیست درخواست‌ها
            const index = requests.value.findIndex(r => r.id === id)
            if (index !== -1) {
                requests.value[index].status = 'approved'
            }

            console.log('✅ درخواست تایید شد و حامی ایجاد گردید')
            return data
        } catch (error) {
            console.error('❌ خطا در تایید درخواست:', error)
            throw error
        }
    }

    // =====================================================================
    // ❌ رد درخواست (reject)
    // backend: POST /request-supporters/:id/reject
    // =====================================================================
    const rejectRequest = async (id: string, notes?: string) => {
        try {
            const { data } = await axios.patch(`v1/request-supporters/${id}/reject`, {
                notes
            })

            const index = requests.value.findIndex(r => r.id === id)
            if (index !== -1) {
                requests.value[index].status = 'rejected'
                requests.value[index].notes = notes
            }

            console.log('❌ درخواست رد شد')
            return data
        } catch (error) {
            console.error('❌ خطا در رد درخواست:', error)
            throw error
        }
    }

    return {
        requests,
        request,
        fetched,
        fetchRequests,
        approveRequest,
        rejectRequest
    }
})