import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'
import { useUploader } from '../composables/useUploader'

// =====================
// Type Definitions
// =====================

export interface Episode {
    title: string
    duration: number
    sourceType: 'upload' | 'url'
    quality: string
    videoUrl?: string
    videoFile?: File
}

export interface Season {
    number: number
    title: string
    description?: string
    episodes: Episode[]
}

export interface Series {
    id: string
    title: string
    titleEn: string
    description: string
    director: string
    actors: string
    country: string
    language: string
    category: string
    categoryType?: any
    status: 'draft' | 'published' | 'upcoming'
    year: number
    rating: number
    tags: string[]
    poster?: string
    featured: boolean

    keywords?: string
    ageRating?: string

    seasons: Season[]

    createdAt?: string | null
    updatedAt?: string | null
}


// =====================
// Store
// =====================

export const useSeriesStore = defineStore('seriesStore', () => {

    const seriesList = ref<Series[]>([])
    const series = ref<Series | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const uploader = useUploader()

    // =====================
    // Fetch All Series
    // =====================
    const fetchSeries = async () => {
        try {
            const { data } = await axios.get('/v1/series')

            seriesList.value = data.map((item: any) => {
                const seasonsList = item.seasons?.map((s: any) => ({
                    id:s.id,
                    number: s.number,
                    title: s.title,
                    description: s.description,
                    episodes: s.episodes?.map((e: any, index: number) => ({
                        id:e.id,
                        number: index + 1, // چون API شماره ندارد
                        title: e.title,
                        duration: e.duration,
                        videoUrl:e.videoUrl
                    })) || []
                })) || []

                const totalSeasons = item.seasons?.length || 0
                const totalEpisodes = item.seasons?.reduce(
                    (sum: number, s: any) => sum + (s.episodes?.length || 0),
                    0
                ) || 0

                return {
                    id: item.id,
                    type:item.type,
                    title: item.title,
                    titleEn: item.titleEn,
                    description: item.description,
                    poster: item.poster,
                    category: item.category?? '',
                    status: item.status,
                    rating: item.rating,
                    year: item.year,
                    tags: item.tags || [],
                    featured: item.featured ?? false,
                    keywords: item.keywords,
                    ageRating: item.ageRating,
                    country:item.country,
                    language:item.language,
                    director:item.director,
                    actors:item.actors,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,

                    // 🟩 نتیجه محاسبه شده
                    seasons: totalSeasons,
                    episodes: totalEpisodes,
                    seasonsList,
                }
            })

            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت سریال‌ها:', error)
        }
    }


    // =====================
    // Fetch Single Series
    // =====================
    const fetchOne = async (id: string) => {
        try {
            const { data } = await axios.get(`/v1/series/${id}`)
            series.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت سریال:', error)
        }
    }

    // =====================
    // Add New Series
    // =====================
    const addSeries = async (payload: Partial<Series>, posterFile?: File) => {
        try {
            let posterUrl = payload.poster

            if (posterFile) {
                posterUrl = await uploader.uploadImage(posterFile)
            }

            // =====================
            // Upload episodes video files
            // =====================
            const processedSeasons = []

            for (const season of payload.seasons || []) {
                const processedEpisodes = []

                for (const ep of season.episodes) {
                    let videoUrl = ep.videoUrl

                    if (ep.sourceType === 'upload' && ep.videoFile) {
                        videoUrl = await uploader.uploadVideo(ep.videoFile)
                    }

                    processedEpisodes.push({
                        ...ep,
                        videoUrl,
                        videoFile: undefined,
                    })
                }

                processedSeasons.push({
                    ...season,
                    episodes: processedEpisodes,
                })
            }

            const newData = {
                ...payload,
                poster: posterUrl,
                seasons: processedSeasons,
            }

            const { category, ...cleanPayload } = newData

            const { data } = await axios.post('/v1/series', cleanPayload)
            seriesList.value.unshift(data)

            console.log('✅ سریال جدید ایجاد شد')
            return data

        } catch (error) {
            console.error('❌ خطا در ثبت سریال:', error)
        }
    }

    // =====================
    // Update Series
    // =====================
    const updateSeries = async (payload: any, posterFile?: File|String) => {
        try {
            let posterUrl = payload.poster

            if (posterFile instanceof File) {
                posterUrl = await uploader.uploadImage(posterFile)
            }

            // آپلود فایل‌های قسمت‌ها
            const processedSeasons = []

            for (const season of payload.seasons || []) {
                const processedEpisodes = []

                for (const ep of season.episodes) {
                    let videoUrl = ep.videoUrl

                    if (ep.sourceType === 'upload' && ep.videoFile) {
                        videoUrl = await uploader.uploadVideo(ep.videoFile)
                    }

                    processedEpisodes.push({
                        ...ep,
                        videoUrl,
                        videoFile: undefined,
                    })
                }

                processedSeasons.push({
                    ...season,
                    episodes: processedEpisodes,
                })
            }

            const cleanPayload = {
                title: payload.title,
                titleEn: payload.titleEn,
                description: payload.description,
                director: payload.director,
                actors: payload.actors,
                country: payload.country,
                language: payload.language,
                categoryId: payload.categoryId,
                rating: payload.rating,
                poster: posterUrl,
                tags: payload.tags,
                status: payload.status,
                year: payload.year,
                featured: payload.featured,
                keywords: payload.keywords,
                ageRating: payload.ageRating,
                seasons: processedSeasons,
            }

            const { data } = await axios.patch(`/v1/series/${payload.id}`, cleanPayload)

            const index = seriesList.value.findIndex(s => s.id === data.id)
            if (index !== -1) seriesList.value[index] = data

            console.log('✅ سریال ویرایش شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش سریال:', error)
        }
    }

    // =====================
    // Delete Series
    // =====================
    const removeSeries = async (id: string) => {
        try {
            await axios.delete(`/v1/series/${id}`)
            seriesList.value = seriesList.value.filter(s => s.id !== id)
            console.log('🗑️ سریال حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف سریال:', error)
        }
    }

    const removeSeason = async (seriesId: string, seasonId: string) => {
        try {
            await axios.delete(`/v1/series/${seriesId}/seasons/${seasonId}`)
            const seriesIndex = seriesList.value.findIndex(s => s.id === seriesId)
            if (seriesIndex !== -1) {
                seriesList.value[seriesIndex].seasons = seriesList.value[seriesIndex].seasons.filter(
                    (season: any) => season.id !== seasonId
                )
            }
            console.log('🗑️ فصل حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف فصل:', error)
        }
    }

    const removeEpisode = async (seriesId: string, seasonId: string, episodeId: string) => {
        try {
            await axios.delete(`/v1/series/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)

            const seriesIndex = seriesList.value.findIndex(s => s.id === seriesId)
            if (seriesIndex !== -1) {
                const seasonIndex = seriesList.value[seriesIndex].seasons.findIndex((s: any) => s.id === seasonId)
                if (seasonIndex !== -1) {
                    seriesList.value[seriesIndex].seasons[seasonIndex].episodes =
                        seriesList.value[seriesIndex].seasons[seasonIndex].episodes.filter(
                            (ep: any) => ep.id !== episodeId
                        )
                }
            }
            console.log('🗑️ اپیزود حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف اپیزود:', error)
        }
    }

    const findById = (id: string) => {
        return seriesList.value.find(s => s.id === id)
    }

    return {
        seriesList,
        series,
        fetched,

        fetchSeries,
        fetchOne,
        addSeries,
        updateSeries,
        removeSeries,
        removeSeason,
        removeEpisode,
        findById,
    }
})