// services/authService.js
import axios, { AxiosError } from "axios"

const axiosJWT = axios.create()

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

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
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const refreshToken = async (refreshToken: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data // Backend trả về { accessToken, refreshToken }
  } catch (error) {
    const axiosError = error as AxiosError
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
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
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
