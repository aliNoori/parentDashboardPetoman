import {defineStore} from 'pinia'
import {ref, inject, toRaw} from 'vue'
import type {AxiosInstance} from 'axios'
import {axiosKey} from '../plugins/axiosPlugins'
import {useUploader} from "../composables/useUploader";

/* -------------------------------------------------
    Interfaces
--------------------------------------------------*/
export interface Slide {
    image: string
    title: string
    subtitle: string
    description: string
    ctaText: string
    ctaLink: string
    active: boolean
}

export interface GeneralSettings {
    siteName: string
    tagline: string
    adminEmail: string
    language: string
    description: string
    logo: string
    favicon: string
    sliderEnabled: boolean
    sliderSpeed: number
    sliderHeight: number
    sliderEffect: string
    sliderAutoplay: boolean
    sliderLoop: boolean
    sliderNavigation: boolean
    sliderPagination: boolean
    slides: Slide[]
    showComments: boolean
    showSearch: boolean
    showSidebar: boolean
    showSocialMedia: boolean
}

export interface SeoSettings {
    metaTitle: string
    metaDescription: string
    keywords: string
    canonicalUrl: string
}

export interface OmdbApiSettings {
    enabled: boolean
    apiKey: string
}

export interface ApiSettings {
    omdb: OmdbApiSettings
    customApis: string[]
}

export interface OpenGraphSettings {
    title: string
    description: string
    image: string
    type: string
}

export interface SocialSettings {
    instagram: string
    telegram: string
    twitter: string
    youtube: string
    linkedin: string
}

export interface AdvancedSettings {
    googleAnalytics: string
    googleTagManager: string
    facebookPixel: string
    customHead: string
    customBody: string
}

export interface Settings {
    general: GeneralSettings
    seo: SeoSettings
    api: ApiSettings
    opengraph: OpenGraphSettings
    social: SocialSettings
    advanced: AdvancedSettings
}

/* -------------------------------------------------
    Store
--------------------------------------------------*/
export const useFilmSettingStore = defineStore('filmSettingStore', () => {
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    /* ------------------ States -------------------*/
    const settings = ref<Settings | null>(null)
    const loading = ref(false)
    const fetched = ref(false)

    const parseSlides = (val: any): Slide[] => {
        try {
            const arr = typeof val === 'string' ? JSON.parse(val) : val
            if (Array.isArray(arr)) {
                return arr.map((s: any) => ({
                    image: s.image ?? '',
                    title: s.title ?? '',
                    subtitle: s.subtitle ?? '',
                    description: s.description ?? '',
                    ctaText: s.ctaText ?? '',
                    ctaLink: s.ctaLink ?? '',
                    active: s.active === true || s.active === 'true', // بولین درست
                }))
            }
            return []
        } catch {
            return []
        }
    }

    const parseOmdb = (val: any): OmdbApiSettings => {
        try {
            const obj = typeof val === 'string' ? JSON.parse(val) : val
            return {
                enabled: obj.enabled === true || obj.enabled === 'true',
                apiKey: obj.apiKey ?? '',
            }
        } catch {
            return { enabled: false, apiKey: '' }
        }
    }

    const parseCustomApis = (val: any): any[] => {
        try {
            const arr = typeof val === 'string' ? JSON.parse(val) : val
            return Array.isArray(arr) ? arr : []
        } catch {
            return []
        }
    }


    /* -------------------------------------------------
       Fetch All
   --------------------------------------------------*/
    const fetchAll = async () => {
        if (fetched.value) return
        loading.value = true

        try {
            const { data } = await axios.get('/film/settings')

            const parseBool = (val: any) => val === 'true' ? true : val === 'false' ? false : val
            const parseNum = (val: any) => !isNaN(val) ? Number(val) : val
            const parseJSON = (val: any) => {
                try {
                    return typeof val === 'string' ? JSON.parse(val) : val
                } catch {
                    return val
                }
            }

            settings.value = {
                general: {
                    siteName: data.general.siteName,
                    tagline: data.general.tagline,
                    adminEmail: data.general.adminEmail,
                    language: data.general.language,
                    description: data.general.description,
                    logo: data.general.logo,
                    favicon: data.general.favicon,
                    sliderEnabled: parseBool(data.general.sliderEnabled),
                    sliderSpeed: parseNum(data.general.sliderSpeed),
                    sliderHeight: parseNum(data.general.sliderHeight),
                    sliderEffect: data.general.sliderEffect,
                    sliderAutoplay: parseBool(data.general.sliderAutoplay),
                    sliderLoop: parseBool(data.general.sliderLoop),
                    sliderNavigation: parseBool(data.general.sliderNavigation),
                    sliderPagination: parseBool(data.general.sliderPagination),
                    slides: parseSlides(data.general.slides), // ✅ حالا آرایه درست میاد
                    showComments: parseBool(data.general.showComments),
                    showSearch: parseBool(data.general.showSearch),
                    showSidebar: parseBool(data.general.showSidebar),
                    showSocialMedia: parseBool(data.general.showSocialMedia),
                },
                seo: {
                    metaTitle: data.seo.metaTitle,
                    metaDescription: data.seo.metaDescription,
                    keywords: data.seo.keywords,
                    canonicalUrl: data.seo.canonicalUrl,
                },
                api: {
                    omdb: parseOmdb(data.api.omdb),
                    customApis: parseCustomApis(data.api.customApis),
                },
                opengraph: {
                    title: data.opengraph.title,
                    description: data.opengraph.description,
                    image: data.opengraph.image,
                    type: data.opengraph.type,
                },
                social: {
                    instagram: data.social.instagram,
                    telegram: data.social.telegram,
                    twitter: data.social.twitter,
                    youtube: data.social.youtube,
                    linkedin: data.social.linkedin,
                },
                advanced: {
                    googleAnalytics: data.advance.googleAnalytics,
                    googleTagManager: data.advance.googleTagManager,
                    facebookPixel: data.advance.facebookPixel,
                    customHead: data.advance.customHead,
                    customBody: data.advance.customBody,
                },
            }


            fetched.value = true
        } finally {
            loading.value = false
        }
    }
    /* -------------------------------------------------
        Save All
    --------------------------------------------------*/

    const {uploadImage} = useUploader()

    const saveAll = async (model: Settings) => {
        const raw = toRaw(model)

        // 📌 ابتدا تصاویر اسلایدها را آپلود کن
        if (Array.isArray(raw.general.slides)) {
            for (const slide of raw.general.slides) {
                if (slide.image && typeof slide.image === 'string' && slide.image.startsWith('data:image')) {
                    // اگر base64 بود، آپلود کن و لینک جایگزین کن
                    slide.image = await uploadImage(slide.image)
                } else if (slide.image && (slide.image as any) instanceof File) {
                    // اگر فایل بود، آپلود کن
                    slide.image = await uploadImage(slide.image)
                }
            }
        }

        if (raw.general.logoUrl) {
            raw.general.logo = raw.general.logoUrl
        }else if (raw.general.logo && (typeof raw.general.logo === 'string' && raw.general.logo.startsWith('data:image'))) {
            raw.general.logo = await uploadImage(raw.general.logo)
        } else if (raw.general.logo && (raw.general.logo as any) instanceof File) {
            raw.general.logo = await uploadImage(raw.general.logo && (raw.general.logo as any) as File)
        }

        if (raw.general.faviconUrl) {
            raw.general.favicon = raw.general.faviconUrl
        } else if (raw.general.favicon && (typeof raw.general.favicon === 'string' && raw.general.favicon.startsWith('data:image'))) {
            raw.general.favicon = await uploadImage(raw.general.favicon)
        } else if (raw.general.favicon && (raw.general.favicon as any) instanceof File) {
            raw.general.favicon = await uploadImage(raw.general.favicon && (raw.general.favicon as any) as File)
        }

        if (raw.opengraph.ojUrl) {
            raw.opengraph.image = raw.opengraph.ojUrl
        } else if (raw.opengraph.image && (typeof raw.opengraph.image === 'string' && raw.opengraph.image.startsWith('data:image'))) {
            raw.opengraph.image = await uploadImage(raw.opengraph.image)
        } else if (raw.opengraph.image && (raw.opengraph.image as any) instanceof File) {
            raw.opengraph.image = await uploadImage(raw.opengraph.image && (raw.opengraph.image as any) as File)
        }



        const toPayload = (section: Record<string, any>) =>
            Object.keys(section).map((key) => {
                let value = section[key]
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value)
                }
                return {key, value}
            })

        const apiPayload = [
            {
                key: 'omdb',
                value: JSON.stringify(raw.api.omdb),
            },
            {
                key: 'customApis',
                value: JSON.stringify(raw.api.customApis),
            },
        ]

        // 📌 ارسال همه تنظیمات
        return axios.patch('/film/settings', {
            general: toPayload(raw.general),
            seo: toPayload(raw.seo),
            api: apiPayload,
            social: toPayload(raw.social),
            opengraph: toPayload(raw.opengraph),
            advance: toPayload(raw.advanced),
        })
    }

    /* -------------------------------------------------
        Return
    --------------------------------------------------*/
    return {
        settings,
        loading,
        fetched,
        fetchAll,
        saveAll
    }
})