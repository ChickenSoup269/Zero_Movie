/* eslint-disable @typescript-eslint/no-explicit-any */
// services/userService.js
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    return token
  }
  return null
}

const api = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

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
  // Upload ảnh lên API
  uploadImage: async (file: string | Blob) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      return response.data.url // Trả về URL của ảnh
    } catch (error) {
      throw error
    }
  },

  updateProfile: async (profileData: {
    fullName: string | Blob
    username: string | Blob
    avatarFile: any
    backgroundFile: any
  }) => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", profileData.fullName)
      formDataToSend.append("username", profileData.username)

      // Upload avatar nếu có
      if (profileData.avatarFile) {
        const avatarUrl = await UserService.uploadImage(profileData.avatarFile)
        formDataToSend.append("avatar", avatarUrl)
      }

      // Upload background image nếu có
      if (profileData.backgroundFile) {
        const backgroundUrl = await UserService.uploadImage(
          profileData.backgroundFile
        )
        formDataToSend.append("backgroundImage", backgroundUrl)
      }

      const response = await api.put("/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response
    } catch (error) {
      throw error
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/profile")
      return response
    } catch (error) {
      throw error
    }
  },

  deleteUser: async (userId: any) => {
    try {
      const response = await api.delete(`/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/")
      return response
    } catch (error) {
      throw error
    }
  },

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
