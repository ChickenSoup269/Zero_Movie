/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

// Create axios instance
const axiosJWT = axios.create()

// Read API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

axiosJWT.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface Cinema {
  id: string
  name: string
  address: string
  city: string
  createdAt: string
}

interface Showtime {
  id: string
  movieId: string
  cinemaId: string
  startTime: string
  endTime: string
  createdAt: string
}

interface CinemaRequest {
  name: string
  address: string
  city: string
}

interface ApiResponse<T = any> {
  status: "OK" | "ERR"
  message?: string
  data?: T
}

// Get all cinemas (GET /cinemas)
export const getAllCinemas = async (): Promise<ApiResponse<Cinema[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/cinemas`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get cinema by ID (GET /cinemas/:id)
export const getCinemaById = async (
  cinemaId: string
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/cinemas/${cinemaId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Get showtimes by cinema ID (GET /cinemas/:id/showtimes)
export const getShowtimesByCinemaId = async (
  cinemaId: string
): Promise<ApiResponse<Showtime[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/cinemas/${cinemaId}/showtimes`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Create a cinema (POST /cinemas)
export const createCinema = async (
  data: CinemaRequest
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/cinemas`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Update a cinema (PUT /cinemas/:id)
export const updateCinema = async (
  cinemaId: string,
  data: CinemaRequest
): Promise<ApiResponse<Cinema>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/cinemas/${cinemaId}`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Delete a cinema (DELETE /cinemas/:id)
export const deleteCinema = async (
  cinemaId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/cinemas/${cinemaId}`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
