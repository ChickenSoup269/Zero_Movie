/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios"

// Create axios instance
const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Token management
let accessToken: string | null = localStorage.getItem("token")

export const updateToken = (token: string | null) => {
  accessToken = token
  if (token) {
    localStorage.setItem("token", token)
  } else {
    localStorage.removeItem("token")
  }
}

// Interceptor to add token to requests
axiosJWT.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
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
        // Giả sử có API refresh token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        )
        const newToken = response.data.accessToken
        updateToken(newToken)
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        }
        return axiosJWT(originalRequest)
      } catch (refreshError) {
        updateToken(null) // Clear token on refresh failure
        return Promise.reject(refreshError)
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
    if (!accessToken) {
      throw new Error("No access token available. Please log in.")
    }
    const res = await axiosJWT.post<ApiResponse<CreateBookingResponse>>(
      "/bookings",
      data,
      { signal }
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to create booking")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
      }
    )
  }
}

// Get user bookings (GET /bookings/my-bookings)
export const getUserBookings = async (
  signal?: AbortSignal
): Promise<ApiResponse<Booking[]>> => {
  try {
    if (!accessToken) {
      throw new Error("No access token available. Please log in.")
    }
    const res = await axiosJWT.get<ApiResponse<Booking[]>>(
      "/bookings/my-bookings",
      {
        signal,
      }
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to fetch bookings")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
      }
    )
  }
}

// Delete a booking (DELETE /bookings/:bookingId)
export const deleteBooking = async (
  bookingId: string,
  signal?: AbortSignal
): Promise<ApiResponse<void>> => {
  try {
    if (!accessToken) {
      throw new Error("No access token available. Please log in.")
    }
    const res = await axiosJWT.delete<ApiResponse<void>>(
      `/bookings/${bookingId}`,
      {
        signal,
      }
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message || "Failed to delete booking")
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    throw (
      axiosError.response?.data || {
        status: "ERR",
        message: axiosError.message,
      }
    )
  }
}
