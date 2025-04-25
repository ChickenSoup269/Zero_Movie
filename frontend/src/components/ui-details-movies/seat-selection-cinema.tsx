/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Ticket from "./ticket"
import DatePicker from "./date-picker"
import SeatPicker from "./seat-picker"
import { PaymentSummary } from "./payment-summary"
import PaymentDialog from "./payment-dialog"
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
  movieTitle?: string
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

interface SeatSelectionProps {
  movieInfo: MovieInfo
  theaters: Theater[]
}

interface SeatPickerRef {
  markSeatsAsSold: () => void
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
  const [soldSeats, setSoldSeats] = useState<string[]>([])
  const [ticketCount, setTicketCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-04-21"))
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
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([])
  const [bookingDetails, setBookingDetails] = useState<any | null>(null)
  const [priceWarning, setPriceWarning] = useState<string | null>(null)

  const seatPickerRef = useRef<SeatPickerRef>(null)

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
      setError(
        "Không tìm thấy rạp chiếu phim. Vui lòng kiểm tra danh sách rạp."
      )
      console.warn("Danh sách rạp rỗng")
    }
  }, [theaters])

  // Kiểm tra movieInfo.tmdbId
  useEffect(() => {
    console.log("movieInfo:", movieInfo)
    if (!movieInfo.tmdbId) {
      setError("Thông tin phim không hợp lệ. Vui lòng chọn phim khác.")
      console.warn("movieInfo.tmdbId không hợp lệ:", movieInfo)
    }
  }, [movieInfo])

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
        console.warn("Không có cinemaId để lấy phòng")
        setError("Vui lòng chọn rạp chiếu phim hợp lệ")
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
        setError(error.message || "Không thể lấy danh sách phòng")
        console.error("Lỗi khi lấy phòng:", error)
      }
    }
    if (selectedTheater?.id) {
      fetchRooms()
    }
  }, [selectedTheater?.id])

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (
        !selectedTheater?.id ||
        !selectedDate ||
        !movieInfo.tmdbId ||
        !selectedRoom
      ) {
        console.warn("Thiếu tham số cần thiết để lấy lịch chiếu:", {
          cinemaId: selectedTheater?.id,
          date: selectedDate,
          tmdbId: movieInfo.tmdbId,
          selectedRoom,
        })
        setError("Vui lòng chọn rạp, ngày, phim và phòng hợp lệ")
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
          console.warn("Không tìm thấy lịch chiếu cho phim và ngày đã chọn")
          setError(
            `Không tìm thấy lịch chiếu cho phim "${
              movieInfo.title
            }" vào ngày ${format(
              selectedDate,
              "dd/MM/yyyy"
            )}. Vui lòng chọn ngày hoặc phim khác.`
          )
          setTimeOptions([])
          setShowtimeId(null)
          setSelectedTime("")
          setTicketPrice(0)
          return
        }

        // Lọc showtimes theo movieId và roomId
        const filteredShowtimes: Showtime[] = response.showtimes.filter(
          (showtime: Showtime) => {
            const roomId =
              typeof showtime.roomId === "string"
                ? showtime.roomId
                : showtime.roomId?._id
            console.log("Showtime kiểm tra:", {
              id: showtime.id,
              movieId: showtime.movieId,
              roomId,
              selectedRoom,
              price: showtime.price,
            })
            return (
              showtime.movieId === movieInfo.tmdbId && roomId === selectedRoom
            )
          }
        )
        console.log("Lịch chiếu đã lọc:", filteredShowtimes)

        if (filteredShowtimes.length === 0) {
          console.warn(
            "Không có lịch chiếu nào khớp với movieId và roomId:",
            movieInfo.tmdbId,
            selectedRoom,
            "Available showtimes:",
            response.showtimes
          )
          setError(
            `Không tìm thấy lịch chiếu cho phim "${
              movieInfo.title
            }" tại phòng "${
              roomOptions.find((opt) => opt.value === selectedRoom)?.label
            }" vào ngày ${format(
              selectedDate,
              "dd/MM/yyyy"
            )}. Vui lòng chọn phòng hoặc ngày khác.`
          )
          setTimeOptions([])
          setShowtimeId(null)
          setSelectedTime("")
          setTicketPrice(0)
          return
        }

        // Xử lý price
        let hasInvalidPrice = false
        const defaultPrice = 80000
        const options: TimeOption[] = filteredShowtimes.map((showtime) => {
          const date = parseShowtimeDate(showtime.startTime)
          const timeString = format(date, "HH:mm")
          const price =
            showtime.price && showtime.price > 0 ? showtime.price : defaultPrice
          console.log("Giá vé showtime:", {
            showtimeId: showtime.id,
            price: showtime.price,
          })
          if (!showtime.price || showtime.price <= 0) {
            console.warn(
              `Price missing or invalid for showtime ${showtime.id}, using default: ${defaultPrice}`
            )
            hasInvalidPrice = true
          }
          return {
            value: showtime.id,
            label: timeString,
            price,
          }
        })
        console.log("timeOptions đã tạo:", options)

        if (hasInvalidPrice) {
          setPriceWarning(
            "Giá vé không khả dụng cho suất chiếu này. Đang sử dụng giá mặc định 80,000đ. Vui lòng kiểm tra dữ liệu API."
          )
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
        console.error("Lỗi khi lấy lịch chiếu:", error)
        setError(error.message || "Không thể lấy lịch chiếu. Vui lòng thử lại.")
        setTimeOptions([])
        setShowtimeId(null)
        setSelectedTime("")
        setTicketPrice(0)
      }
    }
    if (selectedTheater?.id && selectedRoom) {
      fetchShowtimes()
    }
  }, [
    selectedTheater?.id,
    selectedDate,
    movieInfo.tmdbId,
    movieInfo.title,
    selectedRoom,
  ])

  const handleSeatsChange = (
    newSelectedSeats: string[],
    newSoldSeats: string[]
  ) => {
    setSelectedSeats(newSelectedSeats)
    setSoldSeats(newSoldSeats)
  }

  const handleBuyClick = () => {
    console.log("handleBuyClick called with state:", {
      selectedSeats,
      showtimeId,
      ticketPrice,
      selectedRoom,
      selectedTime,
    })
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất một ghế!")
      console.warn("Không có ghế nào được chọn")
      return
    }
    if (!showtimeId) {
      setError("Vui lòng chọn lịch chiếu hợp lệ!")
      console.warn("showtimeId không hợp lệ:", showtimeId)
      return
    }
    if (!localStorage.getItem("token")) {
      setError("Vui lòng đăng nhập để tiếp tục đặt vé!")
      console.warn("Chưa đăng nhập")
      window.location.href = "/login"
      return
    }
    setIsPaymentOpen(true)
  }

  const handlePaymentConfirm = async (method: string) => {
    console.log("handlePaymentConfirm called with:", {
      showtimeId,
      selectedSeats,
      ticketPrice,
      method,
    })
    let bookingId: string | undefined
    try {
      setError(null)
      const seatResponse = await getSeatsByShowtime(showtimeId!)
      console.log("seatResponse:", seatResponse)
      const seatIds = selectedSeats
        .map(
          (seatNumber) =>
            seatResponse.seats?.find((s) => s.seatNumber === seatNumber)?.seatId
        )
        .filter((id): id is string => !!id)

      if (seatIds.length !== selectedSeats.length) {
        setError("Một số ghế đã chọn không hợp lệ hoặc không còn trống!")
        console.warn("seatIds không khớp với selectedSeats:", {
          seatIds,
          selectedSeats,
        })
        return
      }

      const bookingResponse = await createBooking({
        showtimeId: showtimeId!,
        seatIds,
      })
      console.log("bookingResponse:", bookingResponse)
      bookingId = bookingResponse.data?.booking._id

      if (!bookingId) {
        setError("Không thể tạo đặt vé!")
        console.warn(
          "Không lấy được bookingId từ bookingResponse:",
          bookingResponse
        )
        return
      }

      const paymentResponse = await createPayment({
        bookingId,
        amount: ticketCount * ticketPrice,
        paymentMethod: "paypal",
      })
      console.log("paymentResponse:", paymentResponse)

      if (paymentResponse.data?.approveUrl) {
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({ showtimeId, selectedSeats, bookingId, ticketPrice })
        )
        window.location.href = paymentResponse.data.approveUrl
      } else {
        setError("Không thể khởi tạo thanh toán!")
        console.warn(
          "Không lấy được approveUrl từ paymentResponse:",
          paymentResponse
        )
        await deleteBooking(bookingId)
      }
    } catch (error: any) {
      console.error("Lỗi trong handlePaymentConfirm:", error)
      setError(
        error.message || "Đã xảy ra lỗi trong quá trình đặt vé hoặc thanh toán"
      )
      if (bookingId) {
        await deleteBooking(bookingId)
      }
    }
  }

  useEffect(() => {
    const handlePaymentCapture = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get("token")
      if (!token || isPaymentCompleted) return

      try {
        setError(null)
        const pendingBooking = JSON.parse(
          localStorage.getItem("pendingBooking") || "{}"
        )
        const { showtimeId, selectedSeats, bookingId, ticketPrice } =
          pendingBooking

        if (!showtimeId || !bookingId) {
          setError("Trạng thái đặt vé không hợp lệ!")
          console.warn("pendingBooking không hợp lệ:", pendingBooking)
          return
        }

        const captureResponse = await capturePayment({ token })
        console.log("captureResponse:", captureResponse)
        const payment = captureResponse.data?.payment

        if (payment?.status === "completed") {
          const seatResponse = await getSeatsByShowtime(showtimeId)
          for (const seatNumber of selectedSeats) {
            const seat = seatResponse.seats?.find(
              (s) => s.seatNumber === seatNumber
            )
            if (seat) {
              await updateSeatStatus(showtimeId, seat.seatId, {
                status: "booked",
              })
            }
          }

          setBookingDetails({
            booking: { _id: bookingId },
            totalPrice: ticketCount * ticketPrice,
            details: {
              movie: { title: movieInfo.title },
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
                row: parseInt(seat.match(/\d+/)?.[0] || "0"),
                column: seat.match(/[A-Z]+/)?.[0]?.charCodeAt(0) - 64,
              })),
              showtime: { startTime: selectedTime, endTime: "" },
            },
          })

          if (seatPickerRef.current) {
            seatPickerRef.current.markSeatsAsSold()
          }
          setIsPaymentCompleted(true)
          setIsPaymentOpen(false)

          localStorage.removeItem("pendingBooking")
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )
        } else {
          setError("Thanh toán chưa được hoàn tất!")
          console.warn("Thanh toán không hoàn tất:", captureResponse)
          await deleteBooking(bookingId)
        }
      } catch (error: any) {
        console.error("Lỗi trong handlePaymentCapture:", error)
        setError(error.message || "Không thể xác nhận thanh toán")
        if (pendingBooking.bookingId) {
          await deleteBooking(pendingBooking.bookingId)
        }
      }
    }

    handlePaymentCapture()
  }, [
    isPaymentCompleted,
    selectedTheater,
    movieInfo.title,
    selectedTime,
    selectedRoom,
    roomOptions,
    ticketCount,
    ticketPrice,
  ])

  const totalAmount = ticketCount * ticketPrice
  const originalPrice = totalAmount
  const savings = 0

  useEffect(() => {
    console.log("SeatSelection State:", {
      selectedTime,
      ticketPrice,
      totalAmount,
      selectedSeats,
      showtimeId,
      ticketCount,
      selectedDate,
      selectedRoom,
      timeOptions,
    })
  }, [
    selectedTime,
    ticketPrice,
    totalAmount,
    selectedSeats,
    showtimeId,
    ticketCount,
    selectedDate,
    selectedRoom,
    timeOptions,
  ])
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
                setSelectedDate(date || new Date("2025-04-21"))
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
              label="Chế độ chọn ghế"
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
                  movieInfo={movieInfo}
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
                    originalPrice={originalPrice}
                    savings={savings}
                    totalAmount={totalAmount}
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
                      >
                        MUA
                      </Button>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
            <div className="w-full md:w-2/3">
              <SeatPicker
                ref={seatPickerRef}
                selectedRoom={selectedRoom}
                showtimeId={showtimeId}
                selectionMode={selectionMode}
                onSeatsChange={handleSeatsChange}
                soldSeats={soldSeats}
              />
            </div>
          </div>
          <PaymentDialog
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            onConfirm={handlePaymentConfirm}
            originalPrice={originalPrice}
            savings={savings}
            totalAmount={totalAmount}
          />
        </>
      )}
    </div>
  )
}

export default SeatSelection
