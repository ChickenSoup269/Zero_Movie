/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

// Create axios instance
const axiosJWT = axios.create()

// Read API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Add token to requests via interceptor for authenticated endpoints
axiosJWT.interceptors.request.use((config) => {
  // Only add token for non-GET requests (assuming GET endpoint is public)
  if (config.method !== "get") {
    const token = localStorage.getItem("token") // Replace with your token retrieval method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for showtime-seat data
interface ShowtimeSeat {
  id: string
  showtimeId: string
  seatId: string
  seatNumber: string // e.g., 'A1', 'B12'
  status: "available" | "reserved" | "booked" // Adjust based on backend
  type: "standard" | "VIP" | "accessible" // Adjust based on backend
  // Add other fields as needed (e.g., price)
}

// Interface for updating seat status request
interface UpdateSeatStatusRequest {
  status: "available" | "reserved" | "booked" // Adjust based on backend
}

// Interface for API response (matches authService.js style)
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Get seats by showtime ID (GET /showtime-seats/showtime/:showtimeId)
export const getSeatsByShowtime = async (
  showtimeId: string
): Promise<ApiResponse<ShowtimeSeat[]>> => {
  try {
    const res = await axiosJWT.get(
      `${API_URL}/showtime-seats/showtime/${showtimeId}`
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Update seat status (PUT /showtime-seats/showtime/:showtimeId/seat/:seatId)
export const updateSeatStatus = async (
  showtimeId: string,
  seatId: string,
  data: UpdateSeatStatusRequest
): Promise<ApiResponse<ShowtimeSeat>> => {
  try {
    const res = await axiosJWT.put(
      `${API_URL}/showtime-seats/showtime/${showtimeId}/seat/${seatId}`,
      data
    )
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
