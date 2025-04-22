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

interface Seat {
  id: string
  roomId: string
  seatNumber: string
  row: string
  column: number
  type: "standard"
}

interface SeatRequest {
  roomId: string
  seatNumber: string
  row: string
  column: number
  type: "standard"
}

interface ApiResponse<T = any> {
  message: string
  seat?: T
  seats?: T[]
}

export const getSeatsByRoom = async (
  roomId: string
): Promise<ApiResponse<Seat[]>> => {
  try {
    const res = await axiosJWT.get(`${API_URL}/seats/room/${roomId}`)
    console.log("getSeatsByRoom response:", res.data)
    return {
      message: res.data.message,
      seats: res.data.seats
        ? res.data.seats.map((seat: any) => ({
            id: seat._id,
            roomId: seat.roomId,
            seatNumber: seat.seatNumber,
            row: seat.row,
            column: seat.column,
            type: seat.type || "standard",
          }))
        : [],
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

export const deleteSeat = async (
  seatId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/seats/${seatId}`)
    return {
      message: res.data.message,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

// Giả định createSeat và updateSeat (nếu cần)
export const createSeat = async (
  data: SeatRequest
): Promise<ApiResponse<Seat>> => {
  try {
    const res = await axiosJWT.post(`${API_URL}/seats`, data)
    return {
      message: res.data.message,
      seat: {
        id: res.data.seat._id,
        roomId: res.data.seat.roomId,
        seatNumber: res.data.seat.seatNumber,
        row: res.data.seat.row,
        column: res.data.seat.column,
        type: res.data.seat.type || "standard",
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}

export const updateSeat = async (
  seatId: string,
  data: Partial<SeatRequest>
): Promise<ApiResponse<Seat>> => {
  try {
    const res = await axiosJWT.put(`${API_URL}/seats/${seatId}`, data)
    return {
      message: res.data.message,
      seat: {
        id: res.data.seat._id,
        roomId: res.data.seat.roomId,
        seatNumber: res.data.seat.seatNumber,
        row: res.data.seat.row,
        column: res.data.seat.column,
        type: res.data.seat.type || "standard",
      },
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorData = axiosError.response?.data as { message?: string }
    throw new Error(errorData?.message || axiosError.message)
  }
}
