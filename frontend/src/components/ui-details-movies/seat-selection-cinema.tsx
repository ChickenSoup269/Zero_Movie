/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Ticket from "./ticket"
import DatePicker from "./date-picker"
import SeatPicker from "./seat-picker"
import PaymentDialog from "./payment-dialog"

interface Seat {
  row: string
  number: number
  type: "available" | "sold" | "user-select"
}

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
  const [soldSeats, setSoldSeats] = useState<string[]>([]) // State lưu ghế đã bán
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
    "single" | "pair" | "group4"
  >("single")
  const [hoveredSeats, setHoveredSeats] = useState<string[]>([])
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

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

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const seatsPerRow = 18

  const seatsData = rows.map((row) => ({
    row,
    seats: Array(seatsPerRow)
      .fill(null)
      .map((_, i) => {
        const seatNumber = i + 1
        const seatId = `${row}${seatNumber}`
        let isSold = false

        // Kiểm tra ghế đã bán từ soldSeats hoặc điều kiện ban đầu
        if (soldSeats.includes(seatId)) {
          isSold = true
        } else if (selectedRoom === "C1") {
          isSold = seatNumber <= 5
        } else if (selectedRoom === "C2") {
          isSold = seatNumber >= 14
        } else if (selectedRoom === "C3") {
          isSold = seatNumber >= 7 && seatNumber <= 12
        }

        return {
          row,
          number: seatNumber,
          type: isSold
            ? "sold"
            : selectedSeats.includes(seatId)
            ? "user-select"
            : "available",
        } as Seat
      }),
  }))

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === "sold") return

    const seatId = `${seat.row}${seat.number}`
    const seatsToSelect =
      selectionMode === "single" ? 1 : selectionMode === "pair" ? 2 : 4
    const rowSeats = seatsData.find((r) => r.row === seat.row)?.seats || []
    const startIndex = seat.number - 1

    if (selectedSeats.includes(seatId)) {
      let seatsToRemove: string[] = []
      for (let i = 0; i < seatsToSelect; i++) {
        const currentIndex = startIndex + i
        if (currentIndex >= rowSeats.length) break

        const currentSeat = rowSeats[currentIndex]
        const currentSeatId = `${currentSeat.row}${currentSeat.number}`
        if (selectedSeats.includes(currentSeatId)) {
          seatsToRemove.push(currentSeatId)
        }
      }
      setSelectedSeats((prev) =>
        prev.filter((id) => !seatsToRemove.includes(id))
      )
      return
    }

    if (selectedSeats.length + seatsToSelect > 8) {
      alert("You can only select up to 8 seats!")
      return
    }

    let seatsToAdd: string[] = []
    for (let i = 0; i < seatsToSelect; i++) {
      const currentIndex = startIndex + i
      if (currentIndex >= rowSeats.length) break

      const currentSeat = rowSeats[currentIndex]
      if (currentSeat.type === "sold") break

      const currentSeatId = `${currentSeat.row}${currentSeat.number}`
      if (!selectedSeats.includes(currentSeatId)) {
        seatsToAdd.push(currentSeatId)
      }
    }

    if (seatsToAdd.length < seatsToSelect) {
      alert(`Không đủ ${seatsToSelect} ghế liền kề khả dụng!`)
      return
    }

    setSelectedSeats([...selectedSeats, ...seatsToAdd])
  }

  const handleMouseEnter = (seat: Seat) => {
    if (seat.type === "sold") return

    const seatsToSelect =
      selectionMode === "single" ? 1 : selectionMode === "pair" ? 2 : 4
    const rowSeats = seatsData.find((r) => r.row === seat.row)?.seats || []
    const startIndex = seat.number - 1
    let seatsToHighlight: string[] = []

    for (let i = 0; i < seatsToSelect; i++) {
      const currentIndex = startIndex + i
      if (currentIndex >= rowSeats.length) break

      const currentSeat = rowSeats[currentIndex]
      if (currentSeat.type === "sold") break

      const currentSeatId = `${currentSeat.row}${currentSeat.number}`
      seatsToHighlight.push(currentSeatId)
    }

    if (seatsToHighlight.length === seatsToSelect) {
      setHoveredSeats(seatsToHighlight)
    } else {
      setHoveredSeats([])
    }
  }

  const handleMouseLeave = () => {
    setHoveredSeats([])
  }

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
    // Thêm các ghế đã chọn vào danh sách ghế đã bán
    setSoldSeats((prev) => [...prev, ...selectedSeats])
    // Reset ghế đã chọn
    setSelectedSeats([])
  }

  const originalPrice = ticketCount * originalTicketPrice
  const totalAmount = ticketCount * discountedTicketPrice
  const savings = originalPrice - totalAmount

  return (
    <div className="mt-10 p-6 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Time:</label>
          <motion.select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
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
          <label className="text-gray-400">Type:</label>
          <motion.select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
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
          <label className="text-gray-400">Room:</label>
          <motion.select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
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
          <label className="text-gray-400">Cinema:</label>
          <motion.select
            value={selectedTheater.id}
            onChange={(e) => {
              const theater = theaters.find(
                (t) => t.id === parseInt(e.target.value)
              )
              if (theater) setSelectedTheater(theater)
            }}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
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
          <label className="text-gray-400">Select Mode:</label>
          <motion.select
            value={selectionMode}
            onChange={(e) =>
              setSelectionMode(e.target.value as "single" | "pair" | "group4")
            }
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <option value="single">Single</option>
            <option value="pair">Pair (2 seats)</option>
            <option value="group4">Group (4 seats)</option>
          </motion.select>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3 flex flex-col gap-4">
          <h3 className="text-xl font-bold">Select Your Seats</h3>
          <p className="text-gray-400">
            {ticketCount} / 8 Seats: {selectedSeats.join(", ")}
          </p>
          {ticketCount >= 8 && (
            <p className="text-red-500 text-sm">
              You can only select up to 8 seats!
            </p>
          )}
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
          <Button
            onClick={handleBuyClick}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            BUY
          </Button>
        </div>

        <SeatPicker
          seatsData={seatsData}
          selectedSeats={selectedSeats}
          hoveredSeats={hoveredSeats}
          handleSeatClick={handleSeatClick}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
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
