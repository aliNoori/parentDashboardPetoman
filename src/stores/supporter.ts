import {defineStore} from 'pinia'
import {computed, inject, ref} from 'vue'
import {useRouter} from 'vue-router'
import type {AxiosInstance} from 'axios'
import {axiosKey} from "../plugins/axiosPlugins";
import {toJalaliDate, toGregorianDate} from '../utils/date'

export interface Supporter {
    name: string
    type: 'financial' | 'volunteer' | 'both'
    phone: string
    email?: string
    joinDate: string
    status: 'active' | 'inactive'
    initialAmount?: number
    address?: string
    notes?: string
}

export interface SupporterCase {
    id: string
    name: string
    avatar:string
    initials: string
    type: 'financial' | 'volunteer' | 'both'
    typeLabel: string
    status: 'active' | 'inactive'
    totalDonations: number
    totalAmount: number
    totalAmountLabel: string
    projects: number
    phone: string
    email: string
    _joinDateRaw: string,
    joinDate: string
}


export const useSupporterStore = defineStore('supporterStore', () => {
    const supporter = ref<Supporter>({} as Supporter)
    const supporterCases = ref<SupporterCase[]>([])
    const fetched = ref(false)
    const router = useRouter()

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // ✅ برترین حامیان بر اساس مبلغ حمایت
    const topSupporters = computed(() => {
        return [...supporterCases.value]
            .map(s => ({
                id: s.id,
                name: s.name,
                initials: s.initials,
                email: s.email,
                totalDonations: s.totalDonations,
                totalAmount: s.totalAmount,
                type: s.type,
                typeLabel: s.typeLabel
            }))
            .filter(s => s.totalAmount > 0)
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 5)
    })


    const topSupportersByDonations = computed(() => {
        return [...supporterCases.value]
            .filter(s => s.totalDonations > 0)
            .sort((a, b) => b.totalDonations - a.totalDonations)
            .slice(0, 5)
    })

    const totalAllSupportersAmount = computed(() => {
        return supporterCases.value.reduce((sum, s) => {
            return sum + Number(s.totalAmount || 0)
        }, 0)
    })

    const typeMap = {
        financial: 'حامی مالی',
        volunteer: 'داوطلب',
        both: 'حامی مالی و داوطلب'
    }
    const latestSupporters = computed(() => {
        return [...supporterCases.value]
            .map(s => ({
                id: s.id,
                name: s.name || 'ناشناس',
                avatar:s.avatar,
                initials: s.initials,
                date: s.createdAt,
                type: typeMap[s.type],
                status: s.status
            }))
            // ❗ جدیدترین اول
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
    })


    const fetchSupporter = async () => {
        try {
            const {data} = await axios.get('/v1/supporters')
            supporter.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت حامی:', error)
        }
    }
    const fetchSupporters = async () => {
        try {
            const {data} = await axios.get('/v1/supporters')

            supporterCases.value = data.map((item: any): SupporterCase => {
                const fullName = item.user?.fullName || '---'
                const initialAmount = Number(item.initialAmount ?? 0)
                const avatar=item.user?.avatar||''

                // ✅ مجموع کمک‌ها از donations
                const donationSum = Array.isArray(item.donations)
                    ? item.donations.reduce(
                        (sum: number, d: any) => sum + Number(d.amount || 0),
                        0
                    )
                    : 0

                // ✅ مجموع کل
                const totalAmount = initialAmount + donationSum

                const formattedAmount =
                    totalAmount >= 1_000_000
                        ? `${(totalAmount / 1_000_000).toFixed(1)} میلیون`
                        : totalAmount >= 1_000
                            ? `${(totalAmount / 1_000).toFixed(1)} هزار`
                            : `${totalAmount}`

                const initials = fullName
                    .split(' ')
                    .map((part: string) => part[0])
                    .join(' ')

                const typeLabel =
                    item.type === 'financial'
                        ? 'حامی مالی'
                        : item.type === 'volunteer'
                            ? 'داوطلب'
                            : 'مالی و داوطلب'

                return {
                    id: item.id,
                    name: fullName,
                    avatar:avatar,
                    initials,
                    type: item.type,
                    typeLabel,
                    status: item.status,
                    totalDonations: Array.isArray(item.donations)
                        ? item.donations.length + 1
                        : 0,
                    totalAmount,
                    totalAmountLabel: formattedAmount,
                    projects: item.projects?.length ?? 0,
                    phone: item.user?.phoneNumber || '',
                    email: item.user?.email || '',
                    _joinDateRaw: item.joinDate,
                    joinDate: toJalaliDate(item.joinDate)
                }
            })

            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت حامیان:', error)
        }
    }

    const addSupporter = async (newSupporter: Supporter) => {
        try {
            const {data} = await axios.post('/v1/supporters', newSupporter)
            supporter.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در ثبت حامی:', error)
        }
    }
    const updateSupporter = async (updateSupporter: Supporter & {
        id: string
    }) => {
        try {
            const {id, joinDate, ...rest} = updateSupporter

            const payload = {...rest}

            const {data} = await axios.patch(`/v1/supporters/${id}`, payload)
            supporter.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در بروزرسانی حامی:', error)
        }
    }
    const removeSupporter = async (id: string) => {
        try {
            await axios.delete(`/v1/supporters/${id}`)
            console.log('✅ حامی با موفقیت حذف شد:', id)
        } catch (error) {
            console.error('❌ خطا در حذف حامی:', error)
        }
    }
    const countActiveSupporter = computed(() => {
        return supporterCases.value.filter(d => d.status === 'active').length
    })
    const supportersGrowth = computed(() => {
        // تاریخ امروز
        const now = new Date()

        // حامیان فعال فعلی
        const activeSupporters = supporterCases.value.filter(s => s.status === 'active')

        // حامیان فعال در ماه قبل
        const lastMonthSupporters = activeSupporters.filter(s => {
            const joinDate = new Date(s.joinDate)
            return joinDate.getMonth() === now.getMonth() - 1 && joinDate.getFullYear() === now.getFullYear()
        })

        // رشد = (تعداد فعلی - تعداد ماه قبل) / تعداد ماه قبل * 100
        const currentCount = activeSupporters.length
        const previousCount = lastMonthSupporters.length

        if (previousCount === 0) return currentCount > 0 ? 100 : 0
        return Math.round(((currentCount - previousCount) / previousCount) * 100)
    })

    const newSupporters = computed(() => {
        const now = new Date()

        return supporterCases.value.filter(s => {
            const joinDate = new Date(toGregorianDate(s.joinDate)) // چون joinDate شمسیه
            return (
                joinDate.getFullYear() === now.getFullYear() &&
                joinDate.getMonth() === now.getMonth()
            )
        }).length
    })

    const newSupportersToday = computed(() => {
        const now = new Date()

        return supporterCases.value.filter(s => {
            const joinDate = new Date(toGregorianDate(s.joinDate))
            return (
                joinDate.getFullYear() === now.getFullYear() &&
                joinDate.getMonth() === now.getMonth() &&
                joinDate.getDate() === now.getDate()
            )
        }).length
    })

    // تبدیل joinDate به شیء تاریخ استاندارد
    function parseJoinDate(supporter: SupporterCase): Date {
        // joinDate اصلی باید میلادی باشد
        return new Date(supporter._joinDateRaw)
    }

// 🔥 حامیان جدید ماه جاری
    const newSupportersThisMonth = computed(() => {
        const now = new Date()
        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
            )
        }).length
    })

// 🔥 حامیان جدید هفته جاری
    const newSupportersThisWeek = computed(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // شنبه تا جمعه — نیاز داری اصلاح کنم؟ (ایرانی/میلادی؟)

        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return d >= startOfWeek && d <= now
        }).length
    })

// 🔥 حامیان جدید سه ماه اخیر
    const newSupportersLastThreeMonths = computed(() => {
        const now = new Date()
        const threeMonthsAgo = new Date(now)
        threeMonthsAgo.setMonth(now.getMonth() - 2)

        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return d >= threeMonthsAgo
        }).length
    })

// 🔥 حامیان جدید سال جاری
    const newSupportersThisYear = computed(() => {
        const now = new Date()
        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return d.getFullYear() === now.getFullYear()
        }).length
    })


    return {
        supporter,
        supporterCases,
        fetched,
        newSupporters,
        newSupportersToday,
        newSupportersThisWeek,
        newSupportersThisMonth,
        newSupportersThisYear,
        newSupportersLastThreeMonths,
        topSupporters,
        topSupportersByDonations,
        latestSupporters,
        countActiveSupporter,
        totalAllSupportersAmount,
        supportersGrowth,
        fetchSupporter,
        fetchSupporters,
        addSupporter,
        updateSupporter,
        removeSupporter
    }
})