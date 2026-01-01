import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

/* ---------- UI Report Model ---------- */
export interface UiReport {
    id: string
    reporter: string
    reason: string
    reportType: string
    targetTitle: string
    status: 'pending' | 'resolved' | 'dismissed'
    date: string
}

export const useReportStore = defineStore('report', () => {
    const axios = inject<AxiosInstance>(axiosKey)!
    const reports = ref<UiReport[]>([])
    const loading = ref(false)

    /* ---------- helpers ---------- */
    const reportTypeLabel = (type: string) => ({
        video: 'مشکل ویدیو',
        audio: 'مشکل صدا',
        subtitle: 'مشکل زیرنویس',
        quality: 'کیفیت پایین',
        other: 'سایر'
    }[type] || type)

    const mediaTitle = (mediaType: string) => ({
        movie: 'فیلم',
        episode: 'قسمت',
        series: 'سریال'
    }[mediaType] || mediaType)

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes} دقیقه پیش`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} ساعت پیش`
        return `${Math.floor(hours / 24)} روز پیش`
    }

    function mapTargetTitle(raw: string) {
        const match = raw.match(/\((.*?)\)/)
        const idPart = match ? match[1].slice(0, 6) : ''
        const type = raw.split(' ')[0] === 'movie' ? 'فیلم' : 'قسمت'
        return `${type} (${idPart})`
    }

    /* ---------- actions ---------- */
    const fetchReports = async () => {
        loading.value = true
        try {
            const { data } = await axios.get<any[]>('/reports')
            reports.value = data.map(r => ({
                id: r.id,
                reporter: r.reporter || 'کاربر ثبت‌شده',
                reason: r.reason,
                reportType: reportTypeLabel(r.reportType),
                targetTitle: mapTargetTitle(r.targetTitle),
                status: r.status,
                date: timeAgo(r.date)
            }))
        } finally {
            loading.value = false
        }
    }

    const deleteReport=async (id: string) => {

        await axios.delete(`/reports/${id}`)

    }

    // متد تغییر وضعیت گزارش
    const changeStatus = async (id: string, newStatus: 'pending' | 'resolved' | 'dismissed') => {
        try {
            const { data } = await axios.patch(`/reports/${id}/status`, { status: newStatus })
            const index = reports.value.findIndex(r => r.id === id)
            if (index !== -1) {
                reports.value[index].status = data.status
            }
        } catch (err) {
            console.error('Error changing report status:', err)
        }
    }

    const stats = computed(() => {
        const s = { total: 0, pending: 0, resolved: 0, dismissed: 0 }
        s.total = reports.value.length
        reports.value.forEach(r => s[r.status]++)
        return s
    })

    return {
        reports,
        stats,
        loading,
        fetchReports,
        changeStatus,
        deleteReport
    }
})