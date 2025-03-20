// components/Movies.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Slide {
  image: string
  title: string
  description: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
  ageRating: string
  starring: string
}

interface MoviesProps {
  slides: Slide[]
}

const Movies = ({ slides }: MoviesProps) => {
  const [selectedTab, setSelectedTab] = useState<"nowShowing" | "upcoming">(
    "nowShowing"
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const currentYear = 2025
  const nowShowingMovies = slides.filter(
    (slide) => slide.releaseYear <= currentYear
  )
  const upcomingMovies = slides.filter(
    (slide) => slide.releaseYear > currentYear
  )

  const displayedMovies =
    selectedTab === "nowShowing" ? nowShowingMovies : upcomingMovies

  const moviesPerPage = 8
  const totalPages = Math.ceil(displayedMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = displayedMovies.slice(startIndex, endIndex)

  // Variants cho animation chuyển tab
  const movieVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // Variants cho animation overlay khi hover
  const overlayVariants = {
    hidden: {
      opacity: 0,
      y: "100%",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  }

  // Variants cho các phần tử con trong overlay
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // Variants cho hiệu ứng scale khi hover
  const scaleVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
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
    console.log(`View details for: ${movie.title}`)
  }

  return (
    <div className="container mx-auto px-44 py-8 pt-44">
      {" "}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            setSelectedTab("nowShowing")
            setCurrentPage(1)
            setHoveredIndex(null)
          }}
          className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition-colors duration-300 ${
            selectedTab === "nowShowing"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Now Showing
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
      {/* Danh sách phim với animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedTab}-${currentPage}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {currentMovies.length > 0 ? (
            currentMovies.map((movie, index) => (
              <motion.div
                key={index}
                variants={movieVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative rounded-lg overflow-hidden shadow-lg w-[200px] h-[300px] mx-auto"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Poster phim */}
                <motion.div
                  variants={scaleVariants}
                  initial="initial"
                  whileHover="hover"
                  className="relative w-full h-full"
                >
                  <motion.div
                    animate={{
                      filter:
                        hoveredIndex !== null && hoveredIndex !== index
                          ? "grayscale(100%) brightness(50%)"
                          : "grayscale(0%) brightness(100%)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      layout="fill"
                      objectFit="contain"
                    />
                  </motion.div>

                  {/* Overlay thông tin phim, hiển thị khi hover */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
                      >
                        {/* Textbox thông tin phim */}
                        <motion.div className="bg-gray-800 bg-opacity-90 rounded-lg p-4 w-full max-w-[90%] border border-gray-600">
                          <motion.h3
                            variants={textVariants}
                            className="text-lg font-semibold mb-2 text-white"
                          >
                            {movie.title}
                          </motion.h3>
                          <motion.p
                            variants={textVariants}
                            className="text-xs text-gray-300 mb-1"
                          >
                            <span className="font-semibold">Genre:</span>{" "}
                            {movie.genre}
                          </motion.p>
                          <motion.p
                            variants={textVariants}
                            className="text-xs text-gray-300 mb-1"
                          >
                            <span className="font-semibold">Release Year:</span>{" "}
                            {movie.releaseYear}
                          </motion.p>
                          <motion.p
                            variants={textVariants}
                            className="text-xs text-gray-300 mb-3"
                          >
                            <span className="font-semibold">Age Rating:</span>{" "}
                            {movie.ageRating}
                          </motion.p>
                          {/* Nút View Details */}
                          <motion.button
                            variants={textVariants}
                            onClick={() => handleViewDetails(movie)}
                            className="w-full py-1 text-sm font-semibold text-white bg-[#4599e3] rounded-lg hover:bg-[#357abd] transition-colors duration-300"
                          >
                            View Details
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
      {/* Nút phân trang */}
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
