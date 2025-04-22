/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

const axiosJWT = axios.create()

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

axiosJWT.interceptors.request.use((config) => {
  if (config.method !== "get") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

interface Room {
  _id: string
  cinemaId: string
  roomNumber: string
  capacity: number
  createdAt?: string
  updatedAt?: string
}

interface RoomRequest {
  cinemaId: string
  roomNumber: string
  capacity: number
}

interface ApiResponse<T = any> {
  message: string
  rooms?: T[]
  room?: T
}

export const getRoomsByCinemaId = async (
  cinemaId: string
): Promise<ApiResponse<Room[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/rooms/cinema/${cinemaId}`)
    console.log("getRoomsByCinemaId response:", res.data)
    return {
      message: res.data.message,
      rooms: res.data.rooms
        ? res.data.rooms.map((room: any) => ({
            _id: room._id,
            cinemaId: room.cinemaId,
            roomNumber: room.roomNumber,
            capacity: room.capacity,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
          }))
        : [],
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

export const createRoom = async (
  data: RoomRequest
): Promise<ApiResponse<Room>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/rooms`, data)
    return {
      message: res.data.message,
      room: {
        _id: res.data.room._id,
        cinemaId: res.data.room.cinemaId,
        roomNumber: res.data.room.roomNumber,
        capacity: res.data.room.capacity,
        createdAt: res.data.room.createdAt,
        updatedAt: res.data.room.updatedAt,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

export const updateRoom = async (
  roomId: string,
  data: Partial<RoomRequest>
): Promise<ApiResponse<Room>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/rooms/${roomId}`, data)
    return {
      message: res.data.message,
      room: {
        _id: res.data.room._id,
        cinemaId: res.data.room.cinemaId,
        roomNumber: res.data.room.roomNumber,
        capacity: res.data.room.capacity,
        createdAt: res.data.room.createdAt,
        updatedAt: res.data.room.updatedAt,
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

export const deleteRoom = async (
  roomId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/rooms/${roomId}`)
    return {
      message: res.data.message,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}
