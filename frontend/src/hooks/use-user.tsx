import { useState, useEffect } from "react"
import {
  login,
  logout as apiLogout,
  refreshToken,
} from "@/services/authService"
import axios from "axios"

// Định nghĩa kiểu User
interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  avatar?: string // avatar là tùy chọn
  backgroundImage?: string
}

// Create an axios instance for handling JWT
const axiosJWT = axios.create({
  timeout: 10000, // 10 giây timeout
})

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Kiểm tra access token trong localStorage
        const accessToken = localStorage.getItem("access_token")
        const storedRefreshToken = localStorage.getItem("refresh_token")
        const userData = localStorage.getItem("user")

        console.log("Access token:", accessToken) // Thêm log
        console.log("Refresh token:", storedRefreshToken) // Thêm log
        console.log("User data:", userData) // Thêm log

        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          console.log("User from localStorage:", parsedUser)
        }

        if (accessToken) {
          setIsLoggedIn(true)
          console.log("User is logged in (access token found)")
        } else if (storedRefreshToken) {
          try {
            const response = await refreshToken(storedRefreshToken)
            localStorage.setItem("access_token", response.access_token)
            localStorage.setItem("refresh_token", response.refresh_token)
            setIsLoggedIn(true)
            console.log("User is logged in (refresh token successful)")
          } catch (error) {
            console.error("Token refresh failed:", error)
            clearAuthData()
          }
        } else {
          console.log("No tokens found, user is not logged in")
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
    console.log("Auth data cleared")
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
      console.log("Logged in user:", response.user)
      console.log(
        "Access token after login:",
        localStorage.getItem("access_token")
      )
      console.log(
        "Refresh token after login:",
        localStorage.getItem("refresh_token")
      )
      return response
    } catch (error) {
      console.error("Login error:", error)
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
