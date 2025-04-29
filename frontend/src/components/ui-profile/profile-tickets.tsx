/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Ticket, Trash2 } from "lucide-react"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { deleteBooking } from "@/services/bookingService"
import { MovieService } from "@/services/movieService"
import { getShowtimeById } from "@/services/showtimeService"
import { getSeatsByShowtime } from "@/services/showtimeSeatService"

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

axiosJWT.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

interface EnrichedTicket {
  _id: string
  movieTitle: string
  cinemaName: string
  cinemaAddress: string
  roomNumber: string
  seatNumbers: string[]
  startTime: string
  price: number
  status: string
}

interface ProfileTicketsProps {
  isActive: boolean
}

const ProfileTickets = ({ isActive }: ProfileTicketsProps) => {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const errorToast = ErrorToast({
    title: "Lỗi",
    description: "Không thể tải danh sách vé.",
    duration: 3000,
  })
  const successToast = SuccessToast({
    title: "Thành công!",
    description: "Đã xóa vé thành công.",
    duration: 3000,
  })

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true)
      try {
        const response = await axiosJWT.get("/bookings/my-bookings")
        console.log("Bookings data:", JSON.stringify(response.data, null, 2))
        const bookings = (response.data.bookings || []).filter(
          (ticket: any) => ticket.status === "confirmed"
        )

        // Lấy thông tin bổ sung cho mỗi booking
        const enrichedTickets = await Promise.all(
          bookings.map(async (booking: any) => {
            console.log(`Processing booking ${booking._id}:`, {
              movieId: booking.movieId,
              showtimeId: booking.showtimeId,
              seatIds: booking.seatIds,
              cinema: booking.cinema,
              room: booking.room,
              details: booking.details,
            })

            // Dữ liệu mặc định
            let movieTitle = "Phim không xác định"
            let cinemaName = booking.cinema?.name || "N/A"
            let cinemaAddress = booking.cinema?.address || "N/A"
            let roomNumber = booking.room?.roomNumber || "N/A"
            let seatNumbers: string[] = ["N/A"]
            let startTime = "N/A"
            let price = booking.totalPrice || 0

            // Sử dụng BookingDetails nếu có
            if (booking.details) {
              movieTitle = booking.details.movie?.title || movieTitle
              cinemaName = booking.details.cinema?.name || cinemaName
              cinemaAddress = booking.details.cinema?.address || cinemaAddress
              roomNumber = booking.details.room?.roomNumber || roomNumber
              seatNumbers =
                booking.details.seats?.map((seat: any) => seat.seatNumber) ||
                seatNumbers
              startTime = booking.details.showtime?.startTime
                ? new Date(booking.details.showtime.startTime).toLocaleString()
                : startTime
              console.log(`Used BookingDetails for booking ${booking._id}`)
            } else {
              console.warn(
                `No BookingDetails for booking ${booking._id}, fetching additional data`
              )

              // Gọi API bổ sung nếu không có details
              try {
                if (booking.movieId && typeof booking.movieId === "number") {
                  console.log(
                    `Fetching movie for booking ${booking._id} with movieId:`,
                    booking.movieId
                  )
                  const movie = await MovieService.getMovieByTmdbId(
                    booking.movieId.toString()
                  )
                  movieTitle = movie.title || movieTitle
                } else {
                  console.warn(
                    `Invalid or missing movieId for booking ${booking._id}:`,
                    booking.movieId
                  )
                }
              } catch (error) {
                console.error(
                  `Error fetching movie for booking ${booking._id}:`,
                  error
                )
              }

              // Xử lý showtimeId là chuỗi JSON
              let showtimeId = booking.showtimeId
              if (typeof showtimeId === "string") {
                try {
                  const parsed = JSON.parse(showtimeId)
                  showtimeId = parsed._id || showtimeId
                  console.log(
                    `Parsed showtimeId for booking ${booking._id}:`,
                    showtimeId
                  )
                } catch (error) {
                  console.warn(
                    `Failed to parse showtimeId for booking ${booking._id}:`,
                    showtimeId
                  )
                }
              }

              try {
                if (showtimeId && typeof showtimeId === "string") {
                  console.log(
                    `Fetching showtime for booking ${booking._id} with showtimeId:`,
                    showtimeId
                  )
                  const showtimeResponse = await getShowtimeById(showtimeId)
                  const showtime = showtimeResponse.showtime || {}
                  startTime = showtime.startTime
                    ? new Date(showtime.startTime).toLocaleString()
                    : startTime
                  price = showtime.price || price
                } else {
                  console.warn(
                    `Invalid or missing showtimeId for booking ${booking._id}:`,
                    showtimeId
                  )
                }
              } catch (error) {
                console.error(
                  `Error fetching showtime for booking ${booking._id}:`,
                  error
                )
              }

              // Xử lý seatIds là chuỗi JSON
              let parsedSeatIds: string[] = booking.seatIds || []
              if (Array.isArray(parsedSeatIds)) {
                parsedSeatIds = parsedSeatIds.map((seatId: string) => {
                  try {
                    const parsed = JSON.parse(seatId)
                    return parsed._id || seatId
                  } catch (error) {
                    console.warn(
                      `Failed to parse seatId for booking ${booking._id}:`,
                      seatId
                    )
                    return seatId
                  }
                })
                console.log(
                  `Parsed seatIds for booking ${booking._id}:`,
                  parsedSeatIds
                )
              }

              try {
                if (
                  showtimeId &&
                  typeof showtimeId === "string" &&
                  parsedSeatIds.length
                ) {
                  console.log(
                    `Fetching seats for booking ${booking._id} with showtimeId:`,
                    showtimeId
                  )
                  const seatsResponse = await getSeatsByShowtime(showtimeId)
                  seatNumbers = (seatsResponse.seats || [])
                    .filter((seat: any) => parsedSeatIds.includes(seat.seatId))
                    .map((seat: any) => seat.seatNumber)
                  if (!seatNumbers.length) {
                    seatNumbers = ["N/A"]
                  }
                } else {
                  console.warn(
                    `Missing seatIds or valid showtimeId for booking ${booking._id}`
                  )
                }
              } catch (error) {
                console.error(
                  `Error fetching seats for booking ${booking._id}:`,
                  error
                )
              }
            }

            return {
              _id: booking._id,
              movieTitle,
              cinemaName,
              cinemaAddress,
              roomNumber,
              seatNumbers,
              startTime,
              price,
              status: booking.status,
            }
          })
        )

        setTickets(enrichedTickets)
      } catch (error: any) {
        errorToast.showToast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Không thể tải danh sách vé.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isActive) {
      fetchTickets()
    }
  }, [isActive])

  const handleDeleteTicket = async (bookingId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vé này?")) {
      return
    }

    try {
      setIsLoading(true)
      await deleteBooking(bookingId)
      setTickets((prev) => prev.filter((ticket) => ticket._id !== bookingId))
      successToast.showToast({
        description: "Đã xóa vé thành công.",
      })
    } catch (error: any) {
      errorToast.showToast({
        description: error.message || "Không thể xóa vé. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute w-full py-6"
    >
      <h3 className="text-lg font-medium">Vé của tôi</h3>
      {isLoading ? (
        <p className="text-muted-foreground mt-2">Đang tải vé...</p>
      ) : tickets.length === 0 ? (
        <p className="text-muted-foreground mt-2">Bạn chưa có vé nào.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-blue-400" />
                  <h4 className="font-semibold">{ticket.movieTitle}</h4>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Rạp: {ticket.cinemaName}
                </p>
                <p className="text-sm text-gray-400">
                  Địa chỉ: {ticket.cinemaAddress}
                </p>
                <p className="text-sm text-gray-400">
                  Phòng: {ticket.roomNumber}
                </p>
                <p className="text-sm text-gray-400">
                  Ghế: {ticket.seatNumbers.join(", ")}
                </p>
                <p className="text-sm text-gray-400">
                  Thời gian: {ticket.startTime}
                </p>
                <p className="text-sm text-gray-400">
                  Giá: {ticket.price.toLocaleString()}đ
                </p>
                <p className="text-sm text-gray-400">Mã vé: {ticket._id}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTicket(ticket._id)}
                disabled={isLoading}
                className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ProfileTickets
