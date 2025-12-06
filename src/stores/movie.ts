import {defineStore} from 'pinia'
import {inject, ref} from 'vue'
import type {AxiosInstance} from 'axios'
import {axiosKey} from '../plugins/axiosPlugins'
import {useUploader} from "../composables/useUploader";

export interface Movie {
    id: string
    type:string
    title: string
    titleEn: string
    description: string
    director: string
    cast: string
    category: string
    categoryType?: any
    country?:string
    language?:string
    duration: number
    featured: boolean
    imdbRating: number
    poster?: string
    status: 'draft' | 'published'
    tags: string[]
    trailerUrl?: string
    videoFile: File
    videoLink?: string
    videoQuality?: string
    videoSourceType?: string
    year: number
    isActive: boolean
    createdAt?: string | null
    updatedAt?: string | null
    comments?: number
    keywords?: string
    downloadUrl?: string
    ageRating?: string
    categoryId?: string
    views?: number
    likes?: number
}

export const useMovieStore = defineStore('movieStore', () => {
    const movies = ref<Movie[]>([])
    const movie = ref<Movie | null>(null)
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const uploader = useUploader()

    // 📌 دریافت همه فیلم‌ها
    const fetchMovies = async () => {
        try {
            const {data} = await axios.get('/v1/movies')
            movies.value = data.map((item: any) => ({
                id: item.id,
                type: item.type,
                title: item.title,
                titleEn: item.titleEn,
                description: item.description,
                director: item.director,
                cast: item.cast,
                categoryType: item.category,
                category: item.category,
                duration: item.duration,
                country:item.country,
                language:item.language,
                ageRating:item.ageRating,
                featured: item.featured,
                imdbRating: item.imdbRating,
                poster: item.poster,
                status: item.status || 'draft',
                tags: item.tags || [],
                keywords:item.keywords,
                trailerUrl: item.trailerUrl,
                downloadUrl:item.downloadUrl,
                videoLink: item.videoLink,
                videoQuality: item.videoQuality,
                videoSourceType: item.videoSourceType,
                year: item.year,
                isActive: item.isActive ?? true,
                createdAt: item.createdAt || null,
                updatedAt: item.updatedAt || null,
            }))
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت فیلم‌ها:', error)
        }
    }

    // 📌 دریافت یک فیلم
    const fetchMovie = async (id: string) => {
        try {
            const {data} = await axios.get(`/v1/movies/${id}`)
            movie.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت فیلم:', error)
        }
    }

    // 📌 افزودن فیلم جدید
    const addMovie = async (newMovie: Partial<Movie>, posterFile?: File, videoFile?: File) => {
        try {
            let posterUrl = newMovie.poster
            let videoUrl = newMovie.videoLink

            if (posterFile) {
                posterUrl = await uploader.uploadImage(posterFile)
            }
            if (videoFile) {
                videoUrl = await uploader.uploadVideo(videoFile)
            }

            const {videoFile: _v, ...cleanMovie} = newMovie

            const payload = {
                ...cleanMovie,
                poster: posterUrl,
                videoLink: videoUrl,
            }

            const {data} = await axios.post('/v1/movies', payload)
            movies.value.unshift(data)
            console.log('✅ فیلم جدید ثبت شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ثبت فیلم:', error)
        }
    }

    // 📌 ویرایش فیلم
    const updateMovie = async (payload: any, posterFile?: File) => {
        try {
            let posterUrl = payload.poster

            if (posterFile) {
                posterUrl = await uploader.uploadImage(posterFile)
            }

            // فقط فیلدهای مجاز
            const cleanPayload = {
                type:payload.type,
                title: payload.title,
                titleEn:payload.titleEn,
                description: payload.description,
                director: payload.director,
                year: payload.year,
                categoryId: payload.categoryId,
                poster: posterUrl,
                videoLink: payload.videoLink,
                trailerUrl:payload.trailerUrl,
                downloadUrl:payload.downloadUrl,
                imdbRating: payload.imdbRating,
                cast:payload.cast,
                featured: payload.featured,
                tags: payload.tags,
                status: payload.status,
                country:payload.country,
                language:payload.language,
                ageRating:payload.ageRating,
                keywords:payload.keywords,

            }

            const { data } = await axios.patch(`/v1/movies/${payload.id}`, cleanPayload)

            const index = movies.value.findIndex(m => m.id === data.id)
            if (index !== -1) movies.value[index] = data

            console.log('✅ فیلم ویرایش شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش فیلم:', error)
        }
    }

    // 📌 تغییر وضعیت فعال/غیرفعال
    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const {data} = await axios.patch(`/v1/movies/${id}/status`, {isActive})
            const index = movies.value.findIndex(m => m.id === id)
            if (index !== -1) movies.value[index].isActive = data.isActive
            console.log(`✅ وضعیت فیلم ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت فیلم:', error)
        }
    }

    // 📌 حذف فیلم
    const removeMovie = async (id: string) => {
        try {
            await axios.delete(`/v1/movies/${id}`)
            movies.value = movies.value.filter(m => m.id !== id)
            console.log('✅ فیلم حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف فیلم:', error)
        }
    }

    const findById = (id: string) => {

        return movies.value.find(m => m.id === id)

    }

    return {
        movies,
        movie,
        fetched,
        fetchMovies,
        fetchMovie,
        findById,
        addMovie,
        updateMovie,
        removeMovie,
        toggleStatus,
    }
})
