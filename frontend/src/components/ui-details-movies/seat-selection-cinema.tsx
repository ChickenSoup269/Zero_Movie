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
import { format } from "date-fns"
import CustomDropdown from "@/components/ui-dropdown/custom-dropdown"
import { getRoomsByCinemaId } from "@/services/roomService"
import { getShowtimesByCinemaId } from "@/services/cinemaService"
import {
  getSeatsByShowtime,
  updateSeatStatus,
} from "@/services/showtimeSeatService"
import { createBooking } from "@/services/bookingService"
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

interface TicketData {
  theater: Theater
  movieInfo: MovieInfo
  selectedSeats: string[]
  selectedTime: string
  selectedDate: Date | undefined
  ticketId: string
  selectedRoom: string
  selectedType: string
  purchaseTime: string
}

interface SeatSelectionProps {
  movieInfo: MovieInfo
  theaters: Theater[]
}

const parseShowtimeDate = (dateString: string): Date => {
  const [time, date] = dateString.split(" ")
  const [hours, minutes] = time.split(":")
  const [day, month, year] = date.split("/")
  return new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T${hours}:${minutes}:00`
  )
}

const SeatSelection = ({ movieInfo, theaters }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [soldSeats, setSoldSeats] = useState<string[]>([])
  const [ticketCount, setTicketCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined | null>(
    new Date("2025-04-21")
  )
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
  const [timeOptions, setTimeOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [bookingDetails, setBookingDetails] = useState<any | null>(null)

  const seatPickerRef = useRef<{ markSeatsAsSold: () => void }>(null)

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

  // Set initial theater
  useEffect(() => {
    if (theaters.length > 0 && !selectedTheater) {
      setSelectedTheater(theaters[0])
    }
  }, [theaters, selectedTheater])

  // Generate ticket ID
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

  // Update ticket ID
  useEffect(() => {
    if (selectedSeats.length === 1 && ticketId === "") {
      setTicketId(generateTicketId())
    } else if (selectedSeats.length === 0) {
      setTicketId("")
    }
  }, [selectedSeats, ticketId])

  // Update ticket count
  useEffect(() => {
    setTicketCount(selectedSeats.length)
  }, [selectedSeats])

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedTheater?.id) return
      try {
        setError(null)
        const response = await getRoomsByCinemaId(selectedTheater.id)
        const options =
          response.rooms?.map((room) => ({
            value: room._id,
            label: room.roomNumber,
          })) || []
        setRoomOptions(options)
        setSelectedRoom(options[0]?.value || "")
      } catch (error: any) {
        setError(error.message || "Failed to fetch rooms")
      }
    }
    fetchRooms()
  }, [selectedTheater?.id])

  // Fetch showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedTheater?.id || !selectedDate) return
      try {
        setError(null)
        const response = await getShowtimesByCinemaId(
          selectedTheater.id,
          format(selectedDate, "yyyy-MM-dd"),
          movieInfo.tmdbId.toString()
        )
        const options =
          response.showtimes
            ?.filter((showtime) => {
              const showtimeDate = parseShowtimeDate(showtime.startTime)
              return (
                format(showtimeDate, "yyyy-MM-dd") ===
                format(selectedDate, "yyyy-MM-dd")
              )
            })
            .map((showtime) => ({
              value: showtime.id,
              label: format(parseShowtimeDate(showtime.startTime), "HH:mm"),
            })) || []
        setTimeOptions(options)
        if (options.length > 0) {
          setShowtimeId(options[0].value)
          setSelectedTime(options[0].label)
          const showtime = response.showtimes?.find(
            (s) => s.id === options[0].value
          )
          setTicketPrice(showtime?.price || 0)
        } else {
          setShowtimeId(null)
          setSelectedTime("")
          setTicketPrice(0)
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch showtimes")
      }
    }
    fetchShowtimes()
  }, [selectedTheater?.id, selectedDate, movieInfo.tmdbId])

  // Fetch seat statuses
  useEffect(() => {
    const fetchSeatStatus = async () => {
      if (!showtimeId) return
      try {
        setError(null)
        const response = await getSeatsByShowtime(showtimeId)
        const bookedSeats =
          response.seats
            ?.filter(
              (seat) => seat.status === "booked" || seat.status === "reserved"
            )
            .map((seat) => seat.seatNumber) || []
        setSoldSeats(bookedSeats)
      } catch (error: any) {
        setError(error.message || "Failed to fetch seat statuses")
      }
    }
    fetchSeatStatus()
  }, [showtimeId])

  // Handle seat changes
  const handleSeatsChange = (
    newSelectedSeats: string[],
    newSoldSeats: string[]
  ) => {
    setSelectedSeats(newSelectedSeats)
    setSoldSeats(newSoldSeats)
  }

  // Handle buy click
  const handleBuyClick = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat!")
      return
    }
    if (!showtimeId) {
      setError("Please select a valid showtime!")
      return
    }
    if (!localStorage.getItem("token")) {
      setError("Please log in to proceed with booking!")
      window.location.href = "/login"
      return
    }

    try {
      setError(null)
      const seatResponse = await getSeatsByShowtime(showtimeId)
      const seatIds = selectedSeats
        .map(
          (seatNumber) =>
            seatResponse.seats?.find((s) => s.seatNumber === seatNumber)?.seatId
        )
        .filter((id): id is string => !!id)

      if (seatIds.length !== selectedSeats.length) {
        setError("Some selected seats are invalid or unavailable!")
        return
      }

      const bookingResponse = await createBooking({ showtimeId, seatIds })
      const bookingId = bookingResponse.data?.booking._id

      if (!bookingId) {
        setError("Failed to create booking!")
        return
      }

      const paymentResponse = await createPayment({
        bookingId,
        amount: ticketCount * ticketPrice,
        paymentMethod: "paypal",
      })

      if (paymentResponse.data?.approveUrl) {
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({ showtimeId, selectedSeats, bookingId, ticketPrice })
        )
        window.location.href = paymentResponse.data.approveUrl
      } else {
        setError("Failed to initiate payment!")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during booking or payment")
    }
  }

  // Handle payment capture
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
          setError("Invalid booking state!")
          return
        }

        const captureResponse = await capturePayment({ token })
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
          setError("Payment was not completed successfully!")
          await deleteBooking(bookingId)
        }
      } catch (error: any) {
        setError(error.message || "Failed to capture payment")
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
    })
  }, [
    selectedTime,
    ticketPrice,
    totalAmount,
    selectedSeats,
    showtimeId,
    ticketCount,
  ])

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 rounded-lg">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {selectedTheater ? (
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <CustomDropdown
            label="Time"
            value={showtimeId || ""}
            onChange={(value) => {
              const showtime = showtimes.find((s) => s.id === value)
              console.log("Time Dropdown Changed:", { value, showtime })
              setShowtimeId(value)
              setSelectedTime(
                showtime
                  ? format(parseShowtimeDate(showtime.startTime), "HH:mm")
                  : ""
              )
              setTicketPrice(showtime ? showtime.price : 0)
            }}
            options={timeOptions}
            delay={0}
          />
          <CustomDropdown
            label="Type"
            value={selectedType}
            onChange={setSelectedType}
            options={typeOptions}
            delay={0.1}
          />
          <CustomDropdown
            label="Room"
            value={selectedRoom}
            onChange={setSelectedRoom}
            options={roomOptions}
            delay={0.2}
          />
          <CustomDropdown
            label="Cinema"
            value={selectedTheater.id || ""}
            onChange={(value) => {
              const theater = theaters.find((t) => t.id === value)
              if (theater) setSelectedTheater(theater)
            }}
            options={theaterOptions}
            delay={0.3}
          />
          <CustomDropdown
            label="Select Mode"
            value={selectionMode}
            onChange={(value) =>
              setSelectionMode(value as "single" | "pair" | "triple" | "group4")
            }
            options={modeOptions}
            delay={0.4}
          />
        </div>
      ) : (
        <div className="text-white text-center py-10">Loading theaters...</div>
      )}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h3 className="text-lg sm:text-xl font-bold">Select Your Seats</h3>
          <div className="p-4 rounded-lg">
            <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
              <span className="font-bold">Seats:</span>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seat, index) => (
                  <span
                    key={index}
                    className={`text-orange-400 px-2 py-1 rounded-lg inline-block font-mono ${
                      seat === "D10" ? "bg-red-600" : "bg-gray-800"
                    }`}
                  >
                    {seat}
                  </span>
                ))
              ) : (
                <span className="text-orange-500">No seats selected</span>
              )}
            </p>
          </div>
          {isPaymentCompleted && bookingDetails ? (
            <Ticket
              theater={selectedTheater!}
              movieInfo={movieInfo}
              selectedSeats={selectedSeats}
              selectedTime={selectedTime}
              selectedDate={selectedDate || undefined}
              ticketId={ticketId}
              selectedRoom={
                roomOptions.find((opt) => opt.value === selectedRoom)?.label ||
                ""
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
                    BUY
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
    </div>
  )
}

export default SeatSelection
