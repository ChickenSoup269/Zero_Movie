import axios, { AxiosError } from "axios"

const axiosJWT = axios.create()

const API_URL = process.env.API_URL

export const getUserProfile = async (access_token: string) => {
  try {
    const res = await axiosJWT.get(`${API_URL}/user/profile`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    })
    return res.data
  } catch (error) {
    // Ép kiểu error thành AxiosError
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const updateUserProfile = async (
  access_token: string,
  data: { username?: string; email?: string; fullName?: string }
) => {
  try {
    const res = await axiosJWT.put(`${API_URL}/user/profile`, data, {
      headers: {
        token: `Bearer ${access_token}`,
      },
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

export const deleteUserService = async (id: string, access_token: string) => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/user/${id}`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
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

export const getAllUsers = async (access_token: string) => {
  try {
    const res = await axiosJWT.get(`${API_URL}/user/`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    })
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

export const searchUsers = async (access_token: string, query: string) => {
  try {
    const res = await axiosJWT.get(
      `${API_URL}/user/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    )
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}
