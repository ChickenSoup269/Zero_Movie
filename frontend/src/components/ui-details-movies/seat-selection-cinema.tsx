/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Ticket from "./ticket"
import DatePicker from "./date-picker"
import SeatPicker from "./seat-picker"
import { PaymentSummary } from "./payment-summary"
import PaymentDialog from "./payment-dialog"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import CustomDropdown from "@/components/ui-dropdown/custom-dropdown"
import { getRoomsByCinemaId } from "@/services/roomService"
import { getShowtimesByCinemaId } from "@/services/cinemaService"
import {
  getSeatsByShowtime,
  updateSeatStatus,
} from "@/services/showtimeSeatService"
import { createBooking, deleteBooking } from "@/services/bookingService"
import { createPayment, capturePayment } from "@/services/paymentService"
import { refreshToken } from "@/services/authService"
import UserService from "@/services/userService"
import axios from "axios"

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    return token
  }
  return null
}

interface MovieInfo {
  id: number
  tmdbId: number
  title: string
  image: string
  poster: string
  genre: string
  rating: number
  ageRating: string
  duration: string
  description: string
  director: string
  writers: string[]
  starring: string
}

interface Theater {
  id: string
  name: string
  address: string
  createdAt?: string
  updatedAt?: string
  image?: string
  phone?: string
  description?: string
  mapUrl?: string
}

interface Showtime {
  id: string
  movieId: number
  roomId: string | { _id: string; [key: string]: any }
  roomNumber: string
  startTime: string
  endTime: string
  price?: number | null
}

interface TimeOption {
  value: string
  label: string
  price: number
}

interface Seat {
  id: string // ShowtimeSeat._id
  seatNumber: string
  status: "available" | "booked" | "reserved"
}

interface SeatPickerRef {
  markSeatsAsSold: () => void
}

interface SeatSelectionProps {
  movieInfo?: MovieInfo // Optional để xử lý khi movieInfo undefined
  theaters: Theater[]
}

const parseShowtimeDate = (dateString: string): Date => {
  try {
    return new Date(dateString)
  } catch (error) {
    console.error("Invalid date format:", dateString)
    return new Date()
  }
}

const SeatSelection = ({ movieInfo, theaters }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [ticketCount, setTicketCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-04-27"))
  const [ticketId, setTicketId] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("2D")
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [selectionMode, setSelectionMode] = useState<
    "single" | "pair" | "triple" | "group4"
  >("single")
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
  const [showtimeId, setShowtimeId] = useState<string | null>(null)
  const [ticketPrice, setTicketPrice] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMovieLoading, setIsMovieLoading] = useState(!movieInfo)
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([])
  const [bookingDetails, setBookingDetails] = useState<any | null>(null)
  const [priceWarning, setPriceWarning] = useState<string | null>(null)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([])
  const [soldSeats, setSoldSeats] = useState<string[]>([])
  const seatPickerRef = useRef<SeatPickerRef>(null)
  const { toast } = useToast()
  const router = useRouter()

  const typeOptions = [
    { value: "2D", label: "2D" },
    { value: "3D", label: "3D" },
    { value: "IMAX", label: "IMAX" },
  ]
  const modeOptions = [
    { value: "single", label: "Single" },
    { value: "pair", label: "Pair (2 seats)" },
    { value: "triple", label: "Triple (3 seats)" },
    { value: "group4", label: "Group (4 seats)" },
  ]
  const theaterOptions = theaters.map((theater) => ({
    value: theater.id,
    label: theater.name,
  }))

  // Đặt rạp mặc định
  useEffect(() => {
    console.log("Theaters prop:", theaters)
    if (theaters.length > 0 && !selectedTheater) {
      setSelectedTheater(theaters[0])
      console.log("Đặt rạp mặc định:", theaters[0])
    } else if (theaters.length === 0) {
      setError("Không tìm thấy rạp chiếu phim.")
      toast({
        title: "Lỗi",
        description: "Không tìm thấy rạp chiếu phim.",
        variant: "destructive",
      })
    }
  }, [theaters, toast])

  // Kiểm tra movieInfo
  useEffect(() => {
    if (!movieInfo) {
      setError("Thông tin phim không khả dụng. Vui lòng thử lại.")
      toast({
        title: "Lỗi",
        description: "Thông tin phim không khả dụng.",
        variant: "destructive",
      })
      setIsMovieLoading(true)
    } else if (!movieInfo.tmdbId) {
      setError("Thông tin phim thiếu tmdbId. Vui lòng chọn phim khác.")
      toast({
        title: "Lỗi",
        description: "Thông tin phim thiếu tmdbId.",
        variant: "destructive",
      })
      setIsMovieLoading(false)
    } else {
      console.log("movieInfo:", movieInfo)
      setError(null)
      setIsMovieLoading(false)
    }
  }, [movieInfo, toast])

  const generateTicketId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const randomLetters =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)]
    const randomNumbers =
      numbers[Math.floor(Math.random() * numbers.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      numbers[Math.floor(Math.random() * numbers.length)]
    return `${randomLetters}${randomNumbers}`
  }

  useEffect(() => {
    if (selectedSeats.length === 1 && ticketId === "") {
      setTicketId(generateTicketId())
    } else if (selectedSeats.length === 0) {
      setTicketId("")
    }
  }, [selectedSeats, ticketId])

  useEffect(() => {
    setTicketCount(selectedSeats.length)
  }, [selectedSeats])

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedTheater?.id) {
        setError("Vui lòng chọn rạp chiếu phim hợp lệ.")
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn rạp chiếu phim hợp lệ.",
          variant: "destructive",
        })
        return
      }
      try {
        setError(null)
        const response = await getRoomsByCinemaId(selectedTheater.id)
        console.log("Phản hồi phòng:", response)
        const options =
          response.rooms?.map((room) => ({
            value: room._id,
            label: room.roomNumber,
          })) || []
        setRoomOptions(options)
        setSelectedRoom(options[0]?.value || "")
      } catch (error: any) {
        setError("Không thể lấy danh sách phòng.")
        toast({
          title: "Lỗi",
          description: "Không thể lấy danh sách phòng.",
          variant: "destructive",
        })
        console.error("Lỗi khi lấy phòng:", error)
      }
    }
    if (selectedTheater?.id) {
      fetchRooms()
    }
  }, [selectedTheater?.id, toast])

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (
        !selectedTheater?.id ||
        !selectedDate ||
        !movieInfo?.tmdbId ||
        !selectedRoom
      ) {
        setError("Vui lòng chọn rạp, ngày, phim và phòng hợp lệ.")
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn rạp, ngày, phim và phòng hợp lệ.",
          variant: "destructive",
        })
        setTimeOptions([])
        setShowtimeId(null)
        setSelectedTime("")
        setTicketPrice(0)
        return
      }
      try {
        setError(null)
        setPriceWarning(null)
        console.log("Đang lấy lịch chiếu với tham số:", {
          cinemaId: selectedTheater.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          movieId: movieInfo.tmdbId.toString(),
          selectedRoom,
        })
        const response = await getShowtimesByCinemaId(
          selectedTheater.id,
          format(selectedDate, "yyyy-MM-dd"),
          movieInfo.tmdbId.toString()
        )
        console.log("Raw API response:", response)

        if (!response.showtimes || response.showtimes.length === 0) {
          setError(
            `Không tìm thấy lịch chiếu cho phim "${
              movieInfo.title
            }" vào ngày ${format(selectedDate, "dd/MM/yyyy")}.`
          )
          toast({
            title: "Lỗi",
            description: `Không tìm thấy lịch chiếu cho phim "${
              movieInfo.title
            }" vào ngày ${format(selectedDate, "dd/MM/yyyy")}.`,
            variant: "destructive",
          })
          setTimeOptions([])
          setShowtimeId(null)
          setSelectedTime("")
          setTicketPrice(0)
          return
        }

        const filteredShowtimes: Showtime[] = response.showtimes.filter(
          (showtime: Showtime) => {
            const roomId =
              typeof showtime.roomId === "string"
                ? showtime.roomId
                : showtime.roomId?._id
            return (
              showtime.movieId === movieInfo.tmdbId && roomId === selectedRoom
            )
          }
        )
        console.log("Lịch chiếu đã lọc:", filteredShowtimes)

        if (filteredShowtimes.length === 0) {
          setError(
            `Không tìm thấy lịch chiếu cho phim "${
              movieInfo.title
            }" tại phòng "${
              roomOptions.find((opt) => opt.value === selectedRoom)?.label
            }" vào ngày ${format(selectedDate, "dd/MM/yyyy")}.`
          )
          toast({
            title: "Lỗi",
            description: `Không tìm thấy lịch chiếu cho phim "${
              movieInfo.title
            }" tại phòng "${
              roomOptions.find((opt) => opt.value === selectedRoom)?.label
            }" vào ngày ${format(selectedDate, "dd/MM/yyyy")}.`,
            variant: "destructive",
          })
          setTimeOptions([])
          setShowtimeId(null)
          setSelectedTime("")
          setTicketPrice(0)
          return
        }

        let hasInvalidPrice = false
        const defaultPrice = 75000 // Cập nhật giá vé mặc định dựa trên booking
        const options: TimeOption[] = filteredShowtimes.map((showtime) => {
          const date = parseShowtimeDate(showtime.startTime)
          const timeString = format(date, "HH:mm")
          const price =
            showtime.price && showtime.price > 0 ? showtime.price : defaultPrice
          if (!showtime.price || showtime.price <= 0) {
            hasInvalidPrice = true
          }
          return {
            value: showtime.id,
            label: timeString,
            price,
          }
        })

        if (hasInvalidPrice) {
          setPriceWarning(
            "Giá vé không khả dụng cho suất chiếu này. Đang sử dụng giá mặc định 75,000đ."
          )
          toast({
            title: "Cảnh báo",
            description:
              "Giá vé không khả dụng. Đang sử dụng giá mặc định 75,000đ.",
            variant: "default",
          })
        }

        setTimeOptions(options)
        if (options.length > 0) {
          setShowtimeId(options[0].value)
          setSelectedTime(options[0].label)
          setTicketPrice(options[0].price)
          console.log("Đã chọn lịch chiếu đầu tiên:", {
            showtimeId: options[0].value,
            time: options[0].label,
            price: options[0].price,
          })
        } else {
          setShowtimeId(null)
          setSelectedTime("")
          setTicketPrice(0)
        }
      } catch (error: any) {
        setError("Không thể lấy lịch chiếu. Vui lòng thử lại.")
        toast({
          title: "Lỗi",
          description: "Không thể lấy lịch chiếu. Vui lòng thử lại.",
          variant: "destructive",
        })
        console.error("Lỗi khi lấy lịch chiếu:", error)
        setTimeOptions([])
        setShowtimeId(null)
        setSelectedTime("")
        setTicketPrice(0)
      }
    }
    if (selectedTheater?.id && selectedRoom && movieInfo?.tmdbId) {
      fetchShowtimes()
    }
  }, [
    selectedTheater?.id,
    selectedDate,
    movieInfo,
    selectedRoom,
    roomOptions,
    toast,
  ])

  useEffect(() => {
    const fetchSeats = async () => {
      if (!showtimeId) {
        setAvailableSeats([])
        setSoldSeats([])
        setError("Vui lòng chọn suất chiếu.")
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn suất chiếu.",
          variant: "destructive",
        })
        return
      }
      try {
        console.log("Fetching seats for showtimeId:", showtimeId)
        const seatResponse = await getSeatsByShowtime(showtimeId)
        console.log("seatResponse:", seatResponse)
        if (!seatResponse.seats || seatResponse.seats.length === 0) {
          setError("Không có ghế khả dụng cho suất chiếu này.")
          toast({
            title: "Lỗi",
            description: "Không có ghế khả dụng cho suất chiếu này.",
            variant: "destructive",
          })
          setAvailableSeats([])
          setSoldSeats([])
          return
        }
        const seats: Seat[] = seatResponse.seats.map((seat: any) => ({
          id: seat._id || seat.id, // Đảm bảo lấy _id
          seatNumber: seat.seatNumber,
          status: seat.status as "available" | "booked" | "reserved",
        }))
        setAvailableSeats(seats)
        setSoldSeats(
          seats
            .filter(
              (seat) => seat.status === "booked" || seat.status === "reserved"
            )
            .map((seat) => seat.seatNumber)
        )
        setSelectedSeats((prev) =>
          prev.filter((seatNumber) =>
            seats.some(
              (s) => s.seatNumber === seatNumber && s.status === "available"
            )
          )
        )
        setError(null)
      } catch (error: any) {
        setError("Không thể lấy danh sách ghế.")
        toast({
          title: "Lỗi",
          description: "Không thể lấy danh sách ghế.",
          variant: "destructive",
        })
        console.error("fetchSeats error:", error)
        setAvailableSeats([])
        setSoldSeats([])
      }
    }
    fetchSeats()
  }, [showtimeId, toast])

  const handleSeatsChange = (newSelectedSeats: string[]) => {
    setSelectedSeats(newSelectedSeats)
  }

  const handleBuyClick = async () => {
    console.log("handleBuyClick state:", {
      selectedSeats,
      showtimeId,
      ticketPrice,
      selectedRoom,
      selectedTime,
      movieInfo,
      selectedTheater,
      selectedDate,
    })
    const token = getAuthToken()
    if (!token) {
      setError("Vui lòng đăng nhập để tiếp tục đặt vé!")
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để tiếp tục đặt vé!",
        variant: "destructive",
      })
      window.location.href = "/login"
      return
    }
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất một ghế!")
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một ghế!",
        variant: "destructive",
      })
      return
    }
    if (!showtimeId) {
      setError("Vui lòng chọn lịch chiếu hợp lệ!")
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn lịch chiếu hợp lệ!",
        variant: "destructive",
      })
      return
    }
    setIsPaymentOpen(true)
  }

  const handlePaymentConfirm = async (
    method: string,
    cardDetails?: {
      holderName: string
      cardNumber: string
      expiry: string
      cvv: string
    }
  ): Promise<{ approveUrl?: string; error?: string } | void> => {
    if (!movieInfo) {
      setError("Thông tin phim không khả dụng.")
      toast({
        title: "Lỗi",
        description: "Thông tin phim không khả dụng.",
        variant: "destructive",
      })
      return { error: "Thông tin phim không khả dụng." }
    }
    setIsLoading(true)
    try {
      let token = getAuthToken()
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại!")
      }
      if (!showtimeId) {
        throw new Error("Không có lịch chiếu được chọn!")
      }
      if (selectedSeats.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một ghế!")
      }

      // Kiểm tra token hết hạn
      let decoded
      try {
        decoded = JSON.parse(atob(token.split(".")[1]))
      } catch (e) {
        throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại!")
      }
      const exp = decoded.exp * 1000
      if (Date.now() > exp) {
        console.warn("Token expired in handlePaymentConfirm:", decoded)
        const refreshTokenValue = localStorage.getItem("refresh_token")
        if (!refreshTokenValue) {
          throw new Error("Không có refresh token")
        }
        const refreshResponse = await refreshToken(refreshTokenValue)
        token = refreshResponse.accessToken
        localStorage.setItem("access_token", token)
        localStorage.setItem("refresh_token", refreshResponse.refreshToken)
        console.log("New token after refresh:", token.slice(0, 10) + "...")
      }

      // Kiểm tra session
      try {
        const profileResponse = await UserService.getProfile()
        console.log("Profile check:", profileResponse.data)
      } catch (profileError: any) {
        throw new Error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!")
      }

      // Kiểm tra ghế
      const seatResponse = await getSeatsByShowtime(showtimeId)
      console.log("seatResponse in handlePaymentConfirm:", seatResponse)
      if (!seatResponse.seats || seatResponse.seats.length === 0) {
        throw new Error("Không có ghế khả dụng cho suất chiếu này.")
      }

      // Lấy seatIds và kiểm tra trạng thái
      const seatIds = selectedSeats
        .map((seatNumber) => {
          const seat = seatResponse.seats.find(
            (s: any) => s.seatNumber === seatNumber
          )
          if (!seat) {
            return null
          }
          if (seat.status !== "available") {
            return { seatNumber, status: seat.status }
          }
          return seat._id || seat.id
        })
        .filter((item) => typeof item === "string") as string[]

      const invalidSeats = selectedSeats
        .map((seatNumber, index) => {
          const result = seatIds[index]
          if (!result) {
            return { seatNumber, error: "Ghế không tồn tại" }
          }
          if (typeof result !== "string") {
            return { seatNumber, error: `Ghế ${result.status}` }
          }
          return null
        })
        .filter((item) => item !== null) as {
        seatNumber: string
        error: string
      }[]

      if (invalidSeats.length > 0) {
        const errorMessage = invalidSeats
          .map((s) => `${s.seatNumber}: ${s.error}`)
          .join(", ")
        throw new Error(`Ghế không khả dụng: ${errorMessage}`)
      }

      if (seatIds.length !== selectedSeats.length) {
        throw new Error("Không thể lấy ID của một số ghế.")
      }

      // Tính amount
      const amount = ticketPrice * selectedSeats.length
      if (amount <= 0) {
        throw new Error("Tổng giá không hợp lệ.")
      }

      // tạo booking
      let bookingResponse
      let retryCount = 0
      const maxRetries = 3
      while (retryCount < maxRetries) {
        try {
          console.log(
            `Attempt ${retryCount + 1} - Creating booking with payload:`,
            {
              showtimeId,
              seatIds,
              totalPrice: amount,
            }
          )
          bookingResponse = await createBooking(
            {
              showtimeId,
              seatIds,
            },
            new AbortController().signal
          )
          console.log("Full booking response:", bookingResponse)

          // Kiểm tra phản hồi từ API
          if (!bookingResponse?.data?.booking?._id) {
            const errorMessage =
              bookingResponse?.data?.message ||
              (bookingResponse?.data
                ? JSON.stringify(bookingResponse.data)
                : "Không có dữ liệu trong phản hồi")
            throw new Error(`Phản hồi không hợp lệ: ${errorMessage}`)
          }
          break
        } catch (bookingError: any) {
          console.error(
            `Failed to create booking (attempt ${retryCount + 1}):`,
            {
              message: bookingError.message,
              response: bookingError.response?.data,
              status: bookingError.response?.status,
              headers: bookingError.response?.headers,
              payload: { showtimeId, seatIds, totalPrice: amount },
            }
          )
          retryCount++
          if (retryCount === maxRetries) {
            const errorMessage =
              bookingError.message ||
              "Không thể tạo booking do lỗi server. Vui lòng thử lại sau."
            setError(errorMessage)
            toast({
              title: "Lỗi",
              description: errorMessage,
              variant: "destructive",
            })
            throw new Error(errorMessage)
          }
          // Kiểm tra lại ghế trước khi thử lại
          const retrySeatResponse = await getSeatsByShowtime(showtimeId)
          const retryInvalidSeats = selectedSeats
            .map((seatNumber) => {
              const seat = retrySeatResponse.seats.find(
                (s: any) => s.seatNumber === seatNumber
              )
              if (!seat || seat.status !== "available") {
                return seatNumber
              }
              return null
            })
            .filter((s) => s !== null)
          if (retryInvalidSeats.length > 0) {
            const errorMessage = `Ghế ${retryInvalidSeats.join(
              ", "
            )} không còn khả dụng.`
            setError(errorMessage)
            toast({
              title: "Lỗi",
              description: errorMessage,
              variant: "destructive",
            })
            throw initiateError(errorMessage)
          }
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }

      const bookingId = bookingResponse.data.booking._id
      if (!bookingId) {
        const errorMessage = "Booking ID không được trả về từ server."
        setError(errorMessage)
        toast({
          title: "Lỗi",
          description: errorMessage,
          variant: "destructive",
        })
        throw new Error(errorMessage)
      }

      // Tạo payment
      let paymentResponse
      try {
        console.log("Creating payment with payload:", {
          bookingId,
          amount,
          paymentMethod: method,
        })
        paymentResponse = await createPayment({
          bookingId,
          amount,
          paymentMethod: method,
        })
        console.log("Payment response:", paymentResponse)
      } catch (paymentError: any) {
        console.error("Payment creation failed:", {
          message: paymentError.message,
          response: paymentError.response?.data,
          status: paymentError.response?.status,
        })
        await deleteBooking(bookingId)
        localStorage.removeItem("pendingBooking")
        throw new Error(
          paymentError.response?.data?.message ||
            "Không thể tạo yêu cầu thanh toán."
        )
      }

      if (!paymentResponse.approveUrl && method === "paypal") {
        console.error("Missing approveUrl for PayPal payment:", paymentResponse)
        await deleteBooking(bookingId)
        localStorage.removeItem("pendingBooking")
        throw new Error("Không thể tạo yêu cầu thanh toán PayPal.")
      }

      // Trả về approveUrl cho PayPal
      if (method === "paypal") {
        return { approveUrl: paymentResponse.approveUrl }
      }

      // Xử lý các phương thức khác (card, qr)
      setIsPaymentOpen(false)
    } catch (error: any) {
      console.error("Lỗi trong handlePaymentConfirm:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      setError(error.message || "Lỗi khi xử lý thanh toán.")
      toast({
        title: "Lỗi",
        description: error.message || "Lỗi khi xử lý thanh toán.",
        variant: "destructive",
      })
      if (error.message.includes("đăng nhập")) {
        window.location.href = "/login"
      } else if (error.message.includes("Ghế")) {
        setIsPaymentOpen(false)
        setSelectedSeats([])
      }
      return { error: error.message || "Lỗi khi xử lý thanh toán." }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handlePaymentCapture = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get("token")
      if (!token || isPaymentCompleted) {
        console.log("No token or payment already completed:", {
          token,
          isPaymentCompleted,
        })
        return
      }

      try {
        setError(null)
        const pendingBooking = JSON.parse(
          localStorage.getItem("pendingBooking") || "{}"
        )
        const { showtimeId, selectedSeats, bookingId, ticketPrice } =
          pendingBooking

        if (!showtimeId || !bookingId) {
          throw new Error("Trạng thái đặt vé không hợp lệ!")
        }

        // Kiểm tra lại ghế trước khi capture
        const seatResponse = await getSeatsByShowtime(showtimeId)
        console.log("seatResponse before capture:", seatResponse)
        if (!seatResponse.seats || seatResponse.seats.length === 0) {
          throw new Error("Không có ghế khả dụng cho suất chiếu này.")
        }
        const invalidSeats = selectedSeats.filter(
          (seatNumber: string) =>
            !seatResponse.seats.find(
              (s: any) =>
                s.seatNumber === seatNumber && s.status === "available"
            )
        )
        if (invalidSeats.length > 0) {
          throw new Error(`Ghế ${invalidSeats.join(", ")} không còn khả dụng.`)
        }

        // Capture payment với retry logic
        let captureResponse
        let retryCount = 0
        const maxRetries = 3
        while (retryCount < maxRetries) {
          try {
            console.log("Capturing payment with token:", token)
            captureResponse = await capturePayment({ token })
            console.log("captureResponse:", captureResponse)
            break
          } catch (captureError: any) {
            console.error(
              `Failed to capture payment (attempt ${retryCount + 1}):`,
              {
                message: captureError.message,
                response: captureError.response?.data,
                status: captureError.response?.status,
              }
            )
            retryCount++
            if (retryCount === maxRetries) {
              throw new Error(
                captureError.response?.data?.message ||
                  "Không thể xác nhận thanh toán sau nhiều lần thử."
              )
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }

        if (!captureResponse.payment) {
          throw new Error("No payment data in capture response")
        }

        const payment = captureResponse.payment
        if (payment.status === "completed") {
          console.log(
            "Payment completed, updating seat status for:",
            selectedSeats
          )

          // Cập nhật trạng thái ghế
          for (const seatNumber of selectedSeats) {
            const seat = seatResponse.seats.find(
              (s: any) => s.seatNumber === seatNumber
            )
            if (seat) {
              let retryCount = 0
              const maxRetries = 3
              while (retryCount <= maxRetries) {
                try {
                  console.log(
                    `Updating seat ${seat.seatNumber} (id: ${seat._id}) to booked`
                  )
                  await updateSeatStatus(showtimeId, seat._id, {
                    status: "booked",
                  })
                  console.log(`Seat ${seat.seatNumber} updated successfully`)
                  break
                } catch (seatError: any) {
                  console.error(
                    `Failed to update seat ${seat.seatNumber} (attempt ${
                      retryCount + 1
                    }):`,
                    {
                      message: seatError.message,
                      response: seatError.response?.data,
                      status: seatError.response?.status,
                    }
                  )
                  retryCount++
                  if (retryCount === maxRetries) {
                    throw new Error(
                      `Failed to update seat ${seat.seatNumber} after ${maxRetries} attempts`
                    )
                  }
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                }
              }
            } else {
              console.warn(`Seat ${seatNumber} not found in seatResponse`)
            }
          }

          // Update booking status to confirmed
          let retryCount = 0
          const maxRetries = 3
          while (retryCount <= maxRetries) {
            try {
              console.log("Updating booking status to confirmed:", bookingId)
              await axios.patch(
                `/api/bookings/${bookingId}`,
                { status: "confirmed" },
                {
                  headers: { Authorization: `Bearer ${getAuthToken()}` },
                }
              )
              console.log("Booking status updated to confirmed")
              break
            } catch (bookingError: any) {
              console.error(
                `Failed to update booking status (attempt ${retryCount + 1}):`,
                {
                  message: bookingError.message,
                  response: bookingError.response?.data,
                  status: bookingError.response?.status,
                }
              )
              retryCount++
              if (retryCount === maxRetries) {
                console.warn(
                  `Failed to update booking status after ${maxRetries} attempts`
                )
                break
              }
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }
          }

          setBookingDetails({
            booking: { _id: bookingId },
            totalPrice: ticketCount * ticketPrice,
            details: {
              movie: { title: movieInfo?.title || "Unknown" },
              cinema: {
                name: selectedTheater?.name,
                address: selectedTheater?.address,
              },
              room: {
                roomNumber: roomOptions.find(
                  (opt) => opt.value === selectedRoom
                )?.label,
              },
              seats: selectedSeats.map((seat) => ({
                seatNumber: seat,
                row: seat.match(/[A-Z]+/)?.[0] || "",
                column: parseInt(seat.match(/\d+/)?.[0] || "0"),
              })),
              showtime: { startTime: selectedTime, endTime: "" },
            },
          })

          if (seatPickerRef.current) {
            seatPickerRef.current.markSeatsAsSold()
          }
          setIsPaymentCompleted(true)
          setIsPaymentOpen(false)
          setShowPaymentSuccess(true) // Set flag to show success message

          // Redirect to the stored return URL
          const returnUrl = localStorage.getItem("returnUrl") || "/ticket"
          localStorage.removeItem("pendingBooking")
          localStorage.removeItem("returnUrl")
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )
          router.push(returnUrl) // Redirect to previous page
        } else {
          throw new Error("Thanh toán chưa được hoàn tất!")
        }
      } catch (error: any) {
        console.error("Lỗi trong handlePaymentCapture:", {
          message: error.message || "Unknown error",
          response: error.response?.data || "No response data",
          status: error.response?.status || "No status",
        })
        setError(error.message || "Không thể xác nhận thanh toán.")
        toast({
          title: "Lỗi",
          description: error.message || "Không thể xác nhận thanh toán.",
          variant: "destructive",
        })
        if (pendingBooking.bookingId) {
          console.log(
            "Deleting booking due to capture error:",
            pendingBooking.bookingId
          )
          await deleteBooking(pendingBooking.bookingId)
        }
        localStorage.removeItem("pendingBooking")
        localStorage.removeItem("returnUrl")
      }
    }

    handlePaymentCapture()
  }, [
    isPaymentCompleted,
    movieInfo,
    selectedTheater,
    selectedTime,
    ticketCount,
    ticketPrice,
    roomOptions,
    selectedRoom,
    toast,
  ])

  useEffect(() => {
    if (localStorage.getItem("paymentSuccess")) {
      toast({
        title: "Thành công",
        description: "Thanh toán hoàn tất, vé đã được đặt!",
        variant: "default",
      })
      localStorage.removeItem("paymentSuccess")
      setIsPaymentCompleted(true)

      // Restore booking details
      const pendingBooking = JSON.parse(
        localStorage.getItem("pendingBooking") || "{}"
      )
      if (pendingBooking.bookingId) {
        setBookingDetails({
          booking: { _id: pendingBooking.bookingId },
          totalPrice:
            pendingBooking.selectedSeats.length *
            (pendingBooking.ticketPrice || 75000),
          details: {
            movie: { title: movieInfo?.title || "Unknown" },
            cinema: {
              name: selectedTheater?.name,
              address: selectedTheater?.address,
            },
            room: {
              roomNumber: roomOptions.find((opt) => opt.value === selectedRoom)
                ?.label,
            },
            seats: pendingBooking.selectedSeats.map((seat: string) => ({
              seatNumber: seat,
              row: seat.match(/[A-Z]+/)?.[0] || "",
              column: parseInt(seat.match(/\d+/)?.[0] || "0"),
            })),
            showtime: { startTime: selectedTime, endTime: "" },
          },
        })
      }
    }
  }, [
    movieInfo,
    selectedTheater,
    selectedTime,
    roomOptions,
    selectedRoom,
    toast,
  ])

  // Show success toast when showPaymentSuccess is true
  useEffect(() => {
    if (showPaymentSuccess) {
      toast({
        title: "Thành công",
        description: "Thanh toán hoàn tất, vé đã được đặt!",
        variant: "default",
      })
      setShowPaymentSuccess(false) // Reset flag to prevent repeated toasts
    }
  }, [showPaymentSuccess, toast])

  if (isMovieLoading) {
    return (
      <div className="text-white text-center py-10">
        Đang tải thông tin phim...
      </div>
    )
  }

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 rounded-lg">
      {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
      {priceWarning && (
        <div className="text-yellow-500 mb-4 font-semibold">{priceWarning}</div>
      )}
      {theaters.length === 0 ? (
        <div className="text-white text-center py-10">
          Không tìm thấy rạp chiếu phim
        </div>
      ) : !selectedTheater ? (
        <div className="text-white text-center py-10">
          Đang tải danh sách rạp...
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={(date) =>
                setSelectedDate(date || new Date("2025-04-27"))
              }
            />
            <CustomDropdown
              label="Thời gian"
              value={showtimeId || ""}
              onChange={(value) => {
                const selectedOption = timeOptions.find(
                  (opt) => opt.value === value
                )
                setShowtimeId(value)
                setSelectedTime(selectedOption ? selectedOption.label : "")
                setTicketPrice(selectedOption?.price || 0)
                console.log("Đã chọn thời gian:", selectedOption)
              }}
              options={timeOptions}
              delay={0}
            />
            <CustomDropdown
              label="Loại vé"
              value={selectedType}
              onChange={setSelectedType}
              options={typeOptions}
              delay={0.1}
            />
            <CustomDropdown
              label="Phòng chiếu"
              value={selectedRoom}
              onChange={setSelectedRoom}
              options={roomOptions}
              delay={0.2}
            />
            <CustomDropdown
              label="Rạp"
              value={selectedTheater.id || ""}
              onChange={(value) => {
                const theater = theaters.find((t) => t.id === value)
                if (theater) setSelectedTheater(theater)
              }}
              options={theaterOptions}
              delay={0.3}
            />
            <CustomDropdown
              label="Ghế"
              value={selectionMode}
              onChange={(value) =>
                setSelectionMode(
                  value as "single" | "pair" | "triple" | "group4"
                )
              }
              options={modeOptions}
              delay={0.4}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Chọn ghế của bạn
              </h3>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
                  <span className="font-bold">Ghế:</span>
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat, index) => (
                      <span
                        key={index}
                        className={`text-orange-400 px-2 py-1 rounded-lg inline-block font-mono ${
                          seat === "D10" ? "bg-red-600" : "bg-gray-700"
                        }`}
                      >
                        {seat}
                      </span>
                    ))
                  ) : (
                    <span className="text-orange-500">Chưa chọn ghế</span>
                  )}
                </p>
              </div>
              {isPaymentCompleted && bookingDetails ? (
                <Ticket
                  theater={selectedTheater}
                  movieInfo={movieInfo!}
                  selectedSeats={selectedSeats}
                  selectedTime={selectedTime}
                  selectedDate={selectedDate}
                  ticketId={ticketId}
                  selectedRoom={
                    roomOptions.find((opt) => opt.value === selectedRoom)
                      ?.label || ""
                  }
                  selectedType={selectedType}
                />
              ) : (
                <>
                  <PaymentSummary
                    selectedSeats={selectedSeats}
                    selectedTime={selectedTime}
                    selectedDate={selectedDate}
                    originalPrice={ticketCount * ticketPrice}
                    savings={0}
                    totalAmount={ticketCount * ticketPrice}
                    currency="đ"
                  />
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ width: "10rem" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full max-w-xs"
                    >
                      <Button
                        onClick={handleBuyClick}
                        className="w-full px-4 py-2 text-base sm:text-lg bg-white text-black rounded-sm shadow-lg shadow-gray-500/50 hover:bg-[#4599e3] hover:text-white transition-colors duration-300 relative overflow-hidden border-running-effect"
                        disabled={isLoading || isMovieLoading}
                      >
                        MUA
                      </Button>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
            <div className="w-full md:w-2/3">
              {error && (
                <div className="text-center text-red-500 mb-4">{error}</div>
              )}
              <SeatPicker
                ref={seatPickerRef}
                seats={availableSeats}
                soldSeats={soldSeats}
                selectedSeats={selectedSeats}
                onSeatsChange={handleSeatsChange}
                showtimeId={showtimeId}
                selectionMode={selectionMode}
              />
            </div>
          </div>
          <PaymentDialog
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            onConfirm={handlePaymentConfirm}
            originalPrice={ticketCount * ticketPrice}
            savings={0}
            totalAmount={ticketCount * ticketPrice}
            movieTitle={movieInfo?.title}
            theaterName={selectedTheater?.name}
            selectedSeats={selectedSeats}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            selectedRoom={
              roomOptions.find((opt) => opt.value === selectedRoom)?.label
            }
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  )
}

export default SeatSelection
