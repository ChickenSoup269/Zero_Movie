"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import SeatSelection from "@/components/ui-details-movies/seat-selection-cinema"
import CommentSection from "@/components/ui-details-movies/comment-section"
import { MovieService } from "@/services/movieService"
import { GenreService } from "@/services/genreService"
import { getAllCinemas } from "@/services/cinemaService"
import UserService from "@/services/userService"

// Interfaces (unchanged)
interface MovieDetailProps {
  params: Promise<{ id: string }>
}

interface Theater {
  id: string
  name: string
  address: string
  image?: string
  phone?: string
  description?: string
  mapUrl?: string
  createdAt?: string
  updatedAt?: string
}

interface MovieUI {
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

interface UserProfile {
  _id: string
  username: string
  fullName: string
  avatar?: string
}

export default function MovieDetail({ params }: MovieDetailProps) {
  const [movie, setMovie] = useState<MovieUI | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isTheaterPopupOpen, setIsTheaterPopupOpen] = useState(false)
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false) // New state for comment popup
  const [genreMap, setGenreMap] = useState<Record<number, string>>({})
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  // Fetch genre map
  useEffect(() => {
    const fetchGenreMap = async () => {
      try {
        const map = await GenreService.getGenreMap()
        setGenreMap(map)
      } catch (err: unknown) {
        console.error("Error fetching genre map:", err)
      }
    }
    fetchGenreMap()
  }, [])

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await UserService.getProfile()
        const user: UserProfile = response.data
        setUserId(user._id)
      } catch (err: unknown) {
        console.warn("User not authenticated or error fetching profile:", err)
        setUserId(undefined)
      }
    }
    fetchUserProfile()
  }, [])

  // Fetch movie data
  useEffect(() => {
    const fetchParamsAndMovie = async () => {
      try {
        const unwrappedParams = await params
        const tmdbId = unwrappedParams.id

        setLoading(true)
        const movieData = await MovieService.getMovieByTmdbId(tmdbId)

        if (!movieData || !movieData.title) {
          throw new Error("Phim không tìm thấy trong cơ sở dữ liệu")
        }

        const movieUI: MovieUI = {
          id: movieData.tmdbId,
          tmdbId: movieData.tmdbId,
          title: movieData.title || "Không có tiêu đề",
          image: movieData.backdropPath
            ? `https://image.tmdb.org/t/p/original${movieData.backdropPath}`
            : "/fallback-image.jpg",
          poster: movieData.posterPath
            ? `https://image.tmdb.org/t/p/w500${movieData.posterPath}`
            : "/fallback-poster.jpg",
          genre: Array.isArray(movieData.genreIds)
            ? movieData.genreIds
                .map((id) => genreMap[id] || "Không xác định")
                .filter(Boolean)
                .join(", ")
            : "Không xác định",
          rating: movieData.voteAverage || 0,
          ageRating: movieData.ageRating || (movieData.adult ? "R" : "PG-13"),
          duration: movieData.runtime ? `${movieData.runtime} phút` : "N/A",
          description: movieData.overview || "Không có mô tả.",
          director: movieData.director || "Không xác định",
          writers: movieData.writers || [],
          starring: movieData.starring || "Không xác định",
        }

        setMovie(movieUI)
        setLoading(false)
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi không xác định"
        console.error("Error fetching movie:", errorMessage)
        setError(errorMessage || "Lỗi khi lấy chi tiết phim")
        setLoading(false)
      }
    }

    fetchParamsAndMovie()
  }, [params, genreMap])

  // Fetch cinemas
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await getAllCinemas()
        const mappedTheaters = (response.cinemas || []).map((cinema) => ({
          id: cinema.id,
          name: cinema.name,
          address: cinema.address,
          createdAt: cinema.createdAt,
          updatedAt: cinema.updatedAt,
        }))
        setTheaters(mappedTheaters)
      } catch (err) {
        console.error("Error fetching cinemas:", err)
        toast.error("Failed to load cinemas")
      }
    }
    fetchCinemas()
  }, [toast])

  if (loading) {
    return <div className="text-white text-center py-10">Đang tải...</div>
  }

  if (error || !movie) {
    return (
      <div className="text-white text-center py-10">
        {error || "Không tìm thấy phim"}
      </div>
    )
  }

  const genres = movie.genre.split(", ").filter(Boolean)

  const openTheaterPopup = (theater: Theater) => {
    setSelectedTheater(theater)
    setIsTheaterPopupOpen(true)
  }

  const closeTheaterPopup = () => {
    setIsTheaterPopupOpen(false)
  }

  const openTrailerPopup = () => {
    setIsTrailerOpen(true)
  }

  const closeTrailerPopup = () => {
    setIsTrailerOpen(false)
  }

  const openCommentPopup = () => {
    setIsCommentPopupOpen(true)
  }

  const closeCommentPopup = () => {
    setIsCommentPopupOpen(false)
  }

  const isAnyPopupOpen =
    isTrailerOpen || isTheaterPopupOpen || isCommentPopupOpen

  // Animation variants (unchanged)
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

  const infoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2, ease: "easeInOut" },
    },
  }

  const infoItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const overlayVariants = {
    hidden: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  }

  const popupContentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  }

  const theaterHoverVariants = {
    rest: { scale: 1, backgroundColor: "rgba(55, 65, 81, 0)" },
    hover: { scale: 1.02, backgroundColor: "rgba(55, 65, 81, 1)" },
  }

  const buttonHoverVariants = {
    rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" },
    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)" },
  }

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px 5px rgba(255, 0, 0, 0.5)",
        "0 0 20px 5px rgba(0, 255, 0, 0.5)",
        "0 0 20px 5px rgba(0, 0, 255, 0.5)",
        "0 0 20px 5px rgba(255, 0, 255, 0.5)",
        "0 0 20px 5px rgba(255, 0, 0, 0.5)",
      ],
      transition: { duration: 5, repeat: Infinity, ease: "linear" },
    },
  }

  const backgroundVariants = {
    normal: { filter: "blur(0px)" },
    blurred: { filter: "blur(8px)" },
  }

  return (
    <div className="relative min-h-screen text-white flex flex-col">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative w-full aspect-video">
          <Image
            src={movie.image || "/placeholder.jpg"}
            alt={movie.title || "Movie"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg"
            }}
            quality={80}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 0%, #0e1116 40%)",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative flex-1 flex items-end justify-center z-10 pt-52 pb-20"
        variants={backgroundVariants}
        animate={isAnyPopupOpen ? "blurred" : "normal"}
      >
        <div className="container mx-auto px-4 pb-10">
          <motion.div
            className="flex flex-col md:flex-row gap-6 items-start"
            variants={infoVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Poster */}
            <motion.div
              variants={infoItemVariants}
              className="relative sm:w-1/12 xl:w-1/6"
            >
              <div className="absolute inset-0 blur-xl opacity-100">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={movie.poster || "/placeholder-poster.jpg"}
                    alt={movie.title || "Movie poster"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-poster.jpg"
                    }}
                  />
                </div>
              </div>
              <Image
                src={movie.poster}
                alt={movie.title}
                width={250}
                height={375}
                className="relative z-10 rounded-lg shadow-lg w-full h-auto object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="/fallback-poster.jpg"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </motion.div>

            {/* Movie Info */}
            <motion.div
              variants={infoItemVariants}
              className="w-full md:w-1/2 flex flex-col gap-4"
            >
              <motion.h1
                variants={infoItemVariants}
                className="text-4xl md:text-5xl font-bold"
              >
                {movie.title}
              </motion.h1>
              <motion.div
                variants={infoItemVariants}
                className="flex gap-2 items-center flex-wrap"
              >
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-black text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                <span className="text-sm font-semibold text-yellow-400">
                  IMDb {movie.rating.toFixed(1)}/10
                </span>
                <span className="px-2 py-1 bg-white text-black text-sm font-bold rounded">
                  {movie.ageRating}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-green-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {movie.duration}
                </span>
              </motion.div>
              <motion.p
                variants={infoItemVariants}
                className="text-gray-300 text-base"
              >
                {movie.description}
              </motion.p>
              <motion.div variants={infoItemVariants}>
                <table className="w-full text-gray-300 border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 pr-4 font-semibold text-white w-1/4">
                        Đạo diễn
                      </td>
                      <td className="py-2">{movie.director}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 pr-4 font-semibold text-white w-1/4">
                        Biên kịch
                      </td>
                      <td className="py-2">
                        {movie.writers.length > 0
                          ? movie.writers.join(", ")
                          : "Không xác định"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold text-white w-1/4">
                        Diễn viên
                      </td>
                      <td className="py-2">{movie.starring}</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
              <motion.div
                variants={infoItemVariants}
                className="flex gap-4 mt-4"
              >
                <motion.button
                  className="px-6 py-2 text-white rounded-md flex items-center gap-2"
                  style={{ backgroundColor: "#4599e3" }}
                  whileHover="hover"
                  initial="rest"
                  variants={buttonHoverVariants}
                  onClick={openTrailerPopup}
                >
                  Xem Trailer
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
                <motion.button
                  className="px-6 py-2 text-black bg-white rounded-md flex items-center gap-2"
                  whileHover="hover"
                  initial="rest"
                  variants={buttonHoverVariants}
                >
                  Thêm vào Watchlist
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  className="px-6 py-2 text-white rounded-md flex items-center gap-2"
                  style={{ backgroundColor: "#10b981" }}
                  whileHover="hover"
                  initial="rest"
                  variants={buttonHoverVariants}
                  onClick={openCommentPopup}
                >
                  Bình luận
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Theaters List */}
            <motion.div
              variants={infoItemVariants}
              className="w-full md:w-1/4 flex flex-col gap-4"
            >
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white sm:pt-0 md:pt-10 xl:pt-20">
                  Rạp chiếu
                </h3>
                <div className="space-y-2">
                  {theaters.map((theater) => (
                    <motion.div
                      key={theater.id}
                      className={`flex justify-between items-center cursor-pointer p-2 rounded ${
                        selectedTheater?.id === theater.id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => openTheaterPopup(theater)}
                      whileHover="hover"
                      initial="rest"
                      variants={theaterHoverVariants}
                    >
                      <span className="text-gray-300">{theater.name}</span>
                      <svg
                        className="w-5 h-5 text-orange-400"
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Seat Selection */}
          <SeatSelection movieInfo={movie} theaters={theaters} />
        </div>
      </motion.div>

      {/* Theater Popup */}
      <AnimatePresence>
        {isTheaterPopupOpen && selectedTheater && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6 relative"
              variants={popupContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={closeTheaterPopup}
                className="absolute top-4 right-4 text-gray-300 hover:text-white"
                aria-label="Đóng popup rạp chiếu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="w-full md:w-1/2 flex flex-col gap-4 text-white">
                <h3 className="text-2xl md:text-3xl font-bold">
                  {selectedTheater.name}
                </h3>
                <div>
                  <span className="font-semibold">Địa chỉ:</span>{" "}
                  <span className="text-gray-300">
                    {selectedTheater.address}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Số điện thoại:</span>{" "}
                  <span className="text-gray-300">0994705379</span>
                </div>
                <p className="text-gray-300 text-base">
                  Rạp hay chữ đẹp không cần phải đi xem
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7877999948746!2d106.69745087572814!3d10.827544858247322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528f4a62fce9b%3A0xc99902aa1e26ef02!2sVan%20Lang%20University%20-%20Main%20Campus!5e0!3m2!1sen!2s!4v1745354284919!5m2!1sen!2s"
                  width="600"
                  height="450"
                  className="rounded-md"
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trailer Popup */}
      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="rounded-lg p-6 w-full max-w-2xl relative"
              variants={popupContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={closeTrailerPopup}
                className="absolute top-[-10px] right-[-10px] text-gray-300 hover:text-white z-10"
                aria-label="Đóng trailer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="w-full relative">
                <div
                  className="relative z-10"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/t1f0kBkSQs8?si=f1dZbWrN33p1NjlT"
                    title="Trailer phim"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    paddingBottom: "56.25%",
                    filter: "blur(20px)",
                    opacity: 0.7,
                  }}
                  variants={glowVariants}
                  animate="glow"
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/t1f0kBkSQs8?si=f1dZbWrN33p1NjlT"
                    title="Trailer phim (blurred)"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Popup */}
      <CommentSection
        movieId={movie.id}
        userId={userId}
        isOpen={isCommentPopupOpen}
        onClose={closeCommentPopup}
      />
    </div>
  )
}
