/**
 * Composable for working with External Movie APIs (OMDB, Custom APIs)
 */

import { ref } from 'vue'

export function useMovieAPI() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Get API settings from localStorage
   */
  const getAPISettings = () => {
    const saved = localStorage.getItem('film-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        return settings.api || null
      } catch (e) {
        console.error('Error loading API settings:', e)
        return null
      }
    }
    return null
  }

  /**
   * Search movie from OMDB by title or IMDb ID
   */
  const searchOMDBMovie = async (query, byId = false) => {
    const apiSettings = getAPISettings()
    if (!apiSettings?.omdb?.enabled || !apiSettings.omdb.apiKey) {
      throw new Error('OMDB API is not configured')
    }

    loading.value = true
    error.value = null

    try {
      const searchParam = byId ? `i=${query}` : `t=${encodeURIComponent(query)}`
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${apiSettings.omdb.apiKey}&${searchParam}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch movie from OMDB')
      }

      const data = await response.json()
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Movie not found')
      }

      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Call custom API
   */
  const callCustomAPI = async (apiIndex, endpoint, options = {}) => {
    const apiSettings = getAPISettings()
    if (!apiSettings?.customApis?.[apiIndex]) {
      throw new Error('Custom API not found')
    }

    const api = apiSettings.customApis[apiIndex]
    if (!api.enabled) {
      throw new Error('Custom API is disabled')
    }

    loading.value = true
    error.value = null

    try {
      const url = `${api.baseUrl}${endpoint}`
      const headers = {}

      if (api.apiKey && api.headerName && api.headerValue) {
        headers[api.headerName] = api.headerValue.replace('{apiKey}', api.apiKey)
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error('Failed to call custom API')
      }

      const data = await response.json()
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Convert OMDB movie to local format
   */
  const convertOMDBToLocal = (omdbMovie) => {
    return {
      title: omdbMovie.Title || '',
      titleEn: omdbMovie.Title || '',
      description: omdbMovie.Plot || '',
      year: parseInt(omdbMovie.Year) || new Date().getFullYear(),
      duration: omdbMovie.Runtime ? parseInt(omdbMovie.Runtime.replace(' min', '')) : 0,
      imdbRating: parseFloat(omdbMovie.imdbRating) || 0,
      director: omdbMovie.Director || '',
      cast: omdbMovie.Actors || '',
      poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '',
      imdbId: omdbMovie.imdbID || ''
    }
  }

  return {
    loading,
    error,
    searchOMDBMovie,
    callCustomAPI,
    convertOMDBToLocal,
    getAPISettings
  }
}
