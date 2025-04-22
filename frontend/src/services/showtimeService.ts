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

// Interface for showtime data
interface Showtime {
  _id: string
  movieId: number
  roomId: string
  startTime: string
  endTime: string
  price: number
  createdAt?: string
  updatedAt?: string
}

// Interface for creating/updating a showtime
interface ShowtimeRequest {
  movieId: number
  roomId: string
  startTime: string
  endTime: string
  price: number
}

// Interface for API response
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

// Get showtimes by movie ID (GET /showtimes/movie/:movieId)
export const getShowtimesByMovie = async (
  movieId: number
): Promise<ApiResponse<Showtime[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtimes/movie/${movieId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get showtimes by room ID (GET /showtimes/room/:roomId)
export const getShowtimesByRoom = async (
  roomId: string
): Promise<ApiResponse<Showtime[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtimes/room/${roomId}`)
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

// Update a showtime (PUT /showtimes/:id)
export const updateShowtime = async (
  showtimeId: string,
  data: Partial<ShowtimeRequest>
): Promise<ApiResponse<Showtime>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/showtimes/${showtimeId}`, data)
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
