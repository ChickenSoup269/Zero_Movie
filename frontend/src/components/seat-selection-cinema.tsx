import { useState, useEffect } from "react"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { QRCodeSVG } from "qrcode.react"

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
  const [ticketCount, setTicketCount] = useState(0)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [ticketId, setTicketId] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("18:00")
  const [selectedType, setSelectedType] = useState<string>("2D")
  const [selectedRoom, setSelectedRoom] = useState<string>("C1")
  const [selectedTheater, setSelectedTheater] = useState<Theater>(theaters[0])

  const timeOptions = ["18:00", "20:00", "22:00"]
  const typeOptions = ["2D", "3D", "IMAX"]
  const roomOptions = ["C1", "C2", "C3"]

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
  }, [selectedSeats])

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
        let isSold = false
        if (selectedRoom === "C1") {
          isSold = seatNumber <= 5
        } else if (selectedRoom === "C2") {
          isSold = seatNumber >= 14
        } else if (selectedRoom === "C3") {
          isSold = seatNumber >= 7 && seatNumber <= 12
        }
        return {
          row,
          number: seatNumber,
          type: isSold ? "sold" : "available",
        } as Seat
      }),
  }))

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === "sold") return

    const seatId = `${seat.row}${seat.number}`
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const today = new Date()
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      const day = date.getDate().toString().padStart(2, "0")
      const month = months[date.getMonth()]
      const dayOfWeek = daysOfWeek[date.getDay()]
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      dates.push({ day, month, dayOfWeek, isToday, isSelected, date })
    }
    return dates
  }

  const weekDates = getWeekDates()

  const handlePrevWeek = () => {
    const newStart = subDays(currentWeekStart, 7)
    setCurrentWeekStart(newStart)
  }

  const handleNextWeek = () => {
    const newStart = addDays(currentWeekStart, 7)
    setCurrentWeekStart(newStart)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setCurrentWeekStart(date)
  }

  const qrCodeContent = JSON.stringify({
    cinema: selectedTheater.name,
    movie: movieInfo.movieTitle,
    director: movieInfo.director,
    name: "Thien dep trai",
    seats: selectedSeats.join(", ") || "None",
    time: selectedTime,
    ticketId: ticketId || "None",
    date: selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022",
    room: selectedRoom,
    type: selectedType,
  })

  return (
    <div className="mt-10 p-6  rounded-lg">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex gap-2 items-center">
          <div className="text-gray-400">Date:</div>
          <button
            onClick={handlePrevWeek}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-1">
            {weekDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(date.date)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  date.isSelected
                    ? "bg-[#4599e3] text-white"
                    : date.isToday
                    ? "bg-[#4599e3] text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {date.isToday && !date.isSelected ? "Today" : date.day} <br />
                <span className="text-xs">
                  {date.month} {date.dayOfWeek}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={handleNextWeek}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {selectedDate
                  ? format(selectedDate, "dd MMM yyyy")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    setCurrentWeekStart(date)
                  }
                }}
                initialFocus
                className="bg-gray-800 text-white border-gray-700"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Time:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Room:</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
          >
            {roomOptions.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Theater:</label>
          <select
            value={selectedTheater.id}
            onChange={(e) => {
              const theater = theaters.find(
                (t) => t.id === parseInt(e.target.value)
              )
              if (theater) setSelectedTheater(theater)
            }}
            className="bg-gray-700 text-white border-gray-600 rounded px-3 py-1"
          >
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3 flex flex-col gap-4">
          <h3 className="text-xl font-bold">Select Your Seats</h3>
          <p className="text-gray-400">
            {ticketCount} Seats: {selectedSeats.join(", ")}
          </p>
          {/* Thêm class ticket-wrapper để tạo hiệu ứng vé */}
          <div className="bg-white text-black flex overflow-hidden ticket-wrapper relative rounded-md">
            {/* Bên trái: Thông tin vé */}
            <div className="w-2/3 p-4 border-r-2 border-dotted border-black">
              <h4 className="text-lg font-bold text-[#4599e3]">
                {selectedTheater.name}
              </h4>
              <p className="text-xs text-gray-500">{selectedTheater.address}</p>
              <div className="mt-2 flex justify-between">
                <div>
                  <span className="text-gray-500 text-sm">MOVIE</span>
                  <p className="font-semibold">{movieInfo.movieTitle}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">CUSTOMER</span>
                  <p className="font-semibold">Thien dep trai</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">TYPE</span>
                  <p className="font-semibold">{movieInfo.type}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div>
                  <span className="text-gray-500 text-sm">SEAT</span>
                  <p className="font-semibold">
                    {selectedSeats.join(", ") || "None"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">TIME</span>
                  <p className="font-semibold">{selectedTime}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">DATE</span>
                  <p className="font-semibold">
                    {selectedDate
                      ? format(selectedDate, "dd/MM/yyyy")
                      : "12/07/2022"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bên phải: ROOM, TICKET ID, và QR code */}
            <div className="w-1/3 p-4 bg-[#4599e3] text-white flex flex-col items-center justify-between rounded-r-md">
              <div className="text-center">
                <p className="text-4xl font-bold">{selectedRoom}</p>
                <p className="text-sm">ROOM</p>
                <p className="text-sm mt-1">Ticket ID: {ticketId || "None"}</p>
              </div>
              <div className="bg-white p-1 rounded">
                <QRCodeSVG value={qrCodeContent} size={80} />
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            BUY
          </button>
        </div>

        <div className="w-2/3">
          <div className="text-center text-gray-400 mb-4">
            <div className="border-t border-gray-500 pt-2">SCREEN</div>
          </div>
          <div className="grid gap-2">
            {seatsData.map((row) => (
              <div key={row.row} className="flex items-center gap-2">
                <span className="text-gray-400">{row.row}</span>
                <div className="flex gap-2 flex-1 justify-center">
                  {row.seats.map((seat) => {
                    const seatId = `${seat.row}${seat.number}`
                    const isSelected = selectedSeats.includes(seatId)
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-8 h-8 rounded-sm transition-colors ${
                          seat.type === "sold"
                            ? "bg-gray-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#4599e3]"
                            : "bg-gray-400"
                        }`}
                      >
                        {seat.number}
                      </button>
                    )
                  })}
                </div>
                <span className="text-gray-400">{row.row}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#4599e3] rounded-sm"></div>
              <span>User select</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              <span>Sold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm CSS cho hiệu ứng vé */}
      <style jsx>{`
        .ticket-wrapper {
          position: relative;
          overflow: visible !important;
        }

        /* Lỗ tròn bên trái */
        .ticket-wrapper::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -12px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-color: #0f1116;
          border-radius: 50%;
          z-index: 1;
        }

        /* Lỗ tròn bên phải */
        .ticket-wrapper::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -12px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-color: #0f1116;
          border-radius: 50%;
          z-index: 1;
        }
      `}</style>
    </div>
  )
}

export default SeatSelection
