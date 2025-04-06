/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Ticket from "./ticket"
import DatePicker from "./date-picker"
import SeatPicker from "./seat-picker"
import PaymentDialog from "./payment-dialog"
import { PaymentSummary } from "./payment-summary"
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

  const seatPickerRef = useRef<{ markSeatsAsSold: () => void }>(null)

  const timeOptions = ["18:00", "20:00", "22:00"]
  const typeOptions = ["2D", "3D", "IMAX"]
  const roomOptions = ["C1", "C2", "C3"]
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

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 rounded-lg">
      {/* Dropdowns: Chuyển thành dạng cột trên mobile */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm sm:text-base">Time:</label>
          <motion.select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-2 sm:px-3 py-1 text-sm sm:text-base w-full sm:w-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm sm:text-base">Type:</label>
          <motion.select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-2 sm:px-3 py-1 text-sm sm:text-base w-full sm:w-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm sm:text-base">Room:</label>
          <motion.select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-2 sm:px-3 py-1 text-sm sm:text-base w-full sm:w-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {roomOptions.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm sm:text-base">Cinema:</label>
          <motion.select
            value={selectedTheater.id}
            onChange={(e) => {
              const theater = theaters.find(
                (t) => t.id === parseInt(e.target.value)
              )
              if (theater) setSelectedTheater(theater)
            }}
            className="bg-gray-700 text-white border-gray-600 rounded px-2 sm:px-3 py-1 text-sm sm:text-base w-full sm:w-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm sm:text-base">
            Select Mode:
          </label>
          <motion.select
            value={selectionMode}
            onChange={(e) =>
              setSelectionMode(
                e.target.value as "single" | "pair" | "triple" | "group4"
              )
            }
            className="bg-gray-700 text-white border-gray-600 rounded px-2 sm:px-3 py-1 text-sm sm:text-base w-full sm:w-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <option value="single">Single</option>
            <option value="pair">Pair (2 seats)</option>
            <option value="triple">triple (3 seats)</option>
            <option value="group4">Group (4 seats)</option>
          </motion.select>
        </div>
      </div>

      {/* Chuyển layout thành dạng cột trên mobile */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h3 className="text-lg sm:text-xl font-bold">Select Your Seats</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            {ticketCount} / 8 Seats: {selectedSeats.join(", ")}
          </p>
          {ticketCount >= 8 && (
            <p className="text-red-500 text-xs sm:text-sm">
              You can only select up to 8 seats!
            </p>
          )}
          {/* <Ticket
            theater={selectedTheater}
            movieInfo={movieInfo}
            selectedSeats={selectedSeats}
            selectedTime={selectedTime}
            selectedDate={selectedDate || undefined}
            ticketId={ticketId}
            selectedRoom={selectedRoom}
            selectedType={selectedType}
          /> */}
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
