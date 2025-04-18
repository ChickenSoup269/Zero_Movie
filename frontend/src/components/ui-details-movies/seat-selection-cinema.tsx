/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Ticket from "./ticket"
import DatePicker from "./date-picker"
import SeatPicker from "./seat-picker"
import PaymentDialog from "./payment-dialog"
import { PaymentSummary } from "./payment-summary"
import { format } from "date-fns"
import CustomDropdown from "@/components/ui-dropdown/custom-dropdown"

interface MovieInfo {
  type: string
  movieTitle: string
  director: string
}

interface Theater {
  id: number
  name: string
  image: string
  address: string
  phone: string
  description: string
  mapUrl: string
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
  const [selectedTime, setSelectedTime] = useState<string>("18:00")
  const [selectedType, setSelectedType] = useState<string>("2D")
  const [selectedRoom, setSelectedRoom] = useState<string>("C1")
  const [selectedTheater, setSelectedTheater] = useState<Theater>(theaters[0])
  const [selectionMode, setSelectionMode] = useState<
    "single" | "pair" | "triple" | "group4"
  >("single")
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)

  const seatPickerRef = useRef<{ markSeatsAsSold: () => void }>(null)

  const timeOptions = [
    { value: "18:00", label: "18:00" },
    { value: "20:00", label: "20:00" },
    { value: "22:00", label: "22:00" },
  ]
  const typeOptions = [
    { value: "2D", label: "2D" },
    { value: "3D", label: "3D" },
    { value: "IMAX", label: "IMAX" },
  ]
  const roomOptions = [
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
    { value: "C3", label: "C3" },
  ]
  const theaterOptions = theaters.map((theater) => ({
    value: theater.id.toString(),
    label: theater.name,
  }))
  const modeOptions = [
    { value: "single", label: "Single" },
    { value: "pair", label: "Pair (2 seats)" },
    { value: "triple", label: "Triple (3 seats)" },
    { value: "group4", label: "Group (4 seats)" },
  ]

  const originalTicketPrice = 15
  const discountedTicketPrice = 10

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
      const newTicketId = generateTicketId()
      setTicketId(newTicketId)
    } else if (selectedSeats.length === 0) {
      setTicketId("")
    }
  }, [selectedSeats, ticketId])

  useEffect(() => {
    setTicketCount(selectedSeats.length)
  }, [selectedSeats])

  const handleBuyClick = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding to payment!")
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
      theater: selectedTheater,
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

  const formattedDateTime = selectedDate
    ? `${format(selectedDate, "dd/MM/yyyy")}; ${selectedTime}`
    : "Not selected"

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 rounded-lg">
      {/* Sử dụng CustomDropdown */}
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
          value={selectedTheater.id.toString()}
          onChange={(value) => {
            const theater = theaters.find((t) => t.id === parseInt(value))
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

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h3 className="text-lg sm:text-xl font-bold">Select Your Seats</h3>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
              <span className="text-orange-500 font-semibold">
                {ticketCount} / 8 Seats:
              </span>
              <span className="text-gray-400">|</span>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seat, index) => {
                  const letterMatch = seat.match(/[A-Za-z]+/)
                  const letter = letterMatch ? letterMatch[0] : ""
                  const numberMatch = seat.match(/\d+/)
                  const number = numberMatch ? numberMatch[0] : ""
                  return (
                    <span
                      key={index}
                      className={`text-orange-500 px-3 py-1 rounded-full inline-block mr-2 ${
                        seat === "D10" ? "bg-red-600" : "bg-gray-800"
                      }`}
                    >
                      {letter} {number}
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
              theater={selectedTheater}
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
