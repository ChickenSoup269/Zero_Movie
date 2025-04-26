/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, Loader2, MessageSquareMore, X } from "lucide-react"
import { cn } from "@/lib/utils"
import UserService from "@/services/userService"
import { MovieService } from "@/services/movieService"
import { GenreService } from "@/services/genreService"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
interface Message {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

// Function to process movie-related queries
async function processMovieQuery(query: string) {
  // Convert query to lowercase for easier matching
  const lowerQuery = query.toLowerCase().trim()

  // Movie count query
  if (
    lowerQuery.includes("bao nhiêu phim") ||
    lowerQuery.includes("số lượng phim") ||
    lowerQuery.includes("đếm số phim") ||
    lowerQuery.includes("tổng số phim") ||
    lowerQuery.includes("có mấy phim") ||
    lowerQuery.includes("có bao nhiêu bộ phim")
  ) {
    try {
      const movies = await MovieService.getAllMovies()
      return `Hiện tại hệ thống có ${movies.length} phim.`
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về số lượng phim: ${error.message}`
    }
  }

  // Featured movies query
  if (
    lowerQuery.includes("phim nổi bật") ||
    lowerQuery.includes("phim đáng xem") ||
    lowerQuery.includes("phim phổ biến") ||
    lowerQuery.includes("phim hay") ||
    lowerQuery.includes("phim được yêu thích")
  ) {
    try {
      const movies = await MovieService.getAllMovies()
      // Sort by popularity
      const featuredMovies = [...movies]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5)

      let response = "Những phim nổi bật hiện tại:\n"
      featuredMovies.forEach((movie, index) => {
        response += `${index + 1}. ${movie.title} (${movie.releaseDate.slice(
          0,
          4
        )}) - Đánh giá: ${movie.voteAverage.toFixed(1)}/10\n`
      })
      return response
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim nổi bật: ${error.message}`
    }
  }

  // Latest movies query
  if (
    lowerQuery.includes("phim mới") ||
    lowerQuery.includes("phim mới nhất") ||
    lowerQuery.includes("phim gần đây") ||
    lowerQuery.includes("phim vừa ra mắt")
  ) {
    try {
      const movies = await MovieService.getAllMovies()
      // Sort by release date
      const latestMovies = [...movies]
        .filter((movie) => movie.releaseDate) // Ensure release date exists
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        )
        .slice(0, 5)

      let response = "Những phim mới nhất:\n"
      latestMovies.forEach((movie, index) => {
        const releaseDate = new Date(movie.releaseDate)
        response += `${index + 1}. ${
          movie.title
        } - Ra mắt: ${releaseDate.toLocaleDateString("vi-VN")}\n`
      })
      return response
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim mới: ${error.message}`
    }
  }

  // Highest rated movies query
  if (
    lowerQuery.includes("phim đánh giá cao") ||
    lowerQuery.includes("phim hay nhất") ||
    lowerQuery.includes("phim top") ||
    lowerQuery.includes("phim xếp hạng cao")
  ) {
    try {
      const movies = await MovieService.getAllMovies()
      // Sort by vote average but only consider movies with sufficient votes
      const highRatedMovies = [...movies]
        .filter((movie) => movie.voteCount > 10) // Only movies with more than 10 votes
        .sort((a, b) => b.voteAverage - a.voteAverage)
        .slice(0, 5)

      let response = "Những phim có đánh giá cao nhất:\n"
      highRatedMovies.forEach((movie, index) => {
        response += `${index + 1}. ${
          movie.title
        } - Đánh giá: ${movie.voteAverage.toFixed(1)}/10 (${
          movie.voteCount
        } lượt)\n`
      })
      return response
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim đánh giá cao: ${error.message}`
    }
  }

  // Genre-related queries
  if (
    lowerQuery.includes("thể loại") ||
    lowerQuery.includes("loại phim") ||
    lowerQuery.includes("genre") ||
    lowerQuery.includes("danh mục")
  ) {
    // If asking for list of genres
    if (
      lowerQuery.includes("danh sách") ||
      lowerQuery.includes("liệt kê") ||
      lowerQuery.includes("tất cả") ||
      lowerQuery.includes("có những") ||
      lowerQuery.includes("là gì") ||
      lowerQuery.match(/^thể loại/)
    ) {
      try {
        const genres = await GenreService.getGenres()
        return `Hệ thống có ${genres.length} thể loại phim: ${genres
          .map((g) => g.name)
          .join(", ")}.`
      } catch (error: any) {
        return `Rất tiếc, tôi không thể lấy thông tin về thể loại phim: ${error.message}`
      }
    }

    // If asking for movies by genre
    const genreWords = lowerQuery.split(/\s+/)
    // Check if any genre is mentioned
    try {
      const genres = await GenreService.getGenres()
      const genreNames = genres.map((g) => g.name.toLowerCase())

      for (const genreWord of genreWords) {
        const matchedGenre = genreNames.find(
          (name) =>
            name.includes(genreWord) ||
            name.includes(genreWord.replace("phim", "").trim())
        )

        if (matchedGenre) {
          const exactGenre = genres.find(
            (g) => g.name.toLowerCase() === matchedGenre
          )
          if (exactGenre) {
            const movies = await GenreService.getMoviesByGenre(exactGenre.name)
            if (movies.length > 0) {
              return `Có ${movies.length} phim thuộc thể loại ${
                exactGenre.name
              }. Một số phim tiêu biểu:\n${movies
                .slice(0, 5)
                .map(
                  (m, i) =>
                    `${i + 1}. ${m.title} (${
                      m.releaseDate?.slice(0, 4) || "N/A"
                    })`
                )
                .join("\n")}${
                movies.length > 5 ? "\n...và nhiều phim khác." : ""
              }`
            } else {
              return `Hiện tại không có phim nào thuộc thể loại ${exactGenre.name}.`
            }
          }
        }
      }
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim theo thể loại: ${error.message}`
    }
  }

  // Movie details query (tìm kiếm thông tin chi tiết về một phim)
  if (
    lowerQuery.includes("thông tin về phim") ||
    lowerQuery.includes("thông tin phim") ||
    lowerQuery.includes("chi tiết phim") ||
    lowerQuery.includes("nội dung phim") ||
    lowerQuery.includes("phim gì") ||
    lowerQuery.includes("mô tả phim")
  ) {
    try {
      // Extract movie title
      let movieTitle = ""
      if (lowerQuery.includes("thông tin về phim")) {
        movieTitle = lowerQuery.split("thông tin về phim")[1].trim()
      } else if (lowerQuery.includes("thông tin phim")) {
        movieTitle = lowerQuery.split("thông tin phim")[1].trim()
      } else if (lowerQuery.includes("chi tiết phim")) {
        movieTitle = lowerQuery.split("chi tiết phim")[1].trim()
      } else if (lowerQuery.includes("nội dung phim")) {
        movieTitle = lowerQuery.split("nội dung phim")[1].trim()
      } else if (lowerQuery.includes("mô tả phim")) {
        movieTitle = lowerQuery.split("mô tả phim")[1].trim()
      }

      if (movieTitle) {
        const movies = await MovieService.searchMovies(movieTitle)
        if (movies.length > 0) {
          const movie = movies[0] // Get the first match

          // Get genre names
          const genreMap = await GenreService.getGenreMap()
          const genreNames = movie.genreIds
            .map((id) => genreMap[id] || "")
            .filter(Boolean)

          let response = `Thông tin chi tiết về phim "${movie.title}":\n\n`
          response += `📅 Năm phát hành: ${
            movie.releaseDate
              ? movie.releaseDate.slice(0, 4)
              : "Không có thông tin"
          }\n`
          response += `⭐ Đánh giá: ${movie.voteAverage.toFixed(1)}/10 (${
            movie.voteCount
          } lượt)\n`
          response += `🎭 Thể loại: ${
            genreNames.join(", ") || "Không có thông tin"
          }\n`

          if (movie.director) {
            response += `🎬 Đạo diễn: ${movie.director}\n`
          }

          if (movie.runtime) {
            const hours = Math.floor(movie.runtime / 60)
            const minutes = movie.runtime % 60
            response += `⏱️ Thời lượng: ${hours > 0 ? `${hours} giờ ` : ""}${
              minutes > 0 ? `${minutes} phút` : ""
            }\n`
          }

          if (movie.overview) {
            response += `\n📝 Tóm tắt: ${movie.overview}\n`
          }

          return response
        } else {
          return `Không tìm thấy thông tin về phim "${movieTitle}".`
        }
      }
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin chi tiết về phim: ${error.message}`
    }
  }

  // Search for movies
  if (
    lowerQuery.includes("tìm phim") ||
    lowerQuery.includes("tìm kiếm phim") ||
    lowerQuery.includes("tìm bộ phim") ||
    lowerQuery.includes("phim có tên") ||
    lowerQuery.includes("phim tên là")
  ) {
    let searchTerm = ""

    if (lowerQuery.includes("tìm phim")) {
      searchTerm = lowerQuery.split("tìm phim")[1].trim()
    } else if (lowerQuery.includes("tìm kiếm phim")) {
      searchTerm = lowerQuery.split("tìm kiếm phim")[1].trim()
    } else if (lowerQuery.includes("tìm bộ phim")) {
      searchTerm = lowerQuery.split("tìm bộ phim")[1].trim()
    } else if (lowerQuery.includes("phim có tên")) {
      searchTerm = lowerQuery.split("phim có tên")[1].trim()
    } else if (lowerQuery.includes("phim tên là")) {
      searchTerm = lowerQuery.split("phim tên là")[1].trim()
    }

    if (searchTerm) {
      try {
        const movies = await MovieService.searchMovies(searchTerm)
        if (movies.length > 0) {
          return `Tìm thấy ${
            movies.length
          } phim liên quan đến "${searchTerm}":\n${movies
            .slice(0, 7)
            .map(
              (m, i) =>
                `${i + 1}. ${m.title} (${m.releaseDate?.slice(0, 4) || "N/A"})`
            )
            .join("\n")}${movies.length > 7 ? "\n...và các phim khác." : ""}`
        } else {
          return `Không tìm thấy phim nào có tên "${searchTerm}".`
        }
      } catch (error: any) {
        return `Rất tiếc, tôi không thể tìm kiếm phim: ${error.message}`
      }
    }
  }

  // Upcoming movies query
  if (
    lowerQuery.includes("phim sắp chiếu") ||
    lowerQuery.includes("phim sắp ra mắt") ||
    lowerQuery.includes("phim sắp tới") ||
    lowerQuery.includes("lịch chiếu phim")
  ) {
    try {
      const movies = await MovieService.getAllMovies()
      const upcomingMovies = movies
        .filter((movie) => movie.status === "upcoming")
        .slice(0, 5)

      if (upcomingMovies.length > 0) {
        let response = "Phim sắp chiếu:\n"
        upcomingMovies.forEach((movie, index) => {
          response += `${index + 1}. ${movie.title} - Dự kiến: ${
            movie.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
              : "Chưa công bố"
          }\n`
        })
        return response
      } else {
        return "Hiện tại không có thông tin về phim sắp chiếu."
      }
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim sắp chiếu: ${error.message}`
    }
  }

  // Now playing movies query
  if (
    lowerQuery.includes("phim đang chiếu") ||
    lowerQuery.includes("phim hiện đang chiếu") ||
    lowerQuery.includes("phim hiện tại")
  ) {
    try {
      const movies = await MovieService.getAllMovies()
      const nowPlayingMovies = movies
        .filter((movie) => movie.status === "nowPlaying")
        .slice(0, 5)

      if (nowPlayingMovies.length > 0) {
        let response = "Phim đang chiếu:\n"
        nowPlayingMovies.forEach((movie, index) => {
          response += `${index + 1}. ${movie.title}\n`
        })
        return response
      } else {
        return "Hiện tại không có thông tin về phim đang chiếu."
      }
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim đang chiếu: ${error.message}`
    }
  }

  // Help message for movie-related functionality
  if (
    lowerQuery.includes("bạn biết gì") ||
    lowerQuery.includes("bạn có thể làm gì") ||
    lowerQuery.includes("hướng dẫn") ||
    lowerQuery.includes("trợ giúp") ||
    lowerQuery.includes("help") ||
    lowerQuery.includes("giúp đỡ") ||
    lowerQuery === "help"
  ) {
    return `Tôi có thể giúp bạn với các thông tin về phim:

1. Số lượng phim: "Có bao nhiêu phim?"
2. Danh sách thể loại: "Liệt kê các thể loại phim"
3. Tìm phim theo tên: "Tìm phim Avengers"
4. Thông tin chi tiết: "Thông tin phim The Godfather"
5. Phim theo thể loại: "Phim hành động"
6. Phim mới nhất: "Phim mới nhất"
7. Phim được đánh giá cao: "Phim đánh giá cao"
8. Phim phổ biến: "Phim nổi bật"
9. Phim sắp chiếu: "Phim sắp chiếu"
10. Phim đang chiếu: "Phim đang chiếu"

Bạn có thể hỏi bất kỳ câu hỏi nào liên quan đến phim!`
  }

  // If nothing matches, return null to use Gemini API
  return null
}

async function getGeminiResponse(prompt: string) {
  // First, check if this is a movie-related query
  const movieResponse = await processMovieQuery(prompt)
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

  // If not a movie-related query, proceed with Gemini API
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
    console.error("Lỗi từ Gemini API:", errorData)
    throw new Error(
      `Lỗi khi gọi Gemini API: ${response.status} - ${JSON.stringify(
        errorData
      )}`
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

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch user profile to check role
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsProfileLoading(true)
        const response = await UserService.getProfile()
        const role = response.data.role // Adjust based on your API response structure
        setUserRole(role)
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err.message)
        setUserRole(null) // Handle unauthenticated or error cases
      } finally {
        setIsProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isOpen])

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
      const result = await getGeminiResponse(trimmedInput)
      const botMessage: Message = {
        role: "bot",
        content:
          result.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Không có dữ liệu trả về",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err: any) {
      setError(err.message)
      const errorMessage: Message = {
        role: "bot",
        content: `Error: ${err.message}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  // Define allowed roles for displaying the chat box
  const allowedRoles = ["admin", "user"] // Added "user" to allow regular users to use the chat

  // Don't render anything while profile is loading or if user doesn't have the required role
  if (isProfileLoading || !userRole || !allowedRoles.includes(userRole)) {
    return null
  }

  // Animation variants for Framer Motion
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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
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
      {/* Chat Window with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col h-96 w-80 sm:w-96 bg-background rounded-lg border shadow-lg overflow-hidden mt-2"
          >
            {/* Chat header */}
            <div className="bg-black p-3 text-primary-foreground flex items-center gap-2">
              <Avatar className="h-8 w-8 flex items-center justify-center">
                <Image
                  src="/logo2.png"
                  alt="Zero Movies Logo"
                  width={100}
                  height={80}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">Gemini X Zero</h3>
                <p className="text-xs opacity-90">Powered by Google Gemini</p>
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                  Xin chào! Tôi là trợ lý AI của Zero Movies. Hãy nhập "help" để
                  xem bạn có thể những thông tin liên quan gì!
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
                      "max-w-xs sm:max-w-sm relative group",
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

            {/* Input area */}
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
