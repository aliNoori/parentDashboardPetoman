// stores/postStore.ts
import { defineStore } from 'pinia'
import { ref, inject, computed } from 'vue'
import type { AxiosInstance } from 'axios'
import { axiosKey } from '../plugins/axiosPlugins'

export interface PostForm {
    id?: number | string
    title: string
    slug: string
    content: string
    excerpt?: string
    thumbnail?: string | File | null

    // SEO
    metaTitle?: string
    metaDescription?: string


    // Other
    views?: number
    likes?: number
    featured?: boolean
    status: 'draft' | 'published'
    publishDate?: string | null
    commentsEnabled:boolean,

    categoryId?: string
    tags?: string[]
}

export interface Post extends PostForm {
    createdAt: string
    updatedAt: string
}

export const useFilmPostStore = defineStore('filmPostStore', () => {
    const posts = ref<Post[]>([])
    const post = ref<Post>()
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios not injected')

    // -------------------------------------------
    // GET ALL POSTS
    // -------------------------------------------
    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('/v1/film-posts')

            posts.value = data.map((p: any) => ({
                id: p.id,
                title: p.title,
                content:p.content,
                excerpt: p.excerpt,
                category: p.category,
                status: p.status,
                tags:p.tags,
                metaTitle:p.metaTitle,
                metaDescription:p.metaDescription,
                commentsEnabled:p.commentsEnabled,
                views: p.views ?? 0,
                publishDate:p.publishDate,
                date: new Date(p.publishDate || p.createdAt).toLocaleDateString('fa-IR'), // 👈 تبدیل تاریخ به شمسی/فرمت ساده
                thumbnail: p.thumbnailUrl || 'https://via.placeholder.com/40x40'
            }))

            fetched.value = true
        } catch (err) {
            console.error('❌ fetchPosts failed', err)
        }
    }


    // -------------------------------------------
    // GET SINGLE POST
    // -------------------------------------------
    const fetchPost = async (id: string | number) => {
        try {
            const { data } = await axios.get(`/v1/film-posts/${id}`)
            post.value = data
            fetched.value = true
        } catch (err) {
            console.error('❌ fetchPost failed', err)
        }
    }

    // -------------------------------------------
    // FIND POST LOCALLY
    // -------------------------------------------
    const getPostById = (id: string | number) =>
        posts.value.find(p => p.id == id)

    // -------------------------------------------
    // UPLOAD IMAGE
    // -------------------------------------------
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await axios.post('/v1/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        return data.url
    }

    // -------------------------------------------
    // CREATE POST (JSON body + optional image)
    // -------------------------------------------
    const addPost = async (form: any) => {
        try {
            const newPost = mapFormToPostForm(form)


            const thumbnailUrl = await resolveImage(newPost.thumbnail)

            const payload = {
                ...newPost,
                thumbnailUrl: thumbnailUrl,
            }
            const {thumbnail,...rest}=payload

            const { data } = await axios.post('/v1/film-posts', rest)
            posts.value.push(data)
            return data
        } catch (err) {
            console.error('❌ addPost failed', err)
            throw err
        }
    }


    // -------------------------------------------
    // UPDATE POST
    // -------------------------------------------
    const updatePost = async (id: string | number, updatedPost: PostForm) => {
        try {
            const thumbnailUrl = await resolveImage(updatedPost.thumbnail ?? null)

            const payload = {
                title: updatedPost.title,
                slug: updatedPost.slug,
                content: updatedPost.content,
                excerpt: updatedPost.excerpt,
                metaTitle: updatedPost.metaTitle,
                metaDescription: updatedPost.metaDescription,
                commentsEnabled:updatedPost.commentsEnabled,
                status: updatedPost.status,
                thumbnailUrl:thumbnailUrl,
                publishDate: updatedPost.publishDate,
                categoryId: updatedPost.categoryId,
                tags: updatedPost.tags,
                // 👈 فقط فیلدهای مجاز
            }

            const { data } = await axios.patch(`/v1/film-posts/${id}`, payload)

            const index = posts.value.findIndex(p => p.id == id)
            if (index !== -1) posts.value[index] = data

            return data
        } catch (err) {
            console.error('❌ updatePost failed', err)
            throw err
        }
    }


    // -------------------------------------------
    // DELETE POST
    // -------------------------------------------
    const deletePost = async (id: number | string) => {
        try {
            await axios.delete(`/v1/film-posts/${id}`)
            posts.value = posts.value.filter(p => p.id !== id)
        } catch (err) {
            console.error('❌ deletePost failed', err)
        }
    }

    // -------------------------------------------
    // COMPUTED VALUES
    // -------------------------------------------
    const totalPosts = computed(() => posts.value.length)
    const publishedPosts = computed(
        () => posts.value.filter(p => p.status === 'published').length
    )
    function mapFormToPostForm(form: any): PostForm {
        return {
            title: form.title,
            slug: form.slug,
            content: form.content,
            excerpt: form.excerpt,
            thumbnail: form.thumbnail,
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
            commentsEnabled:form.commentsEnabled,
            status: form.status,
            publishDate: form.publishDate,
            categoryId: form.categoryId,
            tags: form.tags,
        }
    }
    async function resolveImage(image?: string | File | null): Promise<string | null> {
        if (!image) return null

        if (typeof image === 'string' && image.startsWith('data:image')) {
            const blob = await fetch(image).then(r => r.blob())
            const file = new File([blob], 'post-image.png', { type: blob.type })
            return await uploadImage(file)
        }

        if (image instanceof File) {
            return await uploadImage(image)
        }

        return image as string
    }

    // -------------------------------------------
// TIME FILTERS
// -------------------------------------------
    const postsToday = computed(() => {
        const today = new Date()
        return posts.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
            )
        })
    })

    const postsThisWeek = computed(() => {
        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay()) // شروع هفته (شنبه = 0 برای ایران نیاز نیست)
        return posts.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d >= weekStart && d <= now
        })
    })

    const postsThisMonth = computed(() => {
        const now = new Date()
        return posts.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
            )
        })
    })

    const postsLast3Months = computed(() => {
        const now = new Date()
        const threeMonthsAgo = new Date(now)
        threeMonthsAgo.setMonth(now.getMonth() - 3)

        return posts.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d >= threeMonthsAgo && d <= now
        })
    })

    const postsThisYear = computed(() => {
        const now = new Date()
        return posts.value.filter(p => {
            const d = new Date(p.publishDate || p.createdAt)
            return d.getFullYear() === now.getFullYear()
        })
    })


    // -------------------------------------------
// TIME FILTERS BY VIEWS
// -------------------------------------------
    const topPostsToday = computed(() => {
        const today = new Date()
        return posts.value
            .filter(p => {
                const d = new Date(p.publishDate || p.createdAt)
                return (
                    d.getFullYear() === today.getFullYear() &&
                    d.getMonth() === today.getMonth() &&
                    d.getDate() === today.getDate()
                )
            })
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
    })

    const topPostsThisWeek = computed(() => {
        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        return posts.value
            .filter(p => {
                const d = new Date(p.publishDate || p.createdAt)
                return d >= weekStart && d <= now
            })
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
    })

    const topPostsThisMonth = computed(() => {
        const now = new Date()
        return posts.value
            .filter(p => {
                const d = new Date(p.publishDate || p.createdAt)
                return (
                    d.getFullYear() === now.getFullYear() &&
                    d.getMonth() === now.getMonth()
                )
            })
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
    })

    const topPostsLast3Months = computed(() => {
        const now = new Date()
        const threeMonthsAgo = new Date(now)
        threeMonthsAgo.setMonth(now.getMonth() - 3)
        return posts.value
            .filter(p => {
                const d = new Date(p.publishDate || p.createdAt)
                return d >= threeMonthsAgo && d <= now
            })
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
    })

    const topPostsThisYear = computed(() => {
        const now = new Date()
        return posts.value
            .filter(p => {
                const d = new Date(p.publishDate || p.createdAt)
                return d.getFullYear() === now.getFullYear()
            })
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
    })

    const deleteImage = async (url: string) => {
        try {
            await axios.delete('/v1/uploads', { data: { url } })
            console.log('✅ Image deleted on server')
        } catch (error) {
            console.error('❌ Error deleting image:', error)
        }
    }


    return {
        posts,
        post,
        fetched,
        fetchPosts,
        fetchPost,
        getPostById,
        addPost,
        updatePost,
        deletePost,
        uploadImage,
        deleteImage,

        // computed
        totalPosts,
        publishedPosts,

        postsToday,
        postsThisWeek,
        postsThisMonth,
        postsLast3Months,
        postsThisYear,
        topPostsToday,
        topPostsThisWeek,
        topPostsThisMonth,
        topPostsLast3Months,
        topPostsThisYear

    }
})