/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"
import { MovieService } from "@/services/movieService"
// Create axios instance
const axiosJWT = axios.create()

// Read API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Add token to requests via interceptor for authenticated endpoints
axiosJWT.interceptors.request.use((config) => {
  // Add token for non-GET requests (assuming GET endpoints are public)
  if (config.method !== "get") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for cinema data (matched with backend response)
interface Cinema {
  id: string
  name: string
  address: string
  createdAt: string
  updatedAt?: string
}

// Interface for showtime data (matched with backend response)
interface Showtime {
  id: string
  movieId: number
  movieTitle?: string
  roomId: string | { _id: string; [key: string]: any }
  roomNumber: string
  startTime: string
  endTime: string
  price?: number | null
}

// Interface for cinema request (matched with backend input)
interface CinemaRequest {
  name: string
  address: string
}

// Interface for API response (matched with backend structure)
interface ApiResponse<T = any> {
  message: string
  cinema?: Cinema
  cinemas?: T[]
  showtimes?: Showtime[]
}

// Get all cinemas (GET /cinemas)
export const getAllCinemas = async (): Promise<ApiResponse<Cinema[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/cinemas`)
    return {
      message: res.data.message,
      cinemas: res.data.cinemas.map((cinema: any) => ({
        id: cinema._id,
        name: cinema.name,
        address: cinema.address,
        createdAt: cinema.createdAt,
        updatedAt: cinema.updatedAt,
      })),
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Get cinema by ID (GET /cinemas/:id)
export const getCinemaById = async (
  cinemaId: string
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/cinemas/${cinemaId}`)
    return {
      message: res.data.message,
      cinema: {
        id: res.data.cinema._id,
        name: res.data.cinema.name,
        address: res.data.cinema.address,
        createdAt: res.data.cinema.createdAt,
        updatedAt: res.data.cinema.updatedAt,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Get showtimes by cinema ID (GET /cinemas/:id/showtimes)
export const getShowtimesByCinemaId = async (
  cinemaId: string,
  date?: string,
  movieId?: string
): Promise<ApiResponse<Showtime[]>> => {
  try {
    const query = new URLSearchParams()
    if (date) query.append("date", date)
    if (movieId) query.append("movieId", movieId)
    const res = await axiosJWT.get(`${API_URL}/cinemas/${cinemaId}/showtimes`)
    console.log("Raw API response từ getShowtimesByCinemaId:", res.data)

    return {
      message: res.data.message,
      cinema: res.data.cinema
        ? {
            id: res.data.cinema._id,
            name: res.data.cinema.name,
            address: res.data.cinema.address,
            createdAt: res.data.cinema.createdAt,
            updatedAt: res.data.cinema.updatedAt,
          }
        : undefined,
      showtimes: res.data.showtimes.map((showtime: any) => {
        console.log("Showtime trước ánh xạ:", showtime)
        return {
          id: showtime._id,
          movieId: showtime.movieId,
          movieTitle: showtime.movieTitle,
          roomId: showtime.roomId?._id || showtime.roomId,
          roomNumber: showtime.roomNumber,
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          price: showtime.price !== undefined ? showtime.price : null,
        }
      }),
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Create a cinema (POST /cinemas)
export const createCinema = async (
  data: CinemaRequest
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/cinemas`, data)
    return {
      message: res.data.message,
      cinema: {
        id: res.data.cinema._id,
        name: res.data.cinema.name,
        address: res.data.cinema.address,
        createdAt: res.data.cinema.createdAt,
        updatedAt: res.data.cinema.updatedAt,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Update a cinema (PUT /cinemas/:id)
export const updateCinema = async (
  cinemaId: string,
  data: Partial<CinemaRequest>
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/cinemas/${cinemaId}`, data)
    return {
      message: res.data.message,
      cinema: {
        id: res.data.cinema._id,
        name: res.data.cinema.name,
        address: res.data.cinema.address,
        createdAt: res.data.cinema.createdAt,
        updatedAt: res.data.cinema.updatedAt,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Delete a cinema (DELETE /cinemas/:id)
export const deleteCinema = async (
  cinemaId: string
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/cinemas/${cinemaId}`)
    return {
      message: res.data.message,
      cinema: {
        id: res.data.cinema._id,
        name: res.data.cinema.name,
        address: res.data.cinema.address,
        createdAt: res.data.cinema.createdAt,
        updatedAt: res.data.cinema.updatedAt,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}
