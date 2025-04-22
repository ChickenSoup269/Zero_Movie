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
  // Add token for non-GET requests (assuming GET endpoints are public)
  if (config.method !== "get") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interface for cinema data (adjusted to match backend)
interface Cinema {
  id: string
  name: string
  address: string
  createdAt: string
  updatedAt?: string
}

// Interface for showtime data (simplified for frontend use)
interface Showtime {
  id: string
  movieId: string
  cinemaId: string
  startTime: string
  endTime: string
  createdAt: string
}

// Interface for cinema request
interface CinemaRequest {
  name: string
  address: string
}

// Interface for API response (adjusted to match backend structure)
interface ApiResponse<T = any> {
  message: string
  cinema?: T
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
    throw axiosError.response?.data || axiosError
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
    throw axiosError.response?.data || axiosError
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
    const res = await axiosJWT.get(
      `${API_URL}/cinemas/${cinemaId}/showtimes?${query.toString()}`
    )
    return {
      message: res.data.message,
      cinema: res.data.cinema,
      showtimes: res.data.showtimes,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response?.data || axiosError
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
    throw axiosError.response?.data || axiosError
  }
}

// Update a cinema (PUT /cinemas/:id)
export const updateCinema = async (
  cinemaId: string,
  data: CinemaRequest
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
    throw axiosError.response?.data || axiosError
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
    throw axiosError.response?.data || axiosError
  }
}
