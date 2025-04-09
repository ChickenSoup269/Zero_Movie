/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

const axiosJWT = axios.create()

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

// Lấy danh sách tất cả phim
export const getAllMovies = async () => {
  try {
    const res = await axios.get(`${API_URL}/movies/`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Lấy thông tin phim theo tmdbId
export const getMovieById = async (tmdbId: number) => {
  try {
    const res = await axios.get(`${API_URL}/movies/${tmdbId}`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Tìm kiếm phim theo tiêu đề
export const searchMoviesByTitle = async (title: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/movies/search/${encodeURIComponent(title)}`
    )
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

// Thêm phim mới (yêu cầu quyền admin)
export const addMovie = async (movieData: any, access_token: string) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/movies/`, movieData, {
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

// Cập nhật phim theo tmdbId (yêu cầu quyền admin)
export const updateMovie = async (
  tmdbId: number,
  movieData: any,
  access_token: string
) => {
  try {
    const res = await axiosJWT.put(`${API_URL}/movies/${tmdbId}`, movieData, {
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

// Xóa phim theo tmdbId (yêu cầu quyền admin)
export const deleteMovie = async (tmdbId: number, access_token: string) => {
  try {
    const res = await axiosJWT.delete(`${API_URL}/movies/${tmdbId}`, {
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
