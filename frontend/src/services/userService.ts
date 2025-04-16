/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Helper function để lấy token từ localStorage - sửa để lấy 'token' thay vì 'authToken'
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Tạo instance axios với config mặc định
const api = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor để thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      throw new Error("Không có token")
    }
    return config
  },
  (error) => Promise.reject(error)
)

const UserService = {
  // Lấy thông tin profile của user đã đăng nhập
  getProfile: async () => {
    try {
      const response = await api.get("/profile")
      return response // Trả về response đầy đủ để có thể truy cập response.data
    } catch (error) {
      throw error
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put("/profile", profileData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Xóa người dùng theo ID
  deleteUser: async (userId: any) => {
    try {
      const response = await api.delete(`/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Lấy danh sách tất cả người dùng
  getAllUsers: async () => {
    try {
      const response = await api.get("/")
      return response
    } catch (error) {
      throw error
    }
  },

  // Tìm kiếm người dùng theo query
  searchUsers: async (searchQuery: any) => {
    try {
      const response = await api.get("/search", {
        params: { q: searchQuery },
      })
      return response
    } catch (error) {
      throw error
    }
  },
}

export default UserService
