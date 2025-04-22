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
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interface for showtime-seat data
interface ShowtimeSeat {
  _id: string
  showtimeId: string
  seatId: string
  status: "available" | "booked" | "reserved"
  createdAt?: string
  updatedAt?: string
}

// Interface for creating a showtime-seat
interface CreateShowtimeSeatRequest {
  showtimeId: string
  seatId: string
  status?: "available" | "booked" | "reserved"
}

// Interface for updating seat status
interface UpdateSeatStatusRequest {
  status: "available" | "booked" | "reserved"
}

// Interface for API response
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a showtime-seat (POST /showtime-seats)
export const createShowtimeSeat = async (
  data: CreateShowtimeSeatRequest
): Promise<ApiResponse<ShowtimeSeat>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/showtime-seats`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
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

// Get showtime-seat by ID (GET /showtime-seats/:id)
export const getShowtimeSeatById = async (
  id: string
): Promise<ApiResponse<ShowtimeSeat>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtime-seats/${id}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Update seat status (PUT /showtime-seats/:id)
export const updateSeatStatus = async (
  id: string,
  data: UpdateSeatStatusRequest
): Promise<ApiResponse<ShowtimeSeat>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/showtime-seats/${id}`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a showtime-seat (DELETE /showtime-seats/:id)
export const deleteShowtimeSeat = async (
  id: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/showtime-seats/${id}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
