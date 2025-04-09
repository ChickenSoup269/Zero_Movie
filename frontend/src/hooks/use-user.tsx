// hooks/use-user.ts
import { useState, useEffect } from "react"
import {
  login,
  logout as apiLogout,
  refreshToken,
} from "@/services/authService"
import axios from "axios"

// Create an axios instance for handling JWT
const axiosJWT = axios.create()

export const useUser = () => {
  const [user, setUser] = useState<unknown>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Kiểm tra access token trong localStorage
        const accessToken = localStorage.getItem("access_token")
        const storedRefreshToken = localStorage.getItem("refresh_token")
        const userData = localStorage.getItem("user")

        if (userData) {
          setUser(JSON.parse(userData))
        }

        if (accessToken) {
          // Nếu có access token, đánh dấu đã đăng nhập
          setIsLoggedIn(true)
        } else if (storedRefreshToken) {
          // Nếu access token hết hạn nhưng có refresh token, thử renew
          try {
            const response = await refreshToken(storedRefreshToken)
            localStorage.setItem("access_token", response.access_token)
            localStorage.setItem("refresh_token", response.refresh_token)
            setIsLoggedIn(true)
          } catch (error) {
            console.error("Token refresh failed:", error)
            clearAuthData()
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Thiết lập interceptor để tự động refresh token
    const interceptor = axiosJWT.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const storedRefreshToken = localStorage.getItem("refresh_token")
          if (storedRefreshToken) {
            try {
              const response = await refreshToken(storedRefreshToken)
              localStorage.setItem("access_token", response.access_token)
              localStorage.setItem("refresh_token", response.refresh_token)
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${response.access_token}`
              return axiosJWT(originalRequest)
            } catch (refreshError) {
              clearAuthData()
              window.location.href = "/login"
              return Promise.reject(refreshError)
            }
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosJWT.interceptors.response.eject(interceptor)
    }
  }, [])

  const clearAuthData = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    setUser(null)
    setIsLoggedIn(false)
  }

  const loginUser = async (credentials: {
    email: string
    password: string
  }) => {
    try {
      const response = await login(credentials)
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("refresh_token", response.refresh_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      setIsLoggedIn(true)
      return response
    } catch (error) {
      throw error
    }
  }

  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        await apiLogout(refreshToken)
      }
      clearAuthData()
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      clearAuthData()
      window.location.href = "/login"
    }
  }

  return {
    user,
    isLoggedIn,
    loading,
    login: loginUser,
    logout: logoutUser,
  }
}
