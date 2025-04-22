/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Ticket from "./ticket"
import DatePicker from "./date-picker"
import SeatPicker from "./seat-picker"
import PaymentDialog from "./payment-dialog"
import { PaymentSummary } from "./payment-summary"
import { format } from "date-fns"
import CustomDropdown from "@/components/ui-dropdown/custom-dropdown"
import { getRoomsByCinemaId } from "@/services/roomService"
import { getShowtimesByCinemaId } from "@/services/cinemaService"

interface MovieInfo {
  type: string
  movieTitle: string
  director: string
  tmdbId: number
}

interface Theater {
  id: string // Changed to string to match Cinema interface
  name: string
  address: string // Simplified to match Cinema
  createdAt: string
  updatedAt?: string
  // Removed image, phone, description, mapUrl as they’re not in Cinema
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

const SeatSelection = ({ movieInfo, theaters }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [soldSeats, setSoldSeats] = useState<string[]>([])
  const [ticketCount, setTicketCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined | null>(
    undefined
  )
  const [ticketId, setTicketId] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(
    theaters[0] || null
  )
  const [selectionMode, setSelectionMode] = useState<
    "single" | "pair" | "triple" | "group4"
  >("single")
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [roomLoading, setRoomLoading] = useState(false)
  const [roomError, setRoomError] = useState<string | null>(null)
  const [timeOptions, setTimeOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [typeOptions, setTypeOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [showtimeLoading, setShowtimeLoading] = useState(false)
  const [showtimeError, setShowtimeError] = useState<string | null>(null)

  const seatPickerRef = useRef<{ markSeatsAsSold: () => void }>(null)

  const modeOptions = [
    { value: "single", label: "Single" },
    { value: "pair", label: "Pair (2 seats)" },
    { value: "triple", label: "Triple (3 seats)" },
    { value: "group4", label: "Group (4 seats)" },
  ]
  const { toast } = useToast()
  const originalTicketPrice = 15
  const discountedTicketPrice = 10

  // Fetch showtimes when theater or date changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedTheater || !selectedDate) {
        setTimeOptions([])
        setTypeOptions([])
        setSelectedTime("")
        setSelectedType("")
        return
      }

      setShowtimeLoading(true)
      setShowtimeError(null)
      const cinemaId = selectedTheater.id
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      console.log(
        `Fetching showtimes for cinemaId: ${cinemaId}, date: ${dateStr}, movieId: ${movieInfo.tmdbId}`
      )

      try {
        const response = await getShowtimesByCinemaId(
          cinemaId,
          dateStr,
          movieInfo.tmdbId.toString()
        )
        console.log("Showtime API response:", response)
        const showtimes = response.showtimes || []
        if (showtimes.length === 0) {
          console.log(
            `No showtimes found for cinemaId: ${cinemaId}, movieId: ${movieInfo.tmdbId}`
          )
        }

        // Extract unique showtimes and types
        const times = showtimes.map((showtime) => ({
          value: showtime.startTime,
          label: format(new Date(showtime.startTime), "HH:mm"),
        }))
        const uniqueTimes = Array.from(new Set(times.map((t) => t.value))).map(
          (value) => times.find((t) => t.value === value)!
        )

        // Assume type is derived from movieInfo or showtime metadata
        // For now, use movieInfo.type or fallback to showtime data if available
        const types = [
          { value: movieInfo.type, label: movieInfo.type },
          // Add more types if showtimes provide type info, e.g., showtime.format
        ].filter((t) => t.value)
        const uniqueTypes = Array.from(new Set(types.map((t) => t.value))).map(
          (value) => types.find((t) => t.value === value)!
        )

        setTimeOptions(uniqueTimes)
        setTypeOptions(
          uniqueTypes.length > 0
            ? uniqueTypes
            : [
                { value: "2D", label: "2D" },
                { value: "3D", label: "3D" },
                { value: "IMAX", label: "IMAX" },
              ]
        )
        if (uniqueTimes.length > 0) {
          setSelectedTime(uniqueTimes[0].value)
        } else {
          setSelectedTime("")
          setShowtimeError("No showtimes available for this date and movie")
          toast.error("No showtimes available for this date and movie")
        }
        if (uniqueTypes.length > 0) {
          setSelectedType(uniqueTypes[0].value)
        } else {
          setSelectedType("2D")
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load showtimes"
        console.error("Error fetching showtimes:", err)
        setShowtimeError(errorMessage)
        setTimeOptions([])
        setTypeOptions([
          { value: "2D", label: "2D" },
          { value: "3D", label: "3D" },
          { value: "IMAX", label: "IMAX" },
        ])
        setSelectedTime("")
        setSelectedType("2D")
        toast.error(`Failed to load showtimes: ${errorMessage}`)
      } finally {
        setShowtimeLoading(false)
      }
    }
    fetchShowtimes()
  }, [selectedTheater, selectedDate, movieInfo.tmdbId])

  // Fetch rooms when theater changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedTheater) {
        console.log("No theater selected, clearing room options")
        setRoomOptions([])
        setSelectedRoom("")
        setRoomError("No theater selected")
        return
      }

      setRoomLoading(true)
      setRoomError(null)
      const cinemaId = selectedTheater.id
      console.log(`Fetching rooms for cinemaId: ${cinemaId}`)

      try {
        const response = await getRoomsByCinemaId(cinemaId)
        console.log("Room API response:", response)
        const rooms = response.rooms || []
        if (rooms.length === 0) {
          console.log(`No rooms found for cinemaId: ${cinemaId}`)
        }
        const options = rooms.map((room) => ({
          value: room.roomNumber,
          label: room.roomNumber,
        }))
        setRoomOptions(options)
        if (options.length > 0) {
          setSelectedRoom(options[0].value)
          console.log("Set selectedRoom to:", options[0].value)
        } else {
          setSelectedRoom("")
          setRoomError("No rooms available for this cinema")
          toast.error("No rooms available for this cinema")
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load rooms"
        console.error("Error fetching rooms:", err)
        setRoomError(errorMessage)
        setRoomOptions([])
        setSelectedRoom("")
        toast.error(`Failed to load rooms: ${errorMessage}`)
      } finally {
        setRoomLoading(false)
      }
    }
    fetchRooms()
  }, [selectedTheater])

  // Sync selectedTheater with theaters prop
  useEffect(() => {
    if (theaters.length > 0 && !selectedTheater) {
      console.log("Syncing selectedTheater with theaters[0]:", theaters[0])
      setSelectedTheater(theaters[0])
    }
  }, [theaters, selectedTheater])

  // Generate ticket ID
  useEffect(() => {
    if (selectedSeats.length === 1 && ticketId === "") {
      const newTicketId = generateTicketId()
      setTicketId(newTicketId)
    } else if (selectedSeats.length === 0) {
      setTicketId("")
    }
  }, [selectedSeats, ticketId])

  // Update ticket count
  useEffect(() => {
    setTicketCount(selectedSeats.length)
  }, [selectedSeats])

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

  const handleBuyClick = () => {
    if (selectedSeats.length === 0) {
      toast.error(
        "Please select at least one seat before proceeding to payment!"
      )
      return
    }
    if (!selectedRoom) {
      toast.error("Please select a room before proceeding to payment!")
      return
    }
    if (!selectedTime) {
      toast.error("Please select a showtime before proceeding to payment!")
      return
    }
    setIsPaymentOpen(true)
  }

  const handlePaymentConfirm = (
    method: string,
    cardDetails?: {
      holderName: string
      cardNumber: string
      expiry: string
      cvv: string
    }
  ) => {
    if (method === "card" && cardDetails) {
      console.log(
        `Payment confirmed with ${method} for $${totalAmount.toFixed(2)}`,
        cardDetails
      )
    } else {
      console.log(
        `Payment confirmed with ${method} for $${totalAmount.toFixed(2)}`
      )
    }
    if (seatPickerRef.current) {
      seatPickerRef.current.markSeatsAsSold()
    }

    const ticketData: TicketData = {
      theater: selectedTheater!,
      movieInfo,
      selectedSeats,
      selectedTime,
      selectedDate: selectedDate || undefined,
      ticketId,
      selectedRoom,
      selectedType,
      purchaseTime: new Date().toISOString(),
    }

    const existingTickets = JSON.parse(
      localStorage.getItem("purchasedTickets") || "[]"
    )
    localStorage.setItem(
      "purchasedTickets",
      JSON.stringify([...existingTickets, ticketData])
    )

    setIsPaymentCompleted(true)
    setIsPaymentOpen(false)
  }

  const handleSeatsChange = (
    newSelectedSeats: string[],
    newSoldSeats: string[]
  ) => {
    setSelectedSeats(newSelectedSeats)
    setSoldSeats(newSoldSeats)
  }

  const originalPrice = ticketCount * originalTicketPrice
  const totalAmount = ticketCount * discountedTicketPrice
  const savings = originalPrice - totalAmount

  const formattedDateTime =
    selectedDate && selectedTime
      ? `${format(selectedDate, "dd/MM/yyyy")}; ${format(
          new Date(selectedTime),
          "HH:mm"
        )}`
      : "Not selected"

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <CustomDropdown
          label="Time"
          value={selectedTime}
          onChange={setSelectedTime}
          options={timeOptions}
          delay={0}
          disabled={showtimeLoading || !!showtimeError}
          placeholder={
            showtimeLoading
              ? "Loading showtimes..."
              : showtimeError || "Select a time"
          }
        />

        <CustomDropdown
          label="Type"
          value={selectedType}
          onChange={setSelectedType}
          options={typeOptions}
          delay={0.1}
          disabled={showtimeLoading || !!showtimeError}
        />

        <CustomDropdown
          label="Room"
          value={selectedRoom}
          onChange={setSelectedRoom}
          options={roomOptions}
          delay={0.2}
          disabled={roomLoading || !!roomError}
          placeholder={
            roomLoading ? "Loading rooms..." : roomError || "Select a room"
          }
        />

        <CustomDropdown
          label="Cinema"
          value={selectedTheater?.id || ""}
          onChange={(value) => {
            const theater = theaters.find((t) => t.id === value)
            if (theater) {
              console.log("Selected theater:", theater)
              setSelectedTheater(theater)
            }
          }}
          options={theaters.map((t) => ({ value: t.id, label: t.name }))}
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

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h3 className="text-lg sm:text-xl font-bold">Select Your Seats</h3>
          <div className="p-4 rounded-lg">
            <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
              <span className="font-bold">Seats:</span>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seat, index) => {
                  const letterMatch = seat.match(/[A-Za-z]+/)
                  const letter = letterMatch ? letterMatch[0] : ""
                  const numberMatch = seat.match(/\d+/)
                  const number = numberMatch ? numberMatch[0] : ""
                  return (
                    <span
                      key={index}
                      className={`text-orange-400 px-2 py-1 rounded-lg inline-block font-mono ${
                        seat === "D10" ? "bg-red-600" : "bg-gray-800"
                      }`}
                    >
                      {letter}-{number}
                    </span>
                  )
                })
              ) : (
                <span className="text-orange-500">No seats selected</span>
              )}
            </p>
          </div>

          {isPaymentCompleted ? (
            <Ticket
              theater={selectedTheater!}
              movieInfo={movieInfo}
              selectedSeats={selectedSeats}
              selectedTime={selectedTime}
              selectedDate={selectedDate || undefined}
              ticketId={ticketId}
              selectedRoom={selectedRoom}
              selectedType={selectedType}
            />
          ) : (
            <>
              <PaymentSummary
                selectedSeats={selectedSeats}
                selectedTime={selectedTime}
                selectedDate={selectedDate || undefined}
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
                    disabled={
                      roomLoading ||
                      !!roomError ||
                      showtimeLoading ||
                      !!showtimeError
                    }
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
            selectionMode={selectionMode}
            onSeatsChange={handleSeatsChange}
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
    </div>
  )
}

export default SeatSelection
