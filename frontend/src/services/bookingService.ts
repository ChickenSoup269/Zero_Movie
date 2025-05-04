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
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
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

// Interfaces synced with backend response
interface Seat {
  seatId: string
  seatNumber: string
  row: string
  column: number
}

interface Showtime {
  startTime: string
  endTime: string
  price: number
}

interface Booking {
  _id: string
  userId: string | null
  movieId: number
  movieTitle: string
  showtimeId: string
  showtime: Showtime
  cinemaName: string
  cinemaAddress: string
  roomNumber: string
  seatIds: string[]
  seats: Seat[]
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
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
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      throw new Error("No access token available. Please log in.")
    }

    // Validate input
    if (!data.showtimeId || typeof data.showtimeId !== "string") {
      console.error("Invalid showtimeId:", data.showtimeId)
      throw new Error("Showtime ID must be a valid string")
    }
    if (
      !Array.isArray(data.seatIds) ||
      data.seatIds.some((id) => typeof id !== "string")
    ) {
      console.error("Invalid seatIds:", data.seatIds)
      throw new Error("Seat IDs must be an array of strings")
    }

    console.log("Creating booking with data:", data)
    const res = await axiosJWT.post("/bookings", data, { signal })
    console.log("createBooking response:", {
      status: res.status,
      data: res.data,
    })

    // Handle server response structure
    if (res.data.status === "ERR" || !res.data.booking?._id) {
      console.error("Server returned ERR or invalid response:", res.data)
      throw new Error(res.data.message || "Failed to create booking")
    }

    // Transform server response
    const transformedResponse: ApiResponse<CreateBookingResponse> = {
      status: "OK",
      message: res.data.message,
      data: {
        booking: {
          _id: res.data.booking._id,
          userId: res.data.booking.userId,
          movieId: res.data.booking.movieId,
          movieTitle: res.data.details.movie.title,
          showtimeId: res.data.booking.showtimeId,
          showtime: res.data.details.showtime,
          cinemaName: res.data.details.cinema.name,
          cinemaAddress: res.data.details.cinema.address,
          roomNumber: res.data.details.room.roomNumber,
          seatIds: res.data.booking.seatIds,
          seats: res.data.details.seats,
          totalPrice: res.data.booking.totalPrice,
          status: res.data.booking.status,
        },
        totalPrice: res.data.totalPrice,
        details: res.data.details,
      },
    }

    return transformedResponse
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi tạo booking. Vui lòng thử lại."
    let errorDetails = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      requestPayload: data,
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()?.slice(0, 10)}...`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<any>
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

export const getAllBookings = async (
  signal?: AbortSignal
): Promise<ApiResponse<Booking[]>> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in getAllBookings:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      throw new Error("No access token available. Please log in.")
    }
    console.log("Fetching all bookings")
    const res = await axiosJWT.get("/bookings", { signal })
    console.log("getAllBookings raw response:", res.data)

    // Handle server response structure
    if (res.data.status === "ERR" || !res.data.bookings) {
      console.error("Server returned ERR or invalid response:", res.data)
      throw new Error(res.data.message || "Failed to fetch all bookings")
    }

    // Transform bookings
    const transformedBookings: Booking[] = res.data.bookings.map(
      (booking: any) => ({
        _id: booking._id,
        userId: booking.userId || null,
        movieId: booking.movieId,
        movieTitle: booking.movieTitle || "Phim không xác định",
        showtimeId: booking.showtimeId,
        showtime: {
          startTime: booking.showtime?.startTime || "",
          endTime: booking.showtime?.endTime || "",
          price: booking.showtime?.price || 0,
        },
        cinemaName: booking.cinemaName || "N/A",
        cinemaAddress: booking.cinemaAddress || "N/A",
        roomNumber: booking.roomNumber || "N/A",
        seatIds: booking.seatIds || [],
        seats:
          booking.seats?.map((seat: any) => ({
            seatId: seat.seatId,
            seatNumber: seat.seatNumber,
            row: seat.row,
            column: seat.column,
          })) || [],
        totalPrice: booking.totalPrice || 0,
        status: booking.status || "unknown",
      })
    )

    const transformedResponse: ApiResponse<Booking[]> = {
      status: "OK",
      message: res.data.message,
      data: transformedBookings,
    }

    console.log("getAllBookings transformed response:", transformedResponse)
    return transformedResponse
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi lấy danh sách tất cả booking."
    let errorDetails = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()?.slice(0, 10)}...`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<any>
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

    console.error("getAllBookings error:", errorDetails)
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
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      throw new Error("No access token available. Please log in.")
    }
    console.log("Fetching user bookings")
    const res = await axiosJWT.get("/bookings/my-bookings", { signal })
    console.log("getUserBookings raw response:", res.data)

    // Handle server response structure
    if (res.data.status === "ERR" || !res.data.bookings) {
      console.error("Server returned ERR or invalid response:", res.data)
      throw new Error(res.data.message || "Failed to fetch bookings")
    }

    // Transform bookings
    const transformedBookings: Booking[] = res.data.bookings.map(
      (booking: any) => ({
        _id: booking._id,
        userId: booking.userId,
        movieId: booking.movieId,
        movieTitle: booking.movieTitle || "Phim không xác định",
        showtimeId: booking.showtimeId,
        showtime: {
          startTime: booking.showtime?.startTime || "",
          endTime: booking.showtime?.endTime || "",
          price: booking.showtime?.price || 0,
        },
        cinemaName: booking.cinemaName || "N/A",
        cinemaAddress: booking.cinemaAddress || "N/A",
        roomNumber: booking.roomNumber || "N/A",
        seatIds: booking.seatIds || [],
        seats:
          booking.seats?.map((seat: any) => ({
            seatId: seat.seatId,
            seatNumber: seat.seatNumber,
            row: seat.row,
            column: seat.column,
          })) || [],
        totalPrice: booking.totalPrice || 0,
        status: booking.status || "unknown",
      })
    )

    const transformedResponse: ApiResponse<Booking[]> = {
      status: "OK",
      message: res.data.message,
      data: transformedBookings,
    }

    console.log("getUserBookings transformed response:", transformedResponse)
    return transformedResponse
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi lấy danh sách booking."
    let errorDetails = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()?.slice(0, 10)}...`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<any>
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
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      throw new Error("No access token available. Please log in.")
    }
    console.log("Deleting booking with ID:", bookingId)
    const res = await axiosJWT.delete(`/bookings/${bookingId}`, { signal })
    console.log("deleteBooking response:", res.data)

    // Handle server response structure
    if (res.data.status === "ERR") {
      console.error("Server returned ERR:", res.data)
      throw new Error(res.data.message || "Failed to delete booking")
    }

    return {
      status: "OK",
      message: res.data.message,
    }
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi xóa booking."
    let errorDetails = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()?.slice(0, 10)}...`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError<any>
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
