/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { refreshToken } from "./authService"

// Create axios instance
const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

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

// Interceptor to add token to requests
axiosJWT.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    console.log("Booking request URL:", config.url)
    console.log(
      "Token in booking interceptor:",
      token ? `Present: ${token}` : "Missing"
    )
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn("No access_token found for booking request:", config.url)
    }
    return config
  },
  (error) => {
    console.error("Booking request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Interceptor to handle token refresh
axiosJWT.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshTokenValue = localStorage.getItem("refresh_token")
        console.log(
          "Refresh token available:",
          refreshTokenValue ? "Present" : "Missing"
        )
        if (!refreshTokenValue) {
          throw new Error("Không có refresh token")
        }
        const response = await refreshToken(refreshTokenValue)
        const newToken = response.accessToken
        console.log("New token after refresh:", newToken)
        localStorage.setItem("access_token", newToken)
        localStorage.setItem("refresh_token", response.refreshToken)
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        }
        console.log(
          "Retrying booking request with new token:",
          originalRequest.url
        )
        return axiosJWT(originalRequest)
      } catch (refreshError: any) {
        console.error("Failed to refresh token:", {
          message: refreshError.message,
          response: refreshError.response?.data,
          status: refreshError.response?.status,
        })
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        return Promise.reject(
          new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.")
        )
      }
    }
    return Promise.reject(error)
  }
)

// Interfaces synced with backend
interface Seat {
  seatNumber: string
  row: number
  column: number
}

interface Booking {
  _id: string
  userId: string
  movieId: string
  showtimeId: string
  seatIds: string[]
  totalPrice: number
  status: string
}

interface BookingDetails {
  movie: { title: string }
  cinema: { name: string; address: string }
  room: { roomNumber: string }
  seats: Seat[]
  showtime: { startTime: string; endTime: string }
}

interface CreateBookingResponse {
  booking: Booking
  totalPrice: number
  details: BookingDetails
}

interface CreateBookingRequest {
  showtimeId: string
  seatIds: string[]
}

interface ApiResponse<T> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a booking (POST /bookings)
export const createBooking = async (
  data: CreateBookingRequest,
  signal?: AbortSignal
): Promise<ApiResponse<CreateBookingResponse>> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in createBooking:",
      token ? `Present: ${token}` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for createBooking")
      throw new Error("No access token available. Please log in.")
    }
    console.log("Creating booking with data:", data)
    const res = await axiosJWT.post<ApiResponse<CreateBookingResponse>>(
      "/bookings",
      data,
      { signal }
    )
    console.log("createBooking response:", res.data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to create booking")
    }
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi tạo booking. Vui lòng thử lại."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()}`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      const errorData = axiosError.response?.data as
        | { status?: string; message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("createBooking error:", errorDetails)
    throw new Error(errorMessage)
  }
}

// Get user bookings (GET /bookings/my-bookings)
export const getUserBookings = async (
  signal?: AbortSignal
): Promise<ApiResponse<Booking[]>> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in getUserBookings:",
      token ? `Present: ${token}` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for getUserBookings")
      throw new Error("No access token available. Please log in.")
    }
    console.log("Fetching user bookings")
    const res = await axiosJWT.get<ApiResponse<Booking[]>>(
      "/bookings/my-bookings",
      { signal }
    )
    console.log("getUserBookings response:", res.data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to fetch bookings")
    }
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi lấy danh sách booking."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()}`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      const errorData = axiosError.response?.data as
        | { status?: string; message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("getUserBookings error:", errorDetails)
    throw new Error(errorMessage)
  }
}

// Delete a booking (DELETE /bookings/:bookingId)
export const deleteBooking = async (
  bookingId: string,
  signal?: AbortSignal
): Promise<ApiResponse<void>> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in deleteBooking:",
      token ? `Present: ${token}` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for deleteBooking")
      throw new Error("No access token available. Please log in.")
    }
    console.log("Deleting booking with ID:", bookingId)
    const res = await axiosJWT.delete<ApiResponse<void>>(
      `/bookings/${bookingId}`,
      { signal }
    )
    console.log("deleteBooking response:", res.data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to delete booking")
    }
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi xóa booking."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()}`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      const errorData = axiosError.response?.data as
        | { status?: string; message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
    }

    console.error("deleteBooking error:", errorDetails)
    throw new Error(errorMessage)
  }
}
