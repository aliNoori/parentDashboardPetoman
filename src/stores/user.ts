import {defineStore} from 'pinia'
import {axiosKey} from "../plugins/axiosPlugins";
import {inject, ref} from "vue";
import type {AxiosInstance} from "axios";
import {toJalaliDate} from "../utils/date";

export interface User {
    id: number
    name: string
    username: string
    isActive: boolean
    email: string
    phone: string
    roles:[]
    role: string
    location: string
    avatar: string
    createdAt: string
    lastLogin:string
    updatedAt: string
}
export interface Donation {
    id: string
    amount: number
    method: 'cash' | 'card' | 'check'
    status: 'pending' | 'completed' | 'cancelled'
    date: string
    time: string
    kindnessMeeting: {
        id: string
        title: string
    }
    note?: string
}
export interface DonationDisplay {
    id: string
    supporter: string
    project: string
    amount: number
    method: string
    date: string
    time: string
    status: string
    note?: string
}


export interface SupporterWithDonations {
    supporterId: string
    totalDonations: number
    user: {
        id: string
        fullName: string
        email: string
        phoneNumber: string
    }
    donations: Donation[]
}


export const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({} as User)
    const users = ref<User[]>([])
    const supporters = ref<SupporterWithDonations[]>([])
    const donations = ref<Donation[]>([])
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/users/me')

            user.value = data

            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت کاربر:', error)
        }
    }

    const addUser = async (newUser: Partial<User>) => {
        try {
            const { data } = await axios.post('/users', newUser)
            // اضافه کردن نقش و lastLogin مثل fetchAllUsers
            const rolesArray = Array.isArray(data.roles) ? data.roles : []
            let role = 'user'
            if (rolesArray.includes('admin')) role = 'admin'
            else if (rolesArray.includes('user')) role = 'user'

            users.value.push({
                ...data,
                role,
                lastLogin: data.lastSeen || new Date().toISOString()
            })
            return data
        } catch (error) {
            console.error('❌ خطا در اضافه کردن کاربر:', error)
        }
    }

    const updateUser = async (id: string | number, updatedData: Partial<User>) => {
        try {
            const { data } = await axios.patch(`/users/${id}`, updatedData)
            const index = users.value.findIndex(u => u.id === id)
            if (index !== -1) {
                const rolesArray = Array.isArray(data.roles) ? data.roles : []
                let role = 'user'
                if (rolesArray.includes('admin')) role = 'admin'
                else if (rolesArray.includes('user')) role = 'user'

                users.value[index] = {
                    ...data,
                    role,
                    lastLogin: data.lastSeen || new Date().toISOString()
                }
            }
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش کاربر:', error)
        }
    }
    const toggleUserStatus = async (user: User) => {
        try {
            const newStatus = !user.isActive
            const { data } = await axios.patch(`/users/${user.id}/status`, { isActive: newStatus })
            const index = users.value.findIndex(u => u.id === user.id)
            if (index !== -1) {
                users.value[index].isActive = data.isActive
            }
            return data.isActive
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت کاربر:', error)
        }
    }
    // ✅ فعال کردن دسته‌ای از کاربران
    const bulkActivate = async (userIds: string[]) => {

        for (const id of userIds) {
            const user=users.value.find((u:User)=>String(u.id)===id) as User
            await toggleUserStatus(user);
            user.isActive = true;
        }
    };

    // ✅ غیرفعال کردن دسته‌ای از کاربران
    const bulkDeactivate = async (userIds: string[]) => {
        for (const id of userIds) {
            const user=users.value.find((u:User)=>String(u.id)===id) as User
            await toggleUserStatus(user);
            user.isActive = false;
        }
    };

    const deleteUser = async (id: string | number) => {
        try {
            await axios.delete(`/users/${id}`)
            users.value = users.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('❌ خطا در حذف کاربر:', error)
        }
    }

    const fetchAllUsers = async () => {
        try {
            const { data } = await axios.get('/users')
            users.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت لیست کاربران:', error)
        }
    }

    const fetchSupportersWithDonations = async () => {
        try {
            const { data } = await axios.get('/users/supporters-with-donations')
            supporters.value = data

            donations.value = data.flatMap((supporter: SupporterWithDonations) =>
                supporter.donations.map(donation => ({
                    id: donation.id,
                    supporter: supporter.user.fullName,
                    project: donation.kindnessMeeting?.title ?? '',
                    amount: Number(donation.amount),
                    method:
                        donation.method === 'cash' ? 'نقدی' :
                            donation.method === 'card' ? 'کارت به کارت' :
                                donation.method === 'check' ? 'چک' : 'نامشخص',
                    date: toJalaliDate(donation.date),
                    time: donation.time,
                    status: donation.status,
                    note: donation.note ?? ''
                }))
            )
            console.log('✅ کمک‌ها آماده شدند:', donations.value)
        } catch (error) {
            console.error('❌ خطا در دریافت لیست حامیان:', error)
        }
    }
    const removeDonation = (id: string) => {
        donations.value = donations.value.filter(d => d.id !== id)
    }


    return {
        user,
        users,
        supporters,
        donations,
        fetched,
        fetchUser,
        fetchAllUsers,
        addUser,
        updateUser,
        toggleUserStatus,
        bulkActivate,
        bulkDeactivate,
        deleteUser,
        fetchSupportersWithDonations,
        removeDonation
    }
})
