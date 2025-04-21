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
  // Only add token for non-GET requests (assuming GET endpoints are public)
  if (config.method !== "get") {
    const token = localStorage.getItem("token") // Replace with your token retrieval method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for showtime data
interface Showtime {
  id: string
  movieId: string
  roomId: string
  startTime: string
  endTime: string
  price: number
  createdAt: string
  // Add other fields as needed
}

// Interface for creating a showtime request
interface ShowtimeRequest {
  movieId: string
  roomId: string
  startTime: string
  endTime: string
  price: number
  // Add other fields as needed
}

// Interface for API response (matches authService.js style)
interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Create a showtime (POST /showtimes)
export const createShowtime = async (
  data: ShowtimeRequest
): Promise<ApiResponse<Showtime>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/showtimes`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get all showtimes (GET /showtimes)
export const getAllShowtimes = async (): Promise<ApiResponse<Showtime[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtimes`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get showtime by ID (GET /showtimes/:id)
export const getShowtimeById = async (
  showtimeId: string
): Promise<ApiResponse<Showtime>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtimes/${showtimeId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a showtime (DELETE /showtimes/:id)
export const deleteShowtime = async (
  showtimeId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/showtimes/${showtimeId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
