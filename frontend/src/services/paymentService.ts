/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios"

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env file")
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    return token
  }
  return null
}

axiosJWT.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    console.log("Request URL:", config.url)
    console.log(
      "Token in interceptor:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn("No access_token found for request:", config.url)
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

export interface CreatePaymentRequest {
  bookingId: string
  amount: number
  paymentMethod: string
}

export interface CreatePaymentResponse {
  message: string
  payment: {
    _id: string
    bookingId: string
    userId: string
    amount: number
    status: string
  }
  orderId: string
  approveUrl: string
}

export const createPayment = async (
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const token = getAuthToken()
    console.log(
      "Token in createPayment:",
      token ? `Present: ${token.slice(0, 10)}...` : "Missing"
    )
    if (!token) {
      console.error("No access_token found for createPayment")
      throw new Error("Vui lòng đăng nhập để thực hiện thanh toán")
    }
    console.log("Creating payment with data:", data)
    const res = await axiosJWT.post(`${API_URL}/payments/create`, {
      ...data,
      paymentMethod: "paypal",
    })
    console.log("createPayment response:", res.data)
    if (!res.data.approveUrl && data.paymentMethod === "paypal") {
      console.error("createPayment response missing approveUrl:", res.data)
      throw new Error("API không trả về approveUrl cho thanh toán PayPal.")
    }
    return res.data
  } catch (error: any) {
    const isAxiosError = axios.isAxiosError(error)
    let errorMessage = "Lỗi khi tạo thanh toán. Vui lòng thử lại."
    let errorDetails: any = {
      message: error.message || "Unknown error",
      response: error.response?.data || "No response data",
      status: error.response?.status || "No status",
      requestUrl: error.config?.url || "Unknown URL",
      tokenBeforeError: getAuthToken()
        ? `Present: ${getAuthToken()?.slice(0, 10)}...`
        : "Missing",
      refreshTokenAvailable: localStorage.getItem("refresh_token")
        ? "Present"
        : "Missing",
      stack: error.stack,
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError
      const errorData = axiosError.response?.data as
        | { status?: string; message?: string }
        | undefined
      errorDetails = {
        ...errorDetails,
        message: errorData?.message || axiosError.message || "Unknown error",
        response: errorData || axiosError.response || "No response data",
        status: axiosError.response?.status || "No status",
      }
      errorMessage = errorData?.message || axiosError.message || errorMessage
      if (errorData?.message?.includes("Booking không hợp lệ")) {
        errorMessage = "Booking không hợp lệ. Vui lòng thử lại."
      } else if (errorData?.message?.includes("Tổng giá không hợp lệ")) {
        errorMessage = "Giá vé không hợp lệ. Vui lòng liên hệ hỗ trợ."
      }
    }

    console.error("createPayment error:", errorDetails)
    throw new Error(errorMessage)
  }
}
