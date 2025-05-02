/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import {
  Send,
  Loader2,
  MessageSquareMore,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import UserService from "@/services/userService"
import { MovieQueryProcessor } from "@/components/ui-train-chatBox/movie-query-processor"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { getAllCinemas, getShowtimesByCinemaId } from "@/services/cinemaService"
import { getSeatsByShowtime } from "@/services/showtimeSeatService"
import { createBooking, deleteBooking } from "@/services/bookingService"
import { MovieService } from "@/services/movieService"
import { format } from "date-fns"
import { createPayment } from "@/services/paymentService"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

interface BookingState {
  step:
    | "selectMovie"
    | "selectTheater"
    | "selectDate"
    | "selectTime"
    | "selectSeats"
    | "confirm"
    | "payment"
  movie?: MovieService
  theater?: { id: string; name: string }
  date?: Date
  showtime?: { id: string; time: string; price: number }
  seats?: string[]
  bookingId?: string
}

async function getGeminiResponse(prompt: string, bookingState: BookingState) {
  // Check for movie-related query
  const movieResponse = await MovieQueryProcessor.processQuery(prompt)
  if (movieResponse) {
    return {
      candidates: [
        {
          content: {
            parts: [{ text: movieResponse }],
          },
        },
      ],
    }
  }

  // Handle booking-related queries
  if (bookingState.step === "selectMovie") {
    const movies = await MovieService.searchMovies(prompt)
    if (movies.length === 0) {
      return {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: `Không tìm thấy phim "${prompt}". Vui lòng thử lại hoặc nhập "danh sách phim" để xem các phim đang chiếu.`,
                },
              ],
            },
          },
        ],
      }
    }
    return {}
  }

  // Default to Gemini API for non-booking queries
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Gemini API key is not configured")
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(
      `Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`
    )
  }

  return response.json()
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [bookingState, setBookingState] = useState<BookingState>({
    step: "selectMovie",
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsProfileLoading(true)
        const response = await UserService.getProfile()
        setUserRole(response.data.role)
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err.message)
        setUserRole(null)
      } finally {
        setIsProfileLoading(false)
      }
    }
    fetchUserProfile()
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isFullscreen])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      if (trimmedInput.toLowerCase() === "danh sách phim") {
        const movies = await MovieService.searchMovies("")
        const botMessage: Message = {
          role: "bot",
          content: `Danh sách phim đang chiếu:\n${movies
            .map((m) => `- ${m.title}`)
            .join("\n")}\nVui lòng chọn một phim.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (trimmedInput.toLowerCase() === "danh sách rạp") {
        const cinemas = await getAllCinemas()
        const botMessage: Message = {
          role: "bot",
          content: `Danh sách rạp chiếu phim:\n${cinemas.cinemas
            ?.map((c) => `- ${c.name} (${c.address})`)
            .join("\n")}\nVui lòng chọn một rạp.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (bookingState.step === "selectMovie") {
        const movies = await MovieService.searchMovies(trimmedInput)
        if (movies.length === 0) {
          throw new Error(
            `Không tìm thấy phim "${trimmedInput}". Vui lòng thử lại.`
          )
        }
        const selectedMovie = movies.find((m) =>
          m.title.toLowerCase().includes(trimmedInput.toLowerCase())
        )
        if (!selectedMovie) {
          const botMessage: Message = {
            role: "bot",
            content: `Tìm thấy các phim:\n${movies
              .map((m) => `- ${m.title}`)
              .join("\n")}\nVui lòng chọn một phim cụ thể.`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        } else {
          setBookingState((prev) => ({
            ...prev,
            step: "selectTheater",
            movie: selectedMovie,
          }))
          const botMessage: Message = {
            role: "bot",
            content: `Đã chọn phim "${selectedMovie.title}". Vui lòng chọn rạp chiếu phim (nhập tên rạp hoặc "danh sách rạp").`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        }
      } else if (bookingState.step === "selectTheater") {
        const cinemas = await getAllCinemas()
        const selectedTheater = cinemas.cinemas?.find((c) =>
          c.name.toLowerCase().includes(trimmedInput.toLowerCase())
        )
        if (!selectedTheater) {
          throw new Error(
            `Không tìm thấy rạp "${trimmedInput}". Nhập "danh sách rạp" để xem các rạp khả dụng.`
          )
        }
        setBookingState((prev) => ({
          ...prev,
          step: "selectDate",
          theater: { id: selectedTheater.id, name: selectedTheater.name },
        }))
        const botMessage: Message = {
          role: "bot",
          content: `Đã chọn rạp "${selectedTheater.name}". Vui lòng chọn ngày chiếu (ví dụ: "30/04/2025").`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (bookingState.step === "selectDate") {
        const date = parseDate(trimmedInput)
        if (!date) {
          throw new Error(
            "Ngày không hợp lệ. Vui lòng nhập theo định dạng DD/MM/YYYY."
          )
        }
        const showtimesResponse = await getShowtimesByCinemaId(
          bookingState.theater!.id,
          format(date, "yyyy-MM-dd"),
          bookingState.movie!._id
        )
        const showtimes = showtimesResponse.showtimes || []
        if (showtimes.length === 0) {
          throw new Error(
            "Không có lịch chiếu cho ngày này. Vui lòng chọn ngày khác."
          )
        }
        setBookingState((prev) => ({
          ...prev,
          step: "selectTime",
          date,
        }))
        const timeOptions = showtimes.map((st) => ({
          id: st.id,
          time: format(new Date(st.startTime), "HH:mm"),
          price: st.price || 75000,
        }))
        const botMessage: Message = {
          role: "bot",
          content: `Các suất chiếu khả dụng:\n${timeOptions
            .map((opt) => `- ${opt.time} (${opt.price.toLocaleString()}đ)`)
            .join("\n")}\nVui lòng chọn giờ chiếu (ví dụ: "14:30").`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (bookingState.step === "selectTime") {
        const showtimesResponse = await getShowtimesByCinemaId(
          bookingState.theater!.id,
          format(bookingState.date!, "yyyy-MM-dd"),
          bookingState.movie!._id
        )
        const showtimes = showtimesResponse.showtimes || []
        const selectedTime = showtimes.find(
          (st) => format(new Date(st.startTime), "HH:mm") === trimmedInput
        )
        if (!selectedTime) {
          throw new Error("Giờ chiếu không hợp lệ. Vui lòng chọn lại.")
        }
        setBookingState((prev) => ({
          ...prev,
          step: "selectSeats",
          showtime: {
            id: selectedTime.id,
            time: trimmedInput,
            price: selectedTime.price || 75000,
          },
        }))
        const seatsResponse = await getSeatsByShowtime(selectedTime.id)
        const availableSeats = seatsResponse.seats
          ?.filter((seat: any) => seat.status === "available")
          .map((seat: any) => seat.seatNumber)
        const botMessage: Message = {
          role: "bot",
          content: `Ghế khả dụng: ${
            availableSeats.join(", ") || "Không còn ghế"
          }\nVui lòng chọn ghế (ví dụ: "A1, A2").`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (bookingState.step === "selectSeats") {
        const seats = trimmedInput.split(",").map((s) => s.trim())
        const seatResponse = await getSeatsByShowtime(bookingState.showtime!.id)
        const validSeats = seats.filter((seat) =>
          seatResponse.seats?.some(
            (s: any) => s.seatNumber === seat && s.status === "available"
          )
        )
        if (validSeats.length === 0) {
          throw new Error("Không có ghế nào hợp lệ. Vui lòng chọn lại.")
        }
        setBookingState((prev) => ({
          ...prev,
          step: "confirm",
          seats: validSeats,
        }))
        const botMessage: Message = {
          role: "bot",
          content: `Bạn đã chọn:\n- Phim: ${
            bookingState.movie!.title
          }\n- Rạp: ${bookingState.theater!.name}\n- Ngày: ${format(
            bookingState.date!,
            "dd/MM/yyyy"
          )}\n- Giờ: ${bookingState.showtime!.time}\n- Ghế: ${validSeats.join(
            ", "
          )}\n- Tổng tiền: ${(
            validSeats.length * bookingState.showtime!.price
          ).toLocaleString()}đ\nNhập "xác nhận" để tiếp tục hoặc "hủy" để dừng.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (bookingState.step === "confirm") {
        if (trimmedInput.toLowerCase() === "hủy") {
          setBookingState({ step: "selectMovie" })
          const botMessage: Message = {
            role: "bot",
            content: "Đã hủy đặt vé. Bạn muốn đặt vé cho phim nào?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        } else if (trimmedInput.toLowerCase() === "xác nhận") {
          const seatResponse = await getSeatsByShowtime(
            bookingState.showtime!.id
          )
          const seatIds = bookingState.seats!.map((seat) => {
            const seatData = seatResponse.seats.find(
              (s: any) => s.seatNumber === seat
            )
            return seatData.seatId
          })
          const bookingResponse = await createBooking(
            {
              showtimeId: bookingState.showtime!.id,
              seatIds,
            },
            new AbortController().signal
          )
          if (!bookingResponse.data?.booking?._id) {
            throw new Error("Không thể tạo booking.")
          }
          setBookingState((prev) => ({
            ...prev,
            step: "payment",
            bookingId: bookingResponse.data.booking._id,
          }))
          const paymentResponse = await createPayment({
            bookingId: bookingResponse.data.booking._id,
            amount: bookingState.seats!.length * bookingState.showtime!.price,
            paymentMethod: "paypal",
          })
          if (!paymentResponse.approveUrl) {
            await deleteBooking(bookingResponse.data.booking._id)
            throw new Error("Không thể tạo link thanh toán PayPal.")
          }
          const botMessage: Message = {
            role: "bot",
            content: `Đã tạo booking. Vui lòng hoàn tất thanh toán qua PayPal: ${paymentResponse.approveUrl}\nSau khi thanh toán, vé sẽ được gửi qua email.`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
          setBookingState({ step: "selectMovie" }) // Reset state
        } else {
          throw new Error('Vui lòng nhập "xác nhận" hoặc "hủy".')
        }
      } else {
        const result = await getGeminiResponse(trimmedInput, bookingState)
        const botMessage: Message = {
          role: "bot",
          content:
            result.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Không có dữ liệu trả về",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (err: any) {
      setError(err.message)
      const errorMessage: Message = {
        role: "bot",
        content: `Lỗi: ${err.message}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  const parseDate = (input: string): Date | null => {
    const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!match) return null
    const [, day, month, year] = match
    const date = new Date(`${year}-${month}-${day}`)
    return isNaN(date.getTime()) ? null : date
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isFullscreen && !isOpen) {
      setIsFullscreen(false)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const allowedRoles = ["admin", "user"]

  if (isProfileLoading || !userRole || !allowedRoles.includes(userRole)) {
    return null
  }

  const chatWindowVariants = {
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.2,
      },
    },
  }

  return (
    <div
      className={cn(
        "fixed z-50",
        isFullscreen ? "inset-0 bg-background/95" : "bottom-4 right-4"
      )}
    >
      {!isFullscreen && (
        <Button
          onClick={toggleChat}
          className="rounded-full h-12 w-12 bg-blue-400 dark:bg-white shadow-gray-500/50 hover:bg-blue-500 text-white dark:text-black hover:text-white flex items-center justify-center shadow-lg duration-300"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquareMore className="h-6 w-6" />
          )}
        </Button>
      )}

      <AnimatePresence>
        {(isOpen || isFullscreen) && (
          <motion.div
            variants={!isFullscreen ? chatWindowVariants : undefined}
            initial={!isFullscreen ? "closed" : false}
            animate={!isFullscreen ? "open" : false}
            exit={!isFullscreen ? "closed" : false}
            className={cn(
              "flex flex-col bg-background border shadow-lg overflow-hidden",
              isFullscreen
                ? "h-full w-full rounded-none"
                : "h-96 w-80 sm:w-96 rounded-lg mt-2"
            )}
          >
            <div className="bg-black p-3 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 flex items-center justify-center">
                  <Image
                    src="/logo2.png"
                    alt="Zero Movies Logo"
                    width={100}
                    height={80}
                    className="cursor-pointer transition-transform duration-300 hover:scale-105"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Gemini X Zero</h3>
                  <p className="text-xs opacity-90">Powered by Google Gemini</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-800"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-white" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>

            <ScrollArea
              className={cn(
                "flex-1 p-4",
                isFullscreen ? "max-h-[calc(100vh-140px)]" : ""
              )}
              ref={scrollAreaRef}
            >
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                  Xin chào! Tôi là trợ lý AI của Zero Movies. Hãy nhập "đặt vé"
                  để bắt đầu đặt vé phim!
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex mb-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      isFullscreen ? "max-w-2xl" : "max-w-xs sm:max-w-sm",
                      "relative group",
                      msg.role === "user" ? "order-1" : "order-0"
                    )}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex mb-4">
                  <div className="bg-muted p-3 rounded-lg rounded-bl-none max-w-xs">
                    <div className="flex justify-center items-center h-6">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex mb-4">
                  <div className="bg-destructive/10 p-3 rounded-lg text-destructive text-sm max-w-xs">
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="p-3 border-t bg-background">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-400 rounded-full h-10 w-10 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
