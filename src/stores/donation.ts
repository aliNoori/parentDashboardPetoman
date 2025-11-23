import { defineStore } from 'pinia'
import {computed, inject, ref} from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'
export interface Donation {
    id: string
    amount: number
    method: 'cash' | 'card' | 'check'
    status: 'pending' | 'completed' | 'cancelled'
    trackingCode?: string
    transactionTime?: string
    checkNumber?: string
    note?: string
    date?: string
    time?: string
    supporter: {
        id: string
        name: string
    }
    kindnessMeeting: {
        id: string
        title: string
    }
}

export const useDonationStore = defineStore('donationStore', () => {
    const donations = ref<Donation[]>([])
    const donation = ref<Donation | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // دریافت همه کمک‌ها
    const fetchDonations = async () => {
        try {
            const { data } = await axios.get('/v1/donations')
            donations.value = data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت کمک‌ها:', error)
        }
    }

    // دریافت کمک خاص
    const fetchDonation = async (id: string) => {
        try {
            const { data } = await axios.get(`/v1/donations/${id}`)
            donation.value = data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت کمک مالی:', error)
        }
    }

    // افزودن کمک جدید
    const addDonation = async (newDonation: Partial<Donation>) => {
        try {
            const { data } = await axios.post('/v1/donations', newDonation)
            donations.value.unshift(data)
            console.log('✅ کمک مالی با موفقیت ثبت شد')
        } catch (error) {
            console.error('❌ خطا در ثبت کمک مالی:', error)
        }
    }

    const editDonation = async (newDonation: Partial<Donation>) => {
        try {
            const payload = {
                ...newDonation,
                method: normalizeMethod(newDonation.method as string)
            }

            const { data } = await axios.patch(`/v1/donations/${newDonation.id}`, payload)
            const index = donations.value.findIndex(d => d.id === data.id)
            if (index !== -1) {
                donations.value[index] = data
            }
            console.log('✅ کمک مالی با موفقیت ویرایش شد')
        } catch (error) {
            console.error('❌ خطا در ویرایش کمک مالی:', error)
        }
    }

    const normalizeMethod = (method: string): 'cash' | 'card' | 'check' => {
        switch (method) {
            case 'نقدی': return 'cash'
            case 'کارت به کارت': return 'card'
            case 'چک': return 'check'
            default: return 'cash'
        }
    }

    const recentDonations = computed(() => {
        return [...donations.value]
            .filter(d => d.status === 'completed')
            .sort((a, b) => new Date(b.createdAt || b.date || '').getTime() - new Date(a.createdAt || a.date || '').getTime())
            .slice(0, 5)
            .map(d => ({
                id: d.id,
                supporter: d.supporter?.user?.fullName || 'ناشناس',
                project: d.kindnessMeeting?.title || 'نامشخص',
                amount: Number(d.amount),
                time: timeAgo(d.createdAt || d.date)
            }))
    })
    const countCompletedDonations = computed(() => {
        return donations.value.filter(d => d.status === 'completed').length
    })
    // حذف کمک
    const removeDonation = async (id: string) => {
        try {
            await axios.delete(`/v1/donations/${id}`)
            console.log('✅ کمک مالی حذف شد:', id)
        } catch (error) {
            console.error('❌ خطا در حذف کمک مالی:', error)
        }
    }
    function timeAgo(dateString?: string, timeString?: string) {
        if (!dateString) return ''

        let date: Date
        if (timeString) {
            date = new Date(`${dateString}T${timeString}`)
        } else {
            date = new Date(dateString)
        }

        const now = new Date()
        let diff = now.getTime() - date.getTime() // میلی‌ثانیه
        if (diff < 0) diff = 0 // جلوگیری از مقادیر منفی

        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days} روز پیش`
        if (hours > 0) return `${hours} ساعت پیش`
        if (minutes > 0) return `${minutes} دقیقه پیش`
        return `${seconds} ثانیه پیش`
    }

    const donationsGrowth = computed(() => {
        const now = new Date()

        // کمک‌های کامل شده
        const completedDonations = donations.value.filter(d => d.status === 'completed')

        // کمک‌های ماه جاری
        const currentMonthDonations = completedDonations.filter(d => {
            const date = new Date(d.createdAt || d.date || '')
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        })

        // کمک‌های ماه قبل
        const lastMonthDonations = completedDonations.filter(d => {
            const date = new Date(d.createdAt || d.date || '')
            let lastMonth = now.getMonth() - 1
            let year = now.getFullYear()
            if (lastMonth < 0) {
                lastMonth = 11
                year -= 1
            }
            return date.getMonth() === lastMonth && date.getFullYear() === year
        })

        const currentCount = currentMonthDonations.length
        const previousCount = lastMonthDonations.length

        if (previousCount === 0) return currentCount > 0 ? 100 : 0
        return Math.round(((currentCount - previousCount) / previousCount) * 100)
    })

    const todayDonations = computed(() => {
        const now = new Date()
        return donations.value.filter(d => {
            if (d.status !== 'completed') return false
            const date = new Date(d.createdAt || d.date || '')
            return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate()
            )
        }).length
    })

    return {
        donations,
        donation,
        fetched,
        fetchDonations,
        fetchDonation,
        addDonation,
        editDonation,
        removeDonation,
        todayDonations,
        donationsGrowth,
        recentDonations,
        countCompletedDonations,
    }
})