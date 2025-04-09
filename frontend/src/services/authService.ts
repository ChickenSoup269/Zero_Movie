import axios, { AxiosError } from "axios"

const axiosJWT = axios.create()

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

export const register = async (data: {
  username: string
  email: string
  password: string
  fullName: string
}) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/register`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/login`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const refreshToken = async (refreshToken: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const logout = async (refreshToken: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/logout`, {
      refreshToken,
    })
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const createGuestSession = async () => {
  try {
    const res = await axiosJWT.post(`${API_URL}/auth/guestsession`)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
