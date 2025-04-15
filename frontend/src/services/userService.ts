/* eslint-disable @typescript-eslint/no-explicit-any */
// userService.ts

import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

const api = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface UserProfile {
  data(data: any): unknown
  id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  backgroundImage?: string
  role?: string
}

export interface UpdateProfileData {
  username?: string
  email?: string
  fullName?: string
  avatar?: string
  backgroundImage?: string
}

// Hàm để xử lý đường dẫn hình ảnh từ backend
const formatImageUrl = (path: string | undefined): string => {
  if (!path) return ""
  if (path.startsWith("http")) return path
  const formattedUrl = `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`
  console.log("Formatted Image URL:", formattedUrl) // Debug the output
  return formattedUrl
}

// Hàm xử lý dữ liệu user trả về từ API
const formatUserData = (userData: any): UserProfile => {
  if (!userData) return userData

  return {
    ...userData,
    avatar: formatImageUrl(userData.avatar),
    backgroundImage: formatImageUrl(userData.backgroundImage),
  }
}

const userService = {
  // Lấy thông tin profile của user theo ID
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const response = await api.get(`/profile/${userId}`)
    return formatUserData(response.data)
  },

  // Lấy thông tin profile của user hiện tại
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/profile")
    return formatUserData(response.data)
  },

  // Cập nhật profile của user
  updateProfile: async (
    userId: string,
    data: UpdateProfileData | FormData
  ): Promise<any> => {
    // Xử lý header phù hợp nếu là FormData
    const isFormData = data instanceof FormData
    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {}

    const response = await api.put(`/profile/${userId}`, data, config)
    return {
      data: formatUserData(response.data),
    }
  },

  // Xóa một user theo ID
  deleteUser: async (userId: string): Promise<any> => {
    const response = await api.delete(`/${userId}`)
    return response.data
  },

  // Lấy danh sách tất cả users
  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await api.get("/")
    return response.data.map(formatUserData)
  },

  // Tìm kiếm users
  searchUsers: async (query: string): Promise<UserProfile[]> => {
    const response = await api.get("/search", {
      params: { q: query },
    })
    return response.data.map(formatUserData)
  },
}

export default userService
