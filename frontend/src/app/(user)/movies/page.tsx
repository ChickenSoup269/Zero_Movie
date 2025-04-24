/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { MovieService, Movie } from "@/services/movieService"
import { GenreService, Genre } from "@/services/genreService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import "./movies.css"
import { Slide } from "@/components/ui-home/full-image-slider"

interface DisplayedMovie extends Movie {
  genreNames: string[]
}

const Movies = () => {
  const [selectedTab, setSelectedTab] = useState<"nowPlaying" | "upcoming">(
    "nowPlaying"
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState<DisplayedMovie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<DisplayedMovie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [selectedGenre, setSelectedGenre] = useState<string>("0")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const moviesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  // Fetch movies and genres on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [movieData, genreData] = await Promise.all([
          MovieService.getAllMovies(),
          GenreService.getGenres(),
        ])

        // Map genreIds to genre names
        const displayedMovies: DisplayedMovie[] = movieData.map((movie) => ({
          ...movie,
          genreNames: movie.genreIds
            .map((id) => genreData.find((g) => g.id === id)?.name || "")
            .filter(Boolean),
        }))

        setMovies(displayedMovies)
        setFilteredMovies(displayedMovies)
        setGenres([{ id: 0, name: "All Genres" }, ...genreData])
      } catch (err) {
        setError("Failed to fetch movies or genres")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle search and genre filtering
  useEffect(() => {
    const filterMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let result: DisplayedMovie[] = movies

        // Apply search filter
        if (searchText.trim()) {
          const searchResults = await MovieService.searchMovies(
            searchText.trim()
          )
          result = searchResults.map((movie) => ({
            ...movie,
            genreNames: movie.genreIds
              .map((id) => genres.find((g) => g.id === id)?.name || "")
              .filter(Boolean),
          }))
        }

        // Apply genre filter
        if (selectedGenre !== "0") {
          result = result.filter((movie) =>
            movie.genreIds?.includes(parseInt(selectedGenre))
          )
        }

        // Apply status filter (nowPlaying or upcoming)
        result = result.filter((movie) => movie.status === selectedTab)

        setFilteredMovies(result)
      } catch (err) {
        setError("Failed to filter movies")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      filterMovies()
    }, 1000)

    return () => clearTimeout(debounceTimer)
  }, [searchText, selectedGenre, selectedTab, movies, genres])

  // Pagination
  const moviesPerPage = 8
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = filteredMovies.slice(startIndex, endIndex)

  // Animation variants
  const movieVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const scaleVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const detailsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  const blurVariants = {
    initial: { filter: "blur(0px)" },
    hover: {
      filter: "blur(4px)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  }

  // Event handlers
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setHoveredIndex(null)
    }
  }, [currentPage])

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setHoveredIndex(null)
    }
  }, [currentPage, totalPages])

  const handleViewDetails = (movie: Slide) => {
    console.log("Navigating to details with tmdbId:", movie.tmdbId) // Debug
    if (movie.status === "upcoming") {
      toast({
        title: "Hey!",
        description: "The movie has no release date yet :(",
        variant: "default",
        action: <ToastAction altText="Try again">I'm cook</ToastAction>,
      })
    } else {
      router.push(`/details-movies/${movie.tmdbId}`)
    }
  }

  const getShortDescription = useCallback((description: string) => {
    const firstPeriodIndex = description.indexOf(".")
    return firstPeriodIndex !== -1
      ? description.substring(0, firstPeriodIndex + 1)
      : description.substring(0, 100) + "..."
  }, [])

  const renderStars = useCallback((rating: number) => {
    const maxStars = 5
    const scaledRating = (rating / 10) * maxStars
    const stars = []
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-3 h-3 inline-block ${
            i <= scaledRating ? "text-yellow-400" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return stars
  }, [])

  return (
    <div className="movies-page">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 pt-32 sm:pt-28 md:pt-36 lg:pt-40 xl:pt-44">
        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-2">
          <Button
            onClick={() => {
              setSelectedTab("nowPlaying")
              setCurrentPage(1)
              setHoveredIndex(null)
            }}
            className={`px-6 py-2 text-lg font-semibold rounded-lg transition-colors duration-300 ${
              selectedTab === "nowPlaying"
                ? "bg-[#4599e3] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            aria-pressed={selectedTab === "nowPlaying"}
          >
            Now Playing
          </Button>
          <Button
            onClick={() => {
              setSelectedTab("upcoming")
              setCurrentPage(1)
              setHoveredIndex(null)
            }}
            className={`px-6 py-2 text-lg font-semibold rounded-lg transition-colors duration-300 ${
              selectedTab === "upcoming"
                ? "bg-[#4599e3] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            aria-pressed={selectedTab === "upcoming"}
          >
            Upcoming
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-[54rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-4 mb-8 max-w-[54rem] mx-auto bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg"
          >
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-10 py-2 text-sm md:text-base bg-gray-900 text-white border border-gray-700 rounded-full focus:ring-2 focus:ring-[#4599e3] focus:border-transparent transition-all duration-300"
                aria-label="Search movies"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Clear search"
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
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {/* Genre Dropdown */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger
                className="w-[180px] py-2 text-sm md:text-base bg-gray-900 text-white border border-gray-700 rounded-full focus:ring-2 focus:ring-[#4599e3] focus:border-transparent transition-all duration-300"
                aria-label="Select movie genre"
              >
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <motion.div
                        key={genre.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SelectItem
                          value={genre.id.toString()}
                          className="text-white hover:bg-[#4599e3] hover:text-white rounded-md transition-colors duration-200"
                        >
                          {genre.name}
                        </SelectItem>
                      </motion.div>
                    ))
                  ) : (
                    <SelectItem value="0" disabled className="text-gray-400">
                      No genres available
                    </SelectItem>
                  )}
                </AnimatePresence>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center max-w-[54rem] mx-auto">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-[#4599e3]"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && (
          <div
            ref={moviesContainerRef}
            className="relative w-full max-w-[54rem] mx-auto"
          >
            <div className="absolute top-[-20px] right-0 z-10">
              <a
                href="#"
                className="text-white text-sm font-light hover:underline"
                aria-label="See more movies"
              >
                See more
              </a>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTab}-${currentPage}-${searchText}-${selectedGenre}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
                role="grid"
              >
                {currentMovies.length > 0 ? (
                  currentMovies.map((movie, index) => (
                    <motion.div
                      key={movie._id}
                      variants={movieVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative rounded-lg overflow-hidden shadow-lg w-[200px] max-w-[200px] min-w-[200px] mx-auto"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      role="gridcell"
                    >
                      <motion.div
                        variants={scaleVariants}
                        initial="initial"
                        whileHover="hover"
                        className="relative w-full h-[300px] max-h-[300px] min-h-[300px]"
                      >
                        <motion.div
                          variants={blurVariants}
                          initial="initial"
                          animate={hoveredIndex === index ? "hover" : "initial"}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={
                              movie.posterPath
                                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                                : "/placeholder-image.jpg"
                            }
                            alt={movie.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </motion.div>
                      </motion.div>

                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            variants={detailsVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="absolute bottom-0 left-0 right-0 top-0 p-2 bg-gray-800 bg-opacity-70 text-white flex flex-col justify-center items-center"
                          >
                            <motion.h3
                              variants={childVariants}
                              className="text-sm font-semibold text-center mb-1"
                            >
                              {movie.title}
                            </motion.h3>
                            <motion.div
                              variants={childVariants}
                              className="flex items-center mb-1 gap-1"
                            >
                              {renderStars(movie.voteAverage)}
                              <span className="text-xs">
                                {movie.voteAverage.toFixed(1)}/10
                              </span>
                            </motion.div>
                            <motion.div
                              variants={childVariants}
                              className="flex flex-wrap gap-1 mb-1 justify-center"
                            >
                              {movie.genreNames.map((genre, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-white text-black rounded cursor-default"
                                >
                                  {genre}
                                </span>
                              ))}
                            </motion.div>
                            <motion.p
                              variants={childVariants}
                              className="text-xs mb-2 text-center line-clamp-3"
                            >
                              {getShortDescription(movie.overview)}
                            </motion.p>
                            <motion.button
                              variants={childVariants}
                              onClick={() => handleViewDetails(movie)} // lỗi này không ảnh hưởng gì
                              className="w-full max-w-[150px] py-1 text-sm font-semibold text-white bg-[#4599e3] rounded-lg hover:bg-[#357abd] transition-colors duration-300"
                              aria-label={`View details for ${movie.title}`}
                            >
                              View Details
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    key="no-movies"
                    variants={movieVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center text-gray-400 col-span-full"
                  >
                    No movies found
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center mt-8 space-x-4 max-w-[54rem] mx-auto">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                currentPage === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#4599e3] hover:bg-[#357abd]"
              }`}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span className="text-white self-center" aria-live="polite">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#4599e3] hover:bg-[#357abd]"
              }`}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Movies
