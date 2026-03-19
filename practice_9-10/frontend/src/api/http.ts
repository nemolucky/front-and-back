import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '../lib/token'
import type { AuthTokens } from '../types/auth'

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const BASE_URL = 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
})

let isRefreshing = false
let pendingQueue: Array<(accessToken: string | null) => void> = []
let onUnauthorized: (() => void) | null = null

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

const skipRefreshByUrl = (url?: string) => {
  if (!url) {
    return false
  }

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh')
  )
}

apiClient.interceptors.request.use(
  config => {
    const accessToken = tokenStorage.getAccessToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => Promise.reject(error),
)

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined
    const status = error.response?.status

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (skipRefreshByUrl(originalRequest.url)) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      tokenStorage.clear()
      onUnauthorized?.()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push(accessToken => {
          if (!accessToken) {
            reject(error)
            return
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const response = await axios.post<AuthTokens>(
        `${BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            'x-refresh-token': `Bearer ${refreshToken}`,
          },
        },
      )

      tokenStorage.save(response.data)
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`

      pendingQueue.forEach(resolveRequest => {
        resolveRequest(response.data.accessToken)
      })
      pendingQueue = []

      return apiClient(originalRequest)
    } catch (refreshError) {
      tokenStorage.clear()
      pendingQueue.forEach(resolveRequest => {
        resolveRequest(null)
      })
      pendingQueue = []
      onUnauthorized?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
