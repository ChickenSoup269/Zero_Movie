/* eslint-disable @typescript-eslint/no-explicit-any */
import { Movie } from "@/services/movieService"
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
  // Add token for POST and DELETE requests (assuming GET endpoints are public)
  if (config.method === "post" || config.method === "delete") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for showtime data (matched with backend response)
interface Showtime {
  id: string
  movieId: number
  roomId: string // Expects a string, but API returns an object
  startTime: string
  endTime: string
  price: number
  movie?: Movie
}
// Interface for creating a showtime (matched with backend input)
interface ShowtimeRequest {
  movieId: number
  roomId: string
  startTime: string
  endTime: string
  price: number
}

// Interface for API response (matched with backend structure)
interface ApiResponse<T = any> {
  message: string
  showtime?: T
  showtimes?: T[]
}

// Create a showtime (POST /showtimes)
export const createShowtime = async (
  data: ShowtimeRequest
): Promise<ApiResponse<Showtime>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/showtime`, data)
    return {
      message: res.data.message,
      showtime: {
        id: res.data.showtime._id,
        movieId: res.data.showtime.movieId,
        roomId: res.data.showtime.roomId,
        startTime: res.data.showtime.startTime,
        endTime: res.data.showtime.endTime,
        price: res.data.showtime.price,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Get all showtimes (GET /showtimes)
export const getAllShowtimes = async (): Promise<ApiResponse<Showtime[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtime`)
    return {
      message: res.data.message,
      showtimes: res.data.showtimes.map((showtime: any) => ({
        id: showtime._id,
        movieId: showtime.movieId,
        roomId: showtime.roomId,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price,
      })),
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Get showtime by ID (GET /showtimes/:id)
export const getShowtimeById = async (
  showtimeId: string
): Promise<ApiResponse<Showtime>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/showtime/${showtimeId}`)
    return {
      message: res.data.message,
      showtime: {
        id: res.data.showtime._id,
        movieId: res.data.showtime.movieId,
        roomId: res.data.showtime.roomId,
        startTime: res.data.showtime.startTime,
        endTime: res.data.showtime.endTime,
        price: res.data.showtime.price,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Delete a showtime (DELETE /showtimes/:id)
export const deleteShowtime = async (
  showtimeId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/showtime/${showtimeId}`)
    return {
      message: res.data.message,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}
