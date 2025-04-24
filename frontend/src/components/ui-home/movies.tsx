/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
interface Slide {
  id: number
  _id: string // Added _id property
  image: string
  title: string
  description: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
  ageRating: string
  starring: string
  status: "nowPlaying" | "upcoming"
  director: string
  rating: number
  tmdbId: number
}

interface MoviesProps {
  slides: Slide[]
}

const Movies = ({ slides }: MoviesProps) => {
  const [selectedTab, setSelectedTab] = useState<"nowPlaying" | "upcoming">(
    "nowPlaying"
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const moviesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const nowPlayingMovies = slides.filter(
    (slide) => slide.status === "nowPlaying"
  )
  const upcomingMovies = slides.filter((slide) => slide.status === "upcoming")
  const displayedMovies =
    selectedTab === "nowPlaying" ? nowPlayingMovies : upcomingMovies

  const moviesPerPage = 8
  const totalPages = Math.ceil(displayedMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = displayedMovies.slice(startIndex, endIndex)
  const { toast } = useToast()

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setHoveredIndex(null)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setHoveredIndex(null)
    }
  }

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

  const getShortDescription = (description: string) => {
    const firstPeriodIndex = description.indexOf(".")
    if (firstPeriodIndex !== -1) {
      return description.substring(0, firstPeriodIndex + 1)
    }
    return description
  }

  const renderStars = (rating: number) => {
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
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 pt-44 sm:pt-32 md:pt-40 lg:pt-48 xl:pt-44">
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            setSelectedTab("nowPlaying")
            setCurrentPage(1)
            setHoveredIndex(null)
          }}
          className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition-colors duration-300 ${
            selectedTab === "nowPlaying"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Now Playing
        </button>
        <button
          onClick={() => {
            setSelectedTab("upcoming")
            setCurrentPage(1)
            setHoveredIndex(null)
          }}
          className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition-colors duration-300 ${
            selectedTab === "upcoming"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Upcoming
        </button>
      </div>

      <div
        ref={moviesContainerRef}
        className="relative w-full max-w-[54rem] mx-auto flex justify-center items-center"
      >
        <div className="absolute top-[-20px] right-0 z-10">
          <a href="#" className="text-white text-sm font-light hover:underline">
            See more
          </a>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedTab}-${currentPage}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
          >
            {currentMovies.length > 0 ? (
              currentMovies.map((movie, index) => (
                <motion.div
                  key={index}
                  variants={movieVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative rounded-lg overflow-hidden shadow-lg w-[200px] max-w-[200px] min-w-[200px] mx-auto"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
                        src={movie.poster}
                        alt={movie.title}
                        sizes=""
                        layout="fill"
                        objectFit="cover"
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
                        className="absolute bottom-0 left-0 right-0 top-0 p-2 bg-gray-800 bg-opacity-50 text-white flex flex-col justify-center items-center"
                      >
                        <motion.h3
                          variants={childVariants}
                          className="text-sm font-semibold text-center mb-1"
                        >
                          {movie.title}
                        </motion.h3>
                        <motion.p
                          variants={childVariants}
                          className="text-xs mb-1"
                        >
                          Directed by {movie.director}
                        </motion.p>
                        <motion.div
                          variants={childVariants}
                          className="flex items-center mb-1 gap-1"
                        >
                          {renderStars(movie.rating)}
                          <span className="text-xs">
                            {movie.rating.toFixed(1)}/10
                          </span>
                        </motion.div>
                        <motion.div
                          variants={childVariants}
                          className="flex flex-wrap gap-1 mb-1 justify-center"
                        >
                          {movie.genre.split(", ").map((genre, idx) => (
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
                          className="text-xs mb-2 text-center"
                        >
                          {getShortDescription(movie.description)}
                        </motion.p>
                        <motion.button
                          variants={childVariants}
                          onClick={() => handleViewDetails(movie)}
                          className="w-full max-w-[150px] py-1 text-sm font-semibold text-white bg-[#4599e3] rounded-lg hover:bg-[#357abd] transition-colors duration-300"
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
                No movies available in this category.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ${
              currentPage === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#4599e3] hover:bg-[#357abd]"
            }`}
          >
            Previous
          </button>
          <span className="text-white self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ${
              currentPage === totalPages
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#4599e3] hover:bg-[#357abd]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Movies
