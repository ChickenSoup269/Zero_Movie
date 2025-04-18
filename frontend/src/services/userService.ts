/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

console.log("API_URL:", API_URL)

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    console.log("Access token:", token ? "Found" : "Not found")
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
    } else {
      console.warn("No token found, request may fail")
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

const UserService = {
  uploadImage: async (file: File, fieldName: "avatar" | "backgroundImage") => {
    try {
      if (!(file instanceof File)) {
        throw new Error("Invalid file object")
      }
      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
        fieldName,
      })
      const formData = new FormData()
      formData.append(fieldName, file)

      const response = await axios.post(`${API_URL}/users/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        timeout: 15000,
      })
      console.log("Upload response:", response.data)
      if (!response.data.url) {
        throw new Error("No URL returned from upload API")
      }
      return response.data.url
    } catch (error: any) {
      console.error("Upload image error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  },

  updateProfile: async (profileData: {
    fullName: string
    username: string
    avatarFile?: File
    backgroundFile?: File
  }) => {
    try {
      const formDataToSend = new FormData()
      if (profileData.fullName)
        formDataToSend.append("fullName", profileData.fullName)
      if (profileData.username)
        formDataToSend.append("username", profileData.username)

      if (profileData.avatarFile) {
        console.log("Uploading avatar:", profileData.avatarFile.name)
        const avatarUrl = await UserService.uploadImage(
          profileData.avatarFile,
          "avatar"
        )
        formDataToSend.append("avatar", avatarUrl)
      }

      if (profileData.backgroundFile) {
        console.log("Uploading background:", profileData.backgroundFile.name)
        const backgroundUrl = await UserService.uploadImage(
          profileData.backgroundFile,
          "backgroundImage"
        )
        formDataToSend.append("backgroundImage", backgroundUrl)
      }

      // Log FormData
      const formDataEntries = Object.fromEntries(formDataToSend)
      console.log("Sending profile data:", formDataEntries)
      if (Object.keys(formDataEntries).length === 0) {
        throw new Error("No data to send")
      }

      const response = await api.put("/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        timeout: 15000,
      })
      console.log("Profile update response:", response.data)
      return response
    } catch (error: any) {
      console.error("Update profile error:", {
        message: error.message || "Unknown error",
        response: error.response?.data || null,
        status: error.response?.status || null,
        config: error.config || null,
      })
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      )
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/profile")
      console.log("Get profile response:", response.data)
      return response
    } catch (error: any) {
      console.error("Get profile error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  },

  deleteUser: async (userId: any) => {
    try {
      const response = await api.delete(`/${userId}`)
      console.log("Delete user response:", response.data)
      return response
    } catch (error: any) {
      console.error("Delete user error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/")
      console.log("Get all users response:", response.data)
      return response
    } catch (error: any) {
      console.error("Get all users error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  },

  searchUsers: async (searchQuery: any) => {
    try {
      const response = await api.get("/search", {
        params: { q: searchQuery },
      })
      console.log("Search users response:", response.data)
      return response
    } catch (error: any) {
      console.error("Search users error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  },
}

export default UserService
