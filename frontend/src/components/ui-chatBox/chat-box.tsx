/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
  Send,
  Loader2,
  MessageSquareMore,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { debounce } from "lodash"
import UserService from "@/services/userService"
import { MovieService, Movie } from "@/services/movieService"
import { GenreService } from "@/services/genreService"
import { MovieQueryProcessor } from "@/components/ui-train-chatBox/movie-query-processor"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Message {
  role: "user" | "bot"
  content: {
    message: string
    imageUrl?: string
    link?: { url: string; text: string }
  }
  timestamp: Date
}

async function getGeminiResponse(prompt: string, userId?: string) {
  console.log(
    `Processing prompt: "${prompt}" (raw: "${prompt.replace(/\s/g, "·")}")`
  )
  const movieResponse = await MovieQueryProcessor.processQuery(prompt, userId)
  console.log("MovieQueryProcessor response:", movieResponse)
  if (movieResponse) {
    const responseString =
      typeof movieResponse === "string"
        ? { message: movieResponse }
        : movieResponse
    console.log("Wrapped response:", responseString)
    return {
      candidates: [
        {
          content: {
            parts: [{ text: JSON.stringify(responseString) }],
          },
        },
      ],
    }
  }

  console.log("Falling back to Gemini API")
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
  const [userId, setUserId] = useState<string | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [genreMap, setGenreMap] = useState<Record<number, string>>({})
  const { toast } = useToast()
  const router = useRouter()

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "0px"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  useEffect(() => {
    if (inputRef.current) {
      autoResize(inputRef.current)
    }
  }, [input])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsProfileLoading(true)
        const response = await UserService.getProfile()
        const { role, _id } = response.data
        console.log(`User profile: role=${role}, id=${_id}`)
        setUserRole(role)
        setUserId(_id)
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err.message)
        setUserRole(null)
        setUserId(null)
      } finally {
        setIsProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const fetchGenreMap = async () => {
      try {
        const map = await GenreService.getGenreMap()
        setGenreMap(map)
      } catch (error) {
        console.error("Failed to fetch genre map:", error)
      }
    }
    fetchGenreMap()
  }, [])

  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        setDebouncedSearchText(input.trim())
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setDebouncedSearchText("")
      setSearchResults([])
    }
  }, [input])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchText) {
        setSearchResults([])
        return
      }

      const lowerQuery = debouncedSearchText.toLowerCase()
      const isSearchQuery =
        lowerQuery.includes("tìm phim") ||
        lowerQuery.includes("tìm kiếm phim") ||
        lowerQuery.includes("tìm bộ phim") ||
        lowerQuery.includes("phim có tên") ||
        lowerQuery.includes("phim tên là")

      if (!isSearchQuery) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          toast({
            title: "Unauthorized",
            description: "Please log in to search movies.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        let searchTerm = debouncedSearchText
        if (lowerQuery.includes("tìm phim")) {
          searchTerm = lowerQuery.split("tìm phim")[1]?.trim() || ""
        } else if (lowerQuery.includes("tìm kiếm phim")) {
          searchTerm = lowerQuery.split("tìm kiếm phim")[1]?.trim() || ""
        } else if (lowerQuery.includes("tìm bộ phim")) {
          searchTerm = lowerQuery.split("tìm bộ phim")[1]?.trim() || ""
        } else if (lowerQuery.includes("phim có tên")) {
          searchTerm = lowerQuery.split("phim có tên")[1]?.trim() || ""
        } else if (lowerQuery.includes("phim tên là")) {
          searchTerm = lowerQuery.split("phim tên là")[1]?.trim() || ""
        }

        if (!searchTerm) {
          setSearchResults([])
          setIsLoading(false)
          return
        }

        const response = await MovieService.searchMovies(searchTerm)
        const validatedMovies = response.filter(
          (movie) => movie.tmdbId && !isNaN(movie.tmdbId) && movie.tmdbId > 0
        )

        setSearchResults(validatedMovies)

        if (validatedMovies.length === 0) {
          toast({
            title: "No Results",
            description: `No movies found for "${searchTerm}".`,
            variant: "default",
          })
        }
      } catch (error: any) {
        console.error("Search movies error:", error)
        const errorMessage = error.response?.data?.message?.includes(
          "Cast to Number failed"
        )
          ? "Unable to search due to invalid movie data."
          : error.message || "An error occurred while searching."
        toast({
          title: "Search Error",
          description: errorMessage,
          variant: "destructive",
        })
        if (error.response?.status === 401) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchText, toast, router])

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    const handleScroll = () => {
      const isAtBottom =
        scrollArea.scrollHeight -
          scrollArea.scrollTop -
          scrollArea.clientHeight <
        50
      setShowScrollButton(!isAtBottom)
    }

    scrollArea.addEventListener("scroll", handleScroll)
    return () => scrollArea.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current && !showScrollButton) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isLoading])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isFullscreen])

  const debouncedHandleSend = debounce((e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage: Message = {
      role: "user",
      content: { message: trimmedInput },
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSearchText("")
    setDebouncedSearchText("")
    setSearchResults([])
    setIsLoading(true)
    setError(null)

    getGeminiResponse(trimmedInput, userId)
      .then((result) => {
        const responseText =
          result.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
        let botContent
        try {
          botContent = JSON.parse(responseText)
        } catch (e) {
          botContent = { message: responseText || "Error: Empty response" }
        }
        const botMessage: Message = {
          role: "bot",
          content: botContent,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      })
      .catch((err: any) => {
        setError(err.message)
        const errorMessage: Message = {
          role: "bot",
          content: { message: `Error: ${err.message}` },
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      })
      .finally(() => {
        setIsLoading(false)
        if (inputRef.current) {
          autoResize(inputRef.current)
          inputRef.current.focus()
        }
      })
  }, 300)

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowScrollButton(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isFullscreen && !isOpen) {
      setIsFullscreen(false)
    }
    setSearchResults([])
    setInput("")
    setDebouncedSearchText("")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleViewDetails = (movie: Movie) => {
    if (!movie.tmdbId || isNaN(movie.tmdbId) || movie.tmdbId <= 0) {
      toast({
        title: "Error",
        description: "Invalid movie ID. Please try another movie.",
        variant: "destructive",
      })
      return
    }
    if (movie.status === "upcoming") {
      toast({
        title: "Coming Soon",
        description: "This movie has not been released yet.",
        variant: "default",
        action: <ToastAction altText="OK">OK</ToastAction>,
      })
    } else {
      router.push(`/details-movies/${movie.tmdbId}`)
    }
  }

  const allowedRoles = ["admin", "user"]

  if (isProfileLoading || !userRole || !allowedRoles.includes(userRole)) {
    console.log(
      `Chatbox not rendered: isProfileLoading=${isProfileLoading}, userRole=${userRole}`
    )
    return null
  }

  const popupVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
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
            variants={
              !isFullscreen
                ? {
                    open: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
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
                      },
                    },
                  }
                : undefined
            }
            initial={!isFullscreen ? "closed" : false}
            animate={!isFullscreen ? "open" : false}
            exit={!isFullscreen ? "closed" : false}
            className={cn(
              "flex flex-col bg-background border shadow-lg overflow-hidden relative",
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
                  <h3 className="font-medium text-sm text-white">
                    Gemini X Zero
                  </h3>
                  <p className="text-xs opacity-90 text-white">
                    Powered by Google Gemini
                  </p>
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
                  Xin chào! Tôi là trợ lý AI của Zero Movies. Hãy nhập "help" để
                  xem tôi có thể giúp gì cho bạn!
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={`${msg.timestamp.getTime()}-${index}`}
                  className={cn(
                    "flex mb-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
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
                        {msg.content.message}
                      </p>
                      {msg.content.imageUrl && (
                        <img
                          src={msg.content.imageUrl}
                          alt="Movie poster"
                          className="mt-2 rounded-md max-w-full h-auto"
                          style={{ maxWidth: "150px" }}
                        />
                      )}
                      {msg.content.link && (
                        <a
                          href={msg.content.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline mt-2 block text-sm"
                        >
                          {msg.content.link.text}
                        </a>
                      )}
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

            {showScrollButton && (
              <Button
                onClick={scrollToBottom}
                className="absolute bottom-16 right-4 rounded-full h-10 w-10 bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg"
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            )}

            <div className="p-3 border-t bg-background relative">
              <form
                onSubmit={(e) => debouncedHandleSend(e)}
                className="flex gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    autoResize(e.target)
                  }}
                  placeholder="Nhập tin nhắn hoặc tìm phim..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition duration-200 ease-in-out"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim() && !isLoading) {
                        debouncedHandleSend()
                      }
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

              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.2 },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute bottom-16 left-0 right-0 mx-3 bg-white/80 dark:bg-gray-800/90 shadow-lg rounded-lg z-10 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700"
                  >
                    {searchResults.map((movie) => (
                      <div
                        key={movie._id}
                        onClick={() => handleViewDetails(movie)}
                        className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-colors"
                      >
                        <Image
                          src={
                            movie.posterPath
                              ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                              : "/placeholder-image.jpg"
                          }
                          alt={movie.title}
                          width={50}
                          height={75}
                          className="rounded-md mr-3 object-cover"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                        <div className="flex-1 text-black dark:text-white">
                          <h3 className="font-semibold text-sm">
                            {movie.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {movie.genreIds?.length > 0 &&
                              `${movie.genreIds
                                .map((id) => genreMap[id] || "Unknown")
                                .join(", ")}`}
                            {movie.releaseDate
                              ? ` • ${new Date(
                                  movie.releaseDate
                                ).getFullYear()}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
