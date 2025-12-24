import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

/* ===========================
   Types & Enums
=========================== */

export type HelpType = 'financial' | 'volunteer'

export interface KindnessMeetingRegistration {
    id: string
    fullName: string
    mobile: string
    helpType: HelpType
    amount?: number
    message?: string

    kindnessMeetingId: string
    meetingTitle?: string

    createdAt: Date
}

/* ===========================
   Store
=========================== */

export const useKindnessMeetingRegistrationStore = defineStore(
    'kindnessMeetingRegistrationStore',
    () => {
        const registrations = ref<KindnessMeetingRegistration[]>([])
        const registration = ref<KindnessMeetingRegistration | null>(null)
        const fetched = ref(false)

        const axios = inject<AxiosInstance>(axiosKey)
        if (!axios) throw new Error('Axios instance not injected')

        // =====================================================================
        // 📌 دریافت ثبت‌نام‌های یک قرار مهربانی
        // GET /v1/kindness-meetings/:id/registrations
        // =====================================================================
        const fetchRegistrations = async (
            /*meetingId: string,
            filters?: { helpType?: HelpType }*/
        ) => {
            try {
                const { data } = await axios.get(
                    `kindness-meetings-registrations`,
                    /*{ params: filters }*/
                )

                registrations.value = data
                fetched.value = true
            } catch (error) {
                console.error('❌ خطا در دریافت ثبت‌نام‌ها:', error)
            }
        }

        // =====================================================================
        // ❌ حذف ثبت‌نام (ادمین)
        // DELETE /v1/kindness-meeting-registrations/:id
        // =====================================================================
        const removeRegistration = async (id: string) => {
            try {
                await axios.delete(`kindness-meeting-registrations/${id}`)

                registrations.value = registrations.value.filter(
                    r => r.id !== id
                )

                console.log('🗑️ ثبت‌نام حذف شد')
            } catch (error) {
                console.error('❌ خطا در حذف ثبت‌نام:', error)
                throw error
            }
        }

        return {
            registrations,
            registration,
            fetched,

            fetchRegistrations,
            removeRegistration,
        }
    }
)