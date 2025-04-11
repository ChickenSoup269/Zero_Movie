import axios, { AxiosError } from "axios"

const axiosJWT = axios.create({
  timeout: 10000, // 10 giây timeout
})

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

export class UserService {
  // Lấy thông tin hồ sơ người dùng
  static async getUserProfile(userId: string) {
    try {
      const res = await axiosJWT.get(`${API_URL}/users/profile/${userId}`)
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

  // Cập nhật thông tin hồ sơ người dùng
  static async updateUserProfile(
    userId: string,
    updateData: {
      username?: string
      email?: string
      fullName?: string
      avatar?: string
      backgroundImage?: string
    }
  ) {
    try {
      const res = await axiosJWT.put(
        `${API_URL}/users/profile/${userId}`,
        updateData
      )
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

  // Xóa người dùng
  static async deleteUser(userId: string) {
    try {
      const res = await axiosJWT.delete(`${API_URL}/users/${userId}`)
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

  // Lấy danh sách tất cả người dùng
  static async getAllUsers() {
    try {
      const res = await axiosJWT.get(`${API_URL}/users`)
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

  // Tìm kiếm người dùng theo query
  static async searchUsers(query: string) {
    try {
      const res = await axiosJWT.get(`${API_URL}/users/search`, {
        params: { query },
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
}
