// stores/settingStore.ts
import { defineStore } from 'pinia'
import {ref, inject, toRaw} from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

/* -------------------------------------------------
    Interfaces
--------------------------------------------------*/
export interface GeneralSetting {
    siteTitle: string
    siteDescription: string
    siteUrl: string

    contactEmail: string | null
    contactPhone: string | null

    language: string
    timezone: string

    projectsPerPage: number
    supportersPerPage: number
    donationsPerPage: number

    enableEmailNotifications: boolean
    enableSmsNotifications: boolean
    enableAutoReceipt: boolean
    enablePeriodicReports: boolean
}

export interface OpengraphSetting {
    title: string
    description: string
    image: string
    url: string
    type: string

    siteName: string
    locale: string
    localeAlternate: string

    // twitter
    twitterCard: string
    twitterSite: string
    twitterCreator: string

    // project defaults
    projectManager: string
    projectOrganization: string
    projectTags: string
    projectCategory: string
}

export interface PaymentSetting {
    gateway: string            // "zarinpal", "idpay", ...
    merchantId: string
    callbackUrl: string
    currency: string
    sandboxMode: boolean
}

export interface AppearanceSetting {
    metaThemeColor: string
    metaThemeColorDark: string
    logoUrl: string
    faviconUrl: string
}

export interface SchemaSetting {
    organization: any
    project: any
    breadcrumb: any
    faq: any
    howto: any
    event: any
}

export interface SeoSetting {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    canonicalUrl: string
    robots: string
    allowIndexing: boolean
    sitemapUrl: string
    changefreq: string
    structuredData: {
        charity: boolean
        person: boolean
        breadcrumb: boolean
        organization: boolean
    }
    googleAnalyticsId: string
    enableGA: boolean
    googleSearchConsoleCode: string
}

/* -------------------------------------------------
    Store
--------------------------------------------------*/
export const useSettingStore = defineStore('settingStore', () => {

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    /* ------------------ States -------------------*/
    const generalSetting = ref<GeneralSetting | null>(null)
    const openGraphSetting = ref<OpengraphSetting | null>(null)
    const paymentSetting = ref<PaymentSetting | null>(null)
    const appearanceSetting = ref<AppearanceSetting | null>(null)
    const schemaSetting = ref<SchemaSetting | null>(null)
    const seoSetting = ref<SeoSetting | null>(null)

    const loading = ref(false)
    const fetched = ref(false)

    /* ------------------ Fetch -------------------*/
    const fetchGeneralSetting = async () => {
        try {
            const { data } = await axios.get('/settings/general')
            generalSetting.value = data
        } catch (e) {
            console.error('Error fetching general settings:', e)
        }
    }

    const fetchOpenGraphSetting = async () => {
        try {
            const { data } = await axios.get('/settings/open-graph')
            openGraphSetting.value = data
        } catch (e) {
            console.error('Error fetching OpenGraph settings:', e)
        }
    }

    const fetchPaymentSetting = async () => {
        try {
            const { data } = await axios.get('/settings/payment')
            paymentSetting.value = data
        } catch (e) {
            console.error('Error fetching payment settings:', e)
        }
    }

    const fetchAppearanceSetting = async () => {
        try {
            const { data } = await axios.get('/settings/appearance')
            appearanceSetting.value = data
        } catch (e) {
            console.error('Error fetching appearance settings:', e)
        }
    }

    const fetchSchemaSetting = async () => {
        try {
            const { data } = await axios.get('/settings/schema')
            schemaSetting.value = data
        } catch (e) {
            console.error('Error fetching schema settings:', e)
        }
    }

    const fetchSeoSetting = async () => {
        try {
            const { data } = await axios.get('/settings/seo')
            seoSetting.value = data
        } catch (e) {
            console.error('Error fetching SEO settings:', e)
        }
    }

    const fetchAll = async () => {
        if (fetched.value) return
        loading.value = true
        try {
            await Promise.all([
                fetchGeneralSetting(),
                fetchOpenGraphSetting(),
                fetchPaymentSetting(),
                fetchAppearanceSetting(),
                fetchSchemaSetting(),
                fetchSeoSetting()
            ])
            fetched.value = true
        } finally {
            loading.value = false
        }
    }

    /* ------------------ Save -------------------*/
    const saveGeneralSetting = async (generalSetting: any) => {
        // toRaw برای حذف Proxy
        const raw = toRaw(generalSetting)

        // تبدیل به آرایه key/value
        const payload = {
            settings: Object.keys(raw).map(key => ({
                key,
                value: raw[key]
            }))
        }

        return axios.patch('/settings/general', payload)
    }


    const saveOpenGraphSetting = async (openGraphSetting:any) => {

        // toRaw برای حذف Proxy
        const raw = toRaw(openGraphSetting)

        // تبدیل به آرایه key/value
        const payload = {
            settings: Object.keys(raw).map(key => ({
                key,
                value: raw[key]
            }))
        }

        return axios.patch('/settings/open-graph', payload)
    }

    const savePaymentSetting = async (paymentSetting:any) => {
        // toRaw برای حذف Proxy
        const raw = toRaw(paymentSetting)

        // تبدیل به آرایه key/value
        const payload = {
            settings: Object.keys(raw).map(key => ({
                key,
                value: raw[key]
            }))
        }
        return axios.patch('/settings/payment', payload)
    }

    const saveAppearanceSetting = async (appearanceSetting: any) => {
        const raw = toRaw(appearanceSetting)

        const formData = new FormData()

        const base64ToFile = (base64:any, filename:any) => {
            const arr = base64.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }

            return new File([u8arr], filename, { type: mime })
        }

        Object.keys(raw).forEach(key => {
            const value = raw[key]

            if (key === 'logo' && value) {
                formData.append('logo', base64ToFile(value, 'logo.png'))
            }
            else if (key === 'favicon' && value) {
                formData.append('favicon', base64ToFile(value, 'favicon.png'))
            }
            else {
                // سایر فیلدهای معمولی
                formData.append(key, value)
            }
        })

        return axios.patch('/settings/appearance', formData)
    }

    const saveSchemaSetting = async (schemaSetting:any) => {

        // toRaw برای حذف Proxy
        const raw = toRaw(schemaSetting)

        // تبدیل به آرایه key/value
        const payload = {
            settings: Object.keys(raw).map(key => ({
                key,
                value: raw[key]
            }))
        }

        return axios.patch('/settings/schema', payload)
    }

    const saveSeoSetting = async (seoSetting:any) => {
        // toRaw برای حذف Proxy
        const raw = toRaw(seoSetting)

        const payload = {
            settings: Object.keys(raw).map((key: string) => ({
                key,
                value: raw[key]
            }))
        };
        return axios.patch('/settings/seo', payload)
    }

    return {
        generalSetting,
        openGraphSetting,
        paymentSetting,
        appearanceSetting,
        schemaSetting,
        seoSetting,
        loading,
        fetched,

        fetchGeneralSetting,
        fetchOpenGraphSetting,
        fetchPaymentSetting,
        fetchAppearanceSetting,
        fetchSchemaSetting,
        fetchSeoSetting,
        fetchAll,

        saveGeneralSetting,
        saveOpenGraphSetting,
        savePaymentSetting,
        saveAppearanceSetting,
        saveSchemaSetting,
        saveSeoSetting
    }
})