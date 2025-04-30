/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"

const axiosJWT = axios.create()

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Store failed requests to retry after token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Add token to requests via interceptor
axiosJWT.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors and refresh token
axiosJWT.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request to wait for token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosJWT(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const res = await axiosJWT.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        })
        if (res.data.status === "ERR") {
          throw new Error(res.data.message)
        }

        const { accessToken, refreshToken: newRefreshToken } = res.data
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("refresh_token", newRefreshToken)

        // Update headers for the original request
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Process queued requests
        processQueue(null, accessToken)

        // Retry the original request
        return axiosJWT(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        // Optionally redirect to login page
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export const register = async (data: {
  username: string
  email: string
  password: string
  fullName: string
}) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/register`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/login`, data)
    console.log("Login API response:", res.data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    const { accessToken, refreshToken } = res.data
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const refreshToken = async (refreshToken: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    const { accessToken, refreshToken: newRefreshToken } = res.data
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", newRefreshToken)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const logout = async (refreshToken: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/logout`, {
      refreshToken,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const createGuestSession = async () => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/guestsession`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const sendOtp = async (email: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/forgot-password`, {
      email,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      throw new Error(
        (axiosError.response.data as { message: string }).message ||
          "Lỗi không xác định từ server"
      )
    } else if (axiosError.request) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc backend."
      )
    } else {
      throw new Error(axiosError.message || "Lỗi không xác định")
    }
  }
}

export const resetPassword = async (data: {
  email: string
  otp: string
  newPassword: string
}) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/reset-password`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      throw new Error(
        (axiosError.response.data as { message: string }).message ||
          "Lỗi không xác định từ server"
      )
    } else if (axiosError.request) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc backend."
      )
    } else {
      throw new Error(axiosError.message || "Lỗi không xác định")
    }
  }
}
